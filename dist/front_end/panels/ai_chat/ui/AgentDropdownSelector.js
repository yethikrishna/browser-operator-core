// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import * as Lit from '../../../ui/lit/lit.js';
const { html, nothing, Decorators } = Lit;
const { customElement, property, state } = Decorators;
let AgentDropdownSelector = class AgentDropdownSelector extends Lit.LitElement {
    constructor() {
        super(...arguments);
        this.selectedAgentType = null;
        this.agentConfigs = {};
        this.showLabels = false;
        this.isOpen = false;
        this.toggleDropdown = (e) => {
            e.stopPropagation();
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.addGlobalClickListener();
            }
            else {
                this.removeGlobalClickListener();
            }
        };
        this.handleDropdownItemClick = (e) => {
            e.stopPropagation();
            const target = e.target;
            const button = target.closest('[data-action]');
            if (!button)
                return;
            const action = button.dataset.action;
            const agentType = button.dataset.agentType;
            switch (action) {
                case 'select':
                    if (agentType) {
                        this.handleAgentSelect(agentType);
                        this.closeDropdown();
                    }
                    break;
                case 'add':
                    this.onAddAgent?.();
                    this.closeDropdown();
                    break;
                case 'delete':
                    if (agentType) {
                        this.onDeleteAgent?.(agentType);
                        // Don't close dropdown for delete action
                    }
                    break;
            }
        };
        this.handleDropdownKeydown = (e) => {
            switch (e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.toggleDropdown(e);
                    break;
                case 'Escape':
                    if (this.isOpen) {
                        e.preventDefault();
                        this.closeDropdown();
                    }
                    break;
                case 'ArrowDown':
                    if (!this.isOpen) {
                        e.preventDefault();
                        this.toggleDropdown(e);
                    }
                    break;
            }
        };
        this.cleanupFunctions = [];
    }
    render() {
        const { selectedAgentType, agentConfigs, showLabels } = this;
        // Get Deep Research config (always visible)
        const deepResearchConfig = agentConfigs['deep-research'];
        // Get other agents for dropdown (exclude deep-research)
        const otherAgents = Object.values(agentConfigs).filter(config => config.type !== 'deep-research');
        // Find currently selected agent from dropdown agents
        const selectedDropdownAgent = otherAgents.find(config => config.type === selectedAgentType);
        return html `
      <div class="agent-dropdown-selector">
        ${this.renderDeepResearchButton(deepResearchConfig, selectedAgentType, showLabels)}
        ${this.renderDropdownSelector(otherAgents, selectedDropdownAgent, showLabels)}
      </div>
    `;
    }
    renderDeepResearchButton(config, selectedAgentType, showLabels) {
        if (!config) {
            return html `<div class="agent-button-placeholder">Loading...</div>`;
        }
        const isSelected = selectedAgentType === config.type;
        const isCustomized = this.hasCustomPrompt(config.type);
        const buttonClasses = [
            'prompt-button',
            'deep-research-button',
            isSelected ? 'selected' : '',
            isCustomized ? 'customized' : ''
        ].filter(Boolean).join(' ');
        const title = isCustomized ?
            `${config.description || config.label} (Custom prompt - double-click to edit)` :
            `${config.description || config.label} (Double-click to edit prompt)`;
        return html `
      <button 
        class=${buttonClasses}
        data-agent-type=${config.type}
        @click=${() => this.handleAgentSelect(config.type)}
        @dblclick=${() => this.handleEditAgent(config.type)}
        title=${title}
      >
        <span class="prompt-icon">${config.icon}</span>
        ${showLabels ? html `<span class="prompt-label ${isSelected ? 'selected' : ''}">${config.label}</span>` : nothing}
        ${isCustomized ? html `<span class="prompt-custom-indicator">●</span>` : nothing}
      </button>
    `;
    }
    renderDropdownSelector(otherAgents, selectedAgent, showLabels) {
        const dropdownText = selectedAgent ? selectedAgent.label : 'More Agents';
        const dropdownIcon = selectedAgent ? selectedAgent.icon : '▼';
        const isSelected = Boolean(selectedAgent);
        const dropdownClasses = [
            'prompt-button',
            'dropdown-button',
            isSelected ? 'selected' : '',
            this.isOpen ? 'open' : ''
        ].filter(Boolean).join(' ');
        return html `
      <div class="dropdown-container">
        <button 
          class=${dropdownClasses}
          @click=${this.toggleDropdown}
          @keydown=${this.handleDropdownKeydown}
          title="Select agent type"
          aria-haspopup="true"
          aria-expanded=${this.isOpen}
        >
          <span class="prompt-icon">${dropdownIcon}</span>
          ${showLabels ? html `<span class="prompt-label ${isSelected ? 'selected' : ''}">${dropdownText}</span>` : nothing}
          <span class="dropdown-arrow ${this.isOpen ? 'open' : ''}">▼</span>
        </button>
        
        ${this.isOpen ? html `
          <div class="dropdown-menu" @click=${this.handleDropdownItemClick}>
            ${otherAgents.map(config => this.renderDropdownItem(config))}
            ${this.onAddAgent ? html `
              <div class="dropdown-separator"></div>
              <button 
                class="dropdown-item add-agent-item"
                data-action="add"
                title="Create new custom agent"
              >
                <span class="dropdown-item-icon">+</span>
                <span class="dropdown-item-label">Add Agent</span>
              </button>
            ` : nothing}
          </div>
        ` : nothing}
      </div>
    `;
    }
    renderDropdownItem(config) {
        const isSelected = this.selectedAgentType === config.type;
        const isCustomized = this.hasCustomPrompt(config.type);
        const isCustomAgent = !['shopping', 'default'].includes(config.type);
        const itemClasses = [
            'dropdown-item',
            isSelected ? 'selected' : '',
            isCustomized ? 'customized' : '',
            isCustomAgent ? 'custom-agent' : ''
        ].filter(Boolean).join(' ');
        return html `
      <button 
        class=${itemClasses}
        data-agent-type=${config.type}
        data-action="select"
        title=${config.description || config.label}
        @dblclick=${() => this.handleEditAgent(config.type)}
      >
        <span class="dropdown-item-icon">${config.icon}</span>
        <span class="dropdown-item-label">${config.label}</span>
        ${isCustomized ? html `<span class="dropdown-item-indicator">●</span>` : nothing}
        ${isCustomAgent && this.onDeleteAgent ? html `
          <button 
            class="dropdown-item-delete"
            data-agent-type=${config.type}
            data-action="delete"
            title="Delete ${config.label}"
            @click=${(e) => e.stopPropagation()}
          >
            ×
          </button>
        ` : nothing}
      </button>
    `;
    }
    handleAgentSelect(agentType) {
        this.onAgentSelect?.(agentType);
    }
    handleEditAgent(agentType) {
        this.onEditAgent?.(agentType);
    }
    closeDropdown() {
        this.isOpen = false;
        this.removeGlobalClickListener();
    }
    addGlobalClickListener() {
        const handler = (e) => {
            const target = e.target;
            if (!target.closest('.dropdown-container')) {
                this.closeDropdown();
            }
        };
        document.addEventListener('click', handler);
        this.cleanupFunctions.push(() => document.removeEventListener('click', handler));
    }
    removeGlobalClickListener() {
        // Run cleanup functions
        for (const cleanup of this.cleanupFunctions) {
            cleanup();
        }
        this.cleanupFunctions = [];
    }
    hasCustomPrompt(agentType) {
        // Check if agent has custom prompt (placeholder implementation)
        // This should integrate with the existing custom prompt system
        const customPrompts = localStorage.getItem('ai_chat_custom_prompts');
        if (!customPrompts)
            return false;
        try {
            const prompts = JSON.parse(customPrompts);
            return Boolean(prompts[agentType]);
        }
        catch {
            return false;
        }
    }
    // Lifecycle methods
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeGlobalClickListener();
    }
};
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], AgentDropdownSelector.prototype, "selectedAgentType", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], AgentDropdownSelector.prototype, "agentConfigs", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], AgentDropdownSelector.prototype, "showLabels", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], AgentDropdownSelector.prototype, "isOpen", void 0);
AgentDropdownSelector = __decorate([
    customElement('agent-dropdown-selector')
], AgentDropdownSelector);
export { AgentDropdownSelector };
// Helper function to create and render the dropdown selector
export function renderAgentDropdownSelector(options) {
    return html `
    <agent-dropdown-selector
      .selectedAgentType=${options.selectedAgentType}
      .agentConfigs=${options.agentConfigs}
      .showLabels=${options.showLabels || false}
      .onAgentSelect=${options.onAgentSelect}
      .onAddAgent=${options.onAddAgent}
      .onDeleteAgent=${options.onDeleteAgent}
      .onEditAgent=${options.onEditAgent}
    ></agent-dropdown-selector>
  `;
}
//# sourceMappingURL=AgentDropdownSelector.js.map