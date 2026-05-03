import { useState, useEffect } from "react";
import styles from "./App.module.css";

// ── Data — fill these in ──────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "./projects", href: "#projects" },
  { label: "./experience", href: "#experience" },
  { label: "./contact", href: "#contact" },
];

const SKILLS = [
  { label: "Kubernetes / OpenShift", highlight: true },
  { label: "Python", highlight: true },
  { label: "Docker", highlight: true },
  { label: "CI/CD", highlight: true },
  { label: "Helmfile", highlight: true },
  { label: "FastAPI", highlight: false },
  { label: "FastMCP", highlight: false },
  { label: "IBM Cloud / ROKS", highlight: false },
  { label: "Redis", highlight: false },
  { label: "PostgreSQL", highlight: false },
  { label: "Linux", highlight: false },
];

const PROJECTS = [
  {
    id: "roks-infra",
    title: "OpenShift GitOps Platform",
    desc: "Zero-downtime IKS → ROKS migration with DNS failover. Helmfile monorepo managing dev/staging/prod clusters: cert-manager, ExternalDNS, IBM CIS, custom SCCs, and a GitHub Actions pipeline with automated Helm rollback on failure.",
    tags: ["OpenShift", "Helmfile", "GitOps", "IBM Cloud", "Kubernetes"],
    live: false,
    featured: true,
    url: null,
    github: null,
  },
  {
    id: "obsidian-mcp",
    title: "obsidian-notes MCP",
    desc: "HTTP MCP server that semantically searches a local Obsidian vault. Two-stage retrieval: bi-encoder ANN (bge-large-en-v1.5) over the full vault → cross-encoder reranker (MiniLM) for top-5 results. Live sync via watchdog — note edits are re-embedded automatically.",
    tags: ["FastMCP", "ChromaDB", "Python", "Docker", "RAG"],
    live: true,
    featured: false,
    url: null,
    github:
      "https://github.com/Noah-Dimitriadis/SAM/tree/main/projects/sam-assistant-server",
  },
  {
    id: "prompt-injection-lab",
    title: "prompt injection lab",
    desc: "Isolated research environment for testing prompt injection attack/defense patterns. Containerized eval harness with structured attack taxonomy.",
    tags: ["Docker", "Python", "LLM security"],
    live: false,
    featured: false,
    url: null,
    github: "#",
  },
  // TODO: add more projects
];

const EXPERIENCE = [
  {
    id: "ibm",
    title: "software developer co-op",
    org: "IBM · Markham, ON",
    date: "2025 – present",
    bullets: [
      "Kubernetes/OpenShift infrastructure on ROKS — Helmfile-based GitOps deployments, IAM/RBAC, cluster provisioning.",
      "Implemented OS-native image signature verification under a deadline (Portieris on ROKS, cosign, ICR).",
      "Contributing to an internal AI-powered content platform (IBM watsonx Workshop, Context Manager) for IBM sellers and content creators.",
      // TODO: add more IBM bullets
    ],
  },
  {
    id: "brock",
    title: "bsc computer science",
    org: "Brock University · St. Catharines, ON",
    date: "2022 – 2027",
    bullets: [],
  },
];

// ── Terminal typer ────────────────────────────────────────────────────────────

const HERO_LINES = [
  { text: "noah@portfolio:~/about $ whoami", pauseAfter: 400 },
  { text: "software engineer", pauseAfter: 120 },
  { text: "& infrastructure enthusiast", pauseAfter: 350 },
  { text: "CS @ Brock University · IBM co-op", pauseAfter: 200 },
  {
    text: "I build things that run in production. Currently working on Kubernetes/OpenShift infra and internal AI tooling at IBM. Outside of work I run home servers, build analytics platforms, and poke at LLM security.",
    rate: 13,
    pauseAfter: 300,
  },
  { text: "", pauseAfter: 0 },
];

const PROMPT_PARTS = [
  { text: "noah@portfolio", cls: "ps1User" },
  { text: ":", cls: "dim" },
  { text: "~/about", cls: "ps1Path" },
  { text: " $ ", cls: "dim" },
  { text: "whoami", cls: null },
];

function useTerminalTyper(lines, baseRate = 28) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [started, setStarted] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [chars, setChars] = useState(0);

  useEffect(() => {
    if (prefersReduced) return;
    const t = setTimeout(() => setStarted(true), 200);
    return () => clearTimeout(t);
  }, [prefersReduced]);

  useEffect(() => {
    if (!started || prefersReduced || lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    const rate = line.rate ?? baseRate;
    if (chars < line.text.length) {
      const t = setTimeout(() => setChars((c) => c + 1), rate);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIdx((i) => i + 1);
      setChars(0);
    }, line.pauseAfter ?? 250);
    return () => clearTimeout(t);
  }, [started, lineIdx, chars, prefersReduced, lines, baseRate]);

  if (prefersReduced) {
    return {
      visibleFor: (idx) => lines[idx]?.text ?? "",
      isTyping: () => false,
      isVisible: () => true,
    };
  }

  return {
    visibleFor: (idx) => {
      if (idx < lineIdx) return lines[idx]?.text ?? "";
      if (idx === lineIdx) return (lines[idx]?.text ?? "").slice(0, chars);
      return "";
    },
    isTyping: (idx) =>
      idx === lineIdx &&
      (started ? chars < (lines[idx]?.text.length ?? 0) : true),
    isVisible: (idx) => idx <= lineIdx,
  };
}

