import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [User API]
 *     description: Fetches a user profile by the unique user ID. This includes related data like teams, notifications, and dashboard stats.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "67e797df47c9baab43d94182"
 *                 name:
 *                   type: string
 *                   example: "Vicky"
 *                 email:
 *                   type: string
 *                   example: "kmhtwe1999@gmail.com"
 *                 username:
 *                   type: string
 *                   example: "vicky123"
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "notif-123"
 *                       content:
 *                         type: string
 *                         example: "You have a new message."
 *                 dashboardStats:
 *                   type: object
 *                   properties:
 *                     totalTasks:
 *                       type: integer
 *                       example: 10
 *                     completedTasks:
 *                       type: integer
 *                       example: 5
 *                     overdueTasks:
 *                       type: integer
 *                       example: 2
 *                     completionRate:
 *                       type: number
 *                       format: float
 *                       example: 0.5
 *                     activeProjects:
 *                       type: integer
 *                       example: 3
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 *
 *   patch:
 *     tags: [User API]
 *     description: Partially updates a user's profile.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 *
 *   put:
 *     tags: [User API]
 *     description: Fully updates a user's profile.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     tags: [User API]
 *     description: Deletes a user profile.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */

// GET /api/users/{id}
export async function GET(req, { params }) {
  try {
    const user = await prismadb.user.findUnique({
      where: { id: params.id },
      include: {
        notifications: true,
        dashboardStats: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET_BY_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PATCH /api/users/{id}
export async function PATCH(req, { params }) {
  try {
    const { name, email, password, username } = await req.json();
    const { currentUser } = await serverAuth();

    if (currentUser.id !== params.id) {
      return new NextResponse("Forbidden: You can only update your own profile.", { status: 403 });
    }

    const updateData = {
      name,
      email,
      username,
    };

    if (password) {
      updateData.hashedPassword = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prismadb.user.update({
      where: { id: currentUser.id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PUT /api/users/{id}
export async function PUT(req, { params }) {
  try {
    const { name, email, password, username } = await req.json();
    const { currentUser } = await serverAuth();

    if (currentUser.id !== params.id) {
      return new NextResponse("Forbidden: You can only update your own profile.", { status: 403 });
    }

    const updateData = {
      name,
      email,
      username,
    };

    if (password) {
      updateData.hashedPassword = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prismadb.user.update({
      where: { id: currentUser.id },
      data: updateData,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/users/{id}
export async function DELETE(req, { params }) {
  try {
    const { currentUser } = await serverAuth();

    const userInTeams = await prismadb.teamMembers.findMany({
      where: { userId: params.id },
    });

    const isAdmin = userInTeams.some((member) => member.role === "ADMIN");

    if (currentUser.id !== params.id && !isAdmin) {
      return new NextResponse("Forbidden: You can only delete your own account or as an admin.", { status: 403 });
    }

    await prismadb.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
