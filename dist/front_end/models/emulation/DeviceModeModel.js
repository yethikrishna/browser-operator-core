// Copyright 2015 The Chromium Authors. All rights reserved.
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
var _DeviceModeModel_screenRectInternal, _DeviceModeModel_visiblePageRectInternal, _DeviceModeModel_availableSize, _DeviceModeModel_preferredSize, _DeviceModeModel_initialized, _DeviceModeModel_appliedDeviceSizeInternal, _DeviceModeModel_appliedDeviceScaleFactorInternal, _DeviceModeModel_appliedUserAgentTypeInternal, _DeviceModeModel_webPlatformExperimentalFeaturesEnabledInternal, _DeviceModeModel_scaleSettingInternal, _DeviceModeModel_scaleInternal, _DeviceModeModel_widthSetting, _DeviceModeModel_heightSetting, _DeviceModeModel_uaSettingInternal, _DeviceModeModel_deviceScaleFactorSettingInternal, _DeviceModeModel_deviceOutlineSettingInternal, _DeviceModeModel_toolbarControlsEnabledSettingInternal, _DeviceModeModel_typeInternal, _DeviceModeModel_deviceInternal, _DeviceModeModel_modeInternal, _DeviceModeModel_fitScaleInternal, _DeviceModeModel_touchEnabled, _DeviceModeModel_touchMobile, _DeviceModeModel_emulationModel, _DeviceModeModel_onModelAvailable, _DeviceModeModel_outlineRectInternal;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import { Horizontal, HorizontalSpanned, Vertical, VerticalSpanned, } from './EmulatedDevices.js';
const UIStrings = {
    /**
     * @description Error message shown in the Devices settings pane when the user enters an empty
     * width for a custom device.
     */
    widthCannotBeEmpty: 'Width cannot be empty.',
    /**
     * @description Error message shown in the Devices settings pane when the user enters an invalid
     * width for a custom device.
     */
    widthMustBeANumber: 'Width must be a number.',
    /**
     * @description Error message shown in the Devices settings pane when the user has entered a width
     * for a custom device that is too large.
     * @example {9999} PH1
     */
    widthMustBeLessThanOrEqualToS: 'Width must be less than or equal to {PH1}.',
    /**
     * @description Error message shown in the Devices settings pane when the user has entered a width
     * for a custom device that is too small.
     * @example {50} PH1
     */
    widthMustBeGreaterThanOrEqualToS: 'Width must be greater than or equal to {PH1}.',
    /**
     * @description Error message shown in the Devices settings pane when the user enters an empty
     * height for a custom device.
     */
    heightCannotBeEmpty: 'Height cannot be empty.',
    /**
     * @description Error message shown in the Devices settings pane when the user enters an invalid
     * height for a custom device.
     */
    heightMustBeANumber: 'Height must be a number.',
    /**
     * @description Error message shown in the Devices settings pane when the user has entered a height
     * for a custom device that is too large.
     * @example {9999} PH1
     */
    heightMustBeLessThanOrEqualToS: 'Height must be less than or equal to {PH1}.',
    /**
     * @description Error message shown in the Devices settings pane when the user has entered a height
     * for a custom device that is too small.
     * @example {50} PH1
     */
    heightMustBeGreaterThanOrEqualTo: 'Height must be greater than or equal to {PH1}.',
    /**
     * @description Error message shown in the Devices settings pane when the user enters an invalid
     * device pixel ratio for a custom device.
     */
    devicePixelRatioMustBeANumberOr: 'Device pixel ratio must be a number or blank.',
    /**
     * @description Error message shown in the Devices settings pane when the user enters a device
     * pixel ratio for a custom device that is too large.
     * @example {10} PH1
     */
    devicePixelRatioMustBeLessThanOr: 'Device pixel ratio must be less than or equal to {PH1}.',
    /**
     * @description Error message shown in the Devices settings pane when the user enters a device
     * pixel ratio for a custom device that is too small.
     * @example {0} PH1
     */
    devicePixelRatioMustBeGreater: 'Device pixel ratio must be greater than or equal to {PH1}.',
};
const str_ = i18n.i18n.registerUIStrings('models/emulation/DeviceModeModel.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
let deviceModeModelInstance;
export class DeviceModeModel extends Common.ObjectWrapper.ObjectWrapper {
    constructor() {
        super();
        _DeviceModeModel_screenRectInternal.set(this, void 0);
        _DeviceModeModel_visiblePageRectInternal.set(this, void 0);
        _DeviceModeModel_availableSize.set(this, void 0);
        _DeviceModeModel_preferredSize.set(this, void 0);
        _DeviceModeModel_initialized.set(this, void 0);
        _DeviceModeModel_appliedDeviceSizeInternal.set(this, void 0);
        _DeviceModeModel_appliedDeviceScaleFactorInternal.set(this, void 0);
        _DeviceModeModel_appliedUserAgentTypeInternal.set(this, void 0);
        _DeviceModeModel_webPlatformExperimentalFeaturesEnabledInternal.set(this, void 0);
        _DeviceModeModel_scaleSettingInternal.set(this, void 0);
        _DeviceModeModel_scaleInternal.set(this, void 0);
        _DeviceModeModel_widthSetting.set(this, void 0);
        _DeviceModeModel_heightSetting.set(this, void 0);
        _DeviceModeModel_uaSettingInternal.set(this, void 0);
        _DeviceModeModel_deviceScaleFactorSettingInternal.set(this, void 0);
        _DeviceModeModel_deviceOutlineSettingInternal.set(this, void 0);
        _DeviceModeModel_toolbarControlsEnabledSettingInternal.set(this, void 0);
        _DeviceModeModel_typeInternal.set(this, void 0);
        _DeviceModeModel_deviceInternal.set(this, void 0);
        _DeviceModeModel_modeInternal.set(this, void 0);
        _DeviceModeModel_fitScaleInternal.set(this, void 0);
        _DeviceModeModel_touchEnabled.set(this, void 0);
        _DeviceModeModel_touchMobile.set(this, void 0);
        _DeviceModeModel_emulationModel.set(this, void 0);
        _DeviceModeModel_onModelAvailable.set(this, void 0);
        _DeviceModeModel_outlineRectInternal.set(this, void 0);
        __classPrivateFieldSet(this, _DeviceModeModel_screenRectInternal, new Rect(0, 0, 1, 1), "f");
        __classPrivateFieldSet(this, _DeviceModeModel_visiblePageRectInternal, new Rect(0, 0, 1, 1), "f");
        __classPrivateFieldSet(this, _DeviceModeModel_availableSize, new UI.Geometry.Size(1, 1), "f");
        __classPrivateFieldSet(this, _DeviceModeModel_preferredSize, new UI.Geometry.Size(1, 1), "f");
        __classPrivateFieldSet(this, _DeviceModeModel_initialized, false, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_appliedDeviceSizeInternal, new UI.Geometry.Size(1, 1), "f");
        __classPrivateFieldSet(this, _DeviceModeModel_appliedDeviceScaleFactorInternal, window.devicePixelRatio, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_appliedUserAgentTypeInternal, "Desktop" /* UA.DESKTOP */, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_webPlatformExperimentalFeaturesEnabledInternal, window.visualViewport ? 'segments' in window.visualViewport : false, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_scaleSettingInternal, Common.Settings.Settings.instance().createSetting('emulation.device-scale', 1), "f");
        // We've used to allow zero before.
        if (!__classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").get()) {
            __classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").set(1);
        }
        __classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").addChangeListener(this.scaleSettingChanged, this);
        __classPrivateFieldSet(this, _DeviceModeModel_scaleInternal, 1, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_widthSetting, Common.Settings.Settings.instance().createSetting('emulation.device-width', 400), "f");
        if (__classPrivateFieldGet(this, _DeviceModeModel_widthSetting, "f").get() < MinDeviceSize) {
            __classPrivateFieldGet(this, _DeviceModeModel_widthSetting, "f").set(MinDeviceSize);
        }
        if (__classPrivateFieldGet(this, _DeviceModeModel_widthSetting, "f").get() > MaxDeviceSize) {
            __classPrivateFieldGet(this, _DeviceModeModel_widthSetting, "f").set(MaxDeviceSize);
        }
        __classPrivateFieldGet(this, _DeviceModeModel_widthSetting, "f").addChangeListener(this.widthSettingChanged, this);
        __classPrivateFieldSet(this, _DeviceModeModel_heightSetting, Common.Settings.Settings.instance().createSetting('emulation.device-height', 0), "f");
        if (__classPrivateFieldGet(this, _DeviceModeModel_heightSetting, "f").get() && __classPrivateFieldGet(this, _DeviceModeModel_heightSetting, "f").get() < MinDeviceSize) {
            __classPrivateFieldGet(this, _DeviceModeModel_heightSetting, "f").set(MinDeviceSize);
        }
        if (__classPrivateFieldGet(this, _DeviceModeModel_heightSetting, "f").get() > MaxDeviceSize) {
            __classPrivateFieldGet(this, _DeviceModeModel_heightSetting, "f").set(MaxDeviceSize);
        }
        __classPrivateFieldGet(this, _DeviceModeModel_heightSetting, "f").addChangeListener(this.heightSettingChanged, this);
        __classPrivateFieldSet(this, _DeviceModeModel_uaSettingInternal, Common.Settings.Settings.instance().createSetting('emulation.device-ua', "Mobile" /* UA.MOBILE */), "f");
        __classPrivateFieldGet(this, _DeviceModeModel_uaSettingInternal, "f").addChangeListener(this.uaSettingChanged, this);
        __classPrivateFieldSet(this, _DeviceModeModel_deviceScaleFactorSettingInternal, Common.Settings.Settings.instance().createSetting('emulation.device-scale-factor', 0), "f");
        __classPrivateFieldGet(this, _DeviceModeModel_deviceScaleFactorSettingInternal, "f").addChangeListener(this.deviceScaleFactorSettingChanged, this);
        __classPrivateFieldSet(this, _DeviceModeModel_deviceOutlineSettingInternal, Common.Settings.Settings.instance().moduleSetting('emulation.show-device-outline'), "f");
        __classPrivateFieldGet(this, _DeviceModeModel_deviceOutlineSettingInternal, "f").addChangeListener(this.deviceOutlineSettingChanged, this);
        __classPrivateFieldSet(this, _DeviceModeModel_toolbarControlsEnabledSettingInternal, Common.Settings.Settings.instance().createSetting('emulation.toolbar-controls-enabled', true, "Session" /* Common.Settings.SettingStorageType.SESSION */), "f");
        __classPrivateFieldSet(this, _DeviceModeModel_typeInternal, Type.None, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_deviceInternal, null, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_modeInternal, null, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_fitScaleInternal, 1, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_touchEnabled, false, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_touchMobile, false, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_emulationModel, null, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_onModelAvailable, null, "f");
        SDK.TargetManager.TargetManager.instance().observeModels(SDK.EmulationModel.EmulationModel, this);
    }
    static instance(opts) {
        if (!deviceModeModelInstance || opts?.forceNew) {
            deviceModeModelInstance = new DeviceModeModel();
        }
        return deviceModeModelInstance;
    }
    /**
     * This wraps `instance()` in a try/catch because in some DevTools entry points
     * (such as worker_app.ts) the Emulation panel is not included and as such
     * the below code fails; it tries to instantiate the model which requires
     * reading the value of a setting which has not been registered.
     * See crbug.com/361515458 for an example bug that this resolves.
     */
    static tryInstance(opts) {
        try {
            return this.instance(opts);
        }
        catch {
            return null;
        }
    }
    static widthValidator(value) {
        let valid = false;
        let errorMessage;
        if (!value) {
            errorMessage = i18nString(UIStrings.widthCannotBeEmpty);
        }
        else if (!/^[\d]+$/.test(value)) {
            errorMessage = i18nString(UIStrings.widthMustBeANumber);
        }
        else if (Number(value) > MaxDeviceSize) {
            errorMessage = i18nString(UIStrings.widthMustBeLessThanOrEqualToS, { PH1: MaxDeviceSize });
        }
        else if (Number(value) < MinDeviceSize) {
            errorMessage = i18nString(UIStrings.widthMustBeGreaterThanOrEqualToS, { PH1: MinDeviceSize });
        }
        else {
            valid = true;
        }
        return { valid, errorMessage };
    }
    static heightValidator(value) {
        let valid = false;
        let errorMessage;
        if (!value) {
            errorMessage = i18nString(UIStrings.heightCannotBeEmpty);
        }
        else if (!/^[\d]+$/.test(value)) {
            errorMessage = i18nString(UIStrings.heightMustBeANumber);
        }
        else if (Number(value) > MaxDeviceSize) {
            errorMessage = i18nString(UIStrings.heightMustBeLessThanOrEqualToS, { PH1: MaxDeviceSize });
        }
        else if (Number(value) < MinDeviceSize) {
            errorMessage = i18nString(UIStrings.heightMustBeGreaterThanOrEqualTo, { PH1: MinDeviceSize });
        }
        else {
            valid = true;
        }
        return { valid, errorMessage };
    }
    static scaleValidator(value) {
        let valid = false;
        let errorMessage;
        const parsedValue = Number(value.trim());
        if (!value) {
            valid = true;
        }
        else if (Number.isNaN(parsedValue)) {
            errorMessage = i18nString(UIStrings.devicePixelRatioMustBeANumberOr);
        }
        else if (Number(value) > MaxDeviceScaleFactor) {
            errorMessage = i18nString(UIStrings.devicePixelRatioMustBeLessThanOr, { PH1: MaxDeviceScaleFactor });
        }
        else if (Number(value) < MinDeviceScaleFactor) {
            errorMessage = i18nString(UIStrings.devicePixelRatioMustBeGreater, { PH1: MinDeviceScaleFactor });
        }
        else {
            valid = true;
        }
        return { valid, errorMessage };
    }
    get scaleSettingInternal() {
        return __classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f");
    }
    setAvailableSize(availableSize, preferredSize) {
        __classPrivateFieldSet(this, _DeviceModeModel_availableSize, availableSize, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_preferredSize, preferredSize, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_initialized, true, "f");
        this.calculateAndEmulate(false);
    }
    emulate(type, device, mode, scale) {
        const resetPageScaleFactor = __classPrivateFieldGet(this, _DeviceModeModel_typeInternal, "f") !== type || __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f") !== device || __classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f") !== mode;
        __classPrivateFieldSet(this, _DeviceModeModel_typeInternal, type, "f");
        if (type === Type.Device && device && mode) {
            console.assert(Boolean(device) && Boolean(mode), 'Must pass device and mode for device emulation');
            __classPrivateFieldSet(this, _DeviceModeModel_modeInternal, mode, "f");
            __classPrivateFieldSet(this, _DeviceModeModel_deviceInternal, device, "f");
            if (__classPrivateFieldGet(this, _DeviceModeModel_initialized, "f")) {
                const orientation = device.orientationByName(mode.orientation);
                __classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").set(scale ||
                    this.calculateFitScale(orientation.width, orientation.height, this.currentOutline(), this.currentInsets()));
            }
        }
        else {
            __classPrivateFieldSet(this, _DeviceModeModel_deviceInternal, null, "f");
            __classPrivateFieldSet(this, _DeviceModeModel_modeInternal, null, "f");
        }
        if (type !== Type.None) {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.DeviceModeEnabled);
        }
        this.calculateAndEmulate(resetPageScaleFactor);
    }
    setWidth(width) {
        const max = Math.min(MaxDeviceSize, this.preferredScaledWidth());
        width = Math.max(Math.min(width, max), 1);
        __classPrivateFieldGet(this, _DeviceModeModel_widthSetting, "f").set(width);
    }
    setWidthAndScaleToFit(width) {
        width = Math.max(Math.min(width, MaxDeviceSize), 1);
        __classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").set(this.calculateFitScale(width, __classPrivateFieldGet(this, _DeviceModeModel_heightSetting, "f").get()));
        __classPrivateFieldGet(this, _DeviceModeModel_widthSetting, "f").set(width);
    }
    setHeight(height) {
        const max = Math.min(MaxDeviceSize, this.preferredScaledHeight());
        height = Math.max(Math.min(height, max), 0);
        if (height === this.preferredScaledHeight()) {
            height = 0;
        }
        __classPrivateFieldGet(this, _DeviceModeModel_heightSetting, "f").set(height);
    }
    setHeightAndScaleToFit(height) {
        height = Math.max(Math.min(height, MaxDeviceSize), 0);
        __classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").set(this.calculateFitScale(__classPrivateFieldGet(this, _DeviceModeModel_widthSetting, "f").get(), height));
        __classPrivateFieldGet(this, _DeviceModeModel_heightSetting, "f").set(height);
    }
    setScale(scale) {
        __classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").set(scale);
    }
    device() {
        return __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f");
    }
    mode() {
        return __classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f");
    }
    type() {
        return __classPrivateFieldGet(this, _DeviceModeModel_typeInternal, "f");
    }
    screenImage() {
        return (__classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f") && __classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f")) ? __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").modeImage(__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f")) : '';
    }
    outlineImage() {
        return (__classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f") && __classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f") && __classPrivateFieldGet(this, _DeviceModeModel_deviceOutlineSettingInternal, "f").get()) ?
            __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").outlineImage(__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f")) :
            '';
    }
    outlineRect() {
        return __classPrivateFieldGet(this, _DeviceModeModel_outlineRectInternal, "f") || null;
    }
    screenRect() {
        return __classPrivateFieldGet(this, _DeviceModeModel_screenRectInternal, "f");
    }
    visiblePageRect() {
        return __classPrivateFieldGet(this, _DeviceModeModel_visiblePageRectInternal, "f");
    }
    scale() {
        return __classPrivateFieldGet(this, _DeviceModeModel_scaleInternal, "f");
    }
    fitScale() {
        return __classPrivateFieldGet(this, _DeviceModeModel_fitScaleInternal, "f");
    }
    appliedDeviceSize() {
        return __classPrivateFieldGet(this, _DeviceModeModel_appliedDeviceSizeInternal, "f");
    }
    appliedDeviceScaleFactor() {
        return __classPrivateFieldGet(this, _DeviceModeModel_appliedDeviceScaleFactorInternal, "f");
    }
    appliedUserAgentType() {
        return __classPrivateFieldGet(this, _DeviceModeModel_appliedUserAgentTypeInternal, "f");
    }
    isFullHeight() {
        return !__classPrivateFieldGet(this, _DeviceModeModel_heightSetting, "f").get();
    }
    isMobile() {
        switch (__classPrivateFieldGet(this, _DeviceModeModel_typeInternal, "f")) {
            case Type.Device:
                return __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f") ? __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").mobile() : false;
            case Type.None:
                return false;
            case Type.Responsive:
                return __classPrivateFieldGet(this, _DeviceModeModel_uaSettingInternal, "f").get() === "Mobile" /* UA.MOBILE */ || __classPrivateFieldGet(this, _DeviceModeModel_uaSettingInternal, "f").get() === "Mobile (no touch)" /* UA.MOBILE_NO_TOUCH */;
        }
        return false;
    }
    enabledSetting() {
        return Common.Settings.Settings.instance().createSetting('emulation.show-device-mode', false);
    }
    scaleSetting() {
        return __classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f");
    }
    uaSetting() {
        return __classPrivateFieldGet(this, _DeviceModeModel_uaSettingInternal, "f");
    }
    deviceScaleFactorSetting() {
        return __classPrivateFieldGet(this, _DeviceModeModel_deviceScaleFactorSettingInternal, "f");
    }
    deviceOutlineSetting() {
        return __classPrivateFieldGet(this, _DeviceModeModel_deviceOutlineSettingInternal, "f");
    }
    toolbarControlsEnabledSetting() {
        return __classPrivateFieldGet(this, _DeviceModeModel_toolbarControlsEnabledSettingInternal, "f");
    }
    reset() {
        __classPrivateFieldGet(this, _DeviceModeModel_deviceScaleFactorSettingInternal, "f").set(0);
        __classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").set(1);
        this.setWidth(400);
        this.setHeight(0);
        __classPrivateFieldGet(this, _DeviceModeModel_uaSettingInternal, "f").set("Mobile" /* UA.MOBILE */);
    }
    modelAdded(emulationModel) {
        if (emulationModel.target() === SDK.TargetManager.TargetManager.instance().primaryPageTarget() &&
            emulationModel.supportsDeviceEmulation()) {
            __classPrivateFieldSet(this, _DeviceModeModel_emulationModel, emulationModel, "f");
            if (__classPrivateFieldGet(this, _DeviceModeModel_onModelAvailable, "f")) {
                const callback = __classPrivateFieldGet(this, _DeviceModeModel_onModelAvailable, "f");
                __classPrivateFieldSet(this, _DeviceModeModel_onModelAvailable, null, "f");
                callback();
            }
            const resourceTreeModel = emulationModel.target().model(SDK.ResourceTreeModel.ResourceTreeModel);
            if (resourceTreeModel) {
                resourceTreeModel.addEventListener(SDK.ResourceTreeModel.Events.FrameResized, this.onFrameChange, this);
                resourceTreeModel.addEventListener(SDK.ResourceTreeModel.Events.FrameNavigated, this.onFrameChange, this);
            }
        }
        else {
            void emulationModel.emulateTouch(__classPrivateFieldGet(this, _DeviceModeModel_touchEnabled, "f"), __classPrivateFieldGet(this, _DeviceModeModel_touchMobile, "f"));
        }
    }
    modelRemoved(emulationModel) {
        if (__classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f") === emulationModel) {
            __classPrivateFieldSet(this, _DeviceModeModel_emulationModel, null, "f");
        }
    }
    inspectedURL() {
        return __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f") ? __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f").target().inspectedURL() : null;
    }
    onFrameChange() {
        const overlayModel = __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f") ? __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f").overlayModel() : null;
        if (!overlayModel) {
            return;
        }
        this.showHingeIfApplicable(overlayModel);
    }
    scaleSettingChanged() {
        this.calculateAndEmulate(false);
    }
    widthSettingChanged() {
        this.calculateAndEmulate(false);
    }
    heightSettingChanged() {
        this.calculateAndEmulate(false);
    }
    uaSettingChanged() {
        this.calculateAndEmulate(true);
    }
    deviceScaleFactorSettingChanged() {
        this.calculateAndEmulate(false);
    }
    deviceOutlineSettingChanged() {
        this.calculateAndEmulate(false);
    }
    preferredScaledWidth() {
        return Math.floor(__classPrivateFieldGet(this, _DeviceModeModel_preferredSize, "f").width / (__classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").get() || 1));
    }
    preferredScaledHeight() {
        return Math.floor(__classPrivateFieldGet(this, _DeviceModeModel_preferredSize, "f").height / (__classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").get() || 1));
    }
    currentOutline() {
        let outline = new Insets(0, 0, 0, 0);
        if (__classPrivateFieldGet(this, _DeviceModeModel_typeInternal, "f") !== Type.Device || !__classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f") || !__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f")) {
            return outline;
        }
        const orientation = __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").orientationByName(__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f").orientation);
        if (__classPrivateFieldGet(this, _DeviceModeModel_deviceOutlineSettingInternal, "f").get()) {
            outline = orientation.outlineInsets || outline;
        }
        return outline;
    }
    currentInsets() {
        if (__classPrivateFieldGet(this, _DeviceModeModel_typeInternal, "f") !== Type.Device || !__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f")) {
            return new Insets(0, 0, 0, 0);
        }
        return __classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f").insets;
    }
    getScreenOrientationType() {
        if (!__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f")) {
            throw new Error('Mode required to get orientation type.');
        }
        switch (__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f").orientation) {
            case VerticalSpanned:
            case Vertical:
                return "portraitPrimary" /* Protocol.Emulation.ScreenOrientationType.PortraitPrimary */;
            case HorizontalSpanned:
            case Horizontal:
            default:
                return "landscapePrimary" /* Protocol.Emulation.ScreenOrientationType.LandscapePrimary */;
        }
    }
    calculateAndEmulate(resetPageScaleFactor) {
        if (!__classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f")) {
            __classPrivateFieldSet(this, _DeviceModeModel_onModelAvailable, this.calculateAndEmulate.bind(this, resetPageScaleFactor), "f");
        }
        const mobile = this.isMobile();
        const overlayModel = __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f") ? __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f").overlayModel() : null;
        if (overlayModel) {
            this.showHingeIfApplicable(overlayModel);
        }
        if (__classPrivateFieldGet(this, _DeviceModeModel_typeInternal, "f") === Type.Device && __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f") && __classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f")) {
            const orientation = __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").orientationByName(__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f").orientation);
            const outline = this.currentOutline();
            const insets = this.currentInsets();
            __classPrivateFieldSet(this, _DeviceModeModel_fitScaleInternal, this.calculateFitScale(orientation.width, orientation.height, outline, insets), "f");
            if (mobile) {
                __classPrivateFieldSet(this, _DeviceModeModel_appliedUserAgentTypeInternal, __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").touch() ? "Mobile" /* UA.MOBILE */ : "Mobile (no touch)" /* UA.MOBILE_NO_TOUCH */, "f");
            }
            else {
                __classPrivateFieldSet(this, _DeviceModeModel_appliedUserAgentTypeInternal, __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").touch() ? "Desktop (touch)" /* UA.DESKTOP_TOUCH */ : "Desktop" /* UA.DESKTOP */, "f");
            }
            this.applyDeviceMetrics(new UI.Geometry.Size(orientation.width, orientation.height), insets, outline, __classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").get(), __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").deviceScaleFactor, mobile, this.getScreenOrientationType(), resetPageScaleFactor, __classPrivateFieldGet(this, _DeviceModeModel_webPlatformExperimentalFeaturesEnabledInternal, "f"));
            this.applyUserAgent(__classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").userAgent, __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").userAgentMetadata);
            this.applyTouch(__classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").touch(), mobile);
        }
        else if (__classPrivateFieldGet(this, _DeviceModeModel_typeInternal, "f") === Type.None) {
            __classPrivateFieldSet(this, _DeviceModeModel_fitScaleInternal, this.calculateFitScale(__classPrivateFieldGet(this, _DeviceModeModel_availableSize, "f").width, __classPrivateFieldGet(this, _DeviceModeModel_availableSize, "f").height), "f");
            __classPrivateFieldSet(this, _DeviceModeModel_appliedUserAgentTypeInternal, "Desktop" /* UA.DESKTOP */, "f");
            this.applyDeviceMetrics(__classPrivateFieldGet(this, _DeviceModeModel_availableSize, "f"), new Insets(0, 0, 0, 0), new Insets(0, 0, 0, 0), 1, 0, mobile, null, resetPageScaleFactor);
            this.applyUserAgent('', null);
            this.applyTouch(false, false);
        }
        else if (__classPrivateFieldGet(this, _DeviceModeModel_typeInternal, "f") === Type.Responsive) {
            let screenWidth = __classPrivateFieldGet(this, _DeviceModeModel_widthSetting, "f").get();
            if (!screenWidth || screenWidth > this.preferredScaledWidth()) {
                screenWidth = this.preferredScaledWidth();
            }
            let screenHeight = __classPrivateFieldGet(this, _DeviceModeModel_heightSetting, "f").get();
            if (!screenHeight || screenHeight > this.preferredScaledHeight()) {
                screenHeight = this.preferredScaledHeight();
            }
            const defaultDeviceScaleFactor = mobile ? defaultMobileScaleFactor : 0;
            __classPrivateFieldSet(this, _DeviceModeModel_fitScaleInternal, this.calculateFitScale(__classPrivateFieldGet(this, _DeviceModeModel_widthSetting, "f").get(), __classPrivateFieldGet(this, _DeviceModeModel_heightSetting, "f").get()), "f");
            __classPrivateFieldSet(this, _DeviceModeModel_appliedUserAgentTypeInternal, __classPrivateFieldGet(this, _DeviceModeModel_uaSettingInternal, "f").get(), "f");
            this.applyDeviceMetrics(new UI.Geometry.Size(screenWidth, screenHeight), new Insets(0, 0, 0, 0), new Insets(0, 0, 0, 0), __classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").get(), __classPrivateFieldGet(this, _DeviceModeModel_deviceScaleFactorSettingInternal, "f").get() || defaultDeviceScaleFactor, mobile, screenHeight >= screenWidth ? "portraitPrimary" /* Protocol.Emulation.ScreenOrientationType.PortraitPrimary */ :
                "landscapePrimary" /* Protocol.Emulation.ScreenOrientationType.LandscapePrimary */, resetPageScaleFactor);
            this.applyUserAgent(mobile ? defaultMobileUserAgent : '', mobile ? defaultMobileUserAgentMetadata : null);
            this.applyTouch(__classPrivateFieldGet(this, _DeviceModeModel_uaSettingInternal, "f").get() === "Desktop (touch)" /* UA.DESKTOP_TOUCH */ || __classPrivateFieldGet(this, _DeviceModeModel_uaSettingInternal, "f").get() === "Mobile" /* UA.MOBILE */, __classPrivateFieldGet(this, _DeviceModeModel_uaSettingInternal, "f").get() === "Mobile" /* UA.MOBILE */);
        }
        if (overlayModel) {
            overlayModel.setShowViewportSizeOnResize(__classPrivateFieldGet(this, _DeviceModeModel_typeInternal, "f") === Type.None);
        }
        this.dispatchEventToListeners("Updated" /* Events.UPDATED */);
    }
    calculateFitScale(screenWidth, screenHeight, outline, insets) {
        const outlineWidth = outline ? outline.left + outline.right : 0;
        const outlineHeight = outline ? outline.top + outline.bottom : 0;
        const insetsWidth = insets ? insets.left + insets.right : 0;
        const insetsHeight = insets ? insets.top + insets.bottom : 0;
        let scale = Math.min(screenWidth ? __classPrivateFieldGet(this, _DeviceModeModel_preferredSize, "f").width / (screenWidth + outlineWidth) : 1, screenHeight ? __classPrivateFieldGet(this, _DeviceModeModel_preferredSize, "f").height / (screenHeight + outlineHeight) : 1);
        scale = Math.min(Math.floor(scale * 100), 100);
        let sharpScale = scale;
        while (sharpScale > scale * 0.7) {
            let sharp = true;
            if (screenWidth) {
                sharp = sharp && Number.isInteger((screenWidth - insetsWidth) * sharpScale / 100);
            }
            if (screenHeight) {
                sharp = sharp && Number.isInteger((screenHeight - insetsHeight) * sharpScale / 100);
            }
            if (sharp) {
                return sharpScale / 100;
            }
            sharpScale -= 1;
        }
        return scale / 100;
    }
    setSizeAndScaleToFit(width, height) {
        __classPrivateFieldGet(this, _DeviceModeModel_scaleSettingInternal, "f").set(this.calculateFitScale(width, height));
        this.setWidth(width);
        this.setHeight(height);
    }
    applyUserAgent(userAgent, userAgentMetadata) {
        SDK.NetworkManager.MultitargetNetworkManager.instance().setUserAgentOverride(userAgent, userAgentMetadata);
    }
    applyDeviceMetrics(screenSize, insets, outline, scale, deviceScaleFactor, mobile, screenOrientation, resetPageScaleFactor, forceMetricsOverride = false) {
        screenSize.width = Math.max(1, Math.floor(screenSize.width));
        screenSize.height = Math.max(1, Math.floor(screenSize.height));
        let pageWidth = screenSize.width - insets.left - insets.right;
        let pageHeight = screenSize.height - insets.top - insets.bottom;
        const positionX = insets.left;
        const positionY = insets.top;
        const screenOrientationAngle = screenOrientation === "landscapePrimary" /* Protocol.Emulation.ScreenOrientationType.LandscapePrimary */ ? 90 : 0;
        __classPrivateFieldSet(this, _DeviceModeModel_appliedDeviceSizeInternal, screenSize, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_appliedDeviceScaleFactorInternal, deviceScaleFactor || window.devicePixelRatio, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_screenRectInternal, new Rect(Math.max(0, (__classPrivateFieldGet(this, _DeviceModeModel_availableSize, "f").width - screenSize.width * scale) / 2), outline.top * scale, screenSize.width * scale, screenSize.height * scale), "f");
        __classPrivateFieldSet(this, _DeviceModeModel_outlineRectInternal, new Rect(__classPrivateFieldGet(this, _DeviceModeModel_screenRectInternal, "f").left - outline.left * scale, 0, (outline.left + screenSize.width + outline.right) * scale, (outline.top + screenSize.height + outline.bottom) * scale), "f");
        __classPrivateFieldSet(this, _DeviceModeModel_visiblePageRectInternal, new Rect(positionX * scale, positionY * scale, Math.min(pageWidth * scale, __classPrivateFieldGet(this, _DeviceModeModel_availableSize, "f").width - __classPrivateFieldGet(this, _DeviceModeModel_screenRectInternal, "f").left - positionX * scale), Math.min(pageHeight * scale, __classPrivateFieldGet(this, _DeviceModeModel_availableSize, "f").height - __classPrivateFieldGet(this, _DeviceModeModel_screenRectInternal, "f").top - positionY * scale)), "f");
        __classPrivateFieldSet(this, _DeviceModeModel_scaleInternal, scale, "f");
        if (!forceMetricsOverride) {
            // When sending displayFeature, we cannot use the optimization below due to backend restrictions.
            if (scale === 1 && __classPrivateFieldGet(this, _DeviceModeModel_availableSize, "f").width >= screenSize.width &&
                __classPrivateFieldGet(this, _DeviceModeModel_availableSize, "f").height >= screenSize.height) {
                // When we have enough space, no page size override is required. This will speed things up and remove lag.
                pageWidth = 0;
                pageHeight = 0;
            }
            if (__classPrivateFieldGet(this, _DeviceModeModel_visiblePageRectInternal, "f").width === pageWidth * scale &&
                __classPrivateFieldGet(this, _DeviceModeModel_visiblePageRectInternal, "f").height === pageHeight * scale && Number.isInteger(pageWidth * scale) &&
                Number.isInteger(pageHeight * scale)) {
                // When we only have to apply scale, do not resize the page. This will speed things up and remove lag.
                pageWidth = 0;
                pageHeight = 0;
            }
        }
        if (!__classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f")) {
            return;
        }
        if (resetPageScaleFactor) {
            void __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f").resetPageScaleFactor();
        }
        if (pageWidth || pageHeight || mobile || deviceScaleFactor || scale !== 1 || screenOrientation ||
            forceMetricsOverride) {
            const metrics = {
                width: pageWidth,
                height: pageHeight,
                deviceScaleFactor,
                mobile,
                scale,
                screenWidth: screenSize.width,
                screenHeight: screenSize.height,
                positionX,
                positionY,
                dontSetVisibleSize: true,
                displayFeature: undefined,
                devicePosture: undefined,
                screenOrientation: undefined,
            };
            const displayFeature = this.getDisplayFeature();
            if (displayFeature) {
                metrics.displayFeature = displayFeature;
                metrics.devicePosture = { type: "folded" /* Protocol.Emulation.DevicePostureType.Folded */ };
            }
            else {
                metrics.devicePosture = { type: "continuous" /* Protocol.Emulation.DevicePostureType.Continuous */ };
            }
            if (screenOrientation) {
                metrics.screenOrientation = { type: screenOrientation, angle: screenOrientationAngle };
            }
            void __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f").emulateDevice(metrics);
        }
        else {
            void __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f").emulateDevice(null);
        }
    }
    exitHingeMode() {
        const overlayModel = __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f") ? __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f").overlayModel() : null;
        if (overlayModel) {
            overlayModel.showHingeForDualScreen(null);
        }
    }
    webPlatformExperimentalFeaturesEnabled() {
        return __classPrivateFieldGet(this, _DeviceModeModel_webPlatformExperimentalFeaturesEnabledInternal, "f");
    }
    shouldReportDisplayFeature() {
        return __classPrivateFieldGet(this, _DeviceModeModel_webPlatformExperimentalFeaturesEnabledInternal, "f");
    }
    async captureScreenshot(fullSize, clip) {
        const screenCaptureModel = __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f") ? __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f").target().model(SDK.ScreenCaptureModel.ScreenCaptureModel) : null;
        if (!screenCaptureModel) {
            return null;
        }
        let screenshotMode;
        if (clip) {
            screenshotMode = "fromClip" /* SDK.ScreenCaptureModel.ScreenshotMode.FROM_CLIP */;
        }
        else if (fullSize) {
            screenshotMode = "fullpage" /* SDK.ScreenCaptureModel.ScreenshotMode.FULLPAGE */;
        }
        else {
            screenshotMode = "fromViewport" /* SDK.ScreenCaptureModel.ScreenshotMode.FROM_VIEWPORT */;
        }
        const overlayModel = __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f") ? __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f").overlayModel() : null;
        if (overlayModel) {
            overlayModel.setShowViewportSizeOnResize(false);
        }
        const screenshot = await screenCaptureModel.captureScreenshot("png" /* Protocol.Page.CaptureScreenshotRequestFormat.Png */, 100, screenshotMode, clip);
        const deviceMetrics = {
            width: 0,
            height: 0,
            deviceScaleFactor: 0,
            mobile: false,
        };
        if (fullSize && __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f")) {
            if (__classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f") && __classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f")) {
                const orientation = __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").orientationByName(__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f").orientation);
                deviceMetrics.width = orientation.width;
                deviceMetrics.height = orientation.height;
                const dispFeature = this.getDisplayFeature();
                if (dispFeature) {
                    // @ts-expect-error: displayFeature isn't in protocol.ts but is an
                    // experimental flag:
                    // https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setDeviceMetricsOverride
                    deviceMetrics.displayFeature = dispFeature;
                }
            }
            else {
                deviceMetrics.width = 0;
                deviceMetrics.height = 0;
            }
            await __classPrivateFieldGet(this, _DeviceModeModel_emulationModel, "f").emulateDevice(deviceMetrics);
        }
        this.calculateAndEmulate(false);
        return screenshot;
    }
    applyTouch(touchEnabled, mobile) {
        __classPrivateFieldSet(this, _DeviceModeModel_touchEnabled, touchEnabled, "f");
        __classPrivateFieldSet(this, _DeviceModeModel_touchMobile, mobile, "f");
        for (const emulationModel of SDK.TargetManager.TargetManager.instance().models(SDK.EmulationModel.EmulationModel)) {
            void emulationModel.emulateTouch(touchEnabled, mobile);
        }
    }
    showHingeIfApplicable(overlayModel) {
        const orientation = (__classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f") && __classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f")) ?
            __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").orientationByName(__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f").orientation) :
            null;
        if (orientation?.hinge) {
            overlayModel.showHingeForDualScreen(orientation.hinge);
            return;
        }
        overlayModel.showHingeForDualScreen(null);
    }
    getDisplayFeatureOrientation() {
        if (!__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f")) {
            throw new Error('Mode required to get display feature orientation.');
        }
        switch (__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f").orientation) {
            case VerticalSpanned:
            case Vertical:
                return "vertical" /* Protocol.Emulation.DisplayFeatureOrientation.Vertical */;
            case HorizontalSpanned:
            case Horizontal:
            default:
                return "horizontal" /* Protocol.Emulation.DisplayFeatureOrientation.Horizontal */;
        }
    }
    getDisplayFeature() {
        if (!this.shouldReportDisplayFeature()) {
            return null;
        }
        if (!__classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f") || !__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f") ||
            (__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f").orientation !== VerticalSpanned && __classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f").orientation !== HorizontalSpanned)) {
            return null;
        }
        const orientation = __classPrivateFieldGet(this, _DeviceModeModel_deviceInternal, "f").orientationByName(__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f").orientation);
        if (!orientation?.hinge) {
            return null;
        }
        const hinge = orientation.hinge;
        return {
            orientation: this.getDisplayFeatureOrientation(),
            offset: (__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f").orientation === VerticalSpanned) ? hinge.x : hinge.y,
            maskLength: (__classPrivateFieldGet(this, _DeviceModeModel_modeInternal, "f").orientation === VerticalSpanned) ? hinge.width : hinge.height,
        };
    }
}
_DeviceModeModel_screenRectInternal = new WeakMap(), _DeviceModeModel_visiblePageRectInternal = new WeakMap(), _DeviceModeModel_availableSize = new WeakMap(), _DeviceModeModel_preferredSize = new WeakMap(), _DeviceModeModel_initialized = new WeakMap(), _DeviceModeModel_appliedDeviceSizeInternal = new WeakMap(), _DeviceModeModel_appliedDeviceScaleFactorInternal = new WeakMap(), _DeviceModeModel_appliedUserAgentTypeInternal = new WeakMap(), _DeviceModeModel_webPlatformExperimentalFeaturesEnabledInternal = new WeakMap(), _DeviceModeModel_scaleSettingInternal = new WeakMap(), _DeviceModeModel_scaleInternal = new WeakMap(), _DeviceModeModel_widthSetting = new WeakMap(), _DeviceModeModel_heightSetting = new WeakMap(), _DeviceModeModel_uaSettingInternal = new WeakMap(), _DeviceModeModel_deviceScaleFactorSettingInternal = new WeakMap(), _DeviceModeModel_deviceOutlineSettingInternal = new WeakMap(), _DeviceModeModel_toolbarControlsEnabledSettingInternal = new WeakMap(), _DeviceModeModel_typeInternal = new WeakMap(), _DeviceModeModel_deviceInternal = new WeakMap(), _DeviceModeModel_modeInternal = new WeakMap(), _DeviceModeModel_fitScaleInternal = new WeakMap(), _DeviceModeModel_touchEnabled = new WeakMap(), _DeviceModeModel_touchMobile = new WeakMap(), _DeviceModeModel_emulationModel = new WeakMap(), _DeviceModeModel_onModelAvailable = new WeakMap(), _DeviceModeModel_outlineRectInternal = new WeakMap();
export class Insets {
    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    isEqual(insets) {
        return insets !== null && this.left === insets.left && this.top === insets.top && this.right === insets.right &&
            this.bottom === insets.bottom;
    }
}
export class Rect {
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
    isEqual(rect) {
        return rect !== null && this.left === rect.left && this.top === rect.top && this.width === rect.width &&
            this.height === rect.height;
    }
    scale(scale) {
        return new Rect(this.left * scale, this.top * scale, this.width * scale, this.height * scale);
    }
    relativeTo(origin) {
        return new Rect(this.left - origin.left, this.top - origin.top, this.width, this.height);
    }
    rebaseTo(origin) {
        return new Rect(this.left + origin.left, this.top + origin.top, this.width, this.height);
    }
}
export var Events;
(function (Events) {
    Events["UPDATED"] = "Updated";
})(Events || (Events = {}));
export var Type;
(function (Type) {
    /* eslint-disable @typescript-eslint/naming-convention -- Used by web_tests. */
    Type["None"] = "None";
    Type["Responsive"] = "Responsive";
    Type["Device"] = "Device";
    /* eslint-enable @typescript-eslint/naming-convention */
})(Type || (Type = {}));
export var UA;
(function (UA) {
    // TODO(crbug.com/1136655): This enum is used for both display and code functionality.
    // we should refactor this so localization of these strings only happens for user display.
    UA["MOBILE"] = "Mobile";
    UA["MOBILE_NO_TOUCH"] = "Mobile (no touch)";
    UA["DESKTOP"] = "Desktop";
    UA["DESKTOP_TOUCH"] = "Desktop (touch)";
})(UA || (UA = {}));
export const MinDeviceSize = 50;
export const MaxDeviceSize = 9999;
export const MinDeviceScaleFactor = 0;
export const MaxDeviceScaleFactor = 10;
export const MaxDeviceNameLength = 50;
const mobileUserAgent = 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36';
const defaultMobileUserAgent = SDK.NetworkManager.MultitargetNetworkManager.patchUserAgentWithChromeVersion(mobileUserAgent);
const defaultMobileUserAgentMetadata = {
    platform: 'Android',
    platformVersion: '6.0',
    architecture: '',
    model: 'Nexus 5',
    mobile: true,
};
export const defaultMobileScaleFactor = 2;
//# sourceMappingURL=DeviceModeModel.js.map