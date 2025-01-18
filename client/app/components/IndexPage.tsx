import type { MetaFunction } from "@remix-run/node";
import { useState, useRef, useEffect } from 'react'
import { useActionData, Link, Form } from '@remix-run/react';
import type { ActionFunctionArgs } from "@remix-run/node";
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Send } from 'lucide-react'
import { Outlet, redirect } from "@remix-run/react";
import * as z from "zod";
import { validateData } from "~/lib/utils";

export const meta: MetaFunction = () => {
    return [
        { title: "Home" },
        { name: "description", content: "Welcome to [business name]" },
    ];
};

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

export default function IndexPage() {
    const [input, setInput] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const maxLength = 200

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle the submission logic here
        console.log('Submitted:', input)
        setInput('')
    }

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value)
        adjustTextareaHeight()
    }

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            const scrollHeight = textareaRef.current.scrollHeight
            textareaRef.current.style.height = `${Math.max(scrollHeight, 72)}px`
        }
    }

    useEffect(() => {
        adjustTextareaHeight()
    }, [])

    return (
        <div className="items-center justify-center flex h-full">
            <div className="w-full max-w-2xl">
                <h1 className="text-2xl font-semibold text-gray-100 mb-8">Record a transaction</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                        id="transaction"
                        name="transaction"
                        ref={textareaRef}
                        value={input}
                        onChange={handleInput}
                        placeholder="Type your question or request here..."
                        className="w-full min-h-[6rem] p-4 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out placeholder-gray-400 resize-none overflow-hidden"
                        maxLength={maxLength}
                    />
                    <label htmlFor="transaction" className="text-sm text-gray-400 mt-4">
                        Please provide as many details as possible about the transaction.
                    </label>
                    <div className="flex justify-between">
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200 ease-in-out transform hover:scale-105"
                            disabled={input.trim().length === 0}
                        >
                            <span>Submit</span>
                            <Send className="w-4 h-4" />
                        </Button>
                        <span className="bottom-2 right-2 text-sm text-gray-400">
                            {input.length}/{maxLength}
                        </span>
                    </div>
                </form>
            </div>
        </div>
    )
}