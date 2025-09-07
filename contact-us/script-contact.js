// Global variables
let formData = {};
let isSubmitting = false;

// DOM Elements
const form = document.getElementById('contactForm');
const serviceTypeSelect = document.getElementById('serviceType');
const enquiryFields = document.getElementById('enquiryFields');
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('charCount');
const submitBtn = document.getElementById('submitBtn');
const messagePopup = document.getElementById('messagePopup');

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    setupValidation();
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize form functionality
function initializeForm() {
    // Set default values
    document.getElementById('quantityUnit').value = 'kg';
    
    // Initialize character count
    updateCharacterCount();
    
    // Add loading animation to page
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
}

// Setup event listeners
function setupEventListeners() {
    // Service type change
    serviceTypeSelect.addEventListener('change', handleServiceTypeChange);
    
    // Character count for message
    messageTextarea.addEventListener('input', updateCharacterCount);
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
    
    // Popup close
    document.getElementById('popupClose').addEventListener('click', closePopup);
    
    // Click outside popup to close
    messagePopup.addEventListener('click', function(e) {
        if (e.target === messagePopup) {
            closePopup();
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Prevent form submission on Enter in input fields
    const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    textInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextInput = getNextFormField(this);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
    });
}

// Handle service type change
function handleServiceTypeChange() {
    const selectedService = serviceTypeSelect.value;
    
    if (selectedService === 'enquiry') {
        enquiryFields.style.display = 'block';
        // Make enquiry fields required
        const enquiryInputs = enquiryFields.querySelectorAll('input[required], select[required]');
        enquiryInputs.forEach(input => {
            input.setAttribute('required', 'required');
        });
        
        // Update required fields
        document.getElementById('productType').setAttribute('required', 'required');
        document.getElementById('quantityNeeded').setAttribute('required', 'required');
        document.getElementById('quantityUnit').setAttribute('required', 'required');
        
        // Animate the appearance
        enquiryFields.style.opacity = '0';
        enquiryFields.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            enquiryFields.style.opacity = '1';
            enquiryFields.style.transform = 'translateY(0)';
        }, 50);
        
    } else {
        enquiryFields.style.display = 'none';
        // Remove required attributes from enquiry fields
        const enquiryInputs = enquiryFields.querySelectorAll('input, select');
        enquiryInputs.forEach(input => {
            input.removeAttribute('required');
        });
    }
    
    // Update message placeholder based on service type
    updateMessagePlaceholder(selectedService);
}

// Update message placeholder
function updateMessagePlaceholder(serviceType) {
    const placeholders = {
        'enquiry': 'Please provide details about your product requirements, intended use, any specific nutritional requirements, and delivery preferences...',
        'quote': 'Please specify the products you need, quantities, delivery location, and any special requirements for your quote...',
        'technical': 'Describe your current feed formulation challenges, livestock type, and what technical assistance you need...',
        'partnership': 'Tell us about your business, distribution capabilities, and how you\'d like to partner with SM Agro Trades...',
        'complaint': 'Please describe the issue you\'ve experienced, order details (if applicable), and what resolution you\'re seeking...',
        'other': 'Please provide details about your inquiry or how we can assist you...'
    };
    
    messageTextarea.placeholder = placeholders[serviceType] || placeholders['other'];
}

// Update character count
function updateCharacterCount() {
    const currentLength = messageTextarea.value.length;
    const maxLength = 1000;
    
    charCount.textContent = currentLength;
    
    // Change color based on character count
    if (currentLength > maxLength * 0.9) {
        charCount.style.color = '#ef4444';
    } else if (currentLength > maxLength * 0.7) {
        charCount.style.color = '#f59e0b';
    } else {
        charCount.style.color = '#666';
    }
    
    // Limit character count
    if (currentLength > maxLength) {
        messageTextarea.value = messageTextarea.value.substring(0, maxLength);
        charCount.textContent = maxLength;
    }
}

