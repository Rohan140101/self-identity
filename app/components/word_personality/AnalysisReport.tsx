"use client";
import { Reveal } from "@/app/components/Reveal";
import { ArrowLeft, Cat } from 'lucide-react';
import { SurvivalCurve } from "./SurvivalCurve";
import { useState, useEffect } from "react";
import { saveWordPersonalityQuery } from "../../actions/save_word_personality_query"

const WORD_COLORS = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#ef4444", // red
  "#14b8a6", // teal
  "#f97316", // orange
  "#84cc16", // lime
  "#06b6d4", // cyan
  "#d946ef", // fuchsia
  "#0ea5e9", // sky
  "#22c55e", // green
  "#e11d48", // rose
  "#eab308", // yellow
  "#64748b", // slate
  "#a16207", // brown
  "#0d9488", // dark teal
  "#7c3aed", // purple
];

// Function for Making Word Personality Analysis Report UI
export default function AnalysisReport({ prevInputString, selectedCategories, data, onBack }: { prevInputString: string, selectedCategories: string[], data: any, onBack: () => void }) {
    const [reportData, setReportData] = useState(data);
    let [inputString, setInputString] = useState(prevInputString);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("")
    const [disableSearchBtn, setDisableSearchBtn] = useState(false)
    const tableData = reportData.personality_percentile_table;
    const personality_pvalue_table = reportData.personality_pvalue_table;
    const curveData = reportData.km_curve_params;
    console.log("personality_pvalue_table:", personality_pvalue_table)
    const get_percentile_color = (percentile: number) => {
        if (percentile < 45) {
            return "text-(--brand-hover)"
        } else if (percentile > 55) {
            return "text-red-600"
        } 
        return "text-slate-600"
    }

    const get_symbol = (pval: number) => {
        if (pval < 1 / 1000) {
            return "‡"
        } else if (pval < 1 / 100) {
            return "†"
        } else if (pval < 1 / 20) {
            return "*"
        } else {
            return ""
        }
    }

    const handleInputChange = (val: string) => {

        setInputString(val);
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

    const handleSubmit = async () => {
        if (!inputString.trim()) return;
        setIsLoading(true);

        let word_list = inputString.split(",")
        word_list = [...new Set(word_list)]
        inputString = word_list.join(",")
        setInputString(inputString)
        word_list = word_list.filter(s => s.trim() != "")
        if (word_list.length > 20) {
            setError("Only a Maximum of 20 words can be searched!")
        }

        try {
            await saveWordPersonalityQuery(inputString, selectedCategories);
            const body = {
                word_list: word_list,
                categories: selectedCategories
            };
            const path = process.env.NEXT_PUBLIC_API_PATH + '/word_personality_half_life_analysis';

            const response = await fetch(path, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                const result = await response.json();
                setReportData(result);
            }
        } catch (error) {
            console.error("Critical Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full max-w-5xl mx-auto'>
            <header className="mb-10 border-b border-slate-100 pb-6 flex items-center">
                <button onClick={onBack} className="p-2 bg-slate-900 hover:bg-(--brand-hover) text-white transition-colors rounded-lg mr-4">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Your Word Personality and Half Life Report
                </h1>
            </header>

            <div className="mb-12 p-6 bg-slate-50 rounded-3xl border border-slate-200">
                <div className="flex flex-col md:flex-row gap-3">
                    <input type="text"
                                        value={inputString}
                                        onChange={(e) => handleInputChange(e.target.value)}
                                        placeholder={inputString}
                                        className={`w-full text-center text-xl border-2 rounded-2xl px-5 py-6 focus:outline-none transition-all
                                ${error ? "border-red-300 bg-red-50 text-red-800" : "text-slate-900 border-slate-500 bg-slate-50 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-100"}`} />
                                {error && <p className="text-red-500 text-sm mt-2 text-center font-medium animate-pulse">{error}</p>}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || disableSearchBtn}
                        className="bg-(--brand-dark) hover:bg-(--brand-hover) text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Analyzing..." : "Update Report"}
                    </button>
                </div>
                <p className="text-slate-400 text-xs mt-3 ml-1">
                </p>
            </div>

            <Reveal>
                <section>
                    <h2 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
                        Word Personality Scores
                    </h2>
                    <p className="text-slate-800 italic font-bold mt-2 pb-10">
                        We calculated the personality scores of different words. If you associate with these words, then you will find yourself being closer to the percentile value mentioned for that word
                    </p>

                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                                    <th className="p-4">Word</th>
                                    {Object.keys(tableData[0] || {}).filter(k => !['word', 'error', 'Half-Life', 'Prevalence'].includes(k)).map(cat => (
                                        <th key={cat} className="p-4 text-center">{cat}</th>
                                    ))}
                                    <th className="p-4 text-center">Half-Life Days</th>
                                    <th className="p-4 text-center">Prevalence</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tableData.map((row: any, idx: number) => (
                                    <tr key={`${row.word}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 font-bold text-xl" style={{ color: WORD_COLORS[idx % WORD_COLORS.length] }}>
                                            {row.word}
                                        </td>


                                        {Object.entries(row)
                                            .filter(([k]) => !['word', 'error', 'Half-Life', 'Prevalence'].includes(k))
                                            .map(([key, val]: any) => (
                                                <td key={key} className={`p-4 text-center font-medium ${get_percentile_color(val)}`}>
                                                    {typeof val === 'number' ? `${get_symbol(personality_pvalue_table?.[idx]?.[key])}${val.toFixed(2)}` : val}
                                                </td>
                                            ))
                                        }
                                        <td className="p-4 text-center text-slate-900 font-mono text-sm">
                                            {row['Half-Life'] || "—"}
                                        </td>
                                        <td className="p-4 text-center text-slate-900 font-mono text-sm">
                                            {row['Prevalence'] || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="mt-16 mb-20">
                    <h2 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-(--brand-hover) rounded-full"></span>
                        Identity Half-Life Analysis
                    </h2>
                    <p className="text-slate-800 italic font-bold mt-2 pb-10">
                        We calculated the half-life of these words by tracking how long they typically stay in a person’s bio before being removed. When a curve hits the 50% mark, that’s the word’s half-life, the point where half of the people who used it have eventually moved on to describe themselves differently.
                        
                        
                    </p>
                    <SurvivalCurve wordsData={curveData} />
                </section>
            </Reveal>
        </div>
    );
}