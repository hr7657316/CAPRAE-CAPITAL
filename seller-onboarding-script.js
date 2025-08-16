class SellerOnboarding {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 31;
        this.formData = {
            startupCategory: '',
            startupName: '',
            startupUrl: '',
            sellingStructure: '',
            legalFirstName: '',
            legalLastName: '',
            metricsConnected: false,
            competitors: [],
            growthOpportunities: [],
            profilePhoto: null,
            sellingReasons: [],
            fundingBackground: [],
            background: '',
            customerBenefit: '',
            startupDescription: '',
            keywords: [],
            askingPrice: 1300000,
            priceJustification: '',
            websiteUrl: '',
            revenue: '',
            contactInfo: {
                country: 'us',
                phone: ''
            },
            profit: '',
            growthRate: '',
            launchMonth: '',
            launchYear: '',
            recurringRevenue: '',
            teamSize: '',
            customerCount: '',
            startupCountry: '',
            churnRate: '1-3%',
            businessModel: [],
            churnTrending: '',
            additionalDetails: {}
        };
        
        this.initializeEventListeners();
        this.updateProgress();
        this.updateNavigation();
    }

    initializeEventListeners() {
        // Startup category selection
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.formData.startupCategory = card.dataset.value;
            });
        });

        // Startup name input
        const startupNameInput = document.getElementById('startup-name');
        if (startupNameInput) {
            startupNameInput.addEventListener('input', (e) => {
                this.formData.startupName = e.target.value;
            });
        }

        // Startup URL input
        const startupUrlInput = document.getElementById('startup-url');
        if (startupUrlInput) {
            startupUrlInput.addEventListener('input', (e) => {
                this.formData.startupUrl = e.target.value;
            });
        }

        // Selling structure selection
        document.querySelectorAll('.structure-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.structure-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.formData.sellingStructure = option.dataset.value;
                
                // Show/hide individual form
                const individualForm = document.querySelector('.individual-form');
                if (option.dataset.value === 'individual' && individualForm) {
                    individualForm.style.display = 'block';
                } else if (individualForm) {
                    individualForm.style.display = 'none';
                }
            });
        });

        // Legal name inputs
        const legalFirstNameInput = document.getElementById('legal-first-name');
        const legalLastNameInput = document.getElementById('legal-last-name');
        
        if (legalFirstNameInput) {
            legalFirstNameInput.addEventListener('input', (e) => {
                this.formData.legalFirstName = e.target.value;
            });
        }
        
        if (legalLastNameInput) {
            legalLastNameInput.addEventListener('input', (e) => {
                this.formData.legalLastName = e.target.value;
            });
        }

        // Skip button
        const skipBtn = document.querySelector('.skip-btn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                this.nextStep();
            });
        }

        // Competitor input
        const competitorInput = document.getElementById('competitorInput');
        if (competitorInput) {
            competitorInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addCompetitor(e.target.value);
                    e.target.value = '';
                }
            });
        }

        // Keywords input
        const keywordInput = document.getElementById('keywordInput');
        if (keywordInput) {
            keywordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addKeyword(e.target.value);
                    e.target.value = '';
                }
            });
        }

        // Growth opportunities
        document.querySelectorAll('.opportunity-card').forEach(card => {
            card.addEventListener('click', () => {
                this.toggleSelection(card, 'growthOpportunities');
            });
        });

        // Photo upload
        const photoUpload = document.getElementById('photoUpload');
        const photoInput = document.getElementById('photoInput');
        
        if (photoUpload && photoInput) {
            photoUpload.addEventListener('click', () => photoInput.click());
            photoInput.addEventListener('change', this.handlePhotoUpload.bind(this));
            
            // Drag and drop
            photoUpload.addEventListener('dragover', (e) => {
                e.preventDefault();
                photoUpload.style.borderColor = '#667eea';
                photoUpload.style.background = '#f0f4ff';
            });
            
            photoUpload.addEventListener('dragleave', (e) => {
                e.preventDefault();
                photoUpload.style.borderColor = '#cbd5e0';
                photoUpload.style.background = '#f9fafb';
            });
            
            photoUpload.addEventListener('drop', (e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handlePhotoFile(files[0]);
                }
                photoUpload.style.borderColor = '#cbd5e0';
                photoUpload.style.background = '#f9fafb';
            });
        }

        // Selling reasons
        document.querySelectorAll('.reason-card').forEach(card => {
            card.addEventListener('click', () => {
                this.toggleSelection(card, 'sellingReasons');
            });
        });

        // Funding background
        document.querySelectorAll('.funding-card').forEach(card => {
            card.addEventListener('click', () => {
                this.toggleSelection(card, 'fundingBackground');
            });
        });

        // Selling structure
        document.querySelectorAll('.selling-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.selling-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.formData.sellingStructure = option.dataset.value;
            });
        });

        // Connect buttons
        document.querySelectorAll('.connect-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.textContent = 'Connected';
                e.target.style.background = '#48bb78';
                this.formData.metricsConnected = true;
            });
        });

        // Price slider
        const priceSlider = document.getElementById('priceSlider');
        if (priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                this.updatePriceDisplay(e.target.value);
            });
        }

        // Character counters
        this.setupCharacterCounters();

        // Additional details toggles
        document.querySelectorAll('.details-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.nextElementSibling;
                if (input.style.display === 'none' || !input.style.display) {
                    input.style.display = 'block';
                    toggle.textContent = '- Additional details';
                } else {
                    input.style.display = 'none';
                    toggle.textContent = '+ Additional details';
                }
            });
        });

        // Suggestion tags
        document.querySelectorAll('.suggestion-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.addKeyword(tag.textContent);
            });
        });

        // Team size cards
        document.querySelectorAll('.team-size-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.team-size-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.formData.teamSize = card.dataset.value;
            });
        });

        // Business model tags
        document.querySelectorAll('.model-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('selected');
                const value = tag.dataset.value;
                if (tag.classList.contains('selected')) {
                    if (!this.formData.businessModel.includes(value)) {
                        this.formData.businessModel.push(value);
                    }
                } else {
                    this.formData.businessModel = this.formData.businessModel.filter(model => model !== value);
                }
            });
        });

        // Custom business model input
        const customModelInput = document.getElementById('custom-model');
        if (customModelInput) {
            customModelInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const value = e.target.value.trim();
                    if (value && !this.formData.businessModel.includes(value)) {
                        this.formData.businessModel.push(value);
                        // Add as a new tag
                        const tagsContainer = document.querySelector('.business-model-tags');
                        const newTag = document.createElement('span');
                        newTag.className = 'model-tag selected';
                        newTag.textContent = value;
                        newTag.dataset.value = value;
                        tagsContainer.appendChild(newTag);
                        // Add event listener
                        newTag.addEventListener('click', () => {
                            newTag.classList.toggle('selected');
                            if (!newTag.classList.contains('selected')) {
                                this.formData.businessModel = this.formData.businessModel.filter(model => model !== value);
                            }
                        });
                    }
                    e.target.value = '';
                }
            });
        }

        // Trending cards
        document.querySelectorAll('.trending-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.trending-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.formData.churnTrending = card.dataset.value;
            });
        });

        // Form inputs for new steps
        const inputHandlers = [
            { id: 'growth-rate', field: 'growthRate' },
            { id: 'launch-month', field: 'launchMonth' },
            { id: 'launch-year', field: 'launchYear' },
            { id: 'recurring-revenue', field: 'recurringRevenue' },
            { id: 'customer-count', field: 'customerCount' },
            { id: 'startup-country', field: 'startupCountry' },
            { id: 'churn-rate', field: 'churnRate' }
        ];

        inputHandlers.forEach(({ id, field }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.formData[field] = e.target.value;
                });
            }
        });
    }

    setupCharacterCounters() {
        const textareas = [
            { id: 'background-textarea', counter: '.char-used' },
            { id: 'benefit-textarea', counter: '.char-used' },
            { id: 'description-textarea', counter: '.char-used' },
            { id: 'justification-textarea', counter: '.char-used' }
        ];

        textareas.forEach(({ id, counter }) => {
            const textarea = document.querySelector(`.${id}`);
            if (textarea) {
                textarea.addEventListener('input', (e) => {
                    const count = e.target.value.length;
                    const counterElement = e.target.parentElement.querySelector(counter);
                    if (counterElement) {
                        counterElement.textContent = count;
                    }
                });
            }
        });
    }

    updatePriceDisplay(value) {
        const priceAmount = document.getElementById('priceAmount');
        if (priceAmount) {
            const formattedPrice = (value / 1000000).toFixed(1) + 'M';
            priceAmount.textContent = formattedPrice;
            this.formData.askingPrice = parseInt(value);
        }
    }

    addCompetitor(name) {
        if (name && name.trim() && !this.formData.competitors.includes(name.trim())) {
            this.formData.competitors.push(name.trim());
            this.renderCompetitors();
        }
    }

    removeCompetitor(name) {
        this.formData.competitors = this.formData.competitors.filter(c => c !== name);
        this.renderCompetitors();
    }

    renderCompetitors() {
        const container = document.getElementById('competitorsList');
        if (!container) return;
        
        container.innerHTML = this.formData.competitors.map(competitor => `
            <div class="competitor-tag">
                ${competitor}
                <button class="competitor-remove" onclick="sellerOnboarding.removeCompetitor('${competitor}')">&times;</button>
            </div>
        `).join('');
    }

    addKeyword(keyword) {
        if (keyword && keyword.trim() && !this.formData.keywords.includes(keyword.trim())) {
            this.formData.keywords.push(keyword.trim());
            this.renderKeywords();
        }
    }

    removeKeyword(keyword) {
        this.formData.keywords = this.formData.keywords.filter(k => k !== keyword);
        this.renderKeywords();
    }

    renderKeywords() {
        const container = document.getElementById('keywordsList');
        if (!container) return;
        
        container.innerHTML = this.formData.keywords.map(keyword => `
            <div class="competitor-tag">
                ${keyword}
                <button class="competitor-remove" onclick="sellerOnboarding.removeKeyword('${keyword}')">&times;</button>
            </div>
        `).join('');
    }

    toggleSelection(card, dataKey) {
        const value = card.dataset.value;
        const isSelected = card.classList.contains('selected');
        
        if (isSelected) {
            card.classList.remove('selected');
            this.formData[dataKey] = this.formData[dataKey].filter(item => item !== value);
        } else {
            card.classList.add('selected');
            if (!this.formData[dataKey].includes(value)) {
                this.formData[dataKey].push(value);
            }
        }
    }

    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.handlePhotoFile(file);
        }
    }

    handlePhotoFile(file) {
        if (file && file.type.startsWith('image/')) {
            this.formData.profilePhoto = file;
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const uploadArea = document.getElementById('photoUpload');
                uploadArea.innerHTML = `
                    <img src="${e.target.result}" alt="Profile preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
                    <p style="margin-top: 12px; font-size: 14px; color: #4a5568;">Click to change photo</p>
                `;
            };
            reader.readAsDataURL(file);
        }
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                // Special handling for SSL check step
                if (this.currentStep === 16) {
                    this.showSSLCheck();
                    return;
                }
                
                this.hideStep(this.currentStep);
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateProgress();
                this.updateNavigation();
            } else {
                this.submitForm();
            }
        }
    }

    showSSLCheck() {
        this.hideStep(this.currentStep);
        this.currentStep = 17;
        this.showStep(this.currentStep);
        this.updateProgress();
        this.updateNavigation();
        
        // Simulate SSL check
        setTimeout(() => {
            this.currentStep = 18;
            this.hideStep(17);
            this.showStep(this.currentStep);
            this.updateProgress();
            this.updateNavigation();
        }, 2000);
    }

    previousStep() {
        if (this.currentStep > 1) {
            // Skip SSL check on back navigation
            if (this.currentStep === 17 || this.currentStep === 18) {
                this.currentStep = 16;
            } else {
                this.currentStep--;
            }
            
            this.hideStep(this.currentStep + 1);
            this.showStep(this.currentStep);
            this.updateProgress();
            this.updateNavigation();
        }
    }

    showStep(stepNumber) {
        const step = document.getElementById(`step${stepNumber}`);
        if (step) {
            step.style.display = 'block';
        }
    }

    hideStep(stepNumber) {
        const step = document.getElementById(`step${stepNumber}`);
        if (step) {
            step.style.display = 'none';
        }
    }

    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            const percentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }

    updateNavigation() {
        const backBtn = document.getElementById('backBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (backBtn) {
            backBtn.disabled = this.currentStep === 1;
            backBtn.style.display = this.currentStep === 17 ? 'none' : 'block';
        }
        
        if (nextBtn) {
            if (this.currentStep === 17) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'block';
                nextBtn.textContent = this.currentStep === this.totalSteps ? 'Submit' : 'Next';
            }
        }
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return true; // Basics intro - no validation needed
                
            case 2:
                if (!this.formData.startupCategory) {
                    alert('Please select a startup category.');
                    return false;
                }
                return true;
                
            case 3:
                if (!this.formData.startupName || this.formData.startupName.trim().length < 2) {
                    alert('Please provide a valid startup name.');
                    return false;
                }
                return true;
                
            case 4:
                if (!this.formData.startupUrl || this.formData.startupUrl.trim().length < 3) {
                    alert('Please provide a valid website URL.');
                    return false;
                }
                return true;
                
            case 5:
                if (!this.formData.sellingStructure) {
                    alert('Please select how you are selling your startup.');
                    return false;
                }
                if (this.formData.sellingStructure === 'individual') {
                    if (!this.formData.legalFirstName || !this.formData.legalLastName) {
                        alert('Please provide your legal first and last name.');
                        return false;
                    }
                }
                return true;
                
            case 6:
                return true; // Metrics connection is optional
                
            case 7:
                return true; // Competitors optional
                
            case 8:
                if (this.formData.growthOpportunities.length === 0) {
                    alert('Please select at least one growth opportunity.');
                    return false;
                }
                return true;
                
            case 9:
                return true; // Photo optional
                
            case 10:
                if (this.formData.sellingReasons.length === 0) {
                    alert('Please select at least one reason for selling.');
                    return false;
                }
                return true;
                
            case 11:
                if (this.formData.fundingBackground.length === 0) {
                    alert('Please select at least one funding option.');
                    return false;
                }
                return true;
                
            case 12:
                const background = document.querySelector('.background-textarea')?.value;
                if (!background || background.length < 100) {
                    alert('Please provide at least 100 characters for your background.');
                    return false;
                }
                this.formData.background = background;
                return true;
                
            case 7:
                const benefit = document.querySelector('.benefit-textarea')?.value;
                if (!benefit || benefit.trim().length === 0) {
                    alert('Please provide a customer benefit description.');
                    return false;
                }
                this.formData.customerBenefit = benefit;
                return true;
                
            case 8:
                const description = document.querySelector('.description-textarea')?.value;
                if (!description || description.trim().length === 0) {
                    alert('Please provide a startup description.');
                    return false;
                }
                this.formData.startupDescription = description;
                return true;
                
            case 9:
                return true; // Keywords optional
                
            case 10:
                return true; // Price already set
                
            case 11:
                if (!this.formData.sellingStructure) {
                    alert('Please select how you are selling your startup.');
                    return false;
                }
                return true;
                
            case 12:
                return true; // Metrics optional
                
            case 13:
                const justification = document.querySelector('.justification-textarea')?.value;
                if (!justification || justification.length < 100) {
                    alert('Please provide at least 100 characters for your price justification.');
                    return false;
                }
                this.formData.priceJustification = justification;
                return true;
                
            case 14:
                const url = document.getElementById('websiteUrl')?.value;
                if (!url || !this.isValidUrl(url)) {
                    alert('Please provide a valid website URL.');
                    return false;
                }
                this.formData.websiteUrl = url;
                return true;
                
            case 15:
                const revenue = document.getElementById('revenueInput')?.value;
                if (!revenue) {
                    alert('Please provide your revenue information.');
                    return false;
                }
                this.formData.revenue = revenue;
                return true;
                
            case 16:
                const phone = document.getElementById('phoneInput')?.value;
                if (!phone) {
                    alert('Please provide your phone number.');
                    return false;
                }
                this.formData.contactInfo.phone = phone;
                this.formData.contactInfo.country = document.getElementById('countrySelect')?.value;
                return true;
                
            case 18:
                const profit = document.getElementById('profitInput')?.value;
                if (!profit) {
                    alert('Please provide your profit information.');
                    return false;
                }
                this.formData.profit = profit;
                return true;
                
            default:
                return true;
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    submitForm() {
        // Handle step 30 submission which leads to verification
        if (this.currentStep === 30) {
            this.hideStep(30);
            this.currentStep = 31;
            this.showStep(31);
            this.updateProgress();
            this.updateNavigation();
            return;
        }

        // Collect all additional details
        document.querySelectorAll('.details-input').forEach(input => {
            if (input.value.trim()) {
                const stepNumber = input.closest('.step-content').id.replace('step', '');
                this.formData.additionalDetails[`step${stepNumber}`] = input.value.trim();
            }
        });

        // Collect all form data
        const allInputs = document.querySelectorAll('input, textarea, select');
        allInputs.forEach(input => {
            if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.tagName === 'TEXTAREA') {
                const stepNumber = input.closest('.step-content').id.replace('step', '');
                this.formData.additionalDetails[`step${stepNumber}`] = input.value.trim();
            }
        });

        console.log('Seller form submitted with data:', this.formData);
        
        // Show success message
        this.showSuccessMessage();
    }

    handleVerification() {
        // Simulate verification process
        const verifyBtn = document.querySelector('.verify-btn');
        if (verifyBtn) {
            verifyBtn.textContent = 'Verifying...';
            verifyBtn.disabled = true;
            
            setTimeout(() => {
                this.showSuccessMessage();
            }, 3000);
        }
    }

    showSuccessMessage() {
        const container = document.querySelector('.onboarding-container');
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="width: 80px; height: 80px; background: #48bb78; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h1 style="font-size: 28px; font-weight: 700; color: #2d3748; margin-bottom: 16px;">
                    Verification Complete!
                </h1>
                <p style="font-size: 16px; color: #4a5568; margin-bottom: 32px; line-height: 1.5;">
                    Your identity has been verified and your startup listing has been submitted for review. Our team will evaluate your submission and get back to you within 24-48 hours. You'll receive an email confirmation shortly.
                </p>
                <button onclick="window.location.href='index.html'" style="background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s ease;">
                    Return to Homepage
                </button>
            </div>
        `;
    }
}

// Global functions for onclick handlers
function nextStep() {
    sellerOnboarding.nextStep();
}

function previousStep() {
    sellerOnboarding.previousStep();
}

function handleVerification() {
    sellerOnboarding.handleVerification();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sellerOnboarding = new SellerOnboarding();
    
    // Add verification button handler
    const verifyBtn = document.querySelector('.verify-btn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', handleVerification);
    }
});
