import { EventEmitter } from 'eventemitter3';
import type {
  BrowserOperatorConfig,
  BrowserOperatorEvents,
  Task,
  TaskResult,
  AIResponse,
  RequestOptions,
  AgentType,
  CustomAgentConfig,
  LLMProvider
} from '../types';
import { AgentOrchestrator } from './AgentOrchestrator';
import { ToolRegistry } from './ToolRegistry';
import { LLMProviderFactory } from './LLMProvider';

/**
 * Main entry point for Browser Operator Core
 * Provides a clean API for integrating AI-powered web automation
 */
export class BrowserOperatorCore extends EventEmitter<BrowserOperatorEvents> {
  private config: BrowserOperatorConfig;
  private orchestrator: AgentOrchestrator | null = null;
  private llmProvider: LLMProvider | null = null;
  private toolRegistry: ToolRegistry;
  private initialized = false;
  private taskQueue: Task[] = [];
  private activeTasks = new Map<string, Task>();

  constructor(config: BrowserOperatorConfig) {
    super();
    this.config = { ...config };
    this.toolRegistry = new ToolRegistry();
    
    // Bind event handlers if provided
    if (config.onTaskStart) this.on('taskStart', config.onTaskStart);
    if (config.onTaskProgress) this.on('taskProgress', config.onTaskProgress);
    if (config.onTaskComplete) this.on('taskComplete', config.onTaskComplete);
    if (config.onError) this.on('error', config.onError);
  }

  /**
   * Initialize Browser Operator with the provided configuration
   */
  async initialize(): Promise<void> {
    try {
      // Initialize LLM Provider
      this.llmProvider = await LLMProviderFactory.create({
        provider: this.config.llmProvider,
        apiKey: this.config.apiKey,
        model: this.config.model,
        baseURL: this.config.baseURL
      });

      // Initialize Tool Registry
      await this.toolRegistry.initialize(this.config.enabledTools);

      // Initialize Agent Orchestrator
      this.orchestrator = new AgentOrchestrator({
        llmProvider: this.llmProvider,
        toolRegistry: this.toolRegistry,
        defaultAgentType: this.config.defaultAgentType,
        debugMode: this.config.debugMode || false
      });

      // Register custom agents
      if (this.config.customAgents) {
        for (const agent of this.config.customAgents) {
          this.orchestrator.registerCustomAgent(agent);
        }
      }

      this.initialized = true;
      this.emit('ready');
    } catch (error) {
      this.emit('error', error as Error);
      throw error;
    }
  }

  /**
   * Process a natural language request using the AI agent system
   */
  async processRequest(query: string, options?: RequestOptions): Promise<AIResponse> {
    if (!this.initialized || !this.orchestrator) {
      throw new Error('BrowserOperatorCore not initialized. Call initialize() first.');
    }

    const task: Task = {
      id: this.generateTaskId(),
      type: 'process_request',
      query,
      agentType: options?.agentType || this.config.defaultAgentType,
      priority: options?.priority || 'medium',
      timeout: options?.timeout || 30000,
      parameters: {
        tools: options?.tools,
        maxTokens: options?.maxTokens,
        temperature: options?.temperature
      }
    };

    return this.executeTask(task);
  }

  /**
   * Execute a specific task
   */
  async executeTask(task: Task): Promise<AIResponse> {
    if (!this.initialized || !this.orchestrator) {
      throw new Error('BrowserOperatorCore not initialized. Call initialize() first.');
    }

    this.activeTasks.set(task.id, task);
    this.emit('taskStart', task);

    try {
      const result = await this.orchestrator.executeTask(task, {
        onProgress: (progress) => {
          this.emit('taskProgress', {
            taskId: task.id,
            progress: progress.progress,
            currentStep: progress.step,
            message: progress.message
          });
        }
      });

      this.activeTasks.delete(task.id);
      this.emit('taskComplete', {
        id: task.id,
        success: true,
        data: result,
        metadata: result.metadata
      });

      return result;
    } catch (error) {
      this.activeTasks.delete(task.id);
      this.emit('taskError', task.id, error as Error);
      throw error;
    }
  }

  /**
   * Register a custom agent
   */
  registerCustomAgent(agent: CustomAgentConfig): void {
    if (!this.orchestrator) {
      throw new Error('BrowserOperatorCore not initialized.');
    }
    this.orchestrator.registerCustomAgent(agent);
  }

  /**
   * Change the current LLM provider
   */
  async setLLMProvider(provider: string, apiKey?: string, model?: string): Promise<void> {
    try {
      this.llmProvider = await LLMProviderFactory.create({
        provider,
        apiKey: apiKey || this.config.apiKey,
        model: model || this.config.model,
        baseURL: this.config.baseURL
      });

      if (this.orchestrator) {
        this.orchestrator.updateLLMProvider(this.llmProvider);
      }
    } catch (error) {
      this.emit('error', error as Error);
      throw error;
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<BrowserOperatorConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<BrowserOperatorConfig>): void {
    this.config = { ...this.config, ...updates };
    
    // Update orchestrator if needed
    if (this.orchestrator) {
      this.orchestrator.updateConfig({
        defaultAgentType: this.config.defaultAgentType,
        debugMode: this.config.debugMode || false
      });
    }
  }

  /**
   * Get list of available agents
   */
  getAvailableAgents(): AgentType[] {
    return this.config.availableAgents || [
      AgentType.SEARCH,
      AgentType.DEEP_RESEARCH,
      AgentType.SHOPPING
    ];
  }

  /**
   * Get list of available tools
   */
  getAvailableTools(): string[] {
    return this.toolRegistry.getAvailableTools();
  }

  /**
   * Get active tasks
   */
  getActiveTasks(): Task[] {
    return Array.from(this.activeTasks.values());
  }

  /**
   * Cancel a task
   */
  cancelTask(taskId: string): void {
    if (this.activeTasks.has(taskId)) {
      // TODO: Implement task cancellation logic
      this.activeTasks.delete(taskId);
      this.emit('taskError', taskId, new Error('Task cancelled'));
    }
  }

  /**
   * Check if Browser Operator is ready
   */
  isReady(): boolean {
    return this.initialized && !!this.orchestrator && !!this.llmProvider;
  }

  /**
   * Destroy instance and cleanup resources
   */
  destroy(): void {
    // Cancel all active tasks
    for (const taskId of this.activeTasks.keys()) {
      this.cancelTask(taskId);
    }

    // Cleanup resources
    if (this.orchestrator) {
      this.orchestrator.destroy();
    }
    
    this.toolRegistry.destroy();
    this.removeAllListeners();
    this.initialized = false;
    
    this.emit('destroyed');
  }

  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}