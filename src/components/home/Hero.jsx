import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShieldCheck,
  Truck,
  Star,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

import AnimatedHeroText from "../AnimatedHeroText";
import FloatingCard from "./FloatingCard";

const popular = [
  "Tomates",
  "Tissu Wax",
  "Karité",
  "Bissap",
  "Riz local",
];

const heroImages = [
  {
    src: "/hero-section1.jpg",
    alt: "Cliente commandant des produits frais",
  },
  {
    src: "/hero-section2.jpg",
    alt: "Commerçant local présentant ses produits",
  },
  {
    src: "/hero-section3.jpg",
    alt: "Livraison rapide de produits frais",
  },
];

export default function Hero() {
  const [q, setQ] = useState("");
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const go = (e) => {
    e.preventDefault();
    navigate(`/catalogue${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  return (
    <section className="relative w-full overflow-hidden bg-ink-900 text-white min-h-screen flex flex-col justify-between">
      
      {/* ================= CARROUSEL D'IMAGES DESKTOP UNIQ (Arrière-plan) ================= */}
      <div className="hidden lg:block absolute inset-0 -z-10 w-full h-full overflow-hidden">
        <div className="relative w-full h-full">
          {heroImages.map((img, index) => (
            <img
              key={index}
              src={img.src}
              alt={img.alt}
              className={`
                absolute inset-0
                h-full w-full
                object-cover
                object-center
                transition-opacity duration-1000
                ${index === current ? "opacity-100" : "opacity-0"}
              `}
            />
          ))}
        </div>
        {/* Overlay Desktop horizontal */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/70 to-transparent" />
      </div>

      {/* ================= CONTENU PRINCIPAL ================= */}
      <div className="container mx-auto px-4 pt-8 lg:pt-0 flex-grow flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        
        {/* BLOC TEXTE (Mobile & Desktop) */}
        <div className="max-w-2xl order-2 lg:order-1">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse-dot" />
            🌿 100% local — Parakou, Bénin
          </motion.span>

          {/* TITRE */}
          <h1 className="mt-6 mb-4 font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight">
            <AnimatedHeroText />
          </h1>

          {/* PARAGRAPHE */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-white/85"
          >
            BeniMarket connecte les commerçants de confiance près de chez vous à des milliers de clients — des produits locaux de qualité, livrés à domicile en toute sécurité.
          </motion.p>
        </div>

        {/* ================= VISUEL MOBILE ET DROITE DESKTOP ================= */}
        {/* C'est ici que la magie opère pour le responsive */}
        <div className="relative w-full lg:w-auto flex justify-center items-center order-1 lg:order-2">
          
          {/* CARROUSEL COMPACT MOBILE (Visible uniquement sur mobile/tablette) */}
          <div className="block lg:hidden relative w-full aspect-[4/3] max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {heroImages.map((img, index) => (
              <img
                key={index}
                src={img.src}
                alt={img.alt}
                className={`
                  absolute inset-0
                  h-full w-full
                  object-cover
                  object-center
                  transition-opacity duration-1000
                  ${index === current ? "opacity-100" : "opacity-0"}
                `}
              />
            ))}
            {/* Léger dégradé sombre en bas de l'image mobile pour le style */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* CARTES FLOTTANTES (Affichées uniquement sur Desktop) */}
          <div className="hidden lg:block relative w-[500px] h-[500px]">
            {/* Paiement */}
            <FloatingCard delay={0} className="pointer-events-none absolute right-10 top-12 w-52 rounded-2xl bg-white/95 p-3.5 shadow-2xl ring-1 ring-ink-900/5 backdrop-blur">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-700"><Smartphone size={20} /></span>
                <div className="leading-tight">
                  <p className="text-xs text-ink-400">Paiement</p>
                  <p className="text-sm font-bold text-ink-900">Mobile Money sécurisé</p>
                </div>
              </div>
            </FloatingCard>

            {/* Commande */}
            <FloatingCard delay={0.8} className="pointer-events-none absolute right-10 bottom-16 w-52 rounded-2xl bg-white/95 p-3.5 shadow-2xl ring-1 ring-ink-900/5 backdrop-blur">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={20} /></span>
                <div className="leading-tight">
                  <p className="text-xs text-ink-400">Commande confirmée</p>
                  <p className="text-sm font-bold text-ink-900">En route · 30 min</p>
                </div>
              </div>
            </FloatingCard>

            {/* Livraison */}
            <FloatingCard delay={1.5} className="absolute right-24 top-48 w-52 rounded-2xl bg-white/95 p-3.5 shadow-2xl ring-1 ring-black/5 backdrop-blur">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-50 text-green-600">⚡</span>
                <div className="leading-tight">
                  <p className="text-xs text-gray-500">Livraison express</p>
                  <p className="text-sm font-semibold text-orange-400">En route · 30 min</p>
                </div>
              </div>
            </FloatingCard>

            {/* Produits locaux */}
            <FloatingCard delay={2.2} className="flex absolute inset-y-0 left-4 items-center justify-center">
              <div className="w-52 rounded-2xl bg-white/95 p-3.5 shadow-2xl ring-1 ring-black/5 backdrop-blur">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-500">🥬</span>
                  <div className="leading-tight">
                    <p className="text-xs text-gray-500">Produits locaux</p>
                    <p className="text-sm font-semibold text-green-500">100% frais</p>
                  </div>
                </div>
              </div>
            </FloatingCard>
          </div>

        </div>
      </div>

      {/* ================= ZONE BASSE : RECHERCHE & BADGES ================= */}
      <div className="container mx-auto px-4 my-8 z-10">
        <form onSubmit={go} className="max-w-xl mx-auto lg:mx-0 animate-zoom-in delay-1000">
          <div className="flex flex-col sm:flex-row items-stretch gap-2 rounded-2xl border border-white/30 bg-white/95 p-2 shadow-2xl backdrop-blur">
            <div className="flex items-center flex-1">
              <Search size={20} className="ml-2 text-ink-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} className="min-h-[44px] flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400" placeholder="Que recherchez-vous aujourd’hui ?" />
            </div>
            <button type="submit" className="btn-accent shrink-0 px-4 py-2">Commander</button>
          </div>
          <div className="mt-3 flex flex-wrap justify-center lg:justify-start gap-2 text-sm">
            <span className="text-white/60">Populaire :</span>
            {popular.map((p) => (
              <button key={p} type="button" onClick={() => navigate(`/catalogue?q=${encodeURIComponent(p)}`)} className="rounded-full border border-white/25 bg-white/5 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur transition-colors hover:border-amber-400 hover:text-amber-300">
                {p}
              </button>
            ))}
          </div>
        </form>

        {/* BADGES SÉCURITÉ */}
        <div className="mt-8 mb-4 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-white/90">
          <span className="flex items-center gap-2"><ShieldCheck size={18} className="text-teal-300" />Vendeurs vérifiés</span>
          <span className="flex items-center gap-2"><Truck size={18} className="text-teal-300" />Livraison 24h</span>
          <span className="flex items-center gap-2"><Star size={18} className="fill-amber-400 text-amber-400" />4,8/5 (8 200 avis)</span>
        </div>
      </div>

    </section>
  );
}