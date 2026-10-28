/* Shared: page transition (packets converge / expand), reveals, nav, progress, process rail, parallax */
(()=>{const RM=window.RM,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
if(RM)$$('svg').forEach(s=>s.pauseAnimations&&s.pauseAnimations());
/* ---------- page transition ---------- */
const pt=$('.pt'),pc=pt&&pt.querySelector('canvas'),px=pc&&pc.getContext('2d'),lbl=pt&&pt.querySelector('.lbl');
let W,H;function size(){const D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;pc.width=W*D;pc.height=H*D;px.setTransform(D,0,0,D,0,0)}
const eio=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,eo=t=>1-Math.pow(1-t,3),cl=t=>Math.max(0,Math.min(1,t));
/* per-case transitions: 'cart' (Marketplace: item drops into a cart, order confirmed) and 'flow' (Data Broker: traffic routes into a node) */
const COL={cart:[43,98,255],flow:[8,82,114],pulse:[5,105,192]};
const rgba=(c,a)=>`rgba(${c[0]},${c[1]},${c[2]},${a})`;
function cartIcon(x,y,s,c,a,chk){px.save();px.translate(x,y);px.scale(s,s);px.globalAlpha=a;
 px.fillStyle='#fff';px.beginPath();px.arc(0,0,46,0,6.3);px.fill();px.strokeStyle=rgba(c,.18);px.lineWidth=1;px.stroke();
 px.strokeStyle=rgba(c,1);px.lineWidth=2.2;px.lineJoin='round';px.lineCap='round';px.beginPath();px.moveTo(-23,-15);px.lineTo(-16,-15);px.lineTo(-10,9);px.lineTo(15,9);px.lineTo(20,-8);px.lineTo(-13.5,-8);px.stroke();
 px.beginPath();px.arc(-6,16,2.6,0,6.3);px.arc(12,16,2.6,0,6.3);px.fillStyle=rgba(c,1);px.fill();
 if(chk>0){const k=eo(cl(chk));px.fillStyle=rgba(c,1);px.beginPath();px.arc(21,-20,10*Math.min(1,k*1.6),0,6.3);px.fill();
  const q=cl((chk-.3)/.7);if(q>0){px.strokeStyle='#fff';px.lineWidth=2;px.beginPath();px.moveTo(16.5,-20);const m=Math.min(q*2,1);px.lineTo(16.5+3.2*m,-20+3.2*m);if(q>.5){const r=(q-.5)*2;px.lineTo(19.7+5.6*r,-16.8-7*r)}px.stroke()}}
 px.restore()}
function runCart(mode,ox,oy,dur,done){const c=COL.cart,cx=W/2,cy=H/2,R=Math.hypot(W,H)/2+20,t0=performance.now();
 (function f(now){const t=cl((now-t0)/dur);px.clearRect(0,0,W,H);
  if(mode==='in'){const a=eo(cl(t/.3));px.fillStyle=`rgba(251,252,253,${.55*a})`;px.fillRect(0,0,W,H);
   const bump=t>.5&&t<.68?Math.sin((t-.5)/.18*Math.PI)*.08:0;cartIcon(cx,cy,(.85+.15*a)+bump,c,a,cl((t-.52)/.22));
   const q=eio(cl(t/.52));if(q<1){const qx=ox+(cx+2-ox)*q,qy=(1-q)*(1-q)*oy+2*(1-q)*q*(Math.min(oy,cy)-170)+q*q*(cy-14),sz=1-.45*q;
    px.save();px.translate(qx,qy);px.rotate((1-q)*-.35);px.scale(sz,sz);px.fillStyle=rgba(c,1);px.beginPath();px.roundRect(-14,-11,28,22,5);px.fill();
    px.fillStyle='rgba(255,255,255,.9)';px.fillRect(-8,-4,16,2);px.fillRect(-8,1,10,2);px.restore()}
   const r=R*eio(cl((t-.66)/.34));if(r>0){px.fillStyle='#fbfcfd';px.beginPath();px.arc(cx,cy,r,0,6.3);px.fill();px.strokeStyle=rgba(c,.35*(1-t));px.lineWidth=1.2;px.stroke()}
   if(t>.7)pt.classList.add('show');
  }else{px.fillStyle='#fbfcfd';px.fillRect(0,0,W,H);const r=R*eio(cl((t-.18)/.82));
   px.globalCompositeOperation='destination-out';px.beginPath();px.arc(cx,cy,r,0,6.3);px.fill();px.globalCompositeOperation='source-over';
   if(r>0){px.strokeStyle=rgba(c,.35*(1-t));px.lineWidth=1.2;px.beginPath();px.arc(cx,cy,r,0,6.3);px.stroke()}
   const a=1-cl((t-.05)/.35);if(a>0)cartIcon(cx,cy,1+.15*(1-a),c,a,1);if(t>.1)pt.classList.remove('show')}
  if(t<1)requestAnimationFrame(f);else done&&done()})(t0)}
function runFlow(mode,ox,oy,dur,done){const c=COL.flow,cx=W/2,cy=H/2,R=Math.hypot(W,H)/2+20,t0=performance.now(),N=7,gap=Math.min(46,H/12);
 const lane=(k,u,out)=>{const y=cy+(k-(N-1)/2)*gap,x0=out?W+20:-20,x1=out?cx+Math.min(260,W*.28):cx-Math.min(260,W*.28),sp=.55;
  if(u<sp){const v=u/sp;return[x0+(x1-x0)*v,y]}const v=(u-sp)/(1-sp),m=1-v;const bx=(x1+cx)/2;
  return[m*m*m*x1+3*m*m*v*bx+3*m*v*v*bx+v*v*v*cx,m*m*m*y+3*m*m*v*y+3*m*v*v*cy+v*v*v*cy]};
 const pk=Array.from({length:N*3},(_,i)=>({k:i%N,o:Math.floor(i/N)*.16+(i%N)*.025}));
 function lanes(a,out,upto){px.strokeStyle=rgba(c,.16*a);px.lineWidth=1.2;for(let k=0;k<N;k++){px.beginPath();for(let j=0;j<=40;j++){const u=j/40*upto,[x,y]=lane(k,u,out);j?px.lineTo(x,y):px.moveTo(x,y)}px.stroke()}}
 function dots(q,a,out){pk.forEach(p=>{const u=cl((q-p.o)/.5);if(u<=0||u>=1)return;const u2=out?u:u;const[x,y]=lane(p.k,u2,out),[x2,y2]=lane(p.k,Math.max(0,u2-.08),out);
  const g=px.createLinearGradient(x2,y2,x,y);g.addColorStop(0,rgba(c,0));g.addColorStop(1,rgba(c,.9*a));px.strokeStyle=g;px.lineWidth=2;px.beginPath();px.moveTo(x2,y2);px.lineTo(x,y);px.stroke();px.fillStyle=rgba(c,a);px.beginPath();px.arc(x,y,2.4,0,6.3);px.fill()})}
 function hub(s,a){px.globalAlpha=a;px.fillStyle='#fff';px.strokeStyle=rgba(c,1);px.lineWidth=1.6;px.beginPath();px.arc(cx,cy,13*s,0,6.3);px.fill();px.stroke();px.fillStyle=rgba(c,1);px.beginPath();px.arc(cx,cy,5.5*s,0,6.3);px.fill();px.globalAlpha=1}
 (function f(now){const t=cl((now-t0)/dur);px.clearRect(0,0,W,H);
  if(mode==='in'){const a=eo(cl(t/.3));px.fillStyle=`rgba(251,252,253,${.55*a})`;px.fillRect(0,0,W,H);lanes(a,false,eo(cl(t/.35)));dots(eio(cl(t/.7))*1.1,a,false);hub(.7+.3*eo(cl((t-.3)/.3)),a);
   const r=R*eio(cl((t-.64)/.36));if(r>0){px.fillStyle='#fbfcfd';px.beginPath();px.arc(cx,cy,r,0,6.3);px.fill();px.strokeStyle=rgba(c,.35*(1-t));px.lineWidth=1.2;px.stroke()}
   if(t>.7)pt.classList.add('show');
  }else{px.fillStyle='#fbfcfd';px.fillRect(0,0,W,H);const r=R*eio(cl((t-.12)/.88));
   px.globalCompositeOperation='destination-out';px.beginPath();px.arc(cx,cy,r,0,6.3);px.fill();px.globalCompositeOperation='source-over';
   if(r>0){px.strokeStyle=rgba(c,.35*(1-t));px.lineWidth=1.2;px.beginPath();px.arc(cx,cy,r,0,6.3);px.stroke()}
   const a=1-cl((t-.35)/.65);lanes(a,true,1);dots(1.1-eo(t)*1.1,a,true);hub(1,1-cl(t/.4));if(t>.1)pt.classList.remove('show')}
  if(t<1)requestAnimationFrame(f);else done&&done()})(t0)}
function runPulse(mode,ox,oy,dur,done){const c=COL.pulse,cx=W/2,cy=H/2,R=Math.hypot(W,H)/2+20,t0=performance.now(),N=9,L=Math.min(560,W*.78),x0=cx-L/2;
 const sz=[.5,.8,.45,1,.6,.9,.5,.7,1],dx=k=>x0+L*k/(N-1);
 function strip(a,q){px.globalAlpha=a;px.strokeStyle=rgba(c,.22);px.lineWidth=1.4;px.beginPath();px.moveTo(x0-24,cy);px.lineTo(x0-24+(L+48)*eo(cl(q*1.6)),cy);px.stroke();
  for(let k=0;k<N;k++){const u=cl((q-.12-k*.06)/.22);if(u<=0)continue;const last=k===N-1,r=(last?9:3+5*sz[k])*eo(u);
   px.fillStyle=last?rgba(c,1):'rgba(225,45,85,'+(.55+.35*sz[k])+')';px.beginPath();px.arc(dx(k),cy,r,0,6.3);px.fill();
   if(last){px.strokeStyle=rgba(c,.5*(1-cl((q-.75)/.25)));px.lineWidth=1.2;px.beginPath();px.arc(dx(k),cy,r+6+18*cl((q-.62)/.38),0,6.3);px.stroke();
    const m=cl((q-.6)/.2);if(m>0){px.strokeStyle='#fff';px.lineWidth=2;px.lineCap='round';px.beginPath();px.moveTo(dx(k)-3.6,cy);const a1=Math.min(m*2,1);px.lineTo(dx(k)-3.6+2.6*a1,cy+2.6*a1);if(m>.5){const b=(m-.5)*2;px.lineTo(dx(k)-1+5*b,cy+2.6-6*b)}px.stroke()}}}
  px.globalAlpha=1}
 (function f(now){const t=cl((now-t0)/dur);px.clearRect(0,0,W,H);
  if(mode==='in'){const a=eo(cl(t/.3));px.fillStyle=`rgba(251,252,253,${.6*a})`;px.fillRect(0,0,W,H);strip(a,cl(t/.7));
   const r=R*eio(cl((t-.66)/.34));if(r>0){const ex=dx(N-1);px.fillStyle='#fbfcfd';px.beginPath();px.arc(ex,cy,r*1.4,0,6.3);px.fill();px.strokeStyle=rgba(c,.35*(1-t));px.lineWidth=1.2;px.stroke()}
   if(t>.7)pt.classList.add('show');
  }else{px.fillStyle='#fbfcfd';px.fillRect(0,0,W,H);const r=R*eio(cl((t-.15)/.85));
   px.globalCompositeOperation='destination-out';px.beginPath();px.arc(cx,cy,r,0,6.3);px.fill();px.globalCompositeOperation='source-over';
   if(r>0){px.strokeStyle=rgba(c,.35*(1-t));px.lineWidth=1.2;px.beginPath();px.arc(cx,cy,r,0,6.3);px.stroke()}
   const a=1-cl(t/.4);if(a>0)strip(a,1);if(t>.1)pt.classList.remove('show')}
  if(t<1)requestAnimationFrame(f);else done&&done()})(t0)}
function run(mode,ox,oy,dur,done,kind){size();pt.classList.remove('off');pt.classList.add('run');
 if(kind==='cart')return runCart(mode,ox,oy,dur,done);if(kind==='flow')return runFlow(mode,ox,oy,dur,done);if(kind==='pulse')return runPulse(mode,ox,oy,dur,done);
 const R=Math.hypot(Math.max(ox,W-ox),Math.max(oy,H-oy))+20;
 const ps=Array.from({length:110},(_,i)=>{const a=i/110*6.283+Math.random()*.2;return{a,d:R*(.35+Math.random()*.75),s:.55+Math.random()*.45,o:Math.random()*.25}});
 const t0=performance.now();
 (function f(now){const t=cl((now-t0)/dur);px.clearRect(0,0,W,H);
  if(mode==='in'){ // leaving: packets converge on the click point, then the node floods the screen
   const k=eio(cl(t/.7));
   ps.forEach(p=>{const q=cl((k-p.o)/(1-p.o)/p.s);const r=p.d*(1-q);if(q<=0||q>=1)return;
    const cx=ox+Math.cos(p.a)*r,cy=oy+Math.sin(p.a)*r,tr=Math.min(r,60+p.d*.08),tx=ox+Math.cos(p.a)*(r+tr),ty=oy+Math.sin(p.a)*(r+tr);
    px.strokeStyle='rgba(20,40,90,.05)';px.lineWidth=1;px.beginPath();px.moveTo(ox,oy);px.lineTo(cx,cy);px.stroke();
    const g=px.createLinearGradient(tx,ty,cx,cy);g.addColorStop(0,'rgba(43,98,255,0)');g.addColorStop(1,'rgba(43,98,255,.85)');
    px.strokeStyle=g;px.lineWidth=1.6;px.beginPath();px.moveTo(tx,ty);px.lineTo(cx,cy);px.stroke();px.fillStyle='#2b62ff';px.beginPath();px.arc(cx,cy,2,0,6.3);px.fill()});
   const hub=6+eo(cl(t/.6))*6;px.fillStyle='#2b62ff';px.beginPath();px.arc(ox,oy,hub,0,6.3);px.fill();
   const c=R*eio(cl((t-.5)/.5));if(c>0){px.fillStyle='#fbfcfd';px.beginPath();px.arc(ox,oy,c,0,6.3);px.fill();px.strokeStyle=`rgba(43,98,255,${.5*(1-t)})`;px.lineWidth=1.2;px.beginPath();px.arc(ox,oy,c,0,6.3);px.stroke()}
   if(t>.62)pt.classList.add('show');
  }else{ // entering: cover opens from the node outward while packets burst out
   px.fillStyle='#fbfcfd';px.fillRect(0,0,W,H);const h=R*eio(cl((t-.08)/.92));
   px.globalCompositeOperation='destination-out';px.beginPath();px.arc(ox,oy,h,0,6.3);px.fill();px.globalCompositeOperation='source-over';
   if(h>0){px.strokeStyle=`rgba(43,98,255,${.45*(1-t)})`;px.lineWidth=1.2;px.beginPath();px.arc(ox,oy,h,0,6.3);px.stroke()}
   const k=eo(t);ps.forEach(p=>{const q=cl((k-p.o*.5)/p.s);if(q<=0||q>=1)return;const r=p.d*q*1.1,cx=ox+Math.cos(p.a)*r,cy=oy+Math.sin(p.a)*r,tr=Math.min(r,50),tx=ox+Math.cos(p.a)*(r-tr),ty=oy+Math.sin(p.a)*(r-tr);
    const g=px.createLinearGradient(tx,ty,cx,cy);g.addColorStop(0,'rgba(43,98,255,0)');g.addColorStop(1,`rgba(43,98,255,${.85*(1-q)})`);px.strokeStyle=g;px.lineWidth=1.6;px.beginPath();px.moveTo(tx,ty);px.lineTo(cx,cy);px.stroke()});
   const hub=12*(1-eo(cl(t/.5)));if(hub>.3){px.fillStyle='#2b62ff';px.beginPath();px.arc(ox,oy,hub,0,6.3);px.fill()}
   if(t>.15)pt.classList.remove('show');
  }
  if(t<1)requestAnimationFrame(f);else done&&done()})(t0);}
function enter(){if(!pt)return;if(RM){pt.classList.add('off');return}
 let s={};try{s=JSON.parse(sessionStorage.getItem('bc-pt')||'{}');sessionStorage.removeItem('bc-pt')}catch(e){}
 if(lbl&&s.l){lbl.textContent=s.l;pt.classList.add('show')}
 const ox=(s.x??.5)*innerWidth,oy=(s.y??.5)*innerHeight;
 const k=s.k,D=k?540:(s.l?950:800);setTimeout(()=>run('out',ox,oy,D,()=>{pt.classList.add('off');pt.classList.remove('run','show')},k),k?60:(s.l?140:0))}
enter();setTimeout(()=>pt&&pt.classList.contains('run')===false&&!pt.classList.contains('off')&&pt.classList.add('off'),2500);
addEventListener('pageshow',e=>{if(e.persisted&&pt){pt.classList.add('off');pt.classList.remove('run','show')}});
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||RM||!pt)return;const href=a.getAttribute('href');
 if(!href||href.startsWith('#')||a.hasAttribute('data-contact')||a.target==='_blank'||e.metaKey||e.ctrlKey||e.shiftKey||e.button||/^(mailto:|tel:|https?:)/.test(href))return;
 const cur=location.pathname.split('/').pop()||'index.html',dest=href.split('#')[0];if(dest===cur&&href.includes('#'))return;
 e.preventDefault();const ox=e.clientX||innerWidth/2,oy=e.clientY||innerHeight/2,l=a.dataset.label||'Loading',k=a.dataset.pt||'';
 if(lbl)lbl.textContent=l;try{sessionStorage.setItem('bc-pt',JSON.stringify({x:ox/innerWidth,y:oy/innerHeight,l,k}))}catch(_){}
 run('in',ox,oy,k?660:820,()=>location.href=href,k)});
