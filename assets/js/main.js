/* Shared: page transition (packets converge / expand), reveals, nav, progress, process rail, parallax */
(()=>{const RM=window.RM,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
if(RM)$$('svg').forEach(s=>s.pauseAnimations&&s.pauseAnimations());
/* ---------- page transition ---------- */
const pt=$('.pt'),pc=pt&&pt.querySelector('canvas'),px=pc&&pc.getContext('2d'),lbl=pt&&pt.querySelector('.lbl');
let W,H;function size(){const D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;pc.width=W*D;pc.height=H*D;px.setTransform(D,0,0,D,0,0)}
const eio=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,eo=t=>1-Math.pow(1-t,3),cl=t=>Math.max(0,Math.min(1,t));
function run(mode,ox,oy,dur,done){size();pt.classList.remove('off');pt.classList.add('run');
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
 setTimeout(()=>run('out',ox,oy,s.l?950:800,()=>{pt.classList.add('off');pt.classList.remove('run','show')}),s.l?140:0)}
enter();setTimeout(()=>pt&&pt.classList.contains('run')===false&&!pt.classList.contains('off')&&pt.classList.add('off'),2500);
addEventListener('pageshow',e=>{if(e.persisted&&pt){pt.classList.add('off');pt.classList.remove('run','show')}});
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||RM||!pt)return;const href=a.getAttribute('href');
 if(!href||href.startsWith('#')||a.target==='_blank'||e.metaKey||e.ctrlKey||e.shiftKey||e.button||/^(mailto:|tel:|https?:)/.test(href))return;
 const cur=location.pathname.split('/').pop()||'index.html',dest=href.split('#')[0];if(dest===cur&&href.includes('#'))return;
 e.preventDefault();const ox=e.clientX||innerWidth/2,oy=e.clientY||innerHeight/2,l=a.dataset.label||'Loading';
 if(lbl)lbl.textContent=l;try{sessionStorage.setItem('bc-pt',JSON.stringify({x:ox/innerWidth,y:oy/innerHeight,l}))}catch(_){}
 run('in',ox,oy,820,()=>location.href=href)});
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
 const up=()=>{const m=st.scrollWidth-st.clientWidth;bar&&bar.style.setProperty('--sx',m>0?(st.scrollLeft/m).toFixed(3):1);const w=its[0].offsetWidth+20;sn&&(sn.textContent=String(Math.min(its.length,Math.round(st.scrollLeft/w)+1)).padStart(2,'0'))};
 st.addEventListener('scroll',up,{passive:true});up();
 $$('.sbtn',sw).forEach(b=>b.addEventListener('click',()=>st.scrollBy({left:(+b.dataset.d)*(its[0].offsetWidth+20)*2,behavior:RM?'auto':'smooth'})))});
/* lightbox */
if(!lb)return;const im=lb.querySelector('img'),cap=lb.querySelector('.lb-c'),num=lb.querySelector('.lb-n'),zb=lb.querySelector('.lb-z'),sv=lb.querySelector('.lb-s');let grp=[],ix=0,last=null;
function show(i){ix=(i+grp.length)%grp.length;const t=grp[ix];lb.classList.remove('zoom');zb.textContent='Zoom';im.src=t.dataset.lb;im.alt=t.querySelector('img').alt;cap.textContent=t.dataset.cap;num.textContent=String(ix+1).padStart(2,'0')+' / '+String(grp.length).padStart(2,'0');sv.scrollTo(0,0)}
function open(t){last=t;grp=$$(`[data-lb][data-g="${t.dataset.g}"]`);lb.classList.toggle('single',grp.length<2);lb.hidden=false;document.body.classList.add('lb-open');show(grp.indexOf(t));requestAnimationFrame(()=>lb.classList.add('on'));lb.querySelector('.lb-x').focus()}
function close(){lb.classList.remove('on');document.body.classList.remove('lb-open');setTimeout(()=>{lb.hidden=true;im.removeAttribute('src')},RM?0:280);last&&last.focus({preventScroll:true})}
function zoom(){const z=lb.classList.toggle('zoom');zb.textContent=z?'Fit':'Zoom'}
document.addEventListener('click',e=>{const t=e.target.closest('[data-lb]');if(t){e.preventDefault();open(t)}});
lb.querySelector('.lb-x').onclick=close;lb.querySelector('.lb-p').onclick=()=>show(ix-1);lb.querySelector('.lb-q').onclick=()=>show(ix+1);zb.onclick=zoom;im.onclick=zoom;
sv.addEventListener('click',e=>{if(e.target===sv)close()});
document.addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();else if(e.key==='ArrowRight'&&grp.length>1)show(ix+1);else if(e.key==='ArrowLeft'&&grp.length>1)show(ix-1);
 else if(e.key==='Tab'){const f=$$('button',lb).filter(b=>b.offsetParent);const a=f.indexOf(document.activeElement);if(e.shiftKey&&a<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&a===f.length-1){e.preventDefault();f[0].focus()}}});
})();

