
// Array of every ore name, alphabetically sorted (hopefully)
import { initialOreValsDict } from "./OreValues";
// Extract all ore names from the dictionary
const allOreNames = [];
for (const category in initialOreValsDict) {
  if (initialOreValsDict.hasOwnProperty(category)) {
    const oresInCategory = initialOreValsDict[category];
    for (const ore of oresInCategory) {
      allOreNames.push(ore.name);
    }
  }
}

const uniqueOreNames = [...new Set(allOreNames)]
uniqueOreNames.sort((a, b) => a.localeCompare(b));

export const OreNames = uniqueOreNames;