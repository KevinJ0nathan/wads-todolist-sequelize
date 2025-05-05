import express from 'express';
import { createUser, getUserByEmail, updateUser, loginUser } from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API to manage users
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: User already exists
 */
router.post('/register', createUser);

/**
 * @swagger
 * /api/users/{email}:
 *   get:
 *     summary: Get user details by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           example: john.doe@example.com
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: string
 *                   example: 123456
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john.doe@example.com
 *       404:
 *         description: User not found
 */
router.get('/:email', auth, getUserByEmail);

/**
 * @swagger
 * /api/users/updateUser:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: User successfully updated
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       404:
 *         description: User not found
 */
router.put('/updateUser', auth, updateUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user and return JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: User successfully logged in, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: JWT_Token_Here
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post('/login', loginUser);

export default router;
