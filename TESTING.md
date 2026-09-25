# Toy Haven — Testing Documentation

This document covers Phase 15: running the required validation/accessibility/performance
tools, and functional testing of every interactive feature. Fill in the blank columns
yourself after actually running each test — don't guess at outcomes.

---

## 1. Automated Tool Testing

### 1.1 W3C HTML Validator
**Tool:** https://validator.w3.org/

**How to run it:** Choose "Validate by File Upload" for each of your 6 HTML files individually
(uploading isn't required if your site is live — you can instead choose "Validate by URI" and
paste your GitHub Pages URL for each page, e.g. `https://yourusername.github.io/toy-haven/products.html`).

Run this **once per page** (6 times total). Record the number of errors/warnings for each.

| Page | Errors | Warnings | Fixed? |
|---|---|---|---|
| index.html | | | |
| products.html | | | |
| cart.html | | | |
| checkout.html | | | |
| collection.html | | | |
| support.html | | | |

**Common issues you might see and how to fix them:**
- *"Element `img` is missing required attribute `src`"* — shouldn't happen here since we used placeholder `<div>` boxes, not `<img>` tags, until real images are added.
- *"Duplicate id"* — check you haven't copy-pasted an element with an `id` onto the same page twice.
- *"The `type` attribute is unnecessary for JavaScript resources"* — safe to ignore if it appears; not an error, just a note.

---

### 1.2 W3C CSS Validator
**Tool:** https://jigsaw.w3.org/css-validator/

**How to run it:** Choose "By URI" and enter your live site's stylesheet URL directly,
e.g. `https://yourusername.github.io/toy-haven/css/style.css`.

| Result | Errors | Warnings | Fixed? |
|---|---|---|---|
| css/style.css | | | |

**Known non-issue:** CSS custom properties (`var(--accent)`) are sometimes flagged as
warnings by older validator profiles — this is a validator limitation, not a real error,
as long as the "Warnings" are about vendor extensions and not actual syntax errors.

---

### 1.3 WAVE Accessibility Checker
**Tool:** https://wave.webaim.org/

**How to run it:** Paste your live URL into the box. Run this **once per page** (6 times).

| Page | Errors | Contrast Errors | Alerts | Fixed? |
|---|---|---|---|---|
| index.html | | | | |
| products.html | | | | |
| cart.html | | | | |
| checkout.html | | | | |
| collection.html | | | | |
| support.html | | | | |

**Things to specifically check if WAVE flags them:**
- Every form input has a `<label>` — Checkout and Support forms should already have these; verify.
- Icon-only buttons (wishlist heart, cart icon, hamburger, modal close) have `aria-label` attributes — already added, but worth confirming WAVE doesn't flag them anyway.
- Heading hierarchy: each page should go `<h1>` (page title) → `<h2>` (section titles) without skipping a level.

---

### 1.4 Lighthouse (Desktop + Mobile)
**Tool:** Built into Chrome DevTools — open your live site, press F12, click the "Lighthouse" tab,
tick all 4 categories (Performance, Accessibility, Best Practices, SEO, PWA), and run once with
Device set to "Desktop" and once set to "Mobile".

| Category | Desktop Score | Mobile Score | Fixed? |
|---|---|---|---|
| Performance | | | |
| Accessibility | | | |
| Best Practices | | | |
| SEO | | | |
| PWA (installable?) | | | |

**If PWA doesn't show as installable:** double-check you're testing the **live GitHub Pages URL**,
not a local file — service workers don't run on `file://`, only `https://` or `localhost`.

---

## 2. Functional Test Cases

Test each row yourself on the live site and record what actually happened — leave nothing
guessed. "Status" is Pass/Fail based on whether Actual matched Expected.

| # | Test Case | User Action | Expected Outcome | Actual Outcome | Status |
|---|---|---|---|---|---|
| 1 | Desktop navigation | Click each nav link (Home/Products/Collection/Support) | Navigates to the correct page | | |
| 2 | Hamburger menu | Shrink window <768px, click hamburger | Menu opens; clicking a link closes it | | |
| 3 | Hero carousel auto-rotate | Wait 5+ seconds on Home | Slide advances automatically | | |
| 4 | Hero carousel dots | Click a dot | Jumps to that slide, timer restarts | | |
| 5 | Product search | Type a partial product name on Products page | Grid narrows to matching products only | | |
| 6 | Category filter | Click a filter pill | Grid shows only that category; pill highlights | | |
| 7 | Product modal | Click a product card (not the button) | Modal opens with larger product details | | |
| 8 | Add to Cart | Click "Add to Cart" on any card | Header cart badge count increases by 1 | | |
| 9 | Wishlist heart | Click the heart on a product card | Heart fills red; item appears on Collection page | | |
| 10 | Cart quantity increase | On Cart page, click + | Quantity and subtotal increase; total updates | | |
| 11 | Cart quantity decrease to 0 | Click − until quantity is 0 | Item is removed from the cart entirely | | |
| 12 | Remove cart item | Click × on a cart row | Item disappears; total recalculates | | |
| 13 | Cart persistence | Add items, refresh the page | Items are still there after refresh | | |
| 14 | Clear cart | Click "Clear Cart" | Cart empties; "cart is empty" message shows | | |
| 15 | Collection status change | On Collection page, change an item's dropdown | Item moves to the new column | | |
| 16 | Collection remove | Click "Remove" on a Collection item | Item disappears from Collection entirely | | |
| 17 | Checkout empty-field validation | Submit Checkout form with blank fields | Red error messages appear per field; form doesn't submit | | |
| 18 | Checkout invalid email | Enter "notanemail" in the email field, submit | Error message specific to invalid email format | | |
| 19 | Checkout success | Fill all fields correctly, submit | "Order Confirmed" panel appears; cart clears | | |
| 20 | FAQ accordion | Click each FAQ question | Answer expands/collapses smoothly; icon rotates | | |
| 21 | Feedback form validation | Submit Support form with blank fields | Error messages appear per field | | |
| 22 | Feedback success | Fill form correctly, submit | Confirmation message appears; form resets | | |
| 23 | Newsletter empty | Submit newsletter form with no email | Error message shown | | |
| 24 | Newsletter success | Submit newsletter form with a valid email | Success message shown | | |
| 25 | Responsive — no horizontal scroll | Resize window from desktop to 320px wide on every page | No horizontal scrollbar appears anywhere | | |
| 26 | Cross-page consistency | Add an item to cart on Products, check header badge on every other page | Badge count is consistent across all pages | | |

---

## 3. Notes for your submission document

- Take a screenshot of each tool's results page (with URL/date visible if possible) to accompany this table.
- If a tool flags an error, fix it, then **re-run that specific test** and note "Fixed" in the table — a before/after pair is worth more marks than a clean-looking first run you can't prove was retested.
- Send me any actual errors/failures you find — I'll help fix the specific file rather than rewriting anything wholesale.
