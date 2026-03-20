import { useNavigate } from "react-router-dom";
import "./styles.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand__dot"></div>
          <span className="brand__name">Behaviour Analytics</span>
        </div>

        <nav className="nav">
          <span className="nav__link nav__link--active">Home</span>
          <button 
            className="nav__link" 
            onClick={() => navigate("/session")}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            Dashboard
          </button>
          <a href="#" className="nav__link">About</a>
        </nav>
      </header>

      <main className="hero">
        <section className="hero__content">
          <p className="eyebrow">Educational prototype</p>
          <h1 className="hero__title">
            Visualising Player Behaviour in Simulated Casino Games
          </h1>
          <p className="hero__subtitle">
            A minimal, data-driven platform for exploring betting patterns,
            decision trends, and session behaviour through interactive
            visualisations.
          </p>

          <div className="hero__actions">
            <button 
              onClick={() => navigate("/session")}
              className="btn btn--primary"
            >
              Start Session
            </button>
            <a href="#" className="btn btn--secondary">Explore Dashboard</a>
          </div>

          <p className="hero__note">
            No real money. No real gambling. Built for analysis, transparency,
            and experimentation.
          </p>
        </section>

        <aside className="hero__panel">
          <div className="panel">
            <div className="panel__header">
              <span className="panel__title">Session Preview</span>
            </div>
            <div className="panel__body">
              <p>Start a session to begin playing and tracking your betting patterns.</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
