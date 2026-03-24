"use client";
import Header from "../components/header"
import Footer from "../components/footer"
import { platform } from "os"
import { url } from "inspector"
import { CircleUser, Twitter, Mail } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function ContactPage() {
    const name = "Steven Skiena"
    const department = "Dept. of Computer Science"
    const university = "Stony Brook University"
    const pincode = "NY, 11794-2424"
    const router = useRouter()

    const links = [
        { "name": "Twitter", "icon": Twitter, url: "https://twitter.com/StevenSkiena" },
        { "name": "Email", "icon": Mail, url: "mailto:skiena@cs.stonybrook.edu" }
    ]
    return (

        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <main className="grow flex items-center justify-center bg-slate-50/50 py-10 px-6">
                <div className="max-w-xl w-full">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Contact Us
                        </h1>
                        {/* <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div> */}
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-7 md:p-10 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">

                        {/* <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 via-indigo-600 to-purple-500"></div> */}

                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                {name}
                            </h1>

                            <div className="space-y-1">
                                <p className="text-slate-500 text-base leading-relaxed max-w-sm mx-auto ">
                                    {department}
                                </p>
                                <p className="text-slate-500 text-base leading-relaxed max-w-sm mx-auto">
                                    {university}
                                </p>
                                <p className="text-slate-500 text-base leading-relaxed max-w-sm mx-auto">
                                    {pincode}
                                </p>
                            </div>

                            <div className="w-12 h-1 bg-slate-200 mx-auto my-6 rounded-full"></div>

                            <a href="https://www.cs.stonybrook.edu/~skiena" target="_blank" className="font-medium text-slate-900 underline hover:text-blue-600 transition-all">Personal Website</a>


                            <div className="flex flex-wrap justify-center gap-4 pt-4">
                                {links.map((linkData) => (
                                    <a
                                        href={linkData.url}
                                        key={linkData.name}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-md active:scale-95"
                                    >
                                        <linkData.icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="w-12 h-1 bg-slate-200 mx-auto my-6 rounded-full"></div>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                                    Stay Updated
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                                    Subscribe to receive updates on research, publications, and news.
                                </p>
                            </div>


                            <a href="/subscribe"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-md shadow-blue-200 active:scale-95"
                            >
                                <Mail size={16} />
                                Subscribe to Mailing List
                            </a>
                        </div>
                    </div>



                </div>
            </main>
            <Footer />
        </div>
    )

}

