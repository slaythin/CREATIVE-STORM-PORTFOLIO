import {useEffect,useRef} from 'react';
import {localURL} from '@/compat/link';
import {useMotion} from '@/lib/motion';

// An art-directed image plate, flowing depth layers and genuine 3D neural geometry.
// This is deliberately a hybrid scene, not a claim of a reconstructed fluid simulation.
export function Atmosphere({path}:{path:string}){
 const host=useRef<HTMLDivElement>(null),pathRef=useRef(path),motionRef=useRef(true);const {motion}=useMotion();
 pathRef.current=path;motionRef.current=motion;
 useEffect(()=>{let cancelled=false,dispose=()=>{};
 import('three').then(T=>{
  if(cancelled||!host.current)return;
  const container=host.current;let renderer:InstanceType<typeof T.WebGLRenderer>;
  try{renderer=new T.WebGLRenderer({antialias:false,alpha:true,powerPreference:'low-power'});}catch{return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
  renderer.domElement.setAttribute('aria-hidden','true');container.appendChild(renderer.domElement);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(42,innerWidth/innerHeight,.1,80);camera.position.set(0,0,12);
  const pointer=new T.Vector2(),ray=new T.Raycaster(),targetPointer=new T.Vector2();
  let time=0,last=0,frame=0,nextFlash=8,pulseAt=-100,flashAt=-100,hoverAt=-100,brainProgress=0,visible=!document.hidden;
  let seed=419;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const texture=new T.TextureLoader().load(localURL('/assets/storm-hero.png'));texture.colorSpace=T.SRGBColorSpace;
  const uniforms={uImage:{value:texture},uTime:{value:0},uPointer:{value:pointer},uResolution:{value:new T.Vector2(innerWidth,innerHeight)},uBrain:{value:0},uFlash:{value:0}};
  const atmosphere=new T.ShaderMaterial({depthWrite:false,depthTest:false,uniforms,
   vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,
   fragmentShader:`uniform sampler2D uImage;uniform float uTime,uBrain,uFlash;uniform vec2 uPointer,uResolution;varying vec2 vUv;
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
   float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=mat2(1.6,-1.2,1.2,1.6)*p+3.4;a*=.5;}return v;}
   void main(){vec2 uv=vUv;float aspect=uResolution.x/uResolution.y;float imageAspect=1.777;vec2 scale=vec2(min(1.,aspect/imageAspect),min(1.,imageAspect/aspect));vec2 pivot=vec2(aspect<1.? .70:.5,.5);uv=(uv-.5)*scale+pivot;
   vec2 center=vec2(.72,.43),d=uv-center;float mask=exp(-dot(d,d)*11.);float wind=fbm(uv*7.+vec2(uTime*.018,-uTime*.014));vec2 flow=vec2(-d.y,d.x)*.012*sin(uTime*.18+wind*3.1)*mask;
   uv+=flow+uPointer*.005*(.25+mask);vec3 plate=texture2D(uImage,clamp(uv,0.,1.)).rgb;
   float mist=fbm(vUv*vec2(4.2,3.4)+vec2(-uTime*.020,uTime*.009));float mistMask=smoothstep(.35,.72,mist)*smoothstep(.55,.02,vUv.y);
   plate+=vec3(.065,.10,.125)*mistMask*.3;plate*=mix(.94,.025,uBrain);
   float lighting=exp(-pow((vUv.x-.85)*2.8,2.)-pow((vUv.y-.60)*2.,2.));plate+=uFlash*lighting*vec3(.17,.30,.43)*(1.-uBrain*.6);
   float veil=mix(.39,1.,smoothstep(.02,.62,vUv.x));plate*=veil;plate*=1.-.23*pow(length(vUv-.5),1.2);gl_FragColor=vec4(plate,1.);
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
   }`});
  const backdrop=new T.Mesh(new T.PlaneGeometry(2,2),atmosphere);backdrop.renderOrder=-10;backdrop.frustumCulled=false;scene.add(backdrop);
  const brain=new T.Group();scene.add(brain);brain.position.x=1.9;
  const positions:InstanceType<typeof T.Vector3>[]=[],cores:InstanceType<typeof T.Mesh>[]=[];
  const count=108,edges:{a:number;b:number;length:number}[]=[],distances=new Array(count).fill(99);
  for(let i=0;i<count;i++){
   const side=i%2?-1:1,theta=random()*Math.PI*2,lat=Math.acos(random()*2-1),r=.6+random()*.4;
   positions.push(new T.Vector3(side*(.42+Math.abs(Math.sin(lat)*Math.cos(theta))*2.5*r),Math.cos(lat)*2.45*r,Math.sin(lat)*Math.sin(theta)*1.9*r));
  }
  const geometry=new T.IcosahedronGeometry(.030,2),materials:InstanceType<typeof T.MeshPhysicalMaterial>[]=[];
  positions.forEach((p,i)=>{const material=new T.MeshPhysicalMaterial({color:0xd6edf4,metalness:.35,roughness:.32,clearcoat:1,emissive:0x529dc9,emissiveIntensity:1.1,transparent:true,opacity:0});const core=new T.Mesh(geometry,material);core.position.copy(p);core.scale.setScalar(i%11===0?4.2+random()*1.5:.55+random()*.85);core.userData.index=i;cores.push(core);materials.push(material);brain.add(core);});
  positions.forEach((p,a)=>{const close=positions.map((v,b)=>({b,d:p.distanceTo(v)})).filter(v=>v.b!==a).sort((x,y)=>x.d-y.d).slice(0,3);for(const {b,d}of close)if(!edges.some(e=>e.a===b&&e.b===a))edges.push({a,b,length:d});});
  const fibres:number[]=[],arrivals:number[]=[],fibreMeta:{a:number;b:number;t:number}[]=[];
  for(const edge of edges){const a=positions[edge.a],b=positions[edge.b];for(let strand=0;strand<3;strand++){
   const control=a.clone().lerp(b,.5).add(new T.Vector3((random()-.5)*.45,(random()-.5)*.65,(random()-.5)*.55));
   const curve=new T.CatmullRomCurve3([a,a.clone().lerp(control,.7),control,b.clone().lerp(control,.7),b]);const points=curve.getPoints(20);
   for(let j=0;j<20;j++)for(const k of [j,j+1]){fibres.push(...points[k].toArray());arrivals.push(99);fibreMeta.push({a:edge.a,b:edge.b,t:k/20});}
  }}
  const fibreGeometry=new T.BufferGeometry();fibreGeometry.setAttribute('position',new T.Float32BufferAttribute(fibres,3));fibreGeometry.setAttribute('arrival',new T.Float32BufferAttribute(arrivals,1));
  const neuralUniforms={uTime:{value:0},uPulse:{value:-100},uOpacity:{value:0}};
  const fibreMaterial=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:neuralUniforms,
   vertexShader:`attribute float arrival;varying float vArrival;varying float vDepth;void main(){vArrival=arrival;vec4 mv=modelViewMatrix*vec4(position,1.);vDepth=-mv.z;gl_Position=projectionMatrix*mv;}`,
   fragmentShader:`uniform float uTime,uPulse,uOpacity;varying float vArrival,vDepth;void main(){float t=uTime-uPulse-vArrival*.30;float pulse=exp(-pow(t*4.4,2.));vec3 color=mix(vec3(.16,.46,.58),vec3(.62,.75,1.),pulse);float alpha=(.44+pulse*.56)*uOpacity;gl_FragColor=vec4(color,alpha);}`});
  const lines=new T.LineSegments(fibreGeometry,fibreMaterial);brain.add(lines);
  const glowGeometry=new T.BufferGeometry();glowGeometry.setAttribute('position',new T.Float32BufferAttribute(positions.flatMap(p=>p.toArray()),3));glowGeometry.setAttribute('arrival',new T.Float32BufferAttribute(distances,1));glowGeometry.setAttribute('glowSize',new T.Float32BufferAttribute(positions.map((_,i)=>i%11===0?850:210),1));
  const glowMaterial=new T.ShaderMaterial({uniforms:neuralUniforms,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
   vertexShader:`attribute float arrival,glowSize;varying float vArrival;varying float vDepth;void main(){vArrival=arrival;vec4 mv=modelViewMatrix*vec4(position,1.);vDepth=-mv.z;gl_PointSize=clamp(glowSize/(-mv.z),10.,110.);gl_Position=projectionMatrix*mv;}`,
   fragmentShader:`uniform float uTime,uPulse,uOpacity;varying float vArrival,vDepth;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;float pulse=exp(-pow((uTime-uPulse-vArrival*.30)*4.,2.));float glow=exp(-d*d*6.);float core=exp(-d*d*65.);vec3 c=mix(vec3(.22,.58,.85),vec3(.7,.55,1.),pulse);gl_FragColor=vec4(c+core*.85,glow*(.75+pulse*.25)*uOpacity);}`});brain.add(new T.Points(glowGeometry,glowMaterial));
  // Very fine suspended particles give the scene true perspective and depth.
  const dustGeometry=new T.BufferGeometry(),dust:number[]=[];for(let i=0;i<220;i++)dust.push((random()-.5)*20,(random()-.5)*13,(random()-.5)*9);
  dustGeometry.setAttribute('position',new T.Float32BufferAttribute(dust,3));const dustMaterial=new T.PointsMaterial({color:0x88bbce,size:.012,transparent:true,opacity:.23,depthWrite:false});const dustCloud=new T.Points(dustGeometry,dustMaterial);scene.add(dustCloud);
  const boltGeometry=new T.BufferGeometry(),boltPositions:number[]=[];
  let bx=5.1,by=4.5;for(let j=0;j<23;j++){const nx=bx+(random()-.5)*.43,ny=by-.35;boltPositions.push(bx,by,-1,nx,ny,-1);if(j===7||j===13){let xx=nx,yy=ny;for(let k=0;k<6;k++){const x2=xx+.14+random()*.21,y2=yy-.18-random()*.15;boltPositions.push(xx,yy,-1,x2,y2,-1);xx=x2;yy=y2;}}bx=nx;by=ny;}
  boltGeometry.setAttribute('position',new T.Float32BufferAttribute(boltPositions,3));const boltMaterial=new T.LineBasicMaterial({color:0xd1eaff,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending});const bolt=new T.LineSegments(boltGeometry,boltMaterial);scene.add(bolt);
  scene.add(new T.AmbientLight(0x778caa,1));const blue=new T.PointLight(0x55baff,25,25),violet=new T.PointLight(0x9570ff,18,20);blue.position.set(-2,3,4);violet.position.set(4,-1,3);scene.add(blue,violet);
  function fire(index=0){if(!motionRef.current)return;distances.fill(Infinity);distances[index]=0;const visited=new Set<number>();while(visited.size<count){let node=-1,min=Infinity;for(let i=0;i<count;i++)if(!visited.has(i)&&distances[i]<min){min=distances[i];node=i;}if(node<0)break;visited.add(node);for(const edge of edges){const other=edge.a===node?edge.b:edge.b===node?edge.a:-1;if(other>=0)distances[other]=Math.min(distances[other],min+edge.length);}}
   const attr=fibreGeometry.getAttribute('arrival');fibreMeta.forEach((m,i)=>attr.setX(i,Math.min(distances[m.a]+positions[m.a].distanceTo(positions[m.b])*m.t,distances[m.b]+positions[m.a].distanceTo(positions[m.b])*(1-m.t))));attr.needsUpdate=true;
   const ga=glowGeometry.getAttribute('arrival');distances.forEach((d,i)=>ga.setX(i,d));ga.needsUpdate=true;pulseAt=time;neuralUniforms.uPulse.value=time;flashAt=time;
  }
  const pointerMove=(e:PointerEvent)=>{targetPointer.set(e.clientX/innerWidth*2-1,1-e.clientY/innerHeight*2);if(brainProgress>.35&&time-hoverAt>1.6&&motionRef.current){ray.setFromCamera(targetPointer,camera);const hit=ray.intersectObjects(cores)[0];if(hit){hoverAt=time;fire(hit.object.userData.index);}}};
  const click=(e:MouseEvent)=>{if((e.target as Element)?.closest('a,button,input,textarea,select,[role="dialog"]'))return;if(brainProgress>.3){ray.setFromCamera(targetPointer,camera);const hit=ray.intersectObjects(cores)[0];fire(hit?hit.object.userData.index:Math.floor(random()*count));}else if(time-flashAt>1.4&&motionRef.current)flashAt=time;};
  const fireThought=()=>fire(Math.floor(random()*count));
  function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();uniforms.uResolution.value.set(innerWidth,innerHeight);}
  function progress(){if(pathRef.current==='/about'||pathRef.current==='/lab')return .92;if(pathRef.current!=='/'&&pathRef.current!=='/studio/preview')return .20;const mind=document.querySelector('[data-neural]');if(!mind)return 0;return Math.max(0,Math.min(.93,(innerHeight-mind.getBoundingClientRect().top)/(innerHeight*.9)));}
  function render(now:number){frame=0;if(cancelled||!visible)return;const dt=Math.min(.035,(now-last)/1000||.016);last=now;const active=motionRef.current&&!pathRef.current.startsWith('/studio');if(active)time+=dt;
   pointer.lerp(active?targetPointer:new T.Vector2(),.035);brainProgress=active?brainProgress+(progress()-brainProgress)*.065:progress();uniforms.uBrain.value=brainProgress;
   if(active&&time>nextFlash){flashAt=time;nextFlash=time+10+random()*12;}
   const f=time-flashAt;const flash=active?Math.exp(-f*5)*Math.max(0,Math.sin(f*23))*.75:0;uniforms.uTime.value=time;uniforms.uFlash.value=flash;boltMaterial.opacity=flash*(1-brainProgress)*1.9;
   document.documentElement.style.setProperty('--storm-light',String(flash*.36));
   neuralUniforms.uOpacity.value=brainProgress;neuralUniforms.uTime.value=time;
   brain.rotation.y=.08*Math.sin(time*.08)+pointer.x*.13;brain.rotation.x=pointer.y*.06;brain.position.x=innerWidth<800?.55:2.0;brain.position.y=Math.sin(time*.15)*.08;brain.scale.setScalar(innerWidth<800?.8:1.06);
   materials.forEach((m,i)=>{const pulse=Math.exp(-Math.pow((time-pulseAt-distances[i]*.30)*4,2));m.opacity=brainProgress;m.emissiveIntensity=1.3+pulse*5;});
   blue.intensity=25+flash*70;violet.intensity=18+Math.max(0,1-(time-pulseAt))*30;dustCloud.rotation.y=time*.007;dustCloud.position.x=pointer.x*.05;dustMaterial.opacity=.15+brainProgress*.08;
   renderer.render(scene,camera);if(active)frame=requestAnimationFrame(render);
  }
  const restart=()=>{if(!frame&&visible){last=performance.now();frame=requestAnimationFrame(render);}};
  const visibility=()=>{visible=!document.hidden;if(!visible){cancelAnimationFrame(frame);frame=0;}else restart();};
  const observer=new MutationObserver(restart);observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  window.addEventListener('pointermove',pointerMove,{passive:true});window.addEventListener('click',click);window.addEventListener('resize',resize);window.addEventListener('scroll',restart,{passive:true});window.addEventListener('popstate',restart);window.addEventListener('storm-fire',fireThought);document.addEventListener('visibilitychange',visibility);
  resize();restart();
  dispose=()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('pointermove',pointerMove);window.removeEventListener('click',click);window.removeEventListener('resize',resize);window.removeEventListener('scroll',restart);window.removeEventListener('popstate',restart);window.removeEventListener('storm-fire',fireThought);document.removeEventListener('visibilitychange',visibility);scene.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.Points||o instanceof T.LineSegments){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}});texture.dispose();renderer.dispose();renderer.domElement.remove();document.documentElement.style.setProperty('--storm-light','0');};
 }).catch(()=>{});return()=>{cancelled=true;dispose();};
 },[]);
 return <div ref={host} className={'atmosphere '+(path.startsWith('/studio')?'atmosphere-hidden':'')} aria-hidden="true" style={{backgroundImage:`url("${localURL('/assets/storm-hero.png')}")`}}><div className="atmosphere-vignette"/></div>;
}
