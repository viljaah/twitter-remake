import './App.css'
import {Route, Routes, Navigate, useLocation} from 'react-router-dom';
import SideBar from './components/shared/sideBar/SideBar';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from "./pages/settings/SettingsPage";
import {DarkModeProvider} from './contexts/DarkMode';
import {AuthProvider, useAuth} from './contexts/AuthContext'; // Import both AuthProvider and useAuth
import './contexts/DarMode.css';
import ExplorePage from './pages/explore/ExplorePage';
import ListUsers from './components/shared/listUsers/ListUsers';

function App() {
  const location = useLocation();

  // hide the right sidebar on /login and /signup pages
  const hideRightSidebar = location.pathname === "/login" || location.pathname === "/signup";
  
  return (
    <AuthProvider>
      <DarkModeProvider>
        <div className="appContainer">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/*" element={<AuthenticatedApp hideRightSidebar={hideRightSidebar} />} />
          </Routes>
        </div>
      </DarkModeProvider>
    </AuthProvider>
  );
}

// This component handles the authenticated part of the app
function AuthenticatedApp({ hideRightSidebar }) {
  const location = useLocation();
  const { authUser, loading, logout } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If not authenticated and not on login/signup page, redirect to login
  if (!authUser && !location.pathname.includes('/login') && !location.pathname.includes('/signup')) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {authUser && <SideBar currentUser={authUser} onLogout={logout}/>}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/explore" element={authUser ? <ExplorePage /> : <Navigate to="/login" />} />
      </Routes>
      {authUser && !hideRightSidebar && <ListUsers />}
    </>
  );
}

export default App;
