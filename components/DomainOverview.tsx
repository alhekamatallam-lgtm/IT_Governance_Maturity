
import React, { useState, useEffect } from 'react';
import type { Domain, Section, Criterion } from '../types';
import { MATURITY_LEVELS } from '../constants';


interface DomainOverviewProps {
  domains: Domain[];
  onStart: () => void;
  onViewStats: () => void;
  onViewMaturityReport: () => void;
}

const Icons = {
  Governance: () => <svg className="w-10 h-10 text-[#E0B703]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00-586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  Strategy: () => <svg className="w-10 h-10 text-[#E0B703]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Framework: () => <svg className="w-10 h-10 text-[#E0B703]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Maturity: () => <svg className="w-10 h-10 text-[#E0B703]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
};

const CriterionGuidance: React.FC<{ criterion: Criterion }> = ({ criterion }) => {
  const levelInfo = MATURITY_LEVELS.find(l => l.level === criterion.referenceLevel);

  return (
    <div className="mt-4 w-full pr-5 pl-2">
      <div className="bg-[#F7F6F2] rounded-xl border border-[#EEECE7] p-5 space-y-4 shadow-inner">
        
        {criterion.relatedQuestion && (
          <div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#E0B703]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h5 className="font-bold text-sm text-[#1D1D1B]">السؤال المرتبط بالتقييم</h5>
            </div>
            <p className="mt-2 text-sm text-[#1D1D1B]/80 leading-relaxed pr-7">{criterion.relatedQuestion}</p>
          </div>
        )}

        {criterion.assessmentFocus && (
          <div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#E0B703]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <h5 className="font-bold text-sm text-[#1D1D1B]">محور التقييم (كيف يُقيّم)</h5>
            </div>
            <p className="mt-2 text-sm text-[#1D1D1B]/80 leading-relaxed pr-7">{criterion.assessmentFocus}</p>
          </div>
        )}

        {criterion.referenceLevel !== undefined && levelInfo && (
           <div className="bg-white p-4 rounded-lg border border-gray-200">
             <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#E0B703]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h5 className="font-bold text-sm text-[#1D1D1B]">مستوى النضج المرجعي</h5>
            </div>
             <div className="flex items-baseline gap-4 mt-2 pr-7">
                <span className="font-extrabold text-4xl text-[#1D1D1B]">{criterion.referenceLevel}</span>
                <span className="font-bold text-sm text-[#1D1D1B]/70">{levelInfo.title}</span>
             </div>
           </div>
        )}
        
        {criterion.formalStatement && (
          <div>
            <div className="flex items-center gap-2">
               <svg className="w-5 h-5 text-[#E0B703]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <h5 className="font-bold text-sm text-[#1D1D1B]">التفسير الرسمي (لماذا يعتبر ناضجاً)</h5>
            </div>
            <p className="mt-2 text-sm text-[#1D1D1B]/80 leading-relaxed bg-white p-3 rounded-md border border-gray-200 pr-4">{criterion.formalStatement}</p>
          </div>
        )}

        {criterion.improvementOpportunities && (
          <div>
            <div className="flex items-center gap-2">
               <svg className="w-5 h-5 text-[#E0B703]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              <h5 className="font-bold text-sm text-[#1D1D1B]">فرص التحسين (ماذا نفعل؟)</h5>
            </div>
            <p className="mt-2 text-sm text-[#1D1D1B]/80 leading-relaxed bg-white p-3 rounded-md border border-gray-200 pr-4">{criterion.improvementOpportunities}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CriterionItem: React.FC<{ criterion: Criterion }> = ({ criterion }) => {
  const [showGuidance, setShowGuidance] = useState(false);
  const hasGuidance = criterion.assessmentFocus || criterion.referenceLevel !== undefined || criterion.formalStatement || criterion.improvementOpportunities || criterion.relatedQuestion;

  return (
    <li className="flex flex-col items-start gap-2 text-[#1D1D1B]/80 text-sm py-2 border-b border-gray-100 last:border-0">
      <div className="w-full flex justify-between items-start">
        <div className="flex items-start gap-2">
          <span className="text-[#E0B703] mt-1">•</span>
          <span>{criterion.text}</span>
        </div>
        {hasGuidance && (
          <button 
            onClick={() => setShowGuidance(!showGuidance)}
            className="flex-shrink-0 text-xs flex items-center gap-1 text-[#1D1D1B]/60 hover:text-[#E0B703] font-bold"
          >
            {showGuidance ? 'إخفاء الأدلة' : 'عرض الأدلة'}
            <svg className={`w-3 h-3 transition-transform ${showGuidance ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        )}
      </div>
      {hasGuidance && showGuidance && (
         <div className="w-full pt-2 animate-fade-in">
            <CriterionGuidance criterion={criterion} />
         </div>
      )}
    </li>
  );
};

const SectionAccordion: React.FC<{ section: Section }> = ({ section }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-[#EEECE7] rounded-lg overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 text-right flex justify-between items-center transition-colors duration-300 ${isOpen ? 'bg-[#F7F6F2]' : 'bg-white hover:bg-[#F7F6F2]'}`}
      >
        <div className="flex items-center gap-3">
          <svg className={`w-4 h-4 text-[#1D1D1B]/50 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <h3 className="font-bold text-sm text-[#1D1D1B]">{section.title}</h3>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
          {section.criteria.length} معايير
        </span>
      </button>
      {isOpen && (
        <div className="p-4 border-t border-[#EEECE7]">
          <ul className="space-y-0">
            {section.criteria.map((criterion, idx) => (
              <CriterionItem key={idx} criterion={criterion} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const DomainOverview: React.FC<DomainOverviewProps> = ({ domains, onStart, onViewStats, onViewMaturityReport }) => {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  useEffect(() => {
    if (selectedDomain) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { // Cleanup function
      document.body.style.overflow = '';
    };
  }, [selectedDomain]);

  const handleOpenDetails = (domain: Domain) => setSelectedDomain(domain);
  const handleCloseDetails = () => setSelectedDomain(null);

  return (
    <div className="space-y-16 animate-fade-in pb-12 relative">
      
      <div className="relative bg-[#1D1D1B] rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E0B703] opacity-5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -ml-10 -mb-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
           <div className="flex-grow text-center md:text-right space-y-6">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">ارتقِ بحوكمة التقنية <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0B703] to-[#F3D566]">وفق معايير عالمية</span></h1>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">{`يهدف هذا التقييم إلى رفع مستوى نضج حوكمة تقنية المعلومات في مؤسسة عبدالله عبدالعزيز الراجحي الخيرية، وذلك من خلال تطبيق إطار COBIT 2019 Foundation بوصفه الإطار الدولي الأكثر شمولًا واعتمادًا في تنظيم وحوكمة المعلومات والتقنية، وبما يضمن مواءمة العمليات التقنية مع الأهداف المؤسسية وتعزيز الكفاءة والامتثال.`}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <button onClick={onStart} className="px-8 py-3.5 bg-[#E0B703] text-[#1D1D1B] font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(224,183,3,0.3)] hover:shadow-[0_0_30px_rgba(224,183,3,0.5)] hover:bg-[#F3D566] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"><span>ابدأ التقييم الآن</span><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
                <button onClick={onViewStats} className="px-8 py-3.5 bg-white/10 text-white font-bold text-lg rounded-xl border border-white/20 hover:bg-white/20 backdrop-blur-md transition-all duration-300 flex items-center gap-2"><span>لوحة المؤشرات</span><svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></button>
                <button onClick={onViewMaturityReport} className="px-8 py-3.5 bg-white/10 text-white font-bold text-lg rounded-xl border border-white/20 hover:bg-white/20 backdrop-blur-md transition-all duration-300 flex items-center gap-2"><span>تقرير النضج</span><svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m14-2v-2a4 4 0 00-4-4h-2a4 4 0 00-4 4v2m14-2h2m-2 2h2m-4-2v2m-6-4v-2a4 4 0 014-4h2a4 4 0 014 4v2" /></svg></button>
              </div>
           </div>
           <div className="flex-shrink-0 relative group">
              <div className="absolute inset-0 bg-[#E0B703] blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-2xl transform rotate-3 group-hover:rotate-0 transition-all duration-500 border border-gray-100"><img src="https://i.ibb.co/GQBWJcSz/ISACA-COBIT.png" alt="COBIT 2019 Badge" className="w-48 h-48 object-contain" /><div className="mt-4 text-center"><p className="text-[#1D1D1B] font-bold text-sm">معتمد وفق</p><p className="text-[#E0B703] font-extrabold text-xl tracking-wider">COBIT 2019</p></div></div>
           </div>
        </div>
      </div>

      <div>
        <div className="text-center mb-10"><h2 className="text-3xl font-bold text-[#1D1D1B]">لماذا اخترنا هذا الإطار؟</h2><div className="h-1 w-20 bg-[#E0B703] mx-auto mt-4 rounded-full"></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EEECE7] hover:shadow-xl hover:border-[#E0B703]/50 transition-all duration-300 group"><div className="w-16 h-16 bg-[#F7F6F2] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1D1D1B] transition-colors duration-300"><Icons.Governance /></div><h3 className="text-xl font-bold text-[#1D1D1B] mb-3">شمولية الحوكمة</h3><p className="text-[#1D1D1B]/60 text-sm leading-relaxed">يغطي كافة الجوانب من الاستراتيجية والعمليات إلى الأصول والامتثال، لضمان عدم إغفال أي جزئية.</p></div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EEECE7] hover:shadow-xl hover:border-[#E0B703]/50 transition-all duration-300 group"><div className="w-16 h-16 bg-[#F7F6F2] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1D1D1B] transition-colors duration-300"><Icons.Strategy /></div><h3 className="text-xl font-bold text-[#1D1D1B] mb-3">التوافق الاستراتيجي</h3><p className="text-[#1D1D1B]/60 text-sm leading-relaxed">يربط أهداف التقنية مباشرة بأهداف المؤسسة، مما يحول التقنية من مركز تكلفة إلى شريك استراتيجي.</p></div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EEECE7] hover:shadow-xl hover:border-[#E0B703]/50 transition-all duration-300 group"><div className="w-16 h-16 bg-[#F7F6F2] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1D1D1B] transition-colors duration-300"><Icons.Framework /></div><h3 className="text-xl font-bold text-[#1D1D1B] mb-3">إطار مرجعي عالمي</h3><p className="text-[#1D1D1B]/60 text-sm leading-relaxed">يجمع خلاصات ISO, ITIL, NIST, PMI في إطار واحد متكامل يسهل تطبيقه ومتابعته.</p></div>
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EEECE7] hover:shadow-xl hover:border-[#E0B703]/50 transition-all duration-300 group"><div className="w-16 h-16 bg-[#F7F6F2] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1D1D1B] transition-colors duration-300"><Icons.Maturity /></div><h3 className="text-xl font-bold text-[#1D1D1B] mb-3">نموذج نضج CMMI</h3><p className="text-[#1D1D1B]/60 text-sm leading-relaxed">يستخدم مقياساً عالمياً دقيقاً (0-5) لتحديد وضعك الحالي ورسم خارطة الطريق للمستقبل.</p></div>
        </div>
      </div>

      <div className="bg-[#1D1D1B] rounded-3xl p-8 md:p-12 text-white overflow-hidden relative shadow-2xl border border-gray-800"><div className="absolute top-0 right-0 w-full h-full opacity-10 pattern-diagonal-lines"></div><div className="relative z-10 grid md:grid-cols-2 gap-12 items-center"><div><h3 className="text-3xl font-bold mb-4 text-white">مستويات النضج <span className="text-[#E0B703]">CMMI</span></h3><p className="text-gray-200 mb-8 leading-relaxed text-lg">نعتمد في هذا التقييم على نموذج القدرة (Capability Model) لتصنيف العمليات من العشوائية الكاملة إلى التحسين المستمر المستند للبيانات.</p><div className="p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md shadow-inner"><h4 className="font-bold text-[#E0B703] mb-2 text-lg">كيف نقيم؟</h4><p className="text-base text-gray-100 leading-relaxed">يتم تقييم كل عملية بناءً على وجودها، توثيقها، تطبيقها، وقياسها. المستوى (3) هو المستهدف التأسيسي لمعظم العمليات.</p></div></div><div className="space-y-3">{[{ l: 5, t: 'Optimizing', d: 'تتم إدارة العملية وفق نهج التحسين المستمر، ويتم تطويرها بانتظام بناءً على البيانات والخبرات.'},{ l: 4, t: 'Quantitatively Managed', d: 'العملية قابلة للقياس وتعتمد على بيانات ومؤشرات أداء (KPIs) لمتابعتها وتحسينها.'},{ l: 3, t: 'Defined', d: 'العملية موثقة وموحدة ومطبقة على مستوى المؤسسة بالكامل. (المستهدف التأسيسي)'},{ l: 2, t: 'Managed', d: 'العملية مُدارة وتتم وفق تخطيط وقياس، لكنها غير موحدة على مستوى المؤسسة.'},{ l: 1, t: 'Initial (Performed)', d: 'يتم تنفيذ العملية لكنها غير منسقة، وتعتمد على الجهود الفردية بدون توحيد.'},{ l: 0, t: 'Incomplete', d: 'العملية غير موجودة أو يتم تنفيذها بشكل غير كامل ولا تحقق الهدف المطلوب.'},].map((item) => (<div key={item.l} className="flex items-center gap-4 group cursor-default"><div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg transition-transform group-hover:scale-110 ${item.l === 3 ? 'bg-[#E0B703] text-[#1D1D1B]' : 'bg-white/10 text-white'}`}>{item.l}</div><div className={`flex-grow p-3 rounded-xl transition-colors border ${item.l === 3 ? 'bg-[#E0B703] border-[#E0B703] shadow-[0_0_15px_rgba(224,183,3,0.3)]' : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20'}`}><div className="flex justify-between items-center"><span className={`font-bold ${item.l === 3 ? 'text-[#1D1D1B]' : 'text-white'}`}>{item.t}</span></div><span className={`block mt-1 text-sm ${item.l === 3 ? 'text-[#1D1D1B]/80 font-medium' : 'text-gray-200'}`}>{item.d}</span></div></div>))}</div></div></div>

      <div>
         <div className="text-center mb-10"><h2 className="text-3xl font-bold text-[#1D1D1B]">نطاقات التقييم</h2><p className="text-[#1D1D1B]/60 mt-2">6 مجالات رئيسية تغطي كامل منظومة التقنية</p></div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain, idx) => {
               const totalCriteria = domain.sections.reduce((acc, section) => acc + section.criteria.length, 0);
               const [arabicTitle, ...englishParts] = domain.title.split(' — ');
               const englishTitle = englishParts.join(' — ');

               return (
               <div key={domain.id} className="group relative bg-white rounded-2xl shadow-sm border border-[#EEECE7] hover:shadow-2xl hover:border-[#E0B703] transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col">
                  <div className="bg-[#1D1D1B] p-5 relative overflow-hidden group-hover:bg-gradient-to-r from-[#E0B703] to-[#c7a302] transition-all duration-300">
                     <div className="absolute left-2 -top-6 text-8xl font-bold text-white/5 group-hover:text-[#1D1D1B]/10 transition-colors duration-300 select-none pointer-events-none">{idx + 1}</div>
                     <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-[#1D1D1B] transition-colors relative z-10">{arabicTitle}</h3>
                     <p className="text-sm font-mono text-white/40 group-hover:text-[#1D1D1B]/60 transition-colors relative z-10">{englishTitle}</p>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                     <p className="text-[#1D1D1B]/70 text-sm leading-loose mb-6 flex-grow text-justify">{domain.description}</p>
                     <button onClick={() => handleOpenDetails(domain)} className="w-full flex items-center justify-between pt-4 border-t border-[#F7F6F2] group/button">
                        <span className="text-xs font-bold text-[#1D1D1B]/50 bg-[#F7F6F2] px-3 py-1.5 rounded-md">{totalCriteria} معيار</span>
                        <div className="flex items-center gap-2 text-[#E0B703] transition-colors"><span className="text-xs font-bold opacity-0 group-hover/button:opacity-100 transition-opacity">استعرض المعايير</span><span className="w-8 h-8 rounded-full bg-[#1D1D1B] text-[#E0B703] flex items-center justify-center transform group-hover/button:scale-110 transition-transform duration-300 shadow-md group-hover/button:bg-white group-hover/button:text-[#1D1D1B]"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></span></div>
                     </button>
                  </div>
               </div>
            )})}
         </div>
      </div>
      
      <div className="text-center pt-8"><button onClick={onStart} className="px-12 py-5 bg-[#1D1D1B] text-white font-bold text-xl rounded-full shadow-2xl hover:bg-[#333] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mx-auto ring-4 ring-[#E0B703]/20"><span>ابدأ رحلة التقييم</span><svg className="w-6 h-6 text-[#E0B703]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></button></div>

      {selectedDomain && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={handleCloseDetails}>
           <div className="bg-white rounded-t-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="bg-[#1D1D1B] p-6 flex justify-between items-center flex-shrink-0 rounded-t-xl"><h3 className="text-xl font-bold text-[#E0B703]">{selectedDomain.title}</h3><button onClick={handleCloseDetails} className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#E0B703] hover:text-[#1D1D1B] transition-colors"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
              <div className="p-6 overflow-y-auto">
                  <div className="mb-6 bg-[#F7F6F2] p-4 rounded-lg border border-[#EEECE7]"><h4 className="font-bold text-[#1D1D1B] mb-2 text-sm">التعريف:</h4><p className="text-[#1D1D1B]/70 text-sm leading-relaxed">{selectedDomain.description}</p></div>
                  <h4 className="font-bold text-[#1D1D1B] mb-4 flex items-center gap-2 border-b border-[#EEECE7] pb-2"><span className="w-2 h-6 bg-[#E0B703] rounded-full"></span>المعايير التفصيلية</h4>
                  <div className="space-y-3">
                    {selectedDomain.sections.map((section, idx) => <SectionAccordion key={idx} section={section} />)}
                  </div>
              </div>
              <div className="p-4 border-t border-[#EEECE7] bg-[#F7F6F2] text-center flex-shrink-0"><button onClick={() => { handleCloseDetails(); onStart(); }} className="px-8 py-2.5 bg-[#E0B703] text-[#1D1D1B] font-bold rounded-lg shadow hover:bg-[#c7a302] transition-colors">ابدأ التقييم الآن</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DomainOverview;
