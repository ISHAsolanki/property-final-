'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaSearch } from 'react-icons/fa';
import { navigationData } from '@/data/navigation';

/**
 * A responsive navigation bar component that includes a logo, navigation links, and search functionality.
 * Features a transparent background that becomes opaque when the user scrolls down the page.
 * 
 * @component
 * @returns {JSX.Element} The rendered NavigationBar component
 * 
 * @example
 * ```tsx
 * <NavigationBar />
 * ```
 * 
 * @description
 * This component provides:
 * - Responsive navigation that works on mobile and desktop
 * - Transparent background that becomes opaque on scroll
 * - Logo display
 * - Navigation links
 * - Search functionality
 * - Mobile menu toggle (hamburger menu on small screens)
 */
const NavigationBar = () => {
  const { logo, links, search } = navigationData;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldBeOpaque = window.scrollY > 10;
      if (shouldBeOpaque !== isScrolled) {
        setIsScrolled(shouldBeOpaque);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, [isScrolled, isMenuOpen]);

  /**
   * Determines the background class based on scroll position
   * @type {string}
   */
  const navBackgroundClass = isScrolled 
    ? 'bg-black/80 backdrop-blur-md shadow-lg'
    : 'bg-transparent';

  const mobileMenuBackgroundClass = isMenuOpen ? 'bg-black shadow-lg' : navBackgroundClass;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isMenuOpen ? mobileMenuBackgroundClass : navBackgroundClass}`}>
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 w-full max-w-screen-xl mx-auto">
        {/* Left Section - Logo */}
        <div className="w-[142.86px] h-[48px] relative">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="object-contain"
            priority
          />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {links.map((link, index) => (
              <li key={index}>
                <a 
                  href={link.href} 
                  className="text-white text-base font-medium leading-6 hover:opacity-80 transition-opacity whitespace-nowrap"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section - Search and Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden sm:block relative w-48 md:w-56">
            <input
              type="text"
              placeholder={search.placeholder}
              className="w-full h-10 pl-10 pr-4 py-2 bg-[#333333] text-[#ECECEC] rounded-full font-['Bricolage_Grotesque'] text-sm leading-6 placeholder-[#ECECEC] focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#ECECEC] w-4 h-4" />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md shadow-lg pt-4 pb-8">
          <ul className="flex flex-col items-center gap-6">
            {links.map((link, index) => (
              <li key={index}>
                <a 
                  href={link.href} 
                  className="text-white text-lg font-medium leading-6 hover:opacity-80 transition-opacity"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Search Bar in Mobile Menu */}
          <div className="mt-6 mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={search.placeholder}
                className="w-full h-12 pl-12 pr-4 py-2 bg-[#333333] text-[#ECECEC] rounded-full font-['Bricolage_Grotesque'] text-base leading-6 placeholder-[#ECECEC] focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
              <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#ECECEC] w-5 h-5" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;