import React from "react";
import { Typography, Box } from "@mui/material";

const Header = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 2, mb: 4 }}>
      <Typography
        variant="h3"
        sx={{
            fontFamily: "Poppins, Arial, sans-serif",
            fontWeight: "bold",
            color: "#4C2882", // Lilla farge
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
            fontSize: "6rem", // Større skriftstørrelse
            marginTop: "70px", // Større margin fra toppen
            marginBottom: "1px",
          }}          
      >
        Smart Finance
      </Typography>
    </Box>
  );
};

export default Header;