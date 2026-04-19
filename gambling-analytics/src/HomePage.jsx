import "./home.css";

export default function HomePage() {
  return (
    <div className="page">

      {/* Topbar */}
      <header className="topbar">
        <div className="brand">
          <div className="brand__dot"></div>
          <span className="brand__name">Behaviour Analytics</span>
        </div>

        <nav className="nav">
          <a href="#" className="nav__link">Home</a>
          <a href="#" className="nav__link">Dashboard</a>
          <a href="#" className="nav__link">Session</a>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="hero">
        <section className="hero__content">
          <p className="eyebrow">Final Year Project</p>

          <h1 className="hero__title">
            Visualising Player Behaviour in Simulated Casino Games
          </h1>

          <p className="hero__subtitle">
            An interactive platform for analysing betting patterns, session behaviour,
            and decision-making trends through clean data visualisations.
          </p>

          <div className="hero__actions">
            <button className="btn btn--primary">
              Start Session
            </button>

            <button className="btn btn--secondary">
              Explore Dashboard
            </button>
          </div>

          <p className="hero__note">
            No real gambling. Designed for data analysis and behavioural insight.
          </p>
        </section>

        {/* Right panel preview */}
        <aside className="hero__panel">
          <div className="panel">
            <div className="panel__header">
              <span className="panel__title">Behaviour Snapshot</span>
              <span className="panel__tag">Live</span>
            </div>

            <div className="metric-list">
              <div className="metric">
                <span className="metric__label">Avg Bet</span>
                <span className="metric__value">£42</span>
              </div>

              <div className="metric">
                <span className="metric__label">Risk Score</span>
                <span className="metric__value">0.38</span>
              </div>

              <div className="metric">
                <span className="metric__label">Trend</span>
                <span className="metric__value">Rising</span>
              </div>
            </div>

            {/* Simple fake chart */}
            <div className="mini-chart">
              <div className="mini-chart__bar"></div>
              <div className="mini-chart__bar mini-chart__bar--mid"></div>
              <div className="mini-chart__bar"></div>
              <div className="mini-chart__bar mini-chart__bar--tall"></div>
              <div className="mini-chart__bar mini-chart__bar--mid"></div>
              <div className="mini-chart__bar"></div>
            </div>
          </div>
        </aside>
      </main>

      {/* Features */}
      <section className="features">

        <div className="card">
          <h2 className="card__title">Session Tracking</h2>
          <p className="card__text">
            Capture betting decisions, outcomes, and session activity in structured form.
          </p>
        </div>

        <div className="card">
          <h2 className="card__title">Behaviour Analysis</h2>
          <p className="card__text">
            Identify patterns such as escalation, streaks, and volatility.
          </p>
        </div>

        <div className="card">
          <h2 className="card__title">Data Visualisation</h2>
          <p className="card__text">
            Explore interactive charts that reveal behaviour trends clearly.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          Educational prototype focused on data representation and behavioural insights.
        </p>
      </footer>

    </div>
  );
}