/* ZTT | Trade Table Component
 - To condense the code for the Trade tool down a lot.
 - Need basically identical tables for to Trade and to Receive
*/

import React, { useState } from 'react';
import { oreIcons } from "../lib/oreIcons";

import '../styles/TradeTable.css';
import '../styles/AllGradients.css';

const TradeTable = ({
  title,
  ores,
  quantities,
  globalQuantity,
  onQuantityChange,
  onGlobalQuantityChange,
  onRemoveOre,
  isReceiveTable = false,
  showInventory = false,
  hasEnoughOre,
  getAvailableAmount,
  calculateAV,
  totals,
  inventoryStatus
}) => {
  const [discount, setDiscount] = useState(0);

  const handleDiscountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setDiscount(Math.min(100, Math.max(0, value))); // Clamp between 0-100
  };

  return (
  <div>
    <div className="table-container">
      <h2>{title}</h2>
      {/* Discount Input */}
      <div className="discount-container">
        <h3>Discount %</h3>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={discount}
          onChange={handleDiscountChange}
          className="discount-input"
          placeholder="Discount %"
        />
      </div>
      {/* Totals Section */}
      {totals && (
        <div className="totals-and-clear-container">
          <div className="trade-totals">
            <p>➜ Total AV: <span>{totals.totalAV.toFixed(0)}</span></p>
            {discount > 0 && (
              <p>➜ Discounted AV ({discount}%): <span>{Math.round(totals.totalAV * (1 - discount / 100)).toFixed(0)}
                </span>
              </p>
            )}
            <p>➜ Total # Ores: <span>{totals.totalOres}</span></p>
          </div>
          {/* Inventory Status */}
          {!isReceiveTable && inventoryStatus && (
            <>
              {inventoryStatus.allOresAvailable ? (
                <div className="global-checkmark">
                  ✓ All ores available in inventory
                </div>
              ) : (
                inventoryStatus.hasMissingOres && (
                  <div className="missing-ores-warning">
                    <div className="warning-header">✖ Missing:</div>
                    <div className="missing-ores-list">
                      {inventoryStatus.missingOres.map((oreObj, index) => (
                        <div key={index} className="missing-ore-item">
                          {oreObj.name}: {oreObj.missing}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </div>
      )}

      {/* Main table section */}
      <table className="trade-table">
        <thead>
          <tr>
            <th>Ore Name</th>
            <th>
              {/* Global quantity cell & input box */}
              <div className="quantity-cell-container">
                <span>{isReceiveTable ? '# to Receive' : '# to Trade'}</span>
                <input
                  type="number"
                  min={1}
                  value={globalQuantity}
                  onChange={(e) => {
                    const value = Math.max(
                      1,
                      parseInt(e.target.value) || 1
                    );
                    onGlobalQuantityChange(value);
                  }}
                  className={`quantity-input ${isReceiveTable ? 'receive-input' : ''}`}
                />
              </div>
            </th>
            <th>AV</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(ores) ? ores : []).map((oreObj) => {
            return (
              <tr key={oreObj.name}>
                <td className={`tr-name-cell ${oreObj.className || ""}`} data-text={oreObj.name}>
                  <button
                    className="delete-ore-button"
                    onClick={() => onRemoveOre(oreObj)}
                  >
                    ✖
                  </button>
                  <img
                    src={oreIcons[oreObj.name.replace(/ /g, '_')]}
                    alt={`${oreObj.name} icon`}
                    className="t-ore-icon"
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Missing icon for: ${oreObj.name}`);
                      e.target.style.display = 'none';
                    }}
                  />
                  {oreObj.name}
                </td>
                <td>
                  <div className="quantity-cell-container">
                    {showInventory && (
                      <>
                        <div
                          className={`inventory-check ${
                            hasEnoughOre(oreObj) ? "has-enough" : "not-enough"
                          }`}
                        >
                          {hasEnoughOre(oreObj) ? "✓" : "✖"}
                        </div>
                        <div className="inventory-count">
                          {getAvailableAmount(oreObj)}/
                          {quantities[oreObj.name] || 0}
                        </div>
                      </>
                    )}
                    <input
                      type="number"
                      value={quantities[oreObj.name] ?? ""}
                      onChange={(e) =>
                        onQuantityChange(oreObj.name, e.target.value, isReceiveTable)
                      }
                      className={`quantity-input ${isReceiveTable ? 'receive-input' : ''}`}
                      min={1}
                    />
                  </div>
                </td>
                <td>
                  {calculateAV ?
                    calculateAV(oreObj.name) :
                    (oreObj.baseValue ?
                      (quantities[oreObj.name] / oreObj.baseValue).toFixed(1) :
                      "0.0"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default TradeTable;