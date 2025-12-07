import React, { useRef } from 'react';

interface EditorProps {
  code: string;
  onChange: (val: string) => void;
}

const Editor: React.FC<EditorProps> = ({ code, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const val = e.currentTarget.value;
      e.currentTarget.value = val.substring(0, start) + '  ' + val.substring(end);
      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2;
      onChange(e.currentTarget.value);
    }
  };

  // Simple regex-based highlighter for visualization only
  const highlight = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/(".*?")/g, '<span class="text-yellow-300">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-purple-400">$1</span>')
      .replace(/\b(লিখো|পূর্ণসংখ্যা|ভগ্নাংশ|বাক্য|যদি|নতুবা|যতক্ষণ|কাজ|ফেরত)\b/g, '<span class="text-cyan-400 font-bold">$1</span>')
      .replace(/(\/\/.*)/g, '<span class="text-gray-500 italic">$1</span>');
  };

  return (
    <div className="relative w-full h-full font-mono text-sm bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-inner">
      {/* Background Highlighter */}
      <pre 
        className="absolute inset-0 p-4 pointer-events-none whitespace-pre-wrap break-all z-10"
        dangerouslySetInnerHTML={{ __html: highlight(code) + '<br/>' }} 
      />
      {/* Foreground Input */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white resize-none outline-none z-20 font-inherit whitespace-pre-wrap break-all"
        style={{ fontFamily: 'inherit' }}
      />
    </div>
  );
};

export default Editor;