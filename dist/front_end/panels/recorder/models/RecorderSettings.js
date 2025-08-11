// Copyright 2023 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _RecorderSettings_selectorAttribute, _RecorderSettings_speed, _RecorderSettings_replayExtension, _RecorderSettings_selectorTypes, _RecorderSettings_preferredCopyFormat;
import * as Common from '../../../core/common/common.js';
import * as i18n from '../../../core/i18n/i18n.js';
import { SelectorType } from './Schema.js';
const UIStrings = {
    /**
     * @description This string is used to generate the default name for the create recording form in the Recording panel.
     * The format is similar to the one used by MacOS to generate names for screenshots. Both {DATE} and {TIME} are localized
     * using the current locale.
     *
     * @example {2022-08-04} DATE
     * @example {10:32:48} TIME
     */
    defaultRecordingName: 'Recording {DATE} at {TIME}',
};
const str_ = i18n.i18n.registerUIStrings('panels/recorder/models/RecorderSettings.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class RecorderSettings {
    constructor() {
        _RecorderSettings_selectorAttribute.set(this, Common.Settings.Settings.instance().createSetting('recorder-selector-attribute', ''));
        _RecorderSettings_speed.set(this, Common.Settings.Settings.instance().createSetting('recorder-panel-replay-speed', "normal" /* PlayRecordingSpeed.NORMAL */));
        _RecorderSettings_replayExtension.set(this, Common.Settings.Settings.instance().createSetting('recorder-panel-replay-extension', ''));
        _RecorderSettings_selectorTypes.set(this, new Map());
        _RecorderSettings_preferredCopyFormat.set(this, Common.Settings.Settings.instance().createSetting('recorder-preferred-copy-format', "json" /* ConverterIds.JSON */));
        for (const selectorType of Object.values(SelectorType)) {
            __classPrivateFieldGet(this, _RecorderSettings_selectorTypes, "f").set(selectorType, Common.Settings.Settings.instance().createSetting(`recorder-${selectorType}-selector-enabled`, true));
        }
    }
    get selectorAttribute() {
        return __classPrivateFieldGet(this, _RecorderSettings_selectorAttribute, "f").get();
    }
    set selectorAttribute(value) {
        __classPrivateFieldGet(this, _RecorderSettings_selectorAttribute, "f").set(value);
    }
    get speed() {
        return __classPrivateFieldGet(this, _RecorderSettings_speed, "f").get();
    }
    set speed(speed) {
        __classPrivateFieldGet(this, _RecorderSettings_speed, "f").set(speed);
    }
    get replayExtension() {
        return __classPrivateFieldGet(this, _RecorderSettings_replayExtension, "f").get();
    }
    set replayExtension(replayExtension) {
        __classPrivateFieldGet(this, _RecorderSettings_replayExtension, "f").set(replayExtension);
    }
    get defaultTitle() {
        const now = new Date();
        return i18nString(UIStrings.defaultRecordingName, {
            DATE: now.toLocaleDateString(),
            TIME: now.toLocaleTimeString(),
        });
    }
    get defaultSelectors() {
        return Object.values(SelectorType)
            .filter(type => this.getSelectorByType(type));
    }
    getSelectorByType(type) {
        return __classPrivateFieldGet(this, _RecorderSettings_selectorTypes, "f").get(type)?.get();
    }
    setSelectorByType(type, value) {
        __classPrivateFieldGet(this, _RecorderSettings_selectorTypes, "f").get(type)?.set(value);
    }
    get preferredCopyFormat() {
        return __classPrivateFieldGet(this, _RecorderSettings_preferredCopyFormat, "f").get();
    }
    set preferredCopyFormat(value) {
        __classPrivateFieldGet(this, _RecorderSettings_preferredCopyFormat, "f").set(value);
    }
}
_RecorderSettings_selectorAttribute = new WeakMap(), _RecorderSettings_speed = new WeakMap(), _RecorderSettings_replayExtension = new WeakMap(), _RecorderSettings_selectorTypes = new WeakMap(), _RecorderSettings_preferredCopyFormat = new WeakMap();
//# sourceMappingURL=RecorderSettings.js.map