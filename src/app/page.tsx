import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#f5f5f2] text-[#030213] font-sans selection:bg-[#030213] selection:text-[#f5f5f2] flex flex-col">
      {/* Texture Layer - subtle SVG grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.04]" 
        style={{ backgroundImage: 'radial-gradient(#030213 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      
      {/* Top Nav - Brutalist Grid */}
      <header className="grid grid-cols-12 border-b border-[#030213] sticky top-0 z-50 bg-[#f5f5f2]">
        <div className="col-span-8 md:col-span-8 p-6 md:p-8 border-r border-[#030213] flex items-center">
          <span className="text-2xl md:text-3xl font-extrabold tracking-tighter text-[#030213]">
            penny<span className="text-[#10b981]">.</span>
          </span>
        </div>
        
        {user ? (
          <div className="col-span-4 md:col-span-4 flex">
            <Link href="/dashboard" className="flex-1 flex items-center justify-center p-6 text-sm font-bold uppercase tracking-widest bg-[#10b981] text-[#030213] hover:bg-[#030213] hover:text-[#f5f5f2] border-l border-[#030213] transition-none">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="col-span-4 md:col-span-4 grid grid-cols-1 md:grid-cols-2">
            <Link href="/login" className="hidden md:flex items-center justify-center p-6 border-l md:border-l-0 border-r border-[#030213] text-sm font-bold uppercase tracking-widest hover:bg-[#030213] hover:text-[#f5f5f2] transition-none">
              Log in
            </Link>
            <Link href="/register" className="flex items-center justify-center p-6 text-sm font-bold uppercase tracking-widest hover:bg-[#030213] hover:text-[#f5f5f2] transition-none">
              Sign up
            </Link>
          </div>
        )}
      </header>

      {/* Main Hero Grid */}
      <main className="grid grid-cols-1 md:grid-cols-12 relative z-10 border-b border-[#030213]">
        {/* Massive Typography Section */}
        <div className="md:col-span-8 border-b md:border-b-0 md:border-r border-[#030213] p-6 md:p-12 flex flex-col justify-center bg-[#f5f5f2]">
          <h1 className="text-[11vw] md:text-[7.5vw] leading-[0.85] font-extrabold tracking-tighter uppercase break-words">
            Absolute<br />Financial<br />Control.
          </h1>
        </div>

        {/* Manifesto Section */}
        <div className="md:col-span-4 flex flex-col justify-between bg-[#f5f5f2]">
          <div className="p-8 md:p-12 space-y-8 flex-1">
            <div className="flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4">
               <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
               <span className="text-xs uppercase font-mono tracking-widest font-bold">Local-First Architecture</span>
            </div>
            
            <p className="text-lg md:text-xl font-medium leading-relaxed">
              Stop feeding your financial data to bloated ad networks. Penny is a high-density, locally-parsed ledger designed for speed and complete ownership.
            </p>
            
            <ul className="font-mono text-sm space-y-4 pt-8">
              <li className="flex justify-between border-b border-[rgba(0,0,0,0.1)] pb-2">
                <span>TELEMETRY</span>
                <span className="font-bold">ZERO</span>
              </li>
              <li className="flex justify-between border-b border-[rgba(0,0,0,0.1)] pb-2">
                <span>ADVERTISEMENTS</span>
                <span className="font-bold">ZERO</span>
              </li>
              <li className="flex justify-between border-b border-[rgba(0,0,0,0.1)] pb-2">
                <span>OWNERSHIP</span>
                <span className="font-bold">100%</span>
              </li>
            </ul>
          </div>
          
          <div className="border-t border-[#030213]">
             {user ? (
               <Link href="/dashboard" className="flex items-center justify-center p-8 text-xl md:text-2xl font-extrabold tracking-tighter uppercase bg-[#030213] text-[#f5f5f2] hover:bg-[#f5f5f2] hover:text-[#030213] transition-none w-full border-t border-[#030213] hover:border-[#030213]">
                  [ Enter Dashboard ]
               </Link>
             ) : (
               <Link href="/register" className="flex items-center justify-center p-8 text-xl md:text-2xl font-extrabold tracking-tighter uppercase bg-[#030213] text-[#f5f5f2] hover:bg-[#f5f5f2] hover:text-[#030213] transition-none w-full border-t border-[#030213] hover:border-[#030213]">
                  [ Initialize ]
               </Link>
             )}
          </div>
        </div>
      </main>

      {/* Extended Section: System Architecture */}
      <section className="relative z-10 bg-[#f5f5f2]">
        <div className="border-b border-[#030213] p-6 md:p-8">
           <h2 className="text-xl font-bold uppercase tracking-widest font-mono">System Architecture</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
           
           {/* Pillar 1 */}
           <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#030213] group hover:bg-[#030213] hover:text-[#f5f5f2] transition-none cursor-default">
              <div className="text-4xl font-extrabold tracking-tighter mb-6 group-hover:text-[#10b981]">01.</div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Edge Parsing</h3>
              <p className="font-medium text-[15px] leading-relaxed opacity-80">
                 Transactions are extracted from raw SMS data using heuristic fallback engines. We do not rely on third-party cloud aggregators to read your bank texts.
              </p>
           </div>

           {/* Pillar 2 */}
           <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#030213] group hover:bg-[#030213] hover:text-[#f5f5f2] transition-none cursor-default">
              <div className="text-4xl font-extrabold tracking-tighter mb-6 group-hover:text-[#10b981]">02.</div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4">High Density</h3>
              <p className="font-medium text-[15px] leading-relaxed opacity-80">
                 The interface is engineered like a Bloomberg terminal. Maximum data density, zero decorative charts, zero wasted whitespace.
              </p>
           </div>

           {/* Pillar 3 */}
           <div className="p-8 md:p-12 group hover:bg-[#030213] hover:text-[#f5f5f2] transition-none cursor-default">
              <div className="text-4xl font-extrabold tracking-tighter mb-6 group-hover:text-[#10b981]">03.</div>
              <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Raw Export</h3>
              <p className="font-medium text-[15px] leading-relaxed opacity-80">
                 Your ledger is yours. Export every transaction, timestamp, and category instantly to CSV. No vendor lock-in. Ever.
              </p>
           </div>

        </div>
      </section>

      {/* Final Footer */}
      <footer className="border-t border-[#030213] relative z-10 bg-[#030213] text-[#f5f5f2]">
         <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="font-mono text-xs opacity-70">
               <Link href="/login" className="hover:underline">Login</Link> &nbsp;|&nbsp; <Link href="/register" className="hover:underline">Register</Link>
            </div>
            <div className="md:text-right font-mono text-xs opacity-70">
               © {new Date().getFullYear()} PENNY SYSTEM.<br />
               ALL RIGHTS RESERVED.
            </div>
         </div>
      </footer>
    </div>
  );
}
