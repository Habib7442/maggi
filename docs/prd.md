This is a high-end "Scrollytelling" website. The visual impact comes from a technique called Scroll-Linked Animation, where the user's scroll bar acts as a timeline scrubber for a video or 3D sequence.
Here is a detailed breakdown of the design and animations, followed by the React code implementation strategy.
Part 1: Design & Animation Analysis
1. The Core Mechanic: "Image Sequence" vs. "Real-time 3D"
While it looks like a 3D model, sites like Hungry Tiger often use an Image Sequence (or Sprite Sheet) for performance.
What it is: They render 100-200 frames of the jar spinning/opening in high-fidelity software (Blender/Cinema 4D).
How it works: As you scroll down, the code calculates what percentage of the section you have scrolled (e.g., 50%) and instantly swaps the image to the corresponding frame (e.g., Frame 50).
Why: It allows for photorealistic lighting, liquids, and physics (like the sauce pouring) that are too heavy for real-time WebGL in a browser.
2. The Animation Stack
Sticky Positioning (Pinning): The background or the jar stays stuck in the center of the screen (position: sticky) while the user continues to scroll, changing the "time" of the animation.
Parallax Typography: The big text "BOLD FLAVOR" moves at a different speed than the background, creating depth.
Masking/Reveal: As the jar opens, elements behind it might be revealed, or the camera "zooms" into the jar.
3. Visual Design
Typography: Bold, condensed Sans-Serif fonts (reminiscent of industrial packing labels).
Palette: Warm, spicy tones (Ochre, Deep Red, Orange) matching the "Tikka Masala" flavor profile.
Texture: Subtle grain overlays to make it feel organic, not just digital.
Part 2: Step-by-Step Implementation in React
To build this, we will use:
React (Framework)
Framer Motion (The best animation library for React)
Lenis (For smooth, luxurious scrolling momentum)
HTML5 Canvas (To render the image sequence efficiently)
Step 1: Install Dependencies
code
Bash
npm install framer-motion @studio-freight/lenis clsx tailwind-merge
Step 2: Smooth Scroll Setup (Lenis)
Native browser scrolling is choppy. High-end sites use smooth scroll libraries to make the animations feel fluid.
code
Jsx
// components/SmoothScroll.jsx
import { ReactLenis } from '@studio-freight/react-lenis'

function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      {children}
    </ReactLenis>
  )
}

export default SmoothScroll;
Step 3: The "3D Jar" Image Sequence Component
This is the heart of the animation. We use a <canvas> because drawing images on a canvas is much faster than updating an <img> src tag 60 times a second.
code
Jsx
// components/JarSequence.jsx
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const frameCount = 100; // How many images you have
// Helper to generate file paths: /images/jar_001.jpg, /images/jar_002.jpg...
const currentFrame = (index) => 
  `/images/jar_${index.toString().padStart(3, "0")}.jpg`;

