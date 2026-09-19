const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const main=$("#main"), side=$("#side"), modal=$("#modal");
const curriculum=[
{name:"Mathematical Foundations",lessons:84,color:"blue",desc:"Build the mathematical language needed to reason about models, optimization and learning.",first:"Vectors & Linear Combinations"},
{name:"Computer Science & Systems",lessons:76,color:"green",desc:"Algorithms, memory, processes, networking and GPU fundamentals.",first:"Big-O and Cost Models"},
{name:"Machine Learning & Deep Learning",lessons:104,color:"violet",desc:"Statistical learning, neural networks, optimization and representation learning.",first:"What a Model Actually Learns"},
{name:"Transformers & Foundation Models",lessons:112,color:"pink",desc:"Attention, tokenization, scaling, pretraining, inference and evaluation.",first:"Self-Attention"},
{name:"Reasoning, Agents & Post-Training",lessons:82,color:"orange",desc:"Preference optimization, RL, tool use, agents and reasoning systems.",first:"Why Preference Optimization Works"},
{name:"AI Systems, Research & Frontier Engineering",lessons:62,color:"cyan",desc:"Distributed training, serving, experimentation and frontier engineering.",first:"Throughput, Latency & Utilization"}
];
const lesson={title:"Vectors & Linear Combinations",domain:"Mathematical Foundations",objective:"Understand a vector as a point, direction and computational object, then predict the effect of linear combinations before calculating them.",steps:["Mental Model","Predict","Derive","Implement","Transfer"]};
let state=JSON.parse(localStorage.getItem("blackpearl-state")||'{"mastery":0,"lessonStep":0,"answered":false,"completed":[]}'); window.state=state;
const save=()=>localStorage.setItem("blackpearl-state",JSON.stringify(state));
function setActive(label){
  const key=label.toLowerCase();
  $$("aside nav button").forEach(b=>b.classList.toggle("active",b.textContent.toLowerCase().includes(key)));
  const mobileMap={"overview":"home","curriculum":"curriculum","projects":"projects","interview arena":"interview","research lab":"research"};
  const mobileKey=mobileMap[key]||key;
  $$(".mobile-tabs button").forEach(b=>b.classList.toggle("active",b.textContent.toLowerCase().includes(mobileKey)));
}
function renderOverview(){main.innerHTML=`
<section class="hero"><div class="hero-copy"><div class="eyebrow">▥ &nbsp; HARD LEARNING MODE</div><div class="journey">Your AI learning journey</div><h1>Build the mind<br>behind the next.</h1><p>Turn AI theory into deep, testable capability through interactive learning, implementation, debugging and research.</p><div class="hero-actions"><button class="primary" data-action="lesson">Continue learning →</button><button class="secondary" data-action="mentor">♙ &nbsp; Meet your mentor</button></div></div></section>
<section class="heading"><div><small>YOUR PROGRESS</small><h2>Learning at a glance</h2></div><em>L${Math.min(6,Math.floor(state.mastery/3)+1)} Foundation</em></section>
<section class="stats"><article><div class="stat-icon blue">▣</div><small>DOMAINS</small><strong>06</strong><p>Math → Frontier</p></article><article><div class="stat-icon green">▤</div><small>LESSONS</small><strong>520</strong><p>Structured curriculum</p></article><article><div class="stat-icon violet">⌁</div><small>DEEP PROJECTS</small><strong>12</strong><p>Build, break, rebuild</p></article><article><div class="stat-icon amber">▥</div><small>MASTERY</small><strong>${state.mastery}%</strong><p>Evidence based</p></article></section>
<section class="heading curriculum-heading"><div><small>CURRICULUM</small><h2>Six learning domains</h2></div><button class="view-all" data-action="curriculum">View all&nbsp; ›</button></section>
<section class="grid">${curriculum.map((d,i)=>`<article class="card" data-domain="${i}"><div class="domain-icon ${d.color}">${["Σ","▱","⌘","◇","♧","⌁"][i]}</div><div class="card-copy"><small>0${i+1} · ${d.lessons} LESSONS</small><h3>${d.name}</h3><p>${d.desc}</p></div><button class="card-arrow" data-domain-open="${i}" aria-label="Open ${d.name}">›</button><div class="bar"><i style="width:${Math.max(8,state.mastery/2)}%"></i></div></article>`).join("")}</section>
<section class="mentor"><b>◆</b><div><small>DIGITAL MENTOR</small><h2>Don't just read. Think.</h2><p>Your mentor asks before explaining, probes weak assumptions and adapts difficulty to your evidence.</p></div><button class="secondary" data-action="mentor">Enter mentor →</button></section>`;
}
function renderCurriculum(domain=0){const d=BP_DOMAINS[Number(domain)]||BP_DOMAINS[0];main.innerHTML=`<section class="page-head"><small>CURRICULUM ENGINE</small><h1>${d[0]}</h1><p>Every domain moves from intuition to implementation, debugging, transfer and research.</p></section><div class="domain-switch">${BP_DOMAINS.map((x,i)=>`<button class="${i==domain?"selected":""}" data-bpd="${i}">0${i+1} ${x[0]}</button>`).join("")}</div><section class="topic-list">${d[1].map((x,i)=>`<article class="topic-row"><span>${String(i+1).padStart(2,"0")}</span><div><small>CORE TOPIC</small><h2>${x}</h2><p>Concept → prediction → derivation → implementation → transfer.</p></div><button class="secondary" data-bpt="${i}">${i===0?"Start":"Open"} lesson →</button></article>`).join("")}</section>`;}
function renderMentor(){main.innerHTML=`<section class="page-head"><small>MENTOR ENGINE</small><h1>Think first. Get help second.</h1><p>The mentor does not immediately reveal the answer. It diagnoses whether the gap is conceptual, mathematical, implementation or transfer-related.</p></section><section class="mentor-console"><div class="mentor-console-top"><span class="eyebrow">LIVE DIAGNOSTIC</span><span class="mentor-status">● READY</span></div><h2>What should happen if we multiply a vector by 0.5?</h2><p class="mentor-question">Don't calculate yet. Describe what changes geometrically.</p><textarea id="mentorAnswer" placeholder="Explain your reasoning in your own words..."></textarea><button class="primary" data-action="mentor-check">Submit reasoning →</button><div id="mentorFeedback"></div></section>`;}
function renderLesson(){const s=lesson.steps[state.lessonStep];main.innerHTML=`<section class="lesson-shell"><div class="lesson-top"><button class="back" data-action="overview">← Dashboard</button><span>MATHEMATICAL FOUNDATIONS · LESSON 01</span></div><div class="lesson-progress"><i style="width:${((state.lessonStep+1)/lesson.steps.length)*100}%"></i></div><div class="lesson-grid"><article class="lesson-main"><small>STEP ${state.lessonStep+1} OF ${lesson.steps.length}</small><h1>${lesson.title}</h1><div class="step-pill">${s}</div>${lessonBody(s)}</article><aside class="lesson-rail"><small>LEARNING OBJECTIVE</small><p>${lesson.objective}</p><hr><small>MASTERY SIGNALS</small><ul><li>Predict before calculating</li><li>Explain the mechanism</li><li>Transfer to a new case</li></ul></aside></div></section>`;}
function lessonBody(step){if(step==="Mental Model")return`<div class="concept"><h2>A vector is more than a list of numbers.</h2><p>In a two-dimensional space, <b>v = [3, 2]</b> can be viewed as a location, a direction with magnitude, or a compact representation that an algorithm can transform.</p><div class="equation">v = [3, 2] &nbsp;&nbsp;→&nbsp;&nbsp; 2v = [6, 4]</div></div><button class="primary lesson-next" data-action="next">I understand the model →</button>`;
if(step==="Predict")return`<div class="concept"><h2>Predict before you calculate.</h2><p>If <b>v = [4, 6]</b>, what should happen when we multiply it by <b>0.5</b>?</p><div class="choice-grid"><button data-choice="same">It stays the same</button><button data-choice="half">Every component becomes half</button><button data-choice="rotate">It rotates 90°</button><button data-choice="zero">It becomes zero</button></div><div id="choiceFeedback"></div></div>`;
if(step==="Derive")return`<div class="concept"><h2>Derive the operation.</h2><p>Scalar multiplication distributes over every coordinate. Write the transformation for <b>a·[x,y]</b>.</p><input id="derive" class="answer" placeholder="e.g. [ax, ay]"><button class="primary lesson-next" data-action="derive-check">Check derivation →</button><div id="deriveFeedback"></div></div>`;
if(step==="Implement")return`<div class="concept"><h2>Implementation checkpoint.</h2><p>Before using a library, describe the smallest function that performs scalar multiplication.</p><pre class="codebox">function scale(v, a) {\n  // return a new vector\n}</pre><textarea id="impl" class="answer area" placeholder="Describe the algorithm or write pseudocode..."></textarea><button class="primary lesson-next" data-action="impl-check">Submit implementation →</button><div id="implFeedback"></div></div>`;
return`<div class="concept"><h2>Transfer the idea.</h2><p>A model layer receives a hidden representation <b>h</b>. Why might scaling a representation change the model's downstream behavior even though its direction is unchanged?</p><textarea id="transfer" class="answer area" placeholder="Reason it out. There is more than one defensible answer."></textarea><button class="primary lesson-next" data-action="transfer-check">Submit transfer reasoning →</button><div id="transferFeedback"></div></div>`;}
function renderProjects(){main.innerHTML=`<section class="page-head"><small>PROJECT LADDER</small><h1>Turn knowledge into systems.</h1><p>Projects increase in scope from micro experiments to research-grade engineering.</p></section><section class="project-grid">${["Vector Playground","Backprop From Scratch","Tiny Transformer","Attention Profiler","Preference Optimization Lab","Distributed Training Harness"].map((x,i)=>`<article class="project-card"><small>PROJECT 0${i+1}</small><h2>${x}</h2><p>${["Hours","1–2 days","3–5 days","1 week","2–3 weeks","Capstone"][i]} · evidence driven</p><button class="secondary" data-action="project" data-project="${i}">Open brief →</button></article>`).join("")}</section>`;}
function renderInterview(){main.innerHTML=`<section class="page-head"><small>INTERVIEW ARENA</small><h1>Explain it under pressure.</h1><p>Questions progress from definitions to derivations, debugging, system design and research follow-ups.</p></section><section class="arena"><div><span>QUESTION 01</span><h2>Why does gradient descent need a learning rate?</h2><p>Explain the parameter update mechanism and what happens when the step is too large or too small.</p></div><textarea id="interviewAnswer" class="answer area" placeholder="Your answer..."></textarea><button class="primary" data-action="interview-check">Evaluate answer →</button><div id="interviewFeedback"></div></section>`;}
function renderResearch(){main.innerHTML=`<section class="page-head"><small>RESEARCH LAB</small><h1>Turn uncertainty into experiments.</h1><p>Capture hypotheses, variables, baselines, ablations and failure analysis before claiming an improvement.</p></section><section class="research-board"><article><small>HYPOTHESIS</small><h2>What do you believe?</h2><textarea class="answer area" placeholder="State a falsifiable hypothesis..."></textarea></article><article><small>EXPERIMENT</small><h2>How would you test it?</h2><textarea class="answer area" placeholder="Define baseline, variables and measurement..."></textarea></article></section>`;}
function renderSettings(){
main.innerHTML=`<section class="page-head"><small>SYSTEM SETTINGS</small><h1>Make BlackPearl yours.</h1><p>Control the learning experience without changing the curriculum architecture.</p></section>
<section class="settings-grid">
<article class="settings-card"><h2>Appearance</h2><p>Choose the visual mode used across the learning system.</p><div class="settings-row"><span>Theme</span><button class="secondary" data-action="settings-theme">${document.documentElement.classList.contains("dark")?"Dark":"Light"} mode</button></div></article>
<article class="settings-card"><h2>Learning state</h2><p>Your mastery evidence is stored locally on this device.</p><div class="settings-row"><span>Current mastery</span><span class="settings-value">${state.mastery||0}%</span></div><div class="settings-row"><span>Completed evidence</span><span class="settings-value">${(state.completed||[]).length}</span></div><div class="settings-row"><span>Reset progress</span><button class="secondary danger" data-action="reset-progress">Reset local progress</button></div></article>
</section>`;
}
function navigate(label){setMenuOpen(false);setActive(label);if(label==="Overview")renderOverview();else if(label==="Curriculum")renderCurriculum();else if(label==="Mentor")renderMentor();else if(label==="Projects")renderProjects();else if(label==="Interview Arena")renderInterview();else if(label==="Research Lab")renderResearch();else if(label==="Settings")renderSettings();else renderOverview();window.scrollTo({top:0,behavior:"smooth"});}
function feedback(id,msg,good=true){const e=$(id);if(e)e.innerHTML=`<div class="feedback ${good?"good":"coach"}">${msg}</div>`;}
document.addEventListener("click",e=>{const b=e.target.closest("[data-action]");if(b){const a=b.dataset.action;if(a==="lesson"){setActive("Overview");bpLesson("Vectors & Linear Combinations")}if(a==="mentor"){navigate("Mentor")}if(a==="curriculum"){navigate("Curriculum")}if(a==="overview"){navigate("Overview")}if(a==="next"){state.lessonStep=Math.min(lesson.steps.length-1,state.lessonStep+1);save();renderLesson()}if(a==="mentor-check"){const v=$("#mentorAnswer")?.value.toLowerCase()||"";feedback("#mentorFeedback",v.includes("half")||v.includes("magnitude")||v.includes("length")?"Good. You identified the key geometric effect: scaling changes magnitude while preserving direction for a positive scalar.":"Push further: what happens to magnitude, direction and each coordinate?",v.includes("half")||v.includes("magnitude"))}if(a==="derive-check"){const v=$("#derive")?.value.replace(/\s/g,"").toLowerCase()||"";const ok=v.includes("ax")&&v.includes("ay");feedback("#deriveFeedback",ok?"Correct. Scalar multiplication distributes coordinate-wise.":"Not yet. Start from a·[x,y] and apply the scalar to each component.",ok);if(ok){state.mastery=Math.min(100,state.mastery+5);save()}}if(a==="impl-check"){const v=$("#impl")?.value||"";feedback("#implFeedback",v.length>20?"Good. You described an actual transformation rather than relying on a library call.":"Give the algorithm: iterate through components, multiply each by the scalar, return a new vector.",v.length>20);if(v.length>20){state.mastery=Math.min(100,state.mastery+5);save()}}if(a==="transfer-check"){const v=$("#transfer")?.value||"";feedback("#transferFeedback",v.length>30?"Strong transfer attempt. Consider separating direction, magnitude and the effect on downstream dot products or activations.":"Make one causal chain: scaling → representation statistics → downstream operation → output.",v.length>30);if(v.length>30){state.mastery=Math.min(100,state.mastery+5);save()}}
if(a==="project"){const briefs=["Explore vector geometry through direct manipulation.","Implement reverse-mode autodiff for a tiny computation graph.","Build a minimal Transformer and inspect its attention.","Measure attention cost and identify bottlenecks.","Compare preference optimization objectives on controlled data.","Build a distributed training loop and measure communication."];const i=Number(b.dataset.project||0);const box=document.querySelector(".project-card");alert((briefs[i]||"Project brief")+"\n\nStart with a measurable baseline, implement the mechanism, record evidence, then explain failure modes.");}
if(a==="interview-check"){const v=$("#interviewAnswer")?.value.toLowerCase()||"";const ok=v.includes("step")||v.includes("gradient")||v.includes("learning rate")||v.includes("update");feedback("#interviewFeedback",ok?"Good. You connected the learning rate to the parameter update mechanism. Push further by explaining overshoot, slow convergence and sensitivity to scale.":"Explain the actual update: parameters move by a gradient multiplied by a step size, so the learning rate sets the magnitude of each update.",ok)}
if(a==="settings-theme"){$("#theme")?.click();setTimeout(renderSettings,0)}
if(a==="reset-progress"){if(confirm("Reset BlackPearl learning progress on this device?")){state={mastery:0,lessonStep:0,answered:false,completed:[]};save();renderSettings()}}}});
document.addEventListener("click",e=>{const c=e.target.closest("[data-choice]");if(!c)return;$$("[data-choice]").forEach(x=>x.classList.remove("selected"));c.classList.add("selected");const ok=c.dataset.choice==="half";const el=$("#choiceFeedback");if(el)el.innerHTML=`<div class="feedback ${ok?"good":"coach"}">${ok?"Correct. Scalar multiplication scales every component, so [4,6] becomes [2,3].":"Check the operation coordinate by coordinate. What happens to x? What happens to y?"}</div>`;if(ok){state.mastery=Math.min(100,state.mastery+5);state.answered=true;save();setTimeout(()=>{state.lessonStep=2;save();renderLesson()},650)}});
function setMenuOpen(open){if(!side||!$("#menu"))return;side.classList.toggle("open",open);document.body.classList.toggle("menu-open",open);$("#menu").setAttribute("aria-expanded",String(open));$("#menu").setAttribute("aria-label",open?"Close navigation":"Open navigation");}
if($("#menu")){$("#menu").onclick=()=>setMenuOpen(!side?.classList.contains("open"));$("#menu").setAttribute("aria-label","Open navigation");}

