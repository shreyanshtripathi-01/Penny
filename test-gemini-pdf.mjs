import fs from 'fs';

async function testGeminiPDF() {
  const geminiApiKey = 'AIzaSyAXPuPjCcwj61hZR_TM8oK-4u0bGqGovDc';
  
  const pdfBase64 = fs.readFileSync('sample_bank_statement.pdf').toString('base64');
  
  const prompt = `You are a highly intelligent financial data extraction assistant specialized in the Indian context.
The user is providing either a raw bank SMS, natural conversational language, OR an uploaded file (like a PDF bank statement, CSV, or receipt).

Your task: extract EVERY single financial transaction you can find. For each transaction return:
- description: merchant, payee name, or brief description (clean, human-readable, max 40 chars. e.g. "Swiggy", "Electricity Bill", "Salary")
- amount: numeric only (no ₹, Rs, INR symbol), always positive
- type: "expense" if it's spending, debit, transfer out, or payment. "income" if it's salary, credit, received, or adding money.
- date: ISO format YYYY-MM-DD. If not present use today's date 2026-05-25
- category: pick exactly one from ["Food & Dining","Transportation","Shopping","Entertainment","Groceries","Utilities","Housing","Healthcare","Income","Miscellaneous"]

Return ONLY a raw JSON array. No markdown. No explanation. No code blocks. Example format:
[{"description":"Swiggy","amount":450,"type":"expense","date":"2025-07-15","category":"Food & Dining"}]

If no transactions are found, return an empty array: []

Raw text to parse (if any):
No text provided. Please parse the attached document.`;

  const parts = [
    { text: prompt },
    { inlineData: { mimeType: 'application/pdf', data: pdfBase64 } }
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
      }),
    }
  );

  const data = await response.text();
  console.log(data);
}

testGeminiPDF();
