import React, { useMemo } from 'react';
import type { Result } from '../types';
import { MATURITY_LEVELS } from '../constants';


interface AnalysisReportProps {
  results: Result[];
  overallScore: number;
  overallMaturity: string;
}

// Recommendations are now more generic and tied to the Domain ID
const RECOMMENDATIONS: Record<string, string[]> = {
  'Risk & Compliance': [
    'تطوير سجل مخاطر شامل وتحديثه بشكل دوري ليشمل كافة الأصول الرقمية.',
    'تفعيل دور إدارة المخاطر في مراجعة المشاريع التقنية قبل التنفيذ.',
    'تعزيز برامج التوعية الأمنية للموظفين لضمان الامتثال للسياسات.',
  ],
  'IT Strategy': [
    'ضمان مواءمة استراتيجية تقنية المعلومات مع أهداف العمل الاستراتيجية للمؤسسة.',
    'تحديد مؤشرات أداء رئيسية (KPIs) لقياس مدى نجاح تنفيذ الاستراتيجية التقنية.',
    'عقد ورش عمل دورية مع أصحاب المصلحة لمراجعة خارطة الطريق التقنية.',
  ],
  'Innovation & AI': [
    'إنشاء بيئة تجريبية (Sandbox) لاختبار تقنيات الذكاء الاصطناعي قبل تعميمها.',
    'تخصيص ميزانية للبحث والتطوير لتبني التقنيات الناشئة.',
    'وضع إطار حوكمة أخلاقي لاستخدام البيانات والذكاء الاصطناعي.',
  ],
  'IT Assets': [
    'أتمتة عملية اكتشاف وتحديث الأصول التقنية لضمان دقة السجلات.',
    'مراجعة دورة حياة الأصول لضمان استبدال الأنظمة المتهالكة في الوقت المناسب.',
    'تحسين إدارة تراخيص البرمجيات لتقليل التكاليف وتجنب المخالفات القانونية.',
  ],
  'IT Operations': [
    'تطبيق أفضل الممارسات (مثل ITIL) لإدارة خدمات تقنية المعلومات.',
    'تحسين عمليات إدارة الحوادث والمشاكل لتقليل فترات التوقف.',
    'مراقبة الأداء التشغيلي للأنظمة بشكل استباقي لمنع الأعطال.',
  ],
  'Performance & Compliance': [
    'تطوير لوحات معلومات (Dashboards) لحظية لمراقبة الأداء والامتثال.',
    'إجراء تدقيق داخلي دوري للتحقق من الالتزام بالمعايير والسياسات.',
    'مقارنة الأداء مع المعايير العالمية والمؤسسات المماثلة (Benchmarking).',
  ],
};

