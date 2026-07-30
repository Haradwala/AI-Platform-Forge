"use strict";
/**
 * ast-parser.ts
 *
 * AST parser leveraging the official TypeScript Compiler API (ts.createSourceFile)
 * to extract imports, exports, classes, interfaces, enums, functions, methods,
 * variables, decorators, JSX components, and function calls.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTParser = void 0;
const ts = __importStar(require("typescript"));
class ASTParser {
    parse(filePath, content) {
        const scriptKind = filePath.endsWith('.tsx') || filePath.endsWith('.jsx')
            ? ts.ScriptKind.TSX
            : ts.ScriptKind.TS;
        const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, scriptKind);
        const result = {
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
        let currentCaller = undefined;
        let currentClass = undefined;
        const getLine = (node) => {
            return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
        };
        const hasExportModifier = (node) => {
            const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
            return modifiers ? modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) : false;
        };
        const hasDefaultModifier = (node) => {
            const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
            return modifiers ? modifiers.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword) : false;
        };
        const hasAsyncModifier = (node) => {
            const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
            return modifiers ? modifiers.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword) : false;
        };
        const visit = (node) => {
            // 1. Imports
            if (ts.isImportDeclaration(node)) {
                const moduleSpecifier = node.moduleSpecifier.text;
                let defaultImport = undefined;
                const namedImports = [];
                const isTypeOnly = node.importClause?.isTypeOnly || false;
                if (node.importClause?.name) {
                    defaultImport = node.importClause.name.text;
                }
                if (node.importClause?.namedBindings) {
                    if (ts.isNamedImports(node.importClause.namedBindings)) {
                        for (const spec of node.importClause.namedBindings.elements) {
                            namedImports.push(spec.name.text);
                        }
                    }
                    else if (ts.isNamespaceImport(node.importClause.namedBindings)) {
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
                let extendsName = undefined;
                const implementsNames = [];
                if (node.heritageClauses) {
                    for (const clause of node.heritageClauses) {
                        if (clause.token === ts.SyntaxKind.ExtendsKeyword && clause.types.length > 0) {
                            extendsName = clause.types[0].expression.getText(sourceFile);
                        }
                        else if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
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
                const extendsNames = [];
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
                const kind = (flags & ts.NodeFlags.Const) !== 0 ? 'const' : (flags & ts.NodeFlags.Let) !== 0 ? 'let' : 'var';
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
exports.ASTParser = ASTParser;
//# sourceMappingURL=ast-parser.js.map