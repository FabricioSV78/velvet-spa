import { ArrowDownRight, ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import ImmersiveHero from '../components/ImmersiveHero.jsx'
import LocationSection from '../components/LocationSection.jsx'
import ResponsiveImage from '../components/ResponsiveImage.jsx'
import ReviewsSection from '../components/ReviewsSection.jsx'
import { Reveal, SectionLabel, TextLink } from '../components/ui.jsx'
import { serviceWhatsappUrl, whatsappUrl } from '../data/business.js'
import { featuredPromotions } from '../data/promotions.js'
import usePageMeta from '../hooks/usePageMeta.js'

const experiences = [
  { id: 'cabello', number: '01', title: 'Cabello', copy: 'Corte, color y cuidado.', image: '/images/velvet/hair.webp', className: 'experience-tile--hair' },
  { id: 'spa', number: '02', title: 'Spa', copy: 'Masajes, pausa y bienestar.', image: '/images/velvet/spa.webp', className: 'experience-tile--spa' },
  { id: 'manicure', number: '03', title: 'Uñas', copy: 'Manicure, pedicure y sistemas.', image: '/images/velvet/nails.webp', className: 'experience-tile--nails' },
  { id: 'cejas', number: '04', title: 'Mirada', copy: 'Cejas y pestañas.', image: '/images/velvet/eyes.webp', className: 'experience-tile--eyes' },
  { id: 'faciales', number: '05', title: 'Faciales', copy: 'Limpieza y renovación.', image: '/images/velvet/facial.webp', className: 'experience-tile--facial' },
  { id: 'social', number: '06', title: 'Beauty social', copy: 'Maquillaje y peinado.', image: '/images/velvet/social.webp', className: 'experience-tile--social' },
]

const promotionImages = {
  Cabello: '/images/velvet/hair.webp',
  'Head Spa': '/images/velvet/head-spa.webp',
  Mirada: '/images/velvet/eyes.webp',
  Social: '/images/velvet/social.webp',
  Spa: '/images/velvet/spa.webp',
  Uñas: '/images/velvet/nails.webp',
}

export default function HomePage() {
  usePageMeta(
    'Velvet Salon & Spa | Salón y Spa en Trujillo',
    'Velvet Salon & Spa en Trujillo. Cabello, uñas, spa, faciales, pestañas, maquillaje y belleza en La Merced.',
  )

  return (
    <>
      <ImmersiveHero />

      <section id="hero-actual" className="hero" aria-labelledby="hero-heading">
        <div className="hero__copy">
          <Reveal className="hero__content">
            <p className="hero__eyebrow">Salón &amp; spa · Trujillo</p>
            <h1 id="hero-heading">Eleva tu belleza.<br /><em>Disfruta tu momento.</em></h1>
            <p className="hero__intro">Belleza, cuidado y bienestar en un mismo lugar. Elige tu experiencia y reserva de forma sencilla.</p>
            <div className="hero__actions">
              <a className="button button--primary" href={whatsappUrl()} target="_blank" rel="noreferrer">
                Reservar cita <ArrowRight aria-hidden="true" size={18} />
              </a>
              <a className="button button--quiet" href="#servicios-rapidos">
                Ver servicios <ArrowDownRight aria-hidden="true" size={18} />
              </a>
            </div>
          </Reveal>
          <div className="hero__location">
            <MapPin aria-hidden="true" size={16} strokeWidth={1.7} />
            <span>La Merced · Trujillo</span>
          </div>
        </div>
        <div className="hero__visual">
          <ResponsiveImage
            src="/images/velvet/hero-hd.webp"
            alt="Estilista trabajando cuidadosamente un cabello largo en el salón"
            sizes="(max-width: 767px) 100vw, (min-width: 2440px) 1122px, 47vw"
            loading="lazy"
          />
          <p className="hero__image-note"><span>01</span> Tu momento Velvet</p>
        </div>
      </section>

      <section id="servicios-rapidos" className="experiences" aria-labelledby="experiences-heading">
        <div className="section-heading section-heading--split">
          <Reveal>
            <SectionLabel>¿Qué estás buscando?</SectionLabel>
            <h2 id="experiences-heading">Tu experiencia,<br /><em>a tu manera.</em></h2>
          </Reveal>
          <Reveal delay={90}>
            <p>Explora por interés y llega directamente a los servicios que necesitas.</p>
          </Reveal>
        </div>
        <div className="experience-grid" aria-label="Accesos rápidos a servicios">
          {experiences.map((experience, index) => (
            <Reveal key={experience.id} className={`experience-tile ${experience.className}`} delay={(index % 3) * 55}>
              <Link className="experience-tile__link" to={`/servicios/${experience.id}`} aria-label={`Explorar ${experience.title}`}>
                <ResponsiveImage src={experience.image} alt="" sizes="(max-width: 767px) 100vw, 45vw" loading="lazy" />
                <span className="experience-tile__veil" />
                <span className="experience-tile__number">{experience.number}</span>
                <span className="experience-tile__content"><strong>{experience.title}</strong><span>{experience.copy}</span></span>
                <span className="experience-tile__arrow"><ArrowRight aria-hidden="true" size={18} /></span>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="swipe-hint">Desliza para explorar <span aria-hidden="true">→</span></p>
      </section>

      <section id="head-spa" className="head-spa" aria-labelledby="head-spa-heading">
        <Reveal className="head-spa__image">
          <ResponsiveImage
            src="/images/velvet/head-spa.webp"
            alt="Experiencia de cuidado capilar en una camilla Head Spa"
            sizes="(max-width: 767px) 100vw, 64vw"
            loading="lazy"
          />
          <span className="head-spa__image-label">Experiencia Head Spa · Velvet</span>
        </Reveal>
        <Reveal className="head-spa__copy" delay={100}>
          <span className="head-spa__index">01 / Diferencial Velvet</span>
          <SectionLabel inverse>Velvet Head Spa</SectionLabel>
          <h2 id="head-spa-heading">Cuidado para tu cabello.<br /><em>Pausa para ti.</em></h2>
          <p>Confort, tratamiento capilar y relajación en una experiencia diseñada para bajar el ritmo.</p>
          <Link className="text-link text-link--inverse" to="/servicios/head-spa"><span>Ver servicios Head Spa</span><ArrowRight aria-hidden="true" size={17} /></Link>
        </Reveal>
      </section>

      <section id="spa" className="spa-pause" aria-labelledby="spa-pause-heading">
        <Reveal className="spa-pause__copy">
          <SectionLabel>Una pausa dentro de Velvet</SectionLabel>
          <h2 id="spa-pause-heading">Respira.<br /><em>Elige tu momento.</em></h2>
          <p>Masajes, drenajes e hidromasaje para volver a tu ritmo con calma.</p>
          <div className="spa-pause__services" aria-label="Servicios de spa destacados">
            <span>Masaje relajante</span><span>Drenaje linfático</span><span>Spa Deluxe</span>
          </div>
          <Link className="text-link" to="/servicios/spa"><span>Explorar spa</span><ArrowRight size={17} /></Link>
        </Reveal>
        <Reveal className="spa-pause__visual" delay={100}>
          <ResponsiveImage src="/images/velvet/spa.webp" alt="Masaje relajante en un ambiente cálido" sizes="(max-width: 767px) 100vw, 52vw" loading="lazy" />
          <span aria-hidden="true">Pausa · calma · bienestar</span>
        </Reveal>
      </section>

      <section id="promociones-destacadas" className="home-promotions" aria-labelledby="home-promotions-heading">
        <div className="home-promotions__heading">
          <Reveal>
            <SectionLabel>Catálogo del mes</SectionLabel>
            <h2 id="home-promotions-heading">Tres formas de disfrutar<br /><em>un poco más.</em></h2>
          </Reveal>
          <Reveal delay={90}>
            <p>Una selección breve del catálogo vigente. Desliza en móvil o consulta todas las promociones.</p>
            <Link className="text-link" to="/promociones"><span>Ver todas</span><ArrowRight size={17} /></Link>
          </Reveal>
        </div>
        <div className="home-promo-grid">
          {featuredPromotions.slice(0, 3).map((promotion, index) => (
            <Reveal as="article" className="home-promo" key={promotion.id} delay={index * 55}>
              <ResponsiveImage src={promotionImages[promotion.category]} alt="" sizes="(max-width: 767px) 100vw, 32vw" loading="lazy" />
              <span className="home-promo__number">0{index + 1}</span>
              <div>
                <p>{promotion.category}</p>
                <h3>{promotion.name}</h3>
                <strong>{promotion.price}</strong>
                <span className="home-promo__description">{promotion.description}</span>
                <TextLink href={serviceWhatsappUrl(promotion.name)} target="_blank" rel="noreferrer">Consultar</TextLink>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="swipe-hint">Desliza para ver promociones <span aria-hidden="true">→</span></p>
      </section>

      <ReviewsSection />

      <LocationSection />

      <section className="final-cta" aria-labelledby="final-heading">
        <Reveal>
          <p>Cita en Velvet</p>
          <h2 id="final-heading">Reserva tu próxima<br /><em>cita.</em></h2>
          <a className="button button--cream" href={whatsappUrl()} target="_blank" rel="noreferrer">
            Reservar cita <ArrowRight aria-hidden="true" size={18} />
          </a>
        </Reveal>
      </section>
    </>
  )
}
