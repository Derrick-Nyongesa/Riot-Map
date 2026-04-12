// src/pages/Authentication.js
import { useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Authentication() {
  const { user, initializing } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!initializing && user) {
      navigate("/", { replace: true });
    }
  }, [user, initializing, navigate]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Secure access</p>
        <h1>Riot Map</h1>
        <p className="intro-text">
          Sign in to view the live map, save important places, and post new
          incident markers.
        </p>

        <button
          className="btn btn-primary btn-full"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Continue with Google"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </section>
    </div>
  );
}

export default Authentication;
