
import React from 'react';
import type { MaturityLevel } from '../types';

interface MaturityLevelsGuideProps {
  levels: MaturityLevel[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MaturityLevelsGuide: React.FC<MaturityLevelsGuideProps> = ({ levels, isOpen, setIsOpen }) => {
  return (
    <div className="mb-8 bg-white rounded-xl shadow-lg border border-[#EEECE7] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-[#F7F6F2] hover:bg-[#EEECE7] transition-colors text-right flex justify-between items-center"
      >
        <h2 className="text-xl font-bold text-[#1D1D1B]">دليل مستويات النضج (COBIT 2019)</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 text-[#1D1D1B] transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-6">
          <p className="mb-4 text-[#1D1D1B]/80">
            استخدم هذه الإرشادات لتقييم كل سؤال على مقياس من 1 (الأدنى) إلى 5 (الأعلى).
          </p>
          <div className="space-y-4">
            {levels.map((level) => (
              <div key={level.level} className="p-4 bg-[#F7F6F2] border-r-4 border-[#E0B703] rounded">
                <h3 className="font-bold text-[#1D1D1B]">
                  {level.level} - {level.title}
                </h3>
                <p className="text-[#1D1D1B]/70 mt-1">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaturityLevelsGuide;