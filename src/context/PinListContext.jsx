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

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { MiscContext } from "./MiscContext";

export const PinListContext = createContext();

export const PinListProvider = ({ children }) => {
  const {
    getValueForMode
  } = useContext(MiscContext);

  const [useAVMode, setUseAVMode] = useState(() => {
    const savedUseAVMode = localStorage.getItem("useAVMode");
    return savedUseAVMode !== null ? JSON.parse(savedUseAVMode) : false;
  });

  useEffect(() => {
    localStorage.setItem("useAVMode", JSON.stringify(useAVMode));
  }, [useAVMode]);

  const persistPinState = useCallback((state) => {
    try {
      localStorage.setItem("pinListState", JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist pin list state", e);
    }
  }, []);

  const [pinListState, setPinListState] = useState(() => {
    try {
      const savedData = localStorage.getItem("pinListState");
      return savedData
        ? JSON.parse(savedData)
        : {
            pinnedOres: [],
            quantities: {},
            selectedPinnedOres: [],
            searchTerm: "",
            searchFocused: false,
            selectedSearchIndex: -1,
            batchQuantity: 0,
            batchMode: "quantity",
          };
    } catch (e) {
      console.error("Failed to parse saved pin list state", e);
      return {
        pinnedOres: [],
        quantities: {},
        selectedPinnedOres: [],
        searchTerm: "",
        searchFocused: false,
        selectedSearchIndex: -1,
        batchQuantity: 0,
        batchMode: "quantity",
      };
    }
  });

  const isMounted = useRef(false);

  const persistentSetPinListState = useCallback(
    (updater) => {
      setPinListState((prev) => {
        const newState = typeof updater === "function" ? updater(prev) : updater;
        if (isMounted.current) {
          persistPinState(newState);
        }
        return newState;
      });
    },
    [persistPinState]
  );

  // Add ore to pin list
  const addToPinList = useCallback((ore) => {
    persistentSetPinListState((prev) => {
      const existing = prev.pinnedOres.find((item) => item.name === ore.name);
      if (existing) {
        return prev;
      }

      const newPinnedOres = [...prev.pinnedOres, ore];

      const newQuantities = { ...prev.quantities };
      if (!newQuantities[ore.name]) {
        newQuantities[ore.name] = 1;
      }

      return {
        ...prev,
        pinnedOres: newPinnedOres,
        quantities: newQuantities,
        searchTerm: "",
      };
    });
  }, [persistentSetPinListState]);

  // Remove ore from pin list
  const removeFromPinList = useCallback((oreName) => {
    persistentSetPinListState((prev) => {
      const newPinnedOres = prev.pinnedOres.filter((ore) => ore.name !== oreName);
      const newQuantities = { ...prev.quantities };
      delete newQuantities[oreName];

      const newSelectedPinnedOres = prev.selectedPinnedOres.filter(
        (name) => name !== oreName
      );

      return {
        ...prev,
        pinnedOres: newPinnedOres,
        quantities: newQuantities,
        selectedPinnedOres: newSelectedPinnedOres,
      };
    });
  }, [persistentSetPinListState]);

  const updatePinQuantity = useCallback((ore, quantityOrAV) => {
    let valueOrQuantity = 0.0;
    console.log("AV Mode: ", useAVMode);
    if(!useAVMode) {
      valueOrQuantity = quantityOrAV === "" ? "" : Math.max(0, Number(quantityOrAV) || 0);
    } else {
      valueOrQuantity = Math.ceil((getValueForMode(ore) * quantityOrAV).toFixed(0), 1);
    }

    persistentSetPinListState((prev) => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [ore.name]: valueOrQuantity,
      },
    }));

    console.log(valueOrQuantity);
  }, [persistentSetPinListState]);

  // Clear entire pin list
  const clearPinList = useCallback(() => {
    persistentSetPinListState((prev) => ({
      ...prev,
      pinnedOres: [],
      quantities: {},
      selectedPinnedOres: [],
      batchQuantity: 0,
    }));
  }, [persistentSetPinListState]);

  // Toggle ore selection in pin list
  const togglePinSelection = useCallback((oreName) => {
    persistentSetPinListState((prev) => ({
      ...prev,
      selectedPinnedOres: prev.selectedPinnedOres.includes(oreName)
        ? prev.selectedPinnedOres.filter((name) => name !== oreName)
        : [...prev.selectedPinnedOres, oreName],
    }));
  }, [persistentSetPinListState]);

  // Clear selected pinned ores
  const clearPinSelection = useCallback(() => {
    persistentSetPinListState((prev) => ({
      ...prev,
      selectedPinnedOres: [],
      batchQuantity: 0,
    }));
  }, [persistentSetPinListState]);

  // Search-related functions
  const handlePinSearchTermChange = useCallback((term) => {
    persistentSetPinListState((prev) => ({
      ...prev,
      searchTerm: term,
      selectedSearchIndex: -1,
    }));
  }, [persistentSetPinListState]);

  const handlePinSearchFocusChange = useCallback((focused) => {
    persistentSetPinListState((prev) => ({
      ...prev,
      searchFocused: focused,
    }));
  }, [persistentSetPinListState]);

  const handlePinSearchIndexChange = useCallback((index) => {
    persistentSetPinListState((prev) => ({
      ...prev,
      selectedSearchIndex: index,
    }));
  }, [persistentSetPinListState]);

  // Add multiple ores to pin list based on search
  const addMultipleOresToPinList = useCallback((searchTerm, allOresWithLayers) => {
    const searchParts = searchTerm
      .toLowerCase()
      .split("/")
      .map((part) => part.trim());

    const oresToAdd = allOresWithLayers.filter((ore) =>
      searchParts.some((part) => ore.name.toLowerCase().includes(part))
    );

    persistentSetPinListState((prev) => {
      const newPinnedOres = [...prev.pinnedOres];
      const newQuantities = { ...prev.quantities };

      oresToAdd.forEach((ore) => {
        if (!newPinnedOres.some((pinnedOre) => pinnedOre.name === ore.name)) {
          newPinnedOres.push(ore);
          if (!newQuantities[ore.name]) {
            newQuantities[ore.name] = 1;
          }
        }
      });

      return {
        ...prev,
        pinnedOres: newPinnedOres,
        quantities: newQuantities,
        searchTerm: "",
      };
    });
  }, [persistentSetPinListState]);

  // Filter function for search
  const filterOres = useCallback((term, source) => {
    if (!term.trim()) return [];
    const searchParts = term
      .toLowerCase()
      .split("/")
      .map((part) => part.trim());
    return source.filter((ore) => {
      return searchParts.some((part) => ore.name.toLowerCase().includes(part));
    });
  }, []);

  // Check if ore is selected in pin list
  const isPinSelected = useCallback((oreName) => {
    return pinListState.selectedPinnedOres.includes(oreName);
  }, [pinListState.selectedPinnedOres]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <PinListContext.Provider
      value={{
        pinListState,
        setPinListState: persistentSetPinListState,
        addToPinList,
        removeFromPinList,
        updatePinQuantity,
        clearPinList,
        isPinSelected,
        togglePinSelection,
        clearPinSelection,
        handlePinSearchTermChange,
        handlePinSearchFocusChange,
        handlePinSearchIndexChange,
        addMultipleOresToPinList,
        filterOres,
        useAVMode,
        setUseAVMode,
      }}
    >
      {children}
    </PinListContext.Provider>
  );
};
