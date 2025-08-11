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
var _EmulatedState_state, _EmulatedState_clientProvider, _EmulatedState_updater, _EmulationManager_instances, _EmulationManager_client, _EmulationManager_emulatingMobile, _EmulationManager_hasTouch, _EmulationManager_states, _EmulationManager_viewportState, _EmulationManager_idleOverridesState, _EmulationManager_timezoneState, _EmulationManager_visionDeficiencyState, _EmulationManager_cpuThrottlingState, _EmulationManager_mediaFeaturesState, _EmulationManager_mediaTypeState, _EmulationManager_geoLocationState, _EmulationManager_defaultBackgroundColorState, _EmulationManager_javascriptEnabledState, _EmulationManager_secondaryClients, _EmulationManager_applyViewport, _EmulationManager_emulateIdleState, _EmulationManager_emulateTimezone, _EmulationManager_emulateVisionDeficiency, _EmulationManager_emulateCpuThrottling, _EmulationManager_emulateMediaFeatures, _EmulationManager_emulateMediaType, _EmulationManager_setGeolocation, _EmulationManager_setDefaultBackgroundColor, _EmulationManager_setJavaScriptEnabled;
import { CDPSessionEvent } from '../api/CDPSession.js';
import { debugError } from '../common/util.js';
import { assert } from '../util/assert.js';
import { isErrorLike } from '../util/ErrorLike.js';
/**
 * @internal
 */
export class EmulatedState {
    constructor(initialState, clientProvider, updater) {
        _EmulatedState_state.set(this, void 0);
        _EmulatedState_clientProvider.set(this, void 0);
        _EmulatedState_updater.set(this, void 0);
        __classPrivateFieldSet(this, _EmulatedState_state, initialState, "f");
        __classPrivateFieldSet(this, _EmulatedState_clientProvider, clientProvider, "f");
        __classPrivateFieldSet(this, _EmulatedState_updater, updater, "f");
        __classPrivateFieldGet(this, _EmulatedState_clientProvider, "f").registerState(this);
    }
    async setState(state) {
        __classPrivateFieldSet(this, _EmulatedState_state, state, "f");
        await this.sync();
    }
    get state() {
        return __classPrivateFieldGet(this, _EmulatedState_state, "f");
    }
    async sync() {
        await Promise.all(__classPrivateFieldGet(this, _EmulatedState_clientProvider, "f").clients().map(client => {
            return __classPrivateFieldGet(this, _EmulatedState_updater, "f").call(this, client, __classPrivateFieldGet(this, _EmulatedState_state, "f"));
        }));
    }
}
_EmulatedState_state = new WeakMap(), _EmulatedState_clientProvider = new WeakMap(), _EmulatedState_updater = new WeakMap();
/**
 * @internal
 */
