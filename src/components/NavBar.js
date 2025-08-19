import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import '../styles/NavBar.css';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
  <nav className="nav"
    onMouseEnter={() => setIsOpen(true)}
    onMouseLeave={() => setIsOpen(false)}>
    <div className="dropdown-container"

    >
    <span className="nav-h">Navigation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="fas fa-bars"></i></span>

      {isOpen && (
        <ul className="dropdown-menu">
          <li><Link to="/"
            onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/valuechart"
            onClick={() => setIsOpen(false)}>Value Chart</Link></li>
          <li><Link to="/tradetool"
            onClick={() => setIsOpen(false)}>Trade Tool</Link></li>
          <li><Link to="/customvalues"
            onClick={() => setIsOpen(false)}>Custom Values</Link></li>
          <li><Link to="/findtracker"
            onClick={() => setIsOpen(false)}>Rare Tracker</Link></li>
          <li><Link to="/misc"
            onClick={() => setIsOpen(false)}>Miscellaneous</Link></li>
          <li><Link to="/wheelspage"
            onClick={() => setIsOpen(false)}>Spin the Wheel!</Link></li>
          <li><Link to="/credits"
            onClick={() => setIsOpen(false)}>Credits</Link></li>
          <li><a
            href="https://thecelestialcaverns.miraheze.org/wiki/The_Celestial_Caverns_Wiki"
            target="_blank" rel="noreferrer">
              TCC Wiki
            </a>
          </li>
        </ul>
      )}
    </div>
  </nav>
  );
};

export default NavBar;