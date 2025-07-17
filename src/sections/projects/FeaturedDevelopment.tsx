import React from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/app/admin/types';

interface FeaturedDevelopmentProps {
  text: string;
  images: GalleryItem[];
}

const FeaturedDevelopment: React.FC<FeaturedDevelopmentProps> = ({ text, images }) => {
  return (
    <section className="w-full bg-black px-16 py-20">
      <div className=" mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2 w-full">
          <h2 className="text-2xl font-medium text-white font-['Bricolage_Grotesque']">
            Featured Development
          </h2>
          <p className="text-[#F3F3F3] text-lg font-light leading-relaxed max-w-[1312px]">
            {text || 'No description provided.'}
          </p>
        </div>
        {/* Image Grid */}
        <div className="flex gap-6 w-full h-[420px]">
          {images && images.length > 0 ? (
            images.map((img, idx) => (
              <div key={idx} className={`relative h-full rounded-lg overflow-hidden`} style={{ width: `${100 / images.length}%` }}>
                <Image
                  src={img.data || img.url || ''}
                  alt={img.name || `Development showcase ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <div className="text-gray-400">No images provided.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDevelopment;
