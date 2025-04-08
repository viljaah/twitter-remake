import React, { useContext } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import styles from "../../../pages/settings/Settings.module.css";
import { DarkModeContext, THEME_MODES } from "../../../contexts/DarkMode";

/**
 * Display settings component for theme selection
 * 
 * @param {Object} props
 * @param {Function} props.onBack - Handler for back button
 */
const DisplaySettings = ({ onBack }) => {
  const { themeMode, setThemeMode } = useContext(DarkModeContext);

  return (
    <>
      <div className={styles.settingsHeader}>
        <button 
          className={styles.backButton} 
          onClick={onBack}
        >
          <FaArrowLeft />
        </button>
        <h1 className={styles.headingSettings}>Display</h1>
      </div>

      <div className={styles.displayContent}>
        <p className={styles.displayDescription}>
          Change your background to the color theme you prefer.
        </p>
        
        {/* Background Options */}
        <div className={styles.settingSection}>
          <h2 className={styles.sectionTitle}>Background</h2>
          <div className={styles.backgroundOptions}>
            {/* Default (Black) */}
            <div 
              className={`${styles.backgroundOption} ${styles.themeButton}`}
              role="button"
              onClick={() => {
                console.log("Setting theme to DARK");
                setThemeMode(THEME_MODES.DARK);
              }}
              style={{backgroundColor: "#000000", color: "#ffffff" }}
            >
              <div className={styles.radioButton}>
                {themeMode === THEME_MODES.DARK && (
                  <div className={styles.radioButtonSelected}></div>
                )}
              </div>
              <span>Default Dark</span>
            </div>

            {/* Dim */}
            <div 
              className={`${styles.backgroundOption} ${styles.themeButton}`}
              role="button"
              onClick={() => setThemeMode(THEME_MODES.DIM)}
              style={{ backgroundColor: "#15202b", color: "#ffffff"}} 
            >
              <div className={styles.radioButton}>
                {themeMode === THEME_MODES.DIM && (
                  <div className={styles.radioButtonSelected}></div>
                )}
              </div>
              <span>Dim</span>
            </div>

            {/* Light */}
            <div 
              className={styles.backgroundOption}
              role="button"
              onClick={() => setThemeMode(THEME_MODES.LIGHT)}
              style={{ backgroundColor: "#ffffff", color: "#000000"}}
            >
              <div className={styles.radioButton}>
                {themeMode === THEME_MODES.LIGHT && (
                  <div className={styles.radioButtonSelected}></div>
                )}
              </div>
              <span>Light</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DisplaySettings;