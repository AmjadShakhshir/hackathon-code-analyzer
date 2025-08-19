import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, filename = 'input.js' } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // Import esprima dynamically
    const esprima = await import('esprima');
    
    // Parse the code
    const ast = esprima.parseModule(code, { range: true, loc: true });
    
    // Extract functions and their complexity
    const functions: Array<{ name: string; cyclomaticComplexity: number }> = [];
    const dependencies: string[] = [];
    
    // Walk through the AST
    walkAST(ast, (node: any, parent: any) => {
      // Extract functions
      if (node.type === 'FunctionDeclaration' || 
          node.type === 'FunctionExpression' || 
          node.type === 'ArrowFunctionExpression') {
        const name = getFunctionName(node, parent);
        const complexity = calculateComplexity(node);
        functions.push({ name, cyclomaticComplexity: complexity });
      }
      
      // Extract dependencies
      if (node.type === 'ImportDeclaration' && node.source) {
        dependencies.push(node.source.value);
      }
      if (node.type === 'CallExpression' && 
          node.callee?.name === 'require' && 
          node.arguments?.[0]?.value) {
        dependencies.push(node.arguments[0].value);
      }
    });
    
    // Return JSON as specified in RDP
    return NextResponse.json({
      functions,
      dependencies: [...new Set(dependencies)] // Remove duplicates
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: `Parse error: ${error}` 
    }, { status: 400 });
  }
}

function walkAST(node: any, callback: (node: any, parent?: any) => void, parent?: any) {
  if (!node || typeof node !== 'object') return;
  
  callback(node, parent);
  
  for (const key in node) {
    const value = node[key];
    if (Array.isArray(value)) {
      value.forEach(child => walkAST(child, callback, node));
    } else if (value && typeof value === 'object') {
      walkAST(value, callback, node);
    }
  }
}

function getFunctionName(node: any, parent: any): string {
  if (node.type === 'FunctionDeclaration' && node.id) {
    return node.id.name;
  }
  if (parent?.type === 'VariableDeclarator' && parent.id?.name) {
    return parent.id.name;
  }
  if (parent?.type === 'Property' && parent.key) {
    return parent.key.name || String(parent.key.value);
  }
  return '(anonymous)';
}

function calculateComplexity(node: any): number {
  let complexity = 1; // Base complexity
  
  const decisionNodes = new Set([
    'IfStatement', 'ForStatement', 'ForInStatement', 'ForOfStatement',
    'WhileStatement', 'DoWhileStatement', 'SwitchCase', 'CatchClause',
    'ConditionalExpression'
  ]);
  
  walkAST(node, (n: any) => {
    if (decisionNodes.has(n.type)) {
      if (n.type === 'SwitchCase' && n.test === null) return; // Default case doesn't add complexity
      complexity++;
    }
    if (n.type === 'LogicalExpression' && (n.operator === '&&' || n.operator === '||')) {
      complexity++;
    }
  });
  
  return complexity;
}
