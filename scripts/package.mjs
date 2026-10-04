// Portable ZIP packaging with Node's standard library; no extra software required.
import {readdir,readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {deflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'downloads');
await mkdir(output,{recursive:true});
const table=Array.from({length:256},(_,i)=>{for(let j=0;j<8;j++)i=(i&1)?0xedb88320^(i>>>1):i>>>1;return i>>>0;});
function crc32(data){let c=0xffffffff;for(const b of data)c=table[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
async function collect(folder,prefix=''){
  const files=[];
  for(const entry of (await readdir(folder,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
    if(entry.isSymbolicLink())continue;
    const local=path.join(folder,entry.name),name=prefix+entry.name;
    if(entry.isDirectory())files.push(...await collect(local,name+'/'));
    else if(entry.isFile())files.push({name,data:await readFile(local)});
  }
  return files;
}
async function zip(name,files){
  const chunks=[],central=[];let offset=0;
  for(const file of files){
    const nameBytes=Buffer.from(file.name),data=Buffer.isBuffer(file.data)?file.data:Buffer.from(file.data);
    const packed=deflateRawSync(data,{level:6}),checksum=crc32(data);
    const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50);local.writeUInt16LE(20,4);local.writeUInt16LE(0x800,6);local.writeUInt16LE(8,8);
    local.writeUInt16LE(0x5d42,12);local.writeUInt32LE(checksum,14);local.writeUInt32LE(packed.length,18);local.writeUInt32LE(data.length,22);local.writeUInt16LE(nameBytes.length,26);
    const dir=Buffer.alloc(46);dir.writeUInt32LE(0x02014b50);dir.writeUInt16LE(20,4);dir.writeUInt16LE(20,6);dir.writeUInt16LE(0x800,8);dir.writeUInt16LE(8,10);
    dir.writeUInt16LE(0x5d42,14);dir.writeUInt32LE(checksum,16);dir.writeUInt32LE(packed.length,20);dir.writeUInt32LE(data.length,24);dir.writeUInt16LE(nameBytes.length,28);dir.writeUInt32LE(offset,42);
    chunks.push(local,nameBytes,packed);central.push(dir,nameBytes);offset+=local.length+nameBytes.length+packed.length;
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(files.length,8);end.writeUInt16LE(files.length,10);end.writeUInt32LE(directory.length,12);end.writeUInt32LE(offset,16);
  const archive=Buffer.concat([...chunks,directory,end]);await writeFile(path.join(output,name),archive);
  return{name,bytes:archive.length,files:files.length,sha256:createHash('sha256').update(archive).digest('hex')};
}

await stat(path.join(root,'dist/index.html')); // Build first; never package a missing site.
const source=[];
for(const folder of ['src','public','server','scripts','tests','docs','.github'])source.push(...await collect(path.join(root,folder),folder+'/'));
for(const entry of await readdir(root,{withFileTypes:true})){
  if(entry.isFile()&&(/\.(json|md|html|mjs|ts|txt)$/.test(entry.name)||entry.name==='.gitignore'))source.push({name:entry.name,data:await readFile(path.join(root,entry.name))});
}
const sourceGuide=`CREATIVE STORM — EDITABLE SOURCE

Open this folder in VS Code. Use Node.js 22.13 or newer.
In its terminal:
  npm ci
  npm run dev

Portfolio: http://127.0.0.1:5173
Content editor: http://127.0.0.1:5173/studio

To create a deployment: npm run build
To recreate these two download packages: npm run package

All portfolio images and fonts are bundled. Original video embeds require internet.
Read README.md for editing, the original CV page, motion controls and hosting instructions.
No repository visibility or hosting access settings are changed by this package.
`;
source.push({name:'START-HERE.txt',data:sourceGuide});
const ready=await collect(path.join(root,'dist'));
ready.push({name:'serve.mjs',data:await readFile(path.join(root,'scripts/static-preview.mjs'))});
ready.push({name:'START-HERE.txt',data:`CREATIVE STORM — READY TO HOST / DOUBLE-CLICK PREVIEW

This folder contains the built website, all portfolio images and local fonts.
Upload its contents to a static web host when you are ready to publish.
It also supports a repository subfolder, such as /CREATIVE-STORM-PORTFOLIO/.

OPEN WITHOUT INSTALLING ANYTHING
Extract this whole ZIP, then double-click index.html. Keep the assets folder beside it.
Project, AI and CV HTML pages can also open directly.

OPTIONAL HTTP PREVIEW
If Node.js is already installed, open a terminal in this folder and run:
  node serve.mjs
Open http://127.0.0.1:4173/
No dependency installation is needed for this preview.

If you already use VS Code Live Server, open this folder and serve index.html.
Both double-click and HTTP previews are supported. The editable-source index.html
is different: it requires npm run dev.

EDIT CONTENT
Use the separate editable-source package for the private local Content Studio.
This built copy is read-only. Original video embeds require internet access.

This package does not change hosting or access settings.
For GitHub Pages, deploy this complete built folder or use the source repository
workflow with Settings > Pages > Source set to GitHub Actions.
`});
const packages=[];
packages.push(await zip('creative-storm-source.zip',source.map(f=>({...f,name:'creative-storm-source/'+f.name}))));
packages.push(await zip('creative-storm-ready-to-host.zip',ready.map(f=>({...f,name:'creative-storm-ready-to-host/'+f.name}))));
await writeFile(path.join(output,'checksums.json'),JSON.stringify({packages},null,2)+'\n');
console.log(JSON.stringify({output,packages},null,2));
