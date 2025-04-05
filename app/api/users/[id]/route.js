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
 *                   description: The unique identifier for the user.
 *                   example: "67e797df47c9baab43d94182"
 *                 name:
 *                   type: string
 *                   description: The full name of the user.
 *                   example: "Vicky"
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                   example: "kmhtwe1999@gmail.com"
 *                 notifications:
 *                   type: array
 *                   description: List of notifications related to the user.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "bcbcdc6d-798d-4f9d-bb5c-2f5cd687028d"
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
 *         description: The user with the specified ID was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 * 
 *   put:
 *     tags: [User API]
 *     description: Updates the user profile, allowing changes to the user's name, email, and password. The current user can only update their own profile.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the user to update.
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
 *                 description: The full name of the user.
 *                 example: "Vicky"
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: "kmhtwe1999@gmail.com"
 *               password:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Successfully updated the user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the user.
 *                   example: "67e797df47c9baab43d94182"
 *                 name:
 *                   type: string
 *                   description: The updated full name of the user.
 *                   example: "Vicky"
 *                 email:
 *                   type: string
 *                   description: The updated email address of the user.
 *                   example: "kmhtwe1999@gmail.com"
 *       403:
 *         description: Forbidden if the current user tries to update another user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: You can only update your own profile."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 * 
 *   delete:
 *     tags: [User API]
 *     description: Deletes the user account. The user can only delete their own account unless they are an admin.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the user account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       403:
 *         description: Forbidden if the current user is not authorized to delete the user (either their own account or as an admin).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: You can only delete your own account or an admin account."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */


// GET /api/users/{id}
export async function GET(req, { params }) {
    try {
      // Fetch the user by their unique ID, including related data like teams, notifications, and dashboard stats
      const user = await prismadb.user.findUnique({
        where: {
          id: params.id
        },
        include: {
          // teams: {
          //   include: {
          //     team: true, 
          //     role: true  // Include the role the user has in each team
          //   }
          // },
          notifications: true,
          dashboardStats: true
        }
      });
  
      if (!user) {
        return new NextResponse("User not found", { status: 404 });
      }
  
      return NextResponse.json(user);
    } catch (error) {
      console.log("[USER_GET_BY_ID]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// PUT /api/users/{id}
export async function PUT(req, { params }) {
    try {
      const { name, email, password } = await req.json();
      const { currentUser } = await serverAuth();
  
      // Ensure the current user is updating their own profile (optional security measure)
      if (currentUser.id !== params.id) {
        return new NextResponse("Forbidden: You can only update your own profile.", { status: 403 });
      }
  
      let updatedUser;
  
      // If password is provided, hash it
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 12);
        updatedUser = await prismadb.user.update({
          where: { id: currentUser.id },
          data: {
            name,
            email,
            hashedPassword
          }
        });
      } else {
        updatedUser = await prismadb.user.update({
          where: { id: currentUser.id },
          data: {
            name,
            email
          }
        });
      }
  
      return NextResponse.json(updatedUser);
    } catch (error) {
      console.log("[USER_UPDATE]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// DELETE /api/users/{id}
export async function DELETE(req, { params }) {
    try {
      const { currentUser } = await serverAuth();
  
      // Ensure the current user is authorized to delete the user (either the user themselves or an admin)
      const userInTeams = await prismadb.teamMembers.findMany({
        where: {
          userId: params.id
        }
      });
      
      const isAdmin = userInTeams.some(teamMember => teamMember.role === 'ADMIN');
      
      if (currentUser.id !== params.id && !isAdmin) {
        return new NextResponse("Forbidden: You can only delete your own account or an admin account.", { status: 403 });
      }
  
      // Delete the user from the database
      await prismadb.user.delete({
        where: {
          id: params.id
        }
      });
  
      return new NextResponse("User deleted successfully", { status: 200 });
    } catch (error) {
      console.log("[USER_DELETE]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
}
