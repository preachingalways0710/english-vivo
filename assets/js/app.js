// English Vivo — main app script
// Stories use saveWord(en, pt, ctx) — English word with Portuguese translation
const STORIES=[
  {title:"The Sunday visitor",context:"Sunday morning at IBBV in Itapuã",character:"Pastor Mike",scenario:"You meet an American missionary after the service. He wants to know about you.",
   text:`After the service, a tall man with a friendly smile <span class="word-tip"><span class="tapped" onclick="saveWord('approached','se aproximou','a man approached me')">approached</span><span class="tooltip">se aproximou</span></span> me. He was the visiting <span class="word-tip"><span class="tapped" onclick="saveWord('missionary','missionário','a missionary from Texas')">missionary</span><span class="tooltip">missionário</span></span> from Texas.<br><br>— Good morning! My name is Mike. Nice to meet you.<br><br>— Nice to meet you too. Is this your first time in Brazil?<br><br>— No, I have <span class="word-tip"><span class="tapped" onclick="saveWord('lived','morei','I have lived here')">lived</span><span class="tooltip">morei</span></span> here for four years. I really love the people.<br><br>— That's <span class="word-tip"><span class="tapped" onclick="saveWord('wonderful','maravilhoso','that\\'s wonderful')">wonderful</span><span class="tooltip">maravilhoso</span></span>! Do you miss your <span class="word-tip"><span class="tapped" onclick="saveWord('hometown','cidade natal','his hometown')">hometown</span><span class="tooltip">cidade natal</span></span>?`},
  {title:"At the grocery store",context:"Saturday morning, small market",character:"Sarah",scenario:"A foreign tourist needs help finding items. Practice helping her in English.",
   text:`The store was <span class="word-tip"><span class="tapped" onclick="saveWord('crowded','lotado','the store was crowded')">crowded</span><span class="tooltip">lotado</span></span> on Saturday morning. A woman with a small <span class="word-tip"><span class="tapped" onclick="saveWord('basket','cesta','a small basket')">basket</span><span class="tooltip">cesta</span></span> looked confused.<br><br>— Excuse me, do you speak English?<br><br>— A little. Can I help you?<br><br>— I'm looking for <span class="word-tip"><span class="tapped" onclick="saveWord('bread','pão','I want bread')">bread</span><span class="tooltip">pão</span></span> and <span class="word-tip"><span class="tapped" onclick="saveWord('cheese','queijo','some cheese')">cheese</span><span class="tooltip">queijo</span></span>. How much does this <span class="word-tip"><span class="tapped" onclick="saveWord('cost','custar','how much does it cost?')">cost</span><span class="tooltip">custar</span></span>?<br><br>— It's <span class="word-tip"><span class="tapped" onclick="saveWord('cheap','barato','very cheap')">cheap</span><span class="tooltip">barato</span></span> — only five reais.`},
  {title:"Talking about my family",context:"A simple introduction",character:"You",scenario:"Practice introducing your family to a new friend.",
   text:`My name is João and I want to <span class="word-tip"><span class="tapped" onclick="saveWord('introduce','apresentar','I want to introduce my family')">introduce</span><span class="tooltip">apresentar</span></span> my family. I have a <span class="word-tip"><span class="tapped" onclick="saveWord('wife','esposa','my wife is a teacher')">wife</span><span class="tooltip">esposa</span></span> and two children.<br><br>My oldest <span class="word-tip"><span class="tapped" onclick="saveWord('daughter','filha','our daughter is ten')">daughter</span><span class="tooltip">filha</span></span> is ten years old. She likes to read and play with her friends. My <span class="word-tip"><span class="tapped" onclick="saveWord('son','filho','our son is seven')">son</span><span class="tooltip">filho</span></span> is seven. He loves soccer.<br><br>We live in a small house <span class="word-tip"><span class="tapped" onclick="saveWord('near','perto de','near the church')">near</span><span class="tooltip">perto de</span></span> the church. Every Sunday we go together. I'm <span class="word-tip"><span class="tapped" onclick="saveWord('grateful','grato','I am grateful for my family')">grateful</span><span class="tooltip">grato</span></span> for them.`}
];

const TOPIC_PROMPTS={
  articles:"You are a friendly English tutor teaching Brazilian Portuguese speakers. Explain English articles (a, an, the) in PORTUGUESE, with English examples. Cover the most common Brazilian mistakes (over-use or omission). Invite questions in Portuguese.",
  to_be:"You are a friendly English tutor teaching Brazilian Portuguese speakers. Explain the verb 'to be' (am/is/are) in PORTUGUESE, contrasting with 'ser' and 'estar'. English examples. Invite questions.",
  present_simple:"You are a friendly English tutor teaching Brazilian Portuguese speakers. Explain the present simple in PORTUGUESE — its uses (routine, facts) and the tricky third-person -s. English examples. Invite questions.",
  past_simple:"You are a friendly English tutor teaching Brazilian Portuguese speakers. Explain the past simple in PORTUGUESE — regular -ed and the most common irregular verbs. English examples. Invite questions.",
  prepositions:"You are a friendly English tutor teaching Brazilian Portuguese speakers. Explain commonly confused prepositions (in/on/at for time and place) in PORTUGUESE with English examples. Invite questions.",
  plurals:"You are a friendly English tutor teaching Brazilian Portuguese speakers. Explain English plurals in PORTUGUESE — regular -s/-es and key irregulars (man/men, child/children, etc). Invite questions.",
  questions:"You are a friendly English tutor teaching Brazilian Portuguese speakers. Explain how to form English questions in PORTUGUESE — do/does/did and wh- words. Show how it differs from Portuguese. Invite questions.",
  false_cognates:"You are a friendly English tutor teaching Brazilian Portuguese speakers. Teach 6-8 of the most dangerous false cognates between Portuguese and English (pretend/pretender, push/puxar, library/livraria, parents/parentes, actually/atualmente, realize/realizar, college/colégio, fabric/fábrica). Explain in PORTUGUESE with English examples. Invite questions."
};

const CEFR_ORDER=['A1','A2','B1','B2','C1','C2'];
const MILESTONE_THEMES={
  A1:['Greetings and introductions','Numbers and time','Colors and objects','Family and home'],
  A2:['Daily routine','At church','In the community','Likes and dislikes'],
  B1:['Describing experiences','Giving opinions','At work and school','Talking about faith'],
  B2:['Telling stories','Persuasion and debate','Idioms and natural English','Cultural fluency'],
  C1:['Formal vs informal register','Humor and irony','Complex topics','Advanced mastery'],
  C2:['Final refinement','Native-like expression','Deep cultural knowledge','Full mastery']
};

let state={
  savedWords:[],storiesRead:[],points:0,examResult:null,apiKey:null,name:null,email:null,
  plan:null,currentMilestoneIdx:0,stagesDone:{},
  expChatHistory:[],expChatStory:null,expDebateHistory:[],expDebateTopic:null,
  expTopicHistory:[],expCurrentTopic:null
};

const synth=window.speechSynthesis;
let enVoice=null;
function initVoice(){const v=synth.getVoices();enVoice=v.find(x=>x.lang==='en-US')||v.find(x=>x.lang.startsWith('en'))||null;}
synth.onvoiceschanged=initVoice;initVoice();
function speak(t){synth.cancel();const u=new SpeechSynthesisUtterance(t);if(enVoice)u.voice=enVoice;u.lang='en-US';u.rate=0.95;synth.speak(u);}

function mkMicToggle(btnId,inputId,statusId){
  let active=false,recog=null;
  return function(){
    if(active){if(recog)recog.stop();return;}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){alert('Use Safari no iPhone para voz.');return;}
    recog=new SR();recog.lang='en-US';recog.interimResults=false;
    recog.onresult=e=>{document.getElementById(inputId).value=e.results[0][0].transcript;document.getElementById(statusId).textContent='✓ '+e.results[0][0].transcript.substring(0,40);};
    recog.onend=()=>{active=false;const b=document.getElementById(btnId);if(b){b.textContent='🎤';b.classList.remove('recording');}document.getElementById(statusId).textContent='';};
    recog.start();active=true;
    document.getElementById(btnId).textContent='⏹';document.getElementById(btnId).classList.add('recording');
    document.getElementById(statusId).textContent='Ouvindo...';
  };
}
let toggleExpMic,toggleExpDebateMic;

// ── STORAGE: localStorage with a namespaced key so multiple WP sites don't collide ──
const _ls={
  get:(k)=>{try{const v=localStorage.getItem(k);return v?{value:v}:null;}catch(e){return null;}},
  set:(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}}
};
const storageAPI=_ls;
const STORAGE_KEY='ev1_state';

