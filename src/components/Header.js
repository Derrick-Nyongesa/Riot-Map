// src/components/Header.js
import { useState, useEffect } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

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

  const displayNameOrEmail = user
    ? user.displayName || user.email || "Signed in"
    : null;

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
          <div className="user-chip" title={displayNameOrEmail}>
            {displayNameOrEmail}
          </div>
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
