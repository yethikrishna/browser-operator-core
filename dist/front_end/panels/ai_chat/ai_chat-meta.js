// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as i18n from '../../core/i18n/i18n.js';
import * as UI from '../../ui/legacy/legacy.js';
const UIStrings = {
    /**
     *@description Command for showing the AI Chat panel
     */
    showAiChat: 'Show AI Assistant',
    /**
     *@description Title of the AI Chat panel
     */
    aiChat: 'AI Assistant',
};
const str_ = i18n.i18n.registerUIStrings('panels/ai_chat/ai_chat-meta.ts', UIStrings);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
let loadedAIChatModule;
async function loadAIChatModule() {
    if (!loadedAIChatModule) {
        loadedAIChatModule = await import('./ai_chat.js');
    }
    return loadedAIChatModule;
}
UI.ViewManager.registerViewExtension({
    location: "panel" /* UI.ViewManager.ViewLocationValues.PANEL */,
    id: 'ai-chat',
    commandPrompt: i18nLazyString(UIStrings.showAiChat),
    title: i18nLazyString(UIStrings.aiChat),
    order: 1,
    persistence: "permanent" /* UI.ViewManager.ViewPersistence.PERMANENT */,
    async loadView() {
        const AIChat = await loadAIChatModule();
        return AIChat.AIChatPanel.AIChatPanel.instance();
    },
    iconName: 'assistant', // Using an appropriate icon
});
//# sourceMappingURL=ai_chat-meta.js.map