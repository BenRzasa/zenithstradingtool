
import React from "react";
import NavBar from "../components/NavBar";

import "../styles/CreditsPage.css";

function CreditsPage() {
  return (
    <>
    <NavBar />
    <div className="credits-content">

      <h1>Feature, Assets, & Inspiration Credits</h1>
      <ul>
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
            <li>CSV backward compatibility (STILL UNKNOWN IF THIS WORKS, NEW ORES HAVE NOT BEEN ADDED SINCE)</li>
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
            <li>Patic</li>
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
