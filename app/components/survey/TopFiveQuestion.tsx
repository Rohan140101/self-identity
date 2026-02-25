"use client";
import { useState, useMemo } from "react";

interface TopFiveQuestionProps {
    question: string;
    options: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
}

export default function TopFiveQuestion({ question, options, selectedValues, onToggle }: TopFiveQuestionProps) {

    const shuffledOptions = useMemo(() => [...options].sort(() => Math.random() - 0.5), [options]);
    const canSelectMore = selectedValues.length < 5;

    return (
        <div className="w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 leading-tight">{question}</h2>
                <p className="text-blue-600 font-medium mt-2">
                    {selectedValues.length} of 5 selected {selectedValues.length === 5 && "✓"}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {shuffledOptions.map((option) => {
                    const isSelected = selectedValues.includes(option)
                    const disabled = !isSelected && !canSelectMore

                    return (
                        <button
                        key={option}
                        disabled={disabled}
                        onClick={() => onToggle(option)}
                        className={`p-4 text-center border-2 rounded-xl transition-all h-24 flex items-center justify-center text-sm font-bold
                        ${isSelected ? "border-slate-900 bg-slate-900 text-white shadow-md scale-[1.05]" : 
                            disabled ? "border-gray-50 bg-gray-50 text-gray-300 cursor-not-allowed" :
                            "border-gray-100 bg-white text-gray-700 hover:border-slate-300"
                            }`}>
                                {option}

                        </button>
                    )
                })}
            </div>
        </div>
    )
}


