// src/App.js
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/auth" element={<Authentication />} />
      </Routes>
    </>
  );
}

export default App;
