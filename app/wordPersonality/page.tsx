"use client";

import Header from "../components/header"
import Footer from "../components/footer"
import { useState, useEffect } from "react";
import { Reveal } from "../components/Reveal"
import AnalysisReport from "../components/word_personality/AnalysisReport"
import { saveWordPersonalityQuery } from "../actions/save_word_personality_query"
import { button } from "framer-motion/client";
// Word Personality Dashboard Component
export default function WordPersonalityPage() {
    const [inputString, setInputString] = useState("");
    const defaultInputString = "father,mother,brother,sister,husband,wife"
    const [disableSearchBtn, setDisableSearchBtn] = useState(false)
    const [error, setError] = useState("");
    const [resultData, setResultData] = useState(null)
    const allCategories = ["Happy", "Stable", "Introvert", "Anxious", "Depressed"];
    const [selectedCategories, setSelectedCategories] = useState<string[]>(allCategories);

    const examples = [
        {
            "name": "Personality Traits",
            "description": "Personality Traits: Introvert, Extrovert, Dumb, Smart ...",
            "inputString": "Introvert, Extrovert, Dumb, Smart, Chaotic, Adventurous, Lazy, Hardworking",
        },
        {
            "name": "Professions",
            "description": "Professions: Professor, Manager, Worker, Businessman ...",
            "inputString": "Professor, Manager, Worker, Businessman, Caregiver, Doctor, Engineer, Student, Retired",
        },
        {
            "name": "Ethnicity",
            "description": "Ethnicities: White, Black, Hispanic, Asian",
            "inputString": "White, Black, Hispanic, Asian",
        },
        {
            "name": "Emojis",
            "description": "Emojis: 😀, 🤣,😡, 💪...",
            "inputString": "😀, 🤣,😡, 💪, 👪, 🏀,🎮",
        },
    ]
    const handleInputChange = (val: string) => {
        // if (/\s/.test(val)) {
        //     setError("Spaces are not allowed. Use commas to separate words.");
        // } else {
        //     setError("");

        // }
        setInputString(val);
        let word_list = val.split(",")
        word_list = word_list.filter(s => s.trim() != "")
        word_list = word_list.map(s => s.trim().replaceAll(" ", ""))
        word_list = [...new Set(word_list)]
        if (word_list.length > 20) {
            setError("Please note that searches are limited to a maximum of 20 words. Kindly shorten your query and try again.")
            setDisableSearchBtn(true)
            // return
        } else {
            setError("")
            setDisableSearchBtn(false)
        }


        
    }

    const toggleAll = () => {
        if (selectedCategories.length === allCategories.length) {
            setSelectedCategories([])
        } else {
            setSelectedCategories(allCategories)
        }
    }

    const handleCheckBoxChange = (category: string) => {
        setSelectedCategories(
            prev => prev.includes(category) ? prev.filter(i => i !== category) : [...prev, category]
        )
    }


    const handleSubmit = async (passedString?: string) => {
        // console.log("inputString:", inputString)
        const effectiveString = passedString !== undefined ? passedString : inputString;
        let modInputString = ""
        if (effectiveString === "") {
            modInputString = defaultInputString
            setInputString(modInputString)
        } else {
            modInputString = effectiveString
        }
        
        let word_list = modInputString.split(",")
        word_list = word_list.filter(s => s.trim() != "")
        word_list = word_list.map(s => s.trim().replaceAll(" ", ""))
        word_list = [...new Set(word_list)]
        modInputString = word_list.join(",")
        setInputString(modInputString)
        

        try {
            await saveWordPersonalityQuery(modInputString, selectedCategories)
            const data = {
                word_list: word_list,
                categories: selectedCategories
            };
            const path = process.env.NEXT_PUBLIC_API_PATH + '/word_personality_half_life_analysis';
            const response = await fetch(path, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            if (response.ok) {
                const result = await response.json()
                setResultData(result)
            }
        } catch (error) {
            console.error("Critical Error:", error);
        }

    }


    const submitExample = async (example_string: string) => {
        setInputString(example_string);
        await handleSubmit(example_string);
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/**Importing Header */}
            <Header />

            <main className="grow flex flex-col items-center bg-slate-50/50 py-10 px-6 overflow-hidden">
                {!resultData ? (
                    <div className="w-full max-w-5xl mx-auto py-10">
                        <Reveal delay={0.2}>
                            <div className="mb-8 text-center">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                                    Identity Keyword Analysis Dashboard
                                </h1>
                            </div>
                        </Reveal>

                        <Reveal delay={0.4}>
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                                    Enter words for analysis
                                </h2>
                                <div className="relative">
                                    <input type="text"
                                        value={inputString}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        placeholder={defaultInputString}
                                        className={`w-full text-center text-xl border-2 rounded-2xl px-5 py-6 focus:outline-none transition-all
                                ${error ? "border-red-300 bg-red-50 text-red-800" : "text-slate-900 border-slate-500 bg-slate-50 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-100"}`} />
                                    {error && <p className="text-red-500 text-sm mt-2 text-center font-medium animate-pulse">{error}</p>}

                                </div>
                                <p className="text-slate-400 text-sm mt-2 text-center italic">
                                    Separate with commas. Emojis and hyphens allowed.
                                </p>
                            </div>
                        </Reveal>

                        <Reveal delay={0.6}>
                            <hr className="border-slate-200 mb-6" />
                            <div className="mb-6">
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">
                                            Selected Well Being Categories
                                        </h3>
                                        <p className="text-slate-500 text-sm">Choose the categories you wish to analyze.</p>
                                    </div>
                                    {/* <button
                                        onClick={toggleAll}
                                        className="text-xl font-bold text-(--brand-dark) hover:text-(--brand-hover) transition-colors bg-blue-50 px-4 py-2 rounded-full">
                                        {selectedCategories.length === allCategories.length ? "Deselect All" : "Select All"}
                                    </button> */}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                    {allCategories.map((category) => (
                                        <label
                                            key={category}
                                            className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-95
                                    ${selectedCategories.includes(category) ?
                                                    "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100" :
                                                    "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300"}`}>
                                            <input type="checkbox"
                                                className="hidden"
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => handleCheckBoxChange(category)} />
                                            <span className="font-bold text-sm tracking-wide">{category}</span>
                                        </label>
                                    ))}

                                </div>

                            </div>
                            <button
                                disabled={disableSearchBtn}
                                onClick={() => handleSubmit()}

                                className="w-full bg-slate-900 hover:bg-(--brand-hover) text-white py-5 rounded-2xl font-black tracking-widest transition-all shadow-xl shadow-blue-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ">
                                Search Words
                            </button>


                        </Reveal>

                        <Reveal delay={0.8}>
                            <hr className="border-slate-200 mt-6 mb-6" />
                            <div className="mb-6">
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">
                                            Like these examples? Try them
                                        </h3>
                                    </div>

                                </div>

                                <ul className="space-y-3">
                                    {examples.map((example) => (
                                        <li key={example.name} className="flex items-start group">
                                            <span className="mr-3 mt-2 h-1.5 w-1.5 rounded-full bg-(--brand-dark) group-hover:bg-(--brand-hover) transition-colors shrink-0" />

                                            <button
                                                onClick={() => submitExample(example.inputString)}
                                                className="text-left text-sm md:text-base font-medium text-slate-900 hover:text-(--brand-hover) underline underline-offset-4 decoration-slate-200 hover:decoration(--brand-hover) transition-all duration-200 ease-in-out"
                                            >
                                                {example.description}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                            </div>


                        </Reveal>

                    </div>
                ) : <AnalysisReport
                    prevInputString={inputString}
                    selectedCategories={selectedCategories}
                    data={resultData}
                    
                    onBack={() => setResultData(null)} />}


            </main>
            <Reveal delay={1.2}>
                {/**Importing Footer*/}
            <Footer />

            </Reveal>

        </div>

    )
}