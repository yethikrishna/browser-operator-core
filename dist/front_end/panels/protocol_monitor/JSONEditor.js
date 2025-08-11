// Copyright 2023 The Chromium Authors. All rights reserved.
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
var _JSONEditor_instances, _JSONEditor_metadataByCommand, _JSONEditor_typesByName, _JSONEditor_enumsByName, _JSONEditor_parameters, _JSONEditor_targets, _JSONEditor_command, _JSONEditor_targetId, _JSONEditor_hintPopoverHelper, _JSONEditor_view, _JSONEditor_handleAvailableTargetsChanged, _JSONEditor_convertObjectToParameterSchema, _JSONEditor_convertPrimitiveParameter, _JSONEditor_convertObjectParameter, _JSONEditor_convertArrayParameter, _JSONEditor_handlePopoverDescriptions, _JSONEditor_getDescriptionAndTypeForElement, _JSONEditor_copyToClipboard, _JSONEditor_handleCommandSend, _JSONEditor_populateParameterDefaults, _JSONEditor_getChildByPath, _JSONEditor_isValueOfCorrectType, _JSONEditor_saveParameterValue, _JSONEditor_saveNestedObjectParameterKey, _JSONEditor_handleParameterInputKeydown, _JSONEditor_handleFocusParameter, _JSONEditor_handleCommandInputBlur, _JSONEditor_focusNextElement, _JSONEditor_createNestedParameter, _JSONEditor_handleAddParameter, _JSONEditor_handleClearParameter, _JSONEditor_handleDeleteParameter, _JSONEditor_onTargetSelected, _JSONEditor_computeDropdownValues;
import '../../ui/components/icon_button/icon_button.js';
import '../../ui/components/menus/menus.js';
import * as Common from '../../core/common/common.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as SuggestionInput from '../../ui/components/suggestion_input/suggestion_input.js';
import * as UI from '../../ui/legacy/legacy.js';
import * as Lit from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import * as ElementsComponents from '../elements/components/components.js';
import editorWidgetStyles from './JSONEditor.css.js';
const { html, render, Directives, nothing } = Lit;
const { live, classMap, repeat } = Directives;
const UIStrings = {
    /**
     *@description The title of a button that deletes a parameter.
     */
    deleteParameter: 'Delete parameter',
    /**
     *@description The title of a button that adds a parameter.
     */
    addParameter: 'Add a parameter',
    /**
     *@description The title of a button that reset the value of a paremeters to its default value.
     */
    resetDefaultValue: 'Reset to default value',
    /**
     *@description The title of a button to add custom key/value pairs to object parameters with no keys defined
     */
    addCustomProperty: 'Add custom property',
    /**
     * @description The title of a button that sends a CDP command.
     */
    sendCommandCtrlEnter: 'Send command - Ctrl+Enter',
    /**
     * @description The title of a button that sends a CDP command.
     */
    sendCommandCmdEnter: 'Send command - ⌘+Enter',
    /**
     * @description The title of a button that copies a CDP command.
     */
    copyCommand: 'Copy command',
    /**
     * @description A label for a select input that allows selecting a CDP target to send the commands to.
     */
    selectTarget: 'Select a target',
};
const str_ = i18n.i18n.registerUIStrings('panels/protocol_monitor/JSONEditor.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export var ParameterType;
(function (ParameterType) {
    ParameterType["STRING"] = "string";
    ParameterType["NUMBER"] = "number";
    ParameterType["BOOLEAN"] = "boolean";
    ParameterType["ARRAY"] = "array";
    ParameterType["OBJECT"] = "object";
})(ParameterType || (ParameterType = {}));
const splitDescription = (description) => {
    // If the description is too long we make the UI a bit better by highlighting the first sentence
    // which contains the most informations.
    // The number 150 has been chosen arbitrarily
    if (description.length > 150) {
        const [firstSentence, restOfDescription] = description.split('.');
        // To make the UI nicer, we add a dot at the end of the first sentence.
        firstSentence + '.';
        return [firstSentence, restOfDescription];
    }
    return [description, ''];
};
const defaultValueByType = new Map([
    ['string', ''],
    ['number', 0],
    ['boolean', false],
]);
const DUMMY_DATA = 'dummy';
const EMPTY_STRING = '<empty_string>';
export function suggestionFilter(option, query) {
    return option.toLowerCase().includes(query.toLowerCase());
}
export var Events;
(function (Events) {
    Events["SUBMIT_EDITOR"] = "submiteditor";
})(Events || (Events = {}));
export class JSONEditor extends Common.ObjectWrapper.eventMixin(UI.Widget.VBox) {
    constructor(element, view = DEFAULT_VIEW) {
        super(/* useShadowDom=*/ true, undefined, element);
        _JSONEditor_instances.add(this);
        _JSONEditor_metadataByCommand.set(this, new Map());
        _JSONEditor_typesByName.set(this, new Map());
        _JSONEditor_enumsByName.set(this, new Map());
        _JSONEditor_parameters.set(this, []);
        _JSONEditor_targets.set(this, []);
        _JSONEditor_command.set(this, '');
        _JSONEditor_targetId.set(this, void 0);
        _JSONEditor_hintPopoverHelper.set(this, void 0);
        _JSONEditor_view.set(this, void 0);
        _JSONEditor_saveParameterValue.set(this, (event) => {
            if (!(event.target instanceof SuggestionInput.SuggestionInput.SuggestionInput)) {
                return;
            }
            let value;
            if (event instanceof KeyboardEvent) {
                const editableContent = event.target.renderRoot.querySelector('devtools-editable-content');
                if (!editableContent) {
                    return;
                }
                value = editableContent.innerText;
            }
            else {
                value = event.target.value;
            }
            const paramId = event.target.getAttribute('data-paramid');
            if (!paramId) {
                return;
            }
            const pathArray = paramId.split('.');
            const object = __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_getChildByPath).call(this, pathArray).parameter;
            if (value === '') {
                object.value = defaultValueByType.get(object.type);
            }
            else {
                object.value = value;
                object.isCorrectType = __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_isValueOfCorrectType).call(this, object, value);
            }
            // Needed to render the delete button for object parameters
            this.requestUpdate();
        });
        _JSONEditor_saveNestedObjectParameterKey.set(this, (event) => {
            if (!(event.target instanceof SuggestionInput.SuggestionInput.SuggestionInput)) {
                return;
            }
            const value = event.target.value;
            const paramId = event.target.getAttribute('data-paramid');
            if (!paramId) {
                return;
            }
            const pathArray = paramId.split('.');
            const { parameter } = __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_getChildByPath).call(this, pathArray);
            parameter.name = value;
            // Needed to render the delete button for object parameters
            this.requestUpdate();
        });
        _JSONEditor_handleParameterInputKeydown.set(this, (event) => {
            if (!(event.target instanceof SuggestionInput.SuggestionInput.SuggestionInput)) {
                return;
            }
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                __classPrivateFieldGet(this, _JSONEditor_saveParameterValue, "f").call(this, event);
            }
        });
        _JSONEditor_handleCommandInputBlur.set(this, async (event) => {
            if (event.target instanceof SuggestionInput.SuggestionInput.SuggestionInput) {
                this.command = event.target.value;
            }
            this.populateParametersForCommandWithDefaultValues();
            const target = event.target;
            await this.updateComplete;
            __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_focusNextElement).call(this, target);
        });
        __classPrivateFieldSet(this, _JSONEditor_view, view, "f");
        this.registerRequiredCSS(editorWidgetStyles);
    }
    get metadataByCommand() {
        return __classPrivateFieldGet(this, _JSONEditor_metadataByCommand, "f");
    }
    set metadataByCommand(metadataByCommand) {
        __classPrivateFieldSet(this, _JSONEditor_metadataByCommand, metadataByCommand, "f");
        this.requestUpdate();
    }
    get typesByName() {
        return __classPrivateFieldGet(this, _JSONEditor_typesByName, "f");
    }
    set typesByName(typesByName) {
        __classPrivateFieldSet(this, _JSONEditor_typesByName, typesByName, "f");
        this.requestUpdate();
    }
    get enumsByName() {
        return __classPrivateFieldGet(this, _JSONEditor_enumsByName, "f");
    }
    set enumsByName(enumsByName) {
        __classPrivateFieldSet(this, _JSONEditor_enumsByName, enumsByName, "f");
        this.requestUpdate();
    }
    get parameters() {
        return __classPrivateFieldGet(this, _JSONEditor_parameters, "f");
    }
    set parameters(parameters) {
        __classPrivateFieldSet(this, _JSONEditor_parameters, parameters, "f");
        this.requestUpdate();
    }
    get targets() {
        return __classPrivateFieldGet(this, _JSONEditor_targets, "f");
    }
    set targets(targets) {
        __classPrivateFieldSet(this, _JSONEditor_targets, targets, "f");
        this.requestUpdate();
    }
    get command() {
        return __classPrivateFieldGet(this, _JSONEditor_command, "f");
    }
    set command(command) {
        if (__classPrivateFieldGet(this, _JSONEditor_command, "f") !== command) {
            __classPrivateFieldSet(this, _JSONEditor_command, command, "f");
            this.requestUpdate();
        }
    }
    get targetId() {
        return __classPrivateFieldGet(this, _JSONEditor_targetId, "f");
    }
    set targetId(targetId) {
        if (__classPrivateFieldGet(this, _JSONEditor_targetId, "f") !== targetId) {
            __classPrivateFieldSet(this, _JSONEditor_targetId, targetId, "f");
            this.requestUpdate();
        }
    }
    wasShown() {
        super.wasShown();
        __classPrivateFieldSet(this, _JSONEditor_hintPopoverHelper, new UI.PopoverHelper.PopoverHelper(this.contentElement, event => __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_handlePopoverDescriptions).call(this, event), 'protocol-monitor.hint'), "f");
        __classPrivateFieldGet(this, _JSONEditor_hintPopoverHelper, "f").setDisableOnClick(true);
        __classPrivateFieldGet(this, _JSONEditor_hintPopoverHelper, "f").setTimeout(300);
        const targetManager = SDK.TargetManager.TargetManager.instance();
        targetManager.addEventListener("AvailableTargetsChanged" /* SDK.TargetManager.Events.AVAILABLE_TARGETS_CHANGED */, __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_handleAvailableTargetsChanged), this);
        __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_handleAvailableTargetsChanged).call(this);
        this.requestUpdate();
    }
    willHide() {
        super.willHide();
        __classPrivateFieldGet(this, _JSONEditor_hintPopoverHelper, "f")?.hidePopover();
        __classPrivateFieldGet(this, _JSONEditor_hintPopoverHelper, "f")?.dispose();
        const targetManager = SDK.TargetManager.TargetManager.instance();
        targetManager.removeEventListener("AvailableTargetsChanged" /* SDK.TargetManager.Events.AVAILABLE_TARGETS_CHANGED */, __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_handleAvailableTargetsChanged), this);
    }
    getParameters() {
        const formatParameterValue = (parameter) => {
            if (parameter.value === undefined) {
                return;
            }
            switch (parameter.type) {
                case "number" /* ParameterType.NUMBER */: {
                    return Number(parameter.value);
                }
                case "boolean" /* ParameterType.BOOLEAN */: {
                    return Boolean(parameter.value);
                }
                case "object" /* ParameterType.OBJECT */: {
                    const nestedParameters = {};
                    for (const subParameter of parameter.value) {
                        const formattedValue = formatParameterValue(subParameter);
                        if (formattedValue !== undefined) {
                            nestedParameters[subParameter.name] = formatParameterValue(subParameter);
                        }
                    }
                    if (Object.keys(nestedParameters).length === 0) {
                        return undefined;
                    }
                    return nestedParameters;
                }
                case "array" /* ParameterType.ARRAY */: {
                    const nestedArrayParameters = [];
                    for (const subParameter of parameter.value) {
                        nestedArrayParameters.push(formatParameterValue(subParameter));
                    }
                    return nestedArrayParameters.length === 0 ? [] : nestedArrayParameters;
                }
                default: {
                    return parameter.value;
                }
            }
        };
        const formattedParameters = {};
        for (const parameter of this.parameters) {
            formattedParameters[parameter.name] = formatParameterValue(parameter);
        }
        return formatParameterValue({
            type: "object" /* ParameterType.OBJECT */,
            name: DUMMY_DATA,
            optional: true,
            value: this.parameters,
            description: '',
        });
    }
    // Displays a command entered in the input bar inside the editor
    displayCommand(command, parameters, targetId) {
        this.targetId = targetId;
        this.command = command;
        const schema = this.metadataByCommand.get(this.command);
        if (!schema?.parameters) {
            return;
        }
        this.populateParametersForCommandWithDefaultValues();
        const displayedParameters = __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_convertObjectToParameterSchema).call(this, '', parameters, {
            typeRef: DUMMY_DATA,
            type: "object" /* ParameterType.OBJECT */,
            name: '',
            description: '',
            optional: true,
            value: [],
        }, schema.parameters)
            .value;
        const valueByName = new Map(this.parameters.map(param => [param.name, param]));
        for (const param of displayedParameters) {
            const existingParam = valueByName.get(param.name);
            if (existingParam) {
                existingParam.value = param.value;
            }
        }
        this.requestUpdate();
    }
    getCommandJson() {
        return this.command !== '' ? JSON.stringify({ command: this.command, parameters: this.getParameters() }) : '';
    }
    populateParametersForCommandWithDefaultValues() {
        const commandParameters = this.metadataByCommand.get(this.command)?.parameters;
        if (!commandParameters) {
            return;
        }
        this.parameters = commandParameters.map((parameter) => {
            return __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_populateParameterDefaults).call(this, parameter);
        });
    }
    performUpdate() {
        const viewInput = {
            onParameterValueBlur: (event) => {
                __classPrivateFieldGet(this, _JSONEditor_saveParameterValue, "f").call(this, event);
            },
            onParameterKeydown: (event) => {
                __classPrivateFieldGet(this, _JSONEditor_handleParameterInputKeydown, "f").call(this, event);
            },
            onParameterFocus: (event) => {
                __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_handleFocusParameter).call(this, event);
            },
            onParameterKeyBlur: (event) => {
                __classPrivateFieldGet(this, _JSONEditor_saveNestedObjectParameterKey, "f").call(this, event);
            },
            onKeydown: (event) => {
                if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                    __classPrivateFieldGet(this, _JSONEditor_handleParameterInputKeydown, "f").call(this, event);
                    __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_handleCommandSend).call(this);
                }
            },
            parameters: this.parameters,
            metadataByCommand: this.metadataByCommand,
            command: this.command,
            typesByName: this.typesByName,
            onCommandInputBlur: (event) => __classPrivateFieldGet(this, _JSONEditor_handleCommandInputBlur, "f").call(this, event),
            onCommandSend: () => __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_handleCommandSend).call(this),
            onCopyToClipboard: () => __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_copyToClipboard).call(this),
            targets: this.targets,
            targetId: this.targetId,
            onAddParameter: (parameterId) => {
                __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_handleAddParameter).call(this, parameterId);
            },
            onClearParameter: (parameter, isParentArray) => {
                __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_handleClearParameter).call(this, parameter, isParentArray);
            },
            onDeleteParameter: (parameter, parentParameter) => {
                __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_handleDeleteParameter).call(this, parameter, parentParameter);
            },
            onTargetSelected: (event) => {
                __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_onTargetSelected).call(this, event);
            },
            computeDropdownValues: (parameter) => {
                return __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_computeDropdownValues).call(this, parameter);
            },
        };
        const viewOutput = {};
        __classPrivateFieldGet(this, _JSONEditor_view, "f").call(this, viewInput, viewOutput, this.contentElement);
    }
}
_JSONEditor_metadataByCommand = new WeakMap(), _JSONEditor_typesByName = new WeakMap(), _JSONEditor_enumsByName = new WeakMap(), _JSONEditor_parameters = new WeakMap(), _JSONEditor_targets = new WeakMap(), _JSONEditor_command = new WeakMap(), _JSONEditor_targetId = new WeakMap(), _JSONEditor_hintPopoverHelper = new WeakMap(), _JSONEditor_view = new WeakMap(), _JSONEditor_saveParameterValue = new WeakMap(), _JSONEditor_saveNestedObjectParameterKey = new WeakMap(), _JSONEditor_handleParameterInputKeydown = new WeakMap(), _JSONEditor_handleCommandInputBlur = new WeakMap(), _JSONEditor_instances = new WeakSet(), _JSONEditor_handleAvailableTargetsChanged = function _JSONEditor_handleAvailableTargetsChanged() {
    this.targets = SDK.TargetManager.TargetManager.instance().targets();
    if (this.targets.length && this.targetId === undefined) {
        this.targetId = this.targets[0].id();
    }
}, _JSONEditor_convertObjectToParameterSchema = function _JSONEditor_convertObjectToParameterSchema(key, value, schema, initialSchema) {
    const type = schema?.type || typeof value;
    const description = schema?.description ?? '';
    const optional = schema?.optional ?? true;
    switch (type) {
        case "string" /* ParameterType.STRING */:
        case "boolean" /* ParameterType.BOOLEAN */:
        case "number" /* ParameterType.NUMBER */:
            return __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_convertPrimitiveParameter).call(this, key, value, schema);
        case "object" /* ParameterType.OBJECT */:
            return __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_convertObjectParameter).call(this, key, value, schema, initialSchema);
        case "array" /* ParameterType.ARRAY */:
            return __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_convertArrayParameter).call(this, key, value, schema);
    }
    return {
        type,
        name: key,
        optional,
        typeRef: schema?.typeRef,
        value,
        description,
    };
}, _JSONEditor_convertPrimitiveParameter = function _JSONEditor_convertPrimitiveParameter(key, value, schema) {
    const type = schema?.type || typeof value;
    const description = schema?.description ?? '';
    const optional = schema?.optional ?? true;
    return {
        type,
        name: key,
        optional,
        typeRef: schema?.typeRef,
        value,
        description,
        isCorrectType: schema ? __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_isValueOfCorrectType).call(this, schema, String(value)) : true,
    };
}, _JSONEditor_convertObjectParameter = function _JSONEditor_convertObjectParameter(key, value, schema, initialSchema) {
    const description = schema?.description ?? '';
    if (typeof value !== 'object' || value === null) {
        throw new Error('The value is not an object');
    }
    const typeRef = schema?.typeRef;
    if (!typeRef) {
        throw new Error('Every object parameters should have a type ref');
    }
    const nestedType = typeRef === DUMMY_DATA ? initialSchema : this.typesByName.get(typeRef);
    if (!nestedType) {
        throw new Error('No nested type for keys were found');
    }
    const objectValues = [];
    for (const objectKey of Object.keys(value)) {
        const objectType = nestedType.find(param => param.name === objectKey);
        objectValues.push(__classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_convertObjectToParameterSchema).call(this, objectKey, value[objectKey], objectType));
    }
    return {
        type: "object" /* ParameterType.OBJECT */,
        name: key,
        optional: schema.optional,
        typeRef: schema.typeRef,
        value: objectValues,
        description,
        isCorrectType: true,
    };
}, _JSONEditor_convertArrayParameter = function _JSONEditor_convertArrayParameter(key, value, schema) {
    const description = schema?.description ?? '';
    const optional = schema?.optional ?? true;
    const typeRef = schema?.typeRef;
    if (!typeRef) {
        throw new Error('Every array parameters should have a type ref');
    }
    if (!Array.isArray(value)) {
        throw new Error('The value is not an array');
    }
    const nestedType = isTypePrimitive(typeRef) ? undefined : {
        optional: true,
        type: "object" /* ParameterType.OBJECT */,
        value: [],
        typeRef,
        description: '',
        name: '',
    };
    const objectValues = [];
    for (let i = 0; i < value.length; i++) {
        const temp = __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_convertObjectToParameterSchema).call(this, `${i}`, value[i], nestedType);
        objectValues.push(temp);
    }
    return {
        type: "array" /* ParameterType.ARRAY */,
        name: key,
        optional,
        typeRef: schema?.typeRef,
        value: objectValues,
        description,
        isCorrectType: true,
    };
}, _JSONEditor_handlePopoverDescriptions = function _JSONEditor_handlePopoverDescriptions(event) {
    const hintElement = event.composedPath()[0];
    const elementData = __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_getDescriptionAndTypeForElement).call(this, hintElement);
    if (!elementData?.description) {
        return null;
    }
    const [head, tail] = splitDescription(elementData.description);
    const type = elementData.type;
    const replyArgs = elementData.replyArgs;
    let popupContent = '';
    // replyArgs and type cannot get into conflict because replyArgs is attached to a command and type to a parameter
    if (replyArgs && replyArgs.length > 0) {
        popupContent = tail + `Returns: ${replyArgs}<br>`;
    }
    else if (type) {
        popupContent = tail + `<br>Type: ${type}<br>`;
    }
    else {
        popupContent = tail;
    }
    return {
        box: hintElement.boxInWindow(),
        show: async (popover) => {
            const popupElement = new ElementsComponents.CSSHintDetailsView.CSSHintDetailsView({
                getMessage: () => `<span>${head}</span>`,
                getPossibleFixMessage: () => popupContent,
                getLearnMoreLink: () => `https://chromedevtools.github.io/devtools-protocol/tot/${this.command.split('.')[0]}/`,
            });
            popover.contentElement.appendChild(popupElement);
            return true;
        },
    };
}, _JSONEditor_getDescriptionAndTypeForElement = function _JSONEditor_getDescriptionAndTypeForElement(hintElement) {
    if (hintElement.matches('.command')) {
        const metadata = this.metadataByCommand.get(this.command);
        if (metadata) {
            return { description: metadata.description, replyArgs: metadata.replyArgs };
        }
    }
    if (hintElement.matches('.parameter')) {
        const id = hintElement.dataset.paramid;
        if (!id) {
            return;
        }
        const pathArray = id.split('.');
        const { parameter } = __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_getChildByPath).call(this, pathArray);
        if (!parameter.description) {
            return;
        }
        return { description: parameter.description, type: parameter.type };
    }
    return;
}, _JSONEditor_copyToClipboard = function _JSONEditor_copyToClipboard() {
    const commandJson = this.getCommandJson();
    Host.InspectorFrontendHost.InspectorFrontendHostInstance.copyText(commandJson);
}, _JSONEditor_handleCommandSend = function _JSONEditor_handleCommandSend() {
    this.dispatchEventToListeners("submiteditor" /* Events.SUBMIT_EDITOR */, {
        command: this.command,
        parameters: this.getParameters(),
        targetId: this.targetId,
    });
}, _JSONEditor_populateParameterDefaults = function _JSONEditor_populateParameterDefaults(parameter) {
    if (parameter.type === "object" /* ParameterType.OBJECT */) {
        let typeRef = parameter.typeRef;
        if (!typeRef) {
            typeRef = DUMMY_DATA;
        }
        // Fallback to empty array is extremely rare.
        // It happens when the keys for an object are not registered like for Tracing.MemoryDumpConfig or headers for instance.
        const nestedTypes = this.typesByName.get(typeRef) ?? [];
        const nestedParameters = nestedTypes.map(nestedType => {
            return __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_populateParameterDefaults).call(this, nestedType);
        });
        return {
            ...parameter,
            value: parameter.optional ? undefined : nestedParameters,
            isCorrectType: true,
        };
    }
    if (parameter.type === "array" /* ParameterType.ARRAY */) {
        return {
            ...parameter,
            value: parameter?.optional ? undefined :
                parameter.value?.map(param => __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_populateParameterDefaults).call(this, param)) || [],
            isCorrectType: true,
        };
    }
    return {
        ...parameter,
        value: parameter.optional ? undefined : defaultValueByType.get(parameter.type),
        isCorrectType: true,
    };
}, _JSONEditor_getChildByPath = function _JSONEditor_getChildByPath(pathArray) {
    let parameters = this.parameters;
    let parentParameter;
    for (let i = 0; i < pathArray.length; i++) {
        const name = pathArray[i];
        const parameter = parameters.find(param => param.name === name);
        if (i === pathArray.length - 1) {
            return { parameter, parentParameter };
        }
        if (parameter?.type === "array" /* ParameterType.ARRAY */ || parameter?.type === "object" /* ParameterType.OBJECT */) {
            if (parameter.value) {
                parameters = parameter.value;
            }
        }
        else {
            throw new Error('Parameter on the path in not an object or an array');
        }
        parentParameter = parameter;
    }
    throw new Error('Not found');
}, _JSONEditor_isValueOfCorrectType = function _JSONEditor_isValueOfCorrectType(parameter, value) {
    if (parameter.type === "number" /* ParameterType.NUMBER */ && isNaN(Number(value))) {
        return false;
    }
    // For boolean or array parameters, this will create an array of the values the user can enter
    const acceptedValues = __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_computeDropdownValues).call(this, parameter);
    // Check to see if the entered value by the user is indeed part of the values accepted by the enum or boolean parameter
    if (acceptedValues.length !== 0 && !acceptedValues.includes(value)) {
        return false;
    }
    return true;
}, _JSONEditor_handleFocusParameter = function _JSONEditor_handleFocusParameter(event) {
    if (!(event.target instanceof SuggestionInput.SuggestionInput.SuggestionInput)) {
        return;
    }
    const paramId = event.target.getAttribute('data-paramid');
    if (!paramId) {
        return;
    }
    const pathArray = paramId.split('.');
    const object = __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_getChildByPath).call(this, pathArray).parameter;
    object.isCorrectType = true;
    this.requestUpdate();
}, _JSONEditor_focusNextElement = function _JSONEditor_focusNextElement(target) {
    // FIXME: can we do this via view output?
    const elements = this.contentElement.querySelectorAll('devtools-suggestion-input,.add-button');
    const element = [...elements].findIndex(value => value === target.shadowRoot?.host);
    if (element >= 0 && element + 1 < elements.length) {
        elements[element + 1].focus();
    }
    else {
        this.contentElement.querySelector('devtools-button[jslogcontext="protocol-monitor.send-command"]')
            ?.focus();
    }
}, _JSONEditor_createNestedParameter = function _JSONEditor_createNestedParameter(type, name) {
    if (type.type === "object" /* ParameterType.OBJECT */) {
        let typeRef = type.typeRef;
        if (!typeRef) {
            typeRef = DUMMY_DATA;
        }
        const nestedTypes = this.typesByName.get(typeRef) ?? [];
        const nestedValue = nestedTypes.map(nestedType => __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_createNestedParameter).call(this, nestedType, nestedType.name));
        return {
            type: "object" /* ParameterType.OBJECT */,
            name,
            optional: type.optional,
            typeRef,
            value: nestedValue,
            isCorrectType: true,
            description: type.description,
        };
    }
    return {
        type: type.type,
        name,
        optional: type.optional,
        isCorrectType: true,
        typeRef: type.typeRef,
        value: type.optional ? undefined : defaultValueByType.get(type.type),
        description: type.description,
    };
}, _JSONEditor_handleAddParameter = function _JSONEditor_handleAddParameter(parameterId) {
    const pathArray = parameterId.split('.');
    const { parameter, parentParameter } = __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_getChildByPath).call(this, pathArray);
    if (!parameter) {
        return;
    }
    switch (parameter.type) {
        case "array" /* ParameterType.ARRAY */: {
            const typeRef = parameter.typeRef;
            if (!typeRef) {
                throw new Error('Every array parameter must have a typeRef');
            }
            const nestedType = this.typesByName.get(typeRef) ?? [];
            const nestedValue = nestedType.map(type => __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_createNestedParameter).call(this, type, type.name));
            let type = isTypePrimitive(typeRef) ? typeRef : "object" /* ParameterType.OBJECT */;
            // If the typeRef is actually a ref to an enum type, the type of the nested param should be a string
            if (nestedType.length === 0) {
                if (this.enumsByName.get(typeRef)) {
                    type = "string" /* ParameterType.STRING */;
                }
            }
            // In case the parameter is an optional array, its value will be undefined so before pushing new value inside,
            // we reset it to empty array
            if (!parameter.value) {
                parameter.value = [];
            }
            parameter.value.push({
                type,
                name: String(parameter.value.length),
                optional: true,
                typeRef,
                value: nestedValue.length !== 0 ? nestedValue : '',
                description: '',
                isCorrectType: true,
            });
            break;
        }
        case "object" /* ParameterType.OBJECT */: {
            let typeRef = parameter.typeRef;
            if (!typeRef) {
                typeRef = DUMMY_DATA;
            }
            if (!parameter.value) {
                parameter.value = [];
            }
            if (!this.typesByName.get(typeRef)) {
                parameter.value.push({
                    type: "string" /* ParameterType.STRING */,
                    name: '',
                    optional: true,
                    value: '',
                    isCorrectType: true,
                    description: '',
                    isKeyEditable: true,
                });
                break;
            }
            const nestedTypes = this.typesByName.get(typeRef) ?? [];
            const nestedValue = nestedTypes.map(nestedType => __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_createNestedParameter).call(this, nestedType, nestedType.name));
            const nestedParameters = nestedTypes.map(nestedType => {
                return __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_populateParameterDefaults).call(this, nestedType);
            });
            if (parentParameter) {
                parameter.value.push({
                    type: "object" /* ParameterType.OBJECT */,
                    name: '',
                    optional: true,
                    typeRef,
                    value: nestedValue,
                    isCorrectType: true,
                    description: '',
                });
            }
            else {
                parameter.value = nestedParameters;
            }
            break;
        }
        default:
            // For non-array and non-object parameters, set the value to the default value if available.
            parameter.value = defaultValueByType.get(parameter.type);
            break;
    }
    this.requestUpdate();
}, _JSONEditor_handleClearParameter = function _JSONEditor_handleClearParameter(parameter, isParentArray) {
    if (parameter?.value === undefined) {
        return;
    }
    switch (parameter.type) {
        case "object" /* ParameterType.OBJECT */:
            if (parameter.optional && !isParentArray) {
                parameter.value = undefined;
                break;
            }
            if (!parameter.typeRef || !this.typesByName.get(parameter.typeRef)) {
                parameter.value = [];
            }
            else {
                parameter.value.forEach(param => __classPrivateFieldGet(this, _JSONEditor_instances, "m", _JSONEditor_handleClearParameter).call(this, param, isParentArray));
            }
            break;
        case "array" /* ParameterType.ARRAY */:
            parameter.value = parameter.optional ? undefined : [];
            break;
        default:
            parameter.value = parameter.optional ? undefined : defaultValueByType.get(parameter.type);
            parameter.isCorrectType = true;
            break;
    }
    this.requestUpdate();
}, _JSONEditor_handleDeleteParameter = function _JSONEditor_handleDeleteParameter(parameter, parentParameter) {
    if (!parameter) {
        return;
    }
    if (!Array.isArray(parentParameter.value)) {
        return;
    }
    parentParameter.value.splice(parentParameter.value.findIndex(p => p === parameter), 1);
    if (parentParameter.type === "array" /* ParameterType.ARRAY */) {
        for (let i = 0; i < parentParameter.value.length; i++) {
            parentParameter.value[i].name = String(i);
        }
    }
    this.requestUpdate();
}, _JSONEditor_onTargetSelected = function _JSONEditor_onTargetSelected(event) {
    if (event.target instanceof HTMLSelectElement) {
        this.targetId = event.target.value;
    }
    this.requestUpdate();
}, _JSONEditor_computeDropdownValues = function _JSONEditor_computeDropdownValues(parameter) {
    // The suggestion box should only be shown for parameters of type string and boolean
    if (parameter.type === "string" /* ParameterType.STRING */) {
        const enums = this.enumsByName.get(`${parameter.typeRef}`) ?? {};
        return Object.values(enums);
    }
    if (parameter.type === "boolean" /* ParameterType.BOOLEAN */) {
        return ['true', 'false'];
    }
    return [];
};
function isTypePrimitive(type) {
    if (type === "string" /* ParameterType.STRING */ || type === "boolean" /* ParameterType.BOOLEAN */ || type === "number" /* ParameterType.NUMBER */) {
        return true;
    }
    return false;
}
function renderTargetSelectorRow(input) {
    // clang-format off
    return html `
  <div class="row attribute padded">
    <div>target<span class="separator">:</span></div>
    <select class="target-selector"
            title=${i18nString(UIStrings.selectTarget)}
            jslog=${VisualLogging.dropDown('target-selector').track({ change: true })}
            @change=${input.onTargetSelected}>
      ${input.targets.map(target => html `
        <option jslog=${VisualLogging.item('target').track({ click: true })}
                value=${target.id()} ?selected=${target.id() === input.targetId}>
          ${target.name()} (${target.inspectedURL()})
        </option>`)}
    </select>
  </div>
`;
    // clang-format on
}
function renderInlineButton(opts) {
    return html `
          <devtools-button
            title=${opts.title}
            .size=${"SMALL" /* Buttons.Button.Size.SMALL */}
            .iconName=${opts.iconName}
            .variant=${"icon" /* Buttons.Button.Variant.ICON */}
            class=${classMap(opts.classMap)}
            @click=${opts.onClick}
            .jslogContext=${opts.jslogContext}
          ></devtools-button>
      `;
}
function renderWarningIcon() {
    return html `<devtools-icon
    .data=${{
        iconName: 'warning-filled', color: 'var(--icon-warning)', width: '14px', height: '14px',
    }}
    class=${classMap({
        'warning-icon': true,
    })}
  >
  </devtools-icon>`;
}
/**
 * Renders the parameters list corresponding to a specific CDP command.
 */
