/* ZTT | Trade context to ensure trade table & amount data is persistent
  - When the user refreshes, navigates away, or closes the browser, the
  trade data MUST stay
  - Updated for simplified trade tool with:
    - Only quantities being tracked
    - Value mode instead of isJohnValues boolean
    - Discount percentage
    - Removed receive-related data
*/

import React, { createContext, useState, useEffect, useCallback } from 'react';

export const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const [tradeState, setTradeState] = useState(() => {
    /* Complete trade state structure:
      - quantities: { [oreName]: amount }
      - selectedOres: array of selected ore names/IDs
      - tradeOres: array of ores with amounts >0 (for the summary table)
      - valueMode: 'john' | 'nan' | 'custom'
      - discount: number (0-100)
      - batchQuantity: number
      - tableNavigation: current table view state
    */
    try {
      const savedData = localStorage.getItem('tradeState');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return {
          quantities: typeof parsed.quantities === 'object' ? parsed.quantities : {},
          selectedOres: Array.isArray(parsed.selectedOres) ? parsed.selectedOres : [],
          tradeOres: Array.isArray(parsed.tradeOres) ? parsed.tradeOres : [],
          valueMode: ['john', 'nan', 'custom'].includes(parsed.valueMode) 
            ? parsed.valueMode 
            : 'john',
          discount: typeof parsed.discount === 'number' 
            ? Math.min(100, Math.max(0, parsed.discount)) 
            : 0,
          batchQuantity: typeof parsed.batchQuantity === 'number' ? parsed.batchQuantity : 0,
          tableNavigation: parsed.tableNavigation || {
            currentTable: 'all',
            sortField: 'name',
            sortDirection: 'asc'
          }
        };
      }
    } catch (e) {
      console.error('Failed to parse tradeState from localStorage', e);
    }

    // Default values
    return {
      quantities: {},
      selectedOres: [],
      tradeOres: [],
      valueMode: 'john',
      discount: 0,
      batchQuantity: 0,
      tableNavigation: {
        currentTable: 'all',
        sortField: 'name',
        sortDirection: 'asc'
      }
    };
  });

  // Save to localStorage whenever tradeState changes
  useEffect(() => {
    localStorage.setItem('tradeState', JSON.stringify(tradeState));
  }, [tradeState]);

  const updateTradeOres = useCallback((allOres) => {
    setTradeState(prev => ({
      ...prev,
      tradeOres: allOres.map(ore => ({
        ...ore,
        amount: prev.quantities[ore.name] || 0
      })).filter(ore => ore.amount > 0)
    }));
  }, []);

  // Clear trade summary
  const clearTradeSummary = () => {
    setTradeState(prev => ({
      ...prev,
      tradeOres: []
    }));
  };

  return (
    <TradeContext.Provider value={{
      tradeState,
      setTradeState,
      updateTradeOres,
      clearTradeSummary
    }}>
      {children}
    </TradeContext.Provider>
  );
};