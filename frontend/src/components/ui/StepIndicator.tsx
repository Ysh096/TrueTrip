'use client';

import { motion } from 'framer-motion';

interface Step {
  id: number;
  label: string;
  active: boolean;
  completed: boolean;
}

export const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps: Step[] = [
    { id: 1, label: 'Planner', active: currentStep === 1, completed: currentStep > 1 },
    { id: 2, label: 'Recommendations', active: currentStep === 2, completed: currentStep > 2 },
    { id: 3, label: 'Itinerary', active: currentStep === 3, completed: currentStep > 3 },
  ];

  return (
    <div className="flex items-center justify-center gap-6 md:gap-12 mb-16">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div 
              initial={false}
              animate={{ 
                backgroundColor: step.active ? '#2563eb' : step.completed ? '#2563eb' : '#f8fafc',
                color: step.active || step.completed ? '#ffffff' : '#94a3b8',
                scale: step.active ? 1.2 : 1,
                boxShadow: step.active ? '0 0 20px rgba(37,99,235,0.3)' : 'none'
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500 border-2 ${
                step.active ? 'border-blue-400' : step.completed ? 'border-blue-600' : 'border-slate-100'
              }`}
            >
              {step.completed ? '✓' : step.id}
            </motion.div>
            <span className={`text-[9px] mt-4 font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
              step.active ? 'text-blue-600' : 'text-slate-400'
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-16 h-[2px] mx-4 -mt-8 bg-slate-100 relative overflow-hidden">
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: step.completed ? '0%' : '-100%' }}
                 transition={{ duration: 1, ease: "easeInOut" }}
                 className="absolute inset-0 bg-blue-600"
               />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
