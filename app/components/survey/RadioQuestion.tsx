"use client";

interface RadioQuestionProps {
    question: string;
    options: string[];
    selectedValue: string | null;
    onSelect: (value: string) => void;
}

export default function RadioQuestion({ question, options, selectedValue, onSelect }: RadioQuestionProps) {
    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
                {question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option) => (
                    <button key={option} onClick={() => onSelect(option)} className={`group relative p-6 text-left border-2 rounded-xl transition-all duration-200 ${selectedValue === option ? "border-slate-900 bg-(--brand-dark) text-white shadow-lg transform-scale-[1.05]" : "border-gray-100 bg-gray-50 text-gray-700 hover:border-slate-300 hover:bg-white"}`}>

                        <div className="flex items-center justify-between">
                            <span className="text-lg font-medium">{option}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center  ${selectedValue === option ? "border-white" : "border-gray-300"}`}>
                        {selectedValue === option && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}


