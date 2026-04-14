import React, { useState, useRef } from 'react';
import { Sparkles, Moon, Users, Download } from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
// @ts-ignore
import html2pdf from 'html2pdf.js';

const SHADOW_SYMBOLS = [
  { symbol: '🌑', name: 'Тёмная Луна', question: 'Что Вы прячете даже от самой себя?' },
  { symbol: '🐍', name: 'Змея', question: 'Что в Вас периодически выходит вопреки Вашей воле?' },
  { symbol: '🪞', name: 'Зеркало', question: 'Что Вы не хотите видеть в своём отражении?' },
  { symbol: '🌊', name: 'Волна', question: 'Какая эмоция захлёстывает Вас помимо Вашей воли?' },
  { symbol: '🔑', name: 'Ключ', question: 'Какую дверь внутри Вы боитесь открыть?' },
  { symbol: '🌿', name: 'Корень', question: 'Что уходит своими корнями глубже, чем Вы думали?' },
  { symbol: '🦅', name: 'Орёл', question: 'Какая сила в Вас ждёт, чтобы её признали?' },
  { symbol: '🔥', name: 'Огонь', question: 'Что в Вас сжигает — и одновременно даёт тепло?' },
];

const DREAM_SYMBOLS = [
  { symbol: '🌙', name: 'Луна', question: 'Что этот образ говорит о Вашем бессознательном прямо сейчас?' },
  { symbol: '🌊', name: 'Вода', question: 'Какие чувства этот образ пробуждает в Вас?' },
  { symbol: '🌳', name: 'Дерево', question: 'Что в Вас растёт — даже если Вы этого не замечаете?' },
  { symbol: '🏠', name: 'Дом', question: 'Какая часть Вас ищет укрытия или возвращения?' },
  { symbol: '🦋', name: 'Бабочка', question: 'Что готово выйти из кокона, если Вы позволите?' },
  { symbol: '🌄', name: 'Рассвет', question: 'Что начинается в Вашей жизни — даже если Вы этого ещё не осознали?' },
  { symbol: '🗝️', name: 'Ключ', question: 'Что этот сон открывает в Вас?' },
  { symbol: '🌌', name: 'Звёздное небо', question: 'Что больше Вас — и при этом живёт внутри Вас?' },
];

const ANIMUS_SYMBOLS = [
  { symbol: '⚔️', name: 'Меч', question: 'Какую внутреннюю силу Вы ещё не позволяете себе использовать?' },
  { symbol: '🧭', name: 'Компас', question: 'Куда ведёт Вас Ваш внутренний голос, если Вы его слушаете?' },
  { symbol: '🔭', name: 'Телескоп', question: 'Что Вы видите в других, чего ещё не видите в себе?' },
  { symbol: '🌉', name: 'Мост', question: 'Что Вы готовы соединить внутри себя?' },
  { symbol: '🏔️', name: 'Гора', question: 'Какую вершину Вы откладывали — и знаете, что она Ваша?' },
  { symbol: '💡', name: 'Свет', question: 'Что хочет быть осознанным в Вас прямо сейчас?' },
  { symbol: '🌱', name: 'Росток', question: 'Что в Вас только начинает проявляться?' },
  { symbol: '🎯', name: 'Цель', question: 'Чего Вы на самом деле хотите — за пределами чужих ожиданий?' },
];

interface OracleProps {
  type: 'shadow' | 'dreams' | 'animus';
}

