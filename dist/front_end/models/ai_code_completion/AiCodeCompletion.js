// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _AiCodeCompletion_instances, _AiCodeCompletion_aidaRequestThrottler, _AiCodeCompletion_editor, _AiCodeCompletion_sessionId, _AiCodeCompletion_aidaClient, _AiCodeCompletion_serverSideLoggingEnabled, _AiCodeCompletion_buildRequest, _AiCodeCompletion_requestAidaSuggestion, _AiCodeCompletion_userTier_get, _AiCodeCompletion_options_get;
import * as Host from '../../core/host/host.js';
import * as Root from '../../core/root/root.js';
import * as TextEditor from '../../ui/components/text_editor/text_editor.js';
export class AiCodeCompletion {
    constructor(opts, editor, throttler) {
        _AiCodeCompletion_instances.add(this);
        _AiCodeCompletion_aidaRequestThrottler.set(this, void 0);
        _AiCodeCompletion_editor.set(this, void 0);
        _AiCodeCompletion_sessionId.set(this, crypto.randomUUID());
        _AiCodeCompletion_aidaClient.set(this, void 0);
        _AiCodeCompletion_serverSideLoggingEnabled.set(this, void 0);
        __classPrivateFieldSet(this, _AiCodeCompletion_aidaClient, opts.aidaClient, "f");
        __classPrivateFieldSet(this, _AiCodeCompletion_serverSideLoggingEnabled, opts.serverSideLoggingEnabled ?? false, "f");
        __classPrivateFieldSet(this, _AiCodeCompletion_editor, editor, "f");
        __classPrivateFieldSet(this, _AiCodeCompletion_aidaRequestThrottler, throttler, "f");
    }
    onTextChanged(prefix, suffix) {
        void __classPrivateFieldGet(this, _AiCodeCompletion_aidaRequestThrottler, "f").schedule(() => __classPrivateFieldGet(this, _AiCodeCompletion_instances, "m", _AiCodeCompletion_requestAidaSuggestion).call(this, __classPrivateFieldGet(this, _AiCodeCompletion_instances, "m", _AiCodeCompletion_buildRequest).call(this, prefix, suffix)));
    }
}
_AiCodeCompletion_aidaRequestThrottler = new WeakMap(), _AiCodeCompletion_editor = new WeakMap(), _AiCodeCompletion_sessionId = new WeakMap(), _AiCodeCompletion_aidaClient = new WeakMap(), _AiCodeCompletion_serverSideLoggingEnabled = new WeakMap(), _AiCodeCompletion_instances = new WeakSet(), _AiCodeCompletion_buildRequest = function _AiCodeCompletion_buildRequest(prefix, suffix, inferenceLanguage = "JAVASCRIPT" /* Host.AidaClient.AidaInferenceLanguage.JAVASCRIPT */) {
    const userTier = Host.AidaClient.convertToUserTierEnum(__classPrivateFieldGet(this, _AiCodeCompletion_instances, "a", _AiCodeCompletion_userTier_get));
    function validTemperature(temperature) {
        return typeof temperature === 'number' && temperature >= 0 ? temperature : undefined;
    }
    return {
        client: Host.AidaClient.CLIENT_NAME,
        prefix,
        suffix,
        options: {
            inference_language: inferenceLanguage,
            temperature: validTemperature(__classPrivateFieldGet(this, _AiCodeCompletion_instances, "a", _AiCodeCompletion_options_get).temperature),
            model_id: __classPrivateFieldGet(this, _AiCodeCompletion_instances, "a", _AiCodeCompletion_options_get).modelId || undefined,
        },
        metadata: {
            disable_user_content_logging: !(__classPrivateFieldGet(this, _AiCodeCompletion_serverSideLoggingEnabled, "f") ?? false),
            string_session_id: __classPrivateFieldGet(this, _AiCodeCompletion_sessionId, "f"),
            user_tier: userTier,
            client_version: Root.Runtime.getChromeVersion(),
        },
    };
}, _AiCodeCompletion_requestAidaSuggestion = async function _AiCodeCompletion_requestAidaSuggestion(request) {
    const response = await __classPrivateFieldGet(this, _AiCodeCompletion_aidaClient, "f").completeCode(request);
    if (response && response.generatedSamples.length > 0 && response.generatedSamples[0].generationString) {
        __classPrivateFieldGet(this, _AiCodeCompletion_editor, "f").dispatch({
            effects: TextEditor.Config.setAiAutoCompleteSuggestion.of(response.generatedSamples[0].generationString),
        });
    }
}, _AiCodeCompletion_userTier_get = function _AiCodeCompletion_userTier_get() {
    return Root.Runtime.hostConfig.devToolsAiCodeCompletion?.userTier;
}, _AiCodeCompletion_options_get = function _AiCodeCompletion_options_get() {
    const temperature = Root.Runtime.hostConfig.devToolsAiCodeCompletion?.temperature;
    const modelId = Root.Runtime.hostConfig.devToolsAiCodeCompletion?.modelId;
    return {
        temperature,
        modelId,
    };
};
//# sourceMappingURL=AiCodeCompletion.js.map