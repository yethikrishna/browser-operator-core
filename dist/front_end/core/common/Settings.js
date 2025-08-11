/*
 * Copyright (C) 2009 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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
var _Settings_sessionStorage, _Settings_eventSupport, _Settings_registry, _Settings_logSettingAccess, _Setting_instances, _Setting_titleFunction, _Setting_titleInternal, _Setting_registration, _Setting_requiresUserAction, _Setting_value, _Setting_serializer, _Setting_hadUserAction, _Setting_disabled, _Setting_deprecation, _Setting_loggedInitialAccess, _Setting_logSettingAccess, _Setting_maybeLogAccess, _Setting_maybeLogInitialAccess, _RegExpSetting_regexFlags, _RegExpSetting_regex, _VersionController_globalVersionSetting, _VersionController_syncedVersionSetting, _VersionController_localVersionSetting;
import * as Platform from '../platform/platform.js';
import * as Root from '../root/root.js';
import { Console } from './Console.js';
import { ObjectWrapper } from './Object.js';
import { getLocalizedSettingsCategory, getRegisteredSettings as getRegisteredSettingsInternal, maybeRemoveSettingExtension, registerSettingExtension, registerSettingsForTest, resetSettings, SettingCategory, SettingType, } from './SettingRegistration.js';
let settingsInstance;
export class Settings {
    constructor(syncedStorage, globalStorage, localStorage, logSettingAccess) {
        this.syncedStorage = syncedStorage;
        this.globalStorage = globalStorage;
        this.localStorage = localStorage;
        _Settings_sessionStorage.set(this, new SettingsStorage({}));
        this.settingNameSet = new Set();
        this.orderValuesBySettingCategory = new Map();
        _Settings_eventSupport.set(this, new ObjectWrapper());
        _Settings_registry.set(this, new Map());
        this.moduleSettings = new Map();
        _Settings_logSettingAccess.set(this, void 0);
        __classPrivateFieldSet(this, _Settings_logSettingAccess, logSettingAccess, "f");
        for (const registration of this.getRegisteredSettings()) {
            const { settingName, defaultValue, storageType } = registration;
            const isRegex = registration.settingType === "regex" /* SettingType.REGEX */;
            const evaluatedDefaultValue = typeof defaultValue === 'function' ? defaultValue(Root.Runtime.hostConfig) : defaultValue;
            const setting = isRegex && typeof evaluatedDefaultValue === 'string' ?
                this.createRegExpSetting(settingName, evaluatedDefaultValue, undefined, storageType) :
                this.createSetting(settingName, evaluatedDefaultValue, storageType);
            setting.setTitleFunction(registration.title);
            if (registration.userActionCondition) {
                setting.setRequiresUserAction(Boolean(Root.Runtime.Runtime.queryParam(registration.userActionCondition)));
            }
            setting.setRegistration(registration);
            this.registerModuleSetting(setting);
        }
    }
    getRegisteredSettings() {
        return getRegisteredSettingsInternal();
    }
    static hasInstance() {
        return typeof settingsInstance !== 'undefined';
    }
    static instance(opts = { forceNew: null, syncedStorage: null, globalStorage: null, localStorage: null }) {
        const { forceNew, syncedStorage, globalStorage, localStorage, logSettingAccess } = opts;
        if (!settingsInstance || forceNew) {
            if (!syncedStorage || !globalStorage || !localStorage) {
                throw new Error(`Unable to create settings: global and local storage must be provided: ${new Error().stack}`);
            }
            settingsInstance = new Settings(syncedStorage, globalStorage, localStorage, logSettingAccess);
        }
        return settingsInstance;
    }
    static removeInstance() {
        settingsInstance = undefined;
    }
    registerModuleSetting(setting) {
        const settingName = setting.name;
        const category = setting.category();
        const order = setting.order();
        if (this.settingNameSet.has(settingName)) {
            throw new Error(`Duplicate Setting name '${settingName}'`);
        }
        if (category && order) {
            const orderValues = this.orderValuesBySettingCategory.get(category) || new Set();
            if (orderValues.has(order)) {
                throw new Error(`Duplicate order value '${order}' for settings category '${category}'`);
            }
            orderValues.add(order);
            this.orderValuesBySettingCategory.set(category, orderValues);
        }
        this.settingNameSet.add(settingName);
        this.moduleSettings.set(setting.name, setting);
    }
    static normalizeSettingName(name) {
        if ([
            VersionController.GLOBAL_VERSION_SETTING_NAME,
            VersionController.SYNCED_VERSION_SETTING_NAME,
            VersionController.LOCAL_VERSION_SETTING_NAME,
            'currentDockState',
            'isUnderTest',
        ].includes(name)) {
            return name;
        }
        return Platform.StringUtilities.toKebabCase(name);
    }
    /**
     * Prefer a module setting if this setting is one that you might not want to
     * surface to the user to control themselves. Examples of these are settings
     * to store UI state such as how a user choses to position a split widget or
     * which panel they last opened.
     * If you are creating a setting that you expect the user to control, and
     * sync, prefer {@see createSetting}
     */
    // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    moduleSetting(settingName) {
        const setting = this.moduleSettings.get(settingName);
        if (!setting) {
            throw new Error('No setting registered: ' + settingName);
        }
        return setting;
    }
    settingForTest(settingName) {
        const setting = __classPrivateFieldGet(this, _Settings_registry, "f").get(settingName);
        if (!setting) {
            throw new Error('No setting registered: ' + settingName);
        }
        return setting;
    }
    /**
     * Get setting via key, and create a new setting if the requested setting does not exist.
     * @param {string} key kebab-case string ID
     * @param {T} defaultValue
     * @param {SettingStorageType=} storageType If not specified, SettingStorageType.GLOBAL is used.
     */
    createSetting(key, defaultValue, storageType) {
        const storage = this.storageFromType(storageType);
        let setting = __classPrivateFieldGet(this, _Settings_registry, "f").get(key);
        if (!setting) {
            setting = new Setting(key, defaultValue, __classPrivateFieldGet(this, _Settings_eventSupport, "f"), storage, __classPrivateFieldGet(this, _Settings_logSettingAccess, "f"));
            __classPrivateFieldGet(this, _Settings_registry, "f").set(key, setting);
        }
        return setting;
    }
    createLocalSetting(key, defaultValue) {
        return this.createSetting(key, defaultValue, "Local" /* SettingStorageType.LOCAL */);
    }
    createRegExpSetting(key, defaultValue, regexFlags, storageType) {
        if (!__classPrivateFieldGet(this, _Settings_registry, "f").get(key)) {
            __classPrivateFieldGet(this, _Settings_registry, "f").set(key, new RegExpSetting(key, defaultValue, __classPrivateFieldGet(this, _Settings_eventSupport, "f"), this.storageFromType(storageType), regexFlags, __classPrivateFieldGet(this, _Settings_logSettingAccess, "f")));
        }
        return __classPrivateFieldGet(this, _Settings_registry, "f").get(key);
    }
    clearAll() {
        this.globalStorage.removeAll();
        this.syncedStorage.removeAll();
        this.localStorage.removeAll();
        new VersionController().resetToCurrent();
    }
    storageFromType(storageType) {
        switch (storageType) {
            case "Local" /* SettingStorageType.LOCAL */:
                return this.localStorage;
            case "Session" /* SettingStorageType.SESSION */:
                return __classPrivateFieldGet(this, _Settings_sessionStorage, "f");
            case "Global" /* SettingStorageType.GLOBAL */:
                return this.globalStorage;
            case "Synced" /* SettingStorageType.SYNCED */:
                return this.syncedStorage;
        }
        return this.globalStorage;
    }
    getRegistry() {
        return __classPrivateFieldGet(this, _Settings_registry, "f");
    }
}
_Settings_sessionStorage = new WeakMap(), _Settings_eventSupport = new WeakMap(), _Settings_registry = new WeakMap(), _Settings_logSettingAccess = new WeakMap();
export const NOOP_STORAGE = {
    register: () => { },
    set: () => { },
    get: () => Promise.resolve(''),
    remove: () => { },
    clear: () => { },
};
export class SettingsStorage {
    constructor(object, backingStore = NOOP_STORAGE, storagePrefix = '') {
        this.object = object;
        this.backingStore = backingStore;
        this.storagePrefix = storagePrefix;
    }
    register(name) {
        name = this.storagePrefix + name;
        this.backingStore.register(name);
    }
    set(name, value) {
        name = this.storagePrefix + name;
        this.object[name] = value;
        this.backingStore.set(name, value);
    }
    has(name) {
        name = this.storagePrefix + name;
        return name in this.object;
    }
    get(name) {
        name = this.storagePrefix + name;
        return this.object[name];
    }
    async forceGet(originalName) {
        const name = this.storagePrefix + originalName;
        const value = await this.backingStore.get(name);
        if (value && value !== this.object[name]) {
            this.set(originalName, value);
        }
        else if (!value) {
            this.remove(originalName);
        }
        return value;
    }
    remove(name) {
        name = this.storagePrefix + name;
        delete this.object[name];
        this.backingStore.remove(name);
    }
    removeAll() {
        this.object = {};
        this.backingStore.clear();
    }
    keys() {
        return Object.keys(this.object);
    }
    dumpSizes() {
        Console.instance().log('Ten largest settings: ');
        // @ts-expect-error __proto__ optimization
        const sizes = { __proto__: null };
        for (const key in this.object) {
            sizes[key] = this.object[key].length;
        }
        const keys = Object.keys(sizes);
        function comparator(key1, key2) {
            return sizes[key2] - sizes[key1];
        }
        keys.sort(comparator);
        for (let i = 0; i < 10 && i < keys.length; ++i) {
            Console.instance().log('Setting: \'' + keys[i] + '\', size: ' + sizes[keys[i]]);
        }
    }
}
function removeSetting(setting) {
    const name = setting.name;
    const settings = Settings.instance();
    settings.getRegistry().delete(name);
    settings.moduleSettings.delete(name);
    setting.storage.remove(name);
}
export class Deprecation {
    constructor({ deprecationNotice }) {
        if (!deprecationNotice) {
            throw new Error('Cannot create deprecation info for a non-deprecated setting');
        }
        this.disabled = deprecationNotice.disabled;
        this.warning = deprecationNotice.warning();
        this.experiment = deprecationNotice.experiment ?
            Root.Runtime.experiments.allConfigurableExperiments().find(e => e.name === deprecationNotice.experiment) :
            undefined;
    }
}
export class Setting {
    constructor(name, defaultValue, eventSupport, storage, logSettingAccess) {
        _Setting_instances.add(this);
        this.name = name;
        this.defaultValue = defaultValue;
        this.eventSupport = eventSupport;
        this.storage = storage;
        _Setting_titleFunction.set(this, void 0);
        _Setting_titleInternal.set(this, void 0);
        _Setting_registration.set(this, null);
        _Setting_requiresUserAction.set(this, void 0);
        _Setting_value.set(this, void 0);
        // TODO(crbug.com/1172300) Type cannot be inferred without changes to consumers. See above.
        _Setting_serializer.set(this, JSON);
        _Setting_hadUserAction.set(this, void 0);
        _Setting_disabled.set(this, void 0);
        _Setting_deprecation.set(this, null);
        _Setting_loggedInitialAccess.set(this, false);
        _Setting_logSettingAccess.set(this, void 0);
        storage.register(this.name);
        __classPrivateFieldSet(this, _Setting_logSettingAccess, logSettingAccess, "f");
    }
    setSerializer(serializer) {
        __classPrivateFieldSet(this, _Setting_serializer, serializer, "f");
    }
    addChangeListener(listener, thisObject) {
        return this.eventSupport.addEventListener(this.name, listener, thisObject);
    }
    removeChangeListener(listener, thisObject) {
        this.eventSupport.removeEventListener(this.name, listener, thisObject);
    }
    title() {
        if (__classPrivateFieldGet(this, _Setting_titleInternal, "f")) {
            return __classPrivateFieldGet(this, _Setting_titleInternal, "f");
        }
        if (__classPrivateFieldGet(this, _Setting_titleFunction, "f")) {
            return __classPrivateFieldGet(this, _Setting_titleFunction, "f").call(this);
        }
        return '';
    }
    setTitleFunction(titleFunction) {
        if (titleFunction) {
            __classPrivateFieldSet(this, _Setting_titleFunction, titleFunction, "f");
        }
    }
    setTitle(title) {
        __classPrivateFieldSet(this, _Setting_titleInternal, title, "f");
    }
    setRequiresUserAction(requiresUserAction) {
        __classPrivateFieldSet(this, _Setting_requiresUserAction, requiresUserAction, "f");
    }
    disabled() {
        if (__classPrivateFieldGet(this, _Setting_registration, "f")?.disabledCondition) {
            const { disabled } = __classPrivateFieldGet(this, _Setting_registration, "f").disabledCondition(Root.Runtime.hostConfig);
            // If registration does not disable it, pass through to #disabled
            // attribute check.
            if (disabled) {
                return true;
            }
        }
        return __classPrivateFieldGet(this, _Setting_disabled, "f") || false;
    }
    disabledReasons() {
        if (__classPrivateFieldGet(this, _Setting_registration, "f")?.disabledCondition) {
            const result = __classPrivateFieldGet(this, _Setting_registration, "f").disabledCondition(Root.Runtime.hostConfig);
            if (result.disabled) {
                return result.reasons;
            }
        }
        return [];
    }
    setDisabled(disabled) {
        __classPrivateFieldSet(this, _Setting_disabled, disabled, "f");
        this.eventSupport.dispatchEventToListeners(this.name);
    }
    get() {
        if (__classPrivateFieldGet(this, _Setting_requiresUserAction, "f") && !__classPrivateFieldGet(this, _Setting_hadUserAction, "f")) {
            __classPrivateFieldGet(this, _Setting_instances, "m", _Setting_maybeLogInitialAccess).call(this, this.defaultValue);
            return this.defaultValue;
        }
        if (typeof __classPrivateFieldGet(this, _Setting_value, "f") !== 'undefined') {
            __classPrivateFieldGet(this, _Setting_instances, "m", _Setting_maybeLogInitialAccess).call(this, __classPrivateFieldGet(this, _Setting_value, "f"));
            return __classPrivateFieldGet(this, _Setting_value, "f");
        }
        __classPrivateFieldSet(this, _Setting_value, this.defaultValue, "f");
        if (this.storage.has(this.name)) {
            try {
                __classPrivateFieldSet(this, _Setting_value, __classPrivateFieldGet(this, _Setting_serializer, "f").parse(this.storage.get(this.name)), "f");
            }
            catch {
                this.storage.remove(this.name);
            }
        }
        __classPrivateFieldGet(this, _Setting_instances, "m", _Setting_maybeLogInitialAccess).call(this, __classPrivateFieldGet(this, _Setting_value, "f"));
        return __classPrivateFieldGet(this, _Setting_value, "f");
    }
    // Prefer this getter for settings which are "disableable". The plain getter returns `this.#value`,
    // even if the setting is disabled, which means the callsite has to explicitly call the `disabled()`
    // getter and add its own logic for the disabled state.
    getIfNotDisabled() {
        if (this.disabled()) {
            return;
        }
        return this.get();
    }
    async forceGet() {
        const name = this.name;
        const oldValue = this.storage.get(name);
        const value = await this.storage.forceGet(name);
        __classPrivateFieldSet(this, _Setting_value, this.defaultValue, "f");
        if (value) {
            try {
                __classPrivateFieldSet(this, _Setting_value, __classPrivateFieldGet(this, _Setting_serializer, "f").parse(value), "f");
            }
            catch {
                this.storage.remove(this.name);
            }
        }
        if (oldValue !== value) {
            this.eventSupport.dispatchEventToListeners(this.name, __classPrivateFieldGet(this, _Setting_value, "f"));
        }
        __classPrivateFieldGet(this, _Setting_instances, "m", _Setting_maybeLogInitialAccess).call(this, __classPrivateFieldGet(this, _Setting_value, "f"));
        return __classPrivateFieldGet(this, _Setting_value, "f");
    }
    set(value) {
        __classPrivateFieldGet(this, _Setting_instances, "m", _Setting_maybeLogAccess).call(this, value);
        __classPrivateFieldSet(this, _Setting_hadUserAction, true, "f");
        __classPrivateFieldSet(this, _Setting_value, value, "f");
        try {
            const settingString = __classPrivateFieldGet(this, _Setting_serializer, "f").stringify(value);
            try {
                this.storage.set(this.name, settingString);
            }
            catch (e) {
                this.printSettingsSavingError(e.message, settingString);
            }
        }
        catch (e) {
            Console.instance().error('Cannot stringify setting with name: ' + this.name + ', error: ' + e.message);
        }
        this.eventSupport.dispatchEventToListeners(this.name, value);
    }
    setRegistration(registration) {
        __classPrivateFieldSet(this, _Setting_registration, registration, "f");
        const { deprecationNotice } = registration;
        if (deprecationNotice?.disabled) {
            const experiment = deprecationNotice.experiment ?
                Root.Runtime.experiments.allConfigurableExperiments().find(e => e.name === deprecationNotice.experiment) :
                undefined;
            if ((!experiment || experiment.isEnabled())) {
                this.set(this.defaultValue);
                this.setDisabled(true);
            }
        }
    }
    type() {
        if (__classPrivateFieldGet(this, _Setting_registration, "f")) {
            return __classPrivateFieldGet(this, _Setting_registration, "f").settingType;
        }
        return null;
    }
    options() {
        if (__classPrivateFieldGet(this, _Setting_registration, "f") && __classPrivateFieldGet(this, _Setting_registration, "f").options) {
            return __classPrivateFieldGet(this, _Setting_registration, "f").options.map(opt => {
                const { value, title, text, raw } = opt;
                return {
                    value,
                    title: title(),
                    text: typeof text === 'function' ? text() : text,
                    raw,
                };
            });
        }
        return [];
    }
    reloadRequired() {
        if (__classPrivateFieldGet(this, _Setting_registration, "f")) {
            return __classPrivateFieldGet(this, _Setting_registration, "f").reloadRequired || null;
        }
        return null;
    }
    category() {
        if (__classPrivateFieldGet(this, _Setting_registration, "f")) {
            return __classPrivateFieldGet(this, _Setting_registration, "f").category || null;
        }
        return null;
    }
    tags() {
        if (__classPrivateFieldGet(this, _Setting_registration, "f") && __classPrivateFieldGet(this, _Setting_registration, "f").tags) {
            // Get localized keys and separate by null character to prevent fuzzy matching from matching across them.
            return __classPrivateFieldGet(this, _Setting_registration, "f").tags.map(tag => tag()).join('\0');
        }
        return null;
    }
    order() {
        if (__classPrivateFieldGet(this, _Setting_registration, "f")) {
            return __classPrivateFieldGet(this, _Setting_registration, "f").order || null;
        }
        return null;
    }
    learnMore() {
        return __classPrivateFieldGet(this, _Setting_registration, "f")?.learnMore ?? null;
    }
    get deprecation() {
        if (!__classPrivateFieldGet(this, _Setting_registration, "f") || !__classPrivateFieldGet(this, _Setting_registration, "f").deprecationNotice) {
            return null;
        }
        if (!__classPrivateFieldGet(this, _Setting_deprecation, "f")) {
            __classPrivateFieldSet(this, _Setting_deprecation, new Deprecation(__classPrivateFieldGet(this, _Setting_registration, "f")), "f");
        }
        return __classPrivateFieldGet(this, _Setting_deprecation, "f");
    }
    printSettingsSavingError(message, value) {
        const errorMessage = 'Error saving setting with name: ' + this.name + ', value length: ' + value.length + '. Error: ' + message;
        console.error(errorMessage);
        Console.instance().error(errorMessage);
        this.storage.dumpSizes();
    }
}
_Setting_titleFunction = new WeakMap(), _Setting_titleInternal = new WeakMap(), _Setting_registration = new WeakMap(), _Setting_requiresUserAction = new WeakMap(), _Setting_value = new WeakMap(), _Setting_serializer = new WeakMap(), _Setting_hadUserAction = new WeakMap(), _Setting_disabled = new WeakMap(), _Setting_deprecation = new WeakMap(), _Setting_loggedInitialAccess = new WeakMap(), _Setting_logSettingAccess = new WeakMap(), _Setting_instances = new WeakSet(), _Setting_maybeLogAccess = function _Setting_maybeLogAccess(value) {
    try {
        const valueToLog = typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ?
            value :
            __classPrivateFieldGet(this, _Setting_serializer, "f")?.stringify(value);
        if (valueToLog !== undefined && __classPrivateFieldGet(this, _Setting_logSettingAccess, "f")) {
            void __classPrivateFieldGet(this, _Setting_logSettingAccess, "f").call(this, this.name, valueToLog);
        }
    }
    catch {
    }
}, _Setting_maybeLogInitialAccess = function _Setting_maybeLogInitialAccess(value) {
    if (!__classPrivateFieldGet(this, _Setting_loggedInitialAccess, "f")) {
        __classPrivateFieldGet(this, _Setting_instances, "m", _Setting_maybeLogAccess).call(this, value);
        __classPrivateFieldSet(this, _Setting_loggedInitialAccess, true, "f");
    }
};
// TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RegExpSetting extends Setting {
    constructor(name, defaultValue, eventSupport, storage, regexFlags, logSettingAccess) {
        super(name, defaultValue ? [{ pattern: defaultValue }] : [], eventSupport, storage, logSettingAccess);
        _RegExpSetting_regexFlags.set(this, void 0);
        _RegExpSetting_regex.set(this, void 0);
        __classPrivateFieldSet(this, _RegExpSetting_regexFlags, regexFlags, "f");
    }
    get() {
        const result = [];
        const items = this.getAsArray();
        for (let i = 0; i < items.length; ++i) {
            const item = items[i];
            if (item.pattern && !item.disabled) {
                result.push(item.pattern);
            }
        }
        return result.join('|');
    }
    getAsArray() {
        return super.get();
    }
    set(value) {
        this.setAsArray([{ pattern: value, disabled: false }]);
    }
    setAsArray(value) {
        __classPrivateFieldSet(this, _RegExpSetting_regex, undefined, "f");
        super.set(value);
    }
    asRegExp() {
        if (typeof __classPrivateFieldGet(this, _RegExpSetting_regex, "f") !== 'undefined') {
            return __classPrivateFieldGet(this, _RegExpSetting_regex, "f");
        }
        __classPrivateFieldSet(this, _RegExpSetting_regex, null, "f");
        try {
            const pattern = this.get();
            if (pattern) {
                __classPrivateFieldSet(this, _RegExpSetting_regex, new RegExp(pattern, __classPrivateFieldGet(this, _RegExpSetting_regexFlags, "f") || ''), "f");
            }
        }
        catch {
        }
        return __classPrivateFieldGet(this, _RegExpSetting_regex, "f");
    }
}
_RegExpSetting_regexFlags = new WeakMap(), _RegExpSetting_regex = new WeakMap();
export class VersionController {
    constructor() {
        _VersionController_globalVersionSetting.set(this, void 0);
        _VersionController_syncedVersionSetting.set(this, void 0);
        _VersionController_localVersionSetting.set(this, void 0);
        // If no version setting is found, we initialize with the current version and don't do anything.
        __classPrivateFieldSet(this, _VersionController_globalVersionSetting, Settings.instance().createSetting(VersionController.GLOBAL_VERSION_SETTING_NAME, VersionController.CURRENT_VERSION, "Global" /* SettingStorageType.GLOBAL */), "f");
        __classPrivateFieldSet(this, _VersionController_syncedVersionSetting, Settings.instance().createSetting(VersionController.SYNCED_VERSION_SETTING_NAME, VersionController.CURRENT_VERSION, "Synced" /* SettingStorageType.SYNCED */), "f");
        __classPrivateFieldSet(this, _VersionController_localVersionSetting, Settings.instance().createSetting(VersionController.LOCAL_VERSION_SETTING_NAME, VersionController.CURRENT_VERSION, "Local" /* SettingStorageType.LOCAL */), "f");
    }
    /**
     * Force re-sets all version number settings to the current version without
     * running any migrations.
     */
    resetToCurrent() {
        __classPrivateFieldGet(this, _VersionController_globalVersionSetting, "f").set(VersionController.CURRENT_VERSION);
        __classPrivateFieldGet(this, _VersionController_syncedVersionSetting, "f").set(VersionController.CURRENT_VERSION);
        __classPrivateFieldGet(this, _VersionController_localVersionSetting, "f").set(VersionController.CURRENT_VERSION);
    }
    /**
     * Runs the appropriate migrations and updates the version settings accordingly.
     *
     * To determine what migrations to run we take the minimum of all version number settings.
     *
     * IMPORTANT: All migrations must be idempotent since they might be applied multiple times.
     */
    updateVersion() {
        const currentVersion = VersionController.CURRENT_VERSION;
        const minimumVersion = Math.min(__classPrivateFieldGet(this, _VersionController_globalVersionSetting, "f").get(), __classPrivateFieldGet(this, _VersionController_syncedVersionSetting, "f").get(), __classPrivateFieldGet(this, _VersionController_localVersionSetting, "f").get());
        const methodsToRun = this.methodsToRunToUpdateVersion(minimumVersion, currentVersion);
        console.assert(
        // @ts-expect-error
        this[`updateVersionFrom${currentVersion}To${currentVersion + 1}`] === undefined, 'Unexpected migration method found. Increment CURRENT_VERSION or remove the method.');
        for (const method of methodsToRun) {
            // @ts-expect-error Special version method matching
            this[method].call(this);
        }
        this.resetToCurrent();
    }
    methodsToRunToUpdateVersion(oldVersion, currentVersion) {
        const result = [];
        for (let i = oldVersion; i < currentVersion; ++i) {
            result.push('updateVersionFrom' + i + 'To' + (i + 1));
        }
        return result;
    }
    updateVersionFrom0To1() {
        this.clearBreakpointsWhenTooMany(Settings.instance().createLocalSetting('breakpoints', []), 500000);
    }
    updateVersionFrom1To2() {
        Settings.instance().createSetting('previouslyViewedFiles', []).set([]);
    }
    updateVersionFrom2To3() {
        Settings.instance().createSetting('fileSystemMapping', {}).set({});
        removeSetting(Settings.instance().createSetting('fileMappingEntries', []));
    }
    updateVersionFrom3To4() {
        const advancedMode = Settings.instance().createSetting('showHeaSnapshotObjectsHiddenProperties', false);
        moduleSetting('showAdvancedHeapSnapshotProperties').set(advancedMode.get());
        removeSetting(advancedMode);
    }
    updateVersionFrom4To5() {
        const settingNames = {
            FileSystemViewSidebarWidth: 'fileSystemViewSplitViewState',
            elementsSidebarWidth: 'elementsPanelSplitViewState',
            StylesPaneSplitRatio: 'stylesPaneSplitViewState',
            heapSnapshotRetainersViewSize: 'heapSnapshotSplitViewState',
            'InspectorView.splitView': 'InspectorView.splitViewState',
            'InspectorView.screencastSplitView': 'InspectorView.screencastSplitViewState',
            'Inspector.drawerSplitView': 'Inspector.drawerSplitViewState',
            layerDetailsSplitView: 'layerDetailsSplitViewState',
            networkSidebarWidth: 'networkPanelSplitViewState',
            sourcesSidebarWidth: 'sourcesPanelSplitViewState',
            scriptsPanelNavigatorSidebarWidth: 'sourcesPanelNavigatorSplitViewState',
            sourcesPanelSplitSidebarRatio: 'sourcesPanelDebuggerSidebarSplitViewState',
            'timeline-details': 'timelinePanelDetailsSplitViewState',
            'timeline-split': 'timelinePanelRecorsSplitViewState',
            'timeline-view': 'timelinePanelTimelineStackSplitViewState',
            auditsSidebarWidth: 'auditsPanelSplitViewState',
            layersSidebarWidth: 'layersPanelSplitViewState',
            profilesSidebarWidth: 'profilesPanelSplitViewState',
            resourcesSidebarWidth: 'resourcesPanelSplitViewState',
        };
        const empty = {};
        for (const oldName in settingNames) {
            const newName = settingNames[oldName];
            const oldNameH = oldName + 'H';
            let newValue = null;
            const oldSetting = Settings.instance().createSetting(oldName, empty);
            if (oldSetting.get() !== empty) {
                newValue = newValue || {};
                // @ts-expect-error
                newValue.vertical = {};
                // @ts-expect-error
                newValue.vertical.size = oldSetting.get();
                removeSetting(oldSetting);
            }
            const oldSettingH = Settings.instance().createSetting(oldNameH, empty);
            if (oldSettingH.get() !== empty) {
                newValue = newValue || {};
                // @ts-expect-error
                newValue.horizontal = {};
                // @ts-expect-error
                newValue.horizontal.size = oldSettingH.get();
                removeSetting(oldSettingH);
            }
            if (newValue) {
                Settings.instance().createSetting(newName, {}).set(newValue);
            }
        }
    }
    updateVersionFrom5To6() {
        const settingNames = {
            debuggerSidebarHidden: 'sourcesPanelSplitViewState',
            navigatorHidden: 'sourcesPanelNavigatorSplitViewState',
            'WebInspector.Drawer.showOnLoad': 'Inspector.drawerSplitViewState',
        };
        for (const oldName in settingNames) {
            const oldSetting = Settings.instance().createSetting(oldName, null);
            if (oldSetting.get() === null) {
                removeSetting(oldSetting);
                continue;
            }
            const newName = settingNames[oldName];
            const invert = oldName === 'WebInspector.Drawer.showOnLoad';
            const hidden = oldSetting.get() !== invert;
            removeSetting(oldSetting);
            const showMode = hidden ? 'OnlyMain' : 'Both';
            const newSetting = Settings.instance().createSetting(newName, {});
            const newValue = newSetting.get() || {};
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
            // @ts-expect-error
            newValue.vertical = newValue.vertical || {};
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
            // @ts-expect-error
            newValue.vertical.showMode = showMode;
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
            // @ts-expect-error
            newValue.horizontal = newValue.horizontal || {};
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
            // @ts-expect-error
            newValue.horizontal.showMode = showMode;
            newSetting.set(newValue);
        }
    }
    updateVersionFrom6To7() {
        const settingNames = {
            sourcesPanelNavigatorSplitViewState: 'sourcesPanelNavigatorSplitViewState',
            elementsPanelSplitViewState: 'elementsPanelSplitViewState',
            stylesPaneSplitViewState: 'stylesPaneSplitViewState',
            sourcesPanelDebuggerSidebarSplitViewState: 'sourcesPanelDebuggerSidebarSplitViewState',
        };
        const empty = {};
        for (const name in settingNames) {
            const setting = Settings.instance().createSetting(name, empty);
            const value = setting.get();
            if (value === empty) {
                continue;
            }
            // Zero out saved percentage sizes, and they will be restored to defaults.
            if (value.vertical?.size && value.vertical.size < 1) {
                value.vertical.size = 0;
            }
            if (value.horizontal?.size && value.horizontal.size < 1) {
                value.horizontal.size = 0;
            }
            setting.set(value);
        }
    }
    updateVersionFrom7To8() {
    }
    updateVersionFrom8To9() {
        const settingNames = ['skipStackFramesPattern', 'workspaceFolderExcludePattern'];
        for (let i = 0; i < settingNames.length; ++i) {
            const setting = Settings.instance().createSetting(settingNames[i], '');
            let value = setting.get();
            if (!value) {
                return;
            }
            if (typeof value === 'string') {
                value = [value];
            }
            for (let j = 0; j < value.length; ++j) {
                if (typeof value[j] === 'string') {
                    value[j] = { pattern: value[j] };
                }
            }
            setting.set(value);
        }
    }
    updateVersionFrom9To10() {
        // This one is localStorage specific, which is fine.
        if (!window.localStorage) {
            return;
        }
        for (const key in window.localStorage) {
            if (key.startsWith('revision-history')) {
                window.localStorage.removeItem(key);
            }
        }
    }
    updateVersionFrom10To11() {
        const oldSettingName = 'customDevicePresets';
        const newSettingName = 'customEmulatedDeviceList';
        const oldSetting = Settings.instance().createSetting(oldSettingName, undefined);
        const list = oldSetting.get();
        if (!Array.isArray(list)) {
            return;
        }
        const newList = [];
        for (let i = 0; i < list.length; ++i) {
            const value = list[i];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const device = {};
            device['title'] = value['title'];
            device['type'] = 'unknown';
            device['user-agent'] = value['userAgent'];
            device['capabilities'] = [];
            if (value['touch']) {
                device['capabilities'].push('touch');
            }
            if (value['mobile']) {
                device['capabilities'].push('mobile');
            }
            device['screen'] = {};
            device['screen']['vertical'] = { width: value['width'], height: value['height'] };
            device['screen']['horizontal'] = { width: value['height'], height: value['width'] };
            device['screen']['device-pixel-ratio'] = value['deviceScaleFactor'];
            device['modes'] = [];
            device['show-by-default'] = true;
            device['show'] = 'Default';
            newList.push(device);
        }
        if (newList.length) {
            Settings.instance().createSetting(newSettingName, []).set(newList);
        }
        removeSetting(oldSetting);
    }
    updateVersionFrom11To12() {
        this.migrateSettingsFromLocalStorage();
    }
    updateVersionFrom12To13() {
        this.migrateSettingsFromLocalStorage();
        removeSetting(Settings.instance().createSetting('timelineOverviewMode', ''));
    }
    updateVersionFrom13To14() {
        const defaultValue = { throughput: -1, latency: 0 };
        Settings.instance().createSetting('networkConditions', defaultValue).set(defaultValue);
    }
    updateVersionFrom14To15() {
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setting = Settings.instance().createLocalSetting('workspaceExcludedFolders', {});
        const oldValue = setting.get();
        const newValue = {};
        for (const fileSystemPath in oldValue) {
            newValue[fileSystemPath] = [];
            for (const entry of oldValue[fileSystemPath]) {
                newValue[fileSystemPath].push(entry.path);
            }
        }
        setting.set(newValue);
    }
    updateVersionFrom15To16() {
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setting = Settings.instance().createSetting('InspectorView.panelOrder', {});
        const tabOrders = setting.get();
        for (const key of Object.keys(tabOrders)) {
            tabOrders[key] = (tabOrders[key] + 1) * 10;
        }
        setting.set(tabOrders);
    }
    updateVersionFrom16To17() {
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setting = Settings.instance().createSetting('networkConditionsCustomProfiles', []);
        const oldValue = setting.get();
        const newValue = [];
        if (Array.isArray(oldValue)) {
            for (const preset of oldValue) {
                if (typeof preset.title === 'string' && typeof preset.value === 'object' &&
                    typeof preset.value.throughput === 'number' && typeof preset.value.latency === 'number') {
                    newValue.push({
                        title: preset.title,
                        value: { download: preset.value.throughput, upload: preset.value.throughput, latency: preset.value.latency },
                    });
                }
            }
        }
        setting.set(newValue);
    }
    updateVersionFrom17To18() {
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setting = Settings.instance().createLocalSetting('workspaceExcludedFolders', {});
        const oldValue = setting.get();
        const newValue = {};
        for (const oldKey in oldValue) {
            let newKey = oldKey.replace(/\\/g, '/');
            if (!newKey.startsWith('file://')) {
                if (newKey.startsWith('/')) {
                    newKey = 'file://' + newKey;
                }
                else {
                    newKey = 'file:///' + newKey;
                }
            }
            newValue[newKey] = oldValue[oldKey];
        }
        setting.set(newValue);
    }
    updateVersionFrom18To19() {
        const defaultColumns = { status: true, type: true, initiator: true, size: true, time: true };
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const visibleColumnSettings = Settings.instance().createSetting('networkLogColumnsVisibility', defaultColumns);
        const visibleColumns = visibleColumnSettings.get();
        visibleColumns.name = true;
        visibleColumns.timeline = true;
        const configs = {};
        for (const columnId in visibleColumns) {
            if (!visibleColumns.hasOwnProperty(columnId)) {
                continue;
            }
            configs[columnId.toLowerCase()] = { visible: visibleColumns[columnId] };
        }
        const newSetting = Settings.instance().createSetting('networkLogColumns', {});
        newSetting.set(configs);
        removeSetting(visibleColumnSettings);
    }
    updateVersionFrom19To20() {
        const oldSetting = Settings.instance().createSetting('InspectorView.panelOrder', {});
        const newSetting = Settings.instance().createSetting('panel-tabOrder', {});
        newSetting.set(oldSetting.get());
        removeSetting(oldSetting);
    }
    updateVersionFrom20To21() {
        const networkColumns = Settings.instance().createSetting('networkLogColumns', {});
        const columns = networkColumns.get();
        delete columns['timeline'];
        delete columns['waterfall'];
        networkColumns.set(columns);
    }
    updateVersionFrom21To22() {
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const breakpointsSetting = Settings.instance().createLocalSetting('breakpoints', []);
        const breakpoints = breakpointsSetting.get();
        for (const breakpoint of breakpoints) {
            breakpoint['url'] = breakpoint['sourceFileId'];
            delete breakpoint['sourceFileId'];
        }
        breakpointsSetting.set(breakpoints);
    }
    updateVersionFrom22To23() {
        // This update is no-op.
    }
    updateVersionFrom23To24() {
        const oldSetting = Settings.instance().createSetting('searchInContentScripts', false);
        const newSetting = Settings.instance().createSetting('searchInAnonymousAndContentScripts', false);
        newSetting.set(oldSetting.get());
        removeSetting(oldSetting);
    }
    updateVersionFrom24To25() {
        const defaultColumns = { status: true, type: true, initiator: true, size: true, time: true };
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const networkLogColumnsSetting = Settings.instance().createSetting('networkLogColumns', defaultColumns);
        const columns = networkLogColumnsSetting.get();
        delete columns.product;
        networkLogColumnsSetting.set(columns);
    }
    updateVersionFrom25To26() {
        const oldSetting = Settings.instance().createSetting('messageURLFilters', {});
        const urls = Object.keys(oldSetting.get());
        const textFilter = urls.map(url => `-url:${url}`).join(' ');
        if (textFilter) {
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const textFilterSetting = Settings.instance().createSetting('console.textFilter', '');
            const suffix = textFilterSetting.get() ? ` ${textFilterSetting.get()}` : '';
            textFilterSetting.set(`${textFilter}${suffix}`);
        }
        removeSetting(oldSetting);
    }
    updateVersionFrom26To27() {
        function renameKeyInObjectSetting(settingName, from, to) {
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const setting = Settings.instance().createSetting(settingName, {});
            const value = setting.get();
            if (from in value) {
                value[to] = value[from];
                delete value[from];
                setting.set(value);
            }
        }
        function renameInStringSetting(settingName, from, to) {
            const setting = Settings.instance().createSetting(settingName, '');
            const value = setting.get();
            if (value === from) {
                setting.set(to);
            }
        }
        renameKeyInObjectSetting('panel-tabOrder', 'audits2', 'audits');
        renameKeyInObjectSetting('panel-closeableTabs', 'audits2', 'audits');
        renameInStringSetting('panel-selectedTab', 'audits2', 'audits');
    }
    updateVersionFrom27To28() {
        const setting = Settings.instance().createSetting('uiTheme', 'systemPreferred');
        if (setting.get() === 'default') {
            setting.set('systemPreferred');
        }
    }
    updateVersionFrom28To29() {
        function renameKeyInObjectSetting(settingName, from, to) {
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const setting = Settings.instance().createSetting(settingName, {});
            const value = setting.get();
            if (from in value) {
                value[to] = value[from];
                delete value[from];
                setting.set(value);
            }
        }
        function renameInStringSetting(settingName, from, to) {
            const setting = Settings.instance().createSetting(settingName, '');
            const value = setting.get();
            if (value === from) {
                setting.set(to);
            }
        }
        renameKeyInObjectSetting('panel-tabOrder', 'audits', 'lighthouse');
        renameKeyInObjectSetting('panel-closeableTabs', 'audits', 'lighthouse');
        renameInStringSetting('panel-selectedTab', 'audits', 'lighthouse');
    }
    updateVersionFrom29To30() {
        // Create new location agnostic setting
        const closeableTabSetting = Settings.instance().createSetting('closeableTabs', {});
        // Read current settings
        const panelCloseableTabSetting = Settings.instance().createSetting('panel-closeableTabs', {});
        const drawerCloseableTabSetting = Settings.instance().createSetting('drawer-view-closeableTabs', {});
        const openTabsInPanel = panelCloseableTabSetting.get();
        const openTabsInDrawer = panelCloseableTabSetting.get();
        // Set #value of new setting
        const newValue = Object.assign(openTabsInDrawer, openTabsInPanel);
        closeableTabSetting.set(newValue);
        // Remove old settings
        removeSetting(panelCloseableTabSetting);
        removeSetting(drawerCloseableTabSetting);
    }
    updateVersionFrom30To31() {
        // Remove recorder_recordings setting that was used for storing recordings
        // by an old recorder experiment.
        const recordingsSetting = Settings.instance().createSetting('recorder_recordings', []);
        removeSetting(recordingsSetting);
    }
    updateVersionFrom31To32() {
        // Introduce the new 'resourceTypeName' property on stored breakpoints. Prior to
        // this change we synchronized the breakpoint only by URL, but since we don't
        // know on which resource type the given breakpoint was set, we just assume
        // 'script' here to keep things simple.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const breakpointsSetting = Settings.instance().createLocalSetting('breakpoints', []);
        const breakpoints = breakpointsSetting.get();
        for (const breakpoint of breakpoints) {
            breakpoint['resourceTypeName'] = 'script';
        }
        breakpointsSetting.set(breakpoints);
    }
    updateVersionFrom32To33() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const previouslyViewedFilesSetting = Settings.instance().createLocalSetting('previouslyViewedFiles', []);
        let previouslyViewedFiles = previouslyViewedFilesSetting.get();
        // Discard old 'previouslyViewedFiles' items that don't have a 'url' property.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        previouslyViewedFiles = previouslyViewedFiles.filter((previouslyViewedFile) => 'url' in previouslyViewedFile);
        // Introduce the new 'resourceTypeName' property on previously viewed files.
        // Prior to this change we only keyed them based on the URL, but since we
        // don't know which resource type the given file had, we just assume 'script'
        // here to keep things simple.
        for (const previouslyViewedFile of previouslyViewedFiles) {
            previouslyViewedFile['resourceTypeName'] = 'script';
        }
        previouslyViewedFilesSetting.set(previouslyViewedFiles);
    }
    updateVersionFrom33To34() {
        // Introduces the 'isLogpoint' property on stored breakpoints. This information was
        // previously encoded in the 'condition' itself. This migration leaves the condition
        // alone but ensures that 'isLogpoint' is accurate for already stored breakpoints.
        // This enables us to use the 'isLogpoint' property in code.
        // A separate migration will remove the special encoding from the condition itself
        // once all refactorings are done.
        // The prefix/suffix are hardcoded here, since these constants will be removed in
        // the future.
        const logpointPrefix = '/** DEVTOOLS_LOGPOINT */ console.log(';
        const logpointSuffix = ')';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const breakpointsSetting = Settings.instance().createLocalSetting('breakpoints', []);
        const breakpoints = breakpointsSetting.get();
        for (const breakpoint of breakpoints) {
            const isLogpoint = breakpoint.condition.startsWith(logpointPrefix) && breakpoint.condition.endsWith(logpointSuffix);
            breakpoint['isLogpoint'] = isLogpoint;
        }
        breakpointsSetting.set(breakpoints);
    }
    updateVersionFrom34To35() {
        // Uses the 'isLogpoint' property on stored breakpoints to remove the prefix/suffix
        // from logpoints. This way, we store the entered log point condition as the user
        // entered it.
        // The prefix/suffix are hardcoded here, since these constants will be removed in
        // the future.
        const logpointPrefix = '/** DEVTOOLS_LOGPOINT */ console.log(';
        const logpointSuffix = ')';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const breakpointsSetting = Settings.instance().createLocalSetting('breakpoints', []);
        const breakpoints = breakpointsSetting.get();
        for (const breakpoint of breakpoints) {
            const { condition, isLogpoint } = breakpoint;
            if (isLogpoint) {
                breakpoint.condition = condition.slice(logpointPrefix.length, condition.length - logpointSuffix.length);
            }
        }
        breakpointsSetting.set(breakpoints);
    }
    updateVersionFrom35To36() {
        // We have changed the default from 'false' to 'true' and this updates the existing setting just for once.
        Settings.instance().createSetting('showThirdPartyIssues', true).set(true);
    }
    updateVersionFrom36To37() {
        const updateStorage = (storage) => {
            for (const key of storage.keys()) {
                const normalizedKey = Settings.normalizeSettingName(key);
                if (normalizedKey !== key) {
                    const value = storage.get(key);
                    removeSetting({ name: key, storage });
                    storage.set(normalizedKey, value);
                }
            }
        };
        updateStorage(Settings.instance().globalStorage);
        updateStorage(Settings.instance().syncedStorage);
        updateStorage(Settings.instance().localStorage);
        for (const key of Settings.instance().globalStorage.keys()) {
            if ((key.startsWith('data-grid-') && key.endsWith('-column-weights')) || key.endsWith('-tab-order') ||
                key === 'views-location-override' || key === 'closeable-tabs') {
                const setting = Settings.instance().createSetting(key, {});
                setting.set(Platform.StringUtilities.toKebabCaseKeys(setting.get()));
            }
            if (key.endsWith('-selected-tab')) {
                const setting = Settings.instance().createSetting(key, '');
                setting.set(Platform.StringUtilities.toKebabCase(setting.get()));
            }
        }
    }
    updateVersionFrom37To38() {
        const getConsoleInsightsEnabledSetting = () => {
            try {
                return moduleSetting('console-insights-enabled');
            }
            catch {
                return;
            }
        };
        const consoleInsightsEnabled = getConsoleInsightsEnabledSetting();
        const onboardingFinished = Settings.instance().createLocalSetting('console-insights-onboarding-finished', false);
        if (consoleInsightsEnabled && consoleInsightsEnabled.get() === true && onboardingFinished.get() === false) {
            consoleInsightsEnabled.set(false);
        }
        if (consoleInsightsEnabled && consoleInsightsEnabled.get() === false) {
            onboardingFinished.set(false);
        }
    }
    updateVersionFrom38To39() {
        const PREFERRED_NETWORK_COND = 'preferred-network-condition';
        // crrev.com/c/5582013 renamed "Slow 3G" to "3G" and "Fast 3G" => "Slow 4G".
        // Any users with the old values need to have them moved to avoid breaking DevTools.
        // Note: we load the raw value via the globalStorage here because
        // `createSetting` creates if it is not present, and we do not want that;
        // we only want to update existing, old values.
        const setting = Settings.instance().globalStorage.get(PREFERRED_NETWORK_COND);
        if (!setting) {
            return;
        }
        try {
            const networkSetting = JSON.parse(setting);
            if (networkSetting.title === 'Slow 3G') {
                networkSetting.title = '3G';
                networkSetting.i18nTitleKey = '3G';
                Settings.instance().globalStorage.set(PREFERRED_NETWORK_COND, JSON.stringify(networkSetting));
            }
            else if (networkSetting.title === 'Fast 3G') {
                networkSetting.title = 'Slow 4G';
                networkSetting.i18nTitleKey = 'Slow 4G';
                Settings.instance().globalStorage.set(PREFERRED_NETWORK_COND, JSON.stringify(networkSetting));
            }
        }
        catch {
            // If parsing the setting threw, it's in some invalid state, so remove it.
            Settings.instance().globalStorage.remove(PREFERRED_NETWORK_COND);
        }
    }
    /**
     * There are two related migrations here for handling network throttling persistence:
     * 1. Go through all user custom throttling conditions and add a `key` property.
     * 2. If the user has a 'preferred-network-condition' setting, take the value
     *    of that and set the right key for the new 'active-network-condition-key'
     *    setting. Then, remove the now-obsolete 'preferred-network-condition'
     *    setting.
     */
    updateVersionFrom39To40() {
        const hasCustomNetworkConditionsSetting = () => {
            try {
                // this will error if it does not exist
                moduleSetting('custom-network-conditions');
                return true;
            }
            catch {
                return false;
            }
        };
        if (hasCustomNetworkConditionsSetting()) {
            /**
             * We added keys to custom network throttling conditions in M140, so we
             * need to go through any existing profiles the user has and add the key to
             * them.
             * We can't use the SDK.NetworkManager.Condition here as it would be a
             * circular dependency. All that matters is that these conditions are
             * objects, and we need to set the right key on each one. The actual keys &
             * values in the object are not important.
             */
            const conditionsSetting = moduleSetting('custom-network-conditions');
            const customConditions = conditionsSetting.get();
            if (customConditions?.length > 0) {
                customConditions.forEach((condition, i) => {
                    // This could be run multiple times, make sure that we don't override any
                    // existing keys.
                    if (condition.key) {
                        return;
                    }
                    // The format of this key is important: see
                    // SDK.NetworkManager.UserDefinedThrottlingConditionKey
                    condition.key = `USER_CUSTOM_SETTING_${i + 1}`;
                });
                conditionsSetting.set(customConditions);
            }
        }
        // Additionally, we need to make sure we persist the right throttling for
        // users who have a preferred-network-condition set.
        const PREFERRED_NETWORK_COND_SETTING = 'preferred-network-condition';
        // We shipped a change to how we persist network throttling conditions and
        // added a `key` property rather than rely on any user visible string which
        // is more likely to change. This migration step tries to update the
        // setting for users, or removes it if we fail, so they start fresh next
        // time they load DevTools.
        const setting = Settings.instance().globalStorage.get(PREFERRED_NETWORK_COND_SETTING);
        if (!setting) {
            return;
        }
        // The keys here are the UI Strings as of July 2025 (shipped in M139).
        // This migration shipped in M140. The values are the values of the
        // `PredefinedThrottlingConditionKey` in SDK.NetworkManager.
        const UI_STRING_TO_NEW_KEY = {
            'Fast 4G': 'SPEED_FAST_4G',
            'Slow 4G': 'SPEED_SLOW_4G',
            '3G': 'SPEED_3G',
            'No throttling': 'NO_THROTTLING',
            Offline: 'OFFLINE'
        };
        try {
            const networkSetting = JSON.parse(setting);
            if (networkSetting.i18nTitleKey && UI_STRING_TO_NEW_KEY.hasOwnProperty(networkSetting.i18nTitleKey)) {
                const key = UI_STRING_TO_NEW_KEY[networkSetting.i18nTitleKey];
                // The second argument is the default value, so it's important that we
                // set this to the default, and then update it to the new key.
                const newSetting = Settings.instance().createSetting('active-network-condition-key', 'NO_THROTTLING');
                newSetting.set(key);
            }
        }
        finally {
            // This setting is now not used, so we can remove it.
            Settings.instance().globalStorage.remove(PREFERRED_NETWORK_COND_SETTING);
        }
    }
    /*
     * Any new migration should be added before this comment.
     *
     * IMPORTANT: Migrations must be idempotent, since they may be applied
     * multiple times! E.g. when renaming a setting one has to check that the
     * a setting with the new name does not yet exist.
     * ----------------------------------------------------------------------- */
    migrateSettingsFromLocalStorage() {
        // This step migrates all the settings except for the ones below into the browser profile.
        const localSettings = new Set([
            'advancedSearchConfig',
            'breakpoints',
            'consoleHistory',
            'domBreakpoints',
            'eventListenerBreakpoints',
            'fileSystemMapping',
            'lastSelectedSourcesSidebarPaneTab',
            'previouslyViewedFiles',
            'savedURLs',
            'watchExpressions',
            'workspaceExcludedFolders',
            'xhrBreakpoints',
        ]);
        if (!window.localStorage) {
            return;
        }
        for (const key in window.localStorage) {
            if (localSettings.has(key)) {
                continue;
            }
            const value = window.localStorage[key];
            window.localStorage.removeItem(key);
            Settings.instance().globalStorage.set(key, value);
        }
    }
    clearBreakpointsWhenTooMany(breakpointsSetting, maxBreakpointsCount) {
        // If there are too many breakpoints in a storage, it is likely due to a recent bug that caused
        // periodical breakpoints duplication leading to inspector slowness.
        if (breakpointsSetting.get().length > maxBreakpointsCount) {
            breakpointsSetting.set([]);
        }
    }
}
_VersionController_globalVersionSetting = new WeakMap(), _VersionController_syncedVersionSetting = new WeakMap(), _VersionController_localVersionSetting = new WeakMap();
VersionController.GLOBAL_VERSION_SETTING_NAME = 'inspectorVersion';
VersionController.SYNCED_VERSION_SETTING_NAME = 'syncedInspectorVersion';
VersionController.LOCAL_VERSION_SETTING_NAME = 'localInspectorVersion';
VersionController.CURRENT_VERSION = 40;
export var SettingStorageType;
(function (SettingStorageType) {
    /** Persists with the active Chrome profile but also syncs the settings across devices via Chrome Sync. */
    SettingStorageType["SYNCED"] = "Synced";
    /** Persists with the active Chrome profile, but not synchronized to other devices.
     * The default SettingStorageType of createSetting(). */
    SettingStorageType["GLOBAL"] = "Global";
    /** Uses Window.localStorage. Not recommended, legacy. */
    SettingStorageType["LOCAL"] = "Local";
    /** Session storage dies when DevTools window closes. Useful for atypical conditions that should be reverted when the
     * user is done with their task. (eg Emulation modes, Debug overlays). These are also not carried into/out of incognito */
    SettingStorageType["SESSION"] = "Session";
})(SettingStorageType || (SettingStorageType = {}));
export function moduleSetting(settingName) {
    return Settings.instance().moduleSetting(settingName);
}
export function settingForTest(settingName) {
    return Settings.instance().settingForTest(settingName);
}
export { getLocalizedSettingsCategory, maybeRemoveSettingExtension, registerSettingExtension, registerSettingsForTest, resetSettings, SettingCategory, SettingType, };
//# sourceMappingURL=Settings.js.map