function TypedPrompt({ charsVisible, showCursor }) {
  let rem = charsVisible;
  return (
    <div className={styles.heroPrompt}>
      {PROMPT_PARTS.map((part, i) => {
        if (rem <= 0) return null;
        const slice = part.text.slice(0, Math.min(rem, part.text.length));
        rem -= part.text.length;
        return (
          <span key={i} className={part.cls ? styles[part.cls] : undefined}>
            {slice}
          </span>
        );
      })}
      {showCursor && <span className="cursor" />}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className={styles.nav}>
      <span className={styles.navLogo}>
        noah<span className={styles.dim}>@</span>portfolio
        <span className={styles.dim}> ~</span>
      </span>
      <div className={styles.navLinks}>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} className={styles.navLink}>
            {l.label}
          </a>
        ))}
      </div>
      <a href="/resume.pdf" download className={styles.navCta}>
        resume.pdf ↓
      </a>
    </nav>
  );
}

function Hero() {
  const typer = useTerminalTyper(HERO_LINES);

  return (
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <TypedPrompt
          charsVisible={typer.visibleFor(0).length}
          showCursor={typer.isTyping(0)}
        />

        {typer.isVisible(1) && (
          <h1 className={styles.heroH1}>
            {typer.visibleFor(1)}
            {typer.isTyping(1) && <span className="cursor" />}
            {typer.isVisible(2) && (
              <>
                <br />
                <em className={styles.heroAccent}>{typer.visibleFor(2)}</em>
                {typer.isTyping(2) && <span className="cursor" />}
              </>
            )}
          </h1>
        )}

        {typer.isVisible(3) && (
          <p className={styles.heroRole}>
            {typer.visibleFor(3)}
            {typer.isTyping(3) && <span className="cursor" />}
          </p>
        )}

        {typer.isVisible(4) && (
          <p className={styles.heroSub}>
            {typer.visibleFor(4)}
            {typer.isTyping(4) && <span className="cursor" />}
          </p>
        )}

        {typer.isVisible(5) && (
          <>
            <div className={`${styles.heroActions} fade-up`}>
              <a href="#projects" className={styles.btnPrimary}>
                view projects
              </a>
              <a href="#contact" className={styles.btnGhost}>
                get in touch
              </a>
            </div>
            <div className={`${styles.statusRow} fade-up`}>
              <span className={styles.statusItem}>
                <span className={`${styles.dot} ${styles.dotPurple}`} />
                Sharon, ON
              </span>
            </div>
          </>
        )}
      </div>

      <div className={styles.avatarWrap}>
        <div className={styles.avatarFrame}>
          <img src="/headshot.jpeg" alt="Noah" />
          <span className={styles.avatarCorner} />
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className={styles.section} id="skills">
      <p className={styles.sectionLabel}>skills &amp; tools</p>
      <div className={styles.skillsGrid}>
        {SKILLS.map((s) => (
          <span
            key={s.label}
            className={`${styles.skillPill} ${s.highlight ? styles.skillHighlight : ""}`}
          >
            {s.label}
          </span>
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <div
      className={`${styles.projCard} ${project.featured ? styles.projFeatured : ""}`}
    >
      <div className={styles.projTop}>
        <span className={styles.projTitle}>{project.title}</span>
        <div className={styles.projTopRight}>
          {project.live && <span className={styles.projBadge}>live</span>}
          {project.github && (
            <a
              href={project.github}
              className={styles.projArrow}
              target="_blank"
              rel="noreferrer"
            >
              gh ↗
            </a>
          )}
          {project.url && (
            <a
              href={project.url}
              className={styles.projArrow}
              target="_blank"
              rel="noreferrer"
            >
              ↗
            </a>
          )}
        </div>
      </div>
      <p className={styles.projDesc}>{project.desc}</p>
      <div className={styles.projTags}>
        {project.tags.map((t) => (
          <span key={t} className={styles.projTag}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section className={styles.section} id="projects">
      <p className={styles.sectionLabel}>projects</p>
      <div className={styles.projGrid}>
        {PROJECTS.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className={styles.section} id="experience">
      <p className={styles.sectionLabel}>experience</p>
      {EXPERIENCE.map((e) => (
        <div key={e.id} className={styles.expItem}>
          <div className={styles.expHeader}>
            <span className={styles.expTitle}>{e.title}</span>
            <span className={styles.expDate}>{e.date}</span>
          </div>
          <p className={styles.expOrg}>{e.org}</p>
          {e.bullets.length > 0 && (
            <ul className={styles.expBullets}>
              {e.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

function Contact() {
  return (
    <section className={styles.section} id="contact">
      <p className={styles.sectionLabel}>contact</p>
      <div className={styles.contactRow}>
        <a
          href="mailto:noahdimitriadis2004@gmail.com"
          className={styles.contactLink}
        >
          email ↗
        </a>
        <a
          href="https://github.com/Noah-Dimitriadis"
          className={styles.contactLink}
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
        <a
          href="https://www.linkedin.com/in/noah-dimitriadis-a953a526b/"
          className={styles.contactLink}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn ↗
        </a>
        <a href="/resume.pdf" download className={styles.contactLink}>
          resume (pdf) ↓
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.footerText}>portfolio.noahdimitriadis.com</span>
      <span className={styles.footerText}>
        built with ♥ <span className="cursor" />
      </span>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className={styles.layout}>
      <Nav />
      <main className={styles.main}>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
