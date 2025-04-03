import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prismadb from '@/lib/prismadb';

/**
 * @swagger
 * /api/register:
 *   post:
 *     description: Registers a new user with a name, email, and password.
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
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email address of the user.
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: Password for the user account.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully registered the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique identifier for the user.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: The full name of the user.
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                   example: john.doe@example.com
 *       400:
 *         description: Bad request if any of the required fields are missing.
 *       422:
 *         description: Conflict if the email already exists.
 *       500:
 *         description: Internal server error.
 */

export async function POST(req) { 
    try {
        const { name, email, password } = await req.json();   
        
        // Validate input fields
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
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
