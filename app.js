const API='https://site.api.espn.com/apis/',S=API+'site/v2/sports/soccer/';
const LG=[['uefa.champions','دوري الأبطال'],['eng.1','الإنجليزي'],['esp.1','الإسباني'],['ita.1','الإيطالي'],['ger.1','الألماني'],['fra.1','الفرنسي'],['ksa.1','السعودي']];
const P=document.body.dataset.p,$=s=>document.querySelector(s),Q=new URLSearchParams(location.search);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const J=async u=>{const r=await fetch(u);if(!r.ok)throw Error(r.status);return r.json()};
const g=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
const ymd=d=>d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
const day=o=>{const d=new Date();d.setDate(d.getDate()+o);return d};
const tm=iso=>new Date(iso).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'});
const ERR='<div class="ms">تعذّر تحميل البيانات. افتح الموقع من متصفح Chrome أو Safari وتأكد من الإنترنت.</div>',LOAD='<div class="ms">جاري التحميل...</div>';
/* ===== الأسماء بالعربية (Wikidata) مع تخزين مؤقت؛ إن لم يوجد اسم عربي يبقى الإنجليزي ===== */
const AR=JSON.parse(localStorage.getItem('kl_ar')||'{}');
const N=(n,k)=>`<span data-n="${esc(n)}" data-k="${k}">${esc(n)}</span>`;
async function ar(n,k){const key=k+':'+n;if(key in AR)return AR[key];
  try{const d=await J('https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&origin=*&language=en&uselang=ar&limit=7&search='+encodeURIComponent(n));
    const r=(d.search||[]).find(x=>/football|soccer|كرة\s*(ال)?قدم|نادي|منتخب/i.test(x.description||'')),l=r&&r.display&&r.display.label;
    AR[key]=l&&l.language==='ar'?l.value:'';localStorage.setItem('kl_ar',JSON.stringify(AR));
  }catch(e){return''}return AR[key]}
function trAll(){const L=[...document.querySelectorAll('[data-n]:not([data-d])')];L.forEach(e=>e.dataset.d=1);let i=0;
  const w=async()=>{while(i<L.length){const e=L[i++],a=await ar(e.dataset.n,e.dataset.k);if(a)e.textContent=a}};for(let k=0;k<6;k++)w()}
/* ===== الهيكل: قائمة جانبية + الوضع الليلي ===== */
const NAV=[['index.html','matches','المباريات والنتائج'],['competitions.html','competitions','البطولات والدوريات'],['clubs.html','clubs','الأندية'],['news.html','news','الأخبار'],['contact.html','contact','تواصل معنا']];
const root=document.documentElement;root.dataset.theme=localStorage.getItem('kl_theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
document.body.insertAdjacentHTML('afterbegin',`<header class="top"><button class="ib" id="bg" aria-label="القائمة"><i></i><i></i><i></i></button><a class="logo" href="index.html">⚽ Naji Football</a><button class="ib" id="th" aria-label="الوضع الليلي"></button></header><div class="ov" id="ov"></div><aside class="dr" id="dr"><h3>⚽ Naji Football</h3>${NAV.map(n=>`<a href="${n[0]}" class="${n[1]===P?'on':''}">${n[2]}</a>`).join('')}</aside><main id="app"></main><footer>© Naji Football — البيانات من ESPN و Wikipedia و Wikidata</footer><div class="md" id="md"><div class="bx"><button class="x" id="x">✕</button><div id="mb"></div></div></div>`);
const dr=v=>{$('#dr').classList.toggle('on',v);$('#ov').classList.toggle('on',v)};$('#bg').onclick=()=>dr(true);$('#ov').onclick=()=>dr(false);
const icon=()=>$('#th').textContent=root.dataset.theme==='dark'?'☀️':'🌙';icon();
$('#th').onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';localStorage.setItem('kl_theme',root.dataset.theme);icon()};
const openM=h=>{$('#mb').innerHTML=h;$('#md').classList.add('on')};$('#x').onclick=()=>$('#md').classList.remove('on');$('#md').onclick=e=>{if(e.target.id==='md')$('#md').classList.remove('on')};
const hero=(t,s)=>$('#app').insertAdjacentHTML('beforebegin',`<div class="scene" id="sc"><h1>${t}</h1><p>${s}</p></div>`);
/* تفاعل: وهج يتبع المؤشر + ظهور تدريجي للعناصر */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.05});
function fx(){document.querySelectorAll('.m,.cl,.nw,.card:not(.rv)').forEach(e=>{if(!e.classList.contains('rv')){e.classList.add('rv');io.observe(e)}})}
document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.m,.cl,.nw,.card,.days button');if(c){const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px')}
  const s=$('#sc');if(s){const r=s.getBoundingClientRect();s.style.setProperty('--mx',(e.clientX-r.left)/r.width*100+'%');s.style.setProperty('--my',(e.clientY-r.top)/r.height*100+'%')}});
