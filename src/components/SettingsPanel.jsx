import React, { useEffect, useRef, useContext } from 'react';
import { MiscContext } from '../context/MiscContext';
import ValueModeSelector from './ValueModeSelector';
import ValueButtons from './ValueButtons';
import ThemeSwitch from './ThemeSwitch';
import CustomMultiplierInput from './CustomMultiplierInput';
import '../styles/SettingsPanel.css';
import '../styles/Switch.css';

const SettingsPanel = ({
  isOpen,
  onClose, 
  opacity,
  onOpacityChange,
  onBgChange,
  customBg,
  onApplyBg,
  onResetBg
}) => {
  const {
    capCompletion,
    setCapCompletion,
    currentMode,
    setCurrentMode,
    valueMode,
    setValueMode,
    useObtainRateVals,
    setUseObtainRateVals,
    hotkeysEnabled,
    setHotkeysEnabled,
    useSeparateRareMode,
    setUseSeparateRareMode,
    rareValueMode,
    setRareValueMode,
    customMultiplier,
    setCustomMultiplier,
    rareCustomMultiplier,
    setRareCustomMultiplier,
  } = useContext(MiscContext);

  const toggleHotkeys = () => setHotkeysEnabled(!hotkeysEnabled);
  const toggleObtainRate = () => setUseObtainRateVals(!useObtainRateVals);
  const toggleCapCompletion = () => setCapCompletion(!capCompletion);
  const toggleSeparateRareMode = () => setUseSeparateRareMode(!useSeparateRareMode);

  const panelRef = useRef(null);
  const settingsIconRef = useRef(null);
  const TOP_OFFSET = 60;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isOpen || !panelRef.current) return;
      const isClickOnIcon = settingsIconRef.current?.contains(event.target);
      const isClickInPanel = panelRef.current.contains(event.target);
      const panelRect = panelRef.current.getBoundingClientRect();

      if (isClickOnIcon) {
        // Close immediately if settings icon is clicked
        onClose();
      } else if (!isClickInPanel) {
        // Check if click is outside panel horizontally AND below top offset
        const isOutsideHorizontally = event.clientX < panelRect.left || event.clientX > panelRect.right;
        if (isOutsideHorizontally || event.clientY > TOP_OFFSET) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div
      ref={panelRef}
      className={`settings-panel ${isOpen ? 'open' : ''}`}
    >
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
      </div>

      <div className="settings-section">
        <h2 className="section-title">Value Mode (Click to Select)</h2>
          <ValueModeSelector
            currentMode={currentMode}
            setCurrentMode={setCurrentMode}
          />
          {currentMode === 7 ? (
          <CustomMultiplierInput
            currentMode={currentMode}
            customMultiplier={customMultiplier}
            setCustomMultiplier={setCustomMultiplier}
          />
          ) : <></>}
          <ul>
            <li>AV = Ambrosine Value</li>
            <li>UV = Universallium Value (10 AV)</li>
            <li>RV = Rhylazil Value (50 AV)</li>
            <li>NV = Neutrine Value (100 AV)</li>
            <li>TV = Torn Value (500 AV)</li>
            <li>SV = Singularity Value (1000 AV)</li>
            <li>CUSTOM = Your custom multiplier (# AV)</li>
          </ul>
      </div>

      <div className="settings-section">
        <h2 className="section-title">Change Rare Value Mode</h2>
        <div className="theme-control">
          <label className="sswitch">
            <input
              type="checkbox"
              id="rare-mode-switch"
              title="rare-switch"
              checked={useSeparateRareMode}
              onChange={toggleSeparateRareMode}
            />
            <span className="sslider"></span>
          </label>
          <span>
            <p>[{useSeparateRareMode ? "ENABLED" : "DISABLED"}] Use different value mode for rare and true rare ores.</p>
          </span>
        </div>

        {useSeparateRareMode && (
          <>
            <h3>Rare Value Mode Selector</h3>
            <div className="value-mode-selector">
            <ValueModeSelector
              currentMode={rareValueMode}
              setCurrentMode={setRareValueMode}
            />
            </div>

            {rareValueMode === 7 && (
              <CustomMultiplierInput
                currentMode={rareValueMode}
                customMultiplier={rareCustomMultiplier}
                setCustomMultiplier={setRareCustomMultiplier}
              />
            )}

            <div className="rare-mode-info">
              <p>
                <strong>Note:</strong> When enabled, rare and true rare ores will use the selected value mode above,
                while all other ores will use the main value mode selected in the first section. These will not be counted towards overall completion (for now).
              </p>
            </div>
          </>
        )}
      </div>

      <div className="settings-section">
        <h2 className="section-title">Value Set Selector (Click to Select)</h2>
        <h4>Pick from one of two value sets maintained by the two current largest traders, or feel free to use your custom values!</h4>
          <ValueButtons
            valueMode={valueMode}
            setValueMode={setValueMode}
          />
          <ul>
            <li><span className="placeholder">Zenith:</span> ZenithFlare, an active grinder and one of the main traders in TCC. (If you're reading this, ping @geosy!)</li>
            <li><span className="placeholder">Custom:</span> Your custom values, modified from the Value Chart page or the "Custom Values" page.</li>
          </ul>
      </div>

      <div className="settings-section">
        <h2 className="section-title">Miscellaneous Settings</h2>
        <h3>Toggle Obtain Rate Values for Rares</h3>
        <div className="theme-control">
          <label className="sswitch">
            <input
              type="checkbox"
              id="obtain-rate-switch"
              title="obtain-switch"
              checked={useObtainRateVals}
              onChange={toggleObtainRate}
            />
            <span className="sslider"></span>
          </label>
          <span><p>[{useObtainRateVals === true ? "ENABLED" : "DISABLED"}] Toggles between obtain rate values for rares (community-agreed standard), or user-specific values.</p></span>
        </div>

        <h3>Toggle Completion % Cap</h3>
        <div className="theme-control">
          <label className="sswitch">
            <input
              type="checkbox"
              id="completion-cap-switch"
              title="completion-switch"
              checked={capCompletion}
              onChange={toggleCapCompletion}
            />
            <span className="sslider"></span>
          </label>
          <span><p>[{capCompletion === true ? "CAPPED" : "UNCAPPED"}] Toggles the completion % between being capped at 100% and uncapped (no upper limit).</p></span>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">Keyboard Shortcuts</h2>
        <h3>Toggle Hotkeys</h3>
        <div className="theme-control">
          <label className="sswitch">
            <input
              type="checkbox"
              id="hotkeys-switch"
              title="hotkeys-switch"
              checked={hotkeysEnabled}
              onChange={toggleHotkeys}
            />
            <span className="sslider"></span>
          </label>
          <span><p>[{hotkeysEnabled ? "ENABLED" : "DISABLED"}] Toggle all keyboard shortcuts for navigation.</p></span>
        </div>
        {hotkeysEnabled && (
          <div className="hotkey-list">
            <p><strong>S</strong> - Toggle Settings</p>
            <p><strong>H</strong> - Home</p>
            <p><strong>V</strong> - Value Chart</p>
            <p><strong>C</strong> - CSV Loader Popup</p>
            <p><strong>T</strong> - Trade Tool</p>
            <p><strong>U</strong> - Custom Values</p>
            <p><strong>R</strong> - Rare Tracker</p>
            <p><strong>P</strong> - Pinlist</p>
            <p><strong>M</strong> - Miscellaneous</p>
            <p><strong>W</strong> - Spin the Wheel</p>
            <p><strong>E</strong> - Credits</p>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h2 className="section-title">Theme</h2>
        <div className="theme-control">
          <span style={{fontSize: "22px"}}>🔆Dark/Light Mode Toggle</span>
          <ThemeSwitch />
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">Background</h2>
        <div className="opacity-control">
          <label className="opacity-label">
            Background Opacity: {Math.round(opacity * 100)}%
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={onOpacityChange}
            className="opacity-slider"
          />
          </label>
        </div>

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={onBgChange}
            className="file-input"
            id="bg-upload"
          />
          <label htmlFor="bg-upload" className="upload-button">
            📁 Upload Background Image (or GIF!)
          </label>
          <div className="action-buttons">
          {customBg && (
              <button
                onClick={onApplyBg}
                className="apply-button"
              >
                Apply Background
              </button>
          )}
          <button
            onClick={onResetBg}
            className="reset-button"
          >
            Reset Background
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
