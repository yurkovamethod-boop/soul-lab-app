import React from 'react';
import { motion } from 'motion/react';
import { PathStep, UserProgress, TOOLS } from '../types';
import { CheckCircle2, Eye, Sparkles, MessageSquare, PenTool, Circle, Moon } from 'lucide-react';

interface PathMapProps {
  steps: PathStep[];
  progress: UserProgress;
  onStepClick?: (stepId: string) => void;
}

export const PathMap: React.FC<PathMapProps> = ({ steps, progress, onStepClick }) => {
  return (
    <div className="w-full py-12 px-4 overflow-x-auto">
      <div className="min-w-[800px] relative flex justify-between items-start">
        {/* Connecting Line Background */}
        <div className="absolute top-10 left-0 w-full h-[2px] bg-stone-100 -z-10" />
        
        {/* Active Progress Line */}
        <motion.div 
          className="absolute top-10 left-0 h-[2px] bg-stone-800 -z-10 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ 
            scaleX: (progress.completedSteps.length) / (steps.length - 1) 
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ width: '100%' }}
        />

        {steps.map((step, idx) => {
          const isCompleted = progress.completedSteps.includes(step.id);
          const isCurrent = progress.currentStepId === step.id;
          const isLocked = idx > 0 && !progress.completedSteps.includes(steps[idx-1].id) && !isCurrent;
          
          const Icon = step.requiredTool === 'projection' ? Eye : 
                       step.requiredTool === 'dreams' ? Moon : 
                       step.requiredTool === 'imagination' ? MessageSquare : PenTool;

          return (
            <div 
              key={step.id} 
              className={`relative flex flex-col items-center text-center w-40 group ${isLocked ? 'opacity-40' : 'opacity-100'}`}
            >
              {/* Step Node */}
              <motion.button
                whileHover={!isLocked ? { scale: 1.1 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
                onClick={() => !isLocked && onStepClick?.(step.id)}
                className={`w-20 h-20 rounded-[2rem] border-2 flex items-center justify-center z-10 transition-all duration-500 relative ${
                  isCompleted ? 'bg-stone-800 border-stone-800 text-white shadow-lg' : 
                  isCurrent ? 'bg-white border-stone-800 text-stone-800 shadow-xl ring-4 ring-stone-50' : 
                  'bg-white border-stone-100 text-stone-300'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <Icon className={`w-8 h-8 ${isCurrent ? 'animate-pulse' : ''}`} />
                )}

                {/* Current Indicator Glow */}
                {isCurrent && (
                  <motion.div 
                    layoutId="glow"
                    className="absolute -inset-4 bg-stone-800/5 rounded-[3rem] -z-20"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>

              {/* Step Info */}
              <div className="mt-6 space-y-1">
                <p className={`text-[10px] font-mono uppercase tracking-widest ${isCurrent ? 'text-stone-800 font-bold' : 'text-stone-400'}`}>
                  Этап {idx + 1}
                </p>
                <h4 className={`text-xs font-serif font-medium leading-tight ${isCurrent ? 'text-stone-900' : 'text-stone-500'}`}>
                  {step.title}
                </h4>
                <p className="text-[9px] text-stone-300 italic font-serif">
                  {step.module}
                </p>
              </div>

              {/* Tool Badge */}
              {isCurrent && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-8 bg-amber-50 text-amber-700 text-[8px] font-bold uppercase tracking-tighter px-2 py-1 rounded-full border border-amber-100"
                >
                  Нужен: {TOOLS[step.requiredTool]?.name || '...'}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
