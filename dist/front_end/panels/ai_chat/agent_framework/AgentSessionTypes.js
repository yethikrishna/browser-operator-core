// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Default UI configuration for agents
 */
export const DEFAULT_AGENT_UI = {
    displayName: 'AI Assistant',
    avatar: '🤖',
    color: '#6b7280',
    backgroundColor: '#f9fafb'
};
/**
 * Utility function to get agent display name from config or format agent name
 */
export function getAgentDisplayName(agentName, config) {
    // First try to get from config UI
    if (config?.ui?.displayName) {
        return config.ui.displayName;
    }
    // Then try to get from config description (first line)
    if (config?.description) {
        const firstLine = config.description.split('\n')[0].trim();
        // If it looks like a title, use it
        if (firstLine && !firstLine.includes('agent') && firstLine.length < 50) {
            return firstLine;
        }
    }
    // Finally, format the agent name
    return agentName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
/**
 * Utility function to get agent description from config
 */
export function getAgentDescription(agentName, config) {
    if (config?.description) {
        return config.description;
    }
    return `${getAgentDisplayName(agentName, config)} - AI Assistant`;
}
/**
 * Utility function to get agent UI configuration
 */
export function getAgentUIConfig(agentName, config) {
    return {
        displayName: getAgentDisplayName(agentName, config),
        avatar: config?.ui?.avatar || DEFAULT_AGENT_UI.avatar,
        color: config?.ui?.color || DEFAULT_AGENT_UI.color,
        backgroundColor: config?.ui?.backgroundColor || DEFAULT_AGENT_UI.backgroundColor
    };
}
//# sourceMappingURL=AgentSessionTypes.js.map