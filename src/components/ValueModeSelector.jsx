/*
 * Zenith's Trading Tool - An external website created for Celestial Caverns
 * Copyright (C) 2026 - Ben Rzasa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
*/

import React from "react";
const ValueModeSelector = ({ currentMode, setCurrentMode }) => {
    const valueModeButtons = [
        {
            mode: 1,
            className: "color-template-ambrosine",
            label: "AV Mode",
        },
        {
            mode: 2,
            className: "color-template-universallium",
            label: "UV Mode",
        },
        {
            mode: 6,
            className: "color-template-rhylazil",
            label: "RV Mode",
        },
        {
            mode: 3,
            className: "color-template-neutrine",
            label: "NV Mode",
        },
        {
            mode: 4,
            className: "color-template-torn-fabric",
            label: "TV Mode",
        },
        {
            mode: 5,
            className: "color-template-singularity",
            label: "SV Mode",
        },
        {
            mode: 7,
            className: "color-template-havicron",
            label: "Custom",
        },
    ];
    return (
        <div className="row-container" style={{gap: "0.25em"}}>
            {valueModeButtons.map(({ mode, className, label }) => (
                <button 
                    style={{width: "6em", height: "3em"}}
                    key={mode}
                    onClick={() => setCurrentMode(mode)}
                    className={currentMode === mode ? className : ""}
                >
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
};

export default ValueModeSelector;
