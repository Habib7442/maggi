"use client";

import { motion } from "framer-motion";

export default function Marquee() {
  const words = ["HOT & SWEET", "IT'S DIFFERENT", "TASTE THE HEAT", "MAGGI SPECIAL", "SPICY KICK", "BOLDER FLAVOR"];
  
  return (
    <div className="w-full bg-brand-dark py-8 overflow-hidden border-y-4 border-brand-red">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            {words.map((word, j) => (
              <span key={j} className="text-brand-yellow text-7xl md:text-9xl font-black mx-8 flex items-center">
                {word}
                <span className="w-4 h-4 md:w-6 md:h-6 bg-brand-red rounded-full mx-8" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
