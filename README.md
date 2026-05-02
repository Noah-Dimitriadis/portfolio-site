# portfolio

Personal portfolio site — Dracula-themed, React + Vite, served via nginx in Docker.

## Prerequisites

- Node 20+ (for local dev)
- Docker (for deployment)

## Local dev

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Customize before deploying

1. **`src/App.jsx`** — fill in the `TODO` fields:
   - Project URLs and GitHub links
   - Contact links (email, GitHub, LinkedIn)
   - IBM experience bullets
   - Add/remove projects in the `PROJECTS` array

2. **`src/App.module.css`** — tweak spacing or colors here if needed

3. **`index.html`** — update `<title>` and `<meta name="description">`

4. **Photo** — drop `photo.jpg` into `public/`, then in `App.jsx` replace the
   avatar placeholder block with:
   ```jsx
   <img src="/photo.jpg" alt="Noah" />
   ```

5. **Resume** — drop `resume.pdf` into `public/`

6. **Domain** — update footer text and `index.html` meta

## Build & run with Docker

```bash
# Build the image
docker build -t portfolio .

# Run it
docker run -d \
  --name portfolio \
  --restart unless-stopped \
  -p 3010:80 \
  portfolio

# → http://localhost:3010
```

Point your reverse proxy (Caddy/nginx/Cloudflare Tunnel) at port 3010.

## Rebuild after changes

```bash
docker build -t portfolio . && \
docker stop portfolio && \
docker rm portfolio && \
docker run -d --name portfolio --restart unless-stopped -p 3010:80 portfolio
```

Or wrap in a `deploy.sh` script to do it in one command.

## File structure

```
portfolio/
├── public/
│   ├── photo.jpg       ← your photo (add this)
│   └── resume.pdf      ← your resume (add this)
├── src/
│   ├── App.jsx         ← all content lives here
│   ├── App.module.css  ← all styles
│   ├── index.css       ← global resets + Dracula vars
│   └── main.jsx        ← entry point
├── Dockerfile
├── nginx.conf
├── vite.config.js
└── package.json
```
