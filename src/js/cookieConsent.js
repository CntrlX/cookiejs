/**
 * Webflow Cookie Consent - GDPR Compliant Solution
 * Version: 1.0.0
 * License: MIT
 * 
 * Features:
 * - GDPR compliant cookie consent management
 * - Google Consent Mode v2 support
 * - Granular consent categories
 * - Local storage for preferences
 * - Multi-language support
 * - Mobile responsive design
 * - Webflow optimized
 */

(function(window, document) {
    'use strict';

    // Default configuration
    const defaultConfig = {
        // Basic settings
        position: 'bottom',
        theme: 'light',
        language: 'en',
        autoShow: true,
        cookieExpiry: 365,
        
        // GDPR compliance settings
        strictMode: true,
        showDeclineButton: true,
        blockCookiesBeforeConsent: true,
        recordConsent: true,
        
        // Google Consent Mode v2
        googleConsentMode: true,
        defaultConsentState: {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'functionality_storage': 'denied',
            'personalization_storage': 'denied',
            'security_storage': 'granted'
        },
        
        // UI customization
        showIcon: true,
        showPreferencesOnFirst: false,
        animation: 'slide',
        
        // Categories
        categories: {
            necessary: {
                enabled: true,
                readOnly: true,
                label: 'Strictly Necessary',
                description: 'These cookies are essential for the website to function properly.'
            },
            analytics: {
                enabled: false,
                readOnly: false,
                label: 'Analytics',
                description: 'These cookies help us understand how visitors interact with our website.'
            },
            marketing: {
                enabled: false,
                readOnly: false,
                label: 'Marketing',
                description: 'These cookies are used to track visitors and display relevant advertisements.'
            },
            personalization: {
                enabled: false,
                readOnly: false,
                label: 'Personalization',
                description: 'These cookies help us provide personalized content and experiences.'
            }
        },
        
        // Text content
        content: {
            header: 'We use cookies',
            message: 'This website uses cookies to enhance your browsing experience and provide personalized content. By clicking "Accept All", you consent to our use of cookies.',
            acceptButton: 'Accept All',
            declineButton: 'Decline All',
            settingsButton: 'Cookie Settings',
            saveButton: 'Save Preferences',
            closeButton: 'Close',
            privacyPolicy: 'Privacy Policy',
            cookiePolicy: 'Cookie Policy'
        },
        
        // Links
        privacyPolicyUrl: '#',
        cookiePolicyUrl: '#',
        
        // Callbacks
        onAccept: null,
        onDecline: null,
        onSave: null,
        onChange: null
    };

    // Translations
    const translations = {
        en: {
            header: 'We use cookies',
            message: 'This website uses cookies to enhance your browsing experience and provide personalized content. By clicking "Accept All", you consent to our use of cookies.',
            acceptButton: 'Accept All',
            declineButton: 'Decline All',
            settingsButton: 'Cookie Settings',
            saveButton: 'Save Preferences',
            closeButton: 'Close',
            privacyPolicy: 'Privacy Policy',
            cookiePolicy: 'Cookie Policy',
            managePreferences: 'Manage Cookie Preferences',
            categoryHeaders: {
                necessary: 'Strictly Necessary Cookies',
                analytics: 'Analytics Cookies',
                marketing: 'Marketing Cookies',
                personalization: 'Personalization Cookies'
            }
        },
        de: {
            header: 'Wir verwenden Cookies',
            message: 'Diese Website verwendet Cookies, um Ihr Surferlebnis zu verbessern und personalisierte Inhalte bereitzustellen. Durch Klicken auf "Alle akzeptieren" stimmen Sie der Verwendung von Cookies zu.',
            acceptButton: 'Alle akzeptieren',
            declineButton: 'Alle ablehnen',
            settingsButton: 'Cookie-Einstellungen',
            saveButton: 'Einstellungen speichern',
            closeButton: 'Schließen',
            privacyPolicy: 'Datenschutzrichtlinie',
            cookiePolicy: 'Cookie-Richtlinie',
            managePreferences: 'Cookie-Einstellungen verwalten'
        },
        fr: {
            header: 'Nous utilisons des cookies',
            message: 'Ce site web utilise des cookies pour améliorer votre expérience de navigation et fournir du contenu personnalisé. En cliquant sur "Tout accepter", vous consentez à notre utilisation des cookies.',
            acceptButton: 'Tout accepter',
            declineButton: 'Tout refuser',
            settingsButton: 'Paramètres des cookies',
            saveButton: 'Enregistrer les préférences',
            closeButton: 'Fermer',
            privacyPolicy: 'Politique de confidentialité',
            cookiePolicy: 'Politique des cookies',
            managePreferences: 'Gérer les préférences de cookies'
        }
    };

    class CookieConsent {
        constructor(userConfig = {}) {
            this.config = this.mergeConfig(defaultConfig, userConfig);
            this.consentData = this.loadConsentData();
            this.isInitialized = false;
            this.modal = null;
            this.banner = null;
            
            // Initialize Google Consent Mode if enabled
            if (this.config.googleConsentMode) {
                this.initGoogleConsentMode();
            }
            
            // Auto-initialize if enabled
            if (this.config.autoShow) {
                this.init();
            }
        }

        mergeConfig(defaultConfig, userConfig) {
            const merged = JSON.parse(JSON.stringify(defaultConfig));
            
            // Deep merge user config
            for (const key in userConfig) {
                if (typeof userConfig[key] === 'object' && userConfig[key] !== null && !Array.isArray(userConfig[key])) {
                    merged[key] = Object.assign(merged[key] || {}, userConfig[key]);
                } else {
                    merged[key] = userConfig[key];
                }
            }
            
            return merged;
        }

        init() {
            if (this.isInitialized) return;
            
            this.isInitialized = true;
            
            // Add CSS if not already present
            this.addStyles();
            
            // Show banner if no consent exists
            if (!this.hasValidConsent()) {
                this.showBanner();
            } else {
                // Apply existing consent
                this.applyConsent(this.consentData);
            }
            
            // Block cookies if strict mode is enabled
            if (this.config.blockCookiesBeforeConsent && !this.hasValidConsent()) {
                this.blockCookies();
            }
            
            this.bindEvents();
        }

        hasValidConsent() {
            return this.consentData && 
                   this.consentData.timestamp && 
                   this.consentData.categories &&
                   (Date.now() - this.consentData.timestamp) < (this.config.cookieExpiry * 24 * 60 * 60 * 1000);
        }

        loadConsentData() {
            try {
                const data = localStorage.getItem('cookieConsent');
                return data ? JSON.parse(data) : null;
            } catch (e) {
                console.warn('Failed to load cookie consent data:', e);
                return null;
            }
        }

        saveConsentData(categories, action = 'save') {
            const consentData = {
                version: '1.0.0',
                timestamp: Date.now(),
                action: action,
                categories: categories,
                userAgent: navigator.userAgent,
                language: this.config.language
            };
            
            try {
                localStorage.setItem('cookieConsent', JSON.stringify(consentData));
                this.consentData = consentData;
                
                if (this.config.recordConsent) {
                    this.recordConsentEvent(consentData);
                }
                
                return true;
            } catch (e) {
                console.error('Failed to save cookie consent data:', e);
                return false;
            }
        }

        recordConsentEvent(consentData) {
            // Send consent record to your analytics/backend
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cookie_consent', {
                    action: consentData.action,
                    categories: Object.keys(consentData.categories).filter(cat => consentData.categories[cat]),
                    timestamp: consentData.timestamp
                });
            }
        }

        initGoogleConsentMode() {
            if (typeof gtag === 'undefined') {
                // Initialize dataLayer if gtag is not available
                window.dataLayer = window.dataLayer || [];
                window.gtag = function() {
                    dataLayer.push(arguments);
                };
            }
            
            // Set default consent states
            gtag('consent', 'default', this.config.defaultConsentState);
        }

        updateGoogleConsent(categories) {
            if (!this.config.googleConsentMode || typeof gtag === 'undefined') return;
            
            const consentUpdate = {
                'ad_storage': categories.marketing ? 'granted' : 'denied',
                'analytics_storage': categories.analytics ? 'granted' : 'denied',
                'functionality_storage': categories.necessary ? 'granted' : 'denied',
                'personalization_storage': categories.personalization ? 'granted' : 'denied',
                'security_storage': 'granted' // Always granted for security
            };
            
            gtag('consent', 'update', consentUpdate);
        }

        blockCookies() {
            // Override document.cookie to block non-essential cookies
            if (!this.hasValidConsent()) {
                const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                                               Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
                
                if (originalCookieDescriptor && originalCookieDescriptor.configurable) {
                    Object.defineProperty(document, 'cookie', {
                        get: function() {
                            return originalCookieDescriptor.get.call(this);
                        },
                        set: function(value) {
                            // Allow only essential cookies before consent
                            if (this.isEssentialCookie(value)) {
                                return originalCookieDescriptor.set.call(this, value);
                            }
                            console.warn('Cookie blocked before consent:', value);
                            return value;
                        }.bind(this),
                        configurable: true
                    });
                }
            }
        }

        isEssentialCookie(cookieString) {
            const essentialCookies = [
                'cookieConsent',
                'PHPSESSID',
                'csrftoken',
                '_csrf',
                'sessionid'
            ];
            
            return essentialCookies.some(name => cookieString.includes(name + '='));
        }

        showBanner() {
            if (this.banner) return;
            
            this.banner = this.createBanner();
            document.body.appendChild(this.banner);
            
            // Animate in
            setTimeout(() => {
                this.banner.classList.add('cc-show');
            }, 100);
        }

        hideBanner() {
            if (!this.banner) return;
            
            this.banner.classList.remove('cc-show');
            setTimeout(() => {
                if (this.banner && this.banner.parentNode) {
                    this.banner.parentNode.removeChild(this.banner);
                }
                this.banner = null;
            }, 300);
        }

        createBanner() {
            const banner = document.createElement('div');
            banner.className = `cc-banner cc-${this.config.position} cc-${this.config.theme}`;
            
            const content = this.getTranslation('content') || this.config.content;
            
            banner.innerHTML = `
                <div class="cc-container">
                    <div class="cc-content">
                        <div class="cc-header">
                            ${this.config.showIcon ? '<div class="cc-icon">🍪</div>' : ''}
                            <h3 class="cc-title">${content.header}</h3>
                        </div>
                        <p class="cc-message">${content.message}</p>
                        <div class="cc-links">
                            <a href="${this.config.privacyPolicyUrl}" target="_blank" class="cc-link">${content.privacyPolicy}</a>
                            <a href="${this.config.cookiePolicyUrl}" target="_blank" class="cc-link">${content.cookiePolicy}</a>
                        </div>
                    </div>
                    <div class="cc-actions">
                        ${this.config.showDeclineButton ? `<button class="cc-btn cc-btn-decline" data-action="decline">${content.declineButton}</button>` : ''}
                        <button class="cc-btn cc-btn-settings" data-action="settings">${content.settingsButton}</button>
                        <button class="cc-btn cc-btn-accept" data-action="accept">${content.acceptButton}</button>
                    </div>
                </div>
            `;
            
            return banner;
        }

        showModal() {
            if (this.modal) return;
            
            this.modal = this.createModal();
            document.body.appendChild(this.modal);
            document.body.classList.add('cc-modal-open');
            
            setTimeout(() => {
                this.modal.classList.add('cc-show');
            }, 100);
        }

        hideModal() {
            if (!this.modal) return;
            
            this.modal.classList.remove('cc-show');
            document.body.classList.remove('cc-modal-open');
            
            setTimeout(() => {
                if (this.modal && this.modal.parentNode) {
                    this.modal.parentNode.removeChild(this.modal);
                }
                this.modal = null;
            }, 300);
        }

        createModal() {
            const modal = document.createElement('div');
            modal.className = `cc-modal cc-${this.config.theme}`;
            
            const content = this.getTranslation('content') || this.config.content;
            const categoryHeaders = this.getTranslation('categoryHeaders') || {};
            
            let categoriesHtml = '';
            for (const [key, category] of Object.entries(this.config.categories)) {
                const isChecked = this.consentData?.categories?.[key] || category.enabled;
                const isDisabled = category.readOnly ? 'disabled' : '';
                
                categoriesHtml += `
                    <div class="cc-category">
                        <div class="cc-category-header">
                            <label class="cc-switch">
                                <input type="checkbox" name="category" value="${key}" ${isChecked ? 'checked' : ''} ${isDisabled}>
                                <span class="cc-slider"></span>
                            </label>
                            <h4>${categoryHeaders[key] || category.label}</h4>
                        </div>
                        <p class="cc-category-description">${category.description}</p>
                    </div>
                `;
            }
            
            modal.innerHTML = `
                <div class="cc-modal-backdrop"></div>
                <div class="cc-modal-content">
                    <div class="cc-modal-header">
                        <h2>${content.managePreferences || 'Manage Cookie Preferences'}</h2>
                        <button class="cc-close" data-action="close">&times;</button>
                    </div>
                    <div class="cc-modal-body">
                        <p class="cc-modal-description">${content.message}</p>
                        <div class="cc-categories">
                            ${categoriesHtml}
                        </div>
                    </div>
                    <div class="cc-modal-footer">
                        <button class="cc-btn cc-btn-decline" data-action="decline">${content.declineButton}</button>
                        <button class="cc-btn cc-btn-save" data-action="save">${content.saveButton}</button>
                        <button class="cc-btn cc-btn-accept" data-action="accept">${content.acceptButton}</button>
                    </div>
                </div>
            `;
            
            return modal;
        }

        getTranslation(key) {
            return translations[this.config.language]?.[key];
        }

        bindEvents() {
            // Event delegation for banner and modal buttons
            document.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (!action) return;
                
                switch (action) {
                    case 'accept':
                        this.acceptAll();
                        break;
                    case 'decline':
                        this.declineAll();
                        break;
                    case 'settings':
                        this.showModal();
                        break;
                    case 'save':
                        this.savePreferences();
                        break;
                    case 'close':
                        this.hideModal();
                        break;
                }
            });
            
            // Close modal on backdrop click
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('cc-modal-backdrop')) {
                    this.hideModal();
                }
            });
            
            // Escape key to close modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal) {
                    this.hideModal();
                }
            });
        }

        acceptAll() {
            const categories = {};
            for (const key of Object.keys(this.config.categories)) {
                categories[key] = true;
            }
            
            this.saveConsentData(categories, 'accept_all');
            this.applyConsent({ categories });
            this.hideBanner();
            this.hideModal();
            
            if (this.config.onAccept) {
                this.config.onAccept(categories);
            }
        }

        declineAll() {
            const categories = {};
            for (const [key, category] of Object.entries(this.config.categories)) {
                categories[key] = category.readOnly; // Only necessary cookies
            }
            
            this.saveConsentData(categories, 'decline_all');
            this.applyConsent({ categories });
            this.hideBanner();
            this.hideModal();
            
            if (this.config.onDecline) {
                this.config.onDecline(categories);
            }
        }

        savePreferences() {
            if (!this.modal) return;
            
            const checkboxes = this.modal.querySelectorAll('input[name="category"]');
            const categories = {};
            
            checkboxes.forEach(checkbox => {
                categories[checkbox.value] = checkbox.checked;
            });
            
            this.saveConsentData(categories, 'save_preferences');
            this.applyConsent({ categories });
            this.hideBanner();
            this.hideModal();
            
            if (this.config.onSave) {
                this.config.onSave(categories);
            }
        }

        applyConsent(consentData) {
            if (!consentData?.categories) return;
            
            // Update Google Consent Mode
            this.updateGoogleConsent(consentData.categories);
            
            // Enable/disable tracking scripts based on consent
            this.toggleTrackingScripts(consentData.categories);
            
            // Trigger change callback
            if (this.config.onChange) {
                this.config.onChange(consentData.categories);
            }
        }

        toggleTrackingScripts(categories) {
            // Enable/disable Google Analytics
            if (categories.analytics) {
                this.enableGoogleAnalytics();
            } else {
                this.disableGoogleAnalytics();
            }
            
            // Enable/disable marketing pixels
            if (categories.marketing) {
                this.enableMarketingPixels();
            } else {
                this.disableMarketingPixels();
            }
        }

        enableGoogleAnalytics() {
            // Re-enable Google Analytics if it was blocked
            if (typeof gtag !== 'undefined') {
                gtag('config', 'GA_MEASUREMENT_ID', {
                    page_title: document.title,
                    page_location: window.location.href
                });
            }
        }

        disableGoogleAnalytics() {
            // Disable Google Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied'
                });
            }
        }

        enableMarketingPixels() {
            // Enable marketing pixels (Facebook, Google Ads, etc.)
            if (typeof fbq !== 'undefined') {
                fbq('consent', 'grant');
            }
        }

        disableMarketingPixels() {
            // Disable marketing pixels
            if (typeof fbq !== 'undefined') {
                fbq('consent', 'revoke');
            }
        }

        addStyles() {
            if (document.getElementById('cc-styles')) return;
            
            const link = document.createElement('link');
            link.id = 'cc-styles';
            link.rel = 'stylesheet';
            link.href = 'src/css/cookieConsent.css';
            document.head.appendChild(link);
        }

        // Public API methods
        show() {
            this.showBanner();
        }

        hide() {
            this.hideBanner();
        }

        reset() {
            localStorage.removeItem('cookieConsent');
            this.consentData = null;
            this.showBanner();
        }

        getConsent() {
            return this.consentData;
        }

        hasConsent(category) {
            return this.consentData?.categories?.[category] || false;
        }

        setLanguage(language) {
            this.config.language = language;
        }

        updateConfig(newConfig) {
            this.config = this.mergeConfig(this.config, newConfig);
        }
    }

    // Export to global scope
    window.CookieConsent = CookieConsent;

    // Auto-initialize if config is provided
    if (window.cookieConsentConfig) {
        new CookieConsent(window.cookieConsentConfig);
    }

})(window, document); 