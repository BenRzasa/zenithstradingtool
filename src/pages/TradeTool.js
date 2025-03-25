import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSVContext } from '../context/CSVContext';
import { johnValsDict } from '../components/JohnVals';
import { nanValsDict } from '../components/NANVals';
import '../styles/AllGradients.css';
import '../styles/TradeTool.css';

function TradeTool() {
    const [isJohnValues, setIsJohnValues] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOres, setSelectedOres] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchInputRef = useRef(null);
    const resultsRef = useRef(null);

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
            setQuantities({...quantities, [oreName]: 1});
        }
        setSearchTerm('');
        setSelectedIndex(-1);
        searchInputRef.current?.focus();
    };

    // Define handleQuantityChange function
    const handleQuantityChange = (oreName, value) => {
        setQuantities({
            ...quantities,
            [oreName]: Math.max(1, parseInt(value) || 1)
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

    // Reset selected index when search term changes
    useEffect(() => {
        setSelectedIndex(-1);
    }, [searchTerm]);

    // Focus the input when component mounts
    useEffect(() => {
        searchInputRef.current?.focus();
    }, []);

    // Calculate AV for an ore
    const calculateAV = (oreName) => {
        const oreData = allOresWithLayers.find(ore => ore.name === oreName);
        return oreData ? (quantities[oreName] / oreData.baseValue).toFixed(2) : 0;
    };

    // Calculate totals
    const totalOres = selectedOres.reduce((sum, ore) => sum + (quantities[ore] || 0), 0);
    const totalAV = selectedOres.reduce((sum, ore) => {
        const oreData = allOresWithLayers.find(o => o.name === ore);
        return sum + (quantities[ore] || 0) / (oreData?.baseValue || 1);
    }, 0).toFixed(2);

    return (
        <div className="trade-tool-container">
            {/* Page Title */}
            <h1>Trade Tool</h1>
            <h2>Usage:</h2>
            <l>
                <ul>1. Start typing an ore or layer name in the search box on the left.</ul>
                <ul>2. Either click on the ore or hit enter to add it to the list.
                    You can also use arrow keys to navigate up and down the list!
                </ul>
                <ul>3. Enter the quantity of each ore you wish to trade in the text boxes on the right side.</ul>
            </l>
            {/* Navigation Bar */}
            <nav>
                <ul>
                    <li><Link to="/">Back to Home Page</Link></li>
                    <li><Link to="/valuechart">Value Chart</Link></li>
                    <li><Link to="/csvloader">CSV Loader</Link></li>
                </ul>
            </nav>
    
            {/* Value Source Toggle Buttons (John/NAN) */}
            <div className="value-buttons">
                <button
                    className='color-template-rhylazil'
                    onClick={() => setIsJohnValues(true)}
                >
                    <span>John Values</span>
                </button>
                <button
                    className='color-template-diamond'
                    onClick={() => setIsJohnValues(false)}
                >
                    <span>NAN Values</span>
                </button>
            </div>
    
            {/* Main Content Area - Flex Layout */}
            <div className="trade-main-content">
                {/* Left Section - Ore Search */}
                <div className="trade-search-section">
                    <h2>Add Ores to Trade | Ore & Layer Search</h2>
                    <div className="search-container">
                        {/* Search Input Field */}
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search ores or layers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="search-input"
                        />
                        
                        {/* Wrap results in a container that will share the border */}
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
    
                {/* Right Section - Trade Table */}
                <div className="trade-table-section">
                    <h2>Trade List</h2>
                    
                    {/* Trade Table */}
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
                                    <td>{ore}</td>
                                    <td>
                                        {/* Quantity Input Field */}
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantities[ore] || 1}
                                            onChange={(e) => handleQuantityChange(ore, e.target.value)}
                                            className="quantity-input"
                                        />
                                    </td>
                                    <td>{calculateAV(ore)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
    
                    {/* Totals Display */}
                    <div className="trade-totals">
                        <p>Total # Ores: <span>{totalOres}</span></p>
                        <p>Total AV: <span>{totalAV}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TradeTool;