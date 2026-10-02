import {copyFile,mkdir} from 'node:fs/promises';
await mkdir('public',{recursive:true});await copyFile('src/data/content.json','public/content.json');
