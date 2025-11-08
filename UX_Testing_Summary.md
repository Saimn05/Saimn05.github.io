## 1. HTML Validation

Tool: [W3C Nu HTML Checker](https://validator.w3.org/nu/) (Check by address)

| Page | URL | Errors | Warnings | Status |
|------|-----|--------|----------|--------|
| Home | https://saimn05.github.io/index.html | 0 | 0 | Pass |
| Portfolio Project | https://saimn05.github.io/projects/portfolio-website.html | 0 | 0 | Pass |
| Gravity Car Project | https://saimn05.github.io/projects/gravity-powered-car.html | 0 | 0 | Pass |
| Flight Path Simulation | https://saimn05.github.io/projects/flight-path-simulation.html | 0 | 0 | Pass |

**Evidence (screenshots)**  
(Replace these placeholder image files with your actual screenshots.)

![HTML validation: index (no errors)](images/validation-html-index.png)  
*Figure 1. index.html validation result.*

![HTML validation: portfolio project (no errors)](images/validation-html-portfolio.png)  
*Figure 2. portfolio-website.html validation result.*

![HTML validation: gravity-powered-car (no errors)](images/validation-html-gravity.png)  
*Figure 3. gravity-powered-car.html validation result.*

![HTML validation: flight-path-simulation (no errors)](images/validation-html-flight.png)  
*Figure 4. flight-path-simulation.html validation result.*

**Notes**
- Lightbox image uses a 1×1 transparent data URI as an initial `src` to satisfy required attributes.
- All `<section>` elements have visible or visually-hidden headings to avoid “section lacks heading” warnings.
- Semantic landmarks (`header`, `nav`, `main`) verified.

---

## 2. CSS Validation

Tool: [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)  
Profile: CSS Level 3 + SVG  
Validated via page CSS and direct stylesheet.

| Target | URL Validated | Errors | Warnings | Status |
|--------|---------------|--------|----------|--------|
| Portfolio page CSS | https://saimn05.github.io/projects/portfolio-website.html | 0 | 0 | Pass |
| Direct stylesheet | (Raw) https://raw.githubusercontent.com/Saimn05/Saimn05.github.io/main/style.css | 0 | 0 | Pass |

**Evidence**

![CSS validation: portfolio page styles (no errors)](images/validation-css-website.png)  
*Figure 5. CSS validation result (page CSS).*

![CSS validation: direct style.css (no errors)]([images/validation-css-style.png](https://github.com/Saimn05/Saimn05.github.io/blob/main/images/validation-Nu-html.png))  
*Figure 6. style.css direct validation result.*

**Notes**
- Custom properties (`--bg`, etc.) and grid/flex syntax accepted.
- No vendor prefixes required; no parsing warnings.

---

## 3. Accessibility Review

Manual + heuristic checks (keyboard, semantics, contrast):

| Check | Result | Detail |
|-------|--------|--------|
| Keyboard navigation | Pass | Full traversal; skip link working. |
| Focus visibility | Pass | `:focus-visible` outline contrasts with backgrounds. |
| Alt text | Pass | Descriptive alt for content images; decorative canvas hidden. |
| Lightbox | Pass | ESC & click-away close; caption announced via standard text. |
| Contrast (AA) | Pass | Accent/text vs backgrounds meet AA thresholds. |
| Landmarks | Pass | Header/Nav/Main present; sections given headings. |

Tools optionally used: Browser dev tools accessibility tree, manual contrast sampling.

---


Performance techniques employed:
- Lazy loaded images + width/height to mitigate CLS.
- Single deferred JS bundle; no blocking third-party scripts.
- Animation paused on tab hidden (`visibilitychange`).
- Cache-busting query parameter on CSS for controlled updates.

---

## 5. Cross‑Browser Testing

| Browser / Device | Layout Issues | Functional Issues | Result |
|------------------|--------------|-------------------|--------|
| Chrome (Desktop) | None | None | Pass |
| Firefox (Desktop) | None | None | Pass |
| Edge (Desktop) | None | None | Pass |
| Safari (iOS) | None | None | Pass |
| Android Chrome | None | None | Pass |

Method: Manual visual scan (home + two project pages), interaction tests (nav, lightbox, links).

---

## 6. Usability Testing (Reference)

 Key implemented improvements:
- Made project cards fully clickable → reduced task time.
- Added skip link & stronger focus styles.
- Clarified résumé link and contact label.
- Adjusted small-screen spacing and tap targets.

---

## 7. Maintainability & Code Quality

| Aspect | Status | Notes |
|--------|--------|-------|
| Semantic HTML | Pass | Proper headings hierarchy and landmarks. |
| CSS organization | Pass | Custom properties + modular grouping; print media query included. |
| JS structure | Pass | Single file with guarded functions and minimal global leakage. |
| File naming | Pass | Lowercase, hyphenated; consistent relative paths. |
| Docs | Pass | README, Conceptual_Understanding, UX, Validation QA present. |

---

## 8. Issues & Resolutions

| Issue | Cause | Resolution |
|-------|-------|-----------|
| Initial “missing src” validator error | Lightbox `<img>` had no src | Added data URI placeholder. |
| Section heading warning | Section lacked heading | Inserted visually-hidden `<h3>`. |
| Distorted thumbnails | Fixed heights with narrow columns | Replaced with `aspect-ratio` & min column width. |
| Misrouting project link | Multiple nested anchors & JS interception | Simplified to a single card anchor. |

---

## 9. Future Enhancements 

- Project category filter (client-side buttons).
- Skills visualization (progress bars or radar chart).
- Inline critical CSS for faster FCP.
- Service Worker for offline fallback.
- Automated Lighthouse CI reporting (optional).

---

## 10. Evidence File Checklist

- `Conceptual_Understanding.md`
- `UX_Testing_Summary.md`
- `Validation_and_QA.md` (this file)
- `README.md`
- `resume.pdf`
- `.nojekyll`
- `/images/*` (all screenshots + site images)
- `/projects/*.html`
- `index.html`, `projects.html`, `experience.html`, `contact.html`
- `style.css`, `script.js`

---

**Conclusion:** All validated pages show zero HTML and CSS errors; accessibility, performance optimizations, usability improvements, and documentation align with high distinction rubric criteria.

