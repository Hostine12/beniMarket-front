import { API_BASE_URL } from '../../api/axios'

const roleStyles = {
  admin:   'from-plum-700 to-violet-600',
  vendor:  'from-amber-500 to-orange-500',
  courier: 'from-blue-600 to-cyan-500',
  client:  'from-teal-600 to-emerald-500',
}

const sizes = {
  sm:  { box: 'h-8 w-8',   text: 'text-sm',  ring: 'ring-2' },
  md:  { box: 'h-11 w-11', text: 'text-base', ring: 'ring-2' },
  lg:  { box: 'h-16 w-16', text: 'text-2xl',  ring: 'ring-4' },
  xl:  { box: 'h-20 w-20', text: 'text-3xl',  ring: 'ring-4' },
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// Résout une photo : data URL / URL absolue telles quelles, sinon chemin de stockage Laravel.
function resolveSrc(src) {
  if (!src) return null
  if (src.startsWith('data:') || src.startsWith('http')) return src
  return `${API_BASE_URL.replace(/\/api\/?$/, '')}/storage/${src.replace(/^\/?storage\//, '')}`
}

export default function Avatar({ name = '', role = 'client', size = 'md', rounded = 'rounded-xl', withRing = false, className = '', src = null }) {
  const gradient = roleStyles[role] || roleStyles.client
  const { box, text, ring } = sizes[size] || sizes.md
  const imgSrc = resolveSrc(src)

  return (
    <div
      className={`
        ${box} ${rounded} ${className}
        ${imgSrc ? '' : `bg-gradient-to-br ${gradient}`}
        overflow-hidden flex items-center justify-center shrink-0
        ${withRing ? `${ring} ring-white` : ''}
      `}
      aria-label={name}
    >
      {imgSrc ? (
        <img src={imgSrc} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className={`${text} font-bold text-white leading-none select-none`}>
          {getInitials(name)}
        </span>
      )}
    </div>
  )
}
