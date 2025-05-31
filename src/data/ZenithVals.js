/* ZTT | ZenithFlares's value dictionary
  - Categorized into layers
  - Each layer contains all its ores
  - Each ore contains its name, base value (ore per AV)
*/

// Dictionaries for John and NAN, and my values
export const zenithValsDict = {
  "True Rares": [

    { name: "Universallium", baseValue: 0.1 },
    { name: "Neutrine", baseValue: 0.01 },
    { name: "Torn Fabric", baseValue: 0.002 },
    { name: "Singularity", baseValue: 0.001 },
    { name: "Egg", baseValue: 0.02 },
    { name: "Element V", baseValue: 0.2 },
    { name: "Dystranum", baseValue: 1/15 },
    { name: "Havicron", baseValue: 0.1 },
    { name: "Rhylazil", baseValue: 0.02 },
    { name: "Ubriniale", baseValue: 0.01 },
  ],

  Rares: [
    { name: "Ambrosine", baseValue: 1.0 },
    { name: "Zynulvinite", baseValue: 1.0 },
    { name: "Cindrasil", baseValue: 1/3 },
    { name: "Neutrino", baseValue: 1.0 },
    { name: "Malbrane", baseValue: 2 },
    { name: "Ectokelyte", baseValue: 1/3 },
    { name: "Nyrvinoris", baseValue: 1.0 },
    { name: "Unobtainium", baseValue: 1.0 },
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
    { name: "Equilibrium", baseValue: 4 },
    { name: "Quark Matter", baseValue: 2 },
    { name: "Periglise", baseValue: 2 },
    { name: "Isoronil", baseValue: 1 }
  ],

  "Surface / Shallow": [
    { name: "Stone", baseValue: 2000 },
    { name: "Coal", baseValue: 150 },
    { name: "Moonstone", baseValue: 4 },
    { name: "Kyanite", baseValue: 6 },
    { name: "Topaz", baseValue: 3 },
    { name: "Opal", baseValue: 5 },
    { name: "Aluminum", baseValue: 250 },
    { name: "Copper", baseValue: 250 },
    { name: "Iron", baseValue: 250 },
    { name: "Sulfur", baseValue: 150 },
    { name: "Silver", baseValue: 150 },
    { name: "Zinc", baseValue: 100 },
    { name: "Gold", baseValue: 16 },
    { name: "Chlorophyte", baseValue: 8 },
    { name: "Sapphire", baseValue: 10 }
  ],

  "Caverns / Dusk": [
    { name: "Ruby", baseValue: 10 },
    { name: "Emerald", baseValue: 24 },
    { name: "Peridot", baseValue: 6 },
    { name: "Amethyst", baseValue: 6 },
    { name: "Thallium", baseValue: 7 },
    { name: "Tungsten", baseValue: 7 },
    { name: "Diamond", baseValue: 10 },
    { name: "Garnet", baseValue: 7 },
    { name: "Platinum", baseValue: 10 },
    { name: "Malachite", baseValue: 4 },
    { name: "Lithium", baseValue: 8 },
    { name: "Boron", baseValue: 75 }
  ],

  Volatile: [
    { name: "Shale", baseValue: 1000 },
    { name: "Boomite", baseValue: 30 },
    { name: "Titanium", baseValue: 8 },
    { name: "Plutonium", baseValue: 10 },
    { name: "Technetium", baseValue: 11 },
    { name: "Uranium", baseValue: 14 },
    { name: "Caesium", baseValue: 9 },
    { name: "Osmium", baseValue: 10 },
    { name: "Hematite", baseValue: 60 }
  ],

  "Mystic / Inbetween": [
    { name: "Calcite", baseValue: 1000 },
    { name: "Rose Quartz", baseValue: 8 },
    { name: "Rainbonite", baseValue: 3 },
    { name: "Barium", baseValue: 6 },
    { name: "Chrysoprase", baseValue: 10 },
    { name: "Soul Crystal", baseValue: 15 },
    { name: "Cobalt", baseValue: 7 },
    { name: "Lapis", baseValue: 7 },
    { name: "Bismuth", baseValue: 9 },
    { name: "Demonite", baseValue: 5 },
    { name: "Mithril", baseValue: 4 }
  ],

  "Igneous / Mantle": [
    { name: "Vanadium", baseValue: 5 },
    { name: "Dragonglass", baseValue: 45 },
    { name: "Carnelian", baseValue: 22 },
    { name: "Magmium", baseValue: 13 },
    { name: "Firecrystal", baseValue: 12 },
    { name: "Magnesium", baseValue: 11 },
    { name: "Hellstone", baseValue: 22 },
    { name: "Jasper", baseValue: 8 },
    { name: "Mantle Fragment", baseValue: 14 },
    { name: "Gargantium", baseValue: 12 }
  ],

  "Irradiated / Caustic": [
    { name: "Toxirock", baseValue: 500 },
    { name: "Radium", baseValue: 10 },
    { name: "Tellurium", baseValue: 8 },
    { name: "Newtonium", baseValue: 30 },
    { name: "Yunium", baseValue: 8 },
    { name: "Thorium", baseValue: 14 },
    { name: "Lead", baseValue: 90 },
    { name: "Blastium", baseValue: 16 },
    { name: "Coronium", baseValue: 30 },
    { name: "Tritium", baseValue: 4 },
    { name: "Polonium", baseValue: 4 }
  ],

  Mirage: [
    { name: "Frightstone", baseValue: 40 },
    { name: "Stellarite", baseValue: 4 },
    { name: "Prismaline", baseValue: 4 },
    { name: "Antimatter", baseValue: 12 },
    { name: "Constellatium", baseValue: 5 },
    { name: "Stratocrit", baseValue: 6 },
    { name: "Dark Matter", baseValue: 10 }
  ],

  Dread: [
    { name: "Nightmica", baseValue: 1000 },
    { name: "Crimstone", baseValue: 40 },
    { name: "Horrorstone", baseValue: 11 },
    { name: "Strange Matter", baseValue: 6 },
    { name: "Vermillium", baseValue: 9 },
    { name: "Magnetite", baseValue: 4 },
    { name: "Iridium", baseValue: 800 },
    { name: "Surrenderock", baseValue: 625 }
  ],

  Void: [
    { name: "Vantaslate", baseValue: 450 },
    { name: "Cometite", baseValue: 7 },
    { name: "Adamantite", baseValue: 3 },
    { name: "Eclipsium", baseValue: 6 },
    { name: "Ebonakite", baseValue: 10 },
    { name: "Palladium", baseValue: 7 },
    { name: "Neptunium", baseValue: 7 },
    { name: "Void Orb", baseValue: 8 },
    { name: "Nilidust", baseValue: 8 },
    { name: "Asthenocrit", baseValue: 6 }
  ],

  "Achrothesi / Whitespace": [
    { name: "Kronosilt", baseValue: 1000 },
    { name: "Nilglass", baseValue: 1000 },
    { name: "Kreosyte", baseValue: 6 },
    { name: "Cadmium", baseValue: 15 },
    { name: "Chromium", baseValue: 15 },
    { name: "Null", baseValue: 16 },
    { name: "Geometrium", baseValue: 7 },
    { name: "Noise", baseValue: 4 },
    { name: "Inversium", baseValue: 6 },
    { name: "Navitalc", baseValue: 10 },
    { name: "Myriroule", baseValue: 7 },
    { name: "Argibar", baseValue: 8 },
    { name: "Perilium", baseValue: 2 }
  ],

  Grayscale: [
    { name: "Gallium", baseValue: 15 },
    { name: "Amnesite", baseValue: 16 },
    { name: "Shadow Quartz", baseValue: 4 },
    { name: "Glowstone", baseValue: 3 },
    { name: "Graphene", baseValue: 6 },
    { name: "Quicksilver", baseValue: 8 },
    { name: "Gray Matter", baseValue: 6 }
  ],

  Frigid: [
    { name: "Hyfrost", baseValue: 1000 },
    { name: "Blue Ice", baseValue: 10 },
    { name: "Frostarium", baseValue: 10 },
    { name: "Anetrium", baseValue: 12 },
    { name: "Polarveril", baseValue: 2 },
    { name: "Cryonine", baseValue: 3 },
    { name: "Soimabarium", baseValue: 8 }
  ],

  Marine: [
    { name: "Nerolin", baseValue: 12 },
    { name: "Tenebris", baseValue: 8 },
    { name: "Yilantibris", baseValue: 5 },
    { name: "Aquamarine", baseValue: 12 },
    { name: "Hydrolyth", baseValue: 8 },
    { name: "Naquadah", baseValue: 10 },
    { name: "Pearl", baseValue: 6 },
    { name: "Eidoliphyll", baseValue: 2 }
  ],

  Cosmic: [
    { name: "Cosmic Glass", baseValue: 16 },
    { name: "Cosmaline", baseValue: 10 },
    { name: "Astratine", baseValue: 6 },
    { name: "Starsteel", baseValue: 8 },
    { name: "Stardust", baseValue: 5 },
    { name: "Endotravine", baseValue: 7 }
  ],

  Molten: [
    { name: "Nickel", baseValue: 48 },
    { name: "Molten Iron", baseValue: 15 },
    { name: "Corium", baseValue: 9 },
    { name: "Cinnabar", baseValue: 12 },
    { name: "Liquid Gold", baseValue: 16 },
    { name: "Pyroscorium", baseValue: 9 },
    { name: "Samarium", baseValue: 16 }
  ],

  Serenity: [
    { name: "Bedrock", baseValue: 1000 },
    { name: "Jade", baseValue: 5 },
    { name: "Redsteel", baseValue: 5 },
    { name: "Celesteel", baseValue: 3 },
    { name: "Cryoplasm", baseValue: 4 },
    { name: "Andrium", baseValue: 8 },
    { name: "Neutronium", baseValue: 8 },
    { name: "Shadowspec", baseValue: 2 },
    { name: "Spiralium", baseValue: 3 },
    { name: "Frozen Nitrogen", baseValue: 11 },
    { name: "Orichalican", baseValue: 8 },
    { name: "Scorched Bedrock", baseValue: 1000 }
  ],

  "Plasma Field": [
    { name: "Plasma", baseValue: 1000 },
    { name: "Pyroplasm", baseValue: 7 },
    { name: "Crystalline Plasma", baseValue: 18 },
    { name: "Electrium", baseValue: 6 },
    { name: "Infernilus", baseValue: 8 },
    { name: "Convectine", baseValue: 10 },
    { name: "Protonium", baseValue: 9 },
    { name: "Galvanium", baseValue: 6 },
    { name: "Ferozium", baseValue: 1000 }
  ],

  Quantum: [
    { name: "Gluonium", baseValue: 3 },
    { name: "Up Quark", baseValue: 18 },
    { name: "Down Quark", baseValue: 20 },
    { name: "Positron", baseValue: 25 },
    { name: "Supermatter", baseValue: 12 },
    { name: "Charm Quark", baseValue: 10 },
    { name: "Top Quark", baseValue: 10 },
    { name: "Bottom Quark", baseValue: 12 },
    { name: "Strange Quark", baseValue: 10 },
    { name: "Crystal Photon", baseValue: 10 },
    { name: "Photalizine", baseValue: 6 }
  ],

  Stability: [
    { name: "Universal Barrier", baseValue: 1000 },
    { name: "Rifted Barrier", baseValue: 6 },
    { name: "Fabric", baseValue: 8 },
    { name: "Mavrikine", baseValue: 6 },
    { name: "Irulisteel", baseValue: 2 }
  ],

  Planck: [
    { name: "String", baseValue: 16 },
    { name: "Hadronil", baseValue: 8 },
    { name: "Axion", baseValue: 12 },
    { name: "Graviton", baseValue: 11 },
    { name: "Mesonyte", baseValue: 9 },
    { name: "Tachyon", baseValue: 6 },
    { name: "Desmentinum", baseValue: 10 }
  ],

  "Upper Instability": [
    { name: "Ailmentin", baseValue: 750 },
    { name: "Territane", baseValue: 15 },
    { name: "Sinfurmium", baseValue: 10 },
    { name: "Gyrivarium", baseValue: 8 },
    { name: "Krazmite", baseValue: 7 },
    { name: "Anaxinite", baseValue: 8 },
    { name: "Tendrock", baseValue: 1000 },
    { name: "Dark Energy", baseValue: 8 },
    { name: "Corrodoil", baseValue: 30 },
    { name: "Antireal", baseValue: 5 },
    { name: "Hyperium", baseValue: 10 },
    { name: "Thermisine", baseValue: 14 },
    { name: "Alkanite", baseValue: 1000 }
  ],

  "Lower Instability": [
    { name: "Grimstone", baseValue: 2000 },
    { name: "Phosphyll", baseValue: 45 },
    { name: "Vrimsten", baseValue: 35 },
    { name: "Zilithorus", baseValue: 20 },
    { name: "Rimrock", baseValue: 8 },
    { name: "Korundum", baseValue: 30 },
    { name: "Cytosol", baseValue: 750 },
    { name: "Ichor", baseValue: 8 },
    { name: "Centriale", baseValue: 11 },
    { name: "Neuroplast", baseValue: 16 },
    { name: "Trinasine", baseValue: 9 },
    { name: "Adrenilar", baseValue: 7 },
    { name: "Macusmite", baseValue: 20 }
  ],

  Murk: [
    { name: "Leptonyte", baseValue: 15 },
    { name: "Mezihyrium", baseValue: 10 },
    { name: "Taynalum", baseValue: 8 },
    { name: "Thulinyl", baseValue: 2 }
  ],

  "Event Horizon": [
    { name: "Solarium", baseValue: 25 },
    { name: "Exotic Matter", baseValue: 45 },
    { name: "Nebulinite", baseValue: 12 },
    { name: "Arkivyll", baseValue: 12 },
    { name: "Chronon", baseValue: 45 },
    { name: "Aurorum", baseValue: 24 },
    { name: "Korenil", baseValue: 12 },
    { name: "Stellar Sediment", baseValue: 2000 },
    { name: "Apiastrine", baseValue: 18 }
  ],

  Abyss: [
    { name: "Abyssal Sludge", baseValue: 16 },
    { name: "Primordian", baseValue: 25 },
    { name: "Cosmodium", baseValue: 4 },
    { name: "Hexflame", baseValue: 10 },
    { name: "Tetraquark", baseValue: 9 },
    { name: "Mauraline", baseValue: 10 }
  ],

  "Inner Horizon": [
    { name: "Nihinoris", baseValue: 13 },
    { name: "Infrarian", baseValue: 6 },
    { name: "Ultranium", baseValue: 7 },
    { name: "Auricallium", baseValue: 9 },
    { name: "Zeronian", baseValue: 5 },
    { name: "Exodian", baseValue: 9 },
  ],

  Quintessence: [
    { name: "Lattiglass", baseValue: 60 },
    { name: "Aetherice", baseValue: 8 },
    { name: "Starniferus", baseValue: 10 },
    { name: "Ethanerite", baseValue: 10 },
    { name: "Lumenyl", baseValue: 10 },
    { name: "Impervium", baseValue: 18 },
    { name: "Kryposilus", baseValue: 7 },
    { name: "Vythusilyte", baseValue: 9 }
  ],

  Interstice: [
    { name: "Nethrastine", baseValue: 150 },
    { name: "Formicite", baseValue: 8 },
    { name: "Raw Energy", baseValue: 15 },
    { name: "Obliviril", baseValue: 5 },
    { name: "Enceladrum", baseValue: 9 }
  ],

  Empyrean: [
    { name: "Evrasalt", baseValue: 100 },
    { name: "Qylicryst", baseValue: 5 },
    { name: "Kafsium", baseValue: 16 },
    { name: "Zetaslime", baseValue: 15 },
    { name: "Ochistrite", baseValue: 18 },
    { name: "Reithum", baseValue: 6 },
    { name: "Vorazylith", baseValue: 8 },
    { name: "Truth Quark", baseValue: 8 },
    { name: "Wish Alloy", baseValue: 10 },
    { name: "Phantasmorite", baseValue: 9 },
    { name: "Profelis", baseValue: 10 },
    { name: "Ogleum", baseValue: 7 },
    { name: "Protireal", baseValue: 20 },
    { name: "Xerutherum", baseValue: 7 },
    { name: "Mesmirian", baseValue: 12 }
  ],
  /*
  Crush: [
    { name: "Proxalith", baseValue: 103729 },
    { name: "Stygian Ooze", baseValue: 2769.722821272927392183769272727 },
    { name: "Antallizine", baseValue: 0.27 },
  ]
  */
};