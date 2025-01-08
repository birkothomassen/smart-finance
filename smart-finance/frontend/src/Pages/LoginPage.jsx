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

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      setMessage("Innlogging vellykket!");
      navigate("/dashboard"); // Naviger til dashboard etter innlogging
    } catch (err) {
      setMessage(err.message);
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
          Logg inn
        </Typography>
        <form onSubmit={handleLogin}>
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
              backgroundColor: "#1E3A8A",
              "&:hover": { backgroundColor: "#162E70" },
            }}
          >
            Logg inn
          </Button>
        </form>
        {message && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Har du ikke en konto?{" "}
          <Link
            href="/signup"
            underline="hover"
            sx={{ color: "#1E3A8A", fontWeight: "bold" }}
          >
            Registrer deg
          </Link>
        </Typography>
      </Paper>
    </Box>
    </div>
  );
};

export default LoginPage;
