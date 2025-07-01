/* ZTT | Homepage
    The page the user will see upon entering the site
*/

import React from "react";
import { useNavigate } from "react-router-dom";
import packageJson from '../../package.json'; // or use process.env.REACT_APP_VERSION

import "../styles/WelcomePage.css";

function WelcomePage() {
  let navigate = useNavigate();
  return (
    <div className="welcome-page">
      <div className="button-container">
        <div className="box-button">
        <button
          onClick={() => navigate('/csvloader')}
        >⭐CSV Loader⭐</button>
        </div>
        <div className="box-button">
        <button
          onClick={() => navigate('/valuechart')}
        >Value Chart</button>
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
          onClick={() => window.open('https://thecelestialcaverns.miraheze.org/wiki/The_Celestial_Caverns_Wiki', "_blank")}
        >📝TCC Wiki📕</button>
        </div>
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
                Welcome to ZenithFlare's Trading Tool v{packageJson.version}!
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
