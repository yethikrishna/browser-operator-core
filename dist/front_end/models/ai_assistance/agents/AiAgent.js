// Copyright 2024 The Chromium Authors. All rights reserved.
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
var _AiAgent_instances, _AiAgent_sessionId, _AiAgent_aidaClient, _AiAgent_serverSideLoggingEnabled, _AiAgent_functionDeclarations, _AiAgent_structuredLog, _AiAgent_origin, _AiAgent_id, _AiAgent_history, _AiAgent_facts, _AiAgent_callFunction, _AiAgent_aidaFetch, _AiAgent_formatParsedStep, _AiAgent_removeLastRunParts, _AiAgent_createErrorResponse;
import * as Host from '../../../core/host/host.js';
import * as Root from '../../../core/root/root.js';
import { debugLog, isStructuredLogEnabled } from '../debug.js';
export var ResponseType;
(function (ResponseType) {
    ResponseType["CONTEXT"] = "context";
    ResponseType["TITLE"] = "title";
    ResponseType["THOUGHT"] = "thought";
    ResponseType["ACTION"] = "action";
    ResponseType["SIDE_EFFECT"] = "side-effect";
    ResponseType["SUGGESTIONS"] = "suggestions";
    ResponseType["ANSWER"] = "answer";
    ResponseType["ERROR"] = "error";
    ResponseType["QUERYING"] = "querying";
    ResponseType["USER_QUERY"] = "user-query";
})(ResponseType || (ResponseType = {}));
export var ErrorType;
(function (ErrorType) {
    ErrorType["UNKNOWN"] = "unknown";
    ErrorType["ABORT"] = "abort";
    ErrorType["MAX_STEPS"] = "max-steps";
    ErrorType["BLOCK"] = "block";
})(ErrorType || (ErrorType = {}));
export var MultimodalInputType;
(function (MultimodalInputType) {
    MultimodalInputType["SCREENSHOT"] = "screenshot";
    MultimodalInputType["UPLOADED_IMAGE"] = "uploaded-image";
})(MultimodalInputType || (MultimodalInputType = {}));
export const MAX_STEPS = 10;
export class ConversationContext {
    isOriginAllowed(agentOrigin) {
        if (!agentOrigin) {
            return true;
        }
        // Currently does not handle opaque origins because they
        // are not available to DevTools, instead checks
        // that serialization of the origin is the same
        // https://html.spec.whatwg.org/#ascii-serialisation-of-an-origin.
        return this.getOrigin() === agentOrigin;
    }
    /**
     * This method is called at the start of `AiAgent.run`.
     * It will be overridden in subclasses to fetch data related to the context item.
     */
    async refresh() {
        return;
    }
    async getSuggestions() {
        return;
    }
}
const OBSERVATION_PREFIX = 'OBSERVATION: ';
/**
 * AiAgent is a base class for implementing an interaction with AIDA
 * that involves one or more requests being sent to AIDA optionally
 * utilizing function calling.
 *
 * TODO: missing a test that action code is yielded before the
 * confirmation dialog.
 * TODO: missing a test for an error if it took
 * more than MAX_STEPS iterations.
 */
