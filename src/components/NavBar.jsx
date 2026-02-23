/*
 * Zenith's Trading Tool - An external website created for Celestial Caverns
 * Copyright (C) 2026 - Ben Rzasa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
*/

import { Link } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = () => {
    return (
        <div className="nav-bar">
            <div className="nav-bar-item">
                <div className="hide">
                    <Link to="/">
                        <i className="fas fa-house"></i><span>Home</span>
                    </Link>
                </div>
            </div>
            <div className="nav-bar-item">
                <div className="hide">
                    <Link to="/valuechart">
                        <i className="fas fa-coins"></i><span>Values</span>
                    </Link>
                </div>
            </div>
            <div className="nav-bar-item">
                <div className="hide">
                    <Link to="/tradetool">
                        <i className="fas fa-sack-dollar"></i><span>Trade</span>
                    </Link>
                </div>
            </div>
            <div className="nav-bar-item">
                <div className="hide">
                    <Link to="/customvalues">
                        <i className="fas fa-pencil"></i><span>Custom</span>
                    </Link>
                </div>
            </div>
            <div className="nav-bar-item">
                <div className="hide">
                    <Link to="/findtracker">
                        <i className="fas fa-gem"></i><span>Rares</span>
                    </Link>
                </div>
            </div>
            <div className="nav-bar-item">
                <div className="hide">
                    <Link to="/misc">
                        <i class="fa-solid fa-arrow-down-short-wide"></i><span>Misc</span>
                    </Link>
                </div>
            </div>
            <div className="nav-bar-item">
                <div className="hide">
                    <Link to="/wheelspage">
                        <i class="fa-solid fa-chart-pie"></i><span>Spin!</span>
                    </Link>
                </div>
            </div>
            <div className="nav-bar-item">
                <div className="hide">
                    <Link to="/credits">
                        <i class="fa-solid fa-circle-info"></i><span>Credits</span>
                    </Link>
                </div>
            </div>
            <div className="nav-bar-item">
                <div className="hide">
                    <a
                        href="https://celestialcaverns.miraheze.org/wiki/Celestial_Caverns_Wiki"
                        target="_blank"
                        rel="noreferrer"
                    ><i class="fa-solid fa-book"></i>
                    </a><span>Wiki</span>
                </div>
            </div>
            <div className="nav-bar-item">
                <div className="hide">
                    <a
                        href="https://discord.gg/M2F3vA5spz"
                        target="_blank"
                        rel="noreferrer"
                    ><i class="fa fa-discord"></i>
                    </a><span>CC Server</span>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
