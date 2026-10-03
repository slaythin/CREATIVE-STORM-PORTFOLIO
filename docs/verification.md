# Verification — 2 October 2026

The portable project is separate from the original owner-private hosted Site. That Site's source and audience have not been changed.

## Passed locally

- TypeScript checking and production build.
- Six backend tests: draft isolation, conflicting revision rejection, publishing persistence, foreign-origin rejection, unique route validation and image upload validation.
- Seventeen Chromium browser checks: WebGL renders, six linked opening covers, full project galleries, video embed preservation, lightbox keyboard navigation and Escape, both CV layouts, art filtering, electrical interaction control, motion preference persistence, local Studio, mobile navigation, reduced motion direct content routes, the dedicated mind-page interaction, paused-canvas stability and resizing, the AI hero selection, all 14 AI gallery entries, three comparisons, keyboard slider controls and the AI mobile layout.
- Five subfolder checks: homepage/WebGL, brand assets, internal project links, direct project reload and the CV print stylesheet.
- Desktop 1440×960 and mobile 390×844 screenshots inspected. No horizontal overflow in the tested mobile view.
- No captured JavaScript or shader errors in the completed browser checks.
- Eight imported project collections, 146 gallery entries and seven video embeds preserved. All original content-referenced images remain bundled. The AI section adds 14 pipeline gallery images and three supplied original images.
- A clean `npm ci` installation, TypeScript check, editor test suite and production build all succeed. Dependencies are recorded in a portable lockfile; no local linked packages are included in that lockfile.

## Concrete fixes from testing

- Corrected the mobile heading overflow.
- Added directory redirects so refreshing a project URL resolves relative assets correctly under a repository subfolder.
- Put project descriptions on a dark translucent panel for readability.
- Moved the creative-mind text aside to leave the neural scene visible.
- Retained motion controls across all public pages and made the electrical control respect pause.

## Scope and limits

Testing used Chromium 133 with software rendering in the execution workspace. Safari, Firefox, real mobile devices, screen-reader behaviour and broad device performance have not been independently tested. The screenshots and checks establish functionality in that environment, not universal visual quality.

Videos remain the original remote embeds. Their presence is verified; actual third-party streaming playback has not been verified. They require internet access.

The storm combines the approved photographic plate with shader movement, localized illumination, perspective mist, branching 3D lightning, particles and an instanced 3D neural network. A newly generated neural atmosphere image provides macro texture behind the interactive geometry. It is not a full volumetric weather simulation. The supplied watermarked neural references informed the art direction and are not included as site artwork.

The source includes original monochrome Illovo and ACCORD marks with colour presentation applied in SVG/CSS, alongside the supplied colour logos. Exact colour-master matching has not been independently certified; all marks can be replaced in the Studio.

The private editor runs locally. A static deployment has no writable administration backend. Publish in the local Studio, rebuild, then deploy `dist`.

The original 247 MB archive download failed, but all 17 images were subsequently recovered from the user’s shared Google Drive folder. BEST IMAGE.png is the AI hero, work-grid cover, home AI feature and first AI gallery entry. Three supplied originals are paired with the corresponding pipeline studies; comparisons start side by side because some framing differs. No comparison images were fabricated. WebP delivery copies preserve the supplied composition and have a maximum 2560-pixel edge; full print masters remain in Drive. No universal superiority or unlimited-resolution claims are made.

## Daytime revision and delivery

The six backend tests, seventeen Chromium interaction groups and five subfolder checks passed on the revision containing the supplied AI images. The backend publish test also verifies preservation of the AI hero and gallery data. Screenshots of the AI hero at 1440×960 and 390×844 were captured; no horizontal overflow was reported.

The source and ready-to-host ZIPs are produced with `node scripts/package.mjs`. The packaging script includes all local assets and supplies a START-HERE guide in each archive. The built archive includes a zero-dependency Node preview server. Both ZIPs passed CRC integrity and content checks. The extracted ready-to-host build passed a Chromium check using its bundled zero-dependency preview server: BEST IMAGE loaded, all 14 AI gallery entries were present, and the direct Build it route opened its 23-image gallery without captured JavaScript errors.

## Blank-screen repair — 2 October, 23:36 SAST

GitHub's initial Pages run 37065748058 used Jekyll and deployed the source entry, which referenced `/src/main.tsx`. The source requires compilation. The previous ready-to-host build also used ES modules and was verified over HTTP only; direct file opening was not supported. These are separate causes of the reported blank pages.

The repaired build uses a classic browser bundle, embedded fonts, a relative root marker on every generated HTML page and file-specific embedded storm/neural textures. File previews use hash navigation and bundled published content. HTTP navigation, direct routes and local Studio remain supported. A visible startup message handles missing files. The source entry remains a development entry.

Passed on the repaired build:
- TypeScript and a clean production build, with no build warnings apart from the environment's npm proxy-setting notice.
- All 17 existing Chromium interaction groups, including editor loading, AI hero/gallery, both CVs, pause, mobile and reduced motion.
- All five repository-subfolder checks, including full direct project reloads and CV printing.
- Five new real `file://` checks: homepage/fonts/WebGL, navigation/gallery/lightbox/Back, direct AI HTML with BEST IMAGE and 14 images, both CV layouts, and a 390-pixel mobile preview. No browser file-access exceptions or disabled web-security flags were used. No captured JavaScript, shader or CORS errors. The double-click homepage screenshot was visually inspected.

The GitHub Pages deployment workflow now uploads the compiled `dist` folder after the checks pass. It reads an existing Pages configuration with enablement disabled, so it does not create a site or alter access settings. The recommended Pages source is GitHub Actions. Live deployment verification is recorded separately after the workflow runs.

Delivery verification: both corrected ZIPs passed CRC checks. The actual ready-to-host ZIP was extracted to a separate folder and all five direct-file browser checks passed again.

At 23:40 SAST, GitHub's repository API reported `private: true` and `has_pages: false`; the previous Pages URL returned HTTP 404. The earlier Jekyll deployment was successful, but no active Pages site is currently reported. Live repair cannot be confirmed until the owner enables Pages with Source set to GitHub Actions. The workflow intentionally does not create hosting or change visibility. The source repair is saved as commit `d2b7cc0792d37b60984423531b56bc8324d45a58`. Its independent GitHub check run is 37068019741; consult that run for the final remote result.

## Live verification — 3 October 2026, 05:06 SAST

The previous disabled-Pages observation is superseded. Deployment run 37068857342 completed successfully after a retry against the owner's enabled Pages site. Check run 37068461224 passed for main c88f996a9a073ea7fa963bd006a07825075f4545.

Fresh certificate-validated HTTP requests returned 200 and compiled HTML for the homepage, AI page and alternative CV. A fresh live Chromium check rendered the WebGL homepage with six covers and no startup error. BEST IMAGE decoded successfully on the AI page, with all 14 gallery entries. No JavaScript errors were captured. The homepage screenshot was inspected. Prior live browser checks also confirmed the complete 23-image Build it gallery and 18 CV entries.

The isolated Chromium context needed a certificate-trust exception for the execution workspace proxy; the independent Python HTTPS requests validated normally. No user browser or computer security settings were changed. This rendering check does not establish Safari/Firefox or real-device performance.

No application code or visual assets changed during the final check. The ready-to-host ZIP remains the previously verified double-click build. The source ZIP was refreshed only for handoff documentation. Documentation is saved on handoff-2026-10-03 to avoid retriggering the legacy Jekyll source deployment on main. Select GitHub Actions as the Pages source before merging those notes.