const savedTheme=localStorage.getItem("blackpearl-theme");if(savedTheme!=="light")document.documentElement.classList.add("dark");
if($("#theme"))$("#theme").onclick=()=>{const dark=document.documentElement.classList.toggle("dark");localStorage.setItem("blackpearl-theme",dark?"dark":"light");};
function closeSearch(){
  if(!modal)return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("search-open");
}
function openSearch(){
  if(!modal)return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("search-open");
  const q=$("#q"); if(q){q.value="";renderSearchResults("");setTimeout(()=>q.focus(),0);}
}
function renderSearchResults(query){
  const box=$("#searchResults"); if(!box)return;
  const q=String(query||"").trim().toLowerCase();
  if(!q){box.innerHTML="";return;}
  const domains=(typeof BP_DOMAINS!=="undefined"?BP_DOMAINS:[]).flatMap((d,di)=>d[1].map((title,ti)=>({title,domain:d[0],di,ti})));
  const matches=domains.filter(x=>(x.title+" "+x.domain).toLowerCase().includes(q)).slice(0,8);
  box.innerHTML=matches.length?matches.map(x=>`<button class="search-result" data-search-domain="${x.di}" data-search-topic="${x.ti}"><b>${x.title}</b><small>${x.domain}</small></button>`).join(""):`<div class="search-empty">No matching lesson found. Try attention, backprop, KV cache or optimization.</div>`;
}
if($("#search"))$("#search").onclick=openSearch;
if($("#close"))$("#close").onclick=closeSearch;
if(modal)modal.onclick=e=>{if(e.target===modal)closeSearch()};
$("#q")?.addEventListener("input",e=>renderSearchResults(e.target.value));
document.addEventListener("click",e=>{
  const result=e.target.closest("[data-search-domain]");
  if(result){
    closeSearch();
    bpCurriculum(Number(result.dataset.searchDomain));
    setActive("Curriculum");
    setTimeout(()=>{
      const topic=document.querySelector(`[data-bpt="${result.dataset.searchTopic}"]`);
      if(topic)topic.click();
    },0);
  }
});
document.addEventListener("click",e=>{if(side.classList.contains("open")&&!e.target.closest("#side")&&!e.target.closest("#menu"))setMenuOpen(false);});

