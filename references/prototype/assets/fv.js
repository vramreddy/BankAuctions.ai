/* BankAuctions.ai · field verification core: staff directory, assignments, deadlines, notifications, reports */
(function(){
var BA=window.BA,D=BA.D,jg=BA.jget,js=BA.jset,esc=BA.esc,H=36e5,DAY=864e5;
var FV=window.FV={};
var STATE=window.BA_STATE||{chennai:'Tamil Nadu',coimbatore:'Tamil Nadu',hyderabad:'Telangana',bengaluru:'Karnataka',kerala:'Kerala'};
FV.STATE=STATE;FV.STATES=['Tamil Nadu','Telangana','Karnataka','Kerala'];
FV.citiesOf=function(st){return BA.ck.filter(function(c){return STATE[c]===st})};
FV.cl=function(c){return D.cities[c]?D.cities[c].label:c};
function h32(s){var h=2166136261;s=String(s);for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
FV.h32=h32;
FV.wd=function(ts){var d=new Date(ts);if(d.getDay()===0)d=new Date(+d+864e5);return d.getTime()};
FV.ymd=function(d){d=new Date(d);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
FV.when=function(ts){return new Date(ts).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})};
FV.dshort=function(ymd){var d=new Date(ymd+'T00:00:00');return isNaN(d)?ymd:d.toLocaleDateString('en-GB',{weekday:'short',day:'2-digit',month:'short'})};
FV.left=function(ms){ms=Math.abs(ms);var m=Math.round(ms/60000);if(m<60)return m+' min';var h=Math.floor(m/60);if(h<24)return h+' h '+(m%60?String(m%60).padStart(2,'0')+' m':'');var d=Math.floor(h/24);return d+' d '+(h%24)+' h'};
FV.ROLEL={field:'Field engineer',lawyer:'Advocate',checker:'Checker',marketing:'Marketing',admin:'Admin',leadership:'Leadership'};
FV.STL={active:'Active',suspended:'Suspended',deactivated:'Deactivated'};
/* ---------- staff directory ---------- */
var K_DIR='ba3_sdir2';
function seedDir(){
 var now=Date.now(),S=[];
 function add(id,role,name,phone,state,o){o=o||{};var slug=name.toLowerCase().replace(/^adv\.\s*/,'').replace(/[^a-z ]/g,'').trim().split(/\s+/);var em=role==='lawyer'?(slug[0][0]+'.'+slug[slug.length-1]+'@bar.bankauctions.ai'):(slug[0]+'.'+(slug[1]||'x')[0]+'@bankauctions.ai');
  var city=(o.cities&&o.cities[0])||FV.citiesOf(state)[0]||'chennai',r=h32(id);
  S.push({id:id,role:role,name:name,phone:phone,emerg:'9'+String(840000000+r%90000000).slice(0,9),email:o.email||em,personal:slug.join('.')+'@gmail.com',dob:(1978+r%22)+'-'+String(1+r%12).padStart(2,'0')+'-'+String(1+r%27).padStart(2,'0'),
   perm:(10+r%80)+', '+['Gandhi Street','Nehru Nagar','Lake View Road','Temple Road','Park Avenue'][r%5]+', '+FV.cl(city)+', '+state,temp:'',same:true,photo:o.photo||'',aadhaar:[{n:'Aadhaar front.jpg',k:'',size:0,seed:1},{n:'Aadhaar back.jpg',k:'',size:0,seed:1}],status:'active',since:now-(60+r%700)*DAY,state:state,cities:o.cities||[],manager:o.manager||'',advocate:o.advocate||''});
  S[S.length-1].temp=S[S.length-1].perm}
 add('S201','marketing','Meera N.','9840022201','Tamil Nadu');add('S202','marketing','Rakesh B.','9848022202','Telangana');add('S203','marketing','Sunitha G.','9880022203','Karnataka');add('S204','marketing','Joseph K.','9847022204','Kerala');
 add('S301','field','Karthik S.','9840011101','Tamil Nadu',{cities:['chennai'],manager:'S201'});add('S302','field','Divya P.','9840011102','Tamil Nadu',{cities:['chennai','coimbatore'],manager:'S201'});
 add('S304','field','Vamsi R.','9848011104','Telangana',{cities:['hyderabad'],manager:'S202'});add('S305','field','Nikhil G.','9880011105','Karnataka',{cities:['bengaluru'],manager:'S203'});
 add('S306','field','Shabana K.','9880011106','Karnataka',{cities:['bengaluru'],manager:'S203'});add('S307','field','Rahul Menon','9847011107','Kerala',{cities:['kerala'],manager:'S204'});
 add('S401','checker','Latha M.','9840033301','Tamil Nadu');add('S402','checker','Ayesha T.','9848033302','Telangana');add('S403','checker','Prakash V.','9880033303','Karnataka');
 add('S501','admin','Rahul D.','9840044401','Tamil Nadu');add('S601','leadership','Sanjay K.','9840055501','Tamil Nadu');
 var B=window.BA_BENCH||{},n=0;Object.keys(B).forEach(function(st){B[st].forEach(function(x){n++;var slug='adv-'+x[0].toLowerCase().replace(/^adv\.\s*/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');add('S7'+String(n).padStart(2,'0'),'lawyer',x[0],'9'+String(400000000+h32(x[0])%99999999).slice(0,9),st,{advocate:x[0],photo:'img/adv/'+slug+'.jpg'})})});
 return S}
FV.dir=function(){var d=jg(K_DIR,null);if(!d){d=seedDir();js(K_DIR,d)}return d};
FV.saveDir=function(d){js(K_DIR,d)};
FV.get=function(id){return FV.dir().filter(function(x){return x.id===id})[0]};
FV.byPhone=function(ph){ph=String(ph).replace(/\D/g,'').slice(-10);return FV.dir().filter(function(x){return x.phone===ph})[0]};
FV.nextId=function(role){var d=FV.dir(),pre={marketing:'S2',field:'S3',checker:'S4',admin:'S5',leadership:'S6',lawyer:'S7'}[role]||'S9',n=0;d.forEach(function(x){if(x.id.indexOf(pre)===0)n=Math.max(n,+x.id.slice(2)||0)});return pre+String(n+1).padStart(2,'0')};
FV.engineers=function(city){return FV.dir().filter(function(x){return x.role==='field'&&x.status==='active'&&(!city||x.cities.indexOf(city)>-1)})};
FV.managers=function(state){return FV.dir().filter(function(x){return x.role==='marketing'&&x.state===state&&x.status==='active'})};
FV.team=function(mid){return FV.dir().filter(function(x){return x.role==='field'&&x.manager===mid})};
FV.avatar=function(m,sz){sz=sz||40;if(m&&m.photo)return '<img class="fva" src="'+esc(m.photo)+'" alt="" style="width:'+sz+'px;height:'+sz+'px">';var nm=(m&&m.name||'?').replace(/^Adv\.\s*/,''),ini=nm.split(/\s+/).slice(0,2).map(function(w){return w[0]}).join('').toUpperCase(),hue=h32(nm)%360;return '<span class="fva" style="width:'+sz+'px;height:'+sz+'px;background:hsl('+hue+',55%,42%);font-size:'+Math.round(sz*.38)+'px">'+esc(ini)+'</span>'};
/* resize a picture to a small data URL (staff photos) */
FV.imgData=function(file,max){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var r=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*r);c.height=Math.round(im.height*r);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.82))};im.onerror=function(){rej(new Error('Not a picture'))};im.src=u})};
FV.imgBlob=function(file,max){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){var r=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*r);c.height=Math.round(im.height*r);c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(function(b){URL.revokeObjectURL(u);b?res(b):rej(new Error('Could not read the picture'))},'image/jpeg',.82)};im.onerror=function(){rej(new Error('Not a picture'))};im.src=u})};
/* ---------- notifications ---------- */
FV.notify=function(key,o){var N=jg('ba3_notif',[]);if(key&&N.some(function(n){return n.key===key}))return false;N.unshift(Object.assign({id:'N'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),key:key,at:Date.now()},o));js('ba3_notif',N.slice(0,300));return true};
FV.notifs=function(who){/* who: 'admin' | 'leadership' | 'checker' | 'mgr:S201' | 'eng:S301' */return jg('ba3_notif',[]).filter(function(n){return n.to.indexOf(who)>-1})};
/* ---------- assignments ---------- */
var K_ASG='ba3_fvasg';
var OFFICERS=['Mr. R. Sundaram','Mr. K. Natarajan','Mr. S. Prabhu','Mr. A. Fernandes','Ms. M. Lakshmi','Mr. V. Raghunath','Mr. P. Sridhar','Ms. N. Anitha','Mr. T. Joseph','Ms. H. Fatima','Mr. D. Menon','Mr. G. Balaji'],SHOW=['S. Mohan, recovery agent','P. Kumar, branch staff','L. Dinesh, bank valuer’s assistant','R. Ibrahim, recovery agent','C. Latha, branch executive'],ROADS=['Main Road','Station Road','MG Road','Anna Salai','Church Street','Temple Road','Market Road','Brigade Road'],TIMES=['10:30 am','11:30 am','2:30 pm','3:30 pm'];
FV.branch=function(p,at){var h=h32(p.id),c=FV.cl(p.city);return {name:p.bank+', '+p.loc+' branch',loc:(12+h%88)+', '+ROADS[h%ROADS.length]+', '+p.loc+', '+c+' '+p.pin,officer:OFFICERS[h%OFFICERS.length],officerRole:'Authorised Officer',officerPhone:'9'+String(300000000+h%99999999).slice(0,9),showName:SHOW[(h>>>3)%SHOW.length],showPhone:'9'+String(500000000+(h>>>5)%99999999).slice(0,9),window:'Mon to Sat, 10:30 am to 4:30 pm',visit:{d:FV.ymd(FV.wd(at+(1+h%2)*DAY)),t:TIMES[(h>>>7)%TIMES.length]}}};
FV.property=function(id){return BA.allRaw().filter(function(x){return x.id===id})[0]};
FV.asg=function(){var A=jg(K_ASG,null);if(A)return A;A={};var now=Date.now();
 /* seeded demo queue: [hours since assignment, hours since accepted or null, days until scheduled visit or null] */
 var PAT=[[2,null,null],[19.5,null,null],[22,20,1],[26,null,null],[44.5,40,0],[8,5,null],[51,45,0],[15,10,2]],PAT2=[[2,null,null],[19.5,null,null],[22,20,1],[26,null,null],[44.5,40,0],[38,30,null],[51,45,0],[30,24,0]];
 var pub=jg('ba3_fv',{});
 BA.ck.forEach(function(city){var engs=FV.engineers(city);if(!engs.length)return;var cnt={};
  var L=BA.allRaw().filter(function(p){return p.city===city&&p.cat!=='vehicle'&&!pub[p.id]}).sort(function(a,b){return (b.premium?1:0)-(a.premium?1:0)||a.days-b.days}).slice(0,Math.min(16,engs.length*8));
  L.forEach(function(p,i){var e=engs[i%engs.length],j=cnt[e.id]=(cnt[e.id]||0),tab=(engs.indexOf(e)%2)?PAT2:PAT,t=tab[j%tab.length];cnt[e.id]++;
   var at=now-t[0]*H,a={eng:e.id,at:at,ack:t[1]==null?null:now-t[1]*H,sched:null,sub:null,fin:'',ret:null,br:FV.branch(p,at)};
   if(t[2]!=null){a.sched={d:FV.ymd(FV.wd(now+t[2]*DAY)),t:t[2]===0?'5:00 pm':a.br.visit.t,at:a.ack+30*60000}}
   A[p.id]=a})});
 js(K_ASG,A);return A};
