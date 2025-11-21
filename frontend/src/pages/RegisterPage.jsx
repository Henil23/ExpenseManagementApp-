// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import API from "../services/api";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [name, setName] = useState("");        // Added
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/register", { 
        name,              // Added
        email, 
        password 
      });
      setMessage("Account created successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="register-page">
      <h2>Create an Account</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleRegister}>

        {/* NAME INPUT ADDED */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
