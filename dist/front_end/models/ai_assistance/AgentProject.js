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
var _AgentProject_instances, _AgentProject_project, _AgentProject_ignoredFileOrFolderNames, _AgentProject_filesChanged, _AgentProject_totalLinesChanged, _AgentProject_maxFilesChanged, _AgentProject_maxLinesChanged, _AgentProject_processedFiles, _AgentProject_writeWithUnifiedDiff, _AgentProject_shouldSkipPath, _AgentProject_indexFiles;
import * as Diff from '../../third_party/diff/diff.js';
import * as Persistence from '../persistence/persistence.js';
import * as TextUtils from '../text_utils/text_utils.js';
import { debugLog } from './debug.js';
const LINE_END_RE = /\r\n?|\n/;
const MAX_RESULTS_PER_FILE = 10;
export var ReplaceStrategy;
(function (ReplaceStrategy) {
    ReplaceStrategy["FULL_FILE"] = "full";
    ReplaceStrategy["UNIFIED_DIFF"] = "unified";
})(ReplaceStrategy || (ReplaceStrategy = {}));
/**
 * AgentProject wraps around a Workspace.Workspace.Project and
 * implements AI Assistance-specific logic for accessing workspace files
 * including additional checks and restrictions.
 */
export class AgentProject {
    constructor(project, options = {
        maxFilesChanged: 5,
        maxLinesChanged: 200,
    }) {
        _AgentProject_instances.add(this);
        _AgentProject_project.set(this, void 0);
        _AgentProject_ignoredFileOrFolderNames.set(this, new Set(['node_modules', 'package-lock.json']));
        _AgentProject_filesChanged.set(this, new Set());
        _AgentProject_totalLinesChanged.set(this, 0);
        _AgentProject_maxFilesChanged.set(this, void 0);
        _AgentProject_maxLinesChanged.set(this, void 0);
        _AgentProject_processedFiles.set(this, new Set());
        __classPrivateFieldSet(this, _AgentProject_project, project, "f");
        __classPrivateFieldSet(this, _AgentProject_maxFilesChanged, options.maxFilesChanged, "f");
        __classPrivateFieldSet(this, _AgentProject_maxLinesChanged, options.maxLinesChanged, "f");
    }
    /**
     * Returns a list of files from the project that has been used for
     * processing.
     */
    getProcessedFiles() {
        return Array.from(__classPrivateFieldGet(this, _AgentProject_processedFiles, "f"));
    }
    /**
     * Provides file names in the project to the agent.
     */
    getFiles() {
        return __classPrivateFieldGet(this, _AgentProject_instances, "m", _AgentProject_indexFiles).call(this).files;
    }
    /**
     * Provides access to the file content in the working copy
     * of the matching UiSourceCode.
     */
    async readFile(filepath) {
        const { map } = __classPrivateFieldGet(this, _AgentProject_instances, "m", _AgentProject_indexFiles).call(this);
        const uiSourceCode = map.get(filepath);
        if (!uiSourceCode) {
            return;
        }
        const content = uiSourceCode.isDirty() ? uiSourceCode.workingCopyContentData() : await uiSourceCode.requestContentData();
        __classPrivateFieldGet(this, _AgentProject_processedFiles, "f").add(filepath);
        if (TextUtils.ContentData.ContentData.isError(content) || !content.isTextContent) {
            return;
        }
        return content.text;
    }
    /**
     * This method updates the file content in the working copy of the
     * UiSourceCode identified by the filepath.
     */
    async writeFile(filepath, update, mode = "full" /* ReplaceStrategy.FULL_FILE */) {
        const { map } = __classPrivateFieldGet(this, _AgentProject_instances, "m", _AgentProject_indexFiles).call(this);
        const uiSourceCode = map.get(filepath);
        if (!uiSourceCode) {
            throw new Error(`UISourceCode ${filepath} not found`);
        }
        const currentContent = await this.readFile(filepath);
        let content;
        switch (mode) {
            case "full" /* ReplaceStrategy.FULL_FILE */:
                content = update;
                break;
            case "unified" /* ReplaceStrategy.UNIFIED_DIFF */:
                content = __classPrivateFieldGet(this, _AgentProject_instances, "m", _AgentProject_writeWithUnifiedDiff).call(this, update, currentContent);
                break;
        }
        const linesChanged = this.getLinesChanged(currentContent, content);
        if (__classPrivateFieldGet(this, _AgentProject_totalLinesChanged, "f") + linesChanged > __classPrivateFieldGet(this, _AgentProject_maxLinesChanged, "f")) {
            throw new Error('Too many lines changed');
        }
        __classPrivateFieldGet(this, _AgentProject_filesChanged, "f").add(filepath);
        if (__classPrivateFieldGet(this, _AgentProject_filesChanged, "f").size > __classPrivateFieldGet(this, _AgentProject_maxFilesChanged, "f")) {
            __classPrivateFieldGet(this, _AgentProject_filesChanged, "f").delete(filepath);
            throw new Error('Too many files changed');
        }
        __classPrivateFieldSet(this, _AgentProject_totalLinesChanged, __classPrivateFieldGet(this, _AgentProject_totalLinesChanged, "f") + linesChanged, "f");
        uiSourceCode.setWorkingCopy(content);
        uiSourceCode.setContainsAiChanges(true);
    }
    getLinesChanged(currentContent, updatedContent) {
        let linesChanged = 0;
        if (currentContent) {
            const diff = Diff.Diff.DiffWrapper.lineDiff(updatedContent.split(LINE_END_RE), currentContent.split(LINE_END_RE));
            for (const item of diff) {
                if (item[0] !== Diff.Diff.Operation.Equal) {
                    linesChanged++;
                }
            }
        }
        else {
            linesChanged += updatedContent.split(LINE_END_RE).length;
        }
        return linesChanged;
    }
    /**
     * This method searches in files for the agent and provides the
     * matches to the agent.
     */
    async searchFiles(query, caseSensitive, isRegex, { signal } = {}) {
        const { map } = __classPrivateFieldGet(this, _AgentProject_instances, "m", _AgentProject_indexFiles).call(this);
        const matches = [];
        for (const [filepath, file] of map.entries()) {
            if (signal?.aborted) {
                break;
            }
            debugLog('searching in', filepath, 'for', query);
            const content = file.isDirty() ? file.workingCopyContentData() : await file.requestContentData();
            const results = TextUtils.TextUtils.performSearchInContentData(content, query, caseSensitive ?? true, isRegex ?? false);
            for (const result of results.slice(0, MAX_RESULTS_PER_FILE)) {
                debugLog('matches in', filepath);
                matches.push({
                    filepath,
                    lineNumber: result.lineNumber,
                    columnNumber: result.columnNumber,
                    matchLength: result.matchLength
                });
            }
        }
        return matches;
    }
}
_AgentProject_project = new WeakMap(), _AgentProject_ignoredFileOrFolderNames = new WeakMap(), _AgentProject_filesChanged = new WeakMap(), _AgentProject_totalLinesChanged = new WeakMap(), _AgentProject_maxFilesChanged = new WeakMap(), _AgentProject_maxLinesChanged = new WeakMap(), _AgentProject_processedFiles = new WeakMap(), _AgentProject_instances = new WeakSet(), _AgentProject_writeWithUnifiedDiff = function _AgentProject_writeWithUnifiedDiff(llmDiff, content = '') {
    let updatedContent = content;
    const diffChunk = llmDiff.trim();
    const normalizedDiffLines = diffChunk.split(LINE_END_RE);
    const lineAfterSeparatorRegEx = /^@@.*@@([- +].*)/;
    const changeChunk = [];
    let currentChunk = [];
    for (const line of normalizedDiffLines) {
        if (line.startsWith('```')) {
            continue;
        }
        // The ending is not always @@
        if (line.startsWith('@@')) {
            line.search('@@');
            currentChunk = [];
            changeChunk.push(currentChunk);
            if (!line.endsWith('@@')) {
                const match = line.match(lineAfterSeparatorRegEx);
                if (match?.[1]) {
                    currentChunk.push(match[1]);
                }
            }
        }
        else {
            currentChunk.push(line);
        }
    }
    for (const chunk of changeChunk) {
        const search = [];
        const replace = [];
        for (const changeLine of chunk) {
            // Unified diff first char is ' ', '-', '+'
            // to represent what happened to the line
            const line = changeLine.slice(1);
            if (changeLine.startsWith('-')) {
                search.push(line);
            }
            else if (changeLine.startsWith('+')) {
                replace.push(line);
            }
            else {
                search.push(line);
                replace.push(line);
            }
        }
        if (replace.length === 0) {
            const searchString = search.join('\n');
            // If we remove we want to
            if (updatedContent.search(searchString + '\n') !== -1) {
                updatedContent = updatedContent.replace(searchString + '\n', '');
            }
            else {
                updatedContent = updatedContent.replace(searchString, '');
            }
        }
        else if (search.length === 0) {
            // This just adds it to the beginning of the file
            updatedContent = updatedContent.replace('', replace.join('\n'));
        }
        else {
            updatedContent = updatedContent.replace(search.join('\n'), replace.join('\n'));
        }
    }
    return updatedContent;
}, _AgentProject_shouldSkipPath = function _AgentProject_shouldSkipPath(pathParts) {
    for (const part of pathParts) {
        if (__classPrivateFieldGet(this, _AgentProject_ignoredFileOrFolderNames, "f").has(part) || part.startsWith('.')) {
            return true;
        }
    }
    return false;
}, _AgentProject_indexFiles = function _AgentProject_indexFiles() {
    const files = [];
    const map = new Map();
    // TODO: this could be optimized and cached.
    for (const uiSourceCode of __classPrivateFieldGet(this, _AgentProject_project, "f").uiSourceCodes()) {
        const pathParts = Persistence.FileSystemWorkspaceBinding.FileSystemWorkspaceBinding.relativePath(uiSourceCode);
        if (__classPrivateFieldGet(this, _AgentProject_instances, "m", _AgentProject_shouldSkipPath).call(this, pathParts)) {
            continue;
        }
        const path = pathParts.join('/');
        files.push(path);
        map.set(path, uiSourceCode);
    }
    return { files, map };
};
//# sourceMappingURL=AgentProject.js.map