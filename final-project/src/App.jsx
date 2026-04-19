import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DashboardHome from './components/Dashboard/DashboardHome';
import CreateCbcUser from './components/Dashboard/CreateCbcUser';
import UserRequest from './components/Dashboard/UserRequest';
import WalletAdjustment from './components/Dashboard/WalletAdjustment';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="users">
              <Route index element={<Navigate to="create" replace />} />
              <Route path="create" element={<CreateCbcUser />} />
              <Route path="requests" element={<UserRequest />} />
            </Route>
            <Route path="audit" element={<div style={{padding: '20px'}}>Audit Trail Page Placeholder</div>} />
            <Route path="wallet" element={<WalletAdjustment />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
