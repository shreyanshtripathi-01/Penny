import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.warn('GEMINI_API_KEY is not set. Using mock parser.');
      // Mock response for development if no key is present
      return NextResponse.json({ transactions: mockParse(text) });
    }

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a financial data extraction AI. The user will provide a raw text block pasted from a bank statement. 
            Extract all transactions. For each transaction, identify:
            1. description (string)
            2. amount (number, positive for income, positive for expense, no currency symbols)
            3. date (ISO string YYYY-MM-DD if possible)
            4. type ('expense' or 'income')
            5. category (choose ONE: 'Groceries', 'Entertainment', 'Transportation', 'Housing', 'Utilities', 'Food & Dining', 'Shopping', 'Healthcare', 'Income', 'Miscellaneous')
            
            Return ONLY a valid JSON array of objects with these exact keys. Do not include markdown code blocks or any other text.\n\nRaw Text:\n${text}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '[]';
    
    // Clean up potential markdown formatting from LLM response
    if (content.startsWith('```json')) {
      content = content.replace(/```json/g, '').replace(/```/g, '').trim();
    } else if (content.startsWith('```')) {
      content = content.replace(/```/g, '').trim();
    }

    try {
      const transactions = JSON.parse(content);
      return NextResponse.json({ transactions });
    } catch (parseError) {
      console.error('Failed to parse LLM JSON:', content);
      return NextResponse.json({ error: 'LLM returned invalid JSON' }, { status: 500 });
    }

  } catch (error) {
    console.error('AI Parsing Error:', error);
    return NextResponse.json({ error: 'Failed to parse statement' }, { status: 500 });
  }
}

// Simple mock function just in case keys are missing during demo
function mockParse(text: string) {
  return [
    { description: 'MOCK UBER TRIP', amount: 24.50, date: new Date().toISOString(), category: 'Transportation', type: 'expense' },
    { description: 'MOCK WHOLE FOODS', amount: 112.40, date: new Date().toISOString(), category: 'Groceries', type: 'expense' }
  ];
}
