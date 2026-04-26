import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function LoginPage({ onLogin, onBack, onGoSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const user = data.user;

      let { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("profile fetch error:", profileError.message);
      }

      // If profile doesn't exist in DB, create one on first login
      if (!profile) {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            display_name: user.user_metadata?.display_name || user.email.split("@")[0],
            sessions_played: 0,
            avg_bet: 0,
            risk_score: 0,
          })
          .select()
          .single();

        if (insertError) {
          setError(insertError.message);
          setLoading(false);
          return;
        }

        profile = newProfile;
      }

      console.log("login success profile:", profile);
      onLogin(profile);
    } catch (err) {
      console.error("login crashed:", err);
      setError("Something went wrong during login.");
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="auth-back" onClick={onBack}>← Back</button>
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Sign in to access your dashboard and simulator.</p>

        <form className="auth-form" onSubmit={handleLogin}>
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

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <button onClick={onGoSignup}>Sign up</button>
        </p>
      </div>
    </div>
  );
}