import { useState } from 'react'
import styles from './App.module.css'

// ── Data — fill these in ──────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: './projects',   href: '#projects' },
  { label: './experience', href: '#experience' },
  { label: './contact',    href: '#contact' },
]

const SKILLS = [
  { label: 'Kubernetes / OpenShift', highlight: true },
  { label: 'Python',                 highlight: true },
  { label: 'Docker',                 highlight: true },
  { label: 'FastAPI',                highlight: true },
  { label: 'PostgreSQL',             highlight: false },
  { label: 'Helmfile',               highlight: false },
  { label: 'CI/CD',                  highlight: false },
  { label: 'React',                  highlight: false },
  { label: 'IBM Cloud / ROKS',       highlight: false },
  { label: 'Go',                     highlight: false },
  { label: 'Linux',                  highlight: false },
  { label: 'Redis',                  highlight: false },
]

const PROJECTS = [
  {
    id: 'pucklab',
    title: 'PuckLab',
    desc: 'NHL analytics platform with a FastAPI backend, PostgreSQL data store, and custom stat models. Advanced possession metrics, shot quality analysis, and fantasy lineup automation.',
    tags: ['FastAPI', 'PostgreSQL', 'Python', 'Docker'],
    live: true,
    featured: true,
    url: '#', // TODO: add live URL
    github: '#', // TODO: add GitHub URL
  },
  {
    id: 'prompt-injection-lab',
    title: 'prompt injection lab',
    desc: 'Isolated research environment for testing prompt injection attack/defense patterns. Containerized eval harness with structured attack taxonomy.',
    tags: ['Docker', 'Python', 'LLM security'],
    live: false,
    featured: false,
    url: null,
    github: '#',
  },
  {
    id: 'samv3',
    title: 'SAMv3',
    desc: 'Multi-agent AI assistant with local LLM orchestration, memory retrieval via Obsidian, and a Redis/Postgres message bus connecting agents.',
    tags: ['MCP', 'Redis', 'Ollama', 'Python'],
    live: false,
    featured: false,
    url: null,
    github: '#',
  },
  // TODO: add more projects
]

const EXPERIENCE = [
  {
    id: 'ibm',
    title: 'software developer co-op',
    org: 'IBM · Markham, ON',
    date: '2024 – present',
    bullets: [
      'Kubernetes/OpenShift infrastructure on ROKS — Helmfile-based GitOps deployments, IAM/RBAC, cluster provisioning.',
      'Implemented OS-native image signature verification under a deadline (Portieris on ROKS, cosign, ICR).',
      'Contributing to an internal AI-powered content platform for IBM sellers and content creators.',
      // TODO: add more IBM bullets
    ],
  },
  {
    id: 'brock',
    title: 'bsc computer science',
    org: 'Brock University · St. Catharines, ON',
    date: '2022 – 2026',
    bullets: [],
  },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className={styles.nav}>
      <span className={styles.navLogo}>
        noah<span className={styles.dim}>@</span>portfolio<span className={styles.dim}> ~</span>
      </span>
      <div className={styles.navLinks}>
        {NAV_LINKS.map(l => (
          <a key={l.href} href={l.href} className={styles.navLink}>{l.label}</a>
        ))}
      </div>
      <a href="/resume.pdf" download className={styles.navCta}>resume.pdf ↓</a>
    </nav>
  )
}

