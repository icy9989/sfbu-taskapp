import { NextRequest, NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     tags: [Teams]
 *     description: Retrieves the details of a specific team by its ID, including its admin and members. Authentication is handled via NextAuth.js.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the team.
 *         schema:
 *           type: string
 *           example: "abc123"
 *     responses:
 *       200:
 *         description: Successfully retrieved team details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the team.
 *                   example: "abc123"
 *                 name:
 *                   type: string
 *                   description: The name of the team.
 *                   example: "Development Team"
 *                 description:
 *                   type: string
 *                   description: A brief description of the team.
 *                   example: "A team responsible for software development."
 *                 admin:
 *                   type: object
 *                   description: The admin (creator) of the team.
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "xyz456"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "abc789"
 *                       name:
 *                         type: string
 *                         example: "Jane Doe"
 *       401:
 *         description: Unauthorized if the user is not authenticated via NextAuth.js.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthenticated"
 *       404:
 *         description: Team not found if the team with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Team not found"
 *       500:
 *         description: Internal server error if there is an issue with fetching the team.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *   put:
 *     tags: [Teams]
 *     description: Updates the details of a specific team if the current user is the admin. Authentication is handled via NextAuth.js.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the team to be updated.
 *         schema:
 *           type: string
 *           example: "abc123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the team.
 *                 example: "Updated Development Team"
 *               description:
 *                 type: string
 *                 description: A brief description of the team.
 *                 example: "An updated team responsible for software development."
 *     responses:
 *       200:
 *         description: Successfully updated the team details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the team.
 *                   example: "abc123"
 *                 name:
 *                   type: string
 *                   description: The updated name of the team.
 *                   example: "Updated Development Team"
 *                 description:
 *                   type: string
 *                   description: The updated description of the team.
 *                   example: "An updated team responsible for software development."
 *       400:
 *         description: Bad request if any required fields are missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bad request"
 *       401:
 *         description: Unauthorized if the user is not authenticated via NextAuth.js.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthenticated"
 *       403:
 *         description: Forbidden if the current user is not the admin of the team.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: You are not the admin of this team"
 *       500:
 *         description: Internal server error if there is an issue with updating the team.
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
 *     tags: [Teams]
 *     description: Deletes a team by its ID. Only the admin (creator) of the team can delete it. Authentication is handled via NextAuth.js.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the team to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the team.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Team deleted successfully"
 *       401:
 *         description: Unauthorized if the user is not authenticated via NextAuth.js.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthenticated"
 *       403:
 *         description: Forbidden if the current user is not the admin of the team.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: You are not the admin of this team"
 *       404:
 *         description: Team not found if the team with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Team not found"
 *       500:
 *         description: Internal server error if there is an issue with deleting the team.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

// GET /api/teams/{id} → Get team details
export async function GET(req, { params }) {
  try {
    const { currentUser } = await serverAuth();

    if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

    // Fetch the team with its members and the team creator (admin)
    const team = await prismadb.team.findUnique({
      where: {
        id: params.id,
      },
      include: {
        admin: true,
        members: true, // Members of the team
      },
    });

    if (!team) {
      return new NextResponse("Team not found", { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.log("[TEAM_GET_BY_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PUT /api/teams/{id} → Update team details
export async function PUT(req, { params }) {
  try {
    const { name, description } = await req.json();
    const { currentUser } = await serverAuth();

    if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

    // Find the team to check if the current user is the admin
    const team = await prismadb.team.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!team) return new NextResponse("Team not found", { status: 404 });
    if (team.adminId !== currentUser.id) return new NextResponse("Forbidden: You are not the admin of this team", { status: 403 });

    // Update the team
    const updatedTeam = await prismadb.team.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.log("[TEAM_UPDATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/teams/{id} → Delete team
export async function DELETE(req, { params }) {
  try {
    const { currentUser } = await serverAuth();

    if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

    // Find the team to check if the current user is the admin
    const team = await prismadb.team.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!team) return new NextResponse("Team not found", { status: 404 });
    if (team.adminId !== currentUser.id) return new NextResponse("Forbidden: You are not the admin of this team", { status: 403 });

    // Delete the team
    await prismadb.team.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse("Team deleted successfully", { status: 200 });
  } catch (error) {
    console.log("[TEAM_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
