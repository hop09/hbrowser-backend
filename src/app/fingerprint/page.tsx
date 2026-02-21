"use client"

import { useState, useEffect } from "react"
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { motion } from "framer-motion"
import { ShieldCheck, Server, Globe2, Clock, GlobeLock, Cpu, RefreshCcw } from "lucide-react"

export default function FingerprintPage() {
    const [data, setData] = useState<any>(null)
    const [serverTime, setServerTime] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [ipRes, timeRes] = await Promise.all([
                fetch('/api/fingerprint/ip'),
                fetch('/api/fingerprint/time')
            ])

            if (ipRes.ok) setData(await ipRes.json())
            if (timeRes.ok) setServerTime(await timeRes.json())
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#050505] text-black dark:text-white pb-10">
            {/* Header Banner */}
            <div className="w-full h-[40vh] min-h-[300px] bg-black dark:bg-[#111] text-white flex flex-col justify-end px-6 md:px-20 py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-black to-neutral-800 opacity-80" />

                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative z-10"
                >
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 text-gradient">
                        Browser Fingerprint
                    </h1>
                    <p className="tracking-widest uppercase text-sm text-gray-400 font-medium">
                        Anonymity & Security Verification Hub
                    </p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-20 -mt-16 relative z-20">

                {/* Actions */}
                <div className="flex justify-end mb-8">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center gap-3 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shadow-xl disabled:opacity-50"
                    >
                        <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Analyzing...' : 'Re-verify Environment'}
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

                    {/* IP Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glassmorphism p-10 rounded-2xl flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="absolute -right-10 -top-10 text-neutral-200 dark:text-neutral-800 opacity-20 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                            <Globe2 size={250} />
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <GlobeLock className="text-black dark:text-white w-6 h-6" />
                                <h2 className="text-sm font-bold tracking-widest uppercase opacity-60">Network Fingerprint</h2>
                            </div>

                            <div className="text-5xl font-black tracking-tight mb-2 truncate" title={data?.ip || '0.0.0.0'}>
                                {loading ? '---' : data?.ip}
                            </div>
                            <p className="text-sm uppercase tracking-wider font-semibold opacity-50">
                                Public IP Address
                            </p>
                        </div>

                        <div className="mt-12 pt-6 border-t border-black/10 dark:border-white/10 grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Location</p>
                                <p className="text-sm font-bold truncate" title={`${data?.city}, ${data?.region}, ${data?.countryCode}`}>{loading ? '...' : `${data?.city}, ${data?.countryCode}`}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">ISP / Org</p>
                                <p className="text-sm font-bold truncate" title={data?.isp}>{loading ? '...' : data?.isp}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Details Column */}
                    <div className="flex flex-col gap-6 md:gap-10">

                        {/* Time Sync Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glassmorphism p-8 rounded-2xl flex items-center justify-between"
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Clock className="w-5 h-5 opacity-60" />
                                    <h3 className="text-xs font-bold tracking-widest uppercase opacity-60">System Time Sync</h3>
                                </div>
                                <div className="text-2xl font-black tabular-nums">
                                    {loading ? '--:--:--' : new Date(serverTime?.datetime || Date.now()).toLocaleTimeString()}
                                </div>
                                <p className="text-[10px] mt-1 uppercase tracking-widest opacity-40">{serverTime?.timezone || 'UTC'} OFFSET</p>
                            </div>
                            <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                                <Server className="w-6 h-6 opacity-40" />
                            </div>
                        </motion.div>

                        {/* Security Status Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glassmorphism p-8 rounded-2xl flex-1 flex flex-col justify-between"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <h3 className="text-xs font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">Environment Active</h3>
                                </div>
                                <Cpu className="w-5 h-5 opacity-40" />
                            </div>

                            <div>
                                <p className="text-sm leading-relaxed opacity-70 mb-4 font-light">
                                    Your fingerprint matches the expected parameters for the current profile wrapper. All WebRTC and locale leaks are currently plugged.
                                </p>
                                <div className="w-full bg-black/10 dark:bg-white/10 h-1 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: loading ? '0%' : '100%' }}
                                        transition={{ duration: 1 }}
                                        className="h-full bg-black dark:bg-white"
                                    />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* Score Section copied from Laravel to mount JS logic */}
                <div className="mt-10 mb-8 w-full max-w-2xl mx-auto glassmorphism p-8 rounded-2xl flex flex-col md:flex-row items-center gap-10">
                    <div className="relative w-48 h-48 flex-shrink-0">
                        <svg viewBox="0 0 280 280" className="w-full h-full -rotate-90">
                            <circle cx="140" cy="140" r="130" fill="none" className="stroke-black/10 dark:stroke-white/10" strokeWidth="12" />
                            <circle id="scoreProgress" cx="140" cy="140" r="130" fill="none" className="stroke-emerald-500 transition-all duration-1000 ease-out" strokeWidth="12" strokeDasharray="816" strokeDashoffset="816" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-4xl font-black tabular-nums">
                                <span id="scoreValue">0</span><span className="text-lg opacity-50 ml-1">%</span>
                            </div>
                            <div className="text-xs uppercase tracking-widest opacity-50 mt-1 font-bold">Privacy Score</div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div id="scoreStatus" className="flex items-center gap-3 mb-3 text-sm font-bold tracking-widest uppercase opacity-70">
                            <RefreshCcw className="w-4 h-4 animate-spin" />
                            <span>Analyzing...</span>
                        </div>
                        <p id="scoreDescription" className="text-sm opacity-60 leading-relaxed mb-4">
                            Running comprehensive fingerprint analysis to evaluate your browser privacy...
                        </p>

                        <div id="redFlags" style={{ display: 'none' }} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4 text-xs">
                            <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest mb-2">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Issues Detected</span>
                            </div>
                            <ul id="redFlagsList" className="flex flex-col gap-2 text-red-500/80"></ul>
                        </div>
                    </div>
                </div>

                {/* Score and Categories Section */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {/* Categories will be rendered by the imported script, but we need the mounting points */}
                    <div className="lg:col-span-3 mb-4 flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                        <h2 className="text-xl font-bold tracking-widest uppercase">Detection Results</h2>
                        <span className="text-sm font-medium tracking-widest uppercase opacity-50" id="categoryCount">0 Categories</span>
                    </div>

                    {/* Categories Grid Populated by fingerprint.js */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="categoriesGrid">
                        <div className="glassmorphism p-6 rounded-2xl flex items-center justify-center opacity-50">
                            <RefreshCcw className="w-5 h-5 animate-spin mr-3" />
                            <span className="text-sm tracking-widest uppercase">Analyzing Fingerprint Data...</span>
                        </div>
                    </div>

                    {/* Detail Modal (Hidden by default, used by JS) */}
                    <div id="detailModal" className="fixed inset-0 z-50 hidden opacity-0 transition-opacity duration-300 pointer-events-none [&.active]:flex [&.active]:opacity-100 [&.active]:pointer-events-auto items-center justify-center p-4">
                        <div id="modalOverlay" className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer border border-transparent"></div>
                        <div className="relative w-full max-w-2xl bg-[#F9F9F9] dark:bg-[#111] rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 flex flex-col max-h-[80vh] overflow-hidden transform scale-95 transition-transform duration-300 group-[.active]:scale-100">
                            <div className="p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between bg-black/5 dark:bg-white/5">
                                <div className="flex items-center gap-4">
                                    <div id="modalIcon" className="w-12 h-12 flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 rounded-full text-black dark:text-white *:w-6 *:h-6"></div>
                                    <div>
                                        <h3 id="modalTitle" className="text-xl font-black uppercase tracking-widest">Category</h3>
                                        <span id="modalSubtitle" className="text-xs font-semibold uppercase tracking-widest opacity-50">0 checks</span>
                                    </div>
                                </div>
                                <button id="modalClose" className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                <div id="modalChecks" className="flex flex-col gap-4"></div>
                            </div>
                        </div>
                    </div>

                    {/* Script Loader */}
                    <Script src="/js/fingerprint.js" strategy="lazyOnload" />

                </div>
            </div>
        </div>
    )
}
