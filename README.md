# Penny

A personal expense tracker with AI-powered transaction categorization and bank statement parsing.

Built with Next.js, TypeScript, Tailwind CSS, Recharts, and Supabase.

## Features

- Manual expense entry and tracking
- AI auto-categorization using LLM
- Bank statement text parsing (paste raw text, get structured transactions)
- Spending analytics with pie charts and budget tracking
- Category-wise budget limits with visual progress indicators

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_key
```

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Recharts (Data Visualization)
- OpenRouter / Gemini (AI Categorization)
