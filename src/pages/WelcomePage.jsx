/*
Zenith's Trading Tool, an interactive website built for Celestial Caverns
Copyright (C) 2026 Ben Rzasa

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.
*/
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
        className="page-wrapper" style={{textAlign: "center"}}
    >
        <h1 style={{justifySelf: "center", alignSelf: "center"}}>
            Welcome to ZenithFlare's Trading Tool v{version}
        </h1>
        <h5 style={{justifySelf: "center", alignSelf: "center"}}>
            Strangifier, for you to insinuate that I somehow "manipulated you and water" into leaving is a complete and blatant lie. 
            <br></br><br></br>Also, fuck you for calling ZTT a "cesspool of piss" and making up bullshit about how I "used it to manipulate people" ???
            <br></br><br></br>Framing me as some evil manipulator in the first place is genuine schizo shit. 
            <br></br><br></br>I don't know what you heard or where that info came from. Truly insane. 
            <br></br><br></br>You two left fully of your own accord, it was your choice. Told me yourselves that you were fed up with staff and geo.
            <br></br><br></br>Your raving paragraphs half consisting of complaints about me wanting tester chat to not be a complete cesspool of unproductive brainrot are ridiculous. I cannot believe how fragile you are when it comes to any criticism, no matter how kindly or politely it's stated, even in a joking way. Really unbelievable :(
            <br></br><br></br>Hope everyone is doing well in CC server, feel free to join my new one using the button below
        </h5>
            <div className="row-container">
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
                <iframe src="https://discord.com/widget?id=1473823354552058028&theme=dark" width="350" height="350" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
            </div>
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
                    window.open("https://discord.gg/M2F3vA5spz", "_blank")
                }
            >
                My New CC Server
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
        <h3>--- Copyright <i class="fas fa-copyright"></i>2026 ---</h3>
    </div>
);
}

export default WelcomePage;
