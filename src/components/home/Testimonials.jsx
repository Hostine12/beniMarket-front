import { Quote } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import Rating from '../ui/Rating'
import { testimonials } from '../../data/orders'

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-ink-50 py-16 lg:py-24">
      {/* Halos décoratifs */}
      <div className="absolute -left-24 top-10 -z-0 h-72 w-72 rounded-full bg-plum-200/40 blur-3xl" />
      <div className="absolute -right-24 bottom-10 -z-0 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative max-shell container-px">
        <div className="mx-auto max-w-2xl text-center">
          <span className="badge-soft bg-plum-100 text-plum-700">
            <span className="h-1.5 w-1.5 rounded-full bg-plum-500" />
            Ils nous font confiance
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink-900 text-balance sm:text-4xl">
            Clients, vendeurs et livreurs en parlent
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white bg-white/90 p-6 shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-soft">
                <Quote size={20} className="fill-white" />
              </span>
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-700">
                “{t.text}”
              </blockquote>
              <Rating value={t.rating} showValue={false} className="mt-4" />
              <figcaption className="mt-4 flex items-center gap-3 border-t border-ink-100 pt-4">
                <SmartImage id={t.avatar} alt={t.name} w={96} h={96} rounded="rounded-full" className="h-11 w-11 ring-2 ring-white shadow-soft" />
                <div>
                  <p className="text-sm font-bold text-ink-900">{t.name}</p>
                  <p className="text-xs text-ink-400">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
