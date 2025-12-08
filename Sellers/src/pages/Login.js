import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";   // ✅ Import Link and useHistory
import styles from './Login.module.css';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const history = useHistory();

  useEffect(() => {
    // Check if redirected from signup
    const locationState = history.location?.state;
    if (locationState?.message) {
      setSuccess(locationState.message);
      // Clear the state so message doesn't persist
      history.replace({ ...history.location, state: {} });
    }
  }, [history]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        // Show success message
        setSuccess("Login successful! Redirecting to dashboard...");
        // Call the login function passed from App.js
        onLogin(data.token);
        // Add a small delay before redirecting
        setTimeout(() => {
          history.push("/");
        }, 1500);
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2 className={styles.title}>Seller Login</h2>
        {success && <div className={styles.successMessage}>{success}</div>}
        {error && <div className={styles.errorMessage}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input 
              name="email" 
              type="email" 
              placeholder="Email Address" 
              onChange={handleChange} 
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              onChange={handleChange} 
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>
        <p className={styles.signupLink}>
          Don't have an account?{" "}
          <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
