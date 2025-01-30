import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import {z} from "zod";

const prisma = new PrismaClient();

const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(3),
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
){
    if (req.method !== "POST") {
        return res.status(StatusCodes.METHOD_NOT_ALLOWED)
        .json({ error: "Method not allowed" });
    }

    try {
        // Validate request body using Zod
        const validatedData = signUpSchema.parse(req.body);
    
        // Use validated data safely
        const { email, password, name } = validatedData;
    
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({ where: { email} });
    
        if (existingUser) {
          return res.status(StatusCodes.CONFLICT).json({ error: "Email already in use" });
        }
    
        // Hash the password (use bcrypt)
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create user in the database
        const newUser = await prisma.user.create({
          data: {
            email: email.toLowerCase(),
            name,
            password: hashedPassword,
          },
        });
    
        return res.status(StatusCodes.CREATED).json({ message: "User registered successfully", user: newUser });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(StatusCodes.BAD_REQUEST).json({ error: error.format() });
        }
        console.error("Signup error:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
      }
}