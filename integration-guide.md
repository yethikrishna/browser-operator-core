# Browser Operator Integration Guide

## Overview

Browser Operator can be integrated into your application in several ways. This guide outlines the most effective approaches based on your specific needs.

## 🎯 Integration Options

### 1. **Standalone Component Package** ⭐ RECOMMENDED

Extract the core AI agent functionality as a reusable npm package:

```typescript
// browser-operator-core package structure
/src
  /core              # Agent orchestration
  /agent_framework   # Multi-agent system
  /LLM              # Language model integration
  /tools            # Web automation tools
  /types            # TypeScript definitions
  /api              # External API interface
```

**Benefits:**
- ✅ Framework agnostic (React, Vue, Angular, vanilla JS)
- ✅ Lightweight (~50% smaller than full DevTools)
- ✅ Easy to customize and extend
- ✅ Clean API for external integration

**Integration Example:**
```javascript
import { BrowserOperatorCore, AgentType } from 'browser-operator-core';

const browserOp = new BrowserOperatorCore({
  llmProvider: 'openai',
  apiKey: 'your-key',
  agentType: AgentType.SEARCH
});

// Use in your app
const result = await browserOp.processRequest('Find information about AI trends');
```

### 2. **WebComponent/iframe Integration**

Embed the full Browser Operator interface as a web component:

```html
<!-- Embed as iframe -->
<iframe src="http://localhost:8000/browser-operator" 
        id="browser-operator-frame"
        width="100%" 
        height="600px"></iframe>

<!-- Or as Web Component -->
<browser-operator-panel 
  api-key="your-key"
  agent-type="search"
  theme="dark"></browser-operator-panel>
```

**Communication via PostMessage:**
```javascript
// Send commands to Browser Operator
document.getElementById('browser-operator-frame').contentWindow.postMessage({
  type: 'EXECUTE_TASK',
  payload: { query: 'Research AI trends', agentType: 'deep-research' }
}, '*');

// Listen for responses
window.addEventListener('message', (event) => {
  if (event.data.type === 'TASK_RESULT') {
    console.log('Result:', event.data.payload);
  }
});
```

### 3. **Headless API Integration**

Use Browser Operator programmatically without UI:

```javascript
import { HeadlessOrchestrator, ToolRegistry } from 'browser-operator-core';

const orchestrator = new HeadlessOrchestrator({
  llmConfig: { provider: 'openai', model: 'gpt-4' },
  tools: ToolRegistry.getAllTools(),
  headless: true
});

// Execute tasks programmatically
const result = await orchestrator.executeTask({
  type: 'web-research',
  query: 'Find pricing for SaaS tools',
  parameters: { maxResults: 10, includePricing: true }
});
```

### 4. **Plugin/Extension Architecture**

Integrate as a browser extension or plugin:

```json
// manifest.json
{
  "name": "YourApp with Browser Operator",
  "version": "1.0",
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["browser-operator-integration.js"]
  }],
  "web_accessible_resources": ["browser-operator-panel.html"]
}
```

## 🛠️ Implementation Examples

### React Integration
```jsx
import React, { useState, useEffect } from 'react';
import { BrowserOperatorCore } from 'browser-operator-core';

const MyAppWithAI = () => {
  const [browserOp, setBrowserOp] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const initBrowserOp = async () => {
      const instance = new BrowserOperatorCore({
        llmProvider: 'openai',
        apiKey: process.env.REACT_APP_OPENAI_KEY
      });
      await instance.initialize();
      setBrowserOp(instance);
    };
    initBrowserOp();
  }, []);

  const handleAITask = async (query) => {
    if (browserOp) {
      const response = await browserOp.processRequest(query);
      setResult(response);
    }
  };

  return (
    <div className="my-app">
      <h1>My App with AI Capabilities</h1>
      <button onClick={() => handleAITask('Research latest tech news')}>
        AI Research
      </button>
      {result && <div className="ai-result">{result}</div>}
    </div>
  );
};
```

### Vue.js Integration
```vue
<template>
  <div id="app">
    <h1>My Vue App with AI</h1>
    <browser-operator-widget 
      :config="aiConfig"
      @result="handleResult"
    />
  </div>
</template>

<script>
import { BrowserOperatorWidget } from 'browser-operator-vue';

export default {
  components: { BrowserOperatorWidget },
  data() {
    return {
      aiConfig: {
        llmProvider: 'openai',
        agentTypes: ['search', 'deep-research'],
        theme: 'light'
      }
    };
  },
  methods: {
    handleResult(result) {
      console.log('AI Result:', result);
    }
  }
};
</script>
```

