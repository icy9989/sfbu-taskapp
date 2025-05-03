import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/teams/{id}/members:
 *   post:
 *     tags: [Teams]
 *     description: Adds a member to a team by username. Only the admin of the team can add members.
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
 *               username:
 *                 type: string
 *                 description: The username of the user to be added to the team.
 *                 example: "johndoe"
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
 *                 teamId:
 *                   type: string
 *                   description: The team ID.
 *                 userId:
 *                   type: string
 *                   description: The user ID.
 *                 role:
 *                   type: string
 *                   description: The user's role in the team.
 *       401:
 *         description: Unauthorized - user is not authenticated.
 *       403:
 *         description: Forbidden - only the admin can add members.
 *       404:
 *         description: User or team not found.
 *       500:
 *         description: Internal server error.
 */
export async function POST(req, { params }) {
  try {
    const { username, role } = await req.json();
    const { currentUser } = await serverAuth();

    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const team = await prismadb.team.findUnique({
      where: { id: params.id },
    });

    if (!team) {
      return new NextResponse("Team not found", { status: 404 });
    }

    if (team.adminId !== currentUser.id) {
      return new NextResponse("Forbidden: Only the admin can add members", { status: 403 });
    }

    const user = await prismadb.user.findUnique({
      where: { username },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const addedMember = await prismadb.teamMembers.create({
      data: {
        teamId: team.id,
        userId: user.id,
        role: role || "MEMBER",
      },
    });

    return NextResponse.json(addedMember);
  } catch (error) {
    console.error("[ADD_TEAM_MEMBER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
