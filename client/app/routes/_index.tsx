import LandingPage from "~/components/LandingPage";
import { AppLayout } from "~/components/layouts/AppLayout";
import { AuthLayout } from "~/components/layouts/AuthLayout";
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

type Errors = {
	transaction: string;
}

// Maybe add an info field
type ActionResponse = Response & {
	success?: string;
	errors?: Errors;
	error?: string;
}

const formSchema = z.object({
	transaction: z.string().min(10, {
		message: "Transaction must be at least 10 characters long.",
	}),
})

type ActionInput = z.TypeOf<typeof formSchema>

export async function action(
	{ request }: ActionFunctionArgs
): Promise<ActionResponse | undefined> {

	const { formData, errors } = await validateData<ActionInput>(
		{ request, formSchema }
	)

	if (errors === null) {
		try {
			const response = await fetch('http://127.0.0.1:3000/api/v0/transaction', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json()

			if (response.status === 200) {
				return Response.json(data);
			} else {
				return Response.json({ error: "Recording transaction failed" })

			}
		} catch (error) {
			return Response.json({ error: "Internal server error, we are resolving the issue" })
		}
	} else {
		return Response.json({ errors })
	}
}

export function IndexPage() {
	const action = useActionData<ActionResponse | undefined>();
	const [input, setInput] = useState('')
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const maxLength = 200

	// TODO: why does the app resend the request on each key stroke
	// TODO: change the record transaction input field placeholder
	// TODO: Better handling of response messages
	// TODO: Journal entry page
	// Record button: Loading

	if (action?.success) {
		console.log(action.success)
	} else if (action?.error) {
		console.log(action.error)
	}

	// Dynamically change text area height 
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
				<Form method="POST" className="space-y-4">
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
					<label htmlFor="transaction"
						className="text-sm text-gray-400 mt-4"
					>
						Please provide as many details as possible about the transaction.
					</label>
					<p className="text-sm text-red-500 dark:text-red-400">
						{action?.errors?.transaction}
					</p>
					<div className="flex justify-between">
						<Button type="submit"
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
				</Form>
			</div>
		</div>
	)
}
export default function Index() {
	const isAuth = true;
	return (
		<>
			{isAuth ?
				(
					<AppLayout>
						<IndexPage />
					</AppLayout>
				)
				:
				(
					<AuthLayout >
						< LandingPage />
					</AuthLayout>
				)
			}
		</>
	)
}