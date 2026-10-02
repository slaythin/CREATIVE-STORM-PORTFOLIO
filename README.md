# Nathin Pillay — The Creative Storm

A portable portfolio built with React, Vite and Three.js. Eight complete project collections, original artwork, video embeds, an AI innovation section and two separate CV treatments are included.

## Run in VS Code

Use Node.js 22.13 or newer. No remote desktop software, ChatGPT subscription, Adobe Portfolio account or cloud credentials are required to run the project.

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:5173**. Open **http://127.0.0.1:5173/studio** to edit content.

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

The approved tornado image is the atmosphere foundation. A WebGL shader adds cloud displacement, mist and pointer parallax. Three.js renders genuine 3D neural geometry, curved connections, depth particles and travelling electrical impulses. This hybrid technique is not a reconstructed volumetric tornado or fluid simulation.

Scroll to move from the project vortex into a readable grid, then into the creative mind. Hover over neurons, click the scene or use **Fire a thought**. The header pause control stops background motion and the brand strip. Reduced-motion preferences are respected; mobile uses a direct grid. A still background remains when WebGL is unavailable.

## Assets and content

Imported from Nathin's reference portfolio: https://a21731935.myportfolio.com/work. Brand marks remain the property of their respective owners. Portfolio images, original CV and the approved tornado image are bundled locally. Video embeds and external project websites still require internet access; they are not downloaded video files.

The AI comparison section appears only when genuine paired images have been added. The oversized comparison archive was not available for this build. No demonstration results or comparison claims have been fabricated, and proprietary pipeline steps are not disclosed. Print resolution is described subject to the agreed dimensions and source quality.

See `docs/verification.md` for tested behaviour and remaining limitations.
