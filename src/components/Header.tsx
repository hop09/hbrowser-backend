"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-6 transition-colors border-b border-black/10 dark:border-white/10 ${isOpen ? 'text-white' : 'backdrop-blur-md bg-white/70 dark:bg-black/70 text-black dark:text-white'}`}>
                <Link href="/" className="font-bold text-xl tracking-[0.2em] relative z-50 uppercase">HBROWSER</Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-10 text-xs tracking-[0.15em] uppercase font-medium">
                    <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
                    <Link href="/fingerprint" className="hover:text-gray-300 transition-colors">Fingerprint</Link>
                    <Link href="#" className="hover:text-gray-300 transition-colors">Collection</Link>
                </nav>

                <div className="flex items-center gap-3 md:gap-6 relative z-50">
                    <a href="https://download.hbrowser.app" target="_blank" rel="noopener noreferrer" className="hidden md:inline-block text-[10px] md:text-xs uppercase font-bold tracking-widest border border-black/20 dark:border-white/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">Download</a>

                    {/* Mobile Hamburger Toggle */}
                    <button className="md:hidden p-2 -mr-2 flex items-center justify-center transition-colors" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-neutral-950 text-white z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl tracking-[0.15em] uppercase font-medium hover:text-gray-300 transition-colors">Home</Link>
                <Link href="/fingerprint" onClick={() => setIsOpen(false)} className="text-2xl tracking-[0.15em] uppercase font-medium hover:text-gray-300 transition-colors">Fingerprint</Link>
                <Link href="#" onClick={() => setIsOpen(false)} className="text-2xl tracking-[0.15em] uppercase font-medium hover:text-gray-300 transition-colors">Collection</Link>
                <a href="https://download.hbrowser.app" target="_blank" rel="noopener noreferrer" className="mt-8 text-sm uppercase tracking-widest border border-white/30 px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all" onClick={() => setIsOpen(false)}>Download</a>
            </div>
        </>
    )
}
