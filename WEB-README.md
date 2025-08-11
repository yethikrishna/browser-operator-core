# Browser Operator - Web Browser Version

Welcome to Browser Operator! This web browser version provides a functional AI assistant interface that runs directly in your web browser without requiring the Chromium build system.

## 🚀 Quick Start

### 1. Start the Web Server

```bash
# Install dependencies (if needed)
npm install

# Start the web server
npm run web
```

The server will start at `http://localhost:8080` by default.

### 2. Open in Your Browser

Navigate to `http://localhost:8080` in any modern web browser (Chrome, Firefox, Safari, Edge).

### 3. Configure Your AI Provider

1. Click the **⚙️ Settings** button in the chat header
2. Select your AI provider from the dropdown:
   - **OpenAI**: For GPT-4, GPT-3.5, etc.
   - **Anthropic (Claude)**: For Claude models
   - **Local/Ollama**: For locally hosted models
   - **Custom API**: For any OpenAI-compatible API
3. Enter your API key
4. Specify the model (e.g., `gpt-4`, `claude-3-sonnet`)
5. Click **Save Settings**

### 4. Start Chatting

Once configured, you can start asking questions and interacting with the AI assistant!

## 🌟 Features

### ✅ Currently Available
- **AI Chat Interface**: Full-featured chat with multiple AI providers
- **Settings Management**: Configure and save AI provider settings
- **Local Storage**: Your settings are saved in your browser
- **Multiple AI Providers**: Support for OpenAI, Anthropic, Ollama, and custom APIs
- **Responsive Design**: Works on desktop and mobile browsers
- **Dark/Light Theme**: Automatically adapts to your system preference

### 🔄 In Development
- **Full DevTools Integration**: Complete Chrome DevTools functionality
- **Web Automation**: Browser automation capabilities
- **Advanced AI Agents**: Multi-agent workflows
- **Backend Integration**: Connection to full Browser Operator backend services

## 🔧 Configuration

### Environment Variables

You can customize the server with environment variables:

```bash
# Custom port (default: 8080)
PORT=3000 npm run web

# Custom host (default: localhost)
HOST=0.0.0.0 npm run web
```

### AI Provider Setup

#### OpenAI
1. Get an API key from [OpenAI Platform](https://platform.openai.com)
2. Set provider to "OpenAI"
3. API URL will auto-populate to `https://api.openai.com/v1`
4. Enter your API key
5. Choose model: `gpt-4`, `gpt-3.5-turbo`, etc.

#### Anthropic (Claude)
1. Get an API key from [Anthropic Console](https://console.anthropic.com)
2. Set provider to "Anthropic (Claude)"
3. API URL will auto-populate to `https://api.anthropic.com/v1`
4. Enter your API key
5. Choose model: `claude-3-sonnet`, `claude-3-haiku`, etc.

#### Local/Ollama
1. Install [Ollama](https://ollama.ai) on your system
2. Pull a model: `ollama pull llama3`
3. Set provider to "Local/Ollama"
4. Set API URL to `http://localhost:11434/v1`
5. Leave API key empty (not required for local)
6. Set model to your pulled model name

#### Custom API
For any OpenAI-compatible API:
1. Set provider to "Custom API"
2. Enter your custom API URL
3. Enter your API key
4. Specify the model name

## 🛠️ Development

### Project Structure

```
browser-operator-core/
├── index.html          # Main web application entry point
├── web-server.js       # Simple Node.js web server
├── web-chat.js         # Enhanced chat interface implementation
├── web-chat.css        # Styles for the chat interface
├── package.json        # Updated with web scripts
└── front_end/          # Original DevTools frontend (future integration)
```

### Adding Features

The web version is designed to be easily extensible:

1. **Frontend**: Modify `web-chat.js` and `web-chat.css` for UI changes
2. **Server**: Extend `web-server.js` for backend functionality
3. **Integration**: Future DevTools integration will happen through `front_end/`

### Running in Production

For production deployment:

1. Use a proper web server (nginx, Apache) to serve static files
2. Set up HTTPS for secure API key handling
3. Consider using environment-based configuration
4. Set up proper CORS headers for API access

## 🔒 Security Notes

- **API Keys**: Stored locally in browser's localStorage
- **CORS**: May need configuration for some API providers
- **HTTPS**: Recommended for production use with real API keys
- **Local Storage**: Settings persist per browser/domain

## 🤝 Contributing

This web version is part of the larger Browser Operator project. Contributions are welcome!

1. **Bug Reports**: Use GitHub issues for bug reports
2. **Feature Requests**: Suggest new features via GitHub
3. **Pull Requests**: Submit PRs for improvements
4. **Documentation**: Help improve this documentation

## 📚 Next Steps

- **Try the Full Application**: For advanced features, try the desktop Browser Operator
- **Read the Documentation**: Check the main README.md for more details
- **Join the Community**: Connect with other users and developers

## 🆘 Troubleshooting

### Common Issues

**Q: Chat input is disabled**
A: Make sure you've configured an AI provider in Settings

**Q: "Failed to fetch" errors**
A: Check your API key and CORS settings for your chosen provider

**Q: Server won't start**
A: Make sure port 8080 is available, or use a different port with `PORT=3000 npm run web`

**Q: Settings aren't saving**
A: Check if your browser allows localStorage for the domain

### Getting Help

- Check the [main README](README.md) for general information
- Browse the [documentation](front_end/panels/ai_chat/docs/)
- Report issues on [GitHub](https://github.com/tysonthomas9/browser-operator-devtools-frontend/issues)

---

**Happy browsing with your AI assistant! 🤖✨**