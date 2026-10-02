import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
export default defineConfig({base:'./',plugins:[react()],resolve:{alias:{'@':fileURLToPath(new URL('./src',import.meta.url)),'next/link':fileURLToPath(new URL('./src/compat/link.tsx',import.meta.url))}},server:{host:'127.0.0.1',port:5173,strictPort:true,proxy:{'/api':'http://127.0.0.1:4174','/assets/uploads':'http://127.0.0.1:4174'}},build:{modulePreload:false,assetsInlineLimit:asset=>asset.endsWith('.woff2')?true:undefined,rolldownOptions:{output:{format:'iife',name:'CreativeStorm',codeSplitting:false}},chunkSizeWarningLimit:1800}});
