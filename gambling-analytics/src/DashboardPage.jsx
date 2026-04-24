import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function DashboardPage({ user, onOpenSimulator, onLogout }) {
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
      }
    }

    loadProfile();
  }, [user.id]);

  return (
    <div className="dashboard-page">
      <header className="dashboard-topbar">
        <div>
          <p className="dashboard-eyebrow">Dashboard</p>
          <h1 className="dashboard-title">
            Welcome, {profile.display_name || profile.email}
          </h1>
        </div>

        <div className="dashboard-actions">
          <button
            className="dashboard-btn dashboard-btn--primary"
            onClick={onOpenSimulator}
          >
            Open Blackjack Simulator
          </button>

          <button className="dashboard-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Sessions Played</h2>
          <p className="dashboard-value">{profile.sessions_played || 0}</p>
        </div>

        <div className="dashboard-card">
          <h2>Average Bet</h2>
          <p className="dashboard-value">£{profile.avg_bet || 0}</p>
        </div>

        <div className="dashboard-card">
          <h2>Risk Score</h2>
          <p className="dashboard-value">{profile.risk_score || 0}</p>
        </div>
      </section>

      <section className="dashboard-info">
        <div className="dashboard-card dashboard-card--wide">
          <h2>Personal Stats</h2>
          <p>
            These values are pulled from your Supabase profile and update after saved blackjack sessions.
          </p>
        </div>

        <div className="dashboard-card dashboard-card--wide">
          <h2>Blackjack Simulator Access</h2>
          <p>
            Use the simulator to generate new behavioural session data for analysis.
          </p>
        </div>
      </section>
    </div>
  );
}