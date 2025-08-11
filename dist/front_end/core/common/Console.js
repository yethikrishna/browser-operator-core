// Copyright 2014 The Chromium Authors. All rights reserved.
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
var _Console_messagesInternal;
import { ObjectWrapper } from './Object.js';
import { reveal } from './Revealer.js';
let consoleInstance;
export class Console extends ObjectWrapper {
    /**
     * Instantiable via the instance() factory below.
     */
    constructor() {
        super();
        _Console_messagesInternal.set(this, void 0);
        __classPrivateFieldSet(this, _Console_messagesInternal, [], "f");
    }
    static instance(opts) {
        if (!consoleInstance || opts?.forceNew) {
            consoleInstance = new Console();
        }
        return consoleInstance;
    }
    static removeInstance() {
        consoleInstance = undefined;
    }
    /**
     * Add a message to the Console panel.
     *
     * @param text the message text.
     * @param level the message level.
     * @param show whether to show the Console panel (if it's not already shown).
     * @param source the message source.
     */
    addMessage(text, level = "info" /* MessageLevel.INFO */, show = false, source) {
        const message = new Message(text, level, Date.now(), show, source);
        __classPrivateFieldGet(this, _Console_messagesInternal, "f").push(message);
        this.dispatchEventToListeners("messageAdded" /* Events.MESSAGE_ADDED */, message);
    }
    log(text) {
        this.addMessage(text, "info" /* MessageLevel.INFO */);
    }
    warn(text, source) {
        this.addMessage(text, "warning" /* MessageLevel.WARNING */, undefined, source);
    }
    /**
     * Adds an error message to the Console panel.
     *
     * @param text the message text.
     * @param show whether to show the Console panel (if it's not already shown).
     */
    error(text, show = true) {
        this.addMessage(text, "error" /* MessageLevel.ERROR */, show);
    }
    messages() {
        return __classPrivateFieldGet(this, _Console_messagesInternal, "f");
    }
    show() {
        void this.showPromise();
    }
    showPromise() {
        return reveal(this);
    }
}
_Console_messagesInternal = new WeakMap();
export var Events;
(function (Events) {
    Events["MESSAGE_ADDED"] = "messageAdded";
})(Events || (Events = {}));
export var MessageLevel;
(function (MessageLevel) {
    MessageLevel["INFO"] = "info";
    MessageLevel["WARNING"] = "warning";
    MessageLevel["ERROR"] = "error";
})(MessageLevel || (MessageLevel = {}));
export var FrontendMessageSource;
(function (FrontendMessageSource) {
    FrontendMessageSource["CSS"] = "css";
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Used by web_tests.
    FrontendMessageSource["ConsoleAPI"] = "console-api";
    FrontendMessageSource["ISSUE_PANEL"] = "issue-panel";
    FrontendMessageSource["SELF_XSS"] = "self-xss";
})(FrontendMessageSource || (FrontendMessageSource = {}));
export class Message {
    constructor(text, level, timestamp, show, source) {
        this.text = text;
        this.level = level;
        this.timestamp = (typeof timestamp === 'number') ? timestamp : Date.now();
        this.show = show;
        if (source) {
            this.source = source;
        }
    }
}
//# sourceMappingURL=Console.js.map