import React, {useState} from "react";
import styles from "./Settings.module.css";

const SettingsPage = () => {
     const [activePage, setActivePage] = useState("main"); // main for the setting where buttons are displayed (i think), this is by default
 
         {/* using state variable activePage to contorl whihc section is displayed 
        , which gives a clean way to handle navigaiton between settings pages without acutyally changing routes
        for that i iwll use conditional rendering for each settings section*/}

        {/*Key React Concepts Used:
        1. useState to track which settings page is active
        2. Conditional rendering with {condition && <jsx>} syntax
        3. Event handlers on buttons to change pages*/}
        return (
            <div className={styles.settingsContainer}>
              {/* Main Settings Page */}
              {activePage === "main" && (
                <>
                  <h1 className={styles.headingSettings}>Settings</h1>
                  <div className={styles.listOfSettings}>
                     <button className={styles.settingBtn} 
                            onClick={() => setActivePage("account")}> {/* this is what TA explained*/}
                            Your account
                        </button>

                        <button className={styles.settingBtn} onClick={() => setActivePage("display")}>
                            Display
                        </button>
                  </div>
                </>
              )}
        
              {/* Account Settings Page */}
              {activePage === "account" && (
                <>
                  <div className={styles.settingsHeader}>
                        <button className={styles.backButton} onClick={() => setActivePage("main")}>
                            Back
                        </button>
                     <h1 className={styles.headingSettings}>Your account</h1>
                  </div>

                  <div className={styles.listOfSettings}>
                        <button className={styles.settingBtn}>
                             Change password
                        </button>
                        <button className={styles.dangerBtn}>
                             Delete your account
                        </button>
                  </div>
                </>
              )}
        
              {/* Display Settings Page */}
              {activePage === "display" && (
                <>
                  <div className={styles.settingsHeader}>
                        <button className={styles.backButton} onClick={() => setActivePage("main")}>
                          Back
                        </button>
                        <h1 className={styles.headingSettings}>Display</h1>
                  </div>

                  <div className={styles.displayContent}>
                    <p className={styles.displayDescription}>
                      Manage your font size, color, and background. These settings affect all X accounts on this browser.
                    </p>
                    
                    {/* Background Options */}
                    <div className={styles.settingSection}>
                      <h2 className={styles.sectionTitle}>Background</h2>
                      <div className={styles.backgroundOptions}>
                             {/* Default */}
                            <div className={styles.backgroundOption}>
                                <div className={styles.radioButton}></div>
                                <span>Default</span>
                            </div>
                        
                            {/* Dim */}
                            <div className={styles.backgroundOption}>
                                <div className={styles.radioButton}>
                                    <div className={styles.radioButtonSelected}></div>
                                </div>
                                <span>Dim</span>
                            </div>
                        
                            {/* Lights out */}
                            <div className={styles.backgroundOption}>
                                <div className={styles.radioButton}></div>
                                <span>Lights out</span>
                            </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        };
        
        export default SettingsPage;