function renderParameters(input, parameters, id, parentParameter, parentParameterId) {
    parameters.sort((a, b) => Number(a.optional) - Number(b.optional));
    // clang-format off
    return html `
    <ul>
      ${repeat(parameters, parameter => {
        const parameterId = parentParameter ? `${parentParameterId}` + '.' + `${parameter.name}` : parameter.name;
        const subparameters = parameter.type === "array" /* ParameterType.ARRAY */ || parameter.type === "object" /* ParameterType.OBJECT */ ? (parameter.value ?? []) : [];
        const isPrimitive = isTypePrimitive(parameter.type);
        const isArray = parameter.type === "array" /* ParameterType.ARRAY */;
        const isParentArray = parentParameter && parentParameter.type === "array" /* ParameterType.ARRAY */;
        const isParentObject = parentParameter && parentParameter.type === "object" /* ParameterType.OBJECT */;
        const isObject = parameter.type === "object" /* ParameterType.OBJECT */;
        const isParamValueUndefined = parameter.value === undefined;
        const isParamOptional = parameter.optional;
        const hasTypeRef = isObject && parameter.typeRef && input.typesByName.get(parameter.typeRef) !== undefined;
        // This variable indicates that this parameter is a parameter nested inside an object parameter
        // that no keys defined inside the CDP documentation.
        const hasNoKeys = parameter.isKeyEditable;
        const isCustomEditorDisplayed = isObject && !hasTypeRef;
        const hasOptions = parameter.type === "string" /* ParameterType.STRING */ || parameter.type === "boolean" /* ParameterType.BOOLEAN */;
        const canClearParameter = (isArray && !isParamValueUndefined && parameter.value?.length !== 0) || (isObject && !isParamValueUndefined);
        const parametersClasses = {
            'optional-parameter': parameter.optional,
            parameter: true,
            'undefined-parameter': parameter.value === undefined && parameter.optional,
        };
        const inputClasses = {
            'json-input': true,
        };
        return html `
              <li class="row">
                <div class="row-icons">
                    ${!parameter.isCorrectType ? html `${renderWarningIcon()}` : nothing}

                    <!-- If an object parameter has no predefined keys, show an input to enter the key, otherwise show the name of the parameter -->
                    <div class=${classMap(parametersClasses)} data-paramId=${parameterId}>
                        ${hasNoKeys ?
            html `<devtools-suggestion-input
                            data-paramId=${parameterId}
                            isKey=${true}
                            .isCorrectInput=${live(parameter.isCorrectType)}
                            .options=${hasOptions ? input.computeDropdownValues(parameter) : []}
                            .autocomplete=${false}
                            .value=${live(parameter.name ?? '')}
                            .placeholder=${parameter.value === '' ? EMPTY_STRING : `<${defaultValueByType.get(parameter.type)}>`}
                            @blur=${input.onParameterKeyBlur}
                            @focus=${input.onParameterFocus}
                            @keydown=${input.onParameterKeydown}
                          ></devtools-suggestion-input>` :
            html `${parameter.name}`} <span class="separator">:</span>
                    </div>

                    <!-- Render button to add values inside an array parameter -->
                    ${isArray ? html `
                      ${renderInlineButton({
            title: i18nString(UIStrings.addParameter),
            iconName: 'plus',
            onClick: () => input.onAddParameter(parameterId),
            classMap: { 'add-button': true },
            jslogContext: 'protocol-monitor.add-parameter',
        })}
                    ` : nothing}

                    <!-- Render button to complete reset an array parameter or an object parameter-->
                    ${canClearParameter ?
            renderInlineButton({
                title: i18nString(UIStrings.resetDefaultValue),
                iconName: 'clear',
                onClick: () => input.onClearParameter(parameter, isParentArray),
                classMap: { 'clear-button': true },
                jslogContext: 'protocol-monitor.reset-to-default-value',
            }) : nothing}

                    <!-- Render the buttons to change the value from undefined to empty string for optional primitive parameters -->
                    ${isPrimitive && !isParentArray && isParamOptional && isParamValueUndefined ?
            html `  ${renderInlineButton({
                title: i18nString(UIStrings.addParameter),
                iconName: 'plus',
                onClick: () => input.onAddParameter(parameterId),
                classMap: { 'add-button': true },
                jslogContext: 'protocol-monitor.add-parameter',
            })}` : nothing}

                    <!-- Render the buttons to change the value from undefined to populate the values inside object with their default values -->
                    ${isObject && isParamOptional && isParamValueUndefined && hasTypeRef ?
            html `  ${renderInlineButton({
                title: i18nString(UIStrings.addParameter),
                iconName: 'plus',
                onClick: () => input.onAddParameter(parameterId),
                classMap: { 'add-button': true },
                jslogContext: 'protocol-monitor.add-parameter',
            })}` : nothing}
                </div>

                <div class="row-icons">
                    <!-- If an object has no predefined keys, show an input to enter the value, and a delete icon to delete the whole key/value pair -->
                    ${hasNoKeys && isParentObject ? html `
                    <!-- @ts-ignore -->
                    <devtools-suggestion-input
                        data-paramId=${parameterId}
                        .isCorrectInput=${live(parameter.isCorrectType)}
                        .options=${hasOptions ? input.computeDropdownValues(parameter) : []}
                        .autocomplete=${false}
                        .value=${live(parameter.value ?? '')}
                        .placeholder=${parameter.value === '' ? EMPTY_STRING : `<${defaultValueByType.get(parameter.type)}>`}
                        .jslogContext=${'parameter-value'}
                        @blur=${input.onParameterValueBlur}
                        @focus=${input.onParameterFocus}
                        @keydown=${input.onParameterKeydown}
                      ></devtools-suggestion-input>

                      ${renderInlineButton({
            title: i18nString(UIStrings.deleteParameter),
            iconName: 'bin',
            onClick: () => input.onDeleteParameter(parameter, parentParameter),
            classMap: { deleteButton: true, deleteIcon: true },
            jslogContext: 'protocol-monitor.delete-parameter',
        })}` : nothing}

                  <!-- In case  the parameter is not optional or its value is not undefined render the input -->
                  ${isPrimitive && !hasNoKeys && (!isParamValueUndefined || !isParamOptional) && (!isParentArray) ?
            html `
                      <!-- @ts-ignore -->
                      <devtools-suggestion-input
                        data-paramId=${parameterId}
                        .strikethrough=${live(parameter.isCorrectType)}
                        .options=${hasOptions ? input.computeDropdownValues(parameter) : []}
                        .autocomplete=${false}
                        .value=${live(parameter.value ?? '')}
                        .placeholder=${parameter.value === '' ? EMPTY_STRING : `<${defaultValueByType.get(parameter.type)}>`}
                        .jslogContext=${'parameter-value'}
                        @blur=${input.onParameterValueBlur}
                        @focus=${input.onParameterFocus}
                        @keydown=${input.onParameterKeydown}
                      ></devtools-suggestion-input>` : nothing}

                  <!-- Render the buttons to change the value from empty string to undefined for optional primitive parameters -->
                  ${isPrimitive && !hasNoKeys && !isParentArray && isParamOptional && !isParamValueUndefined ?
            html `  ${renderInlineButton({
                title: i18nString(UIStrings.resetDefaultValue),
                iconName: 'clear',
                onClick: () => input.onClearParameter(parameter),
                classMap: { 'clear-button': true },
                jslogContext: 'protocol-monitor.reset-to-default-value',
            })}` : nothing}

                  <!-- If the parameter is an object with no predefined keys, renders a button to add key/value pairs to it's value -->
                  ${isCustomEditorDisplayed ? html `
                    ${renderInlineButton({
            title: i18nString(UIStrings.addCustomProperty),
            iconName: 'plus',
            onClick: () => input.onAddParameter(parameterId),
            classMap: { 'add-button': true },
            jslogContext: 'protocol-monitor.add-custom-property',
        })}
                  ` : nothing}

                  <!-- In case the parameter is nested inside an array we render the input field as well as a delete button -->
                  ${isParentArray ? html `
                  <!-- If the parameter is an object we don't want to display the input field we just want the delete button-->
                  ${!isObject ? html `
                  <!-- @ts-ignore -->
                  <devtools-suggestion-input
                    data-paramId=${parameterId}
                    .options=${hasOptions ? input.computeDropdownValues(parameter) : []}
                    .autocomplete=${false}
                    .value=${live(parameter.value ?? '')}
                    .placeholder=${parameter.value === '' ? EMPTY_STRING : `<${defaultValueByType.get(parameter.type)}>`}
                    .jslogContext=${'parameter'}
                    @blur=${input.onParameterValueBlur}
                    @keydown=${input.onParameterKeydown}
                    class=${classMap(inputClasses)}
                  ></devtools-suggestion-input>` : nothing}

                  ${renderInlineButton({
            title: i18nString(UIStrings.deleteParameter),
            iconName: 'bin',
            onClick: () => input.onDeleteParameter(parameter, parentParameter),
            classMap: { 'delete-button': true },
            jslogContext: 'protocol-monitor.delete-parameter',
        })}` : nothing}
                </div>
              </li>
              ${renderParameters(input, subparameters, id, parameter, parameterId)}
            `;
    })}
    </ul>
  `;
    // clang-format on
}
export const DEFAULT_VIEW = (input, _output, target) => {
    // clang-format off
    render(html `
    <div class="wrapper" @keydown=${input.onKeydown} jslog=${VisualLogging.pane('command-editor').track({ resize: true })}>
      <div class="editor-wrapper">
        ${renderTargetSelectorRow(input)}
        <div class="row attribute padded">
          <div class="command">command<span class="separator">:</span></div>
          <devtools-suggestion-input
            .options=${[...input.metadataByCommand.keys()]}
            .value=${input.command}
            .placeholder=${'Enter your command…'}
            .suggestionFilter=${suggestionFilter}
            .jslogContext=${'command'}
            @blur=${input.onCommandInputBlur}
            class=${classMap({ 'json-input': true })}
          ></devtools-suggestion-input>
        </div>
        ${input.parameters.length ? html `
        <div class="row attribute padded">
          <div>parameters<span class="separator">:</span></div>
        </div>
          ${renderParameters(input, input.parameters)}
        ` : nothing}
      </div>
      <devtools-toolbar class="protocol-monitor-sidebar-toolbar">
        <devtools-button title=${i18nString(UIStrings.copyCommand)}
                        .iconName=${'copy'}
                        .jslogContext=${'protocol-monitor.copy-command'}
                        .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
                        @click=${input.onCopyToClipboard}></devtools-button>
          <div class=toolbar-spacer></div>
        <devtools-button title=${Host.Platform.isMac() ? i18nString(UIStrings.sendCommandCmdEnter) : i18nString(UIStrings.sendCommandCtrlEnter)}
                        .iconName=${'send'}
                        jslogContext=${'protocol-monitor.send-command'}
                        .variant=${"primary_toolbar" /* Buttons.Button.Variant.PRIMARY_TOOLBAR */}
                        @click=${input.onCommandSend}></devtools-button>
      </devtools-toolbar>
    </div>`, target, { host: input });
    // clang-format on
};
//# sourceMappingURL=JSONEditor.js.map