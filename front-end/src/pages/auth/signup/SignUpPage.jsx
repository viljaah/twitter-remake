import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import styles from './SignUpPage.module.css';
import XSvg from "../../../components/svgs/X";

const SignUpPage = ({ onSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    
    try {
      // Create request data with display_name defaulting to username
      const requestData = {
        ...formData,
        display_name: formData.username, // Set display_name to username by default
        bio: "" // Empty bio
      };
      
      // Send registration request to backend
      const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
      // Registration successful
      alert('Account created successfully! Please login.');
      navigate('/login'); // Redirect to login page
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsPending(false);
    }
  };
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <XSvg className={styles.logo} />
        </div>
        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Join today</h1>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputContainer}>
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
            </div>

            <div className={styles.inputContainer}>
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
            </div>

            <div className={styles.inputContainer}>
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
            </div>
            
            <button 
              type="submit" 
              className={styles.signUpButton}
              disabled={isPending}
            >
              {isPending ? "Creating account..." : "Sign up"}
            </button>
          </form>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.signInSection}>
            <p>Already have an account?</p>
            <Link to='/login'>
              <button className={styles.signInButton}>Sign in</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;