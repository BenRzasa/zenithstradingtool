/* ZTT | NAN4736's value dictionary
  - Categorized into layers
  - Each layer contains all its ores
  - Each ore contains its name, base value (ore per AV), and color template gradient
*/

import '../styles/AllGradients.css';

export const nanValsDict = {
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
    { name: "Equilibrium", baseValue: 2.5 },
    { name: "Quark Matter", baseValue: 2 },
    { name: "Periglise", baseValue: 2 },
    { name: "Isoronil", baseValue: 1 }
  ],

  "Surface / Shallow": [
    { name: "Stone", baseValue: 2000 },
    { name: "Coal", baseValue: 300 },
    { name: "Moonstone", baseValue: 3 },
    { name: "Kyanite", baseValue: 6 },
    { name: "Topaz", baseValue: 3 },
    { name: "Opal", baseValue: 5 },
    { name: "Aluminum", baseValue: 200 },
    { name: "Copper", baseValue: 250 },
    { name: "Iron", baseValue: 250 },
    { name: "Sulfur", baseValue: 200 },
    { name: "Silver", baseValue: 200 },
    { name: "Zinc", baseValue: 100 },
    { name: "Gold", baseValue: 20 },
    { name: "Chlorophyte", baseValue: 8 },
    { name: "Sapphire", baseValue: 10 }
  ],

  "Caverns / Dusk": [
    { name: "Ruby", baseValue: 10 },
    { name: "Emerald", baseValue: 25 },
    { name: "Peridot", baseValue: 6 },
    { name: "Amethyst", baseValue: 6 },
    { name: "Thallium", baseValue: 6 },
    { name: "Tungsten", baseValue: 8 },
    { name: "Diamond", baseValue: 10 },
    { name: "Garnet", baseValue: 8 },
    { name: "Platinum", baseValue: 12 },
    { name: "Malachite", baseValue: 6 },
    { name: "Lithium", baseValue: 7 },
    { name: "Boron", baseValue: 80 }
  ],

  Volatile: [
    { name: "Shale", baseValue: 1000 },
    { name: "Boomite", baseValue: 20 },
    { name: "Titanium", baseValue: 8 },
    { name: "Plutonium", baseValue: 12 },
    { name: "Technetium", baseValue: 10 },
    { name: "Uranium", baseValue: 9 },
    { name: "Caesium", baseValue: 8 },
    { name: "Osmium", baseValue: 9 },
    { name: "Hematite", baseValue: 90 }
  ],

  "Mystic / Inbetween": [
    { name: "Rose Quartz", baseValue: 7 },
    { name: "Rainbonite", baseValue: 4 },
    { name: "Barium", baseValue: 6 },
    { name: "Chrysoprase", baseValue: 10 },
    { name: "Soul Crystal", baseValue: 15 },
    { name: "Cobalt", baseValue: 10 },
    { name: "Lapis", baseValue: 8 },
    { name: "Bismuth", baseValue: 9 },
    { name: "Demonite", baseValue: 6 },
    { name: "Mithril", baseValue: 4 }
  ],

  "Igneous / Mantle": [
    { name: "Vanadium", baseValue: 6 },
    { name: "Dragonglass", baseValue: 35 },
    { name: "Carnelian", baseValue: 20 },
    { name: "Magmium", baseValue: 13 },
    { name: "Firecrystal", baseValue: 12 },
    { name: "Magnesium", baseValue: 10 },
    { name: "Hellstone", baseValue: 22 },
    { name: "Jasper", baseValue: 8 },
    { name: "Mantle Fragment", baseValue: 15 },
    { name: "Gargantium", baseValue: 12 }
  ],

  "Irradiated / Caustic": [
    { name: "Toxirock", baseValue: 500 },
    { name: "Radium", baseValue: 10 },
    { name: "Tellurium", baseValue: 7 },
    { name: "Newtonium", baseValue: 25 },
    { name: "Yunium", baseValue: 10 },
    { name: "Thorium", baseValue: 12 },
    { name: "Lead", baseValue: 80 },
    { name: "Blastium", baseValue: 10 },
    { name: "Coronium", baseValue: 25 },
    { name: "Tritium", baseValue: 4 },
    { name: "Polonium", baseValue: 4 }
  ],

  Mirage: [
    { name: "Frightstone", baseValue: 35 },
    { name: "Stellarite", baseValue: 3 },
    { name: "Prismaline", baseValue: 4 },
    { name: "Antimatter", baseValue: 10 },
    { name: "Constellatium", baseValue: 6 },
    { name: "Stratocrit", baseValue: 5 },
    { name: "Dark Matter", baseValue: 10 }
  ],

  Dread: [
    { name: "Crimstone", baseValue: 100 },
    { name: "Horrorstone", baseValue: 10 },
    { name: "Strange Matter", baseValue: 7 },
    { name: "Vermillium", baseValue: 7 },
    { name: "Magnetite", baseValue: 7 },
    { name: "Iridium", baseValue: 500 },
    { name: "Surrenderock", baseValue: 500 }
  ],

  Void: [
    { name: "Vantaslate", baseValue: 500 },
    { name: "Cometite", baseValue: 8 },
    { name: "Adamantite", baseValue: 3 },
    { name: "Eclipsium", baseValue: 7 },
    { name: "Ebonakite", baseValue: 8 },
    { name: "Palladium", baseValue: 7 },
    { name: "Neptunium", baseValue: 6 },
    { name: "Void Orb", baseValue: 8 },
    { name: "Nilidust", baseValue: 8 },
    { name: "Asthenocrit", baseValue: 6 }
  ],

  "Achrothesi / Whitespace": [
    { name: "Nilglass", baseValue: 1000 },
    { name: "Kreosyte", baseValue: 8 },
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
    { name: "Amnesite", baseValue: 15 },
    { name: "Shadow Quartz", baseValue: 4 },
    { name: "Glowstone", baseValue: 3 },
    { name: "Graphene", baseValue: 5 },
    { name: "Quicksilver", baseValue: 8 },
    { name: "Gray Matter", baseValue: 5 }
  ],

  Frigid: [
    { name: "Blue Ice", baseValue: 10 },
    { name: "Frostarium", baseValue: 10 },
    { name: "Anetrium", baseValue: 13 },
    { name: "Polarveril", baseValue: 2 },
    { name: "Cryonine", baseValue: 3 },
    { name: "Soimabarium", baseValue: 8 }
  ],

  Marine: [
    { name: "Nerolin", baseValue: 12 },
    { name: "Tenebris", baseValue: 7 },
    { name: "Yilantibris", baseValue: 5 },
    { name: "Aquamarine", baseValue: 12 },
    { name: "Hydrolyth", baseValue: 8 },
    { name: "Naquadah", baseValue: 8 },
    { name: "Pearl", baseValue: 5 },
    { name: "Eidoliphyll", baseValue: 2 }
  ],

  Cosmic: [
    { name: "Cosmic Glass", baseValue: 15 },
    { name: "Cosmaline", baseValue: 10 },
    { name: "Astratine", baseValue: 5 },
    { name: "Starsteel", baseValue: 6 },
    { name: "Stardust", baseValue: 5 },
    { name: "Endotravine", baseValue: 7 }
  ],

  Molten: [
    { name: "Nickel", baseValue: 45 },
    { name: "Molten Iron", baseValue: 15 },
    { name: "Corium", baseValue: 9 },
    { name: "Cinnabar", baseValue: 12 },
    { name: "Liquid Gold", baseValue: 15 },
    { name: "Pyroscorium", baseValue: 7 },
    { name: "Samarium", baseValue: 14 }
  ],

  Serenity: [
    { name: "Bedrock", baseValue: 500 },
    { name: "Jade", baseValue: 5 },
    { name: "Redsteel", baseValue: 4 },
    { name: "Celesteel", baseValue: 3 },
    { name: "Cryoplasm", baseValue: 4 },
    { name: "Andrium", baseValue: 8 },
    { name: "Neutronium", baseValue: 8 },
    { name: "Shadowspec", baseValue: 2 },
    { name: "Spiralium", baseValue: 2 },
    { name: "Frozen Nitrogen", baseValue: 10 },
    { name: "Orichalican", baseValue: 6 },
    { name: "Scorched Bedrock", baseValue: 500 }
  ],

  "Plasma Field": [
    { name: "Plasma", baseValue: 1000 },
    { name: "Pyroplasm", baseValue: 4 },
    { name: "Crystalline Plasma", baseValue: 15 },
    { name: "Electrium", baseValue: 6 },
    { name: "Infernilus", baseValue: 8 },
    { name: "Convectine", baseValue: 8 },
    { name: "Protonium", baseValue: 8 },
    { name: "Galvanium", baseValue: 5 },
    { name: "Ferozium", baseValue: 500 }
  ],

  Quantum: [
    { name: "Gluonium", baseValue: 2 },
    { name: "Up Quark", baseValue: 15 },
    { name: "Down Quark", baseValue: 15 },
    { name: "Positron", baseValue: 15 },
    { name: "Supermatter", baseValue: 9 },
    { name: "Charm Quark", baseValue: 10 },
    { name: "Top Quark", baseValue: 10 },
    { name: "Bottom Quark", baseValue: 10 },
    { name: "Strange Quark", baseValue: 10 },
    { name: "Crystal Photon", baseValue: 11 },
    { name: "Photalizine", baseValue: 5 }
  ],

  Stability: [
    { name: "Universal Barrier", baseValue: 500 },
    { name: "Rifted Barrier", baseValue: 6 },
    { name: "Fabric", baseValue: 12 },
    { name: "Mavrikine", baseValue: 6 },
    { name: "Irulisteel", baseValue: 2 }
  ],

  Planck: [
    { name: "String", baseValue: 15 },
    { name: "Hadronil", baseValue: 8 },
    { name: "Axion", baseValue: 10 },
    { name: "Graviton", baseValue: 9 },
    { name: "Mesonyte", baseValue: 10 },
    { name: "Tachyon", baseValue: 4 },
    { name: "Desmentinum", baseValue: 10 }
  ],

  "Upper Instability": [
    { name: "Ailmentin", baseValue: 500 },
    { name: "Territane", baseValue: 15 },
    { name: "Sinfurmium", baseValue: 8 },
    { name: "Gyrivarium", baseValue: 8 },
    { name: "Krazmite", baseValue: 8 },
    { name: "Anaxinite", baseValue: 8 },
    { name: "Tendrock", baseValue: 1000 },
    { name: "Dark Energy", baseValue: 10 },
    { name: "Corrodoil", baseValue: 25 },
    { name: "Antireal", baseValue: 7 },
    { name: "Hyperium", baseValue: 10 },
    { name: "Thermisine", baseValue: 9 },
    { name: "Alkanite", baseValue: 500 }
  ],

  "Lower Instability": [
    { name: "Grimstone", baseValue: 1000 },
    { name: "Phosphyll", baseValue: 40 },
    { name: "Vrimsten", baseValue: 40 },
    { name: "Zilithorus", baseValue: 20 },
    { name: "Rimrock", baseValue: 4 },
    { name: "Korundum", baseValue: 25 },
    { name: "Cytosol", baseValue: 750 },
    { name: "Ichor", baseValue: 7 },
    { name: "Centriale", baseValue: 10 },
    { name: "Neuroplast", baseValue: 10 },
    { name: "Trinasine", baseValue: 7 },
    { name: "Adrenilar", baseValue: 7 },
    { name: "Macusmite", baseValue: 20 }
  ],

  Murk: [
    { name: "Leptonyte", baseValue: 13 },
    { name: "Mezihyrium", baseValue: 9 },
    { name: "Taynalum", baseValue: 11 },
    { name: "Thulinyl", baseValue: 2 }
  ],

  "Event Horizon": [
    { name: "Solarium", baseValue: 20 },
    { name: "Exotic Matter", baseValue: 30 },
    { name: "Nebulinite", baseValue: 10 },
    { name: "Arkivyll", baseValue: 10 },
    { name: "Chronon", baseValue: 30 },
    { name: "Aurorum", baseValue: 15 },
    { name: "Korenil", baseValue: 6 },
    { name: "Stellar Sediment", baseValue: 1500 },
    { name: "Apiastrine", baseValue: 15 }
  ],

  Abyss: [
    { name: "Abyssal Sludge", baseValue: 12 },
    { name: "Primordian", baseValue: 25 },
    { name: "Cosmodium", baseValue: 4 },
    { name: "Hexflame", baseValue: 8 },
    { name: "Tetraquark", baseValue: 7 },
    { name: "Mauraline", baseValue: 8 }
  ],

  "Inner Horizon": [
    { name: "Nihinoris", baseValue: 12 },
    { name: "Infrarian", baseValue: 4 },
    { name: "Ultranium", baseValue: 8 },
    { name: "Auricallium", baseValue: 9 },
    { name: "Zeronian", baseValue: 4 },
    { name: "Exodian", baseValue: 8 }
  ],

  Quintessence: [
    { name: "Aetherice", baseValue: 6 },
    { name: "Starniferus", baseValue: 8 },
    { name: "Ethanerite", baseValue: 8 },
    { name: "Lumenyl", baseValue: 9 },
    { name: "Impervium", baseValue: 15 },
    { name: "Kryposilus", baseValue: 7 },
    { name: "Vythusilyte", baseValue: 8 }
  ],

  Interstice: [
    { name: "Nethrastine", baseValue: 100 },
    { name: "Formicite", baseValue: 8 },
    { name: "Raw Energy", baseValue: 12 },
    { name: "Obliviril", baseValue: 5 },
    { name: "Enceladrum", baseValue: 7 }
  ],

  Empyrean: [
    { name: "Evrasalt", baseValue: 100 },
    { name: "Qylicryst", baseValue: 3 },
    { name: "Kafsium", baseValue: 12 },
    { name: "Zetaslime", baseValue: 12 },
    { name: "Ochistrite", baseValue: 15 },
    { name: "Reithum", baseValue: 6 },
    { name: "Vorazylith", baseValue: 5 },
    { name: "Truth Quark", baseValue: 6 },
    { name: "Wish Alloy", baseValue: 7 },
    { name: "Phantasmorite", baseValue: 5 },
    { name: "Profelis", baseValue: 7 },
    { name: "Ogleum", baseValue: 4 },
    { name: "Protireal", baseValue: 14 },
    { name: "Xerutherum", baseValue: 4 },
    { name: "Mesmirian", baseValue: 7 }
  ],

  /*
  Crush: [
    { name: "Proxalith", baseValue: 103729 },
    { name: "Stygian Ooze", baseValue: 2769.722821272927392183769272727 },
    { name: "Antallizine", baseValue: 0.27 },
  ]
  */
};