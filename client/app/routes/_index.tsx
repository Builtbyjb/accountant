import type { MetaFunction } from "@remix-run/node";
import { useState, useRef, useEffect } from 'react'
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Send } from 'lucide-react'

export const meta: MetaFunction = () => {
  return [
    { title: "Home" },
    { name: "description", content: "Welcome to [business name]" },
  ];
};

export default function Index() {
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