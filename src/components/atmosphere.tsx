import {useEffect,useRef} from 'react';
import * as Three from 'three';
import {localURL} from '@/compat/link';
import {useMotion} from '@/lib/motion';
import {createNeuralScene} from './neural-scene';

// An art-directed image plate, flowing depth layers and genuine 3D neural geometry.
// This is deliberately a hybrid scene, not a claim of a reconstructed fluid simulation.
export function Atmosphere({path}:{path:string}){
 const host=useRef<HTMLDivElement>(null),pathRef=useRef(path),motionRef=useRef(true);const {motion}=useMotion();
 pathRef.current=path;motionRef.current=motion;
 useEffect(()=>{let cancelled=false,dispose=()=>{};
 Promise.resolve(Three).then(T=>{
  if(cancelled||!host.current)return;
  const container=host.current;let renderer:InstanceType<typeof T.WebGLRenderer>;
  try{renderer=new T.WebGLRenderer({antialias:false,alpha:true,powerPreference:'low-power'});}catch{return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  renderer.domElement.setAttribute('aria-hidden','true');container.appendChild(renderer.domElement);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(42,innerWidth/innerHeight,.1,80);camera.position.set(0,0,12);
  const pointer=new T.Vector2(),ray=new T.Raycaster(),targetPointer=new T.Vector2();
  let time=0,last=0,frame=0,nextFlash=5,pulseAt=-100,flashAt=-100,hoverAt=-100,brainProgress=0,visible=!document.hidden;
  let seed=419;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const offlineTextures=(window as Window&{__stormTextures?:Record<string,string>}).__stormTextures;
  const texture=new T.TextureLoader().load(offlineTextures?.storm||localURL('/assets/storm-hero.png'),()=>restart());texture.colorSpace=T.SRGBColorSpace;
  const neuralTexture=new T.TextureLoader().load(offlineTextures?.neural||localURL('/assets/neural-atmosphere.png'),()=>restart());neuralTexture.colorSpace=T.SRGBColorSpace;
  const uniforms={uImage:{value:texture},uNeural:{value:neuralTexture},uPulse:{value:-100},uTime:{value:0},uPointer:{value:pointer},uResolution:{value:new T.Vector2(innerWidth,innerHeight)},uBrain:{value:0},uFlash:{value:0},uScroll:{value:0}};
  const atmosphere=new T.ShaderMaterial({depthWrite:false,depthTest:false,uniforms,
   vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
   fragmentShader:`uniform sampler2D uImage,uNeural;uniform float uTime,uBrain,uFlash,uScroll,uPulse;uniform vec2 uPointer,uResolution;varying vec2 vUv;
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
   float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=mat2(1.6,-1.2,1.2,1.6)*p+3.4;a*=.5;}return v;}
   void main(){vec2 uv=vUv;float aspect=uResolution.x/uResolution.y;float imageAspect=1.777;vec2 scale=vec2(min(1.,aspect/imageAspect),min(1.,imageAspect/aspect));vec2 pivot=vec2(aspect<1.? .70:.5,.5);uv=(uv-.5)*scale+pivot;
   // Keep the approved storm photograph optically stable. Only depth layers move.
   vec3 plate=texture2D(uImage,clamp(uv,0.,1.)).rgb;
   float mist=fbm(vUv*vec2(4.2,3.4)+vec2(-uTime*.020,uTime*.009));float mistMask=smoothstep(.35,.72,mist)*smoothstep(.55,.02,vUv.y);
   plate+=vec3(.065,.10,.125)*mistMask*.3;
   vec2 neuralUv=(vUv-.5)*scale+pivot+uPointer*.011;neuralUv+=vec2(sin(uTime*.08+vUv.y*5.),cos(uTime*.07+vUv.x*4.))*.0018;
   vec3 neural=texture2D(uNeural,clamp(neuralUv,0.,1.)).rgb;
   float age=uTime-uPulse;float wave=exp(-pow((length((vUv-vec2(.74,.52))*vec2(aspect,1.))-age*.20)*21.,2.))*exp(-max(0.,age)*.55);neural+=neural*wave*.55;
   plate=mix(plate*.94,neural*.82,smoothstep(.12,.90,uBrain));
   float lighting=exp(-pow((vUv.x-.85)*2.8,2.)-pow((vUv.y-.60)*2.,2.));plate+=uFlash*lighting*vec3(.17,.30,.43)*(1.-uBrain*.6);
   float veil=mix(.39,1.,smoothstep(.02,.62,vUv.x));plate*=veil;plate*=1.-.23*pow(length(vUv-.5),1.2);gl_FragColor=vec4(plate,1.);
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
   }`});
  const backdrop=new T.Mesh(new T.PlaneGeometry(2,2),atmosphere);backdrop.renderOrder=-10;backdrop.frustumCulled=false;scene.add(backdrop);
  const neural=createNeuralScene(T,random);scene.add(neural.group);
  // Sparse perspective mist layers orbit in front of the photographic funnel.
  // They add real depth without replacing the approved cloud composition.
  const mistGeometry=new T.BufferGeometry(),mistPositions:number[]=[],mistSeeds:number[]=[];
  for(let i=0;i<36;i++){mistPositions.push(random()*Math.PI*2,random(),random());mistSeeds.push(random()*20);}
  mistGeometry.setAttribute('position',new T.Float32BufferAttribute(mistPositions,3));
  mistGeometry.setAttribute('phase',new T.Float32BufferAttribute(mistSeeds,1));
  const mistUniforms={uTime:uniforms.uTime,uBrain:uniforms.uBrain,uFlash:uniforms.uFlash,uPointer:uniforms.uPointer};
  const mistMaterial=new T.ShaderMaterial({uniforms:mistUniforms,transparent:true,depthWrite:false,
   vertexShader:`uniform float uTime;uniform vec2 uPointer;attribute float phase;varying float vPhase,vDepth;
    void main(){float h=position.y;float r=.25+pow(h,1.7)*3.5;float angle=position.x+uTime*(.08+h*.025);vec3 p=vec3(3.8+cos(angle)*r,-2.6+h*6.8,sin(angle)*r*.48+position.z);p.xy+=uPointer*.07;vec4 mv=modelViewMatrix*vec4(p,1.);vPhase=phase;vDepth=-mv.z;gl_PointSize=clamp((1600.+h*2100.)/(-mv.z),40.,350.);gl_Position=projectionMatrix*mv;}`,
   fragmentShader:`uniform float uTime,uBrain,uFlash;varying float vPhase,vDepth;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
    void main(){vec2 p=gl_PointCoord-.5;float d=length(p)*2.;if(d>1.)discard;float n=noise(p*7.+vPhase+vec2(uTime*.04,0.));n+=noise(p*15.-uTime*.025)*.35;float alpha=exp(-d*d*4.)*smoothstep(.1,.8,n)*.085*(1.-uBrain);vec3 c=vec3(.17,.22,.25)+uFlash*vec3(.24,.4,.55);gl_FragColor=vec4(c,alpha);}`
  });
  const mist=new T.Points(mistGeometry,mistMaterial);mist.frustumCulled=false;mist.renderOrder=-2;scene.add(mist);
  // Windborne dust follows rising helices in perspective, with subdued near/far layers.
  const dustGeometry=new T.BufferGeometry(),dust:number[]=[];for(let i=0;i<620;i++)dust.push(random()*Math.PI*2,random(),random());
  dustGeometry.setAttribute('position',new T.Float32BufferAttribute(dust,3));
  const dustMaterial=new T.ShaderMaterial({uniforms:mistUniforms,transparent:true,depthWrite:false,
   vertexShader:`uniform float uTime,uBrain;varying float vAlpha;void main(){float h=fract(position.y+uTime*(.012+position.z*.014));float a=position.x+uTime*(.26+position.z*.22);float r=.7+pow(h,1.5)*4.4+position.z*1.1;vec3 p=vec3(3.5+cos(a)*r,-3.7+h*8.,sin(a)*r*.55+position.z*2.);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((15.+position.z*15.)/(-mv.z),.7,4.);vAlpha=sin(h*3.14159)*(.13+position.z*.23)*(1.-uBrain*.8);}`,
   fragmentShader:`uniform float uFlash;varying float vAlpha;void main(){vec2 p=gl_PointCoord-.5;float a=smoothstep(.5,.08,length(p));gl_FragColor=vec4(vec3(.49,.58,.63)+uFlash*vec3(.35,.43,.5),a*vAlpha);}`
  });const dustCloud=new T.Points(dustGeometry,dustMaterial);dustCloud.frustumCulled=false;scene.add(dustCloud);
  const boltGeometry=new T.BufferGeometry(),boltPositions:number[]=[];
  let bx=5.1,by=4.5;for(let j=0;j<23;j++){const nx=bx+(random()-.5)*.43,ny=by-.35;boltPositions.push(bx,by,-1,nx,ny,-1);if(j===7||j===13){let xx=nx,yy=ny;for(let k=0;k<6;k++){const x2=xx+.14+random()*.21,y2=yy-.18-random()*.15;boltPositions.push(xx,yy,-1,x2,y2,-1);xx=x2;yy=y2;}}bx=nx;by=ny;}
  boltGeometry.setAttribute('position',new T.Float32BufferAttribute(boltPositions,3));const boltMaterial=new T.LineBasicMaterial({color:0xd1eaff,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending});const bolt=new T.LineSegments(boltGeometry,boltMaterial);scene.add(bolt);
  scene.add(new T.AmbientLight(0x778caa,1));const blue=new T.PointLight(0x55baff,25,25),violet=new T.PointLight(0x9570ff,18,20);blue.position.set(-2,3,4);violet.position.set(4,-1,3);scene.add(blue,violet);
  function fire(index?:number){if(!motionRef.current)return;neural.fire(time,index);pulseAt=time;uniforms.uPulse.value=time;}
  const pointerMove=(e:PointerEvent)=>{targetPointer.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);if(brainProgress>.35&&time-hoverAt>1.6&&motionRef.current){ray.setFromCamera(targetPointer,camera);const hit=neural.pick(ray);if(hit!==undefined){hoverAt=time;fire(hit);}}};
  const click=(e:MouseEvent)=>{if((e.target as Element)?.closest('a,button,input,textarea,select,[role="dialog"]'))return;targetPointer.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);if(brainProgress>.3){ray.setFromCamera(targetPointer,camera);fire(neural.pick(ray));}else if(time-flashAt>1.4&&motionRef.current)flashAt=time;};
  const fireThought=()=>fire();
  function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();uniforms.uResolution.value.set(innerWidth,innerHeight);}
  function progress(){if(pathRef.current==='/about'||pathRef.current==='/lab')return .92;if(pathRef.current!=='/'&&pathRef.current!=='/studio/preview')return .20;const mind=document.querySelector('[data-neural]');if(!mind)return 0;return Math.max(0,Math.min(.93,(innerHeight-mind.getBoundingClientRect().top)/(innerHeight*.9)));}
  function render(now:number){frame=0;if(cancelled||!visible)return;const dt=Math.min(.035,(now-last)/1000||.016);last=now;const active=motionRef.current&&!pathRef.current.startsWith('/studio');if(active)time+=dt;
   pointer.lerp(active?targetPointer:new T.Vector2(),.035);brainProgress=active?brainProgress+(progress()-brainProgress)*.065:progress();uniforms.uBrain.value=brainProgress;
   if(active&&time>nextFlash){flashAt=time;nextFlash=time+6+random()*8;bolt.position.x=(random()-.5)*2.6;bolt.scale.x=random()>.5?1:-1;}
   const f=time-flashAt;const flash=active?Math.exp(-f*5)*Math.max(0,Math.sin(f*23))*.75:0;uniforms.uScroll.value=Math.min(1,scrollY/innerHeight);uniforms.uTime.value=time;uniforms.uFlash.value=flash;boltMaterial.opacity=flash*(1-brainProgress)*1.9;
   document.documentElement.style.setProperty('--storm-light',String(flash*.36));
   neural.update(time,brainProgress,pointer,innerWidth<800);
   blue.intensity=25+flash*70;violet.intensity=18+Math.max(0,1-(time-pulseAt))*30;
   renderer.render(scene,camera);if(active)frame=requestAnimationFrame(render);
  }
  const restart=()=>{if(!frame&&visible){last=performance.now();frame=requestAnimationFrame(render);}};
  const onResize=()=>{resize();restart();};
  const visibility=()=>{visible=!document.hidden;if(!visible){cancelAnimationFrame(frame);frame=0;}else restart();};
  const observer=new MutationObserver(restart);observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  window.addEventListener('pointermove',pointerMove,{passive:true});window.addEventListener('click',click);window.addEventListener('resize',onResize);window.addEventListener('scroll',restart,{passive:true});window.addEventListener('popstate',restart);window.addEventListener('storm-fire',fireThought);document.addEventListener('visibilitychange',visibility);
  resize();restart();
  dispose=()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('pointermove',pointerMove);window.removeEventListener('click',click);window.removeEventListener('resize',onResize);window.removeEventListener('scroll',restart);window.removeEventListener('popstate',restart);window.removeEventListener('storm-fire',fireThought);document.removeEventListener('visibilitychange',visibility);scene.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.Points||o instanceof T.LineSegments){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}});texture.dispose();neuralTexture.dispose();renderer.dispose();renderer.domElement.remove();document.documentElement.style.setProperty('--storm-light','0');};
 }).catch(()=>{});return()=>{cancelled=true;dispose();};
 },[]);
 return <div ref={host} className={'atmosphere '+(path.startsWith('/studio')?'atmosphere-hidden':'')} aria-hidden="true" style={{backgroundImage:`url("${localURL('/assets/storm-hero.png')}")`}}><div className="atmosphere-vignette"/></div>;
}
