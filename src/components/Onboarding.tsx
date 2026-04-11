import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  FlaskConical, 
  History, 
  MessageSquare,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingStep {
  title: string;
  description: string;
  targetId?: string;
  arrowDirection?: 'up' | 'down' | 'left' | 'right';
}

const STEPS: OnboardingStep[] = [
  {
    title: "Добро пожаловать на путь индивидуации",
    description: "Это ваше личное пространство для работы с собой по методу Карла Юнга. Давайте покажу, как здесь всё устроено.",
  },
  {
    title: "Ваш путь",
    description: "Здесь отображается ваш прогресс. Каждый этап открывает новую грань психики. Дерево растёт вместе с вашим осознанием.",
    targetId: "onboarding-sidebar",
    arrowDirection: "left",
  },
  {
    title: "Карта пути",
    description: "Здесь визуализирован весь путь от Персоны до Самости. Ты можешь вернуться к любому пройденному этапу.",
    targetId: "onboarding-map",
    arrowDirection: "up",
  },
  {
    title: "Рабочее пространство",
    description: "Здесь вы пишете свои мысли и выполняете задания урока. После записи ИИ-Куратор даст обратную связь.",
    targetId: "onboarding-workspace",
    arrowDirection: "down",
  },
  {
    title: "Дневник и ИИ-Куратор",
    description: "В дневнике хранятся все ваши записи. ИИ-Куратор доступен в любой момент — для вопросов, интерпретаций и поддержки.",
    targetId: "onboarding-tools",
    arrowDirection: "left",
  },
  {
    title: "Готова начать?",
    description: "Ваше дерево ждёт первого жёлудя. Посмотрите видеоурок на платформе курса и возвращайтесь сюда выполнить задание.",
  }
];

interface OnboardingProps {
  onClose: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const targetId = STEPS[currentStep].targetId;
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        setSpotlightRect(element.getBoundingClientRect());
      }
    } else {
      setSpotlightRect(null);
    }
  }, [currentStep]);

  const next = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderArrow = () => {
    if (!spotlightRect || !STEPS[currentStep].arrowDirection) return null;

    const direction = STEPS[currentStep].arrowDirection;
    const arrowClass = "absolute text-amber-500 drop-shadow-lg z-[210]";
    
    let style: React.CSSProperties = {};
    let Icon = ArrowDown;

    if (direction === 'left') {
      Icon = ArrowLeft;
      style = {
        top: spotlightRect.top + spotlightRect.height / 2 - 20,
        left: spotlightRect.right + 20,
      };
    } else if (direction === 'up') {
      Icon = ArrowUp;
      style = {
        top: spotlightRect.bottom + 20,
        left: spotlightRect.left + spotlightRect.width / 2 - 20,
      };
    } else if (direction === 'down') {
      Icon = ArrowDown;
      style = {
        bottom: window.innerHeight - spotlightRect.top + 20,
        left: spotlightRect.left + spotlightRect.width / 2 - 20,
      };
    } else if (direction === 'right') {
      Icon = ArrowRight;
      style = {
        top: spotlightRect.top + spotlightRect.height / 2 - 20,
        right: window.innerWidth - spotlightRect.left + 20,
      };
    }

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={style}
        className={arrowClass}
      >
        <Icon className="w-12 h-12" strokeWidth={3} />
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      {/* Dimmed Background with Spotlight */}
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]">
        {spotlightRect && (
          <div 
            className="absolute bg-transparent shadow-[0_0_0_9999px_rgba(28,25,23,0.6)] rounded-2xl transition-all duration-500 ease-in-out"
            style={{
              top: spotlightRect.top - 8,
              left: spotlightRect.left - 8,
              width: spotlightRect.width + 16,
              height: spotlightRect.height + 16,
            }}
          />
        )}
      </div>

      {renderArrow()}

      <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 flex gap-0.5">
            {STEPS.map((_, idx) => (
              <div 
                key={idx} 
                className={`flex-1 transition-all duration-500 ${idx <= currentStep ? 'bg-amber-500' : 'bg-stone-100'}`}
              />
            ))}
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-stone-300 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-10 pt-12 flex-1 flex flex-col items-center text-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <h2 className="text-xl font-serif text-stone-800">{STEPS[currentStep].title}</h2>
                  <p className="text-sm text-stone-500 leading-relaxed whitespace-pre-line">
                    {STEPS[currentStep].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6 bg-stone-50 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={prev}
              disabled={currentStep === 0}
              className="text-stone-400 disabled:opacity-0 h-10 px-4"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Назад
            </Button>

            <Button 
              onClick={next}
              className="bg-stone-800 text-white hover:bg-stone-900 px-8 h-10 rounded-xl shadow-lg shadow-stone-200"
            >
              {currentStep === STEPS.length - 1 ? 'Начать' : 'Далее'}
              {currentStep !== STEPS.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
