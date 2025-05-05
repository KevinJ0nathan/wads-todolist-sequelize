import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ToDo List Management API',
      version: '1.0.0',
      description: 'API for managing tasks and users in a ToDo list application',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development Server',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['uid', 'name', 'email', 'password'],
          properties: {
            uid: { type: 'string', description: 'Unique identifier for the user' },
            name: { type: 'string', description: 'Full name of the user' },
            email: { type: 'string', description: "User's email address" },
            password: { type: 'string', description: 'Hashed password of the user' },
          },
          example: {
            uid: 'user123',
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '$2a$10$abcdef...',
          },
        },
        Task: {
          type: 'object',
          required: ['userId', 'title'],
          properties: {
            id: { type: 'integer', description: 'Unique task ID' },
            userId: { type: 'string', description: 'ID of the user who created the task' },
            title: { type: 'string', description: 'Title of the task' },
            description: { type: 'string', description: 'Detailed description of the task' },
            completed: { type: 'boolean', description: 'Status of the task (true = completed)' },
            created: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
            dueDate: { type: 'string', format: 'date-time', description: 'Due date (optional)' },
          },
          example: {
            id: 1,
            userId: 'user123',
            title: 'Finish assignment',
            description: 'Complete the math assignment before Monday',
            completed: false,
            created: '2025-05-05T12:00:00Z',
            dueDate: '2025-05-07T23:59:00Z',
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '..', 'routes', '*.js'),
    path.join(__dirname, '..', 'controllers', '*.js'),
  ],
});

export default swaggerSpec;
