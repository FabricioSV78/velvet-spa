import { ExternalLink, Quote } from 'lucide-react'
import { BUSINESS } from '../data/business.js'
import { publicReviews } from '../data/reviews.js'
import { Reveal, SectionLabel } from './ui.jsx'

export default function ReviewsSection() {
  return (
    <section className="reviews-showcase" aria-labelledby="reviews-heading">
      <div className="reviews-showcase__heading">
        <Reveal>
          <SectionLabel>Opiniones de clientes</SectionLabel>
          <h2 id="reviews-heading">Opiniones de nuestros clientes.</h2>
        </Reveal>
        <Reveal className="reviews-showcase__score" delay={80}>
          <div className="reviews-showcase__score-value" aria-label={`${BUSINESS.rating} de 5`}>
            <strong>{BUSINESS.rating}</strong><span>de 5</span>
          </div>
          <div className="reviews-showcase__score-meta">
            <span className="reviews-showcase__stars" aria-hidden="true">★★★★☆</span>
            <p><strong>{BUSINESS.reviewCount} opiniones</strong><br />Valoración pública aproximada</p>
          </div>
        </Reveal>
      </div>

      <div className="reviews-showcase__grid">
        {publicReviews.map((review) => (
          <article className="public-review" key={review.id}>
            <Quote className="public-review__quote" aria-hidden="true" size={22} strokeWidth={1.6} />
            <blockquote><p>{review.message}</p></blockquote>
            <footer>
              <div><strong>{review.author}</strong><span>Cliente de Velvet</span></div>
              <a href={review.sourceUrl} target="_blank" rel="noreferrer">{review.source}<ExternalLink aria-hidden="true" size={13} /></a>
            </footer>
          </article>
        ))}
      </div>
      <p className="reviews-showcase__note">Opiniones publicadas en directorios públicos y presentadas sin alterar su sentido.</p>
    </section>
  )
}
