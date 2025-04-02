import { useState } from 'react'
import './App.css'
import {Route, Routes, Navigate, Link} from 'react-router-dom';
import SideBar from './components/shared/SideBar';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
// import ExplorePage from './pages/explore/ExplorePage';
import ProfilePage from './pages/profile/ProfilePage';
// import PostPage from './pages/post/PostPage';


function App() {
  // dummy authentication until we make the real shit
  const dummyUser = {
    id: 1,
    username: 'dummyUser',
    name: 'Dummy User'
  };

  const [authUser, setAuthUser] = useState(dummyUser);

  return (
    <div className="root-div">
      {authUser && <SideBar/>}
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          {/* <Route path="/explore" element={authUser ? <ExplorePage /> : <Navigate to="/login" />} />
          <Route path="/post" element={authUser ? <PostPage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} /> */}
        </Routes>
    </div>
  );
}

export default App
