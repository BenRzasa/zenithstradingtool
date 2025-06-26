/* ZTT | Ore value dictionary
  - Categorized into layers
  - Each layer contains all its ores
  - Each ore contains its name, base value (ore per AV)
*/

// Dictionary for ore values. Contains entries for layers and ore values:
// - Zenith's
// - NAN's
// - John's
export const initialOreValsDict = {
  "True Rares\n1/25000 or Rarer": [
    { name: "Universallium", zenithVal: 0.1, johnVal: 0.1, nanVal: 0.1, customVal: 0.1 },
    { name: "Neutrine", zenithVal: 0.01, johnVal: 0.01, nanVal: 0.01, customVal: 0.01 },
    { name: "Torn Fabric", zenithVal: 0.002, johnVal: 0.002, nanVal: 0.002, customVal: 0.002 },
    { name: "Singularity", zenithVal: 0.001, johnVal: 0.001, nanVal: 0.001, customVal: 0.001 },
    { name: "Egg", zenithVal: 0.02, johnVal: 0.02, nanVal: 0.02, customVal: 0.02 },
    { name: "Violecil", zenithVal: 0.2, johnVal: 0.2, nanVal: 0.2, customVal: 0.2 },
    { name: "Dystranum", zenithVal: 1/15, johnVal: 1/15, nanVal: 1/15, customVal: 1/15 },
    { name: "Havicron", zenithVal: 0.1, johnVal: 0.1, nanVal: 0.1, customVal: 0.1 },
    { name: "Rhylazil", zenithVal: 1/60, johnVal: 0.02, nanVal: 0.02, customVal: 0.02 },
    { name: "Ubriniale", zenithVal: 1/125, johnVal: 0.01, nanVal: 0.01, customVal: 0.01 },
  ],

  "Rares\nMore Common Than 1/24999": [
    { name: "Ambrosine", zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
    { name: "Zynulvinite", zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
    { name: "Cindrasil", zenithVal: 1/3, johnVal: 1/3, nanVal: 1/3, customVal: 1/3 },
    { name: "Neutrino", zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
    { name: "Malbrane", zenithVal: 1, johnVal: 1, nanVal: 1, customVal: 1 },
    { name: "Ectokelyte", zenithVal: 1/3, johnVal: 1/3, nanVal: 1/3, customVal: 1/3 },
  ],

  "Uniques\nNon-Standard Obtainment": [
    { name: "Vicious Shard", zenithVal: 1/180, johnVal: 1/180, nanVal: 1/180, customVal: 1/180 },
    { name: "Jalabono", zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
    { name: "Hollevite", zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
    { name: "Verglazium", zenithVal: 2.0, johnVal: 2.0, nanVal: 2.0, customVal: 2.0 },
    { name: "Meteorite", zenithVal: 2.0, johnVal: 2.0, nanVal: 2.0, customVal: 2.0 },
    { name: "Panolethrium", zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
    { name: "Astathian", zenithVal: 0.5, johnVal: 0.5, nanVal: 0.5, customVal: 0.5 },
    { name: "Sunstone", zenithVal: 5.0, johnVal: 5.0, nanVal: 5.0, customVal: 5.0 },
    { name: "Amber", zenithVal: 2.0, johnVal: 2.0, nanVal: 2.0, customVal: 2.0 },
    { name: "Chalcedony", zenithVal: 2.5, johnVal: 2.5, nanVal: 2.5, customVal: 2.5 },
    { name: "Onyx", zenithVal: 2.5, johnVal: 2.5, nanVal: 2.5, customVal: 2.5}
  ],

  "Compounds\nCrafted via Synthesis": [
    { name: "Equilibrium", zenithVal: 4.5, johnVal: 4.5, nanVal: 2.5, customVal: 4 },
    { name: "Quark Matter", zenithVal: 2.5, johnVal: 2.5, nanVal: 2, customVal: 2 },
    { name: "Periglise", zenithVal: 2.5, johnVal: 2.5, nanVal: 2, customVal: 2 },
    { name: "Isoronil", zenithVal: 1, johnVal: 1, nanVal: 1, customVal: 1}
  ],

  "Surface / Shallow\n[0m-74m]": [
    { name: "Stone", zenithVal: 2000, johnVal: 2000, nanVal: 2000, customVal: 2000 },
    { name: "Coal", zenithVal: 300, johnVal: 150, nanVal: 300, customVal: 300 },
    { name: "Moonstone", zenithVal: 4, johnVal: 4, nanVal: 3, customVal: 4 },
    { name: "Kyanite", zenithVal: 6, johnVal: 6, nanVal: 6, customVal: 6 },
    { name: "Topaz", zenithVal: 2.5, johnVal: 2, nanVal: 3, customVal: 2.5 },
    { name: "Opal", zenithVal: 5.5, johnVal: 5, nanVal: 5, customVal: 5.5 },
    { name: "Aluminum", zenithVal: 200, johnVal: 150, nanVal: 200, customVal: 200 },
    { name: "Copper", zenithVal: 300, johnVal: 300, nanVal: 250, customVal: 300 },
    { name: "Iron", zenithVal: 250, johnVal: 150, nanVal: 250, customVal: 250 },
    { name: "Sulfur", zenithVal: 200, johnVal: 75, nanVal: 200, customVal: 200 },
    { name: "Silver", zenithVal: 200, johnVal: 75, nanVal: 200, customVal: 200 },
    { name: "Zinc", zenithVal: 100, johnVal: 75, nanVal: 100, customVal: 100 },
    { name: "Gold", zenithVal: 18, johnVal: 18, nanVal: 20, customVal: 18 },
    { name: "Sapphire", zenithVal: 10.5, johnVal: 10, nanVal: 10, customVal: 10.5}
  ],

  "Caverns / Dusk\n[75m-299m | 300m-599m]": 
  [
    { name: "Ruby", zenithVal: 11.5, johnVal: 11, nanVal: 10, customVal: 11.5 },
    { name: "Emerald", zenithVal: 23, johnVal: 24, nanVal: 25, customVal: 23 },
    { name: "Peridot", zenithVal: 7.5, johnVal: 6, nanVal: 6, customVal: 6 },
    { name: "Amethyst", zenithVal: 4, johnVal: 4, nanVal: 6, customVal: 4 },
    { name: "Thallium", zenithVal: 7, johnVal: 7, nanVal: 6, customVal: 7 },
    { name: "Tungsten", zenithVal: 8, johnVal: 7, nanVal: 8, customVal: 8 },
    { name: "Diamond", zenithVal: 12, johnVal: 10, nanVal: 10, customVal: 12 },
    { name: "Garnet", zenithVal: 7.5, johnVal: 7, nanVal: 8, customVal: 7 },
    { name: "Platinum", zenithVal: 9, johnVal: 9, nanVal: 12, customVal: 9 },
    { name: "Malachite", zenithVal: 4.5, johnVal: 4.5, nanVal: 6, customVal: 4.5 },
    { name: "Lithium", zenithVal: 10, johnVal: 8, nanVal: 7, customVal: 10 },
    { name: "Boron", zenithVal: 75, johnVal: 75, nanVal: 80, customVal: 75}
  ],

  "Volatile\n[600m-999m]": [
    { name: "Shale", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
    { name: "Boomite", zenithVal: 31.5, johnVal: 30, nanVal: 20, customVal: 30 },
    { name: "Titanium", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
    { name: "Plutonium", zenithVal: 12, johnVal: 10, nanVal: 12, customVal: 12 },
    { name: "Technetium", zenithVal: 7.5, johnVal: 11, nanVal: 10, customVal: 10 },
    { name: "Uranium", zenithVal: 14, johnVal: 14, nanVal: 10, customVal: 14 },
    { name: "Caesium", zenithVal: 9, johnVal: 9, nanVal: 8, customVal: 9 },
    { name: "Osmium", zenithVal: 9, johnVal: 10, nanVal: 9, customVal: 9 },
    { name: "Hematite", zenithVal: 62, johnVal: 117.5, nanVal: 90, customVal: 62}
  ],

  "Mystic / Inbetween\n[1000m-1499m | 1500m-1999m]": [
    { name: "Calcite", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
    { name: "Rose Quartz", zenithVal: 8.5, johnVal: 8, nanVal: 7, customVal: 8.5 },
    { name: "Rainbonite", zenithVal: 4, johnVal: 2.5, nanVal: 4, customVal: 4 },
    { name: "Chrysoprase", zenithVal: 10.5, johnVal: 10, nanVal: 10, customVal: 10.5 },
    { name: "Soul Crystal", zenithVal: 16, johnVal: 15, nanVal: 15, customVal: 16 },
    { name: "Cobalt", zenithVal: 7.5, johnVal: 7, nanVal: 10, customVal: 7.5 },
    { name: "Lapis", zenithVal: 7.5, johnVal: 7, nanVal: 8, customVal: 7.5 },
    { name: "Bismuth", zenithVal: 9.5, johnVal: 9, nanVal: 9, customVal: 9.5 },
    { name: "Demonite", zenithVal: 5.5, johnVal: 5.5, nanVal: 6, customVal: 5.5 },
    { name: "Mithril", zenithVal: 4, johnVal: 3.5, nanVal: 4, customVal: 4}
  ],

  "Igneous / Mantle\n[2000m-2499m | 2500m-2999m]": [
    { name: "Vanadium", zenithVal: 4.5, johnVal: 4, nanVal: 6, customVal: 4.5 },
    { name: "Dragonglass", zenithVal: 45, johnVal: 45, nanVal: 35, customVal: 45 },
    { name: "Carnelian", zenithVal: 22.5, johnVal: 22.5, nanVal: 20, customVal: 22.5 },
    { name: "Magmium", zenithVal: 14, johnVal: 13, nanVal: 13, customVal: 14 },
    { name: "Firecrystal", zenithVal: 12, johnVal: 12, nanVal: 12, customVal: 12 },
    { name: "Magnesium", zenithVal: 11, johnVal: 11, nanVal: 10, customVal: 11 },
    { name: "Hellstone", zenithVal: 20, johnVal: 24, nanVal: 22, customVal: 20 },
    { name: "Jasper", zenithVal: 8, johnVal: 8.5, nanVal: 8, customVal: 8 },
    { name: "Mantle Fragment", zenithVal: 14, johnVal: 14, nanVal: 15, customVal: 14 },
    { name: "Gargantium", zenithVal: 12, johnVal: 12, nanVal: 12, customVal: 12}
  ],

  "Irradiated / Caustic\n[3000m-3499m | 3500m-3999m]": [
    { name: "Toxirock", zenithVal: 500, johnVal: 1000, nanVal: 500, customVal: 500 },
    { name: "Radium", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10 },
    { name: "Tellurium", zenithVal: 8, johnVal: 8, nanVal: 7, customVal: 8 },
    { name: "Newtonium", zenithVal: 30, johnVal: 31, nanVal: 25, customVal: 30 },
    { name: "Yunium", zenithVal: 8, johnVal: 8, nanVal: 10, customVal: 8 },
    { name: "Thorium", zenithVal: 14, johnVal: 14, nanVal: 12, customVal: 14 },
    { name: "Lead", zenithVal: 90, johnVal: 92.5, nanVal: 80, customVal: 90 },
    { name: "Blastium", zenithVal: 16, johnVal: 16, nanVal: 10, customVal: 16 },
    { name: "Coronium", zenithVal: 30, johnVal: 40, nanVal: 25, customVal: 30 },
    { name: "Tritium", zenithVal: 4, johnVal: 4.5, nanVal: 4, customVal: 4 },
    { name: "Polonium", zenithVal: 4, johnVal: 4, nanVal: 4, customVal: 4}
  ],

  "Mirage\n[4000m-4499m]": [
    { name: "Altoplast", zenithVal: 40, johnVal: 40, nanVal: 40, customVal: 40 },
    { name: "Illusinium", zenithVal: 40, johnVal: 40, nanVal: 40, customVal: 40 },
    { name: "Starlite", zenithVal: 10, johnVal: 4.5, nanVal: 12, customVal: 4 },
    { name: "Prismaline", zenithVal: 4, johnVal: 4, nanVal: 4, customVal: 4 },
    { name: "Miramire", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 5 },
    { name: "Stratocrit", zenithVal: 6, johnVal: 6, nanVal: 5, customVal: 6 },
    { name: "Tantalum", zenithVal: 4, johnVal: 4, nanVal: 4, customval: 4 },
  ],

  "Dread\n[4500m-4999m]": [
    { name: "Nightmica", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
    { name: "Crimstone", zenithVal: 65, johnVal: 70.5, nanVal: 500, customVal: 65 },
    { name: "Horrorstone", zenithVal: 10, johnVal: 11, nanVal: 10, customVal: 10 },
    { name: "Strange Matter", zenithVal: 6, johnVal: 6, nanVal: 7, customVal: 6 },
    { name: "Vermillium", zenithVal: 9, johnVal: 9, nanVal: 7, customVal: 9 },
    { name: "Magnetite", zenithVal: 4, johnVal: 4, nanVal: 7, customVal: 4 },
    { name: "Dark Matter", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10 },
    { name: "Antimatter", zenithVal: 5, johnVal: 12, nanVal: 4, customVal: 12 },
    { name: "Surrenderock", zenithVal: 625, johnVal: 1250, nanVal: 500, customVal: 625},
    { name: "Iridium", zenithVal: 800, johnVal: 1600, nanVal: 500, customVal: 800 },
  ],

  "Void\n[5000-5499m]": [
    { name: "Vantaslate", zenithVal: 450, johnVal: 900, nanVal: 500, customVal: 450 },
    { name: "Cometite", zenithVal: 7, johnVal: 7, nanVal: 8, customVal: 7 },
    { name: "Adamantite", zenithVal: 3, johnVal: 3, nanVal: 3, customVal: 3 },
    { name: "Eclipsium", zenithVal: 6, johnVal: 6, nanVal: 7, customVal: 6 },
    { name: "Ebonakite", zenithVal: 10, johnVal: 10, nanVal: 8, customVal: 10 },
    { name: "Palladium", zenithVal: 8, johnVal: 6.5, nanVal: 7, customVal: 8 },
    { name: "Neptunium", zenithVal: 7, johnVal: 5, nanVal: 6, customVal: 7 },
    { name: "Void Orb", zenithVal: 8, johnVal: 7, nanVal: 8, customVal: 8 },
    { name: "Nilidust", zenithVal: 8, johnVal: 6.5, nanVal: 8, customVal: 8 },
    { name: "Asthenocrit", zenithVal: 6, johnVal: 6.5, nanVal: 6, customVal: 6}
  ],

  "Achrothesi / Whitespace\n[5500-5999m]": [
    { name: "Kronosilt", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
    { name: "Nilglass", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
    { name: "Kreosyte", zenithVal: 6, johnVal: 8, nanVal: 6, customVal: 6 },
    { name: "Cadmium", zenithVal: 15, johnVal: 12, nanVal: 15, customVal: 15 },
    { name: "Chromium", zenithVal: 15, johnVal: 9, nanVal: 15, customVal: 15 },
    { name: "Null", zenithVal: 16, johnVal: 8, nanVal: 16, customVal: 16 },
    { name: "Geometrium", zenithVal: 7, johnVal: 3.5, nanVal: 7, customVal: 7 },
    { name: "Noise", zenithVal: 4, johnVal: 4, nanVal: 4, customVal: 4 },
    { name: "Inversium", zenithVal: 6, johnVal: 3.5, nanVal: 6, customVal: 6 },
    { name: "Navitalc", zenithVal: 10, johnVal: 8, nanVal: 10, customVal: 10 },
    { name: "Myriroule", zenithVal: 7, johnVal: 5.5, nanVal: 7, customVal: 7 },
    { name: "Argibar", zenithVal: 8, johnVal: 4.5, nanVal: 8, customVal: 8 },
    { name: "Perilium", zenithVal: 2, johnVal: 2, nanVal: 2, customVal: 2}
  ],

  "Grayscale\n[6000m-6499m]": [
    { name: "Gallium", zenithVal: 15, johnVal: 60, nanVal: 15, customVal: 15 },
    { name: "Amnesite", zenithVal: 16, johnVal: 18, nanVal: 15, customVal: 16 },
    { name: "Shadow Quartz", zenithVal: 4, johnVal: 4, nanVal: 4, customVal: 4 },
    { name: "Glowstone", zenithVal: 3, johnVal: 3.5, nanVal: 3, customVal: 3 },
    { name: "Graphene", zenithVal: 6, johnVal: 6, nanVal: 5, customVal: 6 },
    { name: "Quicksilver", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
    { name: "Gray Matter", zenithVal: 6, johnVal: 6, nanVal: 5, customVal: 6}
  ],

  "Frigid\n[6500m-6999m]": [
    { name: "Hyfrost", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
    { name: "Blue Ice", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10 },
    { name: "Frostarium", zenithVal: 10, johnVal: 10, nanVal: 12, customVal: 10 },
    { name: "Anetrium", zenithVal: 13, johnVal: 13.5, nanVal: 15, customVal: 12 },
    { name: "Polarveril", zenithVal: 2, johnVal: 2, nanVal: 2, customVal: 2 },
    { name: "Cryonine", zenithVal: 3, johnVal: 3.5, nanVal: 3, customVal: 3 },
    { name: "Soimabarium", zenithVal: 8, johnVal: 8, nanVal: 10, customVal: 8}
  ],

  "Marine\n[7000m-7499m]": [
    { name: "Nerolin", zenithVal: 12, johnVal: 12.5, nanVal: 12, customVal: 12 },
    { name: "Tenebris", zenithVal: 8, johnVal: 8, nanVal: 7, customVal: 8 },
    { name: "Yilantibris", zenithVal: 6, johnVal: 6, nanVal: 5, customVal: 6 },
    { name: "Aquamarine", zenithVal: 12, johnVal: 12, nanVal: 12, customVal: 12 },
    { name: "Hydrolyth", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
    { name: "Naquadah", zenithVal: 10, johnVal: 10, nanVal: 9, customVal: 10 },
    { name: "Pearl", zenithVal: 6, johnVal: 6, nanVal: 6, customVal: 6 },
    { name: "Eidoliphyll", zenithVal: 2, johnVal: 2, nanVal: 2, customVal: 2}
  ],

  "Cosmic\n[7500m-7999m]": [
    { name: "Cosmic Glass", zenithVal: 16, johnVal: 17.5, nanVal: 15, customVal: 16 },
    { name: "Cosmaline", zenithVal: 10, johnVal: 10, nanVal: 12, customVal: 10 },
    { name: "Astratine", zenithVal: 6, johnVal: 6, nanVal: 7, customVal: 6 },
    { name: "Starsteel", zenithVal: 8, johnVal: 8, nanVal: 7, customVal: 8 },
    { name: "Stardust", zenithVal: 6, johnVal: 6, nanVal: 5, customVal: 6 },
    { name: "Endotravine", zenithVal: 7, johnVal: 7, nanVal: 7, customVal: 7},
  ],

  "Molten\n[8000m-8499m]": [
    { name: "Nickel", zenithVal: 48, johnVal: 48, nanVal: 50, customVal: 48 },
    { name: "Molten Iron", zenithVal: 15, johnVal: 15.5, nanVal: 15, customVal: 15 },
    { name: "Corium", zenithVal: 9, johnVal: 9, nanVal: 7, customVal: 9 },
    { name: "Cinnabar", zenithVal: 12, johnVal: 16, nanVal: 12, customVal: 12 },
    { name: "Liquid Gold", zenithVal: 16, johnVal: 16, nanVal: 15, customVal: 16 },
    { name: "Pyroscorium", zenithVal: 9, johnVal: 9, nanVal: 7, customVal: 9 },
    { name: "Samarium", zenithVal: 12, johnVal: 16, nanVal: 12, customVal: 12}
  ],

  "Serenity\n[8500m-8599m]": [
    { name: "Bedrock", zenithVal: 1000, johnVal: 2000, nanVal: 500, customVal: 1000 },
    { name: "Jade", zenithVal: 5, johnVal: 5, nanVal: 5, customVal: 5 },
    { name: "Redsteel", zenithVal: 5, johnVal: 5, nanVal: 4, customVal: 5 },
    { name: "Celesteel", zenithVal: 4, johnVal: 4, nanVal: 3, customVal: 4 },
    { name: "Cryoplasm", zenithVal: 4, johnVal: 4, nanVal: 4, customVal: 4 },
    { name: "Andrium", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
    { name: "Neutronium", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
    { name: "Shadowspec", zenithVal: 2, johnVal: 2, nanVal: 2, customVal: 2 },
    { name: "Spiralium", zenithVal: 3, johnVal: 2.5, nanVal: 2, customVal: 3 },
    { name: "Frozen Nitrogen", zenithVal: 11, johnVal: 11, nanVal: 10, customVal: 11 },
    { name: "Orichalican", zenithVal: 8, johnVal: 8, nanVal: 6, customVal: 8 },
    { name: "Scorched Bedrock", zenithVal: 1000, johnVal: 2000, nanVal: 500, customVal: 1000}
  ],

  "Plasma Field\n[8600m-8999m]": [
    { name: "Plasma", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
    { name: "Pyroplasm", zenithVal: 6, johnVal: 5.5, nanVal: 4, customVal: 6 },
    { name: "Crystalline Plasma", zenithVal: 18, johnVal: 18.5, nanVal: 15, customVal: 18 },
    { name: "Electrium", zenithVal: 6, johnVal: 6, nanVal: 6, customVal: 6 },
    { name: "Infernilus", zenithVal: 8, johnVal: 7.5, nanVal: 8, customVal: 8 },
    { name: "Convectine", zenithVal: 10, johnVal: 10, nanVal: 8, customVal: 10 },
    { name: "Protonium", zenithVal: 9, johnVal: 9, nanVal: 8, customVal: 9 },
    { name: "Galvanium", zenithVal: 6, johnVal: 6, nanVal: 5, customVal: 6 },
    { name: "Ferozium", zenithVal: 1000, johnVal: 2000, nanVal: 500, customVal: 1000}
  ],

  "Quantum\n[9000m-9150m]": [
    { name: "Gluonium", zenithVal: 2.5, johnVal: 2.5, nanVal: 2, customVal: 2.5 },
    { name: "Up Quark", zenithVal: 18, johnVal: 20, nanVal: 15, customVal: 18 },
    { name: "Down Quark", zenithVal: 20, johnVal: 24, nanVal: 15, customVal: 20 },
    { name: "Positron", zenithVal: 25, johnVal: 60.5, nanVal: 15, customVal: 25 },
    { name: "Supermatter", zenithVal: 12, johnVal: 13.5, nanVal: 9, customVal: 12 },
    { name: "Charm Quark", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10 },
    { name: "Top Quark", zenithVal: 10, johnVal: 15, nanVal: 10, customVal: 10 },
    { name: "Bottom Quark", zenithVal: 12, johnVal: 15, nanVal: 10, customVal: 12 },
    { name: "Strange Quark", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10 },
    { name: "Crystal Photon", zenithVal: 10, johnVal: 10, nanVal: 11, customVal: 10 },
    { name: "Photalizine", zenithVal: 7, johnVal: 7.5, nanVal: 5, customVal: 7}
  ],

  "Stability\n[9151m-9170m]": [
    { name: "Universal Barrier", zenithVal: 1000, johnVal: 2000, nanVal: 500, customVal: 1000 },
    { name: "Rifted Barrier", zenithVal: 6, johnVal: 6, nanVal: 6, customVal: 6 },
    { name: "Fabric", zenithVal: 8, johnVal: 7, nanVal: 12, customVal: 8 },
    { name: "Mavrikine", zenithVal: 6, johnVal: 6, nanVal: 6, customVal: 6 },
    { name: "Irulisteel", zenithVal: 2, johnVal: 2, nanVal: 2, customVal: 2}
  ],

  "Planck\n[9171m-9289m]": [
    { name: "String", zenithVal: 16, johnVal: 16, nanVal: 15, customVal: 16 },
    { name: "Hadronil", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
    { name: "Axion", zenithVal: 12, johnVal: 13.5, nanVal: 10, customVal: 12 },
    { name: "Graviton", zenithVal: 11, johnVal: 11, nanVal: 9, customVal: 11 },
    { name: "Mesonyte", zenithVal: 9, johnVal: 11, nanVal: 10, customVal: 9 },
    { name: "Tachyon", zenithVal: 6, johnVal: 6.5, nanVal: 4, customVal: 6 },
    { name: "Desmentinum", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10}
  ],

  "Upper Instability\n[9290m-9999m]": [
    { name: "Ailmentin", zenithVal: 750, johnVal: 1500, nanVal: 500, customVal: 750 },
    { name: "Territane", zenithVal: 15, johnVal: 15, nanVal: 15, customVal: 15 },
    { name: "Sinfurmium", zenithVal: 10, johnVal: 10, nanVal: 8, customVal: 10 },
    { name: "Gyrivarium", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
    { name: "Krazmite", zenithVal: 7, johnVal: 7, nanVal: 8, customVal: 7 },
    { name: "Anaxinite", zenithVal: 7, johnVal: 7, nanVal: 8, customVal: 7 },
    { name: "Tendrock", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
    { name: "Dark Energy", zenithVal: 8, johnVal: 8, nanVal: 10, customVal: 8 },
    { name: "Corrodoil", zenithVal: 30, johnVal: 30.5, nanVal: 25, customVal: 30 },
    { name: "Antireal", zenithVal: 5, johnVal: 5, nanVal: 7, customVal: 5 },
    { name: "Hyperium", zenithVal: 10, johnVal: 9, nanVal: 10, customVal: 10 },
    { name: "Thermisine", zenithVal: 14, johnVal: 14, nanVal: 9, customVal: 14 },
    { name: "Alkanite", zenithVal: 1000, johnVal: 1000, nanVal: 500, customVal: 1000}
  ],

  "Lower Instability\nGrim 1 | Hive | Grim 2\n[10000m-10634m]": [
    { name: "Grimstone", zenithVal: 2000, johnVal: 2000, nanVal: 1000, customVal: 2000 },
    { name: "Phosphyll", zenithVal: 45, johnVal: 44.5, nanVal: 40, customVal: 45 },
    { name: "Vrimsten", zenithVal: 35, johnVal: 36.5, nanVal: 40, customVal: 35 },
    { name: "Zilithorus", zenithVal: 20, johnVal: 20, nanVal: 20, customVal: 20 },
    { name: "Rimrock", zenithVal: 8, johnVal: 8, nanVal: 4, customVal: 8 },
    { name: "Korundum", zenithVal: 30, johnVal: 50, nanVal: 25, customVal: 30 },
    { name: "Cytosol", zenithVal: 750, johnVal: 750, nanVal: 750, customVal: 750 },
    { name: "Ichor", zenithVal: 8, johnVal: 8.5, nanVal: 7, customVal: 8 },
    { name: "Centriale", zenithVal: 11, johnVal: 11.5, nanVal: 10, customVal: 11 },
    { name: "Neuroplast", zenithVal: 16, johnVal: 16.5, nanVal: 10, customVal: 16 },
    { name: "Trinasine", zenithVal: 9, johnVal: 9, nanVal: 7, customVal: 9 },
    { name: "Adrenilar", zenithVal: 7, johnVal: 7, nanVal: 7, customVal: 7 },
    { name: "Macusmite", zenithVal: 20, johnVal: 22, nanVal: 20, customVal: 20}
  ],

  "Murk\n[10635m-10649m]": [
    { name: "Leptonyte", zenithVal: 15, johnVal: 15, nanVal: 13, customVal: 15 },
    { name: "Mezihyrium", zenithVal: 10, johnVal: 9, nanVal: 9, customVal: 10 },
    { name: "Taynalum", zenithVal: 8, johnVal: 10, nanVal: 11, customVal: 8 },
    { name: "Thulinyl", zenithVal: 2, johnVal: 2, nanVal: 2, customVal: 2}
  ],

  "Event Horizon\n[10650m-10999m]": [
    { name: "Solarium", zenithVal: 28, johnVal: 29.5, nanVal: 20, customVal: 25 },
    { name: "Exotic Matter", zenithVal: 42, johnVal: 41.5, nanVal: 30, customVal: 45 },
    { name: "Nebulinite", zenithVal: 11, johnVal: 11.5, nanVal: 10, customVal: 11 },
    { name: "Arkivyll", zenithVal: 12, johnVal: 12, nanVal: 10, customVal: 12 },
    { name: "Chronon", zenithVal: 42, johnVal: 11, nanVal: 30, customVal: 45 },
    { name: "Aurorum", zenithVal: 24, johnVal: 24.5, nanVal: 15, customVal: 24 },
    { name: "Korenil", zenithVal: 12, johnVal: 12, nanVal: 6, customVal: 12 },
    { name: "Stellar Sediment", zenithVal: 2000, johnVal: 2000, nanVal: 1500, customVal: 2000 },
    { name: "Apiastrine", zenithVal: 18, johnVal: 18, nanVal: 15, customVal: 18}
  ],

  "Abyss\n[11000m-11349m]": [
    { name: "Abyssal Sludge", zenithVal: 16, johnVal: 16, nanVal: 12, customVal: 16 },
    { name: "Primordian", zenithVal: 25, johnVal: 10.5, nanVal: 25, customVal: 25 },
    { name: "Cosmodium", zenithVal: 4, johnVal: 4.5, nanVal: 4, customVal: 4 },
    { name: "Hexflame", zenithVal: 10, johnVal: 10, nanVal: 8, customVal: 10 },
    { name: "Tetraquark", zenithVal: 9, johnVal: 9.5, nanVal: 7, customVal: 9 },
    { name: "Mauraline", zenithVal: 10, johnVal: 10, nanVal: 8, customVal: 10}
  ],

  "Inner Horizon\n[11350m-11749m]": [
    { name: "Nihinoris", zenithVal: 13, johnVal: 13.5, nanVal: 12, customVal: 13 },
    { name: "Nyrvinoris", zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
    { name: "Infrarian", zenithVal: 5, johnVal: 4.5, nanVal: 4, customVal: 5 },
    { name: "Ultranium", zenithVal: 7, johnVal: 7, nanVal: 8, customVal: 7 },
    { name: "Auricallium", zenithVal: 10, johnVal: 9, nanVal: 9, customVal: 9 },
    { name: "Zeronian", zenithVal: 5, johnVal: 4.5, nanVal: 4, customVal: 5 },
    { name: "Exodian", zenithVal: 9, johnVal: 9, nanVal: 8, customVal: 9 },
    { name: "Unobtainium", zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
    { name: "Lattiglass", zenithVal: 60, johnVal: 80, nanVal: 80, customVal: 60 },
  ],

  "Quintessence\n[11750m-12199m]": [
    { name: "Aetherice", zenithVal: 8, johnVal: 8, nanVal: 6, customVal: 8 },
    { name: "Starniferus", zenithVal: 10, johnVal: 11, nanVal: 8, customVal: 10 },
    { name: "Ethanerite", zenithVal: 10, johnVal: 11, nanVal: 8, customVal: 10 },
    { name: "Lumenyl", zenithVal: 10, johnVal: 11, nanVal: 9, customVal: 10 },
    { name: "Impervium", zenithVal: 18, johnVal: 19.5, nanVal: 15, customVal: 18 },
    { name: "Kryposilus", zenithVal: 7, johnVal: 7, nanVal: 7, customVal: 7 },
    { name: "Vythusilyte", zenithVal: 9, johnVal: 9, nanVal: 8, customVal: 9}
  ],

  "Interstice\n[12200m-12249m]": [
    { name: "Nethrastine", zenithVal: 150, johnVal: 200, nanVal: 100, customVal: 150 },
    { name: "Formicite", zenithVal: 8.5, johnVal: 8, nanVal: 8, customVal: 8 },
    { name: "Raw Energy", zenithVal: 15.5, johnVal: 15, nanVal: 12, customVal: 15 },
    { name: "Obliviril", zenithVal: 5, johnVal: 5.5, nanVal: 5, customVal: 5 },
    { name: "Enceladrum", zenithVal: 10, johnVal: 9.5, nanVal: 7, customVal: 9}
  ],

  "Empyrean\n[12250m-12999m]": [
    { name: "Evrasalt", zenithVal: 100, johnVal: 200, nanVal: 100, customVal: 100 },
    { name: "Qylicryst", zenithVal: 6, johnVal: 5, nanVal: 3, customVal: 6 },
    { name: "Kafsium", zenithVal: 16, johnVal: 16, nanVal: 12, customVal: 16 },
    { name: "Zetaslime", zenithVal: 16, johnVal: 15.5, nanVal: 12, customVal: 16 },
    { name: "Ochistrite", zenithVal: 20, johnVal: 19.5, nanVal: 15, customVal: 20 },
    { name: "Reithum", zenithVal: 6, johnVal: 6, nanVal: 6, customVal: 6 },
    { name: "Vorazylith", zenithVal: 8, johnVal: 7.5, nanVal: 5, customVal: 8 },
    { name: "Truth Quark", zenithVal: 9, johnVal: 8.5, nanVal: 6, customVal: 9 },
    { name: "Wish Alloy", zenithVal: 14, johnVal: 13, nanVal: 7, customVal: 14 },
    { name: "Phantasmorite", zenithVal: 9, johnVal: 8.5, nanVal: 5, customVal: 9 },
    { name: "Profelis", zenithVal: 12, johnVal: 11.5, nanVal: 7, customVal: 12 },
    { name: "Ogleum", zenithVal: 7, johnVal: 7, nanVal: 4, customVal: 7 },
    { name: "Protireal", zenithVal: 16, johnVal: 20, nanVal: 14, customVal: 16 },
    { name: "Xerutherum", zenithVal: 7, johnVal: 7.5, nanVal: 4, customVal: 7 },
    { name: "Mesmirian", zenithVal: 13, johnVal: 13, nanVal: 7, customVal: 13 }
  ]
};