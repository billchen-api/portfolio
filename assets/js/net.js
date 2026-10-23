/* Topology hero network — verbatim from portfolio-samples-v4/topology */
(()=>{const c=document.getElementById('net'),x=c.getContext('2d');let W,H,D,N=[],E=[],P=[],mx=-1e4,my=-1e4,sent=0;const lab=document.getElementById('pk');
function build(){D=Math.min(devicePixelRatio||1,2);W=c.clientWidth;H=c.clientHeight;c.width=W*D;c.height=H*D;x.setTransform(D,0,0,D,0,0);
 N=[];E=[];P=[];const mob=W<720,cols=mob?6:11,rows=mob?9:7,x0=mob?0:W*.34;
 for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const gx=x0+(W-x0)*(i+.5)/cols,gy=H*(j+.5)/rows;const r=((i*7+j*13)%17)/17;
  N.push({x:gx+(Math.sin(i*3.1+j)*.32)*(W-x0)/cols,y:gy+(Math.cos(j*2.3+i)*.32)*H/rows,bx:0,by:0,hub:r>.82,h:0,ph:r*6.28})}
 N.forEach(n=>{n.bx=n.x;n.by=n.y});
 N.forEach((n,a)=>{N.map((m,b)=>[b,Math.hypot(m.x-n.x,m.y-n.y)]).filter(q=>q[0]!==a).sort((p,q)=>p[1]-q[1]).slice(0,n.hub?4:2).forEach(([b])=>{if(!E.some(e=>(e[0]===a&&e[1]===b)||(e[0]===b&&e[1]===a)))E.push([a,b])})});
 N.forEach(n=>n.adj=[]);E.forEach(([a,b],k)=>{N[a].adj.push(b);N[b].adj.push(a)});}
build();addEventListener('resize',build);
c.parentElement.addEventListener('pointermove',e=>{const b=c.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top});
c.parentElement.addEventListener('pointerleave',()=>{mx=my=-1e4});
function spawn(from){const n=N[from];if(!n.adj.length)return;const to=n.adj[(Math.random()*n.adj.length)|0];P.push({a:from,b:to,t:0,s:.008+Math.random()*.01,hops:3+(Math.random()*4|0),hot:false});}
function near(){let bi=-1,bd=150;N.forEach((n,i)=>{const d=Math.hypot(n.x-mx,n.y-my);if(d<bd){bd=d;bi=i}});return bi}
let last=0,lastNear=-1;
function f(t){x.clearRect(0,0,W,H);const tt=t/1000;
 N.forEach(n=>{const dx=n.bx-mx,dy=n.by-my,d=Math.hypot(dx,dy),k=Math.max(0,1-d/200);n.x=n.bx+Math.sin(tt*.6+n.ph)*2+dx/(d||1)*k*k*16;n.y=n.by+Math.cos(tt*.5+n.ph)*2+dy/(d||1)*k*k*16;n.h+= ((d<160?1:0)-n.h)*.08});
 x.lineWidth=1;E.forEach(([a,b])=>{const A=N[a],B=N[b],h=Math.max(A.h,B.h);x.strokeStyle=`rgba(${20+h*23|0},${40+h*58|0},${90+h*165|0},${.11+h*.35})`;x.beginPath();x.moveTo(A.x,A.y);x.lineTo(B.x,B.y);x.stroke()});
 if(!RM){if(t-last>140&&P.length<70){spawn((Math.random()*N.length)|0);last=t}
  const ni=near();if(ni>=0&&ni!==lastNear){for(let k=0;k<4;k++){spawn(ni);P[P.length-1].hot=true}lastNear=ni}if(ni<0)lastNear=-1}
 P=P.filter(p=>{p.t+=p.s*(p.hot?2.2:1);if(p.t>=1){sent++;if(--p.hops>0){const n=N[p.b];const nx=n.adj.filter(q=>q!==p.a);if(nx.length){p.a=p.b;p.b=nx[(Math.random()*nx.length)|0];p.t=0;return true}}return false}
  const A=N[p.a],B=N[p.b],px=A.x+(B.x-A.x)*p.t,py=A.y+(B.y-A.y)*p.t;
  const tx=A.x+(B.x-A.x)*Math.max(0,p.t-.18),ty=A.y+(B.y-A.y)*Math.max(0,p.t-.18);const g=x.createLinearGradient(tx,ty,px,py);g.addColorStop(0,'rgba(43,98,255,0)');g.addColorStop(1,p.hot?'rgba(43,98,255,.95)':'rgba(43,98,255,.6)');
  x.strokeStyle=g;x.lineWidth=p.hot?2:1.5;x.beginPath();x.moveTo(tx,ty);x.lineTo(px,py);x.stroke();x.fillStyle=p.hot?'#2b62ff':'rgba(43,98,255,.8)';x.beginPath();x.arc(px,py,p.hot?2.6:1.8,0,6.3);x.fill();return true});
 N.forEach(n=>{const r=n.hub?4.5:2.8;x.fillStyle='#fff';x.strokeStyle=n.h>.05?`rgba(43,98,255,${.4+n.h*.6})`:'rgba(20,40,90,.32)';x.lineWidth=1.3;x.beginPath();x.arc(n.x,n.y,r+n.h*1.5,0,6.3);x.fill();x.stroke();
  if(n.hub){x.fillStyle=`rgba(43,98,255,${.25+n.h*.75})`;x.beginPath();x.arc(n.x,n.y,1.8,0,6.3);x.fill();
   if(!RM){const pr=(tt*.5+n.ph)%1;x.strokeStyle=`rgba(43,98,255,${(1-pr)*.25})`;x.beginPath();x.arc(n.x,n.y,r+pr*18,0,6.3);x.stroke()}}});
 if(mx>-9e3){x.strokeStyle='rgba(43,98,255,.35)';x.setLineDash([3,4]);x.beginPath();x.arc(mx,my,22,0,6.3);x.stroke();x.setLineDash([])}
 lab.textContent='Packets '+String(sent%1000).padStart(3,'0');
 if(!RM)requestAnimationFrame(f)}
if(RM){for(let i=0;i<30;i++)spawn(i*3%N.length);P.forEach(p=>p.t=Math.random()*.9)}
requestAnimationFrame(f);})();
