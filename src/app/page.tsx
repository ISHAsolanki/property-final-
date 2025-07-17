'use client';

import Hero from "@/sections/landing/Hero";
import FeaturedProjects from "@/sections/landing/FeaturedProjects";
import ResidentialSpaces from "@/sections/landing/ResidentialSpaces";
import CommercialSpaces from "@/sections/landing/CommercialSpaces";
import LocationCollections from "@/sections/landing/LocationCollections";
import TrendingProjects from "@/sections/landing/TrendingProjects";
import ArticlesSection from "@/sections/landing/ArticlesSection";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";
import React, { useState } from 'react';

export default function Home() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  return (
    <>
      <Navigation />
      <Hero />
      <FeaturedProjects onShowAll={setShowAllProjects} />
      {!showAllProjects && <ResidentialSpaces />}
      {!showAllProjects && <CommercialSpaces />}
      {!showAllProjects && <LocationCollections />}
      {!showAllProjects && <TrendingProjects />}
      {!showAllProjects && <ArticlesSection />}
      <Footer />
    </>
  );
}
