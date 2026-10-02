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
