import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import styles from "../../../pages/settings/Settings.module.css";
import { useAuth } from "../../../contexts/AuthContext";

/**
 * Account settings component
 * 
 * @param {Object} props
 * @param {Function} props.onBack - Handler for back button
 * @param {Function} props.onLogout - Handler for logout
 */
const AccountSettings = ({ onBack, onLogout }) => {
  const { authUser } = useAuth();
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;
    
    setIsDeleting(true);
    setDeleteError("");

    try {
      const token = localStorage.getItem("token");
      
      if (!authUser?.id) {
        throw new Error("User ID not found");
      }

      // API call to delete account
      const response = await fetch(`https://twitter-remake-backend.onrender.com/api/users/${authUser.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
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
      
      // Show success message
      alert("Your account has been deleted successfully");
      
      // Update parent component's auth state and redirect to login
      onLogout();
      
    } catch (error) {
      console.error("Error deleting account:", error);
      setDeleteError(error.message);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={styles.settingsHeader}>
        <button 
          className={styles.backButton} 
          onClick={onBack}
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
  );
};

export default AccountSettings;