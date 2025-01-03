import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    // FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
// import api from "~/lib/api";
import { Navigate } from "react-router";

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
        // terms: z.boolean().refine((value) => value === true, {
        //   message: "You must agree to the terms and conditions.",
        // }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            confirmPassword: "",
            // terms: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        // Clear out any previous tokens, if any
        // localStorage.removeItem("ACCESS_TOKEN");
        // localStorage.removeItem("REFRESH_TOKEN");

        // try {
        //     const response = await api.post("/api/v0/register", values);

        //     if (response.status === 201) {
        //         localStorage.setItem("ACCESS_TOKEN", response.data.access);
        //         localStorage.setItem("REFRESH_TOKEN", response.data.refresh);
        //         window.location.assign("/");
        //     } else {
        //         setErrorMessage(response.data.error);
        //         setIsLoading(false);
        //         console.error(response);
        //     }
        // } catch (error) {
        //     setIsLoading(false);
        //     console.log(error);
        // }
    }

    // const token = localStorage.getItem("ACCESS_TOKEN");

    // if (token) {
    //     return <Navigate to="/" />;
    // }

    return (
        <div className="container mx-auto flex h-screen flex-col mt-32 sm:max-w-md">
            <div className="w-full space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Create an Account</h1>
                    {/* <p className="text-gray-500 dark:text-gray-400">
            Enter your information to create an account
          </p> */}
                    <p className="text-sm text-red-500 dark:text-red-400">
                        {errorMessage}
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            type="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Create a password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Confirm your password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I agree to the terms and conditions</FormLabel>
                    <FormDescription>
                      By checking this box, you agree to our{" "}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </a>
                      .
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            /> */}
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200 ease-in-out transform hover:scale-105"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                    </form>
                </Form>
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="font-medium text-primary hover:underline">
                        Login here
                    </a>
                </div>
            </div>
        </div>
    );
}