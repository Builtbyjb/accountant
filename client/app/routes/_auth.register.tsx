import { useState } from "react";
import { useActionData, Link, Form } from '@remix-run/react';
import type { ActionFunctionArgs } from "@remix-run/node";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { redirect } from "@remix-run/node";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
// import api from "~/lib/api";
import { Navigate } from "react-router";
import AccountSetup from "~/components/AccountSetup";

const formSchema = z
    .object({
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
        terms: z.boolean().refine((value) => value === true, {
            message: "You must agree to the terms and conditions.",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export async function action({ request }: ActionFunctionArgs) {

    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log({ data })

    // zod validate data
    const result = formSchema.safeParse(data);
    console.log(result)

    if (!result.success) {
        console.log("error")
        return false;
    }
    return redirect('/')
}

export default function Register() {
    const actionData = useActionData();
    // console.log(actionData)

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <div className="container mx-auto flex h-screen flex-col mt-32 sm:max-w-md">
            <div className="w-full space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Create an Account</h1>
                    <p className="text-sm text-red-500 dark:text-red-400">
                        {errorMessage}
                    </p>
                </div>
                <Form method="POST" className="space-y-4">
                    <div>
                        <Label htmlFor="firstname">First name</Label>
                        <Input placeholder="Enter your first name"
                            name="firstname"
                            type="text"
                        />
                    </div>
                    <div>
                        <Label htmlFor="lastname">Last name</Label>
                        <Input placeholder="Enter your last name"
                            name="lastname"
                            type="text"
                        />
                    </div>
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
                            placeholder="Create a password"
                            type="password"
                            name="password"
                        />
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            placeholder="Confirm your password"
                            type="password"
                            name="confirmPassword"
                        />
                    </div>
                    <div className="flex flex-row items-start space-x-3 space-y-0">
                        <Checkbox
                            // checked={field.value}
                            // onCheckedChange={field.onChange}
                            name="terms"
                        />
                        <div className="space-y-1 leading-none">
                            <Label htmlFor="terms">I agree to the terms and conditions</Label>
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
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                </Form>
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