// Setup form validation
function setupValidation() {
    // Email validation pattern
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailPattern.test(this.value)) {
            setFieldError(this, 'Please enter a valid email address');
        } else {
            clearFieldError(this);
        }
    });
    
    // Phone validation
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function() {
        // Remove any non-digit characters except + and spaces
        let value = this.value.replace(/[^\d+\s-()]/g, '');
        this.value = value;
        
        // Basic phone validation
        if (value.length < 10 && value.length > 0) {
            setFieldError(this, 'Please enter a valid phone number');
        } else {
            clearFieldError(this);
        }
    });
    
    // Quantity validation
    const quantityInput = document.getElementById('quantityNeeded');
    quantityInput.addEventListener('input', function() {
        const value = parseFloat(this.value);
        if (value <= 0 && this.value !== '') {
            setFieldError(this, 'Quantity must be greater than 0');
        } else {
            clearFieldError(this);
        }
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        setFieldError(field, `${getFieldLabel(field)} is required`);
        isValid = false;
    } else {
        // Field-specific validation
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (value && value.length < 2) {
                    setFieldError(field, 'Name must be at least 2 characters');
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailPattern.test(value)) {
                    setFieldError(field, 'Please enter a valid email address');
                    isValid = false;
                }
                break;
                
            case 'phone':
                if (value && value.length < 10) {
                    setFieldError(field, 'Please enter a valid phone number');
                    isValid = false;
                }
                break;
                
            case 'quantityNeeded':
                const quantity = parseFloat(value);
                if (value && (isNaN(quantity) || quantity <= 0)) {
                    setFieldError(field, 'Please enter a valid quantity');
                    isValid = false;
                }
                break;
                
            case 'message':
                if (value && value.length < 10) {
                    setFieldError(field, 'Message must be at least 10 characters');
                    isValid = false;
                }
                break;
        }
    }
    
    if (isValid) {
        setFieldValid(field);
    }
    
    return isValid;
}

// Get field label
function getFieldLabel(field) {
    const label = field.parentElement.querySelector('label');
    if (label) {
        return label.textContent.replace(' *', '').replace('*', '');
    }
    return field.name;
}

