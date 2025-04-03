import { useState, useEffect } from 'react'
import './App.css'
import {Route, Routes, Navigate} from 'react-router-dom';
import SideBar from './components/shared/SideBar';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from "./pages/settings/SettingsPage";
// import ExplorePage from './pages/explore/ExplorePage';
// import PostPage from './pages/post/PostPage';


function App() {
  // Replace dummy auth with real auth state
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on app load
  useEffect(() => {
    const checkAuth = () => {
      // Get token and user data from localStorage
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          // Parse the user data from localStorage
          const user = JSON.parse(userData);
          setAuthUser(user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login handler function
  const handleLogin = (userData, token) => {
    // Save token and user data to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update state
    setAuthUser(userData);
  };

  // Logout handler function
  const handleLogout = async () => {
    try {
      // Optional: Call backend logout endpoint if needed for any server-side cleanup
      await fetch('http://localhost:8000/api/users/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Remove token and user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update state
      setAuthUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="root-div">
      {authUser && <SideBar currentUser={authUser} onLogout={handleLogout}/>}
        <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={!authUser ? (<LoginPage onLogin={handleLogin} />) : (<Navigate to="/" />) } />
          <Route path="/signup" element={!authUser ? (<SignUpPage onSignup={handleLogin} />) : (<Navigate to="/" />) } /> {/* Fixed typo in path and component name */}
          <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
          {/* <Route path="/explore" element={authUser ? <ExplorePage /> : <Navigate to="/login" />} />
          <Route path="/post" element={authUser ? <PostPage /> : <Navigate to="/login" />} />
           */}
        </Routes>
    </div>
  );
}

export default App
