# Penny: Comprehensive Development & Architecture Log

Welcome to the Penny Development Log. This document serves as the absolute source of truth for every architectural decision, command, library choice, custom heuristic, and React pattern used in the construction of Penny. This log is specifically engineered to provide deep technical insight into the codebase.

---

## Table of Contents
1. [Project Initialization & Scaffolding](#1-project-initialization--scaffolding)
2. [TypeScript Strict Mode Configuration](#2-typescript-strict-mode-configuration)
3. [The Brutalist Design System & Tailwind v4](#3-the-brutalist-design-system--tailwind-v4)
4. [Database Schema: PostgreSQL & Supabase](#4-database-schema-postgresql--supabase)
5. [Authentication State Machine](#5-authentication-state-machine)
6. [Next.js Middleware & Edge Runtime](#6-nextjs-middleware--edge-runtime)
7. [RSC (React Server Components) vs Client Boundaries](#7-rsc-react-server-components-vs-client-boundaries)
8. [Dashboard Component Architecture](#8-dashboard-component-architecture)
9. [MagicParser: Generative AI + Heuristic Fallback](#9-magicparser-generative-ai--heuristic-fallback)
10. [Data Visualization with Recharts](#10-data-visualization-with-recharts)
11. [Dynamic Budget Allocation Engine](#11-dynamic-budget-allocation-engine)
12. [State Synchronization & Local Storage](#12-state-synchronization--local-storage)
13. [Deployment & Environment Management](#13-deployment--environment-management)

---

## 1. Project Initialization & Scaffolding

### CLI Commands Executed
To guarantee a clean slate without legacy cruft, the project was bootstrapped using the bleeding-edge Next.js 15 template.

```bash
# Initialize the core Next.js application
npx -y create-next-app@latest penny \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm \
  --disable-git

# Enter the working directory
cd penny

# Install core dependencies for backend connectivity and UI rendering
npm install @supabase/supabase-js @supabase/ssr lucide-react recharts clsx tailwind-merge
```

### Dependency Rationale
- **`@supabase/ssr`**: Unlike the standard Supabase client, the SSR package allows for cookie-based session management across Server Components, Route Handlers, and Middleware. This prevents hydration mismatches and ensures secure HTTP-only cookie transport.
- **`lucide-react`**: Selected over FontAwesome or HeroIcons for its strict tree-shaking capabilities. Only imported SVG paths are bundled, resulting in a zero-CSS overhead.
- **`recharts`**: The industry standard for React data visualization. Built on D3 primitives but exposes declarative components (`<PieChart>`, `<Cell>`).
- **`tailwind-merge` & `clsx`**: Essential utilities for dynamic component styling. `tailwind-merge` resolves conflicting classes (e.g., merging `p-4` and `p-8` into `p-8` instead of letting the CSS cascade unpredictably).

---

## 2. TypeScript Strict Mode Configuration

The `tsconfig.json` was tuned for maximum safety and modern compilation targets. Next.js relies on SWC (Speedy Web Compiler) for the actual `.js` emission, so `tsc` is used strictly as a static analyzer.

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Why `isolatedModules: true`?
Because SWC compiles each file independently (without analyzing the entire project graph), TypeScript must be restricted from using features that require cross-file knowledge (like `const enum` or ambient namespaces). This flag enforces that constraint during development.

---

## 3. The Brutalist Design System & Tailwind v4

Penny abandons the generic "SaaS aesthetic" (soft shadows, rounded corners, low contrast) in favor of **High-Density Brutalism**.

### Principles
1. **Zero Border Radius**: Every container, button, and input is a perfect rectangle (`rounded-none`).
2. **High Contrast Borders**: Hard `#030213` borders map out the grid geometry.
3. **Monospace Typography**: System parameters and meta-data use fixed-width fonts for an engineering aesthetic.
4. **Solid Shadows**: Instead of Gaussian blurs, we use solid, unblurred drop shadows: `shadow-[4px_4px_0px_0px_#030213]`.

### `globals.css` Implementation
Tailwind CSS v4 introduces the `@theme` directive, replacing `tailwind.config.js`.

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter);
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

@theme inline {
  /* Mapping variables to Tailwind utilities */
}

html, body {
  background-color: #f5f5f2;
  color: #030213;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom Scrollbar for a premium feel */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #030213;
  border-radius: 99px;
}
```

The background `#f5f5f2` provides an off-white, paper-like texture, contrasting sharply with the `#030213` deep-ink black.

---

## 4. Database Schema: PostgreSQL & Supabase

The backend relies on Supabase, exposing a PostgreSQL database via PostgREST.

### The `transactions` Table
This is the core ledger. It utilizes Row Level Security (RLS) to ensure users can only query their own data.

```sql
CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    description text NOT NULL,
    amount numeric NOT NULL CHECK (amount >= 0),
    date date NOT NULL DEFAULT CURRENT_DATE,
    category text NOT NULL,
    type text NOT NULL CHECK (type IN ('income', 'expense')),
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view own transactions"
ON public.transactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
ON public.transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
ON public.transactions FOR DELETE
USING (auth.uid() = user_id);
```

### Performance Indexing
An index on `user_id` and `date` ensures lightning-fast queries when rendering the dashboard:
```sql
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, date DESC);
```

---

## 5. Authentication State Machine

Penny handles authentication via Supabase Auth. The flow supports both Magic Links, Email/Password, and Google OAuth 2.0.

### Server Actions for Auth (`src/app/login/actions.ts`)
Next.js Server Actions process the form submissions entirely on the backend, removing the need for a separate API layer.

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Purge the router cache to ensure the user sees fresh data
  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}
```

### The Client Setup (`DashboardClient.tsx`)
Inside the client components, we initialize the browser client. The client automatically picks up the HTTP-only cookie set by the server action.

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## 6. Next.js Middleware & Edge Runtime

Middleware intercepts every request at the edge (before hitting a Node.js server) to enforce route protection.

```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /dashboard and all other internal routes
  if (
    !user &&
    request.nextUrl.pathname !== '/' &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/register') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

This prevents Unauthenticated Users from ever seeing the Dashboard layout, sending a 307 Redirect immediately.

---

## 7. RSC (React Server Components) vs Client Boundaries

Penny leverages the RSC architecture strictly to maximize performance and security.

### Server Boundary: `src/app/dashboard/page.tsx`
This file is rendered purely on the server.
1. It reads the JWT securely.
2. It executes the SQL query against Supabase.
3. It passes the raw JSON data down to the client.

```typescript
// NO 'use client' directive here
import { createClient } from '@/utils/supabase/server'
import DashboardClient from '../DashboardClient'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })

  return (
    <DashboardClient 
      initialTransactions={transactions || []} 
      userEmail={user.email!}
      userName={user.user_metadata?.full_name || ''}
      userId={user.id}
    />
  )
}
```

---

## 8. Dashboard Component Architecture

The primary orchestration happens in `DashboardClient.tsx`.

### State Management
Instead of using complex URL routing for sub-pages, we utilize a local state-machine `activeTab`. This enables instantaneous transitions without network latency.

```typescript
const [activeTab, setActiveTab] = useState('dashboard')
const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
const [profileName, setProfileName] = useState(userName)
const [budgets, setBudgets] = useState<Record<string, number>>(defaultBudgets)
```

### Mutating Data
When modifying the ledger, optimistic-like updates are used. We await the database insertion, then update local state immediately rather than triggering a full re-fetch.

```typescript
const handleAddTransaction = async (newTx: Omit<Transaction, 'id' | 'date'>) => {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('transactions')
    .insert([{ user_id: userId, ...newTx, date: today }])
    .select();
    
  if (!error && data) {
    // Prepend to the UI state immediately
    setTransactions(prev => [data[0] as Transaction, ...prev]);
  }
};
```

---

## 9. MagicParser: Generative AI + Heuristic Fallback

The MagicParser is Penny's USP. It extracts financial data from raw SMS copy using Google's Gemini 1.5 Flash.

### The Two-Step NLP Pipeline
1. **Extraction Request**: The raw string is POSTed to `/api/parse-statement`.
2. **Review & Commit**: The client renders an editable table of the parsed data. The user can adjust categories or amounts before executing the batch save.

### `route.ts` Logic
```typescript
const prompt = `You are a highly intelligent financial data extraction assistant...
Extract EVERY single financial transaction. Return ONLY a raw JSON array.
[{"description":"Swiggy","amount":450,"type":"expense","date":"2025-07-15","category":"Food & Dining"}]`;

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
  {
    method: 'POST',
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
    })
  }
);
```

### The Heuristic Fallback
If the API key is missing or the network fails, the system cascades to an ultra-fast local Regex parser:

```typescript
// 1. Extract the numeric amount (e.g., Rs. 500.50)
const amountMatch = line.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i);

// 2. Extract the merchant name
const descMatch = line.match(/(?:at|to|@|merchant|payee|by)\s+([A-Z][A-Za-z0-9\s&_\-\.]{1,35}?)(?:\s+on|\s+ref|\s+utr|\s+txn|$)/i);

// 3. Indian Context Categorization
if (/swiggy|zomato|food|restaurant|mcdonalds/i.test(line)) category = 'Food & Dining';
else if (/uber|ola|rapido|petrol|fuel/i.test(line)) category = 'Transportation';
```

---

## 10. Data Visualization with Recharts

The `ExpenseChart.tsx` component translates the transaction ledger into a brutalist Donut Chart.

```tsx
<ResponsiveContainer width="100%" height="100%">
  <PieChart>
    <Pie
      data={chartData}
      cx="50%"
      cy="50%"
      innerRadius={64}
      outerRadius={82}
      paddingAngle={3}
      dataKey="value"
      stroke="none"
      cornerRadius={3}
    >
      {chartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip content={<CustomTooltip />} />
  </PieChart>
</ResponsiveContainer>
```

**Key visual decisions**:
- `paddingAngle={3}` adds a hard slice between segments.
- Center typography is overlaid using absolute CSS positioning rather than SVG `<text>` nodes, allowing for HTML formatting.

---

## 11. Dynamic Budget Allocation Engine

Budgets are no longer static. They respond reactively to user input in the `DashboardClient.tsx` settings panel.

### State Drilling
The `DashboardClient` manages the `budgets` state and passes it down through `Dashboard` to the `BudgetProgress` component.

```tsx
// In DashboardClient.tsx
<Dashboard budgetsRecord={budgets} />

// In BudgetProgress.tsx
const activeLimits = budgetsRecord || DEFAULT_BUDGETS;
const budgets = Object.entries(activeLimits).map(([category, limit]) => {
  const spent = catTotals[category] || 0;
  const percent = Math.min((spent / limit) * 100, 100);
  const isOver = spent > limit;
  // ...
});
```

### The Progress Meter
The meter uses inline styles for precise `%` rendering and Tailwind colors for conditional formatting.

```tsx
<div className="h-5 w-full bg-transparent border border-[#030213] overflow-hidden relative flex items-center">
  <div
    className="h-full border-r border-[#030213] transition-all duration-500"
    style={{
      width: `${percent}%`,
      backgroundColor: isOver ? '#d4183d' : percent > 80 ? '#f59e0b' : '#10b981',
    }}
  />
</div>
```

---

## 12. State Synchronization & Local Storage

To ensure budget limits persist without hitting the Supabase backend on every keystroke, a `localStorage` sync mechanism was implemented.

### Read on Mount
```typescript
useEffect(() => {
  const saved = localStorage.getItem(`penny_budgets_${userId}`)
  if (saved) {
    try { setBudgets(JSON.parse(saved)) } catch (e) {}
  }
}, [userId])
```

### Write on Save
The inputs update React state immediately for visual feedback, but the persistent write requires explicit action to prevent IO thrashing.

```typescript
const handleSaveBudgets = () => {
  localStorage.setItem(`penny_budgets_${userId}`, JSON.stringify(budgets))
  alert('Budget limits saved successfully.')
}
```

### Profile Metadata Sync
When updating the user's name, we write directly to the Supabase `raw_user_meta_data` field.

```typescript
const handleUpdateProfile = async () => {
  setIsSavingProfile(true)
  await supabase.auth.updateUser({ data: { full_name: profileName } })
  setIsSavingProfile(false)
}
```
This updates the JWT session seamlessly. Because `profileName` is mapped to the header UI `{profileName || userEmail.split('@')[0]}`, the visual change is instantaneous without requiring a browser reload.

---

## 13. Deployment & Environment Management

### Required Environment Variables
For the system to function in production, the following keys must be supplied to the Node edge environment:

```env
# Standard Supabase Integration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Generative AI Processing
GEMINI_API_KEY=your-google-ai-studio-key

# OAuth Redirect Validation
NEXT_PUBLIC_SITE_URL=https://penny-ledger.vercel.app
```

### Edge Caching Warnings
When deploying to Vercel, `revalidatePath('/dashboard')` is critical during authentication and mutation events to clear the edge cache. Failing to invoke this function results in stale-while-revalidate states displaying incorrect ledger balances to the user.

---

**END OF LOG**
*(System compiled on 2026-05-25. Brutalist UI Core v1.0. All checks passing.)*