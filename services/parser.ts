import { Token, TokenType, ASTNode, ASTNodeType } from '../types';

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private advance(): Token {
    return this.tokens[this.current++];
  }

  private match(type: TokenType, value?: string): boolean {
    const token = this.peek();
    if (token.type === type && (!value || token.value === value)) {
      this.advance();
      return true;
    }
    return false;
  }

  public parse(): ASTNode {
    const statements: ASTNode[] = [];
    while (this.peek().type !== TokenType.EOF) {
      statements.push(this.statement());
    }
    return { type: ASTNodeType.Program, body: statements };
  }

  private statement(): ASTNode {
    const token = this.peek();
    
    // Print: লিখো
    if (token.type === TokenType.KEYWORD && token.value === 'লিখো') {
      this.advance();
      this.match(TokenType.PUNCTUATION, '(');
      const expr = this.expression();
      this.match(TokenType.PUNCTUATION, ')');
      this.match(TokenType.PUNCTUATION, ';');
      return { type: ASTNodeType.PrintStatement, expression: expr };
    }

    // Variable: পূর্ণসংখ্যা, ভগ্নাংশ, বাক্য
    if (token.type === TokenType.KEYWORD && (token.value === 'পূর্ণসংখ্যা' || token.value === 'ভগ্নাংশ' || token.value === 'বাক্য')) {
      const varType = this.advance().value;
      const name = this.advance().value;
      this.match(TokenType.OPERATOR, '=');
      const value = this.expression();
      this.match(TokenType.PUNCTUATION, ';');
      return { type: ASTNodeType.VariableDeclaration, varType, name, value };
    }

    // If: যদি
    if (token.type === TokenType.KEYWORD && token.value === 'যদি') {
      this.advance();
      this.match(TokenType.PUNCTUATION, '(');
      const condition = this.expression();
      this.match(TokenType.PUNCTUATION, ')');
      const consequent = this.block();
      
      let alternate;
      if (this.peek().type === TokenType.KEYWORD && this.peek().value === 'নতুবা') {
        this.advance();
        alternate = this.block();
      }

      return { type: ASTNodeType.IfStatement, condition, consequent, alternate };
    }

    // While: যতক্ষণ
    if (token.type === TokenType.KEYWORD && token.value === 'যতক্ষণ') {
        this.advance();
        this.match(TokenType.PUNCTUATION, '(');
        const condition = this.expression();
        this.match(TokenType.PUNCTUATION, ')');
        const body = this.block();
        return { type: ASTNodeType.WhileStatement, condition, body };
    }

    // Assignment: x = 10;
    if (token.type === TokenType.IDENTIFIER) {
      const name = token.value;
      this.advance(); // consume identifier
      if (this.peek().value === '=') {
          this.advance(); // consume =
          const value = this.expression();
          this.match(TokenType.PUNCTUATION, ';');
          return { type: ASTNodeType.Assignment, name, value };
      }
    }

    throw new Error(`Unexpected token at line ${token.line}: ${token.value}`);
  }

  private block(): ASTNode {
    this.match(TokenType.PUNCTUATION, '{');
    const statements: ASTNode[] = [];
    while (this.peek().value !== '}' && this.peek().type !== TokenType.EOF) {
      statements.push(this.statement());
    }
    this.match(TokenType.PUNCTUATION, '}');
    return { type: ASTNodeType.BlockStatement, body: statements };
  }

  private expression(): ASTNode {
    return this.equality();
  }

  private equality(): ASTNode {
    let expr = this.comparison();
    while (this.peek().value === '==' || this.peek().value === '!=') {
        const operator = this.advance().value;
        const right = this.comparison();
        expr = { type: ASTNodeType.BinaryExpression, left: expr, right, operator };
    }
    return expr;
  }

  private comparison(): ASTNode {
    let expr = this.term();
    while (['>', '<', '>=', '<='].includes(this.peek().value)) {
        const operator = this.advance().value;
        const right = this.term();
        expr = { type: ASTNodeType.BinaryExpression, left: expr, right, operator };
    }
    return expr;
  }

  private term(): ASTNode {
    let expr = this.factor();
    while (this.peek().value === '+' || this.peek().value === '-') {
      const operator = this.advance().value;
      const right = this.factor();
      expr = { type: ASTNodeType.BinaryExpression, left: expr, right, operator };
    }
    return expr;
  }

  private factor(): ASTNode {
    let expr = this.primary();
    while (this.peek().value === '*' || this.peek().value === '/' || this.peek().value === '%') {
      const operator = this.advance().value;
      const right = this.primary();
      expr = { type: ASTNodeType.BinaryExpression, left: expr, right, operator };
    }
    return expr;
  }

  private primary(): ASTNode {
    const token = this.peek();
    
    if (token.type === TokenType.NUMBER) {
      this.advance();
      return { type: ASTNodeType.Literal, value: parseFloat(token.value), raw: token.value };
    }

    if (token.type === TokenType.STRING) {
      this.advance();
      return { type: ASTNodeType.Literal, value: token.value, raw: `"${token.value}"` };
    }

    if (token.type === TokenType.IDENTIFIER) {
      this.advance();
      return { type: ASTNodeType.Identifier, name: token.value };
    }

    if (token.value === '(') {
      this.advance();
      const expr = this.expression();
      this.match(TokenType.PUNCTUATION, ')');
      return expr;
    }

    throw new Error(`Unexpected token in expression: ${token.value}`);
  }
}