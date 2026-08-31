import { ArrowRight } from 'lucide-react'

export function Reveal({ children, className = '', as: Tag = 'div', delay = 0, ...props }) {
  return (
    <Tag className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }} {...props}>
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
