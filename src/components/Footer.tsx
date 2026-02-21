import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="w-full py-10 px-6 md:px-10 flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest opacity-60 border-t border-black/10 dark:border-white/10 mt-auto bg-[#F9F9F9] dark:bg-[#0a0a0a] text-black dark:text-white relative z-20">
            <div className="mb-4 md:mb-0 text-center md:text-left">
                <span className="font-bold">HBrowser</span> &copy; {new Date().getFullYear()} High Stakes. All rights reserved.
            </div>
            <div className="flex gap-6 flex-wrap justify-center">
                <Link href="/fingerprint" className="hover:text-black dark:hover:text-white transition-colors">Privacy Check</Link>
                <a href="https://download.hbrowser.app" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">Download</a>
            </div>
        </footer>
    )
}
