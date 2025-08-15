// Headless Browser Operator API
// For integration without UI components

export { BrowserOperatorCore } from './core/BrowserOperatorCore';
export * from './types';

// Simplified headless factory function
import { BrowserOperatorCore } from './core/BrowserOperatorCore';
import type { BrowserOperatorConfig, AIResponse, AgentType } from './types';

/**
 * Create a headless Browser Operator instance
 * Perfect for server-side, CLI, or background processing
 */
export async function createHeadlessBrowserOperator(config: Omit<BrowserOperatorConfig, 'theme' | 'compact' | 'showAdvancedOptions'>): Promise<BrowserOperatorCore> {
  const instance = new BrowserOperatorCore({
    ...config,
    headless: true
  });
  
  await instance.initialize();
  return instance;
}

/**
 * Simple function for one-off AI requests
 * No need to manage instances
 */
export async function processAIRequest(
  query: string, 
  config: {
    llmProvider: string;
    apiKey: string;
    model?: string;
    agentType?: AgentType;
  }
): Promise<AIResponse> {
  const browserOp = await createHeadlessBrowserOperator({
    llmProvider: config.llmProvider as any,
    apiKey: config.apiKey,
    model: config.model,
    defaultAgentType: config.agentType || ('search' as AgentType),
    headless: true,
    debugMode: false
  });

  try {
    const result = await browserOp.processRequest(query, { 
      agentType: config.agentType 
    });
    return result;
  } finally {
    browserOp.destroy();
  }
}

/**
 * Batch processing utility
 */
export async function processBatchRequests(
  requests: Array<{ query: string; agentType?: AgentType }>,
  config: {
    llmProvider: string;
    apiKey: string;
    model?: string;
    maxConcurrency?: number;
  }
): Promise<AIResponse[]> {
  const browserOp = await createHeadlessBrowserOperator({
    llmProvider: config.llmProvider as any,
    apiKey: config.apiKey,
    model: config.model,
    defaultAgentType: 'search' as AgentType,
    headless: true,
    maxConcurrentTasks: config.maxConcurrency || 3
  });

  try {
    const promises = requests.map(request => 
      browserOp.processRequest(request.query, { 
        agentType: request.agentType 
      })
    );
    
    return await Promise.all(promises);
  } finally {
    browserOp.destroy();
  }
}

// Export for Node.js/CommonJS compatibility
export default {
  BrowserOperatorCore,
  createHeadlessBrowserOperator,
  processAIRequest,
  processBatchRequests
};