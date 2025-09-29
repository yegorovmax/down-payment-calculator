// Down Payment Calculator JavaScript
class DownPaymentCalculator {
    constructor() {
        this.homePrice = 0;
        this.downPaymentValue = 0;
        this.downPaymentType = 'percentage';
        this.loanType = 'conventional';
        this.interestRate = 7.5; // Default interest rate
        this.loanTerm = 30; // 30 years
        
        this.initializeElements();
        this.bindEvents();
        this.updateCalculator();
    }

    initializeElements() {
        this.homePriceInput = document.getElementById('homePrice');
        this.downPaymentValueInput = document.getElementById('downPaymentValue');
        this.downPaymentTypeButtons = document.querySelectorAll('.toggle-btn');
        this.loanTypeSelect = document.getElementById('loanType');
        this.currencySymbol = document.getElementById('currencySymbol');
        
        // Result elements
        this.downPaymentAmount = document.getElementById('downPaymentAmount');
        this.loanAmount = document.getElementById('loanAmount');
        this.downPaymentPercent = document.getElementById('downPaymentPercent');
        
        // Scenario elements
        this.minDownPayment = document.getElementById('minDownPayment');
        this.recDownPayment = document.getElementById('recDownPayment');
        this.yourDownPayment = document.getElementById('yourDownPayment');
        this.minMonthlyPayment = document.getElementById('minMonthlyPayment');
        this.recMonthlyPayment = document.getElementById('recMonthlyPayment');
        this.yourMonthlyPayment = document.getElementById('yourMonthlyPayment');
        this.yourPMI = document.getElementById('yourPMI');
    }

