/* ZTT | John_Sypher's value dictionary
  - Categorized into layers
  - Each layer contains all its ores
  - Each ore contains its name, base value (ore per AV), and color template gradient
*/

// Dictionaries for John and NAN values
export const johnValsDict = {
  Rares: [
    { name: "Ambrosine", baseValue: 1.0 },
    { name: "Universallium", baseValue: 0.1 },
    { name: "Neutrine", baseValue: 0.01 },
    { name: "Torn Fabric", baseValue: 0.002 },
    { name: "Singularity", baseValue: 0.001 },
    { name: "Egg", baseValue: 0.02 },
    { name: "Cindrasil", baseValue: 1/3 },
    { name: "Zynulvinite", baseValue: 1.0 },
    { name: "Element V", baseValue: 0.2 },
    { name: "Neutrino", baseValue: 1.0 },
    { name: "Malbrane", baseValue: 1.0 },
    { name: "Dystranum", baseValue: 1/15 },
    { name: "Ectokelyte", baseValue: 1/3 },
    { name: "Havicron", baseValue: 0.1 },
    { name: "Rhylazil", baseValue: 0.02 },
    { name: "Ubriniale", baseValue: 0.01 },
    { name: "Nyrvinoris", baseValue: 1.0 },
    { name: "Unobtainium", baseValue: 1.0 }
  ],

  Uniques: [
    { name: "Vicious Shard", baseValue: 1/180 },
    { name: "Jalabono", baseValue: 1.0 },
    { name: "Hollevite", baseValue: 1.0 },
    { name: "Verglazium", baseValue: 2.0 },
    { name: "Meteorite", baseValue: 2.0 },
    { name: "Panolethrium", baseValue: 1.0 },
    { name: "Astathian", baseValue: 0.5 },
    { name: "Sunstone", baseValue: 5.0 },
    { name: "Amber", baseValue: 2.0 },
    { name: "Chalcedony", baseValue: 2.5 },
    { name: "Onyx", baseValue: 2.5 }
  ],

  Compounds: [
    { name: "Equilibrium", baseValue: 4.5 },
    { name: "Quark Matter", baseValue: 2.5 },
    { name: "Periglise", baseValue: 2.5 },
    { name: "Isoronil", baseValue: 1 }
  ],

  "Surface / Shallow": [
    { name: "Stone", baseValue: 2000 },
    { name: "Coal", baseValue: 150 },
    { name: "Moonstone", baseValue: 4 },
    { name: "Kyanite", baseValue: 6 },
    { name: "Topaz", baseValue: 2 },
    { name: "Opal", baseValue: 5 },
    { name: "Aluminum", baseValue: 150 },
    { name: "Copper", baseValue: 300 },
    { name: "Iron", baseValue: 150 },
    { name: "Sulfur", baseValue: 75 },
    { name: "Silver", baseValue: 75 },
    { name: "Zinc", baseValue: 75 },
    { name: "Gold", baseValue: 18 },
    { name: "Chlorophyte", baseValue: 9 },
    { name: "Sapphire", baseValue: 10 }
  ],

  "Caverns / Dusk": [
    { name: "Ruby", baseValue: 11 },
    { name: "Emerald", baseValue: 24 },
    { name: "Peridot", baseValue: 6 },
    { name: "Amethyst", baseValue: 4 },
    { name: "Thallium", baseValue: 7 },
    { name: "Tungsten", baseValue: 7 },
    { name: "Diamond", baseValue: 10 },
    { name: "Garnet", baseValue: 7 },
    { name: "Platinum", baseValue: 9 },
    { name: "Malachite", baseValue: 4.5 },
    { name: "Lithium", baseValue: 8 },
    { name: "Boron", baseValue: 75 }
  ],

  Volatile: [
    { name: "Boomite", baseValue: 30 },
    { name: "Titanium", baseValue: 8 },
    { name: "Plutonium", baseValue: 10 },
    { name: "Technetium", baseValue: 11 },
    { name: "Uranium", baseValue: 14 },
    { name: "Caesium", baseValue: 9 },
    { name: "Osmium", baseValue: 10 },
    { name: "Hematite", baseValue: 117.5 }
  ],

  "Mystic / Inbetween": [
    { name: "Rose Quartz", baseValue: 8 },
    { name: "Rainbonite", baseValue: 2.5 },
    { name: "Barium", baseValue: 6.5 },
    { name: "Chrysoprase", baseValue: 10 },
    { name: "Soul Crystal", baseValue: 15 },
    { name: "Cobalt", baseValue: 7 },
    { name: "Lapis", baseValue: 7 },
    { name: "Bismuth", baseValue: 9 },
    { name: "Demonite", baseValue: 5.5 },
    { name: "Mithril", baseValue: 3.5 }
  ],

  "Igneous / Mantle": [
    { name: "Vanadium", baseValue: 4 },
    { name: "Dragonglass", baseValue: 45 },
    { name: "Carnelian", baseValue: 22.5 },
    { name: "Magmium", baseValue: 13 },
    { name: "Firecrystal", baseValue: 12 },
    { name: "Magnesium", baseValue: 11 },
    { name: "Hellstone", baseValue: 24 },
    { name: "Jasper", baseValue: 8.5 },
    { name: "Mantle Fragment", baseValue: 14 },
    { name: "Gargantium", baseValue: 12 }
  ],

  "Irradiated / Caustic": [
    { name: "Toxirock", baseValue: 500 },
    { name: "Radium", baseValue: 10 },
    { name: "Tellurium", baseValue: 8 },
    { name: "Newtonium", baseValue: 31 },
    { name: "Yunium", baseValue: 8 },
    { name: "Thorium", baseValue: 14 },
    { name: "Lead", baseValue: 92.5 },
    { name: "Blastium", baseValue: 16 },
    { name: "Coronium", baseValue: 40 },
    { name: "Tritium", baseValue: 4.5 },
    { name: "Polonium", baseValue: 4 }
  ],

  Mirage: [
    { name: "Frightstone", baseValue: 40 },
    { name: "Stellarite", baseValue: 4.5 },
    { name: "Prismaline", baseValue: 4 },
    { name: "Antimatter", baseValue: 12 },
    { name: "Constellatium", baseValue: 5.5 },
    { name: "Stratocrit", baseValue: 6 },
    { name: "Dark Matter", baseValue: 10 }
  ],

  Gloom: [
    { name: "Crimstone", baseValue: 70.5 },
    { name: "Horrorstone", baseValue: 11 },
    { name: "Strange Matter", baseValue: 6 },
    { name: "Vermillium", baseValue: 9 },
    { name: "Magnetite", baseValue: 4 },
    { name: "Iridium", baseValue: 1600 },
    { name: "Surrenderock", baseValue: 1250 }
  ],

  Void: [
    { name: "Vantaslate", baseValue: 900 },
    { name: "Cometite", baseValue: 7 },
    { name: "Adamantite", baseValue: 3 },
    { name: "Eclipsium", baseValue: 6 },
    { name: "Ebonakite", baseValue: 10 },
    { name: "Palladium", baseValue: 6.5 },
    { name: "Neptunium", baseValue: 5 },
    { name: "Void Orb", baseValue: 7 },
    { name: "Nilidust", baseValue: 6.5 },
    { name: "Asthenocrit", baseValue: 6.5 }
  ],

  Grayscale: [
    { name: "Gallium", baseValue: 60 },
    { name: "Amnesite", baseValue: 18 },
    { name: "Shadow Quartz", baseValue: 4 },
    { name: "Glowstone", baseValue: 3.5 },
    { name: "Graphene", baseValue: 6 },
    { name: "Quicksilver", baseValue: 8 },
    { name: "Gray Matter", baseValue: 5.5 }
  ],

  "Achrothesi / Whitespace": [
    { name: "Cadmium", baseValue: 12 },
    { name: "Chromium", baseValue: 9 },
    { name: "Null", baseValue: 8 },
    { name: "Geometrium", baseValue: 3.5 },
    { name: "Noise", baseValue: 4 },
    { name: "Inversium", baseValue: 3.5 },
    { name: "Navitalc", baseValue: 8 },
    { name: "Myriroule", baseValue: 5.5 },
    { name: "Argibar", baseValue: 4.5 },
    { name: "Perilium", baseValue: 2 }
  ],

  Frigid: [
    { name: "Blue Ice", baseValue: 10 },
    { name: "Frostarium", baseValue: 10 },
    { name: "Anetrium", baseValue: 13.5 },
    { name: "Polarveril", baseValue: 2 },
    { name: "Cryonine", baseValue: 3.5 },
    { name: "Soimabarium", baseValue: 8 }
  ],

  Marine: [
    { name: "Nerolin", baseValue: 12.5 },
    { name: "Tenebris", baseValue: 8 },
    { name: "Yilantibris", baseValue: 6 },
    { name: "Aquamarine", baseValue: 12 },
    { name: "Hydrolyth", baseValue: 8 },
    { name: "Naquadah", baseValue: 10 },
    { name: "Pearl", baseValue: 6 },
    { name: "Eidoliphyll", baseValue: 2 }
  ],

  Cosmic: [
    { name: "Cosmic Glass", baseValue: 17.5 },
    { name: "Cosmaline", baseValue: 10 },
    { name: "Astratine", baseValue: 6 },
    { name: "Starsteel", baseValue: 8 },
    { name: "Stardust", baseValue: 6 },
    { name: "Endotravine", baseValue: 7 }
  ],

  Molten: [
    { name: "Nickel", baseValue: 48 },
    { name: "Molten Iron", baseValue: 15.5 },
    { name: "Corium", baseValue: 9 },
    { name: "Cinnabar", baseValue: 16 },
    { name: "Liquid Gold", baseValue: 16 },
    { name: "Pyroscorium", baseValue: 9 },
    { name: "Samarium", baseValue: 16 }
  ],

  Serenity: [
    { name: "Bedrock", baseValue: 2000 },
    { name: "Jade", baseValue: 5 },
    { name: "Redsteel", baseValue: 5 },
    { name: "Celesteel", baseValue: 4 },
    { name: "Cryoplasm", baseValue: 4 },
    { name: "Andrium", baseValue: 8 },
    { name: "Neutronium", baseValue: 8 },
    { name: "Shadowspec", baseValue: 2 },
    { name: "Spiralium", baseValue: 2.5 },
    { name: "Frozen Nitrogen", baseValue: 11 },
    { name: "Orichalican", baseValue: 8 },
    { name: "Scorched Bedrock", baseValue: 2000 }
  ],

  "Plasma Field": [
    { name: "Plasma", baseValue: 2000 },
    { name: "Pyroplasm", baseValue: 5.5 },
    { name: "Crystalline Plasma", baseValue: 18.5 },
    { name: "Electrium", baseValue: 6 },
    { name: "Infernilus", baseValue: 7.5 },
    { name: "Convectine", baseValue: 10 },
    { name: "Protonium", baseValue: 9 },
    { name: "Galvanium", baseValue: 6 },
    { name: "Ferozium", baseValue: 2000 }
  ],

  Quantum: [
    { name: "Gluonium", baseValue: 2.5 },
    { name: "Up Quark", baseValue: 20 },
    { name: "Down Quark", baseValue: 24 },
    { name: "Positron", baseValue: 30 },
    { name: "Supermatter", baseValue: 13.5 },
    { name: "Charm Quark", baseValue: 10 },
    { name: "Top Quark", baseValue: 15 },
    { name: "Bottom Quark", baseValue: 15 },
    { name: "Strange Quark", baseValue: 10 },
    { name: "Crystal Photon", baseValue: 10 },
    { name: "Photalizine", baseValue: 7 }
  ],

  Stability: [
    { name: "Universal Barrier", baseValue: 2000 },
    { name: "Rifted Barrier", baseValue: 6 },
    { name: "Fabric", baseValue: 7 },
    { name: "Mavrikine", baseValue: 6 },
    { name: "Irulisteel", baseValue: 2 }
  ],

  Planck: [
    { name: "String", baseValue: 16 },
    { name: "Hadronil", baseValue: 8 },
    { name: "Axion", baseValue: 13.5 },
    { name: "Graviton", baseValue: 11 },
    { name: "Mesonyte", baseValue: 9 },
    { name: "Tachyon", baseValue: 6.5 },
    { name: "Desmentinum", baseValue: 10 }
  ],

  "Conversion/Disarray/Breakage/Criticality": [
    { name: "Ailmentin", baseValue: 750 },
    { name: "Territane", baseValue: 15 },
    { name: "Sinfurmium", baseValue: 10 },
    { name: "Gyrivarium", baseValue: 8 },
    { name: "Krazmite", baseValue: 7 },
    { name: "Tendrock", baseValue: 2000 },
    { name: "Dark Energy", baseValue: 8 },
    { name: "Corrodoil", baseValue: 30.5 },
    { name: "Antireal", baseValue: 5 },
    { name: "Hyperium", baseValue: 9 },
    { name: "Thermisine", baseValue: 14 },
    { name: "Alkanite", baseValue: 2000 }
  ],

  "Grim 1 / Hive / Grim 2": [
    { name: "Grimstone", baseValue: 2000 },
    { name: "Phosphyll", baseValue: 44.5 },
    { name: "Vrimsten", baseValue: 36.5 },
    { name: "Zilithorus", baseValue: 20 },
    { name: "Rimrock", baseValue: 8 },
    { name: "Korundum", baseValue: 50 },
    { name: "Cytosol", baseValue: 750 },
    { name: "Ichor", baseValue: 8.5 },
    { name: "Centriale", baseValue: 11.5 },
    { name: "Neuroplast", baseValue: 16.5 },
    { name: "Trinasine", baseValue: 9 },
    { name: "Adrenilar", baseValue: 7 },
    { name: "Macusmite", baseValue: 22 }
  ],

  Murk: [
    { name: "Leptonyte", baseValue: 15 },
    { name: "Mezihyrium", baseValue: 9 },
    { name: "Taynalum", baseValue: 10 },
    { name: "Thulinyl", baseValue: 2 }
  ],

  "Event Horizon": [
    { name: "Solarium", baseValue: 29.5 },
    { name: "Exotic Matter", baseValue: 41.5 },
    { name: "Nebulinite", baseValue: 11.5 },
    { name: "Arkivyll", baseValue: 12 },
    { name: "Chronon", baseValue: 11 },
    { name: "Aurorum", baseValue: 24.5 },
    { name: "Korenil", baseValue: 12 },
    { name: "Stellar Sediment", baseValue: 2000 },
    { name: "Apiastrine", baseValue: 18 }
  ],

  Abyss: [
    { name: "Abyssal Sludge", baseValue: 16 },
    { name: "Primordian", baseValue: 10.5 },
    { name: "Cosmodium", baseValue: 4.5 },
    { name: "Hexflame", baseValue: 10 },
    { name: "Tetraquark", baseValue: 9.5 },
    { name: "Mauraline", baseValue: 10 }
  ],

  "Inner Horizon": [
    { name: "Nihinoris", baseValue: 13.5 },
    { name: "Infrarian", baseValue: 4.5 },
    { name: "Ultranium", baseValue: 7 },
    { name: "Auricallium", baseValue: 9 },
    { name: "Zeronian", baseValue: 4.5 },
    { name: "Exodian", baseValue: 9 }
  ],

  Quintessence: [
    { name: "Aetherice", baseValue: 8 },
    { name: "Starniferus", baseValue: 11 },
    { name: "Ethanerite", baseValue: 11 },
    { name: "Lumenyl", baseValue: 11 },
    { name: "Impervium", baseValue: 19.5 },
    { name: "Kryposilus", baseValue: 7 },
    { name: "Vythusilyte", baseValue: 9 }
  ],

  Interstice: [
    { name: "Nethrastine", baseValue: 200 },
    { name: "Formicite", baseValue: 8 },
    { name: "Raw Energy", baseValue: 15 },
    { name: "Obliviril", baseValue: 5.5 },
    { name: "Enceladrum", baseValue: 9 }
  ],

  Empyrean: [
    { name: "Evrasalt", baseValue: 200 },
    { name: "Qylicryst", baseValue: 5 },
    { name: "Kafsium", baseValue: 16 },
    { name: "Zetaslime", baseValue: 15.5 },
    { name: "Ochistrite", baseValue: 19.5 },
    { name: "Reithum", baseValue: 6 },
    { name: "Vorazylith", baseValue: 7.5 },
    { name: "Truth Quark", baseValue: 8.5 },
    { name: "Wish Alloy", baseValue: 13 },
    { name: "Phantasmorite", baseValue: 8.5 },
    { name: "Profelis", baseValue: 11.5 },
    { name: "Ogleum", baseValue: 7 },
    { name: "Protireal", baseValue: 20 },
    { name: "Xerutherum", baseValue: 7.5 },
    { name: "Mesmirian", baseValue: 13 }
  ]
};