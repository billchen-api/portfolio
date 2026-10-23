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
 const up=()=>{const m=st.scrollWidth-st.clientWidth;bar&&bar.style.setProperty('--sx',m>0?(st.scrollLeft/m).toFixed(3):1);const w=its[0].offsetWidth+20;sn&&(sn.textContent=String(Math.min(its.length,Math.round(st.scrollLeft/w)+1)))};
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
const cf=$('.cfg'),jl=$$('.jr li'),jo=$('.jr');
if(cf&&!RM){const S=[1,2,3,4].map(i=>$('.s'+i,cf)),ctv=$('.ct',cf);let cur=28000,raf=0;
 const fmt=n=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 const count=to=>{cancelAnimationFrame(raf);const from=cur,t0=performance.now(),D=850;const st=n=>{const p=Math.min(1,(n-t0)/D),e=1-Math.pow(1-p,3);cur=Math.round(from+(to-from)*e);ctv.textContent=fmt(cur);if(p<1)raf=requestAnimationFrame(st)};raf=requestAnimationFrame(st)};
 const jr=k=>{jl.forEach((li,i)=>{li.classList.toggle('done',i<k);li.classList.toggle('on',i===k);i===k?li.setAttribute('aria-current','step'):li.removeAttribute('aria-current')});jo&&jo.style.setProperty('--p',(k/(jl.length-1)).toFixed(4))};
 const nt=[cf,jo].filter(Boolean);const reset=()=>{nt.forEach(e=>e.classList.add('nt'));S.forEach(e=>e.classList.remove('on'));cf.classList.remove('d1','d2','agr','cfg-go');cancelAnimationFrame(raf);cur=0;ctv.textContent=fmt(0);jr(3);void cf.offsetWidth;nt.forEach(e=>e.classList.remove('nt'))};
 const T=[[700,()=>S[0].classList.add('on')],[1500,()=>{S[1].classList.add('on');jr(4)}],[2400,()=>{S[2].classList.add('on');cf.classList.add('d1');count(8000)}],[3400,()=>{S[3].classList.add('on');cf.classList.add('d2');count(28000)}],[4600,()=>{cf.classList.add('agr');jr(5)}],[5300,()=>cf.classList.add('cfg-go')],[6300,()=>cf.classList.remove('cfg-go')]];
 let tm=[],st=0;/* st: 0 idle(start state) 1 playing 2 finished(holds final state) */
 const clr=()=>{tm.forEach(clearTimeout);tm=[]};
 const run=()=>{clr();st=1;T.forEach(([t,f])=>tm.push(setTimeout(f,t)));tm.push(setTimeout(()=>{st=2},6400))};
 reset();
 new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){if(st===0){st=1;tm.push(setTimeout(run,performance.now()<2000?900:350))}}else if(st!==0){clr();reset();st=0}}),{threshold:0}).observe(cf)}
/* process: checkout-style stepper (tabs) */
$$('.cks').forEach(w=>{const tb=$$('[role=tab]',w),pp=$$('[role=tabpanel]',w);w.classList.add('js');
 const sel=(k,f)=>{tb.forEach((b,i)=>{const on=i===k;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;b.classList.toggle('done',i<k)});pp.forEach((p,i)=>p.classList.toggle('on',i===k));f&&tb[k].focus()};
 tb.forEach((b,i)=>{b.addEventListener('click',()=>sel(i));b.addEventListener('keydown',e=>{const n=tb.length;let k=null;if(e.key==='ArrowRight'||e.key==='ArrowDown')k=(i+1)%n;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')k=(i-1+n)%n;else if(e.key==='Home')k=0;else if(e.key==='End')k=n-1;if(k!==null){e.preventDefault();sel(k,1)}})});sel(0)});
/* spotlight on frames */
if(matchMedia('(hover:hover)').matches)$$('.frame.real,.cmpw').forEach(f=>{f.addEventListener('pointermove',e=>{const b=f.getBoundingClientRect();f.style.setProperty('--mx',(e.clientX-b.left)+'px');f.style.setProperty('--my',(e.clientY-b.top)+'px')});f.addEventListener('pointerleave',()=>{f.style.setProperty('--mx','-400px')})});
/* compare slider + one-time hint sweep */
$$('.cmp').forEach(c=>{const r=c.querySelector('input'),set=v=>c.style.setProperty('--x',v+'%');r.addEventListener('input',()=>set(r.value));
 if(RM)return;const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();let t0=null;const D=1800;const st=n=>{t0=t0||n;const p=Math.min(1,(n-t0)/D);if(r.dataset.touched)return;const v=50+Math.sin(p*Math.PI*2)*-22*(1-p*.2);set(v.toFixed(1));r.value=v;if(p<1)requestAnimationFrame(st);else{set(50);r.value=50}};setTimeout(()=>requestAnimationFrame(st),500)}},{threshold:.4});io.observe(c);
 r.addEventListener('pointerdown',()=>r.dataset.touched=1,{once:true})});
})();
