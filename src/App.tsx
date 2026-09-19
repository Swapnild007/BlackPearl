import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, BrainCircuit, ChevronRight, FlaskConical, GraduationCap, Menu, Moon, Search, Sparkles, Sun, X, type LucideIcon } from "lucide-react";
import { HashRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { academic, lessonSeeds, modules, projects, studyLayers } from "./data";

function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem("blackpearl-theme") === "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("blackpearl-theme", dark ? "dark" : "light");
  }, [dark]);
  return [dark, () => setDark(v => !v)] as const;
}

function Shell({ children, dark, toggle }: { children: React.ReactNode; dark: boolean; toggle: () => void }) {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const links: [string, string][] = [["Learn", "/learn"], ["Curriculum", "/curriculum"], ["Projects", "/projects"], ["Academic", "/academic"]];
  return <div className="shell">
    <header className="topbar">
      <Link className="brand" to="/" onClick={() => setMenu(false)}><span className="brand-dot" /><span>Black<span>Pearl</span></span></Link>
      <nav className="nav">{links.map(([label, path]) => <Link className={location.pathname === path ? "active" : ""} to={path} key={path}>{label}</Link>)}</nav>
      <div className="actions">
        <button className="round" onClick={toggle} aria-label="Toggle theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
        <button className="round menu-button" onClick={() => setMenu(true)} aria-label="Open menu"><Menu size={19} /></button>
      </div>
    </header>
    <AnimatePresence>{menu && <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)}>
      <motion.aside className="drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 380, damping: 34 }} onClick={e => e.stopPropagation()}>
        <div className="drawer-head"><b>Navigation</b><button className="round" onClick={() => setMenu(false)}><X size={18} /></button></div>
        {links.concat([["Glossary", "/glossary"]]).map(([label, path]) => <Link key={path} to={path} onClick={() => setMenu(false)}>{label}<ChevronRight size={16} /></Link>)}
      </motion.aside>
    </motion.div>}</AnimatePresence>
    <main>{children}</main>
    <footer><span>BLACKPEARL</span><span>Independent study system · No institutional affiliation</span></footer>
  </div>;
}

function Page({ children }: { children: React.ReactNode }) {
  return <motion.div className="page" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

const signals: { Icon: LucideIcon; num: string; label: string }[] = [
  { Icon: BookOpen, num: "6", label: "Core modules" },
  { Icon: BrainCircuit, num: "12", label: "Project directions" },
  { Icon: GraduationCap, num: "4", label: "Academic stages" }
];

function Home() {
  return <Page><section className="hero">
    <div className="eyebrow"><Sparkles size={14} /> POSTGRADUATE-LEVEL INDEPENDENT STUDY</div>
    <h1>Learn AI.<br /><em>Properly.</em></h1>
    <p className="hero-copy">A structured path from mathematical foundations to modern generative AI, agentic systems and production-grade machine learning.</p>
    <div className="hero-actions"><Link className="primary" to="/learn">Start learning <ChevronRight size={17} /></Link><Link className="secondary" to="/curriculum">Explore curriculum</Link></div>
    <div className="hero-note"><span className="pulse" />Built for serious self-study. Learn the theory before the framework.</div>
  </section>
  <section className="signal-grid">{signals.map(({ Icon, num, label }) => <div className="signal" key={label}><Icon size={19} /><strong>{num}</strong><span>{label}</span></div>)}</section>
  <section className="method"><div><span className="eyebrow">THE BLACKPEARL METHOD</span><h2>Not a video playlist.<br />A study system.</h2></div>
    <div className="layer-grid">{studyLayers.map(([n, t, d]) => <div className="layer" key={n}><small>{n}</small><b>{t}</b><p>{d}</p></div>)}</div>
  </section>
  <section className="notice"><div><span className="eyebrow">IMPORTANT</span><h3>Independent study, not an institutional credential.</h3><p>BlackPearl is a self-learning platform. It does not represent admission, enrollment, certification or affiliation with any university or institute.</p></div></section>
  </Page>;
}

function Learn() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => modules.filter(m => (m.title + " " + m.topics.join(" ")).toLowerCase().includes(q.toLowerCase())), [q]);
  return <Page><div className="page-head"><div><span className="eyebrow">LEARN</span><h1>Your study path.</h1><p>Choose a module. Every lesson is designed to connect theory, mathematics, implementation and evidence.</p></div><div className="search"><Search size={17} /><input placeholder="Search concepts…" value={q} onChange={e => setQ(e.target.value)} /></div></div>
    <div className="module-grid">{filtered.map(m => <ModuleCard key={m.id} m={m} />)}</div></Page>;
}

