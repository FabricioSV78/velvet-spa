import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Camera, Menu, MessageCircle, X } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { BUSINESS, whatsappUrl } from '../data/business.js'
import Logo from './Logo.jsx'

const navigation = [
  ['Inicio', '/'],
  ['Servicios', '/servicios'],
  ['Experiencias', '/#servicios-rapidos'],
  ['Promociones', '/promociones'],
  ['Nosotros', '/velvet'],
]

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }))
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash])

  return null
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeNav, setActiveNav] = useState('Inicio')
  const menuButtonRef = useRef(null)
  const closeButtonRef = useRef(null)
  const currentRoute = useLocation()
  const currentPathname = currentRoute.pathname

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const pathname = currentPathname

    if (pathname === '/') {
      const syncHomeSection = () => {
        const experiences = document.querySelector('#servicios-rapidos')
        const marker = window.scrollY + Math.min(window.innerHeight * 0.3, 260)
        setActiveNav(experiences && marker >= experiences.offsetTop ? 'Experiencias' : 'Inicio')
      }
      syncHomeSection()
      window.addEventListener('scroll', syncHomeSection, { passive: true })
      return () => window.removeEventListener('scroll', syncHomeSection)
    }

    if (pathname === '/velvet') {
      const syncVelvetSection = () => {
        const location = document.querySelector('#ubicacion')
        const marker = window.scrollY + Math.min(window.innerHeight * 0.3, 260)
        setActiveNav(location && marker >= location.offsetTop ? 'Ubicación' : 'Nosotros')
      }
      syncVelvetSection()
      window.addEventListener('scroll', syncVelvetSection, { passive: true })
      return () => window.removeEventListener('scroll', syncVelvetSection)
    }

    return undefined
  }, [currentPathname])

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', menuOpen)
    if (menuOpen) requestAnimationFrame(() => closeButtonRef.current?.focus())
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        requestAnimationFrame(() => menuButtonRef.current?.focus())
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.classList.remove('menu-is-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const routeActiveNav = currentPathname.startsWith('/servicios') ? 'Servicios' : 'Promociones'
  const visibleActiveNav = currentPathname === '/' || currentPathname === '/velvet' ? activeNav : routeActiveNav
  const navState = (label) => ({
    className: visibleActiveNav === label ? 'active' : undefined,
    'aria-current': visibleActiveNav === label ? 'page' : undefined,
  })

  return (
    <>
      <ScrollManager key={`${currentRoute.pathname}${currentRoute.hash}`} />
      <header className={`site-header ${currentPathname === '/' ? 'site-header--home' : ''} ${scrolled ? 'site-header--scrolled' : ''}`}>
        <div className="site-header__inner">
          <Link className="site-header__logo" to="/" aria-label="Velvet Salon & Spa, ir al inicio"><Logo /></Link>
          <nav className="desktop-nav" aria-label="Navegación principal">
            {navigation.map(([label, path]) => <Link key={path} to={path} {...navState(label)}>{label}</Link>)}
            <Link to="/velvet#ubicacion" {...navState('Ubicación')}>Ubicación</Link>
          </nav>
          <div className="site-header__actions">
            <a className="header-book" href={whatsappUrl()} target="_blank" rel="noreferrer">Reservar cita</a>
            <button
              ref={menuButtonRef}
              className="menu-button"
              type="button"
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(true)}
            >
              <Menu aria-hidden="true" size={22} />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-navigation" className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`} role="dialog" aria-modal="true" aria-label="Menú principal" aria-hidden={!menuOpen}>
        <div className="mobile-menu__top">
          <Logo light />
          <button ref={closeButtonRef} type="button" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}><X aria-hidden="true" /></button>
        </div>
        <nav aria-label="Navegación móvil">
          {navigation.map(([label, path], index) => (
            <Link key={path} to={path} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)} {...navState(label)}>
              <span>0{index + 1}</span>{label}
            </Link>
          ))}
          <Link to="/velvet#ubicacion" tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)} {...navState('Ubicación')}><span>06</span>Ubicación</Link>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}><span>07</span>Contacto</a>
        </nav>
        <div className="mobile-menu__footer">
          <p>{BUSINESS.address}<br />{BUSINESS.district} · Trujillo</p>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer" tabIndex={menuOpen ? 0 : -1}>
            Reservar por WhatsApp <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
      </div>

      <main id="contenido"><Outlet /></main>

      <footer className="footer">
        <div className="footer__brand">
          <Logo />
          <p>Belleza, cuidado y bienestar<br />en un mismo lugar.</p>
        </div>
        <div className="footer__links">
          <p>Explora</p>
          {navigation.slice(1).map(([label, path]) => <Link key={path} to={path}>{label}</Link>)}
          <Link to="/velvet#ubicacion">Ubicación</Link>
        </div>
        <div className="footer__contact">
          <p>Conversemos</p>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer">WhatsApp · {BUSINESS.phones[0]}</a>
          <a href={`https://www.instagram.com/${BUSINESS.instagram}/`} target="_blank" rel="noreferrer">
            <Camera aria-hidden="true" size={16} /> @{BUSINESS.instagram}
          </a>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} Velvet Salon &amp; Spa</span>
          <span>Precios y promociones sujetos a confirmación</span>
        </div>
      </footer>

      <a className="whatsapp-float" href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Reservar una cita por WhatsApp">
        <MessageCircle aria-hidden="true" size={20} /><span>Reservar</span>
      </a>
    </>
  )
}