export const Oracle: React.FC<OracleProps> = ({ type }) => {
  const [card, setCard] = useState<typeof SHADOW_SYMBOLS[0] | null>(null);
  const symbols = type === 'shadow' ? SHADOW_SYMBOLS : type === 'dreams' ? DREAM_SYMBOLS : ANIMUS_SYMBOLS;
  const label = type === 'shadow' ? 'Символ Тени' : type === 'dreams' ? 'Образ из сна' : 'Внутренний Другой';
  const Icon = type === 'dreams' ? Moon : type === 'animus' ? Users : Sparkles;

  const draw = () => {
    const random = symbols[Math.floor(Math.random() * symbols.length)];
    setCard(random);
  };

  return (
    <div className="mt-6 p-6 bg-stone-100 border border-stone-200 rounded-2xl text-center shadow-sm">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-stone-600" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
          {label}
        </span>
      </div>
      {!card ? (
        <button 
          onClick={draw} 
          className="px-6 py-2 bg-stone-800 text-stone-100 rounded-full text-sm hover:bg-stone-700 transition-colors"
        >
          Вытянуть символ
        </button>
      ) : (
        <div className="animate-in fade-in zoom-in duration-300">
          <div className="text-5xl mb-3">{card.symbol}</div>
          <div className="text-lg font-serif text-stone-800 mb-2">
            {card.name}
          </div>
          <div className="text-sm text-stone-600 italic leading-relaxed mb-4 max-w-xs mx-auto">
            {card.question}
          </div>
          <button 
            onClick={draw} 
            className="text-[10px] text-stone-400 hover:text-stone-600 uppercase tracking-wider font-bold"
          >
            Вытянуть другой
          </button>
        </div>
      )}
    </div>
  );
};

const PSYCHE_ZONES = [
  { id: 'collective', label: 'Коллективное бессознательное', r: 175, color: '#2d3436', type: 'layer',
    desc: 'Самый глубокий слой психики, общий для всего человечества. Здесь живут архетипы — универсальные первообразы.' },
  { id: 'personal', label: 'Личное бессознательное', r: 120, color: '#636e72', type: 'layer',
    desc: 'Слой, где хранится Ваш личный опыт: забытое, вытесненное, а также Тень и Анима.' },
  { id: 'consciousness', label: 'Сознание', r: 70, color: '#b2bec3', type: 'layer',
    desc: 'То, что Вы осознаете прямо сейчас. Здесь находится Ваше Эго и Персона.' },
  { id: 'ego', label: 'Эго', x: 200, y: 200, color: '#3d7ab0', type: 'element',
    desc: 'Центр сознания. Ваш внутренний "Я", принимающий решения.' },
  { id: 'persona', label: 'Персона', x: 200, y: 130, color: '#8b6a3a', type: 'element',
    desc: 'Ваша социальная маска на границе сознания и внешнего мира.' },
  { id: 'shadow', label: 'Тень', x: 150, y: 250, color: '#4a3015', type: 'element',
    desc: 'Вытесненные части Вашей личности, живущие в личном бессознательном.' },
  { id: 'anima', label: 'Анима', x: 250, y: 250, color: '#534ab7', type: 'element',
    desc: 'Ваш внутренний мост к бессознательному, "Внутренний Другой".' },
  { id: 'self', label: 'Самость', x: 200, y: 200, color: '#1d9e75', type: 'self',
    desc: 'Целостность всей психики. Самость пронизывает все слои, стремясь к единству.' },
];

