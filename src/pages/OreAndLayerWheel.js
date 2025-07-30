import React, { useState, useContext } from 'react';
import { MiscContext } from '../context/MiscContext';
import NavBar from "../components/NavBar";
import { OreIcons } from '../data/OreIcons';
import { LayerGradients } from '../data/LayerGradients';
import missingIcon from "../images/ore-icons/Missing_Texture.webp";
import "../styles/AllGradients.css";
import "../styles/OreAndLayerWheel.css";
import "../styles/LayerTable.css";
import { MiscValueFunctions } from '../components/MiscValueFunctions';

const OreAndLayerWheel = () => {
  const {
    oreValsDict,
    getCurrentCSV,
    currentMode,
    customMultiplier,
    getValueForMode,
    capCompletion,
    valueMode,
  } = useContext(MiscContext);

  const csvData = getCurrentCSV();

  const valueFunctions = MiscValueFunctions({
    csvData: getCurrentCSV(),
    currentMode,
    customMultiplier,
    valueMode,
    getValueForMode,
    oreValsDict,
    capCompletion
  });

  const [selectedOre, setSelectedOre] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [isOreSpinning, setIsOreSpinning] = useState(false);
  const [isLayerSpinning, setIsLayerSpinning] = useState(false);
  const [oreRotation, setOreRotation] = useState(0);
  const [layerRotation, setLayerRotation] = useState(0);

  const allOres = Object.values(oreValsDict).flat();
  const allLayers = Object.keys(LayerGradients);

  const getOreClassName = (oreName) => {
    return `color-template-${oreName.toLowerCase().replace(/ /g, '-')}`;
  };

  const getModeString = () => {
    switch (currentMode) {
      case 1: return "AV";
      case 2: return "UV";
      case 3: return "NV";
      case 4: return "TV";
      case 5: return "SV";
      case 6: return "RV";
      case 7: return "CV";
      default: return "NV";
    }
  };

  const calculateOreCompletion = (ore) => {
    const inventory = csvData[ore.name] || 0;
    const oreValue = valueFunctions.calculateValue(ore);
    const completion = oreValue > 0 
      ? (inventory / oreValue) * 100
      : 0;
    return capCompletion ? Math.min(100, completion) : completion;
  };

  const calculateOreValue = (ore) => {
    const inventory = csvData[ore.name] || 0;
    const oreValue = valueFunctions.calculateValue(ore);
    return oreValue > 0 ? (inventory / oreValue) : 0;
  };

  const getMatchingLayerName = (layerName) => {
    // Find the first key in oreValsDict that includes the layerName
    const matchingKey = Object.keys(oreValsDict).find(key =>
      key.toLowerCase().includes(layerName.toLowerCase())
    );
    return matchingKey || layerName;
  };

  const calculateLayerCompletion = (layerName) => {
    const exactLayerName = getMatchingLayerName(layerName);
    const layerOres = oreValsDict[exactLayerName] || [];
    let totalCompletion = 0;
    let itemCount = 0;

    layerOres.forEach(ore => {
      const completion = calculateOreCompletion(ore) / 100;
      if (!isNaN(completion)) {
        totalCompletion += completion;
        itemCount++;
      }
    });

    return itemCount > 0 
      ? ((totalCompletion / itemCount) * 100).toFixed(2)
      : 0;
  };

  const calculateLayerValue = (layerName) => {
    const exactLayerName = getMatchingLayerName(layerName);
    const layerOres = oreValsDict[exactLayerName] || [];
    let totalValue = 0;

    layerOres.forEach(ore => {
      const value = calculateOreValue(ore);
      if (!isNaN(value)) {
        totalValue += value;
      }
  });

    return parseFloat(totalValue.toFixed(2));
  };

  const spinOreWheel = () => {
    if (isOreSpinning) return;

    setIsOreSpinning(true);
    setSelectedOre(null);

    const spins = 3 + Math.floor(Math.random() * 5);
    const segments = allOres.length;
    const segmentAngle = 360 / segments;
    const randomSegment = Math.floor(Math.random() * segments);
    const totalRotation = oreRotation + spins * 360 + (segmentAngle * randomSegment);

    setOreRotation(totalRotation);

    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const segmentIndex = Math.floor(normalizedRotation / segmentAngle);
      const selectedIndex = (allOres.length - segmentIndex) % allOres.length;
      const selectedOre = allOres[selectedIndex];

      setSelectedOre(selectedOre);
      setIsOreSpinning(false);
    }, 5000);
  };

  const spinLayerWheel = () => {
    if (isLayerSpinning) return;

    setIsLayerSpinning(true);
    setSelectedLayer(null);

    const spins = 3 + Math.floor(Math.random() * 5);
    const segments = allLayers.length;
    const segmentAngle = 360 / segments;
    const randomSegment = Math.floor(Math.random() * segments);
    const totalRotation = layerRotation + spins * 360 + (segmentAngle * randomSegment);

    setLayerRotation(totalRotation);

    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const segmentIndex = Math.floor(normalizedRotation / segmentAngle);
      const selectedIndex = (allLayers.length - segmentIndex) % allLayers.length;
      const selectedLayer = allLayers[selectedIndex];
      
      setSelectedLayer(selectedLayer);
      setIsLayerSpinning(false);
    }, 5000);
  };

  const OreWheelSlice = ({ ore, index, totalSlices }) => {
    const sliceAngle = 360 / totalSlices;
    const rotate = index * sliceAngle;
    const skew = 90 - sliceAngle;

    return (
      <div
        className={`wheel-slice ${getOreClassName(ore.name)}`}
        style={{
          position: 'absolute',
          width: '50%',
          height: '50%',
          left: '50%',
          top: '50%',
          transformOrigin: '0% 0%',
          transform: `rotate(${rotate}deg) skewY(${skew}deg)`,
          overflow: 'hidden',
        }}
      >
      </div>
    );
  };

  const LayerWheelSlice = ({ layer, index, totalSlices }) => {
    const sliceAngle = 360 / totalSlices;
    const rotate = index * sliceAngle;
    const skew = 90 - sliceAngle;

    return (
      <div
        className="wheel-slice"
        style={{
          position: 'absolute',
          width: '50%',
          height: '50%',
          left: '50%',
          top: '50%',
          transformOrigin: '0% 0%',
          transform: `rotate(${rotate}deg) skewY(${skew}deg)`,
          overflow: 'hidden',
          background: LayerGradients[layer].background,
        }}
      >
      </div>
    );
  };

  return (
    <>
      <NavBar />
      <div className="ore-spinner-container">
        <div className='csv-usage'><h1 style={{marginLeft: "35px"}}>Ore & Layer Spinner Wheels</h1></div>
        <div className='csv-usage' style={{marginBottom: "15px"}}>
            <h1 style={{marginLeft: "35px"}}>Ore Wheel</h1>
        </div>
        <div className="wheels-wrapper">
          {/* Ore Wheel */}
          <div className="wheel-container">
            <div className="selector-arrow"></div>
            <div className="wheel-wrapper">
              {selectedOre && (
                <div className="selected-ore">
                  <button
                    className="close-button"
                    onClick={() => setSelectedOre(null)}
                  >
                    ×
                  </button>
                  <h3>Selected Ore:</h3>
                  <div className={`selected-ore-display ${getOreClassName(selectedOre.name)}`}>
                    {OreIcons[selectedOre.name.replace(/ /g, '_')] ? (
                      <img
                        src={OreIcons[selectedOre.name.replace(/ /g, '_')]}
                        alt={`${selectedOre.name} icon`}
                        className="ore-icon"
                      />
                    ) : (
                      <img
                        src={missingIcon}
                        alt={"Missing icon"}
                        className="ore-icon"
                      />
                    )}
                    <span>{selectedOre.name}</span>
                  </div>
                  <div className="ore-stats">
                    <div>
                      <strong>{getModeString()} Completion:</strong> {calculateOreCompletion(selectedOre).toFixed(2)}%
                    </div>
                    <div>
                      <strong>Total {getModeString()}s:</strong> {calculateOreValue(selectedOre).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
              <div className="wheel-outer">
                <div
                  className="wheel"
                  style={{ transform: `rotate(${oreRotation + 180}deg)` }}
                >
                  {allOres.map((ore, index) => (
                    <OreWheelSlice 
                      key={ore.name}
                      ore={ore}
                      index={index}
                      totalSlices={allOres.length}
                    />
                  ))}
                </div>
                <button
                  className="spin-button"
                  onClick={spinOreWheel}
                  disabled={isOreSpinning}
                >
                  {isOreSpinning ? '...' : 'SPIN'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='csv-usage'><h1 style={{marginLeft: "35px"}}>Layer Wheel</h1></div>
        <div className="ore-spinner-container">
          {/* Layer Wheel */}
          <div className="wheel-container">
            <div className="selector-arrow"></div>
            <div className="wheel-wrapper">
              {selectedLayer && (
                <div className="selected-ore">
                  <button 
                    className="close-button" 
                    onClick={() => setSelectedLayer(null)}
                  >
                    ×
                  </button>
                  <h3>Selected Layer:</h3>
                  <div 
                    className="selected-ore-display" 
                    style={{ background: LayerGradients[selectedLayer].background }}
                  >
                    <span>{selectedLayer}</span>
                  </div>
                  <div className="ore-stats">
                    <div>
                      <strong>Completion:</strong> {calculateLayerCompletion(selectedLayer)}%
                    </div>
                    <div>
                      <strong>Total {getModeString()}s:</strong> {calculateLayerValue(selectedLayer)}
                    </div>
                  </div>
                </div>
              )}
              <div className="wheel-outer">
                <div
                  className="wheel"
                  style={{ transform: `rotate(${layerRotation + 180}deg)` }}
                >
                  {allLayers.map((layer, index) => (
                    <LayerWheelSlice
                      key={layer}
                      layer={layer}
                      index={index}
                      totalSlices={allLayers.length}
                    />
                  ))}
                </div>
                <button
                  className="spin-button"
                  onClick={spinLayerWheel}
                  disabled={isLayerSpinning}
                >
                  {isLayerSpinning ? '...' : 'SPIN'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OreAndLayerWheel;