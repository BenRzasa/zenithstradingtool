import React, { useState, useContext, useMemo, useCallback } from 'react';
import { Wheel } from 'react-custom-roulette';
import { MiscContext } from '../context/MiscContext';
import { useWheel } from '../context/WheelContext';
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
    valueMode,
    capCompletion
  } = useContext(MiscContext);

  const { settings, updateSetting } = useWheel();

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

  // Wheel state
  const [selectedOre, setSelectedOre] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [mustSpinOre, setMustSpinOre] = useState(false);
  const [mustSpinLayer, setMustSpinLayer] = useState(false);
  const [orePrizeNumber, setOrePrizeNumber] = useState(0);
  const [layerPrizeNumber, setLayerPrizeNumber] = useState(0);

  const layerColors = ['#8A2BE2', '#5F9EA0', '#D2691E', '#6495ED', '#DC143C', '#006400'];

  const getMatchingLayerName = useCallback((layerName) => {
    const matchingKey = Object.keys(oreValsDict).find(key =>
      key.toLowerCase().includes(layerName.toLowerCase())
    );
    return matchingKey || layerName;
  }, [oreValsDict]);

  const calculateOreCompletion = useCallback((ore) => {
    const inventory = csvData[ore.name] || 0;
    const oreValue = valueFunctions.calculateValue(ore);
    const completion = oreValue > 0 ? (inventory / oreValue) * 100 : 0;
    return capCompletion ? Math.min(100, completion) : completion;
  }, [csvData, valueFunctions, capCompletion]);

  const calculateLayerCompletion = useCallback((layerName) => {
    const exactLayerName = getMatchingLayerName(layerName);
    const layerOres = oreValsDict[exactLayerName] || [];

    let totalCompletion = 0;
    let countedOres = 0;

    layerOres.forEach(ore => {
      const value = valueFunctions.calculateValue(ore);
      if (value > 0) {
        const completion = calculateOreCompletion(ore) / 100;
        totalCompletion += completion;
        countedOres++;
      }
    });

    return countedOres > 0 ? (totalCompletion / countedOres) * 100 : 0;
  }, [getMatchingLayerName, oreValsDict, valueFunctions, calculateOreCompletion]);
  const calculateOreValue = useCallback((ore) => {

    const inventory = csvData[ore.name] || 0;
    const oreValue = valueFunctions.calculateValue(ore);
    return oreValue > 0 ? (inventory / oreValue) : 0;
  }, [csvData, valueFunctions]);

  const calculateLayerValue = useCallback((layerName) => {
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
  }, [getMatchingLayerName, oreValsDict, calculateOreValue]);

  const getFilteredOres = useCallback(() => {
    let ores = Object.values(oreValsDict).flat();

    if (!settings.includeOreRaresAndTrueRares) {
      const rareOres = [
        ...(oreValsDict['Rares\nMore Common Than 1/33,333'] || []),
        ...(oreValsDict['True Rares\n1/33,333 or Rarer'] || []),
        ...(oreValsDict['Uniques\nNon-Standard Obtainment'] || []),
        ...(oreValsDict['Compounds\nCrafted via Synthesis'] || []),
        ...(oreValsDict['Essences\nObtained from Wisps [UNTRADABLE]'] || [])
      ].map(ore => ore.name);

      ores = ores.filter(ore => !rareOres.includes(ore.name));
    }

    if (settings.useCustomList) {
      const customOresArray = settings.customOreList.split(',')
        .map(ore => ore.trim())
        .filter(ore => ore !== '');

      if (customOresArray.length > 0) {
        ores = ores.filter(ore => customOresArray.includes(ore.name));
      }
    }

    // Modified completion filtering to use current value mode
    if (!settings.includeOver100Completion) {
      ores = ores.filter(ore => {
        const completion = calculateOreCompletion(ore);
        return completion < 100;
      });
    }

    return ores;
  }, [
    oreValsDict,
    settings.includeOreRaresAndTrueRares,
    settings.useCustomList,
    settings.customOreList,
    settings.includeOver100Completion,
    calculateOreCompletion
  ]);

  const getFilteredLayers = useCallback(() => {
    let layers = Object.keys(LayerGradients);
    if (!settings.includeRaresAndTrueRares) {
      layers = layers.filter(layer => ![
        'Rares',
        'True Rares',
        'Uniques',
        'Essences',
        'Compounds'
      ].includes(layer));
    }
    if (!settings.includeOver100LayerCompletion) {
      layers = layers.filter(layer => {
        const completion = calculateLayerCompletion(layer);
        return completion < 100;
      });
    }
    return layers;
  }, [
    settings.includeRaresAndTrueRares,
    settings.includeOver100LayerCompletion,
    calculateLayerCompletion
  ]);

  const allOres = useMemo(getFilteredOres, [
    oreValsDict,
    settings.includeOreRaresAndTrueRares,
    settings.useCustomList,
    settings.customOreList,
    settings.includeOver100Completion,
    calculateOreCompletion,
    getFilteredOres,
  ]);

  const allLayers = useMemo(getFilteredLayers, [
    getFilteredOres,
    settings.includeRaresAndTrueRares,
    settings.includeOver100LayerCompletion,
    calculateLayerCompletion,
    getFilteredLayers,
  ]);

  const getOreColor = (oreName) => {
    const tempEl = document.createElement('div');
    const className = `color-template-${oreName.toLowerCase().replace(/ /g, '-')}`;
    tempEl.className = className;
    document.body.appendChild(tempEl);
    // First try to get the CSS variable
    const wheelColor = getComputedStyle(tempEl).getPropertyValue('--wheel-color').trim();
    // If --wheel-color exists, use it
    if (wheelColor && wheelColor !== '') {
      document.body.removeChild(tempEl);
      return wheelColor;
    }
    // Otherwise get the computed background color
    const bgColor = getComputedStyle(tempEl).backgroundColor;
    document.body.removeChild(tempEl);
    // Fallback to a default color if needed
    if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
      return '#cccccc';
    }
    return bgColor;
  };


  const getLayerColor = (layerName) => {
    const gradient = LayerGradients[layerName]?.background;
    // First try to get CSS variable if it exists
    const tempEl = document.createElement('div');
    tempEl.style.background = gradient || '';
    document.body.appendChild(tempEl);
    const wheelColor = getComputedStyle(tempEl).getPropertyValue('--wheel-color').trim();
    document.body.removeChild(tempEl);
    if (wheelColor && wheelColor !== '') return wheelColor;
    // Extract first color from gradient
    if (gradient && gradient.includes('gradient')) {
      const colorMatch = gradient.match(/#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)/);
      return colorMatch ? colorMatch[0] : '#333333';
    }
    // Solid color fallback
    return gradient || '#333333';
  };

  const getTextColorForBackground = (bgColor) => {
    if (bgColor.startsWith('var(') || bgColor.includes('gradient')) {
      return '#ffffff';
    }
    let r, g, b;

    // Handle hex colors
    if (bgColor.startsWith('#')) {
      const hex = bgColor.substring(1);
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else {
        return '#ffffff';
      }
    }

    else if (bgColor.startsWith('rgb')) {
      const match = bgColor.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
      } else {
        return '#ffffff';
      }
    } else {
      return '#ffffff';
    }

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const oreWheelData = useMemo(() => {
    if (!allOres || allOres.length === 0) {
      return [{
        option: 'No ores',
        style: { backgroundColor: '#cccccc', textColor: '#000000' }
      }];
    }
    return allOres.map(ore => {
      const bgColor = getOreColor(ore.name);
      return {
        option: ore.name,
        style: {
          backgroundColor: bgColor,
          textColor: getTextColorForBackground(bgColor)
        }
      };
    });
  }, [allOres]);

  const layerWheelData = useMemo(() => {
    if (!allLayers || allLayers.length === 0) {
      return [{
        option: 'No layers available',
        style: { backgroundColor: '#cccccc', textColor: '#000000' }
      }];
    }
    return allLayers.map(layer => {
      const bgColor = getLayerColor(layer);
      return {
        option: layer,
        style: {
          backgroundColor: bgColor,
          textColor: getTextColorForBackground(bgColor)
        }
      };
    });
  }, [allLayers]);

  const spinOreWheel = () => {
    if (!oreWheelData || oreWheelData.length === 0) {
      return;
    }
    
    const newPrizeNumber = Math.floor(Math.random() * oreWheelData.length);
    setOrePrizeNumber(newPrizeNumber);
    setMustSpinOre(true);
    setSelectedOre(null);
  };

  const spinLayerWheel = () => {
    if (!layerWheelData || layerWheelData.length === 0) {
      return;
    }
    
    const newPrizeNumber = Math.floor(Math.random() * layerWheelData.length);
    setLayerPrizeNumber(newPrizeNumber);
    setMustSpinLayer(true);
    setSelectedLayer(null);
  };

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

  const handleOreSpinStop = () => {
    setMustSpinOre(false);
    setSelectedOre(allOres[orePrizeNumber]);
  };

  const handleLayerSpinStop = () => {
    setMustSpinLayer(false);
    setSelectedLayer(allLayers[layerPrizeNumber]);
  };

  const calculateFontSize = (numOres) => {
    const MAX_FONT_SIZE = 15;
    const MIN_FONT_SIZE = 5;
    const SCALING_FACTOR = 1.1;
    let scaledSize = 0;
    if(numOres > 50) {
      scaledSize = MAX_FONT_SIZE - (Math.log(numOres) * 2);
    } else {
      scaledSize = MAX_FONT_SIZE - (Math.log(numOres) * SCALING_FACTOR)
    }

    return Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, scaledSize));
  };

  const calculateTextDistance = (numOres) => {
    if(numOres > 50) {
      return 85
    }
    return Math.max(30, 78 - (numOres * 0.3));
  };

  const handleCustomListBlur = (e) => {
    const value = e.target.value.trim();

    if (settings.useCustomList && (!value || value.split(',').every(item => !item.trim()))) {
      updateSetting('useCustomList', false); // Disable custom list if invalid
    }
  };

