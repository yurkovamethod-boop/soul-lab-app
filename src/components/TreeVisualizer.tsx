/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { TreeStage } from '../types';

interface TreeVisualizerProps {
  stage: TreeStage;
  isProcessing?: boolean;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ stage, isProcessing }) => {
  const stages: TreeStage[] = [
    'Зерно', 'Росток', 'Корни', 'Глубокие корни', 'Ствол', 
    'Дерево на середине', 'Ветви', 'Крона', 'Почти выросло', 
    'Расцветает', 'Плоды', 'Полный цвет'
  ];
  const stageIndex = stages.indexOf(stage);

  return (
    <div className="relative w-full h-[350px] flex items-center justify-center bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
      <svg viewBox="0 0 200 200" className="w-full h-full max-w-[300px]">
        {/* Ground */}
        <motion.path
          d="M40,160 Q100,155 160,160"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="4 2"
        />

        {/* 0. Seed */}
        {stageIndex >= 0 && (
          <motion.circle
            cx="100" cy="165" r="3"
            fill="#78350f"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}

        {/* 1. Sprout */}
        {stageIndex >= 1 && (
          <motion.path
            d="M100,165 Q105,155 100,145"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
        )}

        {/* 2-3. Roots */}
        {stageIndex >= 2 && (
          <motion.path
            d="M100,165 Q90,180 85,190 M100,165 Q110,185 115,195"
            fill="none"
            stroke="#d1d5db"
            strokeWidth={stageIndex >= 3 ? "2" : "1"}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
        )}

        {/* 4-5. Trunk */}
        {stageIndex >= 4 && (
          <motion.path
            d="M100,165 Q102,120 100,80"
            fill="none"
            stroke="#78350f"
            strokeWidth={stageIndex >= 5 ? "6" : "3"}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
        )}

        {/* 6-8. Branches & Crown */}
        {stageIndex >= 6 && (
          <motion.path
            d="M100,110 Q80,90 65,85 M100,100 Q120,80 135,75"
            fill="none"
            stroke="#78350f"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
        )}

        {stageIndex >= 7 && (
          <motion.circle
            cx="100" cy="70" r={stageIndex >= 8 ? "40" : "25"}
            fill="rgba(34, 197, 94, 0.1)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}

        {/* 9-11. Blooms & Fruits */}
        {stageIndex >= 9 && (
          <g>
            {[
              { x: 80, y: 60 }, { x: 120, y: 55 }, { x: 100, y: 40 }, { x: 130, y: 80 }, { x: 70, y: 85 }
            ].map((p, i) => (
              <motion.circle
                key={i}
                cx={p.x} cy={p.y} r="4"
                fill={stageIndex >= 10 ? "#ef4444" : "#fde68a"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </g>
        )}

        {/* Full Bloom Effect */}
        {stageIndex >= 11 && (
          <motion.circle
            cx="100" cy="70" r="50"
            fill="none"
            stroke="rgba(34, 197, 94, 0.2)"
            strokeWidth="1"
            strokeDasharray="5 5"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Processing Glow */}
        {isProcessing && (
          <motion.circle
            cx="100" cy="100" r="85"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray="10 10"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        )}
      </svg>

      <div className="absolute bottom-6 text-center w-full">
        <span className="text-[10px] font-mono text-stone-300 uppercase tracking-[0.3em]">Состояние Дерева</span>
        <div className="text-sm font-serif italic text-stone-500">{stage}</div>
      </div>
    </div>
  );
};
