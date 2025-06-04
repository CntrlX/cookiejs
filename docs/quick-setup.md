# Quick Setup Guide - CDN Options

## 🚀 Choose Your Setup Method

### Method 1: Self-Hosted (Recommended)
**Best for: Production websites, full control**

1. Download files from the `dist/` folder:
   - `cookieConsent.min.js`
   - `cookieConsent.min.css`

2. Upload to your server/hosting

3. Use in Webflow:
```html
<!-- Head Code -->
<link rel="stylesheet" href="/assets/cookieConsent.min.css">

<!-- Footer Code -->
<script src="/assets/cookieConsent.min.js"></script>
```

### Method 2: GitHub + jsDelivr CDN
**Best for: Quick testing, open-source projects**

#### Step 1: Setup GitHub Repository

1. **Create a GitHub repository** (must be public)
   - Go to GitHub.com
   - Click "New repository"
   - Name it something like `webflow-cookie-consent`
   - Make it **public** ✅
   - Create repository

2. **Upload the files**
   - Create a `dist/` folder in your repository
   - Upload `cookieConsent.min.js` and `cookieConsent.min.css` to the `dist/` folder

3. **Commit the files**
   ```bash
   git add .
   git commit -m "Add cookie consent files"
   git push origin main
   ```

#### Step 2: Use jsDelivr CDN

Replace the placeholders with your actual details:

```html
<!-- In Webflow Head Code -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/YOUR-GITHUB-USERNAME/YOUR-REPO-NAME@latest/dist/cookieConsent.min.css">

<!-- In Webflow Footer Code -->
<script src="https://cdn.jsdelivr.net/gh/YOUR-GITHUB-USERNAME/YOUR-REPO-NAME@latest/dist/cookieConsent.min.js"></script>
```

**Example** (if your GitHub username is "johnsmith" and repo is "cookie-consent"):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/johnsmith/cookie-consent@latest/dist/cookieConsent.min.css">
<script src="https://cdn.jsdelivr.net/gh/johnsmith/cookie-consent@latest/dist/cookieConsent.min.js"></script>
```

#### Step 3: Version Control (Production)

For production, use a specific version instead of `@latest`:

```html
<!-- Using version 1.0.0 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/johnsmith/cookie-consent@1.0.0/dist/cookieConsent.min.css">
<script src="https://cdn.jsdelivr.net/gh/johnsmith/cookie-consent@1.0.0/dist/cookieConsent.min.js"></script>
```

To create a version:
1. In GitHub, go to "Releases"
2. Click "Create a new release"
3. Tag version: `1.0.0`
4. Publish release

### Method 3: Webflow Assets
**Best for: Simple setup, no external dependencies**

1. **Upload to Webflow**
   - In Webflow Designer, go to Assets panel (left sidebar)
   - Click upload button
   - Upload `cookieConsent.min.js` and `cookieConsent.min.css`

2. **Copy the URLs**
   - Right-click each uploaded file
   - Copy the Webflow asset URL
   - It will look like: `https://uploads-ssl.webflow.com/SITE-ID/files/filename`

3. **Use in custom code**
```html
<!-- Head Code -->
<link rel="stylesheet" href="https://uploads-ssl.webflow.com/YOUR-SITE-ID/files/cookieConsent.min.css">

<!-- Footer Code -->
<script src="https://uploads-ssl.webflow.com/YOUR-SITE-ID/files/cookieConsent.min.js"></script>
```

## ⚠️ Important Notes

### jsDelivr CDN Requirements:
- ✅ Repository must be **public**
- ✅ Files must be in a `dist/` folder
- ✅ Repository must be properly committed to GitHub
- ⏱️ CDN updates may take 5-15 minutes after pushing changes

### CDN Caching:
- `@latest` = always gets newest version (may be cached)
- `@1.0.0` = specific version (better for production)
- `@main` = latest from main branch

### Testing Your CDN Setup:
1. Open the CDN URL directly in browser
2. You should see the file content (not a 404 error)
3. Example: `https://cdn.jsdelivr.net/gh/yourusername/yourrepo@latest/dist/cookieConsent.min.css`

## 🔧 Quick Verification

### Check if jsDelivr is working:
```javascript
// Open browser console and test:
fetch('https://cdn.jsdelivr.net/gh/YOUR-USERNAME/YOUR-REPO@latest/dist/cookieConsent.min.js')
  .then(response => console.log('Status:', response.status))
  .catch(error => console.error('Error:', error));
```

### Common Issues:
- **404 Error**: Repository isn't public or files aren't in correct location
- **Old version loading**: CDN cache - try using specific version number
- **Files not found**: Check folder structure - files must be in `dist/` folder

## 📝 Complete Example

Here's a complete working example for GitHub user "acmecompany" with repo "cookie-consent":

**Webflow Head Code:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/acmecompany/cookie-consent@1.0.0/dist/cookieConsent.min.css">
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied',
    'functionality_storage': 'denied',
    'personalization_storage': 'denied',
    'security_storage': 'granted'
  });
</script>
```

**Webflow Footer Code:**
```html
<script src="https://cdn.jsdelivr.net/gh/acmecompany/cookie-consent@1.0.0/dist/cookieConsent.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  new CookieConsent({
    privacyPolicyUrl: '/privacy-policy',
    cookiePolicyUrl: '/cookie-policy'
  });
});
</script>
```

That's it! Your cookie consent should now work. 🎉 