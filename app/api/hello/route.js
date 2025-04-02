/**
 * @swagger
 * /api/hello:
 *   get:
 *     summary: Returns a hello world message.
 *     description: This endpoint returns a simple hello world message to test the API.
 *     responses:
 *       200:
 *         description: A hello world message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello World
 */
export async function GET(req, res) {
    return res.json({ message: "Hello World" });
  }
  