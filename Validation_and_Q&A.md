Validation
- W3C HTML (Nu) — Pages pass without blocking errors; lightbox image uses a data‑URI placeholder `src` to satisfy the `img` `src` requirement.  
- W3C CSS — No critical errors; utility overrides scoped to avoid specificity conflicts.

Accessibility
- Semantic landmarks (header, nav, main), skip link, visible `:focus-visible`, meaningful alt text.  
- Color contrast targeted at WCAG AA on text/background combinations.  
- Lightbox dismissible via ESC and click‑away; no focus traps discovered in manual testing.

Performance
- Lazy images with explicit dimensions reduce CLS.  
- Single deferred JS; animation capped and paused when the tab is hidden.  
- No blocking third‑party scripts.  
- Lighthouse target: Perf >90, A11y >95, Best Practices >95, SEO >90 (record scores here after running).

Cross‑browser
- Tested on Chrome, Firefox, Safari (iOS). No layout regressions observed in grid/typography.

Deployment
- GitHub Pages with `.nojekyll`; cache busting via `style.css?v=…`.  
- Lowercase filenames and consistent relative paths prevent case‑sensitive 404s.

Notes
- Included screenshots/snippets of validator.