## 🔧 Configuration Options

### Core Configuration
```typescript
interface BrowserOperatorConfig {
  // LLM Configuration
  llmProvider: 'openai' | 'claude' | 'gemini' | 'local';
  apiKey?: string;
  model?: string;
  
  // Agent Configuration
  defaultAgentType: AgentType;
  availableAgents: AgentType[];
  customAgents?: CustomAgentConfig[];
  
  // UI Configuration
  theme: 'light' | 'dark' | 'auto';
  compact: boolean;
  showAdvancedOptions: boolean;
  
  // Tool Configuration
  enabledTools: string[];
  toolConfigs: Record<string, any>;
  
  // Integration Settings
  headless: boolean;
  debugMode: boolean;
  maxConcurrentTasks: number;
}
```

### Custom Agent Creation
```typescript
// Define custom agent
const customAgent: CustomAgentConfig = {
  id: 'my-custom-agent',
  name: 'Custom Research Agent',
  icon: '🔍',
  description: 'Specialized agent for your domain',
  systemPrompt: 'You are a specialized agent for...',
  availableTools: ['web-scraper', 'data-analyzer', 'report-generator'],
  workflow: customWorkflowGraph
};

// Register with Browser Operator
browserOp.registerCustomAgent(customAgent);
```

## 📦 Package Distribution

### NPM Package Structure
```
browser-operator-core/
├── dist/                 # Compiled JavaScript
├── types/               # TypeScript definitions
├── src/                 # Source code
├── examples/            # Integration examples
├── docs/               # Documentation
└── package.json        # Package configuration
```

### Package.json Example
```json
{
  "name": "browser-operator-core",
  "version": "1.0.0",
  "description": "AI-powered web automation core",
  "main": "dist/index.js",
  "types": "types/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./headless": "./dist/headless.js",
    "./react": "./dist/react/index.js",
    "./vue": "./dist/vue/index.js"
  },
  "keywords": ["ai", "automation", "web", "browser", "agent"],
  "peerDependencies": {
    "react": ">=16.8.0"
  }
}
```

## 🚀 Getting Started

### 1. Extract Core Components
```bash
# Clone Browser Operator
git clone https://github.com/tysonthomas9/browser-operator-devtools-frontend.git

# Navigate to AI chat panel
cd browser-operator-devtools-frontend/front_end/panels/ai_chat

# Install dependencies
npm install
```

### 2. Build Standalone Package
```bash
# Build core components
npm run build:core

# Generate TypeScript definitions
npm run build:types

# Package for distribution
npm run package
```

### 3. Integrate in Your App
```bash
# Install the core package
npm install browser-operator-core

# Or use local build
npm install ./path/to/browser-operator-core
```

## 🔗 API Reference

### Core Methods
```typescript
class BrowserOperatorCore {
  constructor(config: BrowserOperatorConfig)
  async initialize(): Promise<void>
  async processRequest(query: string, options?: RequestOptions): Promise<AIResponse>
  async executeTask(task: Task): Promise<TaskResult>
  registerCustomAgent(agent: CustomAgentConfig): void
  setLLMProvider(provider: LLMProvider): void
  destroy(): void
}
```

### Event System
```typescript
// Listen for events
browserOp.on('taskStart', (task) => console.log('Task started:', task));
browserOp.on('taskProgress', (progress) => console.log('Progress:', progress));
browserOp.on('taskComplete', (result) => console.log('Task completed:', result));
browserOp.on('error', (error) => console.error('Error:', error));
```

## 🔐 Security Considerations

- **API Keys**: Store securely, never expose in client-side code
- **CORS**: Configure properly for iframe/web component integration  
- **CSP**: Update Content Security Policy for external AI services
- **Data Privacy**: Consider where sensitive data is processed (local vs cloud)

## 📈 Performance Tips

- Use lazy loading for large components
- Implement connection pooling for headless mode
- Cache common AI responses
- Optimize tool loading based on use case
- Monitor memory usage in long-running integrations

## 🛡️ Error Handling

```typescript
try {
  const result = await browserOp.processRequest(query);
  return result;
} catch (error) {
  if (error.type === 'LLM_API_ERROR') {
    // Handle API errors
    console.error('LLM API Error:', error.message);
  } else if (error.type === 'TOOL_EXECUTION_ERROR') {
    // Handle tool errors
    console.error('Tool Error:', error.tool, error.message);
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);
  }
  throw error;
}
```