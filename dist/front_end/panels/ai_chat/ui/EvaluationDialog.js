// Copyright 2025 The Chromium Authors. All rights reserved.
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
var _EvaluationDialog_instances, _EvaluationDialog_state, _EvaluationDialog_evaluationRunner, _EvaluationDialog_agentEvaluationRunner, _EvaluationDialog_dialog, _EvaluationDialog_initializeJudgeModel, _EvaluationDialog_addStyles, _EvaluationDialog_render, _EvaluationDialog_renderHeader, _EvaluationDialog_renderJudgeModelSelector, _EvaluationDialog_renderContent, _EvaluationDialog_renderTabs, _EvaluationDialog_renderToolSelector, _EvaluationDialog_renderAgentSelector, _EvaluationDialog_renderSelectionControls, _EvaluationDialog_renderTestList, _EvaluationDialog_renderTestItem, _EvaluationDialog_renderBottomPanel, _EvaluationDialog_renderSummaryContent, _EvaluationDialog_renderLogsContent, _EvaluationDialog_renderButtons, _EvaluationDialog_clearResults, _EvaluationDialog_addLog, _EvaluationDialog_runSingleTest, _EvaluationDialog_runAllTests, _EvaluationDialog_viewDetailedReport, _EvaluationDialog_runSelectedTests, _EvaluationDialog_runTestBatch;
import * as i18n from '../../../core/i18n/i18n.js';
import * as UI from '../../../ui/legacy/legacy.js';
import { EvaluationRunner } from '../evaluation/runner/EvaluationRunner.js';
import { VisionAgentEvaluationRunner } from '../evaluation/runner/VisionAgentEvaluationRunner.js';
import { MarkdownReportGenerator } from '../evaluation/framework/MarkdownReportGenerator.js';
import { MarkdownViewerUtil } from '../common/MarkdownViewerUtil.js';
import { schemaExtractorTests } from '../evaluation/test-cases/schema-extractor-tests.js';
import { streamlinedSchemaExtractorTests } from '../evaluation/test-cases/streamlined-schema-extractor-tests.js';
import { researchAgentTests } from '../evaluation/test-cases/research-agent-tests.js';
import { actionAgentTests } from '../evaluation/test-cases/action-agent-tests.js';
import { webTaskAgentTests } from '../evaluation/test-cases/web-task-agent-tests.js';
import { createLogger } from '../core/Logger.js';
import { AIChatPanel } from './AIChatPanel.js';
const logger = createLogger('EvaluationDialog');
// Judge model storage key
const JUDGE_MODEL_STORAGE_KEY = 'ai_chat_judge_model';
// Tool test mapping for extensibility - add new tools here
const TOOL_TEST_MAPPING = {
    'extract_schema': {
        tests: schemaExtractorTests,
        displayName: 'Original Schema Extractor'
    },
    'extract_schema_streamlined': {
        tests: streamlinedSchemaExtractorTests,
        displayName: 'Streamlined Schema Extractor'
    },
    // Future tools can be added here:
    // 'html_to_markdown': { tests: htmlToMarkdownTests, displayName: 'HTML to Markdown' },
    // 'fetcher_tool': { tests: fetcherToolTests, displayName: 'Fetcher Tool' },
};
// Agent test mapping for extensibility - add new agents here
const AGENT_TEST_MAPPING = {
    'research_agent': {
        tests: researchAgentTests,
        displayName: 'Research Agent'
    },
    'action_agent': {
        tests: actionAgentTests,
        displayName: 'Action Agent'
    },
    'web_task_agent': {
        tests: webTaskAgentTests,
        displayName: 'Web Task Agent'
    },
    // Future agents can be added here:
    // 'vision_agent': { tests: visionAgentTests, displayName: 'Vision Agent' },
    // 'code_agent': { tests: codeAgentTests, displayName: 'Code Agent' },
};
const UIStrings = {
    /**
     * @description Title of the evaluation dialog
     */
    evaluationTests: 'Evaluation Tests',
    /**
     * @description Button to run a single test
     */
    runTest: 'Run Test',
    /**
     * @description Button to run all tests
     */
    runAllTests: 'Run All Tests',
    /**
     * @description Test status: passed
     */
    testPassed: 'PASSED',
    /**
     * @description Test status: failed
     */
    testFailed: 'FAILED',
    /**
     * @description Test status: error
     */
    testError: 'ERROR',
    /**
     * @description Test status: running
     */
    testRunning: 'RUNNING',
    /**
     * @description No tests have been run yet
     */
    noTestResults: 'No tests have been run yet',
    /**
     * @description Close dialog button
     */
    close: 'Close',
    /**
     * @description Progress indicator
     */
    progress: 'Progress',
    /**
     * @description Test results summary
     */
    summary: 'Test Summary',
    /**
     * @description Clear results button
     */
    clearResults: 'Clear Results',
    /**
     * @description Tab for tool tests
     */
    toolTests: 'Tool Tests',
    /**
     * @description Tab for agent tests
     */
    agentTests: 'Agent Tests',
    /**
     * @description View detailed report button
     */
    viewDetailedReport: 'View Detailed Report',
    /**
     * @description Enable vision verification checkbox
     */
    enableVisionVerification: 'Enable Vision Verification',
    /**
     * @description Vision verification tooltip
     */
    visionVerificationTooltip: 'Uses GPT-4 Vision to analyze screenshots for visual confirmation of actions',
    /**
     * @description Test logs header
     */
    testLogs: 'Test Logs',
    /**
     * @description Judge model selector label
     */
    judgeModel: 'Judge Model:',
    /**
     * @description Judge model tooltip
     */
    judgeModelTooltip: 'LLM model used to evaluate test results and provide scoring',
};
const str_ = i18n.i18n.registerUIStrings('panels/ai_chat/ui/EvaluationDialog.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class EvaluationDialog {
    static show() {
        new EvaluationDialog();
    }
    constructor() {
        _EvaluationDialog_instances.add(this);
        _EvaluationDialog_state.set(this, {
            isRunning: false,
            testResults: new Map(),
            totalTests: 0,
            completedTests: 0,
            activeTab: 'tool-tests',
            agentType: 'research_agent',
            visionEnabled: false,
            selectedTests: new Set(),
            bottomPanelView: 'summary',
            testLogs: [],
            toolType: 'extract_schema',
            judgeModel: 'gpt-4.1-mini', // Will be updated by initializeJudgeModel()
        });
        _EvaluationDialog_evaluationRunner.set(this, void 0);
        _EvaluationDialog_agentEvaluationRunner.set(this, void 0);
        _EvaluationDialog_dialog.set(this, void 0);
        __classPrivateFieldSet(this, _EvaluationDialog_dialog, new UI.Dialog.Dialog(), "f");
        __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").setDimmed(true);
        __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").setOutsideClickCallback(() => __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").hide());
        __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.classList.add('evaluation-dialog');
        __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.style.width = '800px';
        __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.style.height = '600px';
        __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.style.padding = '0';
        __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.style.display = 'flex';
        __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.style.flexDirection = 'column';
        // Initialize judge model based on current provider
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_initializeJudgeModel).call(this);
        // Initialize evaluation runners
        try {
            __classPrivateFieldSet(this, _EvaluationDialog_evaluationRunner, new EvaluationRunner(__classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel), "f");
        }
        catch (error) {
            logger.error('Failed to initialize evaluation runner:', error);
        }
        try {
            __classPrivateFieldSet(this, _EvaluationDialog_agentEvaluationRunner, new VisionAgentEvaluationRunner(__classPrivateFieldGet(this, _EvaluationDialog_state, "f").visionEnabled, __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel), "f");
        }
        catch (error) {
            logger.error('Failed to initialize agent evaluation runner:', error);
        }
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_addStyles).call(this);
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
        __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").show();
    }
}
_EvaluationDialog_state = new WeakMap(), _EvaluationDialog_evaluationRunner = new WeakMap(), _EvaluationDialog_agentEvaluationRunner = new WeakMap(), _EvaluationDialog_dialog = new WeakMap(), _EvaluationDialog_instances = new WeakSet(), _EvaluationDialog_initializeJudgeModel = function _EvaluationDialog_initializeJudgeModel() {
    const currentProvider = AIChatPanel.getCurrentProvider();
    // Get models available for the current provider
    const providerModels = AIChatPanel.getModelOptions(currentProvider);
    // First, try to load saved judge model
    const savedJudgeModel = localStorage.getItem(JUDGE_MODEL_STORAGE_KEY);
    if (savedJudgeModel && providerModels.find(m => m.value === savedJudgeModel)) {
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel = savedJudgeModel;
        logger.info(`Using saved judge model: ${savedJudgeModel} for provider: ${currentProvider}`);
        return;
    }
    // If no saved model or saved model not available for current provider, use smart selection
    // Regex patterns for finding suitable judge models (in order of preference)
    const modelPatterns = [
        // Exact gpt-4.1-mini match with optional provider prefix and suffix
        { pattern: /^(.*\/)?gpt-4\.1-mini(-.*)?$/i, name: 'gpt-4.1-mini variant' },
        // Any gpt-4.1 model
        { pattern: /^(.*\/)?gpt-4\.1(-.*)?$/i, name: 'gpt-4.1 variant' },
        // Any gpt-4 model
        { pattern: /^(.*\/)?gpt-4(-.*)?$/i, name: 'gpt-4 variant' }
    ];
    let selectedModel = null;
    let matchReason = '';
    // Try each pattern in order of preference
    for (const { pattern, name } of modelPatterns) {
        const foundModel = providerModels.find(model => pattern.test(model.value));
        if (foundModel) {
            selectedModel = foundModel;
            matchReason = `Found ${name}: ${foundModel.value}`;
            break;
        }
    }
    if (selectedModel) {
        // Use the matched model
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel = selectedModel.value;
        logger.info(`${matchReason} for provider: ${currentProvider}`);
    }
    else if (providerModels.length > 0) {
        // Fall back to the first available model for this provider
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel = providerModels[0].value;
        logger.info(`No preferred judge model pattern found, using first available: ${__classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel} for provider: ${currentProvider}`);
    }
    else {
        // Ultimate fallback if no models are available (shouldn't happen)
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel = 'gpt-4.1-mini';
        logger.warn(`No models found for provider ${currentProvider}, using fallback: gpt-4.1-mini`);
    }
    // Save the initially selected model
    localStorage.setItem(JUDGE_MODEL_STORAGE_KEY, __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel);
}, _EvaluationDialog_addStyles = function _EvaluationDialog_addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .evaluation-dialog {
        font-family: var(--default-font-family);
        background: var(--sys-color-cdt-base-container);
        color: var(--sys-color-on-surface);
      }
      
      .eval-header {
        background: var(--sys-color-surface-variant);
        padding: 20px;
        border-bottom: 1px solid var(--sys-color-divider);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .eval-title {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        color: var(--sys-color-on-surface);
      }
      
      .eval-status {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 12px;
        color: var(--sys-color-on-surface-variant);
      }
      
      .eval-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 20px;
        overflow: hidden;
        min-height: 0;
      }
      
      .eval-tests-panel {
        flex: 0 0 60%;
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;
      }
      
      .eval-bottom-panel {
        flex: 0 0 40%;
        display: flex;
        flex-direction: column;
        background: var(--sys-color-surface);
        border-radius: 8px;
        border: 1px solid var(--sys-color-divider);
        overflow: hidden;
      }
      
      .eval-bottom-tabs {
        display: flex;
        background: var(--sys-color-surface-variant);
        border-bottom: 1px solid var(--sys-color-divider);
      }
      
      .eval-bottom-tab {
        padding: 8px 16px;
        background: transparent;
        border: none;
        color: var(--sys-color-on-surface-variant);
        cursor: pointer;
        font-size: 13px;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
      }
      
      .eval-bottom-tab:hover {
        background: var(--sys-color-state-hover-on-subtle);
      }
      
      .eval-bottom-tab.active {
        color: var(--sys-color-primary);
        border-bottom-color: var(--sys-color-primary);
        font-weight: 500;
      }
      
      .eval-bottom-content {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        min-height: 0;
      }
      
      .eval-logs-container {
        font-family: var(--monospace-font-family);
        font-size: 12px;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-word;
        color: var(--sys-color-on-surface-variant);
      }
      
      .eval-log-entry {
        margin-bottom: 4px;
        padding: 2px 0;
      }
      
      .eval-log-entry.info {
        color: var(--sys-color-on-surface);
      }
      
      .eval-log-entry.success {
        color: var(--sys-color-green);
      }
      
      .eval-log-entry.warning {
        color: var(--sys-color-yellow);
      }
      
      .eval-log-entry.error {
        color: var(--sys-color-error);
      }
      
      .eval-progress-bar {
        width: 100%;
        height: 4px;
        background: var(--sys-color-surface-variant);
        border-radius: 2px;
        overflow: hidden;
        margin: 8px 0;
      }
      
      .eval-progress-fill {
        height: 100%;
        background: var(--sys-color-primary);
        transition: width 0.3s ease;
        border-radius: 2px;
      }
      
      .eval-test-list {
        border: 1px solid var(--sys-color-divider);
        border-radius: 8px;
        overflow-y: auto;
        overflow-x: hidden;
        flex: 1;
        min-height: 0;
      }
      
      .eval-test-list::-webkit-scrollbar {
        width: 8px;
      }
      
      .eval-test-list::-webkit-scrollbar-track {
        background: var(--sys-color-surface-variant);
        border-radius: 4px;
      }
      
      .eval-test-list::-webkit-scrollbar-thumb {
        background: var(--sys-color-outline);
        border-radius: 4px;
      }
      
      .eval-test-list::-webkit-scrollbar-thumb:hover {
        background: var(--sys-color-on-surface-variant);
      }
      
      .eval-test-item {
        padding: 16px;
        border-bottom: 1px solid var(--sys-color-divider);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        transition: background-color 0.2s ease;
        min-height: 80px;
      }
      
      .eval-test-item:hover {
        background: var(--sys-color-state-hover-on-subtle);
        cursor: pointer;
      }
      
      .eval-test-item.selected {
        background: var(--sys-color-tonal-container);
        border-left: 3px solid var(--sys-color-primary);
        padding-left: 13px;
      }
      
      .eval-test-item.selected:hover {
        background: var(--sys-color-state-hover-on-prominent);
      }
      
      .eval-test-item.running {
        background: var(--sys-color-surface-yellow);
        animation: pulse 2s infinite;
      }
      
      .eval-test-item.passed {
        background: var(--sys-color-surface-green);
      }
      
      .eval-test-item.failed {
        background: var(--sys-color-surface-yellow);
      }
      
      .eval-test-item.error {
        background: var(--sys-color-surface-error);
      }
      
      .eval-test-item.selected.passed {
        background: var(--sys-color-surface-green);
        border-left-color: var(--sys-color-primary);
      }
      
      .eval-test-item.selected.failed {
        background: var(--sys-color-surface-yellow);
        border-left-color: var(--sys-color-primary);
      }
      
      .eval-test-item.selected.error {
        background: var(--sys-color-surface-error);
        border-left-color: var(--sys-color-primary);
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      .eval-test-info {
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }
      
      .eval-test-name {
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 4px;
        color: var(--sys-color-on-surface);
      }
      
      .eval-test-url {
        font-size: 12px;
        color: var(--sys-color-on-surface-variant);
        font-family: var(--monospace-font-family);
        margin-bottom: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
      
      .eval-test-details {
        font-size: 12px;
        color: var(--sys-color-on-surface-variant);
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      
      .eval-test-status {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        font-size: 12px;
        min-width: 90px;
        max-width: 120px;
        justify-content: flex-end;
        flex-shrink: 0;
      }
      
      .eval-status-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
      }
      
      .eval-status-icon.running {
        background: var(--sys-color-primary);
        color: var(--sys-color-on-primary);
        animation: spin 1s linear infinite;
      }
      
      .eval-status-icon.passed {
        background: var(--sys-color-green);
        color: white;
      }
      
      .eval-status-icon.failed {
        background: var(--sys-color-yellow);
        color: white;
      }
      
      .eval-status-icon.error {
        background: var(--sys-color-error);
        color: white;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .eval-summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 13px;
      }
      
      .eval-summary-label {
        color: var(--sys-color-on-surface-variant);
      }
      
      .eval-summary-value {
        font-weight: 500;
        color: var(--sys-color-on-surface);
      }
      
      .eval-buttons {
        padding: 20px;
        border-top: 1px solid var(--sys-color-divider);
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        background: var(--sys-color-surface-variant);
      }
      
      .eval-button {
        padding: 8px 16px;
        border: 1px solid var(--sys-color-outline);
        border-radius: 4px;
        background: var(--sys-color-surface);
        color: var(--sys-color-on-surface);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .eval-button:hover:not(:disabled) {
        background: var(--sys-color-state-hover-on-subtle);
      }
      
      .eval-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .eval-button.primary {
        background: var(--sys-color-primary);
        color: var(--sys-color-on-primary);
        border-color: var(--sys-color-primary);
      }
      
      .eval-button.primary:hover:not(:disabled) {
        background: var(--sys-color-primary-bright);
      }
      
      .eval-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: var(--sys-color-on-surface-variant);
        font-size: 14px;
      }
      
      .eval-empty-icon {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      
      .eval-tabs {
        display: flex;
        border-bottom: 1px solid var(--sys-color-divider);
        margin-bottom: 16px;
      }
      
      .eval-tab {
        padding: 8px 16px;
        background: transparent;
        border: none;
        color: var(--sys-color-on-surface-variant);
        cursor: pointer;
        font-size: 13px;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
      }
      
      .eval-tab:hover {
        background: var(--sys-color-state-hover-on-subtle);
      }
      
      .eval-tab.active {
        color: var(--sys-color-primary);
        border-bottom-color: var(--sys-color-primary);
        font-weight: 500;
      }
      
      .eval-tag.agent {
        background: #6f42c1 !important;
      }
      
      .eval-tag.research {
        background: #17a2b8 !important;
      }
      
      .eval-tag.basic {
        background: #28a745 !important;
      }
      
      .eval-tag.technical {
        background: #dc3545 !important;
      }
      
      .eval-tag.current-events {
        background: #fd7e14 !important;
      }
      
      .eval-tag.comparison {
        background: #6610f2 !important;
      }
    `;
    __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.appendChild(styleElement);
}, _EvaluationDialog_render = function _EvaluationDialog_render() {
    // Preserve scroll position of test list
    const existingTestList = __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.querySelector('.eval-test-list');
    const scrollTop = existingTestList ? existingTestList.scrollTop : 0;
    // Clear content but keep styles
    const existingStyle = __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.querySelector('style');
    __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.innerHTML = '';
    if (existingStyle) {
        __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.appendChild(existingStyle);
    }
    // Header
    const header = __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderHeader).call(this);
    __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.appendChild(header);
    // Content area
    const content = __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderContent).call(this);
    __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.appendChild(content);
    // Button area
    const buttons = __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderButtons).call(this);
    __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.appendChild(buttons);
    // Restore scroll position
    const newTestList = __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").contentElement.querySelector('.eval-test-list');
    if (newTestList && scrollTop > 0) {
        // Use requestAnimationFrame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
            newTestList.scrollTop = scrollTop;
        });
    }
}, _EvaluationDialog_renderHeader = function _EvaluationDialog_renderHeader() {
    const header = document.createElement('div');
    header.className = 'eval-header';
    const leftSection = document.createElement('div');
    leftSection.style.cssText = 'display: flex; align-items: center; gap: 20px;';
    const title = document.createElement('h2');
    title.className = 'eval-title';
    title.textContent = i18nString(UIStrings.evaluationTests);
    // Judge model selector
    const judgeModelContainer = __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderJudgeModelSelector).call(this);
    leftSection.appendChild(title);
    leftSection.appendChild(judgeModelContainer);
    const status = document.createElement('div');
    status.className = 'eval-status';
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning) {
        const progressText = document.createElement('span');
        progressText.textContent = `${__classPrivateFieldGet(this, _EvaluationDialog_state, "f").completedTests}/${__classPrivateFieldGet(this, _EvaluationDialog_state, "f").totalTests} tests completed`;
        status.appendChild(progressText);
        const progressBar = document.createElement('div');
        progressBar.className = 'eval-progress-bar';
        progressBar.style.width = '120px';
        const progressFill = document.createElement('div');
        progressFill.className = 'eval-progress-fill';
        const progress = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").totalTests > 0 ? (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").completedTests / __classPrivateFieldGet(this, _EvaluationDialog_state, "f").totalTests) * 100 : 0;
        progressFill.style.width = `${progress}%`;
        progressBar.appendChild(progressFill);
        status.appendChild(progressBar);
        if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").startTime) {
            const elapsed = Math.round((Date.now() - __classPrivateFieldGet(this, _EvaluationDialog_state, "f").startTime) / 1000);
            const elapsedText = document.createElement('span');
            elapsedText.textContent = `${elapsed}s elapsed`;
            status.appendChild(elapsedText);
        }
    }
    else if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.size > 0) {
        const results = Array.from(__classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.values());
        const passed = results.filter(r => r.status === 'passed').length;
        const failed = results.filter(r => r.status === 'failed').length;
        const errors = results.filter(r => r.status === 'error').length;
        status.innerHTML = `
        <span style="color: var(--sys-color-green);">✓ ${passed}</span>
        <span style="color: var(--sys-color-yellow);">⚠ ${failed}</span>
        <span style="color: var(--sys-color-error);">✗ ${errors}</span>
      `;
    }
    header.appendChild(leftSection);
    header.appendChild(status);
    return header;
}, _EvaluationDialog_renderJudgeModelSelector = function _EvaluationDialog_renderJudgeModelSelector() {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; align-items: center; gap: 8px;';
    const label = document.createElement('label');
    label.textContent = i18nString(UIStrings.judgeModel);
    label.title = i18nString(UIStrings.judgeModelTooltip);
    label.style.cssText = 'font-size: 13px; color: var(--sys-color-on-surface-variant); font-weight: normal;';
    const select = document.createElement('select');
    select.style.cssText = `
      padding: 4px 8px;
      border: 1px solid var(--sys-color-outline);
      border-radius: 4px;
      background: var(--sys-color-surface);
      color: var(--sys-color-on-surface);
      font-size: 12px;
      cursor: pointer;
      min-width: 120px;
    `;
    // Get the currently selected provider using the AIChatPanel method
    const currentProvider = AIChatPanel.getCurrentProvider();
    const currentModel = AIChatPanel.instance().getSelectedModel();
    // Get all model options but only show models from the same provider as the selected provider
    const modelOptions = AIChatPanel.getModelOptions();
    // Filter models to only show those from the selected provider
    const filteredModels = modelOptions.filter(option => {
        if (option.value.startsWith('_placeholder')) {
            return false; // Skip placeholder options
        }
        // Use the model's type to determine if it belongs to the selected provider
        return option.type === currentProvider;
    });
    // If no models from current provider, use current model as fallback
    if (filteredModels.length === 0) {
        const fallbackOption = document.createElement('option');
        fallbackOption.value = currentModel;
        fallbackOption.textContent = `${currentModel} (${currentProvider})`;
        fallbackOption.selected = true;
        select.appendChild(fallbackOption);
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel = currentModel;
    }
    else {
        // Add filtered models to dropdown
        filteredModels.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = `${option.label} (${currentProvider})`;
            if (option.value === __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel) {
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });
        // If current judge model is not in filtered list, select first available
        if (!filteredModels.find(m => m.value === __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel)) {
            __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel = filteredModels[0].value;
            // Set the selected attribute on the appropriate option
            const optionToSelect = select.querySelector(`option[value="${__classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel}"]`);
            if (optionToSelect) {
                optionToSelect.selected = true;
            }
            select.value = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel;
        }
    }
    // Ensure the selection is properly synchronized
    select.value = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel;
    // Handle judge model change
    select.addEventListener('change', () => {
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel = select.value;
        // Reinitialize evaluation runners with new model
        try {
            __classPrivateFieldSet(this, _EvaluationDialog_evaluationRunner, new EvaluationRunner(__classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel), "f");
        }
        catch (error) {
            logger.error('Failed to reinitialize evaluation runner:', error);
        }
        try {
            __classPrivateFieldSet(this, _EvaluationDialog_agentEvaluationRunner, new VisionAgentEvaluationRunner(__classPrivateFieldGet(this, _EvaluationDialog_state, "f").visionEnabled, __classPrivateFieldGet(this, _EvaluationDialog_state, "f").judgeModel), "f");
        }
        catch (error) {
            logger.error('Failed to reinitialize agent evaluation runner:', error);
        }
        // Save the user's selection to localStorage
        localStorage.setItem(JUDGE_MODEL_STORAGE_KEY, select.value);
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_addLog).call(this, `Changed judge model to: ${select.value}`);
    });
    container.appendChild(label);
    container.appendChild(select);
    return container;
}, _EvaluationDialog_renderContent = function _EvaluationDialog_renderContent() {
    const content = document.createElement('div');
    content.className = 'eval-content';
    // Tests panel
    const testsPanel = document.createElement('div');
    testsPanel.className = 'eval-tests-panel';
    // Add tabs
    const tabs = __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderTabs).call(this);
    testsPanel.appendChild(tabs);
    // Add agent type selector if on agents tab
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'agents') {
        const agentSelector = __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderAgentSelector).call(this);
        testsPanel.appendChild(agentSelector);
    }
    // Add tool selector if on tool-tests tab
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'tool-tests') {
        const toolSelector = __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderToolSelector).call(this);
        testsPanel.appendChild(toolSelector);
    }
    // Add selection controls
    const selectionControls = __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderSelectionControls).call(this);
    testsPanel.appendChild(selectionControls);
    const testList = __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderTestList).call(this);
    testsPanel.appendChild(testList);
    // Bottom panel (40% height) - contains tabs for summary/logs
    const bottomPanel = __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderBottomPanel).call(this);
    content.appendChild(testsPanel);
    content.appendChild(bottomPanel);
    return content;
}, _EvaluationDialog_renderTabs = function _EvaluationDialog_renderTabs() {
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'eval-tabs';
    // Tool Tests tab
    const toolTab = document.createElement('button');
    toolTab.className = 'eval-tab';
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'tool-tests') {
        toolTab.classList.add('active');
    }
    toolTab.textContent = i18nString(UIStrings.toolTests);
    toolTab.addEventListener('click', () => {
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab = 'tool-tests';
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.clear(); // Clear results when switching tabs
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.clear(); // Clear selections when switching tabs
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
    });
    // Agent Tests tab
    const agentTab = document.createElement('button');
    agentTab.className = 'eval-tab';
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'agents') {
        agentTab.classList.add('active');
    }
    agentTab.textContent = i18nString(UIStrings.agentTests);
    agentTab.addEventListener('click', () => {
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab = 'agents';
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.clear(); // Clear results when switching tabs
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.clear(); // Clear selections when switching tabs
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
    });
    tabsContainer.appendChild(toolTab);
    tabsContainer.appendChild(agentTab);
    return tabsContainer;
}, _EvaluationDialog_renderToolSelector = function _EvaluationDialog_renderToolSelector() {
    const selectorContainer = document.createElement('div');
    selectorContainer.style.cssText = 'padding: 8px 0; display: flex; align-items: center; gap: 12px;';
    const label = document.createElement('label');
    label.textContent = 'Tool:';
    label.style.cssText = 'font-size: 13px; color: var(--sys-color-on-surface-variant);';
    const select = document.createElement('select');
    select.style.cssText = `
      padding: 4px 8px;
      border: 1px solid var(--sys-color-outline);
      border-radius: 4px;
      background: var(--sys-color-surface);
      color: var(--sys-color-on-surface);
      font-size: 13px;
      cursor: pointer;
    `;
    // Add options dynamically from tool mapping
    Object.entries(TOOL_TEST_MAPPING).forEach(([toolType, toolInfo]) => {
        const option = document.createElement('option');
        option.value = toolType;
        option.textContent = toolInfo.displayName;
        option.selected = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").toolType === toolType;
        select.appendChild(option);
    });
    // Handle selection change
    select.addEventListener('change', () => {
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").toolType = select.value;
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.clear(); // Clear results when switching tools
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.clear(); // Clear selections when switching tools
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
    });
    selectorContainer.appendChild(label);
    selectorContainer.appendChild(select);
    return selectorContainer;
}, _EvaluationDialog_renderAgentSelector = function _EvaluationDialog_renderAgentSelector() {
    const selectorContainer = document.createElement('div');
    selectorContainer.style.cssText = 'padding: 8px 0; display: flex; align-items: center; gap: 12px;';
    const label = document.createElement('label');
    label.textContent = 'Agent Type:';
    label.style.cssText = 'font-size: 13px; color: var(--sys-color-on-surface-variant);';
    const select = document.createElement('select');
    select.style.cssText = `
      padding: 4px 8px;
      border: 1px solid var(--sys-color-outline);
      border-radius: 4px;
      background: var(--sys-color-surface);
      color: var(--sys-color-on-surface);
      font-size: 13px;
      cursor: pointer;
    `;
    // Add options dynamically from agent mapping
    Object.entries(AGENT_TEST_MAPPING).forEach(([agentType, agentInfo]) => {
        const option = document.createElement('option');
        option.value = agentType;
        option.textContent = agentInfo.displayName;
        option.selected = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").agentType === agentType;
        select.appendChild(option);
    });
    // Handle selection change
    select.addEventListener('change', () => {
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").agentType = select.value;
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.clear(); // Clear results when switching agent types
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.clear(); // Clear selections when switching agent types
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
    });
    selectorContainer.appendChild(label);
    selectorContainer.appendChild(select);
    // Add vision verification checkbox (only for action agent)
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").agentType === 'action_agent') {
        const visionContainer = document.createElement('div');
        visionContainer.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-left: 16px;';
        const visionCheckbox = document.createElement('input');
        visionCheckbox.type = 'checkbox';
        visionCheckbox.id = 'vision-verification';
        visionCheckbox.checked = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").visionEnabled || false;
        visionCheckbox.style.cssText = 'cursor: pointer;';
        const visionLabel = document.createElement('label');
        visionLabel.htmlFor = 'vision-verification';
        visionLabel.textContent = i18nString(UIStrings.enableVisionVerification);
        visionLabel.style.cssText = 'font-size: 13px; color: var(--sys-color-on-surface-variant); cursor: pointer;';
        visionLabel.title = i18nString(UIStrings.visionVerificationTooltip);
        visionCheckbox.addEventListener('change', () => {
            __classPrivateFieldGet(this, _EvaluationDialog_state, "f").visionEnabled = visionCheckbox.checked;
            logger.info(`Vision verification ${__classPrivateFieldGet(this, _EvaluationDialog_state, "f").visionEnabled ? 'enabled' : 'disabled'}`);
            // Update the runner's vision mode
            if (__classPrivateFieldGet(this, _EvaluationDialog_agentEvaluationRunner, "f")) {
                __classPrivateFieldGet(this, _EvaluationDialog_agentEvaluationRunner, "f").setVisionEnabled(__classPrivateFieldGet(this, _EvaluationDialog_state, "f").visionEnabled);
            }
        });
        visionContainer.appendChild(visionCheckbox);
        visionContainer.appendChild(visionLabel);
        selectorContainer.appendChild(visionContainer);
    }
    return selectorContainer;
}, _EvaluationDialog_renderSelectionControls = function _EvaluationDialog_renderSelectionControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.style.cssText = 'padding: 8px 0; display: flex; align-items: center; justify-content: space-between; gap: 12px;';
    // Left side - selection info
    const leftSide = document.createElement('div');
    leftSide.style.cssText = 'display: flex; align-items: center; gap: 12px;';
    const selectionInfo = document.createElement('span');
    selectionInfo.style.cssText = 'font-size: 13px; color: var(--sys-color-on-surface-variant);';
    const selectedCount = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.size;
    if (selectedCount > 0) {
        selectionInfo.textContent = `${selectedCount} tests selected`;
    }
    else {
        selectionInfo.textContent = 'Click tests to select them';
    }
    leftSide.appendChild(selectionInfo);
    // Right side - action buttons
    const rightSide = document.createElement('div');
    rightSide.style.cssText = 'display: flex; align-items: center; gap: 8px;';
    if (selectedCount > 0) {
        // Clear selection button
        const clearButton = document.createElement('button');
        clearButton.className = 'eval-button';
        clearButton.textContent = 'Clear Selection';
        clearButton.style.cssText = 'padding: 4px 12px; font-size: 12px;';
        clearButton.disabled = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning;
        clearButton.addEventListener('click', () => {
            __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.clear();
            __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
        });
        rightSide.appendChild(clearButton);
        // Run selected button
        const runSelectedButton = document.createElement('button');
        runSelectedButton.className = 'eval-button primary';
        runSelectedButton.textContent = `Run Selected (${selectedCount})`;
        runSelectedButton.style.cssText = 'padding: 4px 12px; font-size: 12px;';
        runSelectedButton.disabled = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning;
        runSelectedButton.addEventListener('click', () => __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_runSelectedTests).call(this));
        rightSide.appendChild(runSelectedButton);
    }
    controlsContainer.appendChild(leftSide);
    controlsContainer.appendChild(rightSide);
    return controlsContainer;
}, _EvaluationDialog_renderTestList = function _EvaluationDialog_renderTestList() {
    const container = document.createElement('div');
    container.className = 'eval-test-list';
    // Get tests based on active tab using unified mapping approach
    let testCases;
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'tool-tests') {
        // Use tool type to get tests from tool mapping
        const toolMapping = TOOL_TEST_MAPPING[__classPrivateFieldGet(this, _EvaluationDialog_state, "f").toolType];
        testCases = toolMapping ? toolMapping.tests : [];
    }
    else {
        // Use agent type to get tests from agent mapping
        const agentMapping = AGENT_TEST_MAPPING[__classPrivateFieldGet(this, _EvaluationDialog_state, "f").agentType];
        testCases = agentMapping ? agentMapping.tests : [];
    }
    if (testCases.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'eval-empty-state';
        emptyState.innerHTML = `
        <div class="eval-empty-icon">🧪</div>
        <div>No test cases available</div>
      `;
        container.appendChild(emptyState);
        return container;
    }
    // Render test items
    testCases.forEach((testCase) => {
        const testItem = __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderTestItem).call(this, testCase);
        container.appendChild(testItem);
    });
    return container;
}, _EvaluationDialog_renderTestItem = function _EvaluationDialog_renderTestItem(testCase) {
    const result = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.get(testCase.id);
    const isRunning = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").currentRunningTest === testCase.id;
    const isSelected = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.has(testCase.id);
    const item = document.createElement('div');
    item.className = 'eval-test-item';
    item.title = `${testCase.description}\nTags: ${testCase.metadata.tags.join(', ')}\n\nClick to select/deselect`;
    if (isSelected) {
        item.classList.add('selected');
    }
    if (isRunning) {
        item.classList.add('running');
    }
    else if (result) {
        item.classList.add(result.status);
    }
    // Handle click for selection
    item.addEventListener('click', () => {
        // Don't select if test is currently running
        if (isRunning || __classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning) {
            return;
        }
        // Toggle selection
        if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.has(testCase.id)) {
            __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.delete(testCase.id);
        }
        else {
            __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.add(testCase.id);
        }
        // Re-render to update UI
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
    });
    // Test info
    const info = document.createElement('div');
    info.className = 'eval-test-info';
    const name = document.createElement('div');
    name.className = 'eval-test-name';
    name.textContent = testCase.name;
    const url = document.createElement('div');
    url.className = 'eval-test-url';
    url.textContent = testCase.url;
    const details = document.createElement('div');
    details.className = 'eval-test-details';
    // Add tags
    const tagColors = {
        'search': '#4285f4',
        'ecommerce': '#f4b400',
        'wikipedia': '#000',
        'news': '#db4437',
        'travel': '#0f9d58',
        'products': '#673ab7',
        'fashion': '#e91e63',
        'google': '#4285f4',
        'bing': '#008373',
        'homedepot': '#f96302',
        'macys': '#ce0037',
        // Agent test tags
        'agent': '#6f42c1',
        'research': '#17a2b8',
        'basic': '#28a745',
        'technical': '#dc3545',
        'current-events': '#fd7e14',
        'comparison': '#6610f2',
        'business': '#20c997',
        'controversial': '#e83e8c',
        'multi-perspective': '#6c757d',
        'tool-orchestration': '#495057',
        'edge-case': '#ffc107',
        'stable': '#28a745',
        // Action agent specific tags
        'action': '#ff6b6b',
        'click': '#4ecdc4',
        'form-fill': '#45b7d1',
        'input': '#96ceb4',
        'navigation': '#daa520',
        'checkbox': '#ee5a24',
        'dropdown': '#5f27cd',
        'select': '#00d2d3',
        'multi-step': '#ff9ff3',
        'dynamic': '#54a0ff',
        'ajax': '#48dbfb',
        'loading': '#0abde3',
        'login': '#ee5a24',
        'authentication': '#ff6348',
        'multi-field': '#ff7979',
        'hover': '#686de0',
        'mouse': '#30336b',
        'reveal': '#130f40',
        'accessibility': '#22a6b3',
        'aria': '#f0932b',
        'a11y': '#eb4d4b',
        'error-handling': '#ff7979',
        'missing-element': '#535c68',
        'recovery': '#95afc0',
        'w3schools': '#4834d4',
    };
    const primaryTags = testCase.metadata.tags.slice(0, 2);
    primaryTags.forEach((tag) => {
        const tagSpan = document.createElement('span');
        tagSpan.textContent = tag;
        tagSpan.style.cssText = `
        background: ${tagColors[tag] || '#666'};
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        white-space: nowrap;
        flex-shrink: 0;
      `;
        details.appendChild(tagSpan);
    });
    if (result) {
        const duration = document.createElement('span');
        duration.textContent = `${result.duration}ms`;
        duration.style.cssText = 'white-space: nowrap; flex-shrink: 0;';
        details.appendChild(duration);
        // Add tool usage stats if available
        if (result.output?.toolUsageStats) {
            const toolStats = document.createElement('span');
            toolStats.textContent = `Tools: ${result.output.toolUsageStats.totalCalls}`;
            toolStats.style.cssText = 'white-space: nowrap; flex-shrink: 0; color: #6f42c1;';
            toolStats.title = `${result.output.toolUsageStats.uniqueTools} unique tools, ${result.output.toolUsageStats.iterations} iterations`;
            details.appendChild(toolStats);
        }
        if (result.validation?.llmJudge?.score !== undefined) {
            const score = document.createElement('span');
            score.textContent = `Score: ${result.validation.llmJudge.score}/100`;
            score.style.cssText = 'white-space: nowrap; flex-shrink: 0;';
            details.appendChild(score);
        }
        if (result.validation?.llmJudge?.confidence !== undefined) {
            const confidence = document.createElement('span');
            confidence.textContent = `Confidence: ${result.validation.llmJudge.confidence}%`;
            confidence.style.cssText = 'white-space: nowrap; flex-shrink: 0;';
            details.appendChild(confidence);
        }
    }
    info.appendChild(name);
    info.appendChild(url);
    info.appendChild(details);
    // Status
    const status = document.createElement('div');
    status.className = 'eval-test-status';
    const statusIcon = document.createElement('div');
    statusIcon.className = 'eval-status-icon';
    const statusText = document.createElement('span');
    statusText.style.cssText = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
    if (isRunning) {
        statusIcon.classList.add('running');
        statusIcon.textContent = '⟳';
        statusText.textContent = i18nString(UIStrings.testRunning);
    }
    else if (result) {
        switch (result.status) {
            case 'passed':
                statusIcon.classList.add('passed');
                statusIcon.textContent = '✓';
                statusText.textContent = i18nString(UIStrings.testPassed);
                break;
            case 'failed':
                statusIcon.classList.add('failed');
                statusIcon.textContent = '⚠';
                statusText.textContent = i18nString(UIStrings.testFailed);
                break;
            case 'error':
                statusIcon.classList.add('error');
                statusIcon.textContent = '✗';
                statusText.textContent = i18nString(UIStrings.testError);
                break;
        }
    }
    status.appendChild(statusIcon);
    status.appendChild(statusText);
    item.appendChild(info);
    item.appendChild(status);
    return item;
}, _EvaluationDialog_renderBottomPanel = function _EvaluationDialog_renderBottomPanel() {
    const panel = document.createElement('div');
    panel.className = 'eval-bottom-panel';
    // Tabs for switching between summary and logs
    const tabs = document.createElement('div');
    tabs.className = 'eval-bottom-tabs';
    const summaryTab = document.createElement('button');
    summaryTab.className = 'eval-bottom-tab';
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").bottomPanelView === 'summary') {
        summaryTab.classList.add('active');
    }
    summaryTab.textContent = i18nString(UIStrings.summary);
    summaryTab.addEventListener('click', () => {
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").bottomPanelView = 'summary';
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
    });
    const logsTab = document.createElement('button');
    logsTab.className = 'eval-bottom-tab';
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").bottomPanelView === 'logs') {
        logsTab.classList.add('active');
    }
    logsTab.textContent = i18nString(UIStrings.testLogs);
    logsTab.addEventListener('click', () => {
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").bottomPanelView = 'logs';
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
    });
    tabs.appendChild(summaryTab);
    tabs.appendChild(logsTab);
    panel.appendChild(tabs);
    // Content area
    const content = document.createElement('div');
    content.className = 'eval-bottom-content';
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").bottomPanelView === 'summary') {
        content.appendChild(__classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderSummaryContent).call(this));
    }
    else {
        content.appendChild(__classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_renderLogsContent).call(this));
    }
    panel.appendChild(content);
    return panel;
}, _EvaluationDialog_renderSummaryContent = function _EvaluationDialog_renderSummaryContent() {
    const container = document.createElement('div');
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.size === 0) {
        const emptyState = document.createElement('div');
        emptyState.textContent = i18nString(UIStrings.noTestResults);
        emptyState.style.cssText = 'color: var(--sys-color-on-surface-variant); font-style: italic; text-align: center; padding: 20px;';
        container.appendChild(emptyState);
        return container;
    }
    // Summary statistics
    const results = Array.from(__classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.values());
    const total = results.length;
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const errors = results.filter(r => r.status === 'error').length;
    const avgDuration = total > 0 ? Math.round(results.reduce((sum, r) => sum + r.duration, 0) / total) : 0;
    const withScores = results.filter(r => r.validation?.llmJudge?.score !== undefined);
    const avgScore = withScores.length > 0 ?
        Math.round(withScores.reduce((sum, r) => sum + (r.validation?.llmJudge?.score || 0), 0) / withScores.length) : 0;
    const summaryData = [
        ['Total Tests', total.toString()],
        ['Passed', `${passed} (${Math.round(passed / total * 100)}%)`],
        ['Failed', `${failed} (${Math.round(failed / total * 100)}%)`],
        ['Errors', `${errors} (${Math.round(errors / total * 100)}%)`],
        ['Avg Duration', `${avgDuration}ms`],
    ];
    if (avgScore > 0) {
        summaryData.push(['Avg LLM Score', `${avgScore}/100`]);
    }
    summaryData.forEach(([label, value]) => {
        const item = document.createElement('div');
        item.className = 'eval-summary-item';
        const labelEl = document.createElement('span');
        labelEl.className = 'eval-summary-label';
        labelEl.textContent = label + ':';
        const valueEl = document.createElement('span');
        valueEl.className = 'eval-summary-value';
        valueEl.textContent = value;
        item.appendChild(labelEl);
        item.appendChild(valueEl);
        container.appendChild(item);
    });
    return container;
}, _EvaluationDialog_renderLogsContent = function _EvaluationDialog_renderLogsContent() {
    const container = document.createElement('div');
    container.className = 'eval-logs-container';
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").testLogs.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.textContent = 'No logs yet. Run tests to see logs.';
        emptyState.style.cssText = 'color: var(--sys-color-on-surface-variant); font-style: italic; text-align: center; padding: 20px;';
        container.appendChild(emptyState);
        return container;
    }
    // Display logs in reverse order (newest first)
    const reversedLogs = [...__classPrivateFieldGet(this, _EvaluationDialog_state, "f").testLogs].reverse();
    reversedLogs.forEach(log => {
        const logEntry = document.createElement('div');
        logEntry.className = 'eval-log-entry';
        // Determine log type based on content
        if (log.includes('\u2705') || log.includes('PASSED')) {
            logEntry.classList.add('success');
        }
        else if (log.includes('\u26a0') || log.includes('WARNING') || log.includes('FAILED')) {
            logEntry.classList.add('warning');
        }
        else if (log.includes('\u274c') || log.includes('ERROR')) {
            logEntry.classList.add('error');
        }
        else if (log.includes('\ud83e\uddea') || log.includes('\ud83e\udd16') || log.includes('\ud83d\udcf8')) {
            logEntry.classList.add('info');
        }
        logEntry.textContent = log;
        container.appendChild(logEntry);
    });
    return container;
}, _EvaluationDialog_renderButtons = function _EvaluationDialog_renderButtons() {
    const buttons = document.createElement('div');
    buttons.className = 'eval-buttons';
    // Clear results button
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.size > 0 && !__classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning) {
        const clearButton = document.createElement('button');
        clearButton.className = 'eval-button';
        clearButton.textContent = i18nString(UIStrings.clearResults);
        clearButton.addEventListener('click', () => __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_clearResults).call(this));
        buttons.appendChild(clearButton);
        // View detailed report button
        const reportButton = document.createElement('button');
        reportButton.className = 'eval-button';
        reportButton.textContent = i18nString(UIStrings.viewDetailedReport);
        reportButton.addEventListener('click', () => __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_viewDetailedReport).call(this));
        buttons.appendChild(reportButton);
    }
    // Unified buttons for both tools and agents
    // Run first test button
    const runTestButton = document.createElement('button');
    runTestButton.className = 'eval-button primary';
    runTestButton.textContent = `${i18nString(UIStrings.runTest)} (First)`;
    runTestButton.disabled = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning;
    runTestButton.addEventListener('click', () => __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_runSingleTest).call(this));
    buttons.appendChild(runTestButton);
    // Run all tests button
    const runAllButton = document.createElement('button');
    runAllButton.className = 'eval-button primary';
    runAllButton.textContent = i18nString(UIStrings.runAllTests);
    runAllButton.disabled = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning;
    runAllButton.addEventListener('click', () => __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_runAllTests).call(this));
    buttons.appendChild(runAllButton);
    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'eval-button';
    closeButton.textContent = i18nString(UIStrings.close);
    closeButton.addEventListener('click', () => __classPrivateFieldGet(this, _EvaluationDialog_dialog, "f").hide());
    buttons.appendChild(closeButton);
    return buttons;
}, _EvaluationDialog_clearResults = function _EvaluationDialog_clearResults() {
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.clear();
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").completedTests = 0;
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").totalTests = 0;
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testLogs = [];
    __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
}, _EvaluationDialog_addLog = function _EvaluationDialog_addLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testLogs.push(`[${timestamp}] ${message}`);
    // Keep only last 1000 logs to prevent memory issues
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").testLogs.length > 1000) {
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testLogs = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testLogs.slice(-1000);
    }
    // Re-render if logs panel is visible
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").bottomPanelView === 'logs') {
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
    }
}, _EvaluationDialog_runSingleTest = async function _EvaluationDialog_runSingleTest() {
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning) {
        return;
    }
    // Get the first test from the current selection (tool or agent)
    let testMapping, displayName;
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'tool-tests') {
        testMapping = TOOL_TEST_MAPPING[__classPrivateFieldGet(this, _EvaluationDialog_state, "f").toolType];
        displayName = testMapping?.displayName || 'Tool';
    }
    else {
        testMapping = AGENT_TEST_MAPPING[__classPrivateFieldGet(this, _EvaluationDialog_state, "f").agentType];
        displayName = testMapping?.displayName || 'Agent';
    }
    if (!testMapping || testMapping.tests.length === 0) {
        logger.error('No tests available for selection:', __classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'tool-tests' ? __classPrivateFieldGet(this, _EvaluationDialog_state, "f").toolType : __classPrivateFieldGet(this, _EvaluationDialog_state, "f").agentType);
        return;
    }
    const testId = testMapping.tests[0].id; // First test
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning = true;
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").currentRunningTest = testId;
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").totalTests = 1;
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").completedTests = 0;
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").startTime = Date.now();
    __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
    try {
        const firstTest = testMapping.tests[0];
        const logMessage = `🧪 Running single ${displayName} test: ${testId}`;
        logger.info(logMessage);
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_addLog).call(this, logMessage);
        let result;
        if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'tool-tests' && __classPrivateFieldGet(this, _EvaluationDialog_evaluationRunner, "f")) {
            result = await __classPrivateFieldGet(this, _EvaluationDialog_evaluationRunner, "f").runSingleTest(firstTest);
        }
        else if (__classPrivateFieldGet(this, _EvaluationDialog_agentEvaluationRunner, "f")) {
            const agentName = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").agentType;
            result = await __classPrivateFieldGet(this, _EvaluationDialog_agentEvaluationRunner, "f").runSingleTest(firstTest, agentName);
        }
        else {
            throw new Error('No evaluation runner available');
        }
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.set(testId, result);
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").completedTests = 1;
        const successLog = `✅ Test completed: ${testId} - ${result.status.toUpperCase()}`;
        logger.info('✅ Test completed:', result);
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_addLog).call(this, successLog);
    }
    catch (error) {
        const errorLog = `❌ Test failed: ${testId} - ${error instanceof Error ? error.message : String(error)}`;
        logger.error('❌ Test failed:', error);
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_addLog).call(this, errorLog);
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.set(testId, {
            testId,
            status: 'error',
            error: error instanceof Error ? error.message : String(error),
            duration: 0,
            timestamp: Date.now(),
        });
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").completedTests = 1;
    }
    finally {
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning = false;
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").currentRunningTest = undefined;
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
    }
}, _EvaluationDialog_runAllTests = async function _EvaluationDialog_runAllTests() {
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning) {
        return;
    }
    // Get the current test cases based on active tab (tool or agent)
    let testMapping, displayName;
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'tool-tests') {
        testMapping = TOOL_TEST_MAPPING[__classPrivateFieldGet(this, _EvaluationDialog_state, "f").toolType];
        displayName = testMapping?.displayName || 'Tool';
    }
    else {
        testMapping = AGENT_TEST_MAPPING[__classPrivateFieldGet(this, _EvaluationDialog_state, "f").agentType];
        displayName = testMapping?.displayName || 'Agent';
    }
    if (!testMapping) {
        logger.error('No mapping found for:', __classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'tool-tests' ? __classPrivateFieldGet(this, _EvaluationDialog_state, "f").toolType : __classPrivateFieldGet(this, _EvaluationDialog_state, "f").agentType);
        return;
    }
    const currentTestCases = testMapping.tests;
    const logMessage = `🧪 Running all ${displayName} tests (${currentTestCases.length} tests)...`;
    // Clear results for all tests before running
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.clear();
    await __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_runTestBatch).call(this, currentTestCases, logMessage);
}, _EvaluationDialog_viewDetailedReport = function _EvaluationDialog_viewDetailedReport() {
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.size === 0) {
        return;
    }
    const results = Array.from(__classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.values());
    let testCases;
    let reportTitle;
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'tool-tests') {
        // Use tool type to get the right test array and title
        const toolMapping = TOOL_TEST_MAPPING[__classPrivateFieldGet(this, _EvaluationDialog_state, "f").toolType];
        if (toolMapping) {
            testCases = toolMapping.tests;
            reportTitle = `${toolMapping.displayName} Test Report`;
        }
        else {
            testCases = [];
            reportTitle = 'Tool Test Report';
        }
    }
    else {
        // Agent tests - use agent mapping
        const agentMapping = AGENT_TEST_MAPPING[__classPrivateFieldGet(this, _EvaluationDialog_state, "f").agentType];
        testCases = agentMapping ? agentMapping.tests : [];
        reportTitle = agentMapping ? `${agentMapping.displayName} Test Report` : 'Agent Test Report';
    }
    // Generate detailed markdown report
    const markdownReport = MarkdownReportGenerator.generateDetailedReport(results, testCases, {
        title: reportTitle,
        includeConversationDetails: __classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'agents',
        includeFailureDetails: true,
        includePerformanceMetrics: true
    });
    // Open in AI Assistant markdown viewer using the shared utility
    MarkdownViewerUtil.openInAIAssistantViewer(markdownReport);
}, _EvaluationDialog_runSelectedTests = 
/**
 * Run a single agent test using the unified runner
 */
async function _EvaluationDialog_runSelectedTests() {
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning || __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.size === 0) {
        return;
    }
    // Get the appropriate test cases and filter by selection
    let allTests;
    let selectedTests;
    if (__classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'tool-tests') {
        // Use tool type to get the right test array
        const toolMapping = TOOL_TEST_MAPPING[__classPrivateFieldGet(this, _EvaluationDialog_state, "f").toolType];
        allTests = toolMapping ? toolMapping.tests : [];
        selectedTests = allTests.filter((test) => __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.has(test.id));
    }
    else {
        // Agent tests - use agent mapping
        const agentMapping = AGENT_TEST_MAPPING[__classPrivateFieldGet(this, _EvaluationDialog_state, "f").agentType];
        allTests = agentMapping ? agentMapping.tests : [];
        selectedTests = allTests.filter((test) => __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.has(test.id));
    }
    const logMessage = `🎯 Running ${selectedTests.length} selected tests...`;
    await __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_runTestBatch).call(this, selectedTests, logMessage);
    // Clear selection after running
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").selectedTests.clear();
}, _EvaluationDialog_runTestBatch = 
/**
 * Shared method to run a batch of tests sequentially
 */
async function _EvaluationDialog_runTestBatch(testCases, logMessage) {
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning = true;
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").totalTests = testCases.length;
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").completedTests = 0;
    __classPrivateFieldGet(this, _EvaluationDialog_state, "f").startTime = Date.now();
    __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
    try {
        logger.info(logMessage);
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_addLog).call(this, logMessage);
        const agentName = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").agentType;
        const isToolTest = __classPrivateFieldGet(this, _EvaluationDialog_state, "f").activeTab === 'tool-tests';
        const delay = isToolTest ? 1000 : 3000;
        // Run tests sequentially
        for (const testCase of testCases) {
            __classPrivateFieldGet(this, _EvaluationDialog_state, "f").currentRunningTest = testCase.id;
            __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
            try {
                const testTypePrefix = isToolTest ? 'tool' : agentName;
                __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_addLog).call(this, `Running ${testTypePrefix} test: ${testCase.name}`);
                let result;
                if (isToolTest && __classPrivateFieldGet(this, _EvaluationDialog_evaluationRunner, "f")) {
                    result = await __classPrivateFieldGet(this, _EvaluationDialog_evaluationRunner, "f").runSingleTest(testCase);
                }
                else if (__classPrivateFieldGet(this, _EvaluationDialog_agentEvaluationRunner, "f")) {
                    result = await __classPrivateFieldGet(this, _EvaluationDialog_agentEvaluationRunner, "f").runSingleTest(testCase, agentName);
                }
                else {
                    throw new Error('No evaluation runner available');
                }
                __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.set(testCase.id, result);
                __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_addLog).call(this, `Test ${testCase.id} completed: ${result.status.toUpperCase()}`);
            }
            catch (error) {
                __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_addLog).call(this, `ERROR in test ${testCase.id}: ${error instanceof Error ? error.message : String(error)}`);
                __classPrivateFieldGet(this, _EvaluationDialog_state, "f").testResults.set(testCase.id, {
                    testId: testCase.id,
                    status: 'error',
                    error: error instanceof Error ? error.message : String(error),
                    duration: 0,
                    timestamp: Date.now(),
                });
            }
            __classPrivateFieldGet(this, _EvaluationDialog_state, "f").completedTests++;
            __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
            // Delay between tests
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        const completionLog = '✅ Tests completed';
        logger.info(completionLog);
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_addLog).call(this, completionLog);
    }
    catch (error) {
        logger.error('❌ Test batch failed:', error);
    }
    finally {
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").isRunning = false;
        __classPrivateFieldGet(this, _EvaluationDialog_state, "f").currentRunningTest = undefined;
        __classPrivateFieldGet(this, _EvaluationDialog_instances, "m", _EvaluationDialog_render).call(this);
    }
};
//# sourceMappingURL=EvaluationDialog.js.map