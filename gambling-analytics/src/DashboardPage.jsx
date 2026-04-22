export default function DashboardPage({ user, onOpenSimulator, onLogout }) {
  return (
    <div className="dashboard-page">
      <header className="dashboard-topbar">
        <div>
          <p className="dashboard-eyebrow">Dashboard</p>
          <h1 className="dashboard-title">Welcome, {user.name}</h1>
        </div>

        <div className="dashboard-actions">
          <button className="dashboard-btn dashboard-btn--primary" onClick={onOpenSimulator}>
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
          <p className="dashboard-value">{user.sessionsPlayed}</p>
        </div>

        <div className="dashboard-card">
          <h2>Average Bet</h2>
          <p className="dashboard-value">£{user.avgBet}</p>
        </div>

        <div className="dashboard-card">
          <h2>Risk Score</h2>
          <p className="dashboard-value">{user.riskScore}</p>
        </div>
      </section>

      <section className="dashboard-info">
        <div className="dashboard-card dashboard-card--wide">
          <h2>Personal Stats</h2>
          <p>
            This area will later show user-specific trends such as bet progression,
            session history, win/loss patterns, and risk changes over time.
          </p>
        </div>

        <div className="dashboard-card dashboard-card--wide">
          <h2>Blackjack Simulator Access</h2>
          <p>
            Use the simulator to generate new session data. Each session can later
            feed into your dashboard analytics and visualisations.
          </p>
        </div>
      </section>
    </div>
  );
}