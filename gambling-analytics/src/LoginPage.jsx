import { useState } from "react";

export default function LoginPage({ onLogin, onBack, onGoSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) return;

    onLogin({
      name: email.split("@")[0],
      email,
      sessionsPlayed: 12,
      avgBet: 47,
      riskScore: 0.39
    });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="auth-back" onClick={onBack}>← Back</button>
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Sign in to access your dashboard and simulator.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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

          <button className="auth-btn" type="submit">Login</button>
        </form>

        <p className="auth-switch">
          Don’t have an account?{" "}
          <button onClick={onGoSignup}>Sign up</button>
        </p>
      </div>
    </div>
  );
}