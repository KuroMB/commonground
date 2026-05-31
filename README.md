# Common Ground Advisory

Website for Common Ground Advisory, a St. Louis-based placemaking consultancy. Static HTML/CSS/JS with a single Vercel edge function for the AI chat tool.

**Live site:** https://commonground-mu.vercel.app

---

## Project Structure

```
├── index.html          Main marketing site
├── chat.html           AI-powered project brief generator
├── grants.html         Community grants resource guide (St. Louis)
├── styles.css          Shared styles (reset, color variables, nav, body)
├── api/
│   └── chat.js         Vercel edge function — proxies Groq API for chat
├── scripts/
│   └── test-chat.mjs   Smoke test script for the chat API
├── .github/
│   └── workflows/
│       └── chat-smoke-test.yml   Hourly smoke test (auto-disables after 8 runs)
├── og-image.png        Open Graph preview image (1200×630)
├── favicon.svg         SVG favicon (CG lettermark, rust on cream)
├── sitemap.xml
└── robots.txt
```

---

## Running Locally

No build step required. Open any `.html` file directly in a browser, or use a local server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

The chat tool requires the Vercel edge function. To test it locally, use the [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm i -g vercel
vercel dev
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | API key from [console.groq.com](https://console.groq.com) |

Set in Vercel project settings under **Settings → Environment Variables**.

The contact/lead capture forms use [Formspree](https://formspree.io) (form ID: `xykvaogr`). No environment variable needed — the ID is embedded in the HTML.

---

## Deployment

Pushes to `main` deploy automatically via Vercel. Every other branch gets a **preview URL** automatically — use this to review changes before merging.

### Staging Workflow

1. Create a branch: `git checkout -b your-feature`
2. Make changes, push: `git push -u origin your-feature`
3. Vercel posts a preview URL in the GitHub PR (or find it at vercel.com/dashboard)
4. Review on the preview URL — test on mobile, check the chat tool end-to-end
5. Merge to `main` → auto-deploys to production

**Never push directly to `main` for anything beyond copy fixes.**

---

## Updating the Grants Page

The grants page (`grants.html`) contains hardcoded program data that needs quarterly review. When programs open, close, or change amounts:

1. Find the grant card in `grants.html` (search for the program name)
2. Update the `<div class="grant-name">`, amounts, description, and status badge
3. Update the section's `data-verified` attribute to the current month: `data-verified="YYYY-MM"`
   - This automatically updates the "Verified Month Year" label visible on the page
4. Commit with a message like `update grants: [program name] status changed to closed`

**Quarterly review checklist** (suggested: January, April, July, October):
- [ ] Verify all external grant links still resolve
- [ ] Check open/rolling status badges against program websites
- [ ] Update `data-verified` on any sections that were reviewed
- [ ] Check the disclaimer date at the top of the page updates correctly

---

## Chat Tool

The chat tool (`chat.html`) uses a Vercel edge function (`api/chat.js`) that proxies requests to the [Groq API](https://groq.com) using the `llama-3.3-70b-versatile` model.

**Four conversation modes:** Space Owner · Capital to Deploy · Idea · Community Need

Each mode has a tailored system prompt in `api/chat.js` under `SYSTEM_PROMPTS`. To update tone, add grant references, or change the brief format, edit the relevant prompt there.

**Rate limiting:** 20 requests per IP per 10-minute window (in-memory, per edge node).

### Running Smoke Tests Manually

```bash
node scripts/test-chat.mjs space
node scripts/test-chat.mjs money
node scripts/test-chat.mjs idea
node scripts/test-chat.mjs need

# Against a specific URL (e.g. preview deployment):
node scripts/test-chat.mjs space https://commonground-git-your-branch.vercel.app
```

---

## Shared Styles

`styles.css` contains rules shared across all three pages: CSS reset, color variables (warm palette), base body styles, nav structure, and the `.hp` honeypot class.

Page-specific styles remain inline in each HTML file. `grants.html` overrides the color variables with a green palette in its own `<style>` block.

To change a brand color globally, edit the `:root` block in `styles.css`.
