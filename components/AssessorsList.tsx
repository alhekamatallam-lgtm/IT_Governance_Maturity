import React from 'react';
import type { Result } from '../types';

export interface AssessorData {
  name: string;
  email: string;
  mobile: string;
  overallAverage: number;
  results: Result[];
}

interface AssessorsListProps {
  assessors: AssessorData[];
  onBack: () => void;
  onViewDetails: (assessor: AssessorData) => void;
}

const AssessorsList: React.FC<AssessorsListProps> = ({ assessors, onBack, onViewDetails }) => {
  if (assessors.length === 0) {
    return (
      <div className="animate-fade-in space-y-8 text-center py-20">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#1D1D1B]">استعراض نتائج المقيمين</h1>
            <button onClick={onBack} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors">
              العودة
            </button>
         </div>
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-gray-500 text-lg">لا توجد بيانات تقييم لعرضها حاليًا.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      <div className="flex justify-between items-center pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-[#1D1D1B]">استعراض نتائج المقيمين</h1>
          <p className="text-gray-500 mt-1">إجمالي المقيمين: {assessors.length}</p>
        </div>
        <button onClick={onBack} className="bg-gray-100 text-gray-700 font-bold py-2.5 px-6 rounded-xl hover:bg-gray-200 transition-all">
          العودة للرئيسية
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {assessors.map((assessor, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#E0B703]/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#F7F6F2] rounded-full flex items-center justify-center text-[#E0B703] font-bold text-xl">
                    {assessor.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#1D1D1B]">{assessor.name}</h2>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {assessor.email}
                      </span>
                      {assessor.mobile && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          {assessor.mobile}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-center md:text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">متوسط النضج</p>
                        <p className="text-3xl font-extrabold text-[#E0B703]">{assessor.overallAverage.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => onViewDetails(assessor)}
                      className="bg-[#1D1D1B] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#333] transition-all shadow-lg shadow-black/10 flex items-center gap-2"
                    >
                      عرض التقرير
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m14-2v-2a4 4 0 00-4-4h-2a4 4 0 00-4 4v2m14-2h2m-2 2h2m-4-2v2m-6-4v-2a4 4 0 014-4h2a4 4 0 014 4v2" /></svg>
                    </button>
                </div>
            </div>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {assessor.results.map(result => (
                <div key={result.id} className="bg-[#F7F6F2] p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 truncate w-full">{result.subject.split(' — ')[0]}</span>
                  <span className="text-lg font-extrabold text-[#1D1D1B]">{result.score.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessorsList;