async function loadState(){
  try{const r=await storageAPI.get(STORAGE_KEY);if(r)state={...state,...JSON.parse(r.value)};}catch(e){}
  await save();
  if(!state.name||!state.apiKey){
    document.getElementById('onboarding').style.display='block';
    document.getElementById('main-app').style.display='none';
    return;
  }
  document.getElementById('onboarding').style.display='none';
  document.getElementById('main-app').style.display='block';
  updateLevelWidget();
  if(state.examResult){
    document.getElementById('exam-prev').style.display='block';
    document.getElementById('exam-prev-level').textContent=state.examResult.level+' — '+state.examResult.label;
    document.getElementById('exam-prev-date').textContent='Feito em '+state.examResult.date;
  }
  renderPlano();
}
async function save(){try{await storageAPI.set(STORAGE_KEY,JSON.stringify(state));}catch(e){}}
function addPoints(pts){state.points+=pts;save();updateLevelWidget();}

// ── ONBOARDING ─────────────────────────────────────────────
async function obStep1(){
  const name=document.getElementById('ob-name').value.trim();
  const email=document.getElementById('ob-email').value.trim();
  if(!name||!email){alert('Preencha nome e email.');return;}
  state.name=name;state.email=email;await save();
  document.getElementById('ob-step1').style.display='none';
  document.getElementById('ob-step2').style.display='block';
}
async function obStep2(){
  const key=document.getElementById('ob-apikey').value.trim();
  const err=document.getElementById('ob-key-error');
  err.style.display='none';
  if(!key){err.textContent='Cole sua chave.';err.style.display='block';return;}
  try{
    const r=await fetch("https://api.x.ai/v1/chat/completions",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":"Bearer "+key},
      body:JSON.stringify({model:"grok-3-beta",max_tokens:5,messages:[{role:"user",content:"hi"}]})
    });
    if(!r.ok)throw new Error('HTTP '+r.status);
    state.apiKey=key;await save();
    document.getElementById('ob-welcome-name').textContent=state.name.split(' ')[0];
    document.getElementById('ob-step2').style.display='none';
    document.getElementById('ob-step3').style.display='block';
  }catch(e){
    err.textContent='Chave inválida ou erro de rede. Verifique e tente de novo.';
    err.style.display='block';
  }
}
function obStartExam(){
  document.getElementById('onboarding').style.display='none';
  document.getElementById('main-app').style.display='block';
  updateLevelWidget();
  showExam(true);
}

function updateLevelWidget(){
  if(!state.examResult){document.getElementById('level-widget').style.display='none';return;}
  const lvl=state.examResult.level;
  const idx=CEFR_ORDER.indexOf(lvl);
  const next=CEFR_ORDER[idx+1]||null;
  const thresholds={A1:0,A2:80,B1:200,B2:400,C1:700,C2:1100};
  const cur=thresholds[lvl]||0,nxt=next?thresholds[next]:cur+400;
  const pct=Math.min(98,Math.max(2,Math.round((state.points-cur)/(nxt-cur)*100)));
  document.getElementById('level-widget').style.display='flex';
  document.getElementById('lw-level').textContent=lvl;
  document.getElementById('lw-arrow').textContent=next?'→ '+next:'→ Fluente';
  document.getElementById('lw-bar').style.width=pct+'%';
  document.getElementById('lw-pct').textContent=pct+'% para '+(next||'C2');
}

function showSection(id){
  document.querySelectorAll('.ev-root .section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.ev-root .nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('nav-'+id).classList.add('active');
  if(id==='explorar')renderExpVocab();
}

// ── O PLANO ──────────────────────────────────────────────
function renderPlano(){
  if(!state.examResult){
    document.getElementById('plano-no-exam').style.display='block';
    document.getElementById('plano-main').style.display='none';
    document.getElementById('plano-generating').style.display='none';
    document.getElementById('lesson-container').style.display='none';
    document.getElementById('exam-panel').style.display='none';
    showExam();
    return;
  }
  document.getElementById('plano-no-exam').style.display='none';
  document.getElementById('exam-panel').style.display='none';
  if(!state.plan){
    generatePlan();
    return;
  }
  document.getElementById('plano-generating').style.display='none';
  document.getElementById('plano-main').style.display='block';
  document.getElementById('lesson-container').style.display='none';
  renderRoad();
}

function aiCall(prompt,maxTokens=1000){
  return fetch("https://api.x.ai/v1/chat/completions",{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":"Bearer "+(state.apiKey||'')},
    body:JSON.stringify({model:"grok-3-beta",max_tokens:maxTokens,messages:[{role:"user",content:prompt}]})
  }).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
    .then(d=>d.choices[0].message.content);
}

function aiChat(messages,system,maxTokens=300){
  const body={model:"grok-3-beta",max_tokens:maxTokens,messages};
  if(system)body.messages=[{role:"system",content:system},...messages];
  return fetch("https://api.x.ai/v1/chat/completions",{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":"Bearer "+(state.apiKey||'')},
    body:JSON.stringify(body)
  }).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
    .then(d=>d.choices[0].message.content);
}

function buildFallbackPlan(lvl,nextLvl,themes){
  const mk=(mi,theme)=>({
    id:'m'+(mi+1),title:theme,focus:'Desenvolver fluência e vocabulário em inglês no tema: '+theme,
    stages:[
      {id:'m'+(mi+1)+'s1',name:'Leitura',type:'reading',desc:'Texto curto em inglês + perguntas de compreensão'},
      {id:'m'+(mi+1)+'s2',name:'Vocabulário',type:'vocab',desc:'5 palavras em contexto + resposta escrita em inglês'},
      {id:'m'+(mi+1)+'s3',name:'Conversa',type:'chat',desc:'4+ trocas com um personagem (em inglês)'},
      {id:'m'+(mi+1)+'s4',name:'Gramática',type:'grammar',desc:'Ponto gramatical chave para este nível'},
      {id:'m'+(mi+1)+'s5',name:'Debate',type:'debate',desc:'Debate em inglês relacionado ao tema'}
    ]
  });
  return{title:'De '+lvl+' a '+nextLvl,subtitle:'4 milestones · 20 estágios no total',milestones:themes.map((t,i)=>mk(i,t))};
}

function extractJSON(text){
  const cleaned=text.replace(/```json|```/g,'').trim();
  try{return JSON.parse(cleaned);}catch(e){}
  const match=cleaned.match(/\{[\s\S]*\}/);
  if(match)try{return JSON.parse(match[0]);}catch(e){}
  return null;
}

async function generatePlan(attempt=1){
  document.getElementById('plano-generating').style.display='block';
  document.getElementById('plano-main').style.display='none';
  document.getElementById('gen-level').textContent=state.examResult.level;
  const lvl=state.examResult.level;
  const themes=MILESTONE_THEMES[lvl]||MILESTONE_THEMES['A2'];
  const nextLvl=CEFR_ORDER[CEFR_ORDER.indexOf(lvl)+1]||'C2';

  const prompt=attempt===1
    ? `Create a 4-milestone English learning plan for a ${lvl} Brazilian Portuguese speaker learning English (context: church member / community in Rondônia, Brazil) to reach ${nextLvl}. Themes: ${themes.join(', ')}.
The plan structure (titles, stage names, descriptions) must be written in PORTUGUESE — the UI is in Portuguese. The CONTENT taught will be English.
Return ONLY valid JSON, no markdown, no explanation:
{"title":"De ${lvl} a ${nextLvl}","subtitle":"4 milestones · 20 estágios no total","milestones":[{"id":"m1","title":"${themes[0]}","focus":"one short sentence in Portuguese","stages":[{"id":"m1s1","name":"Leitura","type":"reading","desc":"Texto curto + perguntas"},{"id":"m1s2","name":"Vocabulário","type":"vocab","desc":"5 palavras em contexto"},{"id":"m1s3","name":"Conversa","type":"chat","desc":"4+ trocas em inglês"},{"id":"m1s4","name":"Gramática","type":"grammar","desc":"Ponto gramatical"},{"id":"m1s5","name":"Debate","type":"debate","desc":"Debate do tema"}]},{"id":"m2","title":"${themes[1]}","focus":"one sentence in Portuguese","stages":[{"id":"m2s1","name":"Leitura","type":"reading","desc":"Texto curto + perguntas"},{"id":"m2s2","name":"Vocabulário","type":"vocab","desc":"5 palavras em contexto"},{"id":"m2s3","name":"Conversa","type":"chat","desc":"4+ trocas em inglês"},{"id":"m2s4","name":"Gramática","type":"grammar","desc":"Ponto gramatical"},{"id":"m2s5","name":"Debate","type":"debate","desc":"Debate do tema"}]},{"id":"m3","title":"${themes[2]}","focus":"one sentence in Portuguese","stages":[{"id":"m3s1","name":"Leitura","type":"reading","desc":"Texto curto + perguntas"},{"id":"m3s2","name":"Vocabulário","type":"vocab","desc":"5 palavras em contexto"},{"id":"m3s3","name":"Conversa","type":"chat","desc":"4+ trocas em inglês"},{"id":"m3s4","name":"Gramática","type":"grammar","desc":"Ponto gramatical"},{"id":"m3s5","name":"Debate","type":"debate","desc":"Debate do tema"}]},{"id":"m4","title":"${themes[3]}","focus":"one sentence in Portuguese","stages":[{"id":"m4s1","name":"Leitura","type":"reading","desc":"Texto curto + perguntas"},{"id":"m4s2","name":"Vocabulário","type":"vocab","desc":"5 palavras em contexto"},{"id":"m4s3","name":"Conversa","type":"chat","desc":"4+ trocas em inglês"},{"id":"m4s4","name":"Gramática","type":"grammar","desc":"Ponto gramatical"},{"id":"m4s5","name":"Debate","type":"debate","desc":"Debate do tema"}]}]}`
    : `Return ONLY this JSON with no other text: ${JSON.stringify(buildFallbackPlan(lvl,nextLvl,themes))}`;

  try{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),12000);
    const raw=await fetch("https://api.x.ai/v1/chat/completions",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":"Bearer "+(state.apiKey||'')},
      signal:controller.signal,
      body:JSON.stringify({model:"grok-3-beta",max_tokens:2000,messages:[{role:"user",content:prompt}]})
    });
    clearTimeout(timeout);
    if(!raw.ok)throw new Error('HTTP '+raw.status);
    const data=await raw.json();
    const parsed=extractJSON(data.choices[0].message.content);
    if(!parsed)throw new Error('JSON parse failed');
    if(!parsed.milestones||parsed.milestones.length<4)throw new Error('incomplete plan');
    state.plan=parsed;
    state.stagesDone={};state.currentMilestoneIdx=0;
    await save();
    document.getElementById('plano-generating').style.display='none';
    document.getElementById('plano-main').style.display='block';
    renderRoad();
  }catch(e){
    if(attempt<3){
      setTimeout(()=>generatePlan(attempt+1),1500);
      document.getElementById('plano-generating').innerHTML=`<div style="text-align:center;padding:3rem 1rem"><div style="font-size:28px;margin-bottom:1rem">⚙️</div><div style="font-size:15px;font-weight:500;margin-bottom:6px">Tentativa ${attempt+1} de 3...</div><div style="font-size:13px;color:var(--color-text-secondary)">Ajustando e tentando novamente</div></div>`;
    } else {
      state.plan=buildFallbackPlan(lvl,nextLvl,themes);
      state.stagesDone={};state.currentMilestoneIdx=0;
      await save();
      document.getElementById('plano-generating').style.display='none';
      document.getElementById('plano-main').style.display='block';
      renderRoad();
    }
  }
}

function renderRoad(){
  if(!state.plan)return;
  document.getElementById('plano-title').textContent=state.plan.title;
  document.getElementById('plano-subtitle').textContent=state.plan.subtitle;
  const road=document.getElementById('road');
  road.innerHTML='';
  state.plan.milestones.forEach((m,mi)=>{
    const allDone=m.stages.every(s=>state.stagesDone[s.id]);
    const isActive=mi===state.currentMilestoneIdx;
    const isLocked=mi>state.currentMilestoneIdx;
    const block=document.createElement('div');
    block.className='milestone-block';
    if(mi>0){const conn=document.createElement('div');conn.className='milestone-connector'+(state.plan.milestones[mi-1].stages.every(s=>state.stagesDone[s.id])?' done':'');road.appendChild(conn);}
    const hdr=document.createElement('div');
    hdr.className='milestone-header-row'+(allDone?' done-m':isActive?' active':isLocked?' locked-m':'');
    const circleClass=allDone?'done-c':isActive?'active':'';
    const circleContent=allDone?'✓':mi+1;
    const badgeClass=allDone?'mb-done':isActive?'mb-active':'mb-locked';
    const badgeText=allDone?'Concluído':isActive?'Em progresso':'Bloqueado';
    hdr.innerHTML=`<div class="milestone-circle ${circleClass}">${circleContent}</div><div class="milestone-info"><div class="milestone-title">${m.title}</div><div class="milestone-sub">${m.focus}</div></div><span class="milestone-badge ${badgeClass}">${badgeText}</span>`;
    block.appendChild(hdr);
    if(isActive){
      const panel=document.createElement('div');
      panel.className='stages-panel';
      const doneCount=m.stages.filter(s=>state.stagesDone[s.id]).length;
      m.stages.forEach((s,si)=>{
        const sDone=state.stagesDone[s.id];
        const sActive=si===doneCount;
        const sLocked=si>doneCount;
        const row=document.createElement('div');
        row.className='stage-row'+(sDone?' s-done':sLocked?' s-locked':'');
        const icons={reading:'📖',vocab:'💡',chat:'💬',grammar:'✏️',debate:'⚔️'};
        const iconClass=sDone?'s-done':sActive?'s-active':'';
        const chipClass=sDone?'sc-done':sActive?'sc-active':'sc-locked';
        const chipText=sDone?'✓':sActive?'Agora':'';
        row.innerHTML=`<div class="stage-icon ${iconClass}">${sDone?'✓':icons[s.type]||si+1}</div><div class="stage-info"><div class="stage-name">${s.name}</div><div class="stage-desc">${s.desc}</div></div>${chipText?`<span class="stage-chip ${chipClass}">${chipText}</span>`:''}`;
        if(!sLocked&&!sDone)row.onclick=()=>openLesson(mi,si);
        panel.appendChild(row);
      });
      block.appendChild(panel);
    }
    road.appendChild(block);
  });
}

// ── LESSON ENGINE ─────────────────────────────────────────
let lessonCtx={mi:0,si:0,stageId:null,chatHistory:[],chatCount:0,grammarPicked:{}};

async function openLesson(mi,si){
  const stage=state.plan.milestones[mi].stages[si];
  lessonCtx={mi,si,stageId:stage.id,chatHistory:[],chatCount:0,grammarPicked:{}};
  document.getElementById('plano-main').style.display='none';
  const lc=document.getElementById('lesson-container');
  lc.style.display='block';
  lc.innerHTML=`<button class="btn btn-sm" onclick="backToRoad()" style="margin-bottom:1rem">← O Plano</button><div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:4px">Milestone ${mi+1} · Estágio ${si+1}</div><div style="font-size:18px;font-weight:500;margin-bottom:1.25rem">${stage.name}</div><div id="lesson-body"><div style="text-align:center;padding:2rem;color:var(--color-text-secondary)">Gerando conteúdo...</div></div>`;
  await generateLessonContent(stage,mi,si);
}

function backToRoad(){
  document.getElementById('lesson-container').style.display='none';
  document.getElementById('plano-main').style.display='block';
  renderRoad();
}

async function generateLessonContent(stage,mi,si){
  const lvl=state.examResult.level;
  const theme=state.plan.milestones[mi].title;
  let prompt='';
  if(stage.type==='reading'){
    prompt=`Generate an English reading comprehension lesson for a ${lvl} Brazilian learner of English. Theme: "${theme}". Context: Brazilian church member in Rondônia, possibly meeting Americans or using English at work.
The STORY must be in ENGLISH (level-appropriate). The QUESTIONS must be in PORTUGUESE (so the learner can show understanding without struggling to write English).
Return ONLY JSON: {"story":"~120-150 word English story with 4 vocab words wrapped as <span class=\\"word-tip\\"><span class=\\"tapped\\" onclick=\\"saveWord('w','pt-translation','english-context')\\">w</span><span class=\\"tooltip\\">pt-translation</span></span>","questions":["Question in Portuguese?","Second question in Portuguese?"]}`;
  }else if(stage.type==='vocab'){
    prompt=`Generate an English vocabulary lesson for a ${lvl} Brazilian learner. Theme: "${theme}". 5 contextual English words relevant to the theme.
Return ONLY JSON: {"words":[{"en":"...","pt":"...","example":"English sentence using the word"},{"en":"...","pt":"...","example":"..."},{"en":"...","pt":"...","example":"..."},{"en":"...","pt":"...","example":"..."},{"en":"...","pt":"...","example":"..."}],"writing_prompt":"Escreva 3-4 frases em inglês usando pelo menos 3 dessas palavras."}`;
  }else if(stage.type==='chat'){
    prompt=`Generate a guided English conversation lesson for a ${lvl} Brazilian learner. Theme: "${theme}". Context: Brazilian church / community in Rondônia.
The character speaks ENGLISH only. Scenario can be described in English (will be shown as subtitle).
Return ONLY JSON: {"character":"Name","scenario":"One sentence scenario (English, ${lvl}-appropriate)","opening":"Character's opening line in ENGLISH"}`;
  }else if(stage.type==='grammar'){
    prompt=`Generate an English grammar lesson for a ${lvl} Brazilian learner focused on a key English grammar point for this level (think: articles, to be, present simple, past simple, prepositions, plurals, question formation, false cognates). Theme: "${theme}".
The explanation must be in PORTUGUESE. The example sentences and exercises must be in ENGLISH.
Return ONLY JSON: {"topic":"Grammar topic name in Portuguese","explanation":"3-4 sentence explanation in PORTUGUESE with English examples","exercises":[{"prompt":"Fill in the blank: English sentence with a ___ blank","answer":"correct English answer","options":["opt1","opt2","opt3","opt4"]},{"prompt":"...","answer":"...","options":["...","...","...","..."]},{"prompt":"...","answer":"...","options":["...","...","...","..."]}]}`;
  }else if(stage.type==='debate'){
    prompt=`Generate an English debate lesson for a ${lvl} Brazilian learner. Theme: "${theme}". Relevant to a Christian Brazilian context.
Return ONLY JSON: {"topic":"Debate topic in English","opening":"AI's opening argument in English (2-3 sentences, will argue opposite of learner)"}`;
  }
  try{
    const raw=await aiCall(prompt,1500);
    const content=extractJSON(raw);
    if(!content)throw new Error('parse');
    renderLessonContent(stage,content,mi,si);
  }catch(e){document.getElementById('lesson-body').innerHTML=`<p style="color:#e24b4a">Erro ao gerar conteúdo.</p><button class="btn btn-sm" style="margin-top:.75rem" onclick="generateLessonContent(state.plan.milestones[${mi}].stages[${si}],${mi},${si})">Tentar novamente</button>`;}
}

function renderLessonContent(stage,content,mi,si){
  const body=document.getElementById('lesson-body');
  if(stage.type==='reading'){
    body.innerHTML=`<div id="read-phase">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
        <p style="font-size:13px;color:var(--color-text-secondary)">Leia o texto em inglês. Toque nas palavras destacadas. Quando terminar, esconda e responda.</p>
        <button class="btn btn-sm" onclick="hideReadingText()">Pronto →</button>
      </div>
      <div class="card" style="background:var(--color-background-secondary);border:none"><div class="story-text" style="font-size:15px">${content.story}</div></div>
    </div>
    <div id="q-phase" style="display:none">
      <p style="font-size:13px;color:var(--color-text-secondary);margin-bottom:1.25rem">Responda em português, sem olhar o texto.</p>
      ${content.questions.map((q,i)=>`<div style="margin-bottom:1rem"><div style="font-size:14px;font-weight:500;margin-bottom:6px">${i+1}. ${q}</div><textarea class="cans" rows="2" style="width:100%;border:0.5px solid var(--color-border-tertiary);border-radius:8px;padding:10px;font-size:14px;font-family:inherit;background:var(--color-background-primary);color:#1a1a18" placeholder="Responda em português..."></textarea></div>`).join('')}
      <button class="btn btn-primary" onclick="submitReading(${JSON.stringify(content).replace(/"/g,'&quot;')},${mi},${si})">Verificar →</button>
      <div id="read-fb" style="margin-top:1rem"></div>
    </div>`;
    bindTooltips();
  }else if(stage.type==='vocab'){
    body.innerHTML=`${content.words.map(w=>`<div class="card" style="padding:1rem;margin-bottom:8px;display:flex;justify-content:space-between;align-items:flex-start"><div><div style="font-size:15px;font-weight:500">${w.en}</div><div style="font-size:13px;color:var(--color-text-secondary);margin-top:2px;font-style:italic">${w.example}</div></div><div style="font-size:13px;color:var(--color-text-secondary)">${w.pt}</div></div>`).join('')}
    <div style="font-size:14px;font-weight:500;margin-bottom:8px;margin-top:.5rem">${content.writing_prompt}</div>
    <textarea id="vocab-resp" rows="5" style="width:100%;border:0.5px solid var(--color-border-tertiary);border-radius:8px;padding:10px;font-size:15px;font-family:inherit;background:var(--color-background-primary);color:#1a1a18;margin-bottom:1rem" placeholder="Write here in English..."></textarea>
    <button class="btn btn-primary" onclick="submitVocab(${JSON.stringify(content).replace(/"/g,'&quot;')},${mi},${si})">Enviar →</button>
    <div id="vocab-fb" style="margin-top:1rem"></div>`;
    content.words.forEach(w=>saveWord(w.en,w.pt,w.example));
  }else if(stage.type==='chat'){
    lessonCtx.chatHistory=[{role:'assistant',content:content.opening}];
    body.innerHTML=`<p style="font-size:13px;color:var(--color-text-secondary);margin-bottom:1rem">Complete pelo menos 4 trocas (em inglês) para desbloquear o próximo estágio.</p>
    <div class="chat-wrap">
      <div class="chat-header"><strong>${content.character}</strong><p>${content.scenario}</p></div>
      <div class="messages" id="lc-msgs"></div>
      <div class="voice-status" id="lc-vstatus"></div>
      <div class="chat-input-row">
        <button class="btn btn-icon" id="lc-mic" onclick="toggleLcMic()">🎤</button>
        <textarea id="lc-input" rows="2" placeholder="Reply in English..."></textarea>
        <button class="btn btn-primary btn-icon" onclick="sendLcChat(${JSON.stringify(content).replace(/"/g,'&quot;')})">→</button>
      </div>
    </div>
    <div id="lc-grade-btn" style="display:none;margin-top:.5rem"><button class="btn btn-primary" onclick="gradeLcChat(${mi},${si})">Avaliar conversa →</button></div>
    <div id="lc-fb" style="margin-top:1rem"></div>`;
    addLcMsg(content.opening,'ai',true);
    document.getElementById('lc-input').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendLcChat(content);}});
    window._lcMic=mkMicToggle('lc-mic','lc-input','lc-vstatus');
  }else if(stage.type==='grammar'){
    lessonCtx.grammarPicked={};
    body.innerHTML=`<div class="card" style="background:var(--color-background-secondary);border:none;margin-bottom:1.25rem"><div style="font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:var(--color-text-secondary);margin-bottom:6px">${content.topic}</div><p style="font-size:14px;line-height:1.7">${content.explanation}</p></div>
    ${content.exercises.map((ex,i)=>`<div style="margin-bottom:1.25rem"><div style="font-size:14px;margin-bottom:8px">${i+1}. ${ex.prompt}</div><div style="display:flex;gap:6px;flex-wrap:wrap">${ex.options.map(o=>`<button class="btn btn-sm" id="gp_${i}_${o.replace(/[\s']/g,'_')}" onclick="pickGr(${i},'${o.replace(/'/g,"\\'")}','${ex.answer.replace(/'/g,"\\'")}',this,${JSON.stringify(content.exercises.length)})">${o}</button>`).join('')}</div><div id="gfb_${i}" style="font-size:13px;margin-top:5px;min-height:18px"></div></div>`).join('')}
    <div id="gr-next" style="display:none"><button class="btn btn-primary" onclick="completeLesson(${mi},${si},15,'gramática')">Próximo estágio →</button></div>`;
  }else if(stage.type==='debate'){
    lessonCtx.chatHistory=[{role:'assistant',content:content.opening}];
    body.innerHTML=`<div class="card" style="padding:.75rem 1rem;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center"><span style="font-size:14px">${content.topic}</span><span class="tag tag-coral" style="margin:0">Debate</span></div>
    <div class="chat-wrap">
      <div class="messages" id="ld-msgs"></div>
      <div class="voice-status" id="ld-vstatus"></div>
      <div class="chat-input-row">
        <button class="btn btn-icon" id="ld-mic" onclick="toggleLdMic()">🎤</button>
        <textarea id="ld-input" rows="2" placeholder="Argue in English..."></textarea>
        <button class="btn btn-primary btn-icon" onclick="sendLdDebate(${JSON.stringify(content).replace(/"/g,'&quot;')})">→</button>
      </div>
    </div>
    <div id="ld-grade-btn" style="display:none;margin-top:.5rem"><button class="btn btn-primary" onclick="gradeLdDebate(${mi},${si})">Avaliar debate →</button></div>
    <div id="ld-fb" style="margin-top:1rem"></div>`;
    addLdMsg(content.opening,'ai',true);
    document.getElementById('ld-input').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendLdDebate(content);}});
    window._ldMic=mkMicToggle('ld-mic','ld-input','ld-vstatus');
  }
}

