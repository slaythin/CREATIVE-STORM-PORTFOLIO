import {copyFile,mkdir,readFile,stat} from 'node:fs/promises';
const content=JSON.parse(await readFile('src/data/content.json','utf8'));
const assets=new Set(['/assets/storm-hero.png','/assets/neural-atmosphere.png']);
function collect(value){if(typeof value==='string'&&value.startsWith('/assets/'))assets.add(value);else if(Array.isArray(value))value.forEach(collect);else if(value&&typeof value==='object')Object.values(value).forEach(collect);}
collect(content);
for(const asset of assets){const file='public'+asset;const info=await stat(file).catch(()=>null);if(!info?.isFile()||info.size===0)throw new Error('Missing or empty portfolio asset: '+asset);}
await mkdir('public',{recursive:true});await copyFile('src/data/content.json','public/content.json');
console.log(`Checked ${assets.size} bundled content assets.`);
