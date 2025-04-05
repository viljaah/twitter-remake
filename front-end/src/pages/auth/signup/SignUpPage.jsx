import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import styles from './SignUpPage.module.css';
import XSvg from "../../../components/svgs/X";
import { registerUser } from "../../../services/userService";

const SignUpPage = ({ onSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    display_name: "",
    bio: ""
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    
    try {
      // If display_name is empty, use username as display name
      if (!formData.display_name) {
        formData.display_name = formData.username;
      }
      
      // Use the userService to register the user
      const userData = await registerUser(formData);
      
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
          <form onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.heading}>Join today</h1>
            <label className={styles.inputLabel}>
              <MdOutlineMail className={styles.inputIcon} />
              <input
                type='email'
                className='grow'
                placeholder='Email'
                name='email'
                onChange={handleInputChange}
                value={formData.email}
                required
              />
            </label>
            <label className={styles.inputLabel}>
              <FaUser className={styles.inputIcon}/>
              <input
                type='text'
                className='grow'
                placeholder='Username'
                name='username'
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </label>
            <label className={styles.inputLabel}>
              <FaUser className={styles.inputIcon}/>
              <input
                type='text'
                className='grow'
                placeholder='Display Name (optional)'
                name='display_name'
                onChange={handleInputChange}
                value={formData.display_name}
              />
            </label>
            <label className={styles.inputLabel}>
              <MdPassword className={styles.inputIcon}/>
              <input
                type='password'
                className='grow'
                placeholder='Password'
                name='password'
                onChange={handleInputChange}
                value={formData.password}
                required
              />
            </label>
            <label className={styles.inputLabel}>
              <FaUser className={styles.inputIcon}/>
              <textarea
                className='grow'
                placeholder='Bio (optional)'
                name='bio'
                onChange={handleInputChange}
                value={formData.bio}
                rows="3"
              />
            </label>
            <button className={styles.loginButton} disabled={isPending}>
              {isPending ? "Creating account..." : "Sign up"}
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </form>
          <div className={styles.signupContainer}>
            <p>Already have an account?</p>
            <Link to='/login'>
              <button className={styles.signupButton}>Sign in</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage