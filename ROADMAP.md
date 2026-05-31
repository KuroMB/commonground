# Common Ground Advisory — Site Roadmap

Generated from full-site review. Items are organized into three phases by impact and effort. Each item is tagged by discipline: **[Tech]**, **[UX]**, or **[Business]**.

---

## Phase 1 — Fix Before It Bites You
*These have real downside risk: financial, security, or lead loss. Do these first.*

---

### 1.1 Rate Limit the Chat API **[Tech]**
**Problem:** `/api/chat` has no rate limiting. Anyone who finds the endpoint can loop requests and run up the Groq API bill significantly overnight.

**Fix:** Add IP-based rate limiting to `api/chat.js`. Vercel edge functions support `request.ip`. A simple in-memory counter per IP per minute is sufficient. Alternatively, use Upstash Redis for persistent rate limiting across edge invocations.

**Suggested limit:** 20 requests per IP per 10-minute window.

**Effort:** ~2 hours

---

### 1.2 Add Lead Capture at End of Chat Flow **[Business] [UX]**
**Problem:** Users can spend 20 minutes in the chat tool, generate a brief, download it, and leave. No record of their existence, no follow-up path.

**Fix:** After `[READY_TO_GENERATE]` fires and the brief is displayed, show an optional prompt:
> *"Want us to follow up on this brief? Leave your email and we'll reach out within 48 hours."*

Email + first name only. On submit, route to Formspree (same account, separate form ID) or a new endpoint. Pre-populate the email subject with the brief title.

**Effort:** ~3 hours (UI + Formspree form setup)

---

### 1.3 Add Analytics **[Tech] [Business]**
**Problem:** No visibility into what users do on the site. Can't measure which sections drive contact form submissions, how many people start vs. complete the chat tool, or which grants are most viewed.

**Fix:** Add [Plausible Analytics](https://plausible.io) (privacy-friendly, GDPR compliant, $9/mo) or Google Analytics 4 (free). Track custom events:
- Chat tool: mode selected, message sent, brief generated, brief downloaded
- Contact form: started, submitted, success
- Grants page: category clicks, grant link clicks

**Effort:** 2 hours (script + event instrumentation)

---

### 1.4 Handle Brief Generation Failures Gracefully **[Tech]**
**Problem:** `generateBrief()` in `chat.html` expects the LLM to return valid JSON. When it doesn't (and it occasionally won't), the brief silently fails with no user feedback.

**Fix:** Wrap the JSON parse in a try/catch in both `chat.html` and `api/chat.js`. On failure, show a user-facing message: *"We had trouble generating the brief. Try sending one more message and clicking Generate again."* Log the raw response for debugging.

**Effort:** 1 hour

---

### 1.5 Protect the Contact Form from Spam **[Tech]**
**Problem:** The Formspree form has no bot protection. No honeypot field, no CAPTCHA. High-traffic periods will produce spam submissions.

**Fix:** Add a honeypot input (hidden field; bots fill it, humans don't) and configure Formspree's built-in spam filtering. Optionally add hCaptcha (free tier available) if spam becomes a real problem.

**Effort:** 1 hour

---

## Phase 2 — Make It Work Harder
*These don't break anything today, but they're leaving real value on the table.*

---

### 2.1 Add a Case Study or Testimonial **[Business]**
**Problem:** The site has no social proof. Placemaking engagements are high-trust, high-dollar decisions. A single strong case study or two testimonials would do more conversion work than any copy change.

**What to add:** One of:
- A brief case study: project name, challenge, what Common Ground did, outcome (even qualitative)
- A testimonial from a nonprofit, property owner, or civic partner with name and title
- A "projects" section with even a few before/after or in-progress examples

**Where to add it:** Between the Services section and the Audience section on `index.html`, or as a new `work.html` page linked from the nav.

**Effort:** Content is the hard part. Once content exists, 3–4 hours of implementation.

---

### 2.2 Describe Service Deliverables Concretely **[Business] [UX]**
**Problem:** The services section lists names and prices but not what the client actually receives. "Space Audit" for $1,500 means nothing without knowing what's in the deliverable.

**Fix:** Add a one-paragraph deliverable description to each service card. Example for Space Audit:
> *"A 15-page written report covering physical condition, zoning classification, ADA gap analysis, comparable activations, and three scenario recommendations. Delivered within 3 weeks of site visit."*

**Effort:** 2 hours (content-driven; minimal dev work)

---

### 2.3 Add Filter/Search to Grants Page **[UX]**
**Problem:** 20+ grants across 5 categories with no way to filter by status or type. Users looking for "open grants for nonprofits under $50K" must read every card.

**Fix:** Add a two-axis filter UI above the grant grid:
- **Category** pills (already partially implemented as anchor nav — convert to JS filter)
- **Status** pills: Open Now / Rolling / Watch / All

Filtering should hide non-matching cards in place (no page reload). ~40 lines of vanilla JS.

**Effort:** 3 hours

---

### 2.4 Connect Grants Page to Core Business **[Business]**
**Problem:** The grants page uses a completely different color scheme (green vs. rust/cream) and has no clear path to "hire Common Ground to help me apply for these grants." Users who find it via search have no obvious next step.

**Fix:**
1. Add a persistent CTA strip near the top: *"Navigating grant applications is complex. Common Ground can help — [Book a free consultation]"* linking to the contact form
2. Align the header/nav style with the main site so it reads as the same brand
3. Add the grants page to `sitemap.xml` (verify it's included)

**Effort:** 2 hours

---

### 2.5 Fix Missing Alt Text and Basic Accessibility **[Tech] [UX]**
**Problem:** The founder photo, aerial background image, and all inspiration section images are missing meaningful `alt` attributes. This fails WCAG AA, hurts SEO, and excludes screen reader users.

**Fix:**
- `matt-black.jpeg`: `alt="Matthew Black, founder of Common Ground Advisory"`
- `stl-aerial.jpg`: `alt="Aerial view of St. Louis neighborhoods"`
- Inspiration grid images: descriptive alts for each (e.g., `alt="City Museum interior, St. Louis"`)
- Add `aria-label` to icon-only buttons (hamburger menu, close buttons)

**Effort:** 1 hour

---

### 2.6 Replace Pexels Hotlinks with Local Images **[Tech]**
**Problem:** The inspiration section's photo grid hotlinks images from Pexels CDN. If Pexels renames or removes those images, the layout breaks silently. You also can't guarantee image quality or availability.

**Fix:** Download the images, compress them to WebP at ~80% quality, add them to the repo or a Vercel-hosted `/images/` directory, and update the `src` attributes. This also removes a third-party CDN dependency from your critical rendering path.

**Effort:** 2 hours (download + compress + update references)

---

### 2.7 Add On-Ramp Copy to Chat Tool **[UX]**
**Problem:** Users landing on `chat.html` see four category cards with no explanation of what happens next, what a "brief" is, or why they'd want one.

**Fix:** Add a three-line intro above the mode cards:
> *"Answer a few questions about your project and we'll generate a customized brief you can download and share. Takes about 10 minutes."*

Also add a tooltip or subtitle under each mode card explaining what type of user it's for.

**Effort:** 30 minutes

---

### 2.8 Add Contact Form Follow-Up Framing **[UX]**
**Problem:** After form submission, the success modal appears but gives no indication of what happens next or when. Users are left uncertain.

**Fix:** Update the success message to include response time and next step:
> *"We'll be in touch within 2 business days. In the meantime, explore our [grants guide] or [start a project brief]."*

Include links to both tools.

**Effort:** 30 minutes

---

### 2.9 Add Active Nav State on Scroll **[UX]**
**Problem:** The main page has ten sections. The fixed nav has no active-state indicator as you scroll, so users lose their place.

**Fix:** Use `IntersectionObserver` (already used for animations) to watch each section and add an `active` class to the corresponding nav link as it enters the viewport.

**Effort:** 1 hour

---

## Phase 3 — Infrastructure and Scale
*These matter as traffic and complexity grow. Lower urgency, higher payoff later.*

---

### 3.1 Extract CSS to a Shared Stylesheet **[Tech]**
**Problem:** Each of the three HTML pages has 1,000+ lines of styles in inline `<style>` blocks. Navigation, footer, typography, and color variables are duplicated across files. A global change (new brand color, font swap) requires editing three files.

**Fix:** Create `styles.css` with shared components (reset, typography, color variables, nav, footer, buttons). Leave page-specific styles inline or in per-page files. This also enables browser caching of the shared stylesheet.

**Effort:** 4–6 hours (careful extraction to avoid regressions)

---

### 3.2 Add Error Monitoring **[Tech]**
**Problem:** If the chat API starts returning errors, you'll find out from a frustrated user email, not a dashboard. No errors are currently logged anywhere.

**Fix:** Add [Sentry](https://sentry.io) free tier to both `api/chat.js` (server-side) and the chat frontend (client-side). Capture: API call failures, JSON parse errors, Groq API timeouts.

**Effort:** 2 hours

---

### 3.3 Set Up a Grants Update Process **[Business] [Tech]**
**Problem:** Grant statuses and deadlines change constantly. The page is already dated "May 2026" with no update mechanism. Dead links and stale statuses will erode trust.

**Fix (minimal):** Add a visible "Last verified" date per grant card and a process reminder in a private doc to review quarterly.

**Fix (better):** Move grant data into a JSON file (`grants-data.json`) and render cards from it via a small build script or client-side JS. This makes updates a data change, not an HTML change, and makes the "last updated" field programmatic.

**Effort:** Minimal fix: 1 hour. Data-driven approach: 6–8 hours.

---

### 3.4 Replace Emoji Favicon with Proper Brand Mark **[UX] [Business]**
**Problem:** The current favicon is the 🏗️ construction emoji — visually reads as a placeholder on a professional consulting site.

**Fix:** Create a simple lettermark favicon (`CG` monogram or a small geometric mark using the rust/sage palette) as a 32×32 SVG and 180×180 PNG for Apple touch icon. Takes 30 minutes in Figma or similar.

**Effort:** 1 hour (design + implementation)

---

### 3.5 Add a Staging Environment **[Tech]**
**Problem:** All changes deploy directly to production. A CSS regression or broken API change goes live immediately.

**Fix:** Vercel automatically creates preview deployments for branches. Establish a workflow: develop on a branch → review preview URL → merge to main. This costs nothing on Vercel's free tier and already works — it just needs to be the team habit.

**Effort:** 30 minutes (documentation + workflow agreement)

---

### 3.6 Write a Real README **[Tech]**
**Problem:** The README is two lines. A new contributor (or future-you after six months) has no idea how to run the project, what environment variables are needed, or what the site does.

**Fix:** Document: project overview, file structure, how to run locally, required environment variables (`GROQ_API_KEY`, Formspree form ID), deployment process, and how to update grant data.

**Effort:** 1 hour

---

## Priority Matrix

| Item | Impact | Effort | Phase |
|---|---|---|---|
| Rate limit chat API | High | Low | 1 |
| Lead capture in chat | High | Low | 1 |
| Analytics | High | Low | 1 |
| Brief generation error handling | Medium | Low | 1 |
| Form spam protection | Medium | Low | 1 |
| Case study / testimonial | High | Medium | 2 |
| Service deliverable descriptions | High | Low | 2 |
| Grants filter/search | Medium | Medium | 2 |
| Connect grants to business | High | Low | 2 |
| Fix alt text / accessibility | Medium | Low | 2 |
| Replace Pexels hotlinks | Medium | Medium | 2 |
| Chat tool on-ramp copy | Medium | Low | 2 |
| Form follow-up framing | Low | Low | 2 |
| Active nav scroll state | Low | Low | 2 |
| Extract shared CSS | Medium | High | 3 |
| Error monitoring (Sentry) | Medium | Low | 3 |
| Grants update process | Medium | Medium | 3 |
| Proper favicon | Low | Low | 3 |
| Staging environment workflow | Medium | Low | 3 |
| README | Low | Low | 3 |

---

## Total Effort Estimate

| Phase | Items | Estimated Hours |
|---|---|---|
| Phase 1 — Fix Before It Bites You | 5 | ~9 hours |
| Phase 2 — Make It Work Harder | 9 | ~15 hours |
| Phase 3 — Infrastructure and Scale | 6 | ~12 hours |
| **Total** | **20** | **~36 hours** |

Phase 1 alone is a solid weekend sprint. Phases 2 and 3 can be worked through incrementally alongside normal business operations.
