"use client";
import React, { useEffect, useState } from "react";
import ProjectCard from "@/components/property/ProjectCard";
import { Property } from "@/app/admin/types";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const LandPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProperties(data.properties.filter((p: Property) => p.propertyType === "Land"));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = properties.filter((p) =>
    p.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'asc') {
      const aPrice = parseFloat((a.priceRange.match(/([\d.]+)/g) || [])[0] || '0');
      const bPrice = parseFloat((b.priceRange.match(/([\d.]+)/g) || [])[0] || '0');
      return aPrice - bPrice;
    } else if (sortOrder === 'desc') {
      const aPrice = parseFloat((a.priceRange.match(/([\d.]+)/g) || [])[0] || '0');
      const bPrice = parseFloat((b.priceRange.match(/([\d.]+)/g) || [])[0] || '0');
      return bPrice - aPrice;
    }
    return 0;
  });

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#181818] text-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-10 mt-8 leading-tight font-['Bricolage_Grotesque']">
            All Land Properties
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="px-3 py-2 rounded bg-[#222] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300 mr-2">Sort by price:</span>
              <button
                className={`px-3 py-2 rounded bg-[#222] border border-gray-700 text-white flex items-center gap-2 ${sortOrder === 'asc' ? 'ring-2 ring-red-500' : ''}`}
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'default' : 'asc')}
              >
                <FaSortAmountDown /> Low to High
              </button>
              <button
                className={`px-3 py-2 rounded bg-[#222] border border-gray-700 text-white flex items-center gap-2 ${sortOrder === 'desc' ? 'ring-2 ring-red-500' : ''}`}
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'default' : 'desc')}
              >
                <FaSortAmountUp /> High to Low
              </button>
            </div>
          </div>
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : sorted.length === 0 ? (
            <div className="text-gray-400">No land properties found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sorted.map((property) => (
                <Link key={property._id} href={`/projects/${property._id}`} className="block">
                  <ProjectCard project={{
                    id: property._id || '',
                    title: property.name,
                    location: property.location,
                    price: property.priceRange,
                    type: property.propertyType,
                    status: ([
                      'new-launch',
                      'rera-approved',
                      'ready-to-move',
                      'prime-location',
                      'retail-space',
                      'co-working',
                      'industrial',
                    ].includes(property.status)
                      ? property.status
                      : 'new-launch') as any,
                    image:
                      (property.gallery && property.gallery[0] && (property.gallery[0].data || property.gallery[0].url)) || '',
                    bhk: property.keyHighlights.unitConfiguration || '',
                  }} tagPosition="bottom" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LandPage; 