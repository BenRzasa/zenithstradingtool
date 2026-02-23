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

export const oreValuesStructure = [
    {
        layerName: "True Rares\n1/33,333 or Rarer",
        background: "linear-gradient(135deg, #fdfcef 0%, #d3f8f8 20%, #faedfd 30%, #f2caff 37.5%, #ffffff 50%, #ffd9a1 62.5%, #edebd6 70%, #ecf9df 80%, #b7dce1 100%)",
        layerOres: [] 
    },
    {
        layerName: "Rares\nMore Common Than 1/33,333",
        background: "linear-gradient(90deg, #ffcc66 0%, #f9f575 20%, #f07f53 42.2%, #ec82ff 80%, #b050eb 100%)",
        layerOres: [] 
    },
    {
        layerName: "Uniques\nNon-Standard Obtainment",
        background: "linear-gradient(112deg, #ffaa6e 0%, #ffa82e 17.8%, #ffdea9 27.9%, #dd7226 35.6%, #8b263d 51.6%, #dc672e 71.8%, #f8e3b6 80%, #f0b657 87.4%, #7e262c 100%)",
        layerOres: [] 
    },
    {
        layerName: "Compounds\nCrafted via Synthesis",
        background: "linear-gradient(90deg,#1035ad 0%, #346fc0 10%, #a0e8f1 22.5%, #d7fcff 35%, #f7ebff 42.5%, #fefcfc 50%, #f7ebff 57.5%, #fef7cf 65%, #f5c97c 80%, #703664 100%)",
        layerOres: [] 
    },
    {
        layerName: "Surface / Shallow\n[0m-74m]",
        background: "linear-gradient(180deg, rgb(110, 158, 96) 0%,rgb(160, 160, 160) 100%)",
        layerOres: [] 
    },
    {
        layerName: "Caverns / Dusk\n[75m-299m | 300m-599m]",
        background: "linear-gradient(180deg, #dad2c3 0%, #b6c2ec 100%)",
        layerOres: [] 
    },
    {
        layerName: "Shade\n[600m-999m]",
        background: "linear-gradient(180deg, #7b94ef 0%, #464d7d 100%",
        layerOres: [] 
    },
    {
        layerName: "Mystic / Shimmer\n[1000m-1299mm | 1300m-1699m]",
        background: "linear-gradient(45deg, #6c89e7 50%, #947ffc 100%)",
        layerOres: [] 
    },
    {
        layerName: "Arid\n[1700m-1999m]",
        background: "#ebc56b",
        layerOres: [] 
    },
    {
        layerName: "Igneous / Mantle\n[2000m-2199m | 2200m-2499m]",
        background: "linear-gradient(45deg, #e55f5f 0%, #d63636 100%)",
        layerOres: [] 
    },
    {
        layerName: "Volatile\n[2500-2999m]",
        background: "linear-gradient(90deg, #a51919 0%, #ff9721 50%, #a51919 100%)",
        layerOres: [] 
    },
    {
        layerName: "Caustic\n[3000m-3499m]",
        background: "#24a510",
        layerOres: [] 
    },
    {
        layerName: "Soulscape\n[3500-3999m]",
        background: "linear-gradient(180deg, #50ffe2 0%, #acdfff 25%, #ffffff 50%, #acdfff 75%, #50ffe2 100%)",
        layerOres: [] 
    },
    {
        layerName: "Mirage\n[4000m-4499m]",
        background: "#b06cda",
        layerOres: [] 
    },
    {
        layerName: "Dread\n[4500m-4999m]",
        background: "linear-gradient(180deg, #cc382f 0%, #ae241e 50%,rgb(92, 10, 9) 100%)",
        layerOres: [] 
    },
    {
        layerName: "Void\n[5000-5499m]",
        background: "linear-gradient(180deg, #66647c 0%, #212342 100%)",
        layerOres: [] 
    },
    {
        layerName: "Achrothesi / Whitespace\n[5500-5999m]",
        background: "linear-gradient(45deg, #090724 0%,rgb(255, 255, 255) 100%)",
        layerOres: [] 
    },
    {
        layerName: "Grayscale\n[6000m-6499m]",
        background: "linear-gradient(180deg,rgb(85, 85, 85) 0%,rgb(187, 187, 187) 100%)",
        layerOres: [] 
    },
    {
        layerName: "Frigid\n[6500m-6999m]",
        background: "#21b1b7",
        layerOres: [] 
    },
    {
        layerName: "Marine\n[7000m-7499m]",
        background: "#688cde",
        layerOres: [] 
    },
    {
        layerName: "Cosmic\n[7500m-7999m]",
        background: "linear-gradient(180deg, #ffeca2, #de9126)",
        layerOres: [] 
    },
    {
        layerName: "Molten\n[8000m-8499m]",
        background: "linear-gradient(180deg, #991f00, #991f00)",
        layerOres: [] 
    },
    {
        layerName: "Serenity\n[8500m-8599m]",
        background: "linear-gradient(180deg, #002321, #002321)",
        layerOres: [] 
    },
    {
        layerName: "Plasma Field\n[8600m-8999m]",
        background: "linear-gradient(180deg, #e38424,rgb(227, 186, 36))",
        layerOres: [] 
    },
    {
        layerName: "Quantum\n[9000m-9150m]",
        background: "linear-gradient(90deg, #bf3434 0%, #6d45d3 50%, #4264df 72.7%, #293fe7 100%)",
        layerOres: [] 
    },
    {
        layerName: "Stability\n[9151m-9170m]",
        background: "linear-gradient(90deg, #acacacff 0%, rgba(255, 255, 255, 1) 50%, rgba(172, 172, 172, 1) 100%)",
        layerOres: [] 
    },
    {
        layerName: "Planck\n[9171m-9289m]",
        background: "linear-gradient(45deg, rgb(0, 0, 0) 25%,rgb(30, 255, 41) 50%,rgb(0, 0, 0) 75%)",
        layerOres: [] 
    },
    {
        layerName: "Upper Instability\n[9290m-9999m]",
        background: "linear-gradient(45deg, #ff0000 0%, #460000 25%, rgb(79, 11, 6) 50%, rgb(37, 4, 1) 100%)",
        layerOres: [] 
    },
    {
        layerName: "Lower Instability\nGrim | Hive | Lower Grim \n[10000m-10634m]",
        background: "linear-gradient(90deg, #fff36f 0%, #ff8113 50%, #fff36f 100%)",
        layerOres: [] 
    },
    {
        layerName: "Murk\n[10635m-10649m]",
        background: "linear-gradient(90deg,rgb(250, 149, 154) 0%,rgb(244, 206, 134) 20%,rgb(167, 159, 252) 60%,rgb(176, 254, 124) 100%)",
        layerOres: [] 
    },
    {
        layerName: "Event Horizon\n[10650m-10999m]",
        background: "linear-gradient(90deg, #ccffbe 0%, #b4afff 40%, #f9aaff 60%, #79bae2 100%)",
        layerOres: [] 
    },
    {
        layerName: "Abyss\n[11000m-11349m]",
        background: "linear-gradient(90deg, #61469c 0%, #f6f2ff 50%, #61469c 100%)",
        layerOres: [] 
    },
    {
        layerName: "Inner Horizon\n[11350m-11749m]",
        background: "linear-gradient(90deg, #d3c3ff,rgb(104, 83, 134), #d3c3ff,rgb(105, 84, 135), #d3c3ff)",
        layerOres: [] 
    },
    {
        layerName: "Quintessence\n[11750m-12199m]",
        background: "linear-gradient(95deg, #362ca3 0%, #ff63e2 20%, #939eff 35%, #9bfdff 50%, #9f87ff 62.1%, #e062ff 75%, #9c46ff 85%, #221856 100%)",
        layerOres: [] 
    },
    {
        layerName: "Interstice\n[12200m-12249m]",
        background: "linear-gradient(180deg,#181c28 0%,#1e222f 20%,#30313d 30%,#72728f 50%,#676782 56%,#30313d 75%,#1e222f 85%,#181c28 100%)",
        layerOres: [] 
    },
    {
        layerName: "Essences\nObtained from Wisps",
        background: "linear-gradient(180deg, #ffd0d0 0%, #ffc2a5 20%, #ff5a8e 50%, #6a0028 80%, #580020 100%)",
        layerOres: [] 
    },
    {
        layerName: "Empyrean\n[12250m-12999m]",
        background: "linear-gradient(180deg, #ffd0d0 0%, #ffc2a5 20%, #ff5a8e 50%, #6a0028 80%, #580020 100%)",
        layerOres: [] 
    },
];
