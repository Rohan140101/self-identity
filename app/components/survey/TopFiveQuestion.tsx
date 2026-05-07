"use client";
import { useState, useMemo } from "react";

interface TopFiveQuestionProps {
    question: string;
    options: string[];
    answers: Record<string, any>;
    selectedValues: string[];
    onToggle: (value: string) => void;
};

const main_questions = {
    'ethMainChoice': 'Ethnicity',
    'sorMainChoice': 'Sexual Orientation',
    'famMainChoice': 'Family Relations',
    'occMainChoice': 'Occupation',
    'serMainChoice': 'Service',
    'eduMainChoice': 'Education',
    'helMainChoice': 'Health',
    'locMainChoice': 'Location',
    'spoMainChoice': 'Sports',
    'relMainChoice': 'Religion',
    'polMainChoice': 'Politics',
    'hobMainChoice': 'Hobbies',
    'genMainChoice': 'Generation',
    'entMainChoice': 'Entertainment',
    'socMainChoice': 'Social Media',
    'ersMainChoice': 'Economic Role and Status',
    'aaMainChoice': 'Appearance and Age',
    'perMainChoice': 'Personality Traits',
    'lifMainChoice': 'Lifestyle',
    'sepMainChoice': 'Self Perception'
}

const likertStyles: Record<number, string> = {
    1: "bg-violet-800 text-white",
    2: "bg-indigo-800 text-white",
    3: "bg-blue-800 text-white",
    4: "bg-green-800 text-white",
    5: "bg-yellow-800 text-white",
    6: "bg-orange-800 text-white",
    7: "bg-red-800 text-white",
}

export default function TopFiveQuestion({ question, options, answers, selectedValues, onToggle }: TopFiveQuestionProps) {

    const shuffledOptions = useMemo(() => [...options].sort(() => Math.random() - 0.5), [options]);
    const canSelectMore = selectedValues.length < 5;
    console.log(answers)
    let categoryStyles: Record<string, string> = {}
    let categoryLikertVal: Record<string, number> = {}
    Object.entries(main_questions).forEach((values: any) => {
        let categoryQuestion = values[0]
        let category = values[1]
        let catLikertVal = answers[categoryQuestion]
        categoryStyles[category] = likertStyles[catLikertVal]
        categoryLikertVal[category] = catLikertVal
    })


    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 leading-tight">{question}</h2>
                <p className="text-(--brand-hover) font-medium mt-2">
                    {selectedValues.length} of 5 selected {selectedValues.length === 5 && "✓"}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 sm:gap-x-3 gap-y-5 sm:gap-y-3">
                {shuffledOptions.map((option) => {
                    const isSelected = selectedValues.includes(option)
                    const disabled = !isSelected && !canSelectMore

                    return (
                        <button
                            key={option}
                            disabled={disabled}
                            onClick={() => onToggle(option)}
                            className={`p-1 sm:p-4 text-center border-2 rounded-xl transition-all h-24 sm:h-28 flex flex-col items-center justify-center text-xs sm:text-sm font-bold gap-2
    ${isSelected ? "border-slate-900 bg-slate-900 text-white shadow-md scale-[1.05]" :
                                    disabled ? "border-gray-50 bg-gray-50 text-gray-300 cursor-not-allowed" :
                                        `border-gray-100 ${categoryStyles[option]} opacity-75 hover:border-slate-300`
                                }`}
                        >
                            {/* <p className={`w-8 h-8 flex items-center justify-center rounded-full border-2 border-white text-xs mb-1`}>
                                {categoryLikertVal[option]}
                            </p> */}

                            <span>{option}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}


