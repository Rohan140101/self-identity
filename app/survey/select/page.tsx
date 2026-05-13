"use client"
import Link from "next/link";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import React from "react"
import { Zap, BookOpen, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation";

export default function SurveySelection() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/**Importing Header */}
            <Header />
            <main className="min-h-screen w-full bg-[#050505] py-20 px-[5vw] flex flex-col items-center justify-center">

                <div className="text-center mb-16 order-first">
                    <h2 className="text-[clamp(2rem,5vw,4rem)] font-black text-white mb-4 tracking-tighter">
                        Discover Your Identity
                    </h2>
                    <div className="h-1 w-24 bg-linear-to-r from-blue-500 to-gold-500 mx-auto rounded-full"></div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl items-stretch">
                    <div className="group relative flex-1 p-px rounded-3xl overflow-hidden transtion-all duration-500 hover:scale-[1.02]">
                        <div className="absolute inset-0 bg-linear-to-b from-blue-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative h-full bg-[#0a0a0a]/90 backdrop-blur-xl p-8 rounded-[23px] flex flex-col border border-white/5">
                            <div className="mb-6 w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <Zap size={28} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">
                                Quick Test
                            </h3>
                            <p className="text-slate-400 mb-8 grow">
                                3 minutes
                            </p>

                            <button
                            onClick={() => router.push("/survey/short_survey")} 
                            className="w-full py-4 bg-(--brand-hover) hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                                Start Quick Version <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="group relative flex-1 p-px rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02]">
                        <div className="absolute inset-0 bg-linear-to-b from-amber-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative h-full bg-[#0a0a0a]/90 backdrop-blur-xl p-8 rounded-[23px] flex flex-col border border-white/5">
                            <div className="mb-6 w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                                <BookOpen size={28} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">
                                Full Research Instrument
                            </h3>
                            <p className="text-slate-400 mb-8 grow">
                                15 minutes
                            </p>

                            <button onClick={() => router.push("/survey/full_survey")}  
                            className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(217,119,6,0.4)]">
                                Start Long Version <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>






                </div>


                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-(--brand-hover)/10 blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-600/10 blur-[120px] pointer-events-none"></div>


                {/*                 
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50">
                    <h1 className="text-3xl font-bold text-(--brand-dark) mb-8">
                        Choose Your Journey
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                        <Link className="group" href="/survey?type=short">
                            <div className="p-8 bg-white border-2 border-transparent hover:border-(--brand-dark) rounded-2xl shadow-sm transition-all text-center cursor-pointer h-full">
                                <h2 className="text-xl font-bold mb-2">
                                    Short Version
                                </h2>
                                <p className="text-gray-500 mb-4">
                                    3 minutes
                                </p>
                                <span className="text-(--brand-dark) font-semibold group-hover:underline">
                                    Start Test
                                </span>
                            </div>
                        </Link>

                        <Link className="group" href="/survey?type=long">
                            <div className="p-8 bg-white border-2 border-transparent hover:border-(--brand-dark) rounded-2xl shadow-sm transition-all text-center cursor-pointer h-full">
                                <h2 className="text-xl font-bold mb-2">
                                    Long Version
                                </h2>
                                <p className="text-gray-500 mb-4">
                                    15 minutes
                                </p>
                                <span className="text-(--brand-dark) font-semibold group-hover:underline">
                                    Start Test
                                </span>
                            </div>
                        </Link>
                    </div>
                </div> */}
            </main>

            {/**Importing Footer*/}
            <Footer />
        </div>
    )
}