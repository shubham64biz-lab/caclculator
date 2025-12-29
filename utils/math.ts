
export const evaluateExpression = (expr: string): string => {
  try {
    // Replace visual operators with math operators
    let sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/');
    
    // Safety check: only allow digits and standard operators
    if (!/^[0-9+\-*/.() ]+$/.test(sanitized)) return '';
    
    // Avoid eval where possible, but for simple calculator logic:
    // eslint-disable-next-line no-eval
    const result = eval(sanitized);
    
    if (isNaN(result) || !isFinite(result)) return '';
    
    // Format result
    const precision = 10;
    return String(parseFloat(result.toFixed(precision)));
  } catch {
    return '';
  }
};

export const formatNumber = (numStr: string): string => {
  if (!numStr || numStr === 'Error' || numStr === 'NaN') return numStr;
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};
