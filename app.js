const domains=[
["01","Mathematical Foundations","Linear algebra, calculus, probability, optimization and numerical reasoning.",84],
["02","Computer Science & Systems","Algorithms, data structures, operating systems, networks and GPU fundamentals.",76],
["03","Machine Learning & Deep Learning","Statistical learning, neural networks, training dynamics and sequence models.",104],
["04","Transformers & Foundation Models","Attention, tokenization, scaling, pretraining, inference and evaluation.",112],
["05","Reasoning, Agents & Post-Training","RL, preference optimization, tool use, agents and reasoning systems.",82],
["06","AI Systems, Research & Frontier Engineering","Distributed training, serving, research methodology and frontier systems.",62]
];
const domainEl=document.querySelector("#domains");
domainEl.innerHTML=domains.map(d=>`<article class="domain-card" data-search="${d[2]}"><span class="domain-number">${d[0]} / ${d[3]} LESSONS</span><h3>${d[1]}</h3><p>${d[2]}</p><div class="progress"><i style="width:${Math.min(72,8+Number(d[0])*4)}%"></i></div></article>`).join("");
const sidebar=document.querySelector("#sidebar");
document.querySelectorAll("[data-view]").forEach(el=>el.addEventListener("click",e=>{
 const view=e.currentTarget.dataset.view;
 document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===view));
 sidebar.classList.remove("open");
 if(view!=="Overview"){document.querySelector("#main").scrollIntoView({behavior:"smooth"});showToast(view+" workspace is ready for the next build phase.");}
}));
document.querySelector("#menuBtn").onclick=()=>sidebar.classList.toggle("open");
document.querySelector("#themeBtn").onclick=()=>document.documentElement.classList.toggle("dark");
const modal=document.querySelector("#searchModal"), input=document.querySelector("#searchInput"), results=document.querySelector("#searchResults");
function openSearch(){modal.classList.add("open");input.focus();input.value="";results.innerHTML=""}
document.querySelector("#searchBtn").onclick=openSearch;
document.querySelector("#closeSearch").onclick=()=>modal.classList.remove("open");
modal.onclick=e=>{if(e.target===modal)modal.classList.remove("open")};
input.oninput=()=>{const q=input.value.toLowerCase().trim();results.innerHTML=q?domains.filter(d=>(d[1]+" "+d[2]).toLowerCase().includes(q)).map(d=>`<div class="result"><b>${d[1]}</b><br><small>${d[2]}</small></div>`).join("")||'<div class="result">No matching learning domain.</div>':""};
document.onkeydown=e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch()}if(e.key==="Escape")modal.classList.remove("open")};
document.querySelector('[data-action="continue"]').onclick=()=>{document.querySelector(".curriculum-head").scrollIntoView({behavior:"smooth"});showToast("Next lesson path opened.");};
function showToast(msg){let t=document.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";Object.assign(t.style,{position:"fixed",left:"50%",bottom:"25px",transform:"translateX(-50%)",zIndex:200,padding:"11px 16px",borderRadius:"13px",background:"#172033",color:"#fff",fontSize:"12px",boxShadow:"0 15px 35px #17203340"});document.body.appendChild(t)}t.textContent=msg;t.style.opacity="1";clearTimeout(t._x);t._x=setTimeout(()=>t.style.opacity="0",1800)}