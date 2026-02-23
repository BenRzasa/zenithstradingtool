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

// Function to generate shortest unique substrings across ALL ores
function generateShortestSubstrings(allLayers) {
    const allOres = [];
    const substrings = {};

    // Collect all ores from all layers
    allLayers.forEach((layer) => {
        if (layer.layerOres && Array.isArray(layer.layerOres)) {
            layer.layerOres.forEach((ore) => {
                allOres.push(ore);
            });
        }
        // Add Essence if not already present
        if (!allOres.some(ore => ore.name === "Essence")) {
            allOres.push({ name: "Essence" });
        }
    });

    // Generate unique substrings across all ores
    allOres.forEach((ore) => {
        const name = ore.name.toLowerCase();
        let foundSubstring = "";

        // Try increasingly longer substrings from different positions
        outer: for (let length = 1; length <= name.length; length++) {
            // Try all possible starting positions for this length
            for (let start = 0; start <= name.length - length; start++) {
                const currentSubstring = name.slice(start, start + length);

                // Check if this substring is unique across all ores
                let isUnique = true;
                for (let j = 0; j < allOres.length; j++) {
                    const otherOre = allOres[j];
                    if (
                        otherOre !== ore &&
                        otherOre.name.toLowerCase().includes(currentSubstring)
                    ) {
                        isUnique = false;
                        break;
                    }
                }

                if (isUnique) {
                    foundSubstring = currentSubstring;
                    break outer;
                }
            }
        }

        substrings[ore.name] = foundSubstring || name;
    });

    return substrings;
}

// Convert your layer data to the search filter format
function layersToSearchFilters(layers) {
    const filters = [];
    const globalSubstrings = generateShortestSubstrings(layers);

    layers.forEach((layer) => {
        // Truncate layer name at newline
        const layerName = layer.layerName.split("\n")[0];

        // Remove redundant substrings within the layer
        const uniqueSubstrings = new Set();
        const finalSubstrings = [];

        if (layer.layerOres && Array.isArray(layer.layerOres)) {
            layer.layerOres.forEach((ore) => {
                const substring = globalSubstrings[ore.name];
                if (!uniqueSubstrings.has(substring)) {
                    uniqueSubstrings.add(substring);
                    finalSubstrings.push(substring);
                }
            });
        }

        const searchString = finalSubstrings.join("/");
        filters.push(`${layerName}: ${searchString}`);
    });

    return filters;
}

// Create combined rares filter (appears first)
function createCombinedRaresFilter(layers) {
    const rareOres = [];

    // Find ores from both True Rares and normal Rares layers
    const rareLayers = layers.filter((layer) => {
        const layerName = layer.layerName.toLowerCase();
        return layerName.includes("true rare") || layerName.includes("rares");
    });

    rareLayers.forEach((layer) => {
        if (layer.layerOres && Array.isArray(layer.layerOres)) {
            rareOres.push(...layer.layerOres);
        }
    });

    if (rareOres.length > 0) {
        const globalSubstrings = generateShortestSubstrings(layers);

        // Remove redundant substrings within combined rares
        const uniqueSubstrings = new Set();
        const finalSubstrings = [];

        rareOres.forEach((ore) => {
            const substring = globalSubstrings[ore.name];
            if (!uniqueSubstrings.has(substring)) {
                uniqueSubstrings.add(substring);
                finalSubstrings.push(substring);
            }
        });

        const searchString = finalSubstrings.join("/");
        return `Combined Rares: ${searchString}`;
    }

    return null;
}

// Full conversion
function convertLayersToSearchFilters(layers) {
    if (!Array.isArray(layers) || layers.length === 0) {
        return [];
    }

    const combinedRaresFilter = createCombinedRaresFilter(layers);
    const layerFilters = layersToSearchFilters(layers);

    const additionalFilters = [
        "Torn Synthesis: qy/bla/chron/com/cons/dy/ok/ecil/fab/galv/gyr/inv/iso/malb/meso/trino/nihi/nili/obli/peril/veri/w e/ardu/llari/ge q/sall/unob/vora",
        "Stellar Sediment: rhy/ubri/havi/ecto/r s/sall/c m/chron/apia/kore/rimr/primo",
    ];

    // Combined Rares appears first, then additional filters, then all other layers
    return [
        ...(combinedRaresFilter ? [combinedRaresFilter] : []),
        ...additionalFilters,
        ...layerFilters,
    ];
}

// Export as a utility function
export const getSearchFilters = (oreValsDict) => {
    if (!Array.isArray(oreValsDict) || oreValsDict.length === 0) {
        return [];
    }
    return convertLayersToSearchFilters(oreValsDict);
};

// Export as a hook for React components
import { useMemo } from "react";
export const useSearchFilters = (oreValsDict) => {
    return useMemo(() => {
        return getSearchFilters(oreValsDict);
    }, [oreValsDict]);
};
