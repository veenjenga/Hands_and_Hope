import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";   // ✅ useHistory instead of useNavigate

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", businessName: "", phone: "" });
  const history = useHistory();   // ✅ initialize history

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log(data);

    if (res.ok) {
      alert("Signup successful! Please login.");
      history.push("/login");   // ✅ navigate using history
    } else {
      alert(data.message || "Signup failed. Try again.");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <input name="businessName" placeholder="Business Name" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Signup;
