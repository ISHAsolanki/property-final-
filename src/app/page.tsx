import Hero from "@/sections/landing/Hero";
import FeaturedProjects from "@/sections/landing/FeaturedProjects";
import ResidentialSpaces from "@/sections/landing/ResidentialSpaces";
import CommercialSpaces from "@/sections/landing/CommercialSpaces";
import LocationCollections from "@/sections/landing/LocationCollections";
import TrendingProjects from "@/sections/landing/TrendingProjects";
import ArticlesSection from "@/sections/landing/ArticlesSection";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <FeaturedProjects />
      <ResidentialSpaces />
      <CommercialSpaces />
      <LocationCollections />
      <TrendingProjects />
      <ArticlesSection />
      <Footer />
    </>
  );
}
