import { initialOreValsDict } from "./OreValues";

// Function to generate shortest unique substrings across ALL ores
function generateShortestSubstrings(allLayers) {
    const allOres = [];
    const substrings = {};

    // Collect all ores from all layers
    allLayers.forEach((layer) => {
        layer.layerOres.forEach((ore) => {
            allOres.push(ore);
        });
        allOres.push({ name: "Essence" });
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

        layer.layerOres.forEach((ore) => {
            const substring = globalSubstrings[ore.name];
            if (!uniqueSubstrings.has(substring)) {
                uniqueSubstrings.add(substring);
                finalSubstrings.push(substring);
            }
        });

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
        rareOres.push(...layer.layerOres);
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

const searchFilters = convertLayersToSearchFilters(initialOreValsDict);
export default searchFilters;