export class AiAgent {
    constructor(opts) {
        _AiAgent_instances.add(this);
        _AiAgent_sessionId.set(this, crypto.randomUUID());
        _AiAgent_aidaClient.set(this, void 0);
        _AiAgent_serverSideLoggingEnabled.set(this, void 0);
        _AiAgent_functionDeclarations.set(this, new Map());
        /**
         * Used in the debug mode and evals.
         */
        _AiAgent_structuredLog.set(this, []);
        /**
         * Might need to be part of history in case we allow chatting in
         * historical conversations.
         */
        _AiAgent_origin.set(this, void 0);
        _AiAgent_id.set(this, crypto.randomUUID());
        _AiAgent_history.set(this, []);
        _AiAgent_facts.set(this, new Set());
        /**
         * Special mode for StylingAgent that turns custom text output into a
         * function call.
         */
        this.functionCallEmulationEnabled = false;
        __classPrivateFieldSet(this, _AiAgent_aidaClient, opts.aidaClient, "f");
        __classPrivateFieldSet(this, _AiAgent_serverSideLoggingEnabled, opts.serverSideLoggingEnabled ?? false, "f");
        this.confirmSideEffect = opts.confirmSideEffectForTest ?? (() => Promise.withResolvers());
    }
    async enhanceQuery(query) {
        return query;
    }
    currentFacts() {
        return __classPrivateFieldGet(this, _AiAgent_facts, "f");
    }
    /**
     * Add a fact which will be sent for any subsequent requests.
     * Returns the new list of all facts.
     * Facts are never automatically removed.
     */
    addFact(fact) {
        __classPrivateFieldGet(this, _AiAgent_facts, "f").add(fact);
        return __classPrivateFieldGet(this, _AiAgent_facts, "f");
    }
    removeFact(fact) {
        return __classPrivateFieldGet(this, _AiAgent_facts, "f").delete(fact);
    }
    clearFacts() {
        __classPrivateFieldGet(this, _AiAgent_facts, "f").clear();
    }
    preambleFeatures() {
        return [];
    }
    buildRequest(part, role) {
        const parts = Array.isArray(part) ? part : [part];
        const currentMessage = {
            parts,
            role,
        };
        const history = [...__classPrivateFieldGet(this, _AiAgent_history, "f")];
        const declarations = [];
        for (const [name, definition] of __classPrivateFieldGet(this, _AiAgent_functionDeclarations, "f").entries()) {
            declarations.push({
                name,
                description: definition.description,
                parameters: definition.parameters,
            });
        }
        function validTemperature(temperature) {
            return typeof temperature === 'number' && temperature >= 0 ? temperature : undefined;
        }
        const enableAidaFunctionCalling = declarations.length && !this.functionCallEmulationEnabled;
        const userTier = Host.AidaClient.convertToUserTierEnum(this.userTier);
        const preamble = userTier === Host.AidaClient.UserTier.TESTERS ? this.preamble : undefined;
        const facts = Array.from(__classPrivateFieldGet(this, _AiAgent_facts, "f"));
        const request = {
            client: Host.AidaClient.CLIENT_NAME,
            current_message: currentMessage,
            preamble,
            historical_contexts: history.length ? history : undefined,
            facts: facts.length ? facts : undefined,
            ...(enableAidaFunctionCalling ? { function_declarations: declarations } : {}),
            options: {
                temperature: validTemperature(this.options.temperature),
                model_id: this.options.modelId || undefined,
            },
            metadata: {
                disable_user_content_logging: !(__classPrivateFieldGet(this, _AiAgent_serverSideLoggingEnabled, "f") ?? false),
                string_session_id: __classPrivateFieldGet(this, _AiAgent_sessionId, "f"),
                user_tier: userTier,
                client_version: Root.Runtime.getChromeVersion() + this.preambleFeatures().map(feature => `+${feature}`).join(''),
            },
            functionality_type: enableAidaFunctionCalling ? Host.AidaClient.FunctionalityType.AGENTIC_CHAT :
                Host.AidaClient.FunctionalityType.CHAT,
            client_feature: this.clientFeature,
        };
        return request;
    }
    get id() {
        return __classPrivateFieldGet(this, _AiAgent_id, "f");
    }
    get origin() {
        return __classPrivateFieldGet(this, _AiAgent_origin, "f");
    }
    /**
     * Parses a streaming text response into a
     * though/action/title/answer/suggestions component. This is only used
     * by StylingAgent.
     */
    parseTextResponse(response) {
        return { answer: response };
    }
    /**
     * Declare a function that the AI model can call.
     * @param name - The name of the function
     * @param declaration - the function declaration. Currently functions must:
     * 1. Return an object of serializable key/value pairs. You cannot return
     *    anything other than a plain JavaScript object that can be serialized.
     * 2. Take one parameter which is an object that can have
     *    multiple keys and values. For example, rather than a function being called
     *    with two args, `foo` and `bar`, you should instead have the function be
     *    called with one object with `foo` and `bar` keys.
     */
    declareFunction(name, declaration) {
        if (__classPrivateFieldGet(this, _AiAgent_functionDeclarations, "f").has(name)) {
            throw new Error(`Duplicate function declaration ${name}`);
        }
        __classPrivateFieldGet(this, _AiAgent_functionDeclarations, "f").set(name, declaration);
    }
    formatParsedAnswer({ answer }) {
        return answer;
    }
    emulateFunctionCall(_aidaResponse) {
        throw new Error('Unexpected emulateFunctionCall. Only StylingAgent implements function call emulation');
    }
    async *run(initialQuery, options, multimodalInput) {
        await options.selected?.refresh();
        if (options.selected) {
            // First context set on the agent determines its origin from now on.
            if (__classPrivateFieldGet(this, _AiAgent_origin, "f") === undefined) {
                __classPrivateFieldSet(this, _AiAgent_origin, options.selected.getOrigin(), "f");
            }
            if (options.selected.isOriginAllowed(__classPrivateFieldGet(this, _AiAgent_origin, "f"))) {
                this.context = options.selected;
            }
        }
        const enhancedQuery = await this.enhanceQuery(initialQuery, options.selected, multimodalInput?.type);
        Host.userMetrics.freestylerQueryLength(enhancedQuery.length);
        let query;
        query = multimodalInput ? [{ text: enhancedQuery }, multimodalInput.input] : [{ text: enhancedQuery }];
        // Request is built here to capture history up to this point.
        let request = this.buildRequest(query, Host.AidaClient.Role.USER);
        yield {
            type: "user-query" /* ResponseType.USER_QUERY */,
            query: initialQuery,
            imageInput: multimodalInput?.input,
            imageId: multimodalInput?.id,
        };
        yield* this.handleContextDetails(options.selected);
        for (let i = 0; i < MAX_STEPS; i++) {
            yield {
                type: "querying" /* ResponseType.QUERYING */,
            };
            let rpcId;
            let textResponse = '';
            let functionCall = undefined;
            try {
                for await (const fetchResult of __classPrivateFieldGet(this, _AiAgent_instances, "m", _AiAgent_aidaFetch).call(this, request, { signal: options.signal })) {
                    rpcId = fetchResult.rpcId;
                    textResponse = fetchResult.text ?? '';
                    functionCall = fetchResult.functionCall;
                    if (!functionCall && !fetchResult.completed) {
                        const parsed = this.parseTextResponse(textResponse);
                        const partialAnswer = 'answer' in parsed ? parsed.answer : '';
                        if (!partialAnswer) {
                            continue;
                        }
                        // Only yield partial responses here and do not add partial answers to the history.
                        yield {
                            type: "answer" /* ResponseType.ANSWER */,
                            text: partialAnswer,
                            complete: false,
                        };
                    }
                }
            }
            catch (err) {
                debugLog('Error calling the AIDA API', err);
                let error = "unknown" /* ErrorType.UNKNOWN */;
                if (err instanceof Host.AidaClient.AidaAbortError) {
                    error = "abort" /* ErrorType.ABORT */;
                }
                else if (err instanceof Host.AidaClient.AidaBlockError) {
                    error = "block" /* ErrorType.BLOCK */;
                }
                yield __classPrivateFieldGet(this, _AiAgent_instances, "m", _AiAgent_createErrorResponse).call(this, error);
                break;
            }
            __classPrivateFieldGet(this, _AiAgent_history, "f").push(request.current_message);
            if (textResponse) {
                const parsedResponse = this.parseTextResponse(textResponse);
                if (!('answer' in parsedResponse)) {
                    throw new Error('Expected a completed response to have an answer');
                }
                __classPrivateFieldGet(this, _AiAgent_history, "f").push({
                    parts: [{
                            text: this.formatParsedAnswer(parsedResponse),
                        }],
                    role: Host.AidaClient.Role.MODEL,
                });
                Host.userMetrics.actionTaken(Host.UserMetrics.Action.AiAssistanceAnswerReceived);
                yield {
                    type: "answer" /* ResponseType.ANSWER */,
                    text: parsedResponse.answer,
                    suggestions: parsedResponse.suggestions,
                    complete: true,
                    rpcId,
                };
                break;
            }
            if (functionCall) {
                try {
                    const result = yield* __classPrivateFieldGet(this, _AiAgent_instances, "m", _AiAgent_callFunction).call(this, functionCall.name, functionCall.args, options);
                    if (options.signal?.aborted) {
                        yield __classPrivateFieldGet(this, _AiAgent_instances, "m", _AiAgent_createErrorResponse).call(this, "abort" /* ErrorType.ABORT */);
                        break;
                    }
                    query = this.functionCallEmulationEnabled ? { text: OBSERVATION_PREFIX + result.result } : {
                        functionResponse: {
                            name: functionCall.name,
                            response: result,
                        },
                    };
                    request = this.buildRequest(query, this.functionCallEmulationEnabled ? Host.AidaClient.Role.USER : Host.AidaClient.Role.ROLE_UNSPECIFIED);
                }
                catch {
                    yield __classPrivateFieldGet(this, _AiAgent_instances, "m", _AiAgent_createErrorResponse).call(this, "unknown" /* ErrorType.UNKNOWN */);
                    break;
                }
            }
            else {
                yield __classPrivateFieldGet(this, _AiAgent_instances, "m", _AiAgent_createErrorResponse).call(this, i - 1 === MAX_STEPS ? "max-steps" /* ErrorType.MAX_STEPS */ : "unknown" /* ErrorType.UNKNOWN */);
                break;
            }
        }
        if (isStructuredLogEnabled()) {
            window.dispatchEvent(new CustomEvent('aiassistancedone'));
        }
    }
}
_AiAgent_sessionId = new WeakMap(), _AiAgent_aidaClient = new WeakMap(), _AiAgent_serverSideLoggingEnabled = new WeakMap(), _AiAgent_functionDeclarations = new WeakMap(), _AiAgent_structuredLog = new WeakMap(), _AiAgent_origin = new WeakMap(), _AiAgent_id = new WeakMap(), _AiAgent_history = new WeakMap(), _AiAgent_facts = new WeakMap(), _AiAgent_instances = new WeakSet(), _AiAgent_callFunction = async function* _AiAgent_callFunction(name, args, options) {
    const call = __classPrivateFieldGet(this, _AiAgent_functionDeclarations, "f").get(name);
    if (!call) {
        throw new Error(`Function ${name} is not found.`);
    }
    if (this.functionCallEmulationEnabled) {
        if (!call.displayInfoFromArgs) {
            throw new Error('functionCallEmulationEnabled requires all functions to provide displayInfoFromArgs');
        }
        // Emulated function calls are formatted as text.
        __classPrivateFieldGet(this, _AiAgent_history, "f").push({
            parts: [{ text: __classPrivateFieldGet(this, _AiAgent_instances, "m", _AiAgent_formatParsedStep).call(this, call.displayInfoFromArgs(args)) }],
            role: Host.AidaClient.Role.MODEL,
        });
    }
    else {
        __classPrivateFieldGet(this, _AiAgent_history, "f").push({
            parts: [{
                    functionCall: {
                        name,
                        args,
                    },
                }],
            role: Host.AidaClient.Role.MODEL,
        });
    }
    let code;
    if (call.displayInfoFromArgs) {
        const { title, thought, action: callCode } = call.displayInfoFromArgs(args);
        code = callCode;
        if (title) {
            yield {
                type: "title" /* ResponseType.TITLE */,
                title,
            };
        }
        if (thought) {
            yield {
                type: "thought" /* ResponseType.THOUGHT */,
                thought,
            };
        }
    }
    let result = await call.handler(args, options);
    if ('requiresApproval' in result) {
        if (code) {
            yield {
                type: "action" /* ResponseType.ACTION */,
                code,
                canceled: false,
            };
        }
        const sideEffectConfirmationPromiseWithResolvers = this.confirmSideEffect();
        void sideEffectConfirmationPromiseWithResolvers.promise.then(result => {
            Host.userMetrics.actionTaken(result ? Host.UserMetrics.Action.AiAssistanceSideEffectConfirmed :
                Host.UserMetrics.Action.AiAssistanceSideEffectRejected);
        });
        if (options?.signal?.aborted) {
            sideEffectConfirmationPromiseWithResolvers.resolve(false);
        }
        options?.signal?.addEventListener('abort', () => {
            sideEffectConfirmationPromiseWithResolvers.resolve(false);
        }, { once: true });
        yield {
            type: "side-effect" /* ResponseType.SIDE_EFFECT */,
            confirm: (result) => {
                sideEffectConfirmationPromiseWithResolvers.resolve(result);
            },
        };
        const approvedRun = await sideEffectConfirmationPromiseWithResolvers.promise;
        if (!approvedRun) {
            yield {
                type: "action" /* ResponseType.ACTION */,
                code,
                output: 'Error: User denied code execution with side effects.',
                canceled: true,
            };
            return {
                result: 'Error: User denied code execution with side effects.',
            };
        }
        result = await call.handler(args, {
            ...options,
            approved: approvedRun,
        });
    }
    if ('result' in result) {
        yield {
            type: "action" /* ResponseType.ACTION */,
            code,
            output: typeof result.result === 'string' ? result.result : JSON.stringify(result.result),
            canceled: false,
        };
    }
    if ('error' in result) {
        yield {
            type: "action" /* ResponseType.ACTION */,
            code,
            output: result.error,
            canceled: false,
        };
    }
    return result;
}, _AiAgent_aidaFetch = async function* _AiAgent_aidaFetch(request, options) {
    let aidaResponse = undefined;
    let rpcId;
    for await (aidaResponse of __classPrivateFieldGet(this, _AiAgent_aidaClient, "f").doConversation(request, options)) {
        if (aidaResponse.functionCalls?.length) {
            debugLog('functionCalls.length', aidaResponse.functionCalls.length);
            yield {
                rpcId,
                functionCall: aidaResponse.functionCalls[0],
                completed: true,
            };
            break;
        }
        if (this.functionCallEmulationEnabled) {
            const emulatedFunctionCall = this.emulateFunctionCall(aidaResponse);
            if (emulatedFunctionCall === 'wait-for-completion') {
                continue;
            }
            if (emulatedFunctionCall !== 'no-function-call') {
                yield {
                    rpcId,
                    functionCall: emulatedFunctionCall,
                    completed: true,
                };
                break;
            }
        }
        rpcId = aidaResponse.metadata.rpcGlobalId ?? rpcId;
        yield {
            rpcId,
            text: aidaResponse.explanation,
            completed: aidaResponse.completed,
        };
    }
    debugLog({
        request,
        response: aidaResponse,
    });
    if (isStructuredLogEnabled() && aidaResponse) {
        __classPrivateFieldGet(this, _AiAgent_structuredLog, "f").push({
            request: structuredClone(request),
            aidaResponse,
        });
        localStorage.setItem('aiAssistanceStructuredLog', JSON.stringify(__classPrivateFieldGet(this, _AiAgent_structuredLog, "f")));
    }
}, _AiAgent_formatParsedStep = function _AiAgent_formatParsedStep(step) {
    let text = '';
    if (step.thought) {
        text = `THOUGHT: ${step.thought}`;
    }
    if (step.title) {
        text += `\nTITLE: ${step.title}`;
    }
    if (step.action) {
        text += `\nACTION
${step.action}
STOP`;
    }
    return text;
}, _AiAgent_removeLastRunParts = function _AiAgent_removeLastRunParts() {
    __classPrivateFieldGet(this, _AiAgent_history, "f").splice(__classPrivateFieldGet(this, _AiAgent_history, "f").findLastIndex(item => {
        return item.role === Host.AidaClient.Role.USER;
    }));
}, _AiAgent_createErrorResponse = function _AiAgent_createErrorResponse(error) {
    __classPrivateFieldGet(this, _AiAgent_instances, "m", _AiAgent_removeLastRunParts).call(this);
    if (error !== "abort" /* ErrorType.ABORT */) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.AiAssistanceError);
    }
    return {
        type: "error" /* ResponseType.ERROR */,
        error,
    };
};
//# sourceMappingURL=AiAgent.js.map