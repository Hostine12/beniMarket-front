import { Store, PackageCheck, MapPin } from 'lucide-react'

const stats = [
  { icon: Store,        value: '100+',     label: 'Vendeurs vérifiés',  tint: 'from-teal-500 to-emerald-500' },
  { icon: PackageCheck, value: '320 000+', label: 'Commandes livrées',  tint: 'from-amber-500 to-orange-500' },
  { icon: MapPin,       value: '5+',       label: 'Quartiers couverts', tint: 'from-plum-600 to-violet-500'  },
]

export default function TrustBar() {
  return (
    <section className="bg-white">
      <div className="max-shell container-px py-8 lg:py-10">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-ink-100 shadow-card ring-1 ring-ink-900/5 sm:grid-cols-3">
          {stats.map(({ icon: Icon, value, label, tint }) => (
            <div
              key={label}
              className="group flex items-center justify-center gap-4 bg-white px-6 py-7 transition-colors hover:bg-ink-50/60 sm:justify-start"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tint} text-white shadow-soft transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={22} />
              </span>
              <div>
                <p className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">{value}</p>
                <p className="text-sm text-ink-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
