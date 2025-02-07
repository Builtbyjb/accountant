// For unauthenticated users

import { useState } from 'react'
import { useLocation } from '@remix-run/react';
import { Menu } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'

const navItems = [
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
]

export default function NaviTopbar() {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <a href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold">Accountant</span>
                        </a>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentPath === item.href
                                        ? 'border-indigo-500 text-gray-300'
                                        : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                        <Button variant="outline" asChild>
                            <a href="/register">Register</a>
                        </Button>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200 ease-in-out transform hover:scale-105"
                            asChild>
                            <a href="/login">Login</a>
                        </Button>
                    </div>
                    <div className="flex items-center sm:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                    <span className="sr-only">Open main menu</span>
                                    <Menu className="h-6 w-6" aria-hidden="true" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[240px] sm:hidden">
                                <div className="pt-2 pb-3 space-y-1">
                                    {navItems.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${currentPath === item.href
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                                : 'border-transparent text-gray-500'
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                                <div className="pt-4 pb-3 border-t border-gray-200">
                                    <div className="space-y-1">
                                        <a
                                            href="/register"
                                            className="block px-4 py-2 text-base font-medium text-gray-500"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Register
                                        </a>
                                        <a
                                            href="/login"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200 ease-in-out transform hover:scale-105"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Login
                                        </a>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

