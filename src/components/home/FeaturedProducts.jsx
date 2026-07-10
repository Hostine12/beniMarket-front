import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import ProductCard from '../product/ProductCard'
import api from '../../api/axios'

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    api.get('/products?per_page=8')
      .then(r => setFeatured((r.data.data || r.data).slice(0, 8)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden bg-white py-16 lg:py-20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />
      <div className="relative max-shell container-px">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="badge-soft bg-amber-100 text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Sélection du moment
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
              Produits mis en avant
            </h2>
            <p className="mt-2 text-ink-500">Les coups de cœur de nos clients cette semaine.</p>
          </div>
          <Link
            to="/catalogue"
            className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-teal-700 transition-all hover:gap-2.5 sm:inline-flex"
          >
            Voir le catalogue <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {loading
            ? [...Array(8)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-ink-100 animate-pulse" />
              ))
            : featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/catalogue" className="btn-outline">
            Voir tout le catalogue <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
