import { useState, useEffect } from 'react'
import harpiaLogo from '@/imports/harpia-logo.png'
import {
  Megaphone,
  Target,
  Headphones,
  Globe
} from "lucide-react";

const NAV_LINKS = [
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Agentes IA', href: '#agentes' },
  { label: 'Sites', href: '#sites' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
]

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(13,11,10,0.96)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border-soft)' : '1px solid transparent',
        transition: 'background .2s ease, border-color .2s ease',
      }}>
        <nav style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#inicio" aria-label="HarpiaHub">
            <img src={harpiaLogo} alt="HarpiaHub" style={{ height: 70, width: 'auto' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="nav-desktop">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} style={{ fontSize: 14.5, color: 'var(--text-1)', transition: 'color .15s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-0)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-1)')}>
                {l.label}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="#contato" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 22px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600, fontSize: 14,
              background: 'var(--accent)', color: '#1A0D06',
              border: '1px solid var(--accent)',
              cursor: 'pointer', transition: 'background .15s ease',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FF8A4C')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}>
              Fale Conosco
            </a>
            <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu" style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-0)', cursor: 'pointer', padding: 6 }} className="menu-btn">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile panel */}
      <div style={{
        position: 'fixed', inset: 0, background: 'var(--bg-0)', zIndex: 99,
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .26s ease',
        padding: '100px 28px 40px',
        display: 'flex', flexDirection: 'column', gap: 32,
      }}>
        {NAV_LINKS.map(l => (
          <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, color: 'var(--text-0)' }}>
            {l.label}
          </a>
        ))}
        <a href="#contato" onClick={() => setMenuOpen(false)} style={{
          marginTop: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: '14px 28px',
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 16,
          background: 'var(--accent)', color: '#1A0D06',
        }}>
          Fale Conosco
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

function Hero() {
  return (
    <section id="inicio" style={{ paddingTop: 140, paddingBottom: 80, background: 'var(--bg-0)' }}>
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.9fr', gap: 60, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--text-2)', marginBottom: 24, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <span style={{ width: 5, height: 5, background: 'var(--accent)', borderRadius: '50%', flexShrink: 0, display: 'inline-block' }} />
              Natal, RN - Tecnologia com precisão
            </div>
            <h1 style={{ fontSize: 'clamp(34px, 3.5vw, 58px)', lineHeight: 1.06, fontWeight: 700, maxWidth: '13ch' }}>
              Agentes de IA que trabalham para o seu <span style={{ color: 'var(--accent)' }}>negócio</span>
            </h1>
            <p style={{ marginTop: 22, fontSize: 17, color: 'var(--text-1)', maxWidth: '48ch', lineHeight: 1.65 }}>
              Automatize marketing, qualifique leads antes de chegar ao seu time de vendas e resolva o suporte dos clientes com inteligência. Você foca no que importa.
            </p>
            <div style={{ marginTop: 34, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#agentes" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 26px',
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15,
                background: 'var(--accent)', color: '#1A0D06',
                border: '1px solid var(--accent)',
                transition: 'background .15s ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FF8A4C')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}>
                Ver os agentes
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#contato" style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '13px 26px',
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15,
                background: 'transparent', color: 'var(--text-0)',
                border: '1px solid var(--border)',
                transition: 'border-color .15s ease, color .15s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-0)'; }}>
                Falar com a equipe
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, border: '1px solid var(--border-soft)' }}>
            {[
              { icon: <Megaphone size={16} />, label: 'Agente de Marketing', desc: 'Posts, stories e legenda gerados automaticamente com a voz da sua marca.' },
              { icon: <Target size={16} />, label: 'Agente SDR', desc: 'Só leads qualificados chegam ao seu time. Curiosos são filtrados antes.' },
              { icon: <Headphones size={16} />, label: 'Agente de Suporte', desc: 'Atendimento 24/7. Resolve o comum, escala o complexo.' },
              { icon: <Globe size={16} />, label: 'Site + SEO ', desc: 'Seu site com otimização para motores de busca. Sua marca no topo.' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '20px 24px', background: 'var(--bg-1)',
                borderBottom: i < 3 ? '1px solid var(--border-soft)' : 'none',
                display: 'flex', alignItems: 'flex-start', gap: 14,
              }}>
                <span style={{ color: 'var(--accent)', fontSize: 9, marginTop: 6, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-1)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 72, borderTop: '1px solid var(--border-soft)', paddingTop: 28, display: 'flex', gap: 0 }}>
          {[
            { num: '24/7', label: 'Disponibilidade dos agentes' },
            { num: '3 agentes', label: 'Marketing · SDR · Suporte' },
            { num: '+ Site', label: 'Presença digital completa' },
            { num: 'Natal, RN', label: 'Base de operação' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, paddingRight: 24, borderRight: i < 3 ? '1px solid var(--border-soft)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--text-0)', fontVariantNumeric: 'tabular-nums' }}>{s.num}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 860px) { #inicio > div > div { grid-template-columns: 1fr !important; } #inicio > div > div > div:last-child { display: none !important; } }`}</style>
    </section>
  )
}

