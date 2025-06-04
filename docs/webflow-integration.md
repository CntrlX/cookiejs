# Webflow Integration Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [CDN Setup Options](#cdn-setup-options)
3. [Step-by-Step Installation](#step-by-step-installation)
4. [Google Consent Mode v2 Setup](#google-consent-mode-v2-setup)
5. [Customization Options](#customization-options)
6. [Advanced Configuration](#advanced-configuration)
7. [Troubleshooting](#troubleshooting)

## Quick Start

### Option 1: Self-Hosted (Recommended for Production)

**In Project Settings > Custom Code > Head Code:**
```html
<!-- Cookie Consent CSS -->
<link rel="stylesheet" href="/path/to/cookieConsent.min.css">

<!-- Google Consent Mode v2 (if using Google Analytics) -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  
  // Set default consent states
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'functionality_storage': 'denied',
    'personalization_storage': 'denied',
    'security_storage': 'granted'
  });
</script>
```

**In Project Settings > Custom Code > Footer Code:**
```html
<!-- Cookie Consent Library -->
<script src="/path/to/cookieConsent.min.js"></script>

<!-- Initialize Cookie Consent -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  new CookieConsent({
    privacyPolicyUrl: '/privacy-policy',
    cookiePolicyUrl: '/cookie-policy',
    content: {
      header: 'We use cookies',
      message: 'This website uses cookies to enhance your browsing experience and provide personalized content. By clicking "Accept All", you consent to our use of cookies.'
    }
  });
});
</script>
```

### Option 2: GitHub CDN (jsDelivr)

**In Project Settings > Custom Code > Head Code:**
```html
<!-- Cookie Consent CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO-NAME@latest/dist/cookieConsent.min.css">
```

**In Project Settings > Custom Code > Footer Code:**
```html
<!-- Cookie Consent Library -->
<script src="https://cdn.jsdelivr.net/gh/cntrlx/cookiejs@latest/dist/cookieConsent.min.js"></script>
```

**⚠️ Important**: Replace `YOUR-USERNAME/YOUR-REPO-NAME` with your actual GitHub details.

## CDN Setup Options

### 1. GitHub + jsDelivr CDN Setup

**Step 1: Create a GitHub Repository**
1. Go to GitHub and create a new public repository
2. Clone this cookie consent project or fork it
3. Make sure you have the `dist/` folder with minified files

**Step 2: Build the Distribution Files**
```bash
# If you have the source files, build the minified versions
npm install
npm run build
```

**Step 3: Commit and Push**
```bash
git add .
git commit -m "Add cookie consent solution"
git push origin main
```

**Step 4: Use jsDelivr CDN**
The URL format is: `https://cdn.jsdelivr.net/gh/USERNAME/REPOSITORY@VERSION/path`

Examples:
```html
<!-- Using latest version -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/yourusername/webflow-cookie-consent@latest/dist/cookieConsent.min.css">
<script src="https://cdn.jsdelivr.net/gh/yourusername/webflow-cookie-consent@latest/dist/cookieConsent.min.js"></script>

<!-- Using specific version (recommended for production) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/yourusername/webflow-cookie-consent@1.0.0/dist/cookieConsent.min.css">
<script src="https://cdn.jsdelivr.net/gh/yourusername/webflow-cookie-consent@1.0.0/dist/cookieConsent.min.js"></script>

<!-- Using specific branch -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/yourusername/webflow-cookie-consent@main/dist/cookieConsent.min.css">
<script src="https://cdn.jsdelivr.net/gh/yourusername/webflow-cookie-consent@main/dist/cookieConsent.min.js"></script>
```

### 2. Alternative CDN Options

**UNPKG (if you publish to npm)**
```html
<link rel="stylesheet" href="https://unpkg.com/your-package-name@latest/dist/cookieConsent.min.css">
<script src="https://unpkg.com/your-package-name@latest/dist/cookieConsent.min.js"></script>
```

**Your Own CDN/Server**
```html
<link rel="stylesheet" href="https://your-domain.com/assets/cookieConsent.min.css">
<script src="https://your-domain.com/assets/cookieConsent.min.js"></script>
```

### 3. Webflow Asset Upload

**Upload to Webflow Assets:**
1. In Webflow Designer, go to Assets panel
2. Upload `cookieConsent.min.js` and `cookieConsent.min.css`
3. Copy the Webflow asset URLs
4. Use those URLs in your custom code

```html
<!-- Example with Webflow asset URLs -->
<link rel="stylesheet" href="https://uploads-ssl.webflow.com/YOUR-SITE-ID/files/cookieConsent.min.css">
<script src="https://uploads-ssl.webflow.com/YOUR-SITE-ID/files/cookieConsent.min.js"></script>
```

## Step-by-Step Installation

### Step 1: Prepare Your Files

**Download the Files:**
1. Download `cookieConsent.min.js` and `cookieConsent.min.css` from the `dist/` folder
2. Choose your hosting method (self-hosted, CDN, or Webflow assets)

**Create Privacy Pages** (if you haven't already):
- Create a "Privacy Policy" page at `/privacy-policy`
- Create a "Cookie Policy" page at `/cookie-policy`

### Step 2: Add CSS Styles

In the **Head Code** section, add:

```html
<!-- Cookie Consent Styles -->
<style>
/* Inline critical CSS for immediate loading */
.cc-banner {
  position: fixed !important;
  z-index: 9999 !important;
  font-family: inherit !important;
}
</style>

<!-- Full CSS (choose one option below) -->

<!-- Option A: Self-hosted -->
<link rel="preload" href="/assets/cookieConsent.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/assets/cookieConsent.min.css"></noscript>

<!-- Option B: GitHub CDN (replace YOUR-USERNAME/YOUR-REPO) -->
<link rel="preload" href="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@latest/dist/cookieConsent.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@latest/dist/cookieConsent.min.css"></noscript>

<!-- Option C: Webflow Assets -->
<link rel="preload" href="https://uploads-ssl.webflow.com/YOUR-SITE-ID/files/cookieConsent.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://uploads-ssl.webflow.com/YOUR-SITE-ID/files/cookieConsent.min.css"></noscript>
```

### Step 3: Configure Google Consent Mode v2

Still in the **Head Code** section, add:

```html
<!-- Google Consent Mode v2 Configuration -->
<script>
  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  
  // Set default consent to denied for all categories
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'functionality_storage': 'denied',
    'personalization_storage': 'denied',
    'security_storage': 'granted'
  });
  
  // Configure ads data redaction
  gtag('set', 'ads_data_redaction', true);
</script>

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXX');</script>
```

**Replace `GTM-XXXXXX` with your actual Google Tag Manager ID.**

### Step 4: Add the Cookie Consent Library

In the **Footer Code** section, add:

```html
<!-- Cookie Consent Library (choose one option below) -->

<!-- Option A: Self-hosted -->
<script src="/assets/cookieConsent.min.js"></script>

<!-- Option B: GitHub CDN (replace YOUR-USERNAME/YOUR-REPO) -->
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@latest/dist/cookieConsent.min.js"></script>

<!-- Option C: Webflow Assets -->
<script src="https://uploads-ssl.webflow.com/YOUR-SITE-ID/files/cookieConsent.min.js"></script>

<!-- Cookie Consent Configuration -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Cookie Consent
  const cookieConsent = new CookieConsent({
    // Basic settings
    position: 'bottom',
    theme: 'light',
    language: 'en',
    
    // GDPR compliance
    strictMode: true,
    showDeclineButton: true,
    blockCookiesBeforeConsent: true,
    
    // Google Consent Mode v2
    googleConsentMode: true,
    
    // Content customization
    content: {
      header: 'We use cookies',
      message: 'This website uses cookies to enhance your browsing experience and provide personalized content. By clicking "Accept All", you consent to our use of cookies.',
      acceptButton: 'Accept All',
      declineButton: 'Decline All',
      settingsButton: 'Cookie Settings'
    },
    
    // Links to your policies
    privacyPolicyUrl: '/privacy-policy',
    cookiePolicyUrl: '/cookie-policy',
    
    // Callbacks
    onAccept: function(categories) {
      console.log('Cookies accepted:', categories);
      // Enable tracking scripts
      enableTracking(categories);
    },
    
    onDecline: function(categories) {
      console.log('Cookies declined:', categories);
      // Disable non-essential tracking
      disableTracking();
    },
    
    onChange: function(categories) {
      console.log('Cookie preferences changed:', categories);
      // Update tracking based on new preferences
      updateTracking(categories);
    }
  });
  
  // Helper functions for managing tracking scripts
  function enableTracking(categories) {
    if (categories.analytics) {
      // Enable Google Analytics
      gtag('config', 'GA_MEASUREMENT_ID');
    }
    
    if (categories.marketing) {
      // Enable marketing pixels
      // Facebook Pixel, Google Ads, etc.
    }
  }
  
  function disableTracking() {
    // Disable all non-essential tracking
    gtag('consent', 'update', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied'
    });
  }
  
  function updateTracking(categories) {
    // Update consent based on user preferences
    gtag('consent', 'update', {
      'analytics_storage': categories.analytics ? 'granted' : 'denied',
      'ad_storage': categories.marketing ? 'granted' : 'denied',
      'functionality_storage': categories.necessary ? 'granted' : 'denied',
      'personalization_storage': categories.personalization ? 'granted' : 'denied'
    });
  }
});
</script>
```

### Step 5: Add Google Tag Manager Container

In the **Footer Code** section (after the cookie consent script), add:

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

## Google Consent Mode v2 Setup

### Configure Tags in Google Tag Manager

1. **Create Consent Initialization Tag**:
   - Tag Type: Custom HTML
   - HTML:
   ```html
   <script>
     gtag('consent', 'default', {
       'ad_storage': 'denied',
       'analytics_storage': 'denied',
       'functionality_storage': 'denied',
       'personalization_storage': 'denied',
       'security_storage': 'granted'
     });
   </script>
   ```
   - Trigger: All Pages

2. **Configure Google Analytics Tag**:
   - Go to your GA4 Configuration tag
   - Under "Additional Settings" > "Consent Settings"
   - Set: "No additional consent required"
   - Add consent state: `analytics_storage` = Required

3. **Configure Google Ads Tags**:
   - Under "Consent Settings"
   - Add consent states:
     - `ad_storage` = Required
     - `analytics_storage` = Required (for conversion tracking)

### Test Consent Mode

1. Use [Google Tag Assistant](https://tagassistant.google.com/)
2. Check consent states in browser developer tools:
   ```javascript
   // Check current consent states
   gtag('get');
   ```

## Customization Options

### Basic Theming

```javascript
new CookieConsent({
  theme: 'dark', // 'light' or 'dark'
  position: 'top', // 'top' or 'bottom'
  
  // Custom colors (CSS custom properties)
  customCSS: `
    :root {
      --cc-primary-color: #your-brand-color;
      --cc-bg-banner: #your-background-color;
    }
  `
});
```

### Content Localization

```javascript
new CookieConsent({
  language: 'de', // 'en', 'de', 'fr' (built-in)
  
  // Or provide custom content
  content: {
    header: 'Custom Header',
    message: 'Your custom message about cookies...',
    acceptButton: 'Accept',
    declineButton: 'Decline',
    settingsButton: 'Settings'
  }
});
```

### Category Customization

```javascript
new CookieConsent({
  categories: {
    necessary: {
      enabled: true,
      readOnly: true,
      label: 'Essential Cookies',
      description: 'Required for website functionality.'
    },
    analytics: {
      enabled: false,
      readOnly: false,
      label: 'Analytics',
      description: 'Help us improve our website.'
    },
    marketing: {
      enabled: false,
      readOnly: false,
      label: 'Marketing',
      description: 'Used for advertising purposes.'
    }
  }
});
```

## Advanced Configuration

### Custom Styling

Create a custom CSS file or add styles to your Webflow custom code:

```css
/* Override default styles */
.cc-banner {
  border-radius: 12px !important;
  margin: 20px !important;
}

.cc-btn-accept {
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
}

/* Custom brand colors */
:root {
  --cc-primary-color: #your-brand-color;
  --cc-primary-hover: #your-brand-hover-color;
}
```

### Integration with Webflow CMS

```javascript
// Dynamic privacy policy URL from CMS
const privacyPage = document.querySelector('[data-privacy-url]');
const privacyUrl = privacyPage ? privacyPage.href : '/privacy-policy';

new CookieConsent({
  privacyPolicyUrl: privacyUrl,
  // ... other options
});
```

### Custom Event Tracking

```javascript
new CookieConsent({
  onAccept: function(categories) {
    // Track acceptance in your analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'cookie_consent_accept', {
        categories: Object.keys(categories).filter(key => categories[key])
      });
    }
  },
  
  onDecline: function(categories) {
    // Track decline
    if (typeof gtag !== 'undefined') {
      gtag('event', 'cookie_consent_decline');
    }
  }
});
```

### Cookie Management Button

Add a button anywhere on your site to reopen cookie preferences:

**In Webflow Designer:**
1. Add a button element
2. Give it a class name like `cookie-settings-btn`
3. Add this script to your footer code:

```javascript
// Add cookie settings button functionality
document.addEventListener('DOMContentLoaded', function() {
  const settingsButtons = document.querySelectorAll('.cookie-settings-btn');
  
  settingsButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Show cookie preferences
      if (window.cookieConsentInstance) {
        window.cookieConsentInstance.show();
      }
    });
  });
});

// Store instance globally for access
let cookieConsentInstance = new CookieConsent({
  // ... your config
});
window.cookieConsentInstance = cookieConsentInstance;
```

## Troubleshooting

### Common Issues

1. **Banner not showing**:
   - Check console for JavaScript errors
   - Ensure CSS and JS files are loading
   - Verify Webflow custom code sections

2. **Google Consent Mode not working**:
   - Verify GTM container ID is correct
   - Check that consent initialization happens before GTM
   - Use Google Tag Assistant to debug

3. **Styling conflicts**:
   - Add `!important` to CSS rules if needed
   - Check z-index values
   - Ensure CSS custom properties are supported

4. **Mobile display issues**:
   - Test responsive design
   - Check touch target sizes (minimum 44px)
   - Verify modal scrolling on small screens

### Debug Mode

Enable debug mode to troubleshoot:

```javascript
new CookieConsent({
  debug: true, // Enables console logging
  // ... other options
});
```

### Testing Checklist

- [ ] Banner appears on first visit
- [ ] Decline button works (if enabled)
- [ ] Accept button saves preferences
- [ ] Settings modal opens and functions
- [ ] Preferences are saved and remembered
- [ ] Google Consent Mode updates correctly
- [ ] No console errors
- [ ] Mobile responsiveness works
- [ ] Accessibility (keyboard navigation, screen readers)

### Performance Optimization

1. **Preload CSS**: Use `rel="preload"` for faster loading
2. **Defer JavaScript**: Cookie consent doesn't need to block page rendering
3. **Minimize DOM manipulation**: The library is optimized for performance
4. **CDN Usage**: Use a reliable CDN for faster delivery

### GDPR Compliance Checklist

- [ ] Clear, plain language in cookie notice
- [ ] Granular consent options (per category)
- [ ] Easy withdrawal of consent
- [ ] No pre-checked boxes for non-essential cookies
- [ ] Option to continue without accepting cookies
- [ ] Links to privacy and cookie policies
- [ ] Consent records stored securely
- [ ] User can access and modify preferences

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- IE 11 (with polyfills)

For IE 11 support, add polyfills in your head section:

```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6,Array.prototype.includes,Object.assign"></script>
```

## Support

If you need help with implementation:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the [examples directory](../examples/)
3. Open an issue on GitHub
4. Contact support at support@example.com

## Legal Disclaimer

This tool helps implement technical cookie consent, but you're responsible for:
- Legal compliance in your jurisdiction
- Privacy policy accuracy
- Cookie audit and categorization
- Data processing legality

Always consult with legal experts for GDPR compliance. 