const AnalysisReport: React.FC<AnalysisReportProps> = ({ results, overallScore, overallMaturity }) => {
  const { weakestDomains, strongestDomains } = useMemo(() => {
    const sortedByScore = [...results].sort((a, b) => a.score - b.score);
    const weakest = sortedByScore.slice(0, 3);
    const strongest = sortedByScore.reverse().slice(0, 2);
    return { weakestDomains: weakest, strongestDomains: strongest };
  }, [results]);

  const currentLevel = Math.floor(overallScore);
  const targetLevel = Math.min(currentLevel + 1, 5);


  return (
    <div className="space-y-10 text-right font-cairo" dir="rtl">
      
      <div>
         <h3 className="text-xl font-bold text-[#1D1D1B] mb-3 border-r-4 border-[#E0B703] pr-3">تحليل الوضع الحالي</h3>
         <p className="text-[#1D1D1B]/80 leading-relaxed text-lg">
           بناءً على تقييمك، يبلغ متوسط نضج حوكمة تقنية المعلومات <span className="font-bold text-[#1D1D1B]">{overallScore.toFixed(2)}</span>، مما يضع منظمتك في مستوى <span className="font-bold text-[#1D1D1B]">&quot;{overallMaturity}&quot;</span>.
         </p>
      </div>

       <div>
         <h3 className="text-xl font-bold text-[#1D1D1B] mb-4 border-r-4 border-[#E0B703] pr-3">مسار النضج الخاص بك</h3>
         <div className="bg-[#1D1D1B] rounded-2xl p-6 space-y-3 shadow-lg border border-gray-800">
           {MATURITY_LEVELS.slice().reverse().map(level => {
             const isAchieved = level.level < currentLevel;
             const isCurrent = level.level === currentLevel;
             const isTarget = level.level === targetLevel && currentLevel < 5;

             let bgClass = 'bg-white/5 border-transparent hover:bg-white/10';
             let textClass = 'text-gray-300';
             let titleClass = 'text-white';

             if(isCurrent) {
               bgClass = 'bg-white/20 border-white/30';
               textClass = 'text-white';
               titleClass = 'text-white font-bold';
             }
             if(isTarget) {
               bgClass = 'bg-[#E0B703] border-[#E0B703] shadow-[0_0_15px_rgba(224,183,3,0.4)]';
               textClass = 'text-[#1D1D1B]/80 font-medium';
               titleClass = 'text-[#1D1D1B] font-bold';
             }
             if(isAchieved) {
               bgClass = 'bg-green-500/10 border-transparent opacity-70';
               textClass = 'text-green-200';
               titleClass = 'text-green-100';
             }

             return (
               <div key={level.level} className={`flex items-start gap-4 p-3 rounded-xl transition-all duration-300 border ${bgClass}`}>
                  <div className={`w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center font-bold text-lg ${isTarget ? 'bg-[#1D1D1B] text-[#E0B703]' : isAchieved ? 'bg-green-500/20' : 'bg-white/10'}`}>
                     {level.level}
                  </div>
                  <div className="flex-grow">
                     <div className="flex justify-between items-center">
                       <h4 className={`text-base ${titleClass}`}>{level.title.replace(/ *\([^)]*\) */g, "")}</h4>
                       {isCurrent && <span className="text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">مستواك الحالي</span>}
                       {isTarget && <span className="text-xs font-bold bg-[#1D1D1B] text-[#E0B703] px-2 py-0.5 rounded-full">المستهدف التالي</span>}
                       {isAchieved && <span className="text-xs font-bold text-green-200 opacity-80">تم تحقيقه</span>}
                     </div>
                     <p className={`text-sm mt-1 leading-relaxed ${textClass}`}>{level.description}</p>
                  </div>
               </div>
             );
           })}
         </div>
       </div>

      {strongestDomains.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#EEECE7] overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-green-100">
            <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              أبرز نقاط القوة
            </h3>
          </div>
          <div className="p-6 space-y-6">
            {strongestDomains.map(domain => {
              const percentage = (domain.score / 5) * 100;
              return (
                <div key={domain.id}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-[#1D1D1B] text-lg">{domain.subject}</span>
                    <span className="text-green-700 font-bold bg-green-50 px-3 py-1 rounded-md">{domain.score.toFixed(2)} / 5</span>
                  </div>
                  <div className="w-full bg-[#F7F6F2] rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out relative group"
                      style={{ width: `${percentage}%` }}
                    >
                       <span className="absolute -top-8 left-0 transform -translate-x-1/2 bg-[#1D1D1B] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         اكتمال {percentage.toFixed(0)}%
                       </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#1D1D1B]/60 mt-2">
                    مستوى نضج متميز يعكس استقرار العمليات وكفاءتها.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {weakestDomains.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#EEECE7] overflow-hidden">
           <div className="bg-red-50 px-6 py-4 border-b border-red-100">
             <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
               الفجوات وتحديات النمو
             </h3>
           </div>
           
           <div className="p-6">
             <p className="text-[#1D1D1B]/70 mb-6">تشير النتائج إلى الحاجة للتركيز على المجالات التالية لتقليص الفجوة عن المستهدف (5.00):</p>
             
             <div className="space-y-6">
                {weakestDomains.map(domain => {
                  const percentage = (domain.score / 5) * 100;
                  const gap = 5 - domain.score;
                  return (
                    <div key={domain.id} className="relative">
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-[#1D1D1B] text-lg">{domain.subject}</span>
                          <div className="text-right">
                             <span className="text-sm text-[#1D1D1B]/40 ml-2">الفجوة: <span className="text-red-600 font-bold">-{gap.toFixed(2)}</span></span>
                             <span className="text-red-700 font-bold bg-red-50 px-3 py-1 rounded-md">{domain.score.toFixed(2)}</span>
                          </div>
                       </div>
                       
                       <div className="w-full bg-[#F7F6F2] rounded-full h-3 overflow-hidden flex">
                          <div 
                            className="bg-[#E0B703] h-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                          <div 
                            className="bg-red-200 h-full relative pattern-diagonal-lines" 
                            style={{ width: `${100 - percentage}%` }}
                          ></div>
                       </div>
                       
                       <div className="flex justify-between text-xs text-[#1D1D1B]/40 mt-1">
                          <span>0</span>
                          <span>المستهدف: 5.00</span>
                       </div>
                    </div>
                  );
                })}
             </div>
           </div>
        </div>
      )}

      {weakestDomains.length > 0 && (
        <div>
            <h3 className="text-xl font-bold text-[#1D1D1B] mb-6 border-r-4 border-blue-500 pr-3">خارطة طريق التحسين</h3>
            <p className="text-[#1D1D1B]/70 mb-6">نوصي باتخاذ الإجراءات التالية لتعزيز الكفاءة والحوكمة في المجالات ذات الأولوية:</p>
            
            <div className="grid gap-6">
              {weakestDomains.map(domain => (
                <div key={domain.id} className="bg-white p-6 rounded-lg shadow-sm border border-[#EEECE7]">
                  <h4 className="font-bold text-lg text-[#E0B703] mb-4 pb-2 border-b border-[#F7F6F2] flex items-center">
                    <span className="bg-[#E0B703]/20 text-[#E0B703] w-8 h-8 rounded-full flex items-center justify-center ml-3 text-sm">
                      {domain.score < 2 ? '!' : 'i'}
                    </span>
                    {domain.subject}
                  </h4>
                  <ul className="space-y-3">
                    {RECOMMENDATIONS[domain.id]?.map((rec, index) => (
                      <li key={index} className="flex items-start text-[#1D1D1B]/80 leading-relaxed">
                        <span className="text-[#E0B703] ml-2 mt-1.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
        </div>
      )}

    </div>
  );
};

export default AnalysisReport;
