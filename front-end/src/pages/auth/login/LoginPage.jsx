import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import XSvg from "../../../components/svgs/X";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import styles from "../../../styles/components/authPage.module.css";
import { loginUser } from "../../../service/authService";
import { useAuth } from "../../../contexts/AuthContext";


const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(formData.username, formData.password);
      
      // Use the login function from AuthContext
      login(
        {
          id: data.id,
          username: data.username,
          display_name: data.display_name,
          email: data.email,
          bio: data.bio
        },
        data.access_token
      );
      
      // Navigate to home page on successful login
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <XSvg className={styles.logo} />
        </div>
        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Log in to Your Account</h1>
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputContainer}>
              <FaUser className={styles.inputIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
            
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.switchSection}>
              <p>Don't have an account?</p>
              <Link to='/signup'>
                <button className={styles.switchButton}>Sign up</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;