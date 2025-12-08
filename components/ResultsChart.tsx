import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { Result } from '../types';
import AnalysisReport from './AnalysisReport';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResultsChartProps {
  results: Result[];
  onReset: () => void;
  onViewStats: () => void;
}

const RADIAN = Math.PI / 180;
const CustomizedAxisTick = (props: any) => {
  const { x, y, payload, cx, cy, outerRadius } = props;
  const angle = props.angle;

  const radius = 40; // Increased radius to prevent label overlap
  const newX = cx + (outerRadius + radius) * Math.cos(-angle * RADIAN);
  const newY = cy + (outerRadius + radius) * Math.sin(-angle * RADIAN);

  // FIX: Explicitly type `textAnchor` to satisfy SVG attribute requirements.
  let textAnchor: "middle" | "end" | "start" = 'middle';
  if (angle > 10 && angle < 170) {
    textAnchor = 'end';
  } else if (angle > 190 && angle < 350) {
    textAnchor = 'start';
  }

  // FIX: Explicitly type `dominantBaseline` to satisfy SVG attribute requirements.
  let dominantBaseline: "central" | "alphabetic" | "hanging" = 'central';
  if (angle > 80 && angle < 100) { // Top
    dominantBaseline = 'alphabetic';
  } else if (angle > 260 && angle < 280) { // Bottom
    dominantBaseline = 'hanging';
  }

  const parts = payload.value.split(' — ');

  return (
    <g transform={`translate(${newX}, ${newY})`}>
      <text
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        fill="#1D1D1B"
        fontWeight="bold"
        fontSize={12}
      >
        {parts.map((part, index) => (
          <tspan x={0} dy={index === 0 ? 0 : '1.2em'} key={index}>
            {part}
          </tspan>
        ))}
      </text>
    </g>
  );
};


const ResultsChart: React.FC<ResultsChartProps> = ({ results, onReset, onViewStats }) => {
  const [isExporting, setIsExporting] = useState(false);

  const overallScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  const getMaturityLevel = (score: number): string => {
    if (score < 0.5) return 'المستوى 0: Incomplete';
    if (score < 1.5) return 'المستوى 1: Initial (Performed)';
    if (score < 2.5) return 'المستوى 2: Managed';
    if (score < 3.5) return 'المستوى 3: Defined';
    if (score < 4.5) return 'المستوى 4: Quantitatively Managed';
    return 'المستوى 5: Optimizing';
  };

  const overallMaturity = getMaturityLevel(overallScore);

  const handleExportPDF = async () => {
    const reportElement = document.getElementById('results-report');
    if (!reportElement) return;

    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('تقييم-نضج-حوكمة-البيانات.pdf');

    } catch (error) {
      console.error("Could not generate PDF", error);
      alert("عذراً، حدث خطأ أثناء إنشاء ملف PDF.");
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div id="results-report" className="bg-white p-8 md:p-12 rounded-xl shadow-xl border border-[#EEECE7]">
        
        <div className="text-center mb-10 border-b border-[#F7F6F2] pb-8 relative">
          
          <div className="absolute top-0 left-0 hidden md:block opacity-100">
             <img 
               src="https://i.ibb.co/GQBWJcSz/ISACA-COBIT.png" 
               alt="COBIT 2019 Badge" 
               className="w-24 h-24 object-contain"
             />
          </div>

          <h2 className="text-3xl font-bold text-[#1D1D1B] mb-6">نتائج تقييم النضج</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <div className="bg-[#F7F6F2] px-8 py-4 rounded-lg border border-[#EEECE7] min-w-[250px]">
               <p className="text-sm text-[#1D1D1B]/60 font-bold uppercase tracking-wider mb-1">متوسط النضج</p>
               <p className="text-4xl font-bold text-[#E0B703]">{overallScore.toFixed(2)} <span className="text-lg text-[#1D1D1B]/40">/ 5</span></p>
            </div>
            
            <div className="hidden md:block h-12 w-px bg-[#DDD]"></div>

            <div className="text-right">
                <p className="text-sm text-[#1D1D1B]/60 font-bold uppercase tracking-wider mb-1">المستوى الحالي</p>
                <p className="text-2xl font-bold text-[#1D1D1B] bg-[#F7F6F2] px-4 py-1 rounded">{overallMaturity}</p>
            </div>
          </div>
        </div>

        <div className="mb-12 flex justify-center">
          <div style={{ width: '100%', maxWidth: '700px', height: 450 }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="60%" data={results} margin={{ top: 50, right: 50, bottom: 50, left: 50 }}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis dataKey="subject" tick={<CustomizedAxisTick />} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} stroke="#a8a29e" />
                <Radar name="النتيجة الحالية" dataKey="score" stroke="#E0B703" strokeWidth={3} fill="#E0B703" fillOpacity={0.6} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid #e7e5e4',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    direction: 'rtl',
                    textAlign: 'right',
                    color: '#000'
                  }}
                  itemStyle={{ color: '#E0B703', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <AnalysisReport results={results} overallScore={overallScore} overallMaturity={overallMaturity} />
      </div>

      <div className="flex flex-col gap-4 print:hidden">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
                onClick={onViewStats}
                className="px-8 py-3 bg-white text-[#1D1D1B] font-bold border border-[#DDD] rounded-lg shadow-sm hover:bg-[#F7F6F2] transition-all duration-300 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                مقارنة مع المتوسط العام
            </button>
            <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-8 py-3 bg-[#1D1D1B] text-white font-bold rounded-lg shadow-md hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D1D1B] disabled:bg-[#DDD] disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
                {isExporting ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري التصدير...
                </>
                ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    تصدير النتائج (PDF)
                </>
                )}
            </button>
          </div>
          <button
              onClick={onReset}
              className="px-8 py-3 mx-auto text-[#E0B703] hover:text-[#c7a302] underline transition-all duration-300 flex items-center justify-center gap-2"
            >
              إجراء تقييم جديد
          </button>
      </div>
    </div>
  );
};

export default ResultsChart;