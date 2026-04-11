/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TreeVisualizer } from './components/TreeVisualizer';
import { PathMap } from './components/PathMap';
import { CuratorDesk } from './components/CuratorDesk';
import { Onboarding } from './components/Onboarding';
import { UserProgress, INDIVIDUATION_PATH, DiaryEntry, TOOLS, ToolType, PathStep } from './types';
import { 
  Sparkles, 
  ChevronRight, 
  PenTool,
  MessageSquare,
  Lock,
  Eye,
  TreePine,
  Moon,
  History,
  Info,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { getJungianAnalysis } from './services/gemini';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('soul_lab_progress');
    return saved ? JSON.parse(saved) : {
      completedSteps: [],
      entries: [],
      currentStepId: 'step_1',
    };
  });

  const currentStep = INDIVIDUATION_PATH.find(s => s.id === progress.currentStepId) || INDIVIDUATION_PATH[0];
  const [activeTool, setActiveTool] = useState<ToolType>(currentStep.requiredTool);
  const [newEntry, setNewEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastInsight, setLastInsight] = useState('');
  const [isCuratorOpen, setIsCuratorOpen] = useState(false);
  const [isFinalCelebrationOpen, setIsFinalCelebrationOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('soul_lab_onboarding_seen');
  });

  // Sync active tool when step changes
  useEffect(() => {
    setActiveTool(currentStep.requiredTool);
    setLastInsight('');
  }, [currentStep.id]);

  useEffect(() => {
    localStorage.setItem('soul_lab_progress', JSON.stringify(progress));
  }, [progress]);

  const getToolIcon = (toolType: ToolType) => {
    switch(toolType) {
      case 'reflection': return PenTool;
      case 'projection': return Eye;
      case 'dreams': return Moon;
      case 'imagination': return MessageSquare;
      default: return PenTool;
    }
  };

  const tool = TOOLS[activeTool];

  const handleCompleteStep = () => {
    const currentIndex = INDIVIDUATION_PATH.findIndex(s => s.id === currentStep.id);
    const nextStep = INDIVIDUATION_PATH[currentIndex + 1];
    
    if (nextStep) {
      setProgress(prev => {
        const isAlreadyCompleted = prev.completedSteps.includes(currentStep.id);
        return {
          ...prev,
          completedSteps: isAlreadyCompleted ? prev.completedSteps : [...prev.completedSteps, currentStep.id],
          currentStepId: nextStep.id
        };
      });
    } else {
      // Final step completed
      setProgress(prev => {
        const isAlreadyCompleted = prev.completedSteps.includes(currentStep.id);
        return {
          ...prev,
          completedSteps: isAlreadyCompleted ? prev.completedSteps : [...prev.completedSteps, currentStep.id]
        };
      });
      setIsFinalCelebrationOpen(true);
    }
  };

  const handleSelectStep = (stepId: string) => {
    setProgress(prev => ({
      ...prev,
      currentStepId: stepId
    }));
    setIsFinalCelebrationOpen(false);
    setIsLibraryOpen(false);
  };

  const handlePrevStep = () => {
    const currentIndex = INDIVIDUATION_PATH.findIndex(s => s.id === currentStep.id);
    const prevStep = INDIVIDUATION_PATH[currentIndex - 1];
    if (prevStep) {
      handleSelectStep(prevStep.id);
    }
  };

  const handleAddEntry = async () => {
    if (!newEntry.trim()) return;

    setIsAnalyzing(true);
    try {
      const insight = await getJungianAnalysis(newEntry, activeTool);
      setLastInsight(insight);

      const entry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('ru-RU'),
        stepId: currentStep.id,
        toolType: activeTool,
        content: newEntry,
        aiInterpretation: insight
      };

      setProgress(prev => ({
        ...prev,
        entries: [entry, ...prev.entries],
      }));
      setNewEntry('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasEntryForCurrentStep = progress.entries.some(e => e.stepId === currentStep.id);

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const closeOnboarding = () => {
    localStorage.setItem('soul_lab_onboarding_seen', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-stone-200">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Sidebar: Progress & Tree */}
        <aside id="onboarding-sidebar" className="w-full lg:w-72 bg-white border-r border-stone-100 p-6 flex flex-col h-screen sticky top-0">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-stone-800">
                <TreePine className="w-4 h-4" />
                <h1 className="text-lg font-serif">Путь индивидуации</h1>
              </div>
              <button 
                onClick={() => setShowOnboarding(true)}
                className="p-1.5 text-stone-300 hover:text-stone-600 transition-colors"
                title="Обучение"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[9px] text-stone-400 uppercase tracking-widest font-mono">Дневник пути</p>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto">
            <section className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-300">Ваш Путь</h3>
              <div className="space-y-4">
                {INDIVIDUATION_PATH.map((step, idx) => {
                  const isCompleted = progress.completedSteps.includes(step.id);
                  const isCurrent = progress.currentStepId === step.id;
                  const isLocked = idx > 0 && !progress.completedSteps.includes(INDIVIDUATION_PATH[idx-1].id) && !isCurrent;

                  return (
                    <button 
                      key={step.id} 
                      onClick={() => !isLocked && handleSelectStep(step.id)}
                      disabled={isLocked}
                      className={`flex gap-3 items-start w-full text-left transition-all ${isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:translate-x-1'}`}
                    >
                      <div className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-mono mt-0.5 transition-colors ${
                        isCompleted ? 'bg-stone-800 border-stone-800 text-white' : 
                        isCurrent ? 'border-stone-800 text-stone-800 font-bold ring-2 ring-stone-100' : 'border-stone-100 text-stone-200'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[11px] leading-tight font-medium transition-colors ${isCurrent ? 'text-stone-900' : 'text-stone-400'}`}>
                          {step.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="pt-6 border-t border-stone-50 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-300">Состояние</h3>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-[8px] text-stone-400 font-mono uppercase">Live</span>
                </div>
              </div>
              <TreeVisualizer stage={currentStep.treeStage} isProcessing={isAnalyzing} />
            </section>
          </div>

          <div id="onboarding-tools" className="mt-auto pt-6 border-t border-stone-50 space-y-2">
            <Button 
              onClick={() => setIsLibraryOpen(!isLibraryOpen)}
              variant="ghost"
              className={`w-full h-10 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors ${isLibraryOpen ? 'bg-stone-100 text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Дневник пути</span>
            </Button>
            <Button 
              onClick={() => setIsCuratorOpen(true)}
              variant="outline"
              className="w-full h-12 rounded-xl border-stone-100 text-stone-600 hover:bg-stone-50 flex items-center justify-center gap-2 group"
            >
              <MessageSquare className="w-4 h-4 text-stone-400 group-hover:text-stone-800 transition-colors" />
              <span className="text-xs">Куратор пути</span>
            </Button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 flex flex-col bg-[#fcfaf7]">
          
          {/* Top Info Bar */}
          <div className="bg-white border-b border-stone-100 p-8">
            <div className="max-w-3xl mx-auto space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400 uppercase tracking-widest">
                <span>Этап {INDIVIDUATION_PATH.findIndex(s => s.id === currentStep.id) + 1}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-stone-600">{currentStep.module}</span>
              </div>
              <h2 className="text-3xl font-serif text-stone-800">{currentStep.title}</h2>
              <p className="text-sm text-stone-500 italic font-serif leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Path Map Visualization */}
          <div id="onboarding-map" className="bg-white/50 border-b border-stone-50 px-8">
            <div className="max-w-5xl mx-auto">
              <PathMap 
                steps={INDIVIDUATION_PATH} 
                progress={progress} 
                onStepClick={handleSelectStep}
              />
            </div>
          </div>

          {/* Interaction Area */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-8">
              
              <AnimatePresence mode="wait">
                {isFinalCelebrationOpen ? (
                  <motion.div 
                    key="celebration"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-12 py-10"
                  >
                    <div className="text-center space-y-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-stone-800 rounded-[2.5rem] shadow-2xl mb-4">
                        <Sparkles className="w-10 h-10 text-amber-200" />
                      </div>
                      <h2 className="text-4xl font-serif text-stone-800 leading-tight">Путь Индивидуации <br/> Завершен</h2>
                      <p className="text-stone-500 max-w-md mx-auto italic">
                        "Ваш взор станет ясным лишь тогда, когда вы сможете заглянуть в свою собственную душу." — К.Г. Юнг
                      </p>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-stone-50 space-y-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5">
                        <TreePine className="w-40 h-40" />
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="w-48 h-48 shrink-0">
                          <TreeVisualizer stage="Полный цвет" isProcessing={false} />
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-xl font-serif text-stone-800">Ваше Дерево Самости расцвело</h3>
                          <p className="text-sm text-stone-600 leading-relaxed">
                            Вы прошли через Персону, встретились с Тенью, услышали голос бессознательного и интегрировали Анимус. 
                            Теперь ваше внутреннее Дерево обрело полноту. Это не конец пути, а начало новой, более осознанной жизни.
                          </p>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-stone-50 grid grid-cols-2 gap-4">
                        <div className="p-6 bg-stone-50 rounded-3xl">
                          <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Записей в дневнике</p>
                          <p className="text-2xl font-serif text-stone-800">{progress.entries.length}</p>
                        </div>
                        <div className="p-6 bg-stone-50 rounded-3xl">
                          <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">Пройдено этапов</p>
                          <p className="text-2xl font-serif text-stone-800">{progress.completedSteps.length} / 5</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <Button 
                        onClick={() => setIsLibraryOpen(true)}
                        className="h-16 rounded-2xl bg-stone-800 text-white hover:bg-stone-900 text-lg shadow-xl"
                      >
                        Перейти в Дневник пути
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => setIsFinalCelebrationOpen(false)}
                        className="text-stone-400 hover:text-stone-600"
                      >
                        Вернуться к тренажеру
                      </Button>
                    </div>
                  </motion.div>
                ) : isLibraryOpen ? (
                  <motion.div 
                    key="library"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-serif text-stone-800">Дневник пути</h2>
                        <p className="text-xs text-stone-400">Все ваши записи и инсайты в одном месте</p>
                      </div>
                      <Button variant="ghost" onClick={() => setIsLibraryOpen(false)} className="text-stone-400">Закрыть</Button>
                    </div>

                    <div className="grid gap-6">
                      {progress.entries.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-stone-100 rounded-[2rem]">
                          <p className="text-stone-300 italic">Ваша история еще не написана...</p>
                        </div>
                      ) : (
                        progress.entries.map(entry => (
                          <Card key={entry.id} className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                            <CardHeader className="bg-stone-50/50 border-b border-stone-50 py-4 px-6">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className="bg-white text-[8px] uppercase tracking-widest">
                                    {INDIVIDUATION_PATH.find(s => s.id === entry.stepId)?.title || 'Этап'}
                                  </Badge>
                                  <span className="text-[10px] text-stone-400 font-mono">{entry.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-stone-300">
                                  {React.createElement(getToolIcon(entry.toolType), { className: "w-3 h-3" })}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                              <p className="text-stone-600 italic text-sm leading-relaxed">"{entry.content}"</p>
                              {entry.aiInterpretation && (
                                <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100/20">
                                  <div className="flex items-center gap-2 text-amber-700/50 mb-2">
                                    <Sparkles className="w-3 h-3" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Инсайт</span>
                                  </div>
                                  <div className="text-xs text-stone-700 prose prose-stone prose-xs max-w-none">
                                    <ReactMarkdown>{entry.aiInterpretation}</ReactMarkdown>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="workspace"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Navigation & Tool Instruction */}
                    <div className="flex flex-col gap-4">
                      {INDIVIDUATION_PATH.findIndex(s => s.id === currentStep.id) > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handlePrevStep}
                          className="w-fit -ml-2 text-stone-400 hover:text-stone-600 flex items-center gap-2"
                        >
                          <ArrowRight className="w-4 h-4 rotate-180" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Назад к предыдущему этапу</span>
                        </Button>
                      )}
                      
                      <div className="flex items-center gap-4 p-4 bg-amber-50/50 border border-amber-100/50 rounded-2xl">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          {React.createElement(getToolIcon(activeTool), { className: "w-5 h-5 text-amber-600" })}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Задание этапа</p>
                          <p className="text-xs text-stone-600">Используйте инструмент <strong>{tool?.name || '...'}</strong>: {tool?.description || '...'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Input/Output Card */}
                    <Card id="onboarding-workspace" className="border-none shadow-xl shadow-stone-200/40 rounded-[2rem] overflow-hidden bg-white">
                      <CardContent className="p-0">
                        <AnimatePresence mode="wait">
                          {lastInsight ? (
                            <motion.div 
                              key="insight"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-10 space-y-8"
                            >
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-stone-400">
                                  <Sparkles className="w-4 h-4" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">Инсайт от Куратора</span>
                                </div>
                                <div className="prose prose-stone prose-sm max-w-none text-stone-700 leading-relaxed bg-stone-50 p-8 rounded-3xl border border-stone-100">
                                  <ReactMarkdown>{lastInsight}</ReactMarkdown>
                                </div>
                              </div>
                              
                              <div className="flex gap-4">
                                <Button 
                                  variant="outline" 
                                  className="flex-1 h-14 rounded-2xl border-stone-200 text-stone-500 hover:bg-stone-50"
                                  onClick={() => setLastInsight('')}
                                >
                                  Добавить еще запись
                                </Button>
                                <Button 
                                  className="flex-1 h-14 rounded-2xl bg-stone-800 text-white hover:bg-stone-900 shadow-lg"
                                  onClick={handleCompleteStep}
                                >
                                  {progress.completedSteps.includes(currentStep.id) ? 'К следующему этапу' : 'Завершить этап и идти дальше'}
                                </Button>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="input"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-10 space-y-6"
                            >
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Ваше поле для работы</label>
                                <Textarea 
                                  placeholder={tool.prompt}
                                  className="min-h-[250px] bg-stone-50/50 border-none rounded-3xl p-8 focus:ring-1 focus:ring-stone-100 resize-none text-lg text-stone-800 leading-relaxed placeholder:text-stone-300"
                                  value={newEntry}
                                  onChange={(e) => setNewEntry(e.target.value)}
                                />
                              </div>
                              <Button 
                                onClick={handleAddEntry}
                                disabled={isAnalyzing || !newEntry.trim()}
                                className="w-full h-16 rounded-2xl bg-stone-800 text-white hover:bg-stone-900 text-lg font-medium shadow-xl shadow-stone-200 transition-all active:scale-[0.98]"
                              >
                                {isAnalyzing ? (
                                  <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Куратор анализирует...</span>
                                  </div>
                                ) : 'Зафиксировать и получить инсайт'}
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>

                    {/* Step History */}
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 text-stone-400">
                        <History className="w-3 h-3" />
                        <h3 className="text-[10px] font-bold uppercase tracking-widest">История этого этапа</h3>
                      </div>
                      <div className="grid gap-4">
                        {progress.entries.filter(e => e.stepId === currentStep.id).map(entry => (
                          <div key={entry.id} className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono text-stone-300">{entry.date}</span>
                              <Badge variant="outline" className="text-[8px] uppercase border-stone-100 text-stone-400">
                                {TOOLS[entry.toolType]?.name || 'Запись'}
                              </Badge>
                            </div>
                            <p className="text-sm text-stone-600 italic leading-relaxed">"{entry.content}"</p>
                          </div>
                        ))}
                        {!hasEntryForCurrentStep && (
                          <div className="text-center py-10 border-2 border-dashed border-stone-100 rounded-3xl">
                            <p className="text-xs text-stone-300 italic">Здесь будут ваши записи для этого этапа</p>
                          </div>
                        )}
                      </div>
                    </section>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      <CuratorDesk isOpen={isCuratorOpen} onClose={() => setIsCuratorOpen(false)} />
      
      <AnimatePresence>
        {showOnboarding && <Onboarding onClose={closeOnboarding} />}
      </AnimatePresence>
    </div>
  );
}
