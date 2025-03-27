import '../styles/AllGradients.css';

// Dictionaries for John and NAN values
export const johnValsDict = {
  Rares: [
    { name: "Ambrosine", baseValue: 1.0, className: "color-template-ambrosine" },
    { name: "Universallium", baseValue: 0.1, className: "color-template-universallium" },
    { name: "Neutrine", baseValue: 0.01, className: "color-template-neutrine" },
    { name: "Torn Fabric", baseValue: 0.002, className: "color-template-torn-fabric" },
    { name: "Singularity", baseValue: 0.001, className: "color-template-singularity" },
    { name: "Egg", baseValue: 0.02, className: "color-template-egg" },
    { name: "Cindrasil", baseValue: 0.25, className: "color-template-cindrasil" },
    { name: "Zynulvinite", baseValue: 1.0, className: "color-template-zynulvinite" },
    { name: "Element V", baseValue: 0.2, className: "color-template-element-v" },
    { name: "Neutrino", baseValue: 1.0, className: "color-template-neutrino" },
    { name: "Malbrane", baseValue: 1.0, className: "color-template-malbrane" },
    { name: "Dystranum", baseValue: 0.067, className: "color-template-dystranum" },
    { name: "Ectokelyte", baseValue: 0.333, className: "color-template-ectokelyte" },
    { name: "Havicron", baseValue: 0.1, className: "color-template-havicron" },
    { name: "Rhylazil", baseValue: 0.02, className: "color-template-rhylazil" },
    { name: "Ubriniale", baseValue: 0.01, className: "color-template-ubriniale" },
    { name: "Nyrvinoris", baseValue: 1.0, className: "color-template-nyrvinoris" },
    { name: "Unobtainium", baseValue: 1.0, className: "color-template-unobtainium" }
  ],

  Uniques: [
    { name: "Vicious Shard", baseValue: 0.006, className: "color-template-vicious-shard" },
    { name: "Jalaboño", baseValue: 1.0, className: "color-template-jalaboño" },
    { name: "Hollevite", baseValue: 1.0, className: "color-template-hollevite" },
    { name: "Verglazium", baseValue: 2.0, className: "color-template-verglazium" },
    { name: "Meteorite", baseValue: 2.0, className: "color-template-meteorite" },
    { name: "Panolethrium", baseValue: 1.0, className: "color-template-panolethrium" },
    { name: "Astathian", baseValue: 0.5, className: "color-template-astathian" },
    { name: "Sunstone", baseValue: 5.0, className: "color-template-sunstone" },
    { name: "Amber", baseValue: 2.0, className: "color-template-amber" },
    { name: "Chalcedony", baseValue: 2.5, className: "color-template-chalcedony" },
    { name: "Onyx", baseValue: 2.5, className: "color-template-onyx" }
  ],

  Compounds: [
    { name: "Equilibrium", baseValue: 4.5, className: "color-template-equilibrium" },
    { name: "Quark Matter", baseValue: 2.5, className: "color-template-quark-matter" },
    { name: "Periglise", baseValue: 2.5, className: "color-template-periglise" },
    { name: "Isoronil", baseValue: 1, className: "color-template-isoronil" }
  ],

  "Surface / Shallow": [
    { name: "Stone", baseValue: 2000, className: "color-template-stone" },
    { name: "Coal", baseValue: 150, className: "color-template-coal" },
    { name: "Moonstone", baseValue: 4, className: "color-template-moonstone" },
    { name: "Kyanite", baseValue: 6, className: "color-template-kyanite" },
    { name: "Topaz", baseValue: 2, className: "color-template-topaz" },
    { name: "Opal", baseValue: 5, className: "color-template-opal" },
    { name: "Aluminum", baseValue: 150, className: "color-template-aluminum" },
    { name: "Copper", baseValue: 300, className: "color-template-copper" },
    { name: "Iron", baseValue: 150, className: "color-template-iron" },
    { name: "Sulfur", baseValue: 75, className: "color-template-sulfur" },
    { name: "Silver", baseValue: 75, className: "color-template-silver" },
    { name: "Zinc", baseValue: 75, className: "color-template-zinc" },
    { name: "Gold", baseValue: 18, className: "color-template-gold" },
    { name: "Chlorophyte", baseValue: 9, className: "color-template-chlorophyte" },
    { name: "Sapphire", baseValue: 10, className: "color-template-sapphire" }
  ],

  "Caverns / Dusk": [
    { name: "Ruby", baseValue: 11, className: "color-template-ruby" },
    { name: "Emerald", baseValue: 24, className: "color-template-emerald" },
    { name: "Peridot", baseValue: 6, className: "color-template-peridot" },
    { name: "Amethyst", baseValue: 4, className: "color-template-amethyst" },
    { name: "Thallium", baseValue: 7, className: "color-template-thallium" },
    { name: "Tungsten", baseValue: 7, className: "color-template-tungsten" },
    { name: "Diamond", baseValue: 10, className: "color-template-diamond" },
    { name: "Garnet", baseValue: 7, className: "color-template-garnet" },
    { name: "Platinum", baseValue: 9, className: "color-template-platinum" },
    { name: "Malachite", baseValue: 4.5, className: "color-template-malachite" },
    { name: "Lithium", baseValue: 8, className: "color-template-lithium" },
    { name: "Boron", baseValue: 75, className: "color-template-boron" }
  ],

  Volatile: [
    { name: "Boomite", baseValue: 30, className: "color-template-boomite" },
    { name: "Titanium", baseValue: 8, className: "color-template-titanium" },
    { name: "Plutonium", baseValue: 10, className: "color-template-plutonium" },
    { name: "Technetium", baseValue: 11, className: "color-template-technetium" },
    { name: "Uranium", baseValue: 14, className: "color-template-uranium" },
    { name: "Caesium", baseValue: 9, className: "color-template-caesium" },
    { name: "Osmium", baseValue: 10, className: "color-template-osmium" },
    { name: "Hematite", baseValue: 58.75, className: "color-template-hematite" }
  ],

  "Mystic / Inbetween": [
    { name: "Rose Quartz", baseValue: 8, className: "color-template-rose-quartz" },
    { name: "Rainbonite", baseValue: 2.5, className: "color-template-rainbonite" },
    { name: "Barium", baseValue: 6.5, className: "color-template-barium" },
    { name: "Chrysoprase", baseValue: 10, className: "color-template-chrysoprase" },
    { name: "Soul Crystal", baseValue: 15, className: "color-template-soul-crystal" },
    { name: "Cobalt", baseValue: 7, className: "color-template-cobalt" },
    { name: "Lapis", baseValue: 7, className: "color-template-lapis" },
    { name: "Bismuth", baseValue: 9, className: "color-template-bismuth" },
    { name: "Demonite", baseValue: 5.5, className: "color-template-demonite" },
    { name: "Mithril", baseValue: 3.5, className: "color-template-mithril" }
  ],

  "Igneous / Mantle": [
    { name: "Vanadium", baseValue: 4, className: "color-template-vanadium" },
    { name: "Dragonglass", baseValue: 45, className: "color-template-dragonglass" },
    { name: "Carnelian", baseValue: 22.5, className: "color-template-carnelian" },
    { name: "Magmium", baseValue: 13, className: "color-template-magmium" },
    { name: "Firecrystal", baseValue: 12, className: "color-template-firecrystal" },
    { name: "Magnesium", baseValue: 11, className: "color-template-magnesium" },
    { name: "Hellstone", baseValue: 24, className: "color-template-hellstone" },
    { name: "Jasper", baseValue: 8.5, className: "color-template-jasper" },
    { name: "Mantle Fragment", baseValue: 14, className: "color-template-mantle-fragment" },
    { name: "Gargantium", baseValue: 12, className: "color-template-gargantium" }
  ],

  "Irradiated / Caustic": [
    { name: "Toxirock", baseValue: 500, className: "color-template-toxirock" },
    { name: "Radium", baseValue: 10, className: "color-template-radium" },
    { name: "Tellurium", baseValue: 8, className: "color-template-tellurium" },
    { name: "Newtonium", baseValue: 31, className: "color-template-newtonium" },
    { name: "Yunium", baseValue: 8, className: "color-template-yunium" },
    { name: "Thorium", baseValue: 14, className: "color-template-thorium" },
    { name: "Lead", baseValue: 92.5, className: "color-template-lead" },
    { name: "Blastium", baseValue: 16, className: "color-template-blastium" },
    { name: "Coronium", baseValue: 40, className: "color-template-coronium" },
    { name: "Tritium", baseValue: 4.5, className: "color-template-tritium" },
    { name: "Polonium", baseValue: 4, className: "color-template-polonium" }
  ],

  Mirage: [
    { name: "Frightstone", baseValue: 40, className: "color-template-frightstone" },
    { name: "Stellarite", baseValue: 4.5, className: "color-template-stellarite" },
    { name: "Prismaline", baseValue: 4, className: "color-template-prismaline" },
    { name: "Antimatter", baseValue: 12, className: "color-template-antimatter" },
    { name: "Constellatium", baseValue: 5.5, className: "color-template-constellatium" },
    { name: "Stratocrit", baseValue: 6, className: "color-template-stratocrit" },
    { name: "Dark Matter", baseValue: 10, className: "color-template-dark-matter" }
  ],

  Gloom: [
    { name: "Crimstone", baseValue: 70.5, className: "color-template-crimstone" },
    { name: "Horrorstone", baseValue: 11, className: "color-template-horrorstone" },
    { name: "Strange Matter", baseValue: 6, className: "color-template-strange-matter" },
    { name: "Vermillium", baseValue: 9, className: "color-template-vermillium" },
    { name: "Magnetite", baseValue: 4, className: "color-template-magnetite" },
    { name: "Iridium", baseValue: 1000, className: "color-template-iridium" },
    { name: "Surrenderock", baseValue: 625, className: "color-template-surrenderock" }
  ],

  Void: [
    { name: "Vantaslate", baseValue: 450, className: "color-template-vantaslate" },
    { name: "Cometite", baseValue: 7, className: "color-template-cometite" },
    { name: "Adamantite", baseValue: 3, className: "color-template-adamantite" },
    { name: "Eclipsium", baseValue: 6, className: "color-template-eclipsium" },
    { name: "Ebonakite", baseValue: 10, className: "color-template-ebonakite" },
    { name: "Palladium", baseValue: 6.5, className: "color-template-palladium" },
    { name: "Neptunium", baseValue: 5, className: "color-template-neptunium" },
    { name: "Void Orb", baseValue: 7, className: "color-template-void-orb" },
    { name: "Nilidust", baseValue: 6.5, className: "color-template-nilidust" },
    { name: "Asthenocrit", baseValue: 6.5, className: "color-template-asthenocrit" }
  ],

  Grayscale: [
    { name: "Gallium", baseValue: 60, className: "color-template-gallium" },
    { name: "Amnesite", baseValue: 18, className: "color-template-amnesite" },
    { name: "Shadow Quartz", baseValue: 4, className: "color-template-shadow-quartz" },
    { name: "Glowstone", baseValue: 3.5, className: "color-template-glowstone" },
    { name: "Graphene", baseValue: 6, className: "color-template-graphene" },
    { name: "Quicksilver", baseValue: 8, className: "color-template-quicksilver" },
    { name: "Gray Matter", baseValue: 5.5, className: "color-template-gray-matter" }
  ],

  "Achrothesi / Whitespace": [
    { name: "Cadmium", baseValue: 12, className: "color-template-cadmium" },
    { name: "Chromium", baseValue: 9, className: "color-template-chromium" },
    { name: "Null", baseValue: 8, className: "color-template-null" },
    { name: "Geometrium", baseValue: 3.5, className: "color-template-geometrium" },
    { name: "Noise", baseValue: 4, className: "color-template-noise" },
    { name: "Inversium", baseValue: 3.5, className: "color-template-inversium" },
    { name: "Navitalc", baseValue: 8, className: "color-template-navitalc" },
    { name: "Myriroule", baseValue: 5.5, className: "color-template-myriroule" },
    { name: "Argibar", baseValue: 4.5, className: "color-template-argibar" },
    { name: "Perilium", baseValue: 2, className: "color-template-perilium" }
  ],

  Frigid: [
    { name: "Blue Ice", baseValue: 10, className: "color-template-blue-ice" },
    { name: "Frostarium", baseValue: 10, className: "color-template-frostarium" },
    { name: "Anetrium", baseValue: 13.5, className: "color-template-anetrium" },
    { name: "Polarveril", baseValue: 2, className: "color-template-polarveril" },
    { name: "Cryonine", baseValue: 3.5, className: "color-template-cryonine" },
    { name: "Soimabarium", baseValue: 8, className: "color-template-soimabarium" }
  ],

  Marine: [
    { name: "Nerolin", baseValue: 12.5, className: "color-template-nerolin" },
    { name: "Tenebris", baseValue: 8, className: "color-template-tenebris" },
    { name: "Yilantibris", baseValue: 6, className: "color-template-yilantibris" },
    { name: "Aquamarine", baseValue: 12, className: "color-template-aquamarine" },
    { name: "Hydrolyth", baseValue: 8, className: "color-template-hydrolyth" },
    { name: "Naquadah", baseValue: 10, className: "color-template-naquadah" },
    { name: "Pearl", baseValue: 6, className: "color-template-pearl" },
    { name: "Eidoliphyll", baseValue: 2, className: "color-template-eidoliphyll" }
  ],

  Cosmic: [
    { name: "Cosmic Glass", baseValue: 17.5, className: "color-template-cosmic-glass" },
    { name: "Cosmaline", baseValue: 10, className: "color-template-cosmaline" },
    { name: "Astratine", baseValue: 6, className: "color-template-astratine" },
    { name: "Starsteel", baseValue: 8, className: "color-template-starsteel" },
    { name: "Stardust", baseValue: 6, className: "color-template-stardust" },
    { name: "Endotravine", baseValue: 7, className: "color-template-endotravine" }
  ],

  Molten: [
    { name: "Nickel", baseValue: 48, className: "color-template-nickel" },
    { name: "Molten Iron", baseValue: 15.5, className: "color-template-molten-iron" },
    { name: "Corium", baseValue: 9, className: "color-template-corium" },
    { name: "Cinnabar", baseValue: 16, className: "color-template-cinnabar" },
    { name: "Molten Iron", baseValue: 16, className: "color-template-molten-iron" },
    { name: "Pyroscorium", baseValue: 9, className: "color-template-pyroscorium" },
    { name: "Samarium", baseValue: 16, className: "color-template-samarium" }
  ],

  Serenity: [
    { name: "Bedrock", baseValue: 1000, className: "color-template-bedrock" },
    { name: "Jade", baseValue: 5, className: "color-template-jade" },
    { name: "Redsteel", baseValue: 5, className: "color-template-redsteel" },
    { name: "Celesteel", baseValue: 4, className: "color-template-celesteel" },
    { name: "Cryoplasm", baseValue: 4, className: "color-template-cryoplasm" },
    { name: "Andrium", baseValue: 8, className: "color-template-andrium" },
    { name: "Neutronium", baseValue: 8, className: "color-template-neutronium" },
    { name: "Shadowspec", baseValue: 2, className: "color-template-shadowspec" },
    { name: "Spiralium", baseValue: 2.5, className: "color-template-spiralium" },
    { name: "Frozen Nitrogen", baseValue: 11, className: "color-template-frozen-nitrogen" },
    { name: "Orichalican", baseValue: 8, className: "color-template-orichalican" },
    { name: "Scorched Bedrock", baseValue: 1000, className: "color-template-scorched-bedrock" }
  ],

  "Plasma Field": [
    { name: "Plasma", baseValue: 2000, className: "color-template-plasma" },
    { name: "Pyroplasm", baseValue: 5.5, className: "color-template-pyroplasm" },
    { name: "Crystalline Plasma", baseValue: 18.5, className: "color-template-crystalline-plasma" },
    { name: "Electrium", baseValue: 6, className: "color-template-electrium" },
    { name: "Infernilus", baseValue: 7.5, className: "color-template-infernilus" },
    { name: "Convectine", baseValue: 10, className: "color-template-convectine" },
    { name: "Protonium", baseValue: 9, className: "color-template-protonium" },
    { name: "Galvanium", baseValue: 6, className: "color-template-galvanium" },
    { name: "Ferozium", baseValue: 1000, className: "color-template-ferozium" }
  ],

  Quantum: [
    { name: "Gluonium", baseValue: 2.5, className: "color-template-gluonium" },
    { name: "Up Quark", baseValue: 20, className: "color-template-up-quark" },
    { name: "Down Quark", baseValue: 24, className: "color-template-down-quark" },
    { name: "Positron", baseValue: 30, className: "color-template-positron" },
    { name: "Supermatter", baseValue: 13.5, className: "color-template-supermatter" },
    { name: "Charm Quark", baseValue: 10, className: "color-template-charm-quark" },
    { name: "Top Quark", baseValue: 15, className: "color-template-top-quark" },
    { name: "Bottom Quark", baseValue: 15, className: "color-template-bottom-quark" },
    { name: "Strange Quark", baseValue: 10, className: "color-template-strange-quark" },
    { name: "Crystal Photon", baseValue: 10, className: "color-template-crystal-photon" },
    { name: "Photalizine", baseValue: 7, className: "color-template-photalizine" }
  ],

  Stability: [
    { name: "Universal Barrier", baseValue: 1000, className: "color-template-universal-barrier" },
    { name: "Rifted Barrier", baseValue: 6, className: "color-template-rifted-barrier" },
    { name: "Fabric", baseValue: 7, className: "color-template-fabric" },
    { name: "Mavrikine", baseValue: 6, className: "color-template-mavrikine" }
  ],

  Planck: [
    { name: "String", baseValue: 16, className: "color-template-string" },
    { name: "Hadronil", baseValue: 8, className: "color-template-hadronil" },
    { name: "Axion", baseValue: 13.5, className: "color-template-axion" },
    { name: "Graviton", baseValue: 11, className: "color-template-graviton" },
    { name: "Mesonyte", baseValue: 9, className: "color-template-mesonyte" },
    { name: "Tachyon", baseValue: 6.5, className: "color-template-tachyon" },
    { name: "Desmentinum", baseValue: 10, className: "color-template-desmentinum" }
  ],

  "Conversion/Disarray/Breakage/Criticality": [
    { name: "Ailmentin", baseValue: 750, className: "color-template-ailmentin" },
    { name: "Territane", baseValue: 15, className: "color-template-territane" },
    { name: "Sinfurmium", baseValue: 10, className: "color-template-sinfurmium" },
    { name: "Gyrivarium", baseValue: 8, className: "color-template-gyrivarium" },
    { name: "Krazmite", baseValue: 7, className: "color-template-krazmite" },
    { name: "Tendrock", baseValue: 1000, className: "color-template-tendrock" },
    { name: "Dark Energy", baseValue: 8, className: "color-template-dark-energy" },
    { name: "Corrodoil", baseValue: 30.5, className: "color-template-corrodoil" },
    { name: "Antireal", baseValue: 5, className: "color-template-antireal" },
    { name: "Hyperium", baseValue: 9, className: "color-template-hyperium" },
    { name: "Thermisine", baseValue: 14, className: "color-template-thermisine" },
    { name: "Alkanite", baseValue: 1000, className: "color-template-alkanite" }
  ],

  "Grim 1 / Hive / Grim 2": [
    { name: "Grimstone", baseValue: 2000, className: "color-template-grimstone" },
    { name: "Phosphyll", baseValue: 44.5, className: "color-template-phosphyll" },
    { name: "Vrimsten", baseValue: 36.5, className: "color-template-vrimsten" },
    { name: "Zilithorus", baseValue: 20, className: "color-template-zilithorus" },
    { name: "Rimrock", baseValue: 8, className: "color-template-rimrock" },
    { name: "Korundum", baseValue: 50, className: "color-template-korundum" },
    { name: "Cytosol", baseValue: 750, className: "color-template-cytosol" },
    { name: "Ichor", baseValue: 8.5, className: "color-template-ichor" },
    { name: "Centriale", baseValue: 11.5, className: "color-template-centriale" },
    { name: "Neuroplast", baseValue: 16.5, className: "color-template-neuroplast" },
    { name: "Trinasine", baseValue: 9, className: "color-template-trinasine" },
    { name: "Adrenilar", baseValue: 7, className: "color-template-adrenilar" },
    { name: "Macusmite", baseValue: 22, className: "color-template-macusmite" }
  ],

  Murk: [
    { name: "Leptonyte", baseValue: 15, className: "color-template-leptonyte" },
    { name: "Mezihyrium", baseValue: 9, className: "color-template-mezihyrium" },
    { name: "Taynalum", baseValue: 10, className: "color-template-taynalum" },
    { name: "Thulinyl", baseValue: 2, className: "color-template-thulinyl" }
  ],

  "Event Horizon": [
    { name: "Solarium", baseValue: 29.5, className: "color-template-solarium" },
    { name: "Exotic Matter", baseValue: 41.5, className: "color-template-exotic-matter" },
    { name: "Nebulinite", baseValue: 11.5, className: "color-template-nebulinite" },
    { name: "Arkivyll", baseValue: 12, className: "color-template-arkivyll" },
    { name: "Chronon", baseValue: 11, className: "color-template-chronon" },
    { name: "Aurorum", baseValue: 24.5, className: "color-template-aurorum" },
    { name: "Korenil", baseValue: 12, className: "color-template-korenil" },
    { name: "Stellar Sediment", baseValue: 1000, className: "color-template-stellar-sediment" },
    { name: "Apiastrine", baseValue: 18, className: "color-template-apiastrine" }
  ],

  Abyss: [
    { name: "Abyssal Sludge", baseValue: 16, className: "color-template-abyssal-sludge" },
    { name: "Primordian", baseValue: 10.5, className: "color-template-primordian" },
    { name: "Cosmodium", baseValue: 4.5, className: "color-template-cosmodium" },
    { name: "Hexflame", baseValue: 10, className: "color-template-hexflame" },
    { name: "Tetraquark", baseValue: 9.5, className: "color-template-tetraquark" },
    { name: "Mauraline", baseValue: 10, className: "color-template-mauraline" }
  ],

  "Inner Horizon": [
    { name: "Nihinoris", baseValue: 13.5, className: "color-template-nihinoris" },
    { name: "Infrarian", baseValue: 4.5, className: "color-template-infrarian" },
    { name: "Ultranium", baseValue: 7, className: "color-template-ultranium" },
    { name: "Auricallium", baseValue: 9, className: "color-template-auricallium" },
    { name: "Zeronian", baseValue: 4.5, className: "color-template-zeronian" },
    { name: "Exodian", baseValue: 9, className: "color-template-exodian" }
  ],

  Quintessence: [
    { name: "Aetherice", baseValue: 8, className: "color-template-aetherice" },
    { name: "Starniferus", baseValue: 11, className: "color-template-starniferus" },
    { name: "Ethanerite", baseValue: 11, className: "color-template-ethanerite" },
    { name: "Lumenyl", baseValue: 11, className: "color-template-lumenyl" },
    { name: "Impervium", baseValue: 19.5, className: "color-template-impervium" },
    { name: "Kryposilus", baseValue: 7, className: "color-template-kryposilus" },
    { name: "Vythusilyte", baseValue: 9, className: "color-template-vythusilyte" }
  ],

  Interstice: [
    { name: "Nethrastine", baseValue: 100, className: "color-template-nethrastine" },
    { name: "Formicite", baseValue: 8, className: "color-template-formicite" },
    { name: "Raw Energy", baseValue: 15, className: "color-template-raw-energy" },
    { name: "Obliviril", baseValue: 5.5, className: "color-template-obliviril" },
    { name: "Enceladrum", baseValue: 9, className: "color-template-enceladrum" }
  ],

  Empyrean: [
    { name: "Evrasalt", baseValue: 100, className: "color-template-evrasalt" },
    { name: "Qylicryst", baseValue: 5, className: "color-template-qylicryst" },
    { name: "Kafsium", baseValue: 16, className: "color-template-kafsium" },
    { name: "Zetaslime", baseValue: 15.5, className: "color-template-zetaslime" },
    { name: "Ochistrite", baseValue: 19.5, className: "color-template-ochistrite" },
    { name: "Reithum", baseValue: 6, className: "color-template-reithum" },
    { name: "Vorazylith", baseValue: 7.5, className: "color-template-vorazylith" },
    { name: "Truth Quark", baseValue: 8.5, className: "color-template-truth-quark" },
    { name: "Wish Alloy", baseValue: 13, className: "color-template-wish-alloy" },
    { name: "Phantasmorite", baseValue: 8.5, className: "color-template-phantasmorite" },
    { name: "Profelis", baseValue: 11.5, className: "color-template-profelis" },
    { name: "Ogleum", baseValue: 7, className: "color-template-ogleum" },
    { name: "Protireal", baseValue: 20, className: "color-template-protireal" },
    { name: "Xerutherum", baseValue: 7.5, className: "color-template-xerutherum" },
    { name: "Mesmirian", baseValue: 13, className: "color-template-mesmirian" }
  ],
};