let pt;const mo=new MutationObserver(()=>{clearTimeout(pt);pt=setTimeout(()=>{trAll();fx()},60)});setTimeout(()=>{mo.observe($('#app'),{childList:true,subtree:true});mo.observe($('#mb'),{childList:true,subtree:true})});
const chips=(id,items,cur)=>`<div class="chips" id="${id}">${items.map(i=>`<button data-k="${i[0]}" class="${i[0]===cur?'on':''}">${i[1]}</button>`).join('')}</div>`;
const onChips=(id,fn)=>$('#'+id).querySelectorAll('button').forEach(b=>b.onclick=()=>{$('#'+id).querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));fn(b.dataset.k)});
/* شريط الأيام: أسبوع للخلف وأسبوع للأمام */
function dayStrip(cur,fn){let h='';for(let o=-7;o<=7;o++){const d=day(o);h+=`<button data-k="${o}" class="${o==cur?'on':''} ${o==0?'td':''}"><small>${d.toLocaleDateString('ar',{weekday:'short'})}</small><b>${d.toLocaleDateString('ar',{day:'numeric'})}</b><small>${d.toLocaleDateString('ar',{month:'short'})}</small></button>`}
  return `<div class="days" id="dy">${h}</div>`}
const stripGo=fn=>{const b=$('#dy');b.querySelectorAll('button').forEach(x=>x.onclick=()=>{b.querySelectorAll('button').forEach(y=>y.classList.toggle('on',y===x));x.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});fn(+x.dataset.k)});setTimeout(()=>b.querySelector('.on').scrollIntoView({inline:'center',block:'nearest'}),50)};
/* ===== بطاقة مباراة ===== */
const bc=c=>[...new Set([...(c.broadcasts||[]).flatMap(b=>b.names||[]),...(c.geoBroadcasts||[]).map(b=>g(b,'media.shortName'))].filter(Boolean))].join(' • ');
function mHtml(e,slug){
  const c=g(e,'competitions.0')||{},cs=c.competitors||[],h=cs.find(x=>x.homeAway==='home')||cs[0]||{},a=cs.find(x=>x.homeAway==='away')||cs[1]||{},ty=g(e,'status.type')||{};let mid,lb,cl='st';
  if(ty.state==='pre'){mid=`<b>${tm(e.date)}</b>`;lb='لم تبدأ'}else{mid=`<b>${esc(h.score)} - ${esc(a.score)}</b>`;if(ty.state==='in'){cl='st lv';lb='مباشر • '+esc(g(e,'status.displayClock')||'')}else lb=ty.completed?'انتهت':esc(ty.shortDetail)}
  const T=(x,k)=>`<div class="t ${k}"><img src="${esc(g(x,'team.logo'))}" alt="" loading="lazy">${N(g(x,'team.shortDisplayName')||g(x,'team.displayName'),'t')}</div>`,b=bc(c);
  return `<div class="m" data-id="${esc(e.id)}" data-lg="${slug}">${T(h,'')}<div class="sc">${mid}<div class="${cl}">${lb}</div>${b?`<div class="st">📺 ${esc(b)}</div>`:''}</div>${T(a,'a')}</div>`}
document.addEventListener('click',e=>{const m=e.target.closest('.m[data-id]');if(m)location.href='match.html?lg='+m.dataset.lg+'&id='+m.dataset.id});
async function boards(slugs,dates){const r=await Promise.allSettled(slugs.map(s=>J(S+s[0]+'/scoreboard?dates='+dates)));let h='',ok=0;
  r.forEach((x,i)=>{if(x.status!=='fulfilled')return;ok++;const ev=(x.value.events||[]).sort((a,b)=>new Date(a.date)-new Date(b.date));if(ev.length)h+=`<div class="lg">${slugs[i][1]}</div>`+ev.map(e=>mHtml(e,slugs[i][0])).join('')});
  if(!ok)throw Error('x');return h||'<div class="ms">لا توجد مباريات في هذه الفترة.</div>'}
/* ===== صفحة المباراة ===== */
const SL={possessionPct:'الاستحواذ %',totalShots:'التسديدات',shotsOnTarget:'على المرمى',wonCorners:'الركنيات',foulsCommitted:'الأخطاء',yellowCards:'بطاقات صفراء',redCards:'بطاقات حمراء',saves:'التصديات',offsides:'التسلل',accuratePasses:'تمريرات صحيحة',totalPasses:'التمريرات',passPct:'دقة التمرير %',blockedShots:'تسديدات مصدودة',effectiveTackles:'مراوغات ناجحة'};
function pitch(r){const ps=(r.roster||[]).filter(p=>p.starter).sort((a,b)=>(a.formationPlace||99)-(b.formationPlace||99));if(!ps.length)return '<div class="ms">التشكيلة غير متاحة بعد</div>';
  let rows=String(r.formation||'').split('-').map(Number).filter(Boolean);if(rows.reduce((a,b)=>a+b,0)!==ps.length-1)rows=[4,4,2];
  rows=[1,...rows];let i=0,h='';const n=rows.length;
  rows.forEach((c,ri)=>{const y=90-ri*(78/(n-1));for(let k=0;k<c&&i<ps.length;k++,i++){const p=ps[i],nm=g(p,'athlete.displayName')||'',im=g(p,'athlete.headshot.href');
    h+=`<div class="pp" style="left:${(k+1)/(c+1)*100}%;top:${y}%"><i>${im?`<img src="${esc(im)}" alt="" loading="lazy">`:esc(p.jersey||'')}</i><span>${N(nm,'p')}</span></div>`}});return `<div class="pitch">${h}</div>`}