/* Case Study 01 v2: section route rail, hero buyer-route packet, tilt-settle, spotlight, compare slider */
(()=>{const RM=window.RM,$$=(s,r=document)=>[...r.querySelectorAll(s)],cl=t=>Math.max(0,Math.min(1,t));
const rr=document.querySelector('.rroute');if(!rr)return;const links=$$('a',rr),secs=links.map(a=>document.getElementById(a.dataset.s)),rl=rr.querySelector('.rl');
const hero=document.querySelector('.hero'),cov=document.querySelector('.cover .hero-shot');
function tick(){const vh=innerHeight;let k=-1;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<vh*.45)k=i});
 rr.classList.toggle('shown',hero.getBoundingClientRect().bottom<vh*.35&&document.querySelector('.pn').getBoundingClientRect().top>vh*.5);
 links.forEach((a,i)=>{a.classList.toggle('on',i===k);a.classList.toggle('done',i<k);i===k?a.setAttribute('aria-current','true'):a.removeAttribute('aria-current')});
 rl.style.setProperty('--rp',k<0?0:(k/(links.length-1)).toFixed(3));
 if(cov&&!RM){const b=cov.getBoundingClientRect();cov.style.setProperty('--t',cl((b.top-vh*.18)/(vh*.7)).toFixed(3))}}
let tk=0;addEventListener('scroll',()=>{if(!tk){tk=1;requestAnimationFrame(()=>{tick();tk=0})}},{passive:true});addEventListener('resize',tick);tick();
/* hero packet: travels the buyer route, lighting each stop */
const hr=document.querySelector('.hroute');if(hr&&!RM&&hr.animate){const ol=hr.querySelector('ol'),pk=hr.querySelector('.hpk'),lis=$$('li',ol);
 const run=()=>{if(getComputedStyle(pk).display==='none')return;const o=ol.offsetLeft,w=ol.offsetWidth-8,T=5200;
  pk.animate([{transform:`translateX(${o}px)`,opacity:0},{opacity:1,offset:.06},{opacity:1,offset:.94},{transform:`translateX(${o+w}px)`,opacity:0}],{duration:T,easing:'cubic-bezier(.45,0,.35,1)'});
  lis.forEach((li,i)=>{const b=li.querySelector('b');setTimeout(()=>{b.style.borderColor='var(--acc)';b.style.background=i===lis.length-1?'var(--acc)':'#fff'},T*(.06+.88*i/(lis.length-1)))});
  setTimeout(()=>{lis.forEach(li=>{const b=li.querySelector('b');b.style.borderColor='';b.style.background=''})},T+1400)};
 setTimeout(()=>{run();setInterval(()=>{if(!document.hidden&&hero.getBoundingClientRect().bottom>0)run()},8200)},1100)}
/* spotlight on frames */
if(matchMedia('(hover:hover)').matches)$$('.frame.real,.cmpw').forEach(f=>{f.addEventListener('pointermove',e=>{const b=f.getBoundingClientRect();f.style.setProperty('--mx',(e.clientX-b.left)+'px');f.style.setProperty('--my',(e.clientY-b.top)+'px')});f.addEventListener('pointerleave',()=>{f.style.setProperty('--mx','-400px')})});
/* compare slider + one-time hint sweep */
$$('.cmp').forEach(c=>{const r=c.querySelector('input'),set=v=>c.style.setProperty('--x',v+'%');r.addEventListener('input',()=>set(r.value));
 if(RM||!c.animate)return;const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();let t0=null;const D=1800;const st=n=>{t0=t0||n;const p=Math.min(1,(n-t0)/D);if(r.dataset.touched)return;const v=50+Math.sin(p*Math.PI*2)*-22*(1-p*.2);set(v.toFixed(1));r.value=v;if(p<1)requestAnimationFrame(st);else{set(50);r.value=50}};setTimeout(()=>requestAnimationFrame(st),500)}},{threshold:.5});io.observe(c);
 r.addEventListener('pointerdown',()=>r.dataset.touched=1,{once:true})});
})();
