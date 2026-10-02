import type * as Three from 'three';

/** Organic, instanced cells and branching filaments. No reference artwork is sampled. */
export function createNeuralScene(T: typeof Three, random: () => number) {
  const group = new T.Group();
  const count = 88;
  const positions: Three.Vector3[] = [];
  const radii: number[] = [];
  const edges: {a: number; b: number; length: number}[] = [];
  const distances = new Array<number>(count).fill(99);
  const uniforms = {uTime: {value: 0}, uPulse: {value: -100}, uOpacity: {value: 0}};

  for (let i = 0; i < count; i++) {
    const side = i % 2 ? -1 : 1;
    const theta = random() * Math.PI * 2;
    const lat = Math.acos(random() * 2 - 1);
    const radius = .52 + random() * .48;
    positions.push(new T.Vector3(
      side * (.24 + Math.abs(Math.sin(lat) * Math.cos(theta)) * 2.1 * radius),
      Math.cos(lat) * 2.35 * radius,
      Math.sin(lat) * Math.sin(theta) * 1.65 * radius,
    ));
    radii.push(i % 11 === 0 ? .13 + random() * .11 : .012 + random() * .021);
  }
  // A few near-field cells provide a focal plane, with smaller synapses behind.
  positions[0].set(.65, .65, 1.75);
  positions[22].set(-1.15, -.6, 1.15);
  positions[44].set(1.5, -1.2, .3);
  positions[66].set(-.7, 1.65, .5);
  positions.forEach((p, a) => {
    const nearby = positions.map((v, b) => ({b, d: p.distanceTo(v)}))
      .filter(v => v.b !== a).sort((x, y) => x.d - y.d).slice(0, 3);
    for (const {b, d} of nearby) if (!edges.some(e => e.a === b && e.b === a)) edges.push({a, b, length: d});
  });

  const cellGeometry = new T.IcosahedronGeometry(1, 3);
  const vertices = cellGeometry.getAttribute('position');
  for (let i = 0; i < vertices.count; i++) {
    const p = new T.Vector3().fromBufferAttribute(vertices, i).normalize();
    const shape = 1 + .13 * Math.sin(p.x * 6 + p.z * 3) * Math.cos(p.y * 7 - p.z * 4)
      + .055 * Math.sin(p.x * 17 + p.y * 11) * Math.cos(p.z * 13);
    p.multiplyScalar(shape); vertices.setXYZ(i, p.x, p.y, p.z);
  }
  // Preserve smooth radial normals on this non-indexed sphere; recomputing would facet every triangle.
  cellGeometry.setAttribute('arrival', new T.InstancedBufferAttribute(new Float32Array(distances), 1));
  const cellMaterial = new T.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false,
    vertexShader: `attribute float arrival; varying vec3 vNormal,vView,vLocal; varying float vArrival;
      void main(){vLocal=position;vArrival=arrival;
      vec4 mv=modelViewMatrix*instanceMatrix*vec4(position,1.);
      vNormal=normalize(normalMatrix*mat3(instanceMatrix)*normal);vView=normalize(-mv.xyz);
      gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform float uTime,uPulse,uOpacity;varying vec3 vNormal,vView,vLocal;varying float vArrival;
      void main(){vec3 n=normalize(vNormal);float facing=max(0.,dot(n,normalize(vView)));
      float rim=pow(1.-facing,2.5);float light=max(0.,dot(n,normalize(vec3(-.4,.8,1.))));
      float pulse=exp(-pow((uTime-uPulse-vArrival*.30)*4.,2.));
      float folds=sin(vLocal.x*19.+sin(vLocal.y*13.)*1.9+sin(vLocal.z*17.));
      float veins=pow(max(0.,1.-abs(folds)),12.);
      float spec=pow(max(0.,dot(reflect(-normalize(vec3(-.4,.8,1.)),n),normalize(vView))),35.);
      vec3 cold=mix(vec3(.018,.06,.085),vec3(.065,.19,.22),light);
      vec3 c=cold+rim*vec3(.26,.57,.70)+spec*vec3(.7,.86,1.);
      c+=veins*vec3(.16,.48,.62)*(.35+pulse*1.8)+pulse*vec3(.18,.26,.4);
      gl_FragColor=vec4(c,uOpacity*(.05+pulse*.65));
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`,
  });
  const cells = new T.InstancedMesh(cellGeometry, cellMaterial, count);
  const dummy = new T.Object3D();
  positions.forEach((p, i) => {
    dummy.position.copy(p);dummy.rotation.set(random()*3,random()*3,random()*3);
    dummy.scale.setScalar(radii[i]);dummy.updateMatrix();cells.setMatrixAt(i,dummy.matrix);
  });
  cells.instanceMatrix.needsUpdate=true;cells.renderOrder=2;group.add(cells);

  const fibrePositions: number[] = [], fibreArrival: number[] = [];
  const fibreMeta: {a:number; b:number; t:number; length:number}[] = [];
  for (const edge of edges) {
    const a=positions[edge.a], b=positions[edge.b];
    for (let strand=0;strand<3;strand++) {
      const bend=new T.Vector3((random()-.5)*.6,(random()-.5)*.7,(random()-.5)*.65);
      const curve=new T.CatmullRomCurve3([a,a.clone().lerp(b,.3).add(bend),a.clone().lerp(b,.68).addScaledVector(bend,-.4),b]);
      const points=curve.getPoints(24);
      for(let j=0;j<24;j++) for(const k of [j,j+1]) {
        fibrePositions.push(...points[k].toArray());fibreArrival.push(99);
        fibreMeta.push({...edge,t:k/24});
      }
    }
  }
  const fibreGeometry=new T.BufferGeometry();
  fibreGeometry.setAttribute('position',new T.Float32BufferAttribute(fibrePositions,3));
  fibreGeometry.setAttribute('arrival',new T.Float32BufferAttribute(fibreArrival,1));
  const fibreMaterial=new T.ShaderMaterial({uniforms,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
    vertexShader:`attribute float arrival;varying float vArrival,vDepth;void main(){vArrival=arrival;vec4 mv=modelViewMatrix*vec4(position,1.);vDepth=-mv.z;gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`uniform float uTime,uPulse,uOpacity;varying float vArrival,vDepth;void main(){float pulse=exp(-pow((uTime-uPulse-vArrival*.30)*5.,2.));float depth=1.-smoothstep(11.,16.,vDepth)*.65;vec3 c=mix(vec3(.10,.31,.38),vec3(.52,.77,1.),pulse);gl_FragColor=vec4(c,(.08+pulse*.92)*uOpacity*depth);}`,
  });
  group.add(new T.LineSegments(fibreGeometry,fibreMaterial));

  // Tapered, forked dendrites give cells organic silhouettes, not ball-and-stick geometry.
  const branchPositions:number[]=[], branchNormals:number[]=[], branchArrival:number[]=[], branchIndices:number[]=[];
  const branchMeta:{cell:number;distance:number}[]=[];
  function branch(cell:number,points:Three.Vector3[],radius:number,offset:number) {
    const curve=new T.CatmullRomCurve3(points), length=curve.getLength();
    const segments=16,sides=5, tube=new T.TubeGeometry(curve,segments,radius,sides,false);
    const p=tube.getAttribute('position'),n=tube.getAttribute('normal'),base=branchPositions.length/3;
    for(let i=0;i<p.count;i++) {
      const t=Math.floor(i/(sides+1))/segments,center=curve.getPointAt(t);
      const v=new T.Vector3().fromBufferAttribute(p,i).sub(center).multiplyScalar(1.-t*.92).add(center);
      branchPositions.push(...v.toArray());branchNormals.push(n.getX(i),n.getY(i),n.getZ(i));branchArrival.push(99);
      branchMeta.push({cell,distance:offset+t*length});
    }
    for(const index of tube.index!.array)branchIndices.push(base+index);
    tube.dispose();
  }
  positions.forEach((p,i)=>{
    if(i%11!==0)return;
    for(let j=0;j<7;j++) {
      const angle=j/7*Math.PI*2+random()*.3;
      const direction=new T.Vector3(Math.cos(angle),Math.sin(angle),(random()-.5)*1.3).normalize();
      const end=p.clone().addScaledVector(direction,.7+random()*.65);
      const bend=p.clone().lerp(end,.48).add(new T.Vector3((random()-.5)*.25,(random()-.5)*.25,.15));
      branch(i,[p,bend,end],radii[i]*.10,0);
      for(let fork=0;fork<2;fork++) {
        const start=bend.clone().lerp(end,.3),finish=end.clone().add(new T.Vector3((random()-.5)*.7,(random()-.5)*.65,(random()-.5)*.6));
        branch(i,[start,end.clone().lerp(finish,.4),finish],radii[i]*.032,p.distanceTo(start));
      }
    }
  });
  const branchGeometry=new T.BufferGeometry();
  branchGeometry.setAttribute('position',new T.Float32BufferAttribute(branchPositions,3));
  branchGeometry.setAttribute('normal',new T.Float32BufferAttribute(branchNormals,3));
  branchGeometry.setAttribute('arrival',new T.Float32BufferAttribute(branchArrival,1));branchGeometry.setIndex(branchIndices);
  const branchMaterial=new T.ShaderMaterial({uniforms,transparent:true,depthWrite:false,
    vertexShader:`attribute float arrival;varying float vArrival,vDepth;varying vec3 vNormal,vView;void main(){vArrival=arrival;vec4 mv=modelViewMatrix*vec4(position,1.);vDepth=-mv.z;vNormal=normalize(normalMatrix*normal);vView=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`uniform float uTime,uPulse,uOpacity;varying float vArrival,vDepth;varying vec3 vNormal,vView;void main(){float rim=pow(1.-abs(dot(normalize(vNormal),normalize(vView))),2.);float pulse=exp(-pow((uTime-uPulse-vArrival*.30)*4.8,2.));float depth=1.-smoothstep(11.,16.,vDepth)*.55;vec3 c=vec3(.07,.19,.23)+rim*vec3(.12,.32,.38)+pulse*vec3(.4,.60,.85);gl_FragColor=vec4(c,uOpacity*depth*(.10+pulse*.9));}`,
  });
  group.add(new T.Mesh(branchGeometry,branchMaterial));

  const glowGeometry=new T.BufferGeometry();
  glowGeometry.setAttribute('position',new T.Float32BufferAttribute(positions.flatMap(p=>p.toArray()),3));
  glowGeometry.setAttribute('arrival',new T.Float32BufferAttribute(distances,1));
  glowGeometry.setAttribute('glowSize',new T.Float32BufferAttribute(radii.map(r=>r*2600),1));
  const glowMaterial=new T.ShaderMaterial({uniforms,transparent:true,depthWrite:false,blending:T.AdditiveBlending,
    vertexShader:`attribute float arrival,glowSize;varying float vArrival,vDepth;void main(){vArrival=arrival;vec4 mv=modelViewMatrix*vec4(position,1.);vDepth=-mv.z;gl_PointSize=clamp(glowSize/(-mv.z),5.,135.);gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`uniform float uTime,uPulse,uOpacity;varying float vArrival,vDepth;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;float pulse=exp(-pow((uTime-uPulse-vArrival*.30)*4.,2.));float glow=exp(-d*d*6.);float core=exp(-d*d*100.);vec3 c=mix(vec3(.16,.48,.65),vec3(.59,.57,1.),pulse);gl_FragColor=vec4(c+core*1.2,glow*(.12+pulse*.88)*uOpacity);}`,
  });
  const glow=new T.Points(glowGeometry,glowMaterial);glow.renderOrder=3;group.add(glow);

  function fire(time:number,index=Math.floor(random()*count)) {
    distances.fill(Infinity);distances[index]=0;
    const visited=new Set<number>();
    while(visited.size<count){let node=-1,min=Infinity;for(let i=0;i<count;i++)if(!visited.has(i)&&distances[i]<min){min=distances[i];node=i;}if(node<0)break;visited.add(node);for(const edge of edges){const other=edge.a===node?edge.b:edge.b===node?edge.a:-1;if(other>=0)distances[other]=Math.min(distances[other],min+edge.length);}}
    const attr=fibreGeometry.getAttribute('arrival');
    fibreMeta.forEach((m,i)=>attr.setX(i,Math.min(distances[m.a]+m.length*m.t,distances[m.b]+m.length*(1-m.t))));attr.needsUpdate=true;
    const ba=branchGeometry.getAttribute('arrival');branchMeta.forEach((m,i)=>ba.setX(i,distances[m.cell]+m.distance));ba.needsUpdate=true;
    for(const geometry of [cellGeometry,glowGeometry]){const a=geometry.getAttribute('arrival');distances.forEach((d,i)=>a.setX(i,d));a.needsUpdate=true;}
    uniforms.uPulse.value=time;
  }
  function update(time:number,opacity:number,pointer:Three.Vector2,mobile:boolean) {
    uniforms.uTime.value=time;uniforms.uOpacity.value=opacity;
    group.rotation.y=.07*Math.sin(time*.08)+pointer.x*.14;group.rotation.x=pointer.y*.07;
    group.position.set(mobile?.65:2.7,Math.sin(time*.15)*.07,0);
    group.scale.setScalar(mobile?.85:1.25);
    group.visible=opacity>.005;
  }
  function pick(ray:Three.Raycaster){group.updateMatrixWorld(true);return ray.intersectObject(cells)[0]?.instanceId;}
  return {group,update,fire,pick};
}
