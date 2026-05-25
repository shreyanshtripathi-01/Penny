import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f5f2] text-[#030213] font-sans selection:bg-[#030213] selection:text-[#f5f5f2] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Texture Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #030213 1px, transparent 1px),
            linear-gradient(to bottom, #030213 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem'
        }}
      />

      <div className="relative bg-[#f5f5f2] border border-[#030213] p-8 md:p-12 shadow-[8px_8px_0px_0px_#030213] max-w-2xl w-full text-center">
        <span className="font-mono text-sm uppercase tracking-widest text-[#d4183d] block mb-4 font-bold border border-[#d4183d] inline-block px-3 py-1 bg-[#d4183d]/10">
          [ SYSTEM.ERROR: 404 ]
        </span>
        
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#030213] mb-6">
          PAGE NOT FOUND
        </h1>
        
        <p className="font-mono text-sm uppercase tracking-wider text-gray-500 mb-10 leading-relaxed max-w-lg mx-auto">
          The requested ledger node could not be located. The data stream may have been severed or the URI is malformed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-[#030213] text-[#f5f5f2] text-sm font-bold uppercase tracking-widest border border-[#030213] hover:bg-[#10b981] hover:text-[#030213] hover:border-[#10b981] transition-none flex items-center justify-center gap-2"
          >
            &lt; RETURN TO DASHBOARD
          </Link>
          <Link 
            href="/"
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-[#030213] text-sm font-bold uppercase tracking-widest border border-[#030213] hover:bg-[#030213] hover:text-[#f5f5f2] transition-none"
          >
            SYSTEM REBOOT
          </Link>
        </div>
      </div>
    </div>
  );
}
