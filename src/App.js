import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import DoctorDashboard from './Components/DoctorDashboard';
import ReceptionistDashboard from './Components/ReceptionistDashboard';
import './App.css';
  
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/receptionist" element={<ReceptionistDashboard />} />
      </Routes>
    </Router>
  );
}


export default App;