/* ---------- reveals ---------- */
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
$$('.rv').forEach(el=>io.observe(el));
$$('.case .vis').forEach(v=>{$$('.e',v).forEach((e,j)=>e.style.setProperty('--j',j));$$('.n',v).forEach((e,j)=>e.style.setProperty('--j',j))});
$$('.caps div').forEach((d,k)=>d.style.setProperty('--k',k));
/* ---------- scroll: nav hide, progress, process rail, parallax ---------- */
const nav=$('nav'),prog=$('.prog'),rail=$('.steps'),steps=$$('.step'),par=$$('[data-par]');let ly=scrollY,tk=false;
function sc(){const y=scrollY,vh=innerHeight;
 if(nav){nav.classList.toggle('hide',y>ly&&y>500&&!RM);ly=y}
 if(prog)prog.style.setProperty('--p',cl(y/(document.documentElement.scrollHeight-vh)).toFixed(4));
 if(rail){const b=rail.getBoundingClientRect();rail.style.setProperty('--sp',cl((vh*.6-b.top)/(b.height-56)).toFixed(4));steps.forEach(s=>s.classList.toggle('on',s.getBoundingClientRect().top<vh*.6))}
 if(!RM)par.forEach(el=>{const b=el.parentElement.getBoundingClientRect();el.style.setProperty('--py',((b.top+b.height/2-vh/2)*parseFloat(el.dataset.par)).toFixed(1)+'px')});
 tk=false}
addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(sc)}},{passive:true});addEventListener('resize',sc);sc();
/* ---------- contact modal (Web3Forms; no address in the page) ---------- */
const cm=$('#contact-modal');
if(cm){const f=$('form',cm),st=$('.cm-st',cm),done=$('.cm-done',cm),KEY=f.dataset.key||'';let last=null;
 const foc=()=>$$('button,input:not([type=hidden]):not(.hp),textarea,a[href]',cm).filter(x=>x.offsetParent!==null);
 function open(e){if(e)e.preventDefault();last=document.activeElement;cm.hidden=false;document.documentElement.classList.add('cm-on');requestAnimationFrame(()=>cm.classList.add('on'));setTimeout(()=>{const x=$('input[name=name]',cm);x&&x.focus()},60)}
 function close(){cm.classList.remove('on');document.documentElement.classList.remove('cm-on');setTimeout(()=>{cm.hidden=true},RM?0:220);last&&last.focus&&last.focus()}
 document.addEventListener('click',e=>{const a=e.target.closest('[data-contact]');if(a&&!e.metaKey&&!e.ctrlKey){open(e)}});
 const hc=()=>{if(location.hash==='#contact'&&cm.hidden)open()};hc();addEventListener('hashchange',hc);
 $$('[data-close]',cm).forEach(b=>b.addEventListener('click',close));
 cm.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='Tab'){const l=foc();if(!l.length)return;const a=l[0],z=l[l.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
 const err=(n,m)=>{const i=f.elements[n],w=i.closest('label');w.classList.toggle('bad',!!m);i.setAttribute('aria-invalid',m?'true':'false');$('.er',w).textContent=m||''};
 f.addEventListener('submit',async e=>{e.preventDefault();const v=n=>f.elements[n].value.trim();let ok=true;
  err('name',v('name')?'':'Please add your name.');if(!v('name'))ok=false;
  const em=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'));err('email',em?'':'Please add an email I can reply to.');if(!em)ok=false;
  err('message',v('message')?'':'Please write a short message.');if(!v('message'))ok=false;
  if(!ok){const b=$('.bad input,.bad textarea',f);b&&b.focus();return}
  if(!KEY){st.className='cm-st warn';st.innerHTML='Sending isn’t connected yet, so this message wasn’t sent. Your text is still here. For now, please reach me on <a href="'+f.dataset.li+'" target="_blank" rel="noopener">LinkedIn</a>.';return}
  const btn=$('button[type=submit]',f);btn.disabled=true;st.className='cm-st';st.textContent='Sending…';
  try{const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:KEY,subject:'New message from your portfolio',from_name:'Portfolio contact form',name:v('name'),email:v('email'),message:v('message'),botcheck:f.elements.botcheck.checked})});
   const j=await r.json().catch(()=>({}));if(r.ok&&j.success!==false){f.hidden=true;done.hidden=false;$('h3',done).focus()}else throw 0}
  catch(_){st.className='cm-st warn';st.innerHTML='Something went wrong and the message didn’t send. Please try again, or reach me on <a href="'+f.dataset.li+'" target="_blank" rel="noopener">LinkedIn</a>.'}
  btn.disabled=false});
}
})();

