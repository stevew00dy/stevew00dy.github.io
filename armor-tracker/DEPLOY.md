# Deploy to GitHub Pages

**Deploy:** From project root run `.\deploy.ps1` (optionally pass a commit message). Builds, syncs dist to root, commits, pushes.

---

## Initial setup (one-time)

1. **Create the repo on GitHub**
   - Go to [github.com/new](https://github.com/new)
   - Repository name: **`star-citizen-rare-armor`** (must match for the URL to work)
   - Public, no README/license (this folder already has them)
   - Create repository

2. **Push this folder**
   ```powershell
   cd "d:\Cursor\Star Citizen\02-research\rare-armor-guide"
   git remote add origin https://github.com/YOUR_USERNAME/star-citizen-rare-armor.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

3. **Turn on Pages**
   - On the repo page: **Settings** → **Pages** (left sidebar)
   - **Build and deployment** → Source: **Deploy from a branch**
   - Branch: **main** → Folder: **/ (root)** → **Save**

4. **Wait 1–2 minutes**, then open:
   **https://YOUR_USERNAME.github.io/star-citizen-rare-armor/**
