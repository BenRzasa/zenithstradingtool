/*
 * Zenith's Trading Tool - An external website created for Celestial Caverns
 * Copyright (C) 2026 - Ben Rzasa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
*/

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

export const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  const persistState = useCallback((state) => {
    try {
      localStorage.setItem("tradeState", JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist state", e);
    }
  }, []);

  // Persist the entire state of the trade table and settings
  const [tradeState, setTradeState] = useState(() => {
    try {
      const savedData = localStorage.getItem("tradeState");
      return savedData
        ? JSON.parse(savedData)
        : {
            quantities: {},
            selectedOres: [],
            tradeOres: [],
            valueMode: "zenith",
            discount: 0,
            batchQuantity: 0,
            tableNavigation: {
              currentTable: "all",
              sortField: "name",
              sortDirection: "asc",
            },
          };
    } catch (e) {
      console.error("Failed to parse saved state", e);
      return {
        quantities: {},
        selectedOres: [],
        tradeOres: [],
        valueMode: "zenith",
        discount: 0,
        batchQuantity: 0,
        tableNavigation: {
          currentTable: "all",
          sortField: "name",
          sortDirection: "asc",
        },
      };
    }
  });

  const isMounted = useRef(false);

  const persistentSetTradeState = useCallback(
    (updater) => {
      setTradeState((prev) => {
        const newState =
          typeof updater === "function" ? updater(prev) : updater;
        if (isMounted.current) {
          persistState(newState);
        }
        return newState;
      });
    },
    [persistState]
  );

  // Update trade ores any time a value or data actually changes
  const updateTradeOres = useCallback(
    (allOres) => {
      persistentSetTradeState((prev) => {
        const newTradeOres = allOres
          .filter((ore) => prev.quantities.hasOwnProperty(ore.name))
          .map((ore) => ({
            ...ore,
            amount: prev.quantities[ore.name] || 0,
          }));

        // Only update if something actually changed
        if (JSON.stringify(newTradeOres) === JSON.stringify(prev.tradeOres)) {
          return prev;
        }

        return { ...prev, tradeOres: newTradeOres };
      });
    },
    [persistentSetTradeState]
  );

  // Double check if component mounted properly
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <TradeContext.Provider
      value={{
        tradeState,
        setTradeState: persistentSetTradeState,
        updateTradeOres,
        clearTradeSummary: () =>
          persistentSetTradeState((prev) => ({
            ...prev,
            quantities: {},
            tradeOres: [],
            selectedOres: [],
          })),
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};
