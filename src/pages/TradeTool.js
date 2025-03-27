import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSVContext } from '../context/CSVContext';
import { TradeContext } from '../context/TradeContext';
import { johnValsDict } from '../components/JohnVals';
import { nanValsDict } from '../components/NANVals';
import '../styles/AllGradients.css';
import '../styles/TradeTool.css';

function TradeTool() {
    const { tradeData, setTradeData } = useContext(TradeContext);

    const [isJohnValues, setIsJohnValues] = useState(tradeData.isJohnValues);
    const [selectedOres, setSelectedOres] = useState(tradeData.selectedOres);
    const [quantities, setQuantities] = useState(tradeData.quantities);
    const [discount, setDiscount] = useState(tradeData.discount);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchInputRef = useRef(null);
    const resultsRef = useRef(null);

    // useEffect to sync changes back to context
    useEffect(() => {
        setTradeData({
        selectedOres,
        quantities,
        discount,
        isJohnValues
        });
    }, [selectedOres, quantities, discount, isJohnValues, setTradeData]);

    // Reset selected index when search term changes
    useEffect(() => {
        setSelectedIndex(-1);
    }, [searchTerm]);

    // Focus the input when component mounts
    useEffect(() => {
        searchInputRef.current?.focus();
    }, []);
    
    // Scroll down the list when the keyboard navigates to the end of iti
    useEffect(() => {
        if (selectedIndex >= 0 && resultsRef.current) {
            const resultsList = resultsRef.current;
            const selectedItem = resultsList.children[selectedIndex];
            
            if (selectedItem) {
                // Scroll the item into view if needed
                selectedItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    }, [selectedIndex]);

    // Using csvData in a way that satisfies ESLint
    const { csvData } = useContext(CSVContext);
    console.log('CSV Data available:', csvData); // Example usage to prevent warning

    // Get all ores with their layer information
    const allOresWithLayers = Object.entries(isJohnValues ? johnValsDict : nanValsDict)
        .flatMap(([layerName, ores]) => 
            ores.map(ore => ({
                ...ore,
                layer: layerName  // Add layer name to each ore
            }))
        );

    // Filter ores based on search term (name or layer)
    const filteredOres = allOresWithLayers.filter(ore => {
        const oreLower = ore.name.toLowerCase();
        const layerLower = ore.layer.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return oreLower.includes(searchLower) || 
               layerLower.includes(searchLower) ||
               ore.layer.split('/').some(part => 
                   part.trim().toLowerCase().includes(searchLower)
               );
    });

    // Handle adding an ore to the trade table
    const handleAddOre = (oreName) => {
        if (!selectedOres.includes(oreName)) {
            setSelectedOres([...selectedOres, oreName]);
            setQuantities({...quantities, [oreName]: 0});
        }
        setSearchTerm('');
        setSelectedIndex(-1);
        searchInputRef.current?.focus();
    };

    // Handle removing a specific ore
    const handleRemoveOre = (oreName) => {
        setSelectedOres(selectedOres.filter(ore => ore !== oreName));
        const newQuantities = {...quantities};
        delete newQuantities[oreName];
        setQuantities(newQuantities);
    };

    // Handle ore quantity changes in trade table
    const handleQuantityChange = (oreName, value) => {
        setQuantities({
          ...quantities,
          [oreName]: value === "" ? "" : Math.max(1, parseInt(value) || 1)
        });
      };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!searchTerm || filteredOres.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < filteredOres.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev > 0 ? prev - 1 : filteredOres.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < filteredOres.length) {
                    handleAddOre(filteredOres[selectedIndex].name);
                }
                break;
            default:
                break;
        }
    };

    // Calculate AV for an ore
    const calculateAV = (oreName) => {
        const oreData = allOresWithLayers.find(ore => ore.name === oreName);
        // return oreData ? Math.round((quantities[oreName] / oreData.baseValue).toFixed(2)) : 0;
        return oreData ? (quantities[oreName] / oreData.baseValue).toFixed(2) : 0;
    };

    // Calculate totals
    const totalOres = selectedOres.reduce((sum, ore) => sum + (quantities[ore] || 0), 0);
    const totalAV = selectedOres.reduce((sum, ore) => {
        const oreData = allOresWithLayers.find(o => o.name === ore);
        return Math.round(sum + (quantities[ore] || 0) / (oreData?.baseValue || 1));
    }, 0).toFixed(0);

    // Handle discount change
    const handleDiscountChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setDiscount(Math.min(100, Math.max(0, value))); // Clamp between 0-100
    };

    // Get the discounted AV value after getting from the input
    const discountedAV = totalAV * (1 - discount / 100);
    
    // Helper function to check if user has enough of a specific ore
    const hasEnoughOre = (oreName, requiredAmount) => {
        if (!csvData || typeof csvData !== 'object') return false;
        const inventoryAmount = csvData[oreName] || 0;
        return inventoryAmount >= (requiredAmount || 0);
    };
    
    // Helper function to get available amount of an ore
    const getAvailableAmount = (oreName) => {
        if (!csvData || typeof csvData !== 'object') return 0;
        return csvData[oreName] || 0;
    };
    
    // Check if all ores in the table are available
    const allOresAvailable = selectedOres.length > 0 && selectedOres.every(ore => {
        return hasEnoughOre(ore, quantities[ore]);
    });

    // Helper function to get missing ores with amounts
    const getMissingOres = () => {
        if (!csvData || typeof csvData !== 'object') return [];
        
        return selectedOres
        .filter(ore => !hasEnoughOre(ore, quantities[ore]))
        .map(ore => ({
            name: ore,
            missing: (quantities[ore] || 0) - (csvData[ore] || 0)
        }));
    };
    
    // Calculate missing ores
    const missingOres = getMissingOres();
    const hasMissingOres = missingOres.length > 0;

    // Clear the entire table
    const clearTable = () => {
        setSelectedOres([]);
        setQuantities({});
    };

    return (
        <div className="trade-tool-container">
            <h1>Welcome to the Trade Tool!</h1>
            <h1>Usage:</h1>
            <l>
                <ul>1. Start typing an ore or layer name in the search box on the left.</ul>
                <ul>2. Either click on the ore or hit enter to add it to the list.
                    You can also use arrow keys to navigate up and down the list!
                </ul>
                <ul>3. Enter the quantity of each ore you wish to trade in the text boxes on the right side.</ul>
                <ul>4. To add a discount to large orders, type the percent in the "Discount %" box.</ul>
            </l>
            <h1>➜ Current Values: <span className="placeholder">
                {isJohnValues ? "John's Values" : "NAN's Values"}
            </span></h1>
            <nav>
                <ul>
                    <li><Link to="/">Back to Home Page</Link></li>
                    <li><Link to="/valuechart">Value Chart</Link></li>
                    <li><Link to="/csvloader">CSV Loader</Link></li>
                </ul>
            </nav>
            <div className="t-button-container">
                <div className="box-button">
                    <button 
                        onClick={() => setIsJohnValues(true)}
                        className={isJohnValues ? "color-template-rhylazil" : ""}
                    >
                        <span>John Values</span>
                    </button>
                </div>
                <div className="box-button">
                    <button 
                        onClick={() => setIsJohnValues(false)}
                        className={isJohnValues === false ? "color-template-diamond" : ""}
                    >
                        <span>NAN Values</span>
                    </button>
                </div>
            </div>
    
            {/* Main Content Area */}
            <div className="trade-main-content">
                {/* Left Column - Discount and Search */}
                <div className="trade-controls-column">
                    <div className="discount-container">
                        <h2>Discount %</h2>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={discount}
                            onChange={handleDiscountChange}
                            className="discount-input"
                            placeholder="Enter discount percentage"
                        />
                    </div>
                    
                    <div className="search-container">
                        <h2>Add Ores to Trade ⤵</h2>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search ores or layers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="search-input"
                        />
                        {searchTerm && (
                            <div className="search-results-container">
                                <ul className="search-results" ref={resultsRef}>
                                    {filteredOres.map((ore, index) => (
                                        <li 
                                            key={`${ore.name}-${index}`}
                                            onClick={() => handleAddOre(ore.name)}
                                            className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                                        >
                                            <div className="ore-name">{ore.name}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
    
                {/* Right Column - Table */}
                <div className="trade-table-section">
                    <div className="totals-and-clear-container">
                        <div className="trade-totals">
                            <p>➜ Total # Ores: <span>{totalOres}</span></p>
                            <p>➜ Total AV: <span>{totalAV}</span></p>
                            <p>➜ Discounted AV ({discount}%): <span>{Math.round(discountedAV)}</span></p>
                        </div>
                        {allOresAvailable ? (
                            <div className="global-checkmark">
                                ✓ All ores available in inventory
                            </div>
                            ) : hasMissingOres && (
                            <div className="missing-ores-warning">
                                <div className="warning-header">✖ Missing:</div>
                                <div className="missing-ores-list">
                                {missingOres.map((ore, index) => (
                                    <div key={index} className="missing-ore-item">
                                    {ore.name}: {ore.missing > 0 ? ore.missing : 0}
                                    </div>
                                ))}
                                </div>
                            </div>
                            )}
                        <div className="clear-button-container">
                            <div className="box-button" onClick={clearTable}>
                                <button>
                                    <span className="button">Clear Table</span>
                                </button>
                            </div>
                        </div>
                    </div>
    
                    <table className="trade-table">
                        <thead>
                            <tr>
                                <th>Ore Name</th>
                                <th># to Trade</th>
                                <th>AV</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOres.map(ore => (
                                <tr key={ore}>
                                    <td className="ore-name-cell">
                                        <button 
                                            className="delete-ore-button"
                                            onClick={() => handleRemoveOre(ore)}
                                        >
                                            ✖
                                        </button>
                                        {ore}
                                    </td>
                                    <td>
                                    <div className="quantity-cell-container">
                                        {csvData && (
                                        <>
                                            <span 
                                            className={`inventory-check ${
                                                hasEnoughOre(ore, quantities[ore]) ? 'has-enough' : 'not-enough'
                                            }`}
                                            >
                                            {hasEnoughOre(ore, quantities[ore]) ? '✓' : '✖'}
                                            </span>
                                            <span className="inventory-count">
                                            {getAvailableAmount(ore)}/{quantities[ore] || 0}
                                            </span>
                                        </>
                                        )}
                                        <input
                                        type="number"
                                        value={quantities[ore] ?? ""}
                                        onChange={(e) => handleQuantityChange(ore, e.target.value)}
                                        className="quantity-input"
                                        min="1"
                                        />
                                    </div>
                                    </td>
                                    <td>{calculateAV(ore)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TradeTool;