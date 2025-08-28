import Link from 'next/link';
import { ArrowRight, BarChart3, Fingerprint, Zap, Shield, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f2] text-[#030213] flex flex-col font-sans selection:bg-[#030213] selection:text-[#f5f5f2] overflow-x-hidden">
      
      {/* 
        Background Texture: 
        A very faint SVG dot pattern mixed with a subtle radial glow. 
        This kills the "flat AI template" look and gives physical texture to the screen.
      */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%23000000'/%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#10b981]/10 to-transparent blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Header */}
      <header className="px-6 lg:px-12 py-8 flex items-center justify-between relative z-10 max-w-7xl mx-auto w-full">
        <span className="text-2xl tracking-tighter font-extrabold text-[#030213]">
          penny<span className="text-[#10b981]">.</span>
        </span>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-[14px] font-semibold text-[#717182] hover:text-[#030213] transition-colors">
            Log in
          </Link>
          <Link href="/register" className="group relative text-[14px] font-semibold text-[#030213] hover:text-[#10b981] transition-colors flex items-center gap-1">
            Sign up
            <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        
        {/* --- SECTION 1: HERO --- */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-32 lg:pt-32 lg:pb-48 flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Left: Typography */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <h1 className="text-[64px] lg:text-[88px] tracking-[-0.04em] leading-[0.95] font-extrabold text-[#030213] mb-8">
              Finance, <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#030213] to-[#717182]">
                engineered.
              </span>
            </h1>
            <p className="text-[18px] lg:text-[21px] text-[#717182] mb-12 leading-[1.6] font-medium max-w-xl mx-auto lg:mx-0">
              Stop feeding your data to bloated trackers. Penny is a high-density, zero-clutter ledger designed for speed and complete control.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <Link 
                href="/register" 
                className="group relative flex items-center justify-center gap-3 bg-[#030213] text-[#f5f5f2] px-8 py-4 rounded-full text-[15px] font-semibold hover:bg-black transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                Create your ledger
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Right: The Human Mockup */}
          {/* We build a complex DOM structure that explicitly breaks the grid to look organic and hand-crafted */}
          <div className="flex-1 w-full relative h-[500px] lg:h-[600px] perspective-1000 hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-white/80 rounded-[40px] transform rotate-[-2deg] scale-105 opacity-50 blur-xl" />
            
            {/* Main Dashboard Card */}
            <div className="absolute inset-y-10 right-0 left-10 lg:left-20 bg-white/70 backdrop-blur-xl border border-white/40 rounded-[32px] shadow-[0_24px_80px_rgba(0,0,0,0.07)] overflow-hidden flex flex-col transform transition-transform duration-700 hover:rotate-y-[-5deg] hover:rotate-x-[2deg]">
              {/* Fake Topbar */}
              <div className="h-14 border-b border-gray-100 flex items-center px-6 gap-4">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div className="ml-auto w-32 h-6 bg-gray-50 rounded-md" />
              </div>
              
              {/* Fake Content Area */}
              <div className="flex-1 p-8 flex flex-col gap-6">
                <div className="flex gap-6">
                  {/* Fake Donut Chart */}
                  <div className="w-32 h-32 rounded-full border-[12px] border-gray-50 flex items-center justify-center relative">
                    {/* Simulated chart slices using borders */}
                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-t-[#10b981] border-r-[#10b981] rotate-45" />
                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-b-[#f472b6] rotate-[-15deg]" />
                    <span className="text-xl font-bold text-gray-900">₹42k</span>
                  </div>
                  {/* Fake Legend */}
                  <div className="flex-1 flex flex-col justify-center gap-3">
                    <div className="h-4 w-full bg-gray-50 rounded" />
                    <div className="h-4 w-3/4 bg-gray-50 rounded" />
                    <div className="h-4 w-1/2 bg-gray-50 rounded" />
                  </div>
                </div>
                
                {/* Fake List */}
                <div className="mt-4 space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-24 bg-gray-200 rounded" />
                          <div className="h-2 w-16 bg-gray-100 rounded" />
                        </div>
                      </div>
                      <div className="h-3 w-12 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid-Breaking Receipt Element */}
            {/* This floats *outside* the main card, a hallmark of human, editorial web design */}
            <div className="absolute bottom-20 -left-10 lg:-left-0 bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.12)] w-64 transform -rotate-3 transition-transform duration-500 hover:rotate-0 hover:-translate-y-2 z-20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-gray-900">Swiggy Instamart</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expense</span>
                <span className="text-lg font-bold text-gray-900">₹842.00</span>
              </div>
            </div>

          </div>
        </section>

        {/* --- SECTION 2: THE ENGINE ROOM --- */}
        {/* Dark mode section proving the technical depth. No buzzwords, just data. */}
        <section className="bg-[#030213] text-[#f5f5f2] py-32 px-6 lg:px-12 relative overflow-hidden">
          {/* Subtle grid lines in dark mode */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#f5f5f2 1px, transparent 1px), linear-gradient(90deg, #f5f5f2 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 lg:pr-12">
              <h2 className="text-[40px] lg:text-[56px] tracking-[-0.03em] font-bold leading-tight mb-6">
                Raw chaos into <br/> structured data.
              </h2>
              <p className="text-[18px] text-gray-400 font-medium leading-relaxed mb-8">
                Powered by a dual-engine architecture. Penny uses local deterministic heuristics backed by high-speed LLM extraction to turn messy bank SMS notifications into a perfectly categorized ledger. Not magic, just engineering.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Fingerprint, text: "Privacy-first local fallback parsing" },
                  { icon: Zap, text: "Sub-second Gemini 1.5 Flash extraction" },
                  { icon: Shield, text: "Edge-middleware authenticated routing" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 font-medium">
                    <item.icon className="w-5 h-5 text-[#10b981]" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* The Code Window */}
            <div className="flex-1 w-full bg-[#0a0a0a] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden font-mono text-[13px] leading-[1.6]">
              <div className="flex items-center px-4 py-3 border-b border-gray-800 bg-[#050505] gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                <span className="ml-4 text-gray-500 text-xs">parser.ts</span>
              </div>
              <div className="p-6 overflow-x-auto text-gray-300">
                <div className="opacity-50 mb-4">{'// Input: "Spent Rs.842 on Swiggy via UPI..."'}</div>
                <div className="text-[#f472b6]">const</div> <div className="inline text-[#60a5fa]">transaction</div> <div className="inline text-white">=</div> <div className="inline text-[#34d399]">await</div> <div className="inline text-white">parseStatement(sms);</div>
                <br/><br/>
                <div className="text-gray-500">{'/*'} Output {'*/'}</div>
                <div className="text-white">{'{'}</div>
                <div className="pl-4">
                  <div className="text-[#60a5fa]">"amount"</div><div className="inline text-white">: </div><div className="inline text-[#fbbf24]">842.00</div><div className="inline text-white">,</div><br/>
                  <div className="text-[#60a5fa]">"merchant"</div><div className="inline text-white">: </div><div className="inline text-[#34d399]">"Swiggy"</div><div className="inline text-white">,</div><br/>
                  <div className="text-[#60a5fa]">"category"</div><div className="inline text-white">: </div><div className="inline text-[#34d399]">"Food & Dining"</div><div className="inline text-white">,</div><br/>
                  <div className="text-[#60a5fa]">"type"</div><div className="inline text-white">: </div><div className="inline text-[#34d399]">"expense"</div>
                </div>
                <div className="text-white">{'}'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: THE BLUEPRINT GRID --- */}
        {/* Flat, architectural grid. No generic drop shadows. */}
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
          <div className="mb-16">
            <h2 className="text-[32px] lg:text-[48px] tracking-tight font-extrabold text-[#030213] mb-4">
              Built for speed.
            </h2>
            <p className="text-[18px] text-[#717182] font-medium max-w-2xl">
              We stripped away everything you don't need. No gamification, no ads, no constant upselling. Just a perfectly engineered ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(0,0,0,0.05)] border border-[rgba(0,0,0,0.05)] rounded-3xl overflow-hidden">
            {[
              { title: "Dynamic Budgets", desc: "Set hard limits per category. Visual progress bars keep you instantly aware of your burn rate." },
              { title: "Recharts Visualization", desc: "Native SVG rendering for flawless, high-performance data visualizations that never stutter." },
              { title: "Edge Authentication", desc: "Supabase SSR middleware enforces absolute data privacy before a single React component renders." },
              { title: "Zero Layout Shift", desc: "Pre-computed UI skeletons and self-hosted fonts ensure a mathematically perfect load sequence." },
              { title: "Human Typography", desc: "Typeset in Inter. Tightly tracked headers, readable body copy, and intentional white space." },
              { title: "Export Anywhere", desc: "Your data is yours. Export your entire ledger to CSV in a single click whenever you want." },
            ].map((feature, i) => (
              <div key={i} className="bg-[#f5f5f2] p-8 lg:p-12 group hover:bg-white transition-colors duration-500">
                <BarChart3 className="w-6 h-6 text-[#10b981] mb-6 opacity-80" />
                <h3 className="text-[18px] font-bold text-[#030213] mb-3">{feature.title}</h3>
                <p className="text-[14px] text-[#717182] leading-[1.6] font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 4: THE CLOSE --- */}
        <section className="text-center py-32 px-6 border-t border-[rgba(0,0,0,0.05)] bg-white relative overflow-hidden">
          {/* Faint radial glow bottom center */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-[#10b981]/5 to-transparent blur-[80px] pointer-events-none" />
          
          <h2 className="text-[48px] lg:text-[72px] tracking-[-0.04em] font-extrabold text-[#030213] mb-8 relative z-10">
            Take control.
          </h2>
          <Link 
            href="/register" 
            className="inline-flex items-center justify-center bg-[#030213] text-[#f5f5f2] px-10 py-5 rounded-full text-[16px] font-semibold hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 relative z-10"
          >
            Start your ledger
          </Link>
        </section>

      </main>

      <footer className="px-6 lg:px-12 py-8 border-t border-[rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-4 bg-white relative z-10">
        <span className="text-[20px] tracking-tighter font-extrabold text-[#030213]">
          penny.
        </span>
        <p className="text-[13px] text-[#717182] font-semibold tracking-wide uppercase">
          © {new Date().getFullYear()} Penny. Engineered locally.
        </p>
      </footer>
    </div>
  );
}
