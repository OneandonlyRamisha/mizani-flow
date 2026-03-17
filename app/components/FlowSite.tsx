"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { type Lang, t } from "./translations";

import CustomCursor from "@/components/cursor/customCursor";
import LanguageToggle from "@/components/languageToggle/languageToggle";
import Hero, { BEANS } from "@/sections/hero/hero";
import Ingredients from "@/sections/ingredients/ingredients";
import Science from "@/sections/science/science";
import Brew from "@/sections/brew/brew";
import Testimonials from "@/sections/testimonials/testimonials";
import Stats from "@/sections/stats/stats";
import Faq from "@/sections/faq/faq";
import Footer from "@/sections/footer/footer";

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
  { dir: "/frames", count: 121 },
  { dir: "/frames2", count: 121 },
  { dir: "/frames3", count: 121 },
];

export default function FlowSite() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const marqueeTextRef = useRef<HTMLDivElement>(null);
  const marquee2Ref = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const scienceRef = useRef<HTMLDivElement>(null);
  const brewRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
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

  // Sync lang attribute on <html> for CSS selectors
  useEffect(() => {
    document.documentElement.lang = lang;
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

    const viewW = Math.ceil(window.innerWidth * dpr);
    const viewH = Math.ceil(window.innerHeight * dpr);
    const downsizeFrame = (img: HTMLImageElement): FrameSource => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const s = Math.min(viewW / iw, viewH / ih, 1);
      if (s >= 0.95) return img;
      const w = Math.round(iw * s);
      const h = Math.round(ih * s);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      return c;
    };

    const isMobile = window.innerWidth <= 768;
    const frameStep = isMobile ? 2 : 1;
    const allFramePaths: string[] = [];
    for (const seq of FRAME_SEQUENCES) {
      for (let i = 1; i <= seq.count; i += frameStep) {
        allFramePaths.push(`${seq.dir}/frame_${String(i).padStart(4, "0")}.webp`);
      }
    }

    let cancelled = false;

    (async () => {
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

  // Main scroll + animation orchestration
  useEffect(() => {
    const canvas = canvasRef.current;
    const scrollContainer = scrollContainerRef.current;
    const hero = heroRef.current;
    const canvasWrap = canvasWrapRef.current;
    if (!canvas || !scrollContainer || !hero || !canvasWrap) return;

    canvasWrap.style.willChange = "clip-path";

    // Lenis smooth scroll
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(500, 33);

    // === HERO ELEMENTS ===
    const rings = hero.querySelectorAll(".hero-ring");
    const particles = hero.querySelectorAll(".hero-particle");
    const beans = hero.querySelectorAll(".hero-bean");

    const heroLoopTweens: gsap.core.Tween[] = [];
    rings.forEach((ring, i) => {
      heroLoopTweens.push(gsap.to(ring, {
        scale: 1.04, opacity: 0.6, duration: 3 + i * 0.5,
        repeat: -1, yoyo: true, ease: "sine.inOut", paused: true,
      }));
    });
    particles.forEach((p, i) => {
      heroLoopTweens.push(gsap.to(p, {
        y: `${(i % 2 === 0 ? -1 : 1) * (15 + (i % 7) * 5)}px`,
        x: `${(i % 3 === 0 ? -1 : 1) * (10 + (i % 5) * 3)}px`,
        duration: 4 + (i % 4) * 2, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true,
      }));
    });
    beans.forEach((bean, i) => {
      const beanData = BEANS[i];
      if (!beanData) return;
      heroLoopTweens.push(gsap.to(bean, {
        y: `${(i % 2 === 0 ? -1 : 1) * (8 + (i % 5) * 4)}px`,
        x: `${(i % 3 === 0 ? -1 : 1) * (6 + (i % 4) * 3)}px`,
        rotation: `+=${(i % 2 === 0 ? 1 : -1) * (8 + (i % 3) * 5)}`,
        duration: 5 + (i % 4) * 2, repeat: -1, yoyo: true, ease: "sine.inOut", paused: true,
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

    const REPEL_RADIUS = 200;
    const REPEL_STRENGTH = 50;
    const beanOffsets = beanElements.map(() => ({ x: 0, y: 0, rot: 0 }));
    const beanTickerId = gsap.ticker.add(() => {
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

    // === LOADER ===
    const loader = document.getElementById("site-loader");
    let loaderCheckInterval: ReturnType<typeof setInterval> | null = null;
    let loaderFadeTimer: ReturnType<typeof setTimeout> | null = null;
    const startLoopTweens = () => heroLoopTweens.forEach((tw) => tw.play());
    if (loader) {
      const loadStart = (window as unknown as Record<string, number>).__LOAD_START || Date.now();
      const dismissLoader = () => {
        loader.style.transition = "opacity 0.6s ease";
        loader.style.opacity = "0";
        loaderFadeTimer = setTimeout(() => { loader.style.display = "none"; }, 600);
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

    if (!ctxRef.current) ctxRef.current = canvas.getContext("2d");

    let heroTweensPaused = false;

    // === HERO: circle-wipe + frame scrubbing ===
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        const heroOp = Math.max(0, 1 - p * 8);
        heroVisibleRef.current = heroOp > 0;
        if (heroOp > 0) {
          hero.style.opacity = String(heroOp);
          if (heroTweensPaused) {
            heroLoopTweens.forEach((tw) => tw.resume());
            heroTweensPaused = false;
          }
        } else {
          if (hero.style.opacity !== "0") hero.style.opacity = "0";
          if (!heroTweensPaused) {
            heroLoopTweens.forEach((tw) => tw.pause());
            heroTweensPaused = true;
          }
        }

        const wipeProgress = Math.min(1, Math.max(0, p / 0.15));
        if (canvasWrap)
          canvasWrap.style.clipPath = `circle(${wipeProgress * 75}% at 50% 50%)`;

        const totalLoaded = framesRef.current.length;
        const index = Math.min(Math.floor(p * (totalLoaded - 1)), totalLoaded - 1);
        if (index !== currentFrameRef.current) {
          currentFrameRef.current = index;
          const colorKey = Math.round(index / 30) * 30;
          const precomputed = bgColorsRef.current.get(colorKey);
          if (precomputed) bgColorRef.current = precomputed;
          drawFrame(index);
        }
      },
    });

    // Scroll indicator fades out
    const scrollIndicatorEl = hero.querySelector(".scroll-indicator");
    if (scrollIndicatorEl) {
      gsap.to(scrollIndicatorEl, {
        opacity: 0,
        scrollTrigger: { trigger: scrollContainer, start: "top top", end: "3% top", scrub: true },
      });
    }

    // === MARQUEE 1 ===
    if (marqueeTextRef.current) {
      gsap.fromTo(
        marqueeTextRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)", ease: "power3.inOut",
          scrollTrigger: { trigger: marqueeTextRef.current, start: "top 90%", end: "top 40%", scrub: true },
        },
      );
    }

    // === MARQUEE 2: pause CSS animation when offscreen ===
    if (marquee2Ref.current) {
      const marquee2El = marquee2Ref.current.querySelector(".marquee-text") as HTMLElement;
      if (marquee2El) {
        ScrollTrigger.create({
          trigger: marquee2Ref.current,
          start: "top bottom", end: "bottom top",
          onEnter: () => { marquee2El.style.animationPlayState = "running"; },
          onLeave: () => { marquee2El.style.animationPlayState = "paused"; },
          onEnterBack: () => { marquee2El.style.animationPlayState = "running"; },
          onLeaveBack: () => { marquee2El.style.animationPlayState = "paused"; },
        });
      }
    }

    // === INGREDIENTS: 3D perspective tilt ===
    if (ingredientsRef.current) {
      const items = ingredientsRef.current.querySelectorAll(".ingredient-item");
      items.forEach((item, i) => {
        const isLeft = i % 2 === 0;
        const children = item.querySelectorAll(".ingredient-label, .ingredient-heading, .ingredient-desc, .ingredient-detail");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: "top 85%", end: "top 35%", scrub: true },
        });
        tl.fromTo(item, { rotateX: 15, rotateY: isLeft ? -10 : 10, opacity: 0 }, { rotateX: 0, rotateY: 0, opacity: 1, ease: "power3.out" }, 0);
        tl.fromTo(children, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, ease: "power3.out" }, 0.1);
      });
    }

    // === SCIENCE PILLARS: manifesto reveal ===
    if (scienceRef.current) {
      const pillars = scienceRef.current.querySelectorAll(".science-pillar");
      pillars.forEach((pillar, i) => {
        const isReversed = i % 2 === 1;
        const icon = pillar.querySelector(".pillar-icon");
        const title = pillar.querySelector(".pillar-title");
        const rule = pillar.querySelector(".pillar-rule");
        const subtitle = pillar.querySelector(".pillar-subtitle");
        const desc = pillar.querySelector(".pillar-desc");
        const stat = pillar.querySelector(".pillar-stat");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: pillar, start: "top 85%", end: "top 35%", scrub: true },
        });
        // Watermark number fades in
        if (icon) tl.fromTo(icon, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, ease: "power2.out" }, 0);
        // Title clip-path reveal — synced with rule line so last letter appears when line finishes
        if (title) {
          const clipFrom = isReversed ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
          const clipTo = "inset(0 0% 0 0%)";
          tl.fromTo(title, { clipPath: clipFrom, opacity: 0 }, { clipPath: clipTo, opacity: 1, duration: 0.5, ease: "power3.inOut" }, 0.05);
        }
        // Rule line extends — same start and duration as title
        if (rule) {
          tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.inOut" }, 0.05);
        }
        // Subtitle, description, stat fade up staggered
        if (subtitle) tl.fromTo(subtitle, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out" }, 0.3);
        if (desc) tl.fromTo(desc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out" }, 0.38);
        if (stat) tl.fromTo(stat, { y: 20, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out" }, 0.46);
      });

      const sciHeading = scienceRef.current.querySelector(".science-section-heading");
      if (sciHeading) {
        gsap.fromTo(sciHeading,
          { clipPath: "inset(100% 0 0 0)", opacity: 0 },
          { clipPath: "inset(0% 0 0 0)", opacity: 1, ease: "power4.inOut",
            scrollTrigger: { trigger: scienceRef.current, start: "top 80%", end: "top 55%", scrub: true },
          },
        );
      }
    }

    // === BREW: slide-right stagger ===
    if (brewRef.current) {
      const heading = brewRef.current.querySelector(".brew-heading");
      if (heading) {
        gsap.fromTo(heading, { x: -80, opacity: 0 }, {
          x: 0, opacity: 1, ease: "power3.out",
          scrollTrigger: { trigger: brewRef.current, start: "top 80%", end: "top 55%", scrub: true },
        });
      }
      const steps = brewRef.current.querySelectorAll(".brew-step");
      steps.forEach((step) => {
        const children = step.querySelectorAll(".brew-step-number, .brew-step-title, .brew-step-instruction, .brew-step-detail, .brew-step-duration");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: step, start: "top 85%", end: "top 50%", scrub: true },
        });
        tl.fromTo(step, { x: 80, opacity: 0 }, { x: 0, opacity: 1, ease: "power3.out" }, 0);
        tl.fromTo(children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, ease: "power3.out" }, 0.1);
      });
    }

    // === TESTIMONIALS: horizontal scroll ===
    if (testimonialsRef.current) {
      const track = testimonialsRef.current.querySelector(".testimonial-track") as HTMLElement;
      if (track) {
        const trackWidth = track.scrollWidth;
        const viewWidth = window.innerWidth;
        const distanceToScroll = trackWidth - viewWidth;
        gsap.to(track, {
          x: -distanceToScroll, ease: "none",
          scrollTrigger: { trigger: testimonialsRef.current, start: "top top", end: `+=${distanceToScroll}`, pin: true, scrub: 1 },
        });
      }
    }

    // === STATS: counters + parallax ===
    if (statsRef.current) {
      const statNumbers = statsRef.current.querySelectorAll(".stat-number");
      statNumbers.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const target = parseFloat(htmlEl.dataset.value || "0");
        const decimals = parseInt(htmlEl.dataset.decimals || "0");
        htmlEl.textContent = "0";
        gsap.to(htmlEl, {
          textContent: target, duration: 2, ease: "power1.out",
          snap: { textContent: decimals === 0 ? 1 : 0.01 },
          scrollTrigger: { trigger: statsRef.current, start: "top 70%", toggleActions: "play none none none" },
        });
      });

      const scienceTexts = statsRef.current.querySelectorAll(".science-label, .science-heading, .science-body, .stats-row");
      gsap.fromTo(scienceTexts, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: statsRef.current, start: "top 65%", end: "top 30%", scrub: true },
      });
    }

    // === FAQ: stagger-up ===
    if (faqRef.current) {
      const faqItems = faqRef.current.querySelectorAll(".faq-item");
      gsap.fromTo(faqItems, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: faqRef.current, start: "top 75%", end: "top 40%", scrub: true },
      });
      const faqHeading = faqRef.current.querySelector(".faq-heading");
      if (faqHeading) {
        gsap.fromTo(faqHeading,
          { clipPath: "inset(100% 0 0 0)", opacity: 0 },
          { clipPath: "inset(0% 0 0 0)", opacity: 1, ease: "power4.inOut",
            scrollTrigger: { trigger: faqRef.current, start: "top 80%", end: "top 55%", scrub: true },
          },
        );
      }
    }

    // === FOOTER: fade-in ===
    if (footerRef.current) {
      const footerEls = footerRef.current.querySelectorAll(".footer-brand, .footer-cta, .footer-copy");
      gsap.fromTo(footerEls, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: footerRef.current, start: "top 80%", toggleActions: "play none none none" },
      });
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
            cursor.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%))`;
            cursorRafId = 0;
          });
        }
      };
      window.addEventListener("mousemove", moveCursor, { passive: true });

      const hoverTargets = document.querySelectorAll("a, button, .faq-question");
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

  const marquee2Content = useMemo(() => t("marquee2Text", lang).repeat(10), [lang]);

  return (
    <>
      <CustomCursor ref={cursorRef} />

      {/* Canvas (fixed behind everything) */}
      <div
        ref={canvasWrapRef}
        style={{ position: "fixed", inset: 0, zIndex: 1, clipPath: "circle(0% at 50% 50%)" }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100vw", height: "100vh", clipPath: "inset(0 0 20px 0)" }}
        />
      </div>

      <Hero ref={heroRef} lang={lang} />

      {/* Scroll container */}
      <div ref={scrollContainerRef} style={{ position: "relative", zIndex: 3 }}>
        {/* Hero spacer */}
        <div style={{ height: "200vh" }} />

        {/* Marquee divider */}
        <div className="marquee-divider" style={{ height: "20vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div
            ref={marqueeTextRef}
            className="marquee-text"
            style={{ WebkitTextStroke: "3px var(--cream)", fontSize: "clamp(3.2vw, 4.8vw, 6vw)", padding: "0 5vw" }}
          >
            {t("marqueeText", lang)}
          </div>
        </div>

        {/* Unified dark overlay — single background for all content sections */}
        <div style={{ background: "rgba(10, 10, 10, 0.88)" }}>
          <Ingredients ref={ingredientsRef} lang={lang} />
          <Science ref={scienceRef} lang={lang} />

          {/* Marquee 2 */}
          <div
            ref={marquee2Ref}
            style={{ height: "20vh", display: "flex", alignItems: "center", overflow: "hidden", padding: "2vh 0" }}
          >
            <div
              className="marquee-text"
              style={{ animation: "marqueeSlide 50s linear infinite", animationPlayState: "paused", fontSize: "clamp(4vw, 7vw, 9vw)", opacity: 0.15, lineHeight: 1.1 }}
            >
              {marquee2Content}
            </div>
          </div>

          <Brew ref={brewRef} lang={lang} />
          <Testimonials ref={testimonialsRef} lang={lang} />
          <Stats ref={statsRef} lang={lang} />

          {/* Black background zone — covers canvas for FAQ + Footer */}
          <div style={{ position: "relative", zIndex: 4, background: "var(--black)" }}>
            <Faq ref={faqRef} lang={lang} />
            <Footer ref={footerRef} lang={lang} />
          </div>
        </div>
      </div>

      <LanguageToggle lang={lang} onToggle={() => setLang(lang === "en" ? "ka" : "en")} />
    </>
  );
}
