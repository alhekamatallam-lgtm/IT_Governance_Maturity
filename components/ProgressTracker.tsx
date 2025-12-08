
import React from 'react';
import type { Domain } from '../types';

interface ProgressTrackerProps {
  domains: Domain[];
  currentIndex: number;
  completionStatus: boolean[];
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1D1D1B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);


const ProgressTracker: React.FC<ProgressTrackerProps> = ({ domains, currentIndex, completionStatus }) => {
  return (
    <div className="mb-8 p-4 bg-white rounded-xl shadow-lg border border-[#EEECE7]">
      <h2 className="text-xl font-bold text-center text-[#1D1D1B] mb-6">تقدم التقييم</h2>
      <div className="flex items-center">
        {domains.map((domain, index) => {
          const isCompleted = completionStatus[index];
          const isActive = index === currentIndex;
          
          let circleClasses = 'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 z-10';
          let lineClasses = 'flex-auto border-t-2 transition-colors duration-300';

          if (isActive) {
            circleClasses += ' bg-[#E0B703] text-[#1D1D1B] shadow-lg scale-110';
          } else if (isCompleted) {
            circleClasses += ' bg-[#E0B703] text-[#1D1D1B]';
          } else {
            circleClasses += ' bg-[#EEECE7] text-[#1D1D1B]/40';
          }

          if(isCompleted || isActive) {
            lineClasses += ' border-[#E0B703]';
          } else {
            lineClasses += ' border-[#EEECE7]';
          }

          return (
            <React.Fragment key={domain.id}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={circleClasses}>
                  {isCompleted && !isActive ? <CheckIcon /> : index + 1}
                </div>
                <p className={`text-center text-xs mt-2 w-24 ${isActive ? 'font-bold text-[#E0B703]' : 'text-[#1D1D1B]/60'}`}>
                  {domain.title.split('. ')[1] || domain.title}
                </p>
              </div>
              {index < domains.length - 1 && (
                <div className={lineClasses}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;