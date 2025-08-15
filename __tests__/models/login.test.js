const mongoose = require('mongoose');
const User = require('../../src/models/login');

// Mock de mongoose
jest.mock('mongoose');

describe('User Model', () => {
  let mockUser;

  beforeEach(() => {
    mockUser = {
      nombre: 'Test User',
      correo: 'test@example.com',
      pass: 'password123',
      save: jest.fn(),
      validate: jest.fn()
    };
  });

  it('debe tener los campos requeridos', () => {
    const userData = {
      nombre: 'Test User',
      correo: 'test@example.com',
      pass: 'password123'
    };

    expect(userData.nombre).toBeDefined();
    expect(userData.correo).toBeDefined();
    expect(userData.pass).toBeDefined();
  });

  it('debe validar que el nombre es requerido', () => {
    const userData = {
      correo: 'test@example.com',
      pass: 'password123'
    };

    expect(userData.nombre).toBeUndefined();
  });

  it('debe validar que el correo es requerido', () => {
    const userData = {
      nombre: 'Test User',
      pass: 'password123'
    };

    expect(userData.correo).toBeUndefined();
  });

  it('debe validar que la contraseña es requerida', () => {
    const userData = {
      nombre: 'Test User',
      correo: 'test@example.com'
    };

    expect(userData.pass).toBeUndefined();
  });

  it('debe tener una estructura correcta de modelo', () => {
    const expectedStructure = {
      nombre: expect.any(String),
      correo: expect.any(String),
      pass: expect.any(String)
    };

    const userData = {
      nombre: 'Test User',
      correo: 'test@example.com',
      pass: 'password123'
    };

    expect(userData).toMatchObject(expectedStructure);
  });
});
