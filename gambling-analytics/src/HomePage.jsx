export default function HomePage() {
  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-brand">
          <div className="home-brand__dot"></div>
          <span className="home-brand__name">Behaviour Analytics</span>
        </div>

        <nav className="home-nav">
          <a href="#" className="home-nav__link">Home</a>
          <a href="#" className="home-nav__link">Dashboard</a>
          <a href="#" className="home-nav__link">Session</a>
        </nav>
      </header>

      <main className="home-hero">
        <section className="home-hero__content">
          <p className="home-eyebrow">Final Year Project</p>

          <h1 className="home-hero__title">
            Visualising Player Behaviour in Simulated Casino Games
          </h1>

          <p className="home-hero__subtitle">
            An interactive platform for exploring betting patterns, decision trends,
            and session behaviour through clear and minimal data visualisation.
          </p>

          <div className="home-hero__actions">
            <button className="home-btn home-btn--primary">Start Session</button>
            <button className="home-btn home-btn--secondary">Explore Dashboard</button>
          </div>

          <p className="home-hero__note">
            No real money. No real gambling. Built for behavioural analysis and data representation.
          </p>
        </section>

        <aside className="home-hero__panel">
          <div className="home-panel">
            <div className="home-panel__header">
              <span className="home-panel__title">Behaviour Snapshot</span>
              <span className="home-panel__tag">Live</span>
            </div>

            <div className="home-metric-list">
              <div className="home-metric">
                <span className="home-metric__label">Average Bet</span>
                <span className="home-metric__value">£42</span>
              </div>

              <div className="home-metric">
                <span className="home-metric__label">Risk Score</span>
                <span className="home-metric__value">0.38</span>
              </div>

              <div className="home-metric">
                <span className="home-metric__label">Trend</span>
                <span className="home-metric__value">Rising</span>
              </div>
            </div>

            <div className="home-mini-chart">
              <div className="home-mini-chart__bar"></div>
              <div className="home-mini-chart__bar home-mini-chart__bar--mid"></div>
              <div className="home-mini-chart__bar"></div>
              <div className="home-mini-chart__bar home-mini-chart__bar--tall"></div>
              <div className="home-mini-chart__bar home-mini-chart__bar--mid"></div>
              <div className="home-mini-chart__bar"></div>
            </div>
          </div>
        </aside>
      </main>

      <section className="home-features">
        <div className="home-card">
          <h2 className="home-card__title">Session Tracking</h2>
          <p className="home-card__text">
            Capture bets, decisions, outcomes, and session activity in a structured format.
          </p>
        </div>

        <div className="home-card">
          <h2 className="home-card__title">Behaviour Analysis</h2>
          <p className="home-card__text">
            Identify patterns such as escalation, volatility, and loss streaks.
          </p>
        </div>

        <div className="home-card">
          <h2 className="home-card__title">Interactive Visuals</h2>
          <p className="home-card__text">
            Present behavioural trends through dashboards and clean visual summaries.
          </p>
        </div>
      </section>

      <footer className="home-footer">
        <p>
          Educational prototype focused on data representation, analysis, and transparency.
        </p>
      </footer>
    </div>
  );
}