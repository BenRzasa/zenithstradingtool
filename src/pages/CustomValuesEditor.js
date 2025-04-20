import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSVContext } from '../context/CSVContext';
import { LayerGradients } from '../components/LayerGradients';
import { oreIcons } from '../lib/oreIcons';
import NavBar from '../components/NavBar';


import '../styles/CustomValuesEditor.css';
import '../styles/AllGradients.css';
import '../styles/LayerTable.css';

function CustomValuesEditor() {
  const navigate = useNavigate();
  const {
    customDict,
    setCustomDict,
    setValueMode,
    initializeCustomDict
  } = useContext(CSVContext);
  // Return a custom dict or, if none exists, initialize one with NAN's vals
  const [editedDict, setEditedDict] = useState(() => {
    return customDict || initializeCustomDict('nan');
  });
  // Change the value in the dictionary based on the number input
  const handleValueChange = (layer, oreName, newValue) => {
    setEditedDict(prev => {
      const newDict = {...prev};
      const layerIndex = Object.keys(newDict).indexOf(layer);
      if (layerIndex >= 0) {
        // Find the ore based on the layer and name, then set the baseValue
        const oreIndex = newDict[layer].findIndex(o => o.name === oreName);
        if (oreIndex >= 0) {
          newDict[layer][oreIndex] = {
            ...newDict[layer][oreIndex],
            baseValue: parseFloat(newValue) || 0
          };
        }
      }
      return newDict;
    });
  };
  // Save the new dictionary
  const handleSave = () => {
    setCustomDict(editedDict);
    setValueMode('custom');
    navigate(-1);
  };
  // Handle cancellation (navigate 1 page backward -> Value Chart)
  const handleCancel = () => {
    navigate(-1);
  };
  // Handle resetting of the dictionary
  const handleReset = (source) => {
    if (window.confirm(`Reset all values to '${source}' values? This cannot be undone.`)) {
      const newDict = initializeCustomDict(source);
      setEditedDict(newDict);
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
        <li>Here, you can customize values to your heart's content.</li>
        <li>First, find the ore you want, then change the "/AV" (ore per AV) number.</li>
        <li>Something like "0.001" means that the ore is worth 1000 Ambrosine.
          This can be determined by "1 / 0.001". </li>
        <li>When you're done customizing values, click "Save Changes" to set
          the values and navigate back to the value chart page.</li>
        <li>If you make a mistake, or want to start over, click one of the two reset buttons, then click to confirm.</li>
      </ul>
      <div className="editor-controls">
        <div className="reset-buttons">
          <button onClick={() => handleReset('john')} className="reset-john">
            Reset to John's Values
          </button>
          <button onClick={() => handleReset('nan')} className="reset-nan">
            Reset to NAN's Values
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

      <div className="tables-container">
        {Object.entries(editedDict).map(([layerName, layerData]) => {
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
              style={{maxWidth:"450px"}}
            >
              <h2
                className="table-wrapper h2"
                style={{ background: gradientStyle }}
                data-text={layerName}
              >
                {layerName}
              </h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Ore Name</th>
                    <th>/AV</th>
                  </tr>
                </thead>
                <tbody>
                  {layerData.map((item, index) => (
                    <tr key={index}>
                      <td className={`name-column ${getOreClassName(item.name)}`} data-text={item.name}>
                        {oreIcons[item.name.replace(/ /g, '_')] ? (
                          <img
                            src={oreIcons[item.name.replace(/ /g, '_')]}
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
                          step="1"
                          min="0"
                          value={item.baseValue}
                          onChange={(e) =>
                            handleValueChange(layerName, item.name, e.target.value)
                          }
                          className="base-value-input"
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