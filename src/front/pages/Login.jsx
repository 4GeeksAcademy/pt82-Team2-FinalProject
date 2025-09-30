import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import "./LoginSignup.css";
import useGlobalReducer from "../hooks/useGlobalReducer";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoints = [
      'https://friendly-computing-machine-pxw4p4r46rq2r7gp-3001.app.github.dev/api/login',
      'https://upgraded-system-7vgj4vjj6j52rx7j-3001.app.github.dev/api/login',
      'https://jubilant-telegram-9759j7q57vg92pgg4-3001.app.github.dev/api/login',
    ];
    let data;
    let response;
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok && data.access_token) {
          localStorage.setItem("token", data.access_token);
          dispatch({ type: "LOGIN", payload: { email } });
          navigate("/dashboard");
          return;
        } else {
          setError(data?.msg || "Failed to login at this endpoint.");
        }
      } catch {
        setError("Network error, try again later.");
      }
    }
  };
  return (
    <div className="login-page">
      <h1 className="login-title">Account Login</h1>
      <div className="login-box">
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-button">Submit</button>
        </form>
      </div>
    </div>
  );
}
export default Login;