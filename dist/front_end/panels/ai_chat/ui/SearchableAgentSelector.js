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
let SearchableAgentSelector = class SearchableAgentSelector extends Lit.LitElement {
    constructor() {
        super(...arguments);
        this.selectedAgentType = null;
        this.agentConfigs = {};
        this.showLabels = false;
        this.searchQuery = '';
        this.isOpen = false;
        this.selectedIndex = -1;
        this.filteredAgents = [];
        this.handleSearchInput = (e) => {
            const target = e.target;
            this.searchQuery = target.value;
            if (!this.isOpen && this.searchQuery) {
                this.openDropdown();
            }
        };
        this.handleInputFocus = () => {
            this.openDropdown();
        };
        this.handleInputBlur = (e) => {
            // Delay closing to allow clicks on suggestions
            setTimeout(() => {
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || !this.contains(relatedTarget)) {
                    this.closeDropdown();
                }
            }, 150);
        };
        this.handleInputClick = () => {
            if (!this.isOpen) {
                this.openDropdown();
            }
        };
        this.handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateDown();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateUp();
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.selectCurrentItem();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.closeDropdown();
                    break;
                case 'Tab':
                    this.closeDropdown();
                    break;
            }
        };
        this.handleSuggestionClick = (e) => {
            e.stopPropagation();
            const target = e.target;
            const item = target.closest('[data-action]');
            if (!item)
                return;
            const action = item.dataset.action;
            const agentType = item.dataset.agentType;
            switch (action) {
                case 'select':
                    if (agentType) {
                        this.selectAgent(agentType);
                    }
                    break;
                case 'add':
                    this.onAddAgent?.();
                    this.closeDropdown();
                    break;
                case 'delete':
                    if (agentType) {
                        this.onDeleteAgent?.(agentType);
                        // Keep dropdown open after delete
                    }
                    break;
            }
        };
        this.cleanupFunctions = [];
    }
    firstUpdated() {
        this.updateFilteredAgents();
    }
    updated(changedProperties) {
        if (changedProperties.has('agentConfigs')) {
            this.updateFilteredAgents();
        }
        if (changedProperties.has('searchQuery')) {
            this.updateFilteredAgents();
            this.selectedIndex = -1;
        }
    }
    render() {
        const selectedAgent = this.selectedAgentType ? this.agentConfigs[this.selectedAgentType] : null;
        const displayText = selectedAgent ? selectedAgent.label : '';
        const placeholderText = selectedAgent ? '' : 'Search agents...';
        return html `
      <div class="searchable-agent-selector">
        <div class="search-container">
          <input
            type="text"
            class="agent-search-input"
            .value=${this.searchQuery || displayText}
            placeholder=${placeholderText}
            @input=${this.handleSearchInput}
            @focus=${this.handleInputFocus}
            @blur=${this.handleInputBlur}
            @keydown=${this.handleKeyDown}
            @click=${this.handleInputClick}
            aria-label="Search agents"
            autocomplete="off"
            spellcheck="false"
          />
          <div class="search-icon">
            ${this.isOpen ? '▲' : '▼'}
          </div>
        </div>
        
        ${this.isOpen ? html `
          <div class="suggestions-dropdown" @click=${this.handleSuggestionClick}>
            ${this.filteredAgents.length > 0 ?
            this.filteredAgents.map((item, index) => this.renderSuggestionItem(item, index)) :
            html `<div class="no-results">No agents found</div>`}
            ${this.onAddAgent ? html `
              <div class="suggestion-separator"></div>
              <div 
                class="suggestion-item add-agent-item"
                data-action="add"
                role="option"
                tabindex="-1"
              >
                <span class="suggestion-icon">+</span>
                <span class="suggestion-label">Add New Agent</span>
              </div>
            ` : nothing}
          </div>
        ` : nothing}
      </div>
    `;
    }
    renderSuggestionItem(item, index) {
        const { config } = item;
        const isSelected = this.selectedIndex === index;
        const isCurrentlySelected = this.selectedAgentType === config.type;
        const isCustomized = this.hasCustomPrompt(config.type);
        const isCustomAgent = !['shopping', 'default', 'deep-research'].includes(config.type);
        const itemClasses = [
            'suggestion-item',
            isSelected ? 'highlighted' : '',
            isCurrentlySelected ? 'selected' : '',
            isCustomized ? 'customized' : '',
            isCustomAgent ? 'custom-agent' : ''
        ].filter(Boolean).join(' ');
        return html `
      <div 
        class=${itemClasses}
        data-agent-type=${config.type}
        data-action="select"
        role="option"
        tabindex="-1"
        aria-selected=${isCurrentlySelected}
        title=${config.description || config.label}
        @dblclick=${() => this.handleEditAgent(config.type)}
      >
        <span class="suggestion-icon">${config.icon}</span>
        <span class="suggestion-label">${config.label}</span>
        ${isCustomized ? html `<span class="suggestion-indicator">●</span>` : nothing}
        ${isCustomAgent && this.onDeleteAgent ? html `
          <button 
            class="suggestion-delete"
            data-agent-type=${config.type}
            data-action="delete"
            title="Delete ${config.label}"
            @click=${(e) => e.stopPropagation()}
            tabindex="-1"
          >
            ×
          </button>
        ` : nothing}
      </div>
    `;
    }
    updateFilteredAgents() {
        const query = this.searchQuery.toLowerCase().trim();
        const allAgents = Object.values(this.agentConfigs);
        if (!query) {
            // No search query - show all agents
            this.filteredAgents = allAgents.map(config => ({
                config,
                matchScore: 1
            }));
        }
        else {
            // Filter and score agents based on search query
            this.filteredAgents = allAgents
                .map(config => {
                const labelMatch = config.label.toLowerCase().includes(query);
                const descMatch = config.description?.toLowerCase().includes(query);
                const typeMatch = config.type.toLowerCase().includes(query);
                if (!labelMatch && !descMatch && !typeMatch) {
                    return null;
                }
                // Simple scoring: exact matches score higher
                let score = 0;
                if (config.label.toLowerCase().startsWith(query))
                    score += 10;
                if (config.label.toLowerCase().includes(query))
                    score += 5;
                if (config.description?.toLowerCase().includes(query))
                    score += 2;
                if (config.type.toLowerCase().includes(query))
                    score += 1;
                return {
                    config,
                    matchScore: score
                };
            })
                .filter((item) => item !== null)
                .sort((a, b) => b.matchScore - a.matchScore);
        }
    }
    navigateDown() {
        if (!this.isOpen) {
            this.openDropdown();
            return;
        }
        const maxIndex = this.filteredAgents.length - 1 + (this.onAddAgent ? 1 : 0);
        this.selectedIndex = Math.min(this.selectedIndex + 1, maxIndex);
    }
    navigateUp() {
        if (!this.isOpen)
            return;
        this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
    }
    selectCurrentItem() {
        if (!this.isOpen || this.selectedIndex === -1)
            return;
        if (this.selectedIndex < this.filteredAgents.length) {
            // Select agent
            const selectedAgent = this.filteredAgents[this.selectedIndex];
            this.selectAgent(selectedAgent.config.type);
        }
        else if (this.onAddAgent) {
            // Add new agent (last item)
            this.onAddAgent();
            this.closeDropdown();
        }
    }
    selectAgent(agentType) {
        this.selectedAgentType = agentType;
        this.searchQuery = '';
        this.onAgentSelect?.(agentType);
        this.closeDropdown();
    }
    handleEditAgent(agentType) {
        this.onEditAgent?.(agentType);
    }
    openDropdown() {
        this.isOpen = true;
        this.selectedIndex = -1;
        this.addGlobalClickListener();
    }
    closeDropdown() {
        this.isOpen = false;
        this.selectedIndex = -1;
        this.removeGlobalClickListener();
        // Clear search query if no agent is selected
        if (!this.selectedAgentType) {
            this.searchQuery = '';
        }
    }
    addGlobalClickListener() {
        const handler = (e) => {
            const target = e.target;
            if (!this.contains(target)) {
                this.closeDropdown();
            }
        };
        document.addEventListener('click', handler);
        this.cleanupFunctions.push(() => document.removeEventListener('click', handler));
    }
    removeGlobalClickListener() {
        for (const cleanup of this.cleanupFunctions) {
            cleanup();
        }
        this.cleanupFunctions = [];
    }
    hasCustomPrompt(agentType) {
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
    disconnectedCallback() {
        super.disconnectedCallback?.();
        this.removeGlobalClickListener();
    }
};
__decorate([
    property({ type: String }),
    __metadata("design:type", String)
], SearchableAgentSelector.prototype, "selectedAgentType", void 0);
__decorate([
    property({ type: Object }),
    __metadata("design:type", Object)
], SearchableAgentSelector.prototype, "agentConfigs", void 0);
__decorate([
    property({ type: Boolean }),
    __metadata("design:type", Object)
], SearchableAgentSelector.prototype, "showLabels", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], SearchableAgentSelector.prototype, "searchQuery", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], SearchableAgentSelector.prototype, "isOpen", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], SearchableAgentSelector.prototype, "selectedIndex", void 0);
__decorate([
    state(),
    __metadata("design:type", Array)
], SearchableAgentSelector.prototype, "filteredAgents", void 0);
SearchableAgentSelector = __decorate([
    customElement('searchable-agent-selector')
], SearchableAgentSelector);
export { SearchableAgentSelector };
// Helper function to create and render the searchable agent selector
export function renderSearchableAgentSelector(options) {
    return html `
    <searchable-agent-selector
      .selectedAgentType=${options.selectedAgentType}
      .agentConfigs=${options.agentConfigs}
      .showLabels=${options.showLabels || false}
      .onAgentSelect=${options.onAgentSelect}
      .onAddAgent=${options.onAddAgent}
      .onDeleteAgent=${options.onDeleteAgent}
      .onEditAgent=${options.onEditAgent}
    ></searchable-agent-selector>
  `;
}
//# sourceMappingURL=SearchableAgentSelector.js.map