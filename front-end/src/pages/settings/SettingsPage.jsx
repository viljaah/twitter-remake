import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import styles from "./Settings.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AccountSettings from "../../components/shared/settings/AccountSettings";
import DisplaySettings from "../../components/shared/settings/DisplaySettings";

const SettingsPage = () => {
  const [activePage, setActivePage] = useState("main");
  const { logout } = useAuth();
  
  return (
    <div className={styles.settingsContainer}>
      {/* Main Settings Page */}
      {activePage === "main" && (
        <MainSettings onNavigate={setActivePage} />
      )}
    
      {/* Account Settings Page */}
      {activePage === "account" && (
        <AccountSettings 
          onBack={() => setActivePage("main")}
          onLogout={logout}
        />
      )}
    
      {/* Display Settings Page */}
      {activePage === "display" && (
        <DisplaySettings 
          onBack={() => setActivePage("main")}
        />
      )}
    </div>
  );
};

// Main settings page with navigation options
const MainSettings = ({ onNavigate }) => {
  return (
    <>
      <h1 className={styles.headingSettings}>Settings</h1>
      <div className={styles.listOfSettings}>
        <button 
          className={styles.settingBtn} 
          onClick={() => onNavigate("account")}
        > 
          Your account
        </button>

        <button 
          className={styles.settingBtn} 
          onClick={() => onNavigate("display")}
        >
          Display
        </button>
      </div>
    </>
  );
};

export default SettingsPage;
