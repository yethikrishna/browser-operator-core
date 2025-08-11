/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var _BidiFrame_instances, _a, _BidiFrame_parent, _BidiFrame_frames, _BidiFrame_initialize, _BidiFrame_createFrameTarget, _BidiFrame_detached$, _BidiFrame_exposedFunctions, _BidiFrame_waitForLoad$, _BidiFrame_waitForNetworkIdle$;
import * as Bidi from 'chromium-bidi/lib/cjs/protocol/protocol.js';
import { combineLatest, defer, delayWhen, filter, first, firstValueFrom, map, of, race, raceWith, switchMap, } from '../../third_party/rxjs/rxjs.js';
import { Frame, throwIfDetached, } from '../api/Frame.js';
import { Accessibility } from '../cdp/Accessibility.js';
import { ConsoleMessage, } from '../common/ConsoleMessage.js';
import { TargetCloseError, UnsupportedOperation } from '../common/Errors.js';
import { debugError, fromAbortSignal, fromEmitterEvent, timeout, } from '../common/util.js';
import { isErrorLike } from '../util/ErrorLike.js';
import { BidiCdpSession } from './CDPSession.js';
import { BidiDeserializer } from './Deserializer.js';
import { BidiDialog } from './Dialog.js';
import { ExposableFunction } from './ExposedFunction.js';
import { BidiHTTPRequest, requests } from './HTTPRequest.js';
import { BidiJSHandle } from './JSHandle.js';
import { BidiFrameRealm } from './Realm.js';
import { rewriteNavigationError } from './util.js';
import { BidiWebWorker } from './WebWorker.js';
// TODO: Remove this and map CDP the correct method.
// Requires breaking change.
function convertConsoleMessageLevel(method) {
    switch (method) {
        case 'group':
            return 'startGroup';
        case 'groupCollapsed':
            return 'startGroupCollapsed';
        case 'groupEnd':
            return 'endGroup';
        default:
            return method;
    }
}
export class BidiFrame extends Frame {
    static from(parent, browsingContext) {
        const frame = new _a(parent, browsingContext);
        __classPrivateFieldGet(frame, _BidiFrame_instances, "m", _BidiFrame_initialize).call(frame);
        return frame;
    }
    constructor(parent, browsingContext) {
        super();
        _BidiFrame_instances.add(this);
        _BidiFrame_parent.set(this, void 0);
        _BidiFrame_frames.set(this, new WeakMap());
        _BidiFrame_exposedFunctions.set(this, new Map());
        __classPrivateFieldSet(this, _BidiFrame_parent, parent, "f");
        this.browsingContext = browsingContext;
        this._id = browsingContext.id;
        this.client = new BidiCdpSession(this);
        this.realms = {
            default: BidiFrameRealm.from(this.browsingContext.defaultRealm, this),
            internal: BidiFrameRealm.from(this.browsingContext.createWindowRealm(`__puppeteer_internal_${Math.ceil(Math.random() * 10000)}`), this),
        };
        this.accessibility = new Accessibility(this.realms.default, this._id);
    }
    get timeoutSettings() {
        return this.page()._timeoutSettings;
    }
    mainRealm() {
        return this.realms.default;
    }
    isolatedRealm() {
        return this.realms.internal;
    }
    realm(id) {
        for (const realm of Object.values(this.realms)) {
            if (realm.realm.id === id) {
                return realm;
            }
        }
        return;
    }
    page() {
        let parent = __classPrivateFieldGet(this, _BidiFrame_parent, "f");
        while (parent instanceof _a) {
            parent = __classPrivateFieldGet(parent, _BidiFrame_parent, "f");
        }
        return parent;
    }
    url() {
        return this.browsingContext.url;
    }
    parentFrame() {
        if (__classPrivateFieldGet(this, _BidiFrame_parent, "f") instanceof _a) {
            return __classPrivateFieldGet(this, _BidiFrame_parent, "f");
        }
        return null;
    }
    childFrames() {
        return [...this.browsingContext.children].map(child => {
            return __classPrivateFieldGet(this, _BidiFrame_frames, "f").get(child);
        });
    }
    async goto(url, options = {}) {
        const [response] = await Promise.all([
            this.waitForNavigation(options),
            // Some implementations currently only report errors when the
            // readiness=interactive.
            //
            // Related: https://bugzilla.mozilla.org/show_bug.cgi?id=1846601
            this.browsingContext
                .navigate(url, "interactive" /* Bidi.BrowsingContext.ReadinessState.Interactive */)
                .catch(error => {
                if (isErrorLike(error) &&
                    error.message.includes('net::ERR_HTTP_RESPONSE_CODE_FAILURE')) {
                    return;
                }
                if (error.message.includes('navigation canceled')) {
                    return;
                }
                if (error.message.includes('Navigation was aborted by another navigation')) {
                    return;
                }
                throw error;
            }),
        ]).catch(rewriteNavigationError(url, options.timeout ?? this.timeoutSettings.navigationTimeout()));
        return response;
    }
    async setContent(html, options = {}) {
        await Promise.all([
            this.setFrameContent(html),
            firstValueFrom(combineLatest([
                __classPrivateFieldGet(this, _BidiFrame_instances, "m", _BidiFrame_waitForLoad$).call(this, options),
                __classPrivateFieldGet(this, _BidiFrame_instances, "m", _BidiFrame_waitForNetworkIdle$).call(this, options),
            ])),
        ]);
    }
    async waitForNavigation(options = {}) {
        const { timeout: ms = this.timeoutSettings.navigationTimeout(), signal } = options;
        const frames = this.childFrames().map(frame => {
            return __classPrivateFieldGet(frame, _BidiFrame_instances, "m", _BidiFrame_detached$).call(frame);
        });
        return await firstValueFrom(combineLatest([
            race(fromEmitterEvent(this.browsingContext, 'navigation'), fromEmitterEvent(this.browsingContext, 'historyUpdated').pipe(map(() => {
                return { navigation: null };
            })))
                .pipe(first())
                .pipe(switchMap(({ navigation }) => {
                if (navigation === null) {
                    return of(null);
                }
                return __classPrivateFieldGet(this, _BidiFrame_instances, "m", _BidiFrame_waitForLoad$).call(this, options).pipe(delayWhen(() => {
                    if (frames.length === 0) {
                        return of(undefined);
                    }
                    return combineLatest(frames);
                }), raceWith(fromEmitterEvent(navigation, 'fragment'), fromEmitterEvent(navigation, 'failed'), fromEmitterEvent(navigation, 'aborted')), switchMap(() => {
                    if (navigation.request) {
                        function requestFinished$(request) {
                            if (navigation === null) {
                                return of(null);
                            }
                            // Reduces flakiness if the response events arrive after
                            // the load event.
                            // Usually, the response or error is already there at this point.
                            if (request.response || request.error) {
                                return of(navigation);
                            }
                            if (request.redirect) {
                                return requestFinished$(request.redirect);
                            }
                            return fromEmitterEvent(request, 'success')
                                .pipe(raceWith(fromEmitterEvent(request, 'error')), raceWith(fromEmitterEvent(request, 'redirect')))
                                .pipe(switchMap(() => {
                                return requestFinished$(request);
                            }));
                        }
                        return requestFinished$(navigation.request);
                    }
                    return of(navigation);
                }));
            })),
            __classPrivateFieldGet(this, _BidiFrame_instances, "m", _BidiFrame_waitForNetworkIdle$).call(this, options),
        ]).pipe(map(([navigation]) => {
            if (!navigation) {
                return null;
            }
            const request = navigation.request;
            if (!request) {
                return null;
            }
            const lastRequest = request.lastRedirect ?? request;
            const httpRequest = requests.get(lastRequest);
            return httpRequest.response();
        }), raceWith(timeout(ms), fromAbortSignal(signal), __classPrivateFieldGet(this, _BidiFrame_instances, "m", _BidiFrame_detached$).call(this).pipe(map(() => {
            throw new TargetCloseError('Frame detached.');
        })))));
    }
    waitForDevicePrompt() {
        throw new UnsupportedOperation();
    }
    get detached() {
        return this.browsingContext.closed;
    }
    async exposeFunction(name, apply) {
        if (__classPrivateFieldGet(this, _BidiFrame_exposedFunctions, "f").has(name)) {
            throw new Error(`Failed to add page binding with name ${name}: globalThis['${name}'] already exists!`);
        }
        const exposable = await ExposableFunction.from(this, name, apply);
        __classPrivateFieldGet(this, _BidiFrame_exposedFunctions, "f").set(name, exposable);
    }
    async removeExposedFunction(name) {
        const exposedFunction = __classPrivateFieldGet(this, _BidiFrame_exposedFunctions, "f").get(name);
        if (!exposedFunction) {
            throw new Error(`Failed to remove page binding with name ${name}: window['${name}'] does not exists!`);
        }
        __classPrivateFieldGet(this, _BidiFrame_exposedFunctions, "f").delete(name);
        await exposedFunction[Symbol.asyncDispose]();
    }
    async createCDPSession() {
        if (!this.page().browser().cdpSupported) {
            throw new UnsupportedOperation();
        }
        const cdpConnection = this.page().browser().cdpConnection;
        return await cdpConnection._createSession({ targetId: this._id });
    }
    async setFiles(element, files) {
        await this.browsingContext.setFiles(
        // SAFETY: ElementHandles are always remote references.
        element.remoteValue(), files);
    }
    async locateNodes(element, locator) {
        return await this.browsingContext.locateNodes(locator, 
        // SAFETY: ElementHandles are always remote references.
        [element.remoteValue()]);
    }
}
_a = BidiFrame, _BidiFrame_parent = new WeakMap(), _BidiFrame_frames = new WeakMap(), _BidiFrame_exposedFunctions = new WeakMap(), _BidiFrame_instances = new WeakSet(), _BidiFrame_initialize = function _BidiFrame_initialize() {
    for (const browsingContext of this.browsingContext.children) {
        __classPrivateFieldGet(this, _BidiFrame_instances, "m", _BidiFrame_createFrameTarget).call(this, browsingContext);
    }
    this.browsingContext.on('browsingcontext', ({ browsingContext }) => {
        __classPrivateFieldGet(this, _BidiFrame_instances, "m", _BidiFrame_createFrameTarget).call(this, browsingContext);
    });
    this.browsingContext.on('closed', () => {
        for (const session of BidiCdpSession.sessions.values()) {
            if (session.frame === this) {
                session.onClose();
            }
        }
        this.page().trustedEmitter.emit("framedetached" /* PageEvent.FrameDetached */, this);
    });
    this.browsingContext.on('request', ({ request }) => {
        const httpRequest = BidiHTTPRequest.from(request, this);
        request.once('success', () => {
            this.page().trustedEmitter.emit("requestfinished" /* PageEvent.RequestFinished */, httpRequest);
        });
        request.once('error', () => {
            this.page().trustedEmitter.emit("requestfailed" /* PageEvent.RequestFailed */, httpRequest);
        });
        void httpRequest.finalizeInterceptions();
    });
    this.browsingContext.on('navigation', ({ navigation }) => {
        navigation.once('fragment', () => {
            this.page().trustedEmitter.emit("framenavigated" /* PageEvent.FrameNavigated */, this);
        });
    });
    this.browsingContext.on('load', () => {
        this.page().trustedEmitter.emit("load" /* PageEvent.Load */, undefined);
    });
    this.browsingContext.on('DOMContentLoaded', () => {
        this._hasStartedLoading = true;
        this.page().trustedEmitter.emit("domcontentloaded" /* PageEvent.DOMContentLoaded */, undefined);
        this.page().trustedEmitter.emit("framenavigated" /* PageEvent.FrameNavigated */, this);
    });
    this.browsingContext.on('userprompt', ({ userPrompt }) => {
        this.page().trustedEmitter.emit("dialog" /* PageEvent.Dialog */, BidiDialog.from(userPrompt));
    });
    this.browsingContext.on('log', ({ entry }) => {
        if (this._id !== entry.source.context) {
            return;
        }
        if (isConsoleLogEntry(entry)) {
            const args = entry.args.map(arg => {
                return this.mainRealm().createHandle(arg);
            });
            const text = args
                .reduce((value, arg) => {
                const parsedValue = arg instanceof BidiJSHandle && arg.isPrimitiveValue
                    ? BidiDeserializer.deserialize(arg.remoteValue())
                    : arg.toString();
                return `${value} ${parsedValue}`;
            }, '')
                .slice(1);
            this.page().trustedEmitter.emit("console" /* PageEvent.Console */, new ConsoleMessage(convertConsoleMessageLevel(entry.method), text, args, getStackTraceLocations(entry.stackTrace), this));
        }
        else if (isJavaScriptLogEntry(entry)) {
            const error = new Error(entry.text ?? '');
            const messageHeight = error.message.split('\n').length;
            const messageLines = error.stack.split('\n').splice(0, messageHeight);
            const stackLines = [];
            if (entry.stackTrace) {
                for (const frame of entry.stackTrace.callFrames) {
                    // Note we need to add `1` because the values are 0-indexed.
                    stackLines.push(`    at ${frame.functionName || '<anonymous>'} (${frame.url}:${frame.lineNumber + 1}:${frame.columnNumber + 1})`);
                    if (stackLines.length >= Error.stackTraceLimit) {
                        break;
                    }
                }
            }
            error.stack = [...messageLines, ...stackLines].join('\n');
            this.page().trustedEmitter.emit("pageerror" /* PageEvent.PageError */, error);
        }
        else {
            debugError(`Unhandled LogEntry with type "${entry.type}", text "${entry.text}" and level "${entry.level}"`);
        }
    });
    this.browsingContext.on('worker', ({ realm }) => {
        const worker = BidiWebWorker.from(this, realm);
        realm.on('destroyed', () => {
            this.page().trustedEmitter.emit("workerdestroyed" /* PageEvent.WorkerDestroyed */, worker);
        });
        this.page().trustedEmitter.emit("workercreated" /* PageEvent.WorkerCreated */, worker);
    });
}, _BidiFrame_createFrameTarget = function _BidiFrame_createFrameTarget(browsingContext) {
    const frame = _a.from(this, browsingContext);
    __classPrivateFieldGet(this, _BidiFrame_frames, "f").set(browsingContext, frame);
    this.page().trustedEmitter.emit("frameattached" /* PageEvent.FrameAttached */, frame);
    browsingContext.on('closed', () => {
        __classPrivateFieldGet(this, _BidiFrame_frames, "f").delete(browsingContext);
    });
    return frame;
}, _BidiFrame_detached$ = function _BidiFrame_detached$() {
    return defer(() => {
        if (this.detached) {
            return of(this);
        }
        return fromEmitterEvent(this.page().trustedEmitter, "framedetached" /* PageEvent.FrameDetached */).pipe(filter(detachedFrame => {
            return detachedFrame === this;
        }));
    });
}, _BidiFrame_waitForLoad$ = function _BidiFrame_waitForLoad$(options = {}) {
    let { waitUntil = 'load' } = options;
    const { timeout: ms = this.timeoutSettings.navigationTimeout() } = options;
    if (!Array.isArray(waitUntil)) {
        waitUntil = [waitUntil];
    }
    const events = new Set();
    for (const lifecycleEvent of waitUntil) {
        switch (lifecycleEvent) {
            case 'load': {
                events.add('load');
                break;
            }
            case 'domcontentloaded': {
                events.add('DOMContentLoaded');
                break;
            }
        }
    }
    if (events.size === 0) {
        return of(undefined);
    }
    return combineLatest([...events].map(event => {
        return fromEmitterEvent(this.browsingContext, event);
    })).pipe(map(() => { }), first(), raceWith(timeout(ms), __classPrivateFieldGet(this, _BidiFrame_instances, "m", _BidiFrame_detached$).call(this).pipe(map(() => {
        throw new Error('Frame detached.');
    }))));
}, _BidiFrame_waitForNetworkIdle$ = function _BidiFrame_waitForNetworkIdle$(options = {}) {
    let { waitUntil = 'load' } = options;
    if (!Array.isArray(waitUntil)) {
        waitUntil = [waitUntil];
    }
    let concurrency = Infinity;
    for (const event of waitUntil) {
        switch (event) {
            case 'networkidle0': {
                concurrency = Math.min(0, concurrency);
                break;
            }
            case 'networkidle2': {
                concurrency = Math.min(2, concurrency);
                break;
            }
        }
    }
    if (concurrency === Infinity) {
        return of(undefined);
    }
    return this.page().waitForNetworkIdle$({
        idleTime: 500,
        timeout: options.timeout ?? this.timeoutSettings.timeout(),
        concurrency,
    });
};
__decorate([
    throwIfDetached,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BidiFrame.prototype, "goto", null);
__decorate([
    throwIfDetached,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BidiFrame.prototype, "setContent", null);
__decorate([
    throwIfDetached,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BidiFrame.prototype, "waitForNavigation", null);
__decorate([
    throwIfDetached,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Array]),
    __metadata("design:returntype", Promise)
], BidiFrame.prototype, "setFiles", null);
__decorate([
    throwIfDetached,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], BidiFrame.prototype, "locateNodes", null);
function isConsoleLogEntry(event) {
    return event.type === 'console';
}
function isJavaScriptLogEntry(event) {
    return event.type === 'javascript';
}
function getStackTraceLocations(stackTrace) {
    const stackTraceLocations = [];
    if (stackTrace) {
        for (const callFrame of stackTrace.callFrames) {
            stackTraceLocations.push({
                url: callFrame.url,
                lineNumber: callFrame.lineNumber,
                columnNumber: callFrame.columnNumber,
            });
        }
    }
    return stackTraceLocations;
}
//# sourceMappingURL=Frame.js.map