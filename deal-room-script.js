// Deal Room with Gemini AI Integration
class DealRoomManager {
    constructor() {
        this.geminiAI = new GeminiAIService();
        this.dealData = {
            id: 'deal_001',
            seller: {
                companyName: "Sarah's SaaS Business",
                industry: 'SaaS',
                revenue: '$2.34M',
                growth: '34%',
                employees: 15
            },
            buyer: {
                name: 'John Doe',
                company: 'TechVentures',
                focusAreas: ['SaaS', 'B2B Software'],
                budget: '$2M - $8M',
                timeline: '45-60 days'
            },
            stage: 'due-diligence',
            documents: []
        };
        this.init();
    }

    init() {
        this.setupDocumentUpload();
        this.setupAIChat();
        this.setupQuickActions();
        this.loadInitialInsights();
    }

    setupDocumentUpload() {
        const uploadBtn = document.querySelector('.btn-upload');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.handleDocumentUpload();
            });
        }

        // Simulate document upload and analysis
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleFileDropped(e.dataTransfer.files);
        });

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
    }

    async handleDocumentUpload() {
        // Create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx,.xls,.xlsx';
        input.multiple = true;

        input.onchange = async (e) => {
            const files = Array.from(e.target.files);
            for (const file of files) {
                await this.processDocument(file);
            }
        };

        input.click();
    }

    async processDocument(file) {
        const documentItem = this.createDocumentItem(file);
        
        // Add to UI
        const documentList = document.querySelector('.document-list');
        if (documentList) {
            documentList.appendChild(documentItem);
        }

        // Simulate file processing
        try {
            this.updateDocumentStatus(documentItem, 'processing');
            
            // Simulate reading file content (in real app, you'd extract text from PDF/DOC)
            const mockDocumentData = this.generateMockDocumentData(file.name);
            
            // Analyze with Gemini AI
            const analysis = await this.geminiAI.analyzeFinancialDocument(mockDocumentData);
            
            // Update UI with analysis
            this.updateDocumentStatus(documentItem, 'analyzed');
            this.displayDocumentAnalysis(documentItem, analysis);
            
            // Update AI insights
            this.updateAIInsights(analysis);
            
        } catch (error) {
            console.error('Document processing error:', error);
            this.updateDocumentStatus(documentItem, 'error');
        }
    }

    createDocumentItem(file) {
        const item = document.createElement('div');
        item.className = 'document-item processing';
        item.innerHTML = `
            <div class="doc-icon">📄</div>
            <div class="doc-info">
                <h4>${file.name}</h4>
                <p>${this.formatFileSize(file.size)} • Just uploaded</p>
            </div>
            <div class="doc-status">
                <span class="status-badge processing">
                    <div class="processing-spinner"></div>
                    Processing...
                </span>
            </div>
            <div class="doc-actions">
                <button class="doc-action">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                </button>
            </div>
        `;
        return item;
    }

    updateDocumentStatus(documentItem, status) {
        const statusBadge = documentItem.querySelector('.status-badge');
        const docItem = documentItem;
        
        docItem.className = `document-item ${status}`;
        
        switch (status) {
            case 'processing':
                statusBadge.innerHTML = `
                    <div class="processing-spinner"></div>
                    Processing...
                `;
                statusBadge.className = 'status-badge processing';
                break;
            case 'analyzed':
                statusBadge.innerHTML = 'AI Analyzed';
                statusBadge.className = 'status-badge analyzed';
                break;
            case 'error':
                statusBadge.innerHTML = 'Error';
                statusBadge.className = 'status-badge error';
                break;
        }
    }

    displayDocumentAnalysis(documentItem, analysis) {
        // Create analysis summary
        const summary = document.createElement('div');
        summary.className = 'document-summary';
        summary.innerHTML = `
            <div class="summary-header">
                <span class="ai-badge">🤖 AI Analysis by Gemini</span>
                <span class="confidence-score">${analysis.summary.confidenceScore}% Confidence</span>
            </div>
            <div class="summary-content">
                <div class="key-metrics">
                    ${analysis.keyMetrics.map(metric => `
                        <div class="metric">
                            <span class="metric-label">${metric.label}</span>
                            <span class="metric-value">${metric.value}</span>
                            <span class="metric-change ${metric.trend}">${metric.change}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="risk-factors">
                    <h5>⚠️ Risk Factors:</h5>
                    <ul>
                        ${analysis.riskFactors.map(risk => `<li>${risk}</li>`).join('')}
                    </ul>
                </div>
                <div class="opportunities">
                    <h5>🚀 Growth Opportunities:</h5>
                    <ul>
                        ${analysis.opportunities.map(opp => `<li>${opp}</li>`).join('')}
                    </ul>
                </div>
                <div class="valuation-estimate">
                    <h5>💰 Valuation Estimate:</h5>
                    <p><strong>Industry Multiple:</strong> ${analysis.comparableValuation.industryMultiple}</p>
                    <p><strong>Suggested Range:</strong> ${analysis.comparableValuation.suggestedValuation}</p>
                </div>
            </div>
        `;
        
        // Insert after document item
        documentItem.parentNode.insertBefore(summary, documentItem.nextSibling);
    }

    setupAIChat() {
        const chatInput = document.querySelector('.chat-input');
        const chatSend = document.querySelector('.chat-send');
        
        if (chatInput && chatSend) {
            const handleSend = async () => {
                const question = chatInput.value.trim();
                if (!question) return;
                
                // Clear input
                chatInput.value = '';
                
                // Show user message
                this.addChatMessage(question, 'user');
                
                // Show thinking indicator
                this.addChatMessage('Analyzing your question...', 'ai', true);
                
                try {
                    // Get AI response
                    const response = await this.geminiAI.answerDealQuestion(question, this.dealData);
                    
                    // Remove thinking indicator
                    this.removeChatMessage('thinking');
                    
                    // Show AI response
                    this.addChatMessage(response, 'ai');
                    
                } catch (error) {
                    this.removeChatMessage('thinking');
                    this.addChatMessage('I apologize, but I encountered an error processing your question. Please try again.', 'ai');
                }
            };
            
            chatSend.addEventListener('click', handleSend);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSend();
                }
            });
        }
    }

    addChatMessage(message, sender, isThinking = false) {
        const chatContainer = document.querySelector('.ai-chat') || document.querySelector('.ai-assistant-card');
        if (!chatContainer) return;
        
        // Create or get chat messages container
        let messagesContainer = chatContainer.querySelector('.chat-messages');
        if (!messagesContainer) {
            messagesContainer = document.createElement('div');
            messagesContainer.className = 'chat-messages';
            chatContainer.insertBefore(messagesContainer, chatContainer.querySelector('.chat-input-container'));
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}${isThinking ? ' thinking' : ''}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                ${sender === 'ai' ? '🤖 ' : ''}${message}
            </div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeChatMessage(className) {
        const message = document.querySelector(`.chat-message.${className}`);
        if (message) {
            message.remove();
        }
    }

    async loadInitialInsights() {
        try {
            // Generate deal insights
            const insights = await this.geminiAI.generateDealInsights(
                this.dealData.seller,
                this.dealData.buyer,
                this.dealData.stage
            );
            
            // Update insights in UI
            this.updateDealInsights(insights);
            
            // Generate compatibility score
            const matchScore = await this.geminiAI.generateMatchingScore(
                this.dealData.seller,
                this.dealData.buyer
            );
            
            this.updateCompatibilityScore(matchScore);
            
        } catch (error) {
            console.error('Error loading initial insights:', error);
        }
    }

    updateAIInsights(analysis) {
        const insightsContainer = document.querySelector('.ai-insights');
        if (!insightsContainer) return;
        
        // Add new insights based on analysis
        const newInsight = document.createElement('div');
        newInsight.className = 'insight-item suggestion';
        newInsight.innerHTML = `
            <div class="insight-icon">📊</div>
            <div class="insight-content">
                <h4>Latest Analysis</h4>
                <p>Gemini AI has analyzed the uploaded document. ${analysis.recommendations[0] || 'Review the detailed analysis above.'}</p>
                <button class="insight-action">View Full Report</button>
            </div>
        `;
        
        // Insert at the top
        insightsContainer.insertBefore(newInsight, insightsContainer.firstChild);
    }

    updateDealInsights(insights) {
        // Update compatibility score if element exists
        const scoreElement = document.querySelector('.score-number');
        if (scoreElement) {
            scoreElement.textContent = `${insights.compatibilityScore}%`;
        }
        
        // Update AI insights
        const insightsContainer = document.querySelector('.ai-insights');
        if (insightsContainer && insights.nextSteps.length > 0) {
            const nextStepInsight = document.createElement('div');
            nextStepInsight.className = 'insight-item suggestion';
            nextStepInsight.innerHTML = `
                <div class="insight-icon">🎯</div>
                <div class="insight-content">
                    <h4>Next Steps Recommended</h4>
                    <p>${insights.nextSteps[0]}</p>
                    <button class="insight-action">View All Steps</button>
                </div>
            `;
            insightsContainer.appendChild(nextStepInsight);
        }
    }

    updateCompatibilityScore(matchScore) {
        // Create or update compatibility breakdown
        const compatibilitySection = document.createElement('div');
        compatibilitySection.className = 'compatibility-breakdown';
        compatibilitySection.innerHTML = `
            <h4>🤖 AI Compatibility Analysis</h4>
            <div class="compatibility-factors">
                ${Object.entries(matchScore.factors).map(([factor, details]) => `
                    <div class="factor-item">
                        <span class="factor-name">${factor.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                        <span class="factor-score">${details.split(' ')[0]}/100</span>
                    </div>
                `).join('')}
            </div>
            <div class="ai-assessment">
                <p><strong>Assessment:</strong> ${matchScore.overallAssessment}</p>
            </div>
        `;
        
        // Add to right column if it exists
        const rightColumn = document.querySelector('.right-column');
        if (rightColumn) {
            rightColumn.appendChild(compatibilitySection);
        }
    }

    setupQuickActions() {
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', async () => {
                const actionText = card.querySelector('span').textContent;
                await this.handleQuickAction(actionText);
            });
        });
    }

    async handleQuickAction(action) {
        switch (action) {
            case 'Generate Report':
                await this.generateDealReport();
                break;
            case 'Schedule Call':
                this.showScheduleMeeting();
                break;
            case 'Send Message':
                await this.generateConversationStarters();
                break;
            case 'Request Info':
                this.showInfoRequest();
                break;
        }
    }

    async generateDealReport() {
        this.showToast('Generating comprehensive deal report with Gemini AI...', 'info');
        
        try {
            const insights = await this.geminiAI.generateDealInsights(
                this.dealData.seller,
                this.dealData.buyer,
                this.dealData.stage
            );
            
            // Create report modal
            const modal = this.createReportModal(insights);
            document.body.appendChild(modal);
            
        } catch (error) {
            this.showToast('Error generating report. Please try again.', 'error');
        }
    }

    async generateConversationStarters() {
        try {
            const starters = await this.geminiAI.generateConversationStarters(
                this.dealData.seller,
                this.dealData.buyer
            );
            
            this.showConversationStartersModal(starters);
            
        } catch (error) {
            this.showToast('Error generating conversation starters.', 'error');
        }
    }

    createReportModal(insights) {
        const modal = document.createElement('div');
        modal.className = 'deal-report-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content large">
                <div class="modal-header">
                    <h3>🤖 AI Deal Analysis Report</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="report-section">
                        <h4>Compatibility Score: ${insights.compatibilityScore}%</h4>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${insights.compatibilityScore}%"></div>
                        </div>
                    </div>
                    
                    <div class="report-section">
                        <h4>Strengths</h4>
                        <ul>
                            ${insights.strengths.map(s => `<li>✅ ${s}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="report-section">
                        <h4>Areas of Concern</h4>
                        <ul>
                            ${insights.concerns.map(c => `<li>⚠️ ${c}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="report-section">
                        <h4>Recommended Next Steps</h4>
                        <ol>
                            ${insights.nextSteps.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                    
                    <div class="report-section">
                        <h4>Market Analysis</h4>
                        <p><strong>Average Multiple:</strong> ${insights.marketComparables.averageMultiple}</p>
                        <p><strong>Estimated Timeline:</strong> ${insights.timeline}</p>
                        <p><strong>Success Probability:</strong> ${insights.successProbability}</p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-download">Download PDF</button>
                    <button class="btn-share">Share Report</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
        
        return modal;
    }

    showConversationStartersModal(starters) {
        const modal = document.createElement('div');
        modal.className = 'conversation-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🤖 AI-Generated Conversation Starters</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${starters.messages.map((msg, index) => `
                        <div class="message-template">
                            <h4>Option ${index + 1}: ${msg.tone.charAt(0).toUpperCase() + msg.tone.slice(1)} Approach</h4>
                            <div class="template-subject">
                                <strong>Subject:</strong> ${msg.subject}
                            </div>
                            <div class="template-message">
                                <strong>Message:</strong><br>
                                ${msg.message}
                            </div>
                            <button class="btn-use-template" data-template="${index}">Use This Template</button>
                        </div>
                    `).join('')}
                    
                    <div class="talking-points">
                        <h4>💡 Key Talking Points</h4>
                        <ul>
                            ${starters.talkingPoints.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
        
        modal.querySelectorAll('.btn-use-template').forEach(btn => {
            btn.addEventListener('click', () => {
                const templateIndex = btn.dataset.template;
                this.useConversationTemplate(starters.messages[templateIndex]);
                modal.remove();
            });
        });
        
        document.body.appendChild(modal);
    }

    useConversationTemplate(template) {
        // In a real app, this would open email client or messaging interface
        this.showToast(`Template copied! Subject: "${template.subject}"`, 'success');
        
        // Copy to clipboard
        navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.message}`);
    }

    generateMockDocumentData(filename) {
        // Mock document data based on filename
        if (filename.toLowerCase().includes('financial')) {
            return `
                Financial Statement 2024
                Revenue: $2,340,000 (up 34% from $1,746,000 in 2023)
                Gross Profit: $1,825,200 (78% margin)
                Operating Expenses: $1,171,200
                Net Income: $654,000 (up 42% from $460,000 in 2023)
                
                Customer Metrics:
                - Total Customers: 145
                - Monthly Recurring Revenue: $195,000
                - Churn Rate: 2.3% monthly
                - Top 3 customers represent 40% of revenue
                
                Balance Sheet:
                - Cash: $890,000
                - Accounts Receivable: $285,000
                - Total Assets: $1,450,000
                - Total Liabilities: $320,000
            `;
        } else if (filename.toLowerCase().includes('customer')) {
            return `
                Customer Analysis Report
                Total Active Customers: 145
                Enterprise (>$10K ARR): 12 customers (40% of revenue)
                Mid-market ($1K-$10K ARR): 67 customers (45% of revenue)
                Small business (<$1K ARR): 66 customers (15% of revenue)
                
                Geographic Distribution:
                - North America: 78%
                - Europe: 15%
                - Other: 7%
                
                Customer Satisfaction: 4.6/5 (NPS: 67)
                Average Customer Lifetime: 3.2 years
            `;
        }
        
        return `Mock document content for ${filename}`;
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            zIndex: '1000',
            transform: 'translateY(100px)',
            opacity: '0',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DealRoomManager();
});

