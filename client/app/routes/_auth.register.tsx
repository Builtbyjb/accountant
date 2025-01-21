import type { MetaFunction } from "@remix-run/node";
import { useState, useRef, useEffect } from "react";
import { Link, useFetcher } from '@remix-run/react';
import type { ActionFunctionArgs } from "@remix-run/node";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
// import api from "~/lib/api";
import { useNavigate } from "react-router";
import { validateData } from "~/lib/utils";

export const meta: MetaFunction = () => {
    return [
        { title: "Register" },
        { name: "description", content: "User registration page" },
    ];
};

type ActionInput = z.TypeOf<typeof formSchema>

type Errors = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
    terms: string;
}

type ActionResponse = Response & {
    errors?: Errors;
    error?: string;
    success?: string;
}

const formSchema = z.object({
    firstname: z.string().min(2, {
        message: "First name must be at least 2 characters long.",
    }),
    lastname: z.string().min(2, {
        message: "Last name must be at least 2 characters long.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters long.",
    }),
    confirmPassword: z.string(),
    terms: z.literal("on", {
        errorMap: () => ({
            message: "You must agree to the terms and conditions."
        }),
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});


export async function action(
    { request }: ActionFunctionArgs
): Promise<ActionResponse | undefined> {
    const { formData, errors } = await validateData<ActionInput>(
        { request, formSchema }
    )
    if (errors === null) {
        try {
            const response = await fetch('http://127.0.0.1:3000/auth/v0/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.status === 200) {
                return Response.json({ success: "User registered" })
            } else {
                return Response.json({ error: "User registration failed" })
            }
        } catch (error) {
            return Response.json(
                { error: "Server error, the issue is being fixed" }
            )
        }
    } else {
        return Response.json({ errors })
    }
}

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const fetcher = useFetcher<ActionResponse>()
    const ref = useRef<HTMLFormElement>(null)
    const navigate = useNavigate();

    useEffect(() => {
        if (fetcher.data?.success) {
            setIsLoading(false)
            navigate("/accountSetup")
        } else if (fetcher.data?.error) {
            setIsLoading(false)
            setErrorMessage(fetcher.data.error)
        }
    }, [fetcher.data, navigate])

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setIsLoading(true)
        if (ref.current) {
            const formData = new FormData(ref.current)
            fetcher.submit(formData, { method: "POST", action: "/register" })
        }
    }

    return (
        <div className="container mx-auto flex h-screen flex-col mt-32 sm:max-w-md">
            <div className="w-full space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Create an Account</h1>
                    <p className="text-sm text-red-500 dark:text-red-400">
                        {errorMessage}
                    </p>
                </div>
                <fetcher.Form ref={ref} className="space-y-4">
                    <div>
                        <Label htmlFor="firstname">First name</Label>
                        <Input placeholder="Enter your first name"
                            name="firstname"
                            type="text"
                        />
                        <p className="text-sm text-red-500 dark:text-red-400">
                            {fetcher.data?.errors?.firstname}
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="lastname">Last name</Label>
                        <Input placeholder="Enter your last name"
                            name="lastname"
                            type="text"
                        />
                        <p className="text-sm text-red-500 dark:text-red-400">
                            {fetcher.data?.errors?.lastname}
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            placeholder="Enter your email"
                            type="email"
                            name="email"
                        />
                        <p className="text-sm text-red-500 dark:text-red-400">
                            {fetcher.data?.errors?.email}
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            placeholder="Create a password"
                            type="password"
                            name="password"
                        />
                        <p className="text-sm text-red-500 dark:text-red-400">
                            {fetcher.data?.errors?.password}
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            placeholder="Confirm your password"
                            type="password"
                            name="confirmPassword"
                        />
                        <p className="text-sm text-red-500 dark:text-red-400">
                            {fetcher.data?.errors?.confirmPassword}
                        </p>
                    </div>
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                        <Checkbox
                            // checked={field.value}
                            // onCheckedChange={field.onChange}
                            name="terms"
                        />
                        <div className="space-y-1 leading-none">
                            <Label htmlFor="terms">I agree to the terms and conditions</Label>
                            <p className="text-sm text-red-500 dark:text-red-400">
                                {fetcher.data?.errors?.terms}
                            </p>
                            <div className="text-sm text-gray-400">
                                By checking this box, you agree to our{" "}
                                <Link to="/terms" className="text-primary hover:underline">
                                    Terms of Service
                                </Link>
                                {" "} and{" "}
                                <Link to="/privacy" className="text-primary hover:underline">
                                    Privacy Policy
                                </Link>
                                .
                            </div>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200 ease-in-out transform hover:scale-105"
                        disabled={isLoading}
                        onClick={handleSubmit}
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                </fetcher.Form>
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Login here
                    </Link>
                </div>
            </div>
        </div >
    );
}