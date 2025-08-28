import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f2] text-[#030213] flex flex-col font-sans selection:bg-[#030213] selection:text-[#f5f5f2]">
      {/* Ultra-minimal header */}
      <header className="px-8 py-8 flex items-center justify-between">
        <span className="text-2xl tracking-tighter font-extrabold text-[#030213]">
          penny<span className="text-[#10b981]">.</span>
        </span>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-[14px] font-medium text-[#717182] hover:text-[#030213] transition-colors">
            Log in
          </Link>
          <Link href="/register" className="text-[14px] font-medium bg-[#030213] text-[#f5f5f2] px-5 py-2.5 rounded-full hover:bg-black transition-colors">
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-32">
        <h1 className="text-[52px] md:text-[72px] tracking-tighter leading-[1.05] font-extrabold max-w-4xl text-[#030213] mb-6">
          Finance, engineered.
        </h1>
        
        <p className="text-[18px] md:text-[20px] text-[#717182] max-w-2xl mb-12 leading-relaxed font-medium">
          A high-density, professional ledger to track spending and manage budgets. No clutter, no ads, just your financial data under your control.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/register" 
            className="group flex items-center justify-center gap-2 w-full sm:w-auto bg-[#030213] text-[#f5f5f2] px-8 py-4 rounded-full text-[15px] font-medium hover:bg-black transition-all"
          >
            Create your account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      {/* Subtle footer */}
      <footer className="px-8 py-8 border-t border-[rgba(0,0,0,0.05)] text-center">
        <p className="text-[13px] text-[#717182] font-medium">
          © {new Date().getFullYear()} Penny. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
