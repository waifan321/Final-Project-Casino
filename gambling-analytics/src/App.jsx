import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SessionPage from "./SessionPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session" element={<SessionPage />} />
      </Routes>
    </BrowserRouter>
  );
}