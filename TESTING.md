# Guía de Pruebas Unitarias

Este documento describe cómo ejecutar las pruebas unitarias del proyecto.

## Instalación de Dependencias

Las dependencias de testing ya están instaladas. Si necesitas reinstalarlas:

```bash
npm install --save-dev jest supertest @types/jest
```

## Ejecutar las Pruebas

### Ejecutar todas las pruebas:
```bash
npm test
```

### Ejecutar pruebas en modo watch:
```bash
npm run test:watch
```

### Ejecutar pruebas con cobertura:
```bash
npx jest --coverage
```

## Estructura de las Pruebas

Las pruebas están organizadas en la carpeta `__tests__/`:

- `__tests__/controllers/`: Pruebas para los controladores
  - `auth.controller.test.js`: Pruebas para autenticación
  - `clientes.controller.test.js`: Pruebas para clientes
- `__tests__/models/`: Pruebas para los modelos
  - `login.test.js`: Pruebas para el modelo de usuario

## Tecnologías Utilizadas

- **Jest**: Framework de testing principal
- **Supertest**: Para probar endpoints HTTP
- **Mocking**: Se utilizan mocks para evitar conexiones reales a la base de datos

## Ejemplos de Uso

### Pruebas de Controladores
Las pruebas de controladores verifican que:
- Los endpoints responden con el código de estado correcto
- Los datos se validan correctamente
- Los errores se manejan apropiadamente

### Pruebas de Modelos
Las pruebas de modelos verifican que:
- Los campos requeridos estén presentes
- La estructura del modelo sea correcta
- Las validaciones funcionen como se espera

## Solución de Problemas

Si encuentras errores al ejecutar las pruebas:

1. Asegúrate de que todas las dependencias estén instaladas
2. Verifica que no haya errores de sintaxis en los archivos
3. Comprueba que los mocks estén configurados correctamente
4. Asegúrate de que los controladores exporten las funciones correctamente

## Agregar Nuevas Pruebas

Para agregar nuevas pruebas:

1. Crea un archivo `.test.js` en la carpeta correspondiente
2. Sigue la estructura de los archivos existentes
3. Usa mocks para evitar dependencias externas
4. Asegúrate de limpiar los mocks después de cada prueba