// Add modal styles
const modalStyles = `
.deal-report-modal, .conversation-modal {
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
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
}

.modal-content.large {
    max-width: 800px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e2e8f0;
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

.report-section {
    margin-bottom: 24px;
}

.report-section h4 {
    margin-bottom: 12px;
    color: #1a202c;
}

.score-bar {
    width: 100%;
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
}

.score-fill {
    height: 100%;
    background: linear-gradient(90deg, #48bb78, #667eea);
    transition: width 0.3s ease;
}

.message-template {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
}

.template-subject, .template-message {
    margin-bottom: 12px;
}

.btn-use-template {
    background: #667eea;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
}

.talking-points {
    background: #f0f4ff;
    padding: 16px;
    border-radius: 8px;
    margin-top: 16px;
}

.modal-actions {
    padding: 24px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.btn-download, .btn-share {
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
}

.btn-download {
    background: #667eea;
    color: white;
    border: none;
}

.btn-share {
    background: white;
    color: #667eea;
    border: 1px solid #667eea;
}

.chat-messages {
    max-height: 300px;
    overflow-y: auto;
    padding: 16px 0;
    margin-bottom: 16px;
    border-top: 1px solid #e2e8f0;
}

.chat-message {
    margin-bottom: 12px;
    padding: 8px 12px;
    border-radius: 8px;
}

.chat-message.user {
    background: #e6fffa;
    margin-left: 20%;
}

.chat-message.ai {
    background: #f0f4ff;
    margin-right: 20%;
}

.message-content {
    font-size: 14px;
    margin-bottom: 4px;
}

.message-time {
    font-size: 11px;
    color: #718096;
}

.compatibility-breakdown {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.factor-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f7fafc;
}

.factor-score {
    font-weight: 600;
    color: #667eea;
}

.ai-assessment {
    margin-top: 16px;
    padding: 12px;
    background: #f0f4ff;
    border-radius: 6px;
    font-size: 14px;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);
