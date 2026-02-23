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

// All charm names, primary ore, and descriptions

const charmPerks = [
    { name: "Cosmaline Necklace",
        ore: "Cosmaline",
        description: "Reveals all ores that glow in a 4 block radius around you"
    },
    {
        name: "Exonil Ring",
        ore: "Exodian",
        description: "Decreases mine time of ores by 0.15s",
    },
    {
        name: "Thulinyl Ring",
        ore: "Thulinyl",
        description:
        "Decreases pickaxe delay by 0.01s and mine time of ores by 0.05s",
    },
    {
        name: "Impervium Ring",
        ore: "Impervium",
        description: "Increases mining power by 15%",
    },
    {
        name: "Periglise Bracelet",
        ore: "Periglise",
        description: "Decreases pickaxe delay by 15%",
    },
    {
        name: "Isoronil Necklace",
        ore: "Isoronil",
        description: "55% chance to double and 45% chance to void a mined ore",
    },
    {
        name: "Noise Necklace",
        ore: "Noise",
        description:
        "Spawns cave only ores at 1/7th their normal rate, outside caves. Does not stack with Noise Pickaxe",
    },
    {
        name: "Solar Necklace",
        ore: "Solarium",
        description: "2.5% to double a mined ore",
    },
    {
        name: "Unobtainium Necklace",
        ore: "Unobtainium",
        description: "Ores with under 5s of mine time will be mined 30% faster",
    },
    {
        name: "Perilium Necklace",
        ore: "Perilium",
        description: "Ores with over 2.5s of mine time will be mined 20% faster",
    },
    {
        name: "Ichor Band",
        ore: "Ichor",
        description: "Spawning Growths from mining Cytosol will be 10x rarer, Growths and Eruptors will drop 1 extra ore",
    },
    {
        name: "Bismuth Bracelet",
        ore: "Bismuth",
        description: "Increases health regeneration by 2x",
    },
    {
        name: "Red Diamond Ring",
        ore: "Red Diamond",
        description: "Increases number of Red Diamonds obtained per ore by 2",
    },
    {
        name: "Polarflare Necklace",
        ore: "Polarveril",
        description: "You are immune to extreme temperatures. Increases walkspeed in layers with extreme temperatures",
    },
    {
        name: "Ambrosine Band",
        ore: "Ambrosine",
        description: "Increases XP yield from ores by 15%",
    },
    {
        name: "Starlite Bracelet",
        ore: "Starlite",
        description: "Increases critical hit strength by 20%",
    },
    {
        name: "Zynulvinite Band",
        ore: "Zynulvinite",
        description: "Eliminates radiation damage from ores. 2nd ability not found... GIVE",
    },
    {
        name: "Oblivion Band",
        ore: "Obliviril",
        description:
        "User is immune to the effects of gravity-warping ores (e.g. Graviton)",
    },
    {
        name: "Pearl Necklace",
        ore: "Pearl",
        description: "Damaging liquids have 75% less effect on the player",
    },
    {
        name: "Boom Bracelet",
        ore: "Nitrolyte",
        description: "Allows the player to obtain Nitrolyte",
    },
    {
        name: "Blast Bracelet",
        ore: "Vitriolyte",
        description: "Allows the player to safely obtain Vitriolyte and Nitrolyte",
    },
    {
        name: "Auroral Ring",
        ore: "Aurorum",
        description: "Increases jump power by 22",
    },
    {
        name: "Astral Ring",
        ore: "Astratine",
        description: "Increases jump power by 15",
    },
    {
        name: "Lunar Ring",
        ore: "Moonstone",
        description: "Increases jump power by 10",
    },
    {
        name: "Neutronium Necklace",
        ore: "Neutronium",
        description:
        "The higher delay your pickaxe has, the more power bonus this necklace gives (0.01 delay -> +1% mining speed)",
    },
    {
        name: "Gilded Ultranium Band",
        ore: "Ultranium",
        description: "Increases walkspeed by 7",
    },
    {
        name: "Tachyon Band",
        ore: "Tachyon",
        description: "Increases walkspeed by 5",
    },
    {
        name: "Quicksilver Band",
        ore: "Quicksilver",
        description: "Increases walkspeed by 3",
    },
    {
        name: "Kyanite Ring",
        ore: "Kyanite",
        description: "Increases inventory space by 27%",
    },
    {
        name: "Emerald Necklace",
        ore: "Emerald",
        description:
        "Mining a basic gem has a 25% chance to give you another random gem",
    },
    {
        name: "Sunstone Ring",
        ore: "Sunstone",
        description: "The player emits a medium amount of light",
    },
    {
        name: "Platinum Ring",
        ore: "Platinum",
        description: "You mine all metals 10% faster",
    },
    {
        name: "Cursed Necklace",
        ore: "Amethyst",
        description:
        "Ores will give 0 XP, but there is a 1/9 chance for XP to instead be 10x the normal amount. Also works on super-rare ores",
    },
    {
        name: "Jasper Ring",
        ore: "Jasper",
        description: "The player does not set off thermal vents (Cave hazard)",
    },
];

export default charmPerks;
