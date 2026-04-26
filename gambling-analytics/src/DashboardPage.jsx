import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "#2b2d31",
  border: "1px solid #5865f2",
  borderRadius: "10px",
  color: "#f2f3f5",
};

const labelStyle = {
  color: "#b5bac1",
};

const axisStyle = {
  stroke: "#b5bac1",
};

const gridStyle = "#3b3d44";

export default function DashboardPage({ user, onOpenSimulator, onLogout }) {
  const [profile, setProfile] = useState(user);
  const [sessions, setSessions] = useState([]);
  const [topWinners, setTopWinners] = useState([]);
  const [topLosers, setTopLosers] = useState([]);

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

      const { data: winnersData } = await supabase
        .from("profiles")
        .select("display_name, email, total_profit")
        .order("total_profit", { ascending: false })
        .limit(5);

      const { data: losersData } = await supabase
        .from("profiles")
        .select("display_name, email, total_profit")
        .order("total_profit", { ascending: true })
        .limit(5);

      if (winnersData) setTopWinners(winnersData);
      if (losersData) setTopLosers(losersData);
    }

    loadDashboardData();
  }, [user.id]);

  const chartData = useMemo(() => {
    let runningTotal = 0;

    return sessions.map((session, index) => {
      const profit = Number(session.final_bankroll || 1000) - 1000;
      runningTotal += profit;

      return {
        name: `S${index + 1}`,
        profit,
        cumulative: runningTotal,
        avgBet: Number(session.avg_bet || 0),
        riskScore: Number(session.risk_score || 0),
      };
    });
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
          <p className="dashboard-value">
            £{Number(profile.avg_bet || 0).toFixed(2)}
          </p>
        </div>

        <div className="dashboard-card">
          <h2>Total Profit</h2>
          <p
            className={`dashboard-value ${
              Number(profile.total_profit || 0) >= 0 ? "positive" : "negative"
            }`}
          >
            £{Number(profile.total_profit || 0).toFixed(2)}
          </p>
        </div>
      </section>

      <section className="chart-grid">
        <div className="dashboard-card dashboard-card--wide">
          <h2>Global Leaderboard</h2>
          <p className="chart-description">
            Compares players by total profit, separating the highest profit makers
            from the biggest losses.
          </p>

          <div className="leaderboard-split">
            <div>
              <h3 className="leaderboard-subtitle">Top Profit Makers</h3>

              <div className="leaderboard-list">
                {topWinners.length === 0 ? (
                  <p className="dashboard-muted">No profit data yet.</p>
                ) : (
                  topWinners.map((player, index) => (
                    <div
                      className="leaderboard-row winner"
                      key={`winner-${index}`}
                    >
                      <span className="leaderboard-rank">
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : `#${index + 1}`}
                      </span>

                      <span className="leaderboard-name">
                        {player.display_name || player.email}
                      </span>

                      <span className="leaderboard-profit positive">
                        £{Number(player.total_profit || 0).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="leaderboard-subtitle">Top Profit Losers</h3>

              <div className="leaderboard-list">
                {topLosers.length === 0 ? (
                  <p className="dashboard-muted">No loss data yet.</p>
                ) : (
                  topLosers.map((player, index) => (
                    <div
                      className="leaderboard-row loser"
                      key={`loser-${index}`}
                    >
                      <span className="leaderboard-rank">#{index + 1}</span>

                      <span className="leaderboard-name">
                        {player.display_name || player.email}
                      </span>

                      <span className="leaderboard-profit negative">
                        £{Number(player.total_profit || 0).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card dashboard-card--wide">
          <h2>Win / Loss Distribution</h2>
          <p className="chart-description">
            Shows the proportion of rounds ending in wins, losses, or draws across
            saved sessions.
          </p>

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
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={labelStyle}
                  itemStyle={{ color: "#5865f2", fontWeight: 700 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card dashboard-card--wide">
          <h2>Profit Over Sessions</h2>
          <p className="chart-description">
            Displays how much profit or loss was made in each individual saved session.
          </p>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid stroke={gridStyle} strokeDasharray="3 3" />
                <XAxis dataKey="name" {...axisStyle} />
                <YAxis {...axisStyle} tickFormatter={(value) => `£${value}`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={labelStyle}
                  itemStyle={{ color: "#5865f2", fontWeight: 700 }}
                  formatter={(value) => [`£${value}`, "Profit"]}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#5865f2"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card dashboard-card--wide">
          <h2>Cumulative Profit Over Time</h2>
          <p className="chart-description">
            Tracks the running total of profit and loss, showing whether performance
            improves or declines over time.
          </p>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid stroke={gridStyle} strokeDasharray="3 3" />
                <XAxis dataKey="name" {...axisStyle} />
                <YAxis {...axisStyle} tickFormatter={(value) => `£${value}`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={labelStyle}
                  itemStyle={{ color: "#a78bfa", fontWeight: 700 }}
                  formatter={(value) => [`£${value}`, "Cumulative Profit"]}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#a78bfa"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card dashboard-card--wide">
          <h2>Average Bet Trend</h2>
          <p className="chart-description">
            Shows whether the user increases or decreases their average bet size
            across sessions.
          </p>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid stroke={gridStyle} strokeDasharray="3 3" />
                <XAxis dataKey="name" {...axisStyle} />
                <YAxis {...axisStyle} tickFormatter={(value) => `£${value}`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={labelStyle}
                  itemStyle={{ color: "#22c55e", fontWeight: 700 }}
                  formatter={(value) => [`£${value}`, "Average Bet"]}
                />
                <Line
                  type="monotone"
                  dataKey="avgBet"
                  stroke="#22c55e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card dashboard-card--wide">
          <h2>Risk Score Trend</h2>
          <p className="chart-description">
            Represents changes in calculated behavioural risk based on betting
            patterns and loss streaks.
          </p>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid stroke={gridStyle} strokeDasharray="3 3" />
                <XAxis dataKey="name" {...axisStyle} />
                <YAxis {...axisStyle} domain={[0, 1]} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={labelStyle}
                  itemStyle={{ color: "#f59e0b", fontWeight: 700 }}
                  formatter={(value) => [value, "Risk Score"]}
                />
                <Line
                  type="monotone"
                  dataKey="riskScore"
                  stroke="#f59e0b"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}