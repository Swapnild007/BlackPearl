import {useState} from 'react';
import {BookOpen, BrainCircuit, Compass, FlaskConical, FolderKanban, GraduationCap, Menu, Moon, Play, Search, Settings2, Sparkles, Sun, X, ChevronRight, LockKeyhole, MessageCircleQuestion} from 'lucide-react';

type Theme='light'|'dark';
const modules=[
 {n:'01',title:'Mathematical Foundations',sub:'The language behind intelligence',lessons:84,color:'violet'},
 {n:'02',title:'Computer Science & Systems',sub:'Algorithms, memory, Linux and performance',lessons:76,color:'blue'},
 {n:'03',title:'Machine Learning & Deep Learning',sub:'From statistical learning to neural computation',lessons:104,color:'cyan'},
 {n:'04',title:'Transformers & Foundation Models',sub:'Attention, LLMs and multimodal systems',lessons:112,color:'indigo'},
 {n:'05',title:'Reasoning, Agents & Post-Training',sub:'RL, evals, agents and modern alignment',lessons:82,color:'pink'},
 {n:'06',title:'AI Systems, Research & Frontier Engineering',sub:'GPU systems, inference and research practice',lessons:62,color:'orange'}
];
const menu=[['Overview',Compass],['Curriculum',BookOpen],['Mentor',MessageCircleQuestion],['Projects',FolderKanban],['Interview Arena',GraduationCap],['Research Lab',FlaskConical]] as const;
export default function App(){
 const [theme,setTheme]=useState<Theme>('light'); const [open,setOpen]=useState(false); const [active,setActive]=useState('Overview');
 const total=modules.reduce((a,m)=>a+m.lessons,0);
 const navigate=(x:string)=>{setActive(x);setOpen(false);};
 return <div className={`app ${theme}`}>
  <header className="topbar"><button className="iconBtn mobile" onClick={()=>setOpen(true)}><Menu/></button><div className="brand" onClick={()=>navigate('Overview')}><div className="brandMark">B</div><div><b>BLACKPEARL</b><span>AI MASTERY & RESEARCH</span></div></div><div className="topActions"><button className="searchBtn"><Search/><span>Search</span><kbd>⌘ K</kbd></button><button className="iconBtn" onClick={()=>setTheme(theme==='light'?'dark':'light')}>{theme==='light'?<Moon/>:<Sun/>}</button></div></header>
  <div className="layout">
   <aside className={open?'sidebar open':'sidebar'}><div className="sideHead"><span>LEARNING SPACE</span><button className="iconBtn mobile" onClick={()=>setOpen(false)}><X/></button></div>{menu.map(([label,Icon])=><button className={active===label?'nav active':'nav'} onClick={()=>navigate(label)} key={label}><Icon/><span>{label}</span>{active===label&&<i/>}</button>)}<div className="sideBottom"><button className="nav"><Settings2/><span>Settings</span></button></div></aside>
   <main className="main">
    <section className="hero"><div className="eyebrow"><Sparkles/> HARD LEARNING MODE</div><h1>Build the mind<br/><em>behind the model.</em></h1><p>Human-style mentorship, interactive theory, mathematics, experiments and research. Learn deeply enough to solve unfamiliar AI problems.</p><div className="heroActions"><button className="primary" onClick={()=>navigate('Curriculum')}><Play/> Continue learning <ChevronRight/></button><button className="secondary" onClick={()=>navigate('Mentor')}><MessageCircleQuestion/> Meet your mentor</button></div></section>
    <section className="stats"><div><strong>{modules.length}</strong><span>Learning domains</span></div><div><strong>{total}</strong><span>Planned lessons</span></div><div><strong>12</strong><span>Deep projects</span></div><div><strong>L0–L6</strong><span>Mastery levels</span></div></section>
    <section className="sectionHead"><div><span className="kicker">YOUR PATH</span><h2>Curriculum architecture</h2></div><button className="textBtn" onClick={()=>navigate('Curriculum')}>View all <ChevronRight/></button></section>
    <div className="moduleGrid">{modules.map((m,i)=><button className={`moduleCard ${m.color}`} key={m.n} onClick={()=>navigate('Curriculum')}><div className="moduleTop"><span className="num">{m.n}</span><span className="lessons">{m.lessons} lessons</span></div><h3>{m.title}</h3><p>{m.sub}</p><div className="cardFoot"><span>{i===0?'Start here':i<3?'Core foundation':'Advanced'}</span><ChevronRight/></div></button>)}</div>
    <section className="mentorCard"><div className="mentorIcon"><BrainCircuit/></div><div><span className="kicker">YOUR DIGITAL MENTOR</span><h2>Don't just read. Think.</h2><p>Your mentor asks questions, challenges assumptions, detects gaps and withholds answers until you've had a chance to reason.</p></div><button className="primary compact" onClick={()=>navigate('Mentor')}>Enter mentor <ChevronRight/></button></section>
    <footer><span>BLACKPEARL 2.0</span><span>Learn · Build · Break · Measure · Defend · Research</span></footer>
   </main>
  </div>
 </div>
}