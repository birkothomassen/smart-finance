import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
  
    function komiGang(){
     return navigate('/upload');
    };
  
    return (
      <div className="App">
        <header className="App-header">
          <Typography variant="h2" className="App-title" gutterBottom>
            Smart Finance
          </Typography>
          <Typography variant="h5" className="App-subtitle">
            Din moderne AI-løsning for økonomisk analyse
          </Typography>
        </header>
          <Typography variant="body1" className="App-description">
            Last opp porteføljedataene dine, og la vår AI hjelpe deg med å ta smartere finansielle beslutninger.
          </Typography>
          <Button variant="contained" className="App-button" onClick={komiGang}>
            Kom i gang
          </Button>
      </div>
    );
  }
  
  export default HomePage;