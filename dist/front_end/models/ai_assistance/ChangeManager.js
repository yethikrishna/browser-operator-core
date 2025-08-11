// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ChangeManager_instances, _ChangeManager_stylesheetMutex, _ChangeManager_cssModelToStylesheetId, _ChangeManager_stylesheetChanges, _ChangeManager_backupStylesheetChanges, _ChangeManager_formatChangesForInspectorStylesheet, _ChangeManager_formatChange, _ChangeManager_getStylesheet, _ChangeManager_onCssModelDisposed;
import * as Common from '../../core/common/common.js';
import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
function formatStyles(styles, indent = 2) {
    const lines = Object.entries(styles).map(([key, value]) => `${' '.repeat(indent)}${key}: ${value};`);
    return lines.join('\n');
}
/**
 * Keeps track of changes done by the Styling agent. Currently, it is
 * primarily for stylesheet generation based on all changes.
 */
export class ChangeManager {
    constructor() {
        _ChangeManager_instances.add(this);
        _ChangeManager_stylesheetMutex.set(this, new Common.Mutex.Mutex());
        _ChangeManager_cssModelToStylesheetId.set(this, new Map());
        _ChangeManager_stylesheetChanges.set(this, new Map());
        _ChangeManager_backupStylesheetChanges.set(this, new Map());
    }
    async stashChanges() {
        for (const [cssModel, stylesheetMap] of __classPrivateFieldGet(this, _ChangeManager_cssModelToStylesheetId, "f").entries()) {
            const stylesheetIds = Array.from(stylesheetMap.values());
            await Promise.allSettled(stylesheetIds.map(async (id) => {
                __classPrivateFieldGet(this, _ChangeManager_backupStylesheetChanges, "f").set(id, __classPrivateFieldGet(this, _ChangeManager_stylesheetChanges, "f").get(id) ?? []);
                __classPrivateFieldGet(this, _ChangeManager_stylesheetChanges, "f").delete(id);
                await cssModel.setStyleSheetText(id, '', true);
            }));
        }
    }
    dropStashedChanges() {
        __classPrivateFieldGet(this, _ChangeManager_backupStylesheetChanges, "f").clear();
    }
    async popStashedChanges() {
        const cssModelAndStyleSheets = Array.from(__classPrivateFieldGet(this, _ChangeManager_cssModelToStylesheetId, "f").entries());
        await Promise.allSettled(cssModelAndStyleSheets.map(async ([cssModel, stylesheetMap]) => {
            const frameAndStylesheet = Array.from(stylesheetMap.entries());
            return await Promise.allSettled(frameAndStylesheet.map(async ([frameId, stylesheetId]) => {
                const changes = __classPrivateFieldGet(this, _ChangeManager_backupStylesheetChanges, "f").get(stylesheetId) ?? [];
                return await Promise.allSettled(changes.map(async (change) => {
                    return await this.addChange(cssModel, frameId, change);
                }));
            }));
        }));
    }
    async clear() {
        const models = Array.from(__classPrivateFieldGet(this, _ChangeManager_cssModelToStylesheetId, "f").keys());
        const results = await Promise.allSettled(models.map(async (model) => {
            await __classPrivateFieldGet(this, _ChangeManager_instances, "m", _ChangeManager_onCssModelDisposed).call(this, { data: model });
        }));
        __classPrivateFieldGet(this, _ChangeManager_cssModelToStylesheetId, "f").clear();
        __classPrivateFieldGet(this, _ChangeManager_stylesheetChanges, "f").clear();
        __classPrivateFieldGet(this, _ChangeManager_backupStylesheetChanges, "f").clear();
        const firstFailed = results.find(result => result.status === 'rejected');
        if (firstFailed) {
            console.error(firstFailed.reason);
        }
    }
    async addChange(cssModel, frameId, change) {
        const stylesheetId = await __classPrivateFieldGet(this, _ChangeManager_instances, "m", _ChangeManager_getStylesheet).call(this, cssModel, frameId);
        const changes = __classPrivateFieldGet(this, _ChangeManager_stylesheetChanges, "f").get(stylesheetId) || [];
        const existingChange = changes.find(c => c.className === change.className);
        // Make sure teh styles are real CSS values.
        const stylesKebab = Platform.StringUtilities.toKebabCaseKeys(change.styles);
        if (existingChange) {
            Object.assign(existingChange.styles, stylesKebab);
            // This combines all style changes for a given element,
            // regardless of the conversation they originated from, into a single rule.
            // While separating these changes by conversation would be ideal,
            // it currently causes crashes in the Styles tab when duplicate selectors exist (crbug.com/393515428).
            // This workaround avoids that crash.
            existingChange.groupId = change.groupId;
        }
        else {
            changes.push({
                ...change,
                styles: stylesKebab,
            });
        }
        const content = __classPrivateFieldGet(this, _ChangeManager_instances, "m", _ChangeManager_formatChangesForInspectorStylesheet).call(this, changes);
        await cssModel.setStyleSheetText(stylesheetId, content, true);
        __classPrivateFieldGet(this, _ChangeManager_stylesheetChanges, "f").set(stylesheetId, changes);
        return content;
    }
    formatChangesForPatching(groupId, includeSourceLocation = false) {
        return Array.from(__classPrivateFieldGet(this, _ChangeManager_stylesheetChanges, "f").values())
            .flatMap(changesPerStylesheet => changesPerStylesheet.filter(change => change.groupId === groupId)
            .map(change => __classPrivateFieldGet(this, _ChangeManager_instances, "m", _ChangeManager_formatChange).call(this, change, includeSourceLocation)))
            .filter(change => change !== '')
            .join('\n\n');
    }
}
_ChangeManager_stylesheetMutex = new WeakMap(), _ChangeManager_cssModelToStylesheetId = new WeakMap(), _ChangeManager_stylesheetChanges = new WeakMap(), _ChangeManager_backupStylesheetChanges = new WeakMap(), _ChangeManager_instances = new WeakSet(), _ChangeManager_formatChangesForInspectorStylesheet = function _ChangeManager_formatChangesForInspectorStylesheet(changes) {
    return changes
        .map(change => {
        return `.${change.className} {
  ${change.selector}& {
${formatStyles(change.styles, 4)}
  }
}`;
    })
        .join('\n');
}, _ChangeManager_formatChange = function _ChangeManager_formatChange(change, includeSourceLocation = false) {
    const sourceLocation = includeSourceLocation && change.sourceLocation ? `/* related resource: ${change.sourceLocation} */\n` : '';
    // TODO: includeSourceLocation indicates whether we are using Patch
    // agent. If needed we can have an separate knob.
    const simpleSelector = includeSourceLocation && change.simpleSelector ? ` /* the element was ${change.simpleSelector} */` : '';
    return `${sourceLocation}${change.selector} {${simpleSelector}
${formatStyles(change.styles)}
}`;
}, _ChangeManager_getStylesheet = async function _ChangeManager_getStylesheet(cssModel, frameId) {
    return await __classPrivateFieldGet(this, _ChangeManager_stylesheetMutex, "f").run(async () => {
        let frameToStylesheet = __classPrivateFieldGet(this, _ChangeManager_cssModelToStylesheetId, "f").get(cssModel);
        if (!frameToStylesheet) {
            frameToStylesheet = new Map();
            __classPrivateFieldGet(this, _ChangeManager_cssModelToStylesheetId, "f").set(cssModel, frameToStylesheet);
            cssModel.addEventListener(SDK.CSSModel.Events.ModelDisposed, __classPrivateFieldGet(this, _ChangeManager_instances, "m", _ChangeManager_onCssModelDisposed), this);
        }
        let stylesheetId = frameToStylesheet.get(frameId);
        if (!stylesheetId) {
            const styleSheetHeader = await cssModel.createInspectorStylesheet(frameId, /* force */ true);
            if (!styleSheetHeader) {
                throw new Error('inspector-stylesheet is not found');
            }
            stylesheetId = styleSheetHeader.id;
            frameToStylesheet.set(frameId, stylesheetId);
        }
        return stylesheetId;
    });
}, _ChangeManager_onCssModelDisposed = async function _ChangeManager_onCssModelDisposed(event) {
    return await __classPrivateFieldGet(this, _ChangeManager_stylesheetMutex, "f").run(async () => {
        const cssModel = event.data;
        cssModel.removeEventListener(SDK.CSSModel.Events.ModelDisposed, __classPrivateFieldGet(this, _ChangeManager_instances, "m", _ChangeManager_onCssModelDisposed), this);
        const stylesheetIds = Array.from(__classPrivateFieldGet(this, _ChangeManager_cssModelToStylesheetId, "f").get(cssModel)?.values() ?? []);
        // Empty stylesheets.
        const results = await Promise.allSettled(stylesheetIds.map(async (id) => {
            __classPrivateFieldGet(this, _ChangeManager_stylesheetChanges, "f").delete(id);
            __classPrivateFieldGet(this, _ChangeManager_backupStylesheetChanges, "f").delete(id);
            await cssModel.setStyleSheetText(id, '', true);
        }));
        __classPrivateFieldGet(this, _ChangeManager_cssModelToStylesheetId, "f").delete(cssModel);
        const firstFailed = results.find(result => result.status === 'rejected');
        if (firstFailed) {
            throw new Error(firstFailed.reason);
        }
    });
};
//# sourceMappingURL=ChangeManager.js.map