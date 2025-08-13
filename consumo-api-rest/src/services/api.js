import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Asegúrate que el backend esté en este puerto
});
// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

export const getClientes = () => api.get('/clientes');
export const addCliente = (data) => api.post('/clientes', data);
export const updateCliente = (id, data) => api.put(`/clientes/${id}`, data);
export const deleteCliente = (id) => api.delete(`/clientes/${id}`);

// Vehiculos
export const getVehiculos = () => api.get('/vehiculos');
export const addVehiculo = (data) => api.post('/vehiculos', data);
export const updateVehiculo = (id, data) => api.put(`/vehiculos/${id}`, data);
export const deleteVehiculo = (id) => api.delete(`/vehiculos/${id}`);

// Mecanicos
export const getMecanicos = () => api.get('/mecanicos');
export const addMecanico = (data) => api.post('/mecanicos', data);
export const updateMecanico = (id, data) => api.put(`/mecanicos/${id}`, data);
export const deleteMecanico = (id) => api.delete(`/mecanicos/${id}`);

// Citas
export const getCitas = () => api.get('/citas');
export const addCita = (data) => api.post('/citas', data);
export const updateCita = (id, data) => api.put(`/citas/${id}`, data);
export const deleteCita = (id) => api.delete(`/citas/${id}`);


