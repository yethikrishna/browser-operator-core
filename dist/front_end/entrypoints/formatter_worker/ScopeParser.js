// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Scope_instances, _Scope_mergeChildDefUses, _ScopeVariableAnalysis_instances, _ScopeVariableAnalysis_rootScope, _ScopeVariableAnalysis_allNames, _ScopeVariableAnalysis_currentScope, _ScopeVariableAnalysis_rootNode, _ScopeVariableAnalysis_processNode, _ScopeVariableAnalysis_pushScope, _ScopeVariableAnalysis_popScope, _ScopeVariableAnalysis_addVariable, _ScopeVariableAnalysis_processNodeAsDefinition, _ScopeVariableAnalysis_processVariableDeclarator;
import * as Acorn from '../../third_party/acorn/acorn.js';
import { ECMA_VERSION } from './AcornTokenizer.js';
export function parseScopes(expression, sourceType = 'script') {
    // Parse the expression and find variables and scopes.
    let root = null;
    try {
        root = Acorn.parse(expression, { ecmaVersion: ECMA_VERSION, allowAwaitOutsideFunction: true, ranges: false, sourceType });
    }
    catch {
        return null;
    }
    return new ScopeVariableAnalysis(root).run();
}
export class Scope {
    constructor(start, end, parent) {
        _Scope_instances.add(this);
        this.variables = new Map();
        this.children = [];
        this.start = start;
        this.end = end;
        this.parent = parent;
        if (parent) {
            parent.children.push(this);
        }
    }
    export() {
        const variables = [];
        for (const variable of this.variables) {
            const offsets = [];
            for (const use of variable[1].uses) {
                offsets.push(use.offset);
            }
            variables.push({ name: variable[0], kind: variable[1].definitionKind, offsets });
        }
        const children = this.children.map(c => c.export());
        return {
            start: this.start,
            end: this.end,
            variables,
            children,
        };
    }
    addVariable(name, offset, definitionKind, isShorthandAssignmentProperty) {
        const variable = this.variables.get(name);
        const use = { offset, scope: this, isShorthandAssignmentProperty };
        if (!variable) {
            this.variables.set(name, { definitionKind, uses: [use] });
            return;
        }
        if (variable.definitionKind === 0 /* DefinitionKind.NONE */) {
            variable.definitionKind = definitionKind;
        }
        variable.uses.push(use);
    }
    findBinders(name) {
        const result = [];
        let scope = this;
        while (scope !== null) {
            const defUse = scope.variables.get(name);
            if (defUse && defUse.definitionKind !== 0 /* DefinitionKind.NONE */) {
                result.push(defUse);
            }
            scope = scope.parent;
        }
        return result;
    }
    finalizeToParent(isFunctionScope) {
        var _a;
        if (!this.parent) {
            console.error('Internal error: wrong nesting in scope analysis.');
            throw new Error('Internal error');
        }
        // Move all unbound variables to the parent (also move var-bound variables
        // if the parent is not a function).
        const keysToRemove = [];
        for (const [name, defUse] of this.variables.entries()) {
            if (defUse.definitionKind === 0 /* DefinitionKind.NONE */ ||
                (defUse.definitionKind === 2 /* DefinitionKind.VAR */ && !isFunctionScope)) {
                __classPrivateFieldGet((_a = this.parent), _Scope_instances, "m", _Scope_mergeChildDefUses).call(_a, name, defUse);
                keysToRemove.push(name);
            }
        }
        keysToRemove.forEach(k => this.variables.delete(k));
    }
}
_Scope_instances = new WeakSet(), _Scope_mergeChildDefUses = function _Scope_mergeChildDefUses(name, defUses) {
    const variable = this.variables.get(name);
    if (!variable) {
        this.variables.set(name, defUses);
        return;
    }
    variable.uses.push(...defUses.uses);
    if (defUses.definitionKind === 2 /* DefinitionKind.VAR */) {
        console.assert(variable.definitionKind !== 1 /* DefinitionKind.LET */);
        if (variable.definitionKind === 0 /* DefinitionKind.NONE */) {
            variable.definitionKind = defUses.definitionKind;
        }
    }
    else {
        console.assert(defUses.definitionKind === 0 /* DefinitionKind.NONE */);
    }
};
export class ScopeVariableAnalysis {
    constructor(node) {
        _ScopeVariableAnalysis_instances.add(this);
        _ScopeVariableAnalysis_rootScope.set(this, void 0);
        _ScopeVariableAnalysis_allNames.set(this, new Set());
        _ScopeVariableAnalysis_currentScope.set(this, void 0);
        _ScopeVariableAnalysis_rootNode.set(this, void 0);
        __classPrivateFieldSet(this, _ScopeVariableAnalysis_rootNode, node, "f");
        __classPrivateFieldSet(this, _ScopeVariableAnalysis_rootScope, new Scope(node.start, node.end, null), "f");
        __classPrivateFieldSet(this, _ScopeVariableAnalysis_currentScope, __classPrivateFieldGet(this, _ScopeVariableAnalysis_rootScope, "f"), "f");
    }
    run() {
        __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, __classPrivateFieldGet(this, _ScopeVariableAnalysis_rootNode, "f"));
        return __classPrivateFieldGet(this, _ScopeVariableAnalysis_rootScope, "f");
    }
    getFreeVariables() {
        const result = new Map();
        for (const [name, defUse] of __classPrivateFieldGet(this, _ScopeVariableAnalysis_rootScope, "f").variables) {
            if (defUse.definitionKind !== 0 /* DefinitionKind.NONE */) {
                // Skip bound variables.
                continue;
            }
            result.set(name, defUse.uses);
        }
        return result;
    }
    getAllNames() {
        return __classPrivateFieldGet(this, _ScopeVariableAnalysis_allNames, "f");
    }
}
_ScopeVariableAnalysis_rootScope = new WeakMap(), _ScopeVariableAnalysis_allNames = new WeakMap(), _ScopeVariableAnalysis_currentScope = new WeakMap(), _ScopeVariableAnalysis_rootNode = new WeakMap(), _ScopeVariableAnalysis_instances = new WeakSet(), _ScopeVariableAnalysis_processNode = function _ScopeVariableAnalysis_processNode(node) {
    if (node === null) {
        return;
    }
    switch (node.type) {
        case 'AwaitExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.argument);
            break;
        case 'ArrayExpression':
            node.elements.forEach(item => __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, item));
            break;
        case 'ExpressionStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.expression);
            break;
        case 'Program':
            console.assert(__classPrivateFieldGet(this, _ScopeVariableAnalysis_currentScope, "f") === __classPrivateFieldGet(this, _ScopeVariableAnalysis_rootScope, "f"));
            node.body.forEach(item => __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, item));
            console.assert(__classPrivateFieldGet(this, _ScopeVariableAnalysis_currentScope, "f") === __classPrivateFieldGet(this, _ScopeVariableAnalysis_rootScope, "f"));
            break;
        case 'ArrayPattern':
            node.elements.forEach(item => __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, item));
            break;
        case 'ArrowFunctionExpression': {
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_pushScope).call(this, node.start, node.end);
            node.params.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).bind(this, 2 /* DefinitionKind.VAR */, false));
            if (node.body.type === 'BlockStatement') {
                // Include the body of the arrow function in the same scope as the arguments.
                node.body.body.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            }
            else {
                __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.body);
            }
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_popScope).call(this, true);
            break;
        }
        case 'AssignmentExpression':
        case 'AssignmentPattern':
        case 'BinaryExpression':
        case 'LogicalExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.left);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.right);
            break;
        case 'BlockStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_pushScope).call(this, node.start, node.end);
            node.body.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_popScope).call(this, false);
            break;
        case 'CallExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.callee);
            node.arguments.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            break;
        case 'VariableDeclaration': {
            const definitionKind = node.kind === 'var' ? 2 /* DefinitionKind.VAR */ : 1 /* DefinitionKind.LET */;
            node.declarations.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processVariableDeclarator).bind(this, definitionKind));
            break;
        }
        case 'CatchClause':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_pushScope).call(this, node.start, node.end);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).call(this, 1 /* DefinitionKind.LET */, false, node.param);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.body);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_popScope).call(this, false);
            break;
        case 'ClassBody':
            node.body.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            break;
        case 'ClassDeclaration':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).call(this, 1 /* DefinitionKind.LET */, false, node.id);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.superClass ?? null);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.body);
            break;
        case 'ClassExpression':
            // Intentionally ignore the id.
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.superClass ?? null);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.body);
            break;
        case 'ChainExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.expression);
            break;
        case 'ConditionalExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.test);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.consequent);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.alternate);
            break;
        case 'DoWhileStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.body);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.test);
            break;
        case 'ForInStatement':
        case 'ForOfStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_pushScope).call(this, node.start, node.end);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.left);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.right);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.body);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_popScope).call(this, false);
            break;
        case 'ForStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_pushScope).call(this, node.start, node.end);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.init ?? null);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.test ?? null);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.update ?? null);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.body);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_popScope).call(this, false);
            break;
        case 'FunctionDeclaration':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).call(this, 2 /* DefinitionKind.VAR */, false, node.id);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_pushScope).call(this, node.id?.end ?? node.start, node.end);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_addVariable).call(this, 'this', node.start, 3 /* DefinitionKind.FIXED */);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_addVariable).call(this, 'arguments', node.start, 3 /* DefinitionKind.FIXED */);
            node.params.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).bind(this, 1 /* DefinitionKind.LET */, false));
            // Process the body of the block statement directly to avoid creating new scope.
            node.body.body.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_popScope).call(this, true);
            break;
        case 'FunctionExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_pushScope).call(this, node.id?.end ?? node.start, node.end);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_addVariable).call(this, 'this', node.start, 3 /* DefinitionKind.FIXED */);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_addVariable).call(this, 'arguments', node.start, 3 /* DefinitionKind.FIXED */);
            node.params.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).bind(this, 1 /* DefinitionKind.LET */, false));
            // Process the body of the block statement directly to avoid creating new scope.
            node.body.body.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_popScope).call(this, true);
            break;
        case 'Identifier':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_addVariable).call(this, node.name, node.start);
            break;
        case 'IfStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.test);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.consequent);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.alternate ?? null);
            break;
        case 'LabeledStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.body);
            break;
        case 'MetaProperty':
            break;
        case 'MethodDefinition':
            if (node.computed) {
                __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.key);
            }
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.value);
            break;
        case 'NewExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.callee);
            node.arguments.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            break;
        case 'MemberExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.object);
            if (node.computed) {
                __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.property);
            }
            break;
        case 'ObjectExpression':
            node.properties.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            break;
        case 'ObjectPattern':
            node.properties.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            break;
        case 'PrivateIdentifier':
            break;
        case 'PropertyDefinition':
            if (node.computed) {
                __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.key);
            }
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.value ?? null);
            break;
        case 'Property':
            if (node.shorthand) {
                console.assert(node.value.type === 'Identifier');
                console.assert(node.key.type === 'Identifier');
                console.assert(node.value.name === node.key.name);
                __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_addVariable).call(this, node.value.name, node.value.start, 0 /* DefinitionKind.NONE */, true);
            }
            else {
                if (node.computed) {
                    __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.key);
                }
                __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.value);
            }
            break;
        case 'RestElement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).call(this, 1 /* DefinitionKind.LET */, false, node.argument);
            break;
        case 'ReturnStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.argument ?? null);
            break;
        case 'SequenceExpression':
            node.expressions.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            break;
        case 'SpreadElement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.argument);
            break;
        case 'SwitchCase':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.test ?? null);
            node.consequent.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            break;
        case 'SwitchStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.discriminant);
            node.cases.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            break;
        case 'TaggedTemplateExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.tag);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.quasi);
            break;
        case 'TemplateLiteral':
            node.expressions.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).bind(this));
            break;
        case 'ThisExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_addVariable).call(this, 'this', node.start);
            break;
        case 'ThrowStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.argument);
            break;
        case 'TryStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.block);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.handler ?? null);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.finalizer ?? null);
            break;
        case 'WithStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.object);
            // TODO jarin figure how to treat the with body.
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.body);
            break;
        case 'YieldExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.argument ?? null);
            break;
        case 'UnaryExpression':
        case 'UpdateExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.argument);
            break;
        case 'WhileStatement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.test);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.body);
            break;
        // Ignore, no expressions involved.
        case 'BreakStatement':
        case 'ContinueStatement':
        case 'DebuggerStatement':
        case 'EmptyStatement':
        case 'Literal':
        case 'Super':
        case 'TemplateElement':
            break;
        // Ignore, cannot be used outside of a module.
        case 'ImportDeclaration':
        case 'ImportDefaultSpecifier':
        case 'ImportNamespaceSpecifier':
        case 'ImportSpecifier':
        case 'ImportExpression':
        case 'ExportAllDeclaration':
        case 'ExportDefaultDeclaration':
        case 'ExportNamedDeclaration':
        case 'ExportSpecifier':
            break;
        case 'VariableDeclarator':
            console.error('Should not encounter VariableDeclarator in general traversal.');
            break;
    }
}, _ScopeVariableAnalysis_pushScope = function _ScopeVariableAnalysis_pushScope(start, end) {
    __classPrivateFieldSet(this, _ScopeVariableAnalysis_currentScope, new Scope(start, end, __classPrivateFieldGet(this, _ScopeVariableAnalysis_currentScope, "f")), "f");
}, _ScopeVariableAnalysis_popScope = function _ScopeVariableAnalysis_popScope(isFunctionContext) {
    if (__classPrivateFieldGet(this, _ScopeVariableAnalysis_currentScope, "f").parent === null) {
        console.error('Internal error: wrong nesting in scope analysis.');
        throw new Error('Internal error');
    }
    __classPrivateFieldGet(this, _ScopeVariableAnalysis_currentScope, "f").finalizeToParent(isFunctionContext);
    __classPrivateFieldSet(this, _ScopeVariableAnalysis_currentScope, __classPrivateFieldGet(this, _ScopeVariableAnalysis_currentScope, "f").parent, "f");
}, _ScopeVariableAnalysis_addVariable = function _ScopeVariableAnalysis_addVariable(name, offset, definitionKind = 0 /* DefinitionKind.NONE */, isShorthandAssignmentProperty = false) {
    __classPrivateFieldGet(this, _ScopeVariableAnalysis_allNames, "f").add(name);
    __classPrivateFieldGet(this, _ScopeVariableAnalysis_currentScope, "f").addVariable(name, offset, definitionKind, isShorthandAssignmentProperty);
}, _ScopeVariableAnalysis_processNodeAsDefinition = function _ScopeVariableAnalysis_processNodeAsDefinition(definitionKind, isShorthandAssignmentProperty, node) {
    if (node === null) {
        return;
    }
    switch (node.type) {
        case 'ArrayPattern':
            node.elements.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).bind(this, definitionKind, false));
            break;
        case 'AssignmentPattern':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).call(this, definitionKind, isShorthandAssignmentProperty, node.left);
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.right);
            break;
        case 'Identifier':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_addVariable).call(this, node.name, node.start, definitionKind, isShorthandAssignmentProperty);
            break;
        case 'MemberExpression':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.object);
            if (node.computed) {
                __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.property);
            }
            break;
        case 'ObjectPattern':
            node.properties.forEach(__classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).bind(this, definitionKind, false));
            break;
        case 'Property':
            if (node.computed) {
                __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, node.key);
            }
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).call(this, definitionKind, node.shorthand, node.value);
            break;
        case 'RestElement':
            __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).call(this, definitionKind, false, node.argument);
            break;
    }
}, _ScopeVariableAnalysis_processVariableDeclarator = function _ScopeVariableAnalysis_processVariableDeclarator(definitionKind, decl) {
    __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNodeAsDefinition).call(this, definitionKind, false, decl.id);
    __classPrivateFieldGet(this, _ScopeVariableAnalysis_instances, "m", _ScopeVariableAnalysis_processNode).call(this, decl.init ?? null);
};
//# sourceMappingURL=ScopeParser.js.map