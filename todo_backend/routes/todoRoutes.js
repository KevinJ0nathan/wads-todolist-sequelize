import express from 'express';
import { createTask, getTasksByUser, updateTask, deleteTask } from '../controllers/taskController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API to manage tasks
 */

/**
 * @swagger
 * /api/tasks/createTask:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Complete homework"
 *               description:
 *                 type: string
 *                 example: "Finish math homework by the weekend"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-07"
 *     responses:
 *       201:
 *         description: Task successfully created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal Server Error
 */
router.post('/createTask', auth, createTask);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for a user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Complete homework"
 *                   description:
 *                     type: string
 *                     example: "Finish math homework by the weekend"
 *                   completed:
 *                     type: boolean
 *                     example: false
 *                   dueDate:
 *                     type: string
 *                     format: date
 *                     example: "2025-05-07"
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal Server Error
 */
router.get('/', auth, getTasksByUser);

/**
 * @swagger
 * /api/tasks/updateTask/{taskId}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Complete homework"
 *               description:
 *                 type: string
 *                 example: "Finish math homework by the weekend"
 *               completed:
 *                 type: boolean
 *                 example: true
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-07"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/updateTask/:taskId', auth, updateTask);

/**
 * @swagger
 * /api/tasks/deleteTask/{taskId}:
 *   delete:
 *     summary: Delete a task by its ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deleteTask/:taskId', auth, deleteTask);

export default router;
