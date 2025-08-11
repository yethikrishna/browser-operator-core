// Copyright 2025 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Log levels in order of severity
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["TRACE"] = 0] = "TRACE";
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARN"] = 3] = "WARN";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
    LogLevel[LogLevel["OFF"] = 5] = "OFF";
})(LogLevel || (LogLevel = {}));
/**
 * Logger instance for a specific module
 */
export class Logger {
    constructor(module) {
        this.module = module;
    }
    /**
     * Configure global logger settings
     */
    static configure(config) {
        Logger.config = { ...Logger.config, ...config };
    }
    /**
     * Add a custom log handler
     */
    static addHandler(handler) {
        Logger.logHandlers.push(handler);
    }
    /**
     * Remove all custom handlers
     */
    static clearHandlers() {
        Logger.logHandlers = [];
    }
    /**
     * Check if we're in development mode
     */
    static isDevelopment() {
        // Check for development indicators
        return location.hostname === 'localhost' ||
            location.hostname.includes('127.0.0.1') ||
            location.port === '8090' ||
            location.port === '8000';
    }
    /**
     * Get effective log level for a module
     */
    getEffectiveLevel() {
        if (!Logger.config.enabled) {
            return LogLevel.OFF;
        }
        const moduleLevel = Logger.config.moduleLevels?.[this.module];
        if (moduleLevel !== undefined) {
            return moduleLevel;
        }
        // Always respect the configured level (removed production restriction)
        return Logger.config.level;
    }
    /**
     * Core logging method
     */
    log(level, message, data) {
        const effectiveLevel = this.getEffectiveLevel();
        if (level < effectiveLevel) {
            return;
        }
        const entry = {
            level,
            module: this.module,
            message,
            timestamp: new Date(),
            data,
        };
        // Add source information if enabled
        if (Logger.config.includeSource) {
            const stack = new Error().stack;
            if (stack) {
                const sourceMatch = stack.split('\n')[3]?.match(/at\s+(.+):(\d+):(\d+)/);
                if (sourceMatch) {
                    entry.source = {
                        file: sourceMatch[1],
                        line: parseInt(sourceMatch[2], 10),
                        column: parseInt(sourceMatch[3], 10),
                    };
                }
            }
        }
        // Process with handlers
        if (Logger.logHandlers.length > 0) {
            Logger.logHandlers.forEach(handler => handler(entry));
        }
        // Default console output
        this.consoleOutput(entry);
    }
    /**
     * Output to console with proper formatting
     */
    consoleOutput(entry) {
        const { level, module, message, timestamp, data, source } = entry;
        // Build prefix
        const parts = [];
        if (Logger.config.includeTimestamp) {
            parts.push(`[${timestamp.toISOString()}]`);
        }
        parts.push(`[${LogLevel[level]}]`);
        parts.push(`[${module}]`);
        const prefix = parts.join(' ');
        // Convert \n to actual newlines and unescape quotes for better readability
        let formattedMessage = message.replace(/\\n/g, '\n').replace(/\\"/g, '"');
        // For very long multi-line messages, add some visual separation
        if (formattedMessage.includes('\n') && formattedMessage.length > 200) {
            formattedMessage = formattedMessage.replace(/^/, '\n').replace(/$/, '\n');
        }
        // Choose console method based on level
        const consoleMethod = this.getConsoleMethod(level);
        if (data !== undefined) {
            // When data is provided, log message and data separately
            consoleMethod(`${prefix} ${formattedMessage}`, data);
        }
        else {
            // For all messages, use a single console call to avoid repeated source locations
            consoleMethod(`${prefix} ${formattedMessage}`);
        }
    }
    /**
     * Get the appropriate console method for a log level
     */
    getConsoleMethod(level) {
        switch (level) {
            case LogLevel.TRACE:
                return console.log.bind(console); // Use console.log for visibility
            case LogLevel.DEBUG:
                return console.log.bind(console); // Use console.log for visibility
            case LogLevel.INFO:
                return console.log.bind(console);
            case LogLevel.WARN:
                return console.warn.bind(console);
            case LogLevel.ERROR:
                return console.error.bind(console);
            default:
                return console.log.bind(console);
        }
    }
    /**
     * Log a trace message (most verbose)
     */
    trace(message, data) {
        this.log(LogLevel.TRACE, message, data);
    }
    /**
     * Log a debug message
     */
    debug(message, data) {
        this.log(LogLevel.DEBUG, message, data);
    }
    /**
     * Log an info message
     */
    info(message, data) {
        this.log(LogLevel.INFO, message, data);
    }
    /**
     * Log a warning message
     */
    warn(message, data) {
        this.log(LogLevel.WARN, message, data);
    }
    /**
     * Log an error message
     */
    error(message, error) {
        const entry = {
            level: LogLevel.ERROR,
            module: this.module,
            message,
            timestamp: new Date(),
            error: error instanceof Error ? error : undefined,
            data: error instanceof Error ? undefined : error,
        };
        if (Logger.config.includeSource) {
            const stack = new Error().stack;
            if (stack) {
                const sourceMatch = stack.split('\n')[2]?.match(/at\s+(.+):(\d+):(\d+)/);
                if (sourceMatch) {
                    entry.source = {
                        file: sourceMatch[1],
                        line: parseInt(sourceMatch[2], 10),
                        column: parseInt(sourceMatch[3], 10),
                    };
                }
            }
        }
        // Process with handlers
        if (Logger.logHandlers.length > 0) {
            Logger.logHandlers.forEach(handler => handler(entry));
        }
        // Console output with error
        const prefix = Logger.config.includeTimestamp
            ? `[${entry.timestamp.toISOString()}] [ERROR] [${this.module}]`
            : `[ERROR] [${this.module}]`;
        // Convert \n to actual newlines and unescape quotes in error messages too
        let formattedMessage = message.replace(/\\n/g, '\n').replace(/\\"/g, '"');
        // For very long multi-line error messages, add some visual separation
        if (formattedMessage.includes('\n') && formattedMessage.length > 200) {
            formattedMessage = formattedMessage.replace(/^/, '\n').replace(/$/, '\n');
        }
        if (entry.error) {
            console.error(`${prefix} ${formattedMessage}`, entry.error);
        }
        else if (entry.data !== undefined) {
            console.error(`${prefix} ${formattedMessage}`, entry.data);
        }
        else {
            console.error(`${prefix} ${formattedMessage}`);
        }
    }
    /**
     * Create a child logger with a sub-module name
     */
    child(subModule) {
        return new Logger(`${this.module}:${subModule}`);
    }
}
/**
 * Default configuration for production builds
 *
 * To change the default log level:
 * - For production: Change DEFAULT_LOG_LEVEL below
 * - For development: Runs with DEBUG level automatically on localhost
 * - At runtime: Use Logger.configure({ level: LogLevel.WARN })
 */
Logger.DEFAULT_LOG_LEVEL = LogLevel.INFO;
Logger.config = {
    level: Logger.DEFAULT_LOG_LEVEL,
    enabled: true,
    includeTimestamp: true,
    includeSource: false,
};
Logger.logHandlers = [];
/**
 * Factory function to create a logger for a module
 */
export function createLogger(module) {
    return new Logger(module);
}
/**
 * Development-time logger configuration
 */
if (Logger['isDevelopment']()) {
    Logger.configure({
        level: LogLevel.DEBUG,
        includeTimestamp: true,
        includeSource: true,
    });
}
/**
 * Export for global configuration
 */
export const LoggerConfig = Logger;
//# sourceMappingURL=Logger.js.map