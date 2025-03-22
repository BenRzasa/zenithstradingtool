// This component handles the parsing of the CSV string the 
// user passes in, expanding it down into a vertical,
// alphabetically-sorted list of ore names with the amounts
// from their CSV string to the right of the names.

// Homepage.js
import React, { useState } from 'react';
import { oreNames } from '../components/oreNames';
import '../styles/homepage.css'; // Import the CSS file

function CSVUnloader() {
    const [amounts, setAmounts] = useState(Array(oreNames.length).fill(0));

    const updateOreAmounts = () => {
        const csvInput = document.getElementById('csvInput').value;
        const newAmounts = csvInput.split(',').map(Number);

        setAmounts((prevAmounts) =>
            prevAmounts.map((_, index) =>
                newAmounts[index] !== undefined && !isNaN(newAmounts[index])
                    ? newAmounts[index]
                    : 0
            )
        );
    };

    return (
        <div className="container">
            <div className="ore-list">
                <table>
                    <thead>
                        <tr>
                            <th>Ore</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {oreNames.map((ore, index) => (
                            <tr key={ore}>
                                <td>{ore}</td>
                                <td>{amounts[index]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="csv-input">
                <h2>Enter CSV Values</h2>
                <textarea id="csvInput" placeholder="Enter comma-separated numbers..." />
                <button onClick={updateOreAmounts}>Update Amounts</button>
            </div>
        </div>
    );
}

export default CSVUnloader;