import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import LocationSection from '../components/LocationSection.jsx'
import ResponsiveImage from '../components/ResponsiveImage.jsx'
import { Reveal, SectionLabel } from '../components/ui.jsx'
import { whatsappUrl } from '../data/business.js'
import usePageMeta from '../hooks/usePageMeta.js'

export default function VelvetPage() {
  usePageMeta(
    'Velvet | Salón y Spa en La Merced, Trujillo',
    'Conoce Velvet Salon & Spa y encuéntranos en Isabel de Bobadilla 174, Urb. La Merced, Trujillo.',
  )

  return (
    <>
      <section className="about-simple about--standalone" aria-labelledby="about-heading">
        <div className="about-simple__content">
          <Reveal className="about-simple__copy">
            <SectionLabel>Sobre Velvet</SectionLabel>
            <h1 id="about-heading">Velvet Salon &amp; Spa.</h1>
            <p>Belleza y bienestar en La Merced, Trujillo. Reunimos servicios de cuidado personal en un mismo lugar.</p>
            <p>Puedes encontrar opciones para cabello, uñas, mirada, faciales, spa y beauty social, consultar sus detalles y elegir lo que necesitas antes de reservar.</p>
            <Link className="button button--primary" to="/servicios">Conocer servicios <ArrowRight aria-hidden="true" size={18} /></Link>
          </Reveal>
          <Reveal className="about-simple__visual" delay={90}>
            <ResponsiveImage src="/images/velvet/social.webp" alt="Preparación de un peinado en Velvet Salon & Spa" sizes="(max-width: 767px) 100vw, 48vw" fetchPriority="high" />
          </Reveal>
        </div>
      </section>

      <LocationSection />

      <section className="final-cta" aria-labelledby="velvet-final-heading">
        <Reveal>
          <p>Cita en Velvet</p>
          <h2 id="velvet-final-heading">Reserva tu próxima<br /><em>cita.</em></h2>
          <a className="button button--cream" href={whatsappUrl()} target="_blank" rel="noreferrer">Reservar por WhatsApp <ArrowRight size={18} /></a>
        </Reveal>
      </section>
    </>
  )
}
