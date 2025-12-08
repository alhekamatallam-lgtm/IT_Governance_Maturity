import React from 'react';
import type { Domain, Question } from '../types';

interface QuestionnaireProps {
  domains: Domain[];
  currentDomainIndex: number;
  answers: Record<string, Record<string, number>>;
  onAnswerChange: (domainId: string, questionText: string, score: number) => void;
  onSubmit: (event: React.FormEvent) => void;
  isComplete: boolean;
  onNext: () => void;
  onPrev: () => void;
}

const RatingScale: React.FC<{
  domainId: string;
  questionText: string;
  selectedValue: number | undefined;
  onChange: (domainId: string, questionText: string, score: number) => void;
}> = ({ domainId, questionText, selectedValue, onChange }) => {
  const ratings = [
    { value: 1, label: 'مبدئي' },
    { value: 2, label: 'مُدار' },
    { value: 3, label: 'مُعرَّف' },
    { value: 4, label: 'مُدار كميًا' },
    { value: 5, label: 'تحسين' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-sm bg-[#F7F6F2] p-3 rounded-lg border border-[#EEECE7]">
      {ratings.map(({ value, label }) => (
        <label key={value} className={`flex flex-col items-center gap-1 cursor-pointer p-2 rounded-md transition-all duration-200 w-20 sm:w-24 ${selectedValue === value ? 'bg-[#E0B703]/20 border border-[#E0B703] transform scale-105 shadow-sm' : 'hover:bg-white'}`}>
          <span className={`text-center font-medium ${selectedValue === value ? 'text-[#1D1D1B]' : 'text-[#1D1D1B]/60'}`}>{label} ({value})</span>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedValue === value ? 'border-[#E0B703] bg-[#E0B703]' : 'border-[#DDD] bg-white'}`}>
             {selectedValue === value && <div className="w-2 h-2 bg-[#1D1D1B] rounded-full"></div>}
          </div>
          <input
            type="radio"
            name={`q-${domainId}-${questionText}`}
            value={value}
            checked={selectedValue === value}
            onChange={() => onChange(domainId, questionText, value)}
            className="hidden"
          />
        </label>
      ))}
    </div>
  );
};

const Questionnaire: React.FC<QuestionnaireProps> = ({ 
  domains, 
  currentDomainIndex, 
  answers, 
  onAnswerChange, 
  onSubmit, 
  isComplete,
  onNext,
  onPrev
}) => {
  const currentDomain = domains[currentDomainIndex];
  const domainAnswers = answers[currentDomain.id] || {};

  return (
    <form onSubmit={onSubmit} className="space-y-8 mt-6 animate-fade-in">
      <div key={currentDomain.id} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#EEECE7]">
        <div className="mb-6 border-b border-[#F7F6F2] pb-4">
          <h2 className="text-2xl font-bold text-[#1D1D1B]">{currentDomain.title}</h2>
          <p className="text-[#1D1D1B]/60 text-sm mt-1">{currentDomain.description}</p>
        </div>

        <div className="space-y-6">
          {currentDomain.questions.map((question, qIndex) => (
             <div key={qIndex} className="py-4 border-b border-[#F7F6F2] last:border-b-0">
               <div className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1D1D1B] text-[#E0B703] flex items-center justify-center font-bold text-sm">
                    {qIndex + 1}
                  </span>
                  <p className="text-base text-[#1D1D1B] leading-relaxed font-medium pt-1.5">{question.text}</p>
               </div>
               <div className="pr-11">
                 <RatingScale
                   domainId={currentDomain.id}
                   questionText={question.text}
                   selectedValue={domainAnswers[question.text]}
                   onChange={onAnswerChange}
                 />
               </div>
             </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-6 sticky bottom-4 z-20">
        <div className="backdrop-blur-sm bg-[#F7F6F2]/90 p-2 rounded-lg">
          {currentDomainIndex > 0 && (
            <button
              type="button"
              onClick={onPrev}
              className="px-8 py-3 bg-white text-[#1D1D1B] font-bold border border-[#DDD] rounded-lg shadow-sm hover:bg-[#F7F6F2] focus:outline-none transition-all duration-300"
            >
              السابق
            </button>
          )}
        </div>

        <div className="backdrop-blur-sm bg-[#F7F6F2]/90 p-2 rounded-lg">
          {currentDomainIndex < domains.length - 1 ? (
            <button
              type="button"
              onClick={onNext}
              className="px-10 py-3 bg-[#1D1D1B] text-white font-bold rounded-lg shadow-md hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D1D1B] disabled:bg-[#DDD] disabled:text-[#1D1D1B]/40 disabled:cursor-not-allowed transition-all duration-300"
            >
              التالي
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isComplete}
              className="px-12 py-3 bg-[#E0B703] text-[#1D1D1B] font-bold rounded-lg shadow-md hover:bg-[#c7a302] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E0B703] disabled:bg-[#DDD] disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              عرض التقرير النهائي
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default Questionnaire;