/* Case Study 01: lightbox, scroll-through screenshots, spec strip */
(()=>{const RM=window.RM,$$=(s,r=document)=>[...r.querySelectorAll(s)];const lb=document.querySelector('.lb');
const cl=t=>Math.max(0,Math.min(1,t));
/* scroll-through: tall screenshots glide inside their frame as the section passes */
const sc=$$('.shot.scrub');
function scrub(){const vh=innerHeight;sc.forEach(f=>{const cr=f.querySelector('.cr'),im=cr.querySelector('img'),b=cr.getBoundingClientRect(),over=im.offsetHeight-cr.clientHeight;
 if(over<=2)return;const p=RM?0:cl((vh*.85-b.top)/(vh*.85+b.height*.25-vh*.1));const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
 im.style.setProperty('--sy',(-over*e).toFixed(1)+'px');f.style.setProperty('--s',e.toFixed(3))})}
if(sc.length){let tk=0;addEventListener('scroll',()=>{if(!tk){tk=1;requestAnimationFrame(()=>{scrub();tk=0})}},{passive:true});addEventListener('resize',scrub);addEventListener('load',scrub);scrub()}
/* spec strip */
$$('.strip-w').forEach(sw=>{const st=sw.querySelector('.strip');if(!st)return;const bar=sw.querySelector('.sbar'),sn=sw.querySelector('.sn'),its=$$('.si',st);
 const up=()=>{const m=st.scrollWidth-st.clientWidth;bar&&bar.style.setProperty('--sx',m>0?(st.scrollLeft/m).toFixed(3):1);const w=its[0].offsetWidth+20;sn&&(sn.textContent=String(Math.min(its.length,Math.round(st.scrollLeft/w)+1)))};
 st.addEventListener('scroll',up,{passive:true});up();
 $$('.sbtn',sw).forEach(b=>b.addEventListener('click',()=>st.scrollBy({left:(+b.dataset.d)*(its[0].offsetWidth+20)*2,behavior:RM?'auto':'smooth'})))});
/* lightbox */
if(!lb)return;const im=lb.querySelector('img'),cap=lb.querySelector('.lb-c'),num=lb.querySelector('.lb-n'),zb=lb.querySelector('.lb-z'),sv=lb.querySelector('.lb-s');let grp=[],ix=0,last=null;
function show(i){ix=(i+grp.length)%grp.length;const t=grp[ix];lb.classList.remove('zoom');zb.textContent='Zoom';zb.setAttribute('aria-pressed','false');im.style.width=im.style.height='';im.style.visibility='hidden';im.src=t.dataset.lb;im.alt=t.querySelector('img').alt;cap.textContent=t.dataset.cap;num.textContent=String(ix+1).padStart(2,'0')+' / '+String(grp.length).padStart(2,'0');sv.scrollTo(0,0);if(im.complete&&im.naturalWidth)lay()}
let fitW=0,zoomW=0;
function lay(){const nw=im.naturalWidth,nh=im.naturalHeight;if(!nw)return;const cs=getComputedStyle(sv),aw=sv.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),ah=sv.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
 fitW=Math.max(40,Math.min(nw,aw,ah*nw/nh));zoomW=Math.min(nw,Math.max(fitW*1.75,Math.min(aw,nw)),fitW*2.5);const can=zoomW>fitW*1.2;lb.classList.toggle('nozoom',!can);if(!can)lb.classList.remove('zoom');
 const w=lb.classList.contains('zoom')?zoomW:fitW;im.style.width=Math.round(w)+'px';im.style.height=Math.round(w*nh/nw)+'px';im.style.visibility=''}
im.addEventListener('load',lay);addEventListener('resize',()=>{if(!lb.hidden)lay()});
function open(t){last=t;grp=$$(`[data-lb][data-g="${t.dataset.g}"]`);lb.classList.toggle('single',grp.length<2);lb.hidden=false;document.body.classList.add('lb-open');show(grp.indexOf(t));requestAnimationFrame(()=>lb.classList.add('on'));lb.querySelector('.lb-x').focus()}
function close(){lb.classList.remove('on');document.body.classList.remove('lb-open');setTimeout(()=>{lb.hidden=true;im.removeAttribute('src')},RM?0:280);last&&last.focus({preventScroll:true})}
function zoom(e){if(lb.classList.contains('nozoom'))return;const r=im.getBoundingClientRect(),fx=e&&e.clientX?(e.clientX-r.left)/r.width:.5,fy=e&&e.clientY?(e.clientY-r.top)/r.height:.5;const z=lb.classList.toggle('zoom');zb.textContent=z?'Fit':'Zoom';zb.setAttribute('aria-pressed',z?'true':'false');lay();
 if(z){const sr=sv.getBoundingClientRect(),px=e&&e.clientX?e.clientX-sr.left:sv.clientWidth/2,py=e&&e.clientY?e.clientY-sr.top:sv.clientHeight/2;sv.scrollLeft=im.offsetLeft+fx*im.offsetWidth-px;sv.scrollTop=im.offsetTop+fy*im.offsetHeight-py}else sv.scrollTo(0,0)}
let drag=null,moved=false;
sv.addEventListener('pointerdown',e=>{if(!lb.classList.contains('zoom')||e.button!==0||e.target.closest('button'))return;drag={x:e.clientX,y:e.clientY,l:sv.scrollLeft,t:sv.scrollTop};moved=false;sv.setPointerCapture(e.pointerId)});
sv.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4){moved=true;lb.classList.add('drag')}sv.scrollLeft=drag.l-dx;sv.scrollTop=drag.t-dy});
const endDrag=()=>{drag=null;lb.classList.remove('drag')};sv.addEventListener('pointerup',endDrag);sv.addEventListener('pointercancel',endDrag);
document.addEventListener('click',e=>{const t=e.target.closest('[data-lb]');if(t){e.preventDefault();open(t)}});
lb.querySelector('.lb-x').onclick=close;lb.querySelector('.lb-p').onclick=()=>show(ix-1);lb.querySelector('.lb-q').onclick=()=>show(ix+1);zb.onclick=()=>zoom();im.addEventListener('click',e=>{if(moved){moved=false;return}zoom(e)});
sv.addEventListener('click',e=>{if(e.target===sv&&!moved)close();moved=false});
document.addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();else if(e.key==='ArrowRight'&&grp.length>1)show(ix+1);else if(e.key==='ArrowLeft'&&grp.length>1)show(ix-1);
 else if(e.key==='Tab'){const f=$$('button',lb).filter(b=>b.offsetParent);const a=f.indexOf(document.activeElement);if(e.shiftKey&&a<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&a===f.length-1){e.preventDefault();f[0].focus()}}});
})();

