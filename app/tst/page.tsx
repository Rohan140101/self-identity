"use client"

import Header from "../components/header"
import Footer from "../components/footer"
import { handleBuildComplete } from "next/dist/build/adapter/build-complete"
import { useState } from "react"
import { stat } from "fs";
import { useRouter } from "next/navigation";
import { saveTst } from "../actions/save_tst"

import { Reveal } from "../components/Reveal"




export default function TSTPage() {
    const router = useRouter();
    const [statements, setStatements] = useState(Array(20).fill(""));
    const [errors, setErrors] = useState<number[]>([]);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [consent, setConsent] = useState("yes");
    const handleChange = (index: number, value: string) => {
        // if (value.startsWith(" ")) return;
        value = value.trim()

        const newStatements = [...statements];
        newStatements[index] = value;
        setStatements(newStatements);

        if (errors.includes(index)) {
            setErrors(errors.filter((i) => i !== index));
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const emptyFields = statements
            .map((val, index) => (val.trim() === "" ? index : null))
            .filter((val) => val !== null) as number[];

        if (emptyFields.length > 0) {
            setErrors(emptyFields);
            const firstError = document.getElementById(`field-${emptyFields[0]}`);
            firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        // await handleStoreData(statements)
        setIsEmailModalOpen(true)
    }

    async function handleStoreData(statements: string[], email: string, name: string, researchConsent: string) {
        const cleanedData = statements.map(s => s.trim());
        try {
            await saveTst(cleanedData, email, name, researchConsent);
            router.push("/tst/success");
        } catch (error) {
            console.error("Failed to save:", error);
        }

    }

    const handleEmailSubmit = async (e: React.FormEvent) => {
        console.log("Inside handleEmailSubmit")
        e.preventDefault();
        try {
            await handleStoreData(statements, email, name, consent);
            setIsEmailModalOpen(false);

            const data = {
                user_name: name,
                user_email: email,
                statements: statements
            };
            const path = process.env.NEXT_PUBLIC_API_PATH + '/mail_tst_results';
            fetch(path, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }).catch(err => console.error("Background email failed:", err));
        } catch (error) {
            console.error("Critical Save Error:", error);
        }

    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/**Importing Header */}
            <Header />

            <main className="grow flex flex-col items-center bg-slate-50/50 py-3 px-1 sm:py-10 sm:px-6 max-w-full overflow-x-hidden">
                <Reveal delay={0.2}>
                    <div className="mb-1 sm:mb-7 text-center">
                        <h1 className="text-4xl md:text-5xl mt-5 sm:mt-10 font-extrabold text-slate-900 tracking-tight mb-2 sm:mb-4">
                            Twenty Statements Test
                        </h1>
                    </div>
                </Reveal>


                {/* <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-(--brand-hover)"></span>
                        <span className="text-xs font-bold text-(--brand-hover) uppercase tracking-widest">
                            In Development
                        </span>
                    </div>

                    <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-6">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from(--brand-hover) to-indigo-500">
                            This page is under development and should be available soon
                        </span>
                    </h1> */}

                <Reveal delay={0.4}>
                    <div className="max-w-5xl overflow-x-hidden mx-auto p-3 sm:p-6">
                        <div className="border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50">
                            <div className="mb-8">
                                <p className="text-slate-900 text-xl mt-2 italic">
                                    The Twenty Statements Test (TST) is an instrument used to measure self concept.  It was devised in 1954 by Manfred Kuhn & Thomas McPartland, with the aim of finding a standardized way to measure assumptions and self-attitudes. The test takes the form of a survey, with respondents asked to give up to twenty responses to the prompts, "Who am I?" or "I am...".
                                </p>

                                <p className="text-slate-900 font-black text-xl mt-2 italic">
                                    Quickly write down the first twenty answers you come up with in respond to the question "Who am I?".   Each answer should be of the form "I am __"

                                </p>
                            </div>

                            <form className="grid grid-cols-1 gap-x-5 sm:gap-x-10 gap-y-1 sm:gap-y-3 relative z-10">
                                {statements.map((text, i) => (
                                    <div key={i} className="flex items-center gap-4 grow w-full">
                                        <span className={`w-2 sm:w-8 shrink-0 text-sm font-bold transition-colors ${errors.includes(i) ? "text-red-500" : "text-slate-700 group-focus-within:text-blue-500"}`}>
                                            #{i + 1}
                                        </span>
                                        <div className={
                                            `flex grow items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all 
                                    ${errors.includes(i) ?
                                                "border-red-200 bg-red-50 ring-2 ring-red-100" :
                                                "border-slate-50 bg-slate-50/50 group-focus-within:border-blue-400 group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-blue-100/50"}`}>

                                            <span className="w-12 bg-linear-to-r text-blue-900 bg-clip-text font-extrabold text-sm  uppercase tracking-tighter select-none">
                                                I am
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="..."
                                                onChange={(e) => handleChange(i, e.target.value)}
                                                required
                                                className="flex-1 bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400 font-medium caret-indigo-800" />
                                        </div>
                                    </div>
                                ))}
                                <div className="w-full mt-10 flex flex-col items-center gap-4">
                                    {errors.length > 0 && (
                                        <p className="text-red-500 font-bold text-sm animate-bounce">
                                            Please complete all 20 statements to continue.
                                        </p>
                                    )}
                                    <button
                                        onClick={(e) => handleSubmit(e)}
                                        type="submit"
                                        className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm  tracking-widest hover:bg-(--brand-hover) hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-blue-200 active:scale-95"
                                    >
                                        Submit Test
                                    </button>
                                </div>


                            </form>

                        </div>

                    </div>

                </Reveal>



                {isEmailModalOpen && (

                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto transition-all">
                        <Reveal delay={0.2}>
                            <div className="bg-white rounded-4xl sm:rounded-3xl max-w-md w-full my-auto shadow-2xl overflow-hidden border border-slate-100 relative">
                                <div className="bg-linear-to-br from(--brand-hover) to-indigo-700 p-6 sm:p-8 text-center">
                                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full mb-3 sm:mb-4">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Ready to see your TST Results?</h2>
                                    <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-65 mx-auto">
                                        Enter your details to receive your Twenty Statements Test Results.
                                    </p>
                                </div>

                                <form onSubmit={handleEmailSubmit} className="p-6 sm:p-8">
                                    <div className="space-y-4 sm:space-y-5">
                                        <div>
                                            <label className="block mb-1 text-sm font-semibold text-slate-700">
                                                Full Name <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Alex Johnson"
                                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-base text-slate-900 transition-all placeholder:text-slate-300"
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-1 text-sm font-semibold text-slate-700">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="name@example.com"
                                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-base text-slate-900 transition-all placeholder:text-slate-300"
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <label className="block mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Research Contribution
                                            </label>
                                            <p className="text-[11px] text-slate-500 mb-3 leading-snug">
                                                May we use your anonymized data for scientific research purposes?
                                            </p>
                                            <div className="flex gap-6">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="radio"
                                                        name="consent"
                                                        value="yes"
                                                        defaultChecked
                                                        className="w-4 h-4 text-(--brand-hover) focus:ring-blue-500"
                                                        onChange={(e) => setConsent(e.target.value)}
                                                    />
                                                    <span className="text-sm font-medium text-slate-700">Yes</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="radio"
                                                        name="consent"
                                                        value="no"
                                                        className="w-4 h-4 text-(--brand-hover) focus:ring-blue-500"
                                                        onChange={(e) => setConsent(e.target.value)}
                                                    />
                                                    <span className="text-sm font-medium text-slate-700">No</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 sm:mt-8 flex flex-col gap-2">
                                        <button
                                            type="submit"
                                            className="w-full bg-(--brand-hover) hover:bg-blue-700 text-white py-3.5 sm:py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98] text-sm sm:text-base"
                                        >
                                            Generate & Send My Report
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEmailModalOpen(false)}
                                            className="text-slate-400 hover:text-slate-600 text-xs sm:text-sm font-medium py-2 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Reveal>

                    </div>


                )}




            </main >
            <Reveal delay={1}>
                <Footer />
            </Reveal>

        </div >
    )

}

