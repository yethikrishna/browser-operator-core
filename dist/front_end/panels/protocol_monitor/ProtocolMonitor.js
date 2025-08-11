// Copyright 2018 The Chromium Authors. All rights reserved.
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
var _ProtocolMonitorImpl_instances, _ProtocolMonitorImpl_filterKeys, _ProtocolMonitorImpl_commandAutocompleteSuggestionProvider, _ProtocolMonitorImpl_selectedTargetId, _ProtocolMonitorImpl_command, _ProtocolMonitorImpl_sidebarVisible, _ProtocolMonitorImpl_view, _ProtocolMonitorImpl_messages, _ProtocolMonitorImpl_selectedMessage, _ProtocolMonitorImpl_filter, _ProtocolMonitorImpl_editorWidget, _ProtocolMonitorImpl_populateToolbarInput, _ProtocolMonitorImpl_populateContextMenu, _CommandAutocompleteSuggestionProvider_maxHistorySize, _CommandAutocompleteSuggestionProvider_commandHistory;
import '../../ui/legacy/legacy.js';
import '../../ui/legacy/components/data_grid/data_grid.js';
import * as Host from '../../core/host/host.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as ProtocolClient from '../../core/protocol_client/protocol_client.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Bindings from '../../models/bindings/bindings.js';
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Buttons from '../../ui/components/buttons/buttons.js';
import * as SourceFrame from '../../ui/legacy/components/source_frame/source_frame.js';
import * as UI from '../../ui/legacy/legacy.js';
import { Directives, html, render } from '../../ui/lit/lit.js';
import * as VisualLogging from '../../ui/visual_logging/visual_logging.js';
import { JSONEditor } from './JSONEditor.js';
import protocolMonitorStyles from './protocolMonitor.css.js';
const { styleMap } = Directives;
const { widgetConfig, widgetRef } = UI.Widget;
const UIStrings = {
    /**
     *@description Text for one or a group of functions
     */
    method: 'Method',
    /**
     * @description Text in Protocol Monitor. Title for a table column which shows in which direction
     * the particular protocol message was travelling. Values in this column will either be 'sent' or
     * 'received'.
     */
    type: 'Type',
    /**
     * @description Text in Protocol Monitor of the Protocol Monitor tab. Noun relating to a network request.
     */
    request: 'Request',
    /**
     *@description Title of a cell content in protocol monitor. A Network response refers to the act of acknowledging a
    network request. Should not be confused with answer.
     */
    response: 'Response',
    /**
     *@description Text for timestamps of items
     */
    timestamp: 'Timestamp',
    /**
     *@description Title of a cell content in protocol monitor. It describes the time between sending a request and receiving a response.
     */
    elapsedTime: 'Elapsed time',
    /**
     *@description Text in Protocol Monitor of the Protocol Monitor tab
     */
    target: 'Target',
    /**
     *@description Text to record a series of actions for analysis
     */
    record: 'Record',
    /**
     *@description Text to clear everything
     */
    clearAll: 'Clear all',
    /**
     *@description Text to filter result items
     */
    filter: 'Filter',
    /**
     *@description Text for the documentation of something
     */
    documentation: 'Documentation',
    /**
     *@description Text to open the CDP editor with the selected command
     */
    editAndResend: 'Edit and resend',
    /**
     *@description Cell text content in Protocol Monitor of the Protocol Monitor tab
     *@example {30} PH1
     */
    sMs: '{PH1} ms',
    /**
     *@description Text in Protocol Monitor of the Protocol Monitor tab
     */
    noMessageSelected: 'No message selected',
    /**
     *@description Text in Protocol Monitor of the Protocol Monitor tab if no message is selected
     */
    selectAMessageToView: 'Select a message to see its details',
    /**
     *@description Text in Protocol Monitor for the save button
     */
    save: 'Save',
    /**
     *@description Text in Protocol Monitor to describe the sessions column
     */
    session: 'Session',
    /**
     *@description A placeholder for an input in Protocol Monitor. The input accepts commands that are sent to the backend on Enter. CDP stands for Chrome DevTools Protocol.
     */
    sendRawCDPCommand: 'Send a raw `CDP` command',
    /**
     * @description A tooltip text for the input in the Protocol Monitor panel. The tooltip describes what format is expected.
     */
    sendRawCDPCommandExplanation: 'Format: `\'Domain.commandName\'` for a command without parameters, or `\'{"command":"Domain.commandName", "parameters": {...}}\'` as a JSON object for a command with parameters. `\'cmd\'`/`\'method\'` and `\'args\'`/`\'params\'`/`\'arguments\'` are also supported as alternative keys for the `JSON` object.',
    /**
     * @description A label for a select input that allows selecting a CDP target to send the commands to.
     */
    selectTarget: 'Select a target',
    /**
     * @description Tooltip for the the console sidebar toggle in the Console panel. Command to
     * open/show the sidebar.
     */
    showCDPCommandEditor: 'Show CDP command editor',
    /**
     * @description Tooltip for the the console sidebar toggle in the Console panel. Command to
     * open/show the sidebar.
     */
    hideCDPCommandEditor: 'Hide  CDP command editor',
};
const str_ = i18n.i18n.registerUIStrings('panels/protocol_monitor/ProtocolMonitor.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export const buildProtocolMetadata = (domains) => {
    const metadataByCommand = new Map();
    for (const domain of domains) {
        for (const command of Object.keys(domain.metadata)) {
            metadataByCommand.set(command, domain.metadata[command]);
        }
    }
    return metadataByCommand;
};
const metadataByCommand = buildProtocolMetadata(ProtocolClient.InspectorBackend.inspectorBackend.agentPrototypes.values());
const typesByName = ProtocolClient.InspectorBackend.inspectorBackend.typeMap;
const enumsByName = ProtocolClient.InspectorBackend.inspectorBackend.enumMap;
export const DEFAULT_VIEW = (input, output, target) => {
    // clang-format off
    render(html `
        <style>${UI.inspectorCommonStyles}</style>
        <style>${protocolMonitorStyles}</style>
        <devtools-split-view name="protocol-monitor-split-container"
                             direction="column"
                             sidebar-initial-size="400"
                             sidebar-visibility=${input.sidebarVisible ? 'visible' : 'hidden'}
                             @change=${input.onSplitChange}>
          <div slot="main" class="vbox protocol-monitor-main">
            <devtools-toolbar class="protocol-monitor-toolbar"
                               jslog=${VisualLogging.toolbar('top')}>
               <devtools-button title=${i18nString(UIStrings.record)}
                                .iconName=${'record-start'}
                                .toggledIconName=${'record-stop'}
                                .jslogContext=${'protocol-monitor.toggle-recording'}
                                .variant=${"icon_toggle" /* Buttons.Button.Variant.ICON_TOGGLE */}
                                .toggleType=${"red-toggle" /* Buttons.Button.ToggleType.RED */}
                                .toggled=${true}
                                @click=${input.onRecord}></devtools-button>
              <devtools-button title=${i18nString(UIStrings.clearAll)}
                               .iconName=${'clear'}
                               .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
                               .jslogContext=${'protocol-monitor.clear-all'}
                               @click=${input.onClear}></devtools-button>
              <devtools-button title=${i18nString(UIStrings.save)}
                               .iconName=${'download'}
                               .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
                               .jslogContext=${'protocol-monitor.save'}
                               @click=${input.onSave}></devtools-button>
              <devtools-toolbar-input type="filter"
                                      list="filter-suggestions"
                                      style="flex-grow: 1"
                                      value=${input.filter}
                                      @change=${input.onFilterChanged}>
                <datalist id="filter-suggestions">
                  ${input.filterKeys.map(key => html `
                        <option value=${key + ':'}></option>
                        <option value=${'-' + key + ':'}></option>`)}
                </datalist>
              </devtools-toolbar-input>
            </devtools-toolbar>
            <devtools-split-view direction="column" sidebar-position="second"
                                 name="protocol-monitor-panel-split" sidebar-initial-size="250">
              <devtools-data-grid
                  striped
                  slot="main"
                  @select=${input.onSelect}
                  @contextmenu=${input.onContextMenu}
                  .filters=${input.parseFilter(input.filter)}>
                <table>
                    <tr>
                      <th id="type" sortable style="text-align: center" hideable weight="1">
                        ${i18nString(UIStrings.type)}
                      </th>
                      <th id="method" weight="5">
                        ${i18nString(UIStrings.method)}
                      </th>
                      <th id="request" hideable weight="5">
                        ${i18nString(UIStrings.request)}
                      </th>
                      <th id="response" hideable weight="5">
                        ${i18nString(UIStrings.response)}
                      </th>
                      <th id="elapsed-time" sortable hideable weight="2">
                        ${i18nString(UIStrings.elapsedTime)}
                      </th>
                      <th id="timestamp" sortable hideable weight="5">
                        ${i18nString(UIStrings.timestamp)}
                      </th>
                      <th id="target" sortable hideable weight="5">
                        ${i18nString(UIStrings.target)}
                      </th>
                      <th id="session" sortable hideable weight="5">
                        ${i18nString(UIStrings.session)}
                      </th>
                    </tr>
                    ${input.messages.map((message, index) => html `
                      <tr data-index=${index}
                          style="--override-data-grid-row-background-color: var(--sys-color-surface3)">
                        ${'id' in message ? html `
                          <td title="sent">
                            <devtools-icon name="arrow-up-down" style="color: var(--icon-request-response); width: 16px; height: 16px;">
                            </devtools-icon>
                          </td>` : html `
                          <td title="received">
                            <devtools-icon name="arrow-down" style="color: var(--icon-request); width: 16px; height: 16px;">
                            </devtools-icon>
                          </td>`}
                        <td>${message.method}</td>
                        <td>${message.params ? html `<code>${JSON.stringify(message.params)}</code>` : ''}</td>
                        <td>
                          ${message.result ? html `<code>${JSON.stringify(message.result)}</code>` :
        message.error ? html `<code>${JSON.stringify(message.error)}</code>` :
            '(pending)'}
                        </td>
                        <td data-value=${message.elapsedTime || 0}>
                          ${!('id' in message) ? '' :
        message.elapsedTime ? i18nString(UIStrings.sMs, { PH1: String(message.elapsedTime) })
            : '(pending)'}
                        </td>
                        <td data-value=${message.requestTime}>${i18nString(UIStrings.sMs, { PH1: String(message.requestTime) })}</td>
                        <td>${targetToString(message.target)}</td>
                        <td>${message.sessionId || ''}</td>
                      </tr>`)}
                  </table>
              </devtools-data-grid>
              <devtools-widget .widgetConfig=${widgetConfig(InfoWidget, {
        request: input.selectedMessage?.params,
        response: input.selectedMessage?.result || input.selectedMessage?.error,
        type: !input.selectedMessage ? undefined :
            ('id' in input?.selectedMessage) ? 'sent'
                : 'received',
    })}
                  class="protocol-monitor-info"
                  slot="sidebar"></devtools-widget>
            </devtools-split-view>
            <devtools-toolbar class="protocol-monitor-bottom-toolbar"
               jslog=${VisualLogging.toolbar('bottom')}>
              <devtools-button .title=${input.sidebarVisible ? i18nString(UIStrings.hideCDPCommandEditor) : i18nString(UIStrings.showCDPCommandEditor)}
                               .iconName=${input.sidebarVisible ? 'left-panel-close' : 'left-panel-open'}
                               .variant=${"toolbar" /* Buttons.Button.Variant.TOOLBAR */}
                               .jslogContext=${'protocol-monitor.toggle-command-editor'}
                               @click=${input.onToggleSidebar}></devtools-button>
              </devtools-button>
              <devtools-toolbar-input id="command-input"
                                      style=${styleMap({
        'flex-grow': 1,
        display: input.sidebarVisible ? 'none' : 'flex'
    })}
                                      value=${input.command}
                                      list="command-input-suggestions"
                                      placeholder=${i18nString(UIStrings.sendRawCDPCommand)}
                                      title=${i18nString(UIStrings.sendRawCDPCommandExplanation)}
                                      @change=${input.onCommandChange}
                                      @submit=${input.onCommandSubmitted}>
                <datalist id="command-input-suggestions">
                  ${input.commandSuggestions.map(c => html `<option value=${c}></option>`)}
                </datalist>
              </devtools-toolbar-input>
              <select class="target-selector"
                      title=${i18nString(UIStrings.selectTarget)}
                      style=${styleMap({ display: input.sidebarVisible ? 'none' : 'flex' })}
                      jslog=${VisualLogging.dropDown('target-selector').track({ change: true })}
                      @change=${input.onTargetChange}>
                ${input.targets.map(target => html `
                  <option jslog=${VisualLogging.item('target').track({ click: true })}
                          value=${target.id()} ?selected=${target.id() === input.selectedTargetId}>
                    ${target.name()} (${target.inspectedURL()})
                  </option>`)}
              </select>
            </devtools-toolbar>
          </div>
          <devtools-widget slot="sidebar"
              .widgetConfig=${widgetConfig(JSONEditor, { metadataByCommand, typesByName, enumsByName })}
              ${widgetRef(JSONEditor, e => { output.editorWidget = e; })}>
          </devtools-widget>
        </devtools-split-view>`, target, { host: input });
    // clang-format on
};
export class ProtocolMonitorImpl extends UI.Panel.Panel {
    constructor(view = DEFAULT_VIEW) {
        super('protocol-monitor', true);
        _ProtocolMonitorImpl_instances.add(this);
        this.messageForId = new Map();
        _ProtocolMonitorImpl_filterKeys.set(this, ['method', 'request', 'response', 'target', 'session']);
        _ProtocolMonitorImpl_commandAutocompleteSuggestionProvider.set(this, new CommandAutocompleteSuggestionProvider());
        _ProtocolMonitorImpl_selectedTargetId.set(this, void 0);
        _ProtocolMonitorImpl_command.set(this, '');
        _ProtocolMonitorImpl_sidebarVisible.set(this, false);
        _ProtocolMonitorImpl_view.set(this, void 0);
        _ProtocolMonitorImpl_messages.set(this, []);
        _ProtocolMonitorImpl_selectedMessage.set(this, void 0);
        _ProtocolMonitorImpl_filter.set(this, '');
        _ProtocolMonitorImpl_editorWidget.set(this, void 0);
        __classPrivateFieldSet(this, _ProtocolMonitorImpl_view, view, "f");
        this.started = false;
        this.startTime = 0;
        __classPrivateFieldSet(this, _ProtocolMonitorImpl_filterKeys, ['method', 'request', 'response', 'type', 'target', 'session'], "f");
        this.filterParser = new TextUtils.TextUtils.FilterParser(__classPrivateFieldGet(this, _ProtocolMonitorImpl_filterKeys, "f"));
        __classPrivateFieldSet(this, _ProtocolMonitorImpl_selectedTargetId, 'main', "f");
        this.performUpdate();
        __classPrivateFieldGet(this, _ProtocolMonitorImpl_editorWidget, "f").addEventListener("submiteditor" /* JSONEditorEvents.SUBMIT_EDITOR */, event => {
            this.onCommandSend(event.data.command, event.data.parameters, event.data.targetId);
        });
        SDK.TargetManager.TargetManager.instance().addEventListener("AvailableTargetsChanged" /* SDK.TargetManager.Events.AVAILABLE_TARGETS_CHANGED */, () => {
            this.requestUpdate();
        });
    }
    performUpdate() {
        const viewInput = {
            messages: __classPrivateFieldGet(this, _ProtocolMonitorImpl_messages, "f"),
            selectedMessage: __classPrivateFieldGet(this, _ProtocolMonitorImpl_selectedMessage, "f"),
            sidebarVisible: __classPrivateFieldGet(this, _ProtocolMonitorImpl_sidebarVisible, "f"),
            command: __classPrivateFieldGet(this, _ProtocolMonitorImpl_command, "f"),
            commandSuggestions: __classPrivateFieldGet(this, _ProtocolMonitorImpl_commandAutocompleteSuggestionProvider, "f").allSuggestions(),
            filterKeys: __classPrivateFieldGet(this, _ProtocolMonitorImpl_filterKeys, "f"),
            filter: __classPrivateFieldGet(this, _ProtocolMonitorImpl_filter, "f"),
            parseFilter: this.filterParser.parse.bind(this.filterParser),
            onSplitChange: (e) => {
                if (e.detail === 'OnlyMain') {
                    __classPrivateFieldGet(this, _ProtocolMonitorImpl_instances, "m", _ProtocolMonitorImpl_populateToolbarInput).call(this);
                    __classPrivateFieldSet(this, _ProtocolMonitorImpl_sidebarVisible, false, "f");
                }
                else {
                    const { command, parameters } = parseCommandInput(__classPrivateFieldGet(this, _ProtocolMonitorImpl_command, "f"));
                    __classPrivateFieldGet(this, _ProtocolMonitorImpl_editorWidget, "f").displayCommand(command, parameters, __classPrivateFieldGet(this, _ProtocolMonitorImpl_selectedTargetId, "f"));
                    __classPrivateFieldSet(this, _ProtocolMonitorImpl_sidebarVisible, true, "f");
                }
                this.requestUpdate();
            },
            onRecord: (e) => {
                this.setRecording(e.target.toggled);
            },
            onClear: () => {
                __classPrivateFieldSet(this, _ProtocolMonitorImpl_messages, [], "f");
                this.messageForId.clear();
                this.requestUpdate();
            },
            onSave: () => {
                void this.saveAsFile();
            },
            onSelect: (e) => {
                const index = parseInt(e.detail?.dataset?.index ?? '', 10);
                __classPrivateFieldSet(this, _ProtocolMonitorImpl_selectedMessage, !isNaN(index) ? __classPrivateFieldGet(this, _ProtocolMonitorImpl_messages, "f")[index] : undefined, "f");
                this.requestUpdate();
            },
            onContextMenu: (e) => {
                const message = __classPrivateFieldGet(this, _ProtocolMonitorImpl_messages, "f")[parseInt(e.detail?.element?.dataset?.index || '', 10)];
                if (message) {
                    __classPrivateFieldGet(this, _ProtocolMonitorImpl_instances, "m", _ProtocolMonitorImpl_populateContextMenu).call(this, e.detail.menu, message);
                }
            },
            onCommandChange: (e) => {
                __classPrivateFieldSet(this, _ProtocolMonitorImpl_command, e.detail, "f");
            },
            onCommandSubmitted: (e) => {
                __classPrivateFieldGet(this, _ProtocolMonitorImpl_commandAutocompleteSuggestionProvider, "f").addEntry(e.detail);
                const { command, parameters } = parseCommandInput(e.detail);
                this.onCommandSend(command, parameters, __classPrivateFieldGet(this, _ProtocolMonitorImpl_selectedTargetId, "f"));
            },
            onFilterChanged: (e) => {
                __classPrivateFieldSet(this, _ProtocolMonitorImpl_filter, e.detail, "f");
                this.requestUpdate();
            },
            onTargetChange: (e) => {
                if (e.target instanceof HTMLSelectElement) {
                    __classPrivateFieldSet(this, _ProtocolMonitorImpl_selectedTargetId, e.target.value, "f");
                }
            },
            onToggleSidebar: (_e) => {
                __classPrivateFieldSet(this, _ProtocolMonitorImpl_sidebarVisible, !__classPrivateFieldGet(this, _ProtocolMonitorImpl_sidebarVisible, "f"), "f");
                this.requestUpdate();
            },
            targets: SDK.TargetManager.TargetManager.instance().targets(),
            selectedTargetId: __classPrivateFieldGet(this, _ProtocolMonitorImpl_selectedTargetId, "f"),
        };
        const that = this;
        const viewOutput = {
            set editorWidget(value) {
                __classPrivateFieldSet(that, _ProtocolMonitorImpl_editorWidget, value, "f");
            }
        };
        __classPrivateFieldGet(this, _ProtocolMonitorImpl_view, "f").call(this, viewInput, viewOutput, this.contentElement);
    }
    onCommandSend(command, parameters, target) {
        const test = ProtocolClient.InspectorBackend.test;
        const targetManager = SDK.TargetManager.TargetManager.instance();
        const selectedTarget = target ? targetManager.targetById(target) : null;
        const sessionId = selectedTarget ? selectedTarget.sessionId : '';
        // TS thinks that properties are read-only because
        // in TS test is defined as a namespace.
        // @ts-expect-error
        test.sendRawMessage(command, parameters, () => { }, sessionId);
    }
    wasShown() {
        if (this.started) {
            return;
        }
        this.started = true;
        this.startTime = Date.now();
        this.setRecording(true);
    }
    setRecording(recording) {
        const test = ProtocolClient.InspectorBackend.test;
        if (recording) {
            // @ts-expect-error
            test.onMessageSent = this.messageSent.bind(this);
            // @ts-expect-error
            test.onMessageReceived = this.messageReceived.bind(this);
        }
        else {
            test.onMessageSent = null;
            test.onMessageReceived = null;
        }
    }
    messageReceived(message, target) {
        if ('id' in message && message.id) {
            const existingMessage = this.messageForId.get(message.id);
            if (!existingMessage) {
                return;
            }
            existingMessage.result = message.result;
            existingMessage.error = message.error;
            existingMessage.elapsedTime = Date.now() - this.startTime - existingMessage.requestTime;
            // Now we've updated the message, it won't be updated again, so we can delete it from the tracking map.
            this.messageForId.delete(message.id);
            this.requestUpdate();
            return;
        }
        __classPrivateFieldGet(this, _ProtocolMonitorImpl_messages, "f").push({
            method: message.method,
            sessionId: message.sessionId,
            target: (target ?? undefined),
            requestTime: Date.now() - this.startTime,
            result: message.params,
        });
        this.requestUpdate();
    }
    messageSent(message, target) {
        const messageRecord = {
            method: message.method,
            params: message.params,
            id: message.id,
            sessionId: message.sessionId,
            target: (target ?? undefined),
            requestTime: Date.now() - this.startTime,
        };
        __classPrivateFieldGet(this, _ProtocolMonitorImpl_messages, "f").push(messageRecord);
        this.requestUpdate();
        this.messageForId.set(message.id, messageRecord);
    }
    async saveAsFile() {
        const now = new Date();
        const fileName = 'ProtocolMonitor-' + Platform.DateUtilities.toISO8601Compact(now) + '.json';
        const stream = new Bindings.FileUtils.FileOutputStream();
        const accepted = await stream.open(fileName);
        if (!accepted) {
            return;
        }
        const rowEntries = __classPrivateFieldGet(this, _ProtocolMonitorImpl_messages, "f").map(m => ({ ...m, target: m.target?.id() }));
        void stream.write(JSON.stringify(rowEntries, null, '  '));
        void stream.close();
    }
}
_ProtocolMonitorImpl_filterKeys = new WeakMap(), _ProtocolMonitorImpl_commandAutocompleteSuggestionProvider = new WeakMap(), _ProtocolMonitorImpl_selectedTargetId = new WeakMap(), _ProtocolMonitorImpl_command = new WeakMap(), _ProtocolMonitorImpl_sidebarVisible = new WeakMap(), _ProtocolMonitorImpl_view = new WeakMap(), _ProtocolMonitorImpl_messages = new WeakMap(), _ProtocolMonitorImpl_selectedMessage = new WeakMap(), _ProtocolMonitorImpl_filter = new WeakMap(), _ProtocolMonitorImpl_editorWidget = new WeakMap(), _ProtocolMonitorImpl_instances = new WeakSet(), _ProtocolMonitorImpl_populateToolbarInput = function _ProtocolMonitorImpl_populateToolbarInput() {
    const commandJson = __classPrivateFieldGet(this, _ProtocolMonitorImpl_editorWidget, "f").getCommandJson();
    const targetId = __classPrivateFieldGet(this, _ProtocolMonitorImpl_editorWidget, "f").targetId;
    if (targetId) {
        __classPrivateFieldSet(this, _ProtocolMonitorImpl_selectedTargetId, targetId, "f");
    }
    if (commandJson) {
        __classPrivateFieldSet(this, _ProtocolMonitorImpl_command, commandJson, "f");
        this.requestUpdate();
    }
}, _ProtocolMonitorImpl_populateContextMenu = function _ProtocolMonitorImpl_populateContextMenu(menu, message) {
    /**
     * You can click the "Edit and resend" item in the context menu to be
     * taken to the CDP editor with the filled with the selected command.
     */
    menu.editSection().appendItem(i18nString(UIStrings.editAndResend), () => {
        if (!__classPrivateFieldGet(this, _ProtocolMonitorImpl_selectedMessage, "f")) {
            return;
        }
        const parameters = __classPrivateFieldGet(this, _ProtocolMonitorImpl_selectedMessage, "f").params;
        const targetId = __classPrivateFieldGet(this, _ProtocolMonitorImpl_selectedMessage, "f").target?.id() || '';
        const command = message.method;
        __classPrivateFieldSet(this, _ProtocolMonitorImpl_command, JSON.stringify({ command, parameters }), "f");
        if (!__classPrivateFieldGet(this, _ProtocolMonitorImpl_sidebarVisible, "f")) {
            __classPrivateFieldSet(this, _ProtocolMonitorImpl_sidebarVisible, true, "f");
            this.requestUpdate();
        }
        else {
            __classPrivateFieldGet(this, _ProtocolMonitorImpl_editorWidget, "f").displayCommand(command, parameters, targetId);
        }
    }, { jslogContext: 'edit-and-resend', disabled: !('id' in message) });
    /**
     * You can click the "Filter" item in the context menu to filter the
     * protocol monitor entries to those that match the method of the
     * current row.
     */
    menu.editSection().appendItem(i18nString(UIStrings.filter), () => {
        __classPrivateFieldSet(this, _ProtocolMonitorImpl_filter, `method:${message.method}`, "f");
        this.requestUpdate();
    }, { jslogContext: 'filter' });
    /**
     * You can click the "Documentation" item in the context menu to be
     * taken to the CDP Documentation site entry for the given method.
     */
    menu.footerSection().appendItem(i18nString(UIStrings.documentation), () => {
        const [domain, method] = message.method.split('.');
        const type = 'id' in message ? 'method' : 'event';
        Host.InspectorFrontendHost.InspectorFrontendHostInstance.openInNewTab(`https://chromedevtools.github.io/devtools-protocol/tot/${domain}#${type}-${method}`);
    }, { jslogContext: 'documentation' });
};
export class CommandAutocompleteSuggestionProvider {
    constructor(maxHistorySize) {
        _CommandAutocompleteSuggestionProvider_maxHistorySize.set(this, 200);
        _CommandAutocompleteSuggestionProvider_commandHistory.set(this, new Set());
        this.buildTextPromptCompletions = async (expression, prefix, force) => {
            if (!prefix && !force && expression) {
                return [];
            }
            const newestToOldest = this.allSuggestions();
            return newestToOldest.filter(cmd => cmd.startsWith(prefix)).map(text => ({
                text,
            }));
        };
        if (maxHistorySize !== undefined) {
            __classPrivateFieldSet(this, _CommandAutocompleteSuggestionProvider_maxHistorySize, maxHistorySize, "f");
        }
    }
    allSuggestions() {
        const newestToOldest = [...__classPrivateFieldGet(this, _CommandAutocompleteSuggestionProvider_commandHistory, "f")].reverse();
        newestToOldest.push(...metadataByCommand.keys());
        return newestToOldest;
    }
    addEntry(value) {
        if (__classPrivateFieldGet(this, _CommandAutocompleteSuggestionProvider_commandHistory, "f").has(value)) {
            __classPrivateFieldGet(this, _CommandAutocompleteSuggestionProvider_commandHistory, "f").delete(value);
        }
        __classPrivateFieldGet(this, _CommandAutocompleteSuggestionProvider_commandHistory, "f").add(value);
        if (__classPrivateFieldGet(this, _CommandAutocompleteSuggestionProvider_commandHistory, "f").size > __classPrivateFieldGet(this, _CommandAutocompleteSuggestionProvider_maxHistorySize, "f")) {
            const earliestEntry = __classPrivateFieldGet(this, _CommandAutocompleteSuggestionProvider_commandHistory, "f").values().next().value;
            __classPrivateFieldGet(this, _CommandAutocompleteSuggestionProvider_commandHistory, "f").delete(earliestEntry);
        }
    }
}
_CommandAutocompleteSuggestionProvider_maxHistorySize = new WeakMap(), _CommandAutocompleteSuggestionProvider_commandHistory = new WeakMap();
export class InfoWidget extends UI.Widget.VBox {
    constructor(element) {
        super(undefined, undefined, element);
        this.tabbedPane = new UI.TabbedPane.TabbedPane();
        this.tabbedPane.appendTab('request', i18nString(UIStrings.request), new UI.Widget.Widget());
        this.tabbedPane.appendTab('response', i18nString(UIStrings.response), new UI.Widget.Widget());
        this.tabbedPane.show(this.contentElement);
        this.tabbedPane.selectTab('response');
        this.request = {};
    }
    performUpdate() {
        if (!this.request && !this.response) {
            this.tabbedPane.changeTabView('request', new UI.EmptyWidget.EmptyWidget(i18nString(UIStrings.noMessageSelected), i18nString(UIStrings.selectAMessageToView)));
            this.tabbedPane.changeTabView('response', new UI.EmptyWidget.EmptyWidget(i18nString(UIStrings.noMessageSelected), i18nString(UIStrings.selectAMessageToView)));
            return;
        }
        const requestEnabled = this.type && this.type === 'sent';
        this.tabbedPane.setTabEnabled('request', Boolean(requestEnabled));
        if (!requestEnabled) {
            this.tabbedPane.selectTab('response');
        }
        this.tabbedPane.changeTabView('request', SourceFrame.JSONView.JSONView.createViewSync(this.request || null));
        this.tabbedPane.changeTabView('response', SourceFrame.JSONView.JSONView.createViewSync(this.response || null));
        if (this.selectedTab) {
            this.tabbedPane.selectTab(this.selectedTab);
        }
    }
}
export function parseCommandInput(input) {
    // If input cannot be parsed as json, we assume it's the command name
    // for a command without parameters. Otherwise, we expect an object
    // with "command"/"method"/"cmd" and "parameters"/"params"/"args"/"arguments" attributes.
    let json = null;
    try {
        json = JSON.parse(input);
    }
    catch {
    }
    const command = json ? json.command || json.method || json.cmd || '' : input;
    const parameters = json?.parameters || json?.params || json?.args || json?.arguments || {};
    return { command, parameters };
}
function targetToString(target) {
    if (!target) {
        return '';
    }
    return target.decorateLabel(`${target.name()} ${target === SDK.TargetManager.TargetManager.instance().rootTarget() ? '' : target.id()}`);
}
//# sourceMappingURL=ProtocolMonitor.js.map