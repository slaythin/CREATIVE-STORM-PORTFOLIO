import {readFile,writeFile,mkdir} from 'node:fs/promises';
const content=JSON.parse(await readFile('src/data/content.json','utf8'));const html=await readFile('dist/index.html','utf8');
const routes=['work','about','lab','cv','cv/alternate','studio','studio/preview',...content.projects.filter(p=>p.visible).map(p=>'work/'+p.slug)];
for(const route of routes){await mkdir('dist/'+route,{recursive:true});const prefix='../'.repeat(route.split('/').length);await writeFile('dist/'+route+'/index.html',html.replaceAll('"./','"'+prefix));}
await writeFile('dist/404.html',html);console.log(`Created ${routes.length} direct content routes.`);
