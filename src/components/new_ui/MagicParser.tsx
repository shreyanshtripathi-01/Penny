import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Transaction } from "./types";

interface MagicParserProps {
  onSaveParsedTransactions?: (transactions: Transaction[]) => Promise<void>;
}

export function MagicParser({ onSaveParsedTransactions }: MagicParserProps) {
  const [text, setText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!text.trim()) return;
    setIsParsing(true);
    setError(null);

    try {
      const res = await fetch('/api/parse-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      
      if (!res.ok || data.error) throw new Error(data.error || "Failed to parse");

      if (data.transactions && Array.isArray(data.transactions) && onSaveParsedTransactions) {
        const normalized = data.transactions.map((tx: any, i: number) => ({
          id: `parsed-${Date.now()}-${i}`,
          description: String(tx.description ?? 'Transaction').substring(0, 60),
          amount: Math.abs(Number(tx.amount ?? 0)),
          date: tx.date ?? new Date().toISOString().split('T')[0],
          category: tx.category ?? 'Miscellaneous',
          type: tx.type === 'income' ? 'income' : 'expense',
        }));
        await onSaveParsedTransactions(normalized);
        setText(""); // clear on success
      }
    } catch (e: any) {
      setError(e.message || "Failed to parse");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <h3 className="text-[15px] text-white" style={{ fontWeight: 600 }}>
          Magic parser
        </h3>
      </div>
      <p className="text-[12px] text-slate-400 mb-5 leading-relaxed">
        Paste any bank SMS, email alert, or statement. We'll automatically extract the amount, merchant, and category.
      </p>

      <div className="flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Spent Rs. 450 at Swiggy on 15 May"
          className="w-full bg-white/10 border border-white/10 rounded-xl p-3.5 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/15 transition-all resize-none"
          rows={3}
          style={{ fontFamily: "inherit" }}
        />
        {error && <p className="text-rose-400 text-[11px]">{error}</p>}
        <button
          onClick={handleParse}
          disabled={isParsing || !text.trim()}
          className="w-full py-2.5 rounded-xl text-[13px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontWeight: 600,
            backgroundColor: "white",
            color: "#111827",
            fontFamily: "inherit",
          }}
        >
          {isParsing ? "Extracting..." : "Extract automatically"}
        </button>
      </div>
    </div>
  );
}
