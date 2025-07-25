import express from 'express'
import cors from 'cors'
import heroController from '../controllers/heroControllers.js'
import swaggerUi from 'swagger-ui-express'
import petController from '../controllers/petControllers.js'
import { login } from '../controllers/authController.js';
import connectDB from '../config/db.js';
connectDB();

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Habilita CORS para todas las rutas
app.use(express.json())
app.use('/api', heroController)
app.use('/api', petController)
app.post('/api/login', login)

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'API de Superhéroes',
    version: '1.0.0',
    description: 'Documentación de la API de Superhéroes'
  },
  servers: [
    { url: 'https://mascotas-xy4h.onrender.com/api' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Pet: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Krypto' },
          type: { type: 'string', example: 'Perro' },
          superPower: { type: 'string', example: 'Volar' },
          heroId: { type: 'integer', example: 1 },
          felicidad: { type: 'integer', example: 100 },
          personalidad: { type: 'string', example: 'normal', enum: ['normal', 'enojona', 'triste', 'juguetona', 'perezosa'] },
          pereza: { type: 'integer', example: 100, nullable: true }
        }
      }
    }
  },
  paths: {
    '/heroes': {
      get: {
        summary: 'Obtener todos los héroes',
        responses: {
          '200': {
            description: 'Lista de héroes'
          }
        }
      },
      post: {
        summary: 'Crear un nuevo héroe',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'alias'],
                properties: {
                  name: { type: 'string', example: 'Clark Kent' },
                  alias: { type: 'string', example: 'Superman' },
                  city: { type: 'string', example: 'Metropolis' },
                  team: { type: 'string', example: 'Justice League' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Héroe creado'
          }
        }
      }
    },
    '/heroes/{id}': {
      put: {
        summary: 'Actualizar un héroe',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Héroe actualizado'
          }
        }
      },
      delete: {
        summary: 'Eliminar un héroe',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Héroe eliminado'
          }
        }
      }
    },
    '/pets': {
      get: {
        summary: 'Obtener todas las mascotas',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lista de mascotas',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Pet' } }
              }
            }
          }
        }
      },
      post: {
        summary: 'Crear una nueva mascota',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'type', 'superPower', 'heroId'],
                properties: {
                  name: { type: 'string', example: 'Krypto' },
                  type: { type: 'string', example: 'Perro' },
                  superPower: { type: 'string', example: 'Volar' },
                  heroId: { type: 'integer', example: 1 },
                  personalidad: { type: 'string', example: 'normal', enum: ['normal', 'enojona', 'triste', 'juguetona', 'perezosa'] }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Mascota creada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pet' }
              }
            }
          },
          '400': {
            description: 'El héroe no existe'
          }
        }
      }
    },
    '/heroes/{heroId}/pets': {
      get: {
        summary: 'Obtener mascotas de un héroe',
        parameters: [
          {
            name: 'heroId',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Lista de mascotas del héroe',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Pet' } }
              }
            }
          }
        }
      }    },
    '/pets/{id}/vida': {
      get: {
        summary: 'Obtener el estado de vida de la mascota',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Estado de vida de la mascota',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    salud: { type: 'integer' },
                    hambre: { type: 'integer' },
                    sueno: { type: 'integer' },
                    limpieza: { type: 'integer' },
                    estado: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/pets/{id}/banar': {
      post: {
        summary: 'Bañar a la mascota',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Estado de vida actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    salud: { type: 'integer' },
                    hambre: { type: 'integer' },
                    sueno: { type: 'integer' },
                    limpieza: { type: 'integer' },
                    estado: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/pets/{id}/alimentar': {
      post: {
        summary: 'Alimentar a la mascota',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Estado de vida actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    salud: { type: 'integer' },
                    hambre: { type: 'integer' },
                    sueno: { type: 'integer' },
                    limpieza: { type: 'integer' },
                    estado: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/pets/{id}/jugar': {
      post: {
        summary: 'Jugar con la mascota',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Estado de vida actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    salud: { type: 'integer' },
                    hambre: { type: 'integer' },
                    sueno: { type: 'integer' },
                    limpieza: { type: 'integer' },
                    estado: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/pets/{id}/curar': {
      post: {
        summary: 'Curar a la mascota',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Estado de vida actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    salud: { type: 'integer' },
                    hambre: { type: 'integer' },
                    sueno: { type: 'integer' },
                    limpieza: { type: 'integer' },
                    estado: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/pets/{id}/dormir': {
      post: {
        summary: 'Dormir a la mascota',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Estado de la mascota tras dormir',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pet' }
              }
            }
          }
        }
      }
    },
    '/pets/{id}/acariciar': {
      post: {
        summary: 'Acariciar a la mascota',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Estado de la mascota tras ser acariciada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pet' }
              }
            }
          }
        }
      }
    },
    '/pets/{id}': {
      delete: {
        summary: 'Eliminar una mascota',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          '200': {
            description: 'Mascota eliminada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Mascota eliminada' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Mascota no encontrada'
          }
        }
      }
    },
    '/login': {
      post: {
        summary: 'Iniciar sesión (login)',
        description: 'Obtiene un token JWT para autenticación. Para admin usa heroId: 0 y password: admin123. Para usuario normal, heroId de un héroe existente y cualquier password.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['heroId', 'password'],
                properties: {
                  heroId: { type: 'integer', example: 0 },
                  password: { type: 'string', example: 'admin123' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Token JWT generado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Superhéroe no encontrado o credenciales incorrectas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Superhéroe no encontrado' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const PORT = 3001
app.listen(PORT, _ => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
}) 