
import React, { useState } from "react";
import NavBar from "../components/NavBar";

import patic from "../images/misc/patic3.png";

import "../styles/CreditsPage.css";

function CreditsPage() {
  const [showPatic, setShowPatic] = useState(false);

  return (
    <>
    <NavBar />
    <div className="credits-content">

      <h1 style={{marginLeft: "60px"}}>Feature, Assets, & Inspiration Credits</h1>
      <ul>
        <li><strong>Concept originally inspired by John's Trading Tool, a spreadsheet-based tool created by John_Sypher.</strong>
        </li>
        <li><strong>Multiple Users</strong>
          <ul>
            <li>Feedback and improvements for mobile compatibility!!</li>
          </ul>
        </li>
        <li><strong>Glitch</strong>
          <ul>
            <li>Various CSV loader QoL changes</li>
            <li>AV Gain since last update</li>
            <li>Date & time since last update</li>
            <li>RV & TV mode suggestions</li>
            <li>Custom background image!!</li>
            <li>Emblem list with useful perks (with icons)</li>
          </ul>
        </li>
        <li><strong>Hiyo</strong>
          <ul>
            <li>RV mode suggestion</li>
            <li>Custom value multiplier (for completion)</li>
            <li>CSV Loader sorting options (alphabetically, change amount, etc.)</li>
            <li>I forgot LIQUID GOLD somehow</li>
            <li>Hotkey navigation</li>
            <li>CSV backward compatibility</li>
          </ul>
        </li>
        <li><strong>NAN</strong>
          <ul>
            <li>CSV editor concept</li>
            <li>Checkmark & inventory comparison for trade tool quantities</li>
            <li>John Values = pout gradient</li>
            <li>"More Stats" button</li>
            <li>UI scaling suggestions</li>
            <li>Secondary CSV switcher and editor</li>
            <li>Obtain Rate toggle for rare values</li>
            <li>Multiple rounding and precision improvements</li>
          </ul>
        </li>
        <li><strong>Mlhy</strong>
          <ul>
            <li>Multiple ore & layer wheel page suggestions</li>
          </ul>
        </li>
        <li><strong>Randomwastaken</strong>
          <ul>
            <li>Porting completion % gain and other important stats to the CSV loader page</li>
            <li>Checkmark for 100% completion of a given layer</li>
          </ul>
        </li>
        <li><strong>Sandglasss</strong>
          <ul>
            <li>Multiple trade tool UX improvements (search bar and adding ore functionality)</li>
          </ul>
        </li>
        <li><strong>Galactic</strong>
          <ul>
            <li>Custom value setting</li>
            <li>Dark mode</li>
          </ul>
        </li>
        <li><strong>Sean</strong>
          <ul>
            <li>Custom per-ore values</li>
            <li>And who could forget:
              <ul>
                <li><strong>v2025626 Deployed!</strong>
                  <ul>
                    <li>pooped on a shit</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li><strong>MCHF</strong>
          <ul>
            <li>"More Stats" button opening quick summary</li>
            <li>Manual override input for inventory quantities per ore</li>
            <li>Copy to clipboard in the corner of each layer table that copies that layer's search filter</li>
          </ul>
        </li>
        <li><strong>Nerolin</strong>
          <ul>
            <li>Dynamically generated ore className (for gradients)</li>
            <li>Re-structuring the values dictionary to use just one with multiple variables for value sets</li>
          </ul>
        </li>
        <li><strong>Water</strong>
          <ul>
            <li>
              <button
                onClick={() => setShowPatic(!showPatic)} 
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  font: 'inherit',
                  cursor: 'pointer',
                  color: 'var(--text-color)'
                }}
              >
                Patic
              </button>
              {showPatic && (
                <img
                  src={patic}
                  alt="patic"
                  style={{
                    position: "absolute",
                    opacity: 1
                  }}
                />
              )}
            </li>
          </ul>
        </li>
        <li><strong>Freeze & ozo</strong>
          <ul>
            <li>Multiple Home Page UI improvements</li>
          </ul>
        </li>
        <li><strong>HolySeeker</strong>
          <ul>
            <li>ALL THE LAYER AND ORE GRADIENTS. GOAT</li>
          </ul>
        </li>
        <li><strong>Raid/Samarium</strong>
          <ul>
            <li>Grind strategies for ores on Misc page</li>
          </ul>
        </li>
        <li><strong>GeoSY</strong>
          <ul>
            <li>This fellow created the entire game of TCC! Wow!</li>
            <li>New TCC icon for home page</li>
          </ul>
        </li>
        <li><strong>Luna</strong>
          <ul>
            <li>Background opacity/transparency scale</li>
          </ul>
        </li>
      </ul>
    </div>
    </>
  )
};

export default CreditsPage;
