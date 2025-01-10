import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Sjekk om en token finnes i localStorage når appen lastes inn
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUser(response.data))
        .catch(() => logout());
    }
  }, []);

  const register = async (username, password) => {
    const response = await axios.post("http://localhost:5000/register", {
      username,
      password,
    });
    return response.data; // Returner dataen fra serveren
  };

  const login = async (username, password) => {
    const response = await axios.post("http://localhost:5000/login", {
      username,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token); // Lagre token i localStorage
    const userResponse = await axios.get("http://localhost:5000/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(userResponse.data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Fjern token fra localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
