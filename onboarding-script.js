// Onboarding Flow JavaScript
class BuyerOnboarding {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 11;
        this.responses = {};
        this.init();
    }

    init() {
        this.updateProgressBar();
        this.bindEvents();
        this.generateHistograms();
        this.showStep(1);
    }

    bindEvents() {
        // Option card selections
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-card')) {
                this.handleOptionSelect(e.target);
            }
            
            if (e.target.classList.contains('filter-pill')) {
                this.handleFilterSelect(e.target);
            }
            
            if (e.target.classList.contains('preference-card')) {
                this.handlePreferenceSelect(e.target);
            }
        });

        // Input field changes
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('range-input') || e.target.classList.contains('search-input') || e.target.classList.contains('custom-input')) {
                this.handleInputChange(e.target);
            }
        });

        // Custom interest enter key
        const customInput = document.getElementById('customInterest');
        if (customInput) {
            customInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addCustomInterest(e.target.value);
                    e.target.value = '';
                }
            });
        }

        // Scroll buttons
        document.querySelectorAll('.scroll-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleScroll(e.target);
            });
        });
    }

    handleOptionSelect(element) {
        const step = element.closest('.step-container');
        const isMultiSelect = step.querySelector('.options-grid.four-column');
        
        if (isMultiSelect) {
            // Multi-select (startup types)
            element.classList.toggle('selected');
        } else {
            // Single select (how did you hear)
            step.querySelectorAll('.option-card').forEach(card => {
                card.classList.remove('selected');
            });
            element.classList.add('selected');
        }
        
        this.updateNextButton();
        this.saveResponse();
    }

    handleFilterSelect(element) {
        element.classList.toggle('selected');
        this.updateNextButton();
        this.saveResponse();
    }

    handlePreferenceSelect(element) {
        const container = element.closest('.preference-options');
        container.querySelectorAll('.preference-card').forEach(card => {
            card.classList.remove('active');
        });
        element.classList.add('active');
        this.updateNextButton();
        this.saveResponse();
    }

    handleInputChange(element) {
        this.updateNextButton();
        this.saveResponse();
    }

    handleScroll(button) {
        const target = button.dataset.target;
        const container = document.querySelector(`[data-category="${target}"]`).closest('.filter-pills-container').querySelector('.filter-pills');
        const scrollAmount = 200;
        
        if (button.classList.contains('scroll-right')) {
            container.scrollLeft += scrollAmount;
        } else {
            container.scrollLeft -= scrollAmount;
        }
    }

    addCustomInterest(value) {
        if (!value.trim()) return;
        
        const filterPills = document.querySelector('.filter-pills');
        const pill = document.createElement('button');
        pill.className = 'filter-pill selected';
        pill.setAttribute('data-category', 'custom');
        pill.setAttribute('data-value', value.toLowerCase().replace(/\s+/g, '-'));
        pill.textContent = value;
        
        filterPills.appendChild(pill);
        this.updateNextButton();
        this.saveResponse();
    }

    updateNextButton() {
        const currentStepElement = document.querySelector('.step-container.active');
        const nextBtn = currentStepElement.querySelector('.next-btn');
        
        if (!nextBtn) return;
        
        let hasSelection = false;
        
        // Check different types of inputs
        const selectedOptions = currentStepElement.querySelectorAll('.option-card.selected');
        const selectedFilters = currentStepElement.querySelectorAll('.filter-pill.selected');
        const selectedPreferences = currentStepElement.querySelectorAll('.preference-card.active');
        const filledInputs = currentStepElement.querySelectorAll('.range-input, .search-input');
        
        if (selectedOptions.length > 0 || selectedFilters.length > 0 || selectedPreferences.length > 0) {
            hasSelection = true;
        }
        
        // Check if any input has value
        let hasInputValue = false;
        filledInputs.forEach(input => {
            if (input.value.trim()) {
                hasInputValue = true;
            }
        });
        
        // Special case for steps with inputs
        if (this.currentStep >= 3 && this.currentStep <= 7) {
            hasSelection = true; // These steps don't require selection, inputs are optional
        }
        
        if (this.currentStep === 9) {
            hasSelection = hasInputValue; // Country search requires input
        }
        
        if (hasSelection) {
            nextBtn.classList.remove('disabled');
            nextBtn.disabled = false;
        } else {
            nextBtn.classList.add('disabled');
            nextBtn.disabled = true;
        }
    }

    saveResponse() {
        const currentStepElement = document.querySelector('.step-container.active');
        const stepKey = `step${this.currentStep}`;
        
        // Get selected options
        const selectedOptions = Array.from(currentStepElement.querySelectorAll('.option-card.selected'))
            .map(el => el.dataset.value);
        
        const selectedFilters = Array.from(currentStepElement.querySelectorAll('.filter-pill.selected'))
            .map(el => ({ category: el.dataset.category, value: el.dataset.value }));
            
        const selectedPreferences = Array.from(currentStepElement.querySelectorAll('.preference-card.active'))
            .map(el => el.dataset.value);
        
        // Get input values
        const inputs = {};
        currentStepElement.querySelectorAll('.range-input, .search-input, .custom-input').forEach(input => {
            if (input.value.trim()) {
                inputs[input.id] = input.value;
            }
        });
        
        this.responses[stepKey] = {
            options: selectedOptions,
            filters: selectedFilters,
            preferences: selectedPreferences,
            inputs: inputs
        };
        
        console.log('Saved response for', stepKey, this.responses[stepKey]);
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateProgressBar();
        }
    }

    goBack() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgressBar();
        }
    }

    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.step-container').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStep = document.getElementById(`step${stepNumber}`);
        if (currentStep) {
            currentStep.classList.add('active');
            
            // Update back button visibility
            const backBtn = currentStep.querySelector('.back-btn');
            if (backBtn) {
                backBtn.style.display = stepNumber === 1 ? 'none' : 'flex';
            }
            
            // Update next button state
            this.updateNextButton();
        }
    }

    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        const progress = (this.currentStep / this.totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
    }

    generateHistograms() {
        this.generateHistogram('priceHistogram', this.generatePriceData());
        this.generateHistogram('revenueHistogram', this.generateRevenueData());
        this.generateHistogram('profitHistogram', this.generateProfitData());
        this.generateHistogram('ttmRevenueHistogram', this.generateTTMRevenueData());
        this.generateHistogram('ttmProfitHistogram', this.generateTTMProfitData());
    }

    generateHistogram(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        const maxValue = Math.max(...data);
        
        data.forEach(value => {
            const bar = document.createElement('div');
            bar.className = 'histogram-bar';
            bar.style.height = `${(value / maxValue) * 100}%`;
            container.appendChild(bar);
        });
    }

    generatePriceData() {
        // Simulate price distribution data
        return [85, 78, 72, 65, 58, 52, 45, 38, 32, 28, 25, 22, 18, 15, 12, 10, 8, 6, 5, 4, 3, 2, 2, 1, 1, 1, 0, 0, 0, 95];
    }

    generateRevenueData() {
        // Simulate revenue multiple distribution
        return [90, 85, 78, 65, 52, 42, 35, 28, 22, 18, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 75];
    }

    generateProfitData() {
        // Simulate profit multiple distribution
        return [75, 82, 78, 72, 65, 58, 52, 45, 38, 32, 28, 25, 22, 18, 15, 12, 10, 8, 6, 5, 4, 3, 2, 2, 1, 1, 1, 0, 0, 85];
    }

    generateTTMRevenueData() {
        // Simulate TTM revenue distribution
        return [95, 88, 82, 75, 68, 62, 55, 48, 42, 36, 30, 25, 20, 16, 12, 9, 7, 5, 4, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0, 88];
    }

    generateTTMProfitData() {
        // Simulate TTM profit distribution
        return [92, 85, 78, 72, 65, 58, 52, 45, 38, 32, 28, 25, 22, 18, 15, 12, 10, 8, 6, 5, 4, 3, 2, 2, 1, 1, 1, 0, 0, 75];
    }

    seeRecommendations() {
        this.currentStep = 11;
        this.showStep(this.currentStep);
        this.updateProgressBar();
        
        // Here you would typically send the responses to a server
        console.log('Final responses:', this.responses);
    }
}