/* Case Study 01 v4: category tabs, hero configurator, checkout-stepper process, tilt-settle, spotlight, compare slider */
(()=>{const RM=window.RM,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],cl=t=>Math.max(0,Math.min(1,t));
const ct=$('.ctabs');if(!ct)return;const links=$$('a',ct),secs=links.map(a=>document.getElementById(a.dataset.s)),ctl=$('.ctl',ct);
const hero=$('.hero'),cov=$('.cover .hero-shot'),pn=$('.pn');let lk=-2;
function tick(){const vh=innerHeight;let k=-1;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<vh*.4)k=i});
 ct.classList.toggle('shown',hero.getBoundingClientRect().bottom<70&&pn.getBoundingClientRect().top>vh*.4);
 if(k!==lk){lk=k;links.forEach((a,i)=>{a.classList.toggle('on',i===k);i===k?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current')});
  const a=links[k];if(a&&ctl.scrollWidth>ctl.clientWidth){ctl.scrollTo({left:a.offsetLeft-ctl.clientWidth/2+a.offsetWidth/2,behavior:RM?'auto':'smooth'})}}
 if(cov&&!RM){const b=cov.getBoundingClientRect();cov.style.setProperty('--t',cl((b.top-vh*.18)/(vh*.7)).toFixed(3))}}
let tk=0;addEventListener('scroll',()=>{if(!tk){tk=1;requestAnimationFrame(()=>{tick();tk=0})}},{passive:true});addEventListener('resize',tick);tick();
/* hero configurator: plan → region → line items → yearly-cost ring → place order, mirrored on the journey breadcrumb */
const cf=$('.cfg'),jl=$$('.jt li'),jo=$('.jt');
if(cf&&!RM){const S=[1,2,3,4].map(i=>$('.s'+i,cf)),ctv=$('.ct',cf);let cur=28000,raf=0;
 const fmt=n=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 const count=to=>{cancelAnimationFrame(raf);const from=cur,t0=performance.now(),D=850;const st=n=>{const p=Math.min(1,(n-t0)/D),e=1-Math.pow(1-p,3);cur=Math.round(from+(to-from)*e);ctv.textContent=fmt(cur);if(p<1)raf=requestAnimationFrame(st)};raf=requestAnimationFrame(st)};
 const jr=k=>{jl.forEach((li,i)=>{li.classList.toggle('done',i<k);li.classList.toggle('on',i===k);li.classList.toggle('prev',i===k-1);li.classList.toggle('next',i===k+1);i===k?li.setAttribute('aria-current','step'):li.removeAttribute('aria-current')})};
 const nt=[cf,jo].filter(Boolean);const reset=()=>{nt.forEach(e=>e.classList.add('nt'));S.forEach(e=>e.classList.remove('on'));cf.classList.remove('d1','d2','agr','cfg-go');cancelAnimationFrame(raf);cur=0;ctv.textContent=fmt(0);jr(3);void cf.offsetWidth;nt.forEach(e=>e.classList.remove('nt'))};
 const T=[[700,()=>S[0].classList.add('on')],[1500,()=>{S[1].classList.add('on');jr(4)}],[2400,()=>{S[2].classList.add('on');cf.classList.add('d1');count(8000)}],[3400,()=>{S[3].classList.add('on');cf.classList.add('d2');count(28000)}],[4600,()=>{cf.classList.add('agr');jr(5)}],[5300,()=>cf.classList.add('cfg-go')],[6300,()=>cf.classList.remove('cfg-go')]];
 let tm=[],st=0;/* st: 0 idle(start state) 1 playing 2 finished(holds final state) */
 const clr=()=>{tm.forEach(clearTimeout);tm=[]};
 const run=()=>{clr();st=1;T.forEach(([t,f])=>tm.push(setTimeout(f,t)));tm.push(setTimeout(()=>{st=2},6400))};
 reset();
 new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){if(st===0){st=1;tm.push(setTimeout(run,performance.now()<2000?900:350))}}else if(st!==0){clr();reset();st=0}}),{threshold:0}).observe(cf)}
