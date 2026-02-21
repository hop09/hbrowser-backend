"use client"

import { motion } from 'framer-motion'
import { Shield, Cloud, Zap, Fingerprint, ChevronDown, Hexagon, Palette, Cpu, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="w-full relative bg-[#F9F9F9] dark:bg-[#0a0a0a] min-h-screen text-black dark:text-white overflow-hidden">

      {/* Ambient Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-neutral-300 dark:bg-neutral-800 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2], x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-stone-300 dark:bg-stone-800 mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-20"
        />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[50svh] flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden">

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full text-center px-4 md:px-6 -mt-10 md:-mt-20"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 glassmorphism text-[10px] font-bold tracking-widest uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Next-Gen Anti-Detect
          </div>

          <h1 className="text-5xl sm:text-[10vw] md:text-[8vw] font-black tracking-tighter leading-tight md:leading-none dark:text-white text-black drop-shadow-sm uppercase">
            Privacy for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 via-black to-neutral-400 dark:from-neutral-400 dark:via-white dark:to-neutral-600 animate-gradient-x">High Stakes</span>
          </h1>
          <p className="mt-8 text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-gray-500 z-10 max-w-2xl mx-auto leading-relaxed">
            The ultimate antidetect browser with heavily isolated profiles, advanced hardware spoofing, and elite cloud synchronization.
          </p>

          <div className="mt-12 md:hidden flex justify-center w-full z-20">
            <a href="https://download.hbrowser.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <Hexagon className="w-4 h-4" />
              Download Now
            </a>
          </div>
        </motion.div>

        {/* 3D Floating Device removed as requested */}

        {/* Pedestal Graphic - Abstract shape underneath */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-1/2 mt-32 w-[40vw] h-[40vh] bg-gradient-to-t from-gray-200 to-transparent dark:from-neutral-900 rounded-t-full opacity-50 z-0 blur-3xl"
        />

        {/* Floating texts on sides */}
        <div className="absolute left-10 text-xs text-gray-400 max-w-[200px] -rotate-90 origin-left hidden lg:block tracking-widest uppercase mt-40">
          Engineered for Professionals.
        </div>

        {/* Social / Info Icons */}
        <div className="absolute right-10 bottom-32 hidden lg:flex flex-col gap-6 text-gray-400 z-10">
          <Shield className="w-5 h-5 hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
          <Cloud className="w-5 h-5 hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
          <Zap className="w-5 h-5 hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
          <Fingerprint className="w-5 h-5 hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 hidden md:flex flex-col items-center opacity-40 hover:opacity-100 cursor-pointer"
        >
          <div className="w-8 h-12 border border-black dark:border-white rounded-full flex justify-center p-2 mb-2">
            <div className="w-1 h-2 bg-black dark:bg-white rounded-full" />
          </div>
          <ChevronDown className="w-4 h-4" />
        </motion.div>

        {/* Fixed Action Button for Download */}
        <div className="absolute bottom-10 right-6 md:right-32 z-40 hidden md:block">
          <a href="https://download.hbrowser.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl">
            <Hexagon className="w-4 h-4" />
            Download For Windows
          </a>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="w-full py-20 md:py-40 px-6 md:px-20 max-w-7xl mx-auto flex flex-col items-center" id="features">
        <h2 className="text-3xl md:text-5xl font-black tracking-widest text-center uppercase mb-4">
          Engineered for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-black dark:from-neutral-600 dark:to-white">Invisibility</span>
        </h2>
        <p className="text-xs md:text-sm uppercase tracking-widest opacity-60 text-center mb-20 max-w-2xl">
          Advanced fingerprint protection technology that keeps your identity secure across every session.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[250px] gap-6 w-full mt-10">

          {/* Bento Item 1 - Large */}
          <div className="md:col-span-2 lg:col-span-2 row-span-2 glassmorphism p-10 rounded-[2rem] flex flex-col gap-6 group hover:shadow-[0_0_40px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.02)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden border border-black/5 dark:border-white/5 bg-gradient-to-br from-white/40 to-transparent dark:from-black/40">
            <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 group-hover:opacity-10 transition-all duration-700 pointer-events-none">
              <Shield size={350} />
            </div>
            <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-black group-hover:scale-110 group-hover:shadow-2xl transition-transform duration-500 relative z-10">
              <Shield className="w-8 h-8" />
            </div>
            <div className="mt-auto relative z-10">
              <h3 className="text-2xl font-black tracking-widest uppercase mb-4">Anti-Detect Core</h3>
              <p className="text-sm opacity-60 leading-relaxed max-w-md">
                Chromium-based engine modified at the source level to natively spoof Canvas, WebGL, Audio, and Font fingerprints accurately without ever sacrificing standard browser performance.
              </p>
            </div>
          </div>

          {/* Bento Item 2 */}
          <div className="md:col-span-1 lg:col-span-2 row-span-1 glassmorphism p-8 rounded-[2rem] flex flex-row items-center gap-8 group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden border border-black/5 dark:border-white/5">
            <div className="w-14 h-14 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors flex-shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-2">Cloud Sync</h3>
              <p className="text-xs opacity-60 leading-relaxed">
                Seamlessly sync your profiles, cookies, and extensions across devices with military-grade end-to-end encryption.
              </p>
            </div>
          </div>

          {/* Bento Item 3 */}
          <div className="md:col-span-1 lg:col-span-1 row-span-1 glassmorphism p-8 rounded-[2rem] flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden border border-black/5 dark:border-white/5">
            <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-2">Quick Switch</h3>
              <p className="text-xs opacity-60 leading-relaxed">
                Manage hundreds of isolated profiles fast.
              </p>
            </div>
          </div>

          {/* Bento Item 4 */}
          <div className="md:col-span-1 lg:col-span-1 row-span-1 glassmorphism p-8 rounded-[2rem] flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 relative overflow-hidden border border-black/5 dark:border-white/5 focus-within:ring-2">
            <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-widest uppercase mb-2">Analysis Tools</h3>
              <p className="text-xs opacity-60 leading-relaxed">
                Built-in anonymity verification scoring.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- SHOWCASE HIGHLIGHT --- */}
      <section className="w-full bg-[#EEEEEE] dark:bg-[#111111] py-20 md:py-32 mt-10 overflow-hidden" id="showcase">
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative flex flex-col items-center">

          <div className="w-full text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-widest">
              Beautifully <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-black dark:from-neutral-600 dark:to-white">Designed</span>
            </h2>
            <p className="text-xs opacity-60 uppercase tracking-widest mt-4">Experience the perfect fusion of aesthetics and anonymity.</p>
          </div>

          {/* Main Showcase Grid */}
          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glassmorphism p-8 rounded-2xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-14 h-14 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-2">
                <Palette className="w-6 h-6 text-black dark:text-white" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest mt-2">Obsidian Theme</h4>
              <p className="text-xs opacity-60 leading-relaxed">
                Experience our premium dark mode crafted for low eye strain and absolute visual clarity during late-night operations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glassmorphism p-10 rounded-3xl flex flex-col items-center text-center gap-4 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-7 h-7 text-black dark:text-white" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] mt-2">Hardware Obfuscation</h4>
              <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full my-4 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '94%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-neutral-500 to-black dark:from-neutral-400 dark:to-white rounded-full relative"
                >
                  <div className="absolute top-0 right-0 w-4 h-full bg-white/50 blur-[2px] animate-pulse"></div>
                </motion.div>
              </div>
              <p className="text-xs opacity-60 leading-relaxed font-medium">
                Passes advanced Canvas and WebGL tracking tests natively, protecting your core hardware identifiers out of the box dynamically.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glassmorphism p-8 rounded-2xl flex flex-col items-center text-center gap-4 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-14 h-14 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-2">
                <Lock className="w-6 h-6 text-black dark:text-white" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest mt-2">Encrypted Vault</h4>
              <p className="text-xs opacity-60 leading-relaxed">
                Your isolated profiles, cookies, and proxy endpoints are shielded natively with powerful local and cloud encryption algorithms.
              </p>
            </motion.div>

          </div>

          <div className="mt-20 flex justify-center w-full">
            <Link href="/fingerprint" className="border-b border-black dark:border-white pb-1 text-xs uppercase tracking-widest hover:opacity-50 transition-opacity font-bold">
              Check Your Fingerprint
            </Link>
          </div>

        </div>
      </section>

      {/* --- ADDED: USE CASES SECTION --- */}
      <section className="w-full py-20 md:py-32 px-6 md:px-20 max-w-7xl mx-auto flex flex-col items-center" id="use-cases">
        <h2 className="text-3xl md:text-5xl font-black tracking-widest text-center uppercase mb-16">
          Built For <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-black dark:from-neutral-600 dark:to-white">Professionals</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="group glassmorphism p-10 rounded-3xl border border-black/5 dark:border-white/5 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-default relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full filter blur-xl transition-all duration-500 group-hover:scale-150"></div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-4">Affiliate Marketing</h3>
            <p className="text-sm opacity-60 leading-relaxed mb-8">Scale your ad campaigns safely. Isolate tracking pixels and scale across platforms without linking accounts.</p>
            <ul className="text-xs uppercase tracking-widest opacity-80 space-y-4 font-bold">
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>Facebook Ads</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>Google Ads</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>TikTok Business</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="group glassmorphism p-10 rounded-3xl border border-black/5 dark:border-white/5 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-default relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full filter blur-xl transition-all duration-500 group-hover:scale-150"></div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-4">E-Commerce</h3>
            <p className="text-sm opacity-60 leading-relaxed mb-8">Manage multiple storefronts and seller accounts avoiding suspension risks associated with footprint linking.</p>
            <ul className="text-xs uppercase tracking-widest opacity-80 space-y-4 font-bold">
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>Amazon Seller</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>eBay Dropshipping</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>Shopify Multi-store</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="group glassmorphism p-10 rounded-3xl border border-black/5 dark:border-white/5 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-default relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full filter blur-xl transition-all duration-500 group-hover:scale-150"></div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-4">Crypto & Web3</h3>
            <p className="text-sm opacity-60 leading-relaxed mb-8">Maximize airdrop farming and whitelist opportunities by utilizing unique, unlinked session footprints.</p>
            <ul className="text-xs uppercase tracking-widest opacity-80 space-y-4 font-bold">
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>Hardware Wallets</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>Discord Access</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>Token Sales</li>
            </ul>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
