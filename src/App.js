import React, { useState } from 'react';//ok
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './Home';
import SignUp from './SignUp';
import Login from './Login';
import SavedStories from './SavedStories';
import Navbar from './Navbar';
import ImageGenerator from "./ImageGenerator";
import { StoryProvider } from './StoryContext';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
    };

    // FooterWrapper component with conditional rendering based on route
    const FooterWrapper = () => {
        const location = useLocation();
        
        // Define the routes where the copyright should not be displayed
        const hideCopyrightRoutes = ['/login', '/signup', '/saved-stories'];
        const showCopyright = !hideCopyrightRoutes.includes(location.pathname);

        return (
            <>
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                    <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <SignUp />} />
                    <Route path="/saved-stories" element={isLoggedIn ? <SavedStories user={user} /> : <Navigate to="/login" />} />
                    <Route path="/image-generator" element={<ImageGenerator />} />
                </Routes>
                
                {/* Conditionally render the copyright section */}
                {showCopyright && (
                    <div className="copyright">
                        &copy; 2024 Story Narrator. All rights reserved.
                    </div>
                )}
            </>
        );
    };

    return (
        <StoryProvider>
            <Router>
                <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
                <FooterWrapper />
            </Router>
        </StoryProvider>
    );
}

export default App;
