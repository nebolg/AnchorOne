# AnchorOne GitHub Pages Deployment Guide

This guide explains how to deploy the AnchorOne web version to GitHub Pages.

## Prerequisites

- Node.js 18+ installed
- Git installed
- A GitHub account

## Quick Deploy

### Option 1: Automatic (via GitHub Actions)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Add web version for GitHub Pages"
   git push origin main
   ```

2. Enable GitHub Pages:
   - Go to your repo → Settings → Pages
   - Under "Build and deployment", select "GitHub Actions"
   - Wait for the workflow to complete

3. Access your app at: `https://nebolg.github.io/AnchorOne`

### Option 2: Manual Deploy

1. Build the web version:
   ```bash
   npm run build:web
   ```

2. Copy PWA files to dist:
   ```bash
   cp web/manifest.json dist/
   cp web/service-worker.js dist/
   cp web/index.html dist/
   ```

3. Deploy using gh-pages:
   ```bash
   npm install -D gh-pages
   npx gh-pages -d dist
   ```

## Configuration

### Custom Domain

1. Create a `CNAME` file in the `web/` folder with your domain
2. Update the GitHub Actions workflow to copy it:
   ```yaml
   - name: Copy PWA files
     run: |
       cp web/CNAME dist/ || true
   ```
3. Configure your DNS to point to GitHub Pages

### Update Donation Links

Edit the URLs in `src/screens/web/DonateScreen.js`:
```javascript
const DONATION_OPTIONS = [
    {
        name: 'Ko-fi',
        url: 'https://ko-fi.com/YOUR_USERNAME',
    },
    // ...
];
```

### Enable AdSense (When Ready)

1. Get your AdSense client ID (ca-pub-XXXX)
2. Update `src/components/web/AdPlaceholder.js`:
   ```javascript
   const AD_CONFIG = {
       enabled: true,
       adClient: 'ca-pub-XXXX',
       adSlot: 'YOUR_SLOT_ID',
   };
   ```
3. Uncomment the AdSense script in `web/index.html`

## Files Overview

| File | Purpose |
|------|---------|
| `web/index.html` | HTML template with PWA meta tags |
| `web/manifest.json` | PWA manifest for installability |
| `web/service-worker.js` | Offline caching support |
| `.github/workflows/deploy.yml` | Auto-deploy on push |
| `src/screens/web/` | Web-specific screens |
| `src/components/web/` | Web-specific components |

## Troubleshooting

### Build Fails?
- Run `npm install` first
- Check Node.js version (18+ required)
- Delete `node_modules` and reinstall

### PWA Not Working?
- Serve from HTTPS (GitHub Pages does this automatically)
- Check browser DevTools → Application → Service Workers

### Blank Page?
- Check browser console for errors
- Ensure all assets are in the `dist` folder
- Verify GitHub Pages is enabled

## Future Migration

### To Netlify
1. Connect your GitHub repo to Netlify
2. Set build command: `npm run build:web`
3. Set publish directory: `dist`

### To App Stores
1. Install EAS CLI: `npm install -g eas-cli`
2. Build for stores: `eas build --platform all`
3. The web version can remain as a landing page

---

Built with ❤️ by the AnchorOne team
