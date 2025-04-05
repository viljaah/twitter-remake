import { useState, useEffect } from 'react'
import './App.css'
import {Route, Routes, Navigate} from 'react-router-dom';
import SideBar from './components/shared/SideBar';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from "./pages/settings/SettingsPage";
import {DarkModeProvider} from './contexts/DarkMode';
import './contexts/DarMode.css';
import ExplorePage from './pages/explore/ExplorePage';

function App() {
  // Replace dummy auth with real auth state
  /*
  * the authUser state stacks whether a suer is logged in, when null, no user is logged in
  * the laoding state indicates whether the app is s till checking for exisitng authentication, helpin prevent flickering or incorrect redirects
  */
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on app load
  /*
  * this useEffect with an ampty dependcy [] array runce once when the app first loads
  * it chekcs if theres exisiting authenticaiton data in localStorage, useful for persisting login state between page refreshes
  */
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setAuthUser(user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  /**
 * Handles user login and authenticates the user session
 * 
 * @param {Object} userData - The user information returned from the backend
 * @param {string} token - JWT or authentication token from the backend
 */
  const handleLogin = (userData, token) => {
    // Store authentication token to maintain session across page reloads
    // We use JSON.stringify since localStorage only stores strings
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  
    // Update application state to reflect logged-in status
   // This triggers re-renders of components that depend on auth state
    setAuthUser(userData);
  };



  /**
 * Handles user logout process including both client and server-side cleanup
 * This is an async function because it communicates with the backend
 */
  const handleLogout = async () => {
    try {
      // Notify the backend about logout to invalidate the token
      // This helps prevent token reuse and improves security
      await fetch('http://localhost:8000/api/users/logout', {
        method: 'POST',
        headers: {
          // Send the authentication token in the Authorization header
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    
      // Clean up client-side storage to complete the logout (from localStorage)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset application state to unauthenticated
     // This will trigger protected routes to redirect to login
      setAuthUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // conditional rendering for loading state
  /*
  * this prevents the app from rendering its main content until authenticaiton status is determined
  * without this, users might briefly see content they should not have access to, or experience UI jumps
  */
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <DarkModeProvider>
      <div className="root-div">
        {authUser && <SideBar currentUser={authUser} onLogout={handleLogout}/>}
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/login" element={!authUser ? (<LoginPage onLogin={handleLogin} />) : (<Navigate to="/" />) } />
            <Route path="/signup" element={!authUser ? (<SignUpPage onSignup={handleLogin} />) : (<Navigate to="/" />) } />
            <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
            <Route path="/explore" element={authUser ? <ExplorePage /> : <Navigate to="/login" />} />
          </Routes>
      </div>
    </DarkModeProvider>
  );
}

export default App

/*
lifting the state up => low level of chain component, like if a book is favourited or not (piece of code state) and insert it soemwhere in another compoennt folder,
if needs to be reused somehwere else, since the hierachy is nested 
- tip: move the state variavles to lowe-level components (decide where its appropoatia)
- choose good names for the variables, not data, setData but somethign more that makes sense
- hav a utility fucntion to fetch books, saving fetched data in  a state variable setData(json) after having fecth etc. 
-use: .then() etc and .finaly()
- in bakcend setTimout -> to get ranodm delay from the GET /api/books for exmaple with math.ranodm
- if loading is true then render the indicatior if you have code like this: (loading && <Loadingindicator />) -> that condiitonal code
- handler like handleDeleteBook -> event handlers should mostly not be inside App.jsx but rather where they belong to the compoennt if there is some related fetching from the backend
- ask claude based on book feedback
- either display message that there are no books, or display an empty list instead of having -1
- dont want to re-fetch stuff on eveyr delete, for the backed/advanced js logics
- 


*/