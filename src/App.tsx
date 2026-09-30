import { useState, useEffect, useRef, useCallback } from 'react'
import harpiaLogo from '@/imports/logo.png'
import harpiaMascote from '@/imports/mascote.png'
import {
  Megaphone,
  Target,
  Headphones,
  Globe
} from "lucide-react";
import {
  WHATSAPP_URL,
  LINKEDIN_URL,
  INSTAGRAM_URL,
  CONTACT_ENDPOINT,
  NAV_LINKS,
} from '@/lib/constants'
import {
  useReveal,
  useActiveSection,
  useScrollPosition,
  useFocusTrap,
  sanitize,
  isValidEmail,
} from '@/lib/hooks'

/* ═══════════════════════════════════════════
   RATE LIMITER
   ═══════════════════════════════════════════ */

let lastSubmitTime = 0

/* ═══════════════════════════════════════════
   SCROLL REVEAL WRAPPER
   ═══════════════════════════════════════════ */

function Reveal({ className = '', delay = 0, variant = 'default', children }: {
  className?: string
  delay?: number
  variant?: 'default' | 'scale'
  children: React.ReactNode
}) {
  const ref = useReveal()
  const baseClass = variant === 'scale' ? 'reveal-scale' : 'reveal'
  const delayClass = delay > 0 ? ` reveal-d${delay}` : ''

  return (
    <div ref={ref} className={`${baseClass}${delayClass} ${className}`}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════
   BACKGROUND PATHS (inspirado 21st.dev BackgroundPaths by kokonutd)
   ═══════════════════════════════════════════ */

function BackgroundPaths() {
  return (
    <div className="bg-paths" aria-hidden="true">
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="path-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D00" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#FF9F1C" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFD166" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="path-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF9F1C" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#FF4D00" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="path-grad-3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD166" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FF4D00" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <g className="path-group">
          <path d="M-100 400 C200 200, 400 600, 600 300 S1000 500, 1300 250" stroke="url(#path-grad-1)" strokeWidth="1.5" />
          <path d="M-50 500 C150 300, 350 700, 550 350 S950 550, 1350 300" stroke="url(#path-grad-1)" strokeWidth="1" style={{ animationDelay: '1s' }} />
          <path d="M-100 300 C250 150, 500 500, 700 200 S1050 400, 1300 150" stroke="url(#path-grad-2)" strokeWidth="0.8" style={{ animationDelay: '2s' }} />
        </g>

        <g className="path-group-2">
          <path d="M-80 600 C300 350, 500 700, 800 400 S1100 600, 1350 350" stroke="url(#path-grad-2)" strokeWidth="1.2" style={{ animationDelay: '0.5s' }} />
          <path d="M-50 200 C200 450, 450 100, 700 450 S1000 200, 1300 500" stroke="url(#path-grad-3)" strokeWidth="0.8" style={{ animationDelay: '3s' }} />
          <path d="M-100 700 C200 500, 500 800, 800 500 S1100 700, 1400 450" stroke="url(#path-grad-3)" strokeWidth="1" style={{ animationDelay: '1.5s' }} />
        </g>
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SQUEEZE CAROUSEL (inspirado 21st.dev CarouselSqueeze by yura)
   ═══════════════════════════════════════════ */

const SOLUTIONS = [
  {
    id: 'marketing',
    label: 'Marketing',
    icon: <Megaphone size={40} />,
    title: 'Agente de Marketing',
    desc: 'Posts, legendas e stories gerados com a voz da sua marca. Presença constante sem esforço.',
    gradient: 'linear-gradient(135deg, rgba(255,77,0,0.15) 0%, rgba(255,159,28,0.08) 50%, rgba(11,11,18,0.95) 100%)',
    features: ['Geração de conteúdo', 'Agendamento automático', 'Tom de voz adaptado'],
  },
  {
    id: 'sdr',
    label: 'SDR',
    icon: <Target size={40} />,
    title: 'Agente de Vendas',
    desc: 'Qualifica leads automaticamente. Só quem está pronto para comprar chega ao seu time.',
    gradient: 'linear-gradient(135deg, rgba(255,159,28,0.15) 0%, rgba(255,209,102,0.08) 50%, rgba(11,11,18,0.95) 100%)',
    features: ['Qualificação automática', 'Lead scoring', 'Passagem com contexto'],
  },
  {
    id: 'suporte',
    label: 'Suporte',
    icon: <Headphones size={40} />,
    title: 'Agente de Suporte',
    desc: 'Atendimento 24/7 com resolução real. Escala para humanos só quando necessário.',
    gradient: 'linear-gradient(135deg, rgba(255,209,102,0.12) 0%, rgba(255,77,0,0.06) 50%, rgba(11,11,18,0.95) 100%)',
    features: ['24/7 autônomo', 'Base de conhecimento', 'Escalada inteligente'],
  },
  {
    id: 'site',
    label: 'Site + IA',
    icon: <Globe size={40} />,
    title: 'Site Profissional',
    desc: 'Site moderno com IA integrada. Conversão otimizada desde o primeiro dia.',
    gradient: 'linear-gradient(135deg, rgba(255,77,0,0.12) 0%, rgba(255,159,28,0.10) 50%, rgba(11,11,18,0.95) 100%)',
    features: ['Design de conversão', 'SEO otimizado', 'IA integrada'],
  },
]

function SqueezeCarousel() {
  const [active, setActive] = useState(0)

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setActive(i)
    }
  }

  return (
    <div className="squeeze-carousel" role="tablist" aria-label="Soluções disponíveis">
      {SOLUTIONS.map((sol, i) => (
        <div
          key={sol.id}
          role="tab"
          tabIndex={0}
          aria-selected={i === active}
          aria-label={sol.label}
          className={`squeeze-panel${i === active ? ' active' : ''}`}
          onClick={() => setActive(i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        >
          <div className="squeeze-panel-bg" style={{ background: sol.gradient }} />

          <div className="squeeze-strip">{sol.label}</div>

          <div className="squeeze-icon" style={{ color: 'var(--accent)' }}>
            {sol.icon}
          </div>

          <div className="squeeze-content" role="tabpanel">
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 10 }}>
              {sol.title}
            </h3>
            <p style={{ fontSize: 15, color: 'var(--text-1)', lineHeight: 1.6, marginBottom: 16, maxWidth: '36ch' }}>
              {sol.desc}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {sol.features.map((f, fi) => (
                <span key={fi} style={{
                  fontSize: 12, padding: '5px 12px',
                  background: 'rgba(255,77,0,0.1)',
                  border: '1px solid rgba(255,77,0,0.2)',
                  color: 'var(--accent-mid)',
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: '0.02em',
                }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════
   SPOTLIGHT CARD COMPONENT (inspirado 21st.dev SpotlightCard)
   ═══════════════════════════════════════════ */

function SpotlightCard({ children, className = '', spotlightColor = 'rgba(255,77,0,0.08)', style }: {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  style?: React.CSSProperties
}) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`spotlight-card ${className}`}
      style={style}
    >
      <div
        className="spotlight-overlay"
        style={{
          opacity,
          background: `radial-gradient(circle 180px at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════
   FLOATING ORBS COMPONENT (fundo animado voxr.ai style)
   ═══════════════════════════════════════════ */

function FloatingOrbs({ variant = 'hero' }: { variant?: 'hero' | 'section' | 'dark' }) {
  if (variant === 'hero') {
    return (
      <>
        <div className="aurora-mesh" aria-hidden="true">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
          <div className="aurora-blob aurora-blob-3" />
          <div className="aurora-blob aurora-blob-4" />
        </div>
      </>
    )
  }

  if (variant === 'dark') {
    return (
      <div className="aurora-mesh" aria-hidden="true">
        <div className="aurora-blob aurora-blob-1" style={{ width: 400, height: 400, opacity: 0.7 }} />
        <div className="aurora-blob aurora-blob-3" style={{ width: 300, height: 300, top: '60%', left: '60%', opacity: 0.5 }} />
      </div>
    )
  }

  return (
    <div className="aurora-mesh" aria-hidden="true">
      <div className="aurora-blob aurora-blob-2" style={{ width: 350, height: 350, opacity: 0.6 }} />
    </div>
  )
}

/* ═══════════════════════════════════════════
   SVG ICONS (social)
   ═══════════════════════════════════════════ */

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

/* ═══════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════ */

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const activeSection = useActiveSection(['inicio', 'solucoes', 'agentes', 'sites', 'sobre', 'contato'])
  const menuRef = useFocusTrap(menuOpen)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [menuOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.85)',
        backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'background .3s var(--ease-out-expo), border-color .3s var(--ease-out-expo)',
      }}>
        <nav style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          aria-label="Navegação principal">
          <a href="#inicio" aria-label="HarpiaHub - Voltar ao início">
            <img src={harpiaLogo} alt="HarpiaHub" style={{ height: 70, width: 'auto' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="nav-desktop">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} style={{
                fontSize: 14, color: activeSection === l.href.slice(1) ? 'var(--text-0)' : 'var(--text-1)',
                transition: 'color .15s var(--ease-out-expo)',
                borderBottom: activeSection === l.href.slice(1) ? '2px solid var(--accent)' : '2px solid transparent',
                paddingBottom: 4,
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-0)')}
                onMouseLeave={e => { if (activeSection !== l.href.slice(1)) e.currentTarget.style.color = 'var(--text-1)' }}>
                {l.label}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-shimmer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 22px',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600, fontSize: 14,
              cursor: 'pointer',
            }}>
              <WhatsAppIcon size={15} />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-0)', cursor: 'pointer', padding: 6 }}
              className="menu-btn"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                style={{ transition: 'transform 0.3s var(--ease-out-expo)' }}>
                {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={menuRef}
        role="dialog"
        aria-label="Menu de navegação"
        aria-modal={menuOpen}
        style={{
          position: 'fixed', inset: 0, background: '#000', zIndex: 99,
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .26s var(--ease-out-expo)',
          padding: '100px 28px 40px',
          display: 'flex', flexDirection: 'column', gap: 32,
        }}
      >
        {NAV_LINKS.map(l => (
          <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, color: 'var(--text-0)' }}>
            {l.label}
          </a>
        ))}
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="btn-shimmer" style={{
          marginTop: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '14px 28px',
          fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 16,
        }}>
          <WhatsAppIcon size={18} />
          <span>WhatsApp</span>
        </a>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .nav-desktop { display: none !important; }
          .menu-btn { display: block !important; }
        }
      `}</style>
    </>
  )
}

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */

function Hero() {
  return (
    <section id="inicio" className="noise-overlay" style={{ paddingTop: 140, paddingBottom: 80, background: 'var(--bg-0)', position: 'relative', overflow: 'hidden' }}>
      <BackgroundPaths />
      <FloatingOrbs variant="hero" />

      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.9fr', gap: 60, alignItems: 'center' }}>
          <div>
            <Reveal>
              <h1 style={{ fontSize: 'clamp(34px, 3.5vw, 58px)', lineHeight: 1.06, fontWeight: 700, maxWidth: '13ch' }}>
                Agentes de IA que trabalham para o seu <span style={{ color: 'var(--accent)' }}>negócio</span>
              </h1>
            </Reveal>
            <Reveal delay={1}>
              <p style={{ marginTop: 22, fontSize: 17, color: 'var(--text-1)', maxWidth: '48ch', lineHeight: 1.65 }}>
                Automatize marketing, qualifique leads antes de chegar ao seu time de vendas e resolva o suporte dos clientes com inteligência. Você foca no que importa.
              </p>
            </Reveal>
            <Reveal delay={2}>
              <div style={{ marginTop: 34, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a href="#agentes" className="btn-shimmer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 26px',
                  fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15,
                }}>
                  <span>Ver os agentes</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" style={{ position: 'relative', zIndex: 1 }} aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-interactive">
                  <WhatsAppIcon size={15} />
                  <span>Falar com a equipe</span>
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={2}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={harpiaMascote} alt="Mascote HarpiaHub" style={{ maxWidth: 480, width: '100%', height: 'auto' }} />
            </div>
          </Reveal>
        </div>
      </div>
      <style>{`@media (max-width: 860px) { #inicio > div > div { grid-template-columns: 1fr !important; } #inicio > div > div > div:last-child { display: none !important; } }`}</style>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SOLUTIONS SECTION (Squeeze Carousel)
   ═══════════════════════════════════════════ */

function SolutionsSection() {
  return (
    <section id="solucoes" className="noise-overlay" style={{ padding: '104px 0', background: 'var(--bg-0)', position: 'relative', overflow: 'hidden' }}>
      <FloatingOrbs variant="section" />

      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px', position: 'relative', zIndex: 2 }}>
        <Reveal>
          <div style={{ maxWidth: 560, marginBottom: 48 }}>
            <div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: "'Syne', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              Nossas soluções
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.12 }}>Quatro soluções. Um ecossistema completo.</h2>
            <p style={{ color: 'var(--text-1)', marginTop: 14, fontSize: 16, lineHeight: 1.65 }}>
              Clique em cada painel para explorar como cada solução funciona para o seu negócio.
            </p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <SqueezeCarousel />
        </Reveal>

        <Reveal delay={2}>
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <a href="#agentes" className="btn-interactive">
              <span>Ver detalhes de cada agente</span>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   AGENTS SECTION
   ═══════════════════════════════════════════ */

function AgentsSection() {
  const agents = [
    {
      id: 'marketing',
      tag: 'Marketing',
      headline: 'Conteúdo criado, postado e agendado, sem você precisar pensar nisso',
      description: 'O agente de marketing cria posts, legendas e stories com a identidade da sua marca. Você aprova e ele agenda. Presença nas redes sem precisar parar o dia para isso.',
      features: [
        'Geração de posts e legendas para redes sociais',
        'Criação de conteúdo para stories com prompts prontos',
        'Sugestão de hashtags e melhores horários',
        'Agendamento automático de publicações',
        'Tom de voz adaptado à sua marca',
      ],
      ideal: 'Para negócios que precisam de presença constante sem montar um time de conteúdo.',
    },
    {
      id: 'sdr',
      tag: 'Vendas (SDR)',
      headline: 'Só chegam leads prontos para fechar, curiosos ficam pelo caminho',
      description: 'O agente SDR conversa com cada contato que entra, faz as perguntas certas e qualifica com base no fit real com o seu produto. O seu time de vendas recebe apenas quem já está no momento de compra.',
      features: [
        'Qualificação automática de todos os leads',
        'Filtro de curiosos antes de chegar ao time',
        'Perguntas de descoberta por roteiro personalizado',
        'Lead scoring e classificação por prioridade',
        'Passagem de bastão com contexto completo para o SDR humano',
      ],
      ideal: 'Para times de vendas que gastam tempo com quem nunca vai fechar.',
    },
    {
      id: 'suporte',
      tag: 'Suporte',
      headline: 'Dúvidas resolvidas na hora, problemas complexos para o time certo',
      description: 'O agente de suporte atende com intenção total de resolução: entende o contexto, consulta a base de conhecimento e resolve o que pode. Só escala para humanos quando o caso exige.',
      features: [
        'Atendimento 24/7 sem intervenção humana para casos comuns',
        'Resolução de dúvidas frequentes com precisão',
        'Escalada inteligente para atendentes humanos',
        'Histórico de interações centralizado',
        'Libera o time para focar nos problemas que realmente importam',
      ],
      ideal: 'Para quem recebe volume alto de contatos repetitivos e quer liberar a equipe.',
    },
  ]

  return (
    <section id="agentes" className="noise-overlay" style={{ padding: '104px 0', background: 'var(--bg-1)', position: 'relative', overflow: 'hidden' }}>
      <FloatingOrbs variant="dark" />

      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px', position: 'relative', zIndex: 2 }}>
        <Reveal>
          <div style={{ maxWidth: 560, marginBottom: 64 }}>
            <div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: "'Syne', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              Agentes de Inteligência Artificial
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.12 }}>Três agentes. Três áreas críticas do negócio.</h2>
            <p style={{ color: 'var(--text-1)', marginTop: 14, fontSize: 16, lineHeight: 1.65 }}>
              Cada agente é treinado para uma função específica e opera com autonomia real, não apenas responde perguntas, resolve problemas.
            </p>
          </div>
        </Reveal>

        <AgentAccordion agents={agents} />
      </div>
    </section>
  )
}

type AgentData = { id: string; tag: string; headline: string; description: string; features: string[]; ideal: string }

function AgentAccordion({ agents }: { agents: AgentData[] }) {
  const [openId, setOpenId] = useState(agents[0]?.id || '')

  const handleToggle = (id: string) => {
    setOpenId(prev => prev === id ? '' : id)
  }

  return (
    <Reveal delay={1}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border-soft)', border: '1px solid var(--border-soft)' }}>
        {agents.map((agent) => (
          <AgentRow key={agent.id} agent={agent} open={openId === agent.id} onToggle={() => handleToggle(agent.id)} />
        ))}
      </div>
    </Reveal>
  )
}

function AgentRow({ agent, open, onToggle }: { agent: AgentData; open: boolean; onToggle: () => void }) {
  const contentId = `agent-content-${agent.id}`
  const headerId = `agent-header-${agent.id}`

  return (
    <div className={open ? 'accordion-row-active' : ''} style={{ background: 'var(--bg-0)', transition: 'border-color 0.3s var(--ease-out-expo), background 0.3s var(--ease-out-expo)' }}>
      <button
        id={headerId}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={contentId}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '28px 32px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left', gap: 20,
          transition: 'background 0.2s var(--ease-out-expo)',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--accent)', fontFamily: "'Syne', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', minWidth: 100, fontWeight: 600 }}>{agent.tag}</span>
          <h3 style={{ fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--text-0)' }}>{agent.headline}</h3>
        </div>
        <svg width="18" height="18" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .3s var(--ease-out-expo)' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className={`accordion-body${open ? ' open' : ''}`}
      >
        <div>
          <div style={{ padding: '0 32px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="agent-content">
            <div>
              <p style={{ color: 'var(--text-1)', fontSize: 16, lineHeight: 1.7 }}>{agent.description}</p>
              <div style={{ marginTop: 22, padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border-soft)' }}>
                <div style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: "'Syne', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Ideal para</div>
                <p style={{ color: 'var(--text-1)', fontSize: 14 }}>{agent.ideal}</p>
              </div>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {agent.features.map((f, fi) => (
                <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 15, color: 'var(--text-0)' }}>
                  <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SITES SECTION
   ═══════════════════════════════════════════ */

function SitesSection() {
  return (
    <section id="sites" className="noise-overlay" style={{ padding: '104px 0', background: 'var(--bg-0)', position: 'relative', overflow: 'hidden' }}>
      <FloatingOrbs variant="section" />

      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px', position: 'relative', zIndex: 2 }}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border-soft)', border: '1px solid var(--border-soft)' }} className="sites-grid">
            <div style={{ background: 'var(--bg-1)', padding: '52px 48px' }}>
              <div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: "'Syne', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
                Sites profissionais
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 2.8vw, 34px)', lineHeight: 1.14 }}>
                Site profissional em combo com o agente de IA
              </h2>
              <p style={{ color: 'var(--text-1)', marginTop: 16, fontSize: 16, lineHeight: 1.7, maxWidth: '44ch' }}>
                Desenvolvemos sites modernos, responsivos e otimizados para conversão. Além disso, integramos diretamente com a plataforma de atendimento via IA. Uma contratação, dois problemas resolvidos.
              </p>
              <ul style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Design focado em conversão e clareza',
                  'Integração nativa com o agente de suporte ou SDR',
                  'Hospedagem, domínio e suporte técnico inclusos',
                  'Entrega rápida com stack moderna',
                ].map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 15, color: 'var(--text-0)' }}>
                    <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0, marginTop: 3 }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 32 }}>
                <a href="#contato" className="btn-shimmer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 26px',
                  fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15,
                }}>
                  <span>Quero um orçamento</span>
                </a>
              </div>
            </div>

            <div style={{ background: 'var(--bg-0)', padding: '52px 48px', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: "'Syne', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
                O que está incluso
              </div>
              {[
                { title: 'Site institucional', desc: 'Páginas bem construídas com foco em apresentar a empresa, gerar confiança e converter visitantes.' },
                { title: 'Landing pages', desc: 'Páginas únicas para campanhas ou lançamentos, com foco em uma ação específica e performance rastreável.' },
                { title: 'E-commerce', desc: 'Lojas virtuais com integração de pagamento, gestão de estoque e experiência de compra otimizada.' },
                { title: 'IA integrada', desc: 'Agente de atendimento instalado no site, pronto para qualificar leads ou resolver suporte desde o primeiro dia.' },
              ].map((item, i) => (
                <SpotlightCard key={i} className="feature-card" spotlightColor="rgba(255,77,0,0.06)" style={{
                  padding: '22px 20px',
                  borderBottom: i < 3 ? '1px solid var(--border-soft)' : 'none',
                  background: 'var(--bg-0)',
                  cursor: 'default',
                }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.55 }}>{item.desc}</div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .sites-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

/* ═══════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════ */

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Diagnóstico', desc: 'Conversamos sobre o seu negócio para entender onde a IA vai gerar mais resultado: marketing, vendas ou suporte.' },
    { num: '02', title: 'Configuração', desc: 'Treinamos o agente com as informações da sua empresa: produto, tom de voz, perguntas frequentes e processo de vendas.' },
    { num: '03', title: 'Ativação', desc: 'O agente entra em produção integrado aos seus canais, WhatsApp, site ou redes sociais.' },
    { num: '04', title: 'Operação contínua', desc: 'Monitoramos, ajustamos e evoluímos o agente com base nos dados reais das interações.' },
  ]
  return (
    <section id="sobre" className="noise-overlay" style={{ padding: '104px 0', background: 'var(--bg-1)', position: 'relative', overflow: 'hidden' }}>
      <FloatingOrbs variant="dark" />

      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px', position: 'relative', zIndex: 2 }}>
        <Reveal>
          <div style={{ maxWidth: 520, marginBottom: 64 }}>
            <div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: "'Syne', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              Como funciona
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', lineHeight: 1.12 }}>Do primeiro contato ao agente em produção</h2>
            <p style={{ color: 'var(--text-1)', marginTop: 14, fontSize: 16, lineHeight: 1.65 }}>
              Um processo direto, sem jargão e sem etapas desnecessárias. Você entende o que está sendo feito em cada fase.
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border-soft)', border: '1px solid var(--border-soft)' }} className="steps-grid">
          {steps.map((step, i) => (
            <Reveal key={i} delay={i + 1} variant="scale">
              <SpotlightCard className="feature-card" spotlightColor="rgba(255,77,0,0.07)" style={{ background: 'var(--bg-0)', padding: '36px 28px', height: '100%' }}>
                <div className="feature-num feature-icon" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 38, color: 'var(--accent)', lineHeight: 1, marginBottom: 20, fontVariantNumeric: 'tabular-nums' }}>{step.num}</div>
                <h3 style={{ fontSize: 17, marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.6 }}>{step.desc}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <div style={{ marginTop: 64, marginBottom: 0, height: 1, background: 'var(--border-soft)' }} aria-hidden="true" />

        <Reveal>
          <div style={{ marginTop: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border-soft)', border: '1px solid var(--border-soft)', borderTop: 'none' }} className="about-grid">
            <div style={{ background: 'var(--bg-0)', padding: '40px 44px' }}>
              <div>
                <h3 style={{ fontSize: 22, marginBottom: 16 }}>Sobre a HarpiaHub</h3>
                <p style={{ color: 'var(--text-1)', fontSize: 16, lineHeight: 1.7 }}>
                  Somos uma empresa de tecnologia de Natal, RN. Pequena por tamanho, precisa por escolha. Trabalhamos com negócios que precisam de soluções reais, sem promessas vazias.
                </p>
                <p style={{ color: 'var(--text-1)', fontSize: 16, lineHeight: 1.7, marginTop: 14 }}>
                  Nossa especialidade é construir agentes de IA que funcionam de verdade: com contexto, com treinamento específico para o negócio e com resultado mensurável.
                </p>
              </div>
            </div>
            <div style={{ background: 'var(--surface)', padding: '40px 44px' }}>
              <h3 style={{ fontSize: 16, color: 'var(--accent)', marginBottom: 20 }}>Por que a HarpiaHub?</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Agentes treinados para o seu contexto específico, não soluções genéricas',
                  'Proximidade real: você fala direto com quem constrói',
                  'Entrega sem enrolação e com documentação clara',
                  'Suporte ativo após o lançamento',
                  'Tecnologia de ponta sem complexidade de gestão para o cliente',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 15, color: 'var(--text-1)' }}>
                    <svg width="15" height="15" fill="none" stroke="var(--accent)" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0, marginTop: 4 }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .agent-content { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

/* ═══════════════════════════════════════════
   CONTACT SECTION
   ═══════════════════════════════════════════ */

function ContactSection() {
  const [form, setForm] = useState({ nome: '', email: '', empresa: '', interesse: '', mensagem: '', _hp: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [emailError, setEmailError] = useState('')

  const handleEmailBlur = () => {
    if (form.email && !isValidEmail(form.email)) {
      setEmailError('Por favor, insira um e-mail válido.')
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form._hp) return

    const now = Date.now()
    if (now - lastSubmitTime < 3000) return
    lastSubmitTime = now

    if (!isValidEmail(form.email)) {
      setEmailError('Por favor, insira um e-mail válido.')
      return
    }

    setStatus('sending')

    try {
      const payload = {
        nome: sanitize(form.nome),
        email: sanitize(form.email),
        empresa: sanitize(form.empresa),
        interesse: sanitize(form.interesse),
        mensagem: sanitize(form.mensagem),
        timestamp: new Date().toISOString(),
        origin: window.location.hostname,
      }

      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok || res.status === 200 || res.status === 201 || res.status === 204) {
        setStatus('sent')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contato" className="noise-overlay" style={{ padding: '104px 0', background: 'var(--bg-0)', position: 'relative', overflow: 'hidden' }}>
      <FloatingOrbs variant="section" />

      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px', position: 'relative', zIndex: 2 }}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }} className="contact-grid">
            {/* Left info */}
            <div style={{ background: 'var(--bg-1)', padding: '52px 44px' }}>
              <h2 style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', lineHeight: 1.2 }}>Vamos conversar sobre o seu negócio?</h2>
              <p style={{ color: 'var(--text-1)', marginTop: 14, fontSize: 15 }}>
                Preencha o formulário ou chame no WhatsApp. Retornamos em até 2 horas úteis.
              </p>
              <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: 14, color: 'inherit' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} aria-hidden="true"><WhatsAppIcon size={19} /></span>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 3 }}>WhatsApp</div>
                    <div style={{ fontSize: 15, color: 'var(--text-0)', transition: 'color .15s' }}>+55 (84) 8696-1402</div>
                  </div>
                </a>
                <div style={{ display: 'flex', gap: 14 }}>
                  <svg width="19" height="19" fill="none" stroke="var(--accent)" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 3 }}>Localização</div>
                    <div style={{ fontSize: 15, color: 'var(--text-0)' }}>Natal, RN, Brasil</div>
                  </div>
                </div>
              </div>

              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-shimmer" style={{
                marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%',
                padding: '14px 26px', fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15,
                cursor: 'pointer',
              }}>
                <WhatsAppIcon size={16} />
                <span>Chamar no WhatsApp</span>
              </a>

              <div style={{ marginTop: 28, border: '1px solid var(--border-soft)', padding: '18px 20px' }}>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 14, fontFamily: "'Syne', sans-serif" }}>Horário de atendimento</div>
                {[['Seg a Sex', '08h às 18h'], ['Sáb', '09h às 13h']].map(([day, h], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, borderTop: i > 0 ? '1px solid var(--border-soft)' : 'none' }}>
                    <span style={{ color: 'var(--text-2)' }}>{day}</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right form */}
            <div style={{ background: 'var(--bg-1)', padding: '52px 44px' }}>
              <div style={{ transition: 'opacity 0.3s var(--ease-out-expo)' }}>
                {status === 'sent' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, height: '100%', justifyContent: 'center' }}>
                    <div style={{ width: 48, height: 48, border: '2px solid var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" fill="none" stroke="var(--color-success)" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                    </div>
                    <h3 style={{ fontSize: 22 }}>Mensagem enviada</h3>
                    <p style={{ color: 'var(--text-1)', fontSize: 15 }}>Vamos retornar em até 2 horas úteis.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }} noValidate>
                    {/* Honeypot */}
                    <input
                      type="text"
                      name="website"
                      value={form._hp}
                      onChange={e => setForm(p => ({ ...p, _hp: e.target.value }))}
                      autoComplete="off"
                      tabIndex={-1}
                      aria-hidden="true"
                      style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, overflow: 'hidden' }}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="form-name-email-grid">
                      <div>
                        <label htmlFor="contact-nome" style={{ display: 'block', fontSize: 13, color: 'var(--text-2)', marginBottom: 7 }}>Nome completo</label>
                        <input id="contact-nome" type="text" placeholder="Seu nome" required
                          maxLength={200}
                          value={form.nome}
                          onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                          className="input-glow"
                          style={{ width: '100%', background: 'var(--bg-0)', border: '1px solid var(--border)', color: 'var(--text-0)', padding: '12px 14px', fontFamily: "'Inter', sans-serif", fontSize: 15, outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" style={{ display: 'block', fontSize: 13, color: 'var(--text-2)', marginBottom: 7 }}>E-mail</label>
                        <input id="contact-email" type="email" placeholder="seu@email.com" required
                          maxLength={200}
                          value={form.email}
                          onChange={e => { setForm(p => ({ ...p, email: e.target.value })); if (emailError) setEmailError('') }}
                          onBlur={handleEmailBlur}
                          aria-describedby={emailError ? 'email-error' : undefined}
                          aria-invalid={emailError ? true : undefined}
                          className="input-glow"
                          style={{ width: '100%', background: 'var(--bg-0)', border: `1px solid ${emailError ? 'var(--color-error)' : 'var(--border)'}`, color: 'var(--text-0)', padding: '12px 14px', fontFamily: "'Inter', sans-serif", fontSize: 15, outline: 'none' }}
                        />
                        {emailError && <p id="email-error" style={{ color: 'var(--color-error)', fontSize: 13, marginTop: 4 }} role="alert">{emailError}</p>}
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label htmlFor="contact-empresa" style={{ display: 'block', fontSize: 13, color: 'var(--text-2)', marginBottom: 7 }}>Empresa / Negócio</label>
                      <input id="contact-empresa" type="text" placeholder="Nome da empresa (opcional)"
                        maxLength={200}
                        value={form.empresa}
                        onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))}
                        className="input-glow"
                        style={{ width: '100%', background: 'var(--bg-0)', border: '1px solid var(--border)', color: 'var(--text-0)', padding: '12px 14px', fontFamily: "'Inter', sans-serif", fontSize: 15, outline: 'none' }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label htmlFor="contact-interesse" style={{ display: 'block', fontSize: 13, color: 'var(--text-2)', marginBottom: 7 }}>O que você precisa?</label>
                      <div style={{ position: 'relative' }}>
                        <select id="contact-interesse" value={form.interesse}
                          onChange={e => setForm(p => ({ ...p, interesse: e.target.value }))}
                          className="input-glow"
                          style={{ width: '100%', background: 'var(--bg-0)', border: '1px solid var(--border)', color: form.interesse ? 'var(--text-0)' : 'var(--text-2)', padding: '12px 14px', paddingRight: 40, fontFamily: "'Inter', sans-serif", fontSize: 15, outline: 'none', appearance: 'none', cursor: 'pointer' }}
                        >
                          <option value="">Selecione uma opção</option>
                          <option value="marketing">Agente de Marketing</option>
                          <option value="sdr">Agente de Vendas (SDR)</option>
                          <option value="suporte">Agente de Suporte</option>
                          <option value="site">Site + IA em combo</option>
                          <option value="todos">Mais de uma solução</option>
                        </select>
                        <svg width="16" height="16" fill="none" stroke="var(--text-2)" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"
                          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label htmlFor="contact-mensagem" style={{ display: 'block', fontSize: 13, color: 'var(--text-2)', marginBottom: 7 }}>Mensagem</label>
                      <textarea id="contact-mensagem" placeholder="Conte um pouco sobre o seu negócio e o que você quer resolver..." rows={4} required
                        maxLength={2000}
                        value={form.mensagem}
                        onChange={e => setForm(p => ({ ...p, mensagem: e.target.value }))}
                        className="input-glow"
                        style={{ width: '100%', background: 'var(--bg-0)', border: '1px solid var(--border)', color: 'var(--text-0)', padding: '12px 14px', fontFamily: "'Inter', sans-serif", fontSize: 15, outline: 'none', resize: 'vertical' }}
                      />
                    </div>
                    {status === 'error' && (
                      <p style={{ color: 'var(--color-error)', fontSize: 14, marginBottom: 16 }} role="alert">Erro ao enviar. Tente novamente ou chame no WhatsApp.</p>
                    )}
                    <button type="submit" disabled={status === 'sending'} className="btn-shimmer" style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '14px 26px', fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15,
                      cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                      opacity: status === 'sending' ? 0.6 : 1,
                    }}>
                      <span>{status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */

function Footer() {
  return (
    <footer style={{ background: 'var(--bg-0)', borderTop: '1px solid var(--border-soft)', padding: '56px 0 28px' }}>
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px' }}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }} className="footer-grid">
            <div>
              <img src={harpiaLogo} alt="HarpiaHub" style={{ height: 28, width: 'auto' }} />
              <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 16, lineHeight: 1.6, maxWidth: '28ch' }}>
                Tecnologia com a precisão de quem enxerga longe. Agentes de IA, sites e automações personalizadas.
              </p>
              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp">
                  <WhatsAppIcon size={15} />
                </a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                  <LinkedInIcon />
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                  <InstagramIcon />
                </a>
              </div>
            </div>
            {[
              {
                title: 'Agentes IA', links: [
                  { label: 'Marketing', href: '#agentes' },
                  { label: 'Vendas (SDR)', href: '#agentes' },
                  { label: 'Suporte', href: '#agentes' },
                ]
              },
              {
                title: 'Empresa', links: [
                  { label: 'Sites + IA', href: '#sites' },
                  { label: 'Sobre nós', href: '#sobre' },
                  { label: 'Contato', href: '#contato' },
                ]
              },
              {
                title: 'Contato', links: [
                  { label: 'WhatsApp', href: WHATSAPP_URL, external: true },
                  { label: 'LinkedIn', href: LINKEDIN_URL, external: true },
                  { label: 'Instagram', href: INSTAGRAM_URL, external: true },
                  { label: 'Natal, RN, Brasil', href: '#contato' },
                ]
              },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 14, color: 'var(--text-1)', marginBottom: 18, fontFamily: "'Syne', sans-serif" }}>{col.title}</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(l => (
                    <li key={l.label}>
                      <a href={l.href} className="footer-link-anim"
                        {...('external' in l && l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        style={{ fontSize: 14, color: 'var(--text-2)', transition: 'color .15s var(--ease-out-expo)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}>
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
        <div style={{ marginTop: 44, paddingTop: 20, borderTop: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>© 2026 HarpiaHub. Todos os direitos reservados.</span>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Natal, RN, Brasil</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

/* ═══════════════════════════════════════════
   BACK TO TOP BUTTON
   ═══════════════════════════════════════════ */

function BackToTop() {
  const showButton = useScrollPosition(400)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      className={`back-to-top${showButton ? ' visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
    >
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}

/* ═══════════════════════════════════════════
   APP
   ═══════════════════════════════════════════ */

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)' }}>
      <Nav />
      <main id="main-content">
        <Hero />
        <div style={{ height: 1, background: 'var(--border-soft)' }} aria-hidden="true" />
        <SolutionsSection />
        <div style={{ height: 1, background: 'var(--border-soft)' }} aria-hidden="true" />
        <AgentsSection />
        <div style={{ height: 1, background: 'var(--border-soft)' }} aria-hidden="true" />
        <SitesSection />
        <div style={{ height: 1, background: 'var(--border-soft)' }} aria-hidden="true" />
        <HowItWorks />
        <div style={{ height: 1, background: 'var(--border-soft)' }} aria-hidden="true" />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
