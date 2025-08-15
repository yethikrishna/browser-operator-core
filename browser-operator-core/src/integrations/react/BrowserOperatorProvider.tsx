import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { BrowserOperatorCore } from '../../core/BrowserOperatorCore';
import type { 
  BrowserOperatorConfig, 
  Task, 
  TaskResult, 
  TaskProgress, 
  AgentType 
} from '../../types';

interface BrowserOperatorContextType {
  browserOperator: BrowserOperatorCore | null;
  isReady: boolean;
  isLoading: boolean;
  error: Error | null;
  activeTasks: Task[];
  
  // Methods
  processRequest: (query: string, agentType?: AgentType) => Promise<any>;
  executeTask: (task: Task) => Promise<any>;
  setAgentType: (agentType: AgentType) => void;
  cancelTask: (taskId: string) => void;
}

const BrowserOperatorContext = createContext<BrowserOperatorContextType | null>(null);

interface BrowserOperatorProviderProps {
  config: BrowserOperatorConfig;
  children: ReactNode;
  onTaskStart?: (task: Task) => void;
  onTaskProgress?: (progress: TaskProgress) => void;
  onTaskComplete?: (result: TaskResult) => void;
  onError?: (error: Error) => void;
}

/**
 * React Context Provider for Browser Operator
 */
export const BrowserOperatorProvider: React.FC<BrowserOperatorProviderProps> = ({
  config,
  children,
  onTaskStart,
  onTaskProgress,
  onTaskComplete,
  onError
}) => {
  const [browserOperator, setBrowserOperator] = useState<BrowserOperatorCore | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [currentAgentType, setCurrentAgentType] = useState<AgentType>(config.defaultAgentType);

  useEffect(() => {
    const initBrowserOperator = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const instance = new BrowserOperatorCore({
          ...config,
          onTaskStart: (task) => {
            setActiveTasks(prev => [...prev, task]);
            onTaskStart?.(task);
          },
          onTaskProgress: (progress) => {
            onTaskProgress?.(progress);
          },
          onTaskComplete: (result) => {
            setActiveTasks(prev => prev.filter(task => task.id !== result.id));
            onTaskComplete?.(result);
          },
          onError: (err) => {
            setError(err);
            onError?.(err);
          }
        });

        // Setup event listeners
        instance.on('ready', () => {
          setIsReady(true);
          setIsLoading(false);
        });

        instance.on('error', (err) => {
          setError(err);
          setIsLoading(false);
        });

        instance.on('taskStart', (task) => {
          setActiveTasks(prev => [...prev, task]);
        });

        instance.on('taskComplete', (result) => {
          setActiveTasks(prev => prev.filter(task => task.id !== result.id));
        });

        instance.on('taskError', (taskId, err) => {
          setActiveTasks(prev => prev.filter(task => task.id !== taskId));
          setError(err);
        });

        await instance.initialize();
        setBrowserOperator(instance);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    initBrowserOperator();

    // Cleanup
    return () => {
      if (browserOperator) {
        browserOperator.destroy();
      }
    };
  }, [config]);

  const processRequest = async (query: string, agentType?: AgentType) => {
    if (!browserOperator) {
      throw new Error('BrowserOperator not initialized');
    }
    
    return browserOperator.processRequest(query, { 
      agentType: agentType || currentAgentType 
    });
  };

  const executeTask = async (task: Task) => {
    if (!browserOperator) {
      throw new Error('BrowserOperator not initialized');
    }
    
    return browserOperator.executeTask(task);
  };

  const setAgentType = (agentType: AgentType) => {
    setCurrentAgentType(agentType);
    if (browserOperator) {
      browserOperator.updateConfig({ defaultAgentType: agentType });
    }
  };

  const cancelTask = (taskId: string) => {
    if (browserOperator) {
      browserOperator.cancelTask(taskId);
    }
  };

  const contextValue: BrowserOperatorContextType = {
    browserOperator,
    isReady,
    isLoading,
    error,
    activeTasks,
    processRequest,
    executeTask,
    setAgentType,
    cancelTask
  };

  return (
    <BrowserOperatorContext.Provider value={contextValue}>
      {children}
    </BrowserOperatorContext.Provider>
  );
};

/**
 * Hook to use Browser Operator in React components
 */
export const useBrowserOperator = () => {
  const context = useContext(BrowserOperatorContext);
  
  if (!context) {
    throw new Error('useBrowserOperator must be used within a BrowserOperatorProvider');
  }
  
  return context;
};