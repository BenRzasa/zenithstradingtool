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
    <span className="nav-h">[ Navigation ☰ ]</span>

      {isOpen && (
        <ul className="dropdown-menu">
          <li><Link to="/"
            onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/csvloader"
            onClick={() => setIsOpen(false)}>CSV Loader</Link></li>
          <li><Link to="/valuechart"
            onClick={() => setIsOpen(false)}>Value Chart</Link></li>
          <li><Link to="/tradetool"
            onClick={() => setIsOpen(false)}>Trade Tool</Link></li>
          <li><Link to="/misc"
            onClick={() => setIsOpen(false)}>Miscellaneous</Link></li>
          <li><a
            href="https://the-celestial-caverns.fandom.com/wiki/The_Celestial_Caverns_Wiki"
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