// Global functions for HTML onclick handlers
function nextStep() {
    window.onboarding.nextStep();
}

function goBack() {
    window.onboarding.goBack();
}

function seeRecommendations() {
    window.onboarding.seeRecommendations();
}

// Format input values
function formatCurrency(input) {
    let value = input.value.replace(/[^\d]/g, '');
    if (value) {
        value = parseInt(value).toLocaleString();
        input.value = '$' + value;
    }
}

function formatMultiple(input) {
    let value = input.value.replace(/[^\d.]/g, '');
    if (value) {
        input.value = value + 'x';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.onboarding = new BuyerOnboarding();
    
    // Add currency formatting to price inputs
    document.querySelectorAll('#minPrice, #maxPrice, #minTTMRevenue, #maxTTMRevenue, #minTTMProfit, #maxTTMProfit').forEach(input => {
        input.addEventListener('blur', () => formatCurrency(input));
    });
    
    // Add multiple formatting to multiple inputs
    document.querySelectorAll('#minRevenue, #maxRevenue, #minProfit, #maxProfit').forEach(input => {
        input.addEventListener('blur', () => formatMultiple(input));
    });
    
    // Country search functionality
    const countrySearch = document.getElementById('countrySearch');
    if (countrySearch) {
        const countries = [
            'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
            'Australia', 'New Zealand', 'Japan', 'South Korea', 'Singapore', 'India', 'Brazil', 'Mexico'
        ];
        
        countrySearch.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            const matches = countries.filter(country => 
                country.toLowerCase().includes(value)
            );
            
            // You could show a dropdown with matches here
            console.log('Country matches:', matches);
        });
    }
});
