import { z } from 'zod';
const text=z.string().max(15000),short=z.string().max(300);
const url=z.string().max(2500).refine(s=>!s||s.startsWith('/assets/')||s.startsWith('/api/media/')||/^https:\/\//.test(s),'Use a secure image URL or uploaded asset.');
const link=z.string().max(2500).refine(s=>!s||/^https?:\/\//.test(s),'Use a full http or https URL.');
const media=z.object({src:url,alt:short,caption:short.optional()});
const block=z.discriminatedUnion('type',[z.object({type:z.literal('text'),heading:short.optional(),paragraphs:z.array(text).max(100)}),z.object({type:z.literal('gallery'),images:z.array(url).max(250),layout:z.enum(['full','grid'])}),z.object({type:z.literal('video'),src:z.string().refine(v=>/^https:\/\/(www-ccv\.adobe\.io|www\.youtube\.com|player\.vimeo\.com)\//.test(v))})]);
export const contentSchema=z.object({
 profile:z.object({name:short,headline:short,intro:text,about:text,email:z.string().email(),phone:short,location:short,portrait:url,originalCV:url,showOriginalCV:z.boolean(),showAlternateCV:z.boolean()}),
 projects:z.array(z.object({id:short.min(1),slug:z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),title:short.min(1),category:z.enum(['Brand & design','Digital experiences','Art','AI innovation']),subtitle:short,description:text,cover:url,year:short,services:z.array(short).max(30),gallery:z.array(media).max(250),blocks:z.array(block).max(300).optional(),paragraphs:z.array(text).max(100),videos:z.array(z.string().refine(v=>/^https:\/\/(www-ccv\.adobe\.io|www\.youtube\.com|player\.vimeo\.com)\//.test(v),'Video must be an Adobe, YouTube or Vimeo embed.')).max(30),externalUrl:link.optional(),featured:z.boolean(),visible:z.boolean()})).max(100).refine(a=>new Set(a.map(p=>p.slug)).size===a.length,'Each project needs a unique URL slug.').refine(a=>new Set(a.map(p=>p.id)).size===a.length,'Each project needs a unique ID.'),
 brands:z.array(z.object({name:short,logo:url})).max(50),comparisons:z.array(z.object({id:short,title:short,before:url,after:url,caption:text})).max(50),
 ai:z.object({title:short,intro:text,detail:text,printNote:text,hero:url.optional(),heroAlt:short.optional(),gallery:z.array(media).max(250).optional()}),
 cv:z.object({experience:z.array(z.object({organisation:short,role:short,dates:short,detail:text})).max(50),education:z.array(z.object({year:short,title:short,institution:short,distinction:z.boolean()})).max(50),skills:z.array(short).max(100),achievements:z.array(text).max(50)})
});
export const saveSchema=z.object({content:contentSchema,revision:z.number().int().nonnegative(),action:z.enum(['save','publish'])});