/* process: vertical timeline tabs; panel pointer follows the selected marker; on mobile the panel moves under its phase */
$$('.tlp').forEach(w=>{const tb=$$('[role=tab]',w),pp=$$('[role=tabpanel]',w),box=$('.tlp-pan',w),ptr=$('.tlp-ptr',w),list=$('.tlp-list',w),home=box.parentElement,mq=matchMedia('(max-width:960px)');let cur=0;w.classList.add('js');
 const place=()=>{if(mq.matches){if(tb[cur].nextElementSibling!==box)tb[cur].after(box);box.classList.add('inl')}else{if(box.parentElement!==home)home.appendChild(box);box.classList.remove('inl');const m=$('.tlp-mk',tb[cur]).getBoundingClientRect(),pt=box.getBoundingClientRect();ptr.style.setProperty('--y',Math.max(22,Math.min(pt.height-22,m.top+m.height/2-pt.top))+'px')}
  const last=tb[tb.length-1],lm=$('.tlp-mk',last);list.style.setProperty('--lb',(last.offsetHeight-(lm.offsetTop+lm.offsetHeight/2))+'px')};
 const sel=(k,f)=>{cur=k;tb.forEach((b,i)=>{const on=i===k;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});pp.forEach((p,i)=>p.hidden=i!==k);place();if(f)tb[k].focus({preventScroll:true})};
 tb.forEach((b,i)=>{b.addEventListener('click',()=>sel(i));b.addEventListener('keydown',e=>{const n=tb.length;let k=null;if(e.key==='ArrowDown'||e.key==='ArrowRight')k=(i+1)%n;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')k=(i-1+n)%n;else if(e.key==='Home')k=0;else if(e.key==='End')k=n-1;if(k!==null){e.preventDefault();sel(k,1)}})});
 $$('[data-go]',w).forEach(b=>b.addEventListener('click',()=>{const k=+b.dataset.go;sel(k,1);if(mq.matches){const r=tb[k].getBoundingClientRect();if(r.top<70||r.bottom>innerHeight)tb[k].scrollIntoView({block:'start',behavior:RM?'auto':'smooth'})}}));
 addEventListener('resize',place);mq.addEventListener&&mq.addEventListener('change',place);if(document.fonts)document.fonts.ready.then(place);sel(0)});
/* spotlight on frames */
if(matchMedia('(hover:hover)').matches)$$('.frame.real,.cmpw').forEach(f=>{f.addEventListener('pointermove',e=>{const b=f.getBoundingClientRect();f.style.setProperty('--mx',(e.clientX-b.left)+'px');f.style.setProperty('--my',(e.clientY-b.top)+'px')});f.addEventListener('pointerleave',()=>{f.style.setProperty('--mx','-400px')})});
/* compare slider + one-time hint sweep */
$$('.cmp').forEach(c=>{const r=c.querySelector('input'),set=v=>c.style.setProperty('--x',v+'%');r.addEventListener('input',()=>set(r.value));
 if(RM)return;const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();let t0=null;const D=1800;const st=n=>{t0=t0||n;const p=Math.min(1,(n-t0)/D);if(r.dataset.touched)return;const v=50+Math.sin(p*Math.PI*2)*-22*(1-p*.2);set(v.toFixed(1));r.value=v;if(p<1)requestAnimationFrame(st);else{set(50);r.value=50}};setTimeout(()=>requestAnimationFrame(st),500)}},{threshold:.4});io.observe(c);
 r.addEventListener('pointerdown',()=>r.dataset.touched=1,{once:true})});
})();

/* Case Study 02: hero routing sequence, show-all screens */
(()=>{const RM=window.RM,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const nx=$('.nxa');if(nx){const set=k=>{['s1','s2','s3','s4'].forEach((c,i)=>nx.classList.toggle(c,i<k))};
 if(RM){set(4)}else{let st=0;const go=()=>{if(st)return;st=1;[1,2,3,4].forEach((k,i)=>setTimeout(()=>set(k),350+i*800))};
  const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){go();io.disconnect()}},{threshold:.3});io.observe(nx)}}
