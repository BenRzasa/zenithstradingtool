/* ZTT | Rare finds tracker
  - Here, the user can track all the rares they have found
  - The user can also see the number of AV/NV/UV/RV/TV/SV per ore
  - As well as a running total of the value of their rare finds
  and total amounts of rares and super rares found
*/
import React, { useContext, useState, useMemo } from "react";
import { MiscContext } from "../context/MiscContext";

import NavBar from "../components/NavBar";
import RareRow from "../components/RareRow";
import CustomMultiplierInput from "../components/CustomMultiplierInput";

import "../styles/RareFindsTracker.css";
import { initialOreValsDict } from "../data/OreValues";

import patik from "../images/misc/patik.png";

const RareFindsTracker = () => {
  const {
    rareFindsData,
    setRareFindsData,
    currentMode,
    customMultiplier,
    getValueForMode,
    useObtainRateVals,
  } = useContext(MiscContext);

  /*
    State for tracking when each rare ore was last updated
    Fetches the saved dates from local storage if they exist
    Otherwise, creates a new empty object to store dates
  */
  const [lastUpdatedDates, setLastUpdatedDates] = useState(() => {
    const savedDates = localStorage.getItem("rareFindsLastUpdated");
    return savedDates ? JSON.parse(savedDates) : {};
  });

  /*
    Memoized modeStr - returns a simple string that changes
    depending on the current value mode
  */
  // eslint-disable-next-line
  const modeStr = useMemo(() => {
    switch (currentMode) {
      case 1: return "AV"; // AV
      case 2: return "UV"; // UV
      case 3: return "NV"; // NV
      case 4: return "TV"; // TV
      case 5: return "SV"; // SV
      case 6: return "RV"; // RV
      case 7: return "CV";  // Custom
      default: return "AV"; // Default to AV
    }
  });

  /*
    Calculates the number of AV/NV/UV/RV/TV/SV for a given ore from value 
    param float value: the value of the ore fetched from dict
    param int count: the quantity of the ore (in this case, number found)
    return float: number of Units for the given ore, fixed to 2 decimal places
  */
  const calculateNumV = (value, count) => {
    let numV = 0.0;
    switch (currentMode) {
      case 1:
        numV = value * 1;
        break; // AV
      case 2:
        numV = value * 10;
        break; // UV
      case 3:
        numV = value * 100;
        break; // NV
      case 4:
        numV = value * 500;
        break; // TV
      case 5:
        numV = value * 1000;
        break; // SV
      case 6:
        numV = value * 50;
        break; // RV
      case 7:
        numV = value * customMultiplier;
        break; // Custom
      default:
        numV = value;
    }
    return (count / numV).toFixed(2);
  };

  // Define super rare ores
  const superRareOres = [
    "Rhylazil",
    "Neutrine",
    "Ubriniale",
    "Torn Fabric",
    "Singularity",
  ];

  // Get rares data (bracket notation for string names)
  const raresData = (initialOreValsDict["Rares\nMore Common Than 1/33,333"].concat(initialOreValsDict["True Rares\n1/33,333 or Rarer"]));

  // Need to fix this - should NOT need to hard-code the gradients in...
  const raresGradient = `linear-gradient(90deg, #ffcc66 0%, #f9f575 20%,
                       #f07f53 42.2%, #ec82ff 80%, #b050eb 100%)`;
  const superRaresGradient = `linear-gradient(135deg, #fdfcef 0%,
                            #d3f8f8 20%, #faedfd 30%, #f2caff 37.5%,
                            #ffffff 50%, #ffd9a1 62.5%, #edebd6 70%,
                            #ecf9df 80%, #b7dce1 100%)`;

  // Split rares into two groups
  // Filter the raresData (section of John value dict) by name (reference
  // super rares array)
  const rareOres = raresData.filter((ore) => !superRareOres.includes(ore.name));
  const superRares = raresData.filter((ore) =>
    superRareOres.includes(ore.name)
  );

  // Calculate total rare finds
  const totalRareFinds = rareOres.reduce((total, item) => {
    return total + (rareFindsData[item.name] || 0);
  }, 0);

  // Calculate total super rare finds
  const totalSuperRareFinds = superRareOres.reduce((total, oreName) => {
    return total + (rareFindsData[oreName] || 0);
  }, 0);

  // Calculate the total value of rares found
  const totalRareVal = rareOres
    .reduce((sum, item) => {
      const count = rareFindsData[item.name] || 0;
      const value = useObtainRateVals ? item.obtainVal : getValueForMode(item);
      return sum + parseFloat(calculateNumV(value, count));
    }, 0)
    .toFixed(2); // Apply toFixed AFTER reduce

  // Calculate the total value of super rares found
  const totalSuperRareVal = superRares
    .reduce((sum, item) => {
      const count = rareFindsData[item.name] || 0;
      const value = useObtainRateVals ? item.obtainVal : getValueForMode(item);
      return sum + parseFloat(calculateNumV(value, count));
    }, 0)
    .toFixed(2); // Apply toFixed AFTER reduce

  // Update last updated date for an ore
  const updateLastUpdated = (oreName) => {
    const newDates = {
      ...lastUpdatedDates,
      [oreName]: new Date().toISOString(),
    };
    setLastUpdatedDates(newDates);
    localStorage.setItem("rareFindsLastUpdated", JSON.stringify(newDates));
  };

  // Handle count changes
  const handleCountChange = (itemName, newValue) => {
    let numericValue =
      newValue === ""
        ? ""
        : Math.max(0, isNaN(newValue) ? 0 : Number(newValue));
    setRareFindsData((prev) => ({
      ...prev,
      [itemName]: numericValue,
    }));
  };

  // Increment/decrement functions
  const incrementValue = (itemName) => {
    const currentValue = rareFindsData[itemName] || 0;
    handleCountChange(itemName, currentValue + 1);
    updateLastUpdated(itemName);
  };

  const decrementValue = (itemName) => {
    const currentValue = rareFindsData[itemName] || 0;
    handleCountChange(itemName, Math.max(0, currentValue - 1));
    updateLastUpdated(itemName);
  };

  // Reset rare finds data with options
 const resetRareFinds = (resetType = 'all') => {
  const messages = {
    all: `WARNING: This will permanently delete ALL your rare finds data.\nThis cannot be undone!\nAre you sure you want to reset?`,
    rares: `WARNING: This will permanently delete your REGULAR RARES data only.\nThis cannot be undone!\nAre you sure you want to reset?`,
    superRares: `WARNING: This will permanently delete your SUPER RARES data only.\nThis cannot be undone!\nAre you sure you want to reset?`
  };

  if (!window.confirm(messages[resetType])) return;

  if (resetType === 'all') {
    // Clear both state and localStorage directly
    setRareFindsData({});
    setLastUpdatedDates({});
    localStorage.removeItem("rareFindsData");
    localStorage.removeItem("rareFindsLastUpdated");
    return;
  }

  // For partial resets, create new objects without the specified ores
  const oresToDelete = resetType === 'rares' ? rareOres : superRares;
  setRareFindsData(prev => {
    const newData = {...prev};
    oresToDelete.forEach(ore => delete newData[ore.name]);
    // Update localStorage after state is updated
    setTimeout(() => {
      localStorage.setItem("rareFindsData", JSON.stringify(newData));
    }, 0);
    return newData;
  });

  setLastUpdatedDates(prev => {
    const newDates = {...prev};
    oresToDelete.forEach(ore => delete newDates[ore.name]);
    // Update localStorage after state is updated
    setTimeout(() => {
      localStorage.setItem("rareFindsLastUpdated", JSON.stringify(newDates));
    }, 0);
    return newDates;
  });
}; 

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Never found";

    const newDate = new Date(dateString);
    const currentDate = new Date();

    // Set both dates to midnight to ensure accurate day comparison
    newDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
    const daysPassed = Math.round(Math.abs(newDate.getTime() - currentDate.getTime()) / MILLISECONDS_IN_DAY);

    let daysString = "";
    if (daysPassed === 0) {
      daysString = "(today)";
    } else if (daysPassed === 1) {
      daysString = "(yesterday)";
    } else {
      daysString = `(${daysPassed} days ago)`;
    }

    return (
      newDate.toLocaleDateString() +
      " " +
      new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " " +
      `${daysString}`
    );
  };

  // Function to generate the className based on ore name
  const getOreClassName = (oreName) => {
    return `color-template-${oreName.toLowerCase().replace(/ /g, "-")}`;
  };

  return (
  <>
    <div className="patic">
    <img
      src={patik}
      alt="patik"
      style={{
        position:"absolute",
        opacity:"0.025"
      }}
    />
    </div>
  <NavBar />
    <div className="rare-finds-tracker">
    <h1>Rare Finds Tracker</h1>
      <CustomMultiplierInput />
      <div className="button-container">
        <div className="box-button">
          <button className="reset-btn" onClick={() => resetRareFinds('rares')}>
            Reset Rares
          </button>
        </div>
        <div className="box-button">
          <button className="reset-btn" onClick={() => resetRareFinds('superRares')}>
            Reset Super Rares
          </button>
        </div>
        <div className="box-button">
          <button className="reset-btn" onClick={() => resetRareFinds('all')}>
            Reset All Finds
          </button>
        </div>
      </div>

      {/* Totals display */}
      <div className="totals-container">
        <div className="total-box">
          <h3>Total Rare Finds</h3>
          <p>{totalRareFinds}</p>
        </div>
        <div className="total-box">
          <h3>Value of Rares Found</h3>
          <p>
            {totalRareVal} {modeStr}
          </p>
        </div>
        <div className="total-box super-rare">
          <h3>Super Rare Finds</h3>
          <p>{totalSuperRareFinds}</p>
        </div>
        <div className="total-box super-rare">
          <h3>Value of Super Rares Found</h3>
          <p>
            {totalSuperRareVal} {modeStr}
          </p>
        </div>
      </div>
      <div className="r-tables-container">
        {/* Regular rares table */}
        <div
          className="table-wrapper"
          style={{ width: "800px" }}
        >
          <h2
            className="table-wrapper h2"
            style={{ background: raresGradient }}
            data-text="Regular Rares"
          >
            Regular Rares
          </h2>
          <table
            className="rare-table"
            style={{id:"test"}}
          >
            <thead>
              <tr>
                <th>Ore Name</th>
                <th>Amount Found</th>
                <th># {modeStr}</th>
                <th>Last Found</th>
              </tr>
            </thead>
            <tbody>
              {rareOres.map((item, index) => (
                <RareRow
                  key={index}
                  item={item}
                  count={rareFindsData[item.name] || 0}
                  lastUpdated={lastUpdatedDates[item.name]}
                  incrementValue={incrementValue}
                  decrementValue={decrementValue}
                  handleCountChange={handleCountChange}
                  getOreClassName={getOreClassName}
                  calculateNumV={calculateNumV}
                  formatDate={formatDate}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Super rares table */}
        <div
          className="table-wrapper"
          style={{ width: "800px", margin: "20px auto" }}
        >
          <h2
            className="table-wrapper h2"
            style={{ background: superRaresGradient }}
            data-text="Super Rares"
          >
            Super Rares
          </h2>
          <table className="rare-table">
            <thead>
              <tr>
                <th>Ore Name</th>
                <th>Amount Found</th>
                <th># {modeStr}</th>
                <th>Last Found</th>
              </tr>
            </thead>
            <tbody>
              {superRares.map((item, index) => (
                <RareRow
                  key={index}
                  item={item}
                  count={rareFindsData[item.name] || 0}
                  lastUpdated={lastUpdatedDates[item.name]}
                  incrementValue={incrementValue}
                  decrementValue={decrementValue}
                  handleCountChange={handleCountChange}
                  getOreClassName={getOreClassName}
                  calculateNumV={calculateNumV}
                  formatDate={formatDate}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default RareFindsTracker;
