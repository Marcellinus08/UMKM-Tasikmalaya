'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    
    // Track scroll position to update active section
    const handleScroll = () => {
      const sections = [
        { id: 'peta-umkm', name: 'peta' },
        { id: 'daftar-umkm', name: 'daftar' }
      ];
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section.name);
          }
        }
      }
      
      if (window.scrollY < 100) {
        setActiveSection('home');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDark = () => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-background-dark/80 animate-fade-in shadow-lg">
      <div className="flex justify-between items-center py-4 px-4 md:px-8 border-b border-gray-200/80 dark:border-gray-700/80 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500/20 rounded-full -translate-x-32 -translate-y-32 mix-blend-multiply"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-blue/20 rounded-full translate-x-32 translate-y-32 mix-blend-multiply"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center gap-4">
            <div className="relative group">
              {/* Outer glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-500 via-accent-purple to-accent-blue rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              
              {/* Logo container */}
              <div className="relative w-14 h-14">
                {/* Main pin shape */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-b-[100px] rounded-t-[6px] transform rotate-45 shadow-lg"></div>
                </div>

                {/* Batik pattern overlay */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <div className="relative w-10 h-10 transform rotate-45">
                    {/* Payung pattern */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white/30 rounded-full"></div>
                      <div className="absolute w-8 h-8 border-2 border-white/20 rounded-full"></div>
                      <div className="absolute w-4 h-4 border-2 border-white/40 rounded-full"></div>
                      {/* Decorative lines */}
                      {[0, 45, 90, 135].map((rotation) => (
                        <div
                          key={rotation}
                          className="absolute w-[140%] h-0.5 bg-white/20"
                          style={{ transform: `rotate(${rotation}deg)` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Store icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-icons text-white/90 text-2xl transform translate-y-1 group-hover:scale-110 transition-transform duration-300">
                    storefront
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold group">
                <span className="bg-gradient-to-r from-primary-500 via-primary-400 to-accent-blue bg-clip-text text-transparent inline-block group-hover:animate-text-shimmer">
                  UMKM
                </span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide font-medium -mt-1 flex items-center gap-1.5">
                <span className="material-icons text-base text-primary-500/70">location_on</span>
                <span className="relative">
                  Tasikmalaya
                  <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500/0 via-primary-500/50 to-primary-500/0"></span>
                </span>
              </p>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          {[
            { name: 'Beranda', icon: 'home', href: '#', key: 'home' },
            { name: 'Peta UMKM', icon: 'map', href: '#peta-umkm', key: 'peta' },
            { name: 'Daftar UMKM', icon: 'format_list_bulleted', href: '#daftar-umkm', key: 'daftar' }
          ].map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              className={`group relative py-2 text-sm font-medium transition-colors flex items-center gap-1.5
                ${activeSection === item.key && item.key !== 'home' ? 'text-primary-500 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400'}`}
            >
              <span className="material-icons text-base group-hover:animate-bounce-gentle">{item.icon}</span>
              {item.name}
              <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-primary-500 transition-all ${activeSection === item.key && item.key !== 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDark}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full
              bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700
              hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600
              text-gray-700 dark:text-gray-300 transition-all duration-300
              shadow-soft hover:shadow-md group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/10 to-primary-500/0 group-hover:translate-x-full transition-transform duration-500"></div>
            <span className="material-icons text-base animate-pulse-slow relative">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="text-sm font-medium relative">{isDark ? 'Terang' : 'Gelap'}</span>
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-icons">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slide-up">
          <nav className="flex flex-col space-y-3 p-4 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-700">
            {[
              { name: 'Beranda', icon: 'home', href: '#', key: 'home' },
              { name: 'Peta UMKM', icon: 'map', href: '#peta-umkm', key: 'peta' },
              { name: 'Daftar UMKM', icon: 'format_list_bulleted', href: '#daftar-umkm', key: 'daftar' }
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`group flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300
                  ${activeSection === item.key && item.key !== 'home'
                    ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <span className="material-icons text-xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => { toggleDark(); setIsMenuOpen(false); }}
              className="flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300
                text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 group"
            >
              <span className="material-icons text-xl group-hover:rotate-180 transition-transform duration-500">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
              <span>Mode {isDark ? 'Terang' : 'Gelap'}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}