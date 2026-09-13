# portfolio

Personal portfolio site — Dracula-themed, React + Vite, served via nginx in Docker.

## Prerequisites

- Node 20+ (for local dev)
- Docker (optional, for local image testing)

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

## Deployment

Deploys are automated via GitHub Actions (`.github/workflows/release.yml`). Every push
(or merged PR) to `main` triggers a release:

1. The next patch version is computed from existing git tags
   (`vX.Y.Z` → `vX.Y.(Z+1)`, starting at `v0.0.1`) and pushed as a new tag.
2. The Docker image is built and pushed to GHCR as both:
   - `ghcr.io/noah-dimitriadis/portfolio-site:vX.Y.Z`
   - `ghcr.io/noah-dimitriadis/portfolio-site:latest`

The site runs on a k3s cluster that pulls from GHCR via an existing `imagePullSecret`.
Kubernetes doesn't auto-redeploy on a new `:latest` push, so after the workflow finishes
roll out the new image manually:

```bash
kubectl rollout restart deployment/<deployment-name>
```

Bumping minor/major versions (instead of the automatic patch bump) is done by pushing a
tag yourself before merging, e.g. `git tag v1.3.0 && git push origin v1.3.0` — the next
automatic release will then bump patch from that tag.

## Local image build (optional)

To build and run the image locally without going through CI:

```bash
docker build -t portfolio .
docker run -d --name portfolio --restart unless-stopped -p 3010:80 portfolio
# → http://localhost:3010
```

## File structure

```
portfolio/
├── .github/
│   └── workflows/
│       ├── lint.yml     ← lints/formats PRs into main
│       └── release.yml  ← auto-tags + builds/pushes image on push to main
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
