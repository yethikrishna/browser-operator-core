// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as i18n from '../../../core/i18n/i18n.js';
import { ChatMessageEntity } from '../ui/ChatView.js';
const UIStrings = {};
const str_ = i18n.i18n.registerUIStrings('panels/ai_chat/core/State.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
/**
 * Creates an initial state for the agent
 */
export function createInitialState() {
    return {
        messages: [],
        context: {
            intermediateStepsCount: 0
        },
        selectedAgentType: null, // Default to no specific agent type
        currentPageUrl: '',
        currentPageTitle: '',
    };
}
/**
 * Creates a new user message
 */
export function createUserMessage(text, imageInput) {
    return {
        entity: ChatMessageEntity.USER,
        text,
        ...(imageInput && { imageInput }),
    };
}
/**
 * Creates a new model message
 * NOTE: This will likely be replaced by direct object creation in AgentNode
 */
export function createModelMessage(answer, isFinalAnswer = false) {
    // This function is now less useful as AgentNode creates the object directly
    // with action details. Keeping it temporarily might require updates later.
    return {
        entity: ChatMessageEntity.MODEL,
        action: 'final', // Assuming this simplified version is only for final answers now
        answer,
        isFinalAnswer,
    };
}
//# sourceMappingURL=State.js.map