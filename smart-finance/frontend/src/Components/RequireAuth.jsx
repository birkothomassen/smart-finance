import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";

const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Hvis brukeren ikke er logget inn, send dem til /login
    return <Navigate to="/login" replace />;
  }

  // Hvis brukeren er logget inn, vis den beskyttede siden
  return children;
};

export default RequireAuth;
