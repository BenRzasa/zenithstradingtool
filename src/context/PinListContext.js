// context/PinListContext.js
import React, { createContext, useState, useContext } from "react";

const PinListContext = createContext();

export const usePinList = () => {
  const context = useContext(PinListContext);
  if (!context) {
    throw new Error("usePinList must be used within a PinListProvider");
  }
  return context;
};

export const PinListProvider = ({ children }) => {
  const [pinList, setPinList] = useState([]);

  const addToPinList = (oreKey) => {
    setPinList((prev) => {
      // Check if ore already exists in pin list
      const existing = prev.find((item) => item.oreKey === oreKey);
      if (existing) {
        return prev.map((item) =>
          item.oreKey === oreKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { oreKey, quantity: 1 }];
    });
  };

  const removeFromPinList = (oreKey) => {
    setPinList((prev) => prev.filter((item) => item.oreKey !== oreKey));
  };

  const updatePinQuantity = (oreKey, quantity) => {
    if (quantity < 0) return;

    setPinList((prev) =>
      prev.map((item) =>
        item.oreKey === oreKey ? { ...item, quantity } : item
      )
    );
  };

  const clearPinList = () => {
    setPinList([]);
  };

  const value = {
    pinList,
    addToPinList,
    removeFromPinList,
    updatePinQuantity,
    clearPinList,
  };

  return (
    <PinListContext.Provider value={value}>{children}</PinListContext.Provider>
  );
};

export { PinListContext };
