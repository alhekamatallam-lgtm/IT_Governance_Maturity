
import React, { useState } from 'react';
import type { EvaluatorInfo } from '../types';

interface EvaluatorFormProps {
  onComplete: (info: EvaluatorInfo) => void;
}

const EvaluatorForm: React.FC<EvaluatorFormProps> = ({ onComplete }) => {
  const [info, setInfo] = useState<EvaluatorInfo>({
    name: '',
    email: '',
    mobile: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (info.name && info.email && info.mobile) {
      onComplete(info);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-[#EEECE7] mt-8">
      <h2 className="text-2xl font-bold text-[#1D1D1B] mb-6 text-center">بيانات المقيّم</h2>
      <p className="text-[#1D1D1B]/70 mb-6 text-center">يرجى إدخال البيانات التالية للبدء في عملية التقييم.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#1D1D1B] mb-1">
            اسم المقيّم
          </label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-4 py-3 rounded-lg border border-[#DDD] focus:ring-2 focus:ring-[#E0B703] focus:border-transparent outline-none transition-all"
            placeholder="الاسم الثلاثي"
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#1D1D1B] mb-1">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-4 py-3 rounded-lg border border-[#DDD] focus:ring-2 focus:ring-[#E0B703] focus:border-transparent outline-none transition-all"
            placeholder="example@domain.com"
            value={info.email}
            onChange={(e) => setInfo({ ...info, email: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-[#1D1D1B] mb-1">
            رقم الجوال
          </label>
          <input
            type="tel"
            id="mobile"
            required
            className="w-full px-4 py-3 rounded-lg border border-[#DDD] focus:ring-2 focus:ring-[#E0B703] focus:border-transparent outline-none transition-all"
            placeholder="05xxxxxxxx"
            value={info.mobile}
            onChange={(e) => setInfo({ ...info, mobile: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#E0B703] text-[#1D1D1B] font-bold text-lg rounded-lg shadow-md hover:bg-[#c7a302] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E0B703] transition-all duration-300 transform hover:scale-[1.02]"
        >
          بدء التقييم
        </button>
      </form>
    </div>
  );
};

export default EvaluatorForm;