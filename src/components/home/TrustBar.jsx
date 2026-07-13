import { motion } from "framer-motion";
import { Store, PackageCheck, MapPin } from "lucide-react";

const stats = [
  {
    icon: Store,
    value: "100+",
    label: "Vendeurs vérifiés",
    tint: "from-teal-500 to-emerald-500",
  },
  {
    icon: PackageCheck,
    value: "320 000+",
    label: "Commandes livrées",
    tint: "from-amber-500 to-orange-500",
  },
  {
    icon: MapPin,
    value: "5+",
    label: "Quartiers couverts",
    tint: "from-plum-600 to-violet-500",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-white py-4">
      <div className="max-shell container-px">

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

          {stats.map(({ icon: Icon, value, label, tint }, index) => (

            <motion.div
              key={label}

              initial={{
                opacity: 0,
                y: 40,
              }}

              whileInView={{
                opacity: 1,
                y: 0,
              }}

              viewport={{
                once: true,
                amount: 0.3,
              }}

              transition={{
                duration: 0.6,
                delay: index * 0.25,
              }}

              whileHover={{
                y: -8,
                scale: 1.03,
              }}

              className="
                group
                flex
                items-center
                gap-4

                rounded-3xl

                bg-gradient-to-br
                from-white
                to-slate-50

                p-7

                shadow-md

                transition-all
                duration-500

                hover:shadow-xl

                ring-1
                ring-ink-900/5
              "
            >

              <motion.span

                animate={{
                  y: [0, -5, 0],
                  rotate: [0, -2, 2, 0],
                }}

                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.6,
                }}

                className={`
                  grid
                  h-14
                  w-14
                  shrink-0
                  place-items-center

                  rounded-2xl

                  bg-gradient-to-br
                  ${tint}

                  text-white

                  shadow-lg
                `}
              >

                <Icon size={24} />

              </motion.span>

              <div>

                <motion.p

                  animate={{
                    scale: [1, 1.05, 1],
                  }}

                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.4,
                  }}

                  className="
                    font-display
                    text-3xl
                    font-bold
                    text-ink-900
                  "
                >

                  {value}

                </motion.p>

                <p className="mt-1 text-sm text-ink-500">

                  {label}

                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </div>
    </section>
  );
}