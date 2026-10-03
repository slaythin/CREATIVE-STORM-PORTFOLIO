# Creative Storm handoff

This is Nathin Pillay's portable portfolio project. It continues the imported content from the original Site and the approved midnight tornado artwork. Start with README.md for setup and docs/verification.md for test evidence.

## Project structure

- `src/components/portfolio.tsx`: public pages, galleries, CV layouts and vortex-to-grid transition.
- `src/components/atmosphere.tsx`: hybrid WebGL storm, 3D mist, lightning and motion lifecycle.
- `src/components/neural-scene.ts`: instanced organic cells, tapered branching dendrites and electrical propagation.
- `src/storm.css`: graphite, silver, glass and responsive design overrides.
- `src/components/studio.tsx`: visual content editor.
- `src/data/content.json`: published content; `public/content.json` is its built copy.
- `public/assets`: local portfolio images, brand marks, original CV and approved storm plate.
- `server`: loopback-only editor API, upload handling and local production server.
- `scripts/routes.mjs`: direct HTML folders for project and CV URLs.

## Preserve

Keep all imported artwork, captions, descriptions and original video embeds. Both `/cv` and `/cv/alternate` remain available for the owner's comparison. Preserve repository access settings; do not change visibility. Do not change the original hosted Site's owner-private audience.

The user does not authorize remote desktop software installation on their computer. This project runs in VS Code or can be built and hosted from GitHub.

Do not expose proprietary AI workflow details or claim universal superiority, perfect detail or unlimited print sizes. Keep 500 dpi descriptions subject to dimensions and source detail. Use actual supplied images for any before/after comparison.

The user moved the final one-time continuation to 05:00 SAST on 3 October 2026. That session verified the repaired live site and completed the handoff. No further continuation or second reset is authorized.

## Remaining review areas

- Owner review of the visual direction, especially how closely the hybrid storm/neural scene matches the desired cinematic realism.
- Broader real-device and Safari/Firefox testing before public launch.
- Real external video playback and any final brand colour-master substitutions.
- Owner review of the supplied original/pipeline pairings and image captions. All 17 supplied Drive images are now included as optimized web assets.

The owner enabled GitHub Pages on 2 October 2026. Its initial Jekyll deployment incorrectly served uncompiled React source. The repair adds a compiled deployment workflow for that existing Pages site. Repository privacy and the original owner-private Site remain unchanged. Read the latest verification entry for the actual deployment result.

## Download handoff

Run `npm run package` to build both ZIP downloads into `downloads/`. This uses only Node's standard library. The source package includes the full local Studio. The ready-to-host package includes `serve.mjs` for previewing without installing dependencies. Both include `START-HERE.txt`.

The check workflow builds the same packages after verification. The separate deploy workflow targets an already enabled Pages site and never enables hosting itself. Workflow download artifacts last 30 days; source and assets remain in the private repository.

## Blank-screen repair

The ready-to-host build now supports both direct file opening and HTTP hosting. Production code is one classic IIFE bundle with embedded fonts; direct-file mode loads embedded storm/neural textures and uses hash navigation. Every route includes a relative site-root marker. Published content is bundled for file previews. Content Studio still requires its local server. The source entry has a visible fallback instead of an empty white document. `tests/open-files.cjs` tests real file URLs without relaxed file-access/browser-security flags.

Pages deployment is defined in `.github/workflows/deploy-pages.yml` and runs after successful checks. Recommended Pages source: GitHub Actions. It uploads only `dist`. Do not publish the source tree, change repository privacy or alter the original Site.

## AI image selection

The shared Drive folder is documented in `docs/ai-assets.json`. Its BEST IMAGE.png is the AI hero, work-grid card, home-page AI image and first gallery entry. All 14 pipeline images are included. Three originals are used in side-by-side comparisons, with an optional overlay slider. The Studio exposes the hero and gallery controls. Preserve the existing eight imported projects separately.

Latest hosting observation (2 October, 23:40 SAST): repository API `has_pages` is false and the previous URL is HTTP 404. The downloadable build is verified. Do not claim the live site is fixed or automatically enable a new site. The owner needs Settings → Pages → Source: GitHub Actions, then the Deploy portfolio workflow can run. Check run 37068019741 is for the tested code repair d2b7cc0.

## Current handoff — 3 October 2026, 05:06 SAST

The compiled site is live at https://slaythin.github.io/CREATIVE-STORM-PORTFOLIO/. The successful deployment is run 37068857342, rerun after the owner enabled Pages. Main remains c88f996a9a073ea7fa963bd006a07825075f4545. Live homepage, AI and CV URLs return HTTP 200 and compiled HTML. Fresh Chromium rendering confirmed six opening project covers, WebGL, no startup fallback, BEST IMAGE and all 14 AI images, with no captured JavaScript errors. Earlier live checks also verified the full 23-image Build it gallery and 18 alternative-CV entries.

GitHub currently reports the repository public and Pages enabled. This visibility change was observed before this session; the assistant did not change it. Preserve current settings and the separate original Site's owner-private audience.

Recent automatic Pages runs used Jekyll. Select Settings → Pages → Source: GitHub Actions to prevent future source-branch deployments replacing the compiled site. The connector cannot edit that setting. Documentation is saved on handoff-2026-10-03, rather than pushing main and potentially triggering that old source deployment. Merge those notes after the Pages source is corrected. Application code needs no additional changes for this repair.
