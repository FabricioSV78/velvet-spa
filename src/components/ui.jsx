import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

export function Reveal({ children, className = '', as: Tag = 'div', delay = 0, ...props }) {
  const elementRef = useRef(null)
  const [isVisible, setIsVisible] = useState(() => typeof window === 'undefined' || !('IntersectionObserver' in window))

  useEffect(() => {
    const element = elementRef.current
    if (!element || isVisible) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setIsVisible(true)
      observer.unobserve(element)
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

    observer.observe(element)
    return () => observer.disconnect()
  }, [isVisible])

  return (
    <Tag ref={elementRef} className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms` }} {...props}>
      {children}
    </Tag>
  )
}

export function SectionLabel({ children, inverse = false }) {
  return <p className={`section-label ${inverse ? 'section-label--inverse' : ''}`}>{children}</p>
}

export function TextLink({ children, href, inverse = false, ...props }) {
  return (
    <a className={`text-link ${inverse ? 'text-link--inverse' : ''}`} href={href} {...props}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={17} strokeWidth={1.7} />
    </a>
  )
}
