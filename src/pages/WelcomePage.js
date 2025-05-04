/* ZTT | Homepage
    The page the user will see upon entering the site
*/

import logo from "../images/misc/tcc_icon_afterfool.png";
import universallium from "../images/misc/Universallium.webp";
import neutrine from "../images/misc/Neutrine.webp";
import tornfabric from "../images/misc/Torn_Fabric.webp";
import singularity from "../images/misc/Singularity.webp";
/*
  import ambro from "../images/misc/Ambrosine.webp";
  import ubriniale from "../images/misc/Ubriniale.webp";
  import havicron from "../images/misc/Havicron.webp";
*/

import React from "react";
import NavBar from "../components/NavBar";

import "../styles/WelcomePage.css";

function WelcomePage() {
  return (
    <div className="welcome-page">
      {/* TCC Logo */}
      <img
        src={logo}
        alt="Site Logo"
        className="site-logo"
        style={{
          position: "absolute",
          zIndex: "10000",
          marginLeft: "0px",
          top: "25%", bottom: "50%",
          border: "15px solid black",
          transform: "scale(0.5)",
          borderRadius: "15px"
        }}
      />
      {/* Corner images container */}
      <div className="corner-images-container">
        <img
          src={universallium}
          alt="Top Left"
          className="corner-image top-left"
        />
        <img
          src={neutrine}
          alt="Top Right"
          className="corner-image top-right"
        />
        <img
          src={tornfabric}
          alt="Bottom Left"
          className="corner-image bottom-left"
        />
        <img
          src={singularity}
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

        <NavBar />

        <div className="square"></div>
        <div className="wcard">
          <div className="card-title-wrap">
            <h1 className="title">
              <span className="copy-wrap">
                Welcome to Zenith's Trading Tool v1.4!
              </span>
            </h1>
          </div>
          <div className="card-img"></div>
        </div>

        <h2 className="copyright">
          <span className="copy-wrap">20&nbsp;&nbsp;&nbsp;&nbsp;25</span>
        </h2>
      </div>
    </div>
  );
}

export default WelcomePage;
