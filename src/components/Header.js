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
    <div>
      {user ? (
        <>
          <button
            className="error-btn"
            onClick={handleSignOut}
            disabled={signingOut}
            title="Sign Out"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {signingOut ? "Signing out…" : "Sign Out"}
          </button>
        </>
      ) : (
        <Link to="/auth">Sign in</Link>
      )}
    </div>
  );
}

export default Header;
