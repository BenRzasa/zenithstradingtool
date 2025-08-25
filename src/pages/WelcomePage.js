import React from "react";
import { GetVersion } from '../utils/GetVersion';
import { useNavigate } from "react-router-dom";

import "../styles/WelcomePage.css";

import logo from "../images/misc/TCC_Logo.png";

function WelcomePage() {
  const version = GetVersion();
  let navigate = useNavigate();
  return (
    <div className="welcome-page">
        <img
          src={logo}
          alt="tcc logo"
          style={{
            position:"absolute",
            opacity:"1",
            marginTop:"70vh",
            width:"40vh", height:"40vh"
          }}
        />
      <div>
        <h1 className="name">
          <span className="copy-wrap">
            Created by ZenithFlare for The Celestial Caverns
          </span>
        </h1>
        <div className="square"></div>
      <div className="button-container">
        <div className="box-button">
          <button
            onClick={() => navigate('/valuechart')}
          >⭐ Value Chart ⭐</button>
        </div>
        <div className="box-button">
          <button
            onClick={() => navigate('/tradetool')}
          >💲Trade Tool💲</button>
        </div>
        <div className="box-button">
          <button
            onClick={() => navigate('/customvalues')}
          >Custom Values</button>
        </div>
        <div className="box-button">
          <button
            onClick={() => navigate('/misc')}
          >Miscellaneous</button>
        </div>
        <div className="box-button">
          <button
            onClick={() => navigate('/findtracker')}
          >Rare Tracker</button>
        </div>
        <div className="box-button">
          <button
            onClick={() => navigate('/wheelspage')}
          >Spin the Wheel!</button>
        </div>
        <div className="box-button">
          <button
            onClick={() => navigate('/credits')}
          >Credits</button>
        </div>
        <div className="box-button">
          <button
            onClick={() => window.open('https://thecelestialcaverns.miraheze.org/wiki/The_Celestial_Caverns_Wiki', "_blank")}
          >📝TCC Wiki📕</button>
        </div>
        <div className="box-button">
          <button
            onClick={() => window.open('https://ko-fi.com/zenithflare', "_blank")}
          >🍵Buy Me a Coffee</button>
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

        <h2 className="copyright">
          Copyright ©2025
        </h2>
    </div>
  );
}

export default WelcomePage;
