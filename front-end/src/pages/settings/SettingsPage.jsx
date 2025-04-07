import React, {useState, useContext} from "react";
import { FaArrowLeft } from "react-icons/fa6"; // back button
import styles from "./Settings.module.css";
import { DarkModeContext, THEME_MODES} from "../../contexts/DarkMode";

const SettingsPage = () => {
      const [activePage, setActivePage] = useState("main"); // main for the setting where buttons are displayed (i think), this is by default
      const { themeMode, setThemeMode } = useContext(DarkModeContext);
      const [deleteError, setDeleteError] = useState("");
      const [isDeleting, setIsDeleting] = useState(false);

    // function that will handle account deletion
    const handleDeleteAccount = async () => {
      const confirmed = window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      );

      if (!confirmed) return;
      
      setIsDeleting(true);
      setDeleteError("");

      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          throw new Error("Authentication required");
        }

        const user = JSON.parse(userData);

        // api call service
        const response = await fetch(`http://localhost:8000/api/users/${user.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Try to get error details if possible
          let errorMessage = "Failed to delete account";
          try {
            const data = await response.json();
            errorMessage = data.detail || errorMessage;
          } catch (e) {
            // If parsing JSON fails, use response status
            errorMessage = `Server error: ${response.status} ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        // Clear user data from local storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Show success message
        alert("Your account has been deleted successfully");
        
        // Force direct redirection to login
        window.location.href = "/login";
        
      } catch (error) {
        console.error("Error deleting account:", error);
        setDeleteError(error.message);
        setIsDeleting(false);
      }
    };
    


    return (
        <div className={styles.settingsContainer}>
          {/* Main Settings Page */}
          {activePage === "main" && (
            <>
              <h1 className={styles.headingSettings}>Settings</h1>
              <div className={styles.listOfSettings}>
                <button 
                  className={styles.settingBtn} 
                  onClick={() => setActivePage("account")}
                > 
                  Your account
                </button>

                <button 
                  className={styles.settingBtn} 
                  onClick={() => setActivePage("display")}
                >
                  Display
                </button>
              </div>
            </>
          )}
    
          {/* Account Settings Page */}
          {activePage === "account" && (
            <>
              <div className={styles.settingsHeader}>
                <button 
                  className={styles.backButton} 
                  onClick={() => setActivePage("main")}
                >
                  <FaArrowLeft />
                </button>
                <h1 className={styles.headingSettings}>Your account</h1>
              </div>

              <div className={styles.listOfSettings}>
                <button className={styles.settingBtn}>
                  Change password
                </button>

                <button 
                  className={styles.settingBtn} 
                  style={{ color: 'var(--danger-color)' }}
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete your account"}
                </button>
                
                {deleteError && (
                  <div className={styles.errorMessage}>{deleteError}</div>
                )}
              </div>
            </>
          )}
    
          {/* Display Settings Page */}
          {activePage === "display" && (
            <>
              <div className={styles.settingsHeader}>
                <button 
                  className={styles.backButton} 
                  onClick={() => setActivePage("main")}
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
                        setThemeMode(THEME_MODES.DARK)
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
          )}
        </div>
    );
};
        
export default SettingsPage;
