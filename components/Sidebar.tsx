import React from 'react';
import { FileCode, Zap, BookOpen } from 'lucide-react';

const EXAMPLES = [
  {
    name: "হ্যালো বিশ্ব (Hello World)",
    code: `// প্রথম প্রোগ্রাম
লিখো("হ্যালো বিশ্ব");
লিখো("বজ্র কম্পাইলারে স্বাগতম!");`
  },
  {
    name: "যোগফল (Addition)",
    code: `// দুটি সংখ্যার যোগফল
পূর্ণসংখ্যা a = 10;
পূর্ণসংখ্যা b = 20;
পূর্ণসংখ্যা sum = a + b;

লিখো("যোগফল:");
লিখো(sum);`
  },
  {
    name: "যদি-নতুবা (If-Else)",
    code: `পূর্ণসংখ্যা number = 7;

যদি (number > 5) {
    লিখো("সংখ্যাটি ৫ এর চেয়ে বড়");
} নতুবা {
    লিখো("সংখ্যাটি ৫ বা তার ছোট");
}`
  },
  {
    name: "লুপ (While Loop)",
    code: `// ১ থেকে ৫ পর্যন্ত প্রিন্ট করা
পূর্ণসংখ্যা i = 1;

যতক্ষণ (i <= 5) {
    লিখো("লুপ চলছে...");
    লিখো(i);
    i = i + 1;
}
লিখো("সমাপ্ত!");`
  },
  {
    name: "ফিবোনাচ্চি (Fibonacci)",
    code: `// ফিবোনাচ্চি সিরিজ
পূর্ণসংখ্যা n = 10;
পূর্ণসংখ্যা t1 = 0;
পূর্ণসংখ্যা t2 = 1;
পূর্ণসংখ্যা nextTerm = t1 + t2;

লিখো(t1);
লিখো(t2);

পূর্ণসংখ্যা i = 3;
যতক্ষণ (i <= n) {
    লিখো(nextTerm);
    t1 = t2;
    t2 = nextTerm;
    nextTerm = t1 + t2;
    i = i + 1;
}`
  }
];

interface SidebarProps {
  onLoadExample: (code: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLoadExample }) => {
  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-4 border-b border-slate-800 flex items-center gap-2">
        <div className="bg-cyan-500 p-1.5 rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <Zap size={20} className="text-white" fill="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">বজ্র <span className="text-cyan-400">IDE</span></h1>
          <p className="text-[10px] text-slate-400">Bangla Compiler v1.0</p>
        </div>
      </div>

      <div className="p-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <BookOpen size={14} /> উদাহরণ (Examples)
        </div>
        <div className="space-y-1">
          {EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => onLoadExample(ex.code)}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors group flex items-center gap-2"
            >
              <FileCode size={14} className="text-slate-500 group-hover:text-cyan-400" />
              <span className="truncate">{ex.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="text-[10px] text-slate-500 text-center">
          Built with React, TypeScript & Tailwind
        </div>
      </div>
    </div>
  );
};

export default Sidebar;