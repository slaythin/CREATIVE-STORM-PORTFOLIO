# Verification — 2 October 2026

The portable project is separate from the original owner-private hosted Site. That Site's source and audience have not been changed.

## Passed locally

- TypeScript checking and production build.
- Six backend tests: draft isolation, conflicting revision rejection, publishing persistence, foreign-origin rejection, unique route validation and image upload validation.
- Eleven Chromium browser checks: WebGL renders, six linked opening covers, full project galleries, video embed preservation, lightbox keyboard navigation and Escape, both CV layouts, art filtering, electrical interaction control, motion preference persistence, local Studio, mobile navigation, reduced motion and direct content routes.
- Five subfolder checks: homepage/WebGL, brand assets, internal project links, direct project reload and the CV print stylesheet.
- Desktop 1440×960 and mobile 390×844 screenshots inspected. No horizontal overflow in the tested mobile view.
- No captured JavaScript or shader errors in the completed browser checks.
- Eight imported project collections, 146 gallery entries and seven video embeds preserved. All 161 content-referenced image paths resolve to bundled files.
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

The storm is a hybrid image plate with shader-driven movement, localized illumination, branching 3D lightning, particles and a real 3D neural network. It is not a full volumetric weather simulation. The supplied watermarked neural references informed the art direction and are not included as site artwork.

The source includes original monochrome Illovo and ACCORD marks with colour presentation applied in SVG/CSS, alongside the supplied colour logos. Exact colour-master matching has not been independently certified; all marks can be replaced in the Studio.

The private editor runs locally. A static deployment has no writable administration backend. Publish in the local Studio, rebuild, then deploy `dist`.

The 247 MB AI comparison archive could not be recovered: the latest whole-file download returned HTTP 502. No comparison images were fabricated. The Studio supports adding the genuine before/after pairs when available. No universal superiority or unlimited-resolution claims are made.
