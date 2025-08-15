import React, { useState, useRef, useEffect } from 'react';
import { useBrowserOperator } from '../BrowserOperatorProvider';
import type { AgentType } from '../../../types';

interface BrowserOperatorWidgetProps {
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  theme?: 'light' | 'dark' | 'auto';
  compact?: boolean;
  showAgentSelector?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  onResult?: (result: any) => void;
  onError?: (error: Error) => void;
}

/**
 * React Widget Component for Browser Operator
 * Provides a complete AI chat interface
 */
export const BrowserOperatorWidget: React.FC<BrowserOperatorWidgetProps> = ({
  className = '',
  style = {},
  placeholder = 'Ask me anything about the web...',
  theme = 'light',
  compact = false,
  showAgentSelector = true,
  autoFocus = false,
  disabled = false,
  onResult,
  onError
}) => {
  const {
    isReady,
    isLoading,
    error,
    activeTasks,
    processRequest,
    setAgentType
  } = useBrowserOperator();

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>>([]);
  const [currentAgent, setCurrentAgent] = useState<AgentType>('search' as AgentType);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current && isReady) {
      inputRef.current.focus();
    }
  }, [autoFocus, isReady]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || isProcessing || !isReady) {
      return;
    }

    const userMessage = { role: 'user' as const, content: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsProcessing(true);

    try {
      const result = await processRequest(query, currentAgent);
      
      const assistantMessage = {
        role: 'assistant' as const,
        content: result.content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (onResult) {
        onResult(result);
      }
    } catch (err) {
      const errorMessage = {
        role: 'assistant' as const,
        content: `Sorry, I encountered an error: ${(err as Error).message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      if (onError) {
        onError(err as Error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAgentChange = (newAgent: AgentType) => {
    setCurrentAgent(newAgent);
    setAgentType(newAgent);
  };

  const agentOptions = [
    { value: 'search' as AgentType, label: '🔍 Search', description: 'Quick web search and information gathering' },
    { value: 'deep-research' as AgentType, label: '📚 Deep Research', description: 'Comprehensive research with multiple sources' },
    { value: 'shopping' as AgentType, label: '🛍️ Shopping', description: 'Product comparison and shopping assistance' }
  ];

  const widgetClasses = `
    browser-operator-widget
    ${theme === 'dark' ? 'dark' : ''}
    ${compact ? 'compact' : ''}
    ${className}
  `.trim();

  return (
    <div className={widgetClasses} style={style}>
      <style>
        {`
          .browser-operator-widget {
            display: flex;
            flex-direction: column;
            height: 500px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .browser-operator-widget.dark {
            background: #1e1e1e;
            border-color: #404040;
            color: #ffffff;
          }
          
          .browser-operator-widget.compact {
            height: 300px;
          }
          
          .widget-header {
            padding: 12px 16px;
            border-bottom: 1px solid #e0e0e0;
            background: #f8f9fa;
          }
          
          .dark .widget-header {
            background: #2d2d2d;
            border-color: #404040;
          }
          
          .agent-selector {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
          }
          
          .agent-button {
            padding: 4px 8px;
            border: 1px solid #d0d0d0;
            border-radius: 4px;
            background: #ffffff;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
          }
          
          .agent-button:hover {
            background: #f0f0f0;
          }
          
          .agent-button.active {
            background: #007bff;
            color: white;
            border-color: #007bff;
          }
          
          .dark .agent-button {
            background: #404040;
            border-color: #606060;
            color: #ffffff;
          }
          
          .status-bar {
            font-size: 11px;
            color: #666666;
          }
          
          .dark .status-bar {
            color: #cccccc;
          }
          
          .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
          }
          
          .message {
            margin-bottom: 16px;
            padding: 8px 12px;
            border-radius: 6px;
            max-width: 80%;
          }
          
          .message.user {
            background: #007bff;
            color: white;
            margin-left: auto;
          }
          
          .message.assistant {
            background: #f1f3f4;
            color: #333333;
          }
          
          .dark .message.assistant {
            background: #3a3a3a;
            color: #ffffff;
          }
          
          .message-content {
            margin: 0;
          }
          
          .message-timestamp {
            font-size: 10px;
            opacity: 0.7;
            margin-top: 4px;
          }
          
          .input-form {
            display: flex;
            padding: 16px;
            border-top: 1px solid #e0e0e0;
            gap: 8px;
          }
          
          .dark .input-form {
            border-color: #404040;
          }
          
          .input-field {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #d0d0d0;
            border-radius: 4px;
            font-size: 14px;
          }
          
          .input-field:focus {
            outline: none;
            border-color: #007bff;
          }
          
          .dark .input-field {
            background: #404040;
            border-color: #606060;
            color: #ffffff;
          }
          
          .submit-button {
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          
          .submit-button:hover:not(:disabled) {
            background: #0056b3;
          }
          
          .submit-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .loading-indicator {
            text-align: center;
            padding: 20px;
            color: #666666;
          }
          
          .error-message {
            background: #fee;
            color: #c00;
            padding: 8px 12px;
            border-radius: 4px;
            margin: 8px 16px;
          }
        `}
      </style>
      
      {showAgentSelector && (
        <div className="widget-header">
          <div className="agent-selector">
            {agentOptions.map(agent => (
              <button
                key={agent.value}
                className={`agent-button ${currentAgent === agent.value ? 'active' : ''}`}
                onClick={() => handleAgentChange(agent.value)}
                disabled={disabled || isProcessing}
                title={agent.description}
              >
                {agent.label}
              </button>
            ))}
          </div>
          <div className="status-bar">
            {isLoading && '🔄 Initializing...'}
            {isReady && !isProcessing && '✅ Ready'}
            {isProcessing && '🤖 Processing...'}
            {activeTasks.length > 0 && `📋 ${activeTasks.length} active tasks`}
          </div>
        </div>
      )}

      {error && !isReady && (
        <div className="error-message">
          Failed to initialize: {error.message}
        </div>
      )}

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">{message.content}</div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="input-field"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || !isReady || isProcessing}
        />
        <button
          type="submit"
          className="submit-button"
          disabled={disabled || !isReady || isProcessing || !query.trim()}
        >
          {isProcessing ? '⏳' : '🚀'}
        </button>
      </form>
    </div>
  );
};