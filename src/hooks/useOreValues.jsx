import { useState, useEffect } from 'react';
import { oreValuesStructure } from '../data/oreValuesStructure';

export const useOreValues = () => {
  const [oreValsDict, setOreValsDict] = useState(oreValuesStructure);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOreValues = () => {
      try {
        // Try to get from localStorage
        const savedData = localStorage.getItem('oreValuesData');
        
        if (savedData) {
          const oresJSON = JSON.parse(savedData);
          
          // Create a copy of the structure with populated ores
          const populatedStructure = oreValuesStructure.map(layer => {
            // Find matching JSON key by checking if layer name contains the key
            const jsonLayerKey = Object.keys(oresJSON).find(jsonKey => 
              layer.layerName.includes(jsonKey)
            );
            
            if (jsonLayerKey && oresJSON[jsonLayerKey]) {
              // Add customVal to each ore (default to obtainVal if it exists)
              const populatedOres = oresJSON[jsonLayerKey].map(ore => {
                // Check if this ore already exists in the structure (for custom values)
                const existingOre = layer.layerOres.find(existing => 
                  existing.name === ore.name
                );
                
                return {
                  ...ore,
                  customVal: existingOre ? existingOre.customVal : 
                    (ore.obtainVal || ore.zenithVal || ore.randomsVal || 0)
                };
              });
              
              return {
                ...layer,
                layerOres: populatedOres
              };
            }
            
            // Return original layer if no match found
            return layer;
          });
          
          setOreValsDict(populatedStructure);
          console.log("Loaded ore values from localStorage");
        } else {
          console.log("No ore values found in localStorage");
          // Keep the empty structure
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading ore values:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadOreValues();
    
    // Listen for updates from App.jsx
    const handleOreValuesUpdated = (event) => {
      console.log("Ore values updated event received");
      loadOreValues(); // Reload when new data arrives
    };
    
    window.addEventListener('oreValuesUpdated', handleOreValuesUpdated);
    
    return () => {
      window.removeEventListener('oreValuesUpdated', handleOreValuesUpdated);
    };
  }, []);

  return oreValsDict;
};
