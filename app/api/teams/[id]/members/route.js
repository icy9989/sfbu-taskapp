import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/teams/{id}/members:
 *   post:
 *     tags: [Teams]
 *     description: Adds a member to a team. Only the admin of the team can add members. Authentication is handled via NextAuth.js.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the team.
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
 *               userId:
 *                 type: string
 *                 description: The unique identifier of the user to be added to the team.
 *                 example: "user123"
 *               role:
 *                 type: string
 *                 description: The role of the user in the team (e.g., "MEMBER", "ADMIN").
 *                 example: "MEMBER"
 *     responses:
 *       200:
 *         description: Successfully added the user as a member of the team.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the team member.
 *                   example: "123abc456"
 *                 teamId:
 *                   type: string
 *                   description: The unique identifier of the team.
 *                   example: "abc123"
 *                 userId:
 *                   type: string
 *                   description: The unique identifier of the added user.
 *                   example: "user123"
 *                 role:
 *                   type: string
 *                   description: The role of the user in the team.
 *                   example: "MEMBER"
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
 *                   example: "Forbidden: Only the admin can add members"
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
 *         description: Internal server error if there is an issue with adding the team member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

// POST /api/teams/{id}/members → Add team members
export async function POST(req, { params }) {
  try {
    const { userId, role } = await req.json();
    const { currentUser } = await serverAuth();

    if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

    // Find the team to check if the current user is the admin
    const team = await prismadb.team.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!team) return new NextResponse("Team not found", { status: 404 });
    if (team.adminId !== currentUser.id) return new NextResponse("Forbidden: Only the admin can add members", { status: 403 });

    // Add the user to the team as a member
    const addedMember = await prismadb.teamMembers.create({
      data: {
        teamId: team.id,
        userId,
        role: role || "MEMBER",  // Default role is MEMBER if not provided
      },
    });

    return NextResponse.json(addedMember);
  } catch (error) {
    console.log("[ADD_TEAM_MEMBER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