FV.saveAsg=function(A){js(K_ASG,A)};
FV.mine=function(engId){var A=FV.asg(),out=[];Object.keys(A).forEach(function(id){if(A[id].eng===engId){var p=FV.property(id);if(p)out.push({p:p,a:A[id]})}});return out};
FV.accept=function(id){var A=FV.asg();A[id].ack=Date.now();FV.saveAsg(A)};
FV.schedule=function(id,d,t){var A=FV.asg();A[id].sched={d:d,t:t,at:Date.now()};if(!A[id].ack)A[id].ack=Date.now();FV.saveAsg(A)};
FV.reassign=function(id,newEng,by){var A=FV.asg(),o=A[id].eng;A[id].eng=newEng;A[id].at=Date.now();A[id].ack=null;A[id].sched=null;A[id].ret=null;FV.saveAsg(A);var e=FV.get(newEng),p=FV.property(id);
 FV.notify(null,{type:'assign',prop:id,eng:newEng,to:['eng:'+newEng],sev:'info',text:'New site visit assigned: '+p.short+', '+p.loc+'. Accept within 24 hours.'});};
/* deadline engine: accept in 24 h, schedule within 12 h of accepting, complete the visit within 48 h */
FV.sla=function(a,now){now=now||Date.now();
 if(a.fin==='approved')return {level:'done',label:'Approved',reasons:[],next:null};
 if(a.sub)return {level:'done',label:'With checker',reasons:[],next:null};
 var R=[],cand=[],ackDue=a.at+24*H,visDue=a.at+48*H;
 if(a.ret){var rd=a.ret.at+24*H;if(now>rd)R.push({t:'rework',txt:'Rework after checker comments is late',over:now-rd});else cand.push({t:'rework',due:rd,label:'Rework by'});return fin(R,cand,now,true)}
 if(!a.ack){if(now>ackDue)R.push({t:'ack',txt:'Not accepted within 24 h',over:now-ackDue});else cand.push({t:'ack',due:ackDue,label:'Accept by'})}
 else if(!a.sched){var sd=a.ack+12*H;if(now>sd)R.push({t:'nosch',txt:'Visit not scheduled',over:now-sd});else cand.push({t:'sched',due:sd,label:'Schedule by'})}
 if(now>visDue)R.push({t:'visit',txt:'Visit not completed within 48 h',over:now-visDue});else cand.push({t:'visit',due:visDue,label:'Complete by'});
 return fin(R,cand,now,false);
 function fin(R,cand,now,ret){cand.sort(function(x,y){return x.due-y.due});var nx=cand[0]||null,lv=R.length?'overdue':(nx&&nx.due-now<=6*H?'urgent':'ok');return {level:lv,label:ret?'Returned by checker':'',reasons:R,next:nx,ackDue:ackDue,visDue:visDue,ret:ret}}};
