"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { type Lang, t } from "./translations";

gsap.registerPlugin(ScrollTrigger);

type FrameSource = HTMLImageElement | HTMLCanvasElement;
const getSourceDims = (src: FrameSource) =>
  src instanceof HTMLImageElement
    ? { w: src.naturalWidth, h: src.naturalHeight }
    : { w: src.width, h: src.height };

const getImageScale = () => {
  if (typeof window === "undefined") return 0.86;
  if (window.innerWidth <= 480) return 0.72;
  if (window.innerWidth <= 768) return 0.78;
  return 0.86;
};

// 3 frame sequences stitched together as one continuous animation
const FRAME_SEQUENCES = [
  { dir: "/frames", count: 121 }, // Sequence 1: product animation
  { dir: "/frames2", count: 121 }, // Sequence 2: package explodes → ingredients into cup
  { dir: "/frames3", count: 121 }, // Sequence 3: turns into coffee
];

const getIngredients = (lang: Lang) => [
  { label: t("ing1Label", lang), name: t("ing1Name", lang), dose: t("ing1Dose", lang), description: t("ing1Desc", lang), detail: t("ing1Detail", lang) },
  { label: t("ing2Label", lang), name: t("ing2Name", lang), dose: t("ing2Dose", lang), description: t("ing2Desc", lang), detail: t("ing2Detail", lang) },
  { label: t("ing3Label", lang), name: t("ing3Name", lang), dose: t("ing3Dose", lang), description: t("ing3Desc", lang), detail: t("ing3Detail", lang) },
  { label: t("ing4Label", lang), name: t("ing4Name", lang), dose: t("ing4Dose", lang), description: t("ing4Desc", lang), detail: t("ing4Detail", lang) },
  { label: t("ing5Label", lang), name: t("ing5Name", lang), dose: t("ing5Dose", lang), description: t("ing5Desc", lang), detail: t("ing5Detail", lang) },
];

const getPillars = (lang: Lang) => [
  { icon: "\u25CE", title: t("pillar1Title", lang), subtitle: t("pillar1Sub", lang), description: t("pillar1Desc", lang) },
  { icon: "\u25C7", title: t("pillar2Title", lang), subtitle: t("pillar2Sub", lang), description: t("pillar2Desc", lang) },
  { icon: "\u25CB", title: t("pillar3Title", lang), subtitle: t("pillar3Sub", lang), description: t("pillar3Desc", lang) },
  { icon: "\u25BD", title: t("pillar4Title", lang), subtitle: t("pillar4Sub", lang), description: t("pillar4Desc", lang) },
];

const getBrewSteps = (lang: Lang) => [
  { step: "01", title: t("brew1Title", lang), instruction: t("brew1Instruction", lang), detail: t("brew1Detail", lang), duration: t("brew1Duration", lang) },
  { step: "02", title: t("brew2Title", lang), instruction: t("brew2Instruction", lang), detail: t("brew2Detail", lang), duration: t("brew2Duration", lang) },
  { step: "03", title: t("brew3Title", lang), instruction: t("brew3Instruction", lang), detail: t("brew3Detail", lang), duration: t("brew3Duration", lang) },
  { step: "04", title: t("brew4Title", lang), instruction: t("brew4Instruction", lang), detail: t("brew4Detail", lang), duration: t("brew4Duration", lang) },
];

const getTestimonials = (lang: Lang) => [
  { quote: t("test1Quote", lang), author: t("test1Author", lang), role: t("test1Role", lang) },
  { quote: t("test2Quote", lang), author: t("test2Author", lang), role: t("test2Role", lang) },
  { quote: t("test3Quote", lang), author: t("test3Author", lang), role: t("test3Role", lang) },
  { quote: t("test4Quote", lang), author: t("test4Author", lang), role: t("test4Role", lang) },
  { quote: t("test5Quote", lang), author: t("test5Author", lang), role: t("test5Role", lang) },
];

const getFaqs = (lang: Lang) => [
  { q: t("faq1Q", lang), a: t("faq1A", lang) },
  { q: t("faq2Q", lang), a: t("faq2A", lang) },
  { q: t("faq3Q", lang), a: t("faq3A", lang) },
  { q: t("faq4Q", lang), a: t("faq4A", lang) },
  { q: t("faq5Q", lang), a: t("faq5A", lang) },
  { q: t("faq6Q", lang), a: t("faq6A", lang) },
  { q: t("faq7Q", lang), a: t("faq7A", lang) },
];

// Coffee bean positions — distributed around hero edges, away from center text
const BEANS = Array.from({ length: 18 }, (_, i) => {
  // Push beans toward edges: use quadrants to avoid center
  const angle = (i / 18) * Math.PI * 2 + 0.3;
  const radius = 28 + (i % 5) * 8; // 28-60% from center
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;
  const size = 18 + (i % 4) * 10; // 18-48px
  const rotation = (i * 47 + 15) % 360;
  const variant = i % 4; // 0=filled maroon, 1=outline, 2=filled dark, 3=outline light
  return {
    x: Math.max(3, Math.min(97, x)),
    y: Math.max(3, Math.min(97, y)),
    size,
    rotation,
    variant,
    delay: i * 0.12,
  };
});

