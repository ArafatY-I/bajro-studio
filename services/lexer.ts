import { Token, TokenType, KEYWORDS } from '../types';

export class Lexer {
  private src: string;
  private pos: number = 0;
  private line: number = 1;
  private col: number = 1;

  constructor(src: string) {
    this.src = src;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    while (this.pos < this.src.length) {
      const char = this.src[this.pos];

      if (/\s/.test(char)) {
        if (char === '\n') {
          this.line++;
          this.col = 1;
        } else {
          this.col++;
        }
        this.pos++;
        continue;
      }

      if (char === '/' && this.src[this.pos + 1] === '/') {
        // Comment
        while (this.pos < this.src.length && this.src[this.pos] !== '\n') {
          this.pos++;
        }
        continue;
      }

      if (/[0-9]/.test(char)) {
        let numStr = '';
        while (this.pos < this.src.length && /[0-9.]/.test(this.src[this.pos])) {
          numStr += this.src[this.pos];
          this.pos++;
          this.col++;
        }
        tokens.push({ type: TokenType.NUMBER, value: numStr, line: this.line, col: this.col });
        continue;
      }

      if (char === '"') {
        let strVal = '';
        this.pos++; 
        this.col++;
        while (this.pos < this.src.length && this.src[this.pos] !== '"') {
          strVal += this.src[this.pos];
          this.pos++;
          this.col++;
        }
        this.pos++; 
        this.col++;
        tokens.push({ type: TokenType.STRING, value: strVal, line: this.line, col: this.col });
        continue;
      }

      // Bangla and English characters for identifiers
      if (/[a-zA-Z\u0980-\u09FF_]/.test(char)) {
        let idStr = '';
        while (this.pos < this.src.length && /[a-zA-Z0-9\u0980-\u09FF_]/.test(this.src[this.pos])) {
          idStr += this.src[this.pos];
          this.pos++;
          this.col++;
        }
        
        if (KEYWORDS[idStr]) {
          tokens.push({ type: TokenType.KEYWORD, value: idStr, line: this.line, col: this.col });
        } else {
          tokens.push({ type: TokenType.IDENTIFIER, value: idStr, line: this.line, col: this.col });
        }
        continue;
      }

      if (['+', '-', '*', '/', '%', '=', '>', '<', '!'].includes(char)) {
        // Check for double chars like ==, >=, <=
        if (this.src[this.pos + 1] === '=') {
            tokens.push({ type: TokenType.OPERATOR, value: char + '=', line: this.line, col: this.col });
            this.pos += 2;
            this.col += 2;
        } else {
            tokens.push({ type: TokenType.OPERATOR, value: char, line: this.line, col: this.col });
            this.pos++;
            this.col++;
        }
        continue;
      }

      if (['(', ')', '{', '}', ';', ','].includes(char)) {
        tokens.push({ type: TokenType.PUNCTUATION, value: char, line: this.line, col: this.col });
        this.pos++;
        this.col++;
        continue;
      }

      this.pos++;
    }
    tokens.push({ type: TokenType.EOF, value: '', line: this.line, col: this.col });
    return tokens;
  }
}