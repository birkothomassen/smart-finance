import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUploadPage from "./Pages/HomePage"; // Sørg for riktig sti til FileUploadPage

function App() {
  return (
    <Router>
      <Routes>
        {/* Sett FileUploadPage som hovedrute */}
        <Route path="/" element={<FileUploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
