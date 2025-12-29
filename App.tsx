
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  MoreVertical, 
  LayoutGrid, 
  History as HistoryIcon, 
  Settings, 
  Divide, 
  Minus, 
  Plus, 
  Equal, 
  X,
  Delete,
  Calculator,
  Trash2,
  ChevronLeft,
  Coins,
  Ruler,
  Thermometer,
  Scale,
  Box,
  Layers
} from 'lucide-react';
import Display from './components/Display';
import CalcButton from './components/CalcButton';
import { CalculationState, CalculationHistory } from './types';
import { evaluateExpression } from './utils/math';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'coloros_calc_state_v4';

const App: React.FC = () => {
  const [state, setState] = useState<CalculationState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure we don't start in scientific mode if it was previously saved
      if (parsed.view === 'scientific') parsed.view = 'standard';
      return parsed;
    }
    return {
      expression: '',
      liveResult: null,
      history: [],
      view: 'standard',
    };
  });

  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Persist State
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const liveResult = useMemo(() => {
    if (!state.expression) return null;
    const lastChar = state.expression.slice(-1);
    const operators = ['+', '-', '×', '÷'];
    if (operators.includes(lastChar)) return null;
    if (!operators.some(op => state.expression.includes(op))) return null;
    
    return evaluateExpression(state.expression);
  }, [state.expression]);

  const handleInput = useCallback((val: string) => {
    setState(prev => {
      let nextExpr = prev.expression;
      const operators = ['+', '-', '×', '÷'];
      const lastChar = nextExpr.slice(-1);
      
      if (nextExpr === '0' && !operators.includes(val) && val !== '.') {
        nextExpr = val;
      } else if (operators.includes(val) && operators.includes(lastChar)) {
        nextExpr = nextExpr.slice(0, -1) + val;
      } else {
        nextExpr = nextExpr + val;
      }

      return { ...prev, expression: nextExpr };
    });
  }, []);

  const handleBackspace = useCallback(() => {
    setState(prev => ({
      ...prev, 
      expression: prev.expression.length > 0 ? prev.expression.slice(0, -1) : ''
    }));
  }, []);

  const clear = useCallback(() => {
    setState(prev => ({ ...prev, expression: '', liveResult: null }));
  }, []);

  const handleEquals = useCallback(() => {
    if (!state.expression) return;
    const result = evaluateExpression(state.expression);
    if (result && result !== state.expression) {
      const newEntry: CalculationHistory = {
        expression: state.expression,
        result: result,
        date: new Date().toLocaleDateString('en-GB')
      };
      setState(prev => ({
        ...prev,
        expression: result,
        history: [newEntry, ...prev.history].slice(0, 50)
      }));
    }
  }, [state.expression]);

  const handlePercent = useCallback(() => {
    if (!state.expression) return;
    const res = evaluateExpression(`${state.expression}/100`);
    if (res) setState(prev => ({ ...prev, expression: res }));
  }, [state.expression]);

  const toggleView = (view: 'standard' | 'converter') => {
    setState(prev => ({ ...prev, view }));
  };

  const converterCategories = [
    { name: 'Currency', icon: <Coins size={28} className="text-orange-500" /> },
    { name: 'Length', icon: <Ruler size={28} className="text-blue-500" /> },
    { name: 'Area', icon: <Layers size={28} className="text-green-500" /> },
    { name: 'Volume', icon: <Box size={28} className="text-purple-500" /> },
    { name: 'Weight', icon: <Scale size={28} className="text-red-500" /> },
    { name: 'Temperature', icon: <Thermometer size={28} className="text-teal-500" /> },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#EFEFEF] text-[#1A1A1A] relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 pt-8 pb-2 z-20">
        <div className="flex items-center gap-6">
          <motion.div 
            whileTap={{ scale: 0.9 }} 
            onClick={() => toggleView('standard')}
            className={`cursor-pointer transition-colors ${state.view === 'standard' ? 'text-[#1A1A1A]' : 'text-[#808080]'}`}
          >
            <Calculator size={22} strokeWidth={1.5} />
          </motion.div>
          <motion.div 
            whileTap={{ scale: 0.9 }} 
            onClick={() => toggleView('converter')}
            className={`cursor-pointer transition-colors ${state.view === 'converter' ? 'text-[#1A1A1A]' : 'text-[#808080]'}`}
          >
            <LayoutGrid size={22} strokeWidth={1.5} />
          </motion.div>
        </div>
        
        <div className="relative">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-[#808080]"
          >
            <MoreVertical size={24} strokeWidth={1.5} />
          </motion.button>
          
          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl z-50 py-2 border border-black/5"
                >
                  <button 
                    onClick={() => { setShowHistory(true); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-colors text-left"
                  >
                    <HistoryIcon size={18} />
                    <span>History</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-colors text-left">
                    <Settings size={18} />
                    <span>Settings</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state.view === 'converter' ? (
          <motion.div 
            key="converter"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col p-6 overflow-y-auto"
          >
            <div className="flex items-center gap-2 mb-8">
              <button onClick={() => toggleView('standard')} className="text-[#808080] p-1">
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-xl font-bold">Unit Converter</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {converterCategories.map((cat) => (
                <motion.button
                  key={cat.name}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-3xl aspect-square flex flex-col items-center justify-center gap-2 shadow-sm border border-white/50"
                >
                  {cat.icon}
                  <span className="text-[0.75rem] font-medium text-[#808080]">{cat.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="calculator"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col flex-1"
          >
            <Display expression={state.expression} liveResult={liveResult} />

            <div className="px-6 pb-6 overflow-y-auto scrollbar-hide pt-4">
              <div className="grid grid-cols-4 gap-3 md:gap-4">
                <CalcButton label={state.expression ? "C" : "AC"} variant="function" onClick={clear} />
                <CalcButton label={<Delete size={24} strokeWidth={1.5} />} variant="function" onClick={handleBackspace} />
                <CalcButton label="%" variant="function" onClick={handlePercent} />
                <CalcButton label={<Divide size={26} strokeWidth={1.5} />} variant="operator" onClick={() => handleInput('÷')} />

                <CalcButton label="7" onClick={() => handleInput('7')} />
                <CalcButton label="8" onClick={() => handleInput('8')} />
                <CalcButton label="9" onClick={() => handleInput('9')} />
                <CalcButton label={<X size={22} strokeWidth={1.5} />} variant="operator" onClick={() => handleInput('×')} />

                <CalcButton label="4" onClick={() => handleInput('4')} />
                <CalcButton label="5" onClick={() => handleInput('5')} />
                <CalcButton label="6" onClick={() => handleInput('6')} />
                <CalcButton label={<Minus size={26} strokeWidth={1.5} />} variant="operator" onClick={() => handleInput('-')} />

                <CalcButton label="1" onClick={() => handleInput('1')} />
                <CalcButton label="2" onClick={() => handleInput('2')} />
                <CalcButton label="3" onClick={() => handleInput('3')} />
                <CalcButton label={<Plus size={26} strokeWidth={1.5} />} variant="operator" onClick={() => handleInput('+')} />

                <CalcButton label="0" span={2} onClick={() => handleInput('0')} />
                <CalcButton label="." onClick={() => handleInput('.')} />
                <CalcButton label={<Equal size={30} strokeWidth={1.5} />} variant="equal" onClick={handleEquals} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-[#F2F2F2] z-[60] flex flex-col"
          >
            <div className="flex items-center justify-between px-6 pt-10 pb-4 border-b border-black/5">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowHistory(false)} className="p-2 -ml-2 text-[#1A1A1A]">
                  <Plus size={32} strokeWidth={1.5} className="rotate-45" />
                </button>
                <h2 className="text-xl font-bold">History</h2>
              </div>
              {state.history.length > 0 && (
                <button 
                  onClick={() => setState(p => ({ ...p, history: [] }))} 
                  className="text-[#808080] p-2 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              {state.history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#808080] opacity-30">
                  <HistoryIcon size={64} strokeWidth={1} className="mb-4" />
                  <p className="text-lg">No history</p>
                </div>
              ) : (
                state.history.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-xs text-[#808080] font-medium tracking-wider">{item.date}</p>
                    <div className="flex flex-col items-end">
                      <p className="text-xl text-[#808080] break-all">{item.expression}</p>
                      <p className="text-3xl font-bold text-[#F37021]">= {item.result}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-6 flex justify-center items-center pb-2 shrink-0">
        <div className="w-32 h-1 bg-black/10 rounded-full" />
      </div>
    </div>
  );
};

export default App;
