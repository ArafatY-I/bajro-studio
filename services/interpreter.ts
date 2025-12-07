import { ASTNode, ASTNodeType } from '../types';

export class Interpreter {
  private outputBuffer: string[] = [];

  // Transpiles Bojro AST to JavaScript code string
  public transpile(node: ASTNode): string {
    switch (node.type) {
      case ASTNodeType.Program:
        return node.body.map((stmt: ASTNode) => this.transpile(stmt)).join('\n');
      
      case ASTNodeType.VariableDeclaration:
        // In JS we use let/const regardless of type, but validation could happen here
        return `let ${node.name} = ${this.transpile(node.value)};`;

      case ASTNodeType.Assignment:
        return `${node.name} = ${this.transpile(node.value)};`;

      case ASTNodeType.PrintStatement:
        return `__print(${this.transpile(node.expression)});`;

      case ASTNodeType.IfStatement:
        let ifCode = `if (${this.transpile(node.condition)}) ${this.transpile(node.consequent)}`;
        if (node.alternate) {
          ifCode += ` else ${this.transpile(node.alternate)}`;
        }
        return ifCode;

      case ASTNodeType.WhileStatement:
        return `while (${this.transpile(node.condition)}) ${this.transpile(node.body)}`;

      case ASTNodeType.BlockStatement:
        return `{\n${node.body.map((stmt: ASTNode) => this.transpile(stmt)).join('\n')}\n}`;

      case ASTNodeType.BinaryExpression:
        return `${this.transpile(node.left)} ${node.operator} ${this.transpile(node.right)}`;

      case ASTNodeType.Literal:
        return typeof node.value === 'string' ? `"${node.value}"` : node.value.toString();

      case ASTNodeType.Identifier:
        return node.name;

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  public execute(jsCode: string): string[] {
    this.outputBuffer = [];
    
    const __print = (val: unknown) => {
      this.outputBuffer.push(String(val));
    };

    try {
      // Create a safe-ish execution context
      // eslint-disable-next-line no-new-func
      const run = new Function('__print', jsCode);
      run(__print);
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.outputBuffer.push(`Error: ${e.message}`);
      } else {
        this.outputBuffer.push(`Unknown Error`);
      }
    }
    
    return this.outputBuffer;
  }
}