function hideReadingText(){document.getElementById('read-phase').style.display='none';document.getElementById('q-phase').style.display='block';}

async function submitReading(content,mi,si){
  const answers=[...document.querySelectorAll('.cans')].map(t=>t.value.trim());
  if(answers.some(a=>!a)){alert('Responda as perguntas.');return;}
  document.getElementById('read-fb').innerHTML='<p style="color:var(--color-text-secondary);font-style:italic">Avaliando...</p>';
  const storyText=content.story.replace(/<[^>]+>/g,'');
  const prompt=`A ${state.examResult.level} Brazilian learner of English read an English story (now hidden) and answered comprehension questions IN PORTUGUESE.
Story (English): "${storyText}"
Q1 (PT): ${content.questions[0]} — A1 (PT): "${answers[0]}"
Q2 (PT): ${content.questions[1]} — A2 (PT): "${answers[1]}"
Evaluate whether they understood the English. Reference actual story content. Feedback in PORTUGUESE. Be direct.
Return ONLY JSON: {"fb1":"...","fb2":"..."}`;
  try{
    const raw=await aiCall(prompt,500);
    const fb=extractJSON(raw);
    if(!fb)throw new Error('parse');
    document.getElementById('read-fb').innerHTML=`<div class="card"><div class="grade-section"><h3>Pergunta 1</h3><p>${fb.fb1}</p></div><div class="grade-section"><h3>Pergunta 2</h3><p>${fb.fb2}</p></div><button class="btn btn-primary" style="margin-top:.75rem" onclick="completeLesson(${mi},${si},20,'leitura')">Próximo estágio →</button></div>`;
  }catch(e){document.getElementById('read-fb').innerHTML=`<button class="btn btn-primary" onclick="completeLesson(${mi},${si},20,'leitura')">Continuar →</button>`;}
}

async function submitVocab(content,mi,si){
  const resp=document.getElementById('vocab-resp').value.trim();
  if(!resp){alert('Escreva sua resposta em inglês.');return;}
  document.getElementById('vocab-fb').innerHTML='<p style="color:var(--color-text-secondary);font-style:italic">Avaliando...</p>';
  const words=content.words.map(w=>w.en).join(', ');
  const prompt=`A ${state.examResult.level} Brazilian learner of English wrote in English using these target words (${words}): "${resp}". Give 2-3 sentences of specific feedback IN PORTUGUESE — which English words used well, natural corrections (show the corrected English), one suggestion. Even broken English is fine; focus on communication. Return ONLY JSON: {"feedback":"..."}`;
  try{
    const raw=await aiCall(prompt,400);
    const fb=extractJSON(raw);
    if(!fb)throw new Error('parse');
    document.getElementById('vocab-fb').innerHTML=`<div class="card"><p style="font-size:14px;line-height:1.7">${fb.feedback}</p><button class="btn btn-primary" style="margin-top:.75rem" onclick="completeLesson(${mi},${si},15,'vocabulário')">Próximo estágio →</button></div>`;
  }catch(e){document.getElementById('vocab-fb').innerHTML=`<button class="btn btn-primary" onclick="completeLesson(${mi},${si},15,'vocabulário')">Continuar →</button>`;}
}

function addLcMsg(text,role,withSpeak=false){
  const div=document.createElement('div');div.className='msg '+(role==='ai'?'ai':'user');div.textContent=text;
  if(withSpeak){const b=document.createElement('button');b.className='speak-btn';b.textContent='🔊';b.onclick=()=>speak(text);div.appendChild(b);}
  const c=document.getElementById('lc-msgs');if(c){c.appendChild(div);c.scrollTop=9999;}
}

async function sendLcChat(content){
  const inp=document.getElementById('lc-input');const text=inp.value.trim();if(!text)return;inp.value='';
  addLcMsg(text,'user');lessonCtx.chatHistory.push({role:'user',content:text});lessonCtx.chatCount++;
  if(lessonCtx.chatCount>=4)document.getElementById('lc-grade-btn').style.display='block';
  const loading=document.createElement('div');loading.className='msg ai loading';loading.textContent='...';
  document.getElementById('lc-msgs').appendChild(loading);
  try{
    const reply=await aiChat(lessonCtx.chatHistory,`You are ${content.character}. ${content.scenario} Speak ONLY in English, level ${state.examResult.level}-appropriate (clear, simple, natural). 1-3 sentences. Stay in character. Never switch to Portuguese.`);
    loading.remove();addLcMsg(reply,'ai',true);lessonCtx.chatHistory.push({role:'assistant',content:reply});
  }catch(e){loading.textContent='Erro.';}
}

async function gradeLcChat(mi,si){
  document.getElementById('lc-grade-btn').style.display='none';
  document.getElementById('lc-fb').innerHTML='<p style="color:var(--color-text-secondary);font-style:italic">Avaliando...</p>';
  const transcript=lessonCtx.chatHistory.filter(m=>m.role==='user').map(m=>m.content).join('\n');
  const prompt=`Grade this ${state.examResult.level} Brazilian learner's English conversation. Focus on COMMUNICATION and NATURALNESS over perfect grammar. Be encouraging but specific. Highlight in PORTUGUESE.
Return ONLY JSON: {"score":"B+","highlight":"highlight in Portuguese","next_focus":"next focus in Portuguese"}\n\nTranscript:\n${transcript}`;
  try{
    const raw=await aiCall(prompt,400);
    const g=extractJSON(raw);if(!g)throw new Error('parse');
    const pts={'A+':50,'A':45,'A-':40,'B+':35,'B':30,'B-':25,'C+':20,'C':15,'C-':10,'D':8,'F':5};
    const earned=pts[g.score]||25;
    document.getElementById('lc-fb').innerHTML=`<div class="card"><div style="font-size:32px;font-weight:500;margin-bottom:4px">${g.score}</div><div class="grade-section"><h3>Destaque</h3><p>${g.highlight}</p></div><div class="grade-section"><h3>Próximo foco</h3><p>${g.next_focus}</p></div><button class="btn btn-primary" style="margin-top:.75rem" onclick="completeLesson(${mi},${si},${earned},'conversa')">Próximo estágio →</button></div>`;
  }catch(e){document.getElementById('lc-fb').innerHTML=`<button class="btn btn-primary" onclick="completeLesson(${mi},${si},25,'conversa')">Continuar →</button>`;}
}

function pickGr(qIdx,val,correct,btn,total){
  if(lessonCtx.grammarPicked[qIdx]!==undefined)return;
  lessonCtx.grammarPicked[qIdx]=val;
  const isRight=val===correct;
  document.querySelectorAll(`[id^="gp_${qIdx}_"]`).forEach(b=>{b.style.opacity='.4';});
  btn.style.opacity='1';btn.style.background=isRight?'#1d9e75':'#e24b4a';btn.style.color='#fff';btn.style.borderColor=isRight?'#1d9e75':'#e24b4a';
  document.getElementById('gfb_'+qIdx).textContent=isRight?'✓ Correto':'✗ A resposta correta é: '+correct;
  document.getElementById('gfb_'+qIdx).style.color=isRight?'#0f6e56':'#a32d2d';
  if(Object.keys(lessonCtx.grammarPicked).length>=total)document.getElementById('gr-next').style.display='block';
}

function addLdMsg(text,role,withSpeak=false){
  const div=document.createElement('div');div.className='msg '+(role==='ai'?'ai':'user');div.textContent=text;
  if(withSpeak){const b=document.createElement('button');b.className='speak-btn';b.textContent='🔊';b.onclick=()=>speak(text);div.appendChild(b);}
  const c=document.getElementById('ld-msgs');if(c){c.appendChild(div);c.scrollTop=9999;}
}

async function sendLdDebate(content){
  const inp=document.getElementById('ld-input');const text=inp.value.trim();if(!text)return;inp.value='';
  addLdMsg(text,'user');lessonCtx.chatHistory.push({role:'user',content:text});lessonCtx.chatCount++;
  if(lessonCtx.chatCount>=2)document.getElementById('ld-grade-btn').style.display='block';
  const loading=document.createElement('div');loading.className='msg ai loading';loading.textContent='...';
  document.getElementById('ld-msgs').appendChild(loading);
  try{
    const reply=await aiChat(lessonCtx.chatHistory,`You are debating: "${content.topic}" in ENGLISH only, level ${state.examResult.level}-appropriate. Argue the opposite of the learner. 2-3 sentences. Push back specifically.`);
    loading.remove();addLdMsg(reply,'ai',true);lessonCtx.chatHistory.push({role:'assistant',content:reply});
  }catch(e){loading.textContent='Erro.';}
}

