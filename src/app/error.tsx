'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

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
          [ CRITICAL.FAILURE: 500 ]
        </span>
        
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#030213] mb-6 leading-tight">
          SYSTEM FAULT
        </h1>
        
        <p className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-2 max-w-lg mx-auto border-l-2 border-[#d4183d] pl-4 text-left">
          {error.message || 'An unexpected runtime anomaly occurred.'}
        </p>

        <p className="font-mono text-[10px] uppercase tracking-wider text-gray-400 mb-10 max-w-lg mx-auto text-left pl-4">
          DIGEST: {error.digest || 'N/A'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-4 bg-[#030213] text-[#f5f5f2] text-sm font-bold uppercase tracking-widest border border-[#030213] hover:bg-[#10b981] hover:text-[#030213] hover:border-[#10b981] transition-none flex items-center justify-center gap-2"
          >
            ATTEMPT SOFT REBOOT
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-[#030213] text-sm font-bold uppercase tracking-widest border border-[#030213] hover:bg-[#030213] hover:text-[#f5f5f2] transition-none"
          >
            FORCE DISCONNECT
          </button>
        </div>
      </div>
    </div>
  );
}
