import React, { useState } from "react";//ok
import { Link } from "react-router-dom";
import axios from "axios";
import "./Form.css";

const Login = ({ onLogin }) => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [errorMessage, setErrorMessage] = useState("");

   const handleLogin = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post("https://storynarrator-backend.onrender.com/login", { email, password });
         onLogin(response.data.user);
         alert("Login successful");
      } catch (error) {
         setErrorMessage("Invalid credentials. Don't have an account? Sign up!");
      }
   };

   return (
      <div className="form-container">
         <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <label>Email</label>
            <input
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
            />
            <label>Password</label>
            <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
            />
            <button type="submit">Login</button>
            {errorMessage && <p>{errorMessage}</p>}
            <p>
               Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
         </form>
      </div>
   );
};

export default Login;
