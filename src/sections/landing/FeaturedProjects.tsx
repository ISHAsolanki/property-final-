'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Property } from '@/app/admin/types';

/**
 * Configuration for different project status types in the featured projects section.
 * Maps status keys to their display labels and corresponding CSS classes.
 */
const statusConfig: { [key: string]: { label: string; className: string } } = {
  'Ready': {
    label: 'Ready',
    className: 'bg-white text-black',
  },
  'Under Construction': {
    label: 'Under Construction',
    className: 'bg-white text-black',
  },
  'Upcoming': {
    label: 'Upcoming',
    className: 'bg-white text-black',
  },
};

/**
 * A card component that displays information about a featured project.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {typeof featuredProjects[0]} props.project - The project data to display
 * @returns {JSX.Element} The rendered ProjectCard component
 * 
 * @example
 * ```tsx
 * <ProjectCard project={featuredProjects[0]} />
 * ```
 */
const ProjectCard = ({ property }: { property: Property }) => {
  const status = statusConfig[property.status] || { label: property.status, className: 'bg-white text-black' };
  
  return (
    <Link 
      href={`/projects/${property._id}`}
      className="flex-none w-[300px] sm:w-[360px] lg:w-[420px] bg-[#0A0A0A] rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image Container */}
      <div className="relative w-full h-[160px] sm:h-[180px] bg-gray-800">
        {property.gallery && property.gallery[0]?.url && (
          <Image
            src={property.gallery[0].url}
            alt={property.gallery[0].name || property.name}
            fill
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Status Badge */}
        <div className="absolute left-4 bottom-4">
          <span className={`px-2 py-1 text-xs font-medium rounded ${status.className}`}>
            {status.label}
          </span>
        </div>
      </div>
      
      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="text-white text-base sm:text-lg font-medium leading-snug sm:leading-7 tracking-wide">
          {property.name}
        </h3>
        
        <div className="flex items-center mt-1 text-[#E0E0E0] text-sm">
          <FaMapMarkerAlt className="w-4 h-4 text-[#9CA3AF] mr-1" />
          <span>{property.location}</span>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm bg-white/10 text-white px-2 py-1 rounded-md">
            {property.priceRange}
          </span>
        </div>
        
        <div className="mt-2 text-sm text-[#E0E0E0]">
          {property.tagline}
        </div>
      </div>
    </Link>
  );
};

/**
 * A component that displays a horizontal scrolling list of featured real estate projects.
 * 
 * @component
 * @returns {JSX.Element} The rendered FeaturedProjects section
 * 
 * @example
 * ```tsx
 * <FeaturedProjects />
 * ```
 * 
 * @description
 * This component displays a horizontally scrollable list of featured projects with:
 * - Project images
 * - Status badges
 * - Location information
 * - Pricing
 * - Property type and BHK configuration
 */
const FeaturedProjects = () => {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeatured(data.properties.filter((p: any) => p.featured));
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
            Featured Projects
          </h2>
          <button 
            className="flex items-center text-white text-sm font-['Bricolage_Grotesque'] hover:opacity-80 transition-opacity underline"
            onClick={() => console.log('See all projects clicked')}
          >
            See All
          </button>
        </div>
        
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-6 px-4 sm:px-6 lg:px-8" 
               style={{
                 scrollbarWidth: 'none',
                 msOverflowStyle: 'none',
               }}>
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : featured.length === 0 ? (
              <div className="text-gray-400">No featured properties found.</div>
            ) : (
              featured.map((property) => (
                <ProjectCard key={property._id} property={property} />
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
      `}</style>
    </section>
  );
};

export default FeaturedProjects;
