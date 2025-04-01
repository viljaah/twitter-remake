import React from 'react'
import {Link} from "react-router-dom";
import {useState} from "react";
import {MdOutlineMail} from "react-icons/md";
import {FaUser} from "react-icons/fa";
import {MdPassword} from "react-icons/md";
import styles from './SignUpPage.module.css';
import XSvg from "../../../components/svgs/X";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSumbit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value});
  }
  
  const isError = false;
  
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <XSvg className={styles.logo} />
        </div>
        <div className={styles.formContainer}>
          <form onSubmit={handleSumbit} className={styles.form}>
            <h1 className={styles.heading}>Join today</h1>
            <label className={styles.inputLabel}>
              <MdOutlineMail className={styles.icon} />
              <input
                type='email'
                className='grow'
                placeholder='Email'
                name='email'
                onChange={handleInputChange}
                value={formData.email}
              />
            </label>
            <label className={styles.inputLabel}>
              <FaUser className={styles.icon}/>
              <input
                type='text'
                className='grow'
                placeholder='Username'
                name='username'
                onChange={handleInputChange}
                value={formData.username} 
              />
            </label>
            <label className={styles.inputLabel}>
              <MdPassword className={styles.icon}/>
              <input
                type='password'
                className='grow'
                placeholder='Password'
                name='password'
                onChange={handleInputChange}
                value={formData.password}
              />
            </label>
            <button className={styles.loginButton}>
              {isPending ? "Loading..." : "Sign up"}
            </button>
            {isError && <p className='text-red-500'>{error?.message}</p>}
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