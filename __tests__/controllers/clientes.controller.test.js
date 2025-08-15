const request = require('supertest');
const express = require('express');

// Mock del controlador
const clientesController = {
  getClientes: jest.fn(),
  getClienteById: jest.fn(),
  createCliente: jest.fn(),
  updateCliente: jest.fn(),
  deleteCliente: jest.fn()
};

const app = express();
app.use(express.json());

// Rutas de prueba
app.get('/clientes', (req, res) => clientesController.getClientes(req, res));
app.get('/clientes/:id', (req, res) => clientesController.getClienteById(req, res));
app.post('/clientes', (req, res) => clientesController.createCliente(req, res));
app.put('/clientes/:id', (req, res) => clientesController.updateCliente(req, res));
app.delete('/clientes/:id', (req, res) => clientesController.deleteCliente(req, res));

describe('Clientes Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /clientes', () => {
    it('debe obtener todos los clientes', async () => {
      const mockClientes = [
        { _id: '1', nombre: 'Juan Pérez', telefono: '123456789', email: 'juan@example.com' },
        { _id: '2', nombre: 'María García', telefono: '987654321', email: 'maria@example.com' }
      ];

      clientesController.getClientes.mockImplementation((req, res) => {
        res.status(200).json(mockClientes);
      });

      const response = await request(app)
        .get('/clientes');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClientes);
    });

    it('debe manejar errores al obtener clientes', async () => {
      clientesController.getClientes.mockImplementation((req, res) => {
        res.status(500).json({ message: 'Error de base de datos' });
      });

      const response = await request(app)
        .get('/clientes');

      expect(response.status).toBe(500);
    });
  });

  describe('GET /clientes/:id', () => {
    it('debe obtener un cliente por ID', async () => {
      const mockCliente = {
        _id: '123',
        nombre: 'Juan Pérez',
        telefono: '123456789',
        email: 'juan@example.com'
      };

      clientesController.getClienteById.mockImplementation((req, res) => {
        res.status(200).json(mockCliente);
      });

      const response = await request(app)
        .get('/clientes/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCliente);
    });

    it('debe retornar 404 si el cliente no existe', async () => {
      clientesController.getClienteById.mockImplementation((req, res) => {
        res.status(404).json({ message: 'Cliente no encontrado' });
      });

      const response = await request(app)
        .get('/clientes/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /clientes', () => {
    it('debe crear un nuevo cliente', async () => {
      const nuevoCliente = {
        nombre: 'Carlos López',
        telefono: '555555555',
        email: 'carlos@example.com',
        direccion: 'Calle Principal 123'
      };

      const mockCliente = { _id: '456', ...nuevoCliente };

      clientesController.createCliente.mockImplementation((req, res) => {
        res.status(201).json(mockCliente);
      });

      const response = await request(app)
        .post('/clientes')
        .send(nuevoCliente);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCliente);
    });
  });

  describe('PUT /clientes/:id', () => {
    it('debe actualizar un cliente existente', async () => {
      const datosActualizados = {
        nombre: 'Carlos López Actualizado',
        telefono: '666666666'
      };

      const mockCliente = { _id: '123', ...datosActualizados };

      clientesController.updateCliente.mockImplementation((req, res) => {
        res.status(200).json(mockCliente);
      });

      const response = await request(app)
        .put('/clientes/123')
        .send(datosActualizados);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCliente);
    });
  });

  describe('DELETE /clientes/:id', () => {
    it('debe eliminar un cliente existente', async () => {
      clientesController.deleteCliente.mockImplementation((req, res) => {
        res.status(200).json({ message: 'Cliente eliminado correctamente' });
      });

      const response = await request(app)
        .delete('/clientes/123');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Cliente eliminado correctamente');
    });
  });
});
