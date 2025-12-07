import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Code2, AlertTriangle, FileJson } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Console from './components/Console';
import ASTViewer from './components/ASTViewer';
import { Lexer } from './services/lexer';
import { Parser } from './services/parser';
import { Interpreter } from './services/interpreter';
import { explainCode } from './services/geminiService';
import { ASTNode } from './types';

const INITIAL_CODE = `// বজ্র (Bojro) এ স্বাগতম!
পূর্ণসংখ্যা a = 10;
পূর্ণসংখ্যা b = 5;

যদি (a > b) {
    লিখো("a সংখ্যাটি বড়!");
    লিখো(a);
} നতুবা {
    লিখো("b সংখ্যাটি বড়");
}`;

function App() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [ast, setAst] = useState<ASTNode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'console' | 'ast'>('console');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleRun = () => {
    setError(null);
    setAiResponse(null);
    try {
      // 1. Lexical Analysis
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();

      // 2. Parsing
      const parser = new Parser(tokens);
      const astRoot = parser.parse();
      setAst(astRoot);

      // 3. Interpretation (Transpile -> Execute)
      const interpreter = new Interpreter();
      const jsCode = interpreter.transpile(astRoot);
      const result = interpreter.execute(jsCode);
      setOutput(result);
      setActiveTab('console');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        setOutput([]);
      }
    }
  };

  const handleAiExplain = async () => {
    setIsAiLoading(true);
    const explanation = await explainCode(code);
    setAiResponse(explanation);
    setIsAiLoading(false);
    setActiveTab('console'); 
  };

  // Auto-parse for AST view (debounce could be added for performance)
  useEffect(() => {
    try {
      const lexer = new Lexer(code);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const astRoot = parser.parse();
      setAst(astRoot);
      setError(null);
    } catch (e) {
      // Don't show error while typing unless running
    }
  }, [code]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <Sidebar onLoadExample={setCode} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-sm text-slate-400">
               <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
               Ready
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleAiExplain}
              disabled={isAiLoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
            >
              <Sparkles size={16} />
              {isAiLoading ? 'Analyzing...' : 'AI Explain'}
            </button>
            <button
              onClick={handleRun}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95"
            >
              <Play size={16} fill="currentColor" />
              RUN CODE
            </button>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 flex overflow-hidden p-4 gap-4">
          {/* Editor Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                <Code2 size={14} /> main.bojro
              </span>
            </div>
            <Editor code={code} onChange={setCode} />
          </div>

          {/* Right Panel: Output & AST */}
          <div className="w-[400px] flex flex-col gap-4">
            
            {/* Tab Switcher */}
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                <button 
                  onClick={() => setActiveTab('console')}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'console' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    <Play size={12} /> Output
                </button>
                <button 
                  onClick={() => setActiveTab('ast')}
                  className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'ast' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    <FileJson size={12} /> AST
                </button>
            </div>

            <div className="flex-1 min-h-0 relative">
                {activeTab === 'console' ? (
                   <div className="h-full flex flex-col">
                      <Console output={output} error={error} />
                      {/* AI Response Overlay Area */}
                      {aiResponse && (
                        <div className="mt-4 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg text-sm text-purple-200 max-h-60 overflow-y-auto">
                           <div className="flex items-center gap-2 mb-2 font-bold text-purple-400">
                             <Sparkles size={14} /> AI Explanation:
                           </div>
                           <p className="whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
                        </div>
                      )}
                   </div>
                ) : (
                   <ASTViewer node={ast} />
                )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;