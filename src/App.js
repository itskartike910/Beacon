import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    window.location.href = "https://beaconator.com";
  }, []);

  return (
    <div className="App">
    </div>
  );
}

export default App;
