// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
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
var _AutomaticFileSystemManager_instances, _AutomaticFileSystemManager_automaticFileSystem, _AutomaticFileSystemManager_availability, _AutomaticFileSystemManager_inspectorFrontendHost, _AutomaticFileSystemManager_projectSettingsModel, _AutomaticFileSystemManager_dispose, _AutomaticFileSystemManager_availabilityChanged, _AutomaticFileSystemManager_fileSystemRemoved, _AutomaticFileSystemManager_projectSettingsChanged;
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as ProjectSettings from '../project_settings/project_settings.js';
let automaticFileSystemManagerInstance;
/**
 * Automatically connects and disconnects workspace folders.
 *
 * @see http://go/chrome-devtools:automatic-workspace-folders-design
 */
export class AutomaticFileSystemManager extends Common.ObjectWrapper.ObjectWrapper {
    /**
     * Yields the current `AutomaticFileSystem` (if any).
     *
     * @return the current automatic file system or `null`.
     */
    get automaticFileSystem() {
        return __classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f");
    }
    /**
     * Yields the availability of the Automatic Workspace Folders feature.
     *
     * `'available'` means that the feature is enabled and the project settings
     * are also available. It doesn't indicate whether or not the page is actually
     * providing a `com.chrome.devtools.json` or not, and whether or not that file
     * (if it exists) provides workspace information.
     *
     * @return `'available'` if the feature is available and the project settings
     *         feature is also available, otherwise `'unavailable'`.
     */
    get availability() {
        return __classPrivateFieldGet(this, _AutomaticFileSystemManager_availability, "f");
    }
    /**
     * @internal
     */
    constructor(inspectorFrontendHost, projectSettingsModel) {
        super();
        _AutomaticFileSystemManager_instances.add(this);
        _AutomaticFileSystemManager_automaticFileSystem.set(this, void 0);
        _AutomaticFileSystemManager_availability.set(this, 'unavailable');
        _AutomaticFileSystemManager_inspectorFrontendHost.set(this, void 0);
        _AutomaticFileSystemManager_projectSettingsModel.set(this, void 0);
        __classPrivateFieldSet(this, _AutomaticFileSystemManager_automaticFileSystem, null, "f");
        __classPrivateFieldSet(this, _AutomaticFileSystemManager_inspectorFrontendHost, inspectorFrontendHost, "f");
        __classPrivateFieldSet(this, _AutomaticFileSystemManager_projectSettingsModel, projectSettingsModel, "f");
        __classPrivateFieldGet(this, _AutomaticFileSystemManager_inspectorFrontendHost, "f").events.addEventListener(Host.InspectorFrontendHostAPI.Events.FileSystemRemoved, __classPrivateFieldGet(this, _AutomaticFileSystemManager_instances, "m", _AutomaticFileSystemManager_fileSystemRemoved), this);
        __classPrivateFieldGet(this, _AutomaticFileSystemManager_projectSettingsModel, "f").addEventListener("AvailabilityChanged" /* ProjectSettings.ProjectSettingsModel.Events.AVAILABILITY_CHANGED */, __classPrivateFieldGet(this, _AutomaticFileSystemManager_instances, "m", _AutomaticFileSystemManager_availabilityChanged), this);
        __classPrivateFieldGet(this, _AutomaticFileSystemManager_instances, "m", _AutomaticFileSystemManager_availabilityChanged).call(this, { data: __classPrivateFieldGet(this, _AutomaticFileSystemManager_projectSettingsModel, "f").availability });
        __classPrivateFieldGet(this, _AutomaticFileSystemManager_projectSettingsModel, "f").addEventListener("ProjectSettingsChanged" /* ProjectSettings.ProjectSettingsModel.Events.PROJECT_SETTINGS_CHANGED */, __classPrivateFieldGet(this, _AutomaticFileSystemManager_instances, "m", _AutomaticFileSystemManager_projectSettingsChanged), this);
        __classPrivateFieldGet(this, _AutomaticFileSystemManager_instances, "m", _AutomaticFileSystemManager_projectSettingsChanged).call(this, { data: __classPrivateFieldGet(this, _AutomaticFileSystemManager_projectSettingsModel, "f").projectSettings });
    }
    /**
     * Yields the `AutomaticFileSystemManager` singleton.
     *
     * @returns the singleton.
     */
    static instance({ forceNew, inspectorFrontendHost, projectSettingsModel } = { forceNew: false, inspectorFrontendHost: null, projectSettingsModel: null }) {
        if (!automaticFileSystemManagerInstance || forceNew) {
            if (!inspectorFrontendHost || !projectSettingsModel) {
                throw new Error('Unable to create AutomaticFileSystemManager: ' +
                    'inspectorFrontendHost, and projectSettingsModel must be provided');
            }
            automaticFileSystemManagerInstance = new AutomaticFileSystemManager(inspectorFrontendHost, projectSettingsModel);
        }
        return automaticFileSystemManagerInstance;
    }
    /**
     * Clears the `AutomaticFileSystemManager` singleton (if any);
     */
    static removeInstance() {
        if (automaticFileSystemManagerInstance) {
            __classPrivateFieldGet(automaticFileSystemManagerInstance, _AutomaticFileSystemManager_instances, "m", _AutomaticFileSystemManager_dispose).call(automaticFileSystemManagerInstance);
            automaticFileSystemManagerInstance = undefined;
        }
    }
    /**
     * Attempt to connect the automatic workspace folder (if any).
     *
     * @param addIfMissing if `false` (the default), this will only try to connect
     *                     to a previously connected automatic workspace folder.
     *                     If the folder was never connected before and `true` is
     *                     specified, the user will be asked to grant permission
     *                     to allow Chrome DevTools to access the folder first.
     * @returns `true` if the automatic workspace folder was connected, `false`
     *          if there wasn't any, or the connection attempt failed (e.g. the
     *          user did not grant permission).
     */
    async connectAutomaticFileSystem(addIfMissing = false) {
        if (!__classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f")) {
            return false;
        }
        const { root, uuid, state } = __classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f");
        if (state === 'disconnected') {
            const automaticFileSystem = __classPrivateFieldSet(this, _AutomaticFileSystemManager_automaticFileSystem, Object.freeze({ ...__classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f"), state: 'connecting' }), "f");
            this.dispatchEventToListeners("AutomaticFileSystemChanged" /* Events.AUTOMATIC_FILE_SYSTEM_CHANGED */, __classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f"));
            const { success } = await new Promise(resolve => __classPrivateFieldGet(this, _AutomaticFileSystemManager_inspectorFrontendHost, "f").connectAutomaticFileSystem(root, uuid, addIfMissing, resolve));
            if (__classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f") === automaticFileSystem) {
                const state = success ? 'connected' : 'disconnected';
                __classPrivateFieldSet(this, _AutomaticFileSystemManager_automaticFileSystem, Object.freeze({ ...automaticFileSystem, state }), "f");
                this.dispatchEventToListeners("AutomaticFileSystemChanged" /* Events.AUTOMATIC_FILE_SYSTEM_CHANGED */, __classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f"));
            }
        }
        return __classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f")?.state === 'connected';
    }
    /**
     * Disconnects any automatic workspace folder.
     */
    disconnectedAutomaticFileSystem() {
        if (__classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f") && __classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f").state !== 'disconnected') {
            __classPrivateFieldGet(this, _AutomaticFileSystemManager_inspectorFrontendHost, "f").disconnectAutomaticFileSystem(__classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f").root);
            __classPrivateFieldSet(this, _AutomaticFileSystemManager_automaticFileSystem, Object.freeze({ ...__classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f"), state: 'disconnected' }), "f");
            this.dispatchEventToListeners("AutomaticFileSystemChanged" /* Events.AUTOMATIC_FILE_SYSTEM_CHANGED */, __classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f"));
        }
    }
}
_AutomaticFileSystemManager_automaticFileSystem = new WeakMap(), _AutomaticFileSystemManager_availability = new WeakMap(), _AutomaticFileSystemManager_inspectorFrontendHost = new WeakMap(), _AutomaticFileSystemManager_projectSettingsModel = new WeakMap(), _AutomaticFileSystemManager_instances = new WeakSet(), _AutomaticFileSystemManager_dispose = function _AutomaticFileSystemManager_dispose() {
    __classPrivateFieldGet(this, _AutomaticFileSystemManager_inspectorFrontendHost, "f").events.removeEventListener(Host.InspectorFrontendHostAPI.Events.FileSystemRemoved, __classPrivateFieldGet(this, _AutomaticFileSystemManager_instances, "m", _AutomaticFileSystemManager_fileSystemRemoved), this);
    __classPrivateFieldGet(this, _AutomaticFileSystemManager_projectSettingsModel, "f").removeEventListener("AvailabilityChanged" /* ProjectSettings.ProjectSettingsModel.Events.AVAILABILITY_CHANGED */, __classPrivateFieldGet(this, _AutomaticFileSystemManager_instances, "m", _AutomaticFileSystemManager_availabilityChanged), this);
    __classPrivateFieldGet(this, _AutomaticFileSystemManager_projectSettingsModel, "f").removeEventListener("ProjectSettingsChanged" /* ProjectSettings.ProjectSettingsModel.Events.PROJECT_SETTINGS_CHANGED */, __classPrivateFieldGet(this, _AutomaticFileSystemManager_instances, "m", _AutomaticFileSystemManager_projectSettingsChanged), this);
}, _AutomaticFileSystemManager_availabilityChanged = function _AutomaticFileSystemManager_availabilityChanged(event) {
    const availability = event.data;
    if (__classPrivateFieldGet(this, _AutomaticFileSystemManager_availability, "f") !== availability) {
        __classPrivateFieldSet(this, _AutomaticFileSystemManager_availability, availability, "f");
        this.dispatchEventToListeners("AvailabilityChanged" /* Events.AVAILABILITY_CHANGED */, __classPrivateFieldGet(this, _AutomaticFileSystemManager_availability, "f"));
    }
}, _AutomaticFileSystemManager_fileSystemRemoved = function _AutomaticFileSystemManager_fileSystemRemoved(event) {
    if (__classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f") === null) {
        return;
    }
    if (__classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f").root === event.data) {
        __classPrivateFieldSet(this, _AutomaticFileSystemManager_automaticFileSystem, Object.freeze({
            ...__classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f"),
            state: 'disconnected',
        }), "f");
        this.dispatchEventToListeners("AutomaticFileSystemChanged" /* Events.AUTOMATIC_FILE_SYSTEM_CHANGED */, __classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f"));
    }
}, _AutomaticFileSystemManager_projectSettingsChanged = function _AutomaticFileSystemManager_projectSettingsChanged(event) {
    const projectSettings = event.data;
    let automaticFileSystem = __classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f");
    if (projectSettings.workspace) {
        const { root, uuid } = projectSettings.workspace;
        if (automaticFileSystem === null || automaticFileSystem.root !== root || automaticFileSystem.uuid !== uuid) {
            automaticFileSystem = Object.freeze({ root, uuid, state: 'disconnected' });
        }
    }
    else if (automaticFileSystem !== null) {
        automaticFileSystem = null;
    }
    if (__classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f") !== automaticFileSystem) {
        this.disconnectedAutomaticFileSystem();
        __classPrivateFieldSet(this, _AutomaticFileSystemManager_automaticFileSystem, automaticFileSystem, "f");
        this.dispatchEventToListeners("AutomaticFileSystemChanged" /* Events.AUTOMATIC_FILE_SYSTEM_CHANGED */, __classPrivateFieldGet(this, _AutomaticFileSystemManager_automaticFileSystem, "f"));
        void this.connectAutomaticFileSystem(/* addIfMissing= */ false);
    }
};
/**
 * Events emitted by the `AutomaticFileSystemManager`.
 */
export var Events;
(function (Events) {
    /**
     * Emitted whenever the `automaticFileSystem` property of the
     * `AutomaticFileSystemManager` changes.
     */
    Events["AUTOMATIC_FILE_SYSTEM_CHANGED"] = "AutomaticFileSystemChanged";
    /**
     * Emitted whenever the `availability` property of the
     * `AutomaticFileSystemManager` changes.
     */
    Events["AVAILABILITY_CHANGED"] = "AvailabilityChanged";
})(Events || (Events = {}));
//# sourceMappingURL=AutomaticFileSystemManager.js.map