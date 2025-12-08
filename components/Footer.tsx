
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1D1D1B] border-t border-[#333]">
      <div className="container mx-auto px-4 py-6 text-center text-[#F7F6F2]/60 text-sm">
        <p>&copy; {new Date().getFullYear()} مؤسسة عبدالله الراجحي الخيرية - رفع مستوى نضج حوكمة تقنية المعلومات .</p>
        <p className="mt-1">مبني على معايير COBIT Foundation 2019</p>
      </div>
    </footer>
  );
};

export default Footer;