"use client";
import React from "react";
import Navigation from "@/components/common/Navigation";
import Footer from "@/components/common/Footer";
import InquirySection from "@/sections/projects/InquirySection";

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <div className="pt-24 bg-[#0A0A0A] min-h-[80vh]">
        <InquirySection />
      </div>
      <Footer />
    </>
  );
} 