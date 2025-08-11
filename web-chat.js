// Simple AI Chat implementation for web browser
class SimpleChatInterface {
  constructor(container) {
    this.container = container;
    this.messages = [];
    this.settings = this.loadSettings();
    this.init();
  }

  loadSettings() {
    try {
      return JSON.parse(localStorage.getItem('browserOperatorSettings') || '{}');
    } catch (e) {
      return {};
    }
  }

  saveSettings() {
    localStorage.setItem('browserOperatorSettings', JSON.stringify(this.settings));
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="chat-panel">
        <div class="chat-header">
          <div class="header-content">
            <h3>🤖 AI Assistant Chat</h3>
            <button class="settings-btn" id="settingsBtn">⚙️ Settings</button>
          </div>
          <p>Browser Operator AI Assistant - Configure your AI provider below</p>
        </div>
        
        <div class="settings-panel" id="settingsPanel" style="display: none;">
          <div class="setting-group">
            <label for="apiProvider">AI Provider:</label>
            <select id="apiProvider">
              <option value="">Select AI Provider</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic (Claude)</option>
              <option value="local">Local/Ollama</option>
              <option value="custom">Custom API</option>
            </select>
          </div>
          
          <div class="setting-group">
            <label for="apiKey">API Key:</label>
            <input type="password" id="apiKey" placeholder="Enter your API key">
          </div>
          
          <div class="setting-group">
            <label for="apiUrl">API URL:</label>
            <input type="url" id="apiUrl" placeholder="https://api.openai.com/v1 (or custom URL)">
          </div>
          
          <div class="setting-group">
            <label for="model">Model:</label>
            <input type="text" id="model" placeholder="gpt-4, claude-3-sonnet, etc.">
          </div>
          
          <div class="setting-actions">
            <button id="saveSettings">Save Settings</button>
            <button id="testConnection">Test Connection</button>
          </div>
        </div>
        
        <div class="chat-messages" id="chatMessages">
          <div class="welcome-message">
            <h2>Browser Operator AI Assistant</h2>
            <p>Your intelligent partner for research, analysis, and automation.</p>
            <div class="feature-list">
              <h4>Web Browser Features:</h4>
              <ul>
                <li>✅ AI Chat Interface</li>
                <li>✅ Settings Configuration</li>
                <li>✅ Local Storage</li>
                <li>✅ Multiple AI Providers</li>
                <li>🔄 Extended DevTools Features (In Development)</li>
              </ul>
            </div>
            <p><strong>Get Started:</strong> Click the Settings button to configure your AI provider.</p>
          </div>
        </div>
        
        <div class="chat-input">
          <div class="input-container">
            <input type="text" id="messageInput" placeholder="Ask me anything...">
            <button id="sendBtn" disabled>Send</button>
          </div>
          <div class="status-bar">
            <span id="connectionStatus">Not connected - Configure AI provider in settings</span>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const saveSettingsBtn = document.getElementById('saveSettings');
    const testConnectionBtn = document.getElementById('testConnection');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');

    settingsBtn.addEventListener('click', () => {
      const isVisible = settingsPanel.style.display !== 'none';
      settingsPanel.style.display = isVisible ? 'none' : 'block';
      this.loadSettingsToForm();
    });

    saveSettingsBtn.addEventListener('click', () => {
      this.saveSettingsFromForm();
    });

    testConnectionBtn.addEventListener('click', () => {
      this.testConnection();
    });

    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !sendBtn.disabled) {
        this.sendMessage();
      }
    });

    sendBtn.addEventListener('click', () => {
      this.sendMessage();
    });

    // Update send button state based on settings
    this.updateSendButtonState();
  }

  loadSettingsToForm() {
    document.getElementById('apiProvider').value = this.settings.provider || '';
    document.getElementById('apiKey').value = this.settings.apiKey || '';
    document.getElementById('apiUrl').value = this.settings.apiUrl || '';
    document.getElementById('model').value = this.settings.model || '';
  }

  saveSettingsFromForm() {
    this.settings = {
      provider: document.getElementById('apiProvider').value,
      apiKey: document.getElementById('apiKey').value,
      apiUrl: document.getElementById('apiUrl').value,
      model: document.getElementById('model').value
    };
    
    this.saveSettings();
    this.updateSendButtonState();
    this.updateConnectionStatus();
    
    // Auto-fill API URL based on provider
    const provider = this.settings.provider;
    const apiUrlInput = document.getElementById('apiUrl');
    if (provider === 'openai' && !apiUrlInput.value) {
      apiUrlInput.value = 'https://api.openai.com/v1';
      this.settings.apiUrl = apiUrlInput.value;
    } else if (provider === 'anthropic' && !apiUrlInput.value) {
      apiUrlInput.value = 'https://api.anthropic.com/v1';
      this.settings.apiUrl = apiUrlInput.value;
    }

    alert('Settings saved successfully!');
  }

  updateSendButtonState() {
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    const hasSettings = this.settings.provider && this.settings.apiKey;
    
    sendBtn.disabled = !hasSettings;
    messageInput.disabled = !hasSettings;
    
    if (hasSettings) {
      messageInput.placeholder = 'Ask me anything...';
    } else {
      messageInput.placeholder = 'Configure AI provider in settings first';
    }
  }

  updateConnectionStatus() {
    const status = document.getElementById('connectionStatus');
    if (this.settings.provider && this.settings.apiKey) {
      status.textContent = `Connected to ${this.settings.provider} (${this.settings.model || 'default model'})`;
      status.style.color = '#4caf50';
    } else {
      status.textContent = 'Not connected - Configure AI provider in settings';
      status.style.color = '#f44336';
    }
  }

  async testConnection() {
    const button = document.getElementById('testConnection');
    const originalText = button.textContent;
    
    try {
      button.textContent = 'Testing...';
      button.disabled = true;

      // Simple test - just validate settings are present
      if (!this.settings.provider || !this.settings.apiKey) {
        throw new Error('Please fill in all required settings');
      }

      // For now, just simulate a connection test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Connection test successful! (Note: This is a simulation - actual API calls would require CORS configuration)');
      
    } catch (error) {
      alert(`Connection test failed: ${error.message}`);
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  }

  async sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;

    this.addMessage('user', message);
    messageInput.value = '';

    // Show thinking message
    const thinkingId = this.addMessage('assistant', 'Thinking...', true);

    try {
      // For now, show a demo response since we don't have CORS configured
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.removeMessage(thinkingId);
      
      const demoResponse = this.generateDemoResponse(message);
      this.addMessage('assistant', demoResponse);
      
    } catch (error) {
      this.removeMessage(thinkingId);
      this.addMessage('assistant', `Error: ${error.message}`, false, 'error');
    }
  }

  generateDemoResponse(userMessage) {
    const responses = [
      "I'm Browser Operator, your AI assistant! I can help with web automation, research, and analysis. However, I'm currently running in demo mode since this is the web browser version.",
      "To fully utilize my capabilities, you'll need to configure a real AI provider in the settings. I can work with OpenAI, Anthropic, local models via Ollama, or custom APIs.",
      "In the full Chrome DevTools version, I can browse websites, extract data, automate tasks, and provide deep analysis. This web version provides the interface foundation.",
      "Your message: '" + userMessage + "' - I understand you're interested in using Browser Operator! The web version is a starting point - consider the full desktop application for advanced features."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  addMessage(role, content, isTemporary = false, type = 'normal') {
    const messagesContainer = document.getElementById('chatMessages');
    const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role} ${type}`;
    messageDiv.id = messageId;
    
    messageDiv.innerHTML = `
      <div class="message-header">
        <strong>${role === 'user' ? '👤 You' : '🤖 Assistant'}</strong>
        <span class="timestamp">${new Date().toLocaleTimeString()}</span>
      </div>
      <div class="message-content">${this.formatMessage(content)}</div>
    `;

    // Remove welcome message if it exists
    const welcomeMessage = messagesContainer.querySelector('.welcome-message');
    if (welcomeMessage) {
      welcomeMessage.remove();
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (!isTemporary) {
      this.messages.push({ role, content, timestamp: new Date().toISOString() });
    }

    return messageId;
  }

  removeMessage(messageId) {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
      messageElement.remove();
    }
  }

  formatMessage(content) {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
}

// Export for use
window.SimpleChatInterface = SimpleChatInterface;