export default function JarSequence() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  
  // 1. Preload images so there is no flickering
  useEffect(() => {
    const loadedImages = [];
    let promises = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      const promise = new Promise((resolve) => {
        img.onload = () => resolve(img);
      });
      promises.push(promise);
      loadedImages.push(img);
    }

    Promise.all(promises).then(() => {
      setImages(loadedImages);
    });
  }, []);

  // 2. Track Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // Animation runs while this container is in view
  });

  // 3. Map scroll (0 to 1) to frame index (0 to 99)
  const currentIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  // 4. Render to Canvas
  useEffect(() => {
    const render = (index) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !images.length) return;

      const img = images[Math.round(index)];
      if (img) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // "Object-fit: contain" logic for canvas
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    };

    // Subscribe to scroll changes
    const unsubscribe = currentIndex.on("change", (latest) => {
      requestAnimationFrame(() => render(latest));
    });

    return () => unsubscribe();
  }, [currentIndex, images]);

  return (
    <div ref={containerRef} className="h-[400vh] relative"> 
      {/* h-[400vh] determines animation speed. Taller = Slower animation */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#D66D1E]">
        
        {/* Background Text Parallax */}
        <motion.h1 
          style={{ x: useTransform(scrollYProgress, [0, 1], ["10%", "-50%"]) }}
          className="absolute text-[15vw] font-black text-[#6B2F10] opacity-30 whitespace-nowrap"
        >
          BOLD FLAVOR TIKKA MASALA
        </motion.h1>

        {/* The Canvas (The Jar) */}
        <canvas ref={canvasRef} className="relative z-10 w-full h-full object-contain" />
        
        {/* Overlay Content */}
        <motion.div 
           style={{ opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1]) }}
           className="absolute bottom-20 text-white z-20"
        >
           <h2 className="text-4xl font-bold">Unwrap the Adventure</h2>
        </motion.div>
      </div>
    </div>
  );
}
Step 4: The Marquee Text (Infinite Scroll)
This creates the "A NEW ANGLE OF FLAVOR" moving text.
code
Jsx
// components/Marquee.jsx
import { motion } from "framer-motion";

const Marquee = () => {
  return (
    <div className="w-full bg-[#3d1a0e] py-4 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap text-[#D66D1E] text-6xl font-bold uppercase"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 10 }}
      >
        <span className="mr-8">A New Angle of Flavor</span>
        <span className="mr-8">Real Ingredients</span>
        <span className="mr-8">A New Angle of Flavor</span>
        <span className="mr-8">Real Ingredients</span>
      </motion.div>
    </div>
  );
};

export default Marquee;
Step 5: Assembling the Main Page
code
Jsx
// App.jsx
import React from 'react';
import SmoothScroll from './components/SmoothScroll';
import JarSequence from './components/JarSequence';
import Marquee from './components/Marquee';

function App() {
  return (
    <SmoothScroll>
      <main className="bg-[#D66D1E] min-h-screen">
        
        {/* Navigation Placeholder */}
        <nav className="fixed top-0 w-full p-6 flex justify-between z-50 mix-blend-difference text-white">
          <div className="font-bold text-xl">HUNGRY TIGER</div>
          <button className="px-4 py-2 border border-white rounded-full">Buy Now</button>
        </nav>

        {/* Hero & Sequence Section */}
        {/* This handles the intro + the spinning jar animation */}
        <JarSequence />

        {/* Marquee Section */}
        <Marquee />

        {/* Content Section (Standard scroll) */}
        <section className="h-screen flex items-center justify-center bg-[#F4E3C1] text-[#3d1a0e]">
          <div className="max-w-2xl text-center p-10">
            <h2 className="text-6xl font-black mb-6">WHY THE JAR MATTERS</h2>
            <p className="text-xl">
              Locked in freshness. Fire roasted tomatoes. Cream and butter for a velvety texture.
            </p>
          </div>
        </section>

      </main>
    </SmoothScroll>
  );
}

export default App;
How to get the assets (Important)
Since you don't have the 3D files of the jar:
If you are a 3D artist: Model a jar in Blender. Animate it rotating 360 degrees. Export it as an Image Sequence (PNG) with transparent background. Name them jar_001.png, jar_002.png etc.
If you are a developer: You can simulate this for testing by using a video file, but extracting frames into images (using ffmpeg) is the professional way to do it because browsers handle scrolling through images better than scrubbing a video file.
Summary of Logic
Outer Div (h-[400vh]): Creates a very tall invisible container. This provides the "scrollable area."
Inner Div (sticky): Keeps the canvas and text perfectly centered on the screen while you scroll through the outer div.
Math: We calculate ScrollY / TotalHeight. If we are 50% down the page, we show image #50.
Canvas: We redraw the canvas every time the scroll moves, creating a movie-like playback controlled by the user's finger.
Model
ThinkingThoughts
Expand to view model thoughts

