import {forwardRef,type AnchorHTMLAttributes} from 'react';
// The build always places JS in assets/, including on a GitHub project subpath.
export const BASE=import.meta.env.DEV?'':new URL('../',import.meta.url).pathname.replace(/\/$/,'');
export function localURL(path:string){return path.startsWith('/')&&!path.startsWith('//')?BASE+path:path;}
export function currentRoute(){const p=location.pathname;return (p.startsWith(BASE)?p.slice(BASE.length):p).replace(/\/index\.html$/,'').replace(/\/$/,'')||'/';}
const Link=forwardRef<HTMLAnchorElement,AnchorHTMLAttributes<HTMLAnchorElement>>(({href='',onClick,...props},ref)=><a {...props} ref={ref} href={localURL(href)} onClick={e=>{onClick?.(e);if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||props.target||props.download||!href.startsWith('/')||href.startsWith('//'))return;e.preventDefault();history.pushState(null,'',localURL(href));window.dispatchEvent(new PopStateEvent('popstate'));window.scrollTo({top:0,behavior:'instant'});}}/>);
Link.displayName='Link';export default Link;
