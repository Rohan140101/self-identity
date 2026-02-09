"use client";

interface LikertQuestionProps {
    question: string;
    selectedValue: number | null;
    onSelect: (value: number) => void;
    labels?: { left: string, right: string }
}

export default function LikertQuestion({ question, selectedValue, onSelect, labels }: LikertQuestionProps) {
    return (
        <div className="w-full text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
                {question}
            </h2>


            <div className="flex flex-col items-center">
                <div className="flex justify-between items-center w-full max-w-xl gap-2 mb-4">
                    <span className="text-sm font-medium text-(--brand-dark) uppercase tracking-wider w-24 text-right">
                        {labels?.left || "Disagree"}
                    </span>

                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <button key={num}
                            onClick={() => onSelect(num)}
                            className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center font-bold text-lg 
                ${selectedValue === num ? "bg-(--brand-dark) border-slate-900 text-white scale-110 shadow-lg"
                                    : "border-gray-100 text-gray-400 hover:border-slate-300 hover:text-slate-900"}`}>

                            {num}
                        </button>
                    )

                    )}

                    <span className="text-sm font-medium text-(--brand-dark) uppercase tracking-wider w-24 text-left">
                        {labels?.right || "Agree"}
                    </span>

                </div>

            </div>




        </div>
    )
}


