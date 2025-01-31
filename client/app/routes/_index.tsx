import LandingPage from "~/components/LandingPage";
import { AppLayout } from "~/components/layouts/AppLayout";
import { AuthLayout } from "~/components/layouts/AuthLayout";
import type { MetaFunction } from "@remix-run/node";
import { useState, useRef, useEffect } from 'react'
import { useActionData, useFetcher } from '@remix-run/react';
import type { ActionFunctionArgs } from "@remix-run/node";
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Send, Loader } from 'lucide-react'
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

type ActionResponse = Response & {
	success?: string;
	errors?: Errors;
	info?: string;
	error?: string;
}

const formSchema = z.object({
	transaction: z.string().min(20, {
		message: "Transaction must be at least 20 characters long.",
	}),
})

type ActionInput = z.TypeOf<typeof formSchema>

export async function action(
	{ request }: ActionFunctionArgs
): Promise<ActionResponse | undefined> {

	const formData = await request.formData()
	const jsonData = Object.fromEntries(formData);

	try {
		const response = await fetch('http://server:3000/api/v0/transaction', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(jsonData),
		});

		const data = await response.json()

		if (response.status === 200) {
			return Response.json(data);
		} else {
			return Response.json({ error: "Recording transaction failed" })

		}
	} catch (error) {
		console.log(error)
		return Response.json({ error: "Internal server error, we are resolving the issue" })
	}
}

export function IndexPage() {
	const [input, setInput] = useState('')
	const [isLoading, setIsLoading] = useState(false);
	const [transactionInputError, setTransactionInputError] = useState<string | undefined>("");
	const [message, setMessage] = useState<any>("");
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const formRef = useRef<HTMLFormElement>(null)
	const fetcher = useFetcher<ActionResponse>()
	const maxLength = 200

	// Dynamically change text area height 
	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(e.target.value)
		setTransactionInputError("")

		setMessage(""); // Clear message field when user edit input field

		adjustTextareaHeight()
	}

	const adjustTextareaHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			const scrollHeight = textareaRef.current.scrollHeight
			textareaRef.current.style.height = `${Math.max(scrollHeight, 72)}px`
		}
	}

	const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		setIsLoading(true)
		setMessage("") // clear message field before a new request
		if (formRef.current) {
			const formData = new FormData(formRef.current)
			const { errors } = await validateData<ActionInput>(
				{ formData, formSchema }
			)

			if (errors === null) {
				fetcher.submit(formData, { method: "POST" })
			} else {
				setIsLoading(false)
				setTransactionInputError(errors?.transaction)
			}
		}
	}

	useEffect(() => {
		adjustTextareaHeight()

		if (fetcher.data) {
			setIsLoading(false)
			setMessage(fetcher.data)
		}
	}, [fetcher.data])

	const displayInfo = () => {
		const elements = [];
		if (message.info) {
			for (let i = 0; i < message.info.length; i++) {
				elements.push(
					<li key={i}>
						{message.info[i]}
					</li>
				);
			}

		}
		return elements;
	}

	return (
		<div className="items-center justify-center flex h-full">
			<div className="w-full max-w-2xl">
				<h1 className="text-2xl font-semibold text-gray-100 mb-6">Record a transaction</h1>
				{message.error ? (
					<p className="text-sm text-red-500 dark:text-red-400">
						{message.error}
					</p>
				) : null}
				{message.success ? (
					<p className="text-sm text-green-500 dark:text-green-400">
						{message.success}
					</p>
				) : null}
				{message.info ? (
					<ul className="text-sm text-gray-500 dark:text-gray-400">
						{displayInfo()}
					</ul>
				)
					: null}
				<fetcher.Form ref={formRef} className="space-y-4">
					<Textarea
						id="transaction"
						name="transaction"
						ref={textareaRef}
						value={input}
						onChange={handleInput}
						placeholder="Type your transaction here..."
						className="mb-2 mt-2 w-full min-h-[6rem] p-4 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out placeholder-gray-400 resize-none overflow-hidden"
						maxLength={maxLength}
					/>
					<label htmlFor="transaction" className="text-sm text-gray-400">
						Please provide as many details as possible about the transaction.
					</label>
					<p className="text-sm text-red-500 dark:text-red-400">
						{transactionInputError ? transactionInputError : null}
					</p>
					<div className="flex justify-between">
						<Button type="submit"
							className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200 ease-in-out transform hover:scale-105"
							disabled={input.trim().length === 0}
							onClick={handleSubmit}
						>
							{isLoading ? (
								<>
									<span>Submitting</span>
									<Loader className="w-4 h-4" />
								</>

							) : (
								<>
									<span>Submit</span>
									<Send className="w-4 h-4" />
								</>
							)}
						</Button>
						<span className="bottom-2 right-2 text-sm text-gray-400">
							{input.length}/{maxLength}
						</span>
					</div>
				</fetcher.Form>
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