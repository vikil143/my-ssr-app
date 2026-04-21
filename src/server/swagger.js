const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My SSR App API',
      version: '1.0.0',
      description:
        'REST API for authentication, task management, and items. Authentication uses an HttpOnly JWT cookie set automatically on login/register.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Development server' }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token set via HttpOnly cookie on login/register.',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id:    { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
            name:  { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id:         { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
            title:       { type: 'string', example: 'Buy groceries' },
            description: { type: 'string', example: 'Milk, eggs, bread' },
            status: {
              type: 'string',
              enum: ['todo', 'in-progress', 'done'],
              example: 'todo',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              example: 'medium',
            },
            userId:    { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Item: {
          type: 'object',
          properties: {
            _id:       { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
            name:      { type: 'string', example: 'Widget' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ErrorMessage: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Something went wrong.' },
          },
        },
      },
    },
    paths: {
      // ── Auth ────────────────────────────────────────────────────────────────
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          description:
            'Creates a new account with email and password. Sets an HttpOnly JWT cookie on success. Rate-limited to 10 requests per 15 minutes.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name:     { type: 'string', example: 'Jane Doe' },
                    email:    { type: 'string', format: 'email', example: 'jane@example.com' },
                    password: { type: 'string', minLength: 6, example: 'secret123' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User created successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/User' } },
              },
            },
            400: {
              description: 'Validation error (missing fields or password too short)',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            409: {
              description: 'Email already in use',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            429: {
              description: 'Too many attempts',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Log in with email and password',
          description:
            'Authenticates a user and sets an HttpOnly JWT cookie. Rate-limited to 10 requests per 15 minutes.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email:    { type: 'string', format: 'email', example: 'jane@example.com' },
                    password: { type: 'string', example: 'secret123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/User' } },
              },
            },
            400: {
              description: 'Missing email or password',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            401: {
              description: 'Invalid credentials',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            429: {
              description: 'Too many attempts',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Log out',
          description: 'Clears the JWT cookie.',
          responses: {
            200: {
              description: 'Logged out successfully',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
          },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          description: 'Returns the authenticated user decoded from the JWT cookie.',
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: 'Current user',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/User' } },
              },
            },
            401: {
              description: 'Not authenticated',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
          },
        },
      },
      '/api/auth/google': {
        get: {
          tags: ['Auth'],
          summary: 'Initiate Google OAuth',
          description: 'Redirects the user to the Google consent screen. Not callable from Swagger UI directly — open in a browser.',
          responses: {
            302: { description: 'Redirect to Google' },
          },
        },
      },
      '/api/auth/google/callback': {
        get: {
          tags: ['Auth'],
          summary: 'Google OAuth callback',
          description:
            'Google redirects here after consent. Sets the JWT cookie and redirects to /items. Handled automatically — do not call directly.',
          responses: {
            200: { description: 'HTML page that sets localStorage and redirects' },
            302: { description: 'Redirect to /login on failure' },
          },
        },
      },

      // ── Tasks ────────────────────────────────────────────────────────────────
      '/api/tasks': {
        get: {
          tags: ['Tasks'],
          summary: 'List tasks',
          description: "Returns the authenticated user's tasks, newest first. Filter by status or priority using query params.",
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: 'status',
              in: 'query',
              description: 'Filter by status',
              schema: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
            },
            {
              name: 'priority',
              in: 'query',
              description: 'Filter by priority',
              schema: { type: 'string', enum: ['low', 'medium', 'high'] },
            },
          ],
          responses: {
            200: {
              description: 'Array of tasks',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                },
              },
            },
            401: {
              description: 'Not authenticated',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
          },
        },
        post: {
          tags: ['Tasks'],
          summary: 'Create a task',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: {
                      type: 'string',
                      maxLength: 200,
                      example: 'Buy groceries',
                    },
                    description: {
                      type: 'string',
                      maxLength: 2000,
                      example: 'Milk, eggs, bread',
                    },
                    priority: {
                      type: 'string',
                      enum: ['low', 'medium', 'high'],
                      default: 'medium',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Task created',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Task' } },
              },
            },
            400: {
              description: 'Validation error',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            401: {
              description: 'Not authenticated',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
          },
        },
      },
      '/api/tasks/{id}': {
        get: {
          tags: ['Tasks'],
          summary: 'Get a task by ID',
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              example: '664f1a2b3c4d5e6f7a8b9c0d',
            },
          ],
          responses: {
            200: {
              description: 'Task found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Task' } },
              },
            },
            400: {
              description: 'Invalid task ID',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            401: {
              description: 'Not authenticated',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            404: {
              description: 'Task not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
          },
        },
        put: {
          tags: ['Tasks'],
          summary: 'Update a task',
          description: 'Partially updates a task. Only fields present in the request body are changed.',
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              example: '664f1a2b3c4d5e6f7a8b9c0d',
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title:       { type: 'string', maxLength: 200 },
                    description: { type: 'string', maxLength: 2000 },
                    status:      { type: 'string', enum: ['todo', 'in-progress', 'done'] },
                    priority:    { type: 'string', enum: ['low', 'medium', 'high'] },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Updated task',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Task' } },
              },
            },
            400: {
              description: 'Validation error or invalid ID',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            401: {
              description: 'Not authenticated',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            404: {
              description: 'Task not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
          },
        },
        delete: {
          tags: ['Tasks'],
          summary: 'Delete a task',
          security: [{ cookieAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              example: '664f1a2b3c4d5e6f7a8b9c0d',
            },
          ],
          responses: {
            200: {
              description: 'Task deleted',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            400: {
              description: 'Invalid task ID',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            401: {
              description: 'Not authenticated',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            404: {
              description: 'Task not found',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
          },
        },
      },

      // ── Items ────────────────────────────────────────────────────────────────
      '/api/items': {
        get: {
          tags: ['Items'],
          summary: 'List all items',
          description: 'Returns all items sorted newest first. No authentication required.',
          responses: {
            200: {
              description: 'Array of items',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Item' } },
                },
              },
            },
          },
        },
        post: {
          tags: ['Items'],
          summary: 'Create an item',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Widget' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Item created',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Item' } },
              },
            },
            400: {
              description: 'Name is required',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
            401: {
              description: 'Not authenticated',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ErrorMessage' } },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
