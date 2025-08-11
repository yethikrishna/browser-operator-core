// Copyright 2017 The Chromium Authors. All rights reserved.
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
var _ScreenCaptureModel_agent, _ScreenCaptureModel_nextScreencastOperationId, _ScreenCaptureModel_screencastOperations;
import { OverlayModel } from './OverlayModel.js';
import { SDKModel } from './SDKModel.js';
export var ScreenshotMode;
(function (ScreenshotMode) {
    ScreenshotMode["FROM_VIEWPORT"] = "fromViewport";
    ScreenshotMode["FROM_CLIP"] = "fromClip";
    ScreenshotMode["FULLPAGE"] = "fullpage";
})(ScreenshotMode || (ScreenshotMode = {}));
// Manages concurrent screencast requests by queuing and prioritizing.
//
// When startScreencast is invoked:
//   - If a screencast is currently active, the existing screencast's parameters and callbacks are
//     saved in the #screencastOperations array.
//   - The active screencast is then stopped.
//   - A new screencast is initiated using the parameters and callbacks from the current startScreencast call.
//
// When stopScreencast is invoked:
//   - The currently active screencast is stopped.
//   - The #screencastOperations is checked for interrupted screencast operations.
//   - If any operations are found, the latest one is started
//     using its saved parameters and callbacks.
//
// This ensures that:
//   - Only one screencast is active at a time.
//   - Interrupted screencasts are resumed after the current screencast is stopped.
// This ensures animation previews, which use screencasting, don't disrupt ongoing remote debugging sessions. Without this mechanism, stopping a preview screencast would terminate the debugging screencast, freezing the ScreencastView.
export class ScreenCaptureModel extends SDKModel {
    constructor(target) {
        super(target);
        _ScreenCaptureModel_agent.set(this, void 0);
        _ScreenCaptureModel_nextScreencastOperationId.set(this, 1);
        _ScreenCaptureModel_screencastOperations.set(this, []);
        __classPrivateFieldSet(this, _ScreenCaptureModel_agent, target.pageAgent(), "f");
        target.registerPageDispatcher(this);
    }
    async startScreencast(format, quality, maxWidth, maxHeight, everyNthFrame, onFrame, onVisibilityChanged) {
        var _a, _b;
        const currentRequest = __classPrivateFieldGet(this, _ScreenCaptureModel_screencastOperations, "f").at(-1);
        if (currentRequest) {
            // If there already is a screencast operation in progress, we need to stop it now and handle the
            // incoming request. Once that request is stopped, we'll return back to handling the stopped operation.
            await __classPrivateFieldGet(this, _ScreenCaptureModel_agent, "f").invoke_stopScreencast();
        }
        const operation = {
            id: (__classPrivateFieldSet(this, _ScreenCaptureModel_nextScreencastOperationId, (_b = __classPrivateFieldGet(this, _ScreenCaptureModel_nextScreencastOperationId, "f"), _a = _b++, _b), "f"), _a),
            request: {
                format,
                quality,
                maxWidth,
                maxHeight,
                everyNthFrame,
            },
            callbacks: {
                onScreencastFrame: onFrame,
                onScreencastVisibilityChanged: onVisibilityChanged,
            }
        };
        __classPrivateFieldGet(this, _ScreenCaptureModel_screencastOperations, "f").push(operation);
        void __classPrivateFieldGet(this, _ScreenCaptureModel_agent, "f").invoke_startScreencast({ format, quality, maxWidth, maxHeight, everyNthFrame });
        return operation.id;
    }
    stopScreencast(id) {
        const operationToStop = __classPrivateFieldGet(this, _ScreenCaptureModel_screencastOperations, "f").pop();
        if (!operationToStop) {
            throw new Error('There is no screencast operation to stop.');
        }
        if (operationToStop.id !== id) {
            throw new Error('Trying to stop a screencast operation that is not being served right now.');
        }
        void __classPrivateFieldGet(this, _ScreenCaptureModel_agent, "f").invoke_stopScreencast();
        // The latest operation is concluded, let's return back to the previous request now, if it exists.
        const nextOperation = __classPrivateFieldGet(this, _ScreenCaptureModel_screencastOperations, "f").at(-1);
        if (nextOperation) {
            void __classPrivateFieldGet(this, _ScreenCaptureModel_agent, "f").invoke_startScreencast({
                format: nextOperation.request.format,
                quality: nextOperation.request.quality,
                maxWidth: nextOperation.request.maxWidth,
                maxHeight: nextOperation.request.maxHeight,
                everyNthFrame: nextOperation.request.everyNthFrame,
            });
        }
    }
    async captureScreenshot(format, quality, mode, clip) {
        const properties = {
            format,
            quality,
            fromSurface: true,
        };
        switch (mode) {
            case "fromClip" /* ScreenshotMode.FROM_CLIP */:
                properties.captureBeyondViewport = true;
                properties.clip = clip;
                break;
            case "fullpage" /* ScreenshotMode.FULLPAGE */:
                properties.captureBeyondViewport = true;
                break;
            case "fromViewport" /* ScreenshotMode.FROM_VIEWPORT */:
                properties.captureBeyondViewport = false;
                break;
            default:
                throw new Error('Unexpected or unspecified screnshotMode');
        }
        await OverlayModel.muteHighlight();
        const result = await __classPrivateFieldGet(this, _ScreenCaptureModel_agent, "f").invoke_captureScreenshot(properties);
        await OverlayModel.unmuteHighlight();
        return result.data;
    }
    screencastFrame({ data, metadata, sessionId }) {
        void __classPrivateFieldGet(this, _ScreenCaptureModel_agent, "f").invoke_screencastFrameAck({ sessionId });
        const currentRequest = __classPrivateFieldGet(this, _ScreenCaptureModel_screencastOperations, "f").at(-1);
        if (currentRequest) {
            currentRequest.callbacks.onScreencastFrame.call(null, data, metadata);
        }
    }
    screencastVisibilityChanged({ visible }) {
        const currentRequest = __classPrivateFieldGet(this, _ScreenCaptureModel_screencastOperations, "f").at(-1);
        if (currentRequest) {
            currentRequest.callbacks.onScreencastVisibilityChanged.call(null, visible);
        }
    }
    backForwardCacheNotUsed(_params) {
    }
    domContentEventFired(_params) {
    }
    loadEventFired(_params) {
    }
    lifecycleEvent(_params) {
    }
    navigatedWithinDocument(_params) {
    }
    frameAttached(_params) {
    }
    frameNavigated(_params) {
    }
    documentOpened(_params) {
    }
    frameDetached(_params) {
    }
    frameStartedLoading(_params) {
    }
    frameStoppedLoading(_params) {
    }
    frameRequestedNavigation(_params) {
    }
    frameStartedNavigating(_params) {
    }
    frameSubtreeWillBeDetached(_params) {
    }
    frameScheduledNavigation(_params) {
    }
    frameClearedScheduledNavigation(_params) {
    }
    frameResized() {
    }
    javascriptDialogOpening(_params) {
    }
    javascriptDialogClosed(_params) {
    }
    interstitialShown() {
    }
    interstitialHidden() {
    }
    windowOpen(_params) {
    }
    fileChooserOpened(_params) {
    }
    compilationCacheProduced(_params) {
    }
    downloadWillBegin(_params) {
    }
    downloadProgress() {
    }
    prefetchStatusUpdated(_params) {
    }
    prerenderStatusUpdated(_params) {
    }
}
_ScreenCaptureModel_agent = new WeakMap(), _ScreenCaptureModel_nextScreencastOperationId = new WeakMap(), _ScreenCaptureModel_screencastOperations = new WeakMap();
SDKModel.register(ScreenCaptureModel, { capabilities: 64 /* Capability.SCREEN_CAPTURE */, autostart: false });
//# sourceMappingURL=ScreenCaptureModel.js.map