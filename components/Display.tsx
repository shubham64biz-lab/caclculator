
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatNumber } from '../utils/math';

interface DisplayProps {
  expression: string;
  liveResult: string | null;
}

const Display: React.FC<DisplayProps> = ({ expression, liveResult }) => {
  return (
    <div className="flex flex-col flex-1 justify-end items-end px-8 pb-4 pt-4 overflow-hidden">
      <div className="w-full text-right flex flex-col gap-1">
        {/* Main Expression */}
        <div className="overflow-x-auto whitespace-nowrap scrollbar-hide flex flex-col items-end">
          <motion.div
            key={expression}
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            className={`font-bold text-[#1A1A1A] tracking-tight transition-all duration-200 select-all leading-tight ${
              expression.length > 12 ? 'text-[2.2rem]' : expression.length > 8 ? 'text-[2.8rem]' : 'text-[3.8rem]'
            }`}
          >
            {expression || '0'}
          </motion.div>
        </div>

        {/* Real-time Preview */}
        <div className="h-10">
          <AnimatePresence mode="wait">
            {liveResult && expression && (
              <motion.div
                key={liveResult}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[1.6rem] text-[#A0A0A0] font-medium"
              >
                {formatNumber(liveResult)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Display;
