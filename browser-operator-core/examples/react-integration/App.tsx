import React from 'react';
import { 
  BrowserOperatorProvider,
  BrowserOperatorWidget,
  useBrowserOperator
} from 'browser-operator-core/react';
import type { AgentType, BrowserOperatorConfig, TaskResult } from 'browser-operator-core';

// Example: Basic integration
function BasicExample() {
  const config: BrowserOperatorConfig = {
    llmProvider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    model: 'gpt-4',
    defaultAgentType: 'search' as AgentType,
    theme: 'light',
    debugMode: process.env.NODE_ENV === 'development'
  };

  const handleResult = (result: any) => {
    console.log('AI Result:', result);
  };

  const handleError = (error: Error) => {
    console.error('AI Error:', error);
  };

  return (
    <BrowserOperatorProvider 
      config={config}
      onTaskComplete={(result: TaskResult) => console.log('Task completed:', result)}
    >
      <div className="App">
        <header className="App-header">
          <h1>My App with Browser Operator</h1>
        </header>
        
        <main>
          <BrowserOperatorWidget
            placeholder="Ask me to research anything..."
            theme="light"
            showAgentSelector={true}
            autoFocus={true}
            onResult={handleResult}
            onError={handleError}
          />
        </main>
      </div>
    </BrowserOperatorProvider>
  );
}

// Example: Custom component using the hook
function CustomAIComponent() {
  const { 
    processRequest, 
    isReady, 
    isLoading, 
    error,
    setAgentType
  } = useBrowserOperator();

  const [result, setResult] = React.useState<string>('');
  const [processing, setProcessing] = React.useState(false);

  const handleSearch = async () => {
    if (!isReady) return;
    
    setProcessing(true);
    try {
      setAgentType('search' as AgentType);
      const response = await processRequest('What are the latest AI trends?');
      setResult(response.content);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeepResearch = async () => {
    if (!isReady) return;
    
    setProcessing(true);
    try {
      setAgentType('deep-research' as AgentType);
      const response = await processRequest('Create a comprehensive report on electric vehicle adoption rates');
      setResult(response.content);
    } catch (err) {
      console.error('Research failed:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) return <div>Loading Browser Operator...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!isReady) return <div>Initializing AI...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Custom AI Integration</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleSearch}
          disabled={processing}
          style={{ marginRight: '10px', padding: '10px 20px' }}
        >
          {processing ? 'Searching...' : 'Quick Search'}
        </button>
        
        <button 
          onClick={handleDeepResearch}
          disabled={processing}
          style={{ padding: '10px 20px' }}
        >
          {processing ? 'Researching...' : 'Deep Research'}
        </button>
      </div>

      {result && (
        <div style={{ 
          background: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '5px',
          marginTop: '20px'
        }}>
          <h3>AI Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

// Example: Advanced integration with multiple agents
function AdvancedExample() {
  const config: BrowserOperatorConfig = {
    llmProvider: 'openai',
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    model: 'gpt-4',
    defaultAgentType: 'search' as AgentType,
    availableAgents: ['search', 'deep-research', 'shopping'] as AgentType[],
    customAgents: [
      {
        id: 'social-media-analyzer',
        name: 'Social Media Analyzer',
        icon: '📱',
        description: 'Analyzes social media trends and sentiment',
        systemPrompt: 'You are a social media analysis expert. Analyze trends, sentiment, and engagement patterns.',
        availableTools: ['web-scraper', 'sentiment-analyzer'],
      }
    ],
    theme: 'dark',
    debugMode: true,
    maxConcurrentTasks: 3
  };

  return (
    <BrowserOperatorProvider config={config}>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Left panel - Custom controls */}
        <div style={{ width: '300px', padding: '20px', background: '#2d2d2d' }}>
          <CustomAIComponent />
        </div>
        
        {/* Right panel - AI Chat Widget */}
        <div style={{ flex: 1, padding: '20px' }}>
          <BrowserOperatorWidget
            theme="dark"
            placeholder="Ask me anything about social media, research, or shopping..."
            showAgentSelector={true}
            onResult={(result) => {
              console.log('Widget result:', result);
              // You can dispatch to Redux, update global state, etc.
            }}
          />
        </div>
      </div>
    </BrowserOperatorProvider>
  );
}

// Main App component
function App() {
  const [example, setExample] = React.useState<'basic' | 'advanced'>('basic');

  return (
    <div>
      <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
        <button 
          onClick={() => setExample('basic')}
          style={{ 
            marginRight: '10px', 
            padding: '5px 10px',
            background: example === 'basic' ? '#007bff' : '#fff',
            color: example === 'basic' ? '#fff' : '#000',
            border: '1px solid #007bff'
          }}
        >
          Basic Example
        </button>
        <button 
          onClick={() => setExample('advanced')}
          style={{ 
            padding: '5px 10px',
            background: example === 'advanced' ? '#007bff' : '#fff',
            color: example === 'advanced' ? '#fff' : '#000',
            border: '1px solid #007bff'
          }}
        >
          Advanced Example
        </button>
      </nav>

      {example === 'basic' ? <BasicExample /> : <AdvancedExample />}
    </div>
  );
}

export default App;