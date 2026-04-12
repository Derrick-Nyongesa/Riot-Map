// src/index.js
import ReactDOM from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { RiotProvider } from "./context/RiotContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <RiotProvider>
        <App />
      </RiotProvider>
    </AuthProvider>
  </BrowserRouter>,
);
