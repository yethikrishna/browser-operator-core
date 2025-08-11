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
var _RelatedInsightChips_view, _RelatedInsightChips_activeEvent, _RelatedInsightChips_eventToInsightsMap;
import * as i18n from '../../../core/i18n/i18n.js';
import * as UI from '../../../ui/legacy/legacy.js';
import * as Lit from '../../../ui/lit/lit.js';
import relatedInsightsStyles from './relatedInsightChips.css.js';
const { html, render } = Lit;
const UIStrings = {
    /**
     *@description prefix shown next to related insight chips
     */
    insightKeyword: 'Insight',
    /**
     * @description Prefix shown next to related insight chips and containing the insight name.
     * @example {Improve image delivery} PH1
     */
    insightWithName: 'Insight: {PH1}',
};
const str_ = i18n.i18n.registerUIStrings('panels/timeline/components/RelatedInsightChips.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class RelatedInsightChips extends UI.Widget.Widget {
    constructor(element, view = DEFAULT_VIEW) {
        super(false, false, element);
        _RelatedInsightChips_view.set(this, void 0);
        _RelatedInsightChips_activeEvent.set(this, null);
        _RelatedInsightChips_eventToInsightsMap.set(this, new Map());
        __classPrivateFieldSet(this, _RelatedInsightChips_view, view, "f");
    }
    set activeEvent(event) {
        if (event === __classPrivateFieldGet(this, _RelatedInsightChips_activeEvent, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _RelatedInsightChips_activeEvent, event, "f");
        this.requestUpdate();
    }
    set eventToInsightsMap(map) {
        // Purposefully don't check object equality here; the contents of the map
        // could have changed, so play it safe and always trigger a re-render.
        __classPrivateFieldSet(this, _RelatedInsightChips_eventToInsightsMap, map ?? new Map(), "f");
        this.requestUpdate();
    }
    performUpdate() {
        const input = {
            activeEvent: __classPrivateFieldGet(this, _RelatedInsightChips_activeEvent, "f"),
            eventToInsightsMap: __classPrivateFieldGet(this, _RelatedInsightChips_eventToInsightsMap, "f"),
            onInsightClick(insight) {
                insight.activateInsight();
            },
        };
        __classPrivateFieldGet(this, _RelatedInsightChips_view, "f").call(this, input, {}, this.contentElement);
    }
}
_RelatedInsightChips_view = new WeakMap(), _RelatedInsightChips_activeEvent = new WeakMap(), _RelatedInsightChips_eventToInsightsMap = new WeakMap();
export const DEFAULT_VIEW = (input, _output, target) => {
    const { activeEvent, eventToInsightsMap } = input;
    const relatedInsights = activeEvent ? eventToInsightsMap.get(activeEvent) ?? [] : [];
    if (!activeEvent || eventToInsightsMap.size === 0 || relatedInsights.length === 0) {
        render(html ``, target, { host: input });
        return;
    }
    // TODO: Render insight messages in a separate UX
    // Right before insight chips is acceptable for now
    const insightMessages = relatedInsights.flatMap(insight => {
        // TODO: support markdown (`md`).
        // clang-format off
        return insight.messages.map(message => html `
          <li class="insight-message-box">
            <button type="button" @click=${(event) => {
            event.preventDefault();
            input.onInsightClick(insight);
        }}>
              <div class="insight-label">${i18nString(UIStrings.insightWithName, {
            PH1: insight.insightLabel,
        })}</div>
              <div class="insight-message">${message}</div>
            </button>
          </li>
        `);
        // clang-format on
    });
    const insightChips = relatedInsights.flatMap(insight => {
        // clang-format off
        return [html `
          <li class="insight-chip">
            <button type="button" @click=${(event) => {
                event.preventDefault();
                input.onInsightClick(insight);
            }}>
              <span class="keyword">${i18nString(UIStrings.insightKeyword)}</span>
              <span class="insight-label">${insight.insightLabel}</span>
            </button>
          </li>
        `];
        // clang-format on
    });
    // clang-format off
    render(html `<style>${relatedInsightsStyles}</style>
        <ul>${insightMessages}</ul>
        <ul>${insightChips}</ul>`, target, { host: input });
    // clang-format on
};
//# sourceMappingURL=RelatedInsightChips.js.map