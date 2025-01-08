import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import { Box, Typography, Button, Paper } from "@mui/material";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleGetStarted = () => {
    navigate("/home");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
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
          Velkommen, {user?.username}!
        </Typography>
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#1E3A8A",
            "&:hover": { backgroundColor: "#162E70" },
          }}
          onClick={handleGetStarted}
        >
          Kom i gang
        </Button>
        <Button
          variant="outlined"
          fullWidth
          sx={{
            mt: 2,
            borderColor: "#1E3A8A",
            color: "#1E3A8A",
            "&:hover": { backgroundColor: "#E8F0FE" },
          }}
          onClick={handleLogout}
        >
          Logg ut
        </Button>
      </Paper>
    </Box>
  );
};

export default Dashboard;
