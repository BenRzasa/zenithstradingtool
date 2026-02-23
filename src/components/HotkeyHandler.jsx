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

import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MiscContext } from "../context/MiscContext";

const HotkeyHandler = ({ children }) => {
  const { hotkeysEnabled, setSettingsOpen } = useContext(MiscContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input/textarea or hotkeys disabled
      if (
        !hotkeysEnabled ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement?.tagName
        )
      ) {
        return;
      }

      // Don't trigger on modifier keys
      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;

      switch (e.key.toLowerCase()) {
        case "s":
          e.preventDefault();
          setSettingsOpen((prev) => !prev);
          break;
        case "h":
          e.preventDefault();
          navigate("/");
          break;
        case "v":
          e.preventDefault();
          navigate("/valuechart");
          break;
        case "t":
          e.preventDefault();
          navigate("/tradetool");
          break;
        case "u":
          e.preventDefault();
          navigate("/customvalues");
          break;
        case "r":
          e.preventDefault();
          navigate("/findtracker");
          break;
        case "m":
          e.preventDefault();
          navigate("/misc");
          break;
        case "w":
          e.preventDefault();
          navigate("/wheelspage");
          break;
        case "e":
          e.preventDefault();
          navigate("/credits");
          break;
        case "k":
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hotkeysEnabled, navigate, setSettingsOpen]);

  return children;
};

export default HotkeyHandler;
