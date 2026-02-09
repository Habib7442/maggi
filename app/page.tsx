"use client";

import SmoothScroll from "./components/SmoothScroll";
import BottleSequence from "./components/BottleSequence";
import Marquee from "./components/Marquee";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingCart, Menu, ArrowRight, Star } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <SmoothScroll>
      <main className="min-h-screen selection:bg-brand-red selection:text-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full p-6 md:p-10 flex justify-between items-center z-50 transition-all">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl md:text-3xl font-black tracking-tighter text-brand-light"
          >
            MAGGI.
          </motion.div>
          <div className="flex gap-4 md:gap-8 items-center text-brand-light/60 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em]">
            <button className="hidden sm:block hover:text-brand-red transition-colors">Our Story</button>
            <button className="hidden sm:block hover:text-brand-red transition-colors">Flavors</button>
            <button className="bg-brand-red text-white px-4 py-2 md:px-6 md:py-2 rounded-full hover:scale-110 transition-all text-[8px] md:text-[10px]">
              Order Now
            </button>
          </div>
        </nav>

        {/* Hero Section - CINEMATIC NIGHT MODE */}
        <section className="h-screen sexy-gradient flex flex-col items-center justify-center relative overflow-hidden">
          {/* Subtle Background Image */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/assets/hero_bg.jpeg" 
              alt="Hero Background" 
              fill 
              className="object-cover opacity-20 mix-blend-overlay"
              priority
            />
            <div className="grain-overlay opacity-30" />
          </div>

          {/* Subtle Red Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-red/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center pointer-events-none px-6 w-full">
            <motion.h1 
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-[16vw] md:text-[12vw] font-[950] text-white leading-[0.85] md:leading-none tracking-tighter text-center"
            >
              IT&apos;S <br className="block md:hidden" />
              <span className="text-brand-red sauce-glow">DIFFERENT</span>
            </motion.h1>
            {/* <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-[6vw] md:text-[4vw] text-brand-yellow font-black italic mt-4 uppercase tracking-widest text-center"
            >
              Maggi Hot & Sweet
            </motion.h2> */}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-6 left-6 md:bottom-10 md:left-10 max-w-[150px] md:max-w-xs z-20"
          >
            <p className="text-brand-light/40 font-black uppercase tracking-[0.2em] text-[7px] md:text-[8px] mb-4">
              Bold flavors from the kitchens of India.
            </p>
            <div className="w-8 md:w-12 h-[1px] bg-brand-red" />
          </motion.div>

          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex flex-col items-end gap-2 text-brand-light/20 font-black text-[8px] md:text-[10px] uppercase tracking-widest">
            <span>Scroll</span>
            <div className="w-[1px] h-12 md:h-20 bg-gradient-to-b from-brand-red to-transparent" />
          </div>
        </section>

        {/* The Main Animation Sequence */}
        <BottleSequence />

        {/* Marquee Intermission */}
        <Marquee />

        {/* Tradition & Creation Section */}
        <section className="bg-[#f0c05a] py-32 px-6 md:px-20 text-brand-dark overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-6xl md:text-8xl mb-2">TRADITION</h2>
            <h2 className="text-6xl md:text-8xl mb-12 opacity-30">& CREATION</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="aspect-square bg-brand-dark rounded-xl relative overflow-hidden group shadow-2xl"
              >
                <Image 
                  src="/assets/tradition_and_creation/family_recepies.png" 
                  alt="Family Recipes" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="text-brand-yellow font-bold uppercase tracking-widest text-xs border border-brand-yellow px-2 py-1 rounded">Traditional</span>
                  <h3 className="text-white text-2xl mt-2 font-black">Family Recipes</h3>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="aspect-square bg-brand-red rounded-xl relative overflow-hidden group shadow-2xl mt-12 md:mt-24"
              >
                <Image 
                  src="/assets/tradition_and_creation/modern_twist.png" 
                  alt="Modern Twist" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="text-brand-yellow font-bold uppercase tracking-widest text-xs border border-brand-yellow px-2 py-1 rounded">Innovation</span>
                  <h3 className="text-white text-2xl mt-2 font-black">Modern Twist</h3>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="aspect-square bg-brand-dark rounded-xl relative overflow-hidden group shadow-2xl mt-6 md:mt-12"
              >
                <Image 
                  src="/assets/tradition_and_creation/spicy_fusion.png" 
                  alt="Spicy Fusion" 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                <div className="absolute bottom-6 left-6 z-20">
                  <span className="text-brand-yellow font-bold uppercase tracking-widest text-xs border border-brand-yellow px-2 py-1 rounded">Global</span>
                  <h3 className="text-white text-2xl mt-2 font-black">Spicy Fusion</h3>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why the Jar Matters Section - Cinematic Night Mode */}
        <section className="sexy-gradient py-32 px-6 md:px-20 text-center relative overflow-hidden">
          <div className="grain-overlay opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-red/5 blur-[150px] pointer-events-none" />
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-6xl md:text-[8vw] text-white mb-24 relative z-10 leading-[0.85] tracking-tighter"
          >
            WHY THE<br/><span className="text-brand-red sauce-glow italic">JAR</span> MATTERS
          </motion.h2> 

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative z-10">
            {[
              { 
                num: "01", 
                title: "Locked Freshness", 
                text: "Our glass jars preserve the aromatic spices and fire-roasted intensity longer than any plastic.",
                color: "brand-red"
              },
              { 
                num: "02", 
                title: "100% Recyclable", 
                text: "Taste good, do good. Our packaging is designed with the planet in mind, being fully circular.",
                color: "brand-yellow"
              },
              { 
                num: "03", 
                title: "Iconic Design", 
                text: "A masterpiece for your kitchen. The Maggi Jar is a symbol of premium flavor and class.",
                color: "brand-red"
              }
            ].map((box, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="group"
              >
                <div className={`text-${box.color} mb-8 mx-auto w-20 h-20 border border-${box.color}/30 rounded-full flex items-center justify-center font-black text-2xl italic group-hover:bg-${box.color} group-hover:text-black transition-all duration-500`}>
                  {box.num}
                </div>
                <h3 className="text-white text-3xl font-[950] mb-6 uppercase tracking-tighter">{box.title}</h3>
                <p className="text-white/40 leading-relaxed font-medium">{box.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Let's Get Cooking Section */}
        <section className="bg-brand-yellow py-32 px-6 md:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
              <h2 className="text-6xl md:text-8xl text-brand-dark">LET&apos;S GET<br/>COOKING</h2>
              <button className="hidden md:block bg-brand-red text-white py-4 px-10 rounded-full font-bold uppercase tracking-widest text-sm mb-4">View All Recipes</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Spicy Pakora Dip", 
                  tag: "Snack", 
                  image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800"
                },
                { 
                  title: "Tikka Masala Marinade", 
                  tag: "Main", 
                  image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800"
                },
                { 
                  title: "Hot & Sweet Glaze", 
                  tag: "Fusion", 
                  image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800"
                }
              ].map((recipe, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="h-96 bg-brand-dark rounded-3xl mb-6 relative overflow-hidden group">
                    <motion.img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-brand-dark/40 group-hover:bg-brand-red/20 transition-all duration-500" />
                    <span className="absolute top-6 left-6 bg-brand-yellow text-brand-dark px-4 py-1 rounded-full text-xs font-[950] uppercase z-20 shadow-xl">
                      {recipe.tag}
                    </span>
                    <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-brand-yellow/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20">
                      <ArrowRight size={20} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-[950] text-brand-dark uppercase group-hover:text-brand-red transition-colors tracking-tighter">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-brand-dark/40 uppercase text-[10px] font-black tracking-widest">
                    <span>15 Mins</span>
                    <div className="w-1 h-1 rounded-full bg-brand-red" />
                    <span>Easy</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Grid - Editorial Style */}
        <section className="bg-white py-40 px-6 md:px-20 relative overflow-hidden">
          <div className="grain-overlay opacity-5" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 text-[15vw] font-black text-brand-dark/5 pointer-events-none select-none">PURE</div>
              <h2 className="text-7xl md:text-[8vw] font-[950] text-brand-dark leading-[0.8] tracking-tighter mb-12 uppercase">
                Real <span className="text-brand-red">Spicy</span><br/>
                <span className="text-outline !text-brand-dark/20">Real</span> Sweet
              </h2>
              <p className="text-xl text-brand-dark/60 max-w-lg mb-12 leading-relaxed font-medium">
                Crafted with fire-roasted chilies and premium sun-ripened tomatoes. It&apos;s the iconic taste you love, with a bold new perspective and zero compromises on quality.
              </p>
              <button className="bg-brand-red text-white py-6 px-12 text-xl font-[950] rounded-full flex items-center gap-4 hover:bg-brand-dark transition-all duration-500 group shadow-2xl shadow-brand-red/20 uppercase tracking-tighter">
                Explore Ingredients
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {[
                { name: "Fire-Roasted", sub: "Chilies", icon: "🌶️", color: "brand-dark", text: "white", img: "/assets/real_spicy_real_sweet/fire_roasted_chillies.png" },
                { name: "Sun-Ripened", sub: "Tomatoes", icon: "🍅", color: "brand-yellow", text: "brand-dark", img: "/assets/real_spicy_real_sweet/sun_rippened_tomatoes.png" },
                { name: "Secret", sub: "Spice Mix", icon: "✨", color: "brand-yellow", text: "brand-dark", img: "/assets/real_spicy_real_sweet/secret_spice_mix.png" },
                { name: "Natural", sub: "Sweetness", icon: "🍯", color: "brand-red", text: "white", img: "/assets/real_spicy_real_sweet/natural_sweetness.png" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -15, rotate: i % 2 === 0 ? -2 : 2 }}
                  className={`h-80 md:h-72 rounded-2xl bg-${item.color} p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group border border-white/10`}
                >
                  <Image 
                    src={item.img} 
                    alt={item.name}
                    fill
                    className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.color === 'brand-dark' ? 'from-black/80' : item.color === 'brand-red' ? 'from-black/60' : 'from-brand-yellow/80'} to-transparent z-10`} />
                  
                   {/* Card Numbering */}
                  <span className={`absolute top-4 right-4 md:top-6 md:right-6 text-[30px] md:text-[40px] font-black opacity-20 text-${item.text} z-20`}>0{i+1}</span>
                  
                  <div className="text-3xl md:text-4xl group-hover:scale-125 transition-transform duration-500 origin-left relative z-20">{item.icon}</div>
                  
                  <div className={`font-[950] text-3xl md:text-2xl uppercase leading-none tracking-tighter text-${item.text} relative z-20`}>
                    {item.name}<br/>
                    <span className={item.color === 'brand-red' ? 'text-white/60' : item.color === 'brand-dark' ? 'text-brand-red' : 'text-brand-red'}>
                      {item.sub}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="h-[70vh] bg-brand-red flex items-center justify-center relative overflow-hidden">
          <div className="text-center z-10">
            <h2 className="text-[10vw] text-white leading-none mb-10">Get Yours<br/>Today</h2>
            <button className="bg-brand-yellow text-brand-red py-6 px-16 text-2xl font-black rounded-full hover:scale-110 transition-transform">
              Find In Store
            </button>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             {/* Large background pattern could go here */}
          </div>
        </section>

        <footer className="bg-brand-dark text-white/50 py-10 px-6 md:px-20 flex flex-col md:flex-row justify-between items-center text-sm uppercase tracking-widest font-bold">
          <div>© 2026 Maggi Hot & Sweet. All Rights Reserved.</div>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-brand-yellow transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-yellow transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-yellow transition-colors">Instagram</a>
          </div>
        </footer>
      </main>
    </SmoothScroll>
  );
}
