# AI Trading House (frontend only)

Static HTML/CSS/JS site. No backend server package like `nexinning`.

## Why CSS/JS fails when double-clicking files

Open **`public/index.html`**, not the root `index.html` alone via broken absolute paths.

Better options:

```bash
npm install
npm run start
```

Then open `http://localhost:3000`

Or:

```bash
npm run dev
```

## MilesWeb (Node app)

Upload this folder (`aitradinghouse`) with at least:

- `package.json`
- `server.js`
- `public/` (all site files)

MilesWeb expects:

| Setting | Value |
|---------|--------|
| Start command | `npm start` |
| App root | folder with `package.json` |

`npm start` runs `node server.js` and serves `public/`.

No Prisma, no backend `server/` app, no `postinstall` for multiple packages.

Optional: if MilesWeb runs `npm install --production`, that is fine — Vite is only for local `dev`/`build`. Runtime needs **only Node**, zero production dependencies.

## Local static open

1. Open `public/index.html` in the browser, **or**
2. `npm start` and visit port 3000
