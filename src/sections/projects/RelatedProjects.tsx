'use client';

import React from 'react';
import { Bricolage_Grotesque, Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

const bricolage = Bricolage_Grotesque({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

interface ProjectCardProps {
  id: string;
  title: string;
  type: string;
  location: string;
  price: string;
  size: string;
  image: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  type,
  location,
  price,
  size,
  image,
}) => {
  return (
    <div className="flex flex-col w-[360px] h-[280px] bg-[#0A0A0A] rounded-lg overflow-hidden shadow-lg">
      {/* Image Container */}
      <div className="relative w-full h-[160px] bg-gray-800">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        
        {/* Type Badge */}
        <div className="absolute top-2 right-2 bg-white rounded-full p-1">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M8 0L15.5 4V12L8 16L0.5 12V4L8 0Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        
        {/* Property Type Tag */}
        <div className="absolute bottom-2 left-2 bg-white rounded px-2 py-0.5">
          <span className="text-xs font-medium text-black">{type}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className={`${inter.className} text-lg font-medium text-white mb-1 line-clamp-1`}>
          {title}
        </h3>
        
        <div className="flex items-center text-[#E0E0E0] text-sm mb-3">
          <svg
            className="w-3.5 h-3.5 mr-1"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 8.5C9.10457 8.5 10 7.60457 10 6.5C10 5.39543 9.10457 4.5 8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 7.60457 6.89543 8.5 8 8.5Z"
              fill="#9CA3AF"
            />
            <path
              d="M8 0.5C4.13 0.5 1 3.63 1 7.5C1 11.87 8 15.5 8 15.5C8 15.5 15 11.87 15 7.5C15 3.63 11.87 0.5 8 0.5ZM8 10.5C6.34315 10.5 5 9.15685 5 7.5C5 5.84315 6.34315 4.5 8 4.5C9.65685 4.5 11 5.84315 11 7.5C11 9.15685 9.65685 10.5 8 10.5Z"
              fill="#9CA3AF"
            />
          </svg>
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="bg-white/10 text-white text-xs font-medium px-2 py-1 rounded">
            {price}
          </div>
          <span className="text-[#E0E0E0] text-xs">{size}</span>
        </div>
      </div>
    </div>
  );
};

const RelatedProjects = () => {
  const relatedProjects = [
    {
      id: 'shilp-business-gateway',
      title: 'Shilp Business Gateway',
      type: 'Prime Location',
      location: 'SG Highway, Chharodi',
      price: '£75/sq ft',
      size: '5,000-20,000 sq ft',
      image: '/images/projects/shilp-business-gateway.jpg',
    },
    {
      id: 'kensington-hotel',
      title: 'Kensington Hotel',
      type: 'Industrial',
      location: 'Memnagar',
      price: '£15.5M',
      size: '45 Rooms',
      image: '/images/projects/kensington-hotel.jpg',
    },
    {
      id: 'pehel',
      title: 'Pehel',
      type: 'Retail Space',
      location: 'Vaishnodevi Circle',
      price: '£120/sq ft',
      size: '2,500-8,000 sq ft',
      image: '/images/projects/pehel.jpg',
    },
  ];

  return (
    <section className="w-full bg-[#0A0A0A] py-20 px-16">
      <div className=" mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`${bricolage.className} text-2xl font-medium text-white`}>
            Other Projects of The Stolen Group
          </h2>
          <Link href="/projects" className="text-white text-sm underline">
            View All
          </Link>
        </div>
        
        <div className="flex gap-7 overflow-x-auto pb-4 scrollbar-hide">
          {relatedProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="flex-shrink-0">
              <ProjectCard {...project} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProjects;
