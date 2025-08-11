// Copyright 2016 The Chromium Authors. All rights reserved.
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
var _CharacterIdMap_elementToCharacter, _CharacterIdMap_characterToElement, _CharacterIdMap_charCode;
export class CharacterIdMap {
    constructor() {
        _CharacterIdMap_elementToCharacter.set(this, new Map());
        _CharacterIdMap_characterToElement.set(this, new Map());
        _CharacterIdMap_charCode.set(this, 33);
    }
    toChar(object) {
        var _a, _b;
        let character = __classPrivateFieldGet(this, _CharacterIdMap_elementToCharacter, "f").get(object);
        if (!character) {
            if (__classPrivateFieldGet(this, _CharacterIdMap_charCode, "f") >= 0xFFFF) {
                throw new Error('CharacterIdMap ran out of capacity!');
            }
            character = String.fromCharCode((__classPrivateFieldSet(this, _CharacterIdMap_charCode, (_b = __classPrivateFieldGet(this, _CharacterIdMap_charCode, "f"), _a = _b++, _b), "f"), _a));
            __classPrivateFieldGet(this, _CharacterIdMap_elementToCharacter, "f").set(object, character);
            __classPrivateFieldGet(this, _CharacterIdMap_characterToElement, "f").set(character, object);
        }
        return character;
    }
    fromChar(character) {
        const object = __classPrivateFieldGet(this, _CharacterIdMap_characterToElement, "f").get(character);
        if (object === undefined) {
            return null;
        }
        return object;
    }
}
_CharacterIdMap_elementToCharacter = new WeakMap(), _CharacterIdMap_characterToElement = new WeakMap(), _CharacterIdMap_charCode = new WeakMap();
//# sourceMappingURL=CharacterIdMap.js.map