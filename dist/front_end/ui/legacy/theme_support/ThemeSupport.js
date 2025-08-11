// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/* eslint-disable rulesdir/no-imperative-dom-api */
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
var _ThemeSupport_instances, _ThemeSupport_documentsToTheme, _ThemeSupport_darkThemeMediaQuery, _ThemeSupport_highContrastMediaQuery, _ThemeSupport_onThemeChangeListener, _ThemeSupport_onHostThemeChangeListener, _ThemeSupport_dispose, _ThemeSupport_applyTheme, _ThemeSupport_applyThemeToDocument, _ThemeSupport_fetchColorsAndApplyHostTheme;
/*
 * Copyright (C) 2011 Google Inc.  All rights reserved.
 * Copyright (C) 2006, 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) 2007 Matt Lilek (pewtermoose@gmail.com).
 * Copyright (C) 2009 Joseph Pecoraro
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
import * as Common from '../../../core/common/common.js';
import * as Host from '../../../core/host/host.js';
import * as Root from '../../../core/root/root.js';
let themeSupportInstance;
const themeValueByTargetByName = new Map();
export class ThemeSupport extends EventTarget {
    constructor(setting) {
        super();
        _ThemeSupport_instances.add(this);
        this.setting = setting;
        this.themeNameInternal = 'default';
        this.computedStyleOfHTML = Common.Lazy.lazy(() => window.getComputedStyle(document.documentElement));
        _ThemeSupport_documentsToTheme.set(this, new Set([document]));
        _ThemeSupport_darkThemeMediaQuery.set(this, void 0);
        _ThemeSupport_highContrastMediaQuery.set(this, void 0);
        _ThemeSupport_onThemeChangeListener.set(this, () => __classPrivateFieldGet(this, _ThemeSupport_instances, "m", _ThemeSupport_applyTheme).call(this));
        _ThemeSupport_onHostThemeChangeListener.set(this, () => this.fetchColorsAndApplyHostTheme());
        // When the theme changes we instantiate a new theme support and reapply.
        // Equally if the user has set to match the system and the OS preference changes
        // we perform the same change.
        __classPrivateFieldSet(this, _ThemeSupport_darkThemeMediaQuery, window.matchMedia('(prefers-color-scheme: dark)'), "f");
        __classPrivateFieldSet(this, _ThemeSupport_highContrastMediaQuery, window.matchMedia('(forced-colors: active)'), "f");
        __classPrivateFieldGet(this, _ThemeSupport_darkThemeMediaQuery, "f").addEventListener('change', __classPrivateFieldGet(this, _ThemeSupport_onThemeChangeListener, "f"));
        __classPrivateFieldGet(this, _ThemeSupport_highContrastMediaQuery, "f").addEventListener('change', __classPrivateFieldGet(this, _ThemeSupport_onThemeChangeListener, "f"));
        setting.addChangeListener(__classPrivateFieldGet(this, _ThemeSupport_onThemeChangeListener, "f"));
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.events.addEventListener(Host.InspectorFrontendHostAPI.Events.ColorThemeChanged, __classPrivateFieldGet(this, _ThemeSupport_onHostThemeChangeListener, "f"));
    }
    static hasInstance() {
        return typeof themeSupportInstance !== 'undefined';
    }
    static instance(opts = { forceNew: null, setting: null }) {
        const { forceNew, setting } = opts;
        if (!themeSupportInstance || forceNew) {
            if (!setting) {
                throw new Error(`Unable to create theme support: setting must be provided: ${new Error().stack}`);
            }
            if (themeSupportInstance) {
                __classPrivateFieldGet(themeSupportInstance, _ThemeSupport_instances, "m", _ThemeSupport_dispose).call(themeSupportInstance);
            }
            themeSupportInstance = new ThemeSupport(setting);
        }
        return themeSupportInstance;
    }
    /**
     * Adds additional `Document` instances that should be themed besides the default
     * `window.document` in which this ThemeSupport instance was created.
     */
    addDocumentToTheme(document) {
        __classPrivateFieldGet(this, _ThemeSupport_documentsToTheme, "f").add(document);
        __classPrivateFieldGet(this, _ThemeSupport_instances, "m", _ThemeSupport_fetchColorsAndApplyHostTheme).call(this, document);
    }
    getComputedValue(propertyName, target = null) {
        // Since we might query the same property name from various targets we need to support
        // per-target caching of computed values. Here we attempt to locate the particular computed
        // value cache for the target element. If no target was specified we use the default computed root,
        // which belongs to the documentElement.
        let themeValueByName = themeValueByTargetByName.get(target);
        if (!themeValueByName) {
            themeValueByName = new Map();
            themeValueByTargetByName.set(target, themeValueByName);
        }
        // Since theme changes trigger a reload, we can avoid repeatedly looking up color values
        // dynamically. Instead we can look up the first time and cache them for future use,
        // knowing that the cache will be invalidated by virtue of a reload when the theme changes.
        let themeValue = themeValueByName.get(propertyName);
        if (!themeValue) {
            const styleDeclaration = target ? window.getComputedStyle(target) : this.computedStyleOfHTML();
            if (typeof styleDeclaration === 'symbol') {
                throw new Error(`Computed value for property (${propertyName}) could not be found on documentElement.`);
            }
            themeValue = styleDeclaration.getPropertyValue(propertyName).trim();
            // If we receive back an empty value (nothing has been set) we don't store it for the future.
            // This means that subsequent requests will continue to query the styles in case the value
            // has been set.
            if (themeValue) {
                themeValueByName.set(propertyName, themeValue);
            }
        }
        return themeValue;
    }
    themeName() {
        return this.themeNameInternal;
    }
    static clearThemeCache() {
        themeValueByTargetByName.clear();
    }
    fetchColorsAndApplyHostTheme() {
        for (const document of __classPrivateFieldGet(this, _ThemeSupport_documentsToTheme, "f")) {
            __classPrivateFieldGet(this, _ThemeSupport_instances, "m", _ThemeSupport_fetchColorsAndApplyHostTheme).call(this, document);
        }
    }
}
_ThemeSupport_documentsToTheme = new WeakMap(), _ThemeSupport_darkThemeMediaQuery = new WeakMap(), _ThemeSupport_highContrastMediaQuery = new WeakMap(), _ThemeSupport_onThemeChangeListener = new WeakMap(), _ThemeSupport_onHostThemeChangeListener = new WeakMap(), _ThemeSupport_instances = new WeakSet(), _ThemeSupport_dispose = function _ThemeSupport_dispose() {
    __classPrivateFieldGet(this, _ThemeSupport_darkThemeMediaQuery, "f").removeEventListener('change', __classPrivateFieldGet(this, _ThemeSupport_onThemeChangeListener, "f"));
    __classPrivateFieldGet(this, _ThemeSupport_highContrastMediaQuery, "f").removeEventListener('change', __classPrivateFieldGet(this, _ThemeSupport_onThemeChangeListener, "f"));
    this.setting.removeChangeListener(__classPrivateFieldGet(this, _ThemeSupport_onThemeChangeListener, "f"));
    Host.InspectorFrontendHost.InspectorFrontendHostInstance.events.removeEventListener(Host.InspectorFrontendHostAPI.Events.ColorThemeChanged, __classPrivateFieldGet(this, _ThemeSupport_onHostThemeChangeListener, "f"));
}, _ThemeSupport_applyTheme = function _ThemeSupport_applyTheme() {
    for (const document of __classPrivateFieldGet(this, _ThemeSupport_documentsToTheme, "f")) {
        __classPrivateFieldGet(this, _ThemeSupport_instances, "m", _ThemeSupport_applyThemeToDocument).call(this, document);
    }
}, _ThemeSupport_applyThemeToDocument = function _ThemeSupport_applyThemeToDocument(document) {
    const isForcedColorsMode = window.matchMedia('(forced-colors: active)').matches;
    const systemPreferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default';
    const useSystemPreferred = this.setting.get() === 'systemPreferred' || isForcedColorsMode;
    this.themeNameInternal = useSystemPreferred ? systemPreferredTheme : this.setting.get();
    document.documentElement.classList.toggle('theme-with-dark-background', this.themeNameInternal === 'dark');
    const useChromeTheme = Common.Settings.moduleSetting('chrome-theme-colors').get();
    const isIncognito = Root.Runtime.hostConfig.isOffTheRecord === true;
    // Baseline is the name of Chrome's default color theme and there are two of these: default and grayscale.
    // The collective name for the rest of the color themes is dynamic.
    // In the baseline themes Chrome uses custom values for surface colors, whereas for dynamic themes these are color-mixed.
    // To match Chrome we need to know if any of the baseline themes is currently active and assign specific values to surface colors.
    if (isIncognito) {
        document.documentElement.classList.toggle('baseline-grayscale', true);
    }
    else if (useChromeTheme) {
        const selectedTheme = getComputedStyle(document.body).getPropertyValue('--user-color-source');
        document.documentElement.classList.toggle('baseline-default', selectedTheme === 'baseline-default');
        document.documentElement.classList.toggle('baseline-grayscale', selectedTheme === 'baseline-grayscale');
    }
    else {
        document.documentElement.classList.toggle('baseline-grayscale', true);
    }
    // In the event the theme changes we need to clear caches and notify subscribers.
    themeValueByTargetByName.clear();
    this.dispatchEvent(new ThemeChangeEvent());
}, _ThemeSupport_fetchColorsAndApplyHostTheme = function _ThemeSupport_fetchColorsAndApplyHostTheme(document) {
    const useChromeTheme = Common.Settings.moduleSetting('chrome-theme-colors').get();
    if (Host.InspectorFrontendHost.InspectorFrontendHostInstance.isHostedMode() || !useChromeTheme) {
        __classPrivateFieldGet(this, _ThemeSupport_instances, "m", _ThemeSupport_applyThemeToDocument).call(this, document);
        return;
    }
    const oldColorsCssLink = document.querySelector('link[href*=\'//theme/colors.css\']');
    const newColorsCssLink = document.createElement('link');
    newColorsCssLink.setAttribute('href', `devtools://theme/colors.css?sets=ui,chrome&version=${(new Date()).getTime().toString()}`);
    newColorsCssLink.setAttribute('rel', 'stylesheet');
    newColorsCssLink.setAttribute('type', 'text/css');
    newColorsCssLink.onload = () => {
        if (oldColorsCssLink) {
            oldColorsCssLink.remove();
        }
        __classPrivateFieldGet(this, _ThemeSupport_instances, "m", _ThemeSupport_applyThemeToDocument).call(this, document);
    };
    document.body.appendChild(newColorsCssLink);
};
export class ThemeChangeEvent extends Event {
    constructor() {
        super(ThemeChangeEvent.eventName, { bubbles: true, composed: true });
    }
}
ThemeChangeEvent.eventName = 'themechange';
//# sourceMappingURL=ThemeSupport.js.map