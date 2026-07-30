/**
 * ast-parser.ts
 *
 * AST parser leveraging the official TypeScript Compiler API (ts.createSourceFile)
 * to extract imports, exports, classes, interfaces, enums, functions, methods,
 * variables, decorators, JSX components, and function calls.
 */
export interface ParsedImport {
    moduleSpecifier: string;
    defaultImport?: string;
    namedImports: string[];
    isTypeOnly: boolean;
}
export interface ParsedExport {
    name: string;
    isDefault: boolean;
    isTypeOnly: boolean;
}
export interface ParsedClass {
    name: string;
    extends?: string;
    implements?: string[];
    isExported: boolean;
    line: number;
}
export interface ParsedInterface {
    name: string;
    extends?: string[];
    isExported: boolean;
    line: number;
}
export interface ParsedEnum {
    name: string;
    members: string[];
    isExported: boolean;
    line: number;
}
export interface ParsedFunction {
    name: string;
    isAsync: boolean;
    isExported: boolean;
    line: number;
}
export interface ParsedMethod {
    className?: string;
    name: string;
    isAsync: boolean;
    line: number;
}
export interface ParsedVariable {
    name: string;
    kind: 'const' | 'let' | 'var';
    isExported: boolean;
    line: number;
}
export interface ParsedDecorator {
    name: string;
    target: string;
    line: number;
}
export interface ParsedJsxComponent {
    name: string;
    line: number;
}
export interface ParsedCall {
    callerName?: string;
    calleeName: string;
    isAsync: boolean;
    line: number;
}
export interface ASTParseResult {
    filePath: string;
    imports: ParsedImport[];
    exports: ParsedExport[];
    classes: ParsedClass[];
    interfaces: ParsedInterface[];
    enums: ParsedEnum[];
    functions: ParsedFunction[];
    methods: ParsedMethod[];
    variables: ParsedVariable[];
    decorators: ParsedDecorator[];
    jsxComponents: ParsedJsxComponent[];
    calls: ParsedCall[];
}
export declare class ASTParser {
    parse(filePath: string, content: string): ASTParseResult;
}
