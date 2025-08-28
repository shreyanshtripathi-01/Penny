import Link from 'next/link';
import { ArrowRight, Wallet, TrendingUp, Search } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#f7f7f5] text-[#030213] flex flex-col font-sans overflow-hidden selection:bg-[#030213] selection:text-[#f7f7f5]">
      
      {/* 
        HUMAN CRAFTED DETAIL #1: Texture & Depth
        Instead of a flat background, we use an SVG noise filter + a faint grid.
        This provides a tactile, "paper-like" physical feel.
      */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-[0.07] blur-[100px]"></div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8 md:px-12 flex items-center justify-between">
        <span className="text-2xl tracking-tighter font-extrabold text-[#030213]">
          penny<span className="text-emerald-500">.</span>
        </span>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-[14px] font-medium text-[#717182] hover:text-[#030213] transition-colors duration-200">
            Log in
          </Link>
          {/* Tactile Button: Inset shadow gives a physical depth feeling */}
          <Link href="/register" className="text-[14px] font-medium bg-[#030213] text-[#f7f7f5] px-5 py-2.5 rounded-full hover:bg-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all duration-200">
            Sign up
          </Link>
        </div>
      </header>

      {/* Asymmetrical Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 max-w-7xl mx-auto w-full pt-12 lg:pt-0 pb-32 gap-16">
        
        {/* Left Column: Aggressive Typography */}
        <div className="flex-1 flex flex-col items-start text-left max-w-xl">
          <h1 className="text-[56px] lg:text-[76px] tracking-tighter leading-[1.02] font-extrabold text-[#030213] mb-6">
            Finance, <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">engineered.</span>
          </h1>
          
          <p className="text-[18px] text-[#717182] mb-10 leading-relaxed font-medium">
            Stop feeding your data to bloated trackers. Penny is a high-density, zero-clutter ledger designed for speed and absolute control.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link 
              href="/register" 
              className="group flex items-center justify-center gap-3 w-full sm:w-auto bg-[#030213] text-[#f7f7f5] px-8 py-4 rounded-full text-[15px] font-semibold hover:bg-black hover:shadow-xl hover:shadow-emerald-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all duration-200"
            >
              Initialize ledger
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* 
          HUMAN CRAFTED DETAIL #2: "Show, Don't Tell" Floating Mockup
          We use CSS 3D transforms (perspective and rotateY) to create physical depth.
          This proves the UI is dense and real without using lazy, flat image assets.
        */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none perspective-[2000px]">
          <div className="relative w-full aspect-square md:aspect-[4/3] transform-gpu rotate-y-[-12deg] rotate-x-[8deg] hover:rotate-y-[-8deg] hover:rotate-x-[4deg] transition-transform duration-700 ease-out">
            
            {/* Main Mockup Container */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-6 overflow-hidden flex flex-col gap-5">
              
              {/* Fake Topbar */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-500">JD</span>
                  </div>
                  <div>
                    <div className="w-24 h-2.5 bg-gray-200 rounded-full mb-1.5"></div>
                    <div className="w-16 h-2 bg-gray-100 rounded-full"></div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Fake Balance Card */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Wallet className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Cash Flow</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 tracking-tight">₹42,500</span>
                  <span className="text-[10px] text-emerald-500 font-medium mt-1">+12.5% vs last month</span>
                </div>

                {/* Fake Budget Progress */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex flex-col justify-center">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-semibold text-gray-700">Food & Dining</span>
                    <span className="text-[10px] font-medium text-gray-400">80%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full w-[80%]"></div>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4 mb-2">
                    <span className="text-xs font-semibold text-gray-700">Shopping</span>
                    <span className="text-[10px] font-medium text-gray-400">45%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-[45%]"></div>
                  </div>
                </div>
              </div>

              {/* Fake Transaction List */}
              <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Recent Ledgers</span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { merchant: 'Apple Store', cat: 'Shopping', amt: '-₹8,400', date: 'Today' },
                    { merchant: 'Swiggy', cat: 'Food & Dining', amt: '-₹450', date: 'Yesterday' },
                    { merchant: 'Salary', cat: 'Income', amt: '+₹85,000', date: 'Oct 1' },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:border-gray-200 transition-colors">
                          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{tx.merchant}</p>
                          <p className="text-[10px] text-gray-400">{tx.cat}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-semibold ${tx.amt.startsWith('+') ? 'text-emerald-500' : 'text-gray-900'}`}>{tx.amt}</p>
                        <p className="text-[10px] text-gray-400">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
