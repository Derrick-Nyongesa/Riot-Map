// src/components/Header.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Header() {
  const user = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut(auth);
      navigate("/auth", { replace: true });
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="app-header">
      <Link to="/" className="brand">
        <span className="brand-mark">RM</span>
        <span className="brand-text">
          Riot <strong>Map</strong>
        </span>
      </Link>

      <div className="header-actions">
        {user && (
          <span className="user-chip">{user.displayName || user.email}</span>
        )}

        {user ? (
          <button
            className="btn btn-ghost"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        ) : (
          <Link className="btn btn-primary" to="/auth">
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
