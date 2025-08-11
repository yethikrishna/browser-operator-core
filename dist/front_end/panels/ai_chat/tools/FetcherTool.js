// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { createLogger } from '../core/Logger.js';
import { HTMLToMarkdownTool } from './HTMLToMarkdownTool.js';
import { NavigateURLTool } from './Tools.js';
const logger = createLogger('Tool:Fetcher');
/**
 * Agent that fetches and extracts content from URLs
 *
 * This agent takes a list of URLs, navigates to each one, and extracts
 * the main content as markdown. It uses NavigateURLTool for navigation
 * and HTMLToMarkdownTool for content extraction.
 */
export class FetcherTool {
    constructor() {
        this.name = 'fetcher_tool';
        this.description = 'Navigates to URLs, extracts and cleans the main content, returning markdown for each source';
        this.schema = {
            type: 'object',
            properties: {
                urls: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'List of URLs to fetch content from'
                },
                reasoning: {
                    type: 'string',
                    description: 'Reasoning for the action, displayed to the user'
                }
            },
            required: ['urls', 'reasoning']
        };
        this.navigateURLTool = new NavigateURLTool();
        this.htmlToMarkdownTool = new HTMLToMarkdownTool();
    }
    /**
     * Execute the fetcher agent to process multiple URLs
     */
    async execute(args) {
        logger.info('Executing with args', { args });
        const { urls, reasoning } = args;
        // Validate input
        if (!Array.isArray(urls) || urls.length === 0) {
            return {
                sources: [],
                success: false,
                error: 'No URLs provided'
            };
        }
        // Process all provided URLs
        const urlsToProcess = urls;
        const results = [];
        // Process each URL sequentially
        for (const url of urlsToProcess) {
            try {
                logger.info('Processing URL', { url });
                const fetchedContent = await this.fetchContentFromUrl(url, reasoning);
                results.push(fetchedContent);
            }
            catch (error) {
                logger.error('Error processing URL', { url, error: error.message, stack: error.stack });
                results.push({
                    url,
                    title: '',
                    markdownContent: '',
                    success: false,
                    error: `Failed to process URL: ${error.message}`
                });
            }
        }
        return {
            sources: results,
            success: results.some(r => r.success) // Consider successful if at least one URL was processed
        };
    }
    /**
     * Fetch and extract content from a single URL
     */
    async fetchContentFromUrl(url, reasoning) {
        try {
            // Step 1: Navigate to the URL
            logger.info('Navigating to URL', { url });
            // Note: NavigateURLTool requires both url and reasoning parameters
            const navigationResult = await this.navigateURLTool.execute({
                url,
                reasoning: `Navigating to ${url} to extract content for research`
            });
            // Check for navigation errors
            if ('error' in navigationResult) {
                return {
                    url,
                    title: '',
                    markdownContent: '',
                    success: false,
                    error: navigationResult.error
                };
            }
            // Wait for 1 second to ensure the page has time to load
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Get metadata from navigation result
            const metadata = navigationResult.metadata ? navigationResult.metadata : { url: '', title: '' };
            // Step 2: Extract markdown content using HTMLToMarkdownTool
            logger.info('Extracting content from URL', { url });
            const extractionResult = await this.htmlToMarkdownTool.execute({
                instruction: 'Extract the main content focusing on article text, headings, and important information. Remove ads, navigation, and distracting elements.',
                reasoning
            });
            // Check for extraction errors
            if (!extractionResult.success || !extractionResult.markdownContent) {
                return {
                    url,
                    title: metadata?.title || '',
                    markdownContent: '',
                    success: false,
                    error: extractionResult.error || 'Failed to extract content'
                };
            }
            // Return the fetched content
            return {
                url: metadata?.url || url,
                title: metadata?.title || '',
                markdownContent: extractionResult.markdownContent,
                success: true
            };
        }
        catch (error) {
            logger.error('Error processing URL', { url, error: error.message, stack: error.stack });
            return {
                url,
                title: '',
                markdownContent: '',
                success: false,
                error: `Error fetching content: ${error.message}`
            };
        }
    }
}
//# sourceMappingURL=FetcherTool.js.map