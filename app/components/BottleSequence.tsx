"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";

const FRAME_COUNT = 120;
const IMAGES_FOLDER = "/assets/output_hq/";

export default function BottleSequence({ 
  heroMode = false, 
  startFrame = 0 
}: { 
  heroMode?: boolean;
  startFrame?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const imgArray: HTMLImageElement[] = [];
      const promises: Promise<void>[] = [];

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        const filename = `ezgif-frame-${i.toString().padStart(3, "0")}.png`;
        img.src = IMAGES_FOLDER + filename;
        
        promises.push(
          new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Skip broken
          })
        );
        imgArray.push(img);
      }

      await Promise.all(promises);
      setImages(imgArray);
      setLoaded(true);
    };

    loadImages();
  }, []);

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: container ? { current: container } : undefined,
    offset: ["start start", "end end"],
  });

  // Use a spring transition for smoother frame changes
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const currentFrame = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

  const render = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !images.length) return;
    
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(index));
    const img = images[frameIndex];

    if (img) {
      // UHD / High-DPI Support
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
      }

      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const scale = Math.min(displayWidth / img.width, displayHeight / img.height) * 1.1;
      const x = (displayWidth / 2) - (img.width / 2) * scale;
      const y = (displayHeight / 2) - (img.height / 2) * scale;

      ctx.clearRect(0, 0, displayWidth, displayHeight);
      
      // Crop 2px from edges to remove the "green line" compression artifact
      ctx.drawImage(
        img, 
        2, 2, img.width - 4, img.height - 4, // Source crop
        x, y, img.width * scale, img.height * scale // Destination
      );
      
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    }
  };

  useEffect(() => {
    if (loaded && images.length > 0) {
      render(heroMode ? startFrame : currentFrame.get());
    }
  }, [loaded, images, heroMode, startFrame]);

  // Handle frame updates on scroll
  useEffect(() => {
    if (heroMode) return; // Don't subscribe to scroll events in hero mode
    const unsubscribe = currentFrame.on("change", (latest) => {
      render(latest);
    });
    return () => unsubscribe();
  }, [currentFrame, images, loaded, heroMode]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [0, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.4, 0.5, 0.6], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const maggiOpacity = useTransform(scrollYProgress, [0, 0.5], [0.1, 0.05]);

  if (!loaded) return (
    <div className="h-screen flex items-center justify-center bg-brand-yellow">
      <div className="text-brand-red font-black text-4xl animate-pulse">PREPARING SAUCE...</div>
    </div>
  );

  if (heroMode) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div 
      ref={(el) => {
        // @ts-ignore
        containerRef.current = el;
        setContainer(el);
      }} 
      className="scrolly-container bg-[#0A0A0A]"
    >
      <div className="sticky-wrapper relative">
        {/* Grain Texture */}
        <div className="grain-overlay opacity-30" />
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Background Big Text */}
        <motion.div 
          style={{ opacity: maggiOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <h1 className="text-[30vw] text-brand-red opacity-10 font-[950] tracking-tighter">MAGGI</h1>
        </motion.div>

        <canvas ref={canvasRef} className="z-10 sauce-glow" />

        {/* Dynamic Text Bits - Sexy Editorial Style */}
        <motion.div 
          style={{ opacity: text1Opacity }}
          className="absolute left-10 md:left-24 top-1/2 -translate-y-1/2 z-0"
        >
          <h2 className="text-7xl md:text-[10vw] leading-[0.85] font-[950] tracking-tighter text-white uppercase">
            Vibrant<br/><span className="text-brand-red sauce-glow">Spice</span>
          </h2>
        </motion.div>

        <motion.div 
          style={{ opacity: text2Opacity }}
          className="absolute right-10 md:right-24 top-1/2 -translate-y-1/2 z-0 text-right"
        >
          <h2 className="text-7xl md:text-[10vw] leading-[0.85] font-[950] tracking-tighter text-brand-red uppercase text-outline">
            Irresistible<br/><span className="text-white">Twist</span>
          </h2>
        </motion.div>

        <motion.div 
          style={{ opacity: text3Opacity }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-0 text-center w-full"
        >
          <h2 className="text-5xl md:text-[8vw] leading-[0.9] font-[950] tracking-tighter text-white uppercase">
            The Ultimate<br/>
            <span className="text-brand-yellow drop-shadow-[0_0_30px_rgba(255,218,0,0.3)]">Hot & Sweet</span>
          </h2>
        </motion.div>
      </div>
    </div>
  );
}