const pl=p=>{const n=g(p,'athlete.displayName')||'';return `<div class="pl"><i>${esc(p.jersey||'')}</i><div>${N(n,'p')}<small>${esc(g(p,'position.abbreviation')||'')}</small></div></div>`};
if(P==='match'){const lg=Q.get('lg'),id=Q.get('id');hero('تفاصيل المباراة','التشكيلة والإحصائيات والمعلومات');$('#app').innerHTML=LOAD;
  (async()=>{try{const d=await J(S+lg+'/summary?event='+id),c=g(d,'header.competitions.0')||{},cs=c.competitors||[],h=cs.find(x=>x.homeAway==='home')||cs[0]||{},a=cs.find(x=>x.homeAway==='away')||cs[1]||{},gi=d.gameInfo||{},v=gi.venue||{};
    const ref=(gi.officials||[]).find(o=>/referee|حكم/i.test(g(o,'position.displayName')||'')&&!/assistant|var|fourth/i.test(g(o,'position.displayName')))||(gi.officials||[])[0];
    const b=[...new Set([...(c.broadcasts||[]).flatMap(x=>x.names||[]),...(d.broadcasts||[]).map(x=>g(x,'media.shortName'))].filter(Boolean))].join(' • ');
    const I=(l,x)=>x?`<div class="card"><small>${l}</small>${x}</div>`:'';
    const L=x=>`<div><img src="${esc(g(x,'team.logos.0.href')||g(x,'team.logo'))}" alt="">${N(g(x,'team.displayName'),'t')}</div>`;
    let html=`<div class="card mh">${L(h)}<div><b>${esc(h.score||'')} - ${esc(a.score||'')}</b><div class="st" style="color:#fff">${esc(g(c,'status.type.detail')||'')}</div></div>${L(a)}</div>
    <div class="info">${I('📅 الموعد',c.date?new Date(c.date).toLocaleString('ar',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'}):'')}${I('🏟️ الملعب',esc(v.fullName||''))}${I('📍 المدينة',esc([g(v,'address.city'),g(v,'address.country')].filter(Boolean).join('، ')))}${I('📺 القنوات الناقلة',esc(b))}${I('🧑‍⚖️ الحكم',ref?N(ref.displayName||ref.fullName||'','p'):'')}</div>`;
    const R=d.rosters||[];
    if(R.length){html+='<h4>التشكيلة على أرض الملعب</h4><div class="two k">'+R.map(r=>`<div><b>${N(g(r,'team.displayName'),'t')} ${r.formation?'• '+esc(r.formation):''}</b>${pitch(r)}</div>`).join('')+'</div><h4>البدلاء</h4><div class="two">'+R.map(r=>`<div>${(r.roster||[]).filter(p=>!p.starter).map(pl).join('')}</div>`).join('')+'</div>'}
    const T=g(d,'boxscore.teams')||[];
    if(T.length>1){const A=T.find(t=>t.homeAway==='home')||T[0],B=T.find(t=>t!==A);html+='<h4>إحصائيات المباراة</h4><div class="card" style="padding:8px 14px">'+(A.statistics||[]).map(s=>{const o=(B.statistics||[]).find(z=>z.name===s.name),x=parseFloat(s.displayValue)||0,y=o?parseFloat(o.displayValue)||0:0,t=x+y||1;
      return `<div class="sr"><div><b>${esc(s.displayValue)}</b><em>${esc(SL[s.name]||s.label)}</em><b>${esc(o?o.displayValue:'-')}</b></div><div class="bar"><u style="width:${x/t*100}%"></u><u style="width:${y/t*100}%"></u></div></div>`}).join('')+'</div>'}
    $('#app').innerHTML=html}catch(e){$('#app').innerHTML=ERR}})()}
