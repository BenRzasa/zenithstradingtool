export const getOreNames = (oreValsDict) => {
    if (!Array.isArray(oreValsDict)) return [];

    const allOreNames = [];

    oreValsDict.forEach(layer => {
        if (layer.layerOres && Array.isArray(layer.layerOres)) {
            layer.layerOres.forEach(ore => {
                if (ore.name) {
                    allOreNames.push(ore.name);
                }
            });
        }
    });

    const uniqueOreNames = [...new Set(allOreNames)];

    uniqueOreNames.sort((a, b) => {
        const minLength = Math.min(a.length, b.length);
        for (let i = 0; i < minLength; i++) {
            const charA = a.charCodeAt(i);
            const charB = b.charCodeAt(i);
            if (charA !== charB) {
                return charA - charB;
            }
        }
        return a.length - b.length;
    });

    return uniqueOreNames;
};
