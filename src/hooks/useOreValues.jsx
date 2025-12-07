import { useState, useEffect } from 'react';
import { oreValuesStructure } from '../data/oreValuesStructure';

export const useOreValues = () => {
    const [oreValsDict, setOreValsDict] = useState(oreValuesStructure);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOreValues = () => {
            try {
                const savedData = localStorage.getItem('oreValuesData');

                if (savedData) {
                    const parsedData = JSON.parse(savedData);

                    if (parsedData.categories) {
                        // Start with a fresh copy of the structure
                        const populatedStructure = [...oreValuesStructure];

                        // Go through each category in the JSON
                        parsedData.categories.forEach(category => {
                            // Find which layer in our structure matches this category
                            const matchingLayerIndex = populatedStructure.findIndex(layer => {
                                // Compare the first part of layer name (before \n) with ZTTName
                                const layerMainName = layer.layerName.split('\n')[0];
                                return layerMainName === category.ZTTName;
                            });

                            // If we found a matching layer and it has ore entries
                            if (matchingLayerIndex !== -1 && category.entries) {
                                // Transform the entries into the format needed for layerOres
                                const populatedOres = category.entries.map(oreEntry => {
                                    // Check if this ore already exists in the current layer
                                    const currentLayer = populatedStructure[matchingLayerIndex];
                                    const existingOre = currentLayer.layerOres.find(existing => 
                                        existing.name === oreEntry.name
                                    );

                                    // Build the ore object with all its values
                                    return {
                                        name: oreEntry.name,
                                        // Copy all numeric values from the entry
                                        ...Object.fromEntries(
                                            Object.entries(oreEntry).filter(([key, value]) => 
                                                key !== 'name' && typeof value === 'number'
                                            )
                                        ),
                                        // Keep existing custom value or use the first available number
                                        defaultVal: existingOre ? existingOre.defaultVal : 
                                            Object.values(oreEntry).find(val => typeof val === 'number') || 0
                                    };
                                });

                                // Update this specific layer with its populated ores
                                populatedStructure[matchingLayerIndex] = {
                                    ...populatedStructure[matchingLayerIndex],
                                    layerOres: populatedOres
                                };
                            }
                        });

                        setOreValsDict(populatedStructure);
                        console.log("Loaded ore values from localStorage");
                    }
                } else {
                    console.log("No ore values found in localStorage");
                }

                setLoading(false);
            } catch (err) {
                console.error("Error loading ore values:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        loadOreValues();

        const handleOreValuesUpdated = () => {
            console.log("Ore values updated event received");
            loadOreValues();
        };

        window.addEventListener('oreValuesUpdated', handleOreValuesUpdated);

        return () => {
            window.removeEventListener('oreValuesUpdated', handleOreValuesUpdated);
        };
    }, []);

    // Return the array directly, not an object
    return oreValsDict;
};