async function gradeLdDebate(mi,si){
  document.getElementById('ld-grade-btn').style.display='none';
  document.getElementById('ld-fb').innerHTML='<p style="color:var(--color-text-secondary);font-style:italic">Avaliando...</p>';
  const transcript=lessonCtx.chatHistory.filter(m=>m.role==='user').map(m=>m.content).join('\n');
  const prompt=`Grade this ${state.examResult.level} Brazilian learner's English debate. Focus on argumentation, vocabulary, communication (not perfect grammar). Feedback in PORTUGUESE. Return ONLY JSON: {"score":"B+","highlight":"...","next_focus":"..."}\n\nTranscript:\n${transcript}`;
  try{
    const raw=await aiCall(prompt,400);
    const g=extractJSON(raw);if(!g)throw new Error('parse');
    const pts={'A+':60,'A':54,'A-':48,'B+':42,'B':36,'B-':30,'C+':24,'C':18,'C-':12,'D':8,'F':5};
    const earned=pts[g.score]||35;
    document.getElementById('ld-fb').innerHTML=`<div class="card"><div style="font-size:32px;font-weight:500;margin-bottom:4px">${g.score}</div><div class="grade-section"><h3>Destaque</h3><p>${g.highlight}</p></div><div class="grade-section"><h3>Próximo foco</h3><p>${g.next_focus}</p></div><button class="btn btn-primary" style="margin-top:.75rem" onclick="finishMilestoneStage(${mi},${si},${earned},'debate')">Concluir milestone →</button></div>`;
  }catch(e){document.getElementById('ld-fb').innerHTML=`<button class="btn btn-primary" onclick="finishMilestoneStage(${mi},${si},35,'debate')">Concluir →</button>`;}
}

function completeLesson(mi,si,pts,reason){
  const stageId=state.plan.milestones[mi].stages[si].id;
  if(!state.stagesDone[stageId]){state.stagesDone[stageId]=true;addPoints(pts);}
  save();
  const nextSi=si+1;
  if(nextSi<state.plan.milestones[mi].stages.length){
    openLesson(mi,nextSi);
  } else {
    finishMilestone(mi);
  }
}

function finishMilestoneStage(mi,si,pts,reason){
  const stageId=state.plan.milestones[mi].stages[si].id;
  if(!state.stagesDone[stageId]){state.stagesDone[stageId]=true;addPoints(pts);}
  finishMilestone(mi);
}

function finishMilestone(mi){
  addPoints(50);
  state.currentMilestoneIdx=Math.min(mi+1,state.plan.milestones.length-1);
  save();
  document.getElementById('lesson-container').innerHTML=`<div style="text-align:center;padding:3rem 1rem">
    <div style="font-size:40px;margin-bottom:1rem">🎉</div>
    <div style="font-size:20px;font-weight:500;margin-bottom:8px">Milestone concluído!</div>
    <p style="font-size:14px;color:var(--color-text-secondary);margin-bottom:1.5rem">${mi+1 < state.plan.milestones.length ? 'O próximo milestone está desbloqueado.' : 'Você completou todo o plano!'}</p>
    <button class="btn btn-primary" onclick="backToRoad()">Ver o plano →</button>
  </div>`;
}

function toggleLcMic(){if(window._lcMic)window._lcMic();}
function toggleLdMic(){if(window._ldMic)window._ldMic();}

// ── EXAM ─────────────────────────────────────────────────
function showExam(fromOnboarding=false){
  document.getElementById('plano-no-exam').style.display='none';
  document.getElementById('plano-main').style.display='none';
  document.getElementById('lesson-container').style.display='none';
  document.getElementById('exam-panel').style.display='block';
  document.getElementById('exam-intro-panel').style.display='block';
  document.getElementById('exam-phase-panel').style.display='none';
  document.getElementById('exam-grading-panel').style.display='none';
  document.getElementById('exam-result-panel').style.display='none';
  if(!fromOnboarding&&state.examResult)document.getElementById('exam-back-btn').style.display='inline-block';
  if(fromOnboarding){document.getElementById('exam-back-btn').style.display='none';startExam();}
}
function hideExam(){document.getElementById('exam-panel').style.display='none';renderPlano();}

const EXAM_PASSAGE=`Yesterday afternoon, the pastor arrived early at the church to prepare for the service. He arranged the chairs, checked the microphone, and talked with the musicians about the songs for the week. When the members began to arrive, he greeted them at the door with a handshake and a smile. The service was long, but no one complained — the message about forgiveness touched many hearts.`;
const EQ=["O que o pastor fez quando chegou cedo à igreja?","Como ele cumprimentou os membros que chegavam?","Como as pessoas reagiram à mensagem?"];
const GI=[
  {p:"I ___ a student. (eu sou)",a:"am",o:["am","is","are","be"]},
  {p:"She ___ from Brazil.",a:"is",o:["am","is","are","be"]},
  {p:"They ___ at school every day.",a:"are",o:["am","is","are","were"]},
  {p:"I want ___ apple, please.",a:"an",o:["a","an","the","—"]},
  {p:"He ___ to church every Sunday.",a:"goes",o:["go","goes","going","went"]},
  {p:"We ___ a great time yesterday.",a:"had",o:["have","has","had","having"]},
  {p:"I live ___ a small town.",a:"in",o:["in","on","at","to"]},
  {p:"There ___ many people at the service.",a:"were",o:["was","were","is","are"]},
  {p:"___ you like coffee?",a:"Do",o:["Do","Does","Is","Are"]},
  {p:"If I ___ time, I would visit you.",a:"had",o:["have","had","has","having"]}
];
let ea={comp:[],writing:[]},egp={};

function startExam(){
  ea={comp:[],writing:[]};egp={};
  document.getElementById('exam-intro-panel').style.display='none';
  document.getElementById('exam-phase-panel').style.display='block';
  renderEP(0);
}

function renderEPDots(cur){
  document.getElementById('phase-dots').innerHTML=['Leitura','Escrita','Gramática'].map((l,i)=>`<span style="font-size:11px;padding:3px 8px;border-radius:20px;background:${i===cur?'var(--color-text-primary)':i<cur?'#e1f5ee':'var(--color-background-secondary)'};color:${i===cur?'#fff':i<cur?'#0f6e56':'var(--color-text-secondary)'}">${l}</span>`).join('');
}

function renderEP(p){
  renderEPDots(p);
  const c=document.getElementById('phase-content'),a=document.getElementById('phase-actions');
  if(p===0){
    document.getElementById('phase-label').textContent='Fase 1 de 3';
    document.getElementById('phase-title').textContent='Compreensão de leitura';
    c.innerHTML=`<p style="font-size:13px;color:var(--color-text-secondary);margin-bottom:.5rem">Leia o texto em inglês e responda as perguntas em português.</p><div class="card" style="background:var(--color-background-secondary);border:none;margin-bottom:1rem"><p style="font-size:15px;line-height:1.9">${EXAM_PASSAGE}</p></div>`+EQ.map((q,i)=>`<div style="margin-bottom:1rem"><div style="font-size:14px;font-weight:500;margin-bottom:6px">${i+1}. ${q}</div><textarea id="eq${i}" rows="2" style="width:100%;border:0.5px solid var(--color-border-tertiary);border-radius:8px;padding:10px;font-size:14px;font-family:inherit;background:var(--color-background-primary);color:#1a1a18" placeholder="Responda em português..."></textarea></div>`).join('');
    a.innerHTML=`<button class="btn btn-primary" onclick="subEP0()">Próxima fase →</button>`;
  }else if(p===1){
    document.getElementById('phase-label').textContent='Fase 2 de 3';
    document.getElementById('phase-title').textContent='Escrita livre (em inglês)';
    c.innerHTML=`<p style="font-size:13px;color:var(--color-text-secondary);margin-bottom:1rem">Escreva em inglês. Tudo bem se for básico — escreva o que conseguir.</p><div style="margin-bottom:1.25rem"><div style="font-size:14px;font-weight:500;margin-bottom:6px">1. Tell me about your daily routine.</div><textarea id="ew1" rows="5" style="width:100%;border:0.5px solid var(--color-border-tertiary);border-radius:8px;padding:10px;font-size:15px;font-family:inherit;background:var(--color-background-primary);color:#1a1a18" placeholder="Write in English..."></textarea></div><div><div style="font-size:14px;font-weight:500;margin-bottom:6px">2. Tell me about your family or your church.</div><textarea id="ew2" rows="5" style="width:100%;border:0.5px solid var(--color-border-tertiary);border-radius:8px;padding:10px;font-size:15px;font-family:inherit;background:var(--color-background-primary);color:#1a1a18" placeholder="Write in English..."></textarea></div>`;
    a.innerHTML=`<button class="btn btn-primary" onclick="subEP1()">Próxima fase →</button><button class="btn btn-sm" onclick="renderEP(0)">← Voltar</button>`;
  }else if(p===2){
    document.getElementById('phase-label').textContent='Fase 3 de 3';
    document.getElementById('phase-title').textContent='Consciência gramatical';
    c.innerHTML=`<p style="font-size:13px;color:var(--color-text-secondary);margin-bottom:1rem">Escolha a opção correta em inglês.</p>`+GI.map((item,i)=>`<div style="margin-bottom:1.25rem"><div style="font-size:14px;margin-bottom:8px">${i+1}. ${item.p}</div><div style="display:flex;gap:6px;flex-wrap:wrap">${item.o.map(o=>`<button class="btn btn-sm" id="ep_${i}_${o.replace(/[\s']/g,'_')}" onclick="pickEG(${i},'${o.replace(/'/g,"\\'")}',this)">${o}</button>`).join('')}</div></div>`).join('');
    a.innerHTML=`<button class="btn btn-primary" onclick="subEP2()">Ver resultado →</button><button class="btn btn-sm" onclick="renderEP(1)">← Voltar</button>`;
  }
}

