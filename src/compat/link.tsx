import {forwardRef,type AnchorHTMLAttributes} from 'react';
// Each generated HTML route declares its path back to the site's root.
export const FILE_MODE=location.protocol==='file:';
const rootURL=new URL(document.querySelector<HTMLMetaElement>('meta[name="creative-storm-root"]')?.content||'./',location.href);
export const BASE=import.meta.env.DEV?'':(FILE_MODE?rootURL.href:rootURL.pathname).replace(/\/$/,'');
export function localURL(path:string){return path.startsWith('/')&&!path.startsWith('//')?BASE+path:path;}
export function currentRoute(){if(FILE_MODE&&location.hash.startsWith('#/'))return location.hash.slice(1).replace(/\/$/,'')||'/';const p=location.pathname,base=FILE_MODE?rootURL.pathname.replace(/\/$/,''):BASE;return (p.startsWith(base)?p.slice(base.length):p).replace(/\/index\.html$/,'').replace(/\/$/,'')||'/';}
const Link=forwardRef<HTMLAnchorElement,AnchorHTMLAttributes<HTMLAnchorElement>>(({href='',onClick,...props},ref)=><a {...props} ref={ref} href={FILE_MODE&&href.startsWith('/')&&!href.startsWith('//')?'#'+href:localURL(href)} onClick={e=>{onClick?.(e);if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||props.target||props.download||!href.startsWith('/')||href.startsWith('//'))return;e.preventDefault();history.pushState(null,'',FILE_MODE?'#'+href:localURL(href));window.dispatchEvent(new PopStateEvent('popstate'));window.scrollTo({top:0,behavior:'instant'});}}/>);
Link.displayName='Link';export default Link;