export class EmulationManager {
    constructor(client) {
        _EmulationManager_instances.add(this);
        _EmulationManager_client.set(this, void 0);
        _EmulationManager_emulatingMobile.set(this, false);
        _EmulationManager_hasTouch.set(this, false);
        _EmulationManager_states.set(this, []);
        _EmulationManager_viewportState.set(this, new EmulatedState({
            active: false,
        }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "m", _EmulationManager_applyViewport)));
        _EmulationManager_idleOverridesState.set(this, new EmulatedState({
            active: false,
        }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "m", _EmulationManager_emulateIdleState)));
        _EmulationManager_timezoneState.set(this, new EmulatedState({
            active: false,
        }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "m", _EmulationManager_emulateTimezone)));
        _EmulationManager_visionDeficiencyState.set(this, new EmulatedState({
            active: false,
        }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "m", _EmulationManager_emulateVisionDeficiency)));
        _EmulationManager_cpuThrottlingState.set(this, new EmulatedState({
            active: false,
        }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "m", _EmulationManager_emulateCpuThrottling)));
        _EmulationManager_mediaFeaturesState.set(this, new EmulatedState({
            active: false,
        }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "m", _EmulationManager_emulateMediaFeatures)));
        _EmulationManager_mediaTypeState.set(this, new EmulatedState({
            active: false,
        }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "m", _EmulationManager_emulateMediaType)));
        _EmulationManager_geoLocationState.set(this, new EmulatedState({
            active: false,
        }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "m", _EmulationManager_setGeolocation)));
        _EmulationManager_defaultBackgroundColorState.set(this, new EmulatedState({
            active: false,
        }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "m", _EmulationManager_setDefaultBackgroundColor)));
        _EmulationManager_javascriptEnabledState.set(this, new EmulatedState({
            javaScriptEnabled: true,
            active: false,
        }, this, __classPrivateFieldGet(this, _EmulationManager_instances, "m", _EmulationManager_setJavaScriptEnabled)));
        _EmulationManager_secondaryClients.set(this, new Set());
        __classPrivateFieldSet(this, _EmulationManager_client, client, "f");
    }
    updateClient(client) {
        __classPrivateFieldSet(this, _EmulationManager_client, client, "f");
        __classPrivateFieldGet(this, _EmulationManager_secondaryClients, "f").delete(client);
    }
    registerState(state) {
        __classPrivateFieldGet(this, _EmulationManager_states, "f").push(state);
    }
    clients() {
        return [__classPrivateFieldGet(this, _EmulationManager_client, "f"), ...Array.from(__classPrivateFieldGet(this, _EmulationManager_secondaryClients, "f"))];
    }
    async registerSpeculativeSession(client) {
        __classPrivateFieldGet(this, _EmulationManager_secondaryClients, "f").add(client);
        client.once(CDPSessionEvent.Disconnected, () => {
            __classPrivateFieldGet(this, _EmulationManager_secondaryClients, "f").delete(client);
        });
        // We don't await here because we want to register all state changes before
        // the target is unpaused.
        void Promise.all(__classPrivateFieldGet(this, _EmulationManager_states, "f").map(s => {
            return s.sync().catch(debugError);
        }));
    }
    get javascriptEnabled() {
        return __classPrivateFieldGet(this, _EmulationManager_javascriptEnabledState, "f").state.javaScriptEnabled;
    }
    async emulateViewport(viewport) {
        const currentState = __classPrivateFieldGet(this, _EmulationManager_viewportState, "f").state;
        if (!viewport && !currentState.active) {
            return false;
        }
        await __classPrivateFieldGet(this, _EmulationManager_viewportState, "f").setState(viewport
            ? {
                viewport,
                active: true,
            }
            : {
                active: false,
            });
        const mobile = viewport?.isMobile || false;
        const hasTouch = viewport?.hasTouch || false;
        const reloadNeeded = __classPrivateFieldGet(this, _EmulationManager_emulatingMobile, "f") !== mobile || __classPrivateFieldGet(this, _EmulationManager_hasTouch, "f") !== hasTouch;
        __classPrivateFieldSet(this, _EmulationManager_emulatingMobile, mobile, "f");
        __classPrivateFieldSet(this, _EmulationManager_hasTouch, hasTouch, "f");
        return reloadNeeded;
    }
    async emulateIdleState(overrides) {
        await __classPrivateFieldGet(this, _EmulationManager_idleOverridesState, "f").setState({
            active: true,
            overrides,
        });
    }
    async emulateTimezone(timezoneId) {
        await __classPrivateFieldGet(this, _EmulationManager_timezoneState, "f").setState({
            timezoneId,
            active: true,
        });
    }
    async emulateVisionDeficiency(type) {
        const visionDeficiencies = new Set([
            'none',
            'achromatopsia',
            'blurredVision',
            'deuteranopia',
            'protanopia',
            'reducedContrast',
            'tritanopia',
        ]);
        assert(!type || visionDeficiencies.has(type), `Unsupported vision deficiency: ${type}`);
        await __classPrivateFieldGet(this, _EmulationManager_visionDeficiencyState, "f").setState({
            active: true,
            visionDeficiency: type,
        });
    }
    async emulateCPUThrottling(factor) {
        assert(factor === null || factor >= 1, 'Throttling rate should be greater or equal to 1');
        await __classPrivateFieldGet(this, _EmulationManager_cpuThrottlingState, "f").setState({
            active: true,
            factor: factor ?? undefined,
        });
    }
    async emulateMediaFeatures(features) {
        if (Array.isArray(features)) {
            for (const mediaFeature of features) {
                const name = mediaFeature.name;
                assert(/^(?:prefers-(?:color-scheme|reduced-motion)|color-gamut)$/.test(name), 'Unsupported media feature: ' + name);
            }
        }
        await __classPrivateFieldGet(this, _EmulationManager_mediaFeaturesState, "f").setState({
            active: true,
            mediaFeatures: features,
        });
    }
    async emulateMediaType(type) {
        assert(type === 'screen' ||
            type === 'print' ||
            (type ?? undefined) === undefined, 'Unsupported media type: ' + type);
        await __classPrivateFieldGet(this, _EmulationManager_mediaTypeState, "f").setState({
            type,
            active: true,
        });
    }
    async setGeolocation(options) {
        const { longitude, latitude, accuracy = 0 } = options;
        if (longitude < -180 || longitude > 180) {
            throw new Error(`Invalid longitude "${longitude}": precondition -180 <= LONGITUDE <= 180 failed.`);
        }
        if (latitude < -90 || latitude > 90) {
            throw new Error(`Invalid latitude "${latitude}": precondition -90 <= LATITUDE <= 90 failed.`);
        }
        if (accuracy < 0) {
            throw new Error(`Invalid accuracy "${accuracy}": precondition 0 <= ACCURACY failed.`);
        }
        await __classPrivateFieldGet(this, _EmulationManager_geoLocationState, "f").setState({
            active: true,
            geoLocation: {
                longitude,
                latitude,
                accuracy,
            },
        });
    }
    /**
     * Resets default white background
     */
    async resetDefaultBackgroundColor() {
        await __classPrivateFieldGet(this, _EmulationManager_defaultBackgroundColorState, "f").setState({
            active: true,
            color: undefined,
        });
    }
    /**
     * Hides default white background
     */
    async setTransparentBackgroundColor() {
        await __classPrivateFieldGet(this, _EmulationManager_defaultBackgroundColorState, "f").setState({
            active: true,
            color: { r: 0, g: 0, b: 0, a: 0 },
        });
    }
    async setJavaScriptEnabled(enabled) {
        await __classPrivateFieldGet(this, _EmulationManager_javascriptEnabledState, "f").setState({
            active: true,
            javaScriptEnabled: enabled,
        });
    }
}
_EmulationManager_client = new WeakMap(), _EmulationManager_emulatingMobile = new WeakMap(), _EmulationManager_hasTouch = new WeakMap(), _EmulationManager_states = new WeakMap(), _EmulationManager_viewportState = new WeakMap(), _EmulationManager_idleOverridesState = new WeakMap(), _EmulationManager_timezoneState = new WeakMap(), _EmulationManager_visionDeficiencyState = new WeakMap(), _EmulationManager_cpuThrottlingState = new WeakMap(), _EmulationManager_mediaFeaturesState = new WeakMap(), _EmulationManager_mediaTypeState = new WeakMap(), _EmulationManager_geoLocationState = new WeakMap(), _EmulationManager_defaultBackgroundColorState = new WeakMap(), _EmulationManager_javascriptEnabledState = new WeakMap(), _EmulationManager_secondaryClients = new WeakMap(), _EmulationManager_instances = new WeakSet(), _EmulationManager_applyViewport = async function _EmulationManager_applyViewport(client, viewportState) {
    if (!viewportState.viewport) {
        await Promise.all([
            client.send('Emulation.clearDeviceMetricsOverride'),
            client.send('Emulation.setTouchEmulationEnabled', {
                enabled: false,
            }),
        ]).catch(debugError);
        return;
    }
    const { viewport } = viewportState;
    const mobile = viewport.isMobile || false;
    const width = viewport.width;
    const height = viewport.height;
    const deviceScaleFactor = viewport.deviceScaleFactor ?? 1;
    const screenOrientation = viewport.isLandscape
        ? { angle: 90, type: 'landscapePrimary' }
        : { angle: 0, type: 'portraitPrimary' };
    const hasTouch = viewport.hasTouch || false;
    await Promise.all([
        client
            .send('Emulation.setDeviceMetricsOverride', {
            mobile,
            width,
            height,
            deviceScaleFactor,
            screenOrientation,
        })
            .catch(err => {
            if (err.message.includes('Target does not support metrics override')) {
                debugError(err);
                return;
            }
            throw err;
        }),
        client.send('Emulation.setTouchEmulationEnabled', {
            enabled: hasTouch,
        }),
    ]);
}, _EmulationManager_emulateIdleState = async function _EmulationManager_emulateIdleState(client, idleStateState) {
    if (!idleStateState.active) {
        return;
    }
    if (idleStateState.overrides) {
        await client.send('Emulation.setIdleOverride', {
            isUserActive: idleStateState.overrides.isUserActive,
            isScreenUnlocked: idleStateState.overrides.isScreenUnlocked,
        });
    }
    else {
        await client.send('Emulation.clearIdleOverride');
    }
}, _EmulationManager_emulateTimezone = async function _EmulationManager_emulateTimezone(client, timezoneState) {
    if (!timezoneState.active) {
        return;
    }
    try {
        await client.send('Emulation.setTimezoneOverride', {
            timezoneId: timezoneState.timezoneId || '',
        });
    }
    catch (error) {
        if (isErrorLike(error) && error.message.includes('Invalid timezone')) {
            throw new Error(`Invalid timezone ID: ${timezoneState.timezoneId}`);
        }
        throw error;
    }
}, _EmulationManager_emulateVisionDeficiency = async function _EmulationManager_emulateVisionDeficiency(client, visionDeficiency) {
    if (!visionDeficiency.active) {
        return;
    }
    await client.send('Emulation.setEmulatedVisionDeficiency', {
        type: visionDeficiency.visionDeficiency || 'none',
    });
}, _EmulationManager_emulateCpuThrottling = async function _EmulationManager_emulateCpuThrottling(client, state) {
    if (!state.active) {
        return;
    }
    await client.send('Emulation.setCPUThrottlingRate', {
        rate: state.factor ?? 1,
    });
}, _EmulationManager_emulateMediaFeatures = async function _EmulationManager_emulateMediaFeatures(client, state) {
    if (!state.active) {
        return;
    }
    await client.send('Emulation.setEmulatedMedia', {
        features: state.mediaFeatures,
    });
}, _EmulationManager_emulateMediaType = async function _EmulationManager_emulateMediaType(client, state) {
    if (!state.active) {
        return;
    }
    await client.send('Emulation.setEmulatedMedia', {
        media: state.type || '',
    });
}, _EmulationManager_setGeolocation = async function _EmulationManager_setGeolocation(client, state) {
    if (!state.active) {
        return;
    }
    await client.send('Emulation.setGeolocationOverride', state.geoLocation
        ? {
            longitude: state.geoLocation.longitude,
            latitude: state.geoLocation.latitude,
            accuracy: state.geoLocation.accuracy,
        }
        : undefined);
}, _EmulationManager_setDefaultBackgroundColor = async function _EmulationManager_setDefaultBackgroundColor(client, state) {
    if (!state.active) {
        return;
    }
    await client.send('Emulation.setDefaultBackgroundColorOverride', {
        color: state.color,
    });
}, _EmulationManager_setJavaScriptEnabled = async function _EmulationManager_setJavaScriptEnabled(client, state) {
    if (!state.active) {
        return;
    }
    await client.send('Emulation.setScriptExecutionDisabled', {
        value: !state.javaScriptEnabled,
    });
};
//# sourceMappingURL=EmulationManager.js.map