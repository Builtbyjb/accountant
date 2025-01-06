import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { CheckCircle, ArrowRight } from 'lucide-react'

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="/placeholder.svg" alt="Logo" width="40" height="40" />
                        <span className="ml-2 text-xl font-bold text-gray-900">Accountant</span>
                    </div>
                    <nav>
                        <ul className="flex space-x-4">
                            <li><a href="#features" className="text-gray-600 hover:text-gray-900">Features</a></li>
                            <li><a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
                            <li><a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a></li>
                        </ul>
                    </nav>
                    <Button>Get Started</Button>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Streamline Your Workflow with SaaSCo</h1>
                            <p className="text-xl mb-6">Boost productivity and collaboration with our all-in-one platform.</p>
                            <div className="flex space-x-4">
                                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                                    Start Free Trial
                                </Button>
                                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600">
                                    Watch Demo
                                </Button>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <img src="/placeholder.svg" alt="Product Screenshot" width="600" height="400" className="rounded-lg shadow-xl" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Seamless Integration', description: 'Easily connect with your favorite tools and apps.' },
                                { title: 'Real-time Collaboration', description: 'Work together with your team in real-time, from anywhere.' },
                                { title: 'Advanced Analytics', description: 'Gain valuable insights with our powerful analytics dashboard.' },
                            ].map((feature, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                                    <CheckCircle className="w-12 h-12 text-purple-600 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: 'Basic', price: '$29', features: ['5 Users', '10 Projects', 'Basic Support'] },
                                { name: 'Pro', price: '$79', features: ['Unlimited Users', 'Unlimited Projects', 'Priority Support', 'Advanced Analytics'] },
                                { name: 'Enterprise', price: 'Custom', features: ['All Pro features', 'Dedicated Account Manager', 'Custom Integrations', 'SLA'] },
                            ].map((plan, index) => (
                                <div key={index} className="bg-white p-8 rounded-lg shadow-md flex flex-col">
                                    <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
                                    <p className="text-4xl font-bold mb-6">{plan.price}</p>
                                    <ul className="mb-8 flex-grow">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center mb-2">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button className="w-full">Choose Plan</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { name: 'John Doe', role: 'CEO, TechCorp', content: 'SaaSCo has revolutionized our workflow. It\'s an indispensable tool for our team.' },
                                { name: 'Jane Smith', role: 'Marketing Director, GrowthCo', content: 'The analytics features have given us invaluable insights into our operations.' },
                                { name: 'Mike Johnson', role: 'Project Manager, BuildIt', content: 'The collaboration tools are top-notch. It\'s like the platform was built for our needs.' },
                            ].map((testimonial, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                                    <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                                    <div className="flex items-center">
                                        <img src="/placeholder.svg" alt={testimonial.name} width="40" height="40" className="rounded-full mr-3" />
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-purple-600 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
                        <p className="text-xl mb-8">Join thousands of satisfied customers and transform your workflow today.</p>
                        <form className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Input type="email" placeholder="Enter your email" className="w-full sm:w-64 text-gray-900" />
                            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                                Start Free Trial
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Product</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-gray-300">Features</a></li>
                                <li><a href="#" className="hover:text-gray-300">Pricing</a></li>
                                <li><a href="#" className="hover:text-gray-300">Integrations</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-gray-300">About Us</a></li>
                                <li><a href="#" className="hover:text-gray-300">Careers</a></li>
                                <li><a href="#" className="hover:text-gray-300">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-gray-300">Blog</a></li>
                                <li><a href="#" className="hover:text-gray-300">Documentation</a></li>
                                <li><a href="#" className="hover:text-gray-300">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:text-gray-300">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-gray-300">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-gray-300">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center">
                        <p>&copy; 2023 SaaSCo. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

