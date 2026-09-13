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
  { label: "Polars", highlight: false },
  { label: "Alembic", highlight: false },
  { label: "Typer", highlight: false },
  { label: "Claude API", highlight: false },
  { label: "whisper.cpp", highlight: false },
];

const PROJECTS = [
  {
    id: "gitops-platform",
    title: "OpenShift GitOps Platform",
    desc: "GitOps deployment platform for IBM's internal AI sales-enablement tool — a NotebookLM-style assistant grounded in internal product context, built to help sellers sell smarter. 8 Helm charts and ~1,500 lines of CI/CD across three OpenShift clusters, running change detection, Terraform plan/apply, per-environment diffs, and approval-gated production deploys. 58% of commits to the deployment/infra repo, 93 PRs, ~27K lines.",
    tags: ["OpenShift", "Helm", "Terraform", "GitOps", "CI/CD"],
    featured: true,
    url: null,
    github: null,
  },
  {
    id: "obsidian-mcp",
    title: "obsidian-notes MCP",
    desc: "HTTP MCP server that semantically searches a local Obsidian vault. Two-stage retrieval: bi-encoder ANN (bge-large-en-v1.5) over the full vault → cross-encoder reranker (MiniLM) for top-5 results. Live sync via watchdog — note edits are re-embedded automatically.",
    tags: ["FastMCP", "ChromaDB", "Python", "Docker", "RAG"],
    featured: false,
    url: null,
    github:
      "https://github.com/Noah-Dimitriadis/SAM/tree/main/projects/sam-assistant-server",
  },
  {
    id: "workshopffl",
    title: "Fantasy Football Draft & Season Assistant",
    desc: "Fantasy football data platform for a 12-team Sleeper league: ingests ten seasons of nflverse data plus live league state into Postgres, and computes VORP/VONA player valuations for two-FLEX and superflex PPR formats. Typer CLI with a live draft assistant polling every 2-3s on the clock; APScheduler runs nightly, idempotent ingest merges. ~13K lines, 280+ tests.",
    tags: ["FastAPI", "PostgreSQL", "Polars", "Alembic", "APScheduler"],
    featured: false,
    url: null,
    github: "https://github.com/Noah-Dimitriadis/fantasy-football",
  },
  {
    id: "notes-pipeline",
    title: "Lecture Notes Pipeline",
    desc: "Content-hash-cached pipeline that turns a lecture recording, slide deck, and personal notes into one synthesized markdown file. whisper.cpp (large-v3-turbo) transcription benchmarked against real lecture audio, Claude Opus synthesis grounded in the deck skeleton, Typer CLI. A FastMCP server is next, so Claude Code can trigger and poll builds directly.",
    tags: ["Python", "Claude API", "whisper.cpp", "SQLite", "Typer"],
    featured: false,
    url: null,
    github: "https://github.com/Noah-Dimitriadis/notes-pipeline",
  },
  // TODO: add more projects
];

const EXPERIENCE = [
  {
    id: "ibm",
    title: "software developer co-op",
    org: "IBM · Markham, ON",
    date: "Feb 2026 – present",
    bullets: [
      "Created and maintain the GitOps deployment platform for IBM's internal AI sales-enablement tool (58% of commits to the deployment/infra repo, 93 PRs, ~27K lines): 8 Helm charts and ~1,500 lines of CI/CD across three OpenShift clusters, running change detection, Terraform plan/apply, per-environment diffs, and approval-gated production deploys.",
      "Designed and built PR preview environments — each pull request provisions an isolated namespace, three seeded Postgres databases, scoped Elasticsearch indices, and a TLS-terminated URL, with automated teardown on close; engineered the cross-instance dispatch (GitHub.com → GitHub Enterprise) so external CI failures surface on the originating PR.",
      "Executed a live production MongoDB migration under active traffic via Terraform and the IBM Cloud CLI, coordinating credential regeneration and staging the cutover through lower environments first, with zero data loss.",
      "Led the Kubernetes-to-OpenShift migration for the Context Manager and Core Services applications — routes replacing ingress, SecurityContextConstraints, non-root containers, scoped service accounts, and pgbouncer connection pooling in front of managed Postgres.",
      "Built the LLM observability and evaluation platform: authored MLflow and OpenTelemetry Collector Helm charts with SSO sidecars and API-key gating, instrumented GenAI spans in the Rails application, and shipped a weekly automated eval pipeline publishing results to MLflow.",
      "Own database provisioning and network exposure across a Terraform/Terragrunt estate spanning three environments; hardened clusters with default-deny network policies, private-only endpoints behind VPN, and SOPS-encrypted secrets, and patched a SQL injection vulnerability in a production API endpoint.",
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
    text: "I build things that run in production. Currently working on Kubernetes/OpenShift infra and internal AI tooling at IBM. Outside of work I run a home server, build a fantasy-football analytics platform, and I'm building a Claude-powered pipeline that turns lecture recordings into study notes.",
    rate: 12,
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
    isTyping: (idx) => lineIdx < lines.length && idx === lineIdx,
    isVisible: (idx) => idx <= lineIdx,
  };
}

const BLINK_MS = 1100;

function Cursor() {
  const delay = -(Date.now() % BLINK_MS);
  return <span className="cursor" style={{ animationDelay: `${delay}ms` }} />;
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
      {showCursor && <Cursor />}
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
            {typer.isTyping(1) && <Cursor />}
            {typer.isVisible(2) && (
              <>
                <br />
                <em className={styles.heroAccent}>{typer.visibleFor(2)}</em>
                {typer.isTyping(2) && <Cursor />}
              </>
            )}
          </h1>
        )}

        {typer.isVisible(3) && (
          <p className={styles.heroRole}>
            {typer.visibleFor(3)}
            {typer.isTyping(3) && <Cursor />}
          </p>
        )}

        {typer.isVisible(4) && (
          <p className={styles.heroSub}>
            {typer.visibleFor(4)}
            {typer.isTyping(4) && <Cursor />}
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
