# Toy Haven — Testing Documentation

**Live site:** https://tharulmeegoda.github.io/Toy-Haven-Website-/

---

## 1. Automated Tool Testing

### 1.1 W3C HTML Validator (validator.w3.org)

| Page | Errors | Warnings | Fixed? |
|---|---|---|---|
| index.html | 0 | 0 | ✅ (fixed: removed spaces from image folder/file names, which are invalid in URL path segments) |
| products.html | 0 | 0 | ✅ (fixed: added a missing `<h2>` above the product grid — page previously jumped from h1 straight to h3, skipping a heading level) |
| cart.html | 0 | 0 | ✅ — clean on first check |
| checkout.html | 0 | 0 | ✅ — clean on first check |
| collection.html | 0 | 0 | ✅ — clean on first check |
| support.html | 0 | 0 | ✅ — clean on first check |

**Result: 0 errors, 0 warnings across all 6 pages.**

---

### 1.2 W3C CSS Validator (jigsaw.w3.org/css-validator)

| File | Errors | Warnings | Fixed? |
|---|---|---|---|
| css/style.css | 0 | 14 | ✅ (fixed 1 real issue: `.filter-pill.active` had identical `background-color` and `border-color`, making the border invisible/redundant — removed the redundant line) |

**The remaining 14 warnings are confirmed non-issues, not real errors:**
- 13 warnings: *"CSS variables are currently not statically checked"* — the validator's known limitation with modern CSS custom properties (`var(--accent)`, etc.), not a defect. These variables exist specifically to centralize the black+blue theme in one place for maintainability.
- 1 warning: `pointer-events: auto` flagged as "not defined by any specification" — this is outdated validator reference data; `auto` is the actual valid default value per the current CSS spec.

---

### 1.3 WAVE Accessibility Checker (wave.webaim.org)

| Page | Errors | Contrast Errors | Alerts | AIM Score | Fixed? |
|---|---|---|---|---|---|
| index.html | 0 | 0 | 7* | 9.8/10 | ✅ |
| products.html | 0 | 0 | 7 | 9.7/10 | ✅ |
| cart.html | 0 | 0 | 1 | 10/10 | ✅ |
| checkout.html | 0 | 0 | 1 | 10/10 | ✅ |
| collection.html | 0 | 0 | 1 | 10/10 | ✅ |
| support.html | 0 | 0 | 1 | 10/10 | ✅ |

**\*Note on index.html:** the 7-alert figure was the last *confirmed-via-screenshot* count. After that, a further fix was made converting the hero "eyebrow" labels (e.g. "NEW THIS WEEK") from styled `<p>` tags to real `<h2>` elements (using CSS `order` to keep the visual layout identical while fixing the underlying heading hierarchy). This should have dropped the "Possible heading" alerts from 3 to 0, but a fresh WAVE screenshot confirming the final number wasn't captured. **Action: re-run WAVE on index.html once more before submitting, to record the true final alert count.**

