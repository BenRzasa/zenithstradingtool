/* ZTT | Homepage
    The page the user will see upon entering the site
*/

import logo from "../images/misc/tcc_icon_afterfool.png";
import singularity from "../images/misc/Singularity.webp";
/*
  import ambro from "../images/misc/Ambrosine.webp";
  import ubriniale from "../images/misc/Ubriniale.webp";
  import havicron from "../images/misc/Havicron.webp";
  import universallium from "../images/misc/Universallium.webp";
  import neutrine from "../images/misc/Neutrine.webp";
  import tornfabric from "../images/misc/Torn_Fabric.webp";
*/

import React from "react";
import { useNavigate } from "react-router-dom";

import "../styles/WelcomePage.css";

function WelcomePage() {
  let navigate = useNavigate();
  return (
    <div className="welcome-page">
      <div className="button-container">
        <button
          onClick={() => navigate('/csvloader')}
          class="slide-btn"
        >CSV Loader</button>
        <button
          onClick={() => navigate('/valuechart')}
          class="slide-btn"
        >Value Chart</button>
        <button
          onClick={() => navigate('/tradetool')}
          class="slide-btn"
        >Trade Tool</button>
        <button
          onClick={() => navigate('/misc')}
          class="slide-btn"
        >Miscellaneous</button>
        <button
          onClick={() => navigate('/customvalues')}
          class="slide-btn"
        >Custom Values</button>
        <button
          onClick={() => window.open('https://the-celestial-caverns.fandom.com/wiki/The_Celestial_Caverns_Wiki', "_blank")}
          class="slide-btn"
        >TCC Wiki</button>
      </div>
      {/* Corner images container */}
      <div className="corner-images-container">
        <img
          src={logo}
          alt="Top Left"
          className="corner-image top-left"
        />
        <img
          src={singularity}
          alt="Top Right"
          className="corner-image top-right"
        />
        <img
          src={singularity}
          alt="Bottom Left"
          className="corner-image bottom-left"
        />
        <img
          src={logo}
          alt="Bottom Right"
          className="corner-image bottom-right"
        />
      </div>
      <div>
        <h1 className="name">
          <span className="copy-wrap">
            Created by ZenithFlare for The Celestial Caverns
          </span>
        </h1>
        <div className="square"></div>
        <div className="wcard">
            <h1 className="title">
              <span className="copy-wrap">
                Welcome to Zenith's Trading Tool v1.4!
              </span>
            </h1>
          </div>
        </div>

        <h2 className="copyright">
          <span className="copy-wrap">20&nbsp;&nbsp;&nbsp;&nbsp;25</span>
        </h2>
    </div>
  );
}

export default WelcomePage;
