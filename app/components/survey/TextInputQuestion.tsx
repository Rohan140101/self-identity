"use client";

interface TextInputnProps {
    question: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string
}
// Text Input Question for Survey
export default function TextInputQuestion({ question, value, onChange, placeholder }: TextInputnProps) {
    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
                {question}
            </h2>
            <p className="text-gray-500 mb-8">Select one option from the dropdown</p>

            <div className="relative">
                <textarea
                    rows={4}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder || "Type your Answer Here"}
                    className="w-full p-6 bg-gray-50 border-2 border-gray-100 rounded-2xl text-lg focus:border-slate-900 focus:bg-white transition-all outline-none resize-none"
                />
                <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                    {value?.length || 0} characters
                </div>

            </div>

        </div>
    )
}


