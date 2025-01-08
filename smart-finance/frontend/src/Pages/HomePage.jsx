import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StockTable from "../Components/StockTable";
import AIStockPrediction from "../Components/AIStockPrediction";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./HomePage.css";

function HomePage() {
  const [stocks, setStocks] = useState([]);
  const { logout, user } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="App">
      {/* Header med logo og brukerikon */}
      <header className="App-header">
        <Typography variant="h2" className="App-title">
          Smart Finance
        </Typography>
        <AppBar position="static" elevation={0} sx={{ backgroundColor: "transparent", boxShadow: "none" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              size="large"
              edge="end"
              aria-controls="account-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              sx={{ color: "#1E3A8A" }}
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem disabled>
                <Avatar sx={{ bgcolor: "#1E3A8A", marginRight: 1 }}>
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </Avatar>
                {user?.username || "Bruker"}
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logg ut</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </header>

      {/* Innhold på siden */}
      <div className="table-container">
        <StockTable stocks={stocks} />
      </div>
      <div className="AI-pred">
        <AIStockPrediction />
      </div>
    </div>
  );
}

export default HomePage;