return (
  <>
    <NavBar />
    <div className="ore-spinner-container">
    <div style={{display: "flex", flexDirection: "column"}}>
      {/* Ore Wheel Section */}
      <div className='csv-usage' style={{ 
        paddingLeft: '15px',
        display: 'flex',
        fontSize: '25px',
        flexDirection: 'column',
        gap: '10px',
        paddingBottom: '20px',
        margin: '0 auto',
        marginBottom: '-10vh',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1>Ore Wheel</h1>
          <button
            className="spin-button"
            onClick={spinOreWheel}
            disabled={mustSpinOre || allOres.length === 0}
          >
            {mustSpinOre ? '...' : 'SPIN'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <label>
            <input
              type="checkbox"
              checked={settings.useCustomList}
              onChange={(e) => updateSetting('useCustomList', e.target.checked)}
            />
            Use Custom Ore List:
          </label>
        </div>
        {settings.useCustomList && (
          <textarea
            value={settings.customOreList}
            onChange={(e) => updateSetting('customOreList', e.target.value)}
            onBlur={handleCustomListBlur}
            placeholder="Enter ores separated by commas"
            style={{ 
              width: '350px',
              height: '100px',
              padding: '5px',
              marginRight: '15px',
              textAlign: 'left',
              resize: 'none',
              overflow: 'auto',
              direction: 'rtl',
              unicodeBidi: 'plaintext',
              boxSizing: 'border-box'
            }}
          />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <label>
            <input
              type="checkbox"
              checked={settings.includeOver100Completion}
              onChange={(e) => updateSetting('includeOver100Completion', e.target.checked)}
            />
            Include Over 100% Completion
          </label>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <label>
            <input
              type="checkbox"
              checked={settings.includeOreRaresAndTrueRares}
              onChange={(e) => updateSetting('includeOreRaresAndTrueRares', e.target.checked)}
            />
            Include Rares, True Rares,
            <br></br>Compounds, Uniques, & Essences
          </label>
        </div>
      </div>
      <div className="wheel-container">
        {selectedOre && (
          <div className="selected-ore">
            <button className="close-button" onClick={() => setSelectedOre(null)}>
              ×
            </button>
            <h3>Selected Ore:</h3>
            <div className={`selected-ore-display ${getOreClassName(selectedOre.name)}`}>
              <img
                src={OreIcons[selectedOre.name.replace(/ /g, '_')] || missingIcon}
                alt={`${selectedOre.name} icon`}
                className="ore-icon"
              />
              <span>{selectedOre.name}</span>
            </div>
            <div className="ore-stats">
              <div>
                <strong>{getModeString()} Completion:</strong> {calculateOreCompletion(selectedOre).toFixed(2)}%
              </div>
              <div>
                <strong>Total {getModeString()}s:</strong> {calculateOreValue(selectedOre).toFixed(2)}
              </div>
              <div>
                <strong># in Inventory:</strong> {csvData[selectedOre.name] || 0}
              </div>
            </div>
          </div>
        )}
          <Wheel
            mustStartSpinning={mustSpinOre}
            prizeNumber={orePrizeNumber}
            data={oreWheelData}
            onStopSpinning={handleOreSpinStop}
            textColors={['#ffffff']}
            fontSize={calculateFontSize(allOres.length)}
            textDistance={calculateTextDistance(allOres.length)}
            innerRadius={25}
            outerBorderWidth={5}
            innerBorderWidth={5}
            radiusLineWidth={1}
            spinDuration={0.7}
            perpendicularText={false}
          />
      </div>
      </div>
      <div style={{display: "flex", flexDirection: "column"}}>
      {/* Layer Wheel Section */}
      <div className='csv-usage' style={{ 
        paddingLeft: '15px',
        display: 'flex',
        fontSize: '25px',
        flexDirection: 'column',
        gap: '8px',
        paddingBottom: '20px',
        margin: '0 auto',
        marginBottom: '-10vh',
        marginTop: '-1vh'
      }}>
        <h1>Layer Wheel</h1>
        <label>
          <input
            type="checkbox"
            checked={settings.includeOver100LayerCompletion}
            onChange={(e) => updateSetting('includeOver100LayerCompletion', e.target.checked)}
          />
          Include Over 100% Completion
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.includeRaresAndTrueRares}
            onChange={(e) => updateSetting('includeRaresAndTrueRares', e.target.checked)}
          />
          Include Rares, True Rares,
          <br></br>Compounds, Uniques, & Essences
        </label>
        <button
          className="spin-button"
          onClick={spinLayerWheel}
          disabled={mustSpinLayer || allLayers.length === 0}
        >
          {mustSpinLayer ? '...' : 'SPIN'}
        </button>
      </div>

      <div className="wheel-container">
        {selectedLayer && (
          <div className="selected-ore">
            <button className="close-button" onClick={() => setSelectedLayer(null)}>
              ×
            </button>
            <h3>Selected Layer:</h3>
            <div className="selected-ore-display" style={{ background: LayerGradients[selectedLayer]?.background }}>
              <span>{selectedLayer}</span>
            </div>
            <div className="ore-stats">
              <div>
                <strong>{getModeString()} Completion:</strong> {calculateLayerCompletion(selectedLayer).toFixed(2)}%
              </div>
              <div>
                <strong>Total {getModeString()}s:</strong> {calculateLayerValue(selectedLayer).toFixed(2)}
              </div>
            </div>
          </div>
        )}
        <Wheel
          mustStartSpinning={mustSpinLayer}
          prizeNumber={layerPrizeNumber}
          data={layerWheelData}
          backgroundColors={layerColors}
          textColors={['#ffffff']}
          fontSize={14}
          textDistance={65}
          innerRadius={25}
          outerBorderWidth={5}
          innerBorderWidth={5}
          radiusLineWidth={1}
          spinDuration={0.7}
          perpendicularText={false}
          onStopSpinning={handleLayerSpinStop}
        />
      </div>
      </div>
    </div>
  </>
);

};
export default OreAndLayerWheel;