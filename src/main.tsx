import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import seed from './data/content.json';
import type {Content} from './lib/types';
import {HomeExperience,WorkIndex,ProjectDetail,AboutPage,LabPage,CVPage,SiteHeader,SiteFooter} from './components/portfolio';
import {Atmosphere} from './components/atmosphere';
import {Studio} from './components/studio';
import Link,{BASE,FILE_MODE,currentRoute} from './compat/link';
import './styles.css';import './storm.css';
function prefixAssets(value:unknown):unknown{if(typeof value==='string')return value.startsWith('/assets/')?BASE+value:value;if(Array.isArray(value))return value.map(prefixAssets);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,prefixAssets(v)]));return value;}
function App(){const [path,setPath]=useState(currentRoute),[content,setContent]=useState<Content>(prefixAssets(seed) as Content),[draftError,setDraftError]=useState('');
useEffect(()=>{const route=()=>setPath(currentRoute());window.addEventListener('popstate',route);window.addEventListener('hashchange',route);return()=>{window.removeEventListener('popstate',route);window.removeEventListener('hashchange',route)}},[]);
useEffect(()=>{if(FILE_MODE){if(path==='/studio/preview')setDraftError('Draft previews are available in the local Content Studio.');return;}const controller=new AbortController();const draft=path==='/studio/preview';fetch(draft?'/api/content':BASE+'/content.json',{cache:'no-store',signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Open the local Studio to preview saved drafts.');return r.json();}).then(d=>{setContent(prefixAssets(draft?d.content:d) as Content);setDraftError('');}).catch(e=>{if(draft&&e.name!=='AbortError')setDraftError(e.message)});return()=>controller.abort()},[path==='/studio/preview']);
useEffect(()=>{document.title=(path.startsWith('/work/')?content.projects.find(p=>'/work/'+p.slug===path)?.title:({'/about':'The mind','/lab':'The AI lab','/cv':'Original CV','/cv/alternate':'CV — the considered version','/work':'Selected work','/studio':'Portfolio Studio'} as Record<string,string>)[path]||'The Creative Storm')+' · Nathin Pillay'},[path,content]);
let page:React.ReactNode;
const p=content.projects.find(p=>p.visible&&path==='/work/'+p.slug);
if(path==='/')page=<HomeExperience content={content}/>;
else if(path==='/work')page=<WorkIndex content={content}/>;
else if(p)page=<ProjectDetail key={p.id} content={content} project={p}/>;
else if(path==='/about')page=<AboutPage content={content}/>;
else if(path==='/lab')page=<LabPage content={content}/>;
else if(path==='/cv'&&content.profile.showOriginalCV)page=<CVPage content={content}/>;
else if(path==='/cv/alternate'&&content.profile.showAlternateCV)page=<CVPage content={content} alternate/>;
else if(path==='/studio')page=FILE_MODE?<main id="main" className="studio-gate"><h1>Your local Content Studio.</h1><p>To edit content, open the editable-source download in VS Code, run <code>npm ci</code> and <code>npm run dev</code>, then visit http://127.0.0.1:5173/studio.</p><Link href="/">Back to the portfolio</Link></main>:<Studio/>;
else if(path==='/studio/preview')page=draftError?<div className="studio-gate"><h1>Open your local studio.</h1><p>{draftError}</p><Link href="/">Back to the portfolio</Link></div>:<><div className="draft-preview-label">Saved draft preview</div><HomeExperience content={content}/></>;
else page=<><SiteHeader/><main id="main" className="studio-gate"><p className="eyebrow">LOST IN THE STORM</p><h1>Let’s find<br/>your way back.</h1><Link className="pill-link" href="/work">Explore the work</Link></main><SiteFooter profile={content.profile}/></>;
return <><Atmosphere path={path}/><div className="site-content">{page}</div></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