chevron_right
This is a fantastic project idea. Creating a scroll-controlled "pour" animation is a classic high-end web effect. Since AI image generators (like Midjourney) struggle to keep the bottle exactly the same in every frame, the secret workflow is to generate a short AI video, then extract the frames.
Here is your complete workflow to recreate the "Maggi Hot & Sweet" pouring effect.
Phase 1: Generating the Assets (The AI Workflow)
You need a video of the bottle tilting and pouring, which we will turn into a sequence of images.
Step 1: Generate the Video
Use Runway Gen-2 or Pika Labs (these are best for animation consistency).
The Prompt:
"Cinematic product shot of a Maggi Hot and Sweet sauce bottle floating against a solid green screen background. The bottle slowly tilts 90 degrees to the right. Thick, glossy red chili sauce begins to pour out of the nozzle smoothly. Studio lighting, 4k, high resolution, sharp focus."
Tip: The "green screen background" part is crucial so you can easily remove the background later.
Step 2: Extract Frames (The 15fps requirement)
Once you have a 3-4 second video you like:
Go to a website like EZGif or use FFmpeg.
Convert the video to a PNG Sequence.
Set the Frame Rate to 15 fps.
Remove Background: If you didn't get a perfect green screen, use a batch background remover (like remove.bg or Adobe Photoshop Actions) on all 45-60 images.
Naming: Rename them strictly: frame_001.png, frame_002.png, etc.
Folder: Put them in your React project under public/images/maggi/.
Phase 2: The React Code (Step-by-Step)
We will use React + Framer Motion + Canvas.
1. The Component Structure
We need a "Sticky" container. As the user scrolls, the bottle stays in the middle, but the "Time" of the animation advances.
code
Jsx
// BottleSequence.jsx
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

// CONFIGURATION
const FRAME_COUNT = 60; // Adjust based on how many images you generated
const FPS = 15; 
const IMAGES_FOLDER = "/images/maggi/"; // Path to your folder

