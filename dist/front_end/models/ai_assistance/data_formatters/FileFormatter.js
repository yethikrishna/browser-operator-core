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
var _FileFormatter_instances, _FileFormatter_file, _FileFormatter_formatFileContent;
import * as Bindings from '../../bindings/bindings.js';
import { NetworkRequestFormatter } from './NetworkRequestFormatter.js';
const MAX_FILE_SIZE = 10000;
/**
 * File that formats a file for the LLM usage.
 */
export class FileFormatter {
    static formatSourceMapDetails(selectedFile, debuggerWorkspaceBinding) {
        const mappedFileUrls = [];
        const sourceMapUrls = [];
        if (selectedFile.contentType().isFromSourceMap()) {
            for (const script of debuggerWorkspaceBinding.scriptsForUISourceCode(selectedFile)) {
                const uiSourceCode = debuggerWorkspaceBinding.uiSourceCodeForScript(script);
                if (uiSourceCode) {
                    mappedFileUrls.push(uiSourceCode.url());
                    if (script.sourceMapURL !== undefined) {
                        sourceMapUrls.push(script.sourceMapURL);
                    }
                }
            }
            for (const originURL of Bindings.SASSSourceMapping.SASSSourceMapping.uiSourceOrigin(selectedFile)) {
                mappedFileUrls.push(originURL);
            }
        }
        else if (selectedFile.contentType().isScript()) {
            for (const script of debuggerWorkspaceBinding.scriptsForUISourceCode(selectedFile)) {
                if (script.sourceMapURL !== undefined && script.sourceMapURL !== '') {
                    sourceMapUrls.push(script.sourceMapURL);
                }
            }
        }
        if (sourceMapUrls.length === 0) {
            return '';
        }
        let sourceMapDetails = 'Source map: ' + sourceMapUrls;
        if (mappedFileUrls.length > 0) {
            sourceMapDetails += '\nSource mapped from: ' + mappedFileUrls;
        }
        return sourceMapDetails;
    }
    constructor(file) {
        _FileFormatter_instances.add(this);
        _FileFormatter_file.set(this, void 0);
        __classPrivateFieldSet(this, _FileFormatter_file, file, "f");
    }
    formatFile() {
        const debuggerWorkspaceBinding = Bindings.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance();
        const sourceMapDetails = FileFormatter.formatSourceMapDetails(__classPrivateFieldGet(this, _FileFormatter_file, "f"), debuggerWorkspaceBinding);
        const lines = [
            `File name: ${__classPrivateFieldGet(this, _FileFormatter_file, "f").displayName()}`,
            `URL: ${__classPrivateFieldGet(this, _FileFormatter_file, "f").url()}`,
            sourceMapDetails,
        ];
        const resource = Bindings.ResourceUtils.resourceForURL(__classPrivateFieldGet(this, _FileFormatter_file, "f").url());
        if (resource?.request) {
            lines.push(`Request initiator chain:
${new NetworkRequestFormatter(resource.request).formatRequestInitiatorChain()}`);
        }
        lines.push(`File content:
${__classPrivateFieldGet(this, _FileFormatter_instances, "m", _FileFormatter_formatFileContent).call(this)}`);
        return lines.filter(line => line.trim() !== '').join('\n');
    }
}
_FileFormatter_file = new WeakMap(), _FileFormatter_instances = new WeakSet(), _FileFormatter_formatFileContent = function _FileFormatter_formatFileContent() {
    const contentData = __classPrivateFieldGet(this, _FileFormatter_file, "f").workingCopyContentData();
    const content = contentData.isTextContent ? contentData.text : '<binary data>';
    const truncated = content.length > MAX_FILE_SIZE ? content.slice(0, MAX_FILE_SIZE) + '...' : content;
    return `\`\`\`
${truncated}
\`\`\``;
};
//# sourceMappingURL=FileFormatter.js.map