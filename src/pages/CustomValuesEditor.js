/* ZTT | Custom Value Editor Page
  - Allows the user to customize a full set of values in table form
  - Results in a custom value dictionary in similar format to the John and NAN dicts
  - Can be exported (and later, imported), to save for later
  - Can be reset to NAN or John's default values
  - Saving or cancelling will result in immediate navigation to the Value Chart page
*/

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MiscContext } from '../context/MiscContext';
import NavBar from '../components/NavBar';

import { LayerGradients } from '../data/LayerGradients';
import { OreIcons } from '../data/OreIcons';

import '../styles/CustomValuesEditor.css';
import '../styles/AllGradients.css';
import '../styles/LayerTable.css';

function CustomValuesEditor() {
  const navigate = useNavigate();
  const {
    oreValsDict,
    setOreValsDict,
    setValueMode,
    resetCustomValues,
  } = useContext(MiscContext);

  const [localValues, setLocalValues] = useState({});

  // Change the custom value in the dictionary
  const handleValueChange = (layer, oreName, newValue) => {
    setOreValsDict(prev => {
      const newDict = {...prev};
      const layerIndex = Object.keys(newDict).indexOf(layer);
      if (layerIndex >= 0) {
        // Find the ore based on the layer and name, then set the customVal
        const oreIndex = newDict[layer].findIndex(o => o.name === oreName);
        if (oreIndex >= 0) {
          let decimalValue = 0;
          // Check if the input is a fraction (contains '/')
          if (newValue.includes('/')) {
            const [numerator, denominator] = newValue.split('/').map(Number);
            if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
              decimalValue = numerator / denominator;
            }
          } else {
            // Handle regular number input
            decimalValue = parseFloat(newValue) || 0;
          }
          newDict[layer][oreIndex] = {
            ...newDict[layer][oreIndex],
            customVal: decimalValue
          };
        }
      }
      return newDict;
    });
  };

  // Save the new dictionary
  const handleSave = () => {
    setValueMode('custom');
    window.alert("Custom values successfully saved!")
    navigate('/valuechart');
  };

  // Handle cancellation (navigate 1 page backward -> Value Chart)
  const handleCancel = () => {
    navigate(-1);
  };

  // Handle resetting of the dictionary
  const handleReset = (source) => {
    if (window.confirm(`Reset all values to ${source.toUpperCase()} values? This cannot be undone.`)) {
      resetCustomValues(source);
    }
  };

  // Function to generate the className based on ore name
  const getOreClassName = (oreName) => {
    return `color-template-${oreName.toLowerCase().replace(/ /g, '-')}`;
  };

  return (
    <>
    <NavBar />
    <div className="custom-editor">
      <h1>Custom Values Editor</h1>
      <h2>Usage Instructions:</h2>
      <ul>
        <li>Here, you can customize values to your heart's content</li>
        <li>First, find the ore you want, then change the "/AV" (ore per AV) number</li>
        <li>Something like "0.001" means that the ore is worth 1000 Ambrosine
          This can be determined by "1 / 0.001" </li>
        <li>When you're done customizing values, click "Save Changes" to set
          the values and navigate back to the value chart page</li>
        <li>If you make a mistake, or want to start over, click one of the two
          reset buttons, then click to confirm</li>
      </ul>
      <div className="editor-controls">
        {/* Reset buttons for different value sources */}
        <div className="reset-buttons">
          <button onClick={() => handleReset('zenith')} className="color-template-torn-fabric">
            Reset to Zenith's Values
          </button>
          <button onClick={() => handleReset('nan')} className="color-template-diamond">
            Reset to NAN's Values
          </button>
          <button onClick={() => handleReset('john')} className="color-template-pout">
            Reset to John's Values
          </button>
        </div>
        <div className="editor-actions">
          <button onClick={handleSave} className="save-button">
            Save Changes
          </button>
          <button onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
      {/* Value tables container - formatted similarly to the main Value Chart page */}
      <div
        className="tables-container"
        style={{marginLeft:"-150px"}}
      >
        {Object.entries(oreValsDict).map(([layerName, layerData]) => {
          const gradientKey = Object.keys(LayerGradients).find(key =>
            layerName.includes(key)
          );
          const gradientStyle = gradientKey
            ? LayerGradients[gradientKey].background
            : "linear-gradient(90deg, #667eea 0%, #764ba2 100%)";

          return (
            <div id={layerName.replace(/\s+/g, "-")}
              key={layerName}
              className="table-wrapper"
              style={{maxWidth:"350px"}}
            >
              <h2
                className="table-wrapper h2"
                style={{ background: gradientStyle }}
                data-text={layerName}
              >
                {layerName}
              </h2>
              {/* Only needs the per AV column, since they're customizing the customVal */}
              <table className="table">
                <thead>
                  <tr>
                    <th>Ore Name</th>
                    <th style={{textAlign:"left"}}>Value (/AV)</th>
                  </tr>
                </thead>
                <tbody>
                  {layerData.map((item, index) => (
                    <tr key={index}>
                      <td 
                        className={`name-column ${getOreClassName(item.name)}`} 
                        data-text={item.name}
                      >
                        {OreIcons[item.name.replace(/ /g, '_')] ? (
                          <img
                            src={OreIcons[item.name.replace(/ /g, '_')]}
                            alt={`${item.name} icon`}
                            className="ore-icon"
                            loading="lazy"
                            onError={(e) => {
                              console.error(`Missing icon for: ${item.name}`);
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span>🖼️</span>
                        )}
                        {item.name}
                      </td>
                      <td>
                        <input
                          type="number"
                          step="any"
                          value={localValues[`${layerName}-${item.name}`] !== undefined 
                            ? localValues[`${layerName}-${item.name}`] 
                            : item.customVal}
                          onChange={(e) => {
                            setLocalValues(prev => ({
                              ...prev,
                              [`${layerName}-${item.name}`]: e.target.value
                            }));
                          }}
                          onBlur={(e) => {
                            handleValueChange(layerName, item.name, e.target.value);
                            setLocalValues(prev => {
                              const newValues = {...prev};
                              delete newValues[`${layerName}-${item.name}`];
                              return newValues;
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleValueChange(layerName, item.name, e.target.value);
                              setLocalValues(prev => {
                                const newValues = {...prev};
                                delete newValues[`${layerName}-${item.name}`];
                                return newValues;
                              });
                            }
                          }}
                          className="base-value-input"
                          style={{textAlign:"left"}}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}

export default CustomValuesEditor;