function AgentsSection() {
  const agents = [
    {
      id: 'marketing',
      tag: 'Agente 01',
      title: 'Marketing',
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
      tag: 'Agente 02',
      title: 'SDR',
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
      tag: 'Agente 03',
      title: 'Suporte',
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
    <section id="agentes" style={{ padding: '104px 0', background: 'var(--bg-1)' }}>
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ maxWidth: 560, marginBottom: 64 }}>
          <div style={{ fontSize: 12.5, color: 'var(--accent)', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            Agentes de Inteligência Artificial
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1.12 }}>Três agentes. Três áreas críticas do negócio.</h2>
          <p style={{ color: 'var(--text-1)', marginTop: 14, fontSize: 16, lineHeight: 1.65 }}>
            Cada agente é treinado para uma função específica e opera com autonomia real, não apenas responde perguntas, resolve problemas.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border-soft)', border: '1px solid var(--border-soft)' }}>
          {agents.map((agent, i) => (
            <AgentRow key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AgentRow({ agent, index }: { agent: ReturnType<typeof Object.create>, index: number }) {
  const [open, setOpen] = useState(index === 0)

  return (
    <div style={{ background: 'var(--bg-0)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '28px 32px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left', gap: 20,
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--accent)', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', minWidth: 76 }}>{agent.tag}</span>
          <h3 style={{ fontSize: 'clamp(18px, 2vw, 22px)', color: 'var(--text-0)' }}>{agent.headline}</h3>
        </div>
        <svg width="18" height="18" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div style={{ padding: '0 32px 36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <p style={{ color: 'var(--text-1)', fontSize: 15.5, lineHeight: 1.7 }}>{agent.description}</p>
            <div style={{ marginTop: 22, padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border-soft)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Ideal para</div>
              <p style={{ color: 'var(--text-1)', fontSize: 14 }}>{agent.ideal}</p>
            </div>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {agent.features.map((f: string, fi: number) => (
              <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14.5, color: 'var(--text-0)' }}>
                <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2.2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 3 }}>
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SitesSection() {
  return (
    <section id="sites" style={{ padding: '104px 0', background: 'var(--bg-0)' }}>
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border-soft)', border: '1px solid var(--border-soft)' }}>
          <div style={{ background: 'var(--bg-1)', padding: '52px 48px' }}>
            <div style={{ fontSize: 12.5, color: 'var(--accent)', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
              Sites profissionais
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 2.8vw, 34px)', lineHeight: 1.14 }}>
              Site profissional em combo com o agente de IA
            </h2>
            <p style={{ color: 'var(--text-1)', marginTop: 16, fontSize: 15.5, lineHeight: 1.7, maxWidth: '44ch' }}>
              Desenvolvemos sites modernos, responsivos e otimizados para conversão. Além disso, integramos diretamente com a plataforma de atendimento via IA. Uma contratação, dois problemas resolvidos.
            </p>
            <ul style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Design focado em conversão e clareza',
                'Integração nativa com o agente de suporte ou SDR',
                'Hospedagem, domínio e suporte técnico inclusos',
                'Entrega rápida com stack moderna',
              ].map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14.5, color: 'var(--text-0)' }}>
                  <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2.2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 3 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 32 }}>
              <a href="#contato" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 26px',
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15,
                background: 'var(--accent)', color: '#1A0D06',
                border: '1px solid var(--accent)',
                transition: 'background .15s ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FF8A4C')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}>
                Quero um orçamento
              </a>
            </div>
          </div>
          <div style={{ background: 'var(--bg-0)', padding: '52px 48px', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{ fontSize: 12.5, color: 'var(--accent)', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
              O que está incluso
            </div>
            {[
              { title: 'Site institucional', desc: 'Páginas bem construídas com foco em apresentar a empresa, gerar confiança e converter visitantes.' },
              { title: 'Landing pages', desc: 'Páginas únicas para campanhas ou lançamentos, com foco em uma ação específica e performance rastreável.' },
              { title: 'E-commerce', desc: 'Lojas virtuais com integração de pagamento, gestão de estoque e experiência de compra otimizada.' },
              { title: 'IA integrada', desc: 'Agente de atendimento instalado no site, pronto para qualificar leads ou resolver suporte desde o primeiro dia.' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '22px 0', borderBottom: i < 3 ? '1px solid var(--border-soft)' : 'none' }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.55 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          #sites > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Diagnóstico', desc: 'Conversamos sobre o seu negócio para entender onde a IA vai gerar mais resultado: marketing, vendas ou suporte.' },
    { num: '02', title: 'Configuração', desc: 'Treinamos o agente com as informações da sua empresa: produto, tom de voz, perguntas frequentes e processo de vendas.' },
    { num: '03', title: 'Ativação', desc: 'O agente entra em produção integrado aos seus canais, WhatsApp, site ou redes sociais.' },
    { num: '04', title: 'Operação contínua', desc: 'Monitoramos, ajustamos e evoluímos o agente com base nos dados reais das interações.' },
  ]
  return (
    <section id="sobre" style={{ padding: '104px 0', background: 'var(--bg-1)' }}>
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ maxWidth: 520, marginBottom: 64 }}>
          <div style={{ fontSize: 12.5, color: 'var(--accent)', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            Como funciona
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', lineHeight: 1.12 }}>Do primeiro contato ao agente em produção</h2>
          <p style={{ color: 'var(--text-1)', marginTop: 14, fontSize: 16, lineHeight: 1.65 }}>
            Um processo direto, sem jargão e sem etapas desnecessárias. Você entende o que está sendo feito em cada fase.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border-soft)', border: '1px solid var(--border-soft)' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ background: 'var(--bg-0)', padding: '36px 28px' }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 38, color: 'var(--accent)', lineHeight: 1, marginBottom: 20, fontVariantNumeric: 'tabular-nums' }}>{step.num}</div>
              <h3 style={{ fontSize: 17, marginBottom: 12 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border-soft)', border: '1px solid var(--border-soft)' }}>
          <div style={{ background: 'var(--bg-0)', padding: '40px 44px' }}>
            <h3 style={{ fontSize: 22, marginBottom: 16 }}>Sobre a HarpiaHub</h3>
            <p style={{ color: 'var(--text-1)', fontSize: 15.5, lineHeight: 1.7 }}>
              Somos uma empresa de tecnologia de Natal, RN. Pequena por tamanho, precisa por escolha. Trabalhamos com negócios que precisam de soluções reais, sem promessas vazias.
            </p>
            <p style={{ color: 'var(--text-1)', fontSize: 15.5, lineHeight: 1.7, marginTop: 14 }}>
              Nossa especialidade é construir agentes de IA que funcionam de verdade: com contexto, com treinamento específico para o negócio e com resultado mensurável.
            </p>
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
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14.5, color: 'var(--text-1)' }}>
                  <svg width="15" height="15" fill="none" stroke="var(--accent)" strokeWidth="2.2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 4 }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          #sobre > div > div:last-child { grid-template-columns: 1fr !important; }
          #sobre > div > div:first-child + div { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          #sobre > div > div:first-child + div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function ContactSection() {
  const [form, setForm] = useState({ nome: '', email: '', empresa: '', interesse: '', mensagem: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contato" style={{ padding: '104px 0', background: 'var(--bg-0)' }}>
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 1, background: 'var(--border)', border: '1px solid var(--border)' }}>
          <div style={{ background: 'var(--bg-1)', padding: '52px 44px' }}>
            <h2 style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', lineHeight: 1.2 }}>Vamos conversar sobre o seu negócio?</h2>
            <p style={{ color: 'var(--text-1)', marginTop: 14, fontSize: 15 }}>
              Conta o que você precisa e a gente retorna em até 2 horas úteis com uma proposta direta.
            </p>
            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'E-mail', val: 'contato@harpiahub.com.br' },
                { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Localização', val: 'Natal, RN — Brasil' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 14 }}>
                  <svg width="19" height="19" fill="none" stroke="var(--accent)" strokeWidth="1.8" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d={c.icon} />
                  </svg>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 3 }}>{c.label}</div>
                    <div style={{ fontSize: 15, color: 'var(--text-0)' }}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 36, border: '1px solid var(--border-soft)', padding: '18px 20px' }}>
              <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginBottom: 14, fontFamily: "'Space Grotesk', sans-serif" }}>Horário de atendimento</div>
              {[['Seg – Sex', '08h – 18h'], ['Sáb', '09h – 13h']].map(([day, h], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14, borderTop: i > 0 ? '1px solid var(--border-soft)' : 'none' }}>
                  <span style={{ color: 'var(--text-2)' }}>{day}</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-1)', padding: '52px 44px' }}>
            {sent ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16, height: '100%', justifyContent: 'center' }}>
                <div style={{ width: 48, height: 48, border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" fill="none" stroke="var(--accent)" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <h3 style={{ fontSize: 22 }}>Mensagem enviada</h3>
                <p style={{ color: 'var(--text-1)', fontSize: 15 }}>Vamos retornar em até 2 horas úteis. Fique de olho no seu e-mail.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  {[
                    { id: 'nome', label: 'Nome completo', type: 'text', placeholder: 'Seu nome' },
                    { id: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com' },
                  ].map(f => (
                    <div key={f.id}>
                      <label style={{ display: 'block', fontSize: 12.5, color: 'var(--text-2)', marginBottom: 7 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} required
                        value={(form as Record<string, string>)[f.id]}
                        onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                        style={{ width: '100%', background: 'var(--bg-0)', border: '1px solid var(--border)', color: 'var(--text-0)', padding: '12px 14px', fontFamily: "'Inter', sans-serif", fontSize: 14.5, outline: 'none', transition: 'border-color .15s' }}
                        onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                        onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12.5, color: 'var(--text-2)', marginBottom: 7 }}>Empresa / Negócio</label>
                  <input type="text" placeholder="Nome da empresa (opcional)"
                    value={form.empresa}
                    onChange={e => setForm(p => ({ ...p, empresa: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-0)', border: '1px solid var(--border)', color: 'var(--text-0)', padding: '12px 14px', fontFamily: "'Inter', sans-serif", fontSize: 14.5, outline: 'none', transition: 'border-color .15s' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12.5, color: 'var(--text-2)', marginBottom: 7 }}>O que você precisa?</label>
                  <select value={form.interesse}
                    onChange={e => setForm(p => ({ ...p, interesse: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-0)', border: '1px solid var(--border)', color: form.interesse ? 'var(--text-0)' : 'var(--text-2)', padding: '12px 14px', fontFamily: "'Inter', sans-serif", fontSize: 14.5, outline: 'none', appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="marketing">Agente de Marketing</option>
                    <option value="sdr">Agente SDR</option>
                    <option value="suporte">Agente de Suporte</option>
                    <option value="site">Site + IA em combo</option>
                    <option value="todos">Mais de uma solução</option>
                  </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12.5, color: 'var(--text-2)', marginBottom: 7 }}>Mensagem</label>
                  <textarea placeholder="Conte um pouco sobre o seu negócio e o que você quer resolver..." rows={4} required
                    value={form.mensagem}
                    onChange={e => setForm(p => ({ ...p, mensagem: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg-0)', border: '1px solid var(--border)', color: 'var(--text-0)', padding: '12px 14px', fontFamily: "'Inter', sans-serif", fontSize: 14.5, outline: 'none', resize: 'vertical', transition: 'border-color .15s' }}
                    onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>
                <button type="submit" style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 26px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15,
                  background: 'var(--accent)', color: '#1A0D06', border: '1px solid var(--accent)',
                  cursor: 'pointer', transition: 'background .15s ease',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FF8A4C')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}>
                  Enviar mensagem
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          #contato > div > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ background: 'var(--bg-0)', borderTop: '1px solid var(--border-soft)', padding: '56px 0 28px' }}>
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }}>
          <div>
            <img src={harpiaLogo} alt="HarpiaHub" style={{ height: 28, width: 'auto' }} />
            <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 16, lineHeight: 1.6, maxWidth: '28ch' }}>
              Tecnologia com a precisão de quem enxerga longe. Agentes de IA, sites e automações personalizadas.
            </p>
          </div>
          {[
            {
              title: 'Agentes IA', links: [
                { label: 'Marketing', href: '#agentes' },
                { label: 'SDR', href: '#agentes' },
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
                { label: 'contato@harpiahub.com.br', href: 'mailto:contato@harpiahub.com.br' },
                { label: 'Natal, RN — Brasil', href: '#contato' },
              ]
            },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13.5, color: 'var(--text-1)', marginBottom: 18, fontFamily: "'Space Grotesk', sans-serif" }}>{col.title}</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <li key={l.label}>
                    <a href={l.href} style={{ fontSize: 13.5, color: 'var(--text-2)', transition: 'color .15s ease' }}
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
        <div style={{ marginTop: 44, paddingTop: 20, borderTop: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>© 2026 HarpiaHub. Todos os direitos reservados.</span>
          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Natal, RN — Brasil</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 500px) {
          footer > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)' }}>
      <Nav />
      <Hero />
      <AgentsSection />
      <SitesSection />
      <HowItWorks />
      <ContactSection />
      <Footer />
    </div>
  )
}
