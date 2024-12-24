import React from 'react';
import './App.css';
import HomePage from './Pages/HomePage';
import FileUploadPage from './Pages/UpLoadPage';
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

export default App;
