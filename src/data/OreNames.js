// Array of every ore name, case-sensitively sorted (uppercase before lowercase)
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

const uniqueOreNames = [...new Set(allOreNames)];

// Custom sort function that prioritizes uppercase over lowercase
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

export const OreNames = uniqueOreNames;
console.log(uniqueOreNames);