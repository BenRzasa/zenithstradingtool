import React, { useEffect, useState } from "react";
import "../styles/ThemeSwitch.css";

const ThemeSwitch = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Load saved theme preference
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.setAttribute("data-theme", "dark");
            setIsDark(true);
        } else {
            document.body.setAttribute("data-theme", "light");
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.body.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        } else {
            document.body.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }
        setIsDark(!isDark);
    };

    return (
        <label className="theme-switch">
            <input
                checked={!isDark}
                onChange={toggleTheme}
                type="checkbox"
                aria-label="Toggle dark/light theme"
                title="Toggle theme"
                id="Theme switch"
            />
            <span className="slider">
                <div className="star star_1"></div>
                <div className="star star_2"></div>
                <div className="star star_3"></div>
                <svg viewBox="0 0 16 16" className="cloud">
                    <path
                        transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                        fill="#fff"
                        d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 
                        0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 
                        0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 
                        0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 
                        0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
                    ></path>
                </svg>
            </span>
        </label>
    );
};

export default ThemeSwitch;
