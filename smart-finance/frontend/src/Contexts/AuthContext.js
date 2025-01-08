import { createContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const res = await axios.post("http://localhost:5000/login", { username, password });
      localStorage.setItem("token", res.data.token); // Lagre token i localStorage
      setUser({ username }); // Oppdater brukerstatus
      console.log("Innlogging vellykket:", res.data);
    } catch (err) {
      console.error("Innlogging feilet:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Innlogging feilet. Sjekk brukernavn og passord.");
    }
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const register = async (username, password) => {
    try {
      const res = await axios.post("http://localhost:5000/register", { username, password });
      console.log("Registrering vellykket:", res.data);
    } catch (err) {
      console.error("Registrering feilet:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Registrering feilet. Prøv igjen.");
    }
  };
  
  
  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
