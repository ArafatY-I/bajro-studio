import React from 'react';
import { ASTNode } from '../types';

interface ASTViewerProps {
  node: ASTNode | null;
}

const TreeNode: React.FC<{ node: ASTNode; label?: string; depth?: number }> = ({ node, label, depth = 0 }) => {
  if (!node) return null;

  const colorMap: Record<string, string> = {
    Program: 'text-pink-400',
    VariableDeclaration: 'text-blue-400',
    PrintStatement: 'text-green-400',
    IfStatement: 'text-purple-400',
    Literal: 'text-yellow-400',
    Identifier: 'text-cyan-400',
    BinaryExpression: 'text-orange-400',
  };

  const isLeaf = ['Literal', 'Identifier'].includes(node.type);
  const typeColor = colorMap[node.type] || 'text-slate-300';

  return (
    <div style={{ marginLeft: `${depth * 12}px` }} className="border-l border-slate-700 pl-2 my-1">
      <div className="flex items-center text-xs font-mono">
        {label && <span className="text-slate-500 mr-2">{label}:</span>}
        <span className={`${typeColor} font-semibold`}>{node.type}</span>
        {isLeaf && (
          <span className="ml-2 text-slate-200 bg-slate-800 px-1 rounded">
             {node.value || node.name || node.operator}
          </span>
        )}
      </div>
      {!isLeaf && (
        <div>
          {Object.entries(node).map(([key, val]) => {
            if (key === 'type' || key === 'raw' || key === 'loc') return null;
            if (typeof val === 'object' && val !== null) {
              if (Array.isArray(val)) {
                return (
                  <div key={key}>
                    <span className="text-slate-600 text-[10px] ml-2">{key} [{val.length}]</span>
                    {val.map((child, i) => (
                      <TreeNode key={i} node={child} depth={0} />
                    ))}
                  </div>
                );
              }
              return <TreeNode key={key} node={val} label={key} depth={0} />;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

const ASTViewer: React.FC<ASTViewerProps> = ({ node }) => {
  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <div className="flex items-center px-4 py-2 border-b border-slate-800 bg-slate-800/50">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">AST Visualizer</span>
        </div>
        <div className="flex-1 overflow-auto p-4">
            {node ? <TreeNode node={node} /> : <span className="text-slate-600 text-sm italic">Parse valid code to see AST</span>}
        </div>
    </div>
  );
};

export default ASTViewer;