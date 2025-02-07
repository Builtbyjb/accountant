import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionData, Link, Form } from '@remix-run/react';
import type { ActionFunctionArgs } from "@remix-run/node";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import api from "~/lib/api";
import { Navigate } from "react-router";
import { validateData } from "~/lib/utils";
import { redirect } from "@remix-run/node";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long.",
    }),
    rememberMe: z.boolean().default(false).optional(),
});

type ActionInput = z.TypeOf<typeof formSchema>

export async function action({ request }: ActionFunctionArgs): Promise<Response | undefined> {

    const { formData, errors } = await validateData<ActionInput>({ request, formSchema })

    if (errors === null) {
        const response = await fetch('http://127.0.0.1:3000/api/v0/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.status === 200) {
            return redirect("/accountSetup");
        } else {
            return Response.json({ error: "User registration failed" })

        }

    } else {
        return Response.json({ errors })
    }
}

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <div className="container mx-auto flex h-screen flex-col mt-32 sm:max-w-md">
            <div className="w-full space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Login</h1>
                    <p className="text-sm text-red-500 dark:text-red-400">
                        {errorMessage}
                    </p>
                </div>
                <Form method="POST" className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            placeholder="Enter your email"
                            type="email"
                            name="email"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            placeholder="Enter your password"
                            type="password"
                            name="password"
                        />
                    </div>
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                        <Checkbox
                            // checked={field.value}
                            // onCheckedChange={field.onChange}
                            name="rememberMe"
                        />
                        <div className="space-y-1 leading-none">
                            <Label htmlFor="rememberMe">Remember me</Label>
                            <p className="text-sm text-gray-300">
                                Stay logged in for 30 days
                            </p>
                        </div>
                    </div>
                    <Button type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200 ease-in-out transform hover:scale-105"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </Form>
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/register"
                        className="font-medium text-primary hover:underline"
                    >
                        Register here
                    </Link>
                </div>
            </div>
        </div >
    );
}