FV.stage=function(a){if(a.fin==='approved')return 'Approved and published';if(a.sub)return 'Submitted to checker';if(a.ret)return 'Returned by checker';if(a.sched)return 'Visit scheduled';if(a.ack)return 'Accepted, not scheduled';return 'Waiting for acceptance'};
FV.COL={overdue:{bg:'#FDECEC',bd:'#D93025',tx:'#A50E0E',lb:'Overdue'},urgent:{bg:'#FFF4DB',bd:'#F29900',tx:'#8A5A00',lb:'Urgent'},ok:{bg:'#EAF3FF',bd:'#2F6FE0',tx:'#1F4AA8',lb:'On track'},done:{bg:'#E6F6EC',bd:'#1E8E3E',tx:'#176B3A',lb:'Done'}};
/* detect breaches and tell the reporting manager, admin and leadership (once per breach) */
FV.unlistPrem=function(id){var PL=jg('ba3_premlist',[]).filter(function(x){return x!==id});js('ba3_premlist',PL)};
FV.sweep=function(){var A=FV.asg(),now=Date.now(),n=0;Object.keys(A).forEach(function(id){var a=A[id];if(a.sub||a.fin)return;var s=FV.sla(a,now),e=FV.get(a.eng),p=FV.property(id);if(!e||!p)return;
  s.reasons.forEach(function(r){var to=['admin','leadership'];if(e.manager)to.push('mgr:'+e.manager);to.push('eng:'+e.id);
   var due=r.t==='ack'?a.at+24*H:r.t==='nosch'?a.ack+12*H:r.t==='visit'?a.at+48*H:(a.ret?a.ret.at+24*H:now);
   if(FV.notify(id+':'+r.t+':'+a.at+':'+(a.ret?a.ret.at:0),{type:r.t,prop:id,eng:e.id,to:to,sev:'red',at:due,text:e.name+': '+r.txt+' · '+p.short+', '+p.loc+' ('+FV.cl(p.city)+')'}))n++})});return n};
