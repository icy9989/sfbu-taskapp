import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/teams/{id}/members:
 *   post:
 *     tags: [Teams]
 *     summary: Adds a member to a team by username
 *     description: Only the admin of the team can add members.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the team.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               role:
 *                 type: string
 *                 example: "MEMBER"
 *     responses:
 *       200:
 *         description: Successfully added the user.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User or team not found
 *       500:
 *         description: Internal server error
 *   get:
 *     tags: [Teams]
 *     summary: Fetch all members of a team
 *     description: Only the admin can view team members.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The team ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Members fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   teamId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   username:
 *                     type: string
 *                   role:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Team not found
 *       500:
 *         description: Internal server error
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

export async function GET(req, { params }) {
  try {
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
      return new NextResponse("Forbidden: Only the admin can view members", { status: 403 });
    }

    const teamMembers = await prismadb.teamMembers.findMany({
      where: { teamId: params.id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    const formattedMembers = teamMembers.map((member) => ({
      id: member.id,
      teamId: member.teamId,
      userId: member.userId,
      username: member.user.username,
      role: member.role,
    }));

    return NextResponse.json(formattedMembers);
  } catch (error) {
    console.error("[GET_TEAM_MEMBERS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
