import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { GlobalStatsData, Result } from '../types';

interface GlobalStatsProps {
  stats: GlobalStatsData;
  userResults?: Result[];
  onBack: () => void;
}

const GlobalStats: React.FC<GlobalStatsProps> = ({ stats, userResults, onBack }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = stats.domainStats.map(domainStat => {
    const userResult = userResults?.find(r => r.id === domainStat.id);
    return {
      name: domainStat.title,
      'المعدل العام': parseFloat(domainStat.average.toFixed(2)),
      'نتيجتي': userResult ? parseFloat(userResult.score.toFixed(2)) : undefined,
    };
  });

  const getScoreColorClasses = (score: number) => {
    if (score >= 4.0) return { text: 'text-green-600', gradient: 'from-green-400 to-green-600' };
    if (score >= 3.0) return { text: 'text-[#b08d02]', gradient: 'from-[#F3D566] to-[#E0B703]' };
    return { text: 'text-red-600', gradient: 'from-red-400 to-red-600' };
  };


  const renderAnalysis = () => {
    if (userResults) {
      const gaps = chartData.map(d => ({
        ...d,
        diff: (d['نتيجتي'] || 0) - d['المعدل العام']
      })).sort((a, b) => a.diff - b.diff);

      const weaknesses = gaps.filter(g => g.diff < 0);
      const strengths = gaps.filter(g => g.diff >= 0).reverse();

      return (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
              فجوات الأداء (أقل من السوق)
            </h3>
            {weaknesses.length === 0 ? (<p className="text-[#1D1D1B]/60 text-center py-4 bg-red-50 rounded-lg">أداؤك يتفوق على متوسط السوق في جميع النطاقات. ممتاز!</p>) : (
              <div className="space-y-4">
                {weaknesses.map(w => (
                  <div key={w.name} className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between"><span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">فجوة</span><span className="text-xs font-semibold inline-block text-red-600">{w.diff.toFixed(2)}</span></div>
                    <h4 className="font-bold text-[#1D1D1B] text-sm mb-1">{w.name.split(' — ')[0]}</h4>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-100"><div style={{ width: `${Math.min(Math.abs(w.diff)/2 * 100, 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div></div>
                    <p className="text-xs text-[#1D1D1B]/50">نتيجتك <strong>{w['نتيجتي']?.toFixed(2)}</strong> مقابل متوسط <strong>{w['المعدل العام'].toFixed(2)}</strong></p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
            <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              نقاط التفوق (أعلى من السوق)
            </h3>
            {strengths.length === 0 ? (<p className="text-[#1D1D1B]/60 text-center py-4 bg-green-50 rounded-lg">تحتاج إلى تحسين أدائك للحاق بمتوسط السوق.</p>) : (
              <div className="space-y-4">
                {strengths.map(s => (
                  <div key={s.name} className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between"><span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">تفوق</span><span className="text-xs font-semibold inline-block text-green-600">+{s.diff.toFixed(2)}</span></div>
                    <h4 className="font-bold text-[#1D1D1B] text-sm mb-1">{s.name.split(' — ')[0]}</h4>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-100"><div style={{ width: `${Math.min(s.diff/2 * 100, 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div></div>
                    <p className="text-xs text-[#1D1D1B]/50">نتيجتك <strong>{s['نتيجتي']?.toFixed(2)}</strong> مقابل متوسط <strong>{s['المعدل العام'].toFixed(2)}</strong></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } else {
      const sortedByAverage = [...stats.domainStats].sort((a, b) => b.average - a.average);
      const topDomains = sortedByAverage.slice(0, 3);
      const bottomDomains = sortedByAverage.slice(-3).reverse();

      return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-[#EEECE7]">
          <h3 className="text-xl font-bold text-[#1D1D1B] mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#E0B703]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            تحليل اتجاهات السوق العامة
          </h3>
          <p className="text-[#1D1D1B]/70 mb-8">
            استنادًا إلى {stats.totalAssessments > 0 ? `${stats.totalAssessments} تقييمًا مسجلاً` : "البيانات المتاحة"}، إليك نظرة على أداء النطاقات بشكل عام في السوق.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-green-800 mb-4 border-b border-green-200 pb-2">أبرز النطاقات أداءً (عالميًا)</h4>
              <div className="space-y-4">
                {topDomains.map(domain => {
                  const colors = getScoreColorClasses(domain.average);
                  return(<div key={domain.id}><div className="flex justify-between items-center text-sm mb-1"><span className="font-medium text-[#1D1D1B]">{domain.title.split(' — ')[0]}</span><span className={`font-bold ${colors.text}`}>{domain.average.toFixed(2)}</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className={`bg-gradient-to-r ${colors.gradient} h-2 rounded-full`} style={{ width: `${(domain.average / 5) * 100}%` }}></div></div></div>)})}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[#8c6d01] mb-4 border-b border-[#E0B703]/30 pb-2">أقل النطاقات أداءً (عالميًا)</h4>
              <div className="space-y-4">
                {bottomDomains.map(domain => {
                   const colors = getScoreColorClasses(domain.average);
                   return(<div key={domain.id}><div className="flex justify-between items-center text-sm mb-1"><span className="font-medium text-[#1D1D1B]">{domain.title.split(' — ')[0]}</span><span className={`font-bold ${colors.text}`}>{domain.average.toFixed(2)}</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className={`bg-gradient-to-r ${colors.gradient} h-2 rounded-full`} style={{ width: `${(domain.average / 5) * 100}%` }}></div></div></div>)})}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center text-[#1D1D1B]/60 hover:text-[#E0B703] transition-colors font-bold"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>العودة</button>
        <h2 className="text-3xl font-bold text-[#1D1D1B]">مؤشرات الأداء العامة</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-[#E0B703]">
          <p className="text-[#1D1D1B]/60 text-sm font-semibold mb-1">إجمالي التقييمات المسجلة</p>
          <p className="text-3xl font-bold text-[#1D1D1B]">{stats.totalAssessments > 0 ? stats.totalAssessments : '-'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-[#1D1D1B]">
          <p className="text-[#1D1D1B]/60 text-sm font-semibold mb-1">المتوسط العام للنضج (السوق)</p>
          <p className="text-3xl font-bold text-[#1D1D1B]">{stats.overallAverage > 0 ? stats.overallAverage.toFixed(2) : '-'} <span className="text-sm text-[#1D1D1B]/30 font-normal">/ 5</span></p>
        </div>
        {userResults && (<div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-[#E0B703]"><p className="text-[#1D1D1B]/60 text-sm font-semibold mb-1">نتيجة تقييمك الحالي</p><p className="text-3xl font-bold text-[#1D1D1B]">{(userResults.reduce((acc, curr) => acc + curr.score, 0) / userResults.length).toFixed(2)} <span className="text-sm text-[#1D1D1B]/30 font-normal">/ 5</span></p></div>)}
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-[#EEECE7]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 w-full h-[450px] md:h-[500px]">
            <ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData} activeTooltipIndex={activeIndex} onMouseLeave={() => setActiveIndex(null)}><defs><linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E0B703" stopOpacity={0.8}/><stop offset="95%" stopColor="#F3D566" stopOpacity={0.3}/></linearGradient></defs><PolarGrid stroke="#e5e7eb" /><PolarAngleAxis dataKey="name" tick={false} /><PolarRadiusAxis angle={30} domain={[0, 5]} tickCount={6} stroke="#a8a29e" fontSize={12} /><Radar name="المعدل العام (السوق)" dataKey="المعدل العام" stroke="#1D1D1B" fill="none" strokeWidth={2} strokeDasharray="5 5" />{userResults && (<Radar name="نتيجتي" dataKey="نتيجتي" stroke="#E0B703" strokeWidth={2} fill="url(#goldGradient)" fillOpacity={1} />)}<Tooltip contentStyle={{ backgroundColor: 'rgba(29, 29, 27, 0.9)', border: '1px solid #E0B703', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', direction: 'rtl', textAlign: 'right', color: 'white', }} labelStyle={{ color: '#E0B703', fontWeight: 'bold' }} itemStyle={{ fontWeight: 'bold' }} /></RadarChart></ResponsiveContainer>
          </div>
          <div className="lg:col-span-1"><h3 className="text-xl font-bold text-[#1D1D1B] mb-4 text-center lg:text-right border-b pb-2">مفتاح الرسم البياني</h3><div className="space-y-3">{chartData.map((entry, index) => { const [arabic, english] = entry.name.split(' — '); const isActive = activeIndex === index; return (<div key={`item-${index}`} onMouseEnter={() => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)} className={`p-4 rounded-lg transition-all duration-300 cursor-pointer border ${isActive ? 'bg-white shadow-lg border-[#E0B703]' : 'bg-[#F7F6F2] border-transparent'}`}><div className="flex justify-between items-center"><div><p className="font-bold text-[#1D1D1B]">{arabic}</p>{english && <p className="text-xs text-[#1D1D1B]/50 font-mono">{english}</p>}</div><div className="text-left">{userResults && entry['نتيجتي'] !== undefined && (<p className={`font-bold text-lg ${isActive ? 'text-[#E0B703]' : 'text-[#1D1D1B]'}`}>{entry['نتيجتي']?.toFixed(2)}</p>)}<p className="text-xs text-[#1D1D1B]/60">العام: {entry['المعدل العام'].toFixed(2)}</p></div></div></div>);})}</div></div>
        </div>
      </div>
      
      {renderAnalysis()}

      <div className="bg-white rounded-xl shadow-lg border border-[#EEECE7] overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-[#F7F6F2] bg-[#F7F6F2]"><h3 className="text-lg font-bold text-[#1D1D1B]">تفاصيل الأداء حسب النطاق</h3></div>
        <div className="overflow-x-auto"><table className="min-w-full divide-y divide-[#EEECE7]"><thead className="bg-[#F7F6F2]"><tr><th className="px-6 py-3 text-right text-xs font-bold text-[#1D1D1B]/50 uppercase tracking-wider">النطاق</th><th className="px-6 py-3 text-center text-xs font-bold text-[#1D1D1B]/50 uppercase tracking-wider">المعدل العام</th>{userResults && <th className="px-6 py-3 text-center text-xs font-bold text-[#1D1D1B]/50 uppercase tracking-wider">نتيجتي</th>}<th className="px-6 py-3 text-center text-xs font-bold text-[#1D1D1B]/50 uppercase tracking-wider">الحالة</th></tr></thead><tbody className="bg-white divide-y divide-[#EEECE7]">{chartData.map((row, idx) => (<tr key={idx} className="hover:bg-[#F7F6F2] transition-colors"><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1D1D1B]">{row.name.split(' — ')[0]}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-center text-[#1D1D1B]/70 font-bold">{row['المعدل العام'] > 0 ? row['المعدل العام'].toFixed(2) : '-'}</td>{userResults && (<td className="px-6 py-4 whitespace-nowrap text-sm text-center"><span className={`px-2 py-1 rounded font-bold ${row['نتيجتي']! >= row['المعدل العام'] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{row['نتيجتي']?.toFixed(2)}</span></td>)}<td className="px-6 py-4 whitespace-nowrap text-center text-sm">{userResults && row['نتيجتي'] !== undefined ? (row['نتيجتي'] >= row['المعدل العام'] ? (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">أعلى من المتوسط</span>) : (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">أقل من المتوسط</span>)) : (row['المعدل العام'] >= 3 ? (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E0B703]/20 text-[#1D1D1B]">أداء جيد عالمياً</span>) : (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-[#1D1D1B]/60">تحدي عالمي</span>))}</td></tr>))}</tbody></table></div>
      </div>
    </div>
  );
};

export default GlobalStats;