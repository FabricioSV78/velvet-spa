import { ArrowDownRight, ArrowRight } from 'lucide-react'
import ResponsiveImage from './ResponsiveImage.jsx'
import { Reveal } from './ui.jsx'
import { whatsappUrl } from '../data/business.js'

const heroSlides = [
  { src: '/images/velvet/spa.webp', className: 'immersive-hero__slide--spa' },
  { src: '/images/velvet/hero-hd.webp', className: 'immersive-hero__slide--salon' },
  { src: '/images/velvet/head-spa.webp', className: 'immersive-hero__slide--wellness' },
]

export default function ImmersiveHero() {
  return (
    <section id="inicio" className="immersive-hero" aria-labelledby="immersive-hero-heading">
      <div className="immersive-hero__slideshow" aria-hidden="true">
        {heroSlides.map((slide, index) => (
          <ResponsiveImage
            key={slide.src}
            src={slide.src}
            alt=""
            sizes="100vw"
            loading="eager"
            fetchPriority={index === 0 ? 'high' : 'low'}
            pictureClassName={`immersive-hero__slide ${slide.className}`}
          />
        ))}
      </div>
      <Reveal className="immersive-hero__content">
        <p className="immersive-hero__eyebrow">Salón &amp; spa · Trujillo</p>
        <h1 id="immersive-hero-heading">Eleva tu belleza.<br /><em>Disfruta tu momento.</em></h1>
        <p className="immersive-hero__intro">Belleza, cuidado y bienestar en un mismo lugar.</p>
        <div className="immersive-hero__actions">
          <a className="button button--primary" href={whatsappUrl()} target="_blank" rel="noreferrer">
            Reservar cita <ArrowRight aria-hidden="true" size={18} />
          </a>
          <a className="button immersive-hero__secondary" href="#servicios-rapidos">
            Ver servicios <ArrowDownRight aria-hidden="true" size={18} />
          </a>
        </div>
      </Reveal>
    </section>
  )
}
