
export type Operator = '+' | '-' | '×' | '÷' | '=';

export interface CalculationHistory {
  expression: string;
  result: string;
  date: string;
}

export interface CalculationState {
  expression: string;
  liveResult: string | null;
  history: CalculationHistory[];
  view: 'standard' | 'converter';
}

export interface UnitCategory {
  name: string;
  icon: string;
}
