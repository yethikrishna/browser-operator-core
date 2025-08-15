// Node.js Server Integration Example
// Demonstrates headless Browser Operator usage in server environment

const express = require('express');
const cors = require('cors');
const { processAIRequest, createHeadlessBrowserOperator, processBatchRequests } = require('browser-operator-core/headless');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Single AI request endpoint
app.post('/api/ai/process', async (req, res) => {
    try {
        const { query, agentType, llmProvider, apiKey, model } = req.body;
        
        if (!query || !llmProvider || !apiKey) {
            return res.status(400).json({ 
                error: 'Missing required fields: query, llmProvider, apiKey' 
            });
        }

        console.log(`Processing AI request: ${query}`);
        
        const result = await processAIRequest(query, {
            llmProvider,
            apiKey,
            model,
            agentType: agentType || 'search'
        });

        res.json({
            success: true,
            result: result,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('AI processing error:', error);
        res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Batch processing endpoint
app.post('/api/ai/batch', async (req, res) => {
    try {
        const { requests, llmProvider, apiKey, model, maxConcurrency } = req.body;
        
        if (!requests || !Array.isArray(requests) || !llmProvider || !apiKey) {
            return res.status(400).json({ 
                error: 'Missing required fields: requests (array), llmProvider, apiKey' 
            });
        }

        console.log(`Processing batch of ${requests.length} AI requests`);
        
        const results = await processBatchRequests(requests, {
            llmProvider,
            apiKey,
            model,
            maxConcurrency: maxConcurrency || 3
        });

        res.json({
            success: true,
            results: results,
            processed: results.length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Batch processing error:', error);
        res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Persistent session endpoint (for chat-like interactions)
const sessions = new Map(); // In production, use Redis or similar

app.post('/api/ai/session/create', async (req, res) => {
    try {
        const { llmProvider, apiKey, model, agentType } = req.body;
        
        if (!llmProvider || !apiKey) {
            return res.status(400).json({ 
                error: 'Missing required fields: llmProvider, apiKey' 
            });
        }

        const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const browserOp = await createHeadlessBrowserOperator({
            llmProvider,
            apiKey,
            model,
            defaultAgentType: agentType || 'search',
            headless: true,
            debugMode: false
        });

        sessions.set(sessionId, {
            browserOp,
            createdAt: new Date(),
            lastUsed: new Date()
        });

        // Auto-cleanup after 30 minutes of inactivity
        setTimeout(() => {
            const session = sessions.get(sessionId);
            if (session && Date.now() - session.lastUsed.getTime() > 30 * 60 * 1000) {
                session.browserOp.destroy();
                sessions.delete(sessionId);
            }
        }, 30 * 60 * 1000);

        res.json({
            success: true,
            sessionId: sessionId,
            expiresIn: '30 minutes of inactivity'
        });
        
    } catch (error) {
        console.error('Session creation error:', error);
        res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.post('/api/ai/session/:sessionId/process', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { query, agentType } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Missing query' });
        }

        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found or expired' });
        }

        session.lastUsed = new Date();

        const result = await session.browserOp.processRequest(query, { agentType });

        res.json({
            success: true,
            result: result,
            sessionId: sessionId,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Session processing error:', error);
        res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.delete('/api/ai/session/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    
    if (session) {
        session.browserOp.destroy();
        sessions.delete(sessionId);
        res.json({ success: true, message: 'Session destroyed' });
    } else {
        res.status(404).json({ error: 'Session not found' });
    }
});

// WebSocket support for real-time AI responses
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    let browserOp = null;

    socket.on('initialize', async (config) => {
        try {
            browserOp = await createHeadlessBrowserOperator(config);
            socket.emit('initialized', { success: true });
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('processRequest', async (data) => {
        if (!browserOp) {
            socket.emit('error', { message: 'Not initialized' });
            return;
        }

        try {
            socket.emit('processing', { message: 'Processing your request...' });
            
            const result = await browserOp.processRequest(data.query, { 
                agentType: data.agentType 
            });
            
            socket.emit('result', result);
        } catch (error) {
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        if (browserOp) {
            browserOp.destroy();
        }
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    
    // Cleanup all sessions
    for (const [sessionId, session] of sessions.entries()) {
        session.browserOp.destroy();
        sessions.delete(sessionId);
    }
    
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

server.listen(port, () => {
    console.log(`🚀 Browser Operator API Server running on http://localhost:${port}`);
    console.log('📚 API Endpoints:');
    console.log('  POST /api/ai/process - Single AI request');
    console.log('  POST /api/ai/batch - Batch AI processing');
    console.log('  POST /api/ai/session/create - Create persistent session');
    console.log('  POST /api/ai/session/:id/process - Process in session');
    console.log('  DELETE /api/ai/session/:id - Destroy session');
    console.log('  WebSocket: /socket.io/ - Real-time AI communication');
});

module.exports = app;