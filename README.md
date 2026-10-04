# Nathin Pillay — The Creative Storm

A portable portfolio built with React, Vite and Three.js. Eight complete project collections, original artwork, video embeds, an AI innovation section and the original CV are included.

## Run in VS Code

Use Node.js 22.13 or newer. No remote desktop software, ChatGPT subscription, Adobe Portfolio account or cloud credentials are required to run the project.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173**. Open **http://127.0.0.1:5173/studio** to edit content.

## Download packages

The GitHub **Check and package portfolio** workflow creates a `creative-storm-downloads` artifact after its checks pass. It contains:

- **creative-storm-source.zip** — editable source, local Content Studio and every portfolio asset.
- **creative-storm-ready-to-host.zip** — the built website that also opens directly by double-clicking its `index.html`.

Each ZIP has a `START-HERE.txt`. **For a preview without installing anything, extract the entire ready-to-host ZIP and double-click `index.html`.** Keep the assets folder beside it. The HTML files inside the project, AI and CV folders also open directly. File previews use hash navigation and bundled content; galleries, fonts, storm and neural effects work locally. External video embeds still need internet and may require an HTTP host.

You can also run `node serve.mjs` in the built folder, then open http://127.0.0.1:4173/. This optional HTTP preview needs Node.js but no `npm install`. Existing VS Code Live Server installations can also serve the built folder. The editable-source `index.html` is a development entry and must be opened using `npm run dev`.

To recreate both downloads from source, run `npm run package`. ZIP creation uses Node's standard library. GitHub artifacts expire after 30 days; the repository retains the source, assets and packaging script.

## Content Studio

The Studio is a local, private content editor bound to your computer's loopback address. It is not a publicly hosted administration service. It supports:

- Adding, hiding and reordering projects, with every visible project in the opening storm.
- Updating cover images, descriptions, galleries, captions and video embeds.
- Moving project sections and editing source-matched text without flattening the page sequence.
- Uploading PNG, JPEG, WEBP, GIF and AVIF images, up to 20 MB each.
- Editing your profile, brand strip, CV and AI copy.
- Adding real before/after AI image pairs and captions.
- Saving a draft independently of published content.
- Previewing the saved home-page draft and exporting editable content JSON.

**Save draft** keeps edits locally. **Publish changes** updates the project's `src/data/content.json` and `public/content.json`. To update a hosted copy, rebuild and deploy the new `dist` folder. Publishing in the local Studio does not upload to GitHub or alter a hosted website automatically.

Drafts are stored in `.portfolio/state.json`. Image uploads go into `public/assets/uploads`. Keep that folder and your content JSON together when backing up or committing edits. Rebuild after adding or renaming project routes. Links from the draft home-page preview open published project content.

## Build and serve

```sh
npm run typecheck
npm test
npm run build
npm start
```

The production site is at **http://127.0.0.1:4173**. Upload the contents of `dist` to a static host to publish the public portfolio. Direct HTML route folders are generated for all visible projects and the original CV. The application also supports a project subfolder, including a GitHub Pages repository path.

The owner enabled a GitHub Pages deployment on 2 October 2026. Repository and hosting access settings are preserved. The included deployment workflow targets that existing site; it does not create a Pages site or change its audience.

## GitHub Pages

GitHub Pages must deploy the **compiled `dist` folder**, not the source `index.html` pointing at `/src/main.tsx`. In repository **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**. The `Deploy portfolio to GitHub Pages` workflow builds and deploys `dist` after `Check and package portfolio` succeeds. It also has a manual Run workflow button. If Pages is not already enabled, the workflow stops rather than creating a new public site.

The build uses relative assets and generated route folders, so it works under `/CREATIVE-STORM-PORTFOLIO/` without changing image paths. Preserve the repository and Pages access settings when deploying.

If you see a blank page from an old download, replace it with the corrected ready-to-host package. The corrected build uses a classic browser bundle, embedded local fonts, a file-safe texture loader and a visible startup message if files are missing.

For the local editor, use `npm run dev` or `npm start`; a static host serves the portfolio only. Don't expose this development server on the internet.

## Pages

| Page | Path |
| --- | --- |
| Storm and selected work | `/` |
| All work | `/work` |
| Full project collection | `/work/build-it` and other project slugs |
| The mind | `/about` |
| AI innovation | `/lab` |
| Original CV | `/cv` |
| Local Studio | `/studio` |

The original CV is also displayed on the right of The Mind page. It has download and **Print / Save PDF** controls. Old `/cv/alternate` bookmarks redirect to the original; the alternative design has been removed.

## Motion and interaction

The approved tornado image is the atmosphere foundation. The photograph remains optically stable. Real perspective mist and rising dust move in front of it, with localized lightning. Nine project cards orbit in depth before settling into a three-by-three desktop grid. A separate generated neural atmosphere provides close-up texture behind the live neural geometry. Three.js renders genuine 3D neural geometry: shaped cell bodies, tapering dendrites, fine curved connections, depth particles and travelling electrical impulses. Cells use instancing to keep draw calls low. This hybrid technique is not a reconstructed volumetric tornado or fluid simulation.

Scroll to move from the project vortex into a readable grid, then into the creative mind. Hover over neurons, click the scene or use **Fire a thought**. The header pause control stops background motion and the brand strip. Reduced-motion preferences are respected; mobile uses a direct grid. A still background remains when WebGL is unavailable.

## Assets and content

Imported from Nathin's reference portfolio: https://a21731935.myportfolio.com/work. Brand marks remain the property of their respective owners. Portfolio images, original CV and the approved tornado image are bundled locally. Video embeds and external project websites still require internet access; they are not downloaded video files.

The AI section includes all 14 supplied pipeline images and two original-versus-pipeline comparisons. BEST IMAGE.png is used for the AI hero, the work-grid card and the home-page AI feature. WebP delivery copies are bundled; full print masters remain in the supplied Drive folder. The local Studio can change the hero, reorder the AI gallery and edit comparisons. No demonstration results have been fabricated, and proprietary pipeline steps are not disclosed. Print resolution is described subject to the agreed dimensions and source quality.

The eight original project pages preserve the reference’s interleaved descriptions, media order and six retained films. The painting video and duplicate AI comparison have been removed at the owner’s request.

See `docs/verification.md` for tested behaviour and remaining limitations.
