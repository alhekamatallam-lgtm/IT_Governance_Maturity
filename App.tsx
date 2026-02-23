
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ASSESSMENT_DOMAINS, MATURITY_LEVELS } from './constants';
import type { Result, EvaluatorInfo, GlobalStatsData, Domain } from './types';
import Questionnaire from './components/Questionnaire';
import ResultsChart from './components/ResultsChart';
import Header from './components/Header';
import Footer from './components/Footer';
import MaturityLevelsGuide from './components/MaturityLevelsGuide';
import ProgressTracker from './components/ProgressTracker';
import DomainOverview from './components/DomainOverview';
import EvaluatorForm from './components/EvaluatorForm';
import GlobalStats from './components/GlobalStats';
import DigitalTransformationMaturity from './components/DigitalTransformationMaturity';

type AppStep = 'overview' | 'evaluator_info' | 'assessment' | 'results' | 'global_stats' | 'digital_transformation_maturity';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwoNykshIGwPVMNQqwqiBjjnwoyfD7C1Iy4558HSZUVix2Xl9cFMnHwP_Yu7TEOBwKa/exec";

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('overview');
  const [evaluatorInfo, setEvaluatorInfo] = useState<EvaluatorInfo | null>(null);
  const [answers, setAnswers] = useState<Record<string, Record<string, number>>>({});
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [currentDomainIndex, setCurrentDomainIndex] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [globalStats, setGlobalStats] = useState<GlobalStatsData | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);
  const [domains, setDomains] = useState<Domain[]>(ASSESSMENT_DOMAINS);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [previousStep, setPreviousStep] = useState<AppStep>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();
        
        const newDomains = JSON.parse(JSON.stringify(ASSESSMENT_DOMAINS));

        // 1. Process definitions from "Overview" sheet
        if (data.Overview && Array.isArray(data.Overview)) {
           data.Overview.forEach((item: { [key: string]: string }) => {
             const domainName = item["نطاق التقييم"];
             const definition = item["التعريف"];
             const domain = newDomains.find((d: Domain) => d.id === domainName || d.title.includes(domainName));
             if (domain && definition) {
                domain.description = definition;
             }
           });
        }

        // 2. Process Criteria (including Evidence & Guidance) from "Criteria" sheet
        if (data.Criteria && Array.isArray(data.Criteria)) {
            const criteriaByDomain = data.Criteria.reduce((acc: Record<string, Record<string, string>[]>, row: Record<string, string>) => {
              const domainTitleEN = row.Domain_EN;
              const sectionTitle = row.Section_AR;
              
              if (!domainTitleEN || !sectionTitle || !row.Criterion_AR) return acc;

              const criterion = {
                text: row.Criterion_AR,
                assessmentFocus: row.Assessment_Focus,
                referenceLevel: row.Level,
                formalStatement: row.Formal_Statement,
                improvementOpportunities: row.Improvement_Opportunities,
                relatedQuestion: row.Related_Question,
              };

              if (!acc[domainTitleEN]) acc[domainTitleEN] = {};
              if (!acc[domainTitleEN][sectionTitle]) acc[domainTitleEN][sectionTitle] = [];
              acc[domainTitleEN][sectionTitle].push(criterion);
              return acc;
            }, {});

            newDomains.forEach((domain: Domain) => {
              const fetchedCriteria = criteriaByDomain[domain.id];
              if (fetchedCriteria) {
                domain.sections = Object.keys(fetchedCriteria).map(sectionTitle => ({
                  title: sectionTitle,
                  criteria: fetchedCriteria[sectionTitle]
                }));
              }
            });
        }
        
        // 3. Process Questions from each domain sheet for the assessment
        const EXCLUDED_COLUMNS = ["تسلسل", "اسم المقيّم", "البريد الإلكتروني", "رقم الجوال"];
        newDomains.forEach((domain: Domain) => {
            const sheetData = data[domain.id];
            if (sheetData && sheetData.length > 0) {
                const questions = Object.keys(sheetData[0]).filter(key => !EXCLUDED_COLUMNS.includes(key));
                domain.questions = questions.map(q => ({ text: q }));
            }
        });
        
        setDomains(newDomains);
      } catch (error) {
        console.error("Error fetching initial data", error);
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchData();
  }, []);

  const handleStart = () => {
    setCurrentStep('evaluator_info');
    window.scrollTo(0, 0);
  };

  const handleEvaluatorSubmit = (info: EvaluatorInfo) => {
    setEvaluatorInfo(info);
    setCurrentStep('assessment');
    window.scrollTo(0, 0);
  };

  const handleAnswerChange = useCallback((domainId: string, questionText: string, score: number) => {
    setAnswers(prev => ({
      ...prev,
      [domainId]: {
        ...prev[domainId],
        [questionText]: score,
      },
    }));
  }, []);

  const submitToGoogleSheet = async () => {
    if (!evaluatorInfo) return;
    setIsSubmitting(true);
    
    const promises = domains.map(domain => {
      const domainAnswers: Record<string, string | number> = {
        "اسم المقيّم": evaluatorInfo.name,
        "البريد الإلكتروني": evaluatorInfo.email,
        "رقم الجوال": evaluatorInfo.mobile,
      };

      domain.questions.forEach(question => {
          const score = answers[domain.id]?.[question.text] || 0;
          const levelObj = MATURITY_LEVELS.find(l => l.level === score);
          const levelName = levelObj ? levelObj.title.match(/\((.*?)\)/)?.[1] || '' : '';
          domainAnswers[question.text] = score > 0 ? `${levelName} (${score})` : "";
      });

      const payload = {
        sheet: domain.id,
        mode: "add",
        data: domainAnswers
      };

      return fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
      });
    });

    try {
      await Promise.all(promises);
      setCurrentStep('results');
    } catch (error) {
      console.error("Error submitting data", error);
      setCurrentStep('results'); 
    } finally {
      setIsSubmitting(false);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isAssessmentComplete) {
      submitToGoogleSheet();
    } else {
      alert('الرجاء الإجابة على جميع الأسئلة قبل المتابعة.');
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep('overview');
    setEvaluatorInfo(null);
    setShowGuide(true);
    setCurrentDomainIndex(0);
    window.scrollTo(0, 0);
  };

  const handleNextDomain = () => {
    if (currentDomainIndex < domains.length - 1) {
      setCurrentDomainIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevDomain = () => {
    if (currentDomainIndex > 0) {
      setCurrentDomainIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleRandomFill = () => {
    const randomAnswers: Record<string, Record<string, number>> = {};
    domains.forEach(domain => {
      randomAnswers[domain.id] = {};
      domain.questions.forEach(question => {
          const randomScore = Math.floor(Math.random() * 5) + 1;
          randomAnswers[domain.id][question.text] = randomScore;
      });
    });
    setAnswers(randomAnswers);
  };
  
  const handleViewGlobalStats = async () => {
    setPreviousStep(currentStep);
    setIsLoadingStats(true);
    setCurrentStep('global_stats');
    window.scrollTo(0, 0);

    let finalStatsData: GlobalStatsData | null = null;
    
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      const allData = await response.json();

      // 1. Calculate Total Assessments from unique assessors in 'Risk & Compliance'
      let totalAssessments = 0;
      const riskComplianceData = allData['Risk & Compliance'];
      if (riskComplianceData && Array.isArray(riskComplianceData)) {
        const uniqueAssessors = new Set(riskComplianceData.map(row => row['اسم المقيّم']));
        totalAssessments = uniqueAssessors.size;
      }

      // 2. Calculate Overall and Domain Averages from all sheets
      let totalSum = 0;
      let totalCount = 0;
      const domainStatsMap: Record<string, { sum: number, count: number }> = {};
      const scoreRegex = /\((\d)\)/; // Extracts number from a string like "(3)"

      domains.forEach(domain => {
        domainStatsMap[domain.id] = { sum: 0, count: 0 };
        const sheetData = allData[domain.id];

        if (sheetData && Array.isArray(sheetData)) {
          sheetData.forEach(row => {
            Object.values(row).forEach(value => {
              if (typeof value === 'string') {
                const match = value.match(scoreRegex);
                if (match && match[1]) {
                  const score = parseInt(match[1], 10);
                  if (!isNaN(score)) {
                    totalSum += score;
                    totalCount++;
                    domainStatsMap[domain.id].sum += score;
                    domainStatsMap[domain.id].count++;
                  }
                }
              }
            });
          });
        }
      });
      
      const overallAverage = totalCount > 0 ? totalSum / totalCount : 0;

      const domainStats = domains.map(domain => {
        const stats = domainStatsMap[domain.id];
        return {
          id: domain.id,
          title: domain.title,
          average: stats.count > 0 ? stats.sum / stats.count : 0,
        };
      });

      finalStatsData = {
        totalAssessments,
        overallAverage,
        domainStats,
      };

    } catch(e) { 
      console.error("Could not fetch and calculate real stats.", e); 
      // Fallback logic will be triggered below if finalStatsData is still null
    }
    
    if (!finalStatsData) {
        finalStatsData = {
          totalAssessments: 0,
          overallAverage: 0,
          domainStats: domains.map(d => ({
            id: d.id,
            title: d.title,
            average: 0
          }))
        };
    }
    
    setGlobalStats(finalStatsData);
    setIsLoadingStats(false);
  };

  const handleBackFromStats = () => {
    setCurrentStep(previousStep);
    window.scrollTo(0, 0);
  };

  const handleViewMaturityReport = () => {
    setPreviousStep(currentStep);
    setCurrentStep('digital_transformation_maturity');
    window.scrollTo(0, 0);
  };
  
  const totalQuestions = useMemo(() => domains.reduce((acc, domain) => acc + domain.questions.length, 0), [domains]);
  const answeredQuestions = useMemo(() => Object.values(answers).reduce((acc: number, domainAnswers) => acc + Object.keys(domainAnswers).length, 0), [answers]);
  const isAssessmentComplete = useMemo(() => totalQuestions > 0 && answeredQuestions === totalQuestions, [answeredQuestions, totalQuestions]);

  const domainCompletionStatus = useMemo(() => {
    return domains.map(domain => {
      const totalInDomain = domain.questions.length;
      const answeredInDomain = Object.keys(answers[domain.id] || {}).length;
      return totalInDomain > 0 && answeredInDomain === totalInDomain;
    });
  }, [answers, domains]);

  const results = useMemo((): Result[] => {
    if (Object.keys(answers).length === 0) return [];
    return domains.map(domain => {
      const domainAnswers = answers[domain.id] || {};
      const scores = Object.values(domainAnswers) as number[];
      const totalScore = scores.reduce((sum, score) => sum + score, 0);
      const average = scores.length > 0 ? totalScore / scores.length : 0;
      return {
        id: domain.id,
        subject: domain.title,
        score: parseFloat(average.toFixed(2)),
        fullMark: 5,
      };
    });
  }, [answers, domains]);

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col font-cairo text-[#1D1D1B]">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow max-w-5xl">
        
        {isFetchingData && currentStep === 'overview' && (
           <div className="text-center py-10">
              <svg className="animate-spin h-10 w-10 text-[#E0B703] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-[#1D1D1B]/60">جاري تحميل بيانات التقييم...</p>
           </div>
        )}

        {isLoadingStats && (
            <div className="fixed inset-0 bg-[#1D1D1B]/70 z-50 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center">
                    <svg className="animate-spin h-12 w-12 text-[#E0B703] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="font-bold text-[#1D1D1B]">جاري جلب المؤشرات العامة...</p>
                </div>
            </div>
        )}

        {!isFetchingData && currentStep === 'overview' && (
          <DomainOverview 
             domains={domains} 
             onStart={handleStart} 
             onViewStats={handleViewGlobalStats}
             onViewMaturityReport={handleViewMaturityReport}
          />
        )}

        {currentStep === 'global_stats' && globalStats && (
          <GlobalStats 
            stats={globalStats} 
            userResults={results.length > 0 ? results : undefined} 
            onBack={handleBackFromStats} 
          />
        )}

        {currentStep === 'evaluator_info' && (
          <EvaluatorForm onComplete={handleEvaluatorSubmit} />
        )}

        {currentStep === 'assessment' && (
          <>
             <div className="bg-white px-4 py-3 rounded-lg shadow-sm mb-6 border-r-4 border-[#E0B703] flex justify-between items-center">
                <span className="text-sm text-[#1D1D1B]">المقيّم الحالي: <strong className="text-[#E0B703]">{evaluatorInfo?.name}</strong></span>
                <button onClick={handleRandomFill} className="text-xs text-[#1D1D1B] hover:text-[#E0B703] underline">
                  تعبئة تلقائية (للتجربة)
                </button>
             </div>

            <MaturityLevelsGuide levels={MATURITY_LEVELS} isOpen={showGuide} setIsOpen={setShowGuide} />
            <ProgressTracker 
              domains={domains}
              currentIndex={currentDomainIndex}
              completionStatus={domainCompletionStatus}
            />
            {isSubmitting ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-lg border border-[#EEECE7]">
                 <svg className="animate-spin h-12 w-12 text-[#E0B703] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 <p className="text-lg font-bold text-[#1D1D1B]">جاري حفظ التقييم ومعالجة النتائج...</p>
                 <p className="text-sm text-[#1D1D1B]/60 mt-2">يرجى الانتظار، يتم إرسال البيانات...</p>
              </div>
            ) : (
              <Questionnaire
                domains={domains}
                currentDomainIndex={currentDomainIndex}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onSubmit={handleSubmit}
                isComplete={isAssessmentComplete}
                onNext={handleNextDomain}
                onPrev={handlePrevDomain}
              />
            )}
          </>
        )}

        {currentStep === 'results' && (
          <ResultsChart 
             results={results} 
             onReset={handleReset} 
             onViewStats={handleViewGlobalStats}
          />
        )}

        {currentStep === 'digital_transformation_maturity' && (
          <div className="animate-fade-in">
            <DigitalTransformationMaturity />
            <div className="text-center mt-8">
              <button onClick={() => setCurrentStep(previousStep)} className="btn-secondary py-2 px-6 rounded-md shadow-sm hover:bg-gray-700 transition-colors">
                العودة
              </button>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default App;
