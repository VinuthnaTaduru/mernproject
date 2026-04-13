import { useState } from "react";
import api from "../utils/axiosConfig";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({});

  const register = async () => {
    await api.post("/auth/register", form);
    alert("Registered successfully");
  };

  return (
    <>
      <h2>Register</h2>

      <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="manager">Manager</option>
        <option value="member">Member</option>
      </select>

      <button onClick={register}>Register</button>

      <p>
        Already have account? <Link to="/">Login</Link>
      </p>
    </>
  );
}