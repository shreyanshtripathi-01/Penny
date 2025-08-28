import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 
        NO AI GRADIENTS. NO GLOWING ORBS. NO BENTO BOXES.
        Pure, brutalist, editorial minimalism. 
      */}

      {/* Header */}
      <header className="px-6 lg:px-12 py-8 flex items-center justify-between max-w-7xl mx-auto w-full border-b-2 border-black">
        <span className="text-2xl font-black tracking-tighter uppercase">
          Penny.
        </span>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-[15px] font-bold hover:underline decoration-2 underline-offset-4">
            Log in
          </Link>
          <Link href="/register" className="text-[15px] font-bold bg-black text-white px-6 py-2.5 rounded-none hover:bg-emerald-500 hover:text-black transition-none border-2 border-transparent hover:border-black">
            Sign up
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 pt-24 pb-32 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left: Aggressive, High-Contrast Typography */}
        <div className="flex-1">
          <h1 className="text-[72px] lg:text-[110px] tracking-tighter leading-[0.9] font-black mb-10 uppercase">
            Your <br/>
            Money. <br/>
            No <br/>
            Bullshit.
          </h1>
          <p className="text-[20px] lg:text-[24px] font-medium leading-[1.5] max-w-lg mb-12">
            No gamification. No ads. No bloated dashboards. Just a high-density, lightning-fast ledger that extracts data from your SMS and gets out of your way.
          </p>
          <Link 
            href="/register" 
            className="inline-block bg-black text-white px-10 py-5 text-[18px] font-bold uppercase tracking-wide hover:bg-emerald-500 hover:text-black border-2 border-transparent hover:border-black transition-none"
          >
            Create Your Ledger
          </Link>
        </div>

        {/* Right: The Raw Ledger (Anti-AI Mockup) */}
        {/* Instead of a fake glassmorphic card, we show a raw, brutalist data table. This is what humans build when they care about data, not aesthetics. */}
        <div className="flex-1 pt-4 lg:pt-0">
          <div className="border-2 border-black p-1 bg-white">
            <div className="bg-black text-white px-4 py-3 font-bold uppercase tracking-widest text-sm flex justify-between">
              <span>Ledger_Status</span>
              <span className="text-emerald-400">SYNCED</span>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-sm uppercase tracking-wider">
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Merchant</th>
                  <th className="p-4 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="font-mono text-sm">
                <tr className="border-b border-black/20 hover:bg-emerald-50">
                  <td className="p-4">12 Oct</td>
                  <td className="p-4 font-bold">Swiggy Instamart</td>
                  <td className="p-4 text-right text-red-600">-₹842.00</td>
                </tr>
                <tr className="border-b border-black/20 hover:bg-emerald-50">
                  <td className="p-4">11 Oct</td>
                  <td className="p-4 font-bold">Uber India</td>
                  <td className="p-4 text-right text-red-600">-₹450.00</td>
                </tr>
                <tr className="border-b border-black/20 hover:bg-emerald-50">
                  <td className="p-4">10 Oct</td>
                  <td className="p-4 font-bold">Netflix Subscription</td>
                  <td className="p-4 text-right text-red-600">-₹199.00</td>
                </tr>
                <tr className="hover:bg-emerald-50">
                  <td className="p-4">09 Oct</td>
                  <td className="p-4 font-bold">Salary</td>
                  <td className="p-4 text-right text-emerald-600 font-bold">+₹1,45,000.00</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 border-l-4 border-black pl-6">
            <h3 className="text-2xl font-black uppercase mb-2">How it works</h3>
            <p className="text-lg font-medium">1. You paste your bank SMS.<br/>2. Our deterministic regex engine extracts the data.<br/>3. It goes into your ledger. That's it.</p>
          </div>
        </div>
        
      </main>
    </div>
  );
}
