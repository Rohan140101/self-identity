"use client";
import Header from "../components/header"
import Footer from "../components/footer"
import { platform } from "os"
import { url } from "inspector"
import { ExternalLink, Twitter, Mail } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Reveal } from "../components/Reveal";
export default function ContactPage() {
    const name = "Steven Skiena"
    const department = "Dept. of Computer Science"
    const university = "Stony Brook University"
    const personalWebsite = "https://www.cs.stonybrook.edu/~skiena"
    const pincode = "Stony Brook, NY, 11794-2424"
    const nameLink = "https://www.cs.stonybrook.edu/~skiena"
    const departmentLink = "https://www.cs.stonybrook.edu/"
    const universityLink = "https://www.stonybrook.edu/"
    const twitterUrl = "https://twitter.com/StevenSkiena"
    const mailUrl = "mailto:skiena@cs.stonybrook.edu"
    const router = useRouter()

    const links = [
        { "name": "Twitter", "icon": Twitter, url: "https://twitter.com/StevenSkiena" },
        { "name": "Email", "icon": Mail, url: "mailto:skiena@cs.stonybrook.edu" }
    ]
    return (

        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />

            <main className="grow flex flex-col items-center bg-slate-50/50 py-5 sm:py-10 px-4 sm:px-6">
                <div className="w-full max-w-5xl mx-auto py-5 sm:py-10">
                    <Reveal delay={0.2}>
                        <div className="mb-6 sm:mb-12 text-center">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2 sm:mb-4">
                                Contact Us
                            </h1>
                        </div>
                    </Reveal>



                    <div className="bg-whiterelative overflow-hidden">
                        <Reveal delay={0.4}>
                            <div className="grid grid-cols-1 sm:grid-cols-6 items-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">

                                <div className="p-4 md:p-12 space-y-6 text-center sm:col-span-3">
                                    <div className="space-y-1 text-left">

                                        <h1 className="text-xl md:text-xl font-medium text-slate-900 tracking-tight hover:text-blue-600 transition-all duration-200">
                                            <a href={nameLink} target="_blank">{name}</a>


                                        </h1>
                                        <div className="space-y-1">
                                            <p>
                                                <a href={departmentLink} target="_blank" className="text-slate-900 text-xl font-medium hover:text-blue-600 transition-all duration-100">{department}</a>
                                            </p>
                                            <p>
                                                <a href={universityLink} target="_blank" className="text-slate-900 text-xl font-medium hover:text-blue-600 transition-all duration-100">{university}</a>

                                            </p>

                                            <p className="text-slate-900 font-medium text-xl">{pincode}</p>
                                        </div>
                                    </div>

                                    {/* <div className="w-12 h-1 bg-blue-500/20 mx-auto rounded-full "></div> */}


                                </div>


                                <div className="p-4 md:p-12 bg-slate-50/50 sm:col-span-3 h-full flex flex-col justify-top items-center text-center">
                                    <div className="flex flex-col items-left gap-1">
                                        <a href={personalWebsite}
                                            target="_blank"
                                            className="text-m md:text-lg font-bold text-blue-900 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                                        >
                                            {personalWebsite}
                                            {/* <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> */}
                                        </a>

                                        <a href={twitterUrl}
                                            target="_blank"
                                            className="text-m md:text-lg font-bold text-blue-900 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                                        >
                                            {twitterUrl}
                                            {/* <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> */}
                                        </a>

                                        <a href={mailUrl}
                                            target="_blank"
                                            className="text-m md:text-lg font-bold text-blue-900 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                                        >
                                            Email:skiena@cs.stonybrook.edu
                                            {/* <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> */}
                                        </a>




                                    </div>

                                </div>


                            </div>

                        </Reveal>

                        <Reveal delay={0.6}>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-200 bg-slate-100 px-8 py-4 md:px-12 rounded-[2.5rem]">

                                <div className="text-center md:text-left space-y-1 ">
                                    {/* <h3 className="text-xl font-medium text-slate-900 tracking-tight hover:text-blue-600 transition-all duration-200 cursor-pointer">
                                    Stay Updated
                                </h3> */}
                                    <p className="text-slate-900 text-sm md:text-xl font-medium leading-tight max-w-md">
                                        Subscribe to receive updates on research, publications, and news.
                                    </p>
                                </div>

                                <div className="shrink-0">
                                    <a href="/subscribe"
                                        className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-blue-900/10 active:scale-95 w-full sm:w-auto"
                                    >
                                        <Mail size={18} />
                                        Join Mailing List
                                    </a>
                                </div>
                            </div>
                        </Reveal>



                    </div>



                </div>
            </main>
            <Reveal delay={1.2}>
                <Footer />

            </Reveal>

        </div>
    )

}

