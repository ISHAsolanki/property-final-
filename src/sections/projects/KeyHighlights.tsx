import React from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface Highlights {
  reraApproved: boolean;
  possessionDate: string;
  unitConfiguration: string;
  carpetArea: string;
  otherAmenities: string[];
  igbcGoldCertified: boolean;
}

interface KeyHighlightsProps {
  highlights: Highlights;
}

const icons = {
  rera: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 1.5C6.5 1.5 1.5 6.5 1.5 12.5C1.5 18.5 6.5 23.5 12.5 23.5C18.5 23.5 23.5 18.5 23.5 12.5C23.5 6.5 18.5 1.5 12.5 1.5Z" fill="#E50914"/>
      <path d="M12.5 6.5V12.5L17.5 15.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  possession: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.5 4.5H5.5C4.94772 4.5 4.5 4.94772 4.5 5.5V19.5C4.5 20.0523 4.94772 20.5 5.5 20.5H19.5C20.0523 20.5 20.5 20.0523 20.5 19.5V5.5C20.5 4.94772 20.0523 4.5 19.5 4.5Z" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.5 2.5V6.5" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8.5 2.5V6.5" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.5 10.5H20.5" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  carpet: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.5 9.5C21.5 8 20.5 6.5 17.5 6.5C14.5 6.5 10.5 6.5 7.5 6.5C4.5 6.5 3.5 8 3.5 9.5V19.5C3.5 21 4.5 22.5 7.5 22.5H17.5C20.5 22.5 21.5 21 21.5 19.5V9.5Z" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.5 6.5V3.5C7.5 2.94772 7.94772 2.5 8.5 2.5H16.5C17.0523 2.5 17.5 2.94772 17.5 3.5V6.5" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.5 12.5H12.51" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  amenities: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 2.5L3.5 12.5H10.5V22.5H14.5V12.5H21.5L12.5 2.5Z" fill="#E50914"/>
    </svg>
  ),
  igbc: (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.5 12.5C22.5 18.0228 18.0228 22.5 12.5 22.5C6.97715 22.5 2.5 18.0228 2.5 12.5C2.5 6.97715 6.97715 2.5 12.5 2.5C13.5 2.5 14.5 2.7 15.5 3" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22.5 4.5V10.5H16.5" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22.5 4.5L12.5 14.5" stroke="#E50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const KeyHighlights: React.FC<KeyHighlightsProps> = ({ highlights }) => {
  const dynamicHighlights = [
    {
      icon: icons.rera,
      title: 'RERA Approved',
      description: highlights.reraApproved ? 'Project is RERA approved' : 'Not RERA approved',
    },
    {
      icon: icons.possession,
      title: 'Possession',
      description: highlights.possessionDate || 'N/A',
    },
    {
      icon: icons.carpet,
      title: 'Unit Configuration',
      description: highlights.unitConfiguration || 'N/A',
    },
    {
      icon: icons.carpet,
      title: 'Carpet Area',
      description: highlights.carpetArea || 'N/A',
    },
    {
      icon: icons.amenities,
      title: 'Other Amenities',
      description: highlights.otherAmenities && highlights.otherAmenities.length > 0 ? highlights.otherAmenities.filter(Boolean).join(', ') : 'N/A',
    },
    {
      icon: icons.igbc,
      title: 'IGBC Gold Certified',
      description: highlights.igbcGoldCertified ? 'IGBC Gold certified sustainable design' : 'Not IGBC certified',
    },
  ];

  return (
    <section className="w-full bg-black overflow-hidden">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          isolation: 'isolate',
          minHeight: '357px',
          width: '100%',
        }}>
          <div className="w-full h-full">
            <div className="flex flex-col w-full h-full">
              {/* Header */}
              <div className="flex justify-between items-center w-full">
                <h2 className="text-2xl font-medium text-white font-['Bricolage_Grotesque']">
                  Key Highlights
                </h2>
                <div className="flex gap-3">
                  <button className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center">
                    <FaChevronLeft className="text-white w-3 h-3" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-[#121212] flex items-center justify-center">
                    <FaChevronRight className="text-white w-3 h-3" />
                  </button>
                </div>
              </div>
              {/* Highlights Grid */}
              <div className="relative w-full mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {dynamicHighlights.map((item, index) => (
                    <div key={index} className="bg-[#0A0A0A] rounded-lg p-6 shadow-lg">
                      <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-full bg-[rgba(229,9,20,0.1)] flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white mb-1">{item.title}</h3>
                          <p className="text-sm text-[#E0E0E0]">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Gradient overlay for scroll effect */}
                <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeyHighlights;
