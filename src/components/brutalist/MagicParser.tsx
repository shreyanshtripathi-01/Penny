import React, { useState, useRef } from 'react';
import { Transaction } from '@/app/dashboard/page';

interface MagicParserProps {
  onSaveParsedTransactions?: (transactions: Transaction[]) => Promise<void>;
}

type ParsedTx = Omit<Transaction, 'id'> & { id: string };

const CATEGORY_OPTIONS = [
  'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
  'Groceries', 'Utilities', 'Housing', 'Healthcare', 'Income', 'Miscellaneous'
];

const EXAMPLES = [
  'paid 450 on swiggy, 120 on coffee, petrol 800',
  'got salary 55000 today',
  'Rs. 1200 debited for electricity bill',
  'Spent 2300 on amazon, 600 grofers, movie 350',
  'EMI 8500 deducted, rent 12000 paid to landlord',
];

export function MagicParser({ onSaveParsedTransactions }: MagicParserProps) {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string, mimeType: string, data: string } | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedTx[] | null>(null);
  const [savedCount, setSavedCount] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. max 5MB for Gemini payload constraints)
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Please upload a file smaller than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      setSelectedFile({
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        data: base64Data
      });
      setError(null);
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  const handleParse = async () => {
    if (!text.trim() && !selectedFile) return;
    setIsParsing(true);
    setError(null);
    setParsed(null);
    setSavedCount(null);

    try {
      const bodyPayload: any = { text };
      if (selectedFile) {
        bodyPayload.inlineData = {
          mimeType: selectedFile.mimeType,
          data: selectedFile.data
        };
      }

      const res = await fetch('/api/parse-statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to parse');

      if (!data.transactions || !Array.isArray(data.transactions) || data.transactions.length === 0) {
        setError("Couldn't find any transactions in that input. Try being more specific.");
        return;
      }

      const normalized: ParsedTx[] = data.transactions.map((tx: any, i: number) => ({
        id: `parsed-${Date.now()}-${i}`,
        description: String(tx.description ?? 'Transaction').substring(0, 40),
        amount: Math.abs(Number(tx.amount ?? 0)),
        date: tx.date ?? new Date().toISOString().split('T')[0],
        category: tx.category ?? 'Miscellaneous',
        type: tx.type === 'income' ? 'income' : 'expense',
      }));

      setParsed(normalized);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleUpdateParsed = (id: string, field: keyof ParsedTx, value: string | number) => {
    setParsed(prev => prev ? prev.map(tx => tx.id === id ? { ...tx, [field]: value } : tx) : prev);
  };

  const handleRemoveParsed = (id: string) => {
    setParsed(prev => {
      if (!prev) return prev;
      const next = prev.filter(tx => tx.id !== id);
      return next.length === 0 ? null : next;
    });
  };

  const handleConfirm = async () => {
    if (!parsed || !onSaveParsedTransactions) return;
    setIsSaving(true);
    try {
      await onSaveParsedTransactions(parsed);
      setSavedCount(parsed.length);
      setParsed(null);
      setText('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setParsed(null);
    setError(null);
    setSavedCount(null);
    setText('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const useExample = (ex: string) => {
    setText(ex);
    setSelectedFile(null);
    textareaRef.current?.focus();
  };

  return (
    <div className="space-y-6 max-w-2xl w-full">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#030213]">Statement Parser</h1>
        <p className="text-sm text-gray-500 mt-1">
          Type your expenses, or upload a bank statement PDF/Image. We'll extract everything automatically.
        </p>
      </div>

      {/* Success Banner */}
      {savedCount !== null && (
        <div className="bg-[#10b981]/10 border border-[#10b981] px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#10b981]">
              {savedCount} transaction{savedCount !== 1 ? 's' : ''} saved successfully.
            </p>
            <p className="text-xs text-gray-500 mt-0.5">All entries are now in your ledger.</p>
          </div>
          <button
            onClick={handleReset}
            className="text-xs font-bold text-[#030213] underline underline-offset-2 hover:text-[#10b981] transition-none ml-4 shrink-0"
          >
            Parse another
          </button>
        </div>
      )}

      {/* Input area — shown when no preview */}
      {!parsed && savedCount === null && (
        <div className="border border-[#030213] bg-[#f5f5f2] shadow-[4px_4px_0px_0px_#030213]">
          <div className="px-6 py-4 border-b border-[#030213] flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#030213]">Provide Data Source</h2>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,image/*,.csv"
              onChange={handleFileSelect}
            />
          </div>
          <div className="p-6 space-y-6">
            
            {!selectedFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-[#030213]/30 hover:border-[#030213] hover:bg-[#030213]/5 bg-white p-8 text-center cursor-pointer transition-none flex flex-col items-center justify-center gap-2"
              >
                <span className="font-mono text-2xl font-bold text-[#030213] leading-none mb-2">+</span>
                <span className="font-bold text-sm uppercase tracking-widest text-[#030213]">Upload Statement</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest font-mono mt-1">PDF, CSV, PNG, JPG</span>
              </div>
            ) : (
              <div className="w-full border-2 border-solid border-[#10b981] bg-[#10b981]/10 p-6 flex flex-col items-center justify-center gap-2 relative">
                <span className="font-mono text-sm font-bold text-[#10b981] truncate px-4">
                  [ {selectedFile.name} ]
                </span>
                <button 
                  onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="mt-2 text-[10px] font-bold text-[#d4183d] uppercase tracking-widest hover:underline"
                >
                  REMOVE ATTACHMENT
                </button>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#030213]/10"></div>
              <span className="font-mono text-[10px] uppercase font-bold text-gray-400 tracking-widest">OR PASTE RAW TEXT</span>
              <div className="flex-1 h-px bg-[#030213]/10"></div>
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => { setText(e.target.value); setError(null); }}
              placeholder={selectedFile ? "Optional: Add extra context or instructions..." : "e.g. paid 450 swiggy, coffee 80, got salary 55k today..."}
              className="w-full bg-white border border-[#030213] p-4 text-sm text-[#030213] placeholder:text-gray-400 focus:outline-none resize-none leading-relaxed"
              rows={5}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleParse();
              }}
            />

            {error && (
              <p className="text-xs text-[#d4183d] border border-[#d4183d] px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleParse}
              disabled={isParsing || (!text.trim() && !selectedFile)}
              className="w-full py-3 bg-[#030213] text-[#f5f5f2] text-sm font-bold tracking-wide border border-[#030213] hover:bg-[#10b981] hover:text-[#030213] hover:border-[#10b981] disabled:opacity-30 disabled:cursor-not-allowed transition-none"
            >
              {isParsing ? 'Processing data...' : '→ Extract transactions'}
            </button>

            <p className="text-[10px] text-gray-400 text-center">
              Press Ctrl+Enter to extract · AI supports PDFs, Screenshots, CSVs, and Text
            </p>
          </div>

          {/* Examples */}
          <div className="border-t border-[#030213]/10 px-6 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Try an example</p>
            <div className="flex flex-col gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => useExample(ex)}
                  className="text-left text-xs text-gray-500 hover:text-[#030213] hover:underline underline-offset-2 transition-none leading-relaxed"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview / Edit before saving */}
      {parsed && (
        <div className="space-y-4">
          <div className="border border-[#030213] bg-[#f5f5f2] shadow-[4px_4px_0px_0px_#030213]">
            <div className="px-6 py-4 border-b border-[#030213] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#030213]">
                  {parsed.length} transaction{parsed.length !== 1 ? 's' : ''} extracted
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">Review and edit before saving. Remove any that look wrong.</p>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-gray-400 hover:text-[#030213] underline underline-offset-2 transition-none"
              >
                Start over
              </button>
            </div>

            <div className="divide-y divide-[#030213]/10">
              {parsed.map((tx) => (
                <div key={tx.id} className="px-6 py-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                      {/* Description */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Description</label>
                        <input
                          type="text"
                          value={tx.description}
                          onChange={(e) => handleUpdateParsed(tx.id, 'description', e.target.value)}
                          className="w-full px-2.5 py-2 bg-white border border-[#030213]/30 text-sm text-[#030213] font-semibold focus:outline-none focus:border-[#030213]"
                        />
                      </div>
                      {/* Amount */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Amount (₹)</label>
                        <input
                          type="number"
                          value={tx.amount}
                          onChange={(e) => handleUpdateParsed(tx.id, 'amount', parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-2 bg-white border border-[#030213]/30 text-sm text-[#030213] font-mono font-bold focus:outline-none focus:border-[#030213]"
                        />
                      </div>
                      {/* Category */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Category</label>
                        <select
                          value={tx.category}
                          onChange={(e) => handleUpdateParsed(tx.id, 'category', e.target.value)}
                          className="w-full px-2.5 py-2 bg-white border border-[#030213]/30 text-xs text-[#030213] focus:outline-none focus:border-[#030213]"
                        >
                          {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      {/* Type */}
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Type</label>
                        <div className="flex border border-[#030213]/30">
                          {(['expense', 'income'] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => handleUpdateParsed(tx.id, 'type', t)}
                              className={`flex-1 py-2 text-xs font-bold capitalize transition-none ${
                                tx.type === t
                                  ? t === 'expense' ? 'bg-[#d4183d] text-white' : 'bg-[#10b981] text-[#030213]'
                                  : 'bg-white text-gray-400 hover:bg-gray-50'
                              } ${t === 'income' ? 'border-l border-[#030213]/30' : ''}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveParsed(tx.id)}
                      title="Remove this transaction"
                      className="text-gray-300 hover:text-[#d4183d] text-lg font-bold mt-6 shrink-0 transition-none leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm bar */}
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={isSaving || parsed.length === 0}
              className="flex-1 py-3 bg-[#030213] text-[#f5f5f2] text-sm font-bold border border-[#030213] hover:bg-[#10b981] hover:text-[#030213] hover:border-[#10b981] disabled:opacity-30 disabled:cursor-not-allowed transition-none"
            >
              {isSaving ? 'Saving...' : `Save ${parsed.length} transaction${parsed.length !== 1 ? 's' : ''} to ledger`}
            </button>
            <button
              onClick={handleReset}
              className="px-5 py-3 border border-[#030213] text-sm font-bold text-[#030213] hover:bg-[#030213] hover:text-[#f5f5f2] transition-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
