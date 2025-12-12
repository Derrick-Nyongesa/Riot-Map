import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, initializing } = useAuth();

  // while Firebase restores session, show nothing (or a spinner)
  if (initializing) {
    <div style={{ padding: 40, textAlign: "center" }}>
      <div className="loader">Loading...</div>
    </div>;
  }

  // if authenticated, render children; otherwise redirect to auth
  return user ? children : <Navigate to="/auth" replace />;
}
