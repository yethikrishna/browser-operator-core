// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { createAgentNode, createFinalNode, createToolExecutorNode, routeNextNode } from './Graph.js';
import { createLogger } from './Logger.js';
import { StateGraph } from './StateGraph.js';
import { NodeType } from './Types.js';
const logger = createLogger('ConfigurableGraph');
/**
 * Creates a compiled agent graph from a configuration object.
 *
 * @param config The graph configuration with model information.
 * @returns A compiled StateGraph.
 */
export function createAgentGraphFromConfig(config) {
    logger.info(`Creating graph from config: ${config.name} with model: ${config.modelName}`);
    const graph = new StateGraph({ name: config.name });
    const nodeFactories = {
        agent: () => createAgentNode(config.modelName, config.temperature || 0),
        final: () => createFinalNode(),
        toolExecutor: (nodeCfg) => {
            return {
                invoke: async (state) => {
                    logger.warn(`ToolExecutorNode "${nodeCfg.name}" invoked without being dynamically replaced. This indicates an issue.`);
                    return { ...state, error: `ToolExecutor ${nodeCfg.name} not properly initialized.` };
                }
            };
        },
    };
    for (const nodeConfig of config.nodes) {
        const factory = nodeFactories[nodeConfig.type];
        if (factory) {
            const nodeInstance = factory(nodeConfig, graph);
            graph.addNode(nodeConfig.name, nodeInstance);
            logger.debug(`Added node: ${nodeConfig.name} (type: ${nodeConfig.type})`);
        }
        else {
            logger.warn(`Unknown node type: ${nodeConfig.type} for node ${nodeConfig.name}. Adding a dummy error node.`);
            graph.addNode(nodeConfig.name, {
                invoke: async (state) => {
                    logger.error(`Dummy node ${nodeConfig.name} invoked due to unknown type ${nodeConfig.type}`);
                    return { ...state, error: `Unknown node type ${nodeConfig.type} for ${nodeConfig.name}` };
                }
            });
        }
    }
    const conditionFactories = {
        routeBasedOnLastMessage: state => routeNextNode(state),
        alwaysAgent: () => NodeType.AGENT.toString(),
        routeOrPrepareToolExecutor: (state, graphInstance, edgeConfig) => {
            const routingKey = routeNextNode(state);
            if (routingKey === NodeType.TOOL_EXECUTOR.toString()) {
                const toolExecutorNodeName = edgeConfig.targetMap[NodeType.TOOL_EXECUTOR.toString()];
                if (toolExecutorNodeName && toolExecutorNodeName !== '__end__') {
                    logger.debug(`Dynamically creating/updating tool executor: ${toolExecutorNodeName}`);
                    const toolExecutorInstance = createToolExecutorNode(state);
                    graphInstance.addNode(toolExecutorNodeName, toolExecutorInstance);
                }
                else {
                    logger.error('Tool executor node name not found in targetMap or is __end__. Routing to __end__.');
                    return '__end__';
                }
            }
            return routingKey;
        },
    };
    for (const edgeConfig of config.edges) {
        const conditionFactory = conditionFactories[edgeConfig.conditionType];
        if (conditionFactory) {
            const conditionFn = (state) => {
                return conditionFactory(state, graph, edgeConfig);
            };
            graph.addConditionalEdges(edgeConfig.source, conditionFn, edgeConfig.targetMap);
            logger.debug(`Added edge from ${edgeConfig.source} via ${edgeConfig.conditionType}`);
        }
        else {
            logger.warn(`Unknown condition type: ${edgeConfig.conditionType} for edge from ${edgeConfig.source}`);
        }
    }
    if (config.nodes.find(n => n.name === config.entryPoint)) {
        graph.setEntryPoint(config.entryPoint);
        logger.debug(`Set entry point to: ${config.entryPoint}`);
    }
    else {
        logger.error(`Entry point "${config.entryPoint}" not found in defined nodes.`);
        if (config.nodes.length > 0) {
            const fallbackEntryPoint = config.nodes[0].name;
            graph.setEntryPoint(fallbackEntryPoint);
            logger.warn(`Setting entry point to fallback: ${fallbackEntryPoint}`);
        }
        else {
            throw new Error('[ConfigurableGraph] No nodes defined in graph config, cannot set entry point.');
        }
    }
    return graph.compile();
}
//# sourceMappingURL=ConfigurableGraph.js.map