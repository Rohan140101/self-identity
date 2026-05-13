"use client";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import React from 'react';
import { ArrowLeft, Play, Timer, ShieldCheck } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Reveal } from "@/app/components/Reveal";

// Full Survey Intro Component
const FullSurveyIntro = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/**Importing Header */}
            <Header />
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start sm:justify-center px-[5vw]  py-12 font-sans relative overflow-hidden">
                <Reveal delay={0.2}>
                    <div className="w-[90vw] md:w-[60vw] lg:w-[45vw] max-w-187.5 min-w-[320px] bg-white rounded-4xl md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 text-center relative z-10 transition-all duration-500">

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-(--brand-hover) rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-6 md:mb-10">
                            <Timer size={14} /> 15 Minutes
                        </div>

                        <h1 className="text-[clamp(1.75rem,4vw,3rem)] font-black text-slate-900 mb-6 md:mb-8 tracking-tight leading-[1.1]">
                            Full Research Instrument
                        </h1>

                        <div className="space-y-4 md:space-y-6 text-slate-500 leading-relaxed mb-10 md:mb-14 text-base md:text-xl px-2 md:px-6">
                            <p>Our survey asks you to go through 20 different categories where you answer different questions and rate how important that category is to you.</p>

                            <p className="font-medium text-slate-800">We then hone in on the five most important facets of your personal identity, and tell you what this means for your happiness and well-being.</p>
                        </div>

                        <button
                            onClick={() => router.push("/survey?type=long")}
                            className="w-full py-4 md:py-6 bg-(--brand-hover) hover:bg-blue-700 text-white rounded-2xl md:rounded-3xl font-black text-lg md:text-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200 active:scale-[0.98]"
                        >
                            Ready to Start? <Play size={20} fill="currentColor" />
                        </button>
                    </div>

                </Reveal>

            </div>
            <Reveal delay={1}>
                {/**Importing Footer*/}
            <Footer />
            </Reveal>

        </div>



    );
};

export default FullSurveyIntro;