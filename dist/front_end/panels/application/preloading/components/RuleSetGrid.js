// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-lit-render-outside-of-view */
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
var _RuleSetGrid_instances, _RuleSetGrid_shadow, _RuleSetGrid_data, _RuleSetGrid_revealSpeculationRules, _RuleSetGrid_revealSpeculationRulesInElements, _RuleSetGrid_revealSpeculationRulesInNetwork, _RuleSetGrid_revealAttemptViewWithFilter, _RuleSetGrid_render, _RuleSetGrid_onRowSelected;
import '../../../../ui/legacy/components/data_grid/data_grid.js';
import '../../../../ui/components/icon_button/icon_button.js';
import * as Common from '../../../../core/common/common.js';
import * as i18n from '../../../../core/i18n/i18n.js';
import { assertNotNullOrUndefined } from '../../../../core/platform/platform.js';
import * as SDK from '../../../../core/sdk/sdk.js';
import * as LegacyWrapper from '../../../../ui/components/legacy_wrapper/legacy_wrapper.js';
import * as Lit from '../../../../ui/lit/lit.js';
import * as VisualLogging from '../../../../ui/visual_logging/visual_logging.js';
import * as NetworkForward from '../../../network/forward/forward.js';
import * as PreloadingHelper from '../helper/helper.js';
import * as PreloadingString from './PreloadingString.js';
import ruleSetGridStyles from './ruleSetGrid.css.js';
const { html, Directives: { styleMap } } = Lit;
const UIStrings = {
    /**
     *@description Column header: Short URL of rule set.
     */
    ruleSet: 'Rule set',
    /**
     *@description Column header: Show how many preloads are associated if valid, error counts if invalid.
     */
    status: 'Status',
    /**
     *@description button: Title of button to reveal the corresponding request of rule set in Elements panel
     */
    clickToOpenInElementsPanel: 'Click to open in Elements panel',
    /**
     *@description button: Title of button to reveal the corresponding request of rule set in Network panel
     */
    clickToOpenInNetworkPanel: 'Click to open in Network panel',
    /**
     *@description Value of status, specifying rule set contains how many errors.
     */
    errors: '{errorCount, plural, =1 {# error} other {# errors}}',
    /**
     *@description button: Title of button to reveal preloading attempts with filter by selected rule set
     */
    buttonRevealPreloadsAssociatedWithRuleSet: 'Reveal speculative loads associated with this rule set',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/preloading/components/RuleSetGrid.ts', UIStrings);
export const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
// Grid component to show SpeculationRules rule sets.
export class RuleSetGrid extends LegacyWrapper.LegacyWrapper.WrappableComponent {
    constructor() {
        super(...arguments);
        _RuleSetGrid_instances.add(this);
        _RuleSetGrid_shadow.set(this, this.attachShadow({ mode: 'open' }));
        _RuleSetGrid_data.set(this, null);
    }
    connectedCallback() {
        __classPrivateFieldGet(this, _RuleSetGrid_instances, "m", _RuleSetGrid_render).call(this);
    }
    update(data) {
        __classPrivateFieldSet(this, _RuleSetGrid_data, data, "f");
        __classPrivateFieldGet(this, _RuleSetGrid_instances, "m", _RuleSetGrid_render).call(this);
    }
}
_RuleSetGrid_shadow = new WeakMap(), _RuleSetGrid_data = new WeakMap(), _RuleSetGrid_instances = new WeakSet(), _RuleSetGrid_revealSpeculationRules = async function _RuleSetGrid_revealSpeculationRules(ruleSet) {
    if (ruleSet.backendNodeId !== undefined) {
        await __classPrivateFieldGet(this, _RuleSetGrid_instances, "m", _RuleSetGrid_revealSpeculationRulesInElements).call(this, ruleSet);
    }
    else if (ruleSet.url !== undefined && ruleSet.requestId) {
        await __classPrivateFieldGet(this, _RuleSetGrid_instances, "m", _RuleSetGrid_revealSpeculationRulesInNetwork).call(this, ruleSet);
    }
}, _RuleSetGrid_revealSpeculationRulesInElements = async function _RuleSetGrid_revealSpeculationRulesInElements(ruleSet) {
    assertNotNullOrUndefined(ruleSet.backendNodeId);
    const target = SDK.TargetManager.TargetManager.instance().scopeTarget();
    if (target === null) {
        return;
    }
    await Common.Revealer.reveal(new SDK.DOMModel.DeferredDOMNode(target, ruleSet.backendNodeId));
}, _RuleSetGrid_revealSpeculationRulesInNetwork = async function _RuleSetGrid_revealSpeculationRulesInNetwork(ruleSet) {
    assertNotNullOrUndefined(ruleSet.requestId);
    const request = SDK.TargetManager.TargetManager.instance()
        .scopeTarget()
        ?.model(SDK.NetworkManager.NetworkManager)
        ?.requestForId(ruleSet.requestId) ||
        null;
    if (request === null) {
        return;
    }
    const requestLocation = NetworkForward.UIRequestLocation.UIRequestLocation.tab(request, "preview" /* NetworkForward.UIRequestLocation.UIRequestTabs.PREVIEW */, { clearFilter: false });
    await Common.Revealer.reveal(requestLocation);
}, _RuleSetGrid_revealAttemptViewWithFilter = async function _RuleSetGrid_revealAttemptViewWithFilter(ruleSet) {
    await Common.Revealer.reveal(new PreloadingHelper.PreloadingForward.AttemptViewWithFilter(ruleSet.id));
}, _RuleSetGrid_render = function _RuleSetGrid_render() {
    if (__classPrivateFieldGet(this, _RuleSetGrid_data, "f") === null) {
        return;
    }
    const { rows, pageURL } = __classPrivateFieldGet(this, _RuleSetGrid_data, "f");
    // Disabled until https://crbug.com/1079231 is fixed.
    // clang-format off
    Lit.render(html `
        <style>${ruleSetGridStyles}</style>
        <div class="ruleset-container" jslog=${VisualLogging.pane('preloading-rules')}>
          <devtools-data-grid striped @select=${__classPrivateFieldGet(this, _RuleSetGrid_instances, "m", _RuleSetGrid_onRowSelected)}>
            <table>
              <tr>
                <th id="rule-set" weight="20" sortable>
                  ${i18nString(UIStrings.ruleSet)}
                </th>
                <th id="status" weight="80" sortable>
                  ${i18nString(UIStrings.status)}
                </th>
              </tr>
              ${rows.map(({ ruleSet, preloadsStatusSummary }) => {
        const location = PreloadingString.ruleSetTagOrLocationShort(ruleSet, pageURL);
        const revealInElements = ruleSet.backendNodeId !== undefined;
        const revealInNetwork = ruleSet.url !== undefined && ruleSet.requestId;
        return html `
                  <tr data-id=${ruleSet.id}>
                    <td>
                      ${revealInElements || revealInNetwork ? html `
                        <button class="link" role="link"
                            @click=${() => __classPrivateFieldGet(this, _RuleSetGrid_instances, "m", _RuleSetGrid_revealSpeculationRules).call(this, ruleSet)}
                            title=${revealInElements ? i18nString(UIStrings.clickToOpenInElementsPanel)
            : i18nString(UIStrings.clickToOpenInNetworkPanel)}
                            style=${styleMap({
            border: 'none',
            background: 'none',
            color: 'var(--icon-link)',
            cursor: 'pointer',
            'text-decoration': 'underline',
            'padding-inline-start': '0',
            'padding-inline-end': '0',
        })}
                            jslog=${VisualLogging
            .action(revealInElements ? 'reveal-in-elements' : 'reveal-in-network')
            .track({ click: true })}
                          >
                            <devtools-icon name=${revealInElements ? 'code-circle' : 'arrow-up-down-circle'}
                              style=${styleMap({
            color: 'var(--icon-link)',
            width: '16px',
            height: '16px',
            'vertical-align': 'sub',
        })}
                            ></devtools-icon>
                            ${location}
                          </button>`
            : location}
                  </td>
                  <td>
                    ${ruleSet.errorType !== undefined ? html `
                      <span style=${styleMap({ color: 'var(--sys-color-error)' })}>
                        ${i18nString(UIStrings.errors, { errorCount: 1 })}
                      </span>` : ''} ${ruleSet.errorType !== "SourceIsNotJsonObject" /* Protocol.Preload.RuleSetErrorType.SourceIsNotJsonObject */ ? html `
                      <button class="link" role="link"
                        @click=${() => __classPrivateFieldGet(this, _RuleSetGrid_instances, "m", _RuleSetGrid_revealAttemptViewWithFilter).call(this, ruleSet)}
                        title=${i18nString(UIStrings.buttonRevealPreloadsAssociatedWithRuleSet)}
                        style=${styleMap({
            color: 'var(--sys-color-primary)',
            'text-decoration': 'underline',
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            'padding-inline-start': '0',
            'padding-inline-end': '0',
        })}
                        jslog=${VisualLogging.action('reveal-preloads').track({ click: true })}>
                        ${preloadsStatusSummary}
                      </button>` : ''}
                  </td>
                </tr>
              `;
    })}
            </table>
          </devtools-data-grid>
        </div>
      `, __classPrivateFieldGet(this, _RuleSetGrid_shadow, "f"), { host: this });
    // clang-format on
}, _RuleSetGrid_onRowSelected = function _RuleSetGrid_onRowSelected(event) {
    const ruleSetId = event.detail.dataset.id;
    if (ruleSetId !== undefined) {
        this.dispatchEvent(new CustomEvent('select', { detail: ruleSetId }));
    }
};
customElements.define('devtools-resources-ruleset-grid', RuleSetGrid);
//# sourceMappingURL=RuleSetGrid.js.map