'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Property } from '@/app/admin/types';

/**
 * A component that displays a collection of locations with their respective property counts.
 * 
 * @component
 * @returns {JSX.Element} The rendered LocationCollections section
 * 
 * @example
 * ```tsx
 * <LocationCollections />
 * ```
 * 
 * @description
 * This component displays a horizontally scrollable list of locations with:
 * - Location images with gradient overlays
 * - Location titles
 * - Property counts for each location
 * - Interactive hover effects
 * - A 'See All' button that can be hooked up to navigate to a full locations page
 */
const LocationCollections = () => {
  const [locations, setLocations] = useState<{ title: string; image: string; propertyCount: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Group by location
          const map: { [key: string]: { count: number; image: string } } = {};
          data.properties.forEach((p: Property) => {
            if (!p.location) return;
            if (!map[p.location]) {
              map[p.location] = { count: 1, image: p.gallery[0]?.url || '' };
            } else {
              map[p.location].count++;
            }
          });
          setLocations(Object.entries(map).map(([title, { count, image }]) => ({ title, propertyCount: count, image })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-[#1A1A1A] py-12 sm:py-16 lg:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-medium text-white font-['Bricolage_Grotesque'] tracking-wide">
            Location-wise Collections
          </h2>
          <button 
            className="flex items-center text-white text-sm font-['Bricolage_Grotesque'] hover:opacity-80 transition-opacity underline"
            onClick={() => console.log('See all locations clicked')}
          >
            See All
          </button>
        </div>
        
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          <div 
            className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-6 px-4 sm:px-6 lg:px-8" 
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : locations.length === 0 ? (
              <div className="text-gray-400">No locations found.</div>
            ) : (
              locations.map((location) => (
                <div 
                  key={location.title} 
                  className="flex-none w-[260px] h-[200px] sm:w-[310px] sm:h-[240px] bg-[#1A1A1A] rounded-lg shadow-lg overflow-hidden relative group"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={location.image}
                      alt={location.title}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div 
                    className="absolute inset-0 w-full h-full"
                    style={{
                      background: 'linear-gradient(0deg, #000000 0%, rgba(0, 0, 0, 0) 100%)',
                    }}
                  />
                  
                  {/* Location Info */}
                  <div className="absolute left-4 bottom-4 z-10">
                    <h3 className="text-white text-base sm:text-lg font-medium font-['General_Sans'] tracking-wide">
                      {location.title}
                    </h3>
                    <p className="text-[#E0E0E0] text-xs sm:text-sm font-['Bricolage_Grotesque'] mt-1">
                      {location.propertyCount} Properties
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Gradient overlay for the right side */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, #1A1A1A, rgba(26, 26, 26, 0))',
            }}
          />
        </div>
      </div>
      
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .overflow-x-auto {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Custom font faces */
        @font-face {
          font-family: 'Bricolage Grotesque';
          src: url('/fonts/BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf') format('truetype');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Nunito Sans';
          src: url('https://fonts.gstatic.com/s/nunitosans/v12/pe03MImSLYBIv1o4X1M8cc8WAf5qWf7dQ.woff2') format('woff2');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }
      `}</style>
    </section>
  );
};

export default LocationCollections;
