import { useEffect, useRef } from 'react'
import { ArrowRight, ChevronDown, MessageCircle } from 'lucide-react'
import { Link, Navigate, NavLink, useParams } from 'react-router-dom'
import ResponsiveImage from '../components/ResponsiveImage.jsx'
import { Reveal, SectionLabel } from '../components/ui.jsx'
import { serviceWhatsappUrl } from '../data/business.js'
import { serviceCategories, serviceCategoryMap } from '../data/services.js'
import usePageMeta from '../hooks/usePageMeta.js'

export default function ServicesPage() {
  const { categoryId } = useParams()
  const categoryNavRef = useRef(null)
  const activeCategory = categoryId ? serviceCategoryMap[categoryId] : serviceCategories[0]

  useEffect(() => {
    categoryNavRef.current?.querySelector('a.active')?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [categoryId])

  usePageMeta(
    `${activeCategory?.label ?? 'Servicios'} | Velvet Salon & Spa`,
    `Servicios y precios de ${activeCategory?.label?.toLowerCase() ?? 'belleza y bienestar'} en Velvet Salon & Spa, Trujillo.`,
  )

  if (categoryId && !serviceCategoryMap[categoryId]) return <Navigate to="/servicios/cabello" replace />

  const activeIndex = serviceCategories.findIndex((category) => category.id === activeCategory.id)
  const nextCategory = serviceCategories[(activeIndex + 1) % serviceCategories.length]

  return (
    <>
      <section className="catalog catalog--standalone" aria-labelledby="catalog-category-heading">
        <nav className="catalog__nav" aria-label="Categorías de servicios">
          <p>Explora</p>
          <div ref={categoryNavRef}>
            {serviceCategories.map((category, index) => (
              <NavLink key={category.id} to={`/servicios/${category.id}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>{category.label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="catalog__content" key={activeCategory.id}>
          <div className="catalog__intro">
            <Reveal>
              <SectionLabel>Servicios · {activeCategory.eyebrow}</SectionLabel>
              <h1 id="catalog-category-heading">{activeCategory.label}</h1>
              <p>{activeCategory.description}</p>
            </Reveal>
            <Reveal className="catalog__image" delay={100}>
              <ResponsiveImage src={activeCategory.image} alt={`Experiencia de ${activeCategory.label} en Velvet`} sizes="(max-width: 767px) 88vw, 27vw" fetchPriority="high" />
            </Reveal>
          </div>

          <div className="catalog-service-list">
            <div className="catalog-service-list__head">
              <span>{activeCategory.services.length} servicios · selecciona uno para consultar</span>
              <span>Precio</span>
            </div>
            <div className="catalog-service-list__items">
              {activeCategory.services.map((service, index) => (
                <details className="catalog-service" key={service.name}>
                  <summary>
                    <span className="catalog-service__number">{String(index + 1).padStart(2, '0')}</span>
                    <div className="catalog-service__title">
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                    </div>
                    <strong>{service.price}</strong>
                    <span className="catalog-service__toggle" aria-hidden="true"><ChevronDown size={17} /></span>
                  </summary>
                  <div className="catalog-service__details">
                    <a href={serviceWhatsappUrl(service.name)} target="_blank" rel="noreferrer">
                      <MessageCircle aria-hidden="true" size={16} /> Consultar este servicio
                    </a>
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="catalog__footnote">
            <p>Los precios y condiciones se han transcrito del catálogo proporcionado. Confirma vigencia, evaluación y disponibilidad con Velvet antes de reservar.</p>
            <Link to={`/servicios/${nextCategory.id}`}>Siguiente: {nextCategory.label} <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

    </>
  )
}
