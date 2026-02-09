'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
): Promise<string | undefined> {
    try {
        await signIn('credentials', formData);
        return undefined;
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function register(
    prevState: string | undefined,
    formData: FormData,
): Promise<string | undefined> {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || password.length < 6) {
        return "Invalid input data.";
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return "User already exists.";
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER"
            },
        });

    } catch (error) {
        console.error("Registration error:", error);
        return "Failed to create user.";
    }

    redirect("/login");
}