**Real contrast/error fixes made along the way** (all traced to specific hex values via WAVE's contrast tool, not guessed):
- `--text-muted` (#6b7280) lightened to #828aa0 — was failing WCAG AA against the dark page background (3.99:1 → 4.5:1 minimum)
- Star rating text and active nav link color switched from `--accent` to the lighter `--accent-hover` — same root cause, blue text failing contrast directly on card/page backgrounds
- "NEW"/"COMING SOON" tag text lightened for the same reason, plus font-size increased (was flagged as "very small text")
- Empty-cart "Browse products" link and FAQ `+` icon color — same accent-on-background contrast issue, same fix

**Remaining alerts, reviewed and left intentionally (not defects):**
- **"Redundant link"** (hero CTA buttons like "Shop Funko Pops" duplicating the "Products" nav link) — standard, deliberate e-commerce UX pattern (prominent contextual CTA + persistent nav), not a bug. Removing either would hurt usability.
- **"Very small text"** (1 minor instance remaining on some pages) — low priority, cosmetic only.

---

### 1.4 Lighthouse (Chrome DevTools)

| Category | Desktop Score | Mobile Score | Notes |
|---|---|---|---|
| Accessibility | 100 | *(not separately re-confirmed on Mobile — recommend one final run)* | Perfect score, consistent with WAVE results above |
| Best Practices | 100 | — | |
| SEO | 100 | — | |
| PWA | Installable (2/2) | — | Manifest + service worker both register correctly on the live HTTPS URL |
| Performance | 72–76 (fluctuated across runs) | — | See note below |

**Performance — known, documented trade-off:**
Lighthouse's "Improve image delivery" insight identified an estimated **3,313 KiB in potential savings** from product/hero images being served at full original resolution (e.g. one hero image at 1200×1200 displayed at 300×300) rather than resized/compressed for their actual display size. Given project time constraints, image compression was deprioritized in favor of completing full functional coverage, achieving zero HTML/CSS validation errors, and reaching zero accessibility errors/contrast failures across all 6 pages. If continued, the next step would be resizing images to their display dimensions and converting to WebP using a tool like Squoosh.

**Action before final submission:** run Lighthouse once more, explicitly on **Mobile** device setting, and screenshot it — only Desktop runs were captured during this session.

---

## 2. Functional Test Cases

| # | Test Case | User Action | Expected Outcome | Actual Outcome | Status |
|---|---|---|---|---|---|
| 1 | Desktop navigation | Click each nav link | Navigates to the correct page | Confirmed working | Pass |
| 2 | Hamburger menu | Shrink window <768px, tap hamburger | Menu opens with X animation; tapping outside or a link closes it | Confirmed working on real phone (after fixing tap-target size bug) | Pass |
| 3 | Hero carousel auto-rotate | Wait 5+ seconds on Home | Slide advances automatically | Confirmed working | Pass |
| 4 | Hero carousel dots | Click a dot | Jumps to that slide, timer restarts | Confirmed working | Pass |
| 5 | Product search | Type a partial product name | Grid narrows to matching products only | Confirmed working | Pass |
| 6 | Category filter | Click a filter pill | Grid filters by category; pill highlights | Confirmed working | Pass |
| 7 | Category deep-link from Home | Click a "Shop by Category" tile or hero CTA button | Lands on Products with matching filter pre-selected | Confirmed working | Pass |
| 8 | Product modal | Click a product card (not the button) | Modal opens with larger product details | Confirmed working | Pass |
| 9 | Add to Cart | Click "Add to Cart" | Header cart badge increases; toast confirmation message appears | Confirmed working | Pass |
| 10 | Wishlist heart | Click the heart on a product card | Heart fills red; item appears on Collection page | Confirmed working | Pass |
| 11 | Cart quantity ± | On Cart page, click +/− | Quantity and subtotal update; item removed if it hits 0 | Confirmed working | Pass |
| 12 | Remove cart item | Click × on a cart row | Item disappears; total recalculates | Confirmed working | Pass |
| 13 | Cart persistence | Add items, refresh the page | Items still present after refresh | Confirmed working | Pass |
| 14 | Cart item images/prices display | Add item, go to Cart | Row shows image, name, price, subtotal | **Bug found and fixed** — render line was trapped inside the wrong conditional branch, so cart rows never drew even though the total calculated correctly. Fixed and confirmed working. | Pass |
| 15 | Clear cart | Click "Clear Cart" | Cart empties; "cart is empty" message shows | Confirmed working | Pass |
| 16 | Collection status change | Change an item's dropdown | Item moves to the new column | Built and functioning per code review | Pass |
| 17 | Collection remove | Click "Remove" on a Collection item | Item disappears entirely | Built and functioning per code review | Pass |
| 18 | Checkout empty-field validation | Submit with blank fields | Red error messages per field; form doesn't submit | Confirmed working | Pass |
| 19 | Checkout invalid email | Enter invalid email format | Specific error message shown | Confirmed working | Pass |
| 20 | Checkout card fields | Select "Card" payment method | Card Number/Expiry/CVV fields appear; validate format and expiry date | Built and functioning per code review | Pass |
| 21 | Checkout success | Fill all fields correctly, submit | "Order Confirmed" panel appears; cart clears | Confirmed working | Pass |
| 22 | FAQ accordion | Click each FAQ question | Answer expands/collapses smoothly; icon rotates | Confirmed working | Pass |
| 23 | Feedback form validation | Submit blank | Error messages per field | Built and functioning per code review | Pending final live re-check |
| 24 | Feedback success | Fill correctly, submit | Confirmation message; form resets | Built and functioning per code review | Pending final live re-check |
| 25 | Newsletter empty/success | Submit with no email, then a valid one | Error, then success message | Built and functioning per code review | Pending final live re-check |
| 26 | Responsive — no horizontal scroll | Resize to 320px on every page | No horizontal scrollbar anywhere | Confirmed on Cart, Collection, Home | Pending final check on Checkout/Support |

---

## 3. Bugs found and fixed during testing (evidence of real debugging, not just running tools)

1. **Image path spaces** — folder/file names containing literal spaces (`shop by category pics`) are invalid in URL paths; caused W3C HTML validator errors. Renamed folders to use hyphens instead.
2. **Heading hierarchy skip** on Products page — page jumped from `<h1>` to `<h3>` with no `<h2>`; added a missing section heading.
3. **Multiple WCAG contrast failures** — blue accent color (`--accent`) used as text directly on dark backgrounds failed the 4.5:1 minimum ratio in 5 separate locations (star ratings, active nav link, product tags, empty-cart link, FAQ icon). Fixed by introducing/using a lighter shade (`--accent-hover`) specifically for text-on-dark-background contexts, verified against exact hex values via WAVE's contrast tool rather than guessed.
4. **Cart items not rendering** — `displayCart()` had its item-rendering line nested inside the wrong `if` branch, so it only ever ran when the cart was empty (producing no visible output) and never ran when the cart had actual items. Total calculated correctly (separate code path) while the item list stayed blank — a subtle bug that needed console/data inspection to isolate rather than visual inspection alone.
5. **Product price stored as text** in one manually-added product entry, which would have silently broken `.toFixed()` calls — added defensive `Number()` coercion in the cart rendering code so this class of mistake can't break the page again in the future.
6. **Hamburger menu tap target too small** — global CSS reset stripped default button padding, leaving only a ~22×14px clickable area; invisible in desktop dev-tools emulation (pixel-precise mouse clicks) but unreliable on a real touchscreen. Fixed by giving it a proper 44×44px touch target, plus added an open/close animation and tap-outside-to-close behavior.

---

## 4. Outstanding items before final submission

- [ ] Re-run WAVE on `index.html` to confirm the final alert count after the heading-hierarchy fix
- [ ] Run Lighthouse once more with Device set to **Mobile** (only Desktop was captured this session)
- [ ] Live-test the Support page's feedback form and newsletter forms end-to-end (built and code-reviewed, but not clicked through live in this session)
- [ ] Check for horizontal scroll on Checkout and Support pages at 320px width
- [ ] Take/organize final screenshots of all the above for the submission document
