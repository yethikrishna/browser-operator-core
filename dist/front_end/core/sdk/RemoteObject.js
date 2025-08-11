// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RemoteObjectImpl_runtimeModel, _RemoteObjectImpl_runtimeAgent, _RemoteObjectImpl_type, _RemoteObjectImpl_subtype, _RemoteObjectImpl_objectId, _RemoteObjectImpl_description, _RemoteObjectImpl_hasChildren, _RemoteObjectImpl_preview, _RemoteObjectImpl_unserializableValue, _RemoteObjectImpl_value, _RemoteObjectImpl_customPreview, _RemoteObjectImpl_className, _ScopeRemoteObject_scopeRef, _ScopeRemoteObject_savedScopeProperties, _LocalJSONObject_value, _LocalJSONObject_cachedDescription, _LocalJSONObject_cachedChildren, _RemoteArrayBuffer_object, _RemoteArray_object, _RemoteFunction_object, _RemoteError_instances, _RemoteError_object, _RemoteError_exceptionDetails, _RemoteError_cause, _RemoteError_lookupExceptionDetails, _RemoteError_lookupCause;
// This cannot be an interface due to "instanceof RemoteObject" checks in the code.
export class RemoteObject {
    static fromLocalObject(value) {
        return new LocalJSONObject(value);
    }
    static type(remoteObject) {
        if (remoteObject === null) {
            return 'null';
        }
        const type = typeof remoteObject;
        if (type !== 'object' && type !== 'function') {
            return type;
        }
        return remoteObject.type;
    }
    static isNullOrUndefined(remoteObject) {
        if (remoteObject === undefined) {
            return true;
        }
        switch (remoteObject.type) {
            case "object" /* Protocol.Runtime.RemoteObjectType.Object */:
                return remoteObject.subtype === "null" /* Protocol.Runtime.RemoteObjectSubtype.Null */;
            case "undefined" /* Protocol.Runtime.RemoteObjectType.Undefined */:
                return true;
            default:
                return false;
        }
    }
    static arrayNameFromDescription(description) {
        return description.replace(descriptionLengthParenRegex, '').replace(descriptionLengthSquareRegex, '');
    }
    static arrayLength(object) {
        if (object.subtype !== 'array' && object.subtype !== 'typedarray') {
            return 0;
        }
        // Array lengths in V8-generated descriptions switched from square brackets to parentheses.
        // Both formats are checked in case the front end is dealing with an old version of V8.
        const parenMatches = object.description?.match(descriptionLengthParenRegex);
        const squareMatches = object.description?.match(descriptionLengthSquareRegex);
        return parenMatches ? parseInt(parenMatches[1], 10) : (squareMatches ? parseInt(squareMatches[1], 10) : 0);
    }
    static arrayBufferByteLength(object) {
        if (object.subtype !== 'arraybuffer') {
            return 0;
        }
        const matches = object.description?.match(descriptionLengthParenRegex);
        return matches ? parseInt(matches[1], 10) : 0;
    }
    static unserializableDescription(object) {
        if (typeof object === 'number') {
            const description = String(object);
            if (object === 0 && 1 / object < 0) {
                return "-0" /* UnserializableNumber.NEGATIVE_ZERO */;
            }
            if (description === "NaN" /* UnserializableNumber.NAN */ || description === "Infinity" /* UnserializableNumber.INFINITY */ ||
                description === "-Infinity" /* UnserializableNumber.NEGATIVE_INFINITY */) {
                return description;
            }
        }
        if (typeof object === 'bigint') {
            return object + 'n';
        }
        return null;
    }
    static toCallArgument(object) {
        const type = typeof object;
        if (type === 'undefined') {
            return {};
        }
        const unserializableDescription = RemoteObject.unserializableDescription(object);
        if (type === 'number') {
            if (unserializableDescription !== null) {
                return { unserializableValue: unserializableDescription };
            }
            return { value: object };
        }
        if (type === 'bigint') {
            return { unserializableValue: unserializableDescription ?? undefined };
        }
        if (type === 'string' || type === 'boolean') {
            return { value: object };
        }
        if (!object) {
            return { value: null };
        }
        // The unserializableValue is a function on RemoteObject's and a simple property on
        // Protocol.Runtime.RemoteObject's.
        const objectAsProtocolRemoteObject = object;
        if (object instanceof RemoteObject) {
            const unserializableValue = object.unserializableValue();
            if (unserializableValue !== undefined) {
                return { unserializableValue };
            }
        }
        else if (objectAsProtocolRemoteObject.unserializableValue !== undefined) {
            return { unserializableValue: objectAsProtocolRemoteObject.unserializableValue };
        }
        if (typeof objectAsProtocolRemoteObject.objectId !== 'undefined') {
            return { objectId: objectAsProtocolRemoteObject.objectId };
        }
        return { value: objectAsProtocolRemoteObject.value };
    }
    static async loadFromObjectPerProto(object, generatePreview, nonIndexedPropertiesOnly = false) {
        const result = await Promise.all([
            object.getAllProperties(true /* accessorPropertiesOnly */, generatePreview, nonIndexedPropertiesOnly),
            object.getOwnProperties(generatePreview, nonIndexedPropertiesOnly),
        ]);
        const accessorProperties = result[0].properties;
        const ownProperties = result[1].properties;
        const internalProperties = result[1].internalProperties;
        if (!ownProperties || !accessorProperties) {
            return { properties: null, internalProperties: null };
        }
        const propertiesMap = new Map();
        const propertySymbols = [];
        for (let i = 0; i < accessorProperties.length; i++) {
            const property = accessorProperties[i];
            if (property.symbol) {
                propertySymbols.push(property);
            }
            else if (property.isOwn || property.name !== '__proto__') {
                // TODO(crbug/1076820): Eventually we should move away from
                // showing accessor #properties directly on the receiver.
                propertiesMap.set(property.name, property);
            }
        }
        for (let i = 0; i < ownProperties.length; i++) {
            const property = ownProperties[i];
            if (property.isAccessorProperty()) {
                continue;
            }
            if (property.private || property.symbol) {
                propertySymbols.push(property);
            }
            else {
                propertiesMap.set(property.name, property);
            }
        }
        return {
            properties: [...propertiesMap.values()].concat(propertySymbols),
            internalProperties: internalProperties ? internalProperties : null,
        };
    }
    customPreview() {
        return null;
    }
    unserializableValue() {
        throw new Error('Not implemented');
    }
    get preview() {
        return undefined;
    }
    get className() {
        return null;
    }
    callFunction(_functionDeclaration, _args) {
        throw new Error('Not implemented');
    }
    callFunctionJSON(_functionDeclaration, _args) {
        throw new Error('Not implemented');
    }
    arrayBufferByteLength() {
        throw new Error('Not implemented');
    }
    deleteProperty(_name) {
        throw new Error('Not implemented');
    }
    setPropertyValue(_name, _value) {
        throw new Error('Not implemented');
    }
    release() {
    }
    debuggerModel() {
        throw new Error('DebuggerModel-less object');
    }
    runtimeModel() {
        throw new Error('RuntimeModel-less object');
    }
    isNode() {
        return false;
    }
    /**
     * Checks whether this object can be inspected with the Linear memory inspector.
     * @returns `true` if this object can be inspected with the Linear memory inspector.
     */
    isLinearMemoryInspectable() {
        return false;
    }
}
export class RemoteObjectImpl extends RemoteObject {
    constructor(runtimeModel, objectId, type, subtype, value, unserializableValue, description, preview, customPreview, className) {
        super();
        _RemoteObjectImpl_runtimeModel.set(this, void 0);
        _RemoteObjectImpl_runtimeAgent.set(this, void 0);
        _RemoteObjectImpl_type.set(this, void 0);
        _RemoteObjectImpl_subtype.set(this, void 0);
        _RemoteObjectImpl_objectId.set(this, void 0);
        _RemoteObjectImpl_description.set(this, void 0);
        _RemoteObjectImpl_hasChildren.set(this, void 0);
        _RemoteObjectImpl_preview.set(this, void 0);
        _RemoteObjectImpl_unserializableValue.set(this, void 0);
        _RemoteObjectImpl_value.set(this, void 0);
        _RemoteObjectImpl_customPreview.set(this, void 0);
        _RemoteObjectImpl_className.set(this, void 0);
        __classPrivateFieldSet(this, _RemoteObjectImpl_runtimeModel, runtimeModel, "f");
        __classPrivateFieldSet(this, _RemoteObjectImpl_runtimeAgent, runtimeModel.target().runtimeAgent(), "f");
        __classPrivateFieldSet(this, _RemoteObjectImpl_type, type, "f");
        __classPrivateFieldSet(this, _RemoteObjectImpl_subtype, subtype, "f");
        if (objectId) {
            // handle
            __classPrivateFieldSet(this, _RemoteObjectImpl_objectId, objectId, "f");
            __classPrivateFieldSet(this, _RemoteObjectImpl_description, description, "f");
            __classPrivateFieldSet(this, _RemoteObjectImpl_hasChildren, (type !== 'symbol'), "f");
            __classPrivateFieldSet(this, _RemoteObjectImpl_preview, preview, "f");
        }
        else {
            __classPrivateFieldSet(this, _RemoteObjectImpl_description, description, "f");
            if (!this.description && unserializableValue) {
                __classPrivateFieldSet(this, _RemoteObjectImpl_description, unserializableValue, "f");
            }
            if (!__classPrivateFieldGet(this, _RemoteObjectImpl_description, "f") && (typeof value !== 'object' || value === null)) {
                __classPrivateFieldSet(this, _RemoteObjectImpl_description, String(value), "f");
            }
            __classPrivateFieldSet(this, _RemoteObjectImpl_hasChildren, false, "f");
            if (typeof unserializableValue === 'string') {
                __classPrivateFieldSet(this, _RemoteObjectImpl_unserializableValue, unserializableValue, "f");
                if (unserializableValue === "Infinity" /* UnserializableNumber.INFINITY */ ||
                    unserializableValue === "-Infinity" /* UnserializableNumber.NEGATIVE_INFINITY */ ||
                    unserializableValue === "-0" /* UnserializableNumber.NEGATIVE_ZERO */ ||
                    unserializableValue === "NaN" /* UnserializableNumber.NAN */) {
                    __classPrivateFieldSet(this, _RemoteObjectImpl_value, Number(unserializableValue), "f");
                }
                else if (type === 'bigint' && unserializableValue.endsWith('n')) {
                    __classPrivateFieldSet(this, _RemoteObjectImpl_value, BigInt(unserializableValue.substring(0, unserializableValue.length - 1)), "f");
                }
                else {
                    __classPrivateFieldSet(this, _RemoteObjectImpl_value, unserializableValue, "f");
                }
            }
            else {
                __classPrivateFieldSet(this, _RemoteObjectImpl_value, value, "f");
            }
        }
        __classPrivateFieldSet(this, _RemoteObjectImpl_customPreview, customPreview || null, "f");
        __classPrivateFieldSet(this, _RemoteObjectImpl_className, typeof className === 'string' ? className : null, "f");
    }
    customPreview() {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_customPreview, "f");
    }
    get objectId() {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_objectId, "f");
    }
    get type() {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_type, "f");
    }
    get subtype() {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_subtype, "f");
    }
    get value() {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_value, "f");
    }
    unserializableValue() {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_unserializableValue, "f");
    }
    get description() {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_description, "f");
    }
    set description(description) {
        __classPrivateFieldSet(this, _RemoteObjectImpl_description, description, "f");
    }
    get hasChildren() {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_hasChildren, "f");
    }
    get preview() {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_preview, "f");
    }
    get className() {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_className, "f");
    }
    getOwnProperties(generatePreview, nonIndexedPropertiesOnly = false) {
        return this.doGetProperties(true, false, nonIndexedPropertiesOnly, generatePreview);
    }
    getAllProperties(accessorPropertiesOnly, generatePreview, nonIndexedPropertiesOnly = false) {
        return this.doGetProperties(false, accessorPropertiesOnly, nonIndexedPropertiesOnly, generatePreview);
    }
    async createRemoteObject(object) {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeModel, "f").createRemoteObject(object);
    }
    async doGetProperties(ownProperties, accessorPropertiesOnly, nonIndexedPropertiesOnly, generatePreview) {
        if (!__classPrivateFieldGet(this, _RemoteObjectImpl_objectId, "f")) {
            return { properties: null, internalProperties: null };
        }
        const response = await __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeAgent, "f").invoke_getProperties({
            objectId: __classPrivateFieldGet(this, _RemoteObjectImpl_objectId, "f"),
            ownProperties,
            accessorPropertiesOnly,
            nonIndexedPropertiesOnly,
            generatePreview,
        });
        if (response.getError()) {
            return { properties: null, internalProperties: null };
        }
        if (response.exceptionDetails) {
            __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeModel, "f").exceptionThrown(Date.now(), response.exceptionDetails);
            return { properties: null, internalProperties: null };
        }
        const { result: properties = [], internalProperties = [], privateProperties = [] } = response;
        const result = [];
        for (const property of properties) {
            const propertyValue = property.value ? await this.createRemoteObject(property.value) : null;
            const propertySymbol = property.symbol ? __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeModel, "f").createRemoteObject(property.symbol) : null;
            const remoteProperty = new RemoteObjectProperty(property.name, propertyValue, Boolean(property.enumerable), Boolean(property.writable), Boolean(property.isOwn), Boolean(property.wasThrown), propertySymbol);
            if (typeof property.value === 'undefined') {
                if (property.get && property.get.type !== 'undefined') {
                    remoteProperty.getter = __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeModel, "f").createRemoteObject(property.get);
                }
                if (property.set && property.set.type !== 'undefined') {
                    remoteProperty.setter = __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeModel, "f").createRemoteObject(property.set);
                }
            }
            result.push(remoteProperty);
        }
        for (const property of privateProperties) {
            const propertyValue = property.value ? __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeModel, "f").createRemoteObject(property.value) : null;
            const remoteProperty = new RemoteObjectProperty(property.name, propertyValue, true, true, true, false, undefined, false, undefined, true);
            if (typeof property.value === 'undefined') {
                if (property.get && property.get.type !== 'undefined') {
                    remoteProperty.getter = __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeModel, "f").createRemoteObject(property.get);
                }
                if (property.set && property.set.type !== 'undefined') {
                    remoteProperty.setter = __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeModel, "f").createRemoteObject(property.set);
                }
            }
            result.push(remoteProperty);
        }
        const internalPropertiesResult = [];
        for (const property of internalProperties) {
            if (!property.value) {
                continue;
            }
            const propertyValue = __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeModel, "f").createRemoteObject(property.value);
            internalPropertiesResult.push(new RemoteObjectProperty(property.name, propertyValue, true, false, undefined, undefined, undefined, true));
        }
        return { properties: result, internalProperties: internalPropertiesResult };
    }
    async setPropertyValue(name, value) {
        if (!__classPrivateFieldGet(this, _RemoteObjectImpl_objectId, "f")) {
            return 'Can’t set a property of non-object.';
        }
        const response = await __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeAgent, "f").invoke_evaluate({ expression: value, silent: true });
        if (response.getError() || response.exceptionDetails) {
            return response.getError() ||
                (response.result.type !== 'string' ? response.result.description : response.result.value);
        }
        if (typeof name === 'string') {
            name = RemoteObject.toCallArgument(name);
        }
        const resultPromise = this.doSetObjectPropertyValue(response.result, name);
        if (response.result.objectId) {
            void __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeAgent, "f").invoke_releaseObject({ objectId: response.result.objectId });
        }
        return await resultPromise;
    }
    async doSetObjectPropertyValue(result, name) {
        // This assignment may be for a regular (data) property, and for an accessor property (with getter/setter).
        // Note the sensitive matter about accessor property: the property may be physically defined in some proto object,
        // but logically it is bound to the object in question. JavaScript passes this object to getters/setters, not the object
        // where property was defined; so do we.
        const setPropertyValueFunction = 'function(a, b) { this[a] = b; }';
        const argv = [name, RemoteObject.toCallArgument(result)];
        const response = await __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeAgent, "f").invoke_callFunctionOn({
            objectId: __classPrivateFieldGet(this, _RemoteObjectImpl_objectId, "f"),
            functionDeclaration: setPropertyValueFunction,
            arguments: argv,
            silent: true,
        });
        const error = response.getError();
        return error || response.exceptionDetails ? error || response.result.description : undefined;
    }
    async deleteProperty(name) {
        if (!__classPrivateFieldGet(this, _RemoteObjectImpl_objectId, "f")) {
            return 'Can’t delete a property of non-object.';
        }
        const deletePropertyFunction = 'function(a) { delete this[a]; return !(a in this); }';
        const response = await __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeAgent, "f").invoke_callFunctionOn({
            objectId: __classPrivateFieldGet(this, _RemoteObjectImpl_objectId, "f"),
            functionDeclaration: deletePropertyFunction,
            arguments: [name],
            silent: true,
        });
        if (response.getError() || response.exceptionDetails) {
            return response.getError() || response.result.description;
        }
        if (!response.result.value) {
            return 'Failed to delete property.';
        }
        return undefined;
    }
    async callFunction(functionDeclaration, args) {
        const response = await __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeAgent, "f").invoke_callFunctionOn({
            objectId: __classPrivateFieldGet(this, _RemoteObjectImpl_objectId, "f"),
            functionDeclaration: functionDeclaration.toString(),
            arguments: args,
            silent: true,
        });
        if (response.getError()) {
            return { object: null, wasThrown: false };
        }
        // TODO: release exceptionDetails object
        return {
            object: __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeModel, "f").createRemoteObject(response.result),
            wasThrown: Boolean(response.exceptionDetails),
        };
    }
    async callFunctionJSON(functionDeclaration, args) {
        const response = await __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeAgent, "f").invoke_callFunctionOn({
            objectId: __classPrivateFieldGet(this, _RemoteObjectImpl_objectId, "f"),
            functionDeclaration: functionDeclaration.toString(),
            arguments: args,
            silent: true,
            returnByValue: true,
        });
        if (response.getError() || response.exceptionDetails) {
            return null;
        }
        return response.result.value;
    }
    release() {
        if (!__classPrivateFieldGet(this, _RemoteObjectImpl_objectId, "f")) {
            return;
        }
        void __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeAgent, "f").invoke_releaseObject({ objectId: __classPrivateFieldGet(this, _RemoteObjectImpl_objectId, "f") });
    }
    arrayLength() {
        return RemoteObject.arrayLength(this);
    }
    arrayBufferByteLength() {
        return RemoteObject.arrayBufferByteLength(this);
    }
    debuggerModel() {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeModel, "f").debuggerModel();
    }
    runtimeModel() {
        return __classPrivateFieldGet(this, _RemoteObjectImpl_runtimeModel, "f");
    }
    isNode() {
        return Boolean(__classPrivateFieldGet(this, _RemoteObjectImpl_objectId, "f")) && this.type === 'object' && this.subtype === 'node';
    }
    isLinearMemoryInspectable() {
        return this.type === 'object' && this.subtype !== undefined &&
            ['webassemblymemory', 'typedarray', 'dataview', 'arraybuffer'].includes(this.subtype);
    }
}
_RemoteObjectImpl_runtimeModel = new WeakMap(), _RemoteObjectImpl_runtimeAgent = new WeakMap(), _RemoteObjectImpl_type = new WeakMap(), _RemoteObjectImpl_subtype = new WeakMap(), _RemoteObjectImpl_objectId = new WeakMap(), _RemoteObjectImpl_description = new WeakMap(), _RemoteObjectImpl_hasChildren = new WeakMap(), _RemoteObjectImpl_preview = new WeakMap(), _RemoteObjectImpl_unserializableValue = new WeakMap(), _RemoteObjectImpl_value = new WeakMap(), _RemoteObjectImpl_customPreview = new WeakMap(), _RemoteObjectImpl_className = new WeakMap();
export class ScopeRemoteObject extends RemoteObjectImpl {
    constructor(runtimeModel, objectId, scopeRef, type, subtype, value, unserializableValue, description, preview) {
        super(runtimeModel, objectId, type, subtype, value, unserializableValue, description, preview);
        _ScopeRemoteObject_scopeRef.set(this, void 0);
        _ScopeRemoteObject_savedScopeProperties.set(this, void 0);
        __classPrivateFieldSet(this, _ScopeRemoteObject_scopeRef, scopeRef, "f");
        __classPrivateFieldSet(this, _ScopeRemoteObject_savedScopeProperties, undefined, "f");
    }
    async doGetProperties(ownProperties, accessorPropertiesOnly, _generatePreview) {
        if (accessorPropertiesOnly) {
            return { properties: [], internalProperties: [] };
        }
        if (__classPrivateFieldGet(this, _ScopeRemoteObject_savedScopeProperties, "f")) {
            // No need to reload scope variables, as the remote object never
            // changes its #properties. If variable is updated, the #properties
            // array is patched locally.
            return { properties: __classPrivateFieldGet(this, _ScopeRemoteObject_savedScopeProperties, "f").slice(), internalProperties: null };
        }
        const allProperties = await super.doGetProperties(ownProperties, accessorPropertiesOnly, false /* nonIndexedPropertiesOnly */, true /* generatePreview */);
        if (Array.isArray(allProperties.properties)) {
            __classPrivateFieldSet(this, _ScopeRemoteObject_savedScopeProperties, allProperties.properties.slice(), "f");
        }
        return allProperties;
    }
    async doSetObjectPropertyValue(result, argumentName) {
        const name = argumentName.value;
        const error = await this.debuggerModel().setVariableValue(__classPrivateFieldGet(this, _ScopeRemoteObject_scopeRef, "f").number, name, RemoteObject.toCallArgument(result), __classPrivateFieldGet(this, _ScopeRemoteObject_scopeRef, "f").callFrameId);
        if (error) {
            return error;
        }
        if (__classPrivateFieldGet(this, _ScopeRemoteObject_savedScopeProperties, "f")) {
            for (const property of __classPrivateFieldGet(this, _ScopeRemoteObject_savedScopeProperties, "f")) {
                if (property.name === name) {
                    property.value = this.runtimeModel().createRemoteObject(result);
                }
            }
        }
        return;
    }
}
_ScopeRemoteObject_scopeRef = new WeakMap(), _ScopeRemoteObject_savedScopeProperties = new WeakMap();
export class ScopeRef {
    constructor(number, callFrameId) {
        this.number = number;
        this.callFrameId = callFrameId;
    }
}
export class RemoteObjectProperty {
    constructor(name, value, enumerable, writable, isOwn, wasThrown, symbol, synthetic, syntheticSetter, isPrivate) {
        this.name = name;
        this.value = value !== null ? value : undefined;
        this.enumerable = typeof enumerable !== 'undefined' ? enumerable : true;
        const isNonSyntheticOrSyntheticWritable = !synthetic || Boolean(syntheticSetter);
        this.writable = typeof writable !== 'undefined' ? writable : isNonSyntheticOrSyntheticWritable;
        this.isOwn = Boolean(isOwn);
        this.wasThrown = Boolean(wasThrown);
        if (symbol) {
            this.symbol = symbol;
        }
        this.synthetic = Boolean(synthetic);
        if (syntheticSetter) {
            this.syntheticSetter = syntheticSetter;
        }
        this.private = Boolean(isPrivate);
    }
    async setSyntheticValue(expression) {
        if (!this.syntheticSetter) {
            return false;
        }
        const result = await this.syntheticSetter(expression);
        if (result) {
            this.value = result;
        }
        return Boolean(result);
    }
    isAccessorProperty() {
        return Boolean(this.getter || this.setter);
    }
    match({ includeNullOrUndefinedValues, regex }) {
        if (regex !== null) {
            if (!regex.test(this.name) && !regex.test(this.value?.description ?? '')) {
                return false;
            }
        }
        if (!includeNullOrUndefinedValues) {
            if (!this.isAccessorProperty() && RemoteObject.isNullOrUndefined(this.value)) {
                return false;
            }
        }
        return true;
    }
    cloneWithNewName(newName) {
        const property = new RemoteObjectProperty(newName, this.value ?? null, this.enumerable, this.writable, this.isOwn, this.wasThrown, this.symbol, this.synthetic, this.syntheticSetter, this.private);
        property.getter = this.getter;
        property.setter = this.setter;
        return property;
    }
}
// Below is a wrapper around a local object that implements the RemoteObject interface,
// which can be used by the UI code (primarily ObjectPropertiesSection).
// Note that only JSON-compliant objects are currently supported, as there's no provision
// for traversing prototypes, extracting class names via constructor, handling #properties
// or functions.
export class LocalJSONObject extends RemoteObject {
    constructor(value) {
        super();
        _LocalJSONObject_value.set(this, void 0);
        _LocalJSONObject_cachedDescription.set(this, void 0);
        _LocalJSONObject_cachedChildren.set(this, void 0);
        __classPrivateFieldSet(this, _LocalJSONObject_value, value, "f");
    }
    get objectId() {
        return undefined;
    }
    get value() {
        return __classPrivateFieldGet(this, _LocalJSONObject_value, "f");
    }
    unserializableValue() {
        const unserializableDescription = RemoteObject.unserializableDescription(__classPrivateFieldGet(this, _LocalJSONObject_value, "f"));
        return unserializableDescription || undefined;
    }
    get description() {
        if (__classPrivateFieldGet(this, _LocalJSONObject_cachedDescription, "f")) {
            return __classPrivateFieldGet(this, _LocalJSONObject_cachedDescription, "f");
        }
        function formatArrayItem(property) {
            return this.formatValue(property.value || null);
        }
        function formatObjectItem(property) {
            let name = property.name;
            if (/^\s|\s$|^$|\n/.test(name)) {
                name = '"' + name.replace(/\n/g, '\u21B5') + '"';
            }
            return name + ': ' + this.formatValue(property.value || null);
        }
        if (this.type === 'object') {
            switch (this.subtype) {
                case 'array':
                    __classPrivateFieldSet(this, _LocalJSONObject_cachedDescription, this.concatenate('[', ']', formatArrayItem.bind(this)), "f");
                    break;
                case 'date':
                    __classPrivateFieldSet(this, _LocalJSONObject_cachedDescription, String(__classPrivateFieldGet(this, _LocalJSONObject_value, "f")), "f");
                    break;
                case 'null':
                    __classPrivateFieldSet(this, _LocalJSONObject_cachedDescription, 'null', "f");
                    break;
                default:
                    __classPrivateFieldSet(this, _LocalJSONObject_cachedDescription, this.concatenate('{', '}', formatObjectItem.bind(this)), "f");
            }
        }
        else {
            __classPrivateFieldSet(this, _LocalJSONObject_cachedDescription, String(__classPrivateFieldGet(this, _LocalJSONObject_value, "f")), "f");
        }
        return __classPrivateFieldGet(this, _LocalJSONObject_cachedDescription, "f");
    }
    formatValue(value) {
        if (!value) {
            return 'undefined';
        }
        const description = value.description || '';
        if (value.type === 'string') {
            return '"' + description.replace(/\n/g, '\u21B5') + '"';
        }
        return description;
    }
    concatenate(prefix, suffix, formatProperty) {
        const previewChars = 100;
        let buffer = prefix;
        const children = this.children();
        for (let i = 0; i < children.length; ++i) {
            const itemDescription = formatProperty(children[i]);
            if (buffer.length + itemDescription.length > previewChars) {
                buffer += ',…';
                break;
            }
            if (i) {
                buffer += ', ';
            }
            buffer += itemDescription;
        }
        buffer += suffix;
        return buffer;
    }
    get type() {
        return typeof __classPrivateFieldGet(this, _LocalJSONObject_value, "f");
    }
    get subtype() {
        if (__classPrivateFieldGet(this, _LocalJSONObject_value, "f") === null) {
            return 'null';
        }
        if (Array.isArray(__classPrivateFieldGet(this, _LocalJSONObject_value, "f"))) {
            return 'array';
        }
        if (__classPrivateFieldGet(this, _LocalJSONObject_value, "f") instanceof Date) {
            return 'date';
        }
        return undefined;
    }
    get hasChildren() {
        if ((typeof __classPrivateFieldGet(this, _LocalJSONObject_value, "f") !== 'object') || (__classPrivateFieldGet(this, _LocalJSONObject_value, "f") === null)) {
            return false;
        }
        return Boolean(Object.keys(__classPrivateFieldGet(this, _LocalJSONObject_value, "f")).length);
    }
    async getOwnProperties(_generatePreview, nonIndexedPropertiesOnly = false) {
        function isArrayIndex(name) {
            const index = Number(name) >>> 0;
            return String(index) === name;
        }
        let properties = this.children();
        if (nonIndexedPropertiesOnly) {
            properties = properties.filter(property => !isArrayIndex(property.name));
        }
        return { properties, internalProperties: null };
    }
    async getAllProperties(accessorPropertiesOnly, generatePreview, nonIndexedPropertiesOnly = false) {
        if (accessorPropertiesOnly) {
            return { properties: [], internalProperties: null };
        }
        return await this.getOwnProperties(generatePreview, nonIndexedPropertiesOnly);
    }
    children() {
        if (!this.hasChildren) {
            return [];
        }
        if (!__classPrivateFieldGet(this, _LocalJSONObject_cachedChildren, "f")) {
            __classPrivateFieldSet(this, _LocalJSONObject_cachedChildren, Object.entries(__classPrivateFieldGet(this, _LocalJSONObject_value, "f")).map(([name, value]) => {
                return new RemoteObjectProperty(name, value instanceof RemoteObject ? value : RemoteObject.fromLocalObject(value));
            }), "f");
        }
        return __classPrivateFieldGet(this, _LocalJSONObject_cachedChildren, "f");
    }
    arrayLength() {
        return Array.isArray(__classPrivateFieldGet(this, _LocalJSONObject_value, "f")) ? __classPrivateFieldGet(this, _LocalJSONObject_value, "f").length : 0;
    }
    async callFunction(functionDeclaration, args) {
        const target = __classPrivateFieldGet(this, _LocalJSONObject_value, "f");
        const rawArgs = args ? args.map(arg => arg.value) : [];
        let result;
        let wasThrown = false;
        try {
            result = functionDeclaration.apply(target, rawArgs);
        }
        catch {
            wasThrown = true;
        }
        const object = RemoteObject.fromLocalObject(result);
        return { object, wasThrown };
    }
    async callFunctionJSON(functionDeclaration, args) {
        const target = __classPrivateFieldGet(this, _LocalJSONObject_value, "f");
        const rawArgs = args ? args.map(arg => arg.value) : [];
        let result;
        try {
            result = functionDeclaration.apply(target, rawArgs);
        }
        catch {
            result = null;
        }
        return result;
    }
}
_LocalJSONObject_value = new WeakMap(), _LocalJSONObject_cachedDescription = new WeakMap(), _LocalJSONObject_cachedChildren = new WeakMap();
export class RemoteArrayBuffer {
    constructor(object) {
        _RemoteArrayBuffer_object.set(this, void 0);
        if (object.type !== 'object' || object.subtype !== 'arraybuffer') {
            throw new Error('Object is not an arraybuffer');
        }
        __classPrivateFieldSet(this, _RemoteArrayBuffer_object, object, "f");
    }
    byteLength() {
        return __classPrivateFieldGet(this, _RemoteArrayBuffer_object, "f").arrayBufferByteLength();
    }
    async bytes(start = 0, end = this.byteLength()) {
        if (start < 0 || start >= this.byteLength()) {
            throw new RangeError('start is out of range');
        }
        if (end < start || end > this.byteLength()) {
            throw new RangeError('end is out of range');
        }
        return await __classPrivateFieldGet(this, _RemoteArrayBuffer_object, "f").callFunctionJSON(bytes, [{ value: start }, { value: end - start }]);
        function bytes(offset, length) {
            return [...new Uint8Array(this, offset, length)];
        }
    }
    object() {
        return __classPrivateFieldGet(this, _RemoteArrayBuffer_object, "f");
    }
}
_RemoteArrayBuffer_object = new WeakMap();
export class RemoteArray {
    constructor(object) {
        _RemoteArray_object.set(this, void 0);
        __classPrivateFieldSet(this, _RemoteArray_object, object, "f");
    }
    static objectAsArray(object) {
        if (!object || object.type !== 'object' || (object.subtype !== 'array' && object.subtype !== 'typedarray')) {
            throw new Error('Object is empty or not an array');
        }
        return new RemoteArray(object);
    }
    static async createFromRemoteObjects(objects) {
        if (!objects.length) {
            throw new Error('Input array is empty');
        }
        const result = await objects[0].callFunction(createArray, objects.map(RemoteObject.toCallArgument));
        if (result.wasThrown || !result.object) {
            throw new Error('Call function throws exceptions or returns empty value');
        }
        return RemoteArray.objectAsArray(result.object);
        function createArray(...args) {
            return args;
        }
    }
    async at(index) {
        if (index < 0 || index > __classPrivateFieldGet(this, _RemoteArray_object, "f").arrayLength()) {
            throw new Error('Out of range');
        }
        const result = await __classPrivateFieldGet(this, _RemoteArray_object, "f").callFunction(at, [RemoteObject.toCallArgument(index)]);
        if (result.wasThrown || !result.object) {
            throw new Error('Exception in callFunction or result value is empty');
        }
        return result.object;
        function at(index) {
            return this[index];
        }
    }
    length() {
        return __classPrivateFieldGet(this, _RemoteArray_object, "f").arrayLength();
    }
    map(func) {
        const promises = [];
        for (let i = 0; i < this.length(); ++i) {
            promises.push(this.at(i).then(func));
        }
        return Promise.all(promises);
    }
    object() {
        return __classPrivateFieldGet(this, _RemoteArray_object, "f");
    }
}
_RemoteArray_object = new WeakMap();
export class RemoteFunction {
    constructor(object) {
        _RemoteFunction_object.set(this, void 0);
        __classPrivateFieldSet(this, _RemoteFunction_object, object, "f");
    }
    static objectAsFunction(object) {
        if (object.type !== 'function') {
            throw new Error('Object is empty or not a function');
        }
        return new RemoteFunction(object);
    }
    async targetFunction() {
        const ownProperties = await __classPrivateFieldGet(this, _RemoteFunction_object, "f").getOwnProperties(false /* generatePreview */);
        const targetFunction = ownProperties.internalProperties?.find(({ name }) => name === '[[TargetFunction]]');
        return targetFunction?.value ?? __classPrivateFieldGet(this, _RemoteFunction_object, "f");
    }
    async targetFunctionDetails() {
        const targetFunction = await this.targetFunction();
        const functionDetails = await targetFunction.debuggerModel().functionDetailsPromise(targetFunction);
        if (__classPrivateFieldGet(this, _RemoteFunction_object, "f") !== targetFunction) {
            targetFunction.release();
        }
        return functionDetails;
    }
}
_RemoteFunction_object = new WeakMap();
export class RemoteError {
    constructor(object) {
        _RemoteError_instances.add(this);
        _RemoteError_object.set(this, void 0);
        _RemoteError_exceptionDetails.set(this, void 0);
        _RemoteError_cause.set(this, void 0);
        __classPrivateFieldSet(this, _RemoteError_object, object, "f");
    }
    static objectAsError(object) {
        if (object.subtype !== 'error') {
            throw new Error(`Object of type ${object.subtype} is not an error`);
        }
        return new RemoteError(object);
    }
    get errorStack() {
        return __classPrivateFieldGet(this, _RemoteError_object, "f").description ?? '';
    }
    exceptionDetails() {
        if (!__classPrivateFieldGet(this, _RemoteError_exceptionDetails, "f")) {
            __classPrivateFieldSet(this, _RemoteError_exceptionDetails, __classPrivateFieldGet(this, _RemoteError_instances, "m", _RemoteError_lookupExceptionDetails).call(this), "f");
        }
        return __classPrivateFieldGet(this, _RemoteError_exceptionDetails, "f");
    }
    cause() {
        if (!__classPrivateFieldGet(this, _RemoteError_cause, "f")) {
            __classPrivateFieldSet(this, _RemoteError_cause, __classPrivateFieldGet(this, _RemoteError_instances, "m", _RemoteError_lookupCause).call(this), "f");
        }
        return __classPrivateFieldGet(this, _RemoteError_cause, "f");
    }
}
_RemoteError_object = new WeakMap(), _RemoteError_exceptionDetails = new WeakMap(), _RemoteError_cause = new WeakMap(), _RemoteError_instances = new WeakSet(), _RemoteError_lookupExceptionDetails = function _RemoteError_lookupExceptionDetails() {
    if (__classPrivateFieldGet(this, _RemoteError_object, "f").objectId) {
        return __classPrivateFieldGet(this, _RemoteError_object, "f").runtimeModel().getExceptionDetails(__classPrivateFieldGet(this, _RemoteError_object, "f").objectId);
    }
    return Promise.resolve(undefined);
}, _RemoteError_lookupCause = async function _RemoteError_lookupCause() {
    const allProperties = await __classPrivateFieldGet(this, _RemoteError_object, "f").getAllProperties(false /* accessorPropertiesOnly */, false /* generatePreview */);
    const cause = allProperties.properties?.find(prop => prop.name === 'cause');
    return cause?.value;
};
const descriptionLengthParenRegex = /\(([0-9]+)\)/;
const descriptionLengthSquareRegex = /\[([0-9]+)\]/;
var UnserializableNumber;
(function (UnserializableNumber) {
    UnserializableNumber["NEGATIVE_ZERO"] = "-0";
    UnserializableNumber["NAN"] = "NaN";
    UnserializableNumber["INFINITY"] = "Infinity";
    UnserializableNumber["NEGATIVE_INFINITY"] = "-Infinity";
})(UnserializableNumber || (UnserializableNumber = {}));
/**
 * Pair of a linear memory inspectable {@link RemoteObject} and an optional
 * expression, which identifies the variable holding the object in the
 * current scope or the name of the field holding the object.
 *
 * This data structure is used to reveal an object in the Linear Memory
 * Inspector panel.
 */
export class LinearMemoryInspectable {
    /**
     * Wrap `object` and `expression` into a reveable structure.
     *
     * @param object A linear memory inspectable {@link RemoteObject}.
     * @param expression An optional name of the field or variable holding the `object`.
     */
    constructor(object, expression) {
        if (!object.isLinearMemoryInspectable()) {
            throw new Error('object must be linear memory inspectable');
        }
        this.object = object;
        this.expression = expression;
    }
}
//# sourceMappingURL=RemoteObject.js.map