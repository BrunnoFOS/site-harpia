import { useEffect, useRef, useState, useCallback } from 'react'

/* ═══════════════════════════════════════════
   SCROLL REVEAL HOOK
   ═══════════════════════════════════════════ */

export function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return ref
}

/* ═══════════════════════════════════════════
   ACTIVE SECTION HOOK (for nav highlighting)
   ═══════════════════════════════════════════ */

export function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' },
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sectionIds])

  return active
}

/* ═══════════════════════════════════════════
   SCROLL POSITION HOOK (for back-to-top)
   ═══════════════════════════════════════════ */

export function useScrollPosition(threshold = 400) {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const handler = () => setPast(window.scrollY > threshold)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])

  return past
}

/* ═══════════════════════════════════════════
   FOCUS TRAP HOOK (for mobile menu)
   ═══════════════════════════════════════════ */

export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const focusable = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    first?.focus()
    container.addEventListener('keydown', trap)
    return () => container.removeEventListener('keydown', trap)
  }, [active])

  return containerRef
}

/* ═══════════════════════════════════════════
   SANITIZE HELPER
   ═══════════════════════════════════════════ */

export function sanitize(str: string): string {
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'&]/g, '')
    .trim()
    .slice(0, 1000)
}

/* ═══════════════════════════════════════════
   EMAIL VALIDATION
   ═══════════════════════════════════════════ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email)
}
