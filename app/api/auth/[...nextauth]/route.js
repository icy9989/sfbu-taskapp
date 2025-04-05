import NextAuth from "next-auth"

import { authOptions } from "./auth-options";

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication and authorization
 */

/**
 * @swagger
 * /api/auth/csrf:
 *   get:
 *     summary: Get CSRF Token
 *     description: This endpoint returns a CSRF token to be used in authentication forms to prevent CSRF attacks.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successful response with CSRF token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 csrfToken:
 *                   type: string
 *                   example: 'csrf-token-here'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */

/**
 * @swagger
 * /api/auth/callback/credentials:
 *   post:
 *     summary: Callback for Credentials-based Login
 *     description: This endpoint is called after submitting credentials (email and password) to authenticate the user using the Credentials provider in NextAuth.js. It validates the credentials and returns the session data or an error message.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - csrfToken
 *               - email
 *               - password
 *             properties:
 *               csrfToken:
 *                 type: string
 *                 description: CSRF token to protect the request.
 *                 example: '801a000af2a2479f2db746c5eab207a254c3d14feba8308074d738a07c27d3d0'
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *                 example: 'kmhtwe1999@gmail.com'
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: 'Kmh3151999?'
 *     responses:
 *       200:
 *         description: Successful authentication, returns a JWT token and user information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: 'jwt.token.here'
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 'user-id'
 *                     email:
 *                       type: string
 *                       example: 'kmhtwe1999@gmail.com'
 *       400:
 *         description: Invalid credentials or missing information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Credentials are required!'
 *       401:
 *         description: Unauthorized due to incorrect email/password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid credentials, please check your email or password.'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'An error occurred while processing the login request.'
 */

/**
 * @swagger
 * /api/auth/session:
 *   get:
 *     summary: Get current session information
 *     description: This endpoint returns the current user's session details, including user information and session expiration time. If no active session exists, it returns an empty object or error message.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Returns current session information if the user is authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: 'Vicky'
 *                     email:
 *                       type: string
 *                       example: 'kmhtwe1999@gmail.com'
 *                     id:
 *                       type: string
 *                       example: '67e797df47c9baab43d94182'
 *                 expires:
 *                   type: string
 *                   example: '2025-05-04T04:35:50.468Z'
 *       401:
 *         description: Unauthorized, no active session found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'No active session'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'An error occurred while fetching the session data.'
 */

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }