declare module 'esprima' {
  export function parseModule(code: string, options?: any): any;
  export function parse(code: string, options?: any): any;
}
