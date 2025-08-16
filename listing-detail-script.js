class ListingDetailManager {
    constructor() {
        this.currentTab = 'summary';
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initTabNavigation();
    }
    
    bindEvents() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // See more buttons
        document.querySelectorAll('.see-more-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleDescription(e.target);
            });
        });
        
        // Upgrade buttons
        document.querySelectorAll('.upgrade-cta, .upgrade-btn-large, .unlock-name-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showUpgradeModal();
            });
        });
        
        // Action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleActionClick(e.target.closest('.action-btn'));
            });
        });
        
        // Chat widget
        const chatButton = document.querySelector('.chat-button');
        if (chatButton) {
            chatButton.addEventListener('click', () => {
                this.toggleChatWidget();
            });
        }
    }
    
    initTabNavigation() {
        // Set initial active tab
        this.switchTab(this.currentTab);
    }
    
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
        
        // Animate tab change
        this.animateTabChange();
    }
    
    animateTabChange() {
        const activePanel = document.querySelector('.tab-panel.active');
        activePanel.style.opacity = '0';
        activePanel.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            activePanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            activePanel.style.opacity = '1';
            activePanel.style.transform = 'translateY(0)';
        }, 50);
    }
    
    toggleDescription(button) {
        const description = button.closest('.description, .price-reasoning');
        const paragraph = description.querySelector('p');
        const isExpanded = description.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            paragraph.style.maxHeight = '3em';
            paragraph.style.overflow = 'hidden';
            button.innerHTML = `
                See more
                <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
            `;
            description.classList.remove('expanded');
        } else {
            // Expand
            paragraph.style.maxHeight = 'none';
            paragraph.style.overflow = 'visible';
            button.innerHTML = `
                See less
                <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/>
                </svg>
            `;
            description.classList.add('expanded');
        }
    }
    
    handleActionClick(button) {
        const action = button.classList.contains('share-btn') ? 'share' :
                      button.classList.contains('bookmark-btn') ? 'bookmark' :
                      button.classList.contains('favorite-btn') ? 'favorite' : null;
        
        switch (action) {
            case 'share':
                this.shareListing();
                break;
            case 'bookmark':
                this.toggleBookmark(button);
                break;
            case 'favorite':
                this.toggleFavorite(button);
                break;
        }
    }
    
    shareListing() {
        if (navigator.share) {
            navigator.share({
                title: 'SaaS Startup - Caprae Capital',
                text: 'Check out this startup listing on Caprae Capital',
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showToast('Link copied to clipboard!');
            });
        }
    }
    
    toggleBookmark(button) {
        const isBookmarked = button.classList.contains('bookmarked');
        
        if (isBookmarked) {
            button.classList.remove('bookmarked');
            button.style.color = 'var(--text-secondary)';
            this.showToast('Removed from bookmarks');
        } else {
            button.classList.add('bookmarked');
            button.style.color = 'var(--warning-color)';
            this.showToast('Added to bookmarks');
        }
        
        // Animate button
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    toggleFavorite(button) {
        const isFavorited = button.classList.contains('favorited');
        
        if (isFavorited) {
            button.classList.remove('favorited');
            button.style.color = 'var(--text-secondary)';
            this.showToast('Removed from favorites');
        } else {
            button.classList.add('favorited');
            button.style.color = 'var(--error-color)';
            this.showToast('Added to favorites');
        }
        
        // Animate button
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    showUpgradeModal() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'upgrade-modal-overlay';
        modal.innerHTML = `
            <div class="upgrade-modal">
                <div class="modal-header">
                    <h3>Upgrade to Platinum</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="upgrade-hero">
                        <div class="upgrade-icon">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <h4>Get access to this startup</h4>
                        <p>Chat with the founder and access exclusive data unavailable to the public.</p>
                    </div>
                    
                    <div class="upgrade-features">
                        <div class="feature">
                            <div class="feature-icon">💬</div>
                            <div class="feature-text">
                                <h5>Direct Founder Chat</h5>
                                <p>Message the founder directly and negotiate deals</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">📊</div>
                            <div class="feature-text">
                                <h5>Financial Deep Dive</h5>
                                <p>Access P&L statements, cash flow, and detailed metrics</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">🔒</div>
                            <div class="feature-text">
                                <h5>Exclusive Data Room</h5>
                                <p>View confidential documents and business details</p>
                            </div>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">⚡</div>
                            <div class="feature-text">
                                <h5>Priority Matching</h5>
                                <p>Get matched with premium sellers first</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="pricing-card">
                        <div class="pricing-header">
                            <div class="price">$199/month</div>
                            <div class="price-note">Cancel anytime</div>
                        </div>
                        <div class="pricing-features">
                            <div class="pricing-feature">✓ Unlimited messaging</div>
                            <div class="pricing-feature">✓ Access to all startups</div>
                            <div class="pricing-feature">✓ Financial data access</div>
                            <div class="pricing-feature">✓ Priority support</div>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-upgrade-premium">Upgrade to Platinum</button>
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
        
        modal.querySelector('.btn-upgrade-premium').addEventListener('click', () => {
            this.processUpgrade('platinum');
            this.closeUpgradeModal(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeUpgradeModal(modal);
            }
        });
        
        // Animate modal in
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.upgrade-modal').style.transform = 'scale(1)';
        }, 10);
    }
    
    closeUpgradeModal(modal) {
        modal.style.opacity = '0';
        modal.querySelector('.upgrade-modal').style.transform = 'scale(0.95)';
        setTimeout(() => {
            modal.remove();
        }, 200);
    }
    
    processUpgrade(plan) {
        // Simulate upgrade process
        this.showToast(`Redirecting to ${plan} upgrade...`, 'success');
        setTimeout(() => {
            // In a real app, this would redirect to payment
            console.log(`Processing ${plan} upgrade`);
        }, 1000);
    }
    
    toggleChatWidget() {
        // Animate the chat button
        const chatButton = document.querySelector('.chat-button');
        chatButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            chatButton.style.transform = 'scale(1)';
        }, 150);
        
        // Could expand to show upgrade message or mini chat
        this.showToast('Upgrade to Platinum to chat with founders');
    }
    
    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                toast.remove();
            }, 200);
        }, 3000);
    }
    
    // Method to add modal and toast styles
    addStyles() {
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
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            
            .upgrade-modal {
                background: white;
                border-radius: 16px;
                padding: 0;
                max-width: 520px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                transform: scale(0.95);
                transition: transform 0.2s ease;
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
                font-size: 24px;
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
                border-radius: 4px;
            }
            
            .modal-close:hover {
                background: #f1f5f9;
            }
            
            .modal-content {
                padding: 24px;
            }
            
            .upgrade-hero {
                text-align: center;
                margin-bottom: 32px;
            }
            
            .upgrade-icon {
                width: 64px;
                height: 64px;
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 16px;
            }
            
            .upgrade-icon svg {
                width: 32px;
                height: 32px;
                color: white;
            }
            
            .upgrade-hero h4 {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #1e293b;
            }
            
            .upgrade-hero p {
                color: #64748b;
                font-size: 16px;
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
                width: 32px;
                text-align: center;
            }
            
            .feature-text h5 {
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
            
            .pricing-card {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                border-radius: 12px;
                padding: 24px;
                color: white;
                margin-bottom: 24px;
            }
            
            .pricing-header {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .price {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 4px;
            }
            
            .price-note {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .pricing-features {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }
            
            .pricing-feature {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .modal-actions {
                padding: 0 24px 24px;
                display: flex;
                gap: 12px;
            }
            
            .btn-upgrade-premium {
                flex: 1;
                background: #6366f1;
                border: none;
                border-radius: 8px;
                padding: 14px 24px;
                color: white;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .btn-upgrade-premium:hover {
                background: #5855eb;
            }
            
            .btn-cancel {
                flex: 1;
                background: none;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 14px 24px;
                color: #64748b;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .btn-cancel:hover {
                background: #f8fafc;
                color: #475569;
            }
            
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                padding: 16px 20px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                z-index: 1001;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.2s ease;
                max-width: 300px;
                font-size: 14px;
                font-weight: 500;
            }
            
            .toast-success {
                border-left: 4px solid #10b981;
                color: #065f46;
            }
            
            .toast-info {
                border-left: 4px solid #6366f1;
                color: #1e293b;
            }
            
            @media (max-width: 640px) {
                .upgrade-modal {
                    margin: 20px;
                    max-width: none;
                    width: auto;
                }
                
                .pricing-features {
                    grid-template-columns: 1fr;
                }
                
                .modal-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the listing detail manager when the page loads
let listingDetailManager;

document.addEventListener('DOMContentLoaded', () => {
    listingDetailManager = new ListingDetailManager();
    listingDetailManager.addStyles();
});

// Export for use in other scripts
window.listingDetailManager = listingDetailManager;
