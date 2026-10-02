const {spawn}=require('node:child_process');const fs=require('node:fs/promises');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
(async()=>{const server=spawn(process.execPath,['server/index.mjs'],{stdio:['ignore','pipe','inherit'],env:{...process.env,PORT:'4187'}});await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject)});
let browser;try{let launch={headless:true};if(process.env.CHROMIUM_PACKAGE){const chrome=require(process.env.CHROMIUM_PACKAGE);launch={...launch,executablePath:process.env.CHROMIUM_EXECUTABLE||await chrome.executablePath(),args:[...chrome.args,'--enable-unsafe-swiftshader']};}
browser=await chromium.launch(launch);const page=await browser.newPage({viewport:{width:1440,height:960},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await fs.mkdir('test-results',{recursive:true});
await page.goto('http://127.0.0.1:4187/');await page.waitForTimeout(2600);await page.screenshot({path:'test-results/01-home-desktop.png'});
await page.evaluate(()=>scrollTo(0,Math.round(innerHeight*1.62)));await page.waitForTimeout(900);await page.screenshot({path:'test-results/02-work-grid.png'});
await page.goto('http://127.0.0.1:4187/about/');await page.waitForTimeout(2100);await page.screenshot({path:'test-results/03-neural-about.png'});
await page.goto('http://127.0.0.1:4187/work/build-it/');await page.waitForTimeout(800);await page.screenshot({path:'test-results/04-project.png'});
await page.goto('http://127.0.0.1:4187/cv/alternate/');await page.waitForTimeout(600);await page.screenshot({path:'test-results/05-cv.png',fullPage:true});
await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4187/');await page.waitForTimeout(1800);await page.screenshot({path:'test-results/06-home-mobile.png'});const mobile=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
await fs.writeFile('test-results/browser-findings.json',JSON.stringify({errors,mobile},null,2));console.log(JSON.stringify({errors,mobile}));
}finally{await browser?.close();server.kill('SIGTERM');}})().catch(e=>{console.error(e);process.exitCode=1});
