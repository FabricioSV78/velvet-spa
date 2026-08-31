import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import ResponsiveImage from '../components/ResponsiveImage.jsx'
import { Reveal, SectionLabel } from '../components/ui.jsx'
import { serviceWhatsappUrl } from '../data/business.js'
import { promotionCategories, promotions } from '../data/promotions.js'
import usePageMeta from '../hooks/usePageMeta.js'

const promotionImages = {
  Cabello: '/images/velvet/hair.webp',
  'Head Spa': '/images/velvet/head-spa.webp',
  Mirada: '/images/velvet/eyes.webp',
  Social: '/images/velvet/social.webp',
  Spa: '/images/velvet/spa.webp',
  Uñas: '/images/velvet/nails.webp',
}

export default function PromotionsPage() {
  const trackRef = useRef(null)
  const filterRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedCategory = searchParams.get('categoria')
  const activeCategory = promotionCategories.includes(requestedCategory) ? requestedCategory : 'Todas'
  const visiblePromotions = activeCategory === 'Todas'
    ? promotions
    : promotions.filter((promotion) => promotion.category === activeCategory)

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0, behavior: 'instant' })
    const activeButton = filterRef.current?.querySelector('[aria-pressed="true"]')
    if (activeButton && filterRef.current) {
      const left = activeButton.offsetLeft - (filterRef.current.clientWidth - activeButton.clientWidth) / 2
      filterRef.current.scrollTo({ left: Math.max(0, left), behavior: 'instant' })
    }
  }, [activeCategory])

  usePageMeta(
    'Promociones | Velvet Salon & Spa',
    'Promociones y paquetes vigentes de Velvet Salon & Spa: cabello, uñas, spa, mirada y beauty social en Trujillo.',
  )

  const selectCategory = (category) => {
    if (category === 'Todas') setSearchParams({})
    else setSearchParams({ categoria: category })
  }

  const moveTrack = (direction) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.92, behavior: 'smooth' })
  }

  return (
    <>
      <section className="promotion-catalog promotion-catalog--standalone" aria-labelledby="promotion-catalog-heading">
        <div className="promotion-catalog__heading">
          <Reveal>
            <SectionLabel>Promociones</SectionLabel>
            <h1 id="promotion-catalog-heading">Elige tu próxima<br /><em>experiencia.</em></h1>
          </Reveal>
          <Reveal delay={100}>
            <p>La vigencia y disponibilidad pueden cambiar. Confirma siempre antes de reservar.</p>
          </Reveal>
        </div>

        <div className="promotion-catalog__toolbar">
          <div ref={filterRef} className="promotion-filters" aria-label="Filtrar promociones">
            {promotionCategories.map((category) => (
              <button key={category} type="button" aria-pressed={activeCategory === category} onClick={() => selectCategory(category)}>
                {category}
              </button>
            ))}
          </div>
          <div className="promotion-controls" aria-label="Controles del carrusel">
            <span>{visiblePromotions.length} promociones</span>
            <button type="button" onClick={() => moveTrack(-1)} aria-label="Ver promociones anteriores"><ArrowLeft size={17} /></button>
            <button type="button" onClick={() => moveTrack(1)} aria-label="Ver promociones siguientes"><ArrowRight size={17} /></button>
          </div>
        </div>

        <div className="promotion-catalog__grid promotion-catalog__track" ref={trackRef} key={activeCategory}>
          {visiblePromotions.map((promotion, index) => (
            <Reveal as="article" className="catalog-promo" key={promotion.id} delay={(index % 3) * 45}>
              <div className="catalog-promo__image">
                <ResponsiveImage src={promotionImages[promotion.category]} alt="" sizes="(max-width: 767px) 100vw, 31vw" loading="lazy" />
                <span>{promotion.category}</span>
              </div>
              <div className="catalog-promo__body">
                <p>{promotion.validity}</p>
                <h3>{promotion.name}</h3>
                <span>{promotion.description}</span>
                <div><strong>{promotion.price}</strong><a href={serviceWhatsappUrl(promotion.name)} target="_blank" rel="noreferrer" aria-label={`Consultar ${promotion.name}`}><span>Consultar</span><ArrowRight size={18} /></a></div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="swipe-hint">Desliza para descubrir más <span aria-hidden="true">→</span></p>
      </section>

    </>
  )
}
