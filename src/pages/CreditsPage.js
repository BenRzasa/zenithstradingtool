import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import NavBar from "../components/NavBar";
import patic from "../images/misc/patic3.png";
import "../styles/CreditsPage.css";

function CreditsPage() {
  const [showPatic, setShowPatic] = useState(false);

  const markdownContent = `
# &nbsp; &nbsp; &nbsp; Feature, Assets, & Inspiration Credits

- **Concept originally inspired by John's Trading Tool, a spreadsheet-based tool created by John_Sypher.**

- **Multiple Users**
  - Feedback and improvements for mobile compatibility!!

- **Glitch**
  - Changelog
  - Various CSV loader QoL changes
  - AV Gain since last update
  - Date & time since last update
  - RV & TV mode suggestions
  - Custom background image!!
  - Emblem list with useful perks (with icons)

- **Hiyo**
  - Separate rare value mode switching + completion
  - RV mode suggestion
  - Custom value multiplier (for completion)
  - CSV Loader sorting options (alphabetically, change amount, etc.)
  - I forgot LIQUID GOLD somehow
  - Hotkey navigation
  - CSV backward compatibility

- **NAN**
  - CSV editor concept
  - Checkmark & inventory comparison for trade tool quantities
  - John Values = pout gradient
  - "More Stats" button
  - UI scaling suggestions
  - Secondary CSV switcher and editor
  - Obtain Rate toggle for rare values
  - Multiple rounding and precision improvements

- **Mlhy**
  - Multiple ore & layer wheel page suggestions

- **Randomwastaken**
  - Porting completion % gain and other important stats to the CSV loader page
  - Checkmark for 100% completion of a given layer

- **Sandglasss**
  - Multiple trade tool UX improvements (search bar and adding ore functionality)

- **Galactic**
  - Custom value setting
  - Dark mode

- **Sean**
  - Custom per-ore values
  - And who could forget:
    - **v2025626 Deployed!**
      - pooped on a shit

- **MCHF**
  - "More Stats" button opening quick summary
  - Manual override input for inventory quantities per ore
  - Copy to clipboard in the corner of each layer table that copies that layer's search filter

- **Nerolin**
  - Dynamically generated ore className (for gradients)
  - Re-structuring the values dictionary to use just one with multiple variables for value sets

- **Water**
  - [Patic](#)
    ${showPatic ? '![Patic](' + patic + ')' : ''}

- **ozo**
  - Animated gradients for Torn Fabric & Astathian

- **Freeze & ozo**
  - Multiple Home Page UI improvements

- **HolySeeker**
  - ALL THE LAYER AND ORE GRADIENTS. GOAT

- **Raid/Samarium**
  - Grind strategies for ores on Misc page

- **GeoSY**
  - This fellow created the entire game of TCC! Wow!
  - New TCC icon for home page

- **Luna**
  - Background opacity/transparency scale
  `;

  return (
    <>
      <NavBar />
      <div className="credits-content">
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
    </>
  );
}

export default CreditsPage;