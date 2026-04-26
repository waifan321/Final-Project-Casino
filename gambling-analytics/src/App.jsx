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
    // Check if user has an existing session on app load
    // If no profile exists in DB, create a safe fallback with default values
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (data?.session?.user) {
        const authUser = data.session.user;

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle();

        // Fallback: if user exists but no profile in DB, create safe default
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

  // Route: User is not authenticated - show login/signup/home
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

  // Route: User is authenticated - show simulator or dashboard
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