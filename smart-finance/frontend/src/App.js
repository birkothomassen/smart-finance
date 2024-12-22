import React from 'react';
import './App.css';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h3" className="App-title" gutterBottom>
          Smart Finance
        </Typography>
        <Typography variant="subtitle1" className="App-subtitle">
          Din moderne AI-løsning for økonomisk analyse
        </Typography>
      </header>
      <Container maxWidth="sm" className="App-container">
        <Typography variant="body1" className="App-description">
          Last opp porteføljedataene dine, og la vår AI hjelpe deg med å ta smartere finansielle beslutninger.
        </Typography>
        <Button variant="contained" className="App-button">
          Kom i gang
        </Button>
      </Container>
    </div>
  );
}

export default App;
