// Copyright 2022 The Chromium Authors. All rights reserved.
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
var _PreloadingTreeElementBase_model, _PreloadingTreeElementBase_viewConstructor, _PreloadingTreeElementBase_path, _PreloadingTreeElementBase_selectedInternal, _PreloadingSummaryTreeElement_model, _PreloadingSummaryTreeElement_view, _PreloadingSummaryTreeElement_selectedInternal, _PreloadingSummaryTreeElement_ruleSet, _PreloadingSummaryTreeElement_attempt;
import * as i18n from '../../core/i18n/i18n.js';
import * as IconButton from '../../ui/components/icon_button/icon_button.js';
import { ApplicationPanelTreeElement, ExpandableApplicationPanelTreeElement } from './ApplicationPanelTreeElement.js';
import { PreloadingAttemptView, PreloadingRuleSetView, PreloadingSummaryView } from './preloading/PreloadingView.js';
const UIStrings = {
    /**
     *@description Text in Application Panel Sidebar of the Application panel
     */
    speculativeLoads: 'Speculative loads',
    /**
     *@description Text in Application Panel Sidebar of the Application panel
     */
    rules: 'Rules',
    /**
     *@description Text in Application Panel Sidebar of the Application panel
     */
    speculations: 'Speculations',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/PreloadingTreeElement.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
class PreloadingTreeElementBase extends ApplicationPanelTreeElement {
    constructor(panel, viewConstructor, path, title) {
        super(panel, title, false, 'speculative-loads');
        _PreloadingTreeElementBase_model.set(this, void 0);
        _PreloadingTreeElementBase_viewConstructor.set(this, void 0);
        _PreloadingTreeElementBase_path.set(this, void 0);
        _PreloadingTreeElementBase_selectedInternal.set(this, void 0);
        __classPrivateFieldSet(this, _PreloadingTreeElementBase_viewConstructor, viewConstructor, "f");
        __classPrivateFieldSet(this, _PreloadingTreeElementBase_path, path, "f");
        const icon = IconButton.Icon.create('speculative-loads');
        this.setLeadingIcons([icon]);
        __classPrivateFieldSet(this, _PreloadingTreeElementBase_selectedInternal, false, "f");
        // TODO(https://crbug.com/1384419): Set link
    }
    get itemURL() {
        return __classPrivateFieldGet(this, _PreloadingTreeElementBase_path, "f");
    }
    initialize(model) {
        __classPrivateFieldSet(this, _PreloadingTreeElementBase_model, model, "f");
        // Show the view if the model was initialized after selection.
        if (__classPrivateFieldGet(this, _PreloadingTreeElementBase_selectedInternal, "f") && !this.view) {
            this.onselect(false);
        }
    }
    onselect(selectedByUser) {
        super.onselect(selectedByUser);
        __classPrivateFieldSet(this, _PreloadingTreeElementBase_selectedInternal, true, "f");
        if (!__classPrivateFieldGet(this, _PreloadingTreeElementBase_model, "f")) {
            return false;
        }
        if (!this.view) {
            this.view = new (__classPrivateFieldGet(this, _PreloadingTreeElementBase_viewConstructor, "f"))(__classPrivateFieldGet(this, _PreloadingTreeElementBase_model, "f"));
        }
        this.showView(this.view);
        return false;
    }
}
_PreloadingTreeElementBase_model = new WeakMap(), _PreloadingTreeElementBase_viewConstructor = new WeakMap(), _PreloadingTreeElementBase_path = new WeakMap(), _PreloadingTreeElementBase_selectedInternal = new WeakMap();
export class PreloadingSummaryTreeElement extends ExpandableApplicationPanelTreeElement {
    constructor(panel) {
        super(panel, i18nString(UIStrings.speculativeLoads), '', '', 'preloading');
        _PreloadingSummaryTreeElement_model.set(this, void 0);
        _PreloadingSummaryTreeElement_view.set(this, void 0);
        _PreloadingSummaryTreeElement_selectedInternal.set(this, void 0);
        _PreloadingSummaryTreeElement_ruleSet.set(this, null);
        _PreloadingSummaryTreeElement_attempt.set(this, null);
        const icon = IconButton.Icon.create('speculative-loads');
        this.setLeadingIcons([icon]);
        __classPrivateFieldSet(this, _PreloadingSummaryTreeElement_selectedInternal, false, "f");
        // TODO(https://crbug.com/1384419): Set link
    }
    // Note that
    //
    // - TreeElement.ensureSelection assumes TreeElement.treeOutline initialized.
    // - TreeElement.treeOutline is propagated in TreeElement.appendChild.
    //
    // So, `this.constructChildren` should be called just after `parent.appendChild(this)`
    // to enrich children with TreeElement.selectionElementInternal correctly.
    constructChildren(panel) {
        __classPrivateFieldSet(this, _PreloadingSummaryTreeElement_ruleSet, new PreloadingRuleSetTreeElement(panel), "f");
        __classPrivateFieldSet(this, _PreloadingSummaryTreeElement_attempt, new PreloadingAttemptTreeElement(panel), "f");
        this.appendChild(__classPrivateFieldGet(this, _PreloadingSummaryTreeElement_ruleSet, "f"));
        this.appendChild(__classPrivateFieldGet(this, _PreloadingSummaryTreeElement_attempt, "f"));
    }
    initialize(model) {
        if (__classPrivateFieldGet(this, _PreloadingSummaryTreeElement_ruleSet, "f") === null || __classPrivateFieldGet(this, _PreloadingSummaryTreeElement_attempt, "f") === null) {
            throw new Error('unreachable');
        }
        __classPrivateFieldSet(this, _PreloadingSummaryTreeElement_model, model, "f");
        __classPrivateFieldGet(this, _PreloadingSummaryTreeElement_ruleSet, "f").initialize(model);
        __classPrivateFieldGet(this, _PreloadingSummaryTreeElement_attempt, "f").initialize(model);
        // Show the view if the model was initialized after selection.
        if (__classPrivateFieldGet(this, _PreloadingSummaryTreeElement_selectedInternal, "f") && !__classPrivateFieldGet(this, _PreloadingSummaryTreeElement_view, "f")) {
            this.onselect(false);
        }
    }
    onselect(selectedByUser) {
        super.onselect(selectedByUser);
        __classPrivateFieldSet(this, _PreloadingSummaryTreeElement_selectedInternal, true, "f");
        if (!__classPrivateFieldGet(this, _PreloadingSummaryTreeElement_model, "f")) {
            return false;
        }
        if (!__classPrivateFieldGet(this, _PreloadingSummaryTreeElement_view, "f")) {
            __classPrivateFieldSet(this, _PreloadingSummaryTreeElement_view, new PreloadingSummaryView(__classPrivateFieldGet(this, _PreloadingSummaryTreeElement_model, "f")), "f");
        }
        this.showView(__classPrivateFieldGet(this, _PreloadingSummaryTreeElement_view, "f"));
        return false;
    }
    expandAndRevealRuleSet(revealInfo) {
        if (__classPrivateFieldGet(this, _PreloadingSummaryTreeElement_ruleSet, "f") === null) {
            throw new Error('unreachable');
        }
        this.expand();
        __classPrivateFieldGet(this, _PreloadingSummaryTreeElement_ruleSet, "f").revealRuleSet(revealInfo);
    }
    expandAndRevealAttempts(filter) {
        if (__classPrivateFieldGet(this, _PreloadingSummaryTreeElement_attempt, "f") === null) {
            throw new Error('unreachable');
        }
        this.expand();
        __classPrivateFieldGet(this, _PreloadingSummaryTreeElement_attempt, "f").revealAttempts(filter);
    }
}
_PreloadingSummaryTreeElement_model = new WeakMap(), _PreloadingSummaryTreeElement_view = new WeakMap(), _PreloadingSummaryTreeElement_selectedInternal = new WeakMap(), _PreloadingSummaryTreeElement_ruleSet = new WeakMap(), _PreloadingSummaryTreeElement_attempt = new WeakMap();
export class PreloadingRuleSetTreeElement extends PreloadingTreeElementBase {
    constructor(panel) {
        super(panel, PreloadingRuleSetView, 'preloading://rule-set', i18nString(UIStrings.rules));
    }
    revealRuleSet(revealInfo) {
        this.select();
        if (this.view === undefined) {
            return;
        }
        this.view?.revealRuleSet(revealInfo);
    }
}
class PreloadingAttemptTreeElement extends PreloadingTreeElementBase {
    constructor(panel) {
        super(panel, PreloadingAttemptView, 'preloading://attempt', i18nString(UIStrings.speculations));
    }
    revealAttempts(filter) {
        this.select();
        this.view?.setFilter(filter);
    }
}
//# sourceMappingURL=PreloadingTreeElement.js.map