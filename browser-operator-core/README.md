# Browser Operator Core

🤖 **AI-powered web automation for any application**

A lightweight, framework-agnostic package extracted from [Browser Operator](https://github.com/tysonthomas9/browser-operator-devtools-frontend) that lets you integrate intelligent web automation into your existing applications.

## ✨ Features

- 🧠 **Multi-Agent AI System** - Search, research, shopping, and custom agents
- 🔗 **Framework Agnostic** - Works with React, Vue, Angular, vanilla JS, and Node.js
- 🎯 **Multiple Integration Options** - Components, headless API, or embedded widgets
- 🔒 **Privacy First** - Support for local LLMs and secure cloud providers
- 🛠️ **Highly Customizable** - Create custom agents, tools, and workflows
- 📦 **Lightweight** - Core functionality without the full DevTools overhead

## 🚀 Quick Start

### Installation

```bash
npm install browser-operator-core
```

### Basic Usage

```javascript
import { BrowserOperatorCore } from 'browser-operator-core';

const browserOp = new BrowserOperatorCore({
  llmProvider: 'openai',
  apiKey: 'your-api-key',
  defaultAgentType: 'search'
});

await browserOp.initialize();

const result = await browserOp.processRequest(
  'What are the latest trends in AI development?'
);

console.log(result.content);
```

### React Integration

```jsx
import { BrowserOperatorProvider, BrowserOperatorWidget } from 'browser-operator-core/react';

function App() {
  const config = {
    llmProvider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    defaultAgentType: 'search'
  };

  return (
    <BrowserOperatorProvider config={config}>
      <div className="my-app">
        <h1>My App with AI</h1>
        <BrowserOperatorWidget
          placeholder="Ask me anything..."
          onResult={(result) => console.log(result)}
        />
      </div>
    </BrowserOperatorProvider>
  );
}
```

### Headless Processing

```javascript
import { processAIRequest } from 'browser-operator-core/headless';

// One-off request
const result = await processAIRequest(
  'Research electric vehicle market trends',
  {
    llmProvider: 'openai',
    apiKey: 'your-key',
    agentType: 'deep-research'
  }
);

console.log(result.content);
```

## 📚 Integration Examples

### 1. React App Integration

**Full React component with provider:**

```jsx
import React from 'react';
import { 
  BrowserOperatorProvider,
  useBrowserOperator 
} from 'browser-operator-core/react';

// Custom component using the hook
function AIAssistant() {
  const { processRequest, isReady } = useBrowserOperator();
  const [result, setResult] = useState('');

  const handleSearch = async () => {
    if (isReady) {
      const response = await processRequest('Latest tech news');
      setResult(response.content);
    }
  };

  return (
    <div>
      <button onClick={handleSearch}>Get Tech News</button>
      {result && <div>{result}</div>}
    </div>
  );
}

// Main app with provider
function App() {
  return (
    <BrowserOperatorProvider config={{
      llmProvider: 'openai',
      apiKey: process.env.REACT_APP_OPENAI_KEY,
      defaultAgentType: 'search'
    }}>
      <AIAssistant />
    </BrowserOperatorProvider>
  );
}
```

### 2. Vanilla JavaScript Integration

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module">
        import { BrowserOperatorCore } from './browser-operator-core.js';
        
        const browserOp = new BrowserOperatorCore({
            llmProvider: 'openai',
            apiKey: 'your-key',
            defaultAgentType: 'search'
        });
        
        await browserOp.initialize();
        
        document.getElementById('search').onclick = async () => {
            const query = document.getElementById('input').value;
            const result = await browserOp.processRequest(query);
            document.getElementById('result').textContent = result.content;
        };
    </script>
</head>
<body>
    <input id="input" placeholder="Ask something...">
    <button id="search">Search</button>
    <div id="result"></div>
</body>
</html>
```

### 3. Node.js Server Integration

```javascript
const express = require('express');
const { processAIRequest } = require('browser-operator-core/headless');

const app = express();
app.use(express.json());

app.post('/api/ai', async (req, res) => {
    try {
        const { query, agentType } = req.body;
        
        const result = await processAIRequest(query, {
            llmProvider: 'openai',
            apiKey: process.env.OPENAI_API_KEY,
            agentType: agentType || 'search'
        });
        
        res.json({ result: result.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000);
```

### 4. Vue.js Integration

```vue
<template>
  <div>
    <h1>AI-Powered Vue App</h1>
    <input v-model="query" @keyup.enter="processQuery">
    <button @click="processQuery" :disabled="!isReady">Ask AI</button>
    <div v-if="result">{{ result }}</div>
  </div>
</template>

<script>
import { BrowserOperatorCore } from 'browser-operator-core';

export default {
  data() {
    return {
      browserOp: null,
      query: '',
      result: '',
      isReady: false
    };
  },
  
  async mounted() {
    this.browserOp = new BrowserOperatorCore({
      llmProvider: 'openai',
      apiKey: process.env.VUE_APP_OPENAI_KEY,
      defaultAgentType: 'search'
    });
    
    await this.browserOp.initialize();
    this.isReady = true;
  },
  
  methods: {
    async processQuery() {
      if (this.browserOp && this.query) {
        const response = await this.browserOp.processRequest(this.query);
        this.result = response.content;
        this.query = '';
      }
    }
  }
};
</script>
```

## 🤖 Agent Types

### Built-in Agents

- **`search`** - Quick web search and information gathering
- **`deep-research`** - Comprehensive research with multiple sources  
- **`shopping`** - Product comparison and shopping assistance

### Custom Agents

```javascript
const browserOp = new BrowserOperatorCore({
  llmProvider: 'openai',
  apiKey: 'your-key',
  defaultAgentType: 'search',
  customAgents: [{
    id: 'social-media-analyzer',
    name: 'Social Media Analyzer',
    icon: '📱',
    description: 'Analyzes social media trends',
    systemPrompt: 'You are a social media expert...',
    availableTools: ['web-scraper', 'sentiment-analyzer']
  }]
});

await browserOp.initialize();

// Use your custom agent
const result = await browserOp.processRequest(
  'Analyze Twitter sentiment about AI',
  { agentType: 'social-media-analyzer' }
);
```

## ⚙️ Configuration

### Core Configuration

```typescript
interface BrowserOperatorConfig {
  // LLM Settings
  llmProvider: 'openai' | 'claude' | 'gemini' | 'local';
  apiKey?: string;
  model?: string;
  baseURL?: string;
  
  // Agent Settings  
  defaultAgentType: AgentType;
  availableAgents?: AgentType[];
  customAgents?: CustomAgentConfig[];
  
  // Integration Settings
  headless?: boolean;
  debugMode?: boolean;
  maxConcurrentTasks?: number;
  
  // Event Handlers
  onTaskStart?: (task: Task) => void;
  onTaskComplete?: (result: TaskResult) => void;
  onError?: (error: Error) => void;
}
```

### LLM Provider Configuration

**OpenAI:**
```javascript
{
  llmProvider: 'openai',
  apiKey: 'sk-...',
  model: 'gpt-4'
}
```

**Local LLM (Ollama):**
```javascript
{
  llmProvider: 'local',
  baseURL: 'http://localhost:11434',
  model: 'llama3'
}
```

**Claude:**
```javascript
{
  llmProvider: 'claude',
  apiKey: 'sk-ant-...',
  model: 'claude-3-sonnet'
}
```

## 🎯 Use Cases

### Personal Productivity
- 📚 Research assistance and report generation
- 🛍️ Price tracking and comparison shopping
- 📰 News aggregation and summarization
- 📊 Data collection and analysis

### Business Intelligence  
- 🔍 Competitive analysis and monitoring
- 👥 Lead generation and qualification
- 📈 Market research and trend analysis
- 📋 Process automation

### Development & Testing
- 🧪 Automated testing workflows
- 📖 Documentation generation
- 🔄 Content validation
- 🎨 UI/UX research

## 🔧 Advanced Usage

### Event Handling

```javascript
const browserOp = new BrowserOperatorCore(config);

browserOp.on('taskStart', (task) => {
  console.log('Task started:', task.id);
});

browserOp.on('taskProgress', (progress) => {
  console.log(`Progress: ${progress.progress}%`);
});

browserOp.on('taskComplete', (result) => {
  console.log('Task completed:', result);
});

browserOp.on('error', (error) => {
  console.error('Error:', error);
});
```

### Batch Processing

```javascript
import { processBatchRequests } from 'browser-operator-core/headless';

const requests = [
  { query: 'Latest AI news', agentType: 'search' },
  { query: 'Electric car market analysis', agentType: 'deep-research' },
  { query: 'Best laptops under $1000', agentType: 'shopping' }
];

const results = await processBatchRequests(requests, {
  llmProvider: 'openai',
  apiKey: 'your-key',
  maxConcurrency: 2
});

results.forEach((result, index) => {
  console.log(`Result ${index}:`, result.content);
});
```

### Persistent Sessions

```javascript
import { createHeadlessBrowserOperator } from 'browser-operator-core/headless';

// Create a persistent session
const browserOp = await createHeadlessBrowserOperator({
  llmProvider: 'openai',
  apiKey: 'your-key',
  defaultAgentType: 'search'
});

// Process multiple requests with context
const result1 = await browserOp.processRequest('What is quantum computing?');
const result2 = await browserOp.processRequest('How does it compare to classical computing?');
const result3 = await browserOp.processRequest('What are the main applications?');

// Clean up
browserOp.destroy();
```

## 🔌 Framework Integration Guides

### Express.js Middleware

```javascript
const browserOperatorMiddleware = (config) => {
  return async (req, res, next) => {
    req.browserOperator = new BrowserOperatorCore(config);
    await req.browserOperator.initialize();
    
    res.on('finish', () => {
      req.browserOperator.destroy();
    });
    
    next();
  };
};

app.use(browserOperatorMiddleware({ 
  llmProvider: 'openai',
  apiKey: process.env.OPENAI_KEY 
}));

app.post('/ai', async (req, res) => {
  const result = await req.browserOperator.processRequest(req.body.query);
  res.json(result);
});
```

### Next.js API Route

```javascript
// pages/api/ai.js
import { processAIRequest } from 'browser-operator-core/headless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, agentType } = req.body;
    
    const result = await processAIRequest(query, {
      llmProvider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      agentType
    });
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## 🚀 Deployment

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...
CLAUDE_API_KEY=sk-ant-...
GEMINI_API_KEY=...

# Optional  
LLM_PROVIDER=openai
DEFAULT_MODEL=gpt-4
DEBUG_MODE=false
MAX_CONCURRENT_TASKS=3
```

## 📊 Performance & Limits

### Response Times
- **Search Agent**: ~2-5 seconds
- **Deep Research**: ~10-30 seconds  
- **Shopping Agent**: ~5-15 seconds

### Rate Limits
- Respects LLM provider limits
- Built-in request queuing
- Configurable concurrency

### Memory Usage
- Core package: ~50MB base
- Per active session: ~10-20MB
- Automatic cleanup of inactive sessions

## 🛠️ Development

### Building from Source

```bash
git clone https://github.com/tysonthomas9/browser-operator-devtools-frontend.git
cd browser-operator-devtools-frontend/browser-operator-core

npm install
npm run build
npm test
```

### Running Examples

```bash
# React example
cd examples/react-integration
npm install
npm start

# Node.js server example
cd examples/node-js
npm install
npm start

# Vanilla JS example
cd examples/vanilla-js
python -m http.server 8000
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the [BSD-3-Clause License](../LICENSE).

## 🙏 Acknowledgments

Browser Operator Core is extracted from the full [Browser Operator](https://github.com/tysonthomas9/browser-operator-devtools-frontend) project. Thanks to all contributors and the open-source community.

## 📞 Support

- 📖 [Full Documentation](https://github.com/tysonthomas9/browser-operator-devtools-frontend)
- 💬 [Discord Community](https://discord.gg/fp7ryHYBSY)
- 🐛 [Issue Tracker](https://github.com/tysonthomas9/browser-operator-devtools-frontend/issues)
- 🐦 [Twitter Updates](https://x.com/BrowserOperator)

---

<div align="center">

**⭐ Star this repo if Browser Operator Core helps your project!**

**[🌟 Star on GitHub](https://github.com/tysonthomas9/browser-operator-devtools-frontend)** | **[📦 npm Package](https://npmjs.com/package/browser-operator-core)**

</div>