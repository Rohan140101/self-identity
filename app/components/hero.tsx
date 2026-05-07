"use client";

import woman from "../../images/woman.png"
import man from "../../images/man.png"
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react"


const Hero = function () {
    const router = useRouter();
    return (


        <section className="max-h-[90vh] sm:min-h-[40vh] sm:max-h-[90vh] w-full bg-(--brand-dark) flex items-center justify-center px-[5vw] py-6 sm:py-12">
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-400 gap-8">
                <div className="hidden md:block w-[30vw] max-w-120 p-4 rounded-xl  border border-slate-800 bg-slate-900/50 transition-transform duration-500 hover:scale-105">
                    <img src={woman.src} alt="Woman" className="w-full h-auto drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]" />
                </div>

                <div className="order-first md:order-0 flex-1 text-center z-10">
                    <h1 className="font-black leading-tight text-white text-[clamp(2rem,6vw,5rem)] mb-4">
                        Who are You?
                    </h1>
                    <h3 className="text-slate-400 font-medium text-[clamp(1rem,2vw,1.75rem)] tracking-wide">
                        The Science of Self-Identity
                    </h3>
                    <button
                        onClick={() => router.push("/survey/short_survey")}
                        className="w-fit mx-auto mt-10 bg-linear-to-r from-yellow-500 to-yellow-600 text-slate-950 text-lg font-bold px-10 py-4 rounded-lg tracking-widest transition-all hover:brightness-110 hover:scale-105 shadow-[0_0_20px_rgba(234,179,8,0.3)] flex items-center justify-center gap-3"                    >
                        DISCOVER WHO YOU ARE
                        <ArrowRight size={20} className="shrink-0" />
                    </button>

                </div>


                <div className="w-[30vw] max-w-120 p-4 rounded-xl  border border-slate-800 bg-slate-900/50 transition-transform duration-500 hover:scale-105">
                    <img src={man.src} alt="Man" className="w-full h-auto drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]" />
                </div>
            </div>
        </section>
    )
}

export default Hero;