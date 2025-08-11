// Copyright 2021 The Chromium Authors. All rights reserved.
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
var _PropertiesWidget_view, _PropertiesWidget_displayNoMatchingPropertyMessage;
/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
 * Copyright (C) 2014 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import '../../ui/legacy/legacy.js';
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as ObjectUI from '../../ui/legacy/components/object_ui/object_ui.js';
import * as UI from '../../ui/legacy/legacy.js';
import { html, nothing, render } from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import propertiesWidgetStyles from './propertiesWidget.css.js';
const OBJECT_GROUP_NAME = 'properties-sidebar-pane';
const { bindToSetting } = UI.SettingsUI;
const UIStrings = {
    /**
     * @description Text on the checkbox in the Properties tab of the Elements panel, which controls whether
     * all properties of the currently selected DOM element are shown, or only meaningful properties (i.e.
     * excluding properties whose values aren't set for example).
     */
    showAll: 'Show all',
    /**
     * @description Tooltip on the checkbox in the Properties tab of the Elements panel, which controls whether
     * all properties of the currently selected DOM element are shown, or only meaningful properties (i.e.
     * excluding properties whose values aren't set for example).
     */
    showAllTooltip: 'When unchecked, only properties whose values are neither null nor undefined will be shown',
    /**
     * @description Text shown to the user when a filter is applied in the Properties tab of the Elements panel, but
     * no properties matched the filter and thus no results were returned.
     */
    noMatchingProperty: 'No matching property',
};
const str_ = i18n.i18n.registerUIStrings('panels/elements/PropertiesWidget.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export const DEFAULT_VIEW = (input, _output, target) => {
    // clang-format off
    render(html `
    <div jslog=${VisualLogging.pane('element-properties').track({ resize: true })}>
      <div class="hbox properties-widget-toolbar">
        <devtools-toolbar class="styles-pane-toolbar" role="presentation">
          <devtools-toolbar-input type="filter" @change=${input.onFilterChanged} style="flex-grow:1; flex-shrink:1"></devtools-toolbar-input>
          <devtools-checkbox title=${i18nString(UIStrings.showAllTooltip)} ${bindToSetting(getShowAllPropertiesSetting())}
              jslog=${VisualLogging.toggle('show-all-properties').track({ change: true })}>
            ${i18nString(UIStrings.showAll)}
          </devtools-checkbox>
        </devtools-toolbar>
      </div>
      ${input.displayNoMatchingPropertyMessage ? html `
        <div class="gray-info-message">${i18nString(UIStrings.noMatchingProperty)}</div>
      ` : nothing}
      ${input.treeOutlineElement}
    </div>`, target, { host: input });
    // clang-format on
};
const getShowAllPropertiesSetting = () => Common.Settings.Settings.instance().createSetting('show-all-properties', /* defaultValue */ false);
export class PropertiesWidget extends UI.ThrottledWidget.ThrottledWidget {
    constructor(throttlingTimeout, view = DEFAULT_VIEW) {
        super(true /* isWebComponent */, throttlingTimeout);
        this.filterRegex = null;
        _PropertiesWidget_view.set(this, void 0);
        _PropertiesWidget_displayNoMatchingPropertyMessage.set(this, false);
        this.registerRequiredCSS(propertiesWidgetStyles);
        this.showAllPropertiesSetting = getShowAllPropertiesSetting();
        this.showAllPropertiesSetting.addChangeListener(this.filterAndScheduleUpdate.bind(this));
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DOMModel.DOMModel, SDK.DOMModel.Events.AttrModified, this.onNodeChange, this, { scoped: true });
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DOMModel.DOMModel, SDK.DOMModel.Events.AttrRemoved, this.onNodeChange, this, { scoped: true });
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DOMModel.DOMModel, SDK.DOMModel.Events.CharacterDataModified, this.onNodeChange, this, { scoped: true });
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.DOMModel.DOMModel, SDK.DOMModel.Events.ChildNodeCountUpdated, this.onNodeChange, this, { scoped: true });
        UI.Context.Context.instance().addFlavorChangeListener(SDK.DOMModel.DOMNode, this.setNode, this);
        this.node = UI.Context.Context.instance().flavor(SDK.DOMModel.DOMNode);
        __classPrivateFieldSet(this, _PropertiesWidget_view, view, "f");
        this.treeOutline = new ObjectUI.ObjectPropertiesSection.ObjectPropertiesSectionsTreeOutline({ readOnly: true });
        this.treeOutline.setShowSelectionOnKeyboardFocus(/* show */ true, /* preventTabOrder */ false);
        this.treeOutline.addEventListener(UI.TreeOutline.Events.ElementExpanded, () => {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.DOMPropertiesExpanded);
        });
        void this.doUpdate();
    }
    onFilterChanged(event) {
        this.filterRegex = event.detail ? new RegExp(Platform.StringUtilities.escapeForRegExp(event.detail), 'i') : null;
        this.filterAndScheduleUpdate();
    }
    filterAndScheduleUpdate() {
        const previousDisplay = __classPrivateFieldGet(this, _PropertiesWidget_displayNoMatchingPropertyMessage, "f");
        this.internalFilterProperties();
        if (previousDisplay !== __classPrivateFieldGet(this, _PropertiesWidget_displayNoMatchingPropertyMessage, "f")) {
            this.update();
        }
    }
    internalFilterProperties() {
        __classPrivateFieldSet(this, _PropertiesWidget_displayNoMatchingPropertyMessage, true, "f");
        for (const element of this.treeOutline.rootElement().children()) {
            const { property } = element;
            const hidden = !property?.match({
                includeNullOrUndefinedValues: this.showAllPropertiesSetting.get(),
                regex: this.filterRegex,
            });
            __classPrivateFieldSet(this, _PropertiesWidget_displayNoMatchingPropertyMessage, __classPrivateFieldGet(this, _PropertiesWidget_displayNoMatchingPropertyMessage, "f") && hidden, "f");
            element.hidden = hidden;
        }
    }
    setNode(event) {
        this.node = event.data;
        this.update();
    }
    async doUpdate() {
        if (this.lastRequestedNode) {
            this.lastRequestedNode.domModel().runtimeModel().releaseObjectGroup(OBJECT_GROUP_NAME);
            delete this.lastRequestedNode;
        }
        if (!this.node) {
            this.treeOutline.removeChildren();
            __classPrivateFieldSet(this, _PropertiesWidget_displayNoMatchingPropertyMessage, false, "f");
        }
        else {
            this.lastRequestedNode = this.node;
            const object = await this.node.resolveToObject(OBJECT_GROUP_NAME);
            if (!object) {
                return;
            }
            const treeElement = this.treeOutline.rootElement();
            let { properties } = await SDK.RemoteObject.RemoteObject.loadFromObjectPerProto(object, true /* generatePreview */);
            treeElement.removeChildren();
            if (properties === null) {
                properties = [];
            }
            ObjectUI.ObjectPropertiesSection.ObjectPropertyTreeElement.populateWithProperties(treeElement, properties, null, true /* skipProto */, true /* skipGettersAndSetters */, object);
            this.internalFilterProperties();
        }
        __classPrivateFieldGet(this, _PropertiesWidget_view, "f").call(this, {
            onFilterChanged: this.onFilterChanged.bind(this),
            treeOutlineElement: this.treeOutline.element,
            displayNoMatchingPropertyMessage: __classPrivateFieldGet(this, _PropertiesWidget_displayNoMatchingPropertyMessage, "f"),
        }, {}, this.contentElement);
    }
    onNodeChange(event) {
        if (!this.node) {
            return;
        }
        const data = event.data;
        const node = (data instanceof SDK.DOMModel.DOMNode ? data : data.node);
        if (this.node !== node) {
            return;
        }
        this.update();
    }
}
_PropertiesWidget_view = new WeakMap(), _PropertiesWidget_displayNoMatchingPropertyMessage = new WeakMap();
//# sourceMappingURL=PropertiesWidget.js.map