import { useState, useEffect } from 'react'
import './App.css'
import {Route, Routes, Navigate, useLocation} from 'react-router-dom';
import SideBar from './components/shared/sideBar/SideBar';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from "./pages/settings/SettingsPage";
import {DarkModeProvider} from './contexts/DarkMode';
import './contexts/DarMode.css';
import ExplorePage from './pages/explore/ExplorePage';
import ListUsers from './components/shared/listUsers/ListUsers';

function App() {
  const location = useLocation();

  // hide the right sidebar on /login and /signup pages
  const hideRightSidebar = location.pathname === "/login" || location.pathname === "/signup";
  
  // Auth state
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            
            // Validate token by making a check request
            fetch('http://localhost:8000/api/users/me', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
            .then(response => {
              if (response.ok) {
                // Token is valid, set the user
                setAuthUser(user);
              } else {
                // Token is invalid, clear localStorage
                console.error('Invalid token, clearing auth data');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
              }
              setLoading(false);
            })
            .catch(error => {
              console.error('Error validating token:', error);
              setLoading(false);
            });
          } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in auth check:', error);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = (userData, token) => {
    try {
      // Store authentication token to maintain session across page reloads
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setAuthUser(userData);
      console.log("Login successful, storing token:", token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Only make the logout API call if we have a token
      if (token) {
        try {
          // Notify the backend about logout to invalidate the token
          await fetch('http://localhost:8000/api/users/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (apiError) {
          console.error('API logout failed, continuing with client logout', apiError);
        }
      }
    
      // Always clean up client-side storage to complete the logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Reset application state to unauthenticated
      setAuthUser(null);
    } catch (error) {
      console.error('Logout failed', error);
      
      // Still reset auth state even if the API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setAuthUser(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <DarkModeProvider>
      <div className="appContainer">
        {authUser && <SideBar currentUser={authUser} onLogout={handleLogout}/>}
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/login" element={!authUser ? (<LoginPage onLogin={handleLogin} />) : (<Navigate to="/" />) } />
            <Route path="/signup" element={!authUser ? (<SignUpPage onSignup={handleLogin} />) : (<Navigate to="/" />) } />
            <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/settings" element={authUser ? <SettingsPage onLogout={handleLogout}/> : <Navigate to="/login" />} />
            <Route path="/explore" element={authUser ? <ExplorePage /> : <Navigate to="/login" />} />
          </Routes>
        {authUser && !hideRightSidebar && <ListUsers />}
      </div>
    </DarkModeProvider>
  );
}

export default App;


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
*/
