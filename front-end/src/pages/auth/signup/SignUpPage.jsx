import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import styles from "./SignUpPage.module.css";
import XSvg from "../../../components/svgs/X";

const SignUpPage = ({ onSignup }) => {
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

  // In SignUpPage.jsx, update the handleSubmit function:

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

      const response = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        // Handle validation errors from Pydantic
        if (errorData && errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // This is a Pydantic validation error array
            const validationErrors = errorData.detail
              .map((err) => {
                return `${err.loc.slice(1).join(".")}: ${err.msg}`;
              })
              .join("; ");
            throw new Error(validationErrors);
          } else {
            // This is a simple error message
            throw new Error(errorData.detail);
          }
        }

        throw new Error("Failed to create account. Please try again.");
      }

      // Success path
      const userData = await response.json();
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
            <label className={styles.inputLabel}>
              <MdOutlineMail className={styles.inputIcon} />
              <input
                type="email"
                className="grow"
                placeholder="Email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                required
              />
            </label>
            <label className={styles.inputLabel}>
              <FaUser className={styles.inputIcon} />
              <input
                type="text"
                className="grow"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </label>
            <label className={styles.inputLabel}>
              <FaUser className={styles.inputIcon} />
              <input
                type="text"
                className="grow"
                placeholder="Display Name (optional)"
                name="display_name"
                onChange={handleInputChange}
                value={formData.display_name}
              />
            </label>
            <label className={styles.inputLabel}>
              <MdPassword className={styles.inputIcon} />
              <input
                type="password"
                className="grow"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                required
              />
            </label>
            <label className={styles.inputLabel}>
              <FaUser className={styles.inputIcon} />
              <textarea
                className="grow"
                placeholder="Bio (optional)"
                name="bio"
                onChange={handleInputChange}
                value={formData.bio}
                rows="3"
              />
            </label>
            <button className={styles.signUpButton} disabled={isPending}>
              {isPending ? "Creating account..." : "Sign up"}
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </form>
          <div className={styles.signupContainer}>
            <p>Already have an account?</p>
            <Link to="/login">
              <button className={styles.signInButton}>Sign in</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
