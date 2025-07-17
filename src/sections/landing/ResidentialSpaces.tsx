'use client';

import React, { useEffect, useState } from 'react';
import ProjectCard from '@/components/property/ProjectCard';
import { Property } from '@/app/admin/types';
import Link from 'next/link';

/**
 * A component that displays a horizontal scrolling list of residential properties.
 * 
 * @component
 * @returns {JSX.Element} The rendered ResidentialSpaces section
 * 
 * @example
 * ```tsx
 * <ResidentialSpaces />
 * ```
 * 
 * @description
 * This component displays a horizontally scrollable list of residential properties with:
 * - Property images
 * - Status badges
 * - Location information
 * - Pricing
 * - Property type and BHK configuration
 * - A 'See All' button that can be hooked up to navigate to a full listing page
 */
const ResidentialSpaces = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProperties(data.properties.filter((p: Property) => p.propertyType === 'Residential'));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-[#1A1A1A] py-12 sm:py-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-medium text-white font-['Bricolage_Grotesque'] tracking-wide">
            Residential Spaces
          </h2>
          <button 
            className="flex items-center text-white text-sm font-['Bricolage_Grotesque'] hover:opacity-80 transition-opacity underline"
            onClick={() => console.log('See all residential spaces clicked')}
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
            ) : properties.length === 0 ? (
              <div className="text-gray-400">No residential properties found.</div>
            ) : (
              properties.map((property) => (
                <Link key={property._id} href={`/projects/${property._id}`} className="block">
                  <ProjectCard project={{
                    id: property._id || '',
                    title: property.name,
                    location: property.location,
                    price: property.priceRange,
                    type: property.propertyType,
                    status: (['new-launch','rera-approved','ready-to-move','prime-location','retail-space','co-working','industrial'].includes(property.status) ? property.status : 'new-launch') as any,
                    image: property.gallery && property.gallery[0] && typeof property.gallery[0].url === 'string' ? property.gallery[0].url : '',
                    bhk: property.keyHighlights.unitConfiguration || '',
                  }} tagPosition="bottom" />
                </Link>
              ))
            )}
          </div>
          <div 
            className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 lg:w-32 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, #1A1A1A, rgba(26, 26, 26, 0))',
            }}
          />
        </div>
      </div>
      <style jsx global>{`
        .overflow-x-auto::-webkit-scrollbar { display: none; }
        .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default ResidentialSpaces;