export const PsycheMap: React.FC = () => {
  const [active, setActive] = useState<typeof PSYCHE_ZONES[0] | null>(null);

  return (
    <div className="mt-6 p-6 bg-stone-50 border border-stone-200 rounded-2xl shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-6 text-center">
        Карта психики — нажмите на любую зону или элемент
      </div>
      
      <div className="relative w-full aspect-square bg-white rounded-xl border border-stone-100 overflow-hidden shadow-inner">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Self Glow (Permeating everything) */}
          <circle cx="200" cy="200" r="180" fill="url(#selfGlow)" className="opacity-40 pointer-events-none" />
          <defs>
            <radialGradient id="selfGlow">
              <stop offset="0%" stopColor="#1d9e75" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1d9e75" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Concentric Layers */}
          {PSYCHE_ZONES.filter(z => z.type === 'layer').map(zone => {
             const isActive = active?.id === zone.id;
             return (
              <circle 
                key={zone.id}
                cx="200" cy="200" r={zone.r}
                fill={isActive ? `${zone.color}30` : zone.id === 'consciousness' ? '#f5f5f4' : 'transparent'}
                stroke={zone.color}
                strokeWidth={isActive ? "3" : "1.5"}
                strokeDasharray={zone.id === 'collective' ? "6 4" : "none"}
                className="opacity-70 cursor-pointer transition-all duration-300"
                onClick={() => setActive(isActive ? null : zone)}
              />
             );
          })}

          {/* Layer Labels - Positioned for clarity */}
          {PSYCHE_ZONES.filter(z => z.type === 'layer').map(zone => {
            let labelY = 200 - zone.r;
            let labelX = 200;
            let fontSize = "9";
            let opacity = "0.6";

            if (zone.id === 'collective') {
              labelY -= 15;
            } else if (zone.id === 'personal') {
              labelY -= 12;
            } else if (zone.id === 'consciousness') {
              // Positioned INSIDE the central circle, below the Ego
              labelY = 200 + 48; 
              fontSize = "10";
              opacity = "0.9";
            }

            return (
              <text 
                key={`${zone.id}-label`}
                x={labelX} y={labelY}
                textAnchor="middle"
                fontSize={fontSize}
                className="fill-stone-800 font-bold pointer-events-none uppercase tracking-tight"
                style={{ opacity }}
              >
                {zone.label}
              </text>
            );
          })}

          {/* Elements */}
          {PSYCHE_ZONES.filter(z => z.type !== 'layer').map(zone => {
            const isActive = active?.id === zone.id;
            
            if (zone.type === 'self') {
              return (
                <circle 
                  key={zone.id}
                  cx="200" cy="200" r={isActive ? 185 : 180}
                  fill="none"
                  stroke={zone.color}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="opacity-40 cursor-pointer transition-all duration-300"
                  onClick={() => setActive(isActive ? null : zone)}
                />
              );
            }

            const r = isActive ? 24 : 20;
            return (
              <g 
                key={zone.id} 
                className="cursor-pointer transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(isActive ? null : zone);
                }}
              >
                <circle cx={zone.x} cy={zone.y} r={r} fill={zone.color} className={isActive ? 'opacity-100' : 'opacity-90'} />
                <text 
                  x={zone.x} y={zone.y} 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  fontSize="8" 
                  className="font-bold pointer-events-none fill-white"
                >
                  {zone.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-6 min-h-[80px]">
        {active ? (
          <div className="p-4 bg-white border border-stone-200 rounded-xl animate-in slide-in-from-bottom-2 duration-300">
            <div className="text-sm font-serif font-bold text-stone-800 mb-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: active.color }} />
              {active.label}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed italic">
              {active.desc}
            </p>
          </div>
        ) : (
          <p className="text-center text-xs text-stone-400 italic py-4">
            Нажмите на любой слой или элемент карты, чтобы увидеть его значение
          </p>
        )}
      </div>
    </div>
  );
};

export const LifeScale: React.FC = () => {
  const [value, setValue] = useState(40);
  const half = value < 40 ? 'первая половина жизни' : value === 40 ? 'точка перехода' : 'вторая половина жизни';
  const desc = value < 30
    ? 'Вы в начале пути — строите Персону, накапливаете опыт.'
    : value < 40
    ? 'Приближаетесь к точке перехода. Некоторые вещи уже начинают терять смысл.'
    : value === 40
    ? 'Вы на пороге. Именно здесь психика начинает требовать своего.'
    : value < 55
    ? 'Вторая половина началась. Внутренний голос становится громче.'
    : 'Вы глубоко во второй половине. Смысл важнее достижений.';

  return (
    <div className="mt-6 p-6 bg-stone-100 border border-stone-200 rounded-2xl shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-6 text-center">
        Шкала жизни — отметьте Ваш текущий возраст
      </div>
      <div className="flex justify-between text-[10px] text-stone-400 mb-2 font-mono">
        <span>0 ЛЕТ</span><span>40 ЛЕТ (КРИЗИС)</span><span>80+ ЛЕТ</span>
      </div>
      <input 
        type="range" min="0" max="100" step="1" value={value}
        onChange={e => setValue(Number(e.target.value))}
        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-800"
      />
      <div className="mt-6 p-4 bg-white border border-stone-200 rounded-xl">
        <div className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex justify-between">
          <span>{half}</span>
          <span className="text-stone-400">{value} лет</span>
        </div>
        <p className="text-sm text-stone-600 italic leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};

const MANDALA_COLORS = ['#c0607a','#7c5cbf','#3d7ab0','#1d9e75','#d4a843','#d85a30','#4a3015','#2c3e50'];
const SECTORS = [
  { id: 'persona', label: 'Персона', angle: -90 },
  { id: 'shadow', label: 'Тень', angle: 0 },
  { id: 'anima', label: 'Анима', angle: 90 },
  { id: 'self', label: 'Самость', angle: 180 },
];

export const Mandala: React.FC = () => {
  const [sectors, setSectors] = useState<Record<string, { color: string; word: string }>>({
    persona: { color: '#8b6a3a', word: '' },
    shadow: { color: '#4a3015', word: '' },
    anima: { color: '#534ab7', word: '' },
    self: { color: '#1d9e75', word: '' },
  });
  const [active, setActive] = useState<string | null>(null);

  const update = (id: string, field: 'color' | 'word', val: string) =>
    setSectors(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));

  const cx = 120, cy = 120, r = 100;
  const sectorPath = (angleStart: number, angleEnd: number) => {
    const toRad = (a: number) => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(angleStart));
    const y1 = cy + r * Math.sin(toRad(angleStart));
    const x2 = cx + r * Math.cos(toRad(angleEnd));
    const y2 = cy + r * Math.sin(toRad(angleEnd));
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="mt-6 p-6 bg-stone-100 border border-stone-200 rounded-2xl shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-6 text-center">
        Ваша мандала — соберите образ целостности
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        <svg viewBox="0 0 240 240" className="w-48 h-48 drop-shadow-lg">
          <circle cx={cx} cy={cy} r={r} fill="white" stroke="#e7e5e4" strokeWidth="1" />
          {SECTORS.map(s => {
            const isActive = active === s.id;
            const midAngle = s.angle + 45;
            const tx = cx + (r * 0.6) * Math.cos((midAngle * Math.PI) / 180);
            const ty = cy + (r * 0.6) * Math.sin((midAngle * Math.PI) / 180);
            return (
              <g key={s.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : s.id)}>
                <path 
                  d={sectorPath(s.angle, s.angle + 90)} 
                  fill={sectors[s.id].color}
                  className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}
                  stroke="rgba(0,0,0,0.1)" 
                  strokeWidth="1" 
                />
                <text 
                  x={tx} y={ty} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  fontSize="8" 
                  fill="white" 
                  className="font-bold pointer-events-none"
                >
                  {s.label}
                </text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r="15" fill="white" stroke="#e7e5e4" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="8" fill="#1d9e75" className="opacity-50" />
        </svg>

        {active && (
          <div className="flex-1 w-full space-y-4 p-4 bg-white rounded-xl border border-stone-200 animate-in fade-in duration-300">
            <div className="text-sm font-serif font-bold text-stone-800">
              Сектор: {SECTORS.find(s => s.id === active)?.label}
            </div>
            <div>
              <div className="text-[9px] font-bold text-stone-400 uppercase mb-2">Выберите цвет</div>
              <div className="flex gap-2 flex-wrap">
                {MANDALA_COLORS.map(c => (
                  <button 
                    key={c} 
                    onClick={() => update(active, 'color', c)} 
                    className={`w-6 h-6 rounded-full transition-transform ${sectors[active].color === c ? 'scale-125 ring-2 ring-stone-800' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-stone-400 uppercase mb-2">Слово или образ</div>
              <input 
                type="text" 
                placeholder="Что это для Вас?.."
                value={sectors[active].word}
                onChange={e => update(active, 'word', e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PdfExport: React.FC<{ entries: any[] }> = ({ entries }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const stripMarkdown = (text: string) => {
    if (!text) return '';
    return text
      .replace(/[#*`_~]/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .trim();
  };

  const handleDownload = async () => {
    if (entries.length === 0) return;
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      let currentY = margin;

      // 1. Create a temporary container for rendering
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '0';
      container.style.top = '0';
      container.style.width = '800px';
      container.style.zIndex = '-1';
      container.style.opacity = '0';
      container.style.backgroundColor = '#ffffff';
      document.body.appendChild(container);

      // Helper to render a DOM element to PDF
      const renderToPdf = async (element: HTMLElement) => {
        const canvas = await html2canvas(element, { 
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          onclone: (clonedDoc) => {
            // CRITICAL: Strip oklch colors which crash html2canvas parsing
            const styles = clonedDoc.getElementsByTagName('style');
            for (let i = 0; i < styles.length; i++) {
              styles[i].innerHTML = styles[i].innerHTML.replace(/oklch\(.*?\)/g, '#000000');
            }
          }
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        if (currentY + imgHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.addImage(imgData, 'JPEG', margin, currentY, contentWidth, imgHeight);
        currentY += imgHeight + 5;
      };

      // 2. Header
      const header = document.createElement('div');
      header.style.padding = '40px 20px';
      header.style.textAlign = 'center';
      header.style.backgroundColor = '#ffffff';
      header.style.width = '800px';
      header.innerHTML = `
        <h1 style="font-family: serif; font-size: 32px; color: #1c1917; margin: 0 0 10px 0;">МОЙ ПУТЬ ИНДИВИДУАЦИИ</h1>
        <p style="font-family: serif; font-size: 14px; color: #78716c; margin: 0;">Дневник процесса самопознания • ${new Date().toLocaleDateString('ru-RU')}</p>
        <div style="width: 100%; height: 1px; background-color: #d6d3d1; margin-top: 20px;"></div>
      `;
      container.appendChild(header);
      await renderToPdf(header);
      container.removeChild(header);

      // 3. Entries
      for (let i = entries.length - 1; i >= 0; i--) {
        const entry = entries[i];
        const entryDiv = document.createElement('div');
        entryDiv.style.padding = '30px 20px';
        entryDiv.style.backgroundColor = '#ffffff';
        entryDiv.style.width = '800px';
        entryDiv.innerHTML = `
          <div style="border-bottom: 1px solid #f5f5f4; padding-bottom: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; font-family: sans-serif;">
            <span style="font-size: 12px; font-weight: bold; color: #a8a29e; text-transform: uppercase;">Запись ${i + 1}</span>
            <span style="font-size: 12px; color: #d6d3d1;">${entry.date}</span>
          </div>
          <p style="font-family: serif; font-size: 18px; line-height: 1.6; font-style: italic; color: #44403c; margin: 0 0 20px 0;">"${stripMarkdown(entry.content)}"</p>
          ${entry.aiInterpretation ? `
            <div style="background-color: #fafaf9; padding: 20px; border-radius: 8px; border-left: 4px solid #d6d3d1;">
              <p style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: #a8a29e; text-transform: uppercase; margin: 0 0 8px 0;">Инсайт ИИ-Куратора</p>
              <p style="font-family: serif; font-size: 15px; color: #57534e; line-height: 1.6; margin: 0;">${stripMarkdown(entry.aiInterpretation)}</p>
            </div>
          ` : ''}
        `;
        container.appendChild(entryDiv);
        await renderToPdf(entryDiv);
        container.removeChild(entryDiv);
      }

      // Cleanup
      document.body.removeChild(container);
      pdf.save('мой-путь-индивидуации.pdf');
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Не удалось создать PDF. Попробуйте еще раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-8 p-8 bg-stone-800 rounded-[2.5rem] text-center shadow-xl">
      <h3 className="text-xl font-serif text-stone-100 mb-2">Ваш путь зафиксирован</h3>
      <p className="text-stone-400 text-xs mb-6 italic">Все Ваши открытия, сны и инсайты ИИ-Куратора в одном документе</p>
      <button 
        onClick={handleDownload}
        disabled={isGenerating || entries.length === 0}
        className="px-8 py-4 bg-stone-100 text-stone-900 rounded-2xl font-bold hover:bg-white transition-all flex items-center gap-3 mx-auto shadow-lg active:scale-95 disabled:opacity-50"
      >
        {isGenerating ? (
          <div className="w-5 h-5 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
        ) : <Download size={20} />}
        {isGenerating ? 'Генерация...' : 'Скачать PDF «Мой путь индивидуации»'}
      </button>
    </div>
  );
};
