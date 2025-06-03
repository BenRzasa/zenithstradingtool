/* ZTT | Trade context to ensure trade table & amount data is persistent
  - When the user refreshes, navigates away, or closes the browser, the
  trade data MUST stay
  - Updated for simplified trade tool with:
    - Only quantities being tracked
    - Value mode instead of isJohnValues boolean
    - Discount percentage
    - Removed receive-related data
*/

import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';

export const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const persistState = useCallback((state) => {
    try {
      localStorage.setItem('tradeState', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist state', e);
    }
  }, []);

  const [tradeState, setTradeState] = useState(() => {
    try {
      const savedData = localStorage.getItem('tradeState');
      return savedData ? JSON.parse(savedData) : {
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
    } catch (e) {
      console.error('Failed to parse saved state', e);
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
    }
  });

  const isMounted = useRef(false);

  const persistentSetTradeState = useCallback((updater) => {
    setTradeState(prev => {
      const newState = typeof updater === 'function' ? updater(prev) : updater;
      if (isMounted.current) {
        persistState(newState);
      }
      return newState;
    });
  }, [persistState]);

  // Memoize the updateTradeOres function to prevent unnecessary recreations
  const updateTradeOres = useCallback((allOres) => {
    persistentSetTradeState(prev => {
      const newTradeOres = allOres
        .filter(ore => prev.quantities.hasOwnProperty(ore.name))
        .map(ore => ({
          ...ore,
          amount: prev.quantities[ore.name] || 0
        }));

      // Only update if something actually changed
      if (JSON.stringify(newTradeOres) === JSON.stringify(prev.tradeOres)) {
        return prev;
      }

      return { ...prev, tradeOres: newTradeOres };
    });
  }, [persistentSetTradeState]);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  return (
    <TradeContext.Provider value={{
      tradeState,
      setTradeState: persistentSetTradeState,
      updateTradeOres,
      clearTradeSummary: () => persistentSetTradeState(prev => ({
        ...prev,
        quantities: {},
        tradeOres: [],
        selectedOres: []
      }))
    }}>
      {children}
    </TradeContext.Provider>
  );
};