function Hero() {
  return (
    <section className={`${styles.hero} fade-up`}>
      <div className={styles.heroText}>
        <div className={styles.heroPrompt}>
          <span className={styles.ps1User}>noah@portfolio</span>
          <span className={styles.dim}>:</span>
          <span className={styles.ps1Path}>~/about</span>
          <span className={styles.dim}> $ </span>
          <span>whoami</span>
        </div>

        <h1 className={styles.heroH1}>
          software engineer<br />
          <em className={styles.heroAccent}>&amp; infrastructure nerd</em>
        </h1>

        <p className={styles.heroRole}>CS @ Brock University · IBM co-op</p>

        <p className={styles.heroSub}>
          I build things that run in production. Currently working on Kubernetes/OpenShift
          infra and internal AI tooling at IBM. Outside of work I run home servers, build
          analytics platforms, and poke at LLM security.
        </p>

        <div className={styles.heroActions}>
          <a href="#projects" className={styles.btnPrimary}>view projects</a>
          <a href="#contact"  className={styles.btnGhost}>get in touch</a>
        </div>

        <div className={styles.statusRow}>
          <span className={styles.statusItem}>
            <span className={`${styles.dot} ${styles.dotGreen}`} />
            open to internships
          </span>
          <span className={styles.statusItem}>
            <span className={`${styles.dot} ${styles.dotPurple}`} />
            Oshawa, ON
          </span>
        </div>
      </div>

      <div className={styles.avatarWrap}>
        <div className={styles.avatarFrame}>
          {/* TODO: replace with <img src="/photo.jpg" alt="Noah" /> */}
          <div className={styles.avatarPlaceholder}>
            <div className={styles.avatarIcon} />
            <span className={styles.avatarLabel}>your photo<br />here</span>
          </div>
          <span className={styles.avatarCorner} />
        </div>
        <p className={styles.avatarName}>noah [lastname]</p>
      </div>
    </section>
  )
}

function Skills() {
  return (
    <section className={styles.section} id="skills">
      <p className={styles.sectionLabel}>skills &amp; tools</p>
      <div className={styles.skillsGrid}>
        {SKILLS.map(s => (
          <span
            key={s.label}
            className={`${styles.skillPill} ${s.highlight ? styles.skillHighlight : ''}`}
          >
            {s.label}
          </span>
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  return (
    <div className={`${styles.projCard} ${project.featured ? styles.projFeatured : ''}`}>
      <div className={styles.projTop}>
        <span className={styles.projTitle}>{project.title}</span>
        <div className={styles.projTopRight}>
          {project.live && <span className={styles.projBadge}>live</span>}
          {project.github && <a href={project.github} className={styles.projArrow} target="_blank" rel="noreferrer">gh ↗</a>}
          {project.url    && <a href={project.url}    className={styles.projArrow} target="_blank" rel="noreferrer">↗</a>}
        </div>
      </div>
      <p className={styles.projDesc}>{project.desc}</p>
      <div className={styles.projTags}>
        {project.tags.map(t => <span key={t} className={styles.projTag}>{t}</span>)}
      </div>
    </div>
  )
}

function Projects() {
  return (
    <section className={styles.section} id="projects">
      <p className={styles.sectionLabel}>projects</p>
      <div className={styles.projGrid}>
        {PROJECTS.map(p => <ProjectCard key={p.id} project={p} />)}
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section className={styles.section} id="experience">
      <p className={styles.sectionLabel}>experience</p>
      {EXPERIENCE.map(e => (
        <div key={e.id} className={styles.expItem}>
          <div className={styles.expHeader}>
            <span className={styles.expTitle}>{e.title}</span>
            <span className={styles.expDate}>{e.date}</span>
          </div>
          <p className={styles.expOrg}>{e.org}</p>
          {e.bullets.length > 0 && (
            <ul className={styles.expBullets}>
              {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </div>
      ))}
    </section>
  )
}

function Contact() {
  return (
    <section className={styles.section} id="contact">
      <p className={styles.sectionLabel}>contact</p>
      <div className={styles.contactRow}>
        <a href="mailto:you@email.com"                     className={styles.contactLink}>email ↗</a>
        <a href="https://github.com/yourusername"          className={styles.contactLink} target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href="https://linkedin.com/in/yourusername"     className={styles.contactLink} target="_blank" rel="noreferrer">LinkedIn ↗</a>
        <a href="/resume.pdf" download                     className={styles.contactLink}>resume (pdf) ↓</a>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <span className={styles.footerText}>noahxlastname.dev</span>
      <span className={styles.footerText}>
        built with ♥ and too much coffee<span className="cursor" />
      </span>
    </footer>
  )
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
  )
}
