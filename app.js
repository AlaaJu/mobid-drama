 'use strict';
const $=id=>document.getElementById(id);
const story=$('story'),save=$('save'),output=$('output');
const storageKey='mobid-drama-last-v1';
let mode='spray',lastPrompt='',installPrompt=null;
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2600)}
try{const x=JSON.parse(localStorage.getItem(storageKey)||'null');if(x?.story){story.value=x.story;save.checked=true}}catch{}
function chooseMode(next){if(next!==mode){lastPrompt='';$('smartActions').hidden=true;output.replaceChildren();const p=document.createElement('div');p.className='placeholder';p.textContent='تم تغيير الوضع؛ جهّز التعليمات الجديدة.';output.append(p)}mode=next;for(const [id,kind] of [['sprayMode','spray'],['filmMode','film']]){$(id).classList.toggle('active',kind===mode);$(id).setAttribute('aria-pressed',String(kind===mode))}$('smart').textContent=mode==='spray'?'🧴 جهّز مبيد دراما':'🎬 جهّز فلمها أكثر'}
$('sprayMode').onclick=()=>chooseMode('spray');$('filmMode').onclick=()=>chooseMode('film');
function promptText(){const s=story.value.trim();if(!s){toast('اكتب السالفة أولاً');story.focus();return ''}const g={neutral:'محايد تماماً بدون افتراض جنس الراوي',female:'مؤنث للراوي فقط',male:'مذكر للراوي فقط'}[$('address').value];
const common=`الموقف: ${s}\nاللهجة: سعودية طبيعية. المخاطبة: ${g}. لا تستخدم أي نكتة سابقة. لا تنسب نوايا غير مثبتة لأشخاص حقيقيين. المبالغات خيالية بوضوح. لا تكرر نص الموقف ولا تضف أثاثاً أو لجاناً اعتباطية. اختر مفارقة أصلية من تفاصيل الموقف، ووزّع القفشات خلال النص. اكتب عنواناً قصيراً ونصاً لا يتجاوز 10 سطور إجمالاً، بدون عناوين مشاهد أو شرح تقني.\n`;
return mode==='spray'?`أنت كاتب كوميديا سعودية ساخرة. «مبيد دراما»: خفف الموقف بثلاث قفشات دقيقة وسريعة، وسخر من تضخم الحدث دون إهانة المشاعر أو اختلاق حقائق. المطلوب نكت حقيقية لا حصة تعبير.\n${common}`:`أنت كاتب كوميديا سعودية خيالية. «فلمها أكثر»: حوّل الموقف إلى عالم عبثي جديد بفكرة واحدة مجنونة مستمدة منه؛ تصاعد حقيقي ومفارقات طريفة ونهاية مفاجئة. لا تكتب سيناريو ولا مشاهد ولا حواراً طويلاً؛ كبّر الفكرة لا عدد الكلمات.\n${common}`}
$('smart').onclick=()=>{lastPrompt=promptText();if(!lastPrompt)return;$('smartActions').hidden=false;output.replaceChildren();const x=document.createElement('div');x.className='result';x.textContent=`${mode==='spray'?'🧴 مبيد دراما':'🎬 فلمها أكثر'} — جاهز للتجربة\n\nهذه النسخة تجهّز التعليمات فقط. اضغط «نسخ تعليمات التوليد» ثم استخدمها مع نموذجك المفضل. التوليد المباشر غير مفعّل بعد.`;output.append(x);persist()};
$('copyPrompt').onclick=async()=>{lastPrompt=promptText();if(!lastPrompt)return;try{await navigator.clipboard.writeText(lastPrompt);toast(mode==='film'?'تم نسخ تعليمات فلمها أكثر':'تم نسخ تعليمات مبيد دراما')}catch{output.replaceChildren();const x=document.createElement('textarea');x.value=lastPrompt;output.append(x);x.select();toast('حدّد النص لنسخه يدوياً')}};
$('openAI').onclick=()=>window.open('https://chatgpt.com/','_blank','noopener,noreferrer');
function persist(){if(save.checked)localStorage.setItem(storageKey,JSON.stringify({story:story.value}));else localStorage.removeItem(storageKey)}
save.onchange=persist;story.oninput=persist;
$('clear').onclick=()=>{story.value='';lastPrompt='';save.checked=false;localStorage.removeItem(storageKey);$('smartActions').hidden=true;output.replaceChildren();const x=document.createElement('div');x.className='placeholder';x.textContent='جاهزين لسالفة جديدة 🧴🎬';output.append(x);toast('انمسح الموقف')};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install').hidden=false});$('install').onclick=async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null;$('install').hidden=true}};
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
