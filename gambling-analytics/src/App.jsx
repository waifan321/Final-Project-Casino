import { useState } from "react";
import HomePage from "./HomePage.jsx";
import LoginPage from "./LoginPage.jsx";
import SignupPage from "./SignupPage.jsx";
import DashboardPage from "./DashboardPage.jsx";
import SessionPage from "./SessionPage.jsx";
import "./styles.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  function handleLogin(userData) {
    setUser(userData);
    setPage("dashboard");
  }

  function handleLogout() {
    setUser(null);
    setPage("home");
  }

  if (!user) {
    if (page === "login") {
      return (
        <LoginPage
          onLogin={handleLogin}
          onBack={() => setPage("home")}
          onGoSignup={() => setPage("signup")}
        />
      );
    }

    if (page === "signup") {
      return (
        <SignupPage
          onSignup={handleLogin}
          onBack={() => setPage("home")}
          onGoLogin={() => setPage("login")}
        />
      );
    }

    return (
      <HomePage
        onGoLogin={() => setPage("login")}
        onGoSignup={() => setPage("signup")}
      />
    );
  }

  if (page === "simulator") {
    return (
      <SessionPage
        user={user}
        onBackToDashboard={() => setPage("dashboard")}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <DashboardPage
      user={user}
      onOpenSimulator={() => setPage("simulator")}
      onLogout={handleLogout}
    />
  );
}