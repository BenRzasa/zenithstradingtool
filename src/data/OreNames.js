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
