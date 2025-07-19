'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/app/admin/types';

function formatPriceRange(price: any): string {
  if (!price) return '';
  if (typeof price === 'string') return price;
  if (typeof price === 'object' && price.from && price.to) {
    const from = price.from.value ? `${price.from.value} ${price.from.unit}` : '';
    const to = price.to.value ? `${price.to.value} ${price.to.unit}` : '';
    if (from && to) return `${from} to ${to}`;
    return from || to || '';
  }
  return '';
}

const ProjectCard: React.FC<Property & { priceRange?: any }> = ({ _id, name, location, gallery, trendingScore, priceRange }) => {
  let imageSrc = '/public/placeholder.png';
  if (gallery && gallery[0]) {
    imageSrc = gallery[0].data || gallery[0].url || imageSrc;
  }
  return (
    <Link 
      href={`/projects/${_id}`} 
      className="group relative block w-full h-full overflow-hidden rounded-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-0 left-0 w-8 h-8 bg-red-600 text-white flex items-center justify-center text-sm font-bold">
          {trendingScore}
        </div>
      </div>
      <div className="bg-[#262626] p-4">
        <h3 className="text-white text-lg font-medium truncate">{name}</h3>
        <p className="text-gray-400 text-sm mt-1">{location}</p>
        <p className="text-white text-sm mt-1 bg-white/10 rounded px-2 py-1 w-fit">
          {formatPriceRange(priceRange)}
        </p>
      </div>
    </Link>
  );
};

const TrendingProjects: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Sort by trendingScore ascending (rank 1 is top), filter only those with trendingScore
          const sorted = data.properties
            .filter((p: Property) => typeof p.trendingScore === 'number')
            .sort((a: Property, b: Property) => (a.trendingScore || 999) - (b.trendingScore || 999));
          setProperties(sorted.slice(0, 10));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="w-full bg-[#1A1A1A] py-12 sm:py-16 lg:py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0">Top 10 Trending Projects This Week</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : properties.length === 0 ? (
            <div className="text-gray-400">No trending properties found.</div>
          ) : (
            properties.map((property) => (
              <ProjectCard key={property._id} {...property} priceRange={property.priceRange} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingProjects;