    bindEvents() {
        // Input events
        this.homePriceInput.addEventListener('input', () => this.updateCalculator());
        this.downPaymentValueInput.addEventListener('input', () => this.updateCalculator());
        this.loanTypeSelect.addEventListener('change', () => this.updateCalculator());
        
        // Toggle button events
        this.downPaymentTypeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.downPaymentTypeButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                this.downPaymentType = e.target.dataset.type;
                this.updateInputDisplay();
                this.updateCalculator();
            });
        });

        // Assistance program buttons are handled by fallback method
    }

    updateInputDisplay() {
        if (this.downPaymentType === 'percentage') {
            this.currencySymbol.textContent = '%';
            this.downPaymentValueInput.placeholder = '20';
            this.downPaymentValueInput.step = '0.1';
        } else {
            this.currencySymbol.textContent = '$';
            this.downPaymentValueInput.placeholder = '100,000';
            this.downPaymentValueInput.step = '1000';
        }
    }

    updateCalculator() {
        // Clean the home price value by removing commas
        const cleanHomePrice = this.homePriceInput.value.replace(/,/g, '');
        this.homePrice = parseFloat(cleanHomePrice) || 0;
        this.downPaymentValue = parseFloat(this.downPaymentValueInput.value) || 0;
        this.loanType = this.loanTypeSelect.value;


        if (this.homePrice === 0) {
            this.clearResults();
            return;
        }

        this.calculateDownPayment();
        this.calculateScenarios();
    }

    calculateDownPayment() {
        let downPaymentAmount, downPaymentPercent, loanAmount;

        if (this.downPaymentType === 'percentage') {
            downPaymentPercent = Math.min(this.downPaymentValue, 100);
            downPaymentAmount = (this.homePrice * downPaymentPercent) / 100;
        } else {
            downPaymentAmount = Math.min(this.downPaymentValue, this.homePrice);
            downPaymentPercent = (downPaymentAmount / this.homePrice) * 100;
        }

        loanAmount = this.homePrice - downPaymentAmount;

        // Update main results
        this.downPaymentAmount.textContent = this.formatCurrency(downPaymentAmount);
        this.loanAmount.textContent = this.formatCurrency(loanAmount);
        this.downPaymentPercent.textContent = `${downPaymentPercent.toFixed(1)}%`;

        // Update your selection scenario
        this.yourDownPayment.textContent = this.formatCurrency(downPaymentAmount);
        this.yourMonthlyPayment.textContent = this.calculateMonthlyPayment(loanAmount);
        this.yourPMI.textContent = downPaymentPercent < 20 ? 'Yes' : 'No';
    }

    calculateScenarios() {
        // Minimum scenario (3.5% for FHA, 5% for conventional)
        const minPercent = this.loanType === 'fha' ? 3.5 : 5;
        const minDownPaymentAmount = (this.homePrice * minPercent) / 100;
        const minLoanAmount = this.homePrice - minDownPaymentAmount;
        
        this.minDownPayment.textContent = this.formatCurrency(minDownPaymentAmount);
        this.minMonthlyPayment.textContent = this.calculateMonthlyPayment(minLoanAmount);

        // Recommended scenario (20%)
        const recDownPaymentAmount = (this.homePrice * 20) / 100;
        const recLoanAmount = this.homePrice - recDownPaymentAmount;
        
        this.recDownPayment.textContent = this.formatCurrency(recDownPaymentAmount);
        this.recMonthlyPayment.textContent = this.calculateMonthlyPayment(recLoanAmount);
    }

    calculateMonthlyPayment(loanAmount) {
        if (loanAmount <= 0) return '$0';
        
        const monthlyRate = this.interestRate / 100 / 12;
        const numberOfPayments = this.loanTerm * 12;
        
        const monthlyPayment = loanAmount * 
            (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        return this.formatCurrency(monthlyPayment);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    clearResults() {
        this.downPaymentAmount.textContent = '$0';
        this.loanAmount.textContent = '$0';
        this.downPaymentPercent.textContent = '0%';
        this.minDownPayment.textContent = '$0';
        this.recDownPayment.textContent = '$0';
        this.yourDownPayment.textContent = '$0';
        this.minMonthlyPayment.textContent = '$0';
        this.recMonthlyPayment.textContent = '$0';
        this.yourMonthlyPayment.textContent = '$0';
        this.yourPMI.textContent = 'No';
    }

    handleAssistanceClick(button) {
        const card = button.closest('.assistance-card');
        const title = card.querySelector('h4').textContent;
        
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Simulate assistance program check
        this.showAssistanceModal(title);
    }

    showAssistanceModal(program) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;

        modalContent.innerHTML = `
            <h3 style="margin-bottom: 20px; color: #000; font-size: 1.5rem;">${program}</h3>
            <p style="margin-bottom: 30px; color: #666; line-height: 1.6;">
                This feature would connect to your assistance program eligibility system. 
                In a real implementation, this would check your qualifications and provide 
                personalized recommendations.
            </p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="learnMore" style="
                    background: #000;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                ">Learn More</button>
                <button id="closeModal" style="
                    background: #f5f5f5;
                    color: #000;
                    border: 1px solid #e5e5e5;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                ">Close</button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Add event listeners
        modal.querySelector('#closeModal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('#learnMore').addEventListener('click', () => {
            alert('This would redirect to detailed information about the assistance program.');
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Utility method to update interest rate based on loan type
    updateInterestRate() {
        const rates = {
            'conventional': 7.5,
            'fha': 7.0,
            'va': 6.8,
            'usda': 7.2
        };
        this.interestRate = rates[this.loanType] || 7.5;
    }

    // Get program-specific information and URLs
    getProgramInfo(program) {
        const programs = {
            'First-Time Homebuyer Programs': {
                description: 'Explore down payment assistance programs designed specifically for first-time homebuyers. These programs can provide grants, low-interest loans, or tax credits to help with your down payment.',
                benefits: [
                    'Down payment assistance up to $10,000',
                    'Low or no interest loans',
                    'Tax credits and incentives',
                    'Educational resources and counseling'
                ],
                url: 'https://www.hud.gov/topics/buying_a_home'
            },
            'FHA Loans': {
                description: 'Federal Housing Administration loans offer flexible qualification requirements and low down payment options. Perfect for first-time buyers or those with limited savings.',
                benefits: [
                    'As low as 3.5% down payment',
                    'Flexible credit requirements',
                    'Competitive interest rates',
                    'Gift funds allowed for down payment'
                ],
                url: 'https://www.hud.gov/fha'
            },
            'VA Loans': {
                description: 'Veterans Affairs loans provide exclusive benefits for active military, veterans, and eligible surviving spouses. These loans offer exceptional terms and no down payment requirement.',
                benefits: [
                    '0% down payment required',
                    'No private mortgage insurance (PMI)',
                    'Competitive interest rates',
                    'No prepayment penalties'
                ],
                url: 'https://www.va.gov/housing-assistance/home-loans/'
            }
        };
        
        return programs[program] || {
            description: 'Learn more about this assistance program and see if you qualify.',
            benefits: ['Check eligibility requirements', 'View program details', 'Apply online'],
            url: 'https://www.hud.gov/'
        };
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DownPaymentCalculator();
});

// Add some utility functions for enhanced user experience
function addInputFormatting() {
    const homePriceInput = document.getElementById('homePrice');
    
    // Format on blur (when user finishes typing)
    homePriceInput.addEventListener('blur', function() {
        const cleanValue = this.value.replace(/,/g, '');
        if (cleanValue && !isNaN(parseInt(cleanValue))) {
            const numericValue = parseInt(cleanValue);
            if (numericValue > 0) {
                this.value = numericValue.toLocaleString();
            }
        }
    });
    
    // Remove formatting on focus (when user starts typing)
    homePriceInput.addEventListener('focus', function() {
        this.value = this.value.replace(/,/g, '');
    });
    
    // Allow only numbers during typing
    homePriceInput.addEventListener('input', function() {
        // Remove any non-numeric characters except commas
        this.value = this.value.replace(/[^0-9]/g, '');
    });
}

// Add smooth scrolling for better mobile experience
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add keyboard navigation support
function addKeyboardSupport() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
            e.target.blur();
        }
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    addInputFormatting();
    addSmoothScrolling();
    addKeyboardSupport();
    
    // Ensure assistance buttons work - fallback method
    setTimeout(() => {
        const assistanceButtons = document.querySelectorAll('.check-eligibility');
        assistanceButtons.forEach((button, index) => {
            // Remove any existing listeners to avoid duplicates
            button.replaceWith(button.cloneNode(true));
        });
        
        // Re-attach listeners
        document.querySelectorAll('.check-eligibility').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const card = this.closest('.assistance-card');
                const title = card.querySelector('h4').textContent;
                showAssistanceModalDirect(title);
            });
        });
    }, 100);
});


// Add loading states and error handling
function addLoadingStates() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 300);
        });
    });
}

// Initialize loading states
document.addEventListener('DOMContentLoaded', addLoadingStates);

// Direct modal function for assistance buttons
function showAssistanceModalDirect(program) {
    // Get program information
    const programInfo = getProgramInfoDirect(program);
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;

    modalContent.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #000; font-size: 1.5rem;">${program}</h3>
        <p style="margin-bottom: 20px; color: #666; line-height: 1.6;">
            ${programInfo.description}
        </p>
        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #000;">
            <strong>Key Benefits:</strong>
            <ul style="margin: 8px 0 0 20px; color: #666;">
                ${programInfo.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
        </div>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button id="visitWebsite" style="
                background: #000;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
            ">Visit Official Website</button>
            <button id="closeModal" style="
                background: #f5f5f5;
                color: #000;
                border: 1px solid #e5e5e5;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
            ">Close</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('#closeModal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.querySelector('#visitWebsite').addEventListener('click', () => {
        window.open(programInfo.url, '_blank');
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Helper function for assistance modal
function getProgramInfoDirect(program) {
    const programs = {
        'First-Time Homebuyer Programs': {
            description: 'Explore down payment assistance programs designed specifically for first-time homebuyers. These programs can provide grants, low-interest loans, or tax credits to help with your down payment.',
            benefits: [
                'Down payment assistance up to $10,000',
                'Low or no interest loans',
                'Tax credits and incentives',
                'Educational resources and counseling'
            ],
            url: 'https://www.hud.gov/topics/buying_a_home'
        },
        'FHA Loans': {
            description: 'Federal Housing Administration loans offer flexible qualification requirements and low down payment options. Perfect for first-time buyers or those with limited savings.',
            benefits: [
                'As low as 3.5% down payment',
                'Flexible credit requirements',
                'Competitive interest rates',
                'Gift funds allowed for down payment'
            ],
            url: 'https://www.hud.gov/fha'
        },
        'VA Loans': {
            description: 'Veterans Affairs loans provide exclusive benefits for active military, veterans, and eligible surviving spouses. These loans offer exceptional terms and no down payment requirement.',
            benefits: [
                '0% down payment required',
                'No private mortgage insurance (PMI)',
                'Competitive interest rates',
                'No prepayment penalties'
            ],
            url: 'https://www.va.gov/housing-assistance/home-loans/'
        }
    };
    
    return programs[program] || {
        description: 'Learn more about this assistance program and see if you qualify.',
        benefits: ['Check eligibility requirements', 'View program details', 'Apply online'],
        url: 'https://www.hud.gov/'
    };
}

