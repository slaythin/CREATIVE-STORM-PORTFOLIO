# Nathin Pillay — The Creative Storm

A portable portfolio built with React, Vite and Three.js. Eight complete project collections, original artwork, video embeds, an AI innovation section and two separate CV treatments are included.

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
- **creative-storm-ready-to-host.zip** — the built website, assets and a zero-dependency preview server.

Each ZIP has a `START-HERE.txt`. For the built version, run `node serve.mjs` in its extracted folder, then open http://127.0.0.1:4173/. It requires Node.js but no `npm install`. Existing VS Code Live Server installations can also serve the built folder.

To recreate both downloads from source, run `npm run package`. ZIP creation uses Node's standard library. GitHub artifacts expire after 30 days; the private repository retains the source, assets and packaging script.

## Content Studio

The Studio is a local, private content editor bound to your computer's loopback address. It is not a publicly hosted administration service. It supports:

- Adding, hiding, featuring and reordering projects.
- Updating cover images, descriptions, galleries, captions and video embeds.
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

The production site is at **http://127.0.0.1:4173**. Upload the contents of `dist` to a static host to publish the public portfolio. Direct HTML route folders are generated for all visible projects and both CV layouts. The application also supports a project subfolder, including a GitHub Pages repository path.

Keep the source repository private if desired. A private repository does not automatically make a GitHub Pages website private. Hosting is deliberately not enabled by this project.

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
| Alternative CV | `/cv/alternate` |
| Local Studio | `/studio` |

Both CV versions link to one another. The alternative CV has a print stylesheet; use its **Print / Save PDF** control.

## Motion and interaction

The approved tornado image is the atmosphere foundation. A WebGL shader adds cloud displacement and pointer parallax, with real perspective mist geometry in front of the image. A separate generated neural atmosphere provides close-up texture behind the live neural geometry. Three.js renders genuine 3D neural geometry: shaped cell bodies, tapering dendrites, fine curved connections, depth particles and travelling electrical impulses. Cells use instancing to keep draw calls low. This hybrid technique is not a reconstructed volumetric tornado or fluid simulation.

Scroll to move from the project vortex into a readable grid, then into the creative mind. Hover over neurons, click the scene or use **Fire a thought**. The header pause control stops background motion and the brand strip. Reduced-motion preferences are respected; mobile uses a direct grid. A still background remains when WebGL is unavailable.

## Assets and content

Imported from Nathin's reference portfolio: https://a21731935.myportfolio.com/work. Brand marks remain the property of their respective owners. Portfolio images, original CV and the approved tornado image are bundled locally. Video embeds and external project websites still require internet access; they are not downloaded video files.

The AI section includes all 14 supplied pipeline images and three original-versus-pipeline comparisons. BEST IMAGE.png is used for the AI hero, the work-grid card and the home-page AI feature. WebP delivery copies are bundled; full print masters remain in the supplied Drive folder. The local Studio can change the hero, reorder the AI gallery and edit comparisons. No demonstration results have been fabricated, and proprietary pipeline steps are not disclosed. Print resolution is described subject to the agreed dimensions and source quality.

See `docs/verification.md` for tested behaviour and remaining limitations.
