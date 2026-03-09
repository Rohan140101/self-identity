import Header from "../components/header"
import Footer from "../components/footer"
import { platform } from "os"
import { url } from "inspector"
export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="min-h-screen bg-white text-black">
                <div className="max-w-5xl mx-auto py-20 px-6">
                    <h1 className="text-5xl text-center font-bold mb-12 pb-4 text-(--brand-dark) ">
                        Contact
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

                        <div className="space-y-6">
                            <div>

                                <p className="text-2xl font-semibold text-(--brand-dark)">Steven Skiena</p>
                            </div>

                            <div>

                                <p className="text-lg text-slate-600">
                                    Department of Computer Science<br />
                                    Stony Brook University<br />
                                    Stony Brook, NY 11794
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">

                            <ul className="space-y-1">
                                <li>
                                    <a href="https://www.cs.stonybrook.edu/~skiena" className="text-lg text-(--brand-dark) hover:text-blue-600 flex items-center gap-2 transition-colors">
                                        www.cs.stonybrook.edu/~skiena
                                    </a>
                                </li>
                                <li>
                                    <a href="https://twitter.com/StevenSkiena" target="_blank" rel="noreferrer" className="text-lg text-(--brand-dark) hover:text-blue-600 flex items-center gap-2 transition-colors">
                                        https://twitter.com/StevenSkiena
                                    </a>
                                </li>
                                <li>
                                    <p className="text-lg text-(--brand-dark)">Email: skiena@cs.stonybrook.edu</p>
                                    
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )

}

