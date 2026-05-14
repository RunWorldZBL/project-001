# Findings & Decisions

## Requirements
- Build new pages in `D:\起步\mymymy\front`, not inside `D:\起步\mymymy\双创前端代码`.
- Keep the same style conventions, header, footer, fonts, and plugin versions as the original frontend.
- Design images live in `D:\起步\mymymy\front\images\设计图`.
- Do not carry unused images or unused CSS/JS into `front`; add assets only when needed.

## Research Findings
- Original project is a static multi-page frontend, not a package-managed Vue/React project.
- Original core files are HTML pages plus `css/`, `js/`, `images/`, and `fonts/`.
- Original common stylesheet is `css/my.css`.
- Original common script is `js/my.js`.
- Original common libraries include jQuery 3.6.0, Swiper, AOS, Fancybox, fullPage, CountUp, and Waypoints, but `front` should only copy/load the subset used by current pages.
- Current `front` scaffold uses jQuery, Swiper, AOS, Fancybox, `my.js`, and `platform-pages.js`.
- Current `front` scaffold does not use fullPage, CountUp, Waypoints, or Animate.css.

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Static MPA | Matches the existing site and makes page delivery simple. |
| No build tooling | The original project uses direct static assets; adding a build step would be unnecessary now. |
| `template.html` as page starter | Fastest way to keep header/footer/scripts consistent. |
| `platform-pages.css` after `my.css` | Allows additions without modifying copied baseline CSS. |
| Minimal asset policy | Prevents `front` from becoming a full copy of the old project. |

## Current Resource Baseline

### CSS kept
- `css/my.css`
- `css/platform-pages.css`
- `css/swiper-bundle.min.css`
- `css/aos.css`
- `css/fancybox.css`

### JS kept
- `js/jquery-3.6.0.min.js`
- `js/swiper-bundle.min.js`
- `js/aos.js`
- `js/fancybox.umd.js`
- `js/my.js`
- `js/platform-pages.js`

### Images kept
- `images/logo.svg`
- `images/logo2.svg`
- `images/footLogo.svg`
- `images/foot-tel.svg`
- `images/code.png`
- `images/listShow/banner.png`
- `images/设计图/*` as source design references

## Current Task: Modern Agriculture Project List
- New page name: `modern_agriculture_projects.html`.
- Target design image: `images/设计图/3.都市型现代农业、现代设施农业及农业产业链融合产业类模板.jpg`, size `1920 x 5873`.
- User-provided page assets in `images/listShow` include:
  - `banner.png` at `1920 x 780`.
  - `item1.png`, `item2.png`, `item3.png`, `item4.png` for project/category imagery.
  - Multiple exported SVG icons/shapes from Figma.
- Old reference `双创前端代码/express_policy.html` provides usable behavior patterns:
  - Filter options are single-select per row.
  - Selected tags are rebuilt from active filter options.
  - Clear button removes current active selections.
  - Pagination is simple static links styled by `.pages`.
- Visual structure to implement:
  - Full-width hero under fixed transparent header.
  - Horizontal category cards, first card active blue/image state.
  - White rounded filter panel with district/town filters, selected tags, clear action, and search pill.
  - Project list cards, first card highlighted blue, repeated white cards below.
  - Bottom scenic wash before shared footer and centered `.pages` pagination.

### Fonts kept
- Source Han Sans CN Regular/Medium/Bold/Heavy
- Manrope semibold

## Style Conventions
- Desktop rem conversion follows the original project: 1920px baseline, `1rem = 100px`, so `px / 100 = rem`.
- Use `1200px` as the main responsive breakpoint.
- Use `767px` for phone refinements.
- Prefer existing utility classes such as `.comWrapper`, `.w1360`, `.w1480`, `.flex`, `.appW100`, `.common_tit`, and `.btn_arrow`.
- New page-specific class names should be prefixed by page/module names to avoid collisions.
- Avoid changing `my.css` unless a shared convention truly needs to change.

## Long-Term Memory: rem and Responsive Adaptation

### rem baseline
- This project inherits the original static frontend's hand-written `rem` system.
- The root sizing is defined near the top of `css/my.css`:

```css
html {font-size: clamp(calc(100vw / 38.4), calc(100vw / 19.2), calc(100vw / 19.2));}
body {font-size: clamp(14px, 2vw, 80px);}
body{... font-size: .16rem;}
```

- Practical desktop baseline: 1920px design width.
- At 1920px viewport width, `1rem = 100px`.
- Use `px / 100 = rem` for new desktop CSS unless matching a local exception.
- Examples:
  - `16px = .16rem`
  - `40px = .4rem`
  - `350px = 3.5rem`
  - `1360px = 13.6rem`
  - `1920px = 19.2rem`