const g=$('.c2g'),gb=$('.c2g-x');if(g&&gb)gb.addEventListener('click',()=>{const all=g.classList.toggle('all');gb.setAttribute('aria-expanded',all);gb.firstChild.textContent=all?'Show fewer screens ':'Show all 24 screens ';if(!all)g.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});else{const f=$$('.si.more .cr',g)[0];f&&f.focus({preventScroll:true})}});
})();
/* Case Study 02 R11: topology highlights, animated setup */
(()=>{const RM=window.RM,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const st=$('#tps'),its=$$('.tpi');if(st&&its.length){let pin=null;
 const show=k=>{if(k)st.dataset.k=k;else delete st.dataset.k;its.forEach(b=>b.classList.toggle('on',b.dataset.k===k))};
 its.forEach(b=>{const k=b.dataset.k;
  b.addEventListener('mouseenter',()=>show(k));b.addEventListener('mouseleave',()=>show(pin));
  b.addEventListener('focus',()=>show(k));b.addEventListener('blur',()=>show(pin));
  b.addEventListener('click',()=>{pin=pin===k?null:k;its.forEach(x=>x.setAttribute('aria-pressed',x.dataset.k===pin));show(pin||k)})})}
})();
/* Case Study 02 R12: challenge sort, drag and drop setup */
(()=>{const RM=window.RM,$=(s,r=document)=>r.querySelector(s);
const once=(el,fn,t)=>{const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){fn();io.disconnect()}},{threshold:t});io.observe(el)};
const cx=$('.c2x');if(cx){const K=()=>['k1','k2','k3'].forEach((k,i)=>setTimeout(()=>cx.classList.add(k),RM?0:400+i*900));RM?K():once(cx,K,.5)}
})();
/* Case Study 02 R13: routing lens, picker and drag setup */
(()=>{const RM=window.RM,$=(s,r=document)=>r.querySelector(s);
const once=(el,fn,t)=>{const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){fn();io.disconnect()}},{threshold:t});io.observe(el)};
/* reading window: follows the pointer up and down, drifts gently until someone uses it */
const rf=$('.rl-f');if(rf){const c=$('.rl-c',rf);let ty=0,y=0,user=false,raf=0,t0=0;
 const H=()=>parseFloat(getComputedStyle(rf).getPropertyValue('--h'))||72,max=()=>Math.max(0,c.clientHeight-H());
 const put=()=>rf.style.setProperty('--y',y.toFixed(1)+'px');
 ty=y=max()*.42;put();
 const tick=t=>{if(!user&&!RM){if(!t0)t0=t;ty=max()*(.5+.5*Math.sin((t-t0)/1000*.45-.17))}
  y+=(ty-y)*.12;put();raf=requestAnimationFrame(tick)};
 const at=e=>{const r=c.getBoundingClientRect();ty=Math.max(0,Math.min(max(),e.clientY-r.top-H()/2))};
 rf.addEventListener('pointermove',e=>{user=true;at(e)});rf.addEventListener('pointerdown',e=>{user=true;at(e)});
 const io=new IntersectionObserver(es=>{es.forEach(e=>{cancelAnimationFrame(raf);if(e.isIntersecting&&!RM)raf=requestAnimationFrame(tick)})});io.observe(rf)}
/* setup: open picker, choose, object lands on canvas, drag it to the filter */
const sv=$('.sv'),rp=$('.su-rp');if(sv){const cur=$('.sv-cur',sv),F=['cur','pr','on','mo-e','mo-t','pk-e','pk-t','in-e','in-t','lf','lft','dg-e','dg-t','fh','ok-e','ok-t','cl'];let tm=[];
 const cls=(a,on=true)=>a.split(' ').forEach(k=>sv.classList.toggle(k,on));
 const to=(el,fx=.5,fy=.5)=>{if(!el)return;const s=sv.getBoundingClientRect(),r=el.getBoundingClientRect();cur.style.left=(r.left-s.left+r.width*fx-2)+'px';cur.style.top=(r.top-s.top+r.height*fy-2)+'px'};
 const fil=()=>$('.sv-n.f',sv);
 const mark=(sel,on)=>{const el=$(sel,sv);el&&el.classList.toggle('on',on)};
 const side=(k,lk,md,chip,lift)=>[
  [700,()=>to($('.sv-lk.'+lk,sv),.35,.6)],
  [500,()=>{cls('pr');mark('.sv-lk.'+lk,true)}],
  [250,()=>{cls('pr',false);cls('mo-'+k)}],
  [650,()=>to($('.sv-md.'+md+' .p1 .cb',sv))],
  [550,()=>{cls('pr');cls('pk-'+k)}],
  [250,()=>cls('pr',false)],
  [400,()=>to($('.sv-md.'+md+' .sel',sv),.4,.55)],
  [600,()=>{cls('pr');mark('.sv-md.'+md+' .sel',true)}],
  [250,()=>{cls('pr',false);cls('mo-'+k,false);mark('.sv-lk.'+lk,false);cls('in-'+k)}],
  [600,()=>to($('.sv-n.'+chip,sv),.5,.55)],
  [650,()=>{cls('pr');cls(lift)}],
  [300,()=>{cls('dg-'+k);cls('fh');const f=fil(),s=sv.getBoundingClientRect(),r=f.getBoundingClientRect();cur.style.left=(r.left-s.left+r.width*.4)+'px';cur.style.top=(r.top-s.top+r.height*.7)+'px'}],
  [800,()=>{cls('pr',false);cls('dg-'+k+' fh '+lift,false);cls('ok-'+k)}]];
 const steps=()=>[[300,()=>{cur.style.left='46%';cur.style.top='92%';cls('cur')}],...side('e','l','e','e','lf'),[700,()=>{}],...side('t','r','t','t','lft'),
  [700,()=>to($('.sv-ft .cl',sv),.45,.6)],[650,()=>cls('pr')],[200,()=>{cls('pr',false);cls('cl')}],[600,()=>cls('cur',false)]];
 const reset=()=>{tm.forEach(clearTimeout);tm=[];sv.classList.add('rs');F.forEach(k=>sv.classList.remove(k));sv.querySelectorAll('.on').forEach(e=>{if(!e.matches('.sv-dl li,.sv-tb span'))e.classList.remove('on')});void sv.offsetWidth;sv.classList.remove('rs')};
 const run=()=>{reset();let t=0;steps().forEach(([d,f])=>{t+=d;tm.push(setTimeout(f,t))})};
 if(RM){cls('in-e in-t ok-e ok-t cl')}else{once(sv,run,.4)}
 rp&&rp.addEventListener('click',()=>{if(RM){reset();cls('in-e in-t ok-e ok-t cl')}else run()})}
})();

