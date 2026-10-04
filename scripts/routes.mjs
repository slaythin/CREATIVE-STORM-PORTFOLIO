import {readFile,writeFile,mkdir} from 'node:fs/promises';
const content=JSON.parse(await readFile('src/data/content.json','utf8'));
let html=await readFile('dist/index.html','utf8');
// A classic bundle works from HTTPS and file:// without changing browser security.
const script=html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
if(!script||!script[1].startsWith('./assets/'))throw new Error('Compiled application script was not found.');
const loader=`<script data-app="${script[1]}" data-textures="./assets/offline-textures.js">
(function(){var tag=document.currentScript,app=tag.dataset.app;function failed(){var p=document.getElementById('startup-message');if(p)p.textContent='A website file could not load. Extract the complete ready-to-host ZIP, keeping index.html and the assets folder together, then open index.html again.';}function load(src,done){var s=document.createElement('script');s.src=src;s.onload=done||null;s.onerror=failed;document.head.appendChild(s);}function start(){if(location.protocol==='file:')load(tag.dataset.textures,function(){load(app);});else load(app);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();})();
</script>`;
html=html.replace(script[0],loader).replaceAll(' crossorigin','');
await writeFile('dist/index.html',html);
const textures={};
for(const [key,file] of [['storm','storm-hero.png'],['neural','neural-atmosphere.png']])textures[key]='data:image/png;base64,'+(await readFile('public/assets/'+file)).toString('base64');
await writeFile('dist/assets/offline-textures.js','window.__stormTextures='+JSON.stringify(textures)+';');
await writeFile('dist/.nojekyll','');
const routes=['work','about','lab','cv','studio','studio/preview',...content.projects.filter(p=>p.visible).map(p=>'work/'+p.slug)];
for(const route of routes){await mkdir('dist/'+route,{recursive:true});const prefix='../'.repeat(route.split('/').length);await writeFile('dist/'+route+'/index.html',html.replaceAll('"./','"'+prefix));}
await writeFile('dist/404.html','<!doctype html><html lang="en"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found · Nathin Pillay</title><style>body{background:#080c12;color:#e7edf5;font:18px/1.7 system-ui;padding:12vw}a{color:#8fdff4}</style><h1>Let’s find your way back.</h1><p>This project address has changed. Use your browser’s Back button to return to the portfolio.</p></html>');
console.log(`Created ${routes.length} direct content routes with file and HTTP support.`);

await mkdir('dist/cv/alternate',{recursive:true});
await writeFile('dist/cv/alternate/index.html','<!doctype html><html lang="en"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Original CV · Nathin Pillay</title><style>body{background:#080c12;color:#eef1f5;font:18px system-ui;padding:10vw}a{color:#bddfff}</style><script>location.replace(location.protocol==="file:"?"../../index.html#/cv":"../");</script><p><a href="../">Open the original CV</a></p></html>');