// Set field error
function setFieldError(field, message) {
    const formGroup = field.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('valid');
    formGroup.classList.add('error');
    
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear field error
function clearFieldError(field) {
    const formGroup = field.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Set field as valid
function setFieldValid(field) {
    const formGroup = field.parentElement;
    formGroup.classList.remove('error');
    formGroup.classList.add('valid');
}

// Get next form field
function getNextFormField(currentField) {
    const allFields = Array.from(form.querySelectorAll('input, select, textarea'));
    const currentIndex = allFields.indexOf(currentField);
    
    for (let i = currentIndex + 1; i < allFields.length; i++) {
        const field = allFields[i];
        if (!field.disabled && field.type !== 'hidden' && 
            field.offsetParent !== null) { // Check if visible
            return field;
        }
    }
    return null;
}

// Handle form submission
async function handleFormSubmission(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate entire form
    const isFormValid = validateForm();
    
    if (!isFormValid) {
        showPopup('error', 'Validation Error', 'Please correct the errors in the form before submitting.');
        return;
    }
    
    // Start submission process
    isSubmitting = true;
    setSubmissionState('loading');
    
    // Collect form data
    formData = collectFormData();
    
    try {
        // Simulate API call (replace with actual API endpoint)
        await submitFormData(formData);
        
        // Success
        setSubmissionState('success');
        showPopup('success', 'Message Sent Successfully!', 
            'Thank you for contacting SM Agro Trades. We\'ve received your message and will respond within 2 hours during business hours.');
        
        // Reset form after successful submission
        setTimeout(() => {
            resetForm();
        }, 2000);
        
    } catch (error) {
        console.error('Form submission error:', error);
        setSubmissionState('error');
        showPopup('error', 'Submission Failed', 
            'There was an error sending your message. Please try again or contact us directly via email.');
    } finally {
        isSubmitting = false;
    }
}

// Validate entire form
function validateForm() {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Focus on first error field
    if (!isValid) {
        const firstError = form.querySelector('.error input, .error select, .error textarea');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    return isValid;
}

// Collect form data
function collectFormData() {
    const data = {
        personalInfo: {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim()
        },
        serviceInfo: {
            serviceType: document.getElementById('serviceType').value,
            message: document.getElementById('message').value.trim()
        },
        additionalOptions: {
            newsletter: document.getElementById('newsletter').checked,
            catalogRequest: document.getElementById('catalogRequest').checked,
            technicalConsultation: document.getElementById('technicalConsultation').checked
        },
        timestamp: new Date().toISOString(),
        source: 'website_contact_form'
    };
    
    // Add enquiry-specific data if applicable
    if (document.getElementById('serviceType').value === 'enquiry') {
        data.enquiryDetails = {
            productType: document.getElementById('productType').value,
            quantityNeeded: document.getElementById('quantityNeeded').value,
            quantityUnit: document.getElementById('quantityUnit').value,
            deliveryLocation: document.getElementById('deliveryLocation').value.trim(),
            timeframe: document.getElementById('timeframe').value,
            businessType: document.getElementById('businessType').value
        };
    }
    
    return data;
}

// Submit form data (simulated API call)
async function submitFormData(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Log the form data (in production, this would be sent to your backend)
    console.log('Form submitted with data:', data);
    
    // Simulate success/failure
    if (Math.random() > 0.1) { // 90% success rate
        return { success: true, message: 'Form submitted successfully' };
    } else {
        throw new Error('Simulated network error');
    }
}

// Set submission state
function setSubmissionState(state) {
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    
    switch (state) {
        case 'loading':
            form.classList.add('form-loading');
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            break;
            
        case 'success':
            form.classList.remove('form-loading');
            form.classList.add('form-success');
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            btnText.textContent = 'Message Sent!';
            break;
            
        case 'error':
            form.classList.remove('form-loading');
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            btnText.textContent = 'Try Again';
            break;
            
        default:
            form.classList.remove('form-loading', 'form-success');
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
            btnText.textContent = 'Send Message';
    }
}

// Show popup
function showPopup(type, title, message) {
    const popupIcon = document.getElementById('popupIcon');
    const popupTitle = document.getElementById('popupTitle');
    const popupMessage = document.getElementById('popupMessage');
    
    // Set content
    popupTitle.textContent = title;
    popupMessage.textContent = message;
    
    // Set icon and colors based on type
    switch (type) {
        case 'success':
            popupIcon.textContent = '✅';
            popupIcon.style.color = '#22c55e';
            break;
        case 'error':
            popupIcon.textContent = '❌';
            popupIcon.style.color = '#ef4444';
            break;
        case 'info':
            popupIcon.textContent = 'ℹ️';
            popupIcon.style.color = '#3b82f6';
            break;
        default:
            popupIcon.textContent = '📧';
            popupIcon.style.color = '#4ade80';
    }
    
    // Show popup
    messagePopup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close popup
function closePopup() {
    messagePopup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Reset form
function resetForm() {
    form.reset();
    form.classList.remove('form-success', 'form-loading');
    
    // Reset service type and hide enquiry fields
    serviceTypeSelect.value = '';
    enquiryFields.style.display = 'none';
    
    // Clear all validation states
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error', 'valid');
    });
    
    // Clear error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
        msg.textContent = '';
    });
    
    // Reset character count
    updateCharacterCount();
    
    // Reset submission state
    setSubmissionState('default');
    
    // Scroll to top of form
    form.scrollIntoView({ behavior: 'smooth' });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes popup
    if (e.key === 'Escape' && messagePopup.style.display === 'flex') {
        closePopup();
    }
    
    // Ctrl/Cmd + Enter submits form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isSubmitting) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
});

// Auto-save form data to localStorage
function autoSaveFormData() {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    localStorage.setItem('sm_agro_contact_form', JSON.stringify(data));
}

// Restore form data from localStorage
function restoreFormData() {
    const savedData = localStorage.getItem('sm_agro_contact_form');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = data[key] === 'on';
                    } else {
                        field.value = data[key];
                    }
                }
            });
            
            // Trigger service type change if needed
            if (data.serviceType) {
                handleServiceTypeChange();
            }
        } catch (e) {
            console.warn('Could not restore form data:', e);
        }
    }
}

// Clear saved form data
function clearSavedFormData() {
    localStorage.removeItem('sm_agro_contact_form');
}

// Setup auto-save
function setupAutoSave() {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', debounce(autoSaveFormData, 1000));
    });
}

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize auto-save and restore on load
document.addEventListener('DOMContentLoaded', function() {
    setupAutoSave();
    restoreFormData();
});

// Clear saved data on successful submission
window.addEventListener('beforeunload', function() {
    // Only clear if form was successfully submitted
    if (form.classList.contains('form-success')) {
        clearSavedFormData();
    }
});

console.log('SM Agro Trades Contact Form initialized successfully!');