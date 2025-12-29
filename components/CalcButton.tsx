
import React from 'react';
import { motion } from 'framer-motion';

interface CalcButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'number' | 'function' | 'operator' | 'equal';
  span?: number;
}

const CalcButton: React.FC<CalcButtonProps> = ({ label, onClick, variant = 'number', span = 1 }) => {
  const handlePress = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    onClick();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'function':
      case 'operator':
        return 'bg-[#E8E8E8] text-[#1A1A1A] font-medium';
      case 'equal':
        return 'bg-[#F37021] text-white shadow-lg shadow-[#F37021]/30 font-semibold';
      case 'number':
      default:
        return 'bg-white text-[#1A1A1A] font-semibold';
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.92, backgroundColor: 'rgba(0,0,0,0.1)' }}
      onClick={handlePress}
      className={`
        ${getVariantStyles()}
        ${span === 2 ? 'col-span-2' : 'col-span-1'}
        flex items-center justify-center
        rounded-full w-full
        text-[1.6rem] transition-all duration-100
        soft-shadow border border-white/40
        select-none
      `}
      style={{ 
        aspectRatio: span === 2 ? 'auto' : '1/1',
        height: span === 2 ? 'auto' : undefined
      }}
    >
      {label}
    </motion.button>
  );
};

export default CalcButton;