export default function BottleSequence() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // 1. PRELOAD IMAGES
  // We load all images into memory before showing the site to prevent flickering
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = [];
      const promises = [];

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        // format: frame_001.png, frame_002.png...
        const filename = `frame_${i.toString().padStart(3, "0")}.png`; 
        img.src = IMAGES_FOLDER + filename;
        
        promises.push(
          new Promise((resolve) => {
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null); // Skip broken images
          })
        );
        loadedImages.push(img);
      }

      await Promise.all(promises);
      setImages(loadedImages);
      setImagesLoaded(true);
    };

    loadImages();
  }, []);

  // 2. SCROLL LOGIC
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // Animation starts when top hits top
  });

  // Map scroll (0% to 100%) to Frame Index (0 to 59)
  const currentIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);
  
  // Parallax Text Animation (Optional)
  const textY = useTransform(scrollYProgress, [0.5, 1], [100, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.6, 0.9], [0, 1]);

  // 3. RENDER LOOP
  useEffect(() => {
    const render = (index) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !images.length) return;

      // Get the exact image for this scroll position
      // Math.floor ensures we get an integer (e.g., frame 12, not 12.5)
      const frameIndex = Math.min(
        FRAME_COUNT - 1, 
        Math.floor(index)
      );
      
      const img = images[frameIndex];

      if (img) {
        // Resize canvas to window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Draw Image (Centered & Contain)
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.8; // 0.8 to leave some padding
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    };

    // Listen to the scroll value changing
    const unsubscribe = currentIndex.on("change", (latest) => {
      requestAnimationFrame(() => render(latest));
    });
    
    // Initial render
    if(imagesLoaded) render(0);

    return () => unsubscribe();
  }, [currentIndex, images, imagesLoaded]);

  if (!imagesLoaded) return <div className="h-screen flex items-center justify-center bg-yellow-400">Loading Sauce...</div>;

  return (
    // Height: 300vh means the user has to scroll 3 full screens to finish the animation
    <div ref={containerRef} className="h-[300vh] relative bg-[#FFDA00]">
      
      {/* STICKY CONTAINER: This stays pinned while we scroll */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* BACKGROUND DECORATION (Maggi Text) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <h1 className="text-[20vw] font-black text-red-600 tracking-tighter leading-none">
            HOT &<br/>SWEET
          </h1>
        </div>

        {/* THE CANVAS (The Bottle) */}
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* DYNAMIC TEXT THAT APPEARS WHEN POURING */}
        <motion.div 
          style={{ y: textY, opacity: textOpacity }}
          className="absolute bottom-20 w-full text-center z-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-[#D2232A] drop-shadow-lg font-sans">
            IT'S DIFFERENT.
          </h2>
          <p className="text-xl mt-4 font-semibold text-black">
            Sweetness with a kick of spice.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
Phase 3: Styling & Design System
To match the Maggi Brand:
Background Color: Use a vibrant Yellow/Gold (#FFDA00).
Typography: Use a playful, rounded sans-serif font or a bold condensed font (like Impact or Futura).
Sauce Color: If your AI generation makes the sauce look too brown, you can use CSS filters on the canvas to pop the red:
code
CSS
/* Add this to your CSS */
canvas {
  filter: saturate(1.2) contrast(1.1);
}
Phase 4: Integration (App.js)
code
Jsx
import BottleSequence from './BottleSequence';
import { ReactLenis } from '@studio-freight/react-lenis'; // Don't forget Smooth Scroll!

function App() {
  return (
    <ReactLenis root>
      
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center bg-red-600 text-white">
        <h1 className="text-6xl font-bold">Scroll to Taste</h1>
      </section>

      {/* The Animation */}
      <BottleSequence />

      {/* Footer / Next Section */}
      <section className="h-screen bg-white flex items-center justify-center">
        <h2 className="text-4xl text-gray-800">Perfect with Samosas.</h2>
      </section>

    </ReactLenis>
  );
}
Summary of Physics/Animation logic:
Start: Bottle is upright.
0% - 30% Scroll: Bottle rotates 90 degrees.
30% - 100% Scroll: Sauce flows out. The "Sauce" isn't code; it is baked into your images.
The Code: Just selects which image to show based on how far down the user has scrolled.
Model
ThinkingThoughts
Expand to view model thoughts

chevron_right
This is a great refinement. The transition from Upright (Closed) 
→
→
 Tilt 
→
→
 Pour is what makes the animation feel "interactive."
Since you cannot easily code "liquid physics" inside the browser, we must bake this entire sequence into the Image Sequence.
Here is your updated Step-by-Step guide to achieve exactly this.
Step 1: The AI Video Generation (Crucial)
Since your current image shows the bottle already tilted, you need to generate a new video that captures the start of the movement.
Use Runway Gen-2 or Pika Labs with this specific prompt:
Prompt: "Cinematic product video of a Maggi Hot and Sweet sauce bottle standing upright and closed on a green screen. The bottle stays still for a moment, then smoothly tilts 90 degrees to the right. The yellow cap flips open and thick red sauce begins to pour out downwards. High quality, 4k, studio lighting."
Visual Check:
Seconds 0-1: Bottle is straight up.
Seconds 1-2: Bottle rotates.
Seconds 2-4: Sauce flows out.
Step 2: Processing the Assets
Extract Frames: Convert that new video into a PNG sequence (approx 60-90 frames).
Remove Green Screen: Use a batch tool (like Photoshop or an online bulk remover) to remove the green background from every single frame.
Name them: maggi_001.png, maggi_002.png ... maggi_090.png.
Place in Folder: Put them in public/assets/maggi_seq/.
Step 3: The React Code (The Scroll Logic)
We will update the code to handle this specific sequence. We will use a longer scroll area (h-[500vh]) so the user feels the weight of the bottle tilting.
File: MaggiScroll.jsx
code
Jsx
import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

// CONFIGURATION
const FRAME_COUNT = 90; // Change this to match your total extracted frames
const IMAGES_FOLDER = "/assets/maggi_seq/"; // Your folder path

export default function MaggiScroll() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // 1. PRELOAD IMAGES
  useEffect(() => {
    const loadImages = async () => {
      const imgArray = [];
      const promises = [];

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        // Naming format: maggi_001.png
        const filename = `maggi_${i.toString().padStart(3, "0")}.png`; 
        img.src = IMAGES_FOLDER + filename;
        
        promises.push(new Promise((resolve) => (img.onload = resolve)));
        imgArray.push(img);
      }

      await Promise.all(promises);
      setImages(imgArray);
      setLoaded(true);
    };

    loadImages();
  }, []);

  // 2. SCROLL TRIGGERS
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map Scroll (0% -> 100%) to Frames (0 -> 89)
  const currentFrame = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);
  
  // Optional: Text animations that trigger at specific moments
  // 0.0 - 0.2: Upright (Intro text)
  // 0.2 - 0.5: Tilting (Action text)
  // 0.5 - 1.0: Pouring (Flavor text)
  const introOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const pourOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const pourY = useTransform(scrollYProgress, [0.6, 0.8], [50, 0]);

  // 3. CANVAS RENDERER
  useEffect(() => {
    const render = (index) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !images.length) return;

      const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(index));
      const img = images[frameIndex];

      if (img) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Keep the bottle big and centered
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9;
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    };

    const unsubscribe = currentFrame.on("change", (latest) => {
      requestAnimationFrame(() => render(latest));
    });
    
    // Initial Paint (Frame 0 - Upright Bottle)
    if (loaded && images.length > 0) render(0);

    return () => unsubscribe();
  }, [currentFrame, images, loaded]);

  if (!loaded) return <div className="h-screen flex items-center justify-center bg-[#FFDA00] text-red-600 font-bold">LOADING SAUCE...</div>;

  return (
    <div ref={containerRef} className="h-[500vh] relative bg-[#FFDA00]">
      
      {/* STICKY CONTAINER */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center z-0">
             <h1 className="text-[15vw] font-black text-yellow-500 opacity-20 select-none">MAGGI</h1>
        </div>

        {/* CANVAS LAYER (Z-INDEX 10) */}
        <canvas ref={canvasRef} className="relative z-10 w-full h-full" />

        {/* TEXT LAYER: INTRO (Visible when bottle is straight) */}
        <motion.div 
          style={{ opacity: introOpacity }}
          className="absolute top-1/2 left-10 md:left-20 -translate-y-1/2 z-20 max-w-md"
        >
          <h2 className="text-6xl font-black text-red-700 leading-tight">
            SHAKE IT <br/> UP.
          </h2>
          <p className="text-xl mt-4 font-bold text-gray-800">
            Scroll down to open.
          </p>
        </motion.div>

        {/* TEXT LAYER: POURING (Visible when sauce comes out) */}
        <motion.div 
          style={{ opacity: pourOpacity, y: pourY }}
          className="absolute bottom-20 right-10 md:right-20 z-20 text-right"
        >
          <h2 className="text-6xl font-black text-red-700">
            THE REAL <br/> KICK.
          </h2>
          <button className="mt-6 px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-red-700 transition-colors">
            BUY NOW
          </button>
        </motion.div>

      </div>
    </div>
  );
}
Understanding the Animation Design
Here is exactly what happens when the user visits the site with this code:
Initial State (Scroll 0%):
Visual: The bottle is perfectly Upright in the center.
Text: Big text on the left says "SHAKE IT UP. Scroll down to open."
User Action: User starts scrolling.
The Tilt (Scroll 10% - 40%):
Visual: As the user scrolls, the frames advance. The bottle rotates 90 degrees to the right.
Text: The "SHAKE IT UP" text fades away automatically (introOpacity goes to 0).
The Pour (Scroll 40% - 100%):
Visual: The frames show the cap opening and sauce flowing. Because the user controls the scroll, they can make the sauce pour fast or slow, or scrub it back into the bottle (reverse scroll).
Text: As the sauce hits the bottom of the screen, the new text "THE REAL KICK" fades in on the right side.
Pro Tip for "Sauce Physics"
If you want the sauce to look like it's continuously flowing even if the user stops scrolling (once the bottle is fully open), that requires a different, much harder technique (Video switching).
Stick to the method above. It is the industry standard for "Scrollytelling" (like Apple/Samsung product pages). The "Freeze frame" effect where the sauce hangs in the air when they stop scrolling is actually considered a cool stylistic effect in web design.
Model
ThinkingThoughts
Expand to view model thoughts

