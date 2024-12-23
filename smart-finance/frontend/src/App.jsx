import React from 'react';
import './App.css';
import HomePage from './Pages/HomePage';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Hovedside */}
        <Route path="/" element={<HomePage/>} />
        {/* Side for filopplasting */}
        <Route path="/upload" element={<FileUploadPage />} />
      </Routes>
    </Router>
  );
}

// Side for filopplasting
function FileUploadPage() {
  const handleClick = () => {
    console.log("Knappen ble trykket!");
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h3" className="App-title">
          Min Side
        </Typography>
      </header>
      <Button variant="contained" className="App-button" onClick={handleClick}>
          Legg til aksje
        </Button>
    </div>
  );
}

export default App;
