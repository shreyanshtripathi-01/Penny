import { NextResponse } from 'next/server';

// Basic In-Memory Rate Limiter Map
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check (20 requests per minute per IP)
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const rateLimitInfo = rateLimitMap.get(ip);
    
    if (rateLimitInfo) {
      if (now > rateLimitInfo.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
      } else {
        if (rateLimitInfo.count >= 20) {
          return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
        }
        rateLimitInfo.count += 1;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    }

    // 2. Parse payload
    const { text, inlineData } = await request.json();

    if (!text?.trim() && !inlineData) {
      return NextResponse.json({ error: 'Text or File is required' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json({ transactions: heuristicParse(text || '') });
    }

    const prompt = `You are a highly intelligent financial data extraction assistant specialized in the Indian context.
The user is providing either a raw bank SMS, natural conversational language, OR an uploaded file (like a PDF bank statement, CSV, or receipt).

Your task: extract EVERY single financial transaction you can find. For each transaction return:
- description: merchant, payee name, or brief description (clean, human-readable, max 40 chars. e.g. "Swiggy", "Electricity Bill", "Salary")
- amount: numeric only (no ₹, Rs, INR symbol), always positive
- type: "expense" if it's spending, debit, transfer out, or payment. "income" if it's salary, credit, received, or adding money.
- date: ISO format YYYY-MM-DD. If not present use today's date ${new Date().toISOString().split('T')[0]}
- category: pick exactly one from ["Food & Dining","Transportation","Shopping","Entertainment","Groceries","Utilities","Housing","Healthcare","Income","Miscellaneous"]

Return ONLY a raw JSON array. No markdown. No explanation. No code blocks. Example format:
[{"description":"Swiggy","amount":450,"type":"expense","date":"2025-07-15","category":"Food & Dining"}]

If no transactions are found, return an empty array: []

Raw text to parse (if any):
${text || 'No text provided. Please parse the attached document.'}`;

    const parts: any[] = [{ text: prompt }];
    if (inlineData) {
      parts.push({ inlineData });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.1 },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini error:', errText);
      // Fall back to heuristic if API fails
      return NextResponse.json({ transactions: heuristicParse(text) });
    }

    const data = await response.json();
    let content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '[]';

    // Strip any accidental markdown formatting
    content = content
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      const transactions = JSON.parse(content);
      if (!Array.isArray(transactions)) throw new Error('Not an array');
      return NextResponse.json({ transactions });
    } catch {
      console.error('Failed to parse Gemini JSON output:', content);
      // Fall back to heuristic
      return NextResponse.json({ transactions: heuristicParse(text) });
    }
  } catch (error) {
    console.error('parse-statement error:', error);
    return NextResponse.json({ error: 'Failed to parse statement' }, { status: 500 });
  }
}

/**
 * Heuristic parser for common Indian bank SMS formats.
 * Used as fallback when Gemini API is unavailable.
 */
function heuristicParse(rawText: string) {
  const today = new Date().toISOString().split('T')[0];
  const lines = rawText.split(/\n|\r/).filter((l) => l.trim().length > 5);
  const results: any[] = [];

  // Amount regex — matches Rs.550, Rs 550, INR 550, ₹550, 550.00
  const amountRx = /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i;
  // Date patterns: 15-05-25, 15/05/2025, 15 May 2025
  const dateRx = /\b(\d{1,2}[-/](?:\d{2}|\w{3})[-/]\d{2,4})\b/i;

  const expenseKeywords = ['debited', 'debit', 'paid', 'spent', 'payment', 'withdrawn', 'purchase', 'pos', 'upi debit'];
  const incomeKeywords  = ['credited', 'credit', 'received', 'salary', 'refund', 'cashback', 'transfer in'];

  const merchantRx = /(?:at|to|@|merchant|payee|by)\s+([A-Z][A-Za-z0-9\s&_\-\.]{1,35}?)(?:\s+on|\s+ref|\s+utr|\s+txn|\s*[,.]|$)/i;

  for (const line of lines) {
    const amountMatch = line.match(amountRx);
    if (!amountMatch) continue;

    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    if (isNaN(amount) || amount <= 0) continue;

    const lowerLine = line.toLowerCase();
    const isIncome  = incomeKeywords.some((k) => lowerLine.includes(k));
    const isExpense = expenseKeywords.some((k) => lowerLine.includes(k));
    const type: 'expense' | 'income' = isIncome && !isExpense ? 'income' : 'expense';

    // Date extraction
    let date = today;
    const dateMatch = line.match(dateRx);
    if (dateMatch) {
      const raw = dateMatch[1];
      const parsed = new Date(raw);
      if (!isNaN(parsed.getTime())) {
        date = parsed.toISOString().split('T')[0];
      }
    }

    // Merchant name extraction
    let description = 'Transaction';
    const merchantMatch = line.match(merchantRx);
    if (merchantMatch) {
      description = merchantMatch[1].trim().replace(/\s+/g, ' ');
    } else {
      // Try to get the most meaningful word block
      const cleaned = line
        .replace(amountRx, '')
        .replace(/\b(?:rs|inr|debited|credited|upi|ref|txn|a\/c|ac|xx\d+|from|your)\b/gi, '')
        .replace(/[^a-zA-Z\s]/g, ' ')
        .trim()
        .replace(/\s+/g, ' ');
      if (cleaned.length > 2) description = cleaned.substring(0, 40);
    }

    // Category inference
    const d = description.toLowerCase() + ' ' + lowerLine;
    let category = 'Miscellaneous';
    if (/swiggy|zomato|food|restaurant|cafe|domino|pizza|biryani|chai/.test(d)) category = 'Food & Dining';
    else if (/uber|ola|rapido|metro|railway|petrol|fuel|irctc|bus|cab/.test(d)) category = 'Transportation';
    else if (/amazon|flipkart|myntra|meesho|shopping|mall|store|market/.test(d)) category = 'Shopping';
    else if (/netflix|prime|hotstar|spotify|jio|movie|theatre|game/.test(d)) category = 'Entertainment';
    else if (/bigbasket|blinkit|zepto|grofer|grocer|vegetable|kirana/.test(d)) category = 'Groceries';
    else if (/electricity|water|gas|internet|wifi|broadband|postpaid|prepaid/.test(d)) category = 'Utilities';
    else if (/rent|pg|hostel|maintenance|society/.test(d)) category = 'Housing';
    else if (/hospital|pharmacy|doctor|medical|apollo|health|medicine/.test(d)) category = 'Healthcare';
    else if (type === 'income' || /salary|payroll|neft credit|refund|cashback/.test(d)) { category = 'Income'; }

    results.push({ description, amount, type, date, category });
  }

  return results;
}
