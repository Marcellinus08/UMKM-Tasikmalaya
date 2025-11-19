'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage, default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    const shouldBeDark = savedTheme === 'dark';
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDark = () => {
    const root = document.documentElement;
    const newIsDark = !isDark;
    
    if (newIsDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    setIsDark(newIsDark);
  };

  const navItems = [
    { name: 'Beranda', icon: 'home', href: '/' },
    { name: 'Peta UMKM', icon: 'map', href: '/peta-umkm' },
    { name: 'Daftar UMKM', icon: 'store', href: '/daftar-umkm' },
    { name: 'Statistik', icon: 'bar_chart', href: '/statistik' },
    { name: 'Tentang', icon: 'info', href: '/tentang' },
    { name: 'Kontak', icon: 'mail', href: '/kontak' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-2 bg-linear-to-r from-emerald-400 via-green-400 to-teal-400 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
              
              {/* Logo container */}
              <div className="relative w-12 h-12 transform group-hover:scale-110 transition-transform duration-300">
                <Image 
                  src="/logo_website.png" 
                  alt="Logo UMKM"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>
            
            {/* Teks UMKM / TASIKMALAYA */}
            <div className="inline-flex flex-col items-stretch leading-none">
              {/* Baris UMKM */}
              <div className="flex justify-between">
                {'UMKM'.split('').map((ch, i) => (
                  <span
                    key={i}
                    className="text-xl md:text-2xl font-bold bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent"
                  >
                    {ch}
                  </span>
                ))}
              </div>

              {/* Baris TASIKMALAYA */}
              <div className="mt-[2px] font-semibold flex justify-between">
                {'TASIKMALAYA'.split('').map((ch, i) => (
                  <span
                    key={i}
                    className="text-[11px] text-gray-600 dark:text-gray-400"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 font-medium text-sm transition-all duration-300 flex items-center gap-2 group ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  <span className={`material-icons text-lg ${isActive ? '' : 'group-hover:scale-110'} transition-transform`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-emerald-500 to-green-500 transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              );
            })}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDark}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group"
              aria-label="Toggle theme"
            >
              <span className="material-icons text-lg group-hover:rotate-180 transition-transform duration-500">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="text-sm font-medium hidden xl:inline">
                {isDark ? 'Terang' : 'Gelap'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <span className="material-icons text-2xl">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? 'max-h-screen opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <nav className="container mx-auto px-4 pb-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-linear-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="material-icons">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          <button
            onClick={() => {
              toggleDark();
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <span className="material-icons">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="font-medium">Mode {isDark ? 'Terang' : 'Gelap'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