/* ===== البطولات (كتالوج + فحص التوفر + اكتشاف تلقائي) ===== */
const CAT=`eng.1|الدوري الإنجليزي الممتاز|إنجلترا|E|L
eng.2|التشامبيونشيب الإنجليزي|إنجلترا|E|L
eng.3|الدرجة الأولى الإنجليزية|إنجلترا|E|L
eng.4|الدرجة الثانية الإنجليزية|إنجلترا|E|L
esp.1|الدوري الإسباني|إسبانيا|E|L
esp.2|الدرجة الثانية الإسبانية|إسبانيا|E|L
ger.1|البوندسليغا|ألمانيا|E|L
ger.2|البوندسليغا 2|ألمانيا|E|L
ger.3|الدوري الألماني الدرجة الثالثة|ألمانيا|E|L
ita.1|الدوري الإيطالي|إيطاليا|E|L
ita.2|الدوري الإيطالي الدرجة الثانية|إيطاليا|E|L
fra.1|الدوري الفرنسي|فرنسا|E|L
fra.2|الدوري الفرنسي الدرجة الثانية|فرنسا|E|L
por.1|الدوري البرتغالي|البرتغال|E|L
por.2|الدرجة الثانية البرتغالية|البرتغال|E|L
ned.1|الدوري الهولندي|هولندا|E|L
ned.2|الدرجة الأولى الهولندية|هولندا|E|L
bel.1|الدوري البلجيكي|بلجيكا|E|L
bel.2|الدرجة الثانية البلجيكية|بلجيكا|E|L
tur.1|الدوري التركي|تركيا|E|L
tur.2|الدرجة الأولى التركية|تركيا|E|L
sco.1|الدوري الاسكتلندي|اسكتلندا|E|L
sco.2|التشامبيونشيب الاسكتلندي|اسكتلندا|E|L
gre.1|الدوري اليوناني|اليونان|E|L
aut.1|الدوري النمساوي|النمسا|E|L
sui.1|الدوري السويسري|سويسرا|E|L
den.1|الدوري الدنماركي|الدنمارك|E|L
nor.1|الدوري النرويجي|النرويج|E|L
swe.1|الدوري السويدي|السويد|E|L
pol.1|الدوري البولندي|بولندا|E|L
cze.1|الدوري التشيكي|التشيك|E|L
cro.1|الدوري الكرواتي|كرواتيا|E|L
srb.1|الدوري الصربي|صربيا|E|L
ukr.1|الدوري الأوكراني|أوكرانيا|E|L
rus.1|الدوري الروسي|روسيا|E|L
rou.1|الدوري الروماني|رومانيا|E|L
bul.1|الدوري البلغاري|بلغاريا|E|L
hun.1|الدوري المجري|المجر|E|L
svk.1|الدوري السلوفاكي|سلوفاكيا|E|L
svn.1|الدوري السلوفيني|سلوفينيا|E|L
cyp.1|الدوري القبرصي|قبرص|E|L
irl.1|الدوري الإيرلندي|إيرلندا|E|L
fin.1|الدوري الفنلندي|فنلندا|E|L
isl.1|الدوري الآيسلندي|آيسلندا|E|L
wal.1|الدوري الويلزي|ويلز|E|L
nir.1|الدوري الأيرلندي الشمالي|أيرلندا الشمالية|E|L
lux.1|الدوري اللوكسمبورغي|لوكسمبورغ|E|L
mlt.1|الدوري المالطي|مالطا|E|L
gib.1|دوري جبل طارق|جبل طارق|E|L
alb.1|الدوري الألباني|ألبانيا|E|L
bih.1|الدوري البوسني|البوسنة|E|L
mne.1|الدوري الجبل الأسود|الجبل الأسود|E|L
mkd.1|الدوري المقدوني|مقدونيا الشمالية|E|L
kos.1|الدوري الكوسوفي|كوسوفو|E|L
arm.1|الدوري الأرمني|أرمينيا|E|L
geo.1|الدوري الجورجي|جورجيا|E|L
aze.1|الدوري الأذربيجاني|أذربيجان|E|L
blr.1|الدوري البيلاروسي|بيلاروسيا|E|L
lva.1|الدوري اللاتفي|لاتفيا|E|L
ltu.1|الدوري الليتواني|ليتوانيا|E|L
est.1|الدوري الإستوني|إستونيا|E|L
mda.1|الدوري المولدوفي|مولدوفا|E|L
fro.1|الدوري الفاروي|جزر فارو|E|L
and.1|الدوري الأندوري|أندورا|E|L
smr.1|دوري سان مارينو|سان مارينو|E|L
ksa.1|الدوري السعودي|السعودية|A|L
eng.fa|كأس الاتحاد الإنجليزي|إنجلترا|E|C
eng.league_cup|كأس الرابطة الإنجليزية|إنجلترا|E|C
esp.copa_del_rey|كأس ملك إسبانيا|إسبانيا|E|C
ger.dfb_pokal|كأس ألمانيا|ألمانيا|E|C
ita.coppa_italia|كأس إيطاليا|إيطاليا|E|C
fra.coupe_de_france|كأس فرنسا|فرنسا|E|C
por.taca.portugal|كأس البرتغال|البرتغال|E|C
ned.cup|كأس هولندا|هولندا|E|C
bel.cup|كأس بلجيكا|بلجيكا|E|C
sco.cup|كأس اسكتلندا|اسكتلندا|E|C
tur.cup|كأس تركيا|تركيا|E|C
gre.cup|كأس اليونان|اليونان|E|C
uefa.champions|دوري أبطال أوروبا||E|K
uefa.europa|الدوري الأوروبي||E|K
uefa.europa.conf|دوري المؤتمر الأوروبي||E|K
uefa.super_cup|كأس السوبر الأوروبي||E|K
uefa.youth|دوري الشباب الأوروبي||E|K
uefa.nations|دوري الأمم الأوروبية||E|N
uefa.euro|كأس أمم أوروبا (اليورو)||E|N
uefa.euroq|تصفيات اليورو||E|N
uefa.euro_u21|بطولة أوروبا تحت 21 سنة||E|N
fifa.friendly|مباريات المنتخبات الودية||W|N
fifa.world|كأس العالم||W|N
fifa.cwc|كأس العالم للأندية||W|K
fifa.worldq.uefa|تصفيات كأس العالم - أوروبا||E|N
fifa.worldq.afc|تصفيات كأس العالم - آسيا||A|N
fifa.worldq.caf|تصفيات كأس العالم - أفريقيا||F|N
fifa.worldq.conmebol|تصفيات كأس العالم - أمريكا الجنوبية||M|N
fifa.worldq.concacaf|تصفيات كأس العالم - كونكاكاف||M|N
afc.champions|دوري أبطال آسيا للنخبة||A|K
afc.cup|دوري أبطال آسيا 2||A|K
caf.champions|دوري أبطال أفريقيا||F|K
caf.confed|كأس الكونفدرالية الأفريقية||F|K
caf.nations|كأس الأمم الأفريقية||F|N
concacaf.champions|كأس أبطال كونكاكاف||M|K
conmebol.libertadores|كوبا ليبرتادوريس||M|K
conmebol.sudamericana|كوبا سودأمريكانا||M|K
conmebol.america|كوبا أمريكا||M|N
concacaf.gold|الكأس الذهبية كونكاكاف||M|N`.split('\n').map(l=>{const a=l.split('|');return{s:a[0],n:a[1],c:a[2],k:a[3],t:a[4]}});
const CN={E:'أوروبا',A:'آسيا',F:'أفريقيا',M:'الأمريكتان',W:'عالمي'},TY={L:'الدوريات',C:'الكؤوس المحلية',K:'بطولات الأندية',N:'بطولات المنتخبات'};
const BAN=/(^|\.)(egy|sdn)\b|egypt|sudan|مصر|السودان/i;
const jl=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const FOL=()=>jl('kl_fol',[]),OK=jl('kl_ok',{}),DS=jl('kl_disc',{});
const allC=()=>[...CAT,...Object.keys(DS).map(s=>({s,n:DS[s],c:'',k:'W',t:'K',x:1}))].filter(c=>!BAN.test(c.s)&&!BAN.test(c.n));
const cinfo=s=>allC().find(c=>c.s===s)||{s,n:s,c:'',k:'W',t:'L'};
const toggleF=s=>{let f=FOL();f=f.includes(s)?f.filter(x=>x!==s):[...f,s];localStorage.setItem('kl_fol',JSON.stringify(f))};
/* ===== المباريات ===== */
if(P==='matches'){hero('المباريات والنتائج','نتائج الأسبوع الماضي ومباريات الأسبوع القادم');let cur=0,t;
  $('#app').innerHTML=dayStrip(0)+'<div id="o"></div>';
  const ld=async()=>{clearTimeout(t);try{$('#o').innerHTML=await boards(FOL().length?FOL().map(s=>[s,esc(cinfo(s).n)]):LG,ymd(day(cur)))}catch(e){$('#o').innerHTML=ERR}t=setTimeout(ld,30000)};
  stripGo(o=>{cur=o;$('#o').innerHTML=LOAD;ld()});$('#o').innerHTML=LOAD;ld()}
