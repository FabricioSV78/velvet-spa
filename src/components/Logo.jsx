export default function Logo({ light = false }) {
  return (
    <span className={`brand-logo ${light ? 'brand-logo--light' : ''}`} aria-label="Velvet Salon & Spa">
      <img src="/images/velvet/catalog/logo.webp" alt="" />
    </span>
  )
}