function subEP0(){const ans=EQ.map((_,i)=>document.getElementById('eq'+i).value.trim());if(ans.some(a=>!a)){alert('Responda todas as perguntas.');return;}ea.comp=ans;renderEP(1);}
function subEP1(){const w1=document.getElementById('ew1').value.trim(),w2=document.getElementById('ew2').value.trim();if(!w1||!w2){alert('Escreva as duas respostas (mesmo que seja inglês básico).');return;}ea.writing=[w1,w2];renderEP(2);}
function pickEG(idx,val,btn){egp[idx]=val;document.querySelectorAll(`[id^="ep_${idx}_"]`).forEach(b=>{b.style.background='';b.style.color='';b.style.borderColor='';});btn.style.background='var(--color-text-primary)';btn.style.color='#fff';btn.style.borderColor='var(--color-text-primary)';}
function subEP2(){if(Object.keys(egp).length<GI.length){alert('Responda todos os itens.');return;}ea.grammar=GI.map((item,i)=>({s:egp[i],c:item.a}));const score=ea.grammar.filter(g=>g.s===g.c).length;runExam(score);}

async function runExam(gs){
  document.getElementById('exam-phase-panel').style.display='none';
  document.getElementById('exam-grading-panel').style.display='block';
  const gd=ea.grammar.map((g,i)=>`${i+1}. Selected: "${g.s}" | Correct: "${g.c}"`).join('\n');
  const prompt=`You are a CEFR assessor for ENGLISH as a second language. The learner is a Brazilian Portuguese speaker (church member in Rondônia, Brazil). Evaluate fairly — A1 is total beginner, A2 elementary, B1 intermediate, B2 upper-intermediate, C1 advanced, C2 mastery.
READING (passage in English, answers in Portuguese — measure COMPREHENSION of the English text): Q1:"${ea.comp[0]}" Q2:"${ea.comp[1]}" Q3:"${ea.comp[2]}"
WRITING (in English — even broken English is fine; rate level, not perfection): "${ea.writing[0]}" / "${ea.writing[1]}"
GRAMMAR (English fill-in): ${gs}/10 correct\n${gd}
Return ONLY JSON. The description and notes must be in PORTUGUESE: {"level":"A2","label":"Elementary","description":"2-3 sentence plain Portuguese summary.","comprehension_note":"1 sentence in Portuguese","writing_note":"1 sentence in Portuguese","grammar_note":"1 sentence in Portuguese with the score"}`;
  try{
    const raw=await aiCall(prompt,800);
    const r=extractJSON(raw);if(!r)throw new Error('parse');
    document.getElementById('exam-grading-panel').style.display='none';
    document.getElementById('exam-result-panel').style.display='block';
    document.getElementById('result-level').textContent=r.level;
    document.getElementById('result-label').textContent=r.label;
    document.getElementById('result-desc').textContent=r.description;
    document.getElementById('result-breakdown').innerHTML=[{label:'Leitura',note:r.comprehension_note},{label:'Escrita',note:r.writing_note},{label:'Gramática',note:r.grammar_note}].map(s=>`<div style="background:var(--color-background-secondary);border-radius:8px;padding:10px"><div style="font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:var(--color-text-secondary);margin-bottom:4px">${s.label}</div><div style="font-size:13px;line-height:1.5">${s.note}</div></div>`).join('');
    state.examResult={level:r.level,label:r.label,desc:r.description,date:new Date().toLocaleDateString('pt-BR')};
    state.plan=null;state.stagesDone={};state.currentMilestoneIdx=0;
    addPoints(25);save();updateLevelWidget();
  }catch(e){document.getElementById('exam-grading-panel').innerHTML=`<p style="color:#e24b4a;text-align:center">Erro. <button class="btn btn-sm" onclick="runExam(${gs})">Tentar novamente</button></p>`;}
}

function afterExam(){
  document.getElementById('exam-panel').style.display='none';
  renderPlano();
}

// ── EXPLORAR ─────────────────────────────────────────────
function expShow(which){
  document.getElementById('exp-home').style.display='none';
  ['stories','debate','topics','vocab'].forEach(id=>document.getElementById('exp-'+id).style.display='none');
  document.getElementById('exp-'+which).style.display='block';
  if(which==='vocab')renderExpVocab();
}
function expBack(){
  document.getElementById('exp-home').style.display='block';
  ['stories','debate','topics','vocab'].forEach(id=>document.getElementById('exp-'+id).style.display='none');
}

function expOpenStory(idx){
  state.expChatStory=STORIES[idx];
  document.getElementById('exp-story-list').style.display='none';
  document.getElementById('exp-reading').style.display='block';
  document.getElementById('exp-read-phase').style.display='block';
  document.getElementById('exp-after-read').style.display='none';
  document.getElementById('exp-story-text').innerHTML=STORIES[idx].text;
  document.getElementById('exp-story-title').textContent=STORIES[idx].title;
  document.getElementById('exp-story-ctx').textContent=STORIES[idx].context;
  if(!state.storiesRead.includes(idx)){state.storiesRead.push(idx);addPoints(10);}
  bindTooltips();
}

function expHideText(){
  document.getElementById('exp-read-phase').style.display='none';
  document.getElementById('exp-after-read').style.display='block';
}

async function expGenStory(){
  document.getElementById('exp-story-list').style.display='none';
  document.getElementById('exp-reading').style.display='block';
  document.getElementById('exp-read-phase').style.display='block';
  document.getElementById('exp-after-read').style.display='none';
  document.getElementById('exp-story-text').textContent='Gerando...';
  const prompt=`Generate a ~150 word English story (A2-B1 level) for a Brazilian learner. Context: Brazilian church / market / bus / family in Rondônia, possibly meeting an American or using English. Include 4 vocab words wrapped as: <span class="word-tip"><span class="tapped" onclick="saveWord('en','pt','english-context')">en</span><span class="tooltip">pt</span></span>. Return ONLY JSON: {"title":"English title","context":"Portuguese context line","character":"Name","scenario":"English scenario","text":"English story with the wrapped vocab spans"}`;
  try{
    const raw=await aiCall(prompt,1000);
    const s=extractJSON(raw);if(!s)throw new Error('parse');
    state.expChatStory=s;
    document.getElementById('exp-story-text').innerHTML=s.text;
    document.getElementById('exp-story-title').textContent=s.title;
    document.getElementById('exp-story-ctx').textContent=s.context;
    if(!state.storiesRead.includes('gen')){state.storiesRead.push('gen');addPoints(10);}
    bindTooltips();
  }catch(e){document.getElementById('exp-story-text').textContent='Erro. Tente novamente.';}
}

function expBackToStoryList(){document.getElementById('exp-story-list').style.display='block';document.getElementById('exp-reading').style.display='none';document.getElementById('exp-chat').style.display='none';}
function expBackToReading(){document.getElementById('exp-reading').style.display='block';document.getElementById('exp-chat').style.display='none';}

function expStartChat(){
  if(!state.expChatStory)return;
  state.expChatHistory=[];
  document.getElementById('exp-reading').style.display='none';
  document.getElementById('exp-chat').style.display='block';
  document.getElementById('exp-char').textContent=state.expChatStory.character;
  document.getElementById('exp-scenario').textContent=state.expChatStory.scenario;
  document.getElementById('exp-messages').innerHTML='';
  const op='Hello! Nice to see you here.';
  addExpMsg(op,'ai',true);state.expChatHistory.push({role:'assistant',content:op});
  document.getElementById('exp-input').onkeydown=function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();expSendChat();}};
}

