import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function DashboardPage({ user, onOpenSimulator, onLogout }) {
  const [profile, setProfile] = useState(user);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      const { data: leaderboardData, error } = await supabase
        .from("profiles")
        .select("display_name, email, total_profit")
        .order("total_profit", { ascending: false })
        .limit(10);

      if (!error && leaderboardData) {
        setLeaderboard(leaderboardData);
      }
    }

    loadDashboardData();
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
          <h2>Total Profit</h2>
          <p className="dashboard-value">
            £{profile.total_profit || 0}
          </p>
        </div>
      </section>

      <section className="dashboard-info">
        <div className="dashboard-card dashboard-card--wide">
          <h2>Global Leaderboard</h2>

          <div className="leaderboard-list">
            {leaderboard.length === 0 ? (
              <p className="dashboard-muted">No leaderboard data yet.</p>
            ) : (
              leaderboard.map((player, index) => (
                <div className="leaderboard-row" key={index}>
                  <span className="leaderboard-rank">#{index + 1}</span>
                  <span className="leaderboard-name">
                    {player.display_name || player.email}
                  </span>
                  <span className="leaderboard-profit">
                    £{player.total_profit || 0}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card dashboard-card--wide">
          <h2>Blackjack Simulator Access</h2>
          <p>
            Use the simulator to generate new session data. Your profit and
            statistics update after each saved session.
          </p>
        </div>
      </section>
    </div>
  );
}