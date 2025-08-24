# Penny.

**Personal finance, engineered.**

Penny is a high-density, professional ledger designed to track spending, manage budgets, and intelligently parse statements with absolute minimal friction. Built with modern web technologies, it offers a secure, clutter-free environment to control your financial data.

## Features

- **High-Density Ledger:** A fast, streamlined interface to view, filter, and manage your financial transactions.
- **Budget Tracking:** Visual progress bars to monitor category-specific spending limits in real-time.
- **Conversational Statement Parsing:** Powered by Google's Gemini, Penny understands natural language input (e.g., "Spent 400 on lunch") and automatically extracts the merchant, amount, type, and date.
- **Dynamic Dashboards:** Real-time balance calculations and expense donut charts to visualize cash flow.
- **Secure Authentication:** Integrated Email/Password and Google OAuth handling backed by Supabase.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **AI Processing:** [Google Gemini API](https://ai.google.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shreyanshtripathi-01/Penny.git
   cd Penny
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase and Gemini credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## License

© Penny. All rights reserved.
