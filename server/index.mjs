import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile,writeFile,rename,mkdir,stat} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {saveSchema} from './validation.mjs';
const ROOT=process.env.PORTFOLIO_DATA_ROOT||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const PORT=Number(process.env.PORT||4173),API_ONLY=process.env.API_ONLY==='1';
const stateFile=path.join(ROOT,'.portfolio/state.json');
async function atomic(file,value){await mkdir(path.dirname(file),{recursive:true});const tmp=file+'.'+randomUUID()+'.tmp';await writeFile(tmp,value);await rename(tmp,file);}
async function state(){try{return JSON.parse(await readFile(stateFile,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e;return {content:JSON.parse(await readFile(path.join(ROOT,'src/data/content.json'),'utf8')),revision:0};}}
const json=(res,status,body)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(body))};
async function body(req,max=3*1024*1024){let n=0;const chunks=[];for await(const chunk of req){n+=chunk.length;if(n>max)throw Object.assign(new Error('File is too large'),{status:413});chunks.push(chunk)}return Buffer.concat(chunks)}
let queue=Promise.resolve();
async function serialized(fn){const next=queue.then(fn);queue=next.catch(()=>{});return next;}
function imageExtension(b){if(b.length>8&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return 'png';if(b[0]===255&&b[1]===216&&b[2]===255)return 'jpg';if(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP')return 'webp';if(/^GIF8[79]a/.test(b.toString('ascii',0,6)))return 'gif';if(b.toString('ascii',4,8)==='ftyp'&&/avif|avis/.test(b.toString('ascii',8,32)))return 'avif';return null;}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.gif':'image/gif','.avif':'image/avif','.woff2':'font/woff2','.pdf':'application/pdf','.ico':'image/x-icon'};
const server=http.createServer(async(req,res)=>{try{
 const host=req.headers.host||'';if(!new RegExp('^(127\\.0\\.0\\.1|localhost):'+PORT+'$').test(host))return json(res,403,{error:'Local access only.'});
 const u=new URL(req.url,'http://'+host);const mutation=!['GET','HEAD','OPTIONS'].includes(req.method);
 if(mutation&&req.headers.origin&&!['http://127.0.0.1:'+PORT,'http://localhost:'+PORT,'http://127.0.0.1:5173','http://localhost:5173'].includes(req.headers.origin))return json(res,403,{error:'This editor accepts requests from your local website only.'});
 if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
 if(u.pathname==='/api/health')return json(res,200,{ok:true,mode:'local'});
 if(u.pathname==='/api/content'){
  if(req.method==='GET')return json(res,200,await state());
  if(req.method!=='PATCH')return json(res,405,{error:'Method not allowed'});
  const raw=await body(req);let value;try{value=JSON.parse(raw)}catch{return json(res,400,{error:'Invalid JSON'})}
  const parsed=saveSchema.safeParse(value);if(!parsed.success)return json(res,400,{error:parsed.error.issues.map(x=>x.message).join(' ')});
  return await serialized(async()=>{const current=await state();const {content,revision,action}=parsed.data;if(revision!==current.revision)return json(res,409,{error:'The content changed in another tab. Reload before saving.'});const next={content,revision:revision+1};await atomic(stateFile,JSON.stringify(next,null,2));if(action==='publish'){const text=JSON.stringify(content,null,2);await atomic(path.join(ROOT,'src/data/content.json'),text);await atomic(path.join(ROOT,'public/content.json'),text);try{await stat(path.join(ROOT,'dist'));await atomic(path.join(ROOT,'dist/content.json'),text)}catch{}}return json(res,200,next)});
 }
 if(u.pathname==='/api/upload'){
  if(req.method!=='POST')return json(res,405,{error:'Method not allowed'});
  const bytes=await body(req,21*1024*1024);const request=new Request('http://localhost/upload',{method:'POST',headers:{'content-type':req.headers['content-type']||''},body:bytes});let form;try{form=await request.formData()}catch{return json(res,400,{error:'Invalid upload'})}const file=form.get('file');if(!file||typeof file==='string')return json(res,400,{error:'Choose an image'});if(file.size>20*1024*1024)return json(res,413,{error:'Maximum image size is 20 MB.'});const data=Buffer.from(await file.arrayBuffer()),extension=imageExtension(data);if(!extension)return json(res,400,{error:'Use a PNG, JPEG, WEBP, GIF or AVIF image.'});const name=randomUUID()+'.'+extension,src='/assets/uploads/'+name;await atomic(path.join(ROOT,'public',src),data);try{await stat(path.join(ROOT,'dist'));await atomic(path.join(ROOT,'dist',src),data)}catch{}return json(res,201,{src});
 }
 if(u.pathname.startsWith('/api/'))return json(res,404,{error:'Unknown API route'});
 if(!['GET','HEAD'].includes(req.method))return json(res,405,{error:'Method not allowed'});
 const base=path.join(ROOT,API_ONLY?'public':'dist');let decoded;try{decoded=decodeURIComponent(u.pathname)}catch{return json(res,400,{error:'Invalid path'})}let file=path.resolve(base,'.'+decoded);if(file!==base&&!file.startsWith(base+path.sep))return json(res,403,{error:'Invalid path'});
 try{const info=await stat(file);if(info.isDirectory()){if(!u.pathname.endsWith('/')){res.writeHead(308,{Location:u.pathname+'/'+u.search});return res.end();}file=path.join(file,'index.html');}await stat(file)}catch{if(!API_ONLY&&!path.extname(file))file=path.join(base,'index.html');else return json(res,404,{error:'File not found'})}
 let data;try{data=await readFile(file)}catch{return json(res,404,{error:'Build the website first with npm run build.'})}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data);
 }catch(e){json(res,e.status||500,{error:e.status?e.message:'Something could not be saved. Please try again.'})}});
server.listen(PORT,'127.0.0.1',()=>console.log(`Creative Storm: http://127.0.0.1:${PORT}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
