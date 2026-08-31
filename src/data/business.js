export const BUSINESS = {
  name: 'Velvet Salon & Spa',
  claim: 'Eleva tu belleza',
  address: 'Isabel de Bobadilla 174',
  district: 'Urb. La Merced',
  city: 'Trujillo, La Libertad',
  phones: ['946 992 673', '949 701 926'],
  whatsapp: '51946992673',
  instagram: 'velvetsalonspaoficial',
  rating: '4.3',
  reviewCount: '+100',
}

export const BUSINESS_HOURS = {
  status: 'pending-confirmation',
  label: 'Horarios por confirmar con Velvet',
  schedule: [],
}

export const DEFAULT_WHATSAPP_MESSAGE =
  'Hola Velvet, quisiera consultar disponibilidad para reservar un servicio.'

export function whatsappUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`
}

export function serviceWhatsappUrl(service) {
  return whatsappUrl(`Hola Velvet, quisiera consultar disponibilidad para ${service}.`)
}
