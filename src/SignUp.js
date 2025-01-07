import React, { useState } from "react";//ok
import { Link } from "react-router-dom";
import axios from "axios";
import "./Form.css";

const SignUp = () => {
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [errorMessage, setErrorMessage] = useState("");

   const handleSignUp = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post("http://localhost:5000/signup", { username, email, password });
         alert(response.data.message);
      } catch (error) {
         setErrorMessage("User already exists. Already have an account? Login!");
      }
   };

   return (
      <div className="form-container">
         <form onSubmit={handleSignUp}>
            <h2>Sign Up</h2>
            <label>Username</label>
            <input
               type="text"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               required
            />
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
            <button type="submit">Sign Up</button>
            {errorMessage && <p>{errorMessage}</p>}
            <p>
               Already have an account? <Link to="/login">Login</Link>
            </p>
         </form>
      </div>
   );
};

export default SignUp;