/* flagged items for dashboards: [{id,p,a,e,sla}] */
FV.flagged=function(filter){var A=FV.asg(),out=[],now=Date.now();Object.keys(A).forEach(function(id){var a=A[id];if(a.sub||a.fin)return;var s=FV.sla(a,now);if(s.level!=='overdue')return;var e=FV.get(a.eng),p=FV.property(id);if(!e||!p)return;if(filter&&!filter(e,p,a))return;out.push({id:id,p:p,a:a,e:e,sla:s})});return out.sort(function(x,y){return y.sla.reasons[0].over-x.sla.reasons[0].over})};
FV.counts=function(list){var c={overdue:0,urgent:0,ok:0,done:0,ret:0};list.forEach(function(x){var s=FV.sla(x.a);c[s.level]++;if(x.a.ret&&!x.a.sub)c.ret++});return c};
/* ---------- reports: draft, submit, checker queue, publish ---------- */
var K_DR='ba3_fvdr',K_Q='ba3_fvq';
FV.blank=function(){return {photos:[],video:null,deed:[],ec:[],pos:'',neg:'',prem:[],premNote:'',nearBad:[],docs:[],gps:null,maps:'',landmarks:[],mv:'',fair:'',occ:'',access:'',boundary:'',cond:'3',util:[],lit:'',notes:'',upd:0}};
FV.draft=function(id){var d=jg(K_DR,{})[id];if(d)return Object.assign(FV.blank(),d);var q=jg(K_Q,{})[id];if(q&&q.status==='returned')return Object.assign(FV.blank(),q);return FV.blank()};
FV.saveDraft=function(id,d){var all=jg(K_DR,{});d.upd=Date.now();all[id]=d;js(K_DR,all)};
FV.drafts=function(engId){var all=jg(K_DR,{}),A=FV.asg();return Object.keys(all).filter(function(id){return A[id]&&A[id].eng===engId&&!A[id].sub&&!A[id].fin})};
FV.need=function(d){var g=d.gps&&d.gps.lat!=null&&d.gps.lng!=null&&!isNaN(+d.gps.lat)&&!isNaN(+d.gps.lng);return [
 {k:'photos',label:'At least 3 photographs (up to 8)',ok:d.photos.length>=3,now:d.photos.length+' of 8'},
 {k:'video',label:'Video tour of the property and surroundings',ok:!!d.video},
 {k:'deed',label:'Sale deed scan or photographs',ok:d.deed.length>0,now:d.deed.length+' file'+(d.deed.length===1?'':'s')},
 {k:'ec',label:'Latest encumbrance certificate (EC)',ok:(d.ec||[]).length>0,now:(d.ec||[]).length+' file'+((d.ec||[]).length===1?'':'s')},
 {k:'pn',label:'Positives and negatives of the property',ok:!!(d.pos||'').trim()&&!!(d.neg||'').trim()},
 {k:'gps',label:'GPS location of the property',ok:!!g},
 {k:'maps',label:'Google Maps location link',ok:/^https?:\/\/\S+/.test(d.maps||'')},
 {k:'lm',label:'At least one prominent landmark with distance',ok:d.landmarks.some(function(x){return x.name&&+x.km>0})},
 {k:'mv',label:'Market value of the property',ok:+d.mv>0},
 {k:'fair',label:'Recommended fair price',ok:+d.fair>0},
 {k:'occ',label:'Occupancy recorded',ok:!!d.occ}]};
