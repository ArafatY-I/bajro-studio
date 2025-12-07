export enum TokenType {
  KEYWORD,
  IDENTIFIER,
  NUMBER,
  STRING,
  OPERATOR,
  PUNCTUATION,
  EOF,
  UNKNOWN
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

export enum ASTNodeType {
  Program = 'Program',
  VariableDeclaration = 'VariableDeclaration',
  PrintStatement = 'PrintStatement',
  IfStatement = 'IfStatement',
  WhileStatement = 'WhileStatement',
  BlockStatement = 'BlockStatement',
  BinaryExpression = 'BinaryExpression',
  Literal = 'Literal',
  Identifier = 'Identifier',
  Assignment = 'Assignment'
}

export interface ASTNode {
  type: ASTNodeType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface VariableDeclNode extends ASTNode {
  type: ASTNodeType.VariableDeclaration;
  varType: string;
  name: string;
  value: ASTNode;
}

export interface PrintNode extends ASTNode {
  type: ASTNodeType.PrintStatement;
  expression: ASTNode;
}

export interface IfNode extends ASTNode {
  type: ASTNodeType.IfStatement;
  condition: ASTNode;
  consequent: ASTNode;
  alternate?: ASTNode;
}

export interface WhileNode extends ASTNode {
  type: ASTNodeType.WhileStatement;
  condition: ASTNode;
  body: ASTNode;
}

export interface BinaryExprNode extends ASTNode {
  type: ASTNodeType.BinaryExpression;
  left: ASTNode;
  right: ASTNode;
  operator: string;
}

export const KEYWORDS: Record<string, string> = {
  'লিখো': 'PRINT',
  'পূর্ণসংখ্যা': 'INT',
  'ভগ্নাংশ': 'FLOAT',
  'বাক্য': 'STRING',
  'যদি': 'IF',
  'নতুবা': 'ELSE',
  'যতক্ষণ': 'WHILE',
  'কাজ': 'FUNCTION',
  'ফেরত': 'RETURN',
  'চলক': 'VAR', // Generic var
};