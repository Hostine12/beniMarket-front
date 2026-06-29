// Formatage monétaire en Franc CFA (XOF) — devise de référence BeniMarket.
export function formatXOF(amount) {
  const value = Math.round(Number(amount) || 0)
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA'
}

export function formatDate(input) {
  const d = new Date(input)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(input) {
  const d = new Date(input)
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCompact(n) {
  return new Intl.NumberFormat('fr-FR', { notation: 'compact' }).format(n)
}

export function classNames(...parts) {
  return parts.filter(Boolean).join(' ')
}

// Construit une URL Unsplash optimisée (WebP, dimension contrôlée).
export function img(id, w = 800, h = 600) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`
}

// ── Validation des numéros de téléphone béninois (format 01XXXXXXXX) ──

/**
 * Valide qu'un numéro est au format béninois : exactement 10 chiffres commençant par 01.
 * Exemples valides : 0142162127, 0197000000
 */
export function validateBeninPhone(phone) {
  if (!phone) return false
  const cleaned = phone.replace(/\s+/g, '')
  return /^01\d{8}$/.test(cleaned)
}

/**
 * Filtre la saisie pour ne garder que les chiffres et limiter à 10 caractères.
 * Utilisé dans les onChange des champs téléphone.
 */
export function formatPhoneInput(value) {
  return value.replace(/\D/g, '').slice(0, 10)
}

/**
 * Message d'erreur pour un numéro invalide (utilisé pour l'affichage inline).
 * Retourne null si le champ est vide ou si le numéro est valide.
 */
export function getPhoneError(phone) {
  if (!phone) return null
  const cleaned = phone.replace(/\s+/g, '')
  if (cleaned.length === 0) return null
  if (!cleaned.startsWith('01')) return 'Le numéro doit commencer par 01'
  if (cleaned.length < 10) return 'Le numéro doit contenir 10 chiffres'
  if (cleaned.length === 10 && /^01\d{8}$/.test(cleaned)) return null
  return 'Format invalide (ex: 0142162127)'
}
