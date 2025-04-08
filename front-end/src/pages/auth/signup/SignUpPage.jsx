import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import styles from "../../../styles/components/authPage.module.css";
import XSvg from "../../../components/svgs/X";
import { registerUser } from "../../../service/authService";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    display_name: "",
    bio: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      // Prepare the data
      const submitData = { ...formData };
      if (!submitData.display_name) {
        submitData.display_name = submitData.username;
      }

      // Use the registerUser service function
      await registerUser(submitData);
      
      // Show success message and navigate to login
      alert("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <XSvg className={styles.logo} />
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.heading}>Join today</h1>
            <label className={styles.inputContainer}>
              <MdOutlineMail className={styles.inputIcon} />
              <input
                type="email"
                className={styles.input}
                placeholder="Email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                required
              />
            </label>
            <label className={styles.inputContainer}>
              <FaUser className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </label>
            <label className={styles.inputContainer}>
              <FaUser className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder="Display Name (optional)"
                name="display_name"
                onChange={handleInputChange}
                value={formData.display_name}
              />
            </label>
            <label className={styles.inputContainer}>
              <MdPassword className={styles.inputIcon} />
              <input
                type="password"
                className={styles.input}
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                required
              />
            </label>
            <label className={styles.inputContainer}>
              <FaUser className={styles.inputIcon} />
              <textarea
                className={styles.input}
                placeholder="Bio (optional)"
                name="bio"
                onChange={handleInputChange}
                value={formData.bio}
                rows="3"
              />
            </label>
            <button className={styles.submitButton} disabled={isPending}>
              {isPending ? "Creating account..." : "Sign up"}
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </form>
          <div className={styles.switchSection}>
            <p>Already have an account?</p>
            <Link to="/login">
              <button className={styles.switchButton}>Sign in</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;