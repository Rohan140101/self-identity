"use client";

interface CheckBoxQuestionProps {
    question: string;
    options: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
}

export default function CheckBoxQuestion({ question, options, selectedValues, onToggle }: CheckBoxQuestionProps) {
    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
                {question}
            </h2>
            <p className="text-gray-500 mb-8">Select all that apply</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option)
                    return (
                        <button key={option}
                        onClick={() => onToggle(option)}
                        className={`p-6 text-left border-2 rounded-xl transition-all ${
                            isSelected ? "border-slate-900 bg-(--brand-dark) text-white shadow-lg" :
                            "border-gray-100 bg-gray-50 text-gray-700 hover:border-slate-300"
                        }`}>

                            <div className="flex items-center justify-between">
                                <span className="text-lg font-medium">{option}</span>
                                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center 
                                    ${isSelected ? "border-white bg-white text-slate-900" : "border-gray-700"}`}>
                                    {isSelected && <span className="text-xs font-bold">✓</span>}
                                </div>
                            </div>

                        </button>
                    )
                })}
            </div>
        </div>
    )
}