/* ===== Case Study 03: Network Assurance Engine ===== */
(()=>{const RM=window.RM,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
if(!document.body.classList.contains('cs3'))return;
const seen=(el,f,t=.4)=>{if(!('IntersectionObserver' in window)){f();return}const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();f()}},{threshold:t});io.observe(el)};
const fmt=n=>Math.round(n).toLocaleString('en-US');
/* hero: epoch timeline drives the Smart Events dashlet; circle colour = highest severity in that epoch */
const ae=$('.aew');if(ae&&window.AE_EP){const EP=AE_EP,T=AE_T,N=EP.length,tr=$('.ae-tr',ae),dots=$$('.ae-e',ae),ns=$$('.ae-n',ae),tm2=$('.ae-tm2',ae);
 let cur=-1,user=false,tmr=null;const val=ns.map(n=>+n.textContent.replace(/,/g,''));
 const tween=(k,to)=>{const n=ns[k],from=val[k];val[k]=to;if(RM){n.textContent=fmt(to);return}const t0=performance.now();const st=t=>{const p=Math.min(1,(t-t0)/320),e=1-Math.pow(1-p,3);n.textContent=fmt(from+(to-from)*e);if(p<1&&val[k]===to)requestAnimationFrame(st)};requestAnimationFrame(st)};
 const sel=i=>{i=Math.max(0,Math.min(N-1,i));if(i===cur)return;cur=i;dots.forEach((d,k)=>{const on=k===i;d.classList.toggle('on',on);d.setAttribute('aria-checked',on);d.tabIndex=on?0:-1});
  const e=EP[i],v=[...e,e.reduce((a,b)=>a+b,0)];ns.forEach(n=>tween(+n.dataset.k,v[+n.dataset.k]));tm2.textContent=T[i]};
 const stop=()=>{user=true;clearInterval(tmr)};
 const near=x=>{const r=tr.getBoundingClientRect();return Math.round((x-r.left)/r.width*(N-1))};
 tr.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||e.buttons){stop();sel(near(e.clientX))}});
 tr.addEventListener('pointerdown',e=>{stop();sel(near(e.clientX));if(e.pointerType!=='mouse')try{tr.setPointerCapture(e.pointerId)}catch(_){}});
 tr.addEventListener('keydown',e=>{const k={ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1}[e.key];let i=null;if(k)i=cur+k;else if(e.key==='Home')i=0;else if(e.key==='End')i=N-1;if(i===null)return;e.preventDefault();stop();sel(i);dots[cur].focus()});
 dots.forEach((d,k)=>d.addEventListener('click',()=>{stop();sel(k)}));
 sel(N-1);
 if(!RM)seen(ae,()=>{if(user)return;let i=0;sel(0);tmr=setInterval(()=>{if(user){clearInterval(tmr);return}i++;sel(i);if(i>=N-1)clearInterval(tmr)},260)},.5)}
/* challenge: scattered events settle into epochs */
const nz=$('.nz');if(nz){const go=()=>nz.classList.add('nz-go');if(RM)go();else seen(nz,go,.45);
 const rp=$('.nz-rp',nz);rp&&rp.addEventListener('click',()=>{nz.classList.remove('nz-go');void nz.offsetWidth;requestAnimationFrame(()=>requestAnimationFrame(go))})}
/* key screens: hover a detail to light it up on the screen */
$$('.hz').forEach(hz=>{const its=$$('.hzi',hz),rs=$$('.hz-r',hz);let pin=-1;
 const show=k=>{rs.forEach(r=>r.classList.toggle('on',+r.dataset.k===k));its.forEach(b=>b.classList.toggle('hl',+b.dataset.k===k))};
 its.forEach(b=>{const k=+b.dataset.k;b.addEventListener('mouseenter',()=>show(k));b.addEventListener('mouseleave',()=>show(pin));b.addEventListener('focus',()=>show(k));b.addEventListener('blur',()=>show(pin));
  b.addEventListener('click',()=>{pin=pin===k?-1:k;its.forEach(x=>x.setAttribute('aria-pressed',+x.dataset.k===pin));show(pin)})})});
/* natural language query: pick an intent, see its result */
const nq=$('.nq');if(nq){const tabs=$$('[role=tab]',nq),ims=$$('.nq-im',nq),cap=$('.nq-c',nq),q=$('.nq-q',nq),tx=$('.nq-tx',nq),pn=$('.nq-p',nq);let tt=null,auto=null,user=false,cur=0;
 const type=w=>{clearInterval(tt);q.classList.add('ty');if(RM){tx.textContent=w;return}tx.textContent='';let i=0;tt=setInterval(()=>{tx.textContent=w.slice(0,++i);if(i>=w.length)clearInterval(tt)},80)};
 const sel=(k,foc)=>{cur=k;tabs.forEach((t,j)=>{const on=j===k;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1});pn.setAttribute('aria-labelledby',tabs[k].id);ims.forEach((im,j)=>im.classList.toggle('on',j===k));cap.textContent=tabs[k].dataset.c;type(tabs[k].dataset.q);if(foc)tabs[k].focus()};
 const stop=()=>{user=true;clearInterval(auto)};
 tabs.forEach((t,k)=>{t.addEventListener('click',()=>{stop();sel(k)});t.addEventListener('keydown',e=>{const d={ArrowRight:1,ArrowLeft:-1}[e.key];if(!d)return;e.preventDefault();stop();sel((cur+d+tabs.length)%tabs.length,true)})});
 q.classList.remove('ty');tx.textContent='';
 if(RM)sel(0);else seen(nq,()=>{sel(0);let k=0;auto=setInterval(()=>{if(user){clearInterval(auto);return}k++;sel(k);if(k>=tabs.length-1)clearInterval(auto)},3600)},.5)}
/* all final screens */
const g=$('.c3g'),gb=$('.c3g-x');if(g&&gb)gb.addEventListener('click',()=>{const all=g.classList.toggle('all');gb.setAttribute('aria-expanded',all);gb.firstChild.textContent=all?'Show fewer screens ':'Show all 17 screens ';if(!all)g.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});else{const f=$$('.si.more .cr',g)[0];f&&f.focus({preventScroll:true})}});
})();
