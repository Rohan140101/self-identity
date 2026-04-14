"use client";

import woman from "../../images/woman.png"
import man from "../../images/man.png"
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react"


const Hero = function () {
    const router = useRouter();
    return (
        // <section className="relative h-75 w-full bg-gray-400 flex flex-col items-center justify-center gap-4">
        //     <h1 className="text-5xl font-bold text-white md:text-7xl text-center px-4 tracking-tight py-8">
        //         Who are You?
        //     </h1>
        //     <h3 className="text-xg font-medium text-white md:text-2xl text-center px-4 opacity-90">
        //         The Science of Self-Identity
        //     </h3>

        // </section>

        <section className="max-h-[90vh] sm:min-h-[40vh] sm:max-h-[90vh] w-full bg-black flex items-center justify-center px-[5vw] py-6 sm:py-12">
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-400 gap-8">
                <div className="hidden md:block w-[30vw] max-w-120 transition-transform duration-500 hover:scale-105">
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
                        className="w-full mt-5 sm:mt-10 bg-yellow-500 text-(--brand-dark) text-lg font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-4xl tracking-widest transition-all hover:bg-yellow-400 hover:scale-105 shadow-md flex items-center justify-center gap-2"
                    >
                        DISCOVER WHO YOU ARE
                        <ArrowRight size={25} className="shrink-0" />
                    </button>
                    
                </div>


                <div className="w-[80vw] md:w-[30vw] max-w-120 transition-transform duration-500 hover:scale-105">
                    <img src={man.src} alt="Man" className="w-full h-auto drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]" />
                </div>
            </div>
        </section>
    )
}

export default Hero;