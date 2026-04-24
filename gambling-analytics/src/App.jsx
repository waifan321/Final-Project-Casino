import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import DashboardPage from "./DashboardPage";
import SessionPage from "./SessionPage";
import "./styles.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // check existing session (no loading lock)
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (data?.session?.user) {
        const authUser = data.session.user;

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        const safeProfile =
          profile || {
            id: authUser.id,
            email: authUser.email,
            display_name:
              authUser.user_metadata?.display_name ||
              authUser.email.split("@")[0],
            sessions_played: 0,
            avg_bet: 0,
            risk_score: 0,
          };

        setUser(safeProfile);
        setPage("dashboard");
      }
    }

    checkSession();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setPage("home");
  }

  // NOT LOGGED IN
  if (!user) {
    if (page === "login") {
      return (
        <LoginPage
          onLogin={(profile) => {
            setUser(profile);
            setPage("dashboard");
          }}
          onBack={() => setPage("home")}
          onGoSignup={() => setPage("signup")}
        />
      );
    }

    if (page === "signup") {
      return (
        <SignupPage
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

  // LOGGED IN
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