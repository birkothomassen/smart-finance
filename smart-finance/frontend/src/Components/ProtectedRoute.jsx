import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (!user && !token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
