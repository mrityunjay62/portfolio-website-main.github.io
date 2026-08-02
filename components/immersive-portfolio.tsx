'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioContent, type Project } from '@/content.config';

gsap.registerPlugin(ScrollTrigger);

const directoryItems = [
  { id: 'lobby', label: 'Lobby' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

const roleCycle = portfolioContent.visitor.roles;

export default function ImmersivePortfolio() {
  const introTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const mansionRef = useRef<HTMLDivElement | null>(null);
  const lightsRef = useRef<HTMLDivElement | null>(null);
  const leftDoorRef = useRef<HTMLDivElement | null>(null);
  const rightDoorRef = useRef<HTMLDivElement | null>(null);
  const introOverlayRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);

  const [visitor, setVisitor] = useState({ name: '', purpose: 'Recruiter' });
  const [entered, setEntered] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeRoom, setActiveRoom] = useState('lobby');
  const [roleIndex, setRoleIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedVisitor = sessionStorage.getItem('portfolio-visitor');
    const introPlayed = sessionStorage.getItem('portfolio-intro-played');

    if (storedVisitor) {
      const parsed = JSON.parse(storedVisitor) as { name: string; purpose: string };
      setVisitor(parsed);
      setEntered(true);
    } else if (introPlayed) {
      setShowForm(true);
    } else {
      setShowIntro(true);
    }
  }, []);

  useEffect(() => {
    if (!entered || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.room-panel').forEach((room, index) => {
        gsap.fromTo(
          room,
          { autoAlpha: 0, y: 36, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: room,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          },
        );

        gsap.fromTo(
          room.querySelectorAll('.reveal-item'),
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.7,
            delay: 0.15 + index * 0.04,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: room,
              start: 'top 88%',
            },
          },
        );
      });
    });

    return () => ctx.kill();
  }, [entered, selectedProject]);

  useEffect(() => {
    if (!entered) return;

    const interval = window.setInterval(() => {
      setRoleIndex((value) => (value + 1) % roleCycle.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [entered]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveRoom(visible.target.id);
        }
      },
      { threshold: [0.35, 0.65] },
    );

    const targets = directoryItems.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    const timer = window.setTimeout(() => setShowSkip(true), 1000);

    introTimelineRef.current = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    const timeline = introTimelineRef.current;

    timeline
      .set(introOverlayRef.current, { opacity: 1, pointerEvents: 'all' })
      .to(mansionRef.current, { scale: 1.12, y: -20, duration: 2.2, ease: 'power2.out' }, 0)
      .to(lightsRef.current, { opacity: 1, scale: 1.06, duration: 2.1, ease: 'power2.out' }, 0)
      .to(leftDoorRef.current, { rotateY: -80, transformOrigin: 'left center', duration: 1.2, ease: 'expo.out' }, 1.8)
      .to(rightDoorRef.current, { rotateY: 80, transformOrigin: 'right center', duration: 1.2, ease: 'expo.out' }, 1.8)
      .to(lightsRef.current, { scale: 1.45, opacity: 1.2, duration: 0.9, ease: 'power2.out' }, 2.1)
      .to(introOverlayRef.current, { opacity: 0.08, duration: 0.5, ease: 'power2.in' }, 3.1)
      .to(introOverlayRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 3.5)
      .call(() => {
        sessionStorage.setItem('portfolio-intro-played', 'true');
        setShowForm(true);
        setShowIntro(false);
      }, undefined, 4.3);

    return () => {
      window.clearTimeout(timer);
      timeline.kill();
    };
  }, [showIntro]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!visitor.name.trim()) return;

    sessionStorage.setItem('portfolio-visitor', JSON.stringify(visitor));
    setShowForm(false);
    setEntered(true);
  };

  const handleSkipIntro = () => {
    sessionStorage.setItem('portfolio-intro-played', 'true');
    introTimelineRef.current?.kill();
    setShowSkip(false);
    setShowIntro(false);
    setShowForm(true);
  };

  const toggleSound = async () => {
    if (typeof window === 'undefined') return;

    const enabled = !audioEnabled;
    setAudioEnabled(enabled);

    if (!enabled) {
      audioGainRef.current?.disconnect();
      audioContextRef.current?.close();
      audioContextRef.current = null;
      audioGainRef.current = null;
      return;
    }

    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;

    const audioContext = new AudioCtor();
    const gainNode = audioContext.createGain();
    const oscillator = audioContext.createOscillator();
    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(160, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(90, audioContext.currentTime + 1.6);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, audioContext.currentTime);

    lfo.type = 'sine';
    lfo.frequency.value = 0.5;
    lfoGain.gain.value = 12;

    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.04, audioContext.currentTime + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.8);

    oscillator.connect(filter);
    filter.connect(gainNode);
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    lfo.start();

    audioContextRef.current = audioContext;
    audioGainRef.current = gainNode;

    window.setTimeout(() => {
      oscillator.stop();
      lfo.stop();
    }, 1800);
  };

  const greetingName = useMemo(() => visitor.name.trim() || 'Guest', [visitor.name]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="fixed left-0 top-0 z-30 hidden h-screen w-[220px] border-r border-cyan-400/15 bg-slate-950/75 px-4 py-6 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="mb-6 text-xs uppercase tracking-[0.42em] text-cyan-200">Floorplan</div>
        <nav className="space-y-2">
          {directoryItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`block w-full rounded-full px-3 py-2 text-left text-xs font-medium tracking-[0.18em] uppercase transition ${
                activeRoom === item.id ? 'bg-cyan-400/20 text-cyan-200' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <button
        type="button"
        onClick={() => setMenuOpen((value) => !value)}
        className="fixed right-4 top-4 z-40 inline-flex rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100 backdrop-blur-xl lg:hidden"
      >
        Menu
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed right-4 top-16 z-40 w-[220px] rounded-[24px] border border-white/10 bg-slate-950/85 p-3 backdrop-blur-xl lg:hidden"
          >
            {directoryItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`block w-full rounded-full px-3 py-2 text-left text-xs font-medium tracking-[0.18em] uppercase transition ${
                  activeRoom === item.id ? 'bg-cyan-400/20 text-cyan-200' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntro && (
          <motion.div
            ref={introOverlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-hidden bg-black"
          >
            {showSkip && (
              <button
                type="button"
                onClick={handleSkipIntro}
                className="absolute right-4 top-4 z-20 rounded-full border border-cyan-400/30 bg-slate-950/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100 backdrop-blur"
              >
                Skip Intro ▶
              </button>
            )}

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_45%)]" />
            <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:18px_18px]" />

            <div
              ref={mansionRef}
              className="absolute left-1/2 top-1/2 flex h-[44vh] w-[70vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            >
              <div className="relative h-full w-full rounded-[32px] border border-cyan-400/10 bg-slate-900/20 shadow-[0_0_55px_rgba(32,192,255,0.12)]">
                <div className="absolute left-1/2 top-1/2 h-[72%] w-[53%] -translate-x-1/2 -translate-y-[42%] rounded-t-[12px] bg-slate-800/95 shadow-[0_0_40px_rgba(34,211,238,0.08)]" />
                <div className="absolute left-[14%] top-[18%] h-[36%] w-[72%] border-t border-cyan-400/20 bg-slate-950/70" />
                <div className="absolute left-[18%] top-[18%] h-[54%] w-[10%] rounded-t-[10px] border border-cyan-400/20 bg-slate-900/80" />
                <div className="absolute right-[18%] top-[18%] h-[54%] w-[10%] rounded-t-[10px] border border-cyan-400/20 bg-slate-900/80" />
                <div className="absolute left-[15%] top-[36%] h-[26%] w-[70%] rounded-t-[12px] border border-cyan-400/15 bg-slate-950/80" />
                <div className="absolute top-[44%] h-[32%] w-[21%] rounded-t-[12px] border border-cyan-400/15 bg-slate-900/70" />
                <div className="absolute right-[15%] top-[44%] h-[32%] w-[21%] rounded-t-[12px] border border-cyan-400/15 bg-slate-900/70" />
                <div className="absolute bottom-[24%] h-[22%] w-[38%] rounded-[16px] bg-slate-950/90 shadow-[0_0_45px_rgba(245,158,11,0.08)]" />
                <div className="absolute bottom-[24%] left-[11%] h-[22%] w-[35%] rounded-[16px] ">
                  <div ref={leftDoorRef} className="absolute inset-0 rounded-[16px] border border-amber-300/35 bg-gradient-to-br from-amber-200/60 to-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.25)]" />
                </div>
                <div className="absolute bottom-[24%] right-[11%] h-[22%] w-[35%] rounded-[16px]">
                  <div ref={rightDoorRef} className="absolute inset-0 rounded-[16px] border border-amber-300/35 bg-gradient-to-br from-amber-200/60 to-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.25)]" />
                </div>
                <div ref={lightsRef} className="absolute left-1/2 top-[30%] h-[40%] w-[44%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,248,220,0.95)_0%,rgba(251,191,36,0.65)_30%,rgba(34,211,238,0.25)_55%,transparent_80%)] blur-[8px] opacity-0" />
                <div className="absolute left-[28%] top-[52%] h-[16%] w-[6%] rounded-full bg-cyan-200/55 blur-[6px]" />
                <div className="absolute right-[28%] top-[52%] h-[16%] w-[6%] rounded-full bg-cyan-200/55 blur-[6px]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && !entered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg rounded-[28px] border border-cyan-400/25 bg-slate-900/90 p-8 shadow-[0_0_65px_rgba(34,211,238,0.12)] backdrop-blur-xl"
            >
              <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400 text-xl font-bold text-slate-950">
                  MK
                </div>
                <p className="text-xs uppercase tracking-[0.42em] text-cyan-200">Reception Desk</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm text-slate-200">
                  <span className="mb-2 block">Visitor Name</span>
                  <input
                    required
                    value={visitor.name}
                    onChange={(e) => setVisitor({ ...visitor, name: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    placeholder="Enter your name"
                  />
                </label>

                <label className="block text-sm text-slate-200">
                  <span className="mb-2 block">Purpose of Visit</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Recruiter', 'Client', 'Just Exploring'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setVisitor({ ...visitor, purpose: option })}
                        className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                          visitor.purpose === option
                            ? 'border-cyan-300 bg-cyan-400/15 text-cyan-100'
                            : 'border-white/10 bg-slate-950 text-slate-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </label>

                <div className="flex items-center gap-2">
                  <button type="submit" className="flex-1 rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
                    Enter
                  </button>
                  <button
                    type="button"
                    onClick={toggleSound}
                    className="rounded-full border border-white/15 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white"
                  >
                    {audioEnabled ? 'Mute' : 'Sound'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 lg:pl-[220px]">
        <section id="lobby" className="room-panel min-h-screen px-4 py-10 lg:px-12 lg:py-16">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="reveal-item space-y-6">
              <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100">
                Welcome, {greetingName}
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
                  {portfolioContent.visitor.name}
                </h1>
                <div className="h-8 text-lg text-cyan-200 md:text-xl">
                  {roleCycle[roleIndex]}
                </div>
                <p className="max-w-2xl text-base text-slate-300 md:text-lg">
                  {portfolioContent.visitor.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('about')}
                  className="rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
                >
                  Begin the Tour
                </button>
                <a
                  href={`mailto:${portfolioContent.visitor.email}`}
                  className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white"
                >
                  Download Resume
                </a>
              </div>
            </div>

            <div className="reveal-item rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-4 text-xs uppercase tracking-[0.36em] text-cyan-200">Lobby / Entrance</div>
              <div className="relative overflow-hidden rounded-[24px] border border-cyan-400/20 bg-slate-950/50 p-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.28),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.2),transparent_40%)]" />
                <div className="relative h-[420px] overflow-hidden rounded-[20px] border border-white/10 bg-slate-900/60">
                  <img
                    src="/images/home-illustrator.jpg"
                    alt="Portrait"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                  <div className="absolute left-5 top-5 h-28 w-28 rounded-full border border-cyan-400/40 bg-cyan-400/10" />
                  <div className="absolute bottom-5 right-5 h-28 w-28 rounded-full border border-amber-400/35 bg-amber-400/10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="room-panel min-h-screen px-4 py-10 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="reveal-item mb-6 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-2 text-xs uppercase tracking-[0.36em] text-cyan-200">About Room</div>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">A calm, reliable builder with execution depth.</h2>
              <p className="mt-3 max-w-3xl text-slate-300">{portfolioContent.visitor.personality}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="reveal-item rounded-[24px] border border-white/10 bg-slate-900/70 p-6">
                <div className="text-sm text-cyan-200">Location</div>
                <div className="mt-2 text-xl font-semibold text-white">{portfolioContent.visitor.location}</div>
              </div>
              <div className="reveal-item rounded-[24px] border border-white/10 bg-slate-900/70 p-6">
                <div className="text-sm text-cyan-200">Primary Contact</div>
                <div className="mt-2 text-xl font-semibold text-white">{portfolioContent.visitor.phone}</div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="room-panel min-h-screen px-4 py-10 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="reveal-item mb-8">
              <div className="text-xs uppercase tracking-[0.36em] text-cyan-200">Skills Room</div>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Skill shelves and tools aligned to real delivery work.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {portfolioContent.skillGroups.map((group) => (
                <div key={group.title} className="reveal-item rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <h3 className="mb-3 text-lg font-semibold text-cyan-100">{group.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="rounded-full border border-cyan-400/35 bg-cyan-400/10 px-3 py-1 text-sm text-slate-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="room-panel min-h-screen px-4 py-10 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="reveal-item mb-8">
              <div className="text-xs uppercase tracking-[0.36em] text-cyan-200">Experience Room</div>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Timeline wall with the current role highlighted.</h2>
            </div>

            <div className="relative">
              <div className="absolute left-[18px] top-0 hidden h-full w-px bg-cyan-400/35 md:block" />
              <div className="space-y-4">
                {portfolioContent.experience.map((item) => (
                  <div key={item.title} className="reveal-item relative rounded-[24px] border border-white/10 bg-white/5 p-5 pl-14 md:pl-16 backdrop-blur-xl">
                    <div className="absolute left-[9px] top-6 hidden h-18 w-18 rounded-full border-4 border-slate-950 bg-cyan-400 md:block" />
                    <div className="text-xs uppercase tracking-[0.3em] text-cyan-200">{item.year}</div>
                    <div className={`mt-2 text-xl font-semibold ${item.current ? 'text-amber-200' : 'text-white'}`}>{item.title}</div>
                    <p className="mt-2 text-slate-300">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="room-panel min-h-screen px-4 py-10 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="reveal-item mb-8">
              <div className="text-xs uppercase tracking-[0.36em] text-cyan-200">Projects Room</div>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Framed project screens with detail access.</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {portfolioContent.projects.map((project) => (
                <button
                  key={project.title}
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="reveal-item rounded-[24px] border border-white/10 bg-white/5 p-5 text-left backdrop-blur-xl transition hover:border-cyan-400/40"
                >
                  <div className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-200">{project.type}</div>
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-2 text-slate-300">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((tag) => (
                      <span key={tag} className="rounded-full border border-amber-400/35 bg-amber-400/10 px-3 py-1 text-xs text-amber-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="room-panel min-h-screen px-4 py-10 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="reveal-item mb-8">
              <div className="text-xs uppercase tracking-[0.36em] text-cyan-200">Education & Certifications Room</div>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Academic and training foundations.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {portfolioContent.education.map((item) => (
                <div key={item.title} className="reveal-item rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="text-xs uppercase tracking-[0.35em] text-cyan-200">{item.period}</div>
                  <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-slate-300">{item.institution}</p>
                  <p className="mt-1 text-cyan-100">{item.note}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {portfolioContent.certifications.map((item) => (
                <div key={item.title} className="reveal-item rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="text-xs uppercase tracking-[0.35em] text-cyan-200">{item.period}</div>
                  <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-slate-300">{item.issuer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="room-panel min-h-screen px-4 py-10 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.36em] text-cyan-200">Exit / Contact Room</div>
            <h2 className="mt-3 text-4xl font-semibold text-white">Thanks for visiting, {greetingName}.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              If you’re hiring for Python, web development, or AI-assisted engineering roles, I’d welcome a conversation.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/${portfolioContent.visitor.whatsappNumber}?text=Hi%20Mrityunjay%2C%20I%20just%20visited%20your%20portfolio%20and%20would%20like%20to%20connect.`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-emerald-500 px-5 py-3 font-semibold text-slate-950"
              >
                Message Mrityunjay on WhatsApp
              </a>
              <a href={`mailto:${portfolioContent.visitor.email}`} className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white">
                Email Me
              </a>
              <a href={portfolioContent.visitor.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white">
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(event) => event.stopPropagation()}
              className="max-w-2xl rounded-[28px] border border-white/10 bg-slate-900 p-6"
            >
              <div className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-200">{selectedProject.type}</div>
              <h3 className="text-2xl font-semibold text-white">{selectedProject.title}</h3>
              <p className="mt-3 text-slate-300">{selectedProject.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedProject.stack.map((tag) => (
                  <span key={tag} className="rounded-full border border-cyan-400/35 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <a href={selectedProject.link} className="rounded-full bg-cyan-400 px-4 py-2 font-semibold text-slate-950">View Project</a>
                <button type="button" onClick={() => setSelectedProject(null)} className="rounded-full border border-white/15 px-4 py-2 font-semibold text-white">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
