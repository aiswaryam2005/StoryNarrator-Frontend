import React from "react";//ok
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, user, onLogout }) => {
   return (
      <nav className="navbar">
         <h2>Story Narrator</h2>
         <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/image-generator">Image Generator</Link>
            {isLoggedIn ? (
               <>
                  <Link to="/saved-stories">Saved Stories</Link>
                  <button onClick={onLogout}>Logout</button>
               </>
            ) : (
               <>
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Sign Up</Link>
               </>
            )}
         </div>
      </nav>
   );
};

export default Navbar;
