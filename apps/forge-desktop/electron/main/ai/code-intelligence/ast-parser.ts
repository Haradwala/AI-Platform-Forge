/**
 * ast-parser.ts
 *
 * AST parser leveraging the official TypeScript Compiler API (ts.createSourceFile)
 * to extract imports, exports, classes, interfaces, enums, functions, methods,
 * variables, decorators, JSX components, and function calls.
 */

import * as ts from 'typescript';

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

export class ASTParser {
  parse(filePath: string, content: string): ASTParseResult {
    const scriptKind = filePath.endsWith('.tsx') || filePath.endsWith('.jsx')
      ? ts.ScriptKind.TSX
      : ts.ScriptKind.TS;

    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true,
      scriptKind
    );

    const result: ASTParseResult = {
      filePath,
      imports: [],
      exports: [],
      classes: [],
      interfaces: [],
      enums: [],
      functions: [],
      methods: [],
      variables: [],
      decorators: [],
      jsxComponents: [],
      calls: [],
    };

    let currentCaller: string | undefined = undefined;
    let currentClass: string | undefined = undefined;

    const getLine = (node: ts.Node): number => {
      return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
    };

    const hasExportModifier = (node: ts.Node): boolean => {
      const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
      return modifiers ? modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) : false;
    };

    const hasDefaultModifier = (node: ts.Node): boolean => {
      const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
      return modifiers ? modifiers.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword) : false;
    };

    const hasAsyncModifier = (node: ts.Node): boolean => {
      const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
      return modifiers ? modifiers.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword) : false;
    };

    const visit = (node: ts.Node) => {
      // 1. Imports
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
        let defaultImport: string | undefined = undefined;
        const namedImports: string[] = [];
        const isTypeOnly = node.importClause?.isTypeOnly || false;

        if (node.importClause?.name) {
          defaultImport = node.importClause.name.text;
        }

        if (node.importClause?.namedBindings) {
          if (ts.isNamedImports(node.importClause.namedBindings)) {
            for (const spec of node.importClause.namedBindings.elements) {
              namedImports.push(spec.name.text);
            }
          } else if (ts.isNamespaceImport(node.importClause.namedBindings)) {
            namedImports.push(`* as ${node.importClause.namedBindings.name.text}`);
          }
        }

        result.imports.push({ moduleSpecifier, defaultImport, namedImports, isTypeOnly });
      }

      // 2. Export Declarations / Statements
      if (ts.isExportDeclaration(node)) {
        if (node.exportClause && ts.isNamedExports(node.exportClause)) {
          for (const spec of node.exportClause.elements) {
            result.exports.push({
              name: spec.name.text,
              isDefault: false,
              isTypeOnly: node.isTypeOnly || false,
            });
          }
        }
      }

      // 3. Classes
      if (ts.isClassDeclaration(node) && node.name) {
        const className = node.name.text;
        const line = getLine(node);
        const isExported = hasExportModifier(node);

        let extendsName: string | undefined = undefined;
        const implementsNames: string[] = [];

        if (node.heritageClauses) {
          for (const clause of node.heritageClauses) {
            if (clause.token === ts.SyntaxKind.ExtendsKeyword && clause.types.length > 0) {
              extendsName = clause.types[0].expression.getText(sourceFile);
            } else if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
              for (const t of clause.types) {
                implementsNames.push(t.expression.getText(sourceFile));
              }
            }
          }
        }

        result.classes.push({
          name: className,
          extends: extendsName,
          implements: implementsNames,
          isExported,
          line,
        });

        if (isExported) {
          result.exports.push({ name: className, isDefault: hasDefaultModifier(node), isTypeOnly: false });
        }

        const prevClass = currentClass;
        currentClass = className;
        ts.forEachChild(node, visit);
        currentClass = prevClass;
        return;
      }

      // 4. Interfaces
      if (ts.isInterfaceDeclaration(node)) {
        const interfaceName = node.name.text;
        const line = getLine(node);
        const isExported = hasExportModifier(node);
        const extendsNames: string[] = [];

        if (node.heritageClauses) {
          for (const clause of node.heritageClauses) {
            for (const t of clause.types) {
              extendsNames.push(t.expression.getText(sourceFile));
            }
          }
        }

        result.interfaces.push({
          name: interfaceName,
          extends: extendsNames,
          isExported,
          line,
        });

        if (isExported) {
          result.exports.push({ name: interfaceName, isDefault: false, isTypeOnly: true });
        }
      }

      // 5. Enums
      if (ts.isEnumDeclaration(node)) {
        const enumName = node.name.text;
        const line = getLine(node);
        const isExported = hasExportModifier(node);
        const members = node.members.map((m) => m.name.getText(sourceFile));

        result.enums.push({ name: enumName, members, isExported, line });
        if (isExported) {
          result.exports.push({ name: enumName, isDefault: false, isTypeOnly: false });
        }
      }

      // 6. Functions
      if (ts.isFunctionDeclaration(node) && node.name) {
        const funcName = node.name.text;
        const line = getLine(node);
        const isExported = hasExportModifier(node);
        const isAsync = hasAsyncModifier(node);

        result.functions.push({ name: funcName, isAsync, isExported, line });
        if (isExported) {
          result.exports.push({ name: funcName, isDefault: hasDefaultModifier(node), isTypeOnly: false });
        }

        // React component heuristic (PascalCase function returning JSX)
        if (funcName.match(/^[A-Z]\w+/)) {
          result.jsxComponents.push({ name: funcName, line });
        }

        const prevCaller = currentCaller;
        currentCaller = funcName;
        ts.forEachChild(node, visit);
        currentCaller = prevCaller;
        return;
      }

      // 7. Methods
      if (ts.isMethodDeclaration(node) && ts.isIdentifier(node.name)) {
        const methodName = node.name.text;
        const line = getLine(node);
        const isAsync = hasAsyncModifier(node);

        result.methods.push({
          className: currentClass,
          name: methodName,
          isAsync,
          line,
        });

        const prevCaller = currentCaller;
        currentCaller = currentClass ? `${currentClass}.${methodName}` : methodName;
        ts.forEachChild(node, visit);
        currentCaller = prevCaller;
        return;
      }

      // 8. Variables
      if (ts.isVariableStatement(node)) {
        const isExported = hasExportModifier(node);
        const flags = node.declarationList.flags;
        const kind: 'const' | 'let' | 'var' = (flags & ts.NodeFlags.Const) !== 0 ? 'const' : (flags & ts.NodeFlags.Let) !== 0 ? 'let' : 'var';

        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name)) {
            const varName = decl.name.text;
            const line = getLine(decl);
            result.variables.push({ name: varName, kind, isExported, line });

            if (isExported) {
              result.exports.push({ name: varName, isDefault: false, isTypeOnly: false });
            }

            // React component arrow function heuristic
            if (varName.match(/^[A-Z]\w+/) && decl.initializer && (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer))) {
              result.jsxComponents.push({ name: varName, line });
            }
          }
        }
      }

      // 9. JSX Element components
      if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
        const tagName = node.tagName.getText(sourceFile);
        if (tagName.match(/^[A-Z]/)) {
          result.jsxComponents.push({ name: tagName, line: getLine(node) });
        }
      }

      // 10. Function / Method Calls
      if (ts.isCallExpression(node)) {
        const calleeName = node.expression.getText(sourceFile);
        const isAsync = node.parent && ts.isAwaitExpression(node.parent);
        result.calls.push({
          callerName: currentCaller,
          calleeName,
          isAsync: Boolean(isAsync),
          line: getLine(node),
        });
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return result;
  }
}
