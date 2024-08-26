import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao Dashboard do sistema!</p>
    </div>
  );
};

export default Dashboard;
