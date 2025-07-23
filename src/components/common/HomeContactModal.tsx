import React, { useState } from 'react';
import ContactInquirySection from '@/sections/projects/ContactInquirySection';

const HomeContactModal: React.FC = () => {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
      <div className="relative w-full flex justify-center items-center">
        <div className="relative w-full max-w-6xl">
          <ContactInquirySection onClose={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
};

export default HomeContactModal;
