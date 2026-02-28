// src/pages/Authentication.js
import { useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Authentication() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // If already signed in, redirect to home
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged (AuthProvider) will update user and navigate will run
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">{/* Application logo, is available */}</div>
        <h1 className="auth-title">Welcome to Riot Map Application</h1>
        <p className="auth-sub">Sign in with Google to proceed.</p>

        <button
          className="google-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in with Google"}
        </button>

        {error && <div className="auth-error">Error: {error}</div>}
      </div>
    </div>
  );
}

export default Authentication;
