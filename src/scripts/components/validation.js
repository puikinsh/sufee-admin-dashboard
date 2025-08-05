// Form Validation Component - Vanilla JS replacement for jQuery Validation

export class FormValidator {
  constructor(form, rules = {}) {
    this.form = typeof form === 'string' ? document.querySelector(form) : form;
    this.rules = rules;
    this.errors = {};

    if (this.form) {
      this.init();
    }
  }

  init() {
    this.parseRulesFromAttributes();
    this.setupEventListeners();
  }

  parseRulesFromAttributes() {
    const inputs = this.form.querySelectorAll('[data-validate]');
    inputs.forEach(input => {
      const rules = input.dataset.validate.split('|');
      this.rules[input.name] = rules;
    });
  }

  setupEventListeners() {
    // Form submission
    this.form.addEventListener('submit', e => {
      if (!this.validateForm()) {
        e.preventDefault();
        this.displayErrors();
      }
    });

    // Real-time validation
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  validateForm() {
    this.errors = {};
    let isValid = true;

    Object.keys(this.rules).forEach(fieldName => {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      if (field && !this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const rules = this.rules[fieldName] || [];

    delete this.errors[fieldName];

    for (const rule of rules) {
      const [ruleName, ruleValue] = rule.split(':');

      if (!this.applyRule(fieldValue, ruleName, ruleValue, field)) {
        this.errors[fieldName] = this.getErrorMessage(fieldName, ruleName, ruleValue);
        this.showFieldError(field, this.errors[fieldName]);
        return false;
      }
    }

    this.clearFieldError(field);
    return true;
  }

  applyRule(value, ruleName, ruleValue, field) {
    switch (ruleName) {
      case 'required':
        return value.length > 0;

      case 'min':
        return value.length >= parseInt(ruleValue);

      case 'max':
        return value.length <= parseInt(ruleValue);

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !value || emailRegex.test(value);

      case 'numeric':
        return !value || /^\d+$/.test(value);

      case 'alpha':
        return !value || /^[a-zA-Z]+$/.test(value);

      case 'alphanumeric':
        return !value || /^[a-zA-Z0-9]+$/.test(value);

      case 'url':
        try {
          new URL(value);
          return true;
        } catch {
          return !value;
        }

      case 'confirmed':
        const confirmField = this.form.querySelector(`[name="${ruleValue}"]`);
        return confirmField && value === confirmField.value;

      case 'regex':
        const regex = new RegExp(ruleValue);
        return !value || regex.test(value);

      default:
        return true;
    }
  }

  getErrorMessage(fieldName, ruleName, ruleValue) {
    const fieldLabel = this.getFieldLabel(fieldName);

    const messages = {
      required: `${fieldLabel} is required.`,
      min: `${fieldLabel} must be at least ${ruleValue} characters.`,
      max: `${fieldLabel} must not exceed ${ruleValue} characters.`,
      email: `${fieldLabel} must be a valid email address.`,
      numeric: `${fieldLabel} must be numeric.`,
      alpha: `${fieldLabel} must contain only letters.`,
      alphanumeric: `${fieldLabel} must contain only letters and numbers.`,
      url: `${fieldLabel} must be a valid URL.`,
      confirmed: `${fieldLabel} confirmation does not match.`,
      regex: `${fieldLabel} format is invalid.`
    };

    return messages[ruleName] || `${fieldLabel} is invalid.`;
  }

  getFieldLabel(fieldName) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    const label = this.form.querySelector(`label[for="${field?.id}"]`);

    if (label) {
      return label.textContent.replace('*', '').trim();
    }

    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/[_-]/g, ' ');
  }

  showFieldError(field, message) {
    this.clearFieldError(field);

    field.classList.add('is-invalid');

    const errorElement = document.createElement('div');
    errorElement.className = 'invalid-feedback';
    errorElement.textContent = message;

    field.parentNode.appendChild(errorElement);
  }

  clearFieldError(field) {
    field.classList.remove('is-invalid');

    const errorElement = field.parentNode.querySelector('.invalid-feedback');
    if (errorElement) {
      errorElement.remove();
    }
  }

  displayErrors() {
    // Show a summary of errors if needed
    if (Object.keys(this.errors).length > 0) {
      const errorSummary = document.createElement('div');
      errorSummary.className = 'alert alert-danger';
      errorSummary.innerHTML = `
        <strong>Please correct the following errors:</strong>
        <ul class="mb-0 mt-2">
          ${Object.values(this.errors)
            .map(error => `<li>${error}</li>`)
            .join('')}
        </ul>
      `;

      // Remove existing error summary
      const existingError = this.form.querySelector('.alert-danger');
      if (existingError) {
        existingError.remove();
      }

      this.form.insertBefore(errorSummary, this.form.firstChild);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (errorSummary.parentNode) {
          errorSummary.remove();
        }
      }, 5000);
    }
  }

  // Public API methods
  addRule(fieldName, rules) {
    this.rules[fieldName] = Array.isArray(rules) ? rules : [rules];
  }

  removeRule(fieldName) {
    delete this.rules[fieldName];
  }

  resetValidation() {
    this.errors = {};

    // Clear all field errors
    const invalidFields = this.form.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => this.clearFieldError(field));

    // Remove error summary
    const errorSummary = this.form.querySelector('.alert-danger');
    if (errorSummary) {
      errorSummary.remove();
    }
  }

  destroy() {
    this.resetValidation();
  }
}
