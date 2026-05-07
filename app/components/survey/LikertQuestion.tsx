"use client";

interface LikertQuestionProps {
    question: string;
    selectedValue: number | null;
    onSelect: (value: number) => void;
    labels?: { left: string, right: string }
}
// Likert Question in Survey

export default function LikertQuestion({ question, selectedValue, onSelect, labels }: LikertQuestionProps) {
    // console.log("Here6: ", question)
    return (
        <div className="w-full text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
                {question}
            </h2>


            <div className="flex flex-col items-center w-full px-2">
                {/*Showing Likert values and labels block */}
                <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-2xl gap-2 mb-4">
                    <span className="hidden md:block text-sm font-medium text-(--brand-dark) uppercase tracking-wider w-40 text-right overflow-hidden">
                        {labels?.left || "Disagree"}
                    </span>
                    
                    <div className="flex flex-row justify-between w-full md:w-auto gap-1 sm:gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                            <button key={num}
                                onClick={() => onSelect(num)}
                                className={`flex-1 md:flex-none w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all flex items-center justify-center font-bold text-base sm:text-lg 
                ${selectedValue === num ? "bg-(--brand-dark) border-slate-900 text-white scale-110 shadow-lg"
                                        : "border-gray-100 text-gray-400 hover:border-slate-300 hover:text-slate-900"}`}>

                                {num}
                            </button>
                        )

                        )}
                    </div>


                    <span className="hidden md:block text-sm font-medium text-(--brand-dark) uppercase tracking-wider w-40 text-left overflow-hidden">
                        {labels?.right || "Agree"}
                    </span>

                    <div className="flex md:hidden justify-between w-full px-1 mt-2">
                        <span className="text-[10px] font-bold text-(--brand-dark) uppercase tracking-light w-1/2 text-left">
                            {labels?.left || "Disagree"}
                        </span>
                        <span className="text-[10px] font-bold text-(--brand-dark) uppercase tracking-light w-1/2 text-right">
                            {labels?.right || "Agree"}
                        </span>

                    </div>

                </div>

            </div>




        </div>
    )
}