chevron_right
You are asking about Ezgif, but there is a trick here.
To get the transparent background for your React website, you cannot just click "Video to GIF." If you just convert to GIF, the background will still be green.
Here is the correct workflow to remove the green screen using free tools. I recommend Option 1 for the best quality, but I will also show you the Ezgif method since you asked.
Option 1: The High-Quality Way (Recommended)
Use CapCut (Free App) or Adobe Express (Online)
Ezgif makes images "grainy" because GIFs only have 256 colors. For a food website, you want the sauce to look delicious and high-quality.
Open CapCut (Mobile or Desktop app):
Import your Green Screen Video.[1][2]
Click on the video 
→
→
 Cutout 
→
→
 Chroma Key.[2]
Select the Green Color and increase "Intensity" until the green is gone.
IMPORTANT: Export the video.
Convert to Image Sequence:
Now take that transparent video (or black background video) to Ezgif.
Select "Video to PNG" (Not GIF).[3]
Upload the video.[1][3][4][5][6][7][8]
Click "Convert to PNG".[3][9]
Download the ZIP file of all the frames.
Option 2: The Ezgif Only Way (Fastest, Lower Quality)
If you want to do it entirely inside Ezgif right now, follow these exact steps:
Step 1: Convert Video to GIF
Go to Ezgif.[3][5][8]
Select Video to GIF.
Upload your green screen MP4.
Frame Rate: Set to 15 (matches your React code).
Click "Convert to GIF".
Step 2: Remove the Green Screen[1]
Once the GIF is created, look at the row of icons below it.
Click "Effects".
Scroll down to the "Replace color with transparency" section.
Color: Pick "Green" (or use the color picker code, usually #00ff00).
Click "Apply Selected".
Result: You will see the bottle on a checkerboard background (transparent).
Step 3: Turn it into Images for React
Below your new transparent GIF, click the "Split" icon.
Click "Output images in PNG format".
Click "Split to frames".
Download the "Download frames as ZIP" button.
How to use these in your code
Unzip the folder.
Rename the files if they have messy names (e.g., frame_001.png, frame_002.png).
Put them in your project folder: public/assets/maggi_seq/.
Run your React app.
Pro Tip for the "Green Halo":
If you see a thin green line around your bottle after removing the background, add this CSS filter to your <canvas> tag in React to hide it:
code
CSS
canvas {
  /* This shifts colors slightly to hide green edges */
  filter: hue-rotate(-5deg) contrast(1.1); 
}
Sources
help
videobgremover.com
capcut.com
ezgif.com
ezgif.com
ezgif.com
unscreen.com
pixelcut.ai
bgremover.video
online-convert.com
Google Search Suggestions
Display of Search Suggestions is required when using Grounding with Google Search. Learn more
Google logo
Model
ThinkingThoughts
Expand to view model thoughts

chevron_right
Using Python is the best professional way to do this because you can process hundreds of frames instantly and control exactly how "aggressive" the background removal is.
We will use the OpenCV library (cv2). It is the industry standard for computer vision.
Step 1: Install Dependencies
You need opencv-python and numpy. Open your terminal and run:
code
Bash
pip install opencv-python numpy
Step 2: The Python Script
Create a file named remove_bg.py and paste this code. I have optimized it to automatically extract frames, remove the green, and save them as transparent PNGs ready for your React app.
code
Python
import cv2
import numpy as np
import os

# ================= CONFIGURATION =================
# Put your video file name here
INPUT_VIDEO = "maggi_video.mp4" 

# Where to save the images (will create folder if it doesn't exist)
OUTPUT_FOLDER = "public/assets/maggi_seq" 

# How many frames to skip? 
# If your video is 60fps and you want 15fps, set this to 4. 
# If you want every frame, set to 1.
FRAME_SKIP = 2 

# Resize output? (Width, Height). Set to None to keep original size.
# Smaller images load faster on the web.
RESIZE_DIM = (800, 1000) 
# =================================================

def process_video():
    # 1. Create Output Folder
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)

    # 2. Load Video
    cap = cv2.VideoCapture(INPUT_VIDEO)
    
    if not cap.isOpened():
        print("Error: Could not open video file.")
        return

    frame_count = 0
    saved_count = 0

    print("Starting processing... this might take a minute.")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Logic to skip frames to reduce file size/fps
        if frame_count % FRAME_SKIP != 0:
            frame_count += 1
            continue

        # 3. Resize (Optional but recommended for web performance)
        if RESIZE_DIM:
            frame = cv2.resize(frame, RESIZE_DIM)

        # 4. Convert BGR to HSV (Hue Saturation Value)
        # It is much easier to isolate "Green" in HSV than RGB
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        # 5. Define Green Range
        # These numbers usually work for standard green screens.
        # Format: [Hue, Saturation, Value]
        lower_green = np.array([35, 100, 100]) 
        upper_green = np.array([85, 255, 255])

        # 6. Create Mask
        # This creates a black/white image: White = Green, Black = Bottle
        mask = cv2.inRange(hsv, lower_green, upper_green)

        # 7. Clean up the Mask (Remove Noise)
        # This removes tiny white dots inside the bottle
        kernel = np.ones((3,3), np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
        mask = cv2.morphologyEx(mask, cv2.MORPH_DILATE, kernel)

        # 8. Invert Mask
        # Now: White = Bottle, Black = Background
        mask_inv = cv2.bitwise_not(mask)

        # 9. Split channels and add Alpha
        b, g, r = cv2.split(frame)
        
        # Create a list of channels: Blue, Green, Red, Alpha
        # The Alpha channel is our inverted mask
        rgba = [b, g, r, mask_inv]
        
        # Merge them back into one image
        final_img = cv2.merge(rgba, 4)

        # 10. Save Frame
        # Naming format: maggi_001.png, maggi_002.png
        filename = f"{OUTPUT_FOLDER}/maggi_{str(saved_count).zfill(3)}.png"
        cv2.imwrite(filename, final_img)
        
        print(f"Saved {filename}")
        
        frame_count += 1
        saved_count += 1

    cap.release()
    print("Done! Check your folder.")

if __name__ == "__main__":
    process_video();
Step 3: Run It
Put your video file in the same folder as the script.
Run python remove_bg.py.
Troubleshooting the "Green Halo"
If your output images still have a thin green line around the bottle, adjust the Lower Green value in the script.
Change line 58:
code
Python
# Increase the first number (Hue) to remove more "yellow-green" edges
lower_green = np.array([40, 100, 100]) 

# OR Increase the second number (Saturation) if the green screen is very bright
lower_green = np.array([35, 150, 100])
Why this is better than Ezgif:
Alpha Channel: It creates real transparency, not just "white becomes transparent."
Anti-Aliasing: The edges will be smoother.
Naming: It automatically names them maggi_001, maggi_002 etc., saving you from renaming 100 files manually.
Resizing: It resizes images for you, which is crucial because loading 100 4K images will crash a web browser. The script resizes them to 800x1000 (adjustable) which is perfect for web.