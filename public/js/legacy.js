var A=window.__A;
var NE=null;var MN=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function ar(n){return String(n).replace(/\d/g,function(d){return '٠١٢٣٤٥٦٧٨٩'[d]})}
function fd(s){var a=s.split('-');return ar(+a[2])+' '+MN[a[1]-1]+' '+ar(a[0])}
function months(s){var a=s.split('-'),t=new Date(),m=(t.getFullYear()-a[0])*12+t.getMonth()+1-a[1];if(t.getDate()<+a[2])m--;return Math.max(m,0)}
function span(s){var m=months(s);
 if(m<1)return 'أقل من شهر';
 if(m<24){return m==1?'شهر':m==2?'شهران':m<=10?ar(m)+' أشهر':ar(m)+' شهرًا'}
 var y=Math.floor(m/12);return y<=10?ar(y)+' سنوات':ar(y)+' سنة'}
var P=__D.P;
var B=__D.B;
var AV=__D.AV;
function fb(n,z){return '<svg viewBox="0 0 100 100" width="'+z+'" height="'+z+'" style="border-radius:50%;flex:none"><rect width="100" height="100" fill="#e7eee6"/><circle cx="50" cy="40" r="19" fill="#c9c3b2"/><path d="M14 100Q16 68 50 68Q84 68 86 100Z" fill="#c9c3b2"/></svg>'}
function av(n,z){var p=AV[n];if(!p)return fb(n,z);
var k=p.k,ey=k?52:46,sy=k?80:72,c=p.hj||(p.gh?'#f3efef':0),bd=p.bd,my=bd=='f'?62:bd=='g'?60:57,
s='<svg viewBox="0 0 100 100" width="'+z+'" height="'+z+'" style="border-radius:50%;flex:none"><rect width="100" height="100" fill="#e7eee6"/>';
if(p.st=='gb')s+='<path d="M27 42Q22 78 36 86L64 86Q78 78 73 42Z" fill="'+p.hr+'"/><ellipse cx="77" cy="62" rx="7" ry="11" fill="'+p.hr+'"/>';
if(p.st=='cp')[[24,30],[76,30],[30,40],[70,40]].forEach(function(q){s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="9" fill="'+p.hr+'"/>'});
s+='<path d="M10 100Q12 '+sy+' 50 '+sy+'Q88 '+sy+' 90 100Z" fill="'+p.tp+'"/><rect x="43" y="'+(k?62:60)+'" width="14" height="16" fill="'+p.sk+'"/>';
if(c){var d0='M50 12Q82 12 82 50Q84 72 88 90Q50 98 12 90Q16 72 18 50Q18 12 50 12Z';
s+='<clipPath id="gc"><path d="'+d0+'"/></clipPath><path d="'+d0+'" fill="'+c+'"/>';
if(p.gh){s+='<g clip-path="url(#gc)" stroke="#d23b45" stroke-width="1.6" stroke-dasharray="1.6 3.4">';for(var y=16;y<96;y+=5)s+='<path d="M8 '+y+'H92"/>';s+='</g><path d="M28 24Q50 12 72 24" stroke="#1c1c1c" stroke-width="5" fill="none"/>'}}
s+='<ellipse cx="50" cy="'+ey+'" rx="'+(k?21:19)+'" ry="'+(k?21:22)+'" fill="'+p.sk+'"/>';
if(p.hj)s+='<path d="M30 42Q50 16 70 42Q50 31 30 42Z" fill="'+p.hj+'"/>';
if(p.st=='short')s+='<path d="M30 42Q27 20 50 20Q73 20 70 42Q66 30 50 31Q34 30 30 42Z" fill="'+p.hr+'"/>';
if(p.st=='boy')s+='<path d="M29 48Q25 24 50 24Q75 24 71 48Q64 36 50 37Q36 36 29 48Z" fill="'+p.hr+'"/>';
if(p.st=='gb')s+='<path d="M29 48Q27 24 50 24Q73 24 71 48Q60 33 50 40Q40 33 29 48Z" fill="'+p.hr+'"/>';
if(p.st=='cp')[[40,27],[50,23],[60,27]].forEach(function(q){s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="8" fill="'+p.hr+'"/>'});
if(bd=='f')s+='<path d="M31 50Q31 78 50 78Q69 78 69 50Q62 63 50 63Q38 63 31 50Z" fill="'+p.bc+'"/><path d="M41 58Q50 53 59 58Q50 60 41 58Z" fill="'+p.bc+'"/>';
if(bd=='s')s+='<path d="M32 52Q33 72 50 72Q67 72 68 52Q62 62 50 62Q38 62 32 52Z" fill="'+p.bc+'" opacity=".75"/>';
if(bd=='g')s+='<path d="M42 56Q50 52 58 56Q50 58 42 56Z" fill="'+p.bc+'"/><ellipse cx="50" cy="67" rx="6" ry="5" fill="'+p.bc+'"/>';
if(p.f||k)s+='<circle cx="35" cy="'+(ey+9)+'" r="4" fill="#e58a8a" opacity=".25"/><circle cx="65" cy="'+(ey+9)+'" r="4" fill="#e58a8a" opacity=".25"/>';
s+='<circle cx="42" cy="'+ey+'" r="'+(k?3:2.4)+'" fill="#2a1c14"/><circle cx="58" cy="'+ey+'" r="'+(k?3:2.4)+'" fill="#2a1c14"/>';
s+='<path d="M37 '+(ey-7)+'Q42 '+(ey-9)+' 47 '+(ey-7)+'M53 '+(ey-7)+'Q58 '+(ey-9)+' 63 '+(ey-7)+'" stroke="'+(p.hr||'#2e2018')+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
s+='<path d="M50 '+(ey+2)+'Q47 '+(ey+9)+' 51 '+(ey+9)+'" stroke="rgba(0,0,0,.22)" stroke-width="1.4" fill="none"/>';
s+='<path d="M44 '+my+'Q50 '+(my+5)+' 56 '+my+'" stroke="'+(bd=='f'?'#efd2c2':p.f?'#b4535a':'#7a3f33')+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
if(p.gl){var g=p.gc||'#1d1d20';s+='<circle cx="41" cy="'+ey+'" r="7" fill="none" stroke="'+g+'" stroke-width="1.7"/><circle cx="59" cy="'+ey+'" r="7" fill="none" stroke="'+g+'" stroke-width="1.7"/><path d="M48 '+ey+'H52" stroke="'+g+'" stroke-width="1.6"/>'}
return s+'</svg>'}
var HC=__D.HC,CITY={'علي':HC['علي'],'حسنية':HC['علي']};
B.forEach(function(x){CITY[x.n]=HC[x.n];if(x.s)CITY[x.s]=HC[x.n];x.k.forEach(function(q){CITY[q[0]]=HC[x.n]})});
var sh=document.getElementById('sheet'),sd=document.getElementById('shade');
function show(n,role,info,c,b){
 document.getElementById('sn').textContent=n;document.getElementById('sav').innerHTML=av(n,84);
 document.getElementById('sr').textContent=role;
 document.getElementById('sx').textContent=info||'';
 document.getElementById('sb').innerHTML=b?'تاريخ الميلاد: <b>'+fd(b)+'</b>':'';
 document.getElementById('sa').innerHTML=b?'العمر: <b>'+span(b)+'</b>':'';var sc=document.getElementById('sc');sc.innerHTML=CITY[n]?'المدينة: <b>'+CITY[n]+'</b>':'';
 sh.style.setProperty('--c',c||'var(--gold)');sh.classList.add('show');sd.classList.add('show')}
function hide(){sh.classList.remove('show');sd.classList.remove('show')}
sd.onclick=hide;document.getElementById('close').onclick=hide;
document.getElementById('pa').onclick=function(){show('علي','الجد، رب الأسرة','تزوج حسنية في '+fd(P.w),null,P.a)};
document.getElementById('pm').onclick=function(){show('حسنية','الجدة، ربة الأسرة','تزوجت عليًا في '+fd(P.w),null,P.m)};
document.getElementById('pmar').textContent='تزوجا في '+fd(P.w)+' · منذ '+span(P.w);
function chip(t,txt,role,info,c,b){var e=document.createElement('button');e.className='chip';e.innerHTML=av(txt,30)+'<span>'+txt+'</span>';e.onclick=function(){show(txt,role,info,c,b)};t.appendChild(e)}
function el(c,t,p){var e=document.createElement('div');e.className=c;if(t)e.textContent=t;p.appendChild(e);return e}
var list=document.getElementById('list');
B.forEach(function(x,i){
 var c='hsl('+x.h+' 50% 42%)';
 var d=document.createElement('div');d.className='branch';d.style.setProperty('--c',c);
 var h=document.createElement('button');h.className='head';
 var k=x.k.length,cnt=k?(k==1?'حفيد واحد':k==2?'حفيدان':ar(k)+' أحفاد'):'';
 h.innerHTML=av(x.n,40)+'<span class="nm">'+x.n+''+'</span><span class="badge">'+cnt+'</span><span class="arrow">▾</span>';
 h.onclick=function(){var was=d.classList.contains('open');document.querySelectorAll('.branch.open').forEach(function(e){e.classList.remove('open')});if(!was){d.classList.add('open');setTimeout(function(){d.scrollIntoView({behavior:'smooth',block:'start'})},60)}};d.style.scrollMarginTop='12px';d.appendChild(h);
 var b=el('body','',d);el('dt','📍 '+CITY[x.n],b);
 el('lbl',x.last?'آخر العنقود':(x.g=='f'?'ابنة علي وحسنية':'ابن علي وحسنية'),b);
 var r1=el('row','',b);
 chip(r1,x.n,(x.g=='f'?'ابنة':'ابن')+' علي وحسنية · الترتيب '+ar(i+1)+' من ٧',x.s?(x.g=='f'?'زوجها ':'زوجته ')+x.s:'',c,x.b);
 el('lbl',x.g=='f'?'الزوج':'الزوجة',b);
 var r2=el('row','',b);
 if(x.s){chip(r2,x.s,(x.g=='f'?'زوج ':'زوجة ')+x.n,'',c,x.sb);
  el('dt','تاريخ الزواج: '+fd(x.w)+' · منذ '+span(x.w),b)}
 else el('chip ghost',x.soon?'قريبًا إن شاء الله':'—',r2);
 if(k){el('lbl','الأبناء',b);var r3=el('row','',b);
  x.k.forEach(function(q){chip(r3,q[0],(q[1]=='f'?'حفيدة':'حفيد')+' علي وحسنية',(q[1]=='f'?'ابنة ':'ابن ')+x.n+' و'+x.s,c,q[2])})}
 list.appendChild(d)});
document.getElementById('pa').innerHTML=av('علي',68)+'علي<small>الأب</small>';document.getElementById('pm').innerHTML=av('حسنية',68)+'حسنية<small>الأم</small>';

function yu(n){return n==1?'سنة واحدة':n==2?'سنتين':n<=10?ar(n)+' سنوات':ar(n)+' سنة'}
function du(n){return n==0?'اليوم':n==1?'غدًا':n==2?'بعد يومين':n<=10?'بعد '+ar(n)+' أيام':'بعد '+ar(n)+' يومًا'}
function gu(n){return n==1?'يوم واحد':n==2?'يومين':n<=10?ar(n)+' أيام':ar(n)+' يومًا'}
function evs(){var a=[{n:'علي',t:'b',d:P.a},{n:'حسنية',t:'b',d:P.m},{n:'علي وحسنية',t:'w',d:P.w}];
B.forEach(function(x){a.push({n:x.n,t:'b',d:x.b});if(x.s){a.push({n:x.s,t:'b',d:x.sb},{n:x.n+' و'+x.s,t:'w',d:x.w})}x.k.forEach(function(q){a.push({n:q[0],t:'b',d:q[2]})})});return a}
function nxt(e){var a=e.d.split('-'),n=new Date(),t0=new Date(n.getFullYear(),n.getMonth(),n.getDate()),y=t0.getFullYear(),dt=new Date(y,a[1]-1,a[2]);if(dt<t0){y++;dt=new Date(y,a[1]-1,a[2])}return{days:Math.round((dt-t0)/864e5),yrs:y-a[0]}}
function ic(e){return e.t=='b'?'🎂':'💍'}
(function(){
var all=evs().map(function(e){var r=nxt(e);e.days=r.days;e.yrs=r.yrs;return e}).sort(function(a,b){return a.days-b.days});
function line(e){var a=e.d.split('-');return ic(e)+' '+(e.t=='b'?'عيد ميلاد '+e.n+' · يُتمّ '+yu(e.yrs):'ذكرى زواج '+e.n+' · '+yu(e.yrs))+' — '+ar(+a[2])+' '+MN[a[1]-1]+' ('+du(e.days)+')'}
var eb=document.getElementById('ev'),el=document.getElementById('evl');
NE=all[0];eb.innerHTML='<small>أقرب مناسبة · اضغط لعرض التالية</small><b>'+line(all[0])+'</b><span class="evc" id="evc">🎁 اصنع بطاقة لهذه المناسبة</span>';
el.innerHTML=all.slice(1,7).map(function(e){return '<div>'+line(e)+'</div>'}).join('');
eb.onclick=function(){el.classList.toggle('open')};
var tl=evs().sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:0}),h='',yr='',ms=tl.filter(function(e){return e.t=='w'}),best=null,mc={};
for(var i=1;i<ms.length;i++){var g=Math.round((new Date(ms[i].d)-new Date(ms[i-1].d))/864e5);if(g<=60&&(!best||g<best.g))best={g:g,a:ms[i-1],b:ms[i]}}
ms.forEach(function(e){var m=+e.d.split('-')[1];mc[m]=(mc[m]||0)+1});
var mm=0;for(var k in mc)if(mc[k]>(mc[mm]||0))mm=k;
var bs=tl.filter(function(e){return e.t=='b'}),nb=bs[bs.length-1];
if(best)h+='<div class="ins">💍 زواج '+best.a.n+' وزواج '+best.b.n+' جاءا في '+ar(best.a.d.slice(0,4))+' بفارق '+gu(best.g)+' فقط</div>';
if(mc[mm]>=3)h+='<div class="ins">📅 '+ar(mc[mm])+' من '+ar(ms.length)+' زيجات في العائلة كانت في شهر '+MN[mm-1]+'</div>';
h+='<div class="ins">👶 أحدث أفراد العائلة: '+nb.n+'، وُلد في '+fd(nb.d)+'</div><div class="tlw">';
tl.forEach(function(e){var y=e.d.slice(0,4);if(y!=yr){yr=y;h+='<div class="yr">'+ar(y)+'</div>'}h+='<div class="ti">'+ic(e)+' '+(e.t=='b'?'ولادة ':'زواج ')+e.n+'<div class="dt">'+fd(e.d)+'</div></div>'});
document.getElementById('tl').innerHTML=h+'</div>';
var tb=document.getElementById('tlb'),tp=document.getElementById('tl');
tb.onclick=function(){var o=tp.classList.toggle('open');tb.classList.toggle('on',o)};
var fs=document.getElementById('fs'),R=document.documentElement;
function big(on){R.classList.toggle('big',on);fs.textContent=on?'أ−':'أ+';fs.setAttribute('aria-label',on?'تصغير الخط':'تكبير الخط')}
try{if(localStorage.getItem('big')=='1')big(true)}catch(e){}
fs.onclick=function(){var on=!R.classList.contains('big');big(on);try{localStorage.setItem('big',on?'1':'0')}catch(e){}};
})();

var G={'علي':'m','حسنية':'f'};
B.forEach(function(x){G[x.n]=x.g;if(x.s)G[x.s]=x.g=='f'?'m':'f';x.k.forEach(function(q){G[q[0]]=q[1]})});
(function(){var D=[['رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا','الإسراء: ٢٤'],['رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ','إبراهيم: ٤١'],['رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ','الأحقاف: ١٥']],d=D[Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5)%3];
document.getElementById('dua').innerHTML='<small>دعاء لوالدينا · '+d[1]+'</small>'+d[0]+'<div class="pb"><button id="dwa">إرسال عبر واتساب</button><button id="dcp">نسخ الدعاء</button></div>';
var tx='«'+d[0]+'»\n('+d[1]+')\n\n🌿 دعاء لوالدينا — عائلة علي وحسنية';
document.getElementById('dwa').onclick=function(){var w=null;try{w=window.open('https://wa.me/?text='+encodeURIComponent(tx),'_blank')}catch(e){}if(!w&&navigator.share)navigator.share({text:tx}).catch(function(){})};
document.getElementById('dcp').onclick=function(){var b=this;try{navigator.clipboard.writeText(tx).then(function(){b.textContent='تم النسخ ✓'},function(){b.textContent='تعذّر النسخ'})}catch(e){b.textContent='تعذّر النسخ'}};
})();
(function(){
var cy=new Date().getFullYear(),r=document.getElementById('tmr'),b=document.getElementById('tmb'),p=document.getElementById('tm');
r.min=1960;r.max=cy;r.step=1;r.value=2000;
var ppl=evs().filter(function(e){return e.t=='b'}).sort(function(a,c){return a.d<c.d?-1:1}),mar=evs().filter(function(e){return e.t=='w'});
function draw(){var y=+r.value,h='',n=0,u=0;document.getElementById('tmy').textContent=ar(y);
ppl.forEach(function(e){var a=y-e.d.slice(0,4);if(a>=0){n++;h+='<div class="tmr">'+av(e.n,30)+'<span>'+e.n+'</span><b>'+(a==0?'وُلد هذه السنة':yu(a))+'</b></div>'}else u++});
var m=mar.filter(function(e){return +e.d.slice(0,4)<=y}).length,ev=evs().filter(function(e){return +e.d.slice(0,4)==y}).map(function(e){return (e.t=='b'?'ولادة ':'زواج ')+e.n});
document.getElementById('tmo').innerHTML='<div class="ins">👨‍👩‍👧‍👦 '+ar(n)+' أفراد · '+ar(m)+' زيجات'+(u?' · لم يولد بعد '+ar(u):'')+(ev.length?'<br>📌 في هذه السنة: '+ev.join('، '):'')+'</div>'+h}
r.oninput=draw;
var c=document.getElementById('tmc');[1987,2000,2011,2019,cy].forEach(function(y){var e=document.createElement('button');e.textContent=ar(y);e.onclick=function(){r.value=y;draw()};c.appendChild(e)});
b.onclick=function(){var o=p.classList.toggle('open');b.classList.toggle('on',o);if(o)draw()};
})();
var cb=null,cu=null,dl=null;
dl={save:function(o){return new Promise(function(r){var u=URL.createObjectURL(o.data),a=document.createElement('a');a.href=u;a.download=o.filename;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000);r()})}};
function closeCard(){document.getElementById('cv').classList.remove('show');if(cu){URL.revokeObjectURL(cu);cu=null}}
document.getElementById('cclose').onclick=closeCard;
document.getElementById('csave').onclick=function(){if(dl&&cb){dl.save({filename:'بطاقة-تهنئة.png',data:cb}).catch(function(){})}else document.getElementById('chint').textContent='اضغط مطولًا على الصورة ثم اختر «حفظ الصورة»'};
document.getElementById('cshare').onclick=function(){try{var f=new File([cb],'card.png',{type:'image/png'});navigator.share({files:[f]}).catch(function(){})}catch(e){document.getElementById('chint').textContent='المشاركة غير متاحة هنا، احفظ الصورة ثم أرسلها'}};
function mkcard(n,b){
var W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;var x=cv.getContext('2d'),f=G[n]=='f',yrs=nxt({d:b}).yrs,ff='Tajawal,Tahoma,Arial,sans-serif';
function T(t,y,sz,col,w){x.font=(w||'700')+' '+sz+'px '+ff;x.fillStyle=col;var s=sz;while(x.measureText(t).width>W-200&&s>30){s-=4;x.font=(w||'700')+' '+s+'px '+ff}x.fillText(t,W/2,y)}
function draw(im){var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#fcf6e6');g.addColorStop(1,'#efe0b8');x.fillStyle=g;x.fillRect(0,0,W,H);
x.globalAlpha=.55;[[120,160,'#e58a8a',16],[960,220,'#6fa8a0',12],[200,430,'#d4b05a',14],[900,520,'#e58a8a',10],[140,900,'#6fa8a0',14],[950,880,'#d4b05a',16],[260,1180,'#e58a8a',12],[860,1160,'#6fa8a0',14]].forEach(function(q){x.fillStyle=q[2];x.beginPath();x.arc(q[0],q[1],q[3],0,7);x.fill()});x.globalAlpha=1;
x.strokeStyle='#b08d3c';x.lineWidth=8;x.strokeRect(40,40,W-80,H-80);x.lineWidth=2;x.strokeRect(62,62,W-124,H-124);
x.textAlign='center';x.direction='rtl';T('عيد ميلاد سعيد',190,88,'#7a5a14');
x.save();x.beginPath();x.arc(540,540,230,0,7);x.clip();
if(im)x.drawImage(im,310,310,460,460);else{x.fillStyle='#e9dcae';x.fillRect(300,300,480,480);x.fillStyle='#7a5a14';x.font='700 220px '+ff;x.textBaseline='middle';x.fillText(n.charAt(0),540,560);x.textBaseline='alphabetic'}
x.restore();x.lineWidth=14;x.strokeStyle='#b08d3c';x.beginPath();x.arc(540,540,237,0,7);x.stroke();
T(n,880,116,'#1f2a24');T('عمرٌ جديد · '+yu(yrs),972,54,'#5c5a50','500');
T(f?'كل عام وأنتِ بخير':'كل عام وأنتَ بخير',1086,72,'#8a6a1e');
T(f?'أسعد الله أيامَكِ وبارك لكِ في عمرك':'أسعد الله أيامَك وبارك لك في عمرك',1166,42,'#6a665a','500');
T('عائلة علي وحسنية',1262,46,'#7a5a14');
function out(){cv.toBlob(function(bl){if(!bl)return;cb=bl;if(cu)URL.revokeObjectURL(cu);cu=URL.createObjectURL(bl);document.getElementById('cimg').src=cu;document.getElementById('chint').textContent='اضغط مطولًا على الصورة لحفظها';document.getElementById('cshare').style.display=navigator.share?'':'none';document.getElementById('csave').style.display=dl?'':'none';document.getElementById('cv').classList.add('show')},'image/png')}
try{out()}catch(e){if(im)draw(null)}}
function go(){if(AV[n]){var im=new Image();im.onload=function(){draw(im)};im.onerror=function(){draw(null)};im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(av(n,400).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '))}else draw(null)}
try{document.fonts.load('bold 40px Tajawal').then(go,go)}catch(e){go()}}

(function(){
function fu(n){return n==1?'فرد واحد':n==2?'فردان':n<=10?ar(n)+' أفراد':ar(n)+' فردًا'}
var gp={},cs={},ds={};
Object.keys(CITY).forEach(function(n){var c=CITY[n];(gp[c]=gp[c]||[]).push(n);var a=c.split(' - ');cs[a[0]]=1;ds[a[1]]=1});
var ks=Object.keys(gp).sort(function(a,b){return gp[b].length-gp[a].length}),h='<div class="ins">🌍 تتوزع العائلة على '+ar(Object.keys(cs).length)+' مدن في '+ar(Object.keys(ds).length)+' دول</div>';
ks.forEach(function(c){h+='<div class="yr">📍 '+c+' · '+fu(gp[c].length)+'</div><div class="row">'+gp[c].map(function(n){return '<span class="chip" style="--c:var(--gold);cursor:default">'+av(n,28)+'<span>'+n+'</span></span>'}).join('')+'</div>'});
document.getElementById('ct').innerHTML=h;
var b=document.getElementById('ctb'),p=document.getElementById('ct');
b.onclick=function(){var o=p.classList.toggle('open');b.classList.toggle('on',o)};
})();


(function(){
function bl(s,t){var a=atob(s),u=new Uint8Array(a.length);for(var i=0;i<a.length;i++)u[i]=a.charCodeAt(i);return new Blob([u],{type:t})}
var b=document.getElementById('pb0'),p=document.getElementById('pp'),im=document.getElementById('pimg'),h=document.getElementById('phint'),bf=document.getElementById('ppdf'),bn=document.getElementById('ppng');
b.onclick=function(){var o=p.classList.toggle('open');b.classList.toggle('on',o);if(o){if(!im.src)A.get('posterPreview').then(function(v){im.src='data:image/jpeg;base64,'+v});bf.style.display=bn.style.display=dl?'':'none';h.textContent=dl?'اضغط على الصورة لتكبيرها. هذه نسخة بتاريخ اليوم وتُحدَّث عند تغيّر الشجرة.':'اضغط على الصورة لتكبيرها، ومطولًا لحفظها.'}};
function sv(n,d){if(dl)dl.save({filename:n,data:d}).catch(function(){})}
bf.onclick=function(){A.get('posterPdf').then(function(v){sv('شجرة-عائلة-علي-وحسنية-A3.pdf',bl(v,'application/pdf'))})};
bn.onclick=function(){A.get('posterJpg').then(function(v){sv('شجرة-عائلة-علي-وحسنية.jpg',bl(v,'image/jpeg'))})};
})();

var fam0=document.getElementById('famb');fam0.onclick=function(){var o=document.getElementById('fam').classList.toggle('open');fam0.classList.toggle('on',o)};
var cd0=document.getElementById('cdb');cd0.onclick=function(){var o=document.getElementById('cd').classList.toggle('open');cd0.classList.toggle('on',o)};
var hk0=document.getElementById('hkb');hk0.onclick=function(){var o=document.getElementById('hk').classList.toggle('open');hk0.classList.toggle('on',o)};
var sl0=document.getElementById('slb');sl0.onclick=function(){var o=document.getElementById('sl').classList.toggle('open');sl0.classList.toggle('on',o)};var kh0=document.getElementById('khb');kh0.onclick=function(){var o=document.getElementById('kh').classList.toggle('open');kh0.classList.toggle('on',o)};
var PAN=[['famb','fam'],['pb0','pp'],['tlb','tl'],['tmb','tm'],['ctb','ct'],['cdb','cd'],['hkb','hk'],['slb','sl'],['khb','kh']];
function closePan(x){PAN.forEach(function(a){if(a[0]==x)return;document.getElementById(a[1]).classList.remove('open');document.getElementById(a[0]).classList.remove('on')})}
PAN.forEach(function(a){var b=document.getElementById(a[0]),o=b.onclick;b.onclick=function(){var op=document.getElementById(a[1]).classList.contains('open');if(!op){closePan(a[0]);document.querySelectorAll('.branch.open').forEach(function(e){e.classList.remove('open')})}o();if(!op)setTimeout(function(){document.getElementById(a[1]).scrollIntoView({behavior:'smooth',block:'start'})},60)}});
(function(){var z=document.getElementById('zv'),i=document.getElementById('zi');
function ctr(){try{z.scrollLeft=-(z.scrollWidth-z.clientWidth)/2}catch(e){}}
i.onload=ctr;
document.getElementById('pimg').onclick=function(){A.get('posterJpg').then(function(v){i.src='data:image/jpeg;base64,'+v;z.classList.add('show');z.scrollTop=0;setTimeout(ctr,60)})};
document.getElementById('zx').onclick=function(){z.classList.remove('show')}})();

var NE=NE||null;
(function(){
var $=function(i){return document.getElementById(i)};
var TH=[{a:'#e8731a',k:'#5a2e0a',b0:'#fff6e8',b1:'#ffd7a8'},{a:'#1f9a62',k:'#0f4a30',b0:'#f0fbf4',b1:'#bde8cd'},{a:'#2f6fd6',k:'#153a78',b0:'#f0f7ff',b1:'#c2dcff'},{a:'#d9467a',k:'#6b1d3a',b0:'#fff2f7',b1:'#ffc7da'}],thI=0;
var TG=[{id:'fam',g:'العائلة',l:'العائلة كلها',k:'f'},{id:'c0',g:'الأزواج',l:'علي وحسنية',k:'c',nm:['علي','حسنية'],w:P.w,gp:1}],mar={},un={};
B.forEach(function(x,i){if(x.s){TG.push({id:'c'+(i+1),g:'الأزواج',l:x.n+' و'+x.s,k:'c',nm:[x.n,x.s],w:x.w});mar[x.n]=mar[x.s]=1}else if(months(x.b)>=216)un[x.n]=1});
evs().filter(function(e){return e.t=='b'}).forEach(function(e,i){TG.push({id:'p'+i,g:'الأفراد',l:e.n,k:'p',n:e.n,d:e.d})});
var OL={bd:'عيد ميلاد 🎂',an:'ذكرى زواج 💍',wed:'زواج مبارك 💐',baby:'مولود جديد 👶',gbaby:'حفيد جديد 👶',ok:'نجاح وتخرّج 🎓',eidf:'عيد الفطر 🌙',eida:'عيد الأضحى 🐑',ram:'رمضان كريم 🌙'};
function occ(t){if(t.k=='f')return['eidf','eida','ram'];if(t.k=='c')return t.gp?['an','gbaby']:['an','wed','baby'];var a=['bd','ok'];if(un[t.n])a.push('wed');if(mar[t.n])a.push('baby');if(t.n=='علي'||t.n=='حسنية')a.push('gbaby');return a}
function cur(){return TG.filter(function(t){return t.id==$('cws').value})[0]}
function fillT(){var h='',g='';TG.forEach(function(t){if(t.g!=g){if(g)h+='</optgroup>';h+='<optgroup label="'+t.g+'">';g=t.g}h+='<option value="'+t.id+'">'+t.l+'</option>'});$('cws').innerHTML=h+'</optgroup>'}
function fillO(sel){var t=cur(),old=sel||$('cwo').value,a=occ(t);$('cwo').innerHTML=a.map(function(o){return'<option value="'+o+'">'+OL[o]+'</option>'}).join('');if(a.indexOf(old)>-1)$('cwo').value=old}
fillT();$('cws').value='p0';fillO();$('cws').onchange=function(){fillO()};
var sw=$('cwc');TH.forEach(function(h,i){var b=document.createElement('button');b.style.background='linear-gradient(135deg,'+h.b1+','+h.a+')';b.setAttribute('aria-label','لون '+(i+1));if(!i)b.className='on';b.onclick=function(){thI=i;[].forEach.call(sw.children,function(c,j){c.classList.toggle('on',j==i)})};sw.appendChild(b)});
function txt(o,t){var f=t.k=='p'&&G[t.n]=='f',e;
 if(o=='bd'){var y=nxt({d:t.d}).yrs;return{ti:'عيد ميلاد سعيد',l2:'عمرٌ جديد · '+yu(y),gr:f?'كل عام وأنتِ بخير':'كل عام وأنتَ بخير',du:f?'أسعد الله أيامَكِ وبارك لكِ في عمرك':'أسعد الله أيامَك وبارك لك في عمرك'}}
 if(o=='an')return{ti:'ذكرى زواج سعيدة',l2:yu(nxt({d:t.w}).yrs)+' على الزواج',gr:'كل عام وأنتما بخير',du:'بارك الله لكما وجمع بينكما في خير'};
 if(o=='wed')return t.k=='c'?{ti:'زواج مبارك',l2:'',gr:'بارك الله لكما وبارك عليكما',du:'وجمع بينكما في خير'}:{ti:'زواج مبارك',l2:'',gr:f?'بارك الله لكِ وبارك عليكِ':'بارك الله لك وبارك عليك',du:'وجمع بينكما في خير'};
 if(o=='baby')return t.k=='c'?{ti:'مبروك المولود الجديد',l2:'',gr:'بارك الله لكما في الموهوب',du:'وشكرتما الواهب وبلغ أشدّه ورُزقتما برّه'}:{ti:'مبروك المولود الجديد',l2:'',gr:f?'بارك الله لكِ في الموهوب':'بارك الله لك في الموهوب',du:f?'وشكرتِ الواهب وبلغ أشدّه ورُزقتِ برّه':'وشكرتَ الواهب وبلغ أشدّه ورُزقتَ برّه'};
 if(o=='gbaby')return{ti:'مبروك الحفيد الجديد',l2:'',gr:'جعله الله قرّة عين لكم',du:'وبارك لكم في ذريّتكم وجعلهم من الصالحين'};
 if(o=='ok')return{ti:'ألف مبروك',l2:'النجاح والتخرّج',gr:f?'فخورون بكِ':'فخورون بك',du:f?'نفع الله بعلمكِ ووفّقكِ لكل خير':'نفع الله بعلمك ووفّقك لكل خير'};
 if(o=='eidf')return{ti:'عيد الفطر المبارك',l2:'',gr:'كل عام وأنتم بخير',du:'تقبّل الله منّا ومنكم صالح الأعمال'};
 if(o=='eida')return{ti:'عيد الأضحى المبارك',l2:'',gr:'كل عام وأنتم بخير',du:'تقبّل الله منّا ومنكم صالح الأعمال'};
 return{ti:'رمضان كريم',l2:'',gr:'أعاده الله علينا وعليكم بالخير والبركات',du:'وبلّغنا صيامه وقيامه'}}
function loadAv(n){return new Promise(function(r){if(!AV[n]){r(null);return}var im=new Image();im.onload=function(){r(im)};im.onerror=function(){r(null)};im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(av(n,400).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '))})}
function circ(x,im,cx,cy,r,col){x.save();x.beginPath();x.arc(cx,cy,r,0,7);x.clip();if(im)x.drawImage(im,cx-r,cy-r,2*r,2*r);else{x.fillStyle='#e9efe9';x.fillRect(cx-r,cy-r,2*r,2*r);x.fillStyle='#c9c3b2';x.beginPath();x.arc(cx,cy-r*.15,r*.38,0,7);x.fill();x.beginPath();x.moveTo(cx-r,cy+r);x.quadraticCurveTo(cx-r*.9,cy+r*.35,cx,cy+r*.35);x.quadraticCurveTo(cx+r*.9,cy+r*.35,cx+r,cy+r);x.fill()}x.restore();x.lineWidth=r>150?14:8;x.strokeStyle=col;x.beginPath();x.arc(cx,cy,r+x.lineWidth/2-1,0,7);x.stroke()}
function heart(x,cx,cy,s,c){x.fillStyle=c;x.beginPath();x.moveTo(cx,cy+s*.5);x.bezierCurveTo(cx-s*1.3,cy-s*.3,cx-s*.6,cy-s*1.1,cx,cy-s*.35);x.bezierCurveTo(cx+s*.6,cy-s*1.1,cx+s*1.3,cy-s*.3,cx,cy+s*.5);x.fill()}
function build(){var t=cur(),o=$('cwo').value,th=TH[thI],ex=$('cwt').value.trim(),tx=txt(o,t),W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;var x=cv.getContext('2d'),ff='Tajawal,Tahoma,Arial,sans-serif';
 var nm=t.k=='p'?[t.n]:t.k=='c'?t.nm:TG.filter(function(q){return q.k=='p'&&AV[q.n]}).map(function(q){return q.n});
 var label=t.k=='p'?t.n:t.k=='c'?t.l:'عائلة علي وحسنية';
 function T(s,y,sz,col,w){x.font=(w||'700')+' '+sz+'px '+ff;x.fillStyle=col;var z=sz;while(x.measureText(s).width>W-190&&z>28){z-=4;x.font=(w||'700')+' '+z+'px '+ff}x.fillText(s,W/2,y)}
 function go(){Promise.all(nm.map(loadAv)).then(function(im){
  var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,th.b0);g.addColorStop(1,th.b1);x.fillStyle=g;x.fillRect(0,0,W,H);
  x.globalAlpha=.5;[[120,160,th.a,16],[960,220,'#ffb703',12],[200,430,'#06b6d4',14],[900,520,'#ef476f',10],[110,880,'#ffb703',14],[975,760,th.a,16],[108,1130,'#06b6d4',12],[972,1190,'#ef476f',14]].forEach(function(q){x.fillStyle=q[2];x.beginPath();x.arc(q[0],q[1],q[3],0,7);x.fill()});x.globalAlpha=1;
  x.strokeStyle=th.a;x.lineWidth=8;x.strokeRect(40,40,W-80,H-80);x.lineWidth=2;x.strokeRect(62,62,W-124,H-124);
  x.textAlign='center';x.direction='rtl';T(tx.ti,190,88,th.k);
  if(t.k=='p')circ(x,im[0],540,540,230,th.a);
  else if(t.k=='c'){circ(x,im[0],370,540,150,th.a);circ(x,im[1],710,540,150,th.a);heart(x,540,545,30,th.a)}
  else{var P2=[[180,400],[360,400],[540,400],[720,400],[900,400],[270,560],[450,560],[630,560],[810,560],[270,720],[450,720],[630,720],[810,720]];im.forEach(function(m,i){circ(x,m,P2[i][0],P2[i][1],64,th.a)})}
  var ny=t.k=='f'?905:880;T(label,ny,t.k=='p'?116:100,th.k);
  if(tx.l2)T(tx.l2,972,54,th.k,'500');
  T(tx.gr,1086,tx.gr.length>24?60:72,th.a);T(tx.du,1166,42,'#5b5b5b','500');
  if(ex)T(ex,1218,42,th.k,'500');
  if(t.k!='f')T('عائلة علي وحسنية',ex?1276:1262,ex?38:46,th.a);
  cv.toBlob(function(bl){if(!bl)return;cb=bl;if(cu)URL.revokeObjectURL(cu);cu=URL.createObjectURL(bl);$('cimg').src=cu;$('chint').textContent='اضغط مطولًا على الصورة لحفظها';$('cshare').style.display=navigator.share?'':'none';$('csave').style.display=dl?'':'none';$('cv').classList.add('show')},'image/png')})}
 try{document.fonts.load('bold 40px Tajawal').then(go,go)}catch(e){go()}}
$('cwb').onclick=build;
$('evc').onclick=function(ev){ev.stopPropagation();if(!NE)return;var id=null;TG.forEach(function(t){if(NE.t=='b'&&t.k=='p'&&t.n==NE.n)id=t.id;if(NE.t=='w'&&t.k=='c'&&t.l==NE.n)id=t.id});if(id){$('cws').value=id;fillO(NE.t=='b'?'bd':'an')}var p=$('cd');if(!p.classList.contains('open'))$('cdb').click();else p.scrollIntoView({behavior:'smooth',block:'start'})};
window.__cards={TG:TG,build:build,fillO:fillO,loadAv:loadAv,circ:circ,TH:TH};
})();


(function(){
var HK=__D.HK;
var FT='\n\n📖 من دفتر الوالد علي — حفظه الله\n«هكذا علمتني الحياة»';
function wa(tx){var w=null;try{w=window.open('https://wa.me/?text='+encodeURIComponent(tx),'_blank')}catch(e){}if(!w&&navigator.share)navigator.share({text:tx}).catch(function(){})}
function cp(b,tx){try{navigator.clipboard.writeText(tx).then(function(){b.textContent='تم النسخ ✓'},function(){b.textContent='تعذّر النسخ'})}catch(e){b.textContent='تعذّر النسخ'}}
var at=[];HK.forEach(function(e,gi){var b={gi:gi,pg:e.pg};if(e.v)at.push(Object.assign({t:'﴿'+e.v+'﴾',s:'قال تعالى — سورة '+e.ref,v:1},b));else if(e.h.indexOf('أربعًا')>-1)at.push(Object.assign({t:e.h+': '+e.l.join('، ')+'.',s:'من دفتر الوالد'},b));else e.l.forEach(function(l,j){at.push(Object.assign({t:l,s:e.h,ev:e.ev?e.ev[j]:null},b))})});
var d=at[Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5)%at.length];
var P0=document.getElementById('hk'),h='<div class="hkh"><b>📖 هكذا علمتني الحياة</b><small>حِكَم لفهم الحياة — من دفتر الوالد علي، حفظه الله</small></div><div class="seg"><button class="on" data-m="c">🃏 بطاقات</button><button data-m="l">📋 قائمة</button></div><div id="hkc"></div><div id="hkl" style="display:none"><div class="hkd"><small>حكمة اليوم</small><div class="tx">'+d.t+'</div><div class="sr">'+d.s+'</div><div class="pb"><button data-a="dw">إرسال عبر واتساب</button><button data-a="dc">نسخ</button></div></div>';
HK.forEach(function(e,i){var body='';if(e.v)body='<p class="vs">﴿'+e.v+'﴾</p><p style="text-align:center;color:var(--mute);font-size:14px">(سورة '+e.ref+')</p>';else body=e.l.map(function(l,j){return'<p>'+(e.num?ar(j+1)+'- ':'')+l+'</p>'}).join('');
h+='<div class="hk-card" data-i="'+i+'"><h3>'+e.h+'</h3>'+body+(e.ev?'<div class="ev"><small>الدليل المقترح — إضافة للتوضيح وليست من الدفتر:</small>'+e.ev.map(function(v,j){return'<p>'+['الأولى','الثانية','الثالثة','الرابعة','الخامسة','السادسة'][j]+': '+v+'</p>'}).join('')+'</div>':'')+'<img alt="الصفحة الأصلية بخط اليد"><div class="pb"><button data-a="pg">📜 الصفحة الأصلية</button>'+(e.ev?'<button data-a="ev">📖 الدليل</button>':'')+'<button data-a="sw">إرسال عبر واتساب</button></div></div>'});
P0.innerHTML=h+'</div>';
var di=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5)%at.length,ci=di,GN=['خمسة أشياء','أربع للثقة','آية','الأسد','التربية','قواعد التواصل'];
(function(){
var $k=function(i){return document.getElementById(i)},hkc=$k('hkc'),hkl=$k('hkl');
hkc.innerHTML='<div class="kg" id="kg"></div><div class="kw" id="kw"><div class="kc" id="kc"></div></div><div class="knav"><button id="kp">→ السابقة</button><span id="kcnt"></span><button id="kn">التالية ←</button></div><div class="kb"><i id="kbar"></i></div><div class="kact"><button id="kws">إرسال عبر واتساب</button><button id="kcp">نسخ</button><button id="kpg">📜 الصفحة الأصلية</button><button id="kev">📖 الدليل</button></div><div class="kx"><div class="ev" id="kevt"></div><img id="kimg" alt="الصفحة الأصلية بخط اليد"></div>';
var kg=$k('kg');GN.forEach(function(n,i){var b=document.createElement('button');b.textContent=n;b.onclick=function(){go(at.findIndex(function(a){return a.gi==i}),1)};kg.appendChild(b)});
function tx(){var a=at[ci];return '«'+a.t+'»\n('+a.s+')'+FT}
function go(i,dir){ci=(i+at.length)%at.length;var a=at[ci],c=$k('kc');
 c.className='kc';void c.offsetWidth;c.className='kc'+(dir>0?' in-n':dir<0?' in-p':'');
 c.innerHTML='<small class="kl">'+(ci==di?'⭐ حكمة اليوم · ':'')+a.s+'</small><div class="kt'+(a.v?' vs':'')+'">'+a.t+'</div>';
 $k('kcnt').textContent=ar(ci+1)+' / '+ar(at.length);$k('kbar').style.width=((ci+1)/at.length*100)+'%';
 [].forEach.call(kg.children,function(b,j){b.classList.toggle('on',j==a.gi)});
 var im=$k('kimg'),ev=$k('kevt');im.classList.remove('open');ev.classList.remove('open');$k('kpg').textContent='📜 الصفحة الأصلية';
 $k('kev').style.display=a.ev?'':'none';ev.innerHTML=a.ev?'<small style="color:var(--mute)">الدليل المقترح — إضافة للتوضيح وليست من الدفتر:</small><p>'+a.ev+'</p>':''}
$k('kp').onclick=function(){go(ci-1,-1)};$k('kn').onclick=function(){go(ci+1,1)};
$k('kws').onclick=function(){wa(tx())};$k('kcp').onclick=function(){cp(this,tx())};
$k('kpg').onclick=function(){var im=$k('kimg'),bt=this,pg=at[ci].pg;A.get('hikamPages').then(function(HP){if(!im.src||im.getAttribute('data-p')!=pg)im.src='data:image/jpeg;base64,'+HP[pg];im.setAttribute('data-p',pg);var o=im.classList.toggle('open');bt.textContent=o?'إخفاء الصفحة':'📜 الصفحة الأصلية'})};
$k('kev').onclick=function(){$k('kevt').classList.toggle('open')};
var sx=0,sy=0,kw=$k('kw');kw.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
kw.addEventListener('touchend',function(e){var q=e.changedTouches[0],dx=q.clientX-sx,dy=q.clientY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>1.5*Math.abs(dy))go(ci+(dx>0?1:-1),dx>0?1:-1)},{passive:true});
document.addEventListener('keydown',function(e){if(!$k('hk').classList.contains('open')||hkc.style.display=='none')return;if(e.key=='ArrowLeft')go(ci+1,1);if(e.key=='ArrowRight')go(ci-1,-1)});
P0.querySelector('.seg').onclick=function(ev){var b=ev.target.closest('button');if(!b)return;var m=b.getAttribute('data-m');[].forEach.call(this.children,function(x){x.classList.toggle('on',x==b)});hkc.style.display=m=='c'?'':'none';hkl.style.display=m=='l'?'':'none'};
go(di,0);
})();

function etx(e){return e.h+':\n'+(e.v?'﴿'+e.v+'﴾ (سورة '+e.ref+')':e.l.map(function(l,j){return(e.num?(j+1)+'- ':'')+l}).join('\n'))+FT}
P0.onclick=function(ev){var b=ev.target.closest('button');if(!b)return;var a=b.getAttribute('data-a'),c=b.closest('.hk-card'),e=c?HK[+c.getAttribute('data-i')]:null;
 if(a=='dw')wa('«'+d.t+'»\n('+d.s+')'+FT);else if(a=='dc')cp(b,'«'+d.t+'»\n('+d.s+')'+FT);
 else if(a=='sw')wa(etx(e));
 else if(a=='ev')c.querySelector('.ev').classList.toggle('open');
 else if(a=='pg'){var im=c.querySelector('img');A.get('hikamPages').then(function(HP){if(!im.src)im.src='data:image/jpeg;base64,'+HP[e.pg];var o=im.classList.toggle('open');b.textContent=o?'إخفاء الصفحة':'📜 الصفحة الأصلية'})}};
})();

(function(){
var $=function(i){return document.getElementById(i)};
function wa2(tx){var w=null;try{w=window.open('https://wa.me/?text='+encodeURIComponent(tx),'_blank')}catch(e){}if(!w&&navigator.share)navigator.share({text:tx}).catch(function(){})}
function cp2(b,tx){try{navigator.clipboard.writeText(tx).then(function(){b.textContent='تم النسخ ✓'},function(){b.textContent='تعذّر النسخ'})}catch(e){b.textContent='تعذّر النسخ'}}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}return null}
function mk(c,h,p){var e=document.createElement('div');e.className=c;if(h)e.innerHTML=h;p.appendChild(e);return e}
/* ===== صلة اليوم ===== */
var H=[{id:'h0',l:'علي وحسنية',names:['علي','حسنية'],city:CITY['علي']}];
B.forEach(function(x,i){if(!x.s&&CITY[x.n]==CITY['علي']){H[0].names.push(x.n);return}var n=[x.n];if(x.s)n.push(x.s);x.k.forEach(function(q){n.push(q[0])});H.push({id:'h'+(i+1),l:x.s?x.n+' و'+x.s:x.n,names:n,city:CITY[x.n]})});
var own=ls('slme')||'',off=0;
function cand(){return H.filter(function(h){return h.id!=own})}
function cur(){var c=cand(),d=Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);return c[(d+off)%c.length]}
function tod(){var n=new Date();return n.getFullYear()+'-'+(n.getMonth()+1)+'-'+n.getDate()}
function rSl(){var h=cur(),done=ls('sld')==tod(),P=$('sl'),o='<div class="slc"><small>صلة اليوم · '+ar(new Date().getDate())+' '+MN[new Date().getMonth()]+'</small><div class="slav">'+h.names.map(function(n){return av(n,52)}).join('')+'</div><div class="slh">بيت '+h.l+'</div><div class="slm">📍 '+h.city+'<br>سلّم على: '+h.names.join('، ')+'</div>'+(done?'<div class="slok">✅ بارك الله فيك، تمّت صلة اليوم</div>':'')+'<div class="slr">قال ﷺ: «مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ، وَيُنْسَأَ لَهُ فِي أَثَرِهِ، فَلْيَصِلْ رَحِمَهُ» (متفق عليه)</div><div class="kact" style="margin-top:10px"><button id="slok">✅ تواصلتُ</button><button id="slmsg">✉️ رسالة سلام</button><button id="slnx">⏭️ بيت آخر</button></div></div>';
 o+='<div class="lbl">بيتك (نستثنيه من الاقتراح)</div><select id="slme" class="kin"><option value="">— لا أحد —</option>'+H.map(function(x){return'<option value="'+x.id+'"'+(x.id==own?' selected':'')+'>بيت '+x.l+'</option>'}).join('')+'</select><div class="lbl">كل البيوت</div>'+H.map(function(x){return'<div class="tmr">'+av(x.names[0],30)+'<span>بيت '+x.l+'</span><b>📍 '+x.city+'</b></div>'}).join('');
 P.innerHTML=o;$('slt').textContent='اليوم: بيت '+h.l;
 $('slok').onclick=function(){ls('sld',tod());rSl()};
 $('slmsg').onclick=function(){wa2('السلام عليكم ورحمة الله وبركاته 🌿\nكيف حالكم؟ اشتقنا إليكم وإلى الأولاد، وجمعنا الله بكم على خير.\n\n(صلة اليوم — عائلة علي وحسنية)')};
 $('slnx').onclick=function(){off++;rSl()};
 $('slme').onchange=function(){own=this.value;ls('slme',own);off=0;rSl()}}
rSl();
window.__kcard=function(r,ttl,w){var C=window.__cards,th=C.TH[1],W=1080,H2=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H2;var x=cv.getContext('2d'),ff='Tajawal,Tahoma,Arial,sans-serif';
 function T(s,y,sz,col,wt){x.font=(wt||'700')+' '+sz+'px '+ff;x.fillStyle=col;var z=sz;while(x.measureText(s).width>W-190&&z>28){z-=4;x.font=(wt||'700')+' '+z+'px '+ff}x.fillText(s,W/2,y)}
 function go(){C.loadAv(r.n).then(function(im){
  var g=x.createLinearGradient(0,0,0,H2);g.addColorStop(0,th.b0);g.addColorStop(1,th.b1);x.fillStyle=g;x.fillRect(0,0,W,H2);
  x.globalAlpha=.5;[[120,160,th.a,16],[960,220,'#ffb703',12],[200,430,'#06b6d4',14],[900,520,'#ef476f',10],[110,880,'#ffb703',14],[975,760,th.a,16],[108,1130,'#06b6d4',12],[972,1190,'#ef476f',14]].forEach(function(q){x.fillStyle=q[2];x.beginPath();x.arc(q[0],q[1],q[3],0,7);x.fill()});x.globalAlpha=1;
  x.strokeStyle=th.a;x.lineWidth=8;x.strokeRect(40,40,W-80,H2-80);x.lineWidth=2;x.strokeRect(62,62,W-124,H2-124);
  x.textAlign='center';x.direction='rtl';T(ttl,190,84,th.k);
  C.circ(x,im,540,540,230,th.a);T(r.n,880,112,th.k);
  T('نصيبك: '+r.txt,980,64,th.a);T('تقبّل الله منّا ومنكم صالح الأعمال',1080,44,'#5b5b5b','500');
  if(w)T(w,1150,40,th.k,'500');
  T('عائلة علي وحسنية',1262,44,th.a);
  cv.toBlob(function(bl){if(!bl)return;cb=bl;if(cu)URL.revokeObjectURL(cu);cu=URL.createObjectURL(bl);$('cimg').src=cu;$('chint').textContent='اضغط مطولًا على الصورة لحفظها';$('cshare').style.display=navigator.share?'':'none';$('csave').style.display=dl?'':'none';$('cv').classList.add('show')},'image/png')})}
 try{document.fonts.load('bold 40px Tajawal').then(go,go)}catch(e){go()}}
})();