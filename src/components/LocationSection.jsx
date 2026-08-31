import { ArrowRight, Clock3, MapPin, Phone } from 'lucide-react'
import { BUSINESS, BUSINESS_HOURS } from '../data/business.js'
import { Reveal, SectionLabel } from './ui.jsx'

export default function LocationSection() {
  return (
    <section id="ubicacion" className="location" aria-labelledby="location-heading">
      <div className="location__info">
        <Reveal>
          <SectionLabel>Visítanos</SectionLabel>
          <h2 id="location-heading">Encuéntranos<br /><em>en La Merced.</em></h2>
        </Reveal>
        <div className="location__details">
          <div><MapPin aria-hidden="true" size={19} strokeWidth={1.7} /><p>{BUSINESS.address}<br />{BUSINESS.district}<br />{BUSINESS.city}</p></div>
          <div><Phone aria-hidden="true" size={19} strokeWidth={1.7} /><p>{BUSINESS.phones.map((phone) => <a key={phone} href={`tel:+51${phone.replaceAll(' ', '')}`}>{phone}</a>)}</p></div>
          <div><Clock3 aria-hidden="true" size={19} strokeWidth={1.7} /><p>{BUSINESS_HOURS.label}</p></div>
        </div>
        <a className="button button--primary" href="https://www.google.com/maps/search/?api=1&query=Isabel+de+Bobadilla+174+La+Merced+Trujillo+Peru" target="_blank" rel="noreferrer">
          Cómo llegar <ArrowRight aria-hidden="true" size={18} />
        </a>
      </div>
      <div className="location__map">
        <iframe title="Mapa interactivo de Velvet Salon & Spa en La Merced, Trujillo" src="https://www.google.com/maps?q=Isabel%20de%20Bobadilla%20174%2C%20La%20Merced%2C%20Trujillo%2C%20Peru&z=17&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        <span>La Merced · Trujillo</span>
      </div>
    </section>
  )
}