- The desktop `clamp()` currently has identical preferred and max values, so it effectively behaves like `font-size: calc(100vw / 19.2)`.
- Do not add JS-based rem calculation unless there is a strong reason; current adaptation is CSS-only.

### Figma handoff
- Figma/Dev Mode settings for this project:
  - Platform: `CSS`
  - Unit: `rem`
  - Unit scale: `100`
- Do not use Figma's default `Unit scale = 16` for this project. With `16`, `240px` becomes `15rem`; with `100`, `240px` becomes `2.4rem`, matching the existing codebase.

### Responsive rules
- Main desktop-to-tablet/mobile breakpoint is `1200px`.
- Phone refinement breakpoint is `767px`.
- Tablet-specific rules use `@media (max-width:1200px) and (min-width:767px)`.
- Under `1200px`, `css/my.css` changes the root font size and layout behavior:

```css
@media screen and (max-width:1200px){
  html {font-size: clamp(80px, 21vw, 100px);overflow-x: hidden!important;}
  body{font-size: .17rem;overflow-x: hidden!important;}
  .app{display: block!important;}
  .pc{display: none!important;}
  .flex{flex-wrap: wrap;}
  .comWrapper{width: 90%;}
}
```

- Important behavior under `1200px`:
  - Root font size is clamped between `80px` and `100px`.
  - `.pc` content is hidden and `.app` content is shown.
  - Generic `.flex` containers wrap.
  - `.comWrapper` changes to `90%` width.
  - Header becomes a fixed mobile header.
  - Navigation becomes a slide-in mobile menu.
  - Multi-column sections generally become stacked or wrapped.
  - Overflow-prone tabs/filters should follow the existing horizontal-scroll pattern: `overflow-x: auto`, `white-space: nowrap`, hidden scrollbars.

### JS responsive behavior
- `js/my.js` uses `$(window).width() < 1200` and `> 1200` for interaction behavior.
- Under `1200px`, `.menu-handler` opens/closes the mobile menu.
- Under `1200px`, `.headR .navApp` click toggles dropdown menus.
- Over `1200px`, scroll changes the header style with `headerBlack2`.
- `js/my.js` does not calculate `rem`.

### Future implementation guidance
- Keep new desktop dimensions in `rem` using `px / 100 = rem`.
- Preserve `1200px` as the major layout breakpoint unless a specific page has a documented reason.
- Preserve `767px` as the phone refinement breakpoint.
- For images/media, prefer existing patterns: `width: 100%`, `aspect-ratio`, and `object-fit: cover`.
- Put new page-specific CSS in `css/platform-pages.css` after `css/my.css` unless the change is a true shared convention.
- Use `template.html` as the page starter so viewport meta, shared CSS, and shared JS remain consistent.

## Detail Page Conventions (agriculture_project_detail.html)

- **Figma node:** `562:3847` (1920×9949px), file key `CIoMNvtyEyV5BbJ2bZswY3`.
- **Page file:** `agriculture_project_detail.html` — naming follows `{topic}_project_detail.html` pattern.
- **CSS file:** `css/agri-detail.css` — separate CSS file per page family; prefix `agri_dtl_`.
- **JS file:** `js/agri-detail.js` — page-specific JS loaded after `platform-pages.js`.
- **Images folder:** `images/agri-detail/` — all Figma-sourced assets for this page.
- **Sections (top→bottom):** Hero (9.4rem), 项目概览, 招商条件(dark-blue bg), 项目详情, 特色优势(dark bg), 项目图集(dark-blue bg), 周边配套(map+POI), 支持政策(bg-image+table), 相关推荐项目, CTA招募, Footer.
- **Swiper usage:** hero main+thumbs (fade+thumbs), detail gallery (centeredSlides).
- **Fancybox usage:** detail-gallery, adv-gallery, photos-gallery lightbox groups.
- **Color tokens:** blue `#165DFF`/`#0B4CA1`, orange `#FF852B`, dark navy `#0E2A6E`.

## Resources
- Original project: `D:\起步\mymymy\双创前端代码`
- New project: `D:\起步\mymymy\front`
- Design images: `D:\起步\mymymy\front\images\设计图`
- Scaffold entry: `D:\起步\mymymy\front\index.html`
- Reusable page template: `D:\起步\mymymy\front\template.html`

## Visual/Browser Findings
- Browser automation was blocked by policy for `localhost` and `file://` access.
- Verification should use static reference checks and local HTTP response checks unless browser access becomes available.
