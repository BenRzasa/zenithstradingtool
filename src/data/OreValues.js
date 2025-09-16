
export const initialOreValsDict = [
  {
    layerName: "True Rares\n1/33,333 or Rarer",
    background:
      "linear-gradient(135deg, #fdfcef 0%, #d3f8f8 20%, #faedfd 30%, #f2caff 37.5%, #ffffff 50%, #ffd9a1 62.5%, #edebd6 70%, #ecf9df 80%, #b7dce1 100%)",
    layerOres:
      [
        { name: "Universallium", obtainVal: 0.1, zenithVal: 0.1, johnVal: 0.1, nanVal: 0.1, customVal: 0.1 },
        { name: "Neutrine", obtainVal: 0.01, zenithVal: 0.01, johnVal: 0.01, nanVal: 0.01, customVal: 0.01 },
        { name: "Torn Fabric", obtainVal: 0.002, zenithVal: 0.002, johnVal: 0.002, nanVal: 0.002, customVal: 0.002 },
        { name: "Singularity", obtainVal: 0.001, zenithVal: 0.001, johnVal: 0.001, nanVal: 0.001, customVal: 0.001 },
        { name: "Egg", obtainVal: 0.025, zenithVal: 0.025, johnVal: 0.02, nanVal: 0.02, customVal: 0.025 },
        { name: "Violecil", obtainVal: 0.2, zenithVal: 0.2, johnVal: 0.2, nanVal: 0.2, customVal: 0.2 },
        { name: "Dystranum", obtainVal: 1 / 15, zenithVal: 1 / 15, johnVal: 1 / 15, nanVal: 1 / 15, customVal: 1 / 15 },
        { name: "Havicron", obtainVal: 0.1, zenithVal: 0.1, johnVal: 0.1, nanVal: 0.1, customVal: 0.1 },
        {
          name: "Rhylazil",
          keypoints:
            [
              [1, 10000], [5999, 10000],
              [6000, 0], [6499, 0],
              [6500, 10000], [8499, 9090],
              [8550, 6250], [8595, 20000]
            ],
          obtainVal: 0.02, zenithVal: 0.02, johnVal: 0.02, nanVal: 0.02, customVal: 0.02
        },
        { name: "Ubriniale", obtainVal: 0.01, zenithVal: 0.01, johnVal: 0.01, nanVal: 0.01, customVal: 0.01 },
      ]
  },

  {
    layerName: "Rares\nMore Common Than 1/33,333",
    background:
      "linear-gradient(90deg, #ffcc66 0%, #f9f575 20%, #f07f53 42.2%, #ec82ff 80%, #b050eb 100%)",
    layerOres:
      [
        {
          name: "Ambrosine",
          keypoints:
            [
              [1, 10000],
              [5999, 10000],
              [6000, 0],
              [6499, 0],
              [6500, 10000],
              [8499, 9090],
              [8550, 6250],
              [8595, 20000]
            ],
          obtainVal: 1.0, zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0
        },
        { name: "Zynulvinite", obtainVal: 1.0, zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
        { name: "Cindrasil", obtainVal: 1 / 3, zenithVal: 1 / 3, johnVal: 1 / 3, nanVal: 1 / 3, customVal: 1 / 3 },
        { name: "Neutrino", obtainVal: 1.0, zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
        { name: "Malbrane", obtainVal: 1.0, zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
        { name: "Ectokelyte", obtainVal: 1 / 3, zenithVal: 1 / 3, johnVal: 1 / 3, nanVal: 1 / 3, customVal: 1 / 3 },
      ]
  },

  {
    layerName: "Uniques\nNon-Standard Obtainment",
    background:
      "linear-gradient(112deg, #ffaa6e 0%, #ffa82e 17.8%, #ffdea9 27.9%, #dd7226 35.6%, #8b263d 51.6%, #dc672e 71.8%, #f8e3b6 80%, #f0b657 87.4%, #7e262c 100%)",
    layerOres:
      [
        { name: "Vicious Shard", zenithVal: 1 / 180, johnVal: 1 / 180, nanVal: 1 / 180, customVal: 1 / 180 },
        { name: "Jalabono", zenithVal: 1, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
        { name: "Hollevite", zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
        { name: "Verglazium", zenithVal: 1.0, johnVal: 2.0, nanVal: 1.0, customVal: 1.0 },
        { name: "Meteorite", zenithVal: 2.0, johnVal: 2.0, nanVal: 2.0, customVal: 2.0 },
        { name: "Panolethrium", zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
        { name: "Astathian", zenithVal: 0.5, johnVal: 0.5, nanVal: 0.5, customVal: 0.5 },
        { name: "Sunstone", zenithVal: 5.0, johnVal: 5.0, nanVal: 5.0, customVal: 5.0 },
        { name: "Amber", zenithVal: 2.0, johnVal: 2.0, nanVal: 2.0, customVal: 2.0 },
        { name: "Chalcedony", zenithVal: 2.5, johnVal: 2.5, nanVal: 2.5, customVal: 2.5 },
        { name: "Onyx", zenithVal: 2.5, johnVal: 2.5, nanVal: 2.5, customVal: 2.5 },
        { name: "Rimrock", zenithVal: 6, johnVal: 8, nanVal: 4, customVal: 6 },
      ],
  },

  {
    layerName: "Compounds\nCrafted via Synthesis",
    background:
      "linear-gradient(90deg,#1035ad 0%, #346fc0 10%, #a0e8f1 22.5%, #d7fcff 35%, #f7ebff 42.5%, #fefcfc 50%, #f7ebff 57.5%, #fef7cf 65%, #f5c97c 80%, #703664 100%)",
    layerOres:
      [
        { name: "Equilibrium", zenithVal: 4, johnVal: 4.5, nanVal: 5, customVal: 4 },
        { name: "Quark Matter", zenithVal: 2.5, johnVal: 2.5, nanVal: 2, customVal: 2.5 },
        { name: "Periglise", zenithVal: 2.5, johnVal: 2.5, nanVal: 2, customVal: 2.5 },
        { name: "Isoronil", zenithVal: 1, johnVal: 1, nanVal: 1, customVal: 1 },
      ],
  },

  {
    layerName: "Surface / Shallow\n[0m-74m]",
    background:
      "linear-gradient(180deg, rgb(110, 158, 96) 0%,rgb(160, 160, 160) 100%)",
    layerOres:
      [
        { name: "Stone", zenithVal: 2000, johnVal: 2000, nanVal: 2000, customVal: 2000 },
        { name: "Coal", zenithVal: 300, johnVal: 150, nanVal: 300, customVal: 300 },
        { name: "Moonstone", zenithVal: 4, johnVal: 4, nanVal: 3, customVal: 4 },
        { name: "Kyanite", zenithVal: 6, johnVal: 6, nanVal: 6, customVal: 6 },
        { name: "Topaz", zenithVal: 3, johnVal: 2, nanVal: 3, customVal: 3 },
        { name: "Opal", zenithVal: 5, johnVal: 5, nanVal: 5, customVal: 5 },
        { name: "Aluminum", zenithVal: 200, johnVal: 150, nanVal: 200, customVal: 200 },
        { name: "Copper", zenithVal: 300, johnVal: 300, nanVal: 250, customVal: 300 },
        { name: "Iron", zenithVal: 250, johnVal: 150, nanVal: 250, customVal: 250 },
        { name: "Sulfur", zenithVal: 200, johnVal: 75, nanVal: 200, customVal: 200 },
        { name: "Silver", zenithVal: 100, johnVal: 75, nanVal: 200, customVal: 100 },
        { name: "Zinc", zenithVal: 100, johnVal: 75, nanVal: 100, customVal: 100 },
        { name: "Gold", zenithVal: 18, johnVal: 18, nanVal: 20, customVal: 18 },
        { name: "Sapphire", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10 }
      ],
  },

  {
    layerName: "Caverns / Dusk\n[75m-299m | 300m-599m]",
    background:
      "linear-gradient(180deg,rgb(192, 181, 161) 0%,rgb(39, 52, 99) 100%)",
    layerOres:
      [
        { name: "Ruby", zenithVal: 11, johnVal: 11, nanVal: 10, customVal: 11 },
        { name: "Emerald", zenithVal: 22, johnVal: 24, nanVal: 25, customVal: 22 },
        { name: "Peridot", zenithVal: 7, johnVal: 6, nanVal: 6, customVal: 6 },
        { name: "Amethyst", zenithVal: 5, johnVal: 4, nanVal: 6, customVal: 5 },
        { name: "Thallium", zenithVal: 6, johnVal: 7, nanVal: 6, customVal: 6 },
        { name: "Tungsten", zenithVal: 8, johnVal: 7, nanVal: 8, customVal: 7 },
        { name: "Diamond", zenithVal: 12, johnVal: 10, nanVal: 10, customVal: 12 },
        { name: "Garnet", zenithVal: 7, johnVal: 7, nanVal: 8, customVal: 7 },
        { name: "Platinum", zenithVal: 9, johnVal: 9, nanVal: 12, customVal: 9 },
        { name: "Malachite", zenithVal: 5, johnVal: 4.5, nanVal: 6, customVal: 5 },
        { name: "Lithium", zenithVal: 10, johnVal: 8, nanVal: 7, customVal: 10 },
        { name: "Boron", zenithVal: 75, johnVal: 75, nanVal: 80, customVal: 75 }
      ],
  },

  {
    layerName: "Volatile\n[600m-999m]",
    background: "rgb(228, 174, 126)",
    layerOres:
      [
        { name: "Shale", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
        { name: "Boomite", zenithVal: 32, johnVal: 30, nanVal: 20, customVal: 32 },
        { name: "Titanium", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
        { name: "Plutonium", zenithVal: 12, johnVal: 10, nanVal: 12, customVal: 12 },
        { name: "Technetium", zenithVal: 10, johnVal: 11, nanVal: 10, customVal: 10 },
        { name: "Uranium", zenithVal: 16, johnVal: 14, nanVal: 10, customVal: 16 },
        { name: "Caesium", zenithVal: 9, johnVal: 9, nanVal: 8, customVal: 9 },
        { name: "Osmium", zenithVal: 9, johnVal: 10, nanVal: 9, customVal: 9 },
        { name: "Hematite", zenithVal: 60, johnVal: 117.5, nanVal: 90, customVal: 60 }
      ],
  },

  {
    layerName: "Mystic / Inbetween\n[1000m-1499m | 1500m-1999m]",
    background: "rgb(108, 137, 231)",
    layerOres:
      [
        { name: "Calcite", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
        { name: "Rose Quartz", zenithVal: 8, johnVal: 8, nanVal: 7, customVal: 8 },
        { name: "Rainbonite", zenithVal: 4, johnVal: 2.5, nanVal: 4, customVal: 4 },
        { name: "Chrysoprase", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10 },
        { name: "Soul Crystal", zenithVal: 16, johnVal: 15, nanVal: 15, customVal: 16 },
        { name: "Cobalt", zenithVal: 7, johnVal: 7, nanVal: 10, customVal: 7 },
        { name: "Lapis", zenithVal: 7, johnVal: 7, nanVal: 8, customVal: 7 },
        { name: "Bismuth", zenithVal: 10, johnVal: 9, nanVal: 9, customVal: 10 },
        { name: "Demonite", zenithVal: 6, johnVal: 5.5, nanVal: 6, customVal: 6 },
        { name: "Mithril", zenithVal: 4, johnVal: 3.5, nanVal: 4, customVal: 4 }
      ],
  },

  {
    layerName: "Igneous / Mantle\n[2000m-2499m | 2500m-2999m]",
    background: "#d63636",
    layerOres:
      [
        { name: "Vanadium", zenithVal: 4, johnVal: 4, nanVal: 6, customVal: 4 },
        { name: "Dragonglass", zenithVal: 45, johnVal: 45, nanVal: 35, customVal: 45 },
        { name: "Carnelian", zenithVal: 22, johnVal: 22.5, nanVal: 20, customVal: 22 },
        { name: "Magmium", zenithVal: 14, johnVal: 13, nanVal: 13, customVal: 14 },
        { name: "Firecrystal", zenithVal: 12, johnVal: 12, nanVal: 12, customVal: 12 },
        { name: "Magnesium", zenithVal: 11, johnVal: 11, nanVal: 10, customVal: 11 },
        { name: "Hellstone", zenithVal: 24, johnVal: 24, nanVal: 22, customVal: 24 },
        { name: "Jasper", zenithVal: 9, johnVal: 8.5, nanVal: 8, customVal: 9 },
        { name: "Mantle Fragment", zenithVal: 14, johnVal: 14, nanVal: 15, customVal: 14 },
        { name: "Gargantium", zenithVal: 12, johnVal: 12, nanVal: 12, customVal: 12 }
      ],
  },

  {
    layerName: "Irradiated / Caustic\n[3000m-3499m | 3500m-3999m]",
    background: "linear-gradient(180deg, #49c73b 0%, #24a510 100%)",
    layerOres:
      [
        { name: "Toxirock", zenithVal: 500, johnVal: 1000, nanVal: 500, customVal: 500 },
        { name: "Radium", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10 },
        { name: "Tellurium", zenithVal: 7, johnVal: 8, nanVal: 7, customVal: 8 },
        { name: "Newtonium", zenithVal: 32, johnVal: 31, nanVal: 25, customVal: 32 },
        { name: "Yunium", zenithVal: 8, johnVal: 8, nanVal: 10, customVal: 8 },
        { name: "Thorium", zenithVal: 14, johnVal: 14, nanVal: 12, customVal: 14 },
        { name: "Lead", zenithVal: 74, johnVal: 92.5, nanVal: 80, customVal: 74 },
        { name: "Blastium", zenithVal: 16, johnVal: 16, nanVal: 10, customVal: 16 },
        { name: "Coronium", zenithVal: 40, johnVal: 40, nanVal: 25, customVal: 40 },
        { name: "Tritium", zenithVal: 4, johnVal: 4.5, nanVal: 4, customVal: 4 },
        { name: "Polonium", zenithVal: 4, johnVal: 4, nanVal: 4, customVal: 4 }
      ],
  },

  {
    layerName: "Mirage\n[4000m-4499m]",
    background: "#b06cda",
    layerOres:
      [
        { name: "Altoplast", zenithVal: 36, johnVal: 40, nanVal: 40, customVal: 36 },
        { name: "Illusinium", zenithVal: 44, johnVal: 40, nanVal: 40, customVal: 44 },
        { name: "Starlite", zenithVal: 8, johnVal: 4.5, nanVal: 10, customVal: 8 },
        { name: "Prismaline", zenithVal: 4, johnVal: 4, nanVal: 4, customVal: 4 },
        { name: "Miramire", zenithVal: 8, johnVal: 10, nanVal: 10, customVal: 8 },
        { name: "Stratocrit", zenithVal: 7, johnVal: 6, nanVal: 5, customVal: 7 },
        { name: "Tantalum", zenithVal: 3.5, johnVal: 4, nanVal: 4, customVal: 3.5 },
      ],
  },

  {
    layerName: "Dread\n[4500m-4999m]",
    background: "linear-gradient(180deg, #cc382f 0%, #ae241e 50%,rgb(92, 10, 9) 100%)",
    layerOres:
      [
        { name: "Nightmica", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
        { name: "Crimstone", zenithVal: 300, johnVal: 70.5, nanVal: 500, customVal: 300 },
        { name: "Horrorstone", zenithVal: 10, johnVal: 11, nanVal: 10, customVal: 10 },
        { name: "Strange Matter", zenithVal: 7, johnVal: 6, nanVal: 7, customVal: 7 },
        { name: "Vermillium", zenithVal: 9, johnVal: 9, nanVal: 7, customVal: 9 },
        { name: "Magnetite", zenithVal: 5, johnVal: 4, nanVal: 7, customVal: 5 },
        { name: "Dark Matter", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10 },
        { name: "Antimatter", zenithVal: 4, johnVal: 12, nanVal: 4, customVal: 4 },
        { name: "Surrenderock", zenithVal: 600, johnVal: 1250, nanVal: 500, customVal: 600 },
        { name: "Iridium", zenithVal: 800, johnVal: 1600, nanVal: 500, customVal: 800 },
      ],
  },

  {
    layerName: "Void\n[5000-5499m]",
    background: "linear-gradient(180deg, #66647c 0%, #212342 100%)",
    layerOres:
      [
        { name: "Vantaslate", zenithVal: 500, johnVal: 900, nanVal: 500, customVal: 500 },
        { name: "Cometite", zenithVal: 6, johnVal: 7, nanVal: 8, customVal: 6 },
        { name: "Adamantite", zenithVal: 3, johnVal: 3, nanVal: 3, customVal: 3 },
        { name: "Eclipsium", zenithVal: 6, johnVal: 6, nanVal: 7, customVal: 6 },
        { name: "Ebonakite", zenithVal: 10, johnVal: 10, nanVal: 8, customVal: 10 },
        { name: "Palladium", zenithVal: 7, johnVal: 6.5, nanVal: 7, customVal: 7 },
        { name: "Neptunium", zenithVal: 6, johnVal: 5, nanVal: 6, customVal: 6 },
        { name: "Void Orb", zenithVal: 7, johnVal: 7, nanVal: 8, customVal: 7 },
        { name: "Nilidust", zenithVal: 8, johnVal: 6.5, nanVal: 8, customVal: 8 },
        { name: "Asthenocrit", zenithVal: 6, johnVal: 6.5, nanVal: 6, customVal: 6 }
      ],
  },

  {
    layerName: "Achrothesi / Whitespace\n[5500-5999m]",
    background: "linear-gradient(45deg, #090724 0%,rgb(255, 255, 255) 100%)",
    layerOres:
      [
        { name: "Kronosilt", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
        { name: "Nilglass", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
        { name: "Kreosyte", zenithVal: 5, johnVal: 8, nanVal: 6, customVal: 5 },
        { name: "Cadmium", zenithVal: 13, johnVal: 12, nanVal: 15, customVal: 13 },
        { name: "Chromium", zenithVal: 10, johnVal: 9, nanVal: 15, customVal: 10 },
        { name: "Null", zenithVal: 14, johnVal: 8, nanVal: 16, customVal: 14 },
        { name: "Geometrium", zenithVal: 6, johnVal: 3.5, nanVal: 7, customVal: 6 },
        { name: "Noise", zenithVal: 5, johnVal: 4, nanVal: 4, customVal: 5 },
        { name: "Inversium", zenithVal: 6, johnVal: 3.5, nanVal: 6, customVal: 6 },
        { name: "Navitalc", zenithVal: 8, johnVal: 8, nanVal: 10, customVal: 8 },
        { name: "Myriroule", zenithVal: 7, johnVal: 5.5, nanVal: 7, customVal: 7 },
        { name: "Argibar", zenithVal: 7, johnVal: 4.5, nanVal: 8, customVal: 7 },
        { name: "Perilium", zenithVal: 2, johnVal: 2, nanVal: 2, customVal: 2 }
      ],
  },

  {
    layerName: "Grayscale\n[6000m-6499m]",
    background: "linear-gradient(180deg,rgb(85, 85, 85) 0%,rgb(187, 187, 187) 100%)",
    layerOres:
      [
        { name: "Gallium", zenithVal: 15, johnVal: 60, nanVal: 15, customVal: 15 },
        { name: "Amnesite", zenithVal: 18, johnVal: 18, nanVal: 15, customVal: 18 },
        { name: "Shadow Quartz", zenithVal: 4, johnVal: 4, nanVal: 4, customVal: 4 },
        { name: "Glowstone", zenithVal: 3, johnVal: 3.5, nanVal: 3, customVal: 3 },
        { name: "Graphene", zenithVal: 6, johnVal: 6, nanVal: 5, customVal: 6 },
        { name: "Quicksilver", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
        { name: "Gray Matter", zenithVal: 6, johnVal: 6, nanVal: 5, customVal: 6 }
      ],
  },

  {
    layerName: "Frigid\n[6500m-6999m]",
    background: "#21b1b7",
    layerOres:
      [
        { name: "Hyfrost", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
        { name: "Larimar", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10 },
        { name: "Frostarium", zenithVal: 10, johnVal: 10, nanVal: 11, customVal: 10 },
        { name: "Anetrium", zenithVal: 14, johnVal: 13.5, nanVal: 15, customVal: 14 },
        { name: "Polarveril", zenithVal: 2.5, johnVal: 2, nanVal: 2, customVal: 2.5 },
        { name: "Cryonine", zenithVal: 4, johnVal: 3.5, nanVal: 3, customVal: 4 },
        { name: "Soimabarium", zenithVal: 8, johnVal: 8, nanVal: 10, customVal: 8 }
      ],
  },

  {
    layerName: "Marine\n[7000m-7499m]",
    background: "#688cde",
    layerOres:
      [
        { name: "Nerolin", zenithVal: 15, johnVal: 12.5, nanVal: 12, customVal: 15 },
        { name: "Tenebris", zenithVal: 8, johnVal: 8, nanVal: 7, customVal: 8 },
        { name: "Yilantibris", zenithVal: 6, johnVal: 6, nanVal: 5, customVal: 6 },
        { name: "Aquamarine", zenithVal: 12, johnVal: 12, nanVal: 12, customVal: 12 },
        { name: "Hydrolyth", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
        { name: "Naquadah", zenithVal: 10, johnVal: 10, nanVal: 9, customVal: 10 },
        { name: "Pearl", zenithVal: 6, johnVal: 6, nanVal: 6, customVal: 6 },
        { name: "Eidoliphyll", zenithVal: 2, johnVal: 2, nanVal: 2, customVal: 2 }
      ],
  },

  {
    layerName: "Cosmic\n[7500m-7999m]",
    background: "linear-gradient(180deg, #ffeca2, #de9126)",
    layerOres:
      [
        { name: "Cosmic Glass", zenithVal: 20, johnVal: 17.5, nanVal: 15, customVal: 20 },
        { name: "Cosmaline", zenithVal: 10, johnVal: 10, nanVal: 11, customVal: 10 },
        { name: "Astratine", zenithVal: 6, johnVal: 6, nanVal: 7, customVal: 6 },
        { name: "Starsteel", zenithVal: 8, johnVal: 8, nanVal: 7, customVal: 8 },
        { name: "Stardust", zenithVal: 6, johnVal: 6, nanVal: 5, customVal: 7 },
        { name: "Endotravine", zenithVal: 7, johnVal: 7, nanVal: 7, customVal: 7 },
      ],
  },

  {
    layerName: "Molten\n[8000m-8499m]",
    background: "linear-gradient(180deg, #991f00, #991f00)",
    layerOres:
      [
        { name: "Nickel", zenithVal: 50, johnVal: 48, nanVal: 50, customVal: 50 },
        { name: "Molten Iron", zenithVal: 16, johnVal: 15.5, nanVal: 15, customVal: 16 },
        { name: "Corium", zenithVal: 9, johnVal: 9, nanVal: 7, customVal: 9 },
        { name: "Cinnabar", zenithVal: 16, johnVal: 16, nanVal: 12, customVal: 16 },
        { name: "Liquid Gold", zenithVal: 16, johnVal: 16, nanVal: 15, customVal: 16 },
        { name: "Pyroscorium", zenithVal: 9, johnVal: 9, nanVal: 7, customVal: 9 },
        { name: "Samarium", zenithVal: 12, johnVal: 16, nanVal: 12, customVal: 12 }
      ],
  },

  {
    layerName: "Serenity\n[8500m-8599m]",
    background: "linear-gradient(180deg, #002321, #002321)",
    layerOres:
      [
        { name: "Bedrock", zenithVal: 1000, johnVal: 2000, nanVal: 500, customVal: 1000 },
        { name: "Yzlafrost", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
        { name: "Jade", zenithVal: 5, johnVal: 5, nanVal: 5, customVal: 5 },
        { name: "Redsteel", zenithVal: 5, johnVal: 5, nanVal: 4, customVal: 5 },
        { name: "Celesteel", zenithVal: 4, johnVal: 4, nanVal: 3, customVal: 5 },
        { name: "Cryoplasm", zenithVal: 5, johnVal: 4, nanVal: 5, customVal: 5 },
        { name: "Andrium", zenithVal: 9, johnVal: 8, nanVal: 9, customVal: 9 },
        { name: "Neutronium", zenithVal: 8, johnVal: 8, nanVal: 10, customVal: 8 },
        { name: "Shadowspec", zenithVal: 2, johnVal: 2, nanVal: 2, customVal: 2 },
        { name: "Spiralium", zenithVal: 3, johnVal: 2.5, nanVal: 2, customVal: 3 },
        { name: "Frozen Nitrogen", zenithVal: 10, johnVal: 11, nanVal: 12, customVal: 10 },
        { name: "Orichalican", zenithVal: 8, johnVal: 8, nanVal: 7, customVal: 8 },
        { name: "Scorched Bedrock", zenithVal: 1000, johnVal: 2000, nanVal: 500, customVal: 1000 }
      ],
  },

  {
    layerName: "Plasma Field\n[8600m-8999m]",
    background: "linear-gradient(180deg, #e38424,rgb(227, 186, 36))",
    layerOres:
      [
        { name: "Plasma", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
        { name: "Pyroplasm", zenithVal: 6, johnVal: 5.5, nanVal: 6, customVal: 6 },
        { name: "Crystalline Plasma", zenithVal: 19, johnVal: 18.5, nanVal: 20, customVal: 19 },
        { name: "Electrium", zenithVal: 6, johnVal: 6, nanVal: 8, customVal: 6 },
        { name: "Infernilus", zenithVal: 7, johnVal: 7.5, nanVal: 9, customVal: 7 },
        { name: "Convectine", zenithVal: 10, johnVal: 10, nanVal: 11, customVal: 10 },
        { name: "Protonium", zenithVal: 9, johnVal: 9, nanVal: 9, customVal: 9 },
        { name: "Galvanium", zenithVal: 6, johnVal: 6, nanVal: 8, customVal: 6 },
        { name: "Ferozium", zenithVal: 1000, johnVal: 2000, nanVal: 500, customVal: 1000 }
      ],
  },

  {
    layerName: "Quantum\n[9000m-9150m]",
    background: "linear-gradient(90deg, #bf3434 0%, #6d45d3 50%, #4264df 72.7%, #293fe7 100%)",
    layerOres:
      [
        { name: "Crystal Photon", zenithVal: 24, johnVal: 10, nanVal: 20, customVal: 24 },
        { name: "Photalizine", zenithVal: 18, johnVal: 7.5, nanVal: 12, customVal: 18 },
        { name: "Gluonium", zenithVal: 2, johnVal: 2.5, nanVal: 2, customVal: 2 },
        { name: "Up Quark", zenithVal: 22, johnVal: 20, nanVal: 20, customVal: 22 },
        { name: "Down Quark", zenithVal: 25, johnVal: 24, nanVal: 20, customVal: 25 },
        { name: "Positron", zenithVal: 25, johnVal: 60.5, nanVal: 20, customVal: 25 },
        { name: "Supermatter", zenithVal: 12, johnVal: 13.5, nanVal: 11, customVal: 12 },
        { name: "Charm Quark", zenithVal: 10, johnVal: 10, nanVal: 11, customVal: 10 },
        { name: "Top Quark", zenithVal: 12, johnVal: 15, nanVal: 10, customVal: 12 },
        { name: "Bottom Quark", zenithVal: 12, johnVal: 15, nanVal: 12, customVal: 12 },
        { name: "Strange Quark", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10 },
      ],
  },

  {
    layerName: "Stability\n[9151m-9170m]",
    background: "linear-gradient(90deg, #acacacff 0%, rgba(255, 255, 255, 1) 50%, rgba(172, 172, 172, 1) 100%)",
    layerOres:
      [
        { name: "Universal Barrier", zenithVal: 1000, johnVal: 2000, nanVal: 500, customVal: 1000 },
        { name: "Rifted Barrier", zenithVal: 6, johnVal: 6, nanVal: 6, customVal: 6 },
        { name: "Fabric", zenithVal: 12, johnVal: 7, nanVal: 15, customVal: 12 },
        { name: "Mavrikine", zenithVal: 7, johnVal: 6, nanVal: 8, customVal: 7 },
        { name: "Irulisteel", zenithVal: 2, johnVal: 2, nanVal: 2, customVal: 2 }
      ],
  },

  {
    layerName: "Planck\n[9171m-9289m]",
    background: "linear-gradient(45deg, rgb(0, 0, 0) 25%,rgb(30, 255, 41) 50%,rgb(0, 0, 0) 75%)",
    layerOres:
      [
        { name: "String", zenithVal: 17, johnVal: 16, nanVal: 15, customVal: 17 },
        { name: "Hadronil", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
        { name: "Axion", zenithVal: 14, johnVal: 13.5, nanVal: 10, customVal: 14 },
        { name: "Graviton", zenithVal: 10, johnVal: 11, nanVal: 9, customVal: 10 },
        { name: "Mesonyte", zenithVal: 8, johnVal: 11, nanVal: 10, customVal: 8 },
        { name: "Tachyon", zenithVal: 8, johnVal: 6.5, nanVal: 4, customVal: 8 },
        { name: "Desmentinum", zenithVal: 10, johnVal: 10, nanVal: 10, customVal: 10 }
      ],
  },

  {
    layerName: "Upper Instability\n[9290m-9999m]",
    background: "linear-gradient(45deg, #ff0000 0%, #460000 25%, rgb(79, 11, 6) 50%, rgb(37, 4, 1) 100%)",
    layerOres:
      [
        { name: "Ailmentin", zenithVal: 750, johnVal: 1500, nanVal: 500, customVal: 750 },
        { name: "Territane", zenithVal: 16, johnVal: 15, nanVal: 15, customVal: 16 },
        { name: "Sinfurmium", zenithVal: 10, johnVal: 10, nanVal: 8, customVal: 10 },
        { name: "Gyrivarium", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
        { name: "Krazmite", zenithVal: 6, johnVal: 7, nanVal: 8, customVal: 6 },
        { name: "Anaxinite", zenithVal: 7, johnVal: 7, nanVal: 8, customVal: 7 },
        { name: "Tendrock", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
        { name: "Dark Energy", zenithVal: 8, johnVal: 8, nanVal: 10, customVal: 8 },
        { name: "Corrodoil", zenithVal: 32, johnVal: 30.5, nanVal: 25, customVal: 32 },
        { name: "Antireal", zenithVal: 5, johnVal: 5, nanVal: 7, customVal: 5 },
        { name: "Hyperium", zenithVal: 9, johnVal: 9, nanVal: 10, customVal: 9 },
        { name: "Thermisine", zenithVal: 13, johnVal: 14, nanVal: 9, customVal: 13 },
        { name: "Alkanite", zenithVal: 1000, johnVal: 1000, nanVal: 500, customVal: 1000 }
      ],
  },

  {
    layerName: "Lower Instability\nGrim 1 | Hive | Grim 2\n[10000m-10634m]",
    background: "linear-gradient(180deg, #3c0703 0%,rgb(39, 4, 2) 100%)",
    layerOres:
      [
        { name: "Grimstone", zenithVal: 2000, johnVal: 2000, nanVal: 1000, customVal: 2000 },
        { name: "Phosphyll", zenithVal: 44, johnVal: 44.5, nanVal: 40, customVal: 44 },
        { name: "Vrimsten", zenithVal: 35, johnVal: 36.5, nanVal: 40, customVal: 35 },
        { name: "Zilithorus", zenithVal: 20, johnVal: 20, nanVal: 20, customVal: 20 },
        { name: "Korundum", zenithVal: 30, johnVal: 50, nanVal: 25, customVal: 30 },
        { name: "Cytosol", zenithVal: 750, johnVal: 750, nanVal: 750, customVal: 750 },
        { name: "Ichor", zenithVal: 8, johnVal: 8.5, nanVal: 7, customVal: 8 },
        { name: "Centriale", zenithVal: 11, johnVal: 11.5, nanVal: 10, customVal: 11 },
        { name: "Neuroplast", zenithVal: 16, johnVal: 16.5, nanVal: 10, customVal: 16 },
        { name: "Trinasine", zenithVal: 9, johnVal: 9, nanVal: 7, customVal: 9 },
        { name: "Adrenilar", zenithVal: 7, johnVal: 7, nanVal: 7, customVal: 7 },
        { name: "Macusmite", zenithVal: 22, johnVal: 22, nanVal: 20, customVal: 22 }
      ],
  },

  {
    layerName: "Murk\n[10635m-10649m]",
    background: "linear-gradient(90deg,rgb(250, 149, 154) 0%,rgb(244, 206, 134) 20%,rgb(167, 159, 252) 60%,rgb(176, 254, 124) 100%)",
    layerOres:
      [
        { name: "Leptonyte", zenithVal: 14, johnVal: 15, nanVal: 13, customVal: 14 },
        { name: "Mezihyrium", zenithVal: 10, johnVal: 9, nanVal: 9, customVal: 10 },
        { name: "Taynalum", zenithVal: 8, johnVal: 10, nanVal: 11, customVal: 9 },
        { name: "Thulinyl", zenithVal: 2, johnVal: 2, nanVal: 2, customVal: 2 }
      ],
  },

  {
    layerName: "Event Horizon\n[10650m-10999m]",
    background: "linear-gradient(90deg, #ccffbe 0%, #b4afff 40%, #f9aaff 60%, #79bae2 100%)",
    layerOres:
      [
        { name: "Solarium", zenithVal: 28, johnVal: 29.5, nanVal: 20, customVal: 28 },
        { name: "Exotic Matter", zenithVal: 45, johnVal: 41.5, nanVal: 30, customVal: 45 },
        { name: "Nebulinite", zenithVal: 11, johnVal: 11.5, nanVal: 10, customVal: 11 },
        { name: "Arkivyll", zenithVal: 11, johnVal: 12, nanVal: 10, customVal: 11 },
        { name: "Chronon", zenithVal: 40, johnVal: 11, nanVal: 30, customVal: 40 },
        { name: "Aurorum", zenithVal: 24, johnVal: 24.5, nanVal: 15, customVal: 25 },
        { name: "Korenil", zenithVal: 12, johnVal: 12, nanVal: 6, customVal: 12 },
        { name: "Stellar Sediment", zenithVal: 2000, johnVal: 2000, nanVal: 1500, customVal: 2000 },
        { name: "Apiastrine", zenithVal: 20, johnVal: 18, nanVal: 15, customVal: 20 }
      ],
  },

  {
    layerName: "Abyss\n[11000m-11349m]",
    background: "linear-gradient(90deg, #deebf8 0%,rgb(83, 94, 218) 72%, #deebf8 100%)",
    layerOres:
      [
        { name: "Abyssal Sludge", zenithVal: 16, johnVal: 16, nanVal: 12, customVal: 16 },
        { name: "Primordian", zenithVal: 25, johnVal: 10.5, nanVal: 25, customVal: 25 },
        { name: "Cosmodium", zenithVal: 4, johnVal: 4.5, nanVal: 4, customVal: 4 },
        { name: "Hexflame", zenithVal: 10, johnVal: 10, nanVal: 8, customVal: 10 },
        { name: "Tetraquark", zenithVal: 9, johnVal: 9.5, nanVal: 7, customVal: 9 },
        { name: "Mauraline", zenithVal: 10, johnVal: 10, nanVal: 8, customVal: 10 }
      ],
  },

  {
    layerName: "Inner Horizon\n[11350m-11749m]",
    background: "linear-gradient(90deg, #d3c3ff,rgb(104, 83, 134), #d3c3ff,rgb(105, 84, 135), #d3c3ff)",
    layerOres:
      [
        { name: "Amperisilt", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
        { name: "Nihinoris", zenithVal: 14, johnVal: 13.5, nanVal: 12, customVal: 14 },
        { name: "Nyrvinoris", zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
        { name: "Revalyte", zenithVal: 8, johnVal: 8, nanVal: 8, customVal: 8 },
        { name: "Infrarian", zenithVal: 5, johnVal: 4.5, nanVal: 4, customVal: 5 },
        { name: "Ultranium", zenithVal: 8, johnVal: 7, nanVal: 8, customVal: 8 },
        { name: "Auricallium", zenithVal: 11, johnVal: 9, nanVal: 9, customVal: 11 },
        { name: "Zeronian", zenithVal: 5, johnVal: 4.5, nanVal: 4, customVal: 5 },
        { name: "Exodian", zenithVal: 9, johnVal: 9, nanVal: 8, customVal: 9 },
        { name: "Unobtainium", zenithVal: 1.0, johnVal: 1.0, nanVal: 1.0, customVal: 1.0 },
        { name: "Lattiglass", zenithVal: 55, johnVal: 80, nanVal: 80, customVal: 55 },
      ],
  },

  {
    layerName: "Quintessence\n[11750m-12199m]",
    background: "linear-gradient(90deg, #ff5cf7, #81b8ff, #6430ff, #ff73b2)",
    layerOres:
      [
        { name: "Etherfilm", zenithVal: 1000, johnVal: 2000, nanVal: 1000, customVal: 1000 },
        { name: "Aetherice", zenithVal: 9, johnVal: 8, nanVal: 6, customVal: 9 },
        { name: "Starniferus", zenithVal: 11, johnVal: 11, nanVal: 8, customVal: 11 },
        { name: "Ethanerite", zenithVal: 11, johnVal: 11, nanVal: 8, customVal: 11 },
        { name: "Lumenyl", zenithVal: 12, johnVal: 11, nanVal: 9, customVal: 12 },
        { name: "Ulirazite", zenithVal: 7, johnVal: 5, nanVal: 6, customVal: 7 },
        { name: "Impervium", zenithVal: 18, johnVal: 19.5, nanVal: 15, customVal: 18 },
        { name: "Kryposilus", zenithVal: 7, johnVal: 7, nanVal: 7, customVal: 7 },
        { name: "Vythusilyte", zenithVal: 9, johnVal: 9, nanVal: 8, customVal: 9 }
      ],
  },

  {
    layerName: "Interstice\n[12200m-12249m]",
    background: "linear-gradient(180deg,#181c28 0%,#1e222f 20%,#30313d 30%,#72728f 50%,#676782 56%,#30313d 75%,#1e222f 85%,#181c28 100%)",
    layerOres:
      [
        { name: "Nethrastine", zenithVal: 1000, johnVal: 200, nanVal: 500, customVal: 1000 },
        { name: "Formicite", zenithVal: 11, johnVal: 8, nanVal: 8, customVal: 11 },
        { name: "Raw Energy", zenithVal: 15, johnVal: 15, nanVal: 12, customVal: 15 },
        { name: "Obliviril", zenithVal: 6, johnVal: 5.5, nanVal: 5, customVal: 6 },
        { name: "Enceladrum", zenithVal: 11, johnVal: 9.5, nanVal: 7, customVal: 11 }
      ],
  },

  {
    layerName: "Essences\nObtained from Wisps",
    background: "linear-gradient(180deg, #ffd0d0 0%, #ffc2a5 20%, #ff5a8e 50%, #6a0028 80%, #580020 100%)",
    layerOres:
      [
        { name: "Essence of the Cosmos" },
        { name: "Essence of the Sun" },
        { name: "Essence of the Void" },
        { name: "Essence of Purity" },
        { name: "Essence of Violence" },
        { name: "Essence of Vitality" },
      ],
  },

  {
    layerName: "Empyrean\n[12250m-12999m]",
    background: "linear-gradient(180deg, #ffd0d0 0%, #ffc2a5 20%, #ff5a8e 50%, #6a0028 80%, #580020 100%)",
    layerOres:
      [
        { name: "Evrasalt", zenithVal: 300, johnVal: 200, nanVal: 250, customVal: 300 },
        { name: "Qylicryst", zenithVal: 6, johnVal: 5, nanVal: 3, customVal: 5 },
        { name: "Kafsium", zenithVal: 30, johnVal: 16, nanVal: 12, customVal: 30 },
        { name: "Zetaslime", zenithVal: 16, johnVal: 15.5, nanVal: 12, customVal: 16 },
        { name: "Ochistrite", zenithVal: 20, johnVal: 19.5, nanVal: 15, customVal: 20 },
        { name: "Reithum", zenithVal: 6, johnVal: 6, nanVal: 6, customVal: 6 },
        { name: "Vorazylith", zenithVal: 8, johnVal: 7.5, nanVal: 5, customVal: 8 },
        { name: "Truth Quark", zenithVal: 9, johnVal: 8.5, nanVal: 6, customVal: 9 },
        { name: "Wish Alloy", zenithVal: 14, johnVal: 13, nanVal: 7, customVal: 14 },
        { name: "Phantasmorite", zenithVal: 9, johnVal: 8.5, nanVal: 5, customVal: 9 },
        { name: "Profelis", zenithVal: 12, johnVal: 11.5, nanVal: 7, customVal: 12 },
        { name: "Ogleum", zenithVal: 8, johnVal: 7, nanVal: 4, customVal: 8 },
        { name: "Protireal", zenithVal: 18, johnVal: 20, nanVal: 14, customVal: 18 },
        { name: "Xerutherum", zenithVal: 7, johnVal: 7.5, nanVal: 4, customVal: 7 },
        { name: "Mesmirian", zenithVal: 14, johnVal: 13, nanVal: 7, customVal: 14 }
      ]
  },
];