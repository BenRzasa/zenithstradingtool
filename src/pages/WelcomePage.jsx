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
            Welcome to ZenithFlare's Trading Tool v{version} <br></br>[DEPRECATED INDEFINITELY]
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
            <p>Uhh don't really know what to say here, enjoyed my time with the game but unfortunately was getting addicted over time without even realizing it. Thinking about the game half the day even when out with friends or family, even on a Christmas trip to Europe. Pretty wacky. Anyway. Appreciate everything everyone here has done to help me with my tool, and trading, and whatever. </p>
            <p>I know I've acted like a jackass to people pretty often and I sincerely apologize to everyone I may have insulted or prodded too much, I'm a blunt person and often I find it extends into rudeness, at least online, sometimes unintentionally. I let the game get to my head. It's just a game and at the end of the day, while it may matter to me more than others, I can't let that influence my attitude, and I failed in that regard. Figure it's best for me to move on. </p>
            <p>SV grind was honestly pretty fun for the most part, I took it slow and enjoyed the vast majority of my time playing the game, until recently. Lately though it's felt like more and more of an uphill slog. God I wish I had time to finish it fully. It's the one main overarching goal that kept me going. And it fucking hurts to just leave it here, so close, at 94-97% completion over the course of the past few updates, but I can't bring myself to finish it. </p>
            <p>But hey at least I got all emblems! Never even remotely thought I'd complete that, lol</p>
            <p>ZTT has been a major drive for me to keep playing and talking here as well, with so much community input and cool people helping me along the way. Really really proud of this tool and the usage it's gotten over the past 9 months of active development (over 800 commits on github is genuinely insane?). I wish more people appreciated the time and effort I put into it. To me it felt like people took it for granted a lot of the time. Which is ok, but it left me wondering if all the time sunk in was even worth it at the end of the day. Hopefully y'all think so. </p>
            <p>Anyway, that'll be permanently deprecated unless some brave soul wants to dredge up the horrors of the code from its public GitHub repository, download and host it themselves. It won't be an easy task. Don't attempt it unless you know what you're doing, please.</p>
            <p>Geo, Water, Strange, Div, and Tuan (and Keeth! hopefully im not missing anyone else), I'm sorry for acting like a fool towards you guys and other devs so often. I love the game and know it has potential, but I got too into it, too convinced that my ideas should be taken more seriously just because I was an active player and contributor in the form of ZTT. Never intended to end up acting this way and I realize that it was truly obnoxious and goofy. </p>
            <p>I appreciate you five (six) and everything you guys made for the game. Real talent there and everywhere else showing clearly in every aspect of the game. From layer atmosphere to ore textures to particles, to insanely unique enemies, hazards, deco, beautiful pick and layer models! I could go on for a while. I hope the team can keep the game alive and realize a concrete vision for its future proceeding forward.</p>
            <p>Wow that ended up being about 3 times longer than I wanted, eh whatever. I'm a yapper. Anyway geo please add that one fun easter egg thingy I think people will really like it.</p>
            <p>P.S. Yes ZTT will be indefinitely deprecated. No I do not have any plans of reviving it. Sorry!</p>
            <h2>That's All, Folks! Thanks for everything and I hope you all are doing well👋</h2>
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