FV.complete=function(d){return FV.need(d).every(function(x){return x.ok})};
FV.queue=function(){var q=jg(K_Q,{});return Object.keys(q).map(function(id){return Object.assign({id:id},q[id])})};
FV.submit=function(id,eng){var d=FV.draft(id);if(!FV.complete(d))return false;var q=jg(K_Q,{}),A=FV.asg(),e=FV.get(eng),p=FV.property(id),now=Date.now();
 var hist=(q[id]&&q[id].hist)||[];hist.push({at:now,who:e.name,what:hist.length?'Resubmitted after checker comments':'Submitted for checking'});
 q[id]=Object.assign({},d,{eng:eng,engName:e.name,subAt:now,status:'submitted',hist:hist,note:''});js(K_Q,q);
 A[id].sub=now;A[id].ret=null;FV.saveAsg(A);var dr=jg(K_DR,{});delete dr[id];js(K_DR,dr);
 FV.notify(null,{type:'submitted',prop:id,eng:eng,to:['checker','admin'],sev:'info',text:e.name+' submitted the site report for '+p.short+', '+p.loc+' ('+FV.cl(p.city)+'). Waiting for a checker.'});
 if(e.manager)FV.notify(null,{type:'submitted',prop:id,eng:eng,to:['mgr:'+e.manager],sev:'info',text:e.name+' submitted the report for '+p.short+', '+p.loc+'.'});return true};
