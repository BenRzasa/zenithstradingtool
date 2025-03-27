// Ensures persistency for trade data
import React, { createContext, useState, useEffect } from 'react';

export const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const [tradeData, setTradeData] = useState(() => {
    // Load from localStorage on initial render
    const savedData = localStorage.getItem('tradeData');
    return savedData ? JSON.parse(savedData) : {
      selectedOres: [],
      quantities: {},
      discount: 0,
      isJohnValues: false
    };
  });

  // Save to localStorage whenever tradeData changes
  useEffect(() => {
    localStorage.setItem('tradeData', JSON.stringify(tradeData));
  }, [tradeData]);

  return (
    <TradeContext.Provider value={{ tradeData, setTradeData }}>
      {children}
    </TradeContext.Provider>
  );
};