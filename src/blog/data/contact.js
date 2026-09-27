export const WHATSAPP_NUMBER = '919148627266'
export const PHONE_HREF = 'tel:+919148627266'

export function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
