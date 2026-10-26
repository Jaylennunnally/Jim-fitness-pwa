(function(){
const $=id=>document.getElementById(id),LS=localStorage;
let D=null,sel=null;
const cfg=()=>({url:LS.getItem('jim_url'),key:LS.getItem('jim_key')});
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const parse=k=>{const[a,b,c]=k.split('-').map(Number);return new Date(a,b-1,c)};
const shift=(k,n)=>{const d=parse(k);d.setDate(d.getDate()+n);return iso(d)};
const r0=n=>Math.round(n||0),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function ring(svg,size,stroke,frac,color,inner){const r=(size-stroke)/2,C=2*Math.PI*r,f=Math.max(0,Math.min(frac,1));
svg.setAttribute('viewBox',`0 0 ${size} ${size}`);svg.innerHTML=`<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#ffffff14" stroke-width="${stroke}"/>
<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-f)}" transform="rotate(-90 ${size/2} ${size/2})" style="transition:stroke-dashoffset .6s"/>${inner||''}`}
function totals(k){return D.food.filter(x=>x.date===k).reduce((a,x)=>(a.cal+=x.cal,a.p+=x.p,a.c+=x.c,a.f+=x.f,a),{cal:0,p:0,c:0,f:0})}
function render(){if(!D)return;sel=sel||D.today;const g=D.goals,t=totals(sel);
const dd=parse(sel);$('dlabel').firstChild.nodeValue=sel===D.today?'Today':sel===shift(D.today,-1)?'Yesterday':dd.toLocaleDateString('en-US',{weekday:'long'});
$('dsub').textContent=dd.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});$('next').disabled=sel>=D.today;
const left=g.calories-t.cal;$('left').textContent=r0(left).toLocaleString();$('left').style.color=left<0?'#ff8a8a':'';
$('goal').textContent=g.calories.toLocaleString();$('eaten').textContent=r0(t.cal).toLocaleString();$('pct').textContent=r0(t.cal/g.calories*100)+'%';
ring($('calRing'),132,14,t.cal/g.calories,'url(#gr)','<defs><linearGradient id="gr"><stop offset="0" stop-color="#8ecbff"/><stop offset="1" stop-color="#4fa8ff"/></linearGradient></defs>');
$('macros').innerHTML=[['Protein','p','protein','var(--p)'],['Carbs','c','carbs','var(--c)'],['Fat','f','fat','var(--f)']].map(([n,k,gk,col],i)=>`<div><svg id="m${i}" width="84" height="84"></svg><b>${r0(t[k])}<span> / ${g[gk]}g</span></b><span>${n} · ${Math.max(0,r0(g[gk]-t[k]))}g left</span></div>`).join('');
[['p','protein','#ff5f8f'],['c','carbs','#ffd166'],['f','fat','#7ae7c7']].forEach(([k,gk,col],i)=>ring($('m'+i),84,10,t[k]/g[gk],col,`<text x="42" y="46" text-anchor="middle" style="font-size:13px;fill:#f2f6ff;font-weight:700">${r0(t[k]/g[gk]*100)}%</text>`));
const order=['Breakfast','Lunch','Dinner','Snack','Snacks','Drinks','Other'],items=D.food.filter(x=>x.date===sel),groups={};
items.forEach(x=>(groups[x.meal]=groups[x.meal]||[]).push(x));
const names=Object.keys(groups).sort((a,b)=>(order.indexOf(a)+99)%106-(order.indexOf(b)+99)%106);
$('meals').innerHTML=names.length?names.map(m=>`<div class="meal"><div class="mh">${esc(m)}<span>${r0(groups[m].reduce((a,x)=>a+x.cal,0))} cal</span></div>${groups[m].map(x=>`<div class="it"><div>${esc(x.item)}<small>${esc([x.brand,x.servings!=1?x.servings+' serv':''].filter(Boolean).join(' · '))} ${r0(x.p)}P · ${r0(x.c)}C · ${r0(x.f)}F</small></div><div>${r0(x.cal)}</div></div>`).join('')}</div>`).join(''):'<div class="empty">Nothing logged yet. Text JIM what you ate.</div>';
const days=[...Array(7)].map((_,i)=>shift(sel,i-6)),tt=days.map(totals),mx=Math.max(g.calories*1.2,...tt.map(x=>x.cal));
$('week').innerHTML=days.map((k,i)=>`<div><div class="col ${k===sel?'sel':''} ${tt[i].cal>g.calories?'over':''}" data-k="${k}"><div style="height:${tt[i].cal/mx*100}%"></div></div>${'SMTWTFS'[parse(k).getDay()]}</div>`).join('');
const logged=tt.filter(x=>x.cal>0),avg=k=>logged.length?r0(logged.reduce((a,x)=>a+x[k],0)/logged.length):0;
$('wstats').innerHTML=`<div><b>${avg('cal').toLocaleString()}</b>avg cal</div><div><b>${avg('p')}g</b>avg protein</div><div><b>${logged.length}/7</b>days logged</div>`;
const w=D.daily.filter(x=>x.weight).sort((a,b)=>a.date<b.date?-1:1).slice(-30);
if(w.length<2)$('wt').innerHTML=w.length?`<div class="big">${w[0].weight}<span class="sub"> lb</span></div>`:'<div class="empty">No weigh-ins yet</div>';else{
const W=320,H=120,ws=w.map(x=>x.weight),lo=Math.min(...ws)-1,hi=Math.max(...ws)+1,X=i=>10+i*(W-20)/(w.length-1),Y=v=>10+(hi-v)/(hi-lo)*(H-30);
const pts=w.map((x,i)=>X(i)+','+Y(x.weight)).join(' '),d=ws[ws.length-1]-ws[0];
$('wt').innerHTML=`<div style="display:flex;justify-content:space-between;align-items:baseline"><div class="big">${ws[ws.length-1]}<span class="sub"> lb</span></div><div class="sub" style="color:${d<=0?'var(--ok)':'#ff8a8a'}">${d>0?'+':''}${d.toFixed(1)} lb since ${parse(w[0].date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div></div>
<svg viewBox="0 0 ${W} ${H}" width="100%"><defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ecbff" stop-opacity=".35"/><stop offset="1" stop-color="#8ecbff" stop-opacity="0"/></linearGradient></defs>
<polygon points="${X(0)},${H-20} ${pts} ${X(w.length-1)},${H-20}" fill="url(#wg)"/><polyline points="${pts}" fill="none" stroke="#8ecbff" stroke-width="2.5" stroke-linejoin="round"/>
${w.map((x,i)=>`<circle cx="${X(i)}" cy="${Y(x.weight)}" r="3" fill="#8ecbff"/>`).join('')}<text x="10" y="${H-4}">${w[0].date.slice(5)}</text><text x="${W-10}" y="${H-4}" text-anchor="end">${w[w.length-1].date.slice(5)}</text></svg>`}}
function status(s){$('status').textContent=s}
async function api(extra){const c=cfg();const u=c.url+'?api=1&key='+encodeURIComponent(c.key)+(extra||'');
const r=await fetch(u,{redirect:'follow'});const j=await r.json();if(!j.ok)throw new Error(j.error||'error');return j.data}
async function load(){if(!cfg().url)return;status('Updating…');try{const d=await api();D=d;LS.setItem('jim_data',JSON.stringify(d));status('Updated '+new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}));render()}
catch(e){status(e.message==='unauthorized'?'Token rejected – tap Change connection':'Offline – showing saved data');}}
function hide(){const s=$('splash');s.style.opacity=0;setTimeout(()=>s.remove(),380)}
function show(){$('setup').style.display='none';$('app').style.display='block'}
$('sGo').onclick=async()=>{LS.setItem('jim_url',$('sUrl').value.trim());LS.setItem('jim_key',$('sKey').value.trim());$('sErr').textContent='Connecting…';
try{D=await api();LS.setItem('jim_data',JSON.stringify(D));show();render();status('Connected')}catch(e){$('sErr').textContent='Could not connect: '+e.message+'. Check the link, the token, and that access is set to Anyone.'}};
$('reset').onclick=()=>{$('sUrl').value=LS.getItem('jim_url')||'';$('sKey').value='';$('app').style.display='none';$('setup').style.display='block'};
$('prev').onclick=()=>{sel=shift(sel,-1);render()};$('next').onclick=()=>{if(sel<D.today){sel=shift(sel,1);render()}};$('ref').onclick=load;
$('week').onclick=e=>{const c=e.target.closest('.col');if(c){sel=c.dataset.k;render()}};
document.querySelectorAll('.qa button').forEach(b=>b.onclick=async()=>{const f=b.dataset.f,inp=f==='weight'?$('qW'):$('qH'),v=parseFloat(inp.value);if(!v)return;
$('msg').textContent='Saving…';try{D=await api('&action=add&date='+sel+'&field='+f+'&value='+v);LS.setItem('jim_data',JSON.stringify(D));inp.value='';$('msg').textContent=f==='weight'?'Weight logged ✓':'Water added ✓';render()}catch(e){$('msg').textContent='Could not save: '+e.message}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)load()});setInterval(()=>{if(!document.hidden)load()},60000);
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js');
// boot: sample mode for previews (?demo=1), cached data instantly, then refresh
if(location.search.includes('demo=1')&&window.JIM_DEMO){D=window.JIM_DEMO;show();render();status('Demo data');setTimeout(hide,200);return}
const cached=LS.getItem('jim_data');
if(!cfg().url){$('setup').style.display='block';setTimeout(hide,500);return}
show();if(cached){D=JSON.parse(cached);const t=iso(new Date());if(D.today!==t){D.today=t}render();setTimeout(hide,250);load()}else{load().then(()=>setTimeout(hide,150))}
})();
