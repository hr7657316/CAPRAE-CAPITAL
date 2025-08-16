class InboxManager {
    constructor() {
        this.currentTab = 'messages';
        this.selectedConversation = null;
        this.conversations = [
            {
                id: 1,
                name: "Sarah's Business",
                avatar: "SB",
                preview: "Hi! I'm interested in discussing...",
                time: "2h",
                unread: 2,
                messages: [
                    {
                        id: 1,
                        content: "Hi! I'm interested in discussing a potential acquisition. Could we schedule a call?",
                        sender: "other",
                        time: "2h ago"
                    },
                    {
                        id: 2,
                        content: "I've reviewed your buyer profile and think we might be a good match.",
                        sender: "other",
                        time: "2h ago"
                    }
                ]
            },
            {
                id: 2,
                name: "TechGrow Inc.",
                avatar: "TG",
                preview: "Thanks for reaching out. When would...",
                time: "1d",
                unread: 0,
                messages: [
                    {
                        id: 1,
                        content: "Thanks for reaching out. When would be a good time for a call?",
                        sender: "other",
                        time: "1d ago"
                    },
                    {
                        id: 2,
                        content: "I'm available tomorrow afternoon or Thursday morning.",
                        sender: "self",
                        time: "1d ago"
                    }
                ]
            },
            {
                id: 3,
                name: "Digital Labs",
                avatar: "DL",
                preview: "I'd like to schedule a call to discuss...",
                time: "3d",
                unread: 0,
                messages: [
                    {
                        id: 1,
                        content: "I'd like to schedule a call to discuss your business in more detail.",
                        sender: "other",
                        time: "3d ago"
                    }
                ]
            }
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.renderConversations();
    }
    
    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Conversation selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.conversation-item')) {
                const conversationId = parseInt(e.target.closest('.conversation-item').dataset.conversationId);
                this.selectConversation(conversationId);
            }
        });
        
        // Upgrade button
        const upgradeBtn = document.querySelector('.upgrade-cta-btn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => {
                this.showUpgradeModal();
            });
        }
        
        // Chat widget
        const chatButton = document.querySelector('.chat-button');
        if (chatButton) {
            chatButton.addEventListener('click', () => {
                this.toggleChatWidget();
            });
        }
    }
    
    switchTab(tab) {
        this.currentTab = tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Update content
        if (tab === 'messages') {
            this.renderConversations();
        } else if (tab === 'notifications') {
            this.renderNotifications();
        }
    }
    
    renderConversations() {
        const conversationsList = document.querySelector('.conversations-list');
        
        if (this.conversations.length === 0) {
            conversationsList.innerHTML = `
                <div class="empty-conversations">
                    <p class="empty-state-text">No conversations yet</p>
                </div>
            `;
            return;
        }
        
        conversationsList.innerHTML = this.conversations.map(conversation => `
            <div class="conversation-item" data-conversation-id="${conversation.id}">
                <div class="conversation-avatar">
                    <img src="${this.generateAvatar(conversation.avatar)}" alt="${conversation.avatar}">
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">${conversation.name}</div>
                    <div class="conversation-preview">${conversation.preview}</div>
                </div>
                <div class="conversation-meta">
                    <div class="conversation-time">${conversation.time}</div>
                    ${conversation.unread > 0 ? `<div class="conversation-badge">${conversation.unread}</div>` : ''}
                </div>
            </div>
        `).join('');
    }
    
    renderNotifications() {
        const conversationsList = document.querySelector('.conversations-list');
        
        conversationsList.innerHTML = `
            <div class="notifications-list">
                <div class="notification-item">
                    <div class="notification-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/>
                        </svg>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">New match available</div>
                        <div class="notification-text">TechCorp Industries is interested in your profile</div>
                        <div class="notification-time">1h ago</div>
                    </div>
                </div>
                
                <div class="notification-item">
                    <div class="notification-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">Profile viewed</div>
                        <div class="notification-text">Sarah's Business viewed your buyer profile</div>
                        <div class="notification-time">3h ago</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    selectConversation(conversationId) {
        this.selectedConversation = conversationId;
        
        // Update conversation selection in sidebar
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-conversation-id="${conversationId}"]`).classList.add('active');
        
        // Show upgrade message for now (since they need premium)
        this.showUpgradeMessage();
    }
    
    showUpgradeMessage() {
        const chatArea = document.querySelector('.chat-area');
        chatArea.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-illustration">
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="80" r="20" fill="#cbd5e1"/>
                        <rect x="85" y="100" width="30" height="60" rx="15" fill="#cbd5e1"/>
                        <rect x="70" y="115" width="15" height="30" rx="7" fill="#cbd5e1"/>
                        <rect x="115" y="115" width="15" height="30" rx="7" fill="#cbd5e1"/>
                        <circle cx="95" cy="75" r="2" fill="#64748b"/>
                        <circle cx="105" cy="75" r="2" fill="#64748b"/>
                        <path d="M95 85 Q100 90 105 85" stroke="#64748b" stroke-width="2" fill="none"/>
                        
                        <rect x="40" y="45" width="40" height="25" rx="12" fill="#6366f1"/>
                        <path d="M65 70 L70 75 L75 70" fill="#6366f1"/>
                        <circle cx="50" cy="52" r="1.5" fill="white"/>
                        <circle cx="55" cy="52" r="1.5" fill="white"/>
                        <circle cx="60" cy="52" r="1.5" fill="white"/>
                        <rect x="45" y="58" width="25" height="2" rx="1" fill="white"/>
                        <rect x="45" y="62" width="20" height="2" rx="1" fill="white"/>
                    </svg>
                </div>
                
                <div class="empty-state-content">
                    <h2>Upgrade your account to request startup access and chat with sellers</h2>
                    <p>You need a Premium account or higher to chat with sellers.</p>
                    
                    <button class="upgrade-cta-btn" onclick="inboxManager.showUpgradeModal()">
                        <span>Learn more and join</span>
                        <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
    
    showUpgradeModal() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'upgrade-modal-overlay';
        modal.innerHTML = `
            <div class="upgrade-modal">
                <div class="modal-header">
                    <h3>Upgrade to Premium</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="upgrade-features">
                        <div class="feature">
                            <div class="feature-icon">💬</div>
                            <div class="feature-text">
                                <h4>Unlimited Messaging</h4>
                                <p>Chat with sellers and negotiate deals directly</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">🎯</div>
                            <div class="feature-text">
                                <h4>Advanced Matching</h4>
                                <p>Get matched with premium sellers first</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">📊</div>
                            <div class="feature-text">
                                <h4>Deal Analytics</h4>
                                <p>Access detailed business metrics and insights</p>
                            </div>
                        </div>
                    </div>
                    <div class="pricing">
                        <div class="price">$99/month</div>
                        <div class="price-note">Cancel anytime</div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-upgrade">Upgrade Now</button>
                    <button class="btn-cancel">Maybe Later</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeUpgradeModal(modal);
        });
        
        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            this.closeUpgradeModal(modal);
        });
        
        modal.querySelector('.btn-upgrade').addEventListener('click', () => {
            this.processUpgrade();
            this.closeUpgradeModal(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeUpgradeModal(modal);
            }
        });
    }
    
    closeUpgradeModal(modal) {
        modal.remove();
    }
    
    processUpgrade() {
        // Simulate upgrade process
        alert('Upgrade feature would be implemented here. Redirecting to payment...');
    }
    
    toggleChatWidget() {
        // Animate the chat button
        const chatButton = document.querySelector('.chat-button');
        chatButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            chatButton.style.transform = 'scale(1)';
        }, 150);
        
        // Could expand to show a mini chat interface
        console.log('Chat widget clicked');
    }
    
    generateAvatar(initials) {
        const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        const color = colors[initials.charCodeAt(0) % colors.length];
        
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="${color}"/>
                <text x="50%" y="50%" font-family="Inter" font-size="14" font-weight="600" fill="white" text-anchor="middle" dy="0.3em">${initials}</text>
            </svg>
        `)}`;
    }
    
    // Method to add CSS for the upgrade modal
    addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .upgrade-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            
            .upgrade-modal {
                background: white;
                border-radius: 12px;
                padding: 0;
                max-width: 480px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            
            .modal-header {
                padding: 24px 24px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #f1f5f9;
            }
            
            .modal-header h3 {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
                color: #1e293b;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #64748b;
                cursor: pointer;
                padding: 4px;
                line-height: 1;
            }
            
            .modal-content {
                padding: 24px;
            }
            
            .upgrade-features {
                margin-bottom: 32px;
            }
            
            .feature {
                display: flex;
                gap: 16px;
                margin-bottom: 20px;
            }
            
            .feature-icon {
                font-size: 24px;
                flex-shrink: 0;
            }
            
            .feature-text h4 {
                margin: 0 0 4px 0;
                font-size: 16px;
                font-weight: 600;
                color: #1e293b;
            }
            
            .feature-text p {
                margin: 0;
                font-size: 14px;
                color: #64748b;
            }
            
            .pricing {
                text-align: center;
                padding: 20px;
                background: #f8fafc;
                border-radius: 8px;
            }
            
            .price {
                font-size: 28px;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 4px;
            }
            
            .price-note {
                font-size: 14px;
                color: #64748b;
            }
            
            .modal-actions {
                padding: 16px 24px 24px;
                display: flex;
                gap: 12px;
            }
            
            .btn-upgrade {
                flex: 1;
                background: #6366f1;
                border: none;
                border-radius: 8px;
                padding: 12px 24px;
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .btn-upgrade:hover {
                background: #5855eb;
            }
            
            .btn-cancel {
                flex: 1;
                background: none;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 12px 24px;
                color: #64748b;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .btn-cancel:hover {
                background: #f8fafc;
                color: #475569;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the inbox manager when the page loads
let inboxManager;

document.addEventListener('DOMContentLoaded', () => {
    inboxManager = new InboxManager();
    inboxManager.addModalStyles();
});

// Export for use in other scripts
window.inboxManager = inboxManager;
