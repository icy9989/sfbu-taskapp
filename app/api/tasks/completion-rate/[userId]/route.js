import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/server-auth';

/**
 * @swagger
 * /api/tasks/completion-rate/{userId}:
 *   get:
 *     tags: [Tasks]
 *     description: Retrieves the completion rate of tasks for a specific user.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The unique identifier of the user for whom the completion rate is to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the task completion rate.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTasks:
 *                   type: integer
 *                   description: The total number of tasks created by the user.
 *                   example: 10
 *                 completedTasks:
 *                   type: integer
 *                   description: The number of tasks completed by the user.
 *                   example: 6
 *                 completionRate:
 *                   type: string
 *                   description: The completion rate as a percentage.
 *                   example: "60.00%"
 *       400:
 *         description: User ID is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User ID is required"
 *       401:
 *         description: The user is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthenticated"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

// Define the API route handler
export async function GET(req, { params }) {
  const { userId } = params; // Extract userId from route parameters

  try {
    // Ensure the userId is provided
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Authenticate the user
    const { currentUser } = await serverAuth();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // Fetch total and completed tasks for the user
    const [totalTasks, completedTasks] = await Promise.all([
      prismadb.task.count({
        where: { creatorId: userId },
      }),
      prismadb.task.count({
        where: { creatorId: userId, status: 'Completed' },
      }),
    ]);

    // Calculate the completion rate
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : '0';

    // Return the response with the completion rate
    return NextResponse.json({
      totalTasks,
      completedTasks,
      completionRate: `${completionRate}%`,
    });
  } catch (error) {
    // Log and return an error if something goes wrong
    console.error('[TASK_COMPLETION_RATE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