export default function FlowSite() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const marqueeTextRef = useRef<HTMLDivElement>(null);
  const marquee2Ref = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const sciencePillarsRef = useRef<HTMLDivElement>(null);
  const brewRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const testimonialTrackRef = useRef<HTMLDivElement>(null);
  const scienceStatsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const beansContainerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const framesRef = useRef<FrameSource[]>([]);
  const currentFrameRef = useRef(0);
  const bgColorRef = useRef("#0a0a0a");
  const bgColorsRef = useRef<Map<number, string>>(new Map());
  const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageScaleRef = useRef(getImageScale());
  const framesReadyRef = useRef(false);
  const heroVisibleRef = useRef(true);
  const [lang, setLang] = useState<Lang>("en");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const INGREDIENTS = useMemo(() => getIngredients(lang), [lang]);
  const SCIENCE_PILLARS = useMemo(() => getPillars(lang), [lang]);
  const BREW_STEPS = useMemo(() => getBrewSteps(lang), [lang]);
  const TESTIMONIALS = useMemo(() => getTestimonials(lang), [lang]);
  const FAQS = useMemo(() => getFaqs(lang), [lang]);

  // Sync lang attribute on <html> for CSS selectors
  useEffect(() => {
    document.documentElement.lang = lang;
    // Recalculate all ScrollTrigger positions after React re-renders with new text
    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(rafId);
  }, [lang]);

  const sampleBgColor = useCallback((img: FrameSource, frameIndex?: number) => {
    if (!sampleCanvasRef.current) {
      sampleCanvasRef.current = document.createElement("canvas");
    }
    const sc = sampleCanvasRef.current;
    sc.width = 1;
    sc.height = 1;
    const sCtx = sc.getContext("2d");
    if (!sCtx) return;
    const { w, h } = getSourceDims(img);
    // Sample 4 corner pixels via source-crop drawImage (no full-image decode)
    const samplePixel = (sx: number, sy: number) => {
      sCtx.clearRect(0, 0, 1, 1);
      sCtx.drawImage(img, sx, sy, 1, 1, 0, 0, 1, 1);
      return sCtx.getImageData(0, 0, 1, 1).data;
    };
    const corners = [
      samplePixel(2, 2),
      samplePixel(w - 3, 2),
      samplePixel(2, h - 3),
      samplePixel(w - 3, h - 3),
    ];
    const r = Math.round(corners.reduce((s, c) => s + c[0], 0) / 4);
    const g = Math.round(corners.reduce((s, c) => s + c[1], 0) / 4);
    const b = Math.round(corners.reduce((s, c) => s + c[2], 0) / 4);
    const color = `rgb(${r},${g},${b})`;
    bgColorRef.current = color;
    if (frameIndex !== undefined) {
      bgColorsRef.current.set(frameIndex, color);
    }
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // If requested frame isn't loaded yet, find the nearest available frame
    let source = framesRef.current[index];
    if (!source) {
      for (let i = index - 1; i >= 0; i--) {
        if (framesRef.current[i]) { source = framesRef.current[i]; break; }
      }
    }
    if (!source) return;
    const ctx = ctxRef.current || canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.width / dpr;
    const ch = canvas.height / dpr;
    const { w: iw, h: ih } = getSourceDims(source);
    const scale = Math.max(cw / iw, ch / ih) * imageScaleRef.current;
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.fillStyle = bgColorRef.current;
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(source, dx, dy, dw, dh);
  }, []);

  // Frame loading + canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      imageScaleRef.current = getImageScale();
      drawFrame(currentFrameRef.current);
    };
    resizeCanvas();
    // Debounce resize to avoid excessive redraws during drag-resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 150);
    };
    window.addEventListener("resize", debouncedResize);

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    // Downsize frames to viewport resolution to save memory
    const viewW = Math.ceil(window.innerWidth * dpr);
    const viewH = Math.ceil(window.innerHeight * dpr);
    const downsizeFrame = (img: HTMLImageElement): FrameSource => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const s = Math.min(viewW / iw, viewH / ih, 1);
      if (s >= 0.95) return img; // Already close to viewport size
      const w = Math.round(iw * s);
      const h = Math.round(ih * s);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      return c;
    };

    // Build flat path list for all 3 sequences (WebP for smaller files)
    const isMobile = window.innerWidth <= 768;
    const frameStep = isMobile ? 2 : 1; // Load every 2nd frame on mobile
    const allFramePaths: string[] = [];
    for (const seq of FRAME_SEQUENCES) {
      for (let i = 1; i <= seq.count; i += frameStep) {
        allFramePaths.push(
          `${seq.dir}/frame_${String(i).padStart(4, "0")}.webp`,
        );
      }
    }

    let cancelled = false;

    (async () => {
      // Phase 1: Load first 10 frames in parallel (fast first paint)
      const firstBatch = await Promise.all(
        allFramePaths.slice(0, 10).map((p) => loadImage(p).catch(() => null)),
      );
      if (cancelled) return;

      const firstValid = firstBatch.find((img): img is HTMLImageElement => img !== null);
      if (firstValid) sampleBgColor(firstValid, 0);
      firstBatch.forEach((img, i) => {
        if (img) framesRef.current[i] = downsizeFrame(img);
      });
      drawFrame(0);
      framesReadyRef.current = true;

      // Phase 2: Load remaining frames in background batches of 10
      const BATCH_SIZE = 10;
      for (let i = 10; i < allFramePaths.length; i += BATCH_SIZE) {
        if (cancelled) return;
        const batchEnd = Math.min(i + BATCH_SIZE, allFramePaths.length);
        const batch = allFramePaths.slice(i, batchEnd);
        const imgs = await Promise.all(batch.map((p) => loadImage(p).catch(() => null)));
        imgs.forEach((img, j) => {
          if (!img) return;
          const idx = i + j;
          if (idx % 30 === 0) sampleBgColor(img, idx);
          framesRef.current[idx] = downsizeFrame(img);
        });
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [drawFrame, sampleBgColor]);

  // Main scroll + animation orchestration — runs immediately on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const scrollContainer = scrollContainerRef.current;
    const hero = heroRef.current;
    const canvasWrap = canvasWrapRef.current;
    if (!canvas || !scrollContainer || !hero || !canvasWrap) return;

    // Hint GPU to composite clip-path changes on their own layer
    canvasWrap.style.willChange = "clip-path";

    // Lenis smooth scroll (lenis.raf short-circuits internally when idle)
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(500, 33);

    // === HERO ELEMENTS ===
    const rings = hero.querySelectorAll(".hero-ring");
    const particles = hero.querySelectorAll(".hero-particle");
    const beans = hero.querySelectorAll(".hero-bean");

    // Loop tweens start paused — resume when loader dismisses
    const heroLoopTweens: gsap.core.Tween[] = [];
    rings.forEach((ring, i) => {
      heroLoopTweens.push(gsap.to(ring, {
        scale: 1.04,
        opacity: 0.6,
        duration: 3 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      }));
    });
    particles.forEach((p, i) => {
      heroLoopTweens.push(gsap.to(p, {
        y: `${(i % 2 === 0 ? -1 : 1) * (15 + (i % 7) * 5)}px`,
        x: `${(i % 3 === 0 ? -1 : 1) * (10 + (i % 5) * 3)}px`,
        duration: 4 + (i % 4) * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      }));
    });
    beans.forEach((bean, i) => {
      const beanData = BEANS[i];
      if (!beanData) return;
      heroLoopTweens.push(gsap.to(bean, {
        y: `${(i % 2 === 0 ? -1 : 1) * (8 + (i % 5) * 4)}px`,
        x: `${(i % 3 === 0 ? -1 : 1) * (6 + (i % 4) * 3)}px`,
        rotation: `+=${(i % 2 === 0 ? 1 : -1) * (8 + (i % 3) * 5)}`,
        duration: 5 + (i % 4) * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      }));
    });

    // Cursor-reactive magnetic repulsion for beans
    const beanElements = Array.from(beans) as HTMLElement[];
    const beanHomePositions = beanElements.map((el) => {
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });

    const handleBeanMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleBeanMouse, { passive: true });

    // Repulsion tick — direct transform for performance (no gsap.to per frame)
    const REPEL_RADIUS = 200;
    const REPEL_STRENGTH = 50;
    const beanOffsets = beanElements.map(() => ({ x: 0, y: 0, rot: 0 }));
    const beanTickerId = gsap.ticker.add(() => {
      // Skip processing when hero is scrolled offscreen — saves CPU
      if (!heroVisibleRef.current) return;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      beanElements.forEach((el, i) => {
        const home = beanHomePositions[i];
        if (!home) return;
        const off = beanOffsets[i];
        const dx = home.x - mx;
        const dy = home.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          const angle = Math.atan2(dy, dx);
          off.x += (Math.cos(angle) * force - off.x) * 0.08;
          off.y += (Math.sin(angle) * force - off.y) * 0.08;
          off.rot += ((i % 2 === 0 ? 1 : -1) * force * 0.4 - off.rot) * 0.08;
        } else {
          off.x *= 0.92;
          off.y *= 0.92;
          off.rot *= 0.92;
        }
        gsap.set(el, { x: off.x, y: off.y, rotation: off.rot });
      });
    });

    // === LOADER: lives in layout.tsx (server-rendered) ===
    // Page is fully rendered behind it. Wait for 4s + frames ready, then fade away.
    const loader = document.getElementById("site-loader");
    let loaderCheckInterval: ReturnType<typeof setInterval> | null = null;
    let loaderFadeTimer: ReturnType<typeof setTimeout> | null = null;
    const startLoopTweens = () => heroLoopTweens.forEach((tw) => tw.play());
    if (loader) {
      const loadStart = (window as unknown as Record<string, number>).__LOAD_START || Date.now();
      const dismissLoader = () => {
        loader.style.transition = "opacity 0.6s ease";
        loader.style.opacity = "0";
        loaderFadeTimer = setTimeout(() => {
          loader.style.display = "none";
        }, 600);
        startLoopTweens();
      };
      loaderCheckInterval = setInterval(() => {
        const elapsed = Date.now() - loadStart;
        if (elapsed >= 4000 && framesReadyRef.current) {
          clearInterval(loaderCheckInterval!);
          loaderCheckInterval = null;
          dismissLoader();
        }
      }, 100);
    } else {
      startLoopTweens();
    }

    // Cache context ref for scroll draw calls
    if (!ctxRef.current) ctxRef.current = canvas.getContext("2d");

    // Track whether hero loop tweens are currently paused
    let heroTweensPaused = false;

    // === HERO: circle-wipe + frame scrubbing ===
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;

        // Hero fade + track visibility for bean ticker optimization
        const heroOp = Math.max(0, 1 - p * 8);
        heroVisibleRef.current = heroOp > 0;
        // Skip redundant style writes once hero is fully hidden
        if (heroOp > 0) {
          hero.style.opacity = String(heroOp);
          // Resume hero loop tweens when hero becomes visible again
          if (heroTweensPaused) {
            heroLoopTweens.forEach((tw) => tw.resume());
            heroTweensPaused = false;
          }
        } else {
          if (hero.style.opacity !== "0") hero.style.opacity = "0";
          // Pause all infinite hero tweens when offscreen
          if (!heroTweensPaused) {
            heroLoopTweens.forEach((tw) => tw.pause());
            heroTweensPaused = true;
          }
        }

        // Circle wipe (0-15%)
        const wipeProgress = Math.min(1, Math.max(0, p / 0.15));
        if (canvasWrap)
          canvasWrap.style.clipPath = `circle(${wipeProgress * 75}% at 50% 50%)`;

        // Frame scrubbing — all sequences play across full scroll
        const totalLoaded = framesRef.current.length;
        const index = Math.min(
          Math.floor(p * (totalLoaded - 1)),
          totalLoaded - 1,
        );
        if (index !== currentFrameRef.current) {
          currentFrameRef.current = index;
          // Use precomputed bg color (no GPU readback during scroll)
          const colorKey = Math.round(index / 30) * 30;
          const precomputed = bgColorsRef.current.get(colorKey);
          if (precomputed) bgColorRef.current = precomputed;
          drawFrame(index);
        }
      },
    });

    // Scroll indicator fades out as user begins scrolling
    const scrollIndicatorEl = hero.querySelector(".scroll-indicator");
    if (scrollIndicatorEl) {
      gsap.to(scrollIndicatorEl, {
        opacity: 0,
        scrollTrigger: {
          trigger: scrollContainer,
          start: "top top",
          end: "3% top",
          scrub: true,
        },
      });
    }

    // === MARQUEE ===
    if (marqueeTextRef.current) {
      gsap.fromTo(
        marqueeTextRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: marqueeTextRef.current,
            start: "top 90%",
            end: "top 40%",
            scrub: true,
          },
        },
      );
    }

    // === MARQUEE 2: pause CSS animation when offscreen ===
    if (marquee2Ref.current) {
      const marquee2El = marquee2Ref.current.querySelector(".marquee-text") as HTMLElement;
      if (marquee2El) {
        ScrollTrigger.create({
          trigger: marquee2Ref.current,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => { marquee2El.style.animationPlayState = "running"; },
          onLeave: () => { marquee2El.style.animationPlayState = "paused"; },
          onEnterBack: () => { marquee2El.style.animationPlayState = "running"; },
          onLeaveBack: () => { marquee2El.style.animationPlayState = "paused"; },
        });
      }
    }

    // === INGREDIENTS: 3D perspective tilt (batched) ===
    if (ingredientsRef.current) {
      const items = ingredientsRef.current.querySelectorAll(".ingredient-item");
      items.forEach((item, i) => {
        const isLeft = i % 2 === 0;
        const children = item.querySelectorAll(
          ".ingredient-label, .ingredient-heading, .ingredient-desc, .ingredient-detail",
        );
        // Single ScrollTrigger per item with a timeline for both container + children
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          },
        });
        tl.fromTo(
          item,
          { rotateX: 15, rotateY: isLeft ? -10 : 10, opacity: 0 },
          { rotateX: 0, rotateY: 0, opacity: 1, ease: "power3.out" },
          0,
        );
        tl.fromTo(
          children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.1, ease: "power3.out" },
          0.1,
        );
      });
    }

    // === SCIENCE PILLARS: scale-up + stagger (batched) ===
    if (sciencePillarsRef.current) {
      const pillars =
        sciencePillarsRef.current.querySelectorAll(".science-pillar");
      pillars.forEach((pillar) => {
        const children = pillar.querySelectorAll(
          ".pillar-icon, .pillar-title, .pillar-subtitle, .pillar-desc",
        );
        // Single ScrollTrigger per pillar with timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pillar,
            start: "top 85%",
            end: "top 45%",
            scrub: true,
          },
        });
        tl.fromTo(
          pillar,
          { scale: 0.88, opacity: 0 },
          { scale: 1, opacity: 1, ease: "power2.out" },
          0,
        );
        tl.fromTo(
          children,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, ease: "power3.out" },
          0.1,
        );
      });

      // Section heading clip-reveal
      const sciHeading = sciencePillarsRef.current.querySelector(
        ".science-section-heading",
      );
      if (sciHeading) {
        gsap.fromTo(
          sciHeading,
          { clipPath: "inset(100% 0 0 0)", opacity: 0 },
          {
            clipPath: "inset(0% 0 0 0)",
            opacity: 1,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: sciencePillarsRef.current,
              start: "top 80%",
              end: "top 55%",
              scrub: true,
            },
          },
        );
      }
    }

    // === BREW: slide-right stagger ===
    if (brewRef.current) {
      const heading = brewRef.current.querySelector(".brew-heading");
      if (heading) {
        gsap.fromTo(
          heading,
          { x: -80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: brewRef.current,
              start: "top 80%",
              end: "top 55%",
              scrub: true,
            },
          },
        );
      }

      const steps = brewRef.current.querySelectorAll(".brew-step");
      steps.forEach((step) => {
        const children = step.querySelectorAll(
          ".brew-step-number, .brew-step-title, .brew-step-instruction, .brew-step-detail, .brew-step-duration",
        );
        // Single ScrollTrigger per step with timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
            end: "top 50%",
            scrub: true,
          },
        });
        tl.fromTo(
          step,
          { x: 80, opacity: 0 },
          { x: 0, opacity: 1, ease: "power3.out" },
          0,
        );
        tl.fromTo(
          children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, ease: "power3.out" },
          0.1,
        );
      });
    }

    // === TESTIMONIALS: horizontal scroll ===
    if (testimonialsRef.current && testimonialTrackRef.current) {
      const track = testimonialTrackRef.current;
      const trackWidth = track.scrollWidth;
      const viewWidth = window.innerWidth;
      const distanceToScroll = trackWidth - viewWidth;
      gsap.to(track, {
        x: -distanceToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top top",
          end: `+=${distanceToScroll}`,
          pin: true,
          scrub: 1,
        },
      });
    }

    // === SCIENCE STATS: counters + parallax ===
    if (scienceStatsRef.current) {
      const statNumbers =
        scienceStatsRef.current.querySelectorAll(".stat-number");
      statNumbers.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const target = parseFloat(htmlEl.dataset.value || "0");
        const decimals = parseInt(htmlEl.dataset.decimals || "0");
        // Set initial text to 0
        htmlEl.textContent = "0";
        gsap.to(htmlEl, {
          textContent: target,
          duration: 2,
          ease: "power1.out",
          snap: { textContent: decimals === 0 ? 1 : 0.01 },
          scrollTrigger: {
            trigger: scienceStatsRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
      });

      const shapes = scienceStatsRef.current.querySelectorAll(".science-shape");
      shapes.forEach((shape, i) => {
        gsap.to(shape, {
          y: (i % 2 === 0 ? -1 : 1) * 80,
          ease: "none",
          scrollTrigger: {
            trigger: scienceStatsRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      const scienceTexts = scienceStatsRef.current.querySelectorAll(
        ".science-label, .science-heading, .science-body, .stats-row",
      );
      gsap.fromTo(
        scienceTexts,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scienceStatsRef.current,
            start: "top 65%",
            end: "top 30%",
            scrub: true,
          },
        },
      );
    }

    // === FAQ: stagger-up ===
    if (faqRef.current) {
      const faqItems = faqRef.current.querySelectorAll(".faq-item");
      gsap.fromTo(
        faqItems,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: faqRef.current,
            start: "top 75%",
            end: "top 40%",
            scrub: true,
          },
        },
      );
      const faqHeading = faqRef.current.querySelector(".faq-heading");
      if (faqHeading) {
        gsap.fromTo(
          faqHeading,
          { clipPath: "inset(100% 0 0 0)", opacity: 0 },
          {
            clipPath: "inset(0% 0 0 0)",
            opacity: 1,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: faqRef.current,
              start: "top 80%",
              end: "top 55%",
              scrub: true,
            },
          },
        );
      }
    }

    // === FOOTER: fade-in ===
    if (footerRef.current) {
      const footerEls = footerRef.current.querySelectorAll(
        ".footer-brand, .footer-cta, .footer-copy",
      );
      gsap.fromTo(
        footerEls,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // === CUSTOM CURSOR ===
    const cursor = cursorRef.current;
    if (cursor && window.matchMedia("(pointer: fine)").matches) {
      let cursorX = 0, cursorY = 0, cursorRafId = 0;
      const moveCursor = (e: MouseEvent) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        if (!cursorRafId) {
          cursorRafId = requestAnimationFrame(() => {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            cursorRafId = 0;
          });
        }
      };
      window.addEventListener("mousemove", moveCursor, { passive: true });

      const hoverTargets = document.querySelectorAll(
        "a, button, .faq-question",
      );
      const expand = () => cursor.classList.add("expanded");
      const shrink = () => cursor.classList.remove("expanded");
      hoverTargets.forEach((el) => {
        el.addEventListener("mouseenter", expand);
        el.addEventListener("mouseleave", shrink);
      });

      return () => {
        window.removeEventListener("mousemove", moveCursor);
        window.removeEventListener("mousemove", handleBeanMouse);
        gsap.ticker.remove(beanTickerId);
        hoverTargets.forEach((el) => {
          el.removeEventListener("mouseenter", expand);
          el.removeEventListener("mouseleave", shrink);
        });
        lenis.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }

    return () => {
      if (loaderCheckInterval) clearInterval(loaderCheckInterval);
      if (loaderFadeTimer) clearTimeout(loaderFadeTimer);
      window.removeEventListener("mousemove", handleBeanMouse);
      gsap.ticker.remove(beanTickerId);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [drawFrame, sampleBgColor]);

  const toggleFaq = useCallback((index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  }, []);

  const marquee2Content = useMemo(() => t("marquee2Text", lang).repeat(10), [lang]);

  return (
    <>
      {/* Custom Cursor */}
      <div ref={cursorRef} className="custom-cursor" />

      {/* Canvas (fixed behind everything) */}
      <div
        ref={canvasWrapRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          clipPath: "circle(0% at 50% 50%)",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100vw", height: "100vh", clipPath: "inset(0 0 20px 0)" }}
        />
      </div>

      {/* Hero (fixed, fades on scroll) */}
      <div
        ref={heroRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--black)",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* === Animated radial rings === */}
        {[1, 2, 3, 4, 5].map((ring) => (
          <div
            key={ring}
            className="hero-ring"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: `${ring * 18}vmin`,
              height: `${ring * 18}vmin`,
              borderRadius: "50%",
              border: `1px solid rgba(107, 31, 42, ${0.15 - ring * 0.02})`,
              transform: "translate(-50%, -50%)",
              opacity: 1,
              willChange: "transform, opacity",
            }}
          />
        ))}

        {/* === Floating particles === */}
        <div
          className="hero-particles"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="hero-particle"
              style={{
                position: "absolute",
                width: i % 3 === 0 ? "3px" : "2px",
                height: i % 3 === 0 ? "3px" : "2px",
                borderRadius: "50%",
                background:
                  i % 4 === 0
                    ? "rgba(107, 31, 42, 0.4)"
                    : "rgba(245, 240, 232, 0.15)",
                left: `${(i * 37 + 13) % 100}%`,
                top: `${(i * 53 + 7) % 100}%`,
                opacity: i % 3 === 0 ? 0.5 : 0.2,
              }}
            />
          ))}
        </div>

        {/* === Floating coffee beans — cursor reactive === */}
        <div
          ref={beansContainerRef}
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {BEANS.map((bean, i) => (
            <svg
              key={i}
              className="hero-bean"
              viewBox="0 0 40 56"
              style={{
                position: "absolute",
                left: `${bean.x}%`,
                top: `${bean.y}%`,
                width: `${bean.size}px`,
                height: `${bean.size * 1.4}px`,
                transform: `translate(-50%, -50%) rotate(${bean.rotation}deg)`,
                opacity: bean.variant === 0 ? 0.7 : bean.variant === 2 ? 0.5 : 0.6,
              }}
            >
              {/* Coffee bean shape: oval with center crease */}
              <ellipse
                cx="20"
                cy="28"
                rx="16"
                ry="24"
                fill={
                  bean.variant === 0
                    ? "rgba(107, 31, 42, 0.25)"
                    : bean.variant === 2
                      ? "rgba(107, 31, 42, 0.10)"
                      : "none"
                }
                stroke={
                  bean.variant === 1
                    ? "rgba(107, 31, 42, 0.3)"
                    : bean.variant === 3
                      ? "rgba(245, 240, 232, 0.1)"
                      : bean.variant === 0
                        ? "rgba(107, 31, 42, 0.35)"
                        : "rgba(107, 31, 42, 0.15)"
                }
                strokeWidth="1"
              />
              {/* Center crease */}
              <path
                d="M20 6 C16 18, 16 38, 20 50 C24 38, 24 18, 20 6"
                fill="none"
                stroke={
                  bean.variant === 1 || bean.variant === 3
                    ? "rgba(107, 31, 42, 0.2)"
                    : "rgba(107, 31, 42, 0.3)"
                }
                strokeWidth="0.8"
              />
            </svg>
          ))}
        </div>

        {/* === Corner accents === */}
        <div
          className="hero-corner hero-corner-tl"
          style={{
            position: "absolute",
            top: "clamp(2rem, 5vh, 4rem)",
            left: "clamp(2rem, 5vw, 4rem)",
            opacity: 1,
          }}
        >
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "rgba(107,31,42,0.4)",
              marginBottom: "8px",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "rgba(245,240,232,0.25)",
              textTransform: "uppercase",
            }}
          >
            {t("heroEst", lang)}
          </div>
        </div>
        <div
          className="hero-corner hero-corner-tr"
          style={{
            position: "absolute",
            top: "clamp(2rem, 5vh, 4rem)",
            right: "clamp(2rem, 5vw, 4rem)",
            textAlign: "right",
            opacity: 1,
          }}
        >
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "rgba(107,31,42,0.4)",
              marginBottom: "8px",
              marginLeft: "auto",
            }}
          />
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "rgba(245,240,232,0.25)",
              textTransform: "uppercase",
            }}
          >
            {t("heroBlend", lang)}
          </div>
        </div>
        <div
          className="hero-corner hero-corner-bl"
          style={{
            position: "absolute",
            bottom: "clamp(5rem, 10vh, 8rem)",
            left: "clamp(2rem, 5vw, 4rem)",
            opacity: 1,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "rgba(245,240,232,0.2)",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            {t("heroNootropic", lang)}
          </div>
        </div>
        <div
          className="hero-corner hero-corner-br"
          style={{
            position: "absolute",
            bottom: "clamp(5rem, 10vh, 8rem)",
            right: "clamp(2rem, 5vw, 4rem)",
            opacity: 1,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "rgba(245,240,232,0.2)",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
            }}
          >
            {t("heroCornerBR", lang)}
          </div>
        </div>

        {/* === Horizontal rule expanding from center === */}
        <div
          className="hero-rule"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "clamp(200px, 40vw, 500px)",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(107,31,42,0.3), transparent)",
            marginTop: "clamp(8rem, 14vw, 14rem)",
            pointerEvents: "none",
          }}
        />

        {/* === Main text content === */}
        <div
          className="hero-text-reveal"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(245, 240, 232, 0.5)",
            marginBottom: "1.5rem",
          }}
        >
          {t("heroLabel", lang)}
        </div>

        {/* === FLOW wordmark — letter split === */}
        <div
          className="hero-wordmark"
          style={{
            display: "flex",
            gap: "clamp(0.3rem, 1vw, 1rem)",
            marginBottom: "1rem",
            overflow: "visible",
          }}
        >
          {t("heroWordmark", lang).split("").map((letter, i) => (
            <span
              key={i}
              className="hero-letter"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(5rem, 15vw, 16rem)",
                fontWeight: 900,
                lineHeight: lang === "ka" ? 1.1 : 0.85,
                color: "var(--cream)",
                display: "inline-block",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        <h2
          className="hero-text-reveal display-md"
          style={{
            color: "var(--cream)",
            textAlign: "center",
            maxWidth: "90vw",
            marginBottom: "0.5rem",
          }}
        >
          {t("heroTitle", lang)}
        </h2>
        <div
          className="hero-text-reveal"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
            color: "rgba(245, 240, 232, 0.6)",
            marginTop: "1.5rem",
            maxWidth: "28ch",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          {t("heroSubtitle", lang)}
        </div>

        {/* === Scroll indicator === */}
        <div
          className="scroll-indicator"
          style={{
            position: "absolute",
            bottom: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
            opacity: 1,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(245, 240, 232, 0.35)",
            }}
          >
            {t("heroScroll", lang)}
          </span>
          <div
            style={{
              width: "1px",
              height: "40px",
              background:
                "linear-gradient(to bottom, rgba(245,240,232,0.4), transparent)",
              animation: "scrollPulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* ========== SCROLL CONTAINER ========== */}
      <div ref={scrollContainerRef} style={{ position: "relative", zIndex: 3 }}>
        {/* Hero spacer (0-16%) */}
        <div style={{ height: "200vh" }} />

        {/* ===== MARQUEE DIVIDER ===== */}
        <div
          style={{
            height: "20vh",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <div
            ref={marqueeTextRef}
            className="marquee-text"
            style={{
              WebkitTextStroke: "3px var(--cream)",
              fontSize: "clamp(3.2vw, 4.8vw, 6vw)",
              padding: "0 5vw",
            }}
          >
            {t("marqueeText", lang)}
          </div>
        </div>

        {/* ===== SECTION 1: INGREDIENTS (3D tilt, alternating L/R) ===== */}
        <div
          ref={ingredientsRef}
          style={{
            minHeight: "180vh",
            padding: "10vh 0",
            perspective: "1200px",
            background: "rgba(10,10,10,0.85)",
          }}
        >
          <div style={{ padding: "0 5vw", marginBottom: "8vh" }}>
            <span
              className="label"
              style={{ display: "block", marginBottom: "1rem" }}
            >
              {t("ingredientsLabel", lang)}
            </span>
            <h2 className="display-lg" style={{ color: "var(--cream)" }}>
              {t("ingredientsTitle", lang)}
            </h2>
          </div>
          {INGREDIENTS.map((item, i) => (
            <div
              key={i}
              className="ingredient-item"
              style={{
                display: "flex",
                flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                alignItems: "center",
                padding: "8vh 5vw",
                gap: "5vw",
                transformStyle: "preserve-3d",
              }}
            >
              <div style={{ flex: "0 0 40%" }}>
                <span
                  className="ingredient-label label"
                  style={{
                    display: "block",
                    marginBottom: "1rem",
                    color: "var(--maroon-light)",
                  }}
                >
                  {item.label}
                </span>
                <h3
                  className="ingredient-heading"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.5rem, 5vw, 5rem)",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    lineHeight: lang === "ka" ? 1.25 : 0.95,
                    color: "var(--cream)",
                    borderLeft: "3px solid var(--maroon)",
                    paddingLeft: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  {item.name}
                  <span
                    style={{
                      display: "block",
                      fontSize: "clamp(1rem, 2vw, 1.8rem)",
                      fontWeight: 700,
                      color: "var(--maroon-light)",
                      marginTop: "0.3rem",
                    }}
                  >
                    {item.dose}
                  </span>
                </h3>
                <p
                  className="ingredient-desc body-lg"
                  style={{
                    color: "rgba(245,240,232,0.7)",
                    maxWidth: "35ch",
                    marginBottom: "1rem",
                  }}
                >
                  {item.description}
                </p>
                <p
                  className="ingredient-detail"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.35)",
                  }}
                >
                  {item.detail}
                </p>
              </div>
              <div style={{ flex: 1 }} />
            </div>
          ))}
        </div>

        {/* ===== SECTION 2: SCIENCE BEHIND FLOW (scale-up pillars) ===== */}
        <div
          ref={sciencePillarsRef}
          style={{
            minHeight: "160vh",
            padding: "15vh 5vw",
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.85) 50%, rgba(10,10,10,0.9) 100%)",
          }}
        >
          <div className="science-header" style={{ maxWidth: "45vw", marginBottom: "10vh" }}>
            <span
              className="label"
              style={{
                display: "block",
                marginBottom: "1.5rem",
                color: "var(--maroon-light)",
              }}
            >
              {t("scienceLabel", lang)}
            </span>
            <h2
              className="science-section-heading display-lg"
              style={{ color: "var(--cream)", marginBottom: "2rem" }}
            >
              {t("scienceTitle", lang)}
            </h2>
            <p
              className="body-lg science-desc"
              style={{ color: "rgba(245,240,232,0.6)", maxWidth: "38ch" }}
            >
              {t("scienceDesc", lang)}
            </p>
          </div>

          <div
            className="pillars-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "2px",
            }}
          >
            {SCIENCE_PILLARS.map((pillar, i) => (
              <div
                key={i}
                className="science-pillar"
                style={{
                  padding: "clamp(2rem, 4vw, 4rem)",
                  borderLeft:
                    i % 2 === 1 ? "1px solid rgba(107,31,42,0.2)" : "none",
                  borderTop: i >= 2 ? "1px solid rgba(107,31,42,0.2)" : "none",
                }}
              >
                <div
                  className="pillar-icon"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 3vw, 3.5rem)",
                    color: "var(--maroon-light)",
                    marginBottom: "1.5rem",
                    lineHeight: 1,
                  }}
                >
                  {pillar.icon}
                </div>
                <h3
                  className="pillar-title"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    color: "var(--cream)",
                    lineHeight: lang === "ka" ? 1.25 : 1,
                    marginBottom: "0.75rem",
                  }}
                >
                  {pillar.title}
                </h3>
                <div
                  className="pillar-subtitle"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--maroon-light)",
                    marginBottom: "1.5rem",
                  }}
                >
                  {pillar.subtitle}
                </div>
                <p
                  className="pillar-desc body"
                  style={{
                    color: "rgba(245,240,232,0.55)",
                    maxWidth: "32ch",
                    lineHeight: 1.7,
                  }}
                >
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== MARQUEE 2 ===== */}
        <div
          ref={marquee2Ref}
          style={{
            height: "20vh",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            background: "rgba(10,10,10,0.85)",
            padding: "2vh 0",
          }}
        >
          <div
            className="marquee-text"
            style={{
              animation: "marqueeSlide 50s linear infinite",
              animationPlayState: "paused",
              fontSize: "clamp(4vw, 7vw, 9vw)",
              opacity: 0.15,
              lineHeight: 1.1,
            }}
          >
            {marquee2Content}
          </div>
        </div>

        {/* ===== SECTION 3: HOW TO MAKE (slide-right) ===== */}
        <div
          ref={brewRef}
          style={{
            minHeight: "140vh",
            padding: "15vh 0",
            background: "rgba(10,10,10,0.85)",
          }}
        >
          <div style={{ padding: "0 5vw", marginBottom: "10vh" }}>
            <span
              className="label"
              style={{
                display: "block",
                marginBottom: "1.5rem",
                color: "var(--maroon-light)",
              }}
            >
              {t("brewLabel", lang)}
            </span>
            <h2
              className="brew-heading display-lg"
              style={{ color: "var(--cream)" }}
            >
              {t("brewTitle", lang)}
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0",
              paddingLeft: "5vw",
              paddingRight: "5vw",
            }}
          >
            {BREW_STEPS.map((s, i) => (
              <div
                key={i}
                className="brew-step"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "clamp(2rem, 5vw, 5rem)",
                  padding: "clamp(3rem, 5vh, 5rem) 0",
                  borderTop: "1px solid rgba(245,240,232,0.08)",
                  ...(i === BREW_STEPS.length - 1
                    ? { borderBottom: "1px solid rgba(245,240,232,0.08)" }
                    : {}),
                }}
              >
                {/* Step number — large, right-aligned */}
                <div
                  style={{
                    flex: "0 0 clamp(80px, 10vw, 140px)",
                    textAlign: "right",
                    paddingRight: "clamp(1rem, 2vw, 2rem)",
                    borderRight: "2px solid var(--maroon)",
                  }}
                >
                  <span
                    className="brew-step-number"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(3rem, 6vw, 6rem)",
                      fontWeight: 900,
                      color: "rgba(245,240,232,0.08)",
                      lineHeight: 1,
                    }}
                  >
                    {s.step}
                  </span>
                </div>

                {/* Content */}
                <div style={{ flex: 1, maxWidth: "35ch" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "1.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <h3
                      className="brew-step-title"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.8rem, 3vw, 3rem)",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        color: "var(--cream)",
                        lineHeight: lang === "ka" ? 1.25 : 1,
                      }}
                    >
                      {s.title}
                    </h3>
                    <span
                      className="brew-step-duration"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        color: "var(--maroon-light)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.duration}
                    </span>
                  </div>
                  <p
                    className="brew-step-instruction body-lg"
                    style={{
                      color: "rgba(245,240,232,0.8)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {s.instruction}
                  </p>
                  <p
                    className="brew-step-detail body"
                    style={{
                      color: "rgba(245,240,232,0.4)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SECTION 4: TESTIMONIALS (horizontal scroll, pinned) ===== */}
        <div
          ref={testimonialsRef}
          style={{
            height: "150vh",
            overflow: "hidden",
            background: "rgba(10,10,10,0.85)",
          }}
        >
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <div
              ref={testimonialTrackRef}
              style={{
                display: "flex",
                gap: "5vw",
                paddingLeft: "10vw",
                paddingRight: "10vw",
                willChange: "transform",
              }}
            >
              {TESTIMONIALS.map((testimonial, i) => (
                <div
                  key={i}
                  className="testimonial-card"
                  style={{
                    flex: "0 0 60vw",
                    minHeight: "70vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "5vw",
                    borderLeft: "2px solid var(--maroon)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(1.5rem, 3vw, 2.8rem)",
                      fontWeight: 400,
                      fontStyle: "italic",
                      lineHeight: 1.4,
                      color: "var(--cream)",
                      marginBottom: "3rem",
                      maxWidth: "28ch",
                    }}
                  >
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--cream)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {testimonial.author}
                    </div>
                    <div
                      className="label"
                      style={{ color: "var(--maroon-light)" }}
                    >
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== SECTION 5: STATS + SCIENCE DATA (counters + parallax) ===== */}
        <div
          ref={scienceStatsRef}
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "12vh 5vw",
            background: "rgba(10,10,10,0.92)",
            position: "relative",
          }}
        >
          {/* Top — label + heading centered */}
          <div style={{ textAlign: "center", marginBottom: "6rem" }}>
            <span
              className="science-label label"
              style={{
                display: "block",
                marginBottom: "1.5rem",
                color: "var(--maroon-light)",
              }}
            >
              {t("statsLabel", lang)}
            </span>
            <h2
              className="science-heading display-lg"
              style={{ color: "var(--cream)" }}
            >
              {t("statsTitle", lang)}
            </h2>
          </div>

          {/* Stats row — 4 big counters */}
          <div
            className="stats-row"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "2rem",
              marginBottom: "8rem",
              textAlign: "center",
            }}
          >
            {[
              { value: "3", suffix: "X", label: t("stat1Label", lang) },
              { value: "94", suffix: "%", label: t("stat2Label", lang) },
              { value: "12", suffix: "HR", label: t("stat3Label", lang) },
              { value: "0", suffix: "", label: t("stat4Label", lang) },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: "2rem 0",
                  borderLeft: i > 0 ? "1px solid rgba(107,31,42,0.25)" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className="stat-number"
                    data-value={stat.value}
                    data-decimals="0"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(4rem, 7vw, 7rem)",
                      fontWeight: 900,
                      color: "var(--cream)",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </span>
                  {stat.suffix && (
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)",
                        fontWeight: 700,
                        color: "var(--maroon-light)",
                        marginLeft: "0.2rem",
                      }}
                    >
                      {stat.suffix}
                    </span>
                  )}
                </div>
                <span
                  className="label"
                  style={{
                    marginTop: "1rem",
                    display: "block",
                    color: "rgba(245,240,232,0.4)",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "var(--maroon)",
              margin: "0 auto 4rem",
            }}
          />

          {/* Bottom — 5 ingredients strip */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span className="label" style={{ color: "var(--maroon-light)" }}>
              {t("statsInsideLabel", lang)}
            </span>
          </div>
          <div
            className="ingredients-strip"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "1.5rem",
            }}
          >
            {[
              {
                name: t("statsIng1Name", lang),
                dose: "500",
                unit: "MG",
                desc: t("statsIng1Desc", lang),
              },
              {
                name: t("statsIng2Name", lang),
                dose: "200",
                unit: "MG",
                desc: t("statsIng2Desc", lang),
              },
              {
                name: t("statsIng3Name", lang),
                dose: "500",
                unit: "MG",
                desc: t("statsIng3Desc", lang),
              },
              {
                name: t("statsIng4Name", lang),
                dose: "200",
                unit: "MG",
                desc: t("statsIng4Desc", lang),
              },
              {
                name: t("statsIng5Name", lang),
                dose: "5",
                unit: "G",
                desc: t("statsIng5Desc", lang),
              },
            ].map((ing, i) => (
              <div
                key={i}
                style={{
                  padding: "2rem 1.5rem",
                  borderTop: "2px solid var(--maroon)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    className="stat-number"
                    data-value={ing.dose}
                    data-decimals="0"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
                      fontWeight: 900,
                      color: "var(--cream)",
                      lineHeight: 1,
                    }}
                  >
                    {ing.dose}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(0.8rem, 1.2vw, 1.2rem)",
                      fontWeight: 700,
                      color: "var(--maroon-light)",
                      marginLeft: "0.2rem",
                    }}
                  >
                    {ing.unit}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(0.75rem, 1vw, 0.95rem)",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--cream)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {ing.name}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(0.7rem, 0.9vw, 0.85rem)",
                    color: "rgba(245,240,232,0.45)",
                    lineHeight: 1.5,
                  }}
                >
                  {ing.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Black background zone — covers canvas for FAQ + Footer ===== */}
        <div
          style={{
            position: "relative",
            zIndex: 4,
            background: "var(--black)",
          }}
        >
          {/* ===== SECTION 6: FAQ (accordion + sticky illustration) ===== */}
          <div
            ref={faqRef}
            className="faq-section"
            style={{
              minHeight: "100vh",
              padding: "15vh 5vw",
              display: "flex",
              gap: "5vw",
              alignItems: "center",
            }}
          >
            {/* Left — accordion */}
            <div className="faq-left" style={{ flex: "1 1 55%" }}>
              <h2
                className="faq-heading display-lg"
                style={{ color: "var(--cream)", marginBottom: "5rem" }}
              >
                {t("faqTitle1", lang)}
                <br />
                {t("faqTitle2", lang)}
              </h2>

              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="faq-item"
                  style={{
                    borderTop: "1px solid rgba(245,240,232,0.1)",
                    ...(i === FAQS.length - 1
                      ? { borderBottom: "1px solid rgba(245,240,232,0.1)" }
                      : {}),
                  }}
                >
                  <button
                    className="faq-question"
                    aria-expanded={openFaq === i}
                    onClick={() => toggleFaq(i)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      padding: "1.8rem 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      color: "var(--cream)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                        paddingRight: "2rem",
                      }}
                    >
                      {faq.q}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        color: "var(--maroon-light)",
                        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        transform:
                          openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                        flexShrink: 0,
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: openFaq === i ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      opacity: openFaq === i ? 1 : 0,
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <p
                        className="body"
                        style={{
                          color: "rgba(245,240,232,0.6)",
                          paddingBottom: "1.8rem",
                          maxWidth: "50ch",
                          lineHeight: 1.7,
                        }}
                      >
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — sticky coffee cup illustration, centered to left side */}
            <div
              className="faq-right"
              style={{
                flex: "1 1 40%",
                position: "sticky",
                top: "15vh",
                height: "fit-content",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "420px",
                }}
              >
                {/* Coffee cup SVG — large */}
                <svg
                  viewBox="0 0 200 220"
                  width="100%"
                  height="100%"
                  style={{ overflow: "visible" }}
                >
                  {/* Steam lines */}
                  <path
                    d="M70 50 Q75 30 70 10"
                    fill="none"
                    stroke="rgba(107,31,42,0.35)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  >
                    <animate
                      attributeName="d"
                      values="M70 50 Q75 30 70 10;M70 50 Q65 25 70 5;M70 50 Q75 30 70 10"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.3;0.7;0.3"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <path
                    d="M100 45 Q105 25 100 5"
                    fill="none"
                    stroke="rgba(107,31,42,0.3)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  >
                    <animate
                      attributeName="d"
                      values="M100 45 Q105 25 100 5;M100 45 Q95 20 100 0;M100 45 Q105 25 100 5"
                      dur="3.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.25;0.6;0.25"
                      dur="3.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <path
                    d="M130 50 Q135 30 130 10"
                    fill="none"
                    stroke="rgba(107,31,42,0.25)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  >
                    <animate
                      attributeName="d"
                      values="M130 50 Q135 30 130 10;M130 50 Q125 25 130 5;M130 50 Q135 30 130 10"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.2;0.5;0.2"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </path>

                  {/* Cup body */}
                  <path
                    d="M40 60 L45 170 Q50 190 100 190 Q150 190 155 170 L160 60 Z"
                    fill="none"
                    stroke="rgba(245,240,232,0.18)"
                    strokeWidth="1.5"
                  />
                  {/* Coffee surface */}
                  <ellipse
                    cx="100"
                    cy="62"
                    rx="60"
                    ry="12"
                    fill="rgba(107,31,42,0.15)"
                    stroke="rgba(107,31,42,0.3)"
                    strokeWidth="1"
                  />
                  {/* Cup handle */}
                  <path
                    d="M160 85 Q190 85 190 120 Q190 155 160 155"
                    fill="none"
                    stroke="rgba(245,240,232,0.15)"
                    strokeWidth="1.5"
                  />
                  {/* Saucer */}
                  <ellipse
                    cx="100"
                    cy="195"
                    rx="80"
                    ry="14"
                    fill="none"
                    stroke="rgba(245,240,232,0.12)"
                    strokeWidth="1"
                  />
                </svg>

                {/* Floating beans around the cup */}
                {[
                  { x: "5%", y: "8%", size: 28, rot: -30, dur: 3 },
                  { x: "82%", y: "22%", size: 24, rot: 45, dur: 3.6 },
                  { x: "8%", y: "60%", size: 22, rot: 15, dur: 4 },
                  { x: "85%", y: "65%", size: 26, rot: -60, dur: 3.3 },
                  { x: "42%", y: "90%", size: 20, rot: 25, dur: 3.8 },
                  { x: "65%", y: "5%", size: 18, rot: -15, dur: 4.2 },
                  { x: "20%", y: "35%", size: 16, rot: 70, dur: 3.4 },
                ].map((bean, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    width={bean.size}
                    height={bean.size}
                    style={{
                      position: "absolute",
                      left: bean.x,
                      top: bean.y,
                      transform: `rotate(${bean.rot}deg)`,
                      opacity: 0.25,
                      animation: `faqBeanFloat ${bean.dur}s ease-in-out ${i * 0.3}s infinite alternate`,
                    }}
                  >
                    <ellipse
                      cx="12"
                      cy="12"
                      rx="8"
                      ry="11"
                      fill="none"
                      stroke="rgba(107,31,42,0.5)"
                      strokeWidth="1"
                    />
                    <path
                      d="M12 3 Q9 12 12 21"
                      fill="none"
                      stroke="rgba(107,31,42,0.4)"
                      strokeWidth="0.8"
                    />
                  </svg>
                ))}

                {/* Label under illustration */}
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                  <div
                    className="label"
                    style={{
                      color: "rgba(107,31,42,0.6)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {t("faqCraftedLabel", lang)}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(0.85rem, 1vw, 1rem)",
                      color: "rgba(245,240,232,0.35)",
                      lineHeight: 1.6,
                    }}
                  >
                    {t("faqCraftedDesc1", lang)}
                    <br />
                    {t("faqCraftedDesc2", lang)}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ===== SECTION 7: FOOTER/CTA ===== */}
          <div
            ref={footerRef}
            data-persist="true"
            style={{
              minHeight: "50vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3rem",
              padding: "10vh 5vw",
              textAlign: "center",
            }}
          >
            <div
              className="footer-brand display-xl"
              style={{ color: "var(--cream)" }}
            >
              {t("footerBrand", lang)}
            </div>
            <button
              className="footer-cta"
              style={{
                display: "inline-block",
                padding: "1.2rem 3.5rem",
                background: "var(--maroon)",
                color: "var(--cream)",
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.3s ease, background 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = "scale(1.05)";
                (e.target as HTMLElement).style.background =
                  "var(--maroon-light)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = "scale(1)";
                (e.target as HTMLElement).style.background = "var(--maroon)";
              }}
            >
              {t("footerCta", lang)}
            </button>
            <div
              className="footer-copy"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,0.25)",
                marginTop: "2rem",
              }}
            >
              {t("footerCopy", lang)}
            </div>
          </div>

          {/* Close black background zone */}
        </div>
      </div>

      {/* Language toggle */}
      <button
        onClick={() => setLang(lang === "en" ? "ka" : "en")}
        style={{
          position: "fixed",
          top: "2rem",
          right: "2rem",
          zIndex: 10001,
          background: "var(--maroon)",
          color: "var(--cream)",
          fontFamily: "var(--font-display)",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          padding: "0.5rem 1rem",
          border: "1px solid rgba(245,240,232,0.2)",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
      >
        {lang === "en" ? "GE" : "EN"}
      </button>

    </>
  );
}