document.onkeydown=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch()}if(e.key==="Escape"){closeSearch();setMenuOpen(false)}};
initReferenceShell();


function initReferenceShell(){
  const overlay=$("#menuOverlay"), open=$("#menuButton"), close=$("#closeButton");
  const show=()=>{overlay?.classList.add("open");overlay?.setAttribute("aria-hidden","false");open?.setAttribute("aria-expanded","true");document.body.classList.add("locked");setTimeout(()=>close?.focus(),120)};
  const hide=()=>{overlay?.classList.remove("open");overlay?.setAttribute("aria-hidden","true");open?.setAttribute("aria-expanded","false");document.body.classList.remove("locked");};
  open?.addEventListener("click",()=>overlay?.classList.contains("open")?hide():show());
  close?.addEventListener("click",hide);
  overlay?.addEventListener("click",e=>{if(e.target===overlay)hide()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")hide()});
  document.addEventListener("click",e=>{
    const item=e.target.closest("[data-bp-nav]");
    if(!item)return;
    e.preventDefault();
    hide();
    const target=item.dataset.bpNav;
    if(target==="overview")renderOverview();
    else if(target==="curriculum")renderCurriculum(0);
    else if(target==="mentor")renderMentor();
    else if(target==="projects")renderProjects();
    else if(target==="interview")renderInterview();
    else if(target==="research")renderResearch();
    else if(target==="settings")renderSettings();
    window.scrollTo({top:0,behavior:"smooth"});
  });
}
// BLACKPEARL CONTENT + MASTERY ENGINE
const BP_LESSONS={
"Vectors & Linear Combinations":{domain:"Mathematical Foundations",objective:"Understand vectors as geometric and computational objects and predict the effect of scalar operations.",mental:"A vector can represent a point, a direction, or a compact state. The useful habit is to ask what operation changes and what remains invariant.",predict:"If v = [4,6] and a = 0.5, what should happen?",options:["[4,6]","[2,3]","[8,12]","[0,0]"],answer:1,derive:"a·[x,y] = [ax, ay]",transfer:"Scaling a representation changes magnitude while preserving direction for a positive scalar."},
"Self-Attention":{domain:"Transformers & Foundation Models",objective:"Predict how query-key similarity controls information flow.",mental:"Attention is a content-addressed information routing mechanism. Queries ask what is relevant, keys describe what each token offers, and values carry the information.",predict:"If a query becomes more similar to one key while all other keys remain unchanged, what should happen?",options:["That key receives more attention weight","All weights become zero","The sequence is reversed","Nothing changes"],answer:0,derive:"Attention(Q,K,V)=softmax(QKᵀ/√dₖ)V",transfer:"Changing similarity changes the routing distribution, which changes the mixture of value vectors."},
"Backpropagation":{domain:"Machine Learning & Deep Learning",objective:"Trace local derivatives backward through a computation graph.",mental:"Backpropagation is repeated application of the chain rule. Each node receives an upstream sensitivity and multiplies it by its local derivative.",predict:"If y=2x and loss L=y², how does dL/dx relate to x?",options:["2x","4x","x²","4"],answer:1,derive:"dL/dx = dL/dy · dy/dx = 2y · 2 = 4x",transfer:"The same local-gradient composition works through deep computational graphs."},
"KV Cache":{domain:"Transformers & Foundation Models",objective:"Understand why cached keys and values reduce repeated computation during autoregressive decoding.",mental:"During generation, earlier tokens do not change. Their keys and values can therefore be reused instead of recomputed for every new token.",predict:"As a sequence grows, what does KV caching primarily reduce?",options:["Repeated computation for previous tokens","Model parameter count","Vocabulary size","Training data"],answer:0,derive:"Cache K,V for prior positions; compute new K,V only for the newly generated token.",transfer:"Caching is useful whenever an expensive result remains valid across repeated queries."}
};
function bpLesson(title){
const l=BP_LESSONS[title]||BP_LESSONS["Vectors & Linear Combinations"];
const steps=["Mental Model","Predict","Derive","Implement","Transfer"];
state.bpLesson={title,step:state.bpLesson?.title===title?state.bpLesson.step:0};save();
function draw(){
const s=steps[state.bpLesson.step];
let body="";
if(s==="Mental Model")body=`<div class="concept"><h2>Build the mental model.</h2><p>${l.mental}</p><div class="equation">Intuition → mechanism → prediction</div></div><button class="primary lesson-next" data-bpnext>I have the model →</button>`;
if(s==="Predict")body=`<div class="concept"><h2>Predict before calculating.</h2><p>${l.predict}</p><div class="choice-grid">${l.options.map((x,i)=>`<button data-bpchoice="${i}">${x}</button>`).join("")}</div><div id="bpfeedback"></div></div>`;
if(s==="Derive")body=`<div class="concept"><h2>Derive the mechanism.</h2><p>Write the relationship in your own notation before checking the reference.</p><div class="equation">${l.derive}</div><textarea id="bpanswer" class="answer area" placeholder="Explain the derivation in your own words..."></textarea><button class="primary" data-bpcheck>Check reasoning →</button><div id="bpfeedback"></div></div>`;
if(s==="Implement")body=`<div class="concept"><h2>Implementation checkpoint.</h2><p>Describe the smallest implementation that would demonstrate the mechanism.</p><pre class="codebox">function demonstrate(input) {\n  // isolate one mechanism\n  // produce an observable result\n}</pre><textarea id="bpanswer" class="answer area" placeholder="Write pseudocode or implementation reasoning..."></textarea><button class="primary" data-bpcheck>Submit implementation →</button><div id="bpfeedback"></div></div>`;
if(s==="Transfer")body=`<div class="concept"><h2>Transfer the idea.</h2><p>Where else could the same mechanism appear? Explain the causal connection.</p><textarea id="bpanswer" class="answer area" placeholder="Give an unfamiliar example and explain why the mechanism transfers..."></textarea><button class="primary" data-bpcheck>Submit transfer →</button><div id="bpfeedback"></div></div>`;
main.innerHTML=`<section class="lesson-shell"><div class="lesson-top"><button class="back" data-action="curriculum">← Curriculum</button><span>${l.domain.toUpperCase()} · ${title.toUpperCase()}</span></div><div class="lesson-progress"><i style="width:${(state.bpLesson.step+1)/steps.length*100}%"></i></div><div class="lesson-grid"><article class="lesson-main"><small>STEP ${state.bpLesson.step+1} OF ${steps.length}</small><h1>${title}</h1><div class="step-pill">${s}</div>${body}</article><aside class="lesson-rail"><small>LEARNING OBJECTIVE</small><p>${l.objective}</p><hr><small>MASTERY SIGNALS</small><ul><li>Prediction before calculation</li><li>Mechanistic explanation</li><li>Independent transfer</li></ul></aside></div></section>`;
}
draw();
}
document.addEventListener("click",e=>{
const t=e.target.closest("[data-bpt]");
if(t){const active=document.querySelector("[data-bpd].selected");const di=Number(active?.dataset.bpd||0),ti=Number(t.dataset.bpt||0);const title=BP_DOMAINS[di][1][ti];bpLesson(title)}
const n=e.target.closest("[data-bpnext]");
if(n){state.bpLesson.step=Math.min(4,(state.bpLesson?.step||0)+1);save();bpLesson(state.bpLesson.title)}
const c=e.target.closest("[data-bpchoice]");
if(c){const l=BP_LESSONS[state.bpLesson.title]||BP_LESSONS["Vectors & Linear Combinations"];const ok=Number(c.dataset.bpchoice)===l.answer;$$("[data-bpchoice]").forEach(x=>x.classList.remove("selected"));c.classList.add("selected");const f=$("#bpfeedback");if(f)f.innerHTML=`<div class="feedback ${ok?"good":"coach"}">${ok?"Correct. Now explain why the mechanism produces that result.":"Not yet. Re-read the objects and operation, then predict the measurable effect."}</div>`;if(ok){state.mastery=Math.min(100,(state.mastery||0)+5);state.completed=(state.completed||[]).concat(state.bpLesson.title+":prediction");save();setTimeout(()=>{state.bpLesson.step=2;save();bpLesson(state.bpLesson.title)},550)}}
const ch=e.target.closest("[data-bpcheck]");
if(ch){const v=$("#bpanswer")?.value.trim()||"";const ok=v.length>=25;feedback("#bpfeedback",ok?"Good. Your reasoning is now evidence that you can articulate the mechanism.":"Too shallow. State the objects, operation, causal effect and what you would observe.",ok);if(ok){state.mastery=Math.min(100,(state.mastery||0)+5);state.completed=(state.completed||[]).concat(state.bpLesson.title+":"+state.bpLesson.step);save();if(state.bpLesson.step<4)setTimeout(()=>{state.bpLesson.step++;save();bpLesson(state.bpLesson.title)},650)}}
});

// Curriculum data bridge
const BP_DOMAINS=[
["Mathematical Foundations",["Vectors & Linear Combinations","Matrices & Linear Maps","Eigenvalues & Eigenvectors","Partial Derivatives","Gradients & Jacobians","Probability Distributions","Expectation & Variance","Optimization","Numerical Stability"]],
["Computer Science & Systems",["Big-O & Cost Models","Data Structures","Recursion & Dynamic Programming","Memory & Processes","Concurrency","Networking","Operating Systems","GPU Architecture","Parallel Thinking"]],
["Machine Learning & Deep Learning",["Learning Theory","Linear Models","Loss Functions","Gradient Descent","Backpropagation","Regularization","CNNs","RNNs & LSTMs","Training Dynamics"]],
["Transformers & Foundation Models",["Tokenization","Embeddings","Self-Attention","Multi-Head Attention","Positional Information","Transformer Blocks","Pretraining","Scaling Laws","KV Cache","Evaluation"]],
["Reasoning, Agents & Post-Training",["RL Foundations","Reward Modeling","SFT","Preference Learning","DPO","GRPO","Reasoning Traces","Tool Use","Agent Loops","Evaluation Harnesses"]],
["AI Systems, Research & Frontier Engineering",["Profiling","GPU Kernels","Distributed Data Parallel","Tensor Parallelism","Inference Serving","Quantization","Caching","Experiment Design","Ablations","Research Workflow"]]
];
function bpCurriculum(domain=0){const d=BP_DOMAINS[Number(domain)]||BP_DOMAINS[0];main.innerHTML=`<section class="page-head"><small>CURRICULUM ENGINE</small><h1>${d[0]}</h1><p>${"Every concept follows the BlackPearl loop: intuition → prediction → derivation → implementation → debugging → transfer."}</p></section><div class="domain-switch">${BP_DOMAINS.map((x,i)=>`<button class="${i==domain?"selected":""}" data-bpd="${i}">0${i+1} ${x[0]}</button>`).join("")}</div><section class="topic-list">${d[1].map((x,i)=>`<article class="topic-row"><span>${String(i+1).padStart(2,"0")}</span><div><small>LESSON ${i+1}</small><h2>${x}</h2><p>Concept → prediction → derivation → implementation → transfer.</p></div><button class="secondary" data-bpt="${i}">${i?"Open":"Start"} lesson →</button></article>`).join("")}</section>`;}
renderCurriculum=bpCurriculum;
document.addEventListener("click",e=>{const d=e.target.closest("[data-bpd]");if(d)bpCurriculum(d.dataset.bpd);});


// BLACKPEARL COMPLETE TOPIC SEEDS
const BP_TOPIC_SEEDS={
"Vectors & Linear Combinations":["A vector is a coordinate representation with algebraic structure.","For v=[4,6], scaling by 0.5 gives [2,3].","a[x,y]=[ax,ay]","Implement scalar multiplication without a library.","Explain why positive scaling preserves direction."],
"Matrices & Linear Maps":["A matrix is a function that maps vectors to other vectors.","A 2x2 matrix can rotate, scale, shear, or combine these effects.","y=Ax","Implement matrix-vector multiplication and inspect the output.","Explain how composition of matrices represents sequential transformations."],
"Eigenvalues & Eigenvectors":["An eigenvector keeps its direction under a linear transformation; only its scale changes.","If Av=3v, the eigenvalue is 3.","Av=λv","Write a routine that checks whether Av is approximately a scalar multiple of v.","Explain why eigenvectors reveal invariant directions."],
"Partial Derivatives":["A partial derivative measures sensitivity to one variable while holding the others fixed.","For f(x,y)=x²+3y, ∂f/∂x=2x.","∂f/∂x = lim(h→0)[f(x+h,y)-f(x,y)]/h","Approximate one partial derivative with finite differences.","Explain what holding a variable fixed means geometrically."],
"Gradients & Jacobians":["The gradient collects scalar-output sensitivities; the Jacobian generalizes derivatives to vector outputs.","For f=[f1,f2], the Jacobian contains every ∂fi/∂xj.","∇f=[∂f/∂x1,…,∂f/∂xn]","Compute a numerical gradient from function evaluations.","Explain how a Jacobian differs from a gradient."],
"Probability Distributions":["A distribution assigns probability mass or density to possible outcomes.","For a fair binary variable, each outcome has probability 0.5.","Σx P(X=x)=1","Sample from a simple categorical distribution and estimate frequencies.","Explain the difference between probability mass and density."],
"Expectation & Variance":["Expectation is a probability-weighted average; variance measures squared deviation around it.","For X taking 0 and 2 equally often, E[X]=1.","E[X]=Σx xP(X=x)","Estimate mean and variance from samples.","Explain why variance uses squared deviations."],
"Optimization":["Optimization searches for parameters that minimize or maximize an objective.","A gradient points toward steepest local increase, so negative gradient points toward local decrease.","θ←θ−η∇L(θ)","Implement gradient descent on a quadratic.","Explain how learning rate changes the optimization trajectory."],
"Numerical Stability":["Numerical stability asks whether finite-precision computation preserves useful accuracy.","Exponentials can overflow, so softmax is commonly stabilized by subtracting the maximum logit.","softmax(z)i=exp(zi−max(z))/Σj exp(zj−max(z))","Implement stable softmax and compare it with naive softmax on large logits.","Explain why subtracting a constant does not change softmax probabilities."],

"Big-O & Cost Models":["Big-O describes how resource use scales as input size grows.","A single loop over n items is O(n).","T(n)=O(n)","Measure runtime as input size increases and identify the scaling trend.","Explain why constants can matter in engineering even when Big-O is unchanged."],
"Data Structures":["A data structure organizes data to make particular operations efficient.","A hash table targets average O(1) lookup under suitable assumptions.","lookup(key)→value","Implement a small map using buckets.","Choose a structure by matching its operations to the workload."],
"Recursion & Dynamic Programming":["Recursion expresses a problem through smaller instances; dynamic programming reuses overlapping subproblems.","Fibonacci becomes linear when previously computed values are reused.","dp[i]=dp[i−1]+dp[i−2]","Implement memoized Fibonacci.","Explain when memoization changes exponential recursion into polynomial or linear work."],
"Memory & Processes":["A process owns an address space and resources; memory behavior strongly affects performance.","Sequential access often benefits from locality compared with scattered access.","address→cache→memory","Measure the effect of sequential versus strided access.","Explain why cache locality can dominate nominal algorithmic cost."],
"Concurrency":["Concurrency structures multiple activities that may overlap in time, creating synchronization concerns.","Two workers updating shared state can produce a race without coordination.","critical section + synchronization","Construct a counter with and without synchronization.","Explain the difference between concurrency and parallelism."],
"Networking":["Networking moves data between independently executing machines through layered protocols.","Latency and bandwidth are distinct constraints.","time≈latency+payload/bandwidth","Measure the effect of payload size on transfer time.","Explain why a high-bandwidth link can still feel slow for tiny requests."],
"Operating Systems":["An operating system mediates CPU, memory, storage, devices and processes.","Virtual memory gives processes an abstraction of address space backed by physical memory.","virtual address→page table→physical frame","Trace a simple virtual-to-physical translation.","Explain why isolation between processes matters."],
"GPU Architecture":["GPUs execute many similar operations concurrently using massive parallel throughput.","A workload with many independent elements can map naturally to GPU threads.","element i→thread i","Describe a parallel mapping for vector addition.","Explain why branch divergence can reduce GPU efficiency."],
"Parallel Thinking":["Parallel thinking decomposes work into independent or coordinated units.","Amdahl's law shows that a serial fraction limits total speedup.","S=1/(s+(1−s)/p)","Estimate speedup for a workload with a serial fraction.","Explain why adding more workers eventually gives diminishing returns."],

"Learning Theory":["Learning theory studies when patterns inferred from data generalize beyond the observed sample.","A model can fit training data while failing on unseen data.","generalization gap = test error − train error","Design a train/test experiment that exposes overfitting.","Explain why capacity, data and regularization interact."],
"Linear Models":["A linear model predicts through a weighted combination of input features.","Changing a weight changes the contribution of its feature.","ŷ=wᵀx+b","Implement linear regression with gradient descent.","Explain when a linear decision boundary is insufficient."],
"Loss Functions":["A loss converts prediction error into an optimization objective.","Mean squared error penalizes squared residual magnitude.","L=1/n Σ(ŷ−y)²","Implement MSE and compare it with absolute error on outliers.","Explain how the loss function changes what the model is encouraged to fit."],
"Gradient Descent":["Gradient descent updates parameters opposite the local gradient.","A large learning rate can overshoot a minimum.","θt+1=θt−η∇L","Implement descent on a convex function.","Explain why zero gradient does not always imply a global minimum."],
"Backpropagation":["Backpropagation applies the chain rule efficiently through a computation graph.","For y=2x and L=y², dL/dx=4x.","dL/dx=(dL/dy)(dy/dx)","Implement reverse-mode differentiation for a tiny graph.","Trace how an upstream gradient is multiplied by local derivatives."],
"Regularization":["Regularization changes the training objective to discourage undesirable solutions.","L2 regularization adds a penalty proportional to squared parameter magnitude.","Ltotal=Ldata+λ||w||²","Train a model with several λ values and compare validation behavior.","Explain why regularization can reduce variance but increase bias."],
"CNNs":["Convolutions reuse local filters across spatial positions, exploiting locality and translation structure.","A filter responds where a learned pattern appears.","y[i,j]=Σu,v K[u,v]x[i+u,j+v]","Implement a single 2D convolution on a small matrix.","Explain why weight sharing reduces parameter count."],
"RNNs & LSTMs":["Recurrent models maintain a hidden state that summarizes prior sequence context.","LSTMs add gates that regulate information entering, leaving and remaining in the cell.","h_t=f(x_t,h_{t−1})","Implement a minimal recurrent update and inspect hidden-state behavior.","Explain why gated recurrence helps preserve information across longer sequences."],
"Training Dynamics":["Training dynamics describe how optimization, gradients, activations and data interact over time.","Loss curves alone do not reveal whether gradients, representations or generalization are healthy.","θt+1=Update(θt,∇L)","Log loss, gradient norms and validation metrics during training.","Diagnose a run from diverging loss, vanishing gradients or a widening generalization gap."],

"Tokenization":["Tokenization converts raw text into discrete units that a model can map to embeddings.","Different tokenizers trade vocabulary size against sequence length and segmentation.","text→tokens→ids","Tokenize several related words and compare sequence lengths.","Explain how tokenization changes the effective context budget."],
"Embeddings":["An embedding maps discrete symbols into continuous vectors.","Semantic or syntactic relationships can be represented geometrically.","token id→embedding vector","Look up embeddings for repeated tokens and compare vector shapes.","Explain why an embedding table is a learned representation rather than a dictionary definition."],
"Self-Attention":["Attention routes information according to query-key compatibility while values carry content.","A more similar query-key pair receives more weight after softmax.","Attention(Q,K,V)=softmax(QKᵀ/√d_k)V","Compute attention weights for a tiny Q,K,V example.","Explain why the value vectors, not keys, carry the mixed output information."],
"Multi-Head Attention":["Multiple attention heads let a layer form several learned routing patterns in parallel.","Different heads can specialize in different relationships.","MHA=Concat(head1,…,headh)W_O","Implement one head and describe how multiple heads can be concatenated.","Explain why several lower-dimensional heads can express different relations."],
"Positional Information":["Attention alone is permutation-equivariant, so sequence order needs an additional signal.","Position encodings inject information about token location or relative position.","representation=token+position","Create representations for the same token at two positions.","Explain why identical token content can need different positional representations."],
"Transformer Blocks":["A Transformer block composes attention, nonlinear transformation, normalization and residual paths.","Residual connections preserve a direct path for information and gradients.","x' = x + Attention(x); y = x' + MLP(x')","Sketch the data flow through one block.","Explain how residual connections alter optimization and information flow."],
"Pretraining":["Pretraining learns general representations from a large self-supervised objective before task-specific adaptation.","Next-token prediction turns raw text into many training targets.","L=−Σt log p(x_t|x_<t)","Describe how one text sequence creates multiple next-token targets.","Explain why scale of data and model capacity affects learned representations."],
"Scaling Laws":["Scaling laws empirically relate loss to factors such as model size, data and compute.","Useful scaling trends require controlled measurements across multiple runs.","L≈f(N,D,C)","Design a small scaling sweep with one controlled variable at a time.","Explain why compute-optimal training requires balancing model and data scale."],
"KV Cache":["Autoregressive decoding can reuse keys and values from earlier positions because prior tokens do not change.","Caching avoids recomputing previous K,V for each new token.","cache_t=(K_<t,V_<t)","Describe memory growth of a KV cache as sequence length increases.","Explain the tradeoff between decode speed and memory footprint."],
"Evaluation":["Evaluation measures whether a system meets a defined capability or safety objective.","A metric is only meaningful relative to a population, task and protocol.","score=f(model,data,protocol)","Design a test set that separates memorization from generalization.","Explain why benchmark leakage or changing protocols can invalidate comparisons."],

"RL Foundations":["Reinforcement learning optimizes behavior through interaction, rewards and state transitions.","The agent chooses actions that influence future rewards, not just immediate labels.","G_t=Σk γ^k r_{t+k}","Compute discounted return for a short reward sequence.","Explain the role of discounting in valuing future rewards."],
"Reward Modeling":["A reward model maps behavior to a scalar preference signal used to guide optimization.","Its quality depends on the coverage and consistency of preference data.","r_φ(x,y)","Describe how pairwise preferences can train a reward model.","Explain how reward-model errors can become optimization targets."],
"SFT":["Supervised fine-tuning adapts a pretrained model using labeled input-output examples.","The model is optimized to increase likelihood of target responses.","L=−Σt log p(y_t|x,y_<t)","Describe one batch of instruction-response training.","Explain what SFT can teach and what it cannot guarantee."],
"Preference Learning":["Preference learning trains from relative judgments rather than requiring an absolute score for every response.","A pairwise comparison provides information about which response is preferred.","P(y_w>y_l)=σ(r_w−r_l)","Construct a pairwise preference example and identify the winner.","Explain why pairwise data can be easier to collect than calibrated scalar rewards."],
"DPO":["Direct Preference Optimization converts preference pairs into a policy objective without separately optimizing a reward model during the policy update.","The reference policy anchors the update.","L_DPO=−log σ(β(log πθ(yw|x)−log πθ(yl|x)−reference gap))","Identify which response receives positive relative pressure in a DPO pair.","Explain the role of the reference model in constraining policy drift."],
"GRPO":["Group Relative Policy Optimization can estimate relative advantages from multiple sampled responses for the same prompt.","Within-group comparisons provide a learning signal.","A_i=(r_i−mean(r_group))/std(r_group)","Normalize rewards for a small group of sampled responses.","Explain why relative normalization can reduce dependence on reward scale."],
"Reasoning Traces":["Reasoning traces expose intermediate computational steps that can be studied as behavior, supervision or evaluation signals.","A correct final answer does not automatically imply a reliable reasoning process.","prompt→trace→answer","Design a test that separates final-answer accuracy from process behavior.","Explain why evaluating only final answers can miss systematic reasoning failures."],
"Tool Use":["Tool use extends a model with external operations such as search, code execution or APIs.","The model must select a tool, construct valid arguments and incorporate results.","model→tool call→result→model","Design a tool schema for a calculator.","Explain why tool validation belongs outside the model's natural-language reasoning."],
"Agent Loops":["An agent loop repeatedly observes state, chooses an action, receives feedback and continues toward a goal.","The loop needs termination, state and error handling.","observe→plan→act→observe","Implement a bounded loop with a maximum step count.","Explain why unrestricted loops can create cost, latency or safety problems."],
"Evaluation Harnesses":["An evaluation harness makes experiments repeatable by controlling inputs, execution and scoring.","A good harness records enough metadata to reproduce a result.","run→record→score→compare","Define the minimum fields needed to reproduce an evaluation run.","Explain why deterministic seeds alone do not guarantee reproducibility."],

"Profiling":["Profiling identifies where runtime, memory or communication is actually spent.","Optimization should target measured bottlenecks rather than intuition.","time_total=Σ time_components","Profile a toy pipeline and identify its dominant component.","Explain why optimizing a non-bottleneck may produce negligible end-to-end gain."],
"GPU Kernels":["A GPU kernel expresses a parallel computation executed by many threads.","Performance depends on memory access, occupancy, arithmetic intensity and synchronization.","C≈min(compute roof, memory roof)","Map vector addition to GPU threads.","Explain why coalesced memory access matters."],
"Distributed Data Parallel":["Data parallel training replicates model parameters across workers and splits batches across them.","Gradients are synchronized so replicas remain consistent.","∇global≈AllReduce(∇local)","Describe one training step across two workers.","Explain the communication cost introduced by gradient synchronization."],
"Tensor Parallelism":["Tensor parallelism partitions model computation itself across devices.","A large matrix operation can be split so each device handles part of the work.","Y=Σ_i A_iX_i","Partition a matrix multiplication across two devices conceptually.","Explain why tensor parallelism introduces communication inside a layer."],
"Inference Serving":["Inference serving turns model execution into a production request-processing system.","Latency, throughput, batching, memory and failure handling interact.","requests→scheduler→model→responses","Design a simple request queue with batching.","Explain why maximizing throughput can increase individual request latency."],
"Quantization":["Quantization represents values with lower precision to reduce memory and often improve throughput.","Lower precision introduces approximation error that must be measured.","q=round(x/s)","Quantize a small set of weights and compute reconstruction error.","Explain the tradeoff between precision, memory and model quality."],
"Caching":["Caching reuses valid prior computation to reduce repeated work.","A cache needs a key, stored value, validity rule and eviction strategy.","key→value if valid","Design a cache entry for a deterministic model computation.","Explain why invalidation is a correctness problem, not merely a performance detail."],
"Experiment Design":["Experiment design isolates causal factors so observed changes can be interpreted.","A controlled baseline makes an intervention measurable.","effect=metric(treatment)−metric(baseline)","Design an ablation with one changed variable.","Explain why changing several variables at once weakens causal attribution."],
"Ablations":["An ablation removes or changes one component to test whether it contributes to the observed result.","A component matters only if its removal changes the measured outcome under a controlled protocol.","Δ=metric(full)−metric(ablated)","Design an ablation for a model component.","Explain why an ablation needs a matched baseline and repeated measurement when variance is high."],
"Research Workflow":["Research is a loop of question, hypothesis, implementation, experiment, analysis and revision.","A useful result must survive attempts to falsify the hypothesis.","question→hypothesis→experiment→evidence→revision","Write a falsifiable hypothesis and one decisive experiment.","Explain why negative results can still improve a research program."]
};
for(const [title,s] of Object.entries(BP_TOPIC_SEEDS)){
 const [mental,predict,derive,transfer,extra]=s;
 const options=title==="Self-Attention"?["That key receives more weight","All weights become zero","The sequence is reversed","Nothing changes"]:
   title==="Backpropagation"?["2x","4x","x²","4"]:
   title==="KV Cache"?["Repeated computation for previous tokens","Model parameter count","Vocabulary size","Training data"]:
   ["The described mechanism is the direct effect","Nothing changes","The opposite effect always occurs","The operation becomes undefined"];
 const answer=0;
 BP_LESSONS[title]={domain:BP_DOMAINS.find(x=>x[1].includes(title))?.[0]||"BlackPearl",objective:extra,mental,predict,options,answer,derive,transfer};
}

// Domain card navigation: arrow and card now open the selected curriculum domain.
document.addEventListener("click",e=>{
  const tab=e.target.closest(".mobile-tabs button");
  if(tab){
    const label=tab.textContent.trim().toLowerCase();
    const map={home:"Overview",curriculum:"Curriculum",projects:"Projects",interview:"Interview Arena",research:"Research Lab"};
    if(map[label]){navigate(map[label]);}
    return;
  }
});
document.addEventListener("click",e=>{
  const arrow=e.target.closest("[data-domain-open]");
  if(arrow){e.preventDefault();e.stopPropagation();bpCurriculum(Number(arrow.dataset.domainOpen));setActive("Curriculum");window.scrollTo({top:0,behavior:"smooth"});return;}
  const card=e.target.closest(".card[data-domain]");
  if(card && !e.target.closest("button")){bpCurriculum(Number(card.dataset.domain));setActive("Curriculum");window.scrollTo({top:0,behavior:"smooth"});}
});


/* PRIORITY UI INTERACTION GUARDS */
document.addEventListener("click",e=>{
  const project=e.target.closest("[data-project]");
  if(project){
    const names=["Vector Playground","Backprop From Scratch","Tiny Transformer","Attention Profiler","Preference Optimization Lab","Distributed Training Harness"];
    const name=names[Number(project.dataset.project)]||"Project";
    alert(name+" brief is the next build artifact. The project ladder is connected and ready for the learning-engine implementation.");
  }
});

document.addEventListener("click",e=>{const d=e.target.closest("[data-bpd]");if(d){bpCurriculum(Number(d.dataset.bpd));setActive("Curriculum");window.scrollTo({top:0,behavior:"smooth"});return;}const row=e.target.closest(".domain-row [data-domain]");if(row){bpCurriculum(Number(row.dataset.domain));setActive("Curriculum");window.scrollTo({top:0,behavior:"smooth"});return;}});