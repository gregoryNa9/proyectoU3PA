import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';

import Citas from './components/Citas';
import Clientes from './components/Clientes';
import Vehiculos from './components/Vehiculos';
import Mecanicos from './components/Mecanicos';

import './App.css';

// Componente para rutas privadas
const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('userId');
  return user ? children : <Navigate to="/login" />;
};

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/citas" className={({ isActive }) => (isActive ? 'active' : '')}>Citas</NavLink>
      <NavLink to="/clientes" className={({ isActive }) => (isActive ? 'active' : '')}>Clientes</NavLink>
      <NavLink to="/vehiculos" className={({ isActive }) => (isActive ? 'active' : '')}>Vehículos</NavLink>
      <NavLink to="/mecanicos" className={({ isActive }) => (isActive ? 'active' : '')}>Mecánicos</NavLink>
    </nav>
  );
};

const App = () => {
  const user = localStorage.getItem('userId');

  return (
    <Router>
      {/* Mostrar Navbar solo si hay usuario autenticado */}
      {user && <Navbar />}

      <Routes>
        <Route path="/login" element={user ? <Navigate to="/citas" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/citas" /> : <Register />} />

        {/* Rutas privadas */}
        <Route
          path="/citas"
          element={
            <PrivateRoute>
              <Citas />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <Clientes />
            </PrivateRoute>
          }
        />
        <Route
          path="/vehiculos"
          element={
            <PrivateRoute>
              <Vehiculos />
            </PrivateRoute>
          }
        />
        <Route
          path="/mecanicos"
          element={
            <PrivateRoute>
              <Mecanicos />
            </PrivateRoute>
          }
        />

        {/* Si usuario está autenticado, redirigir la raíz a citas */}
        <Route path="/" element={user ? <Navigate to="/citas" /> : <Navigate to="/login" />} />

        {/* Ruta para cualquier otra no encontrada, opcional */}
        <Route path="*" element={<Navigate to={user ? "/citas" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
