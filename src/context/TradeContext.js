/* ZTT | Trade context to ensure trade table & amount data is persistent
  - When the user refreshes, navigates away, or closes the browser, the
  trade data MUST stay
*/

import React, { createContext, useState, useEffect } from 'react';

export const TradeContext = createContext(); // Send the context out

export const TradeProvider = ({ children }) => {
  const [tradeData, setTradeData] = useState(() => {
    // Load from localStorage on initial render
    const savedData = localStorage.getItem('tradeData');
    return savedData ? JSON.parse(savedData) : {
      /* Components
        - Selected ores: ores in the trade table
        - Quantities: input numbers in the box
        - Received ores
        - Discount: percentage saved from discount box
        - John/NAN vals
      */
      selectedOres: [],
      quantities: {},
      receivedOres: [],
      receivedQuantities: {},
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