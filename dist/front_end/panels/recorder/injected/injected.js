// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _DevToolsRecorder_recordingClient, _DevToolsRecorder_selectorPicker;
import * as RecordingClient from './RecordingClient.js';
import * as SelectorPicker from './SelectorPicker.js';
class DevToolsRecorder {
    constructor() {
        _DevToolsRecorder_recordingClient.set(this, void 0);
        _DevToolsRecorder_selectorPicker.set(this, void 0);
    }
    startRecording(bindings, options) {
        if (__classPrivateFieldGet(this, _DevToolsRecorder_recordingClient, "f")) {
            throw new Error('Recording client already started.');
        }
        if (__classPrivateFieldGet(this, _DevToolsRecorder_selectorPicker, "f")) {
            throw new Error('Selector picker is active.');
        }
        __classPrivateFieldSet(this, _DevToolsRecorder_recordingClient, new RecordingClient.RecordingClient(bindings, options), "f");
        __classPrivateFieldGet(this, _DevToolsRecorder_recordingClient, "f").start();
    }
    stopRecording() {
        if (!__classPrivateFieldGet(this, _DevToolsRecorder_recordingClient, "f")) {
            throw new Error('Recording client was not started.');
        }
        __classPrivateFieldGet(this, _DevToolsRecorder_recordingClient, "f").stop();
        __classPrivateFieldSet(this, _DevToolsRecorder_recordingClient, undefined, "f");
    }
    get recordingClientForTesting() {
        if (!__classPrivateFieldGet(this, _DevToolsRecorder_recordingClient, "f")) {
            throw new Error('Recording client was not started.');
        }
        return __classPrivateFieldGet(this, _DevToolsRecorder_recordingClient, "f");
    }
    startSelectorPicker(bindings, customAttribute, debug) {
        if (__classPrivateFieldGet(this, _DevToolsRecorder_selectorPicker, "f")) {
            throw new Error('Selector picker already started.');
        }
        if (__classPrivateFieldGet(this, _DevToolsRecorder_recordingClient, "f")) {
            __classPrivateFieldGet(this, _DevToolsRecorder_recordingClient, "f").stop();
        }
        __classPrivateFieldSet(this, _DevToolsRecorder_selectorPicker, new SelectorPicker.SelectorPicker(bindings, customAttribute, debug), "f");
        __classPrivateFieldGet(this, _DevToolsRecorder_selectorPicker, "f").start();
    }
    stopSelectorPicker() {
        if (!__classPrivateFieldGet(this, _DevToolsRecorder_selectorPicker, "f")) {
            throw new Error('Selector picker was not started.');
        }
        __classPrivateFieldGet(this, _DevToolsRecorder_selectorPicker, "f").stop();
        __classPrivateFieldSet(this, _DevToolsRecorder_selectorPicker, undefined, "f");
        if (__classPrivateFieldGet(this, _DevToolsRecorder_recordingClient, "f")) {
            __classPrivateFieldGet(this, _DevToolsRecorder_recordingClient, "f").start();
        }
    }
}
_DevToolsRecorder_recordingClient = new WeakMap(), _DevToolsRecorder_selectorPicker = new WeakMap();
if (!window.DevToolsRecorder) {
    window.DevToolsRecorder = new DevToolsRecorder();
}
//# sourceMappingURL=injected.js.map