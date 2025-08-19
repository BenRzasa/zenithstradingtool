import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MiscContext } from '../context/MiscContext';

const HotkeyHandler = ({ children }) => {
  const { hotkeysEnabled, setSettingsOpen } = useContext(MiscContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if typing in an input/textarea or hotkeys disabled
      if (!hotkeysEnabled || 
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      // Check for modifier keys (don't trigger if Ctrl/Alt/Shift/Meta is pressed)
      if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;

      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          setSettingsOpen(prev => !prev);
          break;
        case 'h':
          e.preventDefault();
          navigate('/');
          break;
        case 'v':
          e.preventDefault();
          navigate('/valuechart');
          break;
        case 't':
          e.preventDefault();
          navigate('/tradetool');
          break;
        case 'u':
          e.preventDefault();
          navigate('/customvalues');
          break;
        case 'r':
          e.preventDefault();
          navigate('/findtracker');
          break;
        case 'm':
          e.preventDefault();
          navigate('/misc');
          break;
        case 'w':
          e.preventDefault();
          navigate('/wheelspage');
          break;
        case 'e':
          e.preventDefault();
          navigate('/credits');
          break;
        case 'k':
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkeysEnabled, navigate, setSettingsOpen]); // Added setSettingsOpen to dependencies

  return children;
};

export default HotkeyHandler;