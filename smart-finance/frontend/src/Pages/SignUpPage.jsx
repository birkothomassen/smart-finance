import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import Header from "../Components/Header";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
} from "@mui/material";

const SignUpPage = () => {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: null, type: null }); // type: "success" eller "error"
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await register(username, password);
      setMessage({ text: "Registrering vellykket! Gå til innlogging.", type: "success" });
      setTimeout(() => navigate("/login"), 2000); // Naviger til login etter 2 sekunder
    } catch (err) {
      setMessage({ text: err.message || "Registrering feilet. Prøv igjen.", type: "error" });
    }
  };

  return (
    <div>
    <Header />
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 300px)"
      sx={{ backgroundColor: "#F9FAFB" }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "30px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Registrer deg
        </Typography>
        <form onSubmit={handleSignUp}>
          <TextField
            label="Brukernavn"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Passord"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#FFD700",
              "&:hover": { backgroundColor: "#E6BF00" },
            }}
          >
            Registrer
          </Button>
        </form>
        {message.text && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: message.type === "success" ? "#22C55E" : "error.main", // Grønn for vellykket, rød for feil
            }}
          >
            {message.text}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Har du allerede en konto?{" "}
          <Link
            href="/login"
            underline="hover"
            sx={{ color: "#1E3A8A", fontWeight: "bold" }}
          >
            Logg inn
          </Link>
        </Typography>
      </Paper>
    </Box>
    </div>
  );
};

export default SignUpPage;
