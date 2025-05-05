import express from 'express';
import cors from 'cors';
import userRoutes from './todo_backend/routes/userRoutes.js';
import taskRoutes from './todo_backend/routes/todoRoutes.js';
import sequelize from './todo_backend/config/config.js';  
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
dotenv.config();

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo App API',
      version: '1.0.0',
      description: 'API for managing tasks and users',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./todo_backend/routes/*.js'], // Path to your route files
};

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use user and task routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Sync the models with the database
sequelize.sync({ force: false })  // { force: false } ensures it doesn't drop tables if they already exist
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
