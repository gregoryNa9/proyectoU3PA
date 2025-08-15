const request = require('supertest');
const express = require('express');
const authController = require('../../src/controllers/auth.controller');
const User = require('../../src/models/login');
const bcrypt = require('bcrypt');

// Mock de los modelos y dependencias
jest.mock('../../src/models/login');
jest.mock('bcrypt');

const app = express();
app.use(express.json());
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('debe registrar un nuevo usuario exitosamente', async () => {
      const mockUser = {
        nombre: 'negro',
        correo: 'jcyanegro@gmail.com',
        pass: 'juan123'
      };

      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('juan123');
      User.prototype.save = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/auth/register')
        .send({
          nombre: 'negro',
          correo: 'jcyanegro@gmail.com',
          pass: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Usuario registrado correctamente');
      expect(User.findOne).toHaveBeenCalledWith({ correo: 'jcyanegro@gmail.com' });
    });

    it('debe retornar error si el correo ya existe', async () => {
      User.findOne.mockResolvedValue({ correo: 'jcyanegro@gmail.com' });

      const response = await request(app)
        .post('/auth/register')
        .send({
          nombre: 'negro',
          correo: 'jcyanegro@gmail.com',
          pass: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('El correo ya está registrado');
    });

    it('debe manejar errores del servidor', async () => {
      User.findOne.mockRejectedValue(new Error('Error de base de datos'));

      const response = await request(app)
        .post('/auth/register')
        .send({
          nombre: 'negro',
          correo: 'jcyanegro@gmail.com',
          pass: 'password123'
        });

      expect(response.status).toBe(500);
    });
  });

  describe('POST /auth/login', () => {
    it('debe iniciar sesión exitosamente con credenciales válidas', async () => {
      const mockUser = {
        _id: '123456789',
        correo: 'jcyanegro@gmail.com',
        pass: 'juan123'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/auth/login')
        .send({
          correo: 'jcyanegro@gmail.com',
          pass: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login exitoso');
      expect(response.body.userId).toBe('123456789');
    });

    it('debe retornar error si el correo no existe', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send({
          correo: 'noexiste@example.com',
          pass: 'password123'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Correo no encontrado');
    });

    it('debe retornar error si la contraseña es incorrecta', async () => {
      const mockUser = {
        _id: '123456789',
        correo: 'jcyanegro@gmail.com',
        pass: 'juan123'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/auth/login')
        .send({
          correo: 'jcyanegro@gmail.com',
          pass: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Contraseña incorrecta');
    });
  });
});
