import { useState } from "react";

export default function SignupPage({ onSignup, onBack, onGoLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !email || !password) return;

    onSignup({
      name,
      email,
      sessionsPlayed: 0,
      avgBet: 0,
      riskScore: 0
    });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="auth-back" onClick={onBack}>← Back</button>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Register to access your personal dashboard.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn" type="submit">Sign Up</button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <button onClick={onGoLogin}>Login</button>
        </p>
      </div>
    </div>
  );
}