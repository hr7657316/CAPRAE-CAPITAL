// Buyer Profiles JavaScript
class BuyerProfilesManager {
    constructor() {
        this.filters = {
            budget: [],
            industry: [],
            timeline: []
        };
        this.bookmarkedBuyers = new Set();
        this.init();
    }

    init() {
        this.setupFilterHandlers();
        this.setupCardActions();
        this.setupBookmarks();
        this.setupConnectActions();
    }

    setupFilterHandlers() {
        const filterPills = document.querySelectorAll('.filter-pill');
        
        filterPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFilter(pill);
            });
        });

        // Clear filters
        const clearBtn = document.querySelector('.clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    toggleFilter(pill) {
        pill.classList.toggle('active');
        
        // Get filter category and value
        const filterGroup = pill.closest('.filter-group');
        const category = filterGroup.querySelector('label').textContent.toLowerCase().replace(' ', '');
        const value = pill.textContent;
        
        if (pill.classList.contains('active')) {
            if (!this.filters[category]) this.filters[category] = [];
            this.filters[category].push(value);
        } else {
            if (this.filters[category]) {
                this.filters[category] = this.filters[category].filter(f => f !== value);
            }
        }
        
        this.applyFilters();
    }

    clearAllFilters() {
        // Reset filters
        this.filters = {
            budget: [],
            industry: [],
            timeline: []
        };
        
        // Remove active class from all pills
        document.querySelectorAll('.filter-pill.active').forEach(pill => {
            pill.classList.remove('active');
        });
        
        // Show all cards
        document.querySelectorAll('.buyer-card').forEach(card => {
            card.style.display = 'block';
        });
    }

    applyFilters() {
        const buyerCards = document.querySelectorAll('.buyer-card');
        
        buyerCards.forEach(card => {
            let shouldShow = true;
            
            // Apply filters logic here
            // For demo purposes, we'll show all cards
            // In a real app, you'd check card data against active filters
            
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    setupCardActions() {
        const moreButtons = document.querySelectorAll('.action-btn.more');
        
        moreButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCardMenu(btn);
            });
        });
    }

    showCardMenu(button) {
        // Create context menu
        const existingMenu = document.querySelector('.card-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'card-context-menu';
        menu.innerHTML = `
            <div class="menu-item" data-action="view-profile">
                <span>View Full Profile</span>
            </div>
            <div class="menu-item" data-action="save-for-later">
                <span>Save for Later</span>
            </div>
            <div class="menu-item" data-action="report">
                <span>Report User</span>
            </div>
        `;

        // Position menu
        const rect = button.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`;
        menu.style.background = 'white';
        menu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        menu.style.borderRadius = '8px';
        menu.style.padding = '8px';
        menu.style.zIndex = '1000';
        menu.style.minWidth = '150px';

        document.body.appendChild(menu);

        // Handle menu clicks
        menu.addEventListener('click', (e) => {
            const action = e.target.closest('.menu-item')?.dataset.action;
            if (action) {
                this.handleCardAction(action, button.closest('.buyer-card'));
            }
            menu.remove();
        });

        // Close menu on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            });
        }, 100);
    }

    handleCardAction(action, card) {
        const buyerId = card.dataset.buyerId;
        
        switch (action) {
            case 'view-profile':
                this.viewFullProfile(buyerId);
                break;
            case 'save-for-later':
                this.saveForLater(buyerId);
                break;
            case 'report':
                this.reportUser(buyerId);
                break;
        }
    }

    setupBookmarks() {
        const bookmarkButtons = document.querySelectorAll('.action-btn.bookmark');
        
        bookmarkButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleBookmark(btn);
            });
        });
    }

    toggleBookmark(button) {
        const card = button.closest('.buyer-card');
        const buyerId = card.dataset.buyerId;
        
        if (this.bookmarkedBuyers.has(buyerId)) {
            this.bookmarkedBuyers.delete(buyerId);
            button.style.color = '#718096';
            this.showToast('Removed from bookmarks');
        } else {
            this.bookmarkedBuyers.add(buyerId);
            button.style.color = '#667eea';
            this.showToast('Added to bookmarks');
        }
    }

    setupConnectActions() {
        const connectButtons = document.querySelectorAll('.btn-connect');
        const rejectButtons = document.querySelectorAll('.btn-reject');
        
        connectButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.connectWithBuyer(btn);
            });
        });
        
        rejectButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.rejectBuyer(btn);
            });
        });
    }

    connectWithBuyer(button) {
        const card = button.closest('.buyer-card');
        const buyerId = card.dataset.buyerId;
        const buyerName = card.querySelector('h3').textContent;
        
        // Show connection modal
        this.showConnectionModal(buyerId, buyerName);
    }

    showConnectionModal(buyerId, buyerName) {
        const modal = document.createElement('div');
        modal.className = 'connection-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Connect with ${buyerName}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Send a personalized message to introduce your business:</p>
                    <textarea class="connection-message" placeholder="Hi ${buyerName}, I'm interested in discussing a potential acquisition of my SaaS business..."></textarea>
                    <div class="ai-suggestions">
                        <h4>💡 AI Suggestions:</h4>
                        <div class="suggestion-pills">
                            <button class="suggestion-pill">Mention your revenue growth</button>
                            <button class="suggestion-pill">Highlight market opportunity</button>
                            <button class="suggestion-pill">Reference their portfolio fit</button>
                        </div>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-send">Send Connection Request</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Modal event handlers
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.btn-cancel').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.btn-send').addEventListener('click', () => {
            this.sendConnectionRequest(buyerId, modal.querySelector('.connection-message').value);
            modal.remove();
        });

        // Suggestion pills
        modal.querySelectorAll('.suggestion-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const textarea = modal.querySelector('.connection-message');
                const suggestion = this.getSuggestionText(pill.textContent);
                textarea.value += (textarea.value ? '\n\n' : '') + suggestion;
            });
        });
    }

    getSuggestionText(type) {
        const suggestions = {
            'Mention your revenue growth': "We've achieved 40% year-over-year growth with strong recurring revenue.",
            'Highlight market opportunity': "Our market segment is experiencing rapid expansion with significant untapped potential.",
            'Reference their portfolio fit': "I noticed your focus on SaaS companies and believe our business aligns perfectly with your investment thesis."
        };
        
        return suggestions[type] || '';
    }

    sendConnectionRequest(buyerId, message) {
        // Simulate API call
        this.showToast('Connection request sent!', 'success');
        
        // Update UI to show pending state
        const card = document.querySelector(`[data-buyer-id="${buyerId}"]`);
        const connectBtn = card.querySelector('.btn-connect');
        connectBtn.textContent = 'Request Sent';
        connectBtn.disabled = true;
        connectBtn.style.background = '#718096';
    }

    rejectBuyer(button) {
        const card = button.closest('.buyer-card');
        const buyerId = card.dataset.buyerId;
        
        // Animate card out
        card.style.transition = 'all 0.3s ease';
        card.style.transform = 'translateX(-100%)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            card.remove();
            this.showToast('Buyer removed from your feed');
        }, 300);
    }

    viewFullProfile(buyerId) {
        // Navigate to full profile page
        window.location.href = `buyer-profile-detail.html?id=${buyerId}`;
    }

    saveForLater(buyerId) {
        this.showToast('Saved for later review');
    }

    reportUser(buyerId) {
        this.showToast('Report submitted. Thank you for helping keep our platform safe.');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: type === 'success' ? '#48bb78' : '#667eea',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            zIndex: '1000',
            transform: 'translateY(100px)',
            opacity: '0',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BuyerProfilesManager();
});

// Add modal styles
const modalStyles = `
.connection-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #718096;
}

.modal-body {
    padding: 24px;
}

.modal-body p {
    margin-bottom: 16px;
    color: #4a5568;
}

.connection-message {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-family: inherit;
    resize: vertical;
    margin-bottom: 20px;
}

.ai-suggestions h4 {
    margin-bottom: 12px;
    font-size: 14px;
    color: #4a5568;
}

.suggestion-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.suggestion-pill {
    background: #f0f4ff;
    border: 1px solid #667eea;
    color: #667eea;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.suggestion-pill:hover {
    background: #667eea;
    color: white;
}

.modal-actions {
    padding: 24px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.btn-cancel {
    padding: 10px 20px;
    border: 1px solid #e2e8f0;
    background: white;
    color: #4a5568;
    border-radius: 6px;
    cursor: pointer;
}

.btn-send {
    padding: 10px 20px;
    border: none;
    background: #667eea;
    color: white;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
}

.menu-item {
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
    color: #4a5568;
}

.menu-item:hover {
    background: #f7fafc;
}
`;

// Inject modal styles
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);