function ModuleCard({ m }: { m: typeof modules[number] }) {
  return <Link to={"/learn/" + m.id} className="module-card"><div className="module-number">{m.id}</div><span className="eyebrow">{m.kicker}</span><h2>{m.title}</h2><p>{m.description}</p><div className="topic-row">{m.topics.slice(0, 4).map(t => <span key={t}>{t}</span>)}</div><div className="card-link">Open module <ChevronRight size={16} /></div></Link>;
}

function Module({ id }: { id: string }) {
  const m = modules.find(x => x.id === id) ?? modules[0];
  return <Page><div className="reader-head"><Link to="/learn" className="back">← All modules</Link><span className="eyebrow">{m.kicker} · MODULE {m.id}</span><h1>{m.title}</h1><p>{m.description}</p></div>
    <div className="reader-layout"><aside className="toc"><b>Module map</b>{m.topics.map((t, i) => <a href={"#topic-" + i} key={t}>{String(i + 1).padStart(2, "0")} · {t}</a>)}</aside>
      <article className="reader">{m.topics.map((t, i) => <section className="lesson-block" id={"topic-" + i} key={t}><span className="lesson-index">TOPIC {String(i + 1).padStart(2, "0")}</span><h2>{t}</h2><p>BlackPearl treats <b>{t}</b> as a concept to reason about, not a term to memorize. Start with the formal object, establish the intuition, then test the idea computationally.</p><div className="callout"><FlaskConical size={18} /><div><b>Study sequence</b><p>{lessonSeeds.slice(0, 6).join(" · ")}.</p></div></div><div className="mini-grid">{["Conceptual model", "Mathematical treatment", "Implementation exercise"].map((x, j) => <div key={x}><small>0{j + 1}</small><b>{x}</b><p>Build a concrete artifact and verify the reasoning with an experiment.</p></div>)}</div></section>)}</article>
    </div></Page>;
}

function Curriculum() {
  return <Page><div className="page-head"><div><span className="eyebrow">CURRICULUM</span><h1>The complete map.</h1><p>Six connected domains spanning mathematical foundations, core ML, deep learning, specialization, modern AI and production.</p></div></div><div className="curriculum-list">{modules.map(m => <Link to={"/learn/" + m.id} key={m.id}><span>{m.id}</span><div><small>{m.kicker}</small><h2>{m.title}</h2><p>{m.topics.join(" · ")}</p></div><ChevronRight /></Link>)}</div></Page>;
}

function Projects() {
  return <Page><div className="page-head"><div><span className="eyebrow">PROJECTS</span><h1>Build what you study.</h1><p>Project directions are deliberately progressive: engines, perception systems, retrieval, agents, serving and research.</p></div></div><div className="project-grid">{projects.map((p, i) => <div className="project" key={p}><small>{String(i + 1).padStart(2, "0")}</small><h2>{p}</h2><span>PROJECT DIRECTION</span></div>)}</div></Page>;
}

function Academic() {
  return <Page><div className="page-head"><div><span className="eyebrow">ACADEMIC STRUCTURE</span><h1>A four-stage progression.</h1><p>An independent-study structure inspired by postgraduate sequencing. It is not an academic enrollment pathway.</p></div></div><div className="academic-list">{academic.map(([n, t, d]) => <div className="academic" key={n}><span>{n}</span><div><small>{t}</small><h2>{d}</h2></div></div>)}</div></Page>;
}

function Glossary() {
  return <Page><div className="page-head"><div><span className="eyebrow">GLOSSARY</span><h1>Terms, without hand-waving.</h1><p>The glossary will become a cross-linked reference layer as the lesson corpus is expanded.</p></div></div><div className="glossary"><div><b>BlackPearl principle</b><p>Definitions should point to assumptions, equations, implementation and failure modes—not just a one-line description.</p></div><div><b>Lesson corpus</b><p>The curriculum map and the lesson corpus are separate concerns. Module counts will be derived from actual lesson data as the content is authored.</p></div></div></Page>;
}

function ModuleRoute() {
  const location = useLocation();
  return <Module id={location.pathname.split("/").pop() || "01"} />;
}

export default function App() {
  const [dark, toggle] = useTheme();
  return <HashRouter><Shell dark={dark} toggle={toggle}><Routes><Route path="/" element={<Home />} /><Route path="/learn" element={<Learn />} /><Route path="/learn/:id" element={<ModuleRoute />} /><Route path="/curriculum" element={<Curriculum />} /><Route path="/projects" element={<Projects />} /><Route path="/academic" element={<Academic />} /><Route path="/glossary" element={<Glossary />} /><Route path="*" element={<Home />} /></Routes></Shell></HashRouter>;
}