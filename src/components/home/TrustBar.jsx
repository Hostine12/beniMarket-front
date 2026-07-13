import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Store, PackageCheck, MapPin } from "lucide-react";

const stats = [
  {
    icon: Store,
    end: 100,
    suffix: "+",
    label: "Vendeurs vérifiés",
    tint: "from-teal-500 to-emerald-500",
  },
  {
    icon: PackageCheck,
    end: 320000,
    suffix: "+",
    label: "Commandes livrées",
    tint: "from-amber-500 to-orange-500",
  },
  {
    icon: MapPin,
    end: 5,
    suffix: "+",
    label: "Quartiers couverts",
    tint: "from-plum-600 to-violet-500",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-white py-8">
      <div className="max-shell container-px">
        <div className="grid gap-5 sm:grid-cols-3">
          {stats.map(({ icon: Icon, end, suffix, label, tint }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.25,
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              className="
                group
                rounded-3xl
                bg-gradient-to-br
                from-white
                to-slate-50
                p-7
                shadow-md
                ring-1
                ring-slate-200
                transition-all
                duration-500
                hover:shadow-xl
              "
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, -2, 2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.4,
                  }}
                  className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${tint} text-white shadow-lg`}
                >
                  <Icon size={24} />
                </motion.div>

                <div>
                  <motion.p
                    animate={{
                      scale: [1, 1.04, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    className="font-display text-3xl font-bold text-ink-900"
                  >
                    <CountUp
                      end={end}
                      duration={2.8}
                      separator=" "
                      enableScrollSpy
                      scrollSpyOnce
                    />
                    {suffix}
                  </motion.p>

                  <p className="mt-1 text-sm text-ink-500">
                    {label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}