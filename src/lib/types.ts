export type Media = { src: string; alt: string; caption?: string };
export type ProjectBlock = { type: 'text'; heading?: string; paragraphs: string[] } | { type: 'gallery'; images: string[]; layout: 'full' | 'grid' } | { type: 'video'; src: string };
export type Project = { id: string; slug: string; title: string; category: 'Brand & design'|'Digital experiences'|'Art'|'AI innovation'; subtitle: string; description: string; cover: string; year: string; services: string[]; gallery: Media[]; blocks?: ProjectBlock[]; paragraphs: string[]; videos: string[]; externalUrl?: string; featured: boolean; visible: boolean };
export type Comparison = { id: string; title: string; before: string; after: string; caption: string };
export type Content = {
  profile: { name: string; headline: string; intro: string; about: string; email: string; phone: string; location: string; portrait: string; originalCV: string; cvPDF?: string; showOriginalCV: boolean; showAlternateCV: boolean };
  projects: Project[];
  brands: { name: string; logo: string }[];
  comparisons: Comparison[];
  ai: { title: string; intro: string; detail: string; printNote: string; hero?: string; heroAlt?: string; gallery?: Media[] };
  cv: { experience: { organisation: string; role: string; dates: string; detail: string }[]; education: { year: string; title: string; institution: string; distinction: boolean }[]; skills: string[]; achievements: string[] };
};
