// Core Types for Browser Operator Integration

export interface BrowserOperatorConfig {
  // LLM Configuration
  llmProvider: 'openai' | 'claude' | 'gemini' | 'local' | 'litellm';
  apiKey?: string;
  model?: string;
  baseURL?: string;
  
  // Agent Configuration
  defaultAgentType: AgentType;
  availableAgents?: AgentType[];
  customAgents?: CustomAgentConfig[];
  
  // UI Configuration (for component integrations)
  theme?: 'light' | 'dark' | 'auto';
  compact?: boolean;
  showAdvancedOptions?: boolean;
  
  // Tool Configuration
  enabledTools?: string[];
  toolConfigs?: Record<string, any>;
  
  // Integration Settings
  headless?: boolean;
  debugMode?: boolean;
  maxConcurrentTasks?: number;
  
  // Event handlers
  onTaskStart?: (task: Task) => void;
  onTaskProgress?: (progress: TaskProgress) => void;
  onTaskComplete?: (result: TaskResult) => void;
  onError?: (error: Error) => void;
}

export enum AgentType {
  SEARCH = 'search',
  DEEP_RESEARCH = 'deep-research',
  SHOPPING = 'shopping',
  CUSTOM = 'custom'
}

export interface CustomAgentConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string;
  availableTools: string[];
  workflow?: WorkflowGraph;
}

export interface Task {
  id: string;
  type: string;
  query: string;
  parameters?: Record<string, any>;
  agentType?: AgentType;
  priority?: 'low' | 'medium' | 'high';
  timeout?: number;
}

export interface TaskResult {
  id: string;
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    executionTime: number;
    toolsUsed: string[];
    tokensUsed?: number;
  };
}

export interface TaskProgress {
  taskId: string;
  progress: number; // 0-100
  currentStep: string;
  message?: string;
}

export interface AIResponse {
  content: string;
  metadata?: {
    model: string;
    tokensUsed: number;
    executionTime: number;
    toolsUsed: string[];
  };
  sources?: Array<{
    url: string;
    title: string;
    excerpt: string;
  }>;
}

export interface RequestOptions {
  agentType?: AgentType;
  tools?: string[];
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowNode {
  id: string;
  type: 'agent' | 'tool' | 'condition' | 'output';
  data: any;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  condition?: string;
}

export interface LLMProvider {
  name: string;
  models: string[];
  requiresApiKey: boolean;
  baseURL?: string;
  
  chat(messages: ChatMessage[], options?: LLMOptions): Promise<string>;
  stream?(messages: ChatMessage[], options?: LLMOptions): AsyncGenerator<string>;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  tool_calls?: any[];
  tool_call_id?: string;
}

export interface LLMOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: any[];
  stream?: boolean;
}

export interface Tool {
  name: string;
  description: string;
  parameters: any;
  execute(args: any): Promise<any>;
}

// Event types for EventEmitter
export interface BrowserOperatorEvents {
  'taskStart': (task: Task) => void;
  'taskProgress': (progress: TaskProgress) => void;
  'taskComplete': (result: TaskResult) => void;
  'taskError': (taskId: string, error: Error) => void;
  'agentChange': (agentType: AgentType) => void;
  'toolExecution': (toolName: string, args: any) => void;
  'llmRequest': (messages: ChatMessage[]) => void;
  'llmResponse': (response: string) => void;
  'error': (error: Error) => void;
  'ready': () => void;
  'destroyed': () => void;
}