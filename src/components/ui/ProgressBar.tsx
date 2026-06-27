'use client';

import { QUESTIONNAIRE_STEPS } from '@/lib/constants';

export function ProgressBar({ currentStep }: { currentStep: number }) {
  const totalSteps = QUESTIONNAIRE_STEPS.length;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">שלב {currentStep} מתוך {totalSteps}</span>
        <span className="text-sm font-medium text-[#102A43]">{QUESTIONNAIRE_STEPS[currentStep - 1]?.title}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-[#21C7B7] h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {QUESTIONNAIRE_STEPS.map((step) => (
          <div
            key={step.id}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${step.id <= currentStep ? 'bg-[#21C7B7] text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            {step.id}
          </div>
        ))}
      </div>
    </div>
  );
}
