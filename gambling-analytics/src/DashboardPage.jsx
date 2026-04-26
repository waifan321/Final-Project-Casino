import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DashboardPage({ user, onOpenSimulator, onLogout }) {
  const [profile, setProfile] = useState(user);
  const [sessions, setSessions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) setProfile(profileData);

      const { data: sessionsData } = await supabase
        .from("sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (sessionsData) setSessions(sessionsData);

      const { data: leaderboardData } = await supabase
        .from("profiles")
        .select("display_name, email, total_profit")
        .order("total_profit", { ascending: false })
        .limit(10);

      if (leaderboardData) setLeaderboard(leaderboardData);
    }

    loadDashboardData();
  }, [user.id]);

  const chartData = useMemo(() => {
    return sessions.map((session, index) => ({
      name: `S${index + 1}`,
      profit: Number(session.final_bankroll || 1000) - 1000,
      avgBet: Number(session.avg_bet || 0),
      riskScore: Number(session.risk_score || 0),
      bankroll: Number(session.final_bankroll || 0),
    }));
  }, [sessions]);

  const winLossData = useMemo(() => {
    let wins = 0;
    let losses = 0;
    let draws = 0;

    sessions.forEach((session) => {
      const logs = Array.isArray(session.session_log) ? session.session_log : [];

      logs.forEach((entry) => {
        const text = String(entry.text || "").toLowerCase();

        if (text.includes("round ended")) {
          if (text.includes("win")) wins += 1;
          else if (text.includes("loss")) losses += 1;
          else if (text.includes("draw")) draws += 1;
        }
      });
    });

    return [
      { name: "Wins", value: wins },
      { name: "Losses", value: losses },
      { name: "Draws", value: draws },
    ];
  }, [sessions]);

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
          <p className="dashboard-value">£{Number(profile.avg_bet || 0).toFixed(2)}</p>
        </div>

        <div className="dashboard-card">
          <h2>Total Profit</h2>
          <p className={`dashboard-value ${(profile.total_profit || 0) >= 0 ? "positive" : "negative"}`}>
            £{Number(profile.total_profit || 0).toFixed(2)}
          </p>
        </div>
      </section>

      <section className="chart-grid">
        <div className="dashboard-card dashboard-card--wide">
          <h2>Profit Over Sessions</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="profit" stroke="#5865f2" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card dashboard-card--wide">
          <h2>Average Bet Trend</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avgBet" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card dashboard-card--wide">
          <h2>Risk Score Trend</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey="riskScore" stroke="#f59e0b" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card dashboard-card--wide">
          <h2>Win / Loss Distribution</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={winLossData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                  <Cell fill="#eab308" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="dashboard-card dashboard-card--wide">
          <h2>Global Leaderboard</h2>

          <div className="leaderboard-list">
            {leaderboard.length === 0 ? (
              <p className="dashboard-muted">No leaderboard data yet.</p>
            ) : (
              leaderboard.map((player, index) => {
                const rank = index + 1;

                return (
                  <div
                    className={`leaderboard-row ${
                      rank === 1
                        ? "gold"
                        : rank === 2
                        ? "silver"
                        : rank === 3
                        ? "bronze"
                        : ""
                    }`}
                    key={index}
                  >
                    <span className="leaderboard-rank">
                      {rank === 1
                        ? "🥇"
                        : rank === 2
                        ? "🥈"
                        : rank === 3
                        ? "🥉"
                        : `#${rank}`}
                    </span>

                    <span className="leaderboard-name">
                      {player.display_name || player.email}
                    </span>

                    <span
                      className={`leaderboard-profit ${
                        player.total_profit >= 0 ? "positive" : "negative"
                      }`}
                    >
                      £{Number(player.total_profit || 0).toFixed(2)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}