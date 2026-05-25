import { NextResponse } from 'next/server';

// Fallback category if AI fails
const FALLBACK_CATEGORY = 'Miscellaneous';

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      console.warn('GEMINI_API_KEY is not set. Using mock categorization.');
      // Mock response for development if no key is present
      return NextResponse.json({ category: mockCategorize(description) });
    }

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an AI financial categorizer. Given a transaction description, you must classify it into EXACTLY ONE of these categories: 
            'Groceries', 'Entertainment', 'Transportation', 'Housing', 'Utilities', 'Food & Dining', 'Shopping', 'Healthcare', 'Income', 'Miscellaneous'.
            Respond with ONLY the exact category name. Do not add any extra text or punctuation.\n\nDescription: ${description}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1, // Low temp for more deterministic output
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    let category = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || FALLBACK_CATEGORY;

    // Validate the category to ensure the LLM didn't hallucinate
    const validCategories = ['Groceries', 'Entertainment', 'Transportation', 'Housing', 'Utilities', 'Food & Dining', 'Shopping', 'Healthcare', 'Income', 'Miscellaneous'];
    if (!validCategories.includes(category)) {
      category = FALLBACK_CATEGORY;
    }

    return NextResponse.json({ category });

  } catch (error) {
    console.error('AI Categorization Error:', error);
    return NextResponse.json({ error: 'Failed to categorize transaction', category: FALLBACK_CATEGORY }, { status: 500 });
  }
}

// Simple heuristic mock function just in case keys are missing during demo
function mockCategorize(desc: string): string {
  const lowerDesc = desc.toLowerCase();
  if (lowerDesc.includes('uber') || lowerDesc.includes('lyft') || lowerDesc.includes('gas')) return 'Transportation';
  if (lowerDesc.includes('whole foods') || lowerDesc.includes('safeway') || lowerDesc.includes('grocery')) return 'Groceries';
  if (lowerDesc.includes('netflix') || lowerDesc.includes('spotify') || lowerDesc.includes('movie')) return 'Entertainment';
  if (lowerDesc.includes('restaurant') || lowerDesc.includes('coffee') || lowerDesc.includes('starbucks')) return 'Food & Dining';
  if (lowerDesc.includes('salary') || lowerDesc.includes('paycheck')) return 'Income';
  return 'Miscellaneous';
}
