import './App.css';
import './css/styles.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './landing/landing';
import Core from './core/core';

function App() {
  return (
    <div className="App">

        <Router>
          <Routes>
           <Route path="/" element={<Landing/>}/>
           <Route path="/core/*" element={<Core/>}/>
          </Routes>
        </Router>

    </div>
  );
}

export default App;
