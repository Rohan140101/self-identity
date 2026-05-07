"use client";

interface DropdownQuestionProps {
    question: string;
    options: string[];
    selectedValue: string | null;
    onSelect: (value: string) => void;
}

// Dropdown Question in Survey 

export default function DropdownQuestion({ question, options, selectedValue, onSelect }: DropdownQuestionProps) {
    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
                {question}
            </h2>
            <p className="text-gray-500 mb-8">Select one option from the dropdown</p>
            {/*Populating Dropdown Options */}
            <div className="relative max-w-md">
                <select
                    value={selectedValue || ""} onChange={(e) => onSelect(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-lg appearance-none focus:border-slate-900 focus:bg-white transition-all outline-none"
                >
                    <option value="" disabled>Select an option</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}


                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="fill-current h-6 w-6" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>

                </div>

            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div> */}
        </div>
    )
}


