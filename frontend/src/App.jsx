import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm";
import SubmitForm from "./components/SubmitForm";
import AdviceFeed from "./components/AdviceFeed";
import HugMode from "./components/HugMode";
import "./styles/theme.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (!isLoggedIn) return <AuthForm type="login" onAuthSuccess={() => setIsLoggedIn(true)} />;

  return (
    <>
      <div className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? "🌙" : "🌞"}
      </div>
      <SubmitForm />
      <AdviceFeed />
      <HugMode />
    </>
  );
}

export default App;
