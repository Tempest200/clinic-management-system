import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import DoctorDashboard from './Components/DoctorDashboard';
import ReceptionistDashboard from './Components/ReceptionistDashboard';
import './App.css';
  
function App() {
  
   
    
   <Router basename="/clinic-management-system"> {/* basename is important for GitHub Pages */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/receptionist" element={<ReceptionistDashboard />} />
        {/* Fallback route */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;