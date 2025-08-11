// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Interface for visit history data
import { createLogger } from '../core/Logger.js';
const logger = createLogger('VisitHistoryManager');
// Class for storing and retrieving visited page data
export class VisitHistoryManager {
    static getInstance() {
        if (!VisitHistoryManager.instance) {
            VisitHistoryManager.instance = new VisitHistoryManager();
        }
        return VisitHistoryManager.instance;
    }
    constructor() {
        this.dbName = 'visitHistoryDB';
        this.storeName = 'visitHistory';
        this.dbVersion = 1;
        this.db = null;
        this.initialized = false;
        this.initDB();
    }
    async initDB() {
        // TODO: Add ability to disable visit history
        return await new Promise((resolve, reject) => {
            if (this.initialized) {
                resolve();
                return;
            }
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = event => {
                logger.error('Error opening visit history database:', event);
                reject(new Error('Failed to open database'));
            };
            request.onsuccess = event => {
                this.db = event.target.result;
                this.initialized = true;
                logger.info('Visit history database opened successfully');
                resolve();
            };
            request.onupgradeneeded = event => {
                const db = event.target.result;
                // Create the store with an auto-incrementing key
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                    // Create indices for searching
                    store.createIndex('urlIndex', 'url', { unique: false });
                    store.createIndex('domainIndex', 'domain', { unique: false });
                    store.createIndex('timestampIndex', 'timestamp', { unique: false });
                    store.createIndex('keywordsIndex', 'keywords', { unique: false, multiEntry: true });
                    logger.info('Visit history object store created');
                }
            };
        });
    }
    /**
     * Extracts keywords from page content
     * Basic implementation using frequency analysis
     */
    async extractKeywords(text, accessibilityTree) {
        // Combine text sources
        const combinedText = [
            text || '',
            accessibilityTree || ''
        ].join(' ');
        // Get only meaningful words (filter out common words, short words)
        const words = combinedText.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 &&
            !['this', 'that', 'with', 'from', 'have', 'some', 'what', 'were', 'when', 'your', 'will', 'been', 'they', 'them'].includes(word));
        // Count word frequency
        const wordCounts = new Map();
        for (const word of words) {
            wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        }
        // Sort by frequency and take top 10 words
        const keywords = Array.from(wordCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
        return keywords;
    }
    /**
     * Extracts domain from URL
     */
    extractDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname;
        }
        catch (e) {
            logger.error('Error extracting domain from URL:', e);
            return '';
        }
    }
    /**
     * Stores a page visit in the database
     */
    async storeVisit(pageInfo, accessibilityTree) {
        await this.initDB();
        if (!this.db) {
            logger.error('Database not initialized');
            return;
        }
        try {
            const { url, title } = pageInfo;
            const domain = this.extractDomain(url);
            const keywords = await this.extractKeywords(title, accessibilityTree);
            const visitData = {
                url,
                domain,
                title,
                timestamp: Date.now(),
                keywords
            };
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            // First check if we already have a recent entry for this URL
            const urlIndex = store.index('urlIndex');
            const existingEntries = await new Promise(resolve => {
                const result = [];
                const request = urlIndex.openCursor(IDBKeyRange.only(url));
                request.onsuccess = event => {
                    const cursor = event.target.result;
                    if (cursor) {
                        result.push(cursor);
                        cursor.continue();
                    }
                    else {
                        resolve(result);
                    }
                };
                request.onerror = () => resolve([]);
            });
            // Check if we have a recent entry (within last hour)
            const oneHourAgo = Date.now() - (60 * 60 * 1000);
            const recentEntry = existingEntries.find(cursor => {
                // Add null check before accessing cursor.value and its properties
                if (!cursor?.value) {
                    return false;
                }
                const value = cursor.value;
                return value && value.timestamp > oneHourAgo;
            });
            if (recentEntry?.value) {
                // Update the existing entry with new timestamp and possibly new keywords
                const existingData = recentEntry.value;
                const updatedData = {
                    ...existingData,
                    timestamp: Date.now(),
                    // Merge keywords, remove duplicates
                    keywords: [...new Set([...existingData.keywords, ...keywords])]
                };
                store.put(updatedData);
            }
            else {
                // Add new entry
                store.add(visitData);
            }
            logger.info('Stored visit:', visitData);
        }
        catch (error) {
            logger.error('Error storing visit:', error);
        }
    }
    /**
     * Retrieves visit history filtered by domain
     */
    async getVisitsByDomain(domain) {
        await this.initDB();
        if (!this.db) {
            logger.error('Database not initialized');
            return [];
        }
        return await new Promise(resolve => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('domainIndex');
            const results = [];
            const request = index.openCursor(IDBKeyRange.only(domain));
            request.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve(results);
                }
            };
            request.onerror = () => {
                logger.error('Error retrieving visits by domain');
                resolve([]);
            };
        });
    }
    /**
     * Retrieves visit history filtered by keyword
     */
    async getVisitsByKeyword(keyword) {
        await this.initDB();
        if (!this.db) {
            logger.error('Database not initialized');
            return [];
        }
        return await new Promise(resolve => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('keywordsIndex');
            const results = [];
            const request = index.openCursor(IDBKeyRange.only(keyword.toLowerCase()));
            request.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve(results);
                }
            };
            request.onerror = () => {
                logger.error('Error retrieving visits by keyword');
                resolve([]);
            };
        });
    }
    /**
     * Retrieves all visit history within a date range
     */
    async getVisitsByDateRange(startTime, endTime) {
        await this.initDB();
        if (!this.db) {
            logger.error('Database not initialized');
            return [];
        }
        return await new Promise(resolve => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const index = store.index('timestampIndex');
            const results = [];
            const request = index.openCursor(IDBKeyRange.bound(startTime, endTime));
            request.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve(results);
                }
            };
            request.onerror = () => {
                logger.error('Error retrieving visits by date range');
                resolve([]);
            };
        });
    }
    /**
     * Performs a search across all visit data using multiple criteria
     */
    async searchVisits(options) {
        await this.initDB();
        if (!this.db) {
            logger.error('Database not initialized');
            return [];
        }
        const { domain, keyword, startTime, endTime, limit = 100 } = options;
        return await new Promise(resolve => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const results = [];
            let request;
            // Choose the most efficient index based on provided filters
            if (domain) {
                const index = store.index('domainIndex');
                request = index.openCursor(IDBKeyRange.only(domain));
            }
            else if (keyword) {
                const index = store.index('keywordsIndex');
                request = index.openCursor(IDBKeyRange.only(keyword.toLowerCase()));
            }
            else if (startTime && endTime) {
                const index = store.index('timestampIndex');
                request = index.openCursor(IDBKeyRange.bound(startTime, endTime));
            }
            else {
                // No specific filter, get all sorted by timestamp (most recent first)
                const index = store.index('timestampIndex');
                request = index.openCursor(null, 'prev');
            }
            request.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    const data = cursor.value;
                    let matches = true;
                    // Apply additional filters that weren't used for the initial index selection
                    if (domain && data.domain !== domain) {
                        matches = false;
                    }
                    if (matches && keyword && !data.keywords.includes(keyword.toLowerCase())) {
                        matches = false;
                    }
                    if (matches && startTime && data.timestamp < startTime) {
                        matches = false;
                    }
                    if (matches && endTime && data.timestamp > endTime) {
                        matches = false;
                    }
                    if (matches) {
                        results.push(data);
                    }
                    // Stop when we hit the limit
                    if (results.length < limit) {
                        cursor.continue();
                    }
                    else {
                        resolve(results);
                    }
                }
                else {
                    resolve(results);
                }
            };
            request.onerror = () => {
                logger.error('Error searching visits');
                resolve([]);
            };
        });
    }
    /**
     * Clears all visit history data from the database
     */
    async clearHistory() {
        await this.initDB();
        if (!this.db) {
            logger.error('Database not initialized');
            return;
        }
        return await new Promise((resolve, reject) => {
            try {
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                // Clear all data from the store
                const request = store.clear();
                request.onsuccess = () => {
                    logger.info('Visit history cleared successfully');
                    resolve();
                };
                request.onerror = event => {
                    logger.error('Error clearing visit history:', event);
                    reject(new Error('Failed to clear visit history'));
                };
            }
            catch (error) {
                logger.error('Error clearing visit history:', error);
                reject(error);
            }
        });
    }
}
// Initialize VisitHistoryManager
VisitHistoryManager.getInstance();
//# sourceMappingURL=VisitHistoryManager.js.map