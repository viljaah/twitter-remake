import { useState } from 'react'
import './App.css'
import {Route, Routes} from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import ProfilePage from "./pages/profile/ProfilePage"; // Import your new component

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="root-div">
    
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} /> {/* Add this route */}
      </Routes>
  
    </div>
  )
}

export default App
