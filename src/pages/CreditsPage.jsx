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

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import NavBar from "../components/NavBar";
import patic from "../images/misc/patic3.png";
import "../styles/CreditsPage.css";

function CreditsPage() {
    const [showPatic, setShowPatic] = useState(false);

    const markdownContent = `
# Feature, Assets, & Inspiration Credits

### Concept originally inspired by John's Trading Tool, a spreadsheet-based tool created by John_Sypher.

### Multiple Users
- Feedback and improvements for mobile compatibility!!

### Glitch
- Changelog
- Various CSV loader QoL changes
- AV Gain since last update
- Date & time since last update
- RV & TV mode suggestions
- Custom background image!!
- Emblem list with useful perks (with icons)

### Hiyo
- Separate rare value mode switching + completion
- RV mode suggestion
- Custom value multiplier (for completion)
- CSV Loader sorting options (alphabetically, change amount, etc.)
- I forgot LIQUID GOLD somehow
- Hotkey navigation
- CSV backward compatibility

### NAN
- CSV editor concept
- Checkmark & inventory comparison for trade tool quantities
- John Values = pout gradient
- "More Stats" button
- UI scaling suggestions
- Secondary CSV switcher and editor
- Obtain Rate toggle for rare values
- Multiple rounding and precision improvements

## d1v
- In-game gradient viewer!! Incredibly useful

### Mlhy
- Multiple ore & layer wheel page suggestions

### Randomwastaken
- Porting completion % gain and other important stats to the CSV loader page
- Checkmark for 100% completion of a given layer

### Sandglasss
- Multiple trade tool UX improvements (search bar and adding ore functionality)

### Galactic
- Custom value setting
- Dark mode

### Sean
- Custom per-ore values
- And who could forget:
### v2025626 Deployed!
- pooped on a shit

### MCHF
- "More Stats" button opening quick summary
- Manual override input for inventory quantities per ore
- Copy to clipboard in the corner of each layer table that copies that layer's search filter

### Nerolin
- Dynamically generated ore className (for gradients)
- Re-structuring the values dictionary to use just one with multiple variables for value sets

### Water
- [Patic](#) ${showPatic ? '![Patic](' + patic + ')' : ''}

### ozo
- Animated gradients for Torn Fabric & Astathian

### Freeze & ozo
- Multiple Home Page UI improvements

### HolySeeker
- Further help with gradients
- ALL THE LAYER AND ORE GRADIENTS. GOAT

### Raid/Samarium
- Grind strategies for ores on Misc page

### GeoSY
- This fellow created the entire game of TCC! Wow!
- New TCC icon for home page

### Luna
- Background opacity/transparency scale
`;

    return (
        <div className="page-wrapper" id="credits">
            <div className="table-wrapper" id="credits"
                style={{
                    width: "100%",
                    paddingLeft: "1em",
                    backdropFilter: "blur(50px)"
                }}
            >
                <ReactMarkdown
                    components={{
                        a: ({ node, ...props }) => (
                            props.href === "#" ? (
                                <button
                                    onClick={() => setShowPatic(!showPatic)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        font: 'inherit',
                                        cursor: 'pointer',
                                        color: 'var(--text-color)',
                                        textDecoration: 'none'
                                    }}
                                >
                                    {props.children}
                                </button>
                            ) : (
                                    <a {...props}>{props.children || props.href}</a>
                                )
                        )
                    }}
                >
                    {markdownContent}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default CreditsPage;