async function probe(c){const o=OK[c.s];if(o&&Date.now()-o[0]<432e6)return o[1];let v=0,lg='';try{const d=await J(S+c.s+'/scoreboard');if(d.leagues||d.events){v=1;lg=g(d,'leagues.0.logos.0.href')||''}}catch(e){}
  OK[c.s]=[Date.now(),v,lg];localStorage.setItem('kl_ok',JSON.stringify(OK));return v}
async function discover(fn){if(DS._t&&Date.now()-DS._t<864e6)return;try{const d=await J('https://sports.core.api.espn.com/v2/sports/soccer/leagues?limit=500'),known=new Set(CAT.map(c=>c.s));
  const L=(d.items||[]).map(i=>({s:(/\/leagues\/([^?/]+)/.exec(i.$ref)||[])[1],u:(i.$ref||'').replace('http:','https:')})).filter(x=>x.s&&!known.has(x.s)&&!BAN.test(x.s));let i=0;
  const w=async()=>{while(i<L.length){const x=L[i++];try{const r=await J(x.u),nm=r.name||r.abbreviation;if(nm&&!BAN.test(nm)){DS[x.s]=nm;fn()}}catch(e){}}};await Promise.all([w(),w(),w(),w(),w(),w()]);DS._t=Date.now();localStorage.setItem('kl_disc',JSON.stringify(DS))}catch(e){}}
