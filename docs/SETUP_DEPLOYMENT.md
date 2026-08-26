# Setup and Deployment Guide

This guide details how to set up the development environment, generate assets, and build and deploy the Dr. Bryan Kek personal brand website.

---

## 1. Local Environment Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher is recommended)

### Installation
Clone or navigate to the repository directory and install the necessary dependencies:
```bash
npm install
```
*Note: This will install `sharp` and `@napi-rs/canvas` which are used for programmatic asset rendering.*

### Running the Development Server
Start the local server using:
```bash
npm run dev
```
The site will be hosted locally. By default, it runs on `http://localhost:5500`.

---

## 2. Generating Programmatic Assets

There are two utility scripts included in the `scripts/` directory to generate graphics:

### Open Graph Preview Cards
To regenerate the trilingual Open Graph card image previews (used when sharing the website link on social media platforms like WhatsApp, Facebook, and X):
```bash
node scripts/generate_og.js
```
This processes the avatar image (`assets/dr_bryan_kek.jpg`) and logo to render landscape and square WebP previews into the `assets/` directory.

### Favicons and App Icons
To regenerate the favicon files in various sizes:
```bash
node scripts/generate_favicon.js
```
This processes `assets/icon.webp` and generates a set of modern PNG favicons, an apple-touch icon, and a root-level `favicon.ico`.

---

## 3. Building for Production

To compile the static pages, localize meta tags, and build the deployment bundle:
```bash
npm run build
```

This runs `build.js` which does the following:
1. Cleans the existing `dist/` directory.
2. Copies all static assets, stylesheet, CNAME, and root `favicon.ico` into the `dist/` directory.
3. Automatically translates the HTML metadata and outputs language-specific subdirectories for static path routing:
   - Malay: `dist/ms/index.html` (corresponds to `/ms/`)
   - English: `dist/en/index.html` (corresponds to `/en/`)
   - Chinese: `dist/cn/index.html` (corresponds to `/cn/`)

---

## 4. Deployment

To deploy the website to production, host the contents of the generated **`/dist`** directory on any static web host:

### GitHub Pages (Recommended)
1. Set the build destination branch to point to the `/dist` directory (or use a GitHub Action to automatically build and deploy the `dist` folder on commit).
2. The repository includes a `CNAME` file configured for `dr.bryankek.my`. Ensure your DNS registrar points the domain `dr.bryankek.my` to GitHub Pages servers.

### Netlify / Vercel / Cloudflare Pages
1. Configure the build settings in your provider dashboard:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
2. Configure your custom domain settings to point to the provider.
