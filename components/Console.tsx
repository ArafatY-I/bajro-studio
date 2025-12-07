import React from 'react';
import { Terminal } from 'lucide-react';

interface ConsoleProps {
  output: string[];
  error?: string | null;
}

const Console: React.FC<ConsoleProps> = ({ output, error }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-lg border border-slate-800 shadow-xl">
      <div className="flex items-center px-4 py-2 border-b border-slate-800 bg-slate-900/50">
        <Terminal size={16} className="text-slate-400 mr-2" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Output / ফলাফল</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
        {output.length === 0 && !error && (
          <span className="text-slate-600 italic">No output yet... / ফলাফল এখানে দেখাবে...</span>
        )}
        {output.map((line, i) => (
          <div key={i} className="text-emerald-400 mb-1">
            <span className="text-slate-600 mr-2">$</span>
            {line}
          </div>
        ))}
        {error && (
          <div className="text-red-400 mt-2 p-2 bg-red-900/20 rounded border border-red-900/50">
             <span className="font-bold">Error:</span> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Console;