if(P==='competitions'){hero('البطولات والدوريات','كل البطولات المتاحة من مزود البيانات — اتبع ما تريد');let ty='',kn='',co='',q='';
  $('#app').innerHTML='<input id="q" placeholder="🔍 ابحث عن بطولة" style="margin-bottom:10px"><div class="chips" id="ct"></div><div class="chips" id="cn"></div><select id="cc" class="sel"></select><div class="grid" id="gr" style="margin-top:12px"></div><div class="ms" id="ld"></div>';
  const ch=(id,o,cur,f)=>{$(id).innerHTML=Object.entries(o).map(e=>`<button data-k="${e[0]}" class="${e[0]===cur?'on':''}">${e[1]}</button>`).join('');$(id).querySelectorAll('button').forEach(b=>b.onclick=()=>{f(b.dataset.k);draw()})};
  function draw(){const ok=allC().filter(c=>OK[c.s]&&OK[c.s][1]),fl=FOL();ch('#ct',{'':'الكل',F:'★ المتابَعة',...TY},ty,v=>ty=v);ch('#cn',{'':'كل القارات',...CN},kn,v=>kn=v);
    const cs=[...new Set(ok.map(c=>c.c).filter(Boolean))].sort();$('#cc').innerHTML='<option value="">كل الدول</option>'+cs.map(x=>`<option ${x===co?'selected':''}>${x}</option>`).join('');$('#cc').onchange=e=>{co=e.target.value;draw()};
    const L=ok.filter(c=>(!ty||(ty==='F'?fl.includes(c.s):c.t===ty))&&(!kn||c.k===kn)&&(!co||c.c===co)&&(!q||c.n.includes(q)||c.s.includes(q.toLowerCase())));
    $('#gr').innerHTML=L.map(c=>`<div class="cl" data-s="${c.s}"><button class="fv" data-f="${c.s}">${fl.includes(c.s)?'★':'☆'}</button><img src="${esc(OK[c.s][2])}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">${c.x?N(c.n,'t'):esc(c.n)}<div class="st">${esc(c.c)}</div></div>`).join('')||'<div class="ms">لا توجد بطولات مطابقة.</div>';
    $('#gr').querySelectorAll('.cl').forEach(e=>e.onclick=ev=>{const f=ev.target.closest('.fv');if(f){toggleF(f.dataset.f);draw()}else location.href='competition.html?lg='+e.dataset.s})}
  $('#q').oninput=e=>{q=e.target.value.trim();draw()};
  (async()=>{const L=allC();$('#ld').textContent='جاري التحقق من توفر البيانات...';let i=0;const w=async()=>{while(i<L.length){const c=L[i++];await probe(c);if(i%8==0)draw()}};await Promise.all([w(),w(),w(),w(),w(),w(),w(),w()]);draw();$('#ld').textContent='';
    await discover(()=>{});const X=allC().filter(c=>c.x&&!OK[c.s]);i=0;await Promise.all([1,2,3,4,5,6].map(async()=>{while(i<X.length){await probe(X[i++])}}));draw()})();draw()}
if(P==='competition'){const lg=Q.get('lg'),c=cinfo(lg);hero(esc(c.n),esc(c.c||CN[c.k]||''));let tab='st',wk=0;
  const TB={st:'الترتيب',fx:'المباريات',sc:'الهدافون',as:'صناعة الأهداف',ts:'إحصائيات الفرق',nw:'الأخبار'};
  $('#app').innerHTML=`<div class="wk" style="margin-top:0"><button id="fl"></button></div>`+chips('tb',Object.entries(TB),tab)+'<div id="o"></div>';
  const fb=()=>$('#fl').textContent=FOL().includes(lg)?'★ تتابعها':'☆ تابع البطولة';fb();$('#fl').onclick=()=>{toggleF(lg);fb()};
  const stat=(e,n)=>{const s=(e.stats||[]).find(x=>x.name===n);return s?s.displayValue:'-'};
  const stand=async()=>{const d=await J(API+'v2/sports/soccer/'+lg+'/standings'),ch=g(d,'children')||[];let h='';
    (ch.length?ch:[d]).forEach(gr=>{const en=(g(gr,'standings.entries')||[]).slice().sort((a,b)=>(+stat(a,'rank')||99)-(+stat(b,'rank')||99));if(en.length)h+=`${gr.name&&ch.length>1?'<h4>'+esc(gr.name)+'</h4>':''}<div class="card" style="padding:8px;overflow-x:auto"><table class="tb"><tr><th>#</th><th style="text-align:right">الفريق</th><th>لعب</th><th>ف</th><th>ت</th><th>خ</th><th>له</th><th>عليه</th><th>فارق</th><th>نقاط</th></tr>`+en.map((e,i)=>`<tr><td>${i+1}</td><td><img src="${esc(g(e,'team.logos.0.href'))}" alt="">${N(g(e,'team.shortDisplayName')||g(e,'team.displayName'),'t')}</td><td>${stat(e,'gamesPlayed')}</td><td>${stat(e,'wins')}</td><td>${stat(e,'ties')}</td><td>${stat(e,'losses')}</td><td>${stat(e,'pointsFor')}</td><td>${stat(e,'pointsAgainst')}</td><td>${stat(e,'pointDifferential')}</td><td><b>${stat(e,'points')}</b></td></tr>`).join('')+'</table></div>'});
    return h||'<div class="ms">الترتيب غير متاح لهذه البطولة.</div>'};
  const teamStats=async()=>{const d=await J(API+'v2/sports/soccer/'+lg+'/standings'),en=(g(d,'children')||[d]).flatMap(x=>g(x,'standings.entries')||[]).sort((a,b)=>(+stat(b,'pointsFor')||0)-(+stat(a,'pointsFor')||0));if(!en.length)return'<div class="ms">غير متاحة.</div>';
    return '<div class="card" style="padding:8px;overflow-x:auto"><table class="tb"><tr><th>#</th><th style="text-align:right">الفريق</th><th>أهداف له</th><th>أهداف عليه</th><th>معدل التسجيل</th><th>معدل الاستقبال</th></tr>'+en.map((e,i)=>{const p=+stat(e,'gamesPlayed')||0,f=+stat(e,'pointsFor')||0,a=+stat(e,'pointsAgainst')||0;return `<tr><td>${i+1}</td><td><img src="${esc(g(e,'team.logos.0.href'))}" alt="">${N(g(e,'team.shortDisplayName')||g(e,'team.displayName'),'t')}</td><td><b>${f}</b></td><td>${a}</td><td>${p?(f/p).toFixed(2):'-'}</td><td>${p?(a/p).toFixed(2):'-'}</td></tr>`}).join('')+'</table></div>'};
  const leaders=async(re)=>{let d=null;for(const u of [S+lg+'/leaders','https://site.web.api.espn.com/apis/site/v2/sports/soccer/'+lg+'/leaders']){try{d=await J(u);if(d&&(d.leaders||d.categories))break}catch(e){}}
    const cat=((d&&(d.leaders||d.categories))||[]).find(x=>re.test((x.name||'')+(x.displayName||'')));const L=cat&&(cat.leaders||[]);
    if(!L||!L.length)return'<div class="ms">هذه الإحصائية غير متوفرة لهذه البطولة من مزود البيانات.</div>';
    return '<div class="card" style="padding:8px 14px">'+L.slice(0,25).map((x,i)=>`<div class="pl"><b style="width:22px">${i+1}</b><i>${g(x,'athlete.headshot.href')?`<img src="${esc(x.athlete.headshot.href)}" alt="" loading="lazy">`:''}</i><div>${N(g(x,'athlete.displayName')||'','p')}<small>${N(g(x,'team.displayName')||g(x,'athlete.team.displayName')||'','t')}</small></div><b style="margin-inline-start:auto;color:var(--gd)">${esc(x.displayValue||x.value)}</b></div>`).join('')+'</div>'};
  const news=async()=>{const a=(await J(S+lg+'/news')).articles||[];return a.length?a.map(x=>`<a class="nw" href="${esc(g(x,'links.web.href')||'#')}" target="_blank" rel="noopener noreferrer">${g(x,'images.0.url')?`<img src="${esc(x.images[0].url)}" alt="" loading="lazy">`:''}<div><h3>${esc(x.headline)}</h3><p>${esc(x.description||'')}</p></div></a>`).join(''):'<div class="ms">لا توجد أخبار.</div>'};
  async function fixt(){const a=day(wk*7-3),b=day(wk*7+3);return `<div class="wk"><button id="pv">→ السابق</button><b>${a.toLocaleDateString('ar',{day:'numeric',month:'short'})} – ${b.toLocaleDateString('ar',{day:'numeric',month:'short'})}</b><button id="nx">التالي ←</button></div>`+await boards([[lg,esc(c.n)]],ymd(a)+'-'+ymd(b))}
  async function show(){$('#o').innerHTML=LOAD;try{$('#o').innerHTML=tab==='st'?await stand():tab==='fx'?await fixt():tab==='ts'?await teamStats():tab==='sc'?await leaders(/goal|scor/i):tab==='as'?await leaders(/assist/i):await news();
    if(tab==='fx'){$('#pv').onclick=()=>{wk--;show()};$('#nx').onclick=()=>{wk++;show()}}}catch(e){$('#o').innerHTML=ERR}}
  onChips('tb',k=>{tab=k;show()});show()}

/* ===== الأندية ===== */
if(P==='clubs'){hero('الأندية','اختر نادياً لعرض نبذته ولاعبيه');let lg='eng.1';$('#app').innerHTML=chips('lc',LG,lg)+'<div class="grid" id="gr"></div>';
  async function wiki(n){try{const q=await J('https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch='+encodeURIComponent(n+' football club'));const t=g(q,'query.search.0.title');if(!t)return'';return(await J('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(t))).extract||''}catch(e){return''}}
  async function club(id){openM(LOAD);try{const [d,r]=await Promise.all([J(S+lg+'/teams/'+id),J(S+lg+'/teams/'+id+'/roster').catch(()=>({}))]),t=d.team||{},w=await wiki(t.displayName||'');let pl=r.athletes||[];if(pl[0]&&pl[0].items)pl=pl.flatMap(x=>x.items);const by={};pl.forEach(p=>{const k=g(p,'position.displayName')||'لاعبون';(by[k]=by[k]||[]).push(p)});
    openM(`<div class="hd"><img src="${esc(g(t,'logos.0.href'))}" alt=""><h2>${N(t.displayName,'t')}</h2><div class="st">${esc(g(t,'standingSummary')||'')} ${g(t,'franchise.venue.fullName')?'• ملعب: '+esc(t.franchise.venue.fullName):''}</div></div>${w?`<h4>نبذة وتاريخ</h4><p dir="ltr" style="text-align:left;line-height:1.7;font-size:14px">${esc(w)}</p>`:''}<h4>اللاعبون</h4>`+(Object.keys(by).map(k=>`<b class="st">${esc(k)}</b><div class="two">${by[k].map(p=>`<div class="pl"><i>${g(p,'headshot.href')?`<img src="${esc(p.headshot.href)}" alt="" loading="lazy">`:esc(p.jersey||'')}</i><div>${N(p.displayName,'p')}<small>${esc(p.jersey||'')} ${p.age?'• '+esc(p.age)+' سنة':''}</small></div></div>`).join('')}</div>`).join('')||'<div class="ms">قائمة اللاعبين غير متاحة.</div>'))}catch(e){openM(ERR)}}
  async function teams(){$('#gr').innerHTML=LOAD;try{const d=await J(S+lg+'/teams'),ts=(g(d,'sports.0.leagues.0.teams')||[]).map(x=>x.team);if(!ts.length)throw Error('x');$('#gr').innerHTML=ts.map(t=>`<div class="cl" data-id="${esc(t.id)}"><img src="${esc(g(t,'logos.0.href'))}" alt="" loading="lazy">${N(t.displayName,'t')}</div>`).join('');$('#gr').querySelectorAll('.cl').forEach(c=>c.onclick=()=>club(c.dataset.id))}catch(e){$('#gr').innerHTML=ERR}}
  onChips('lc',k=>{lg=k;teams()});teams()}
/* ===== الأخبار ===== */
if(P==='news'){hero('الأخبار','آخر أخبار كرة القدم من ESPN (بالإنجليزية)');let lg='eng.1';$('#app').innerHTML=chips('lc',LG,lg)+'<div id="o"></div>';
  const ld=async()=>{$('#o').innerHTML=LOAD;try{const a=(await J(S+lg+'/news')).articles||[];if(!a.length)throw Error('x');$('#o').innerHTML=a.map(x=>`<a class="nw" href="${esc(g(x,'links.web.href')||'#')}" target="_blank" rel="noopener noreferrer">${g(x,'images.0.url')?`<img src="${esc(x.images[0].url)}" alt="" loading="lazy">`:''}<div><h3>${esc(x.headline)}</h3><p>${esc(x.description||'')}</p></div></a>`).join('')}catch(e){$('#o').innerHTML=ERR}};
  onChips('lc',k=>{lg=k;ld()});ld()}
/* ===== تواصل معنا ===== */
if(P==='contact'){hero('تواصل معنا','اكتب رسالتك وسنقرأها');
  $('#app').innerHTML='<form class="card" id="f"><input id="n" placeholder="الاسم" required><input id="e" type="email" placeholder="البريد الإلكتروني" required><textarea id="t" rows="5" placeholder="رسالتك" required minlength="10"></textarea><button class="btn">إرسال</button><div class="ms" id="r"></div></form>';
  $('#f').onsubmit=e=>{e.preventDefault();const a=JSON.parse(localStorage.getItem('kl_msgs')||'[]');a.push({n:$('#n').value,e:$('#e').value,t:$('#t').value,d:new Date().toISOString()});localStorage.setItem('kl_msgs',JSON.stringify(a));$('#f').reset();$('#r').textContent='تم حفظ رسالتك. شكراً لتواصلك.'}}
