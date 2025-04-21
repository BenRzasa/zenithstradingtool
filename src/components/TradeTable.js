/* ZTT | Trade Table Component
 - To condense the code for the Trade tool down a lot
 - Need basically identical tables for to Trade and to Receive
*/

import React, { useState } from 'react';
import { oreIcons } from "../data/oreIcons";

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
  // State for discount per table
  const [discount, setDiscount] = useState(0);
  // Handle the discount state updating
  const handleDiscountChange = (e) => {
    // Parse the float input (also handles integer)
    const value = parseFloat(e.target.value) || 0;
    // Clamp between 0-100%
    setDiscount(Math.min(100, Math.max(0, value)));
  };

  // Function to generate the className based on ore name
  const getOreClassName = (oreName) => {
    return `color-template-${oreName.toLowerCase().replace(/ /g, '-')}`;
  };

  return (
  <div>
    <div className="table-container">
      <h2>{title}</h2>
      {/* Discount input - 0->100 */}
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
      {/* Totals section - displays the total, discounted (if applicable) and number of ores */}
      {totals && (
        <div className="totals-and-clear-container">
          <div className="trade-totals">
            <p>➜ Total AV: <span>{totals.totalAV.toFixed(0)}</span></p>
            {/* Only display the discounted AV if there IS a discount */}
            {discount > 0 && (
              <p>➜ Discounted AV ({discount}%): <span>{Math.round(totals.totalAV * (1 - discount / 100)).toFixed(0)}
                </span>
              </p>
            )}
            <p>➜ Total # Ores: <span>{totals.totalOres}</span></p>
          </div>
          {/* Inventory status */}
          {!isReceiveTable && inventoryStatus && (
            <>
              {inventoryStatus.allOresAvailable ? (
                <div className="global-checkmark">
                  ✓ All ores available in inventory
                </div>
              ) : (
                // Dynamically display a list of the missing ores if there are any
                // Mapped from the oreObj array with its index as a unique key
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
                  className={`quantity-input ${isReceiveTable
                           ? 'receive-input' : ''}`}
                />
              </div>
            </th>
            <th>AV</th>
          </tr>
        </thead>
        <tbody>
          {/* Ore Name column with additional security to fix null reads */}
          {(Array.isArray(ores) ? ores : []).map((oreObj) => {
            return (
              <tr key={oreObj.name}>
                {/* Gets the gradient dynamically */}
                <td className={`tr-name-cell ${getOreClassName(oreObj.name)}`}
                    data-text={oreObj.name}>
                  <button
                    className="delete-ore-button"
                    onClick={() => onRemoveOre(oreObj)}
                  >
                    ✖
                  </button>
                  {/* Ore icon - again, sourced dynamically from the name */}
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
                  {/* Quantity input cell - allows the user to change & increment */}
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
                    {/* Main input section of the cell - checks for recieve cell */}
                    <input
                      type="number"
                      value={quantities[oreObj.name] ?? ""}
                      onChange={(e) =>
                        onQuantityChange(oreObj.name, e.target.value, isReceiveTable)
                      }
                      className={`quantity-input ${isReceiveTable
                               ? 'receive-input' : ''}`}
                      min={1}
                    />
                  </div>
                </td>
                {/* Shows the total av of the individual ore based off the amount */}
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