export default function HomePage({ onGoLogin, onGoSignup }) {
  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-brand">
          <div className="home-brand__dot"></div>
          <span className="home-brand__name">GamStats</span>
        </div>

        {/* 🔥 Styled top-right auth buttons */}
        <div className="home-auth">
          <button className="home-auth__login" onClick={onGoLogin}>
            Login
          </button>

          <button className="home-auth__signup" onClick={onGoSignup}>
            Sign Up
          </button>
        </div>
      </header>

      <main className="home-hero">
        <section className="home-hero__content">
          <p className="home-eyebrow">Final Year Project</p>

          <h1 className="home-hero__title">
            GamStats: Visualising Player Behaviour in Simulated Casino Games
          </h1>

          <p className="home-hero__subtitle">
            Developed by Wai Leung Fan (33752058), this final year project explores
            betting behaviour, session trends, and decision-making through a simplified
            blackjack simulator and an interactive analytics dashboard.
          </p>

          {/* ✅ ONLY ONE CTA */}
          <div className="home-hero__actions">
            <button className="home-btn home-btn--primary" onClick={onGoSignup}>
              Get Started
            </button>
          </div>

          <p className="home-hero__note">
            Educational prototype. No real money involved. Built for behavioural analysis,
            transparency, and data visualisation.
          </p>
        </section>

        <aside className="home-hero__panel">
          <div className="home-panel">
            <div className="home-panel__header">
              <span className="home-panel__title">GamStats Overview</span>
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
          <h2 className="home-card__title">About the Project</h2>
          <p className="home-card__text">
            GamStats is a final year project designed to analyse simulated gambling
            behaviour in a controlled, educational environment.
          </p>
        </div>

        <div className="home-card">
          <h2 className="home-card__title">Personal Dashboard</h2>
          <p className="home-card__text">
            Users can track performance, profit trends, betting patterns, and behavioural
            risk scores through interactive data visualisations.
          </p>
        </div>

        <div className="home-card">
          <h2 className="home-card__title">Blackjack Simulator</h2>
          <p className="home-card__text">
            A simplified blackjack environment allows users to generate realistic session
            data for behavioural analysis and decision tracking.
          </p>
        </div>
      </section>

      <footer className="home-footer">
        <p>
          Final Year Project — Wai Leung Fan (33752058)
          <br />
          Focus: Behavioural analytics, data visualisation, and decision modelling.
        </p>
      </footer>
    </div>
  );
}