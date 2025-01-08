import React from "react";
import { Box } from "@mui/material";
import logo from "../assets/logo.png";

const Logo = () => {
  return (
    <Box sx={{ textAlign: "center", mb: 2 }}>
      <img
        src={logo} // Endre stien hvis logoen ligger et annet sted
        alt="Smart Finance Logo"
        style={{ maxWidth: "150px", height: "auto" }}
      />
    </Box>
  );
};

export default Logo;