function addExpMsg(text,role,withSpeak=false){
  const div=document.createElement('div');div.className='msg '+(role==='ai'?'ai':'user');div.textContent=text;
  if(withSpeak){const b=document.createElement('button');b.className='speak-btn';b.textContent='🔊';b.onclick=()=>speak(text);div.appendChild(b);}
  const c=document.getElementById('exp-messages');if(c){c.appendChild(div);c.scrollTop=9999;}
}

async function expSendChat(){
  const inp=document.getElementById('exp-input');const text=inp.value.trim();if(!text)return;inp.value='';
  addExpMsg(text,'user');state.expChatHistory.push({role:'user',content:text});
  const loading=document.createElement('div');loading.className='msg ai loading';loading.textContent='...';document.getElementById('exp-messages').appendChild(loading);
  try{
    const reply=await aiChat(state.expChatHistory,`You are ${state.expChatStory.character}. ${state.expChatStory.scenario} ENGLISH only, clear and simple (A2-B1). 1-3 sentences. Never use Portuguese.`);
    loading.remove();addExpMsg(reply,'ai',true);state.expChatHistory.push({role:'assistant',content:reply});
  }catch(e){loading.textContent='Erro.';}
}

function setExpTopic(t){document.getElementById('exp-debate-topic').value=t;}

async function expStartDebate(){
  const topic=document.getElementById('exp-debate-topic').value.trim();if(!topic)return;
  state.expDebateTopic=topic;state.expDebateHistory=[];
  document.getElementById('exp-debate-setup').style.display='none';
  document.getElementById('exp-debate-chat').style.display='block';
  document.getElementById('exp-debate-label').textContent=topic;
  document.getElementById('exp-debate-msgs').innerHTML='';
  const loading=document.createElement('div');loading.className='msg ai loading';loading.textContent='...';document.getElementById('exp-debate-msgs').appendChild(loading);
  try{
    const reply=await aiChat([{role:"user",content:"What is your position on: "+topic+"?"}],`You are debating "${topic}" in ENGLISH only. Take a strong position. Invite the learner to respond. 2-3 sentences. Clear, level-appropriate (A2-B1) English.`);
    loading.remove();addExpDebateMsg(reply,'ai',true);state.expDebateHistory.push({role:'user',content:"What is your position?"},{role:'assistant',content:reply});
  }catch(e){loading.textContent='Erro.';}
  document.getElementById('exp-debate-input').onkeydown=function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();expSendDebate();}};
}

function addExpDebateMsg(text,role,withSpeak=false){
  const div=document.createElement('div');div.className='msg '+(role==='ai'?'ai':'user');div.textContent=text;
  if(withSpeak){const b=document.createElement('button');b.className='speak-btn';b.textContent='🔊';b.onclick=()=>speak(text);div.appendChild(b);}
  const c=document.getElementById('exp-debate-msgs');if(c){c.appendChild(div);c.scrollTop=9999;}
}

async function expSendDebate(){
  const inp=document.getElementById('exp-debate-input');const text=inp.value.trim();if(!text)return;inp.value='';
  addExpDebateMsg(text,'user');state.expDebateHistory.push({role:'user',content:text});
  const loading=document.createElement('div');loading.className='msg ai loading';loading.textContent='...';document.getElementById('exp-debate-msgs').appendChild(loading);
  try{
    const reply=await aiChat(state.expDebateHistory,`Debating "${state.expDebateTopic}" in ENGLISH only. Argue the opposite of the learner. 2-3 sentences. Clear English.`);
    loading.remove();
    addExpDebateMsg(reply,'ai',true);
    state.expDebateHistory.push({role:'assistant',content:reply});
  }catch(e){loading.textContent='Erro.';}
}

async function expStartTopic(key,name){
  state.expCurrentTopic=key;state.expTopicHistory=[];
  document.getElementById('exp-topic-grid').style.display='none';
  document.getElementById('exp-topic-chat').style.display='block';
  document.getElementById('exp-topic-title').textContent=name;
  document.getElementById('exp-topic-msgs').innerHTML='';
  const loading=document.createElement('div');loading.className='explore-msg tutor loading';loading.textContent='...';document.getElementById('exp-topic-msgs').appendChild(loading);
  try{
    const reply=await aiChat([{role:'user',content:'Comece a explicação agora, por favor.'}],TOPIC_PROMPTS[key],600);
    loading.remove();addExpTopicMsg(reply,'tutor');state.expTopicHistory.push({role:'assistant',content:reply});
  }catch(e){loading.textContent='Erro.';}
}

async function expSendTopic(){
  const inp=document.getElementById('exp-topic-input');const text=inp.value.trim();if(!text)return;inp.value='';
  addExpTopicMsg(text,'me');state.expTopicHistory.push({role:'user',content:text});
  const loading=document.createElement('div');loading.className='explore-msg tutor loading';loading.textContent='...';document.getElementById('exp-topic-msgs').appendChild(loading);
  try{
    const reply=await aiChat(state.expTopicHistory,TOPIC_PROMPTS[state.expCurrentTopic],600);
    loading.remove();addExpTopicMsg(reply,'tutor');state.expTopicHistory.push({role:'assistant',content:reply});
  }catch(e){loading.textContent='Erro.';}
}

function addExpTopicMsg(text,role){
  const div=document.createElement('div');div.className='explore-msg '+role;div.textContent=text;
  document.getElementById('exp-topic-msgs').appendChild(div);document.getElementById('exp-topic-msgs').scrollTop=9999;
}

function resetExpTopics(){document.getElementById('exp-topic-grid').style.display='grid';document.getElementById('exp-topic-chat').style.display='none';}

function renderExpVocab(){
  const el=document.getElementById('exp-vocab-list');
  if(!el)return;
  if(!state.savedWords.length){el.innerHTML='<p style="color:var(--color-text-secondary);font-size:14px">Nenhuma palavra salva. Toque nas palavras destacadas durante a leitura.</p>';return;}
  el.innerHTML=state.savedWords.map(w=>`<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:10px 0;border-bottom:0.5px solid var(--color-border-tertiary)"><div><div style="font-size:15px;font-weight:500">${w.en}</div><div style="font-size:12px;color:var(--color-text-secondary);margin-top:1px">"${w.ctx}"</div></div><div style="font-size:13px;color:var(--color-text-secondary)">${w.pt}</div></div>`).join('');
}

function saveWord(en,pt,ctx){
  if(!state.savedWords.find(w=>w.en===en)){state.savedWords.push({en,pt,ctx});addPoints(2);renderExpVocab();}
}

function bindTooltips(){
  document.querySelectorAll('.tapped').forEach(el=>{
    el.onclick=function(e){
      e.stopPropagation();
      const t=this.nextElementSibling;const was=t.classList.contains('show');
      document.querySelectorAll('.tooltip').forEach(x=>x.classList.remove('show'));
      if(!was)t.classList.add('show');
    };
  });
}

// Boot once DOM is ready
toggleExpMic=mkMicToggle('exp-mic','exp-input','exp-vstatus');
toggleExpDebateMic=mkMicToggle('exp-debate-mic','exp-debate-input','exp-debate-vstatus');
// expose to inline onclick handlers
window.toggleExpMic=toggleExpMic;
window.toggleExpDebateMic=toggleExpDebateMic;
window.obStep1=obStep1;window.obStep2=obStep2;window.obStartExam=obStartExam;
window.showSection=showSection;window.showExam=showExam;window.hideExam=hideExam;
window.startExam=startExam;window.afterExam=afterExam;window.renderEP=renderEP;
window.subEP0=subEP0;window.subEP1=subEP1;window.subEP2=subEP2;window.pickEG=pickEG;
window.backToRoad=backToRoad;window.generateLessonContent=generateLessonContent;
window.hideReadingText=hideReadingText;window.submitReading=submitReading;
window.submitVocab=submitVocab;window.sendLcChat=sendLcChat;window.gradeLcChat=gradeLcChat;
window.pickGr=pickGr;window.sendLdDebate=sendLdDebate;window.gradeLdDebate=gradeLdDebate;
window.completeLesson=completeLesson;window.finishMilestoneStage=finishMilestoneStage;
window.toggleLcMic=toggleLcMic;window.toggleLdMic=toggleLdMic;
window.expShow=expShow;window.expBack=expBack;window.expOpenStory=expOpenStory;
window.expHideText=expHideText;window.expGenStory=expGenStory;
window.expBackToStoryList=expBackToStoryList;window.expBackToReading=expBackToReading;
window.expStartChat=expStartChat;window.expSendChat=expSendChat;
window.setExpTopic=setExpTopic;window.expStartDebate=expStartDebate;
window.expSendDebate=expSendDebate;window.expStartTopic=expStartTopic;
window.expSendTopic=expSendTopic;window.resetExpTopics=resetExpTopics;
window.saveWord=saveWord;window.state=state;

loadState();