FV.approve=function(id,checker,listPrem){var q=jg(K_Q,{}),r=q[id];if(!r)return false;var A=FV.asg(),p=FV.property(id),e=FV.get(r.eng),now=Date.now();
 var lm=r.landmarks.filter(function(x){return x.name&&+x.km>0}).sort(function(a,b){return a.km-b.km});
 var pub=jg('ba3_fv',{});pub[id]={imgs:r.photos.map(function(x){return x.k}),by:r.engName,when:new Date(now).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),est:+r.mv,mv:+r.mv,fair:+r.fair,occ:r.occ,access:r.access,boundary:r.boundary,lit:r.lit,notes:r.notes,lm:lm[0]?{name:lm[0].name,km:lm[0].km}:{name:'',km:''},landmarks:lm,gps:r.gps?(Number(r.gps.lat).toFixed(5)+', '+Number(r.gps.lng).toFixed(5)):'',maps:r.maps,video:r.video?{k:r.video.k,n:r.video.n}:null,deed:r.deed.map(function(x){return {k:x.k,t:x.t}}),ec:(r.ec||[]).map(function(x){return {k:x.k,t:x.t}}),pos:r.pos||'',neg:r.neg||'',prem:(r.prem||[]).concat(r.premNote?[r.premNote]:[]),nearBad:r.nearBad||[],docs:r.docs.map(function(x){return {title:x.title,k:x.k,t:x.t}}),checker:checker.name,approvedAt:now};
 js('ba3_fv',pub);if(listPrem){var PL=jg('ba3_premlist',[]);if(PL.indexOf(id)<0)PL.push(id);js('ba3_premlist',PL)}if(lm[0]){var L=jg('ba3_lm',{});L[id]={name:lm[0].name,km:lm[0].km};js('ba3_lm',L)}
 q[id].status='approved';q[id].hist.push({at:now,who:checker.name,what:'Approved and published'});js(K_Q,q);A[id].fin='approved';A[id].sub=now;FV.saveAsg(A);
 FV.notify(null,{type:'approved',prop:id,eng:r.eng,to:['eng:'+r.eng].concat(e&&e.manager?['mgr:'+e.manager]:[]),sev:'info',text:'Approved and published by '+checker.name+': '+p.short+', '+p.loc+'.'});return true};
FV.sendBack=function(id,checker,note){var q=jg(K_Q,{}),r=q[id];if(!r)return false;var A=FV.asg(),p=FV.property(id),now=Date.now();q[id].status='returned';q[id].note=note;q[id].hist.push({at:now,who:checker.name,what:'Returned to field engineer: '+note});js(K_Q,q);
 A[id].sub=null;A[id].ret={at:now,note:note,by:checker.name};FV.saveAsg(A);
 FV.notify(null,{type:'returned',prop:id,eng:r.eng,to:['eng:'+r.eng],sev:'amber',text:checker.name+' returned '+p.short+', '+p.loc+': '+note});return true};
})();
