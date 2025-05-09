import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prismadb from "@/lib/prismadb";

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Registers a new user with name, username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: Vicky
 *               username:
 *                 type: string
 *                 description: Username of the user
 *                 example: Vicky123
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user
 *                 example: kmhtwe1999@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the account
 *                 example: Kmh3151999?
 *     responses:
 *       200:
 *         description: Successfully registered the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       422:
 *         description: Email already exists
 *       500:
 *         description: Internal Server Error
 */

export async function POST(req) {
  try {
    const { name, email, username, password } = await req.json();

    // Validate input
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!username) return new NextResponse("Username is required", { status: 400 });
    if (!email) return new NextResponse("Email is required", { status: 400 });
    if (!password) return new NextResponse("Password is required", { status: 400 });

    const existingUser = await prismadb.user.findUnique({ where: { email } });

    if (existingUser) {
      return new NextResponse("Email already exists!", { status: 422 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        name,
        email,
        username,
        hashedPassword,
      },
    });

    await prismadb.dashboardStats.create({
      data: {
        userId: user.id,
        totalTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        completionRate: 0.0,
        activeProjects: 0,
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("[USER_REGISTER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
