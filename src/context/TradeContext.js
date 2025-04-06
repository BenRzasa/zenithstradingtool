/* ZTT | Trade context to ensure trade table & amount data is persistent
  - When the user refreshes, navigates away, or closes the browser, the
  trade data MUST stay
*/

import React, { createContext, useState, useEffect } from 'react';

export const TradeContext = createContext(); // Send the context out

export const TradeProvider = ({ children }) => {
  const [tradeData, setTradeData] = useState(() => {
      /* Components
        - Selected ores: ores in the trade table
        - Quantities: input numbers in the box
        - Received ores
        - Discount: percentage saved from discount box
        - John/NAN vals
      */
    try {
      const savedData = localStorage.getItem('tradeData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return {
          selectedOres: Array.isArray(parsed.selectedOres) ? parsed.selectedOres : [],
          quantities: typeof parsed.quantities === 'object' ? parsed.quantities : {},
          receivedOres: Array.isArray(parsed.receivedOres) ? parsed.receivedOres : [],
          receivedQuantities: typeof parsed.receivedQuantities === 'object' ? parsed.receivedQuantities : {},
          discount: typeof parsed.discount === 'number' ? parsed.discount : 0,
          isJohnValues: typeof parsed.isJohnValues === 'boolean' ? parsed.isJohnValues : false
        };
      }
    } catch (e) {
      console.error('Failed to parse tradeData from localStorage', e);
    }

    return {
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