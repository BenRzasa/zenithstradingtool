import React, { useState } from "react";
import { GetVersion } from "../utils/GetVersion";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import "../styles/WelcomePage.css";

import logo from "../images/misc/tccIconHalloween2025.png";

function WelcomePage() {
  const version = GetVersion();
  let navigate = useNavigate();
  const [showChangelog, setShowChangelog] = useState(false);

  const currentChangelog = `
  ## Current Version: v${version} - Deployed 11/8/2025
  - Major UI update for tables - cool frosted glass effect!

## Last Major Version: v9.10.0 - Deployed 10/11/25
\`\`\`diff
Arid is here!
+ Added Turf & Soil (Surface -> 10m -> 25m) @ 250 & 500 per AV respectively
+ Added Aerolyte @ 4 per AV
+ Added Ammolite @ 3 per AV
+ Added Citrine @ 12 per AV
+ Added Paliatite @ 13 per AV
+ Added Sandstone @ 1000 per AV
+ Added Serpentine @ 11 per AV
+ Added Tourmaline @ 7 per AV
+ Added Turquoise @ 2 per AV
+ Added Skoralite (Stability) @ 10 per AV
+ Added Kymizalum (Interstice) @ 4 per AV
= ALL VALUES SUBJECT TO CHANGE SO DONT WHINE ABOUT THEM THANKS
+ Added 3 charms to Miscellaneous page
    - Kyanite ring (+27% inventory space)
    - Ichor Band (reduces growth spawn rate from cytosol to 1/10th)
    - Polarflare Necklace (makes the player immune to extreme temperatures)
- Removed Aluminum
- Removed Frozen Nitrogen
- Removed Hellstone (Replaced with and moved Garnet)
- Removed Rifted Barrier (no longer obtainable)
= Garnet 7 -> 25 per AV (same rarity as old hellstone, same location)
= Topaz: 3 -> 6 per AV (no longer cave-only)
= Updated Bismuth, Chromium, Profelis, Astathian, Aetherice, Orichalican, Dystranum,
  Torn Fabric, Ectokelyte, Ethanerite, Unobtanium, Ubriniale, Inversium, Revalyte,
  Spiralium, Void Orb (Incomplete), and Zetaslime icons and gradients!
\`\`\`
`;

  return (
    <>
      <div className="welcome-page">
        <img
          src={logo}
          alt="tcc logo"
          style={{
            position: "absolute",
            opacity: "1",
            marginTop: "70vh",
            width: "40vh",
            height: "40vh",
          }}
        />
        <div>
          <h1 className="name">
            <span className="copy-wrap">
              Created by ZenithFlare for The Celestial Caverns
              <br/> We'll miss you NAN, thanks for everything :)
            </span>
          </h1>
          <div className="square"></div>
          <div className="button-container">
            <div className="box-button">
              <button onClick={() => navigate("/valuechart")}>
                ⭐ Value Chart ⭐
              </button>
            </div>
            <div className="box-button">
              <button onClick={() => navigate("/tradetool")}>
                💲Trade Tool💲
              </button>
            </div>
            <div className="box-button">
              <button onClick={() => navigate("/customvalues")}>
                Custom Values
              </button>
            </div>
            <div className="box-button">
              <button onClick={() => navigate("/misc")}>Miscellaneous</button>
            </div>
            <div className="box-button">
              <button onClick={() => navigate("/findtracker")}>
                Rare Tracker
              </button>
            </div>
            <div className="box-button">
              <button onClick={() => navigate("/wheelspage")}>
                Spin the Wheel!
              </button>
            </div>
            <div className="box-button">
              <button onClick={() => navigate("/credits")}>Credits</button>
            </div>
            <div className="box-button">
              <button
                onClick={() =>
                  window.open(
                    "https://thecelestialcaverns.miraheze.org/wiki/The_Celestial_Caverns_Wiki",
                    "_blank"
                  )
                }
              >
                📝TCC Wiki📕
              </button>
            </div>
            <div className="box-button">
              <button
                onClick={() =>
                  window.open("https://discord.gg/rDgqKpJyP9", "_blank")
                }
              >
                My Achievements!
              </button>
            </div>
            <div className="box-button">
              <button
                onClick={() =>
                  window.open("https://ko-fi.com/zenithflare", "_blank")
                }
              >
                🍵Buy Me a Coffee
              </button>
            </div>
            <div className="box-button">
              <button 
                onClick={() => setShowChangelog(!showChangelog)}
                className={showChangelog ? "active" : ""}
              >
                {showChangelog ? "▼ Hide Changelog" : "▲ Show Changelog"}
              </button>
            </div>
          </div>
          <div className="wcard">
            <h1 className="title">
              <span className="copy-wrap">
                Welcome to ZenithFlare's Trading Tool v{version}!
              </span>
            </h1>
          </div>
        </div>

        <h2 className="copyright">Copyright ©2025</h2>
      </div>

      {showChangelog && (
      <>
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999
          }}
          onClick={() => setShowChangelog(false)}
        />

        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "1.75vh",
            width: "60vw",
            height: "fit-content",
            maxHeight: "80vh",
            overflow: "auto",
            whiteSpace: "wrap",
            padding: "3vw",
            background: "var(--background-color)",
            borderRadius: "2vw",
            border: "0.2vw solid var(--switch-outline)",
            zIndex: 10000,
          }}
        >
          <button
            onClick={() => setShowChangelog(false)}
            style={{
              position: "absolute",
              top: "1vw",
              right: "1vw",
              background: "var(--button-background)",
              border: "0.15vw solid var(--switch-outline)",
              borderRadius: "0.5vw",
              fontSize: "1.5vh",
              cursor: "pointer",
              color: "var(--text-color)",
              padding: "0.5vw 1vw",
              zIndex: 10001,
              fontWeight: "bold"
            }}
          >
            Close
          </button>

          <ReactMarkdown>
            {currentChangelog}
          </ReactMarkdown>
        </div>
      </>
    )}
    </>
  );
}

export default WelcomePage;
