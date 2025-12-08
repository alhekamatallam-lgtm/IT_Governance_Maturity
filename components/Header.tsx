
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <header className="bg-white border-b-[6px] border-[#E0B703] shadow-md relative">
      {/* Decorative background pattern - Subtle */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1D1D1B" strokeWidth="0.5"/>
                  </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
      </div>

      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Section (Right Side in RTL) */}
          <div className="flex-shrink-0 order-1 md:order-1">
             {!imageError ? (
                <img 
                  src="https://i.ibb.co/Z6gKcQB7/project-Field-Plan-nav-logo230655.png" 
                  alt="مؤسسة عبدالله الراجحي الخيرية" 
                  className="h-20 md:h-24 w-auto object-contain"
                  onError={() => setImageError(true)}
                />
             ) : (
                <div className="flex flex-col items-start justify-center h-20 border-r-4 border-[#E0B703] pr-4">
                   <h2 className="text-[#1D1D1B] font-bold text-xl leading-tight">مؤسسة</h2>
                   <h2 className="text-[#E0B703] font-bold text-2xl leading-tight">عبدالله الراجحي الخيرية</h2>
                </div>
             )}
          </div>
          
          {/* Title Section (Left Side in RTL) */}
          <div className="text-center md:text-left flex-grow order-2 md:order-2 md:mr-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1D1D1B] tracking-wide mb-1">
              تقييم نضج حوكمة تقنية المعلومات I&T
            </h1>
            <div className="flex items-center justify-center md:justify-end gap-2 text-[#1D1D1B]/70 text-sm md:text-base">
              <span>منظومة قياس الأداء الرقمي وفق معايير</span>
              <span className="font-bold bg-[#1D1D1B] text-[#E0B703] px-2 py-0.5 rounded text-xs">COBIT 2019</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;