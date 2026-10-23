(()=>{const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];const RM=window.RM;
/* reveals */
const rv=$$('.ox-rv');if(RM||!('IntersectionObserver' in window))rv.forEach(e=>e.classList.add('in'));else{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -6% 0px'});rv.forEach(e=>io.observe(e))}
/* hero: one configurator + journey driver per option */
$$('[data-hero]').forEach(h=>{const cf=$('.cfg',h),jl=$$('[data-st]',h),jo=jl[0]&&jl[0].parentElement,now=$('[data-now]',h),nx=$('[data-next]',h);if(!cf)return;
 const S=[1,2,3,4].map(i=>$('.s'+i,cf)),ctv=$('.ct',cf);let cur=28000,raf=0;
 const fmt=n=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
 const count=to=>{cancelAnimationFrame(raf);const from=cur,t0=performance.now(),D=850;const st=n=>{const p=Math.min(1,(n-t0)/D),e=1-Math.pow(1-p,3);cur=Math.round(from+(to-from)*e);ctv.textContent=fmt(cur);if(p<1)raf=requestAnimationFrame(st)};raf=requestAnimationFrame(st)};
 const jr=(k,quiet)=>{jl.forEach((li,i)=>{li.classList.toggle('is-done',i<k);li.classList.toggle('is-on',i===k);li.classList.toggle('is-prev',i===k-1);li.classList.toggle('is-next',i===k+1);i===k?li.setAttribute('aria-current','step'):li.removeAttribute('aria-current')});jo.style.setProperty('--p',(k/(jl.length-1)).toFixed(4));jo.style.setProperty('--k',k);if(jo.scrollWidth>jo.clientWidth+2){const li=jl[k];jo.scrollTo({left:Math.max(0,li.offsetLeft-jo.offsetLeft-(jo.clientWidth-li.offsetWidth)/2),behavior:(quiet||RM)?'auto':'smooth'})}
  if(nx){const t=k<jl.length-1?'Next: '+jl[k+1].querySelector('.t').textContent:'Journey complete';if(quiet||RM){nx.textContent=t}else if(nx.textContent!==t){nx.classList.add('sw');setTimeout(()=>{nx.textContent=t;nx.classList.remove('sw')},220)}}
  if(now){const t=jl[k].querySelector('.t').textContent;if(quiet||RM){now.textContent=t}else if(now.textContent!==t){now.classList.add('sw');setTimeout(()=>{now.textContent=t;now.classList.remove('sw')},220)}}};
 if(RM){jr(5,1);return}
 const nt=[cf,jo];const reset=()=>{nt.forEach(e=>e.classList.add('nt'));S.forEach(e=>e.classList.remove('on'));cf.classList.remove('d1','d2','agr','cfg-go');cancelAnimationFrame(raf);cur=0;ctv.textContent=fmt(0);jr(3,1);void cf.offsetWidth;nt.forEach(e=>e.classList.remove('nt'))};
 const T=[[700,()=>S[0].classList.add('on')],[1500,()=>{S[1].classList.add('on');jr(4)}],[2400,()=>{S[2].classList.add('on');cf.classList.add('d1');count(8000)}],[3400,()=>{S[3].classList.add('on');cf.classList.add('d2');count(28000)}],[4600,()=>{cf.classList.add('agr');jr(5)}],[5300,()=>cf.classList.add('cfg-go')],[6300,()=>cf.classList.remove('cfg-go')]];
 let tm=[],st=0;const clr=()=>{tm.forEach(clearTimeout);tm=[]};
 const run=()=>{clr();st=1;T.forEach(([t,f])=>tm.push(setTimeout(f,t)));tm.push(setTimeout(()=>{st=2},6400))};
 reset();
 const rp=document.createElement('button');rp.type='button';rp.className='ox-rp';rp.textContent='↻ Replay';rp.addEventListener('click',()=>{clr();reset();tm.push(setTimeout(run,250))});h.closest('.ox-stage').appendChild(rp);
 new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){if(st===0){st=1;tm.push(setTimeout(run,350))}}else if(st!==0){clr();reset();st=0}}),{threshold:.35}).observe(cf)});
/* tabs (process A + B) */
const mq=matchMedia('(max-width:960px)');
$$('[data-tabs]').forEach(w=>{const tb=$$('[role=tab]',w),pp=$$('[role=tabpanel]',w),box=pp[0].parentElement,ptr=$('.pB-ptr',w),list=$('.pB-list,.pT-list',w),home=box.parentElement;let cur=0;
 const place=()=>{if(!list)return;if(mq.matches){if(tb[cur].nextElementSibling!==box)tb[cur].after(box);box.classList.add('inl')}else{if(box.parentElement!==home)home.appendChild(box);box.classList.remove('inl');const b=$('.tmk',tb[cur])||tb[cur],bt=b.getBoundingClientRect(),pt=box.getBoundingClientRect();ptr.style.setProperty('--y',Math.max(20,Math.min(pt.height-20,bt.top+bt.height/2-pt.top))+'px')}};
 const sel=(k,f)=>{cur=k;tb.forEach((b,i)=>{const on=i===k;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});pp.forEach((p,i)=>p.hidden=i!==k);place();f&&tb[k].focus({preventScroll:false})};
 tb.forEach((b,i)=>{b.addEventListener('click',()=>{sel(i);const tl=b.parentElement;if(tl.scrollWidth>tl.clientWidth+2)tl.scrollTo({left:Math.max(0,b.offsetLeft-tl.offsetLeft-24),behavior:RM?'auto':'smooth'})});b.addEventListener('keydown',e=>{const n=tb.length;let k=null;if(e.key==='ArrowRight'||e.key==='ArrowDown')k=(i+1)%n;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')k=(i-1+n)%n;else if(e.key==='Home')k=0;else if(e.key==='End')k=n-1;if(k!==null){e.preventDefault();sel(k,1)}})});
 $$('[data-go]',w).forEach(b=>b.addEventListener('click',()=>{const k=+b.dataset.go;sel(k,1);if(tb[k].scrollIntoView&&w.querySelector('.pA-tabs'))tb[k].scrollIntoView({block:'nearest',inline:'nearest',behavior:RM?'auto':'smooth'})}));
 addEventListener('resize',place);mq.addEventListener&&mq.addEventListener('change',place);sel(0)});
/* accordion (process C) */
$$('[data-acc]').forEach(w=>{const it=$$('.pC-i',w);it.forEach(i=>{const b=$('button',i);b.addEventListener('click',()=>{const open=!i.classList.contains('open');it.forEach(j=>{j.classList.remove('open');$('button',j).setAttribute('aria-expanded','false')});if(open){i.classList.add('open');b.setAttribute('aria-expanded','true')}})})});
})();
