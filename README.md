# Bhim Majhi — Portfolio + Firebase Live Gallery (React)

Same website, now built with **React + Vite**. Design (CSS), Firebase likes, live gallery
and the admin upload page work exactly as before.

## Pages (same URLs as before)
- `/` → public portfolio (`index.html` → `src/main.jsx`)
- `/admin.html` → admin upload page (`admin.html` → `src/adminMain.jsx`)

## Run locally
```
npm install
npm run dev
```

## Build
```
npm run build      # output goes to dist/
npm run preview    # test the production build locally
```

## Deploy to GitHub Pages (once)
1. GitHub repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main`:
```
git add -A && git commit -m "react" && git push
```
`.github/workflows/deploy.yml` builds the site and publishes it automatically.

## Folder guide
```
public/        static files copied as-is (assets/, favicon, robots.txt, sitemap.xml, verification files)
src/components public site + admin components
src/hooks      usePosts (live Firestore posts), usePhotoSchema (photo SEO JSON-LD)
src/lib        firebase / auth / visitor id
src/config     firebase + cloudinary config
src/index.css + src/AdminApp.css   styles for public site and admin page (unchanged from the old site)
firebase/      Firestore + Storage rules (paste into Firebase console)
```

## Firebase setup (once)
1. Authentication → enable Email/Password, create admin user.
2. Create Firestore Database and Storage.
3. Paste `firebase/firestore.rules` and `firebase/storage.rules` into the Rules tabs and Publish.

Upload new posts from `/admin.html`; the public site updates in real time.
