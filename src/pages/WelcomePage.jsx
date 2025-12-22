import React, { useState } from "react";
import { GetVersion } from "../utils/GetVersion";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import logo from "../images/misc/CC_Thumbnail.png";

function WelcomePage() {
    const version = GetVersion();
    let navigate = useNavigate();
    const [showChangelog, setShowChangelog] = useState(false);

    const currentChangelog = `
## Current Version: v${version}

## Last Major Version: v9.13.0
\`\`\`diff
Soulscape is here! Also I revamped the entire site UI
+ ZTT UI is now fully mobile-compatible and 100% responsive to monitor size!
+ Consistent theming, much less unnecessary HTML and CSS classes and files
+ Added all Soulscape ores, Arsenic, Tanzanite, Stygian Ooze, Noxigranite, Slate, Emberlite, Ultimatter, etc.
= ALL VALUES SUBJECT TO CHANGE
+ Added 3 charms to Miscellaneous page: Zynulvinite Band, Impervium Ring, and Bismuth Band
= Renamed Boomite -> Nitrolyte, Blastium -> Vitriolyte, uhhhh idk
- Removed Newtonium, Firecrystal, Mantle Fragment
= Multiple value changes, let me know if any values are weird. Haven't had time to look at or test any, myself
\`\`\`
`;

return (
    <div 
        className="page-wrapper"
    >
        <h1 className="page-name">
            Welcome to ZenithFlare's Trading Tool v{version}!
        </h1>
        <img
            src={logo}
            alt="tcc logo"
            style={{
                width: "20em",
                height: "20em",
                border: "5px solid var(--switch-outline)",
                boxShadow: "10px 10px 10px 0px rgba(0, 0, 0, 0.8)",
            }}
        />
        <h2>Created by ZenithFlare for Celestial Caverns</h2>
        <div className="button-container">
            <button onClick={() => navigate("/valuechart")}>
                Value Chart
            </button>
            <button onClick={() => navigate("/tradetool")}>
                Trade Tool
            </button>
            <button onClick={() => navigate("/customvalues")}>
                Custom Values
            </button>
            <button onClick={() => navigate("/misc")}>
                Miscellaneous
            </button>
            <button onClick={() => navigate("/findtracker")}>
                Rare Tracker
            </button>
            <button onClick={() => navigate("/wheelspage")}>
                Spin the Wheel!
            </button>
            <button onClick={() => navigate("/credits")}>
                Credits
            </button>
            <button
                onClick={() =>
                    window.open(
                        "https://celestialcaverns.miraheze.org/wiki/Celestial_Caverns_Wiki",
                        "_blank"
                    )
                }
            >
                CC Wiki
            </button>
            <button
                onClick={() =>
                    window.open("https://discord.gg/rDgqKpJyP9", "_blank")
                }
            >
                My Achievements!
            </button>
            <button
                onClick={() =>
                    window.open("https://ko-fi.com/zenithflare", "_blank")
                }
            >
                Buy Me a Coffee
            </button>
            <button 
                onClick={() => setShowChangelog(!showChangelog)}
                className={showChangelog ? "active" : ""}
            >
                {showChangelog ? "▼  Hide Changelog" : "▲  Show Changelog"}
            </button>
        </div>
        {showChangelog && (
            <div 
                className="popup-overlay" 
                onClick={() => setShowChangelog(false)}
            >
                <div className="box">
                    <button 
                        className="close-button"
                        onClick={() => setShowChangelog(false)}
                    >
                        ✖
                    </button>
                    <ReactMarkdown>
                        {currentChangelog}
                    </ReactMarkdown>
                </div>
            </div>
        )}
        <h3>--- Copyright <i class="fas fa-copyright"></i>2025 ---</h3>
    </div>
);
}

export default WelcomePage;
