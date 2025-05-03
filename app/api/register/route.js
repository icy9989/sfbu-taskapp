import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prismadb from '@/lib/prismadb';

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Authentication]
 *     description: Registers a new user with a name, email, and password. If the email already exists, it returns a conflict error.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the user.
 *                 example: "Vicky"
 *              username:
 *                 type: string
 *                 description: username of the user.
 *                 example: "Vicky123"
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: "kmhtwe1999@gmail.com"
 *               password:
 *                 type: string
 *                 description: Password for the user account.
 *                 example: "Kmh3151999?"
 *     responses:
 *       200:
 *         description: Successfully registered the user and created the associated dashboard stats.
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
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                   example: "Vicky123"
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                   example: "kmhtwe1999@gmail.com"
 *       400:
 *         description: Bad request if any of the required fields are missing or if input validation fails.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name is required"
 *       422:
 *         description: Conflict if the email already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already exists!"
 *       500:
 *         description: Internal server error if there's an issue with the registration.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

export async function POST(req) { 
    try {
        const { name, email, username, password } = await req.json();   
        
        // Validate input fields
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!username) {
            return new NextResponse("Usermame is required", { status: 400 });
        }

        if (!email) {
            return new NextResponse("Email is required", { status: 400 }); // Corrected error message from "Username is required"
        }

        if (!password) {
            return new NextResponse("Password is required", { status: 400 });
        }

        // Check if the user already exists
        const existingUser = await prismadb.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return new NextResponse("Email already exists!", { status: 422 }); // Changed from "Username already existed!"
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the user in the database
        const user = await prismadb.user.create({
            data: {
                name,
                email,
                username,
                hashedPassword
            }
        });

        // Create DashboardStats for the new user
        await prismadb.dashboardStats.create({
            data: {
                userId: user.id, // Linking the stats to the newly created user
                totalTasks: 0,   // You can set default values here
                completedTasks: 0,
                overdueTasks: 0,
                completionRate: 0.0,
                activeProjects: 0,
            }
        });

        // Return the created user along with status 200
        return NextResponse.json(user);
        
    } catch (error) {
        console.log("[USER_REGISTER]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
