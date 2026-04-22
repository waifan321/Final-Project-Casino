export default function HomePage({ onGoLogin, onGoSignup }) {
  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-brand">
          <div className="home-brand__dot"></div>
          <span className="home-brand__name">Behaviour Analytics</span>
        </div>

        <nav className="home-nav">
          <button className="home-nav__link" onClick={onGoLogin}>Login</button>
          <button className="home-nav__link" onClick={onGoSignup}>Sign Up</button>
        </nav>
      </header>

      <main className="home-hero">
        <section className="home-hero__content">
          <p className="home-eyebrow">Final Year Project</p>

          <h1 className="home-hero__title">
            Visualising Player Behaviour in Simulated Casino Games
          </h1>

          <p className="home-hero__subtitle">
            This application lets users explore betting behaviour, session trends,
            and decision-making through a simplified blackjack simulator and a
            personal analytics dashboard.
          </p>

          <div className="home-hero__actions">
            <button className="home-btn home-btn--primary" onClick={onGoSignup}>
              Get Started
            </button>
            <button className="home-btn home-btn--secondary" onClick={onGoLogin}>
              Login
            </button>
          </div>

          <p className="home-hero__note">
            No real money. Built for behavioural analysis, transparency, and data representation.
          </p>
        </section>

        <aside className="home-hero__panel">
          <div className="home-panel">
            <div className="home-panel__header">
              <span className="home-panel__title">What the app does</span>
              <span className="home-panel__tag">Overview</span>
            </div>

            <div className="home-metric-list">
              <div className="home-metric">
                <span className="home-metric__label">Blackjack Simulator</span>
                <span className="home-metric__value">Play</span>
              </div>

              <div className="home-metric">
                <span className="home-metric__label">Personal Stats</span>
                <span className="home-metric__value">Track</span>
              </div>

              <div className="home-metric">
                <span className="home-metric__label">Behaviour Dashboard</span>
                <span className="home-metric__value">Visualise</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <section className="home-features">
        <div className="home-card">
          <h2 className="home-card__title">About the App</h2>
          <p className="home-card__text">
            The app is designed to represent and analyse gambling-style decision data
            in a safe, educational environment.
          </p>
        </div>

        <div className="home-card">
          <h2 className="home-card__title">Personal Dashboard</h2>
          <p className="home-card__text">
            Logged-in users can access their own performance history, risk trends,
            and session summaries.
          </p>
        </div>

        <div className="home-card">
          <h2 className="home-card__title">Simulator Access</h2>
          <p className="home-card__text">
            Once authenticated, users can play the blackjack simulator and generate
            new session data for analysis.
          </p>
        </div>
      </section>

      <footer className="home-footer">
        <p>Educational prototype focused on data representation and behavioural insight.</p>
      </footer>
    </div>
  );
}