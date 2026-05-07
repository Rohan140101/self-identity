"use client";

interface LikertQuestionProps {
    category: string;
    definition: string,
    selectedValue: number | null;
    onSelect: (value: number) => void;
    labels?: { left: string, right: string }
}

// Defined Likert in Survey (only used for Short Survey)

export default function DefinedLikertQuestion({ category, definition, selectedValue, onSelect, labels }: LikertQuestionProps) {
    console.log(category)
    return (
        <div className="w-full text-center">
            <div className="mb-6">
                {/*Printing Category in Uppercase and Blue */}
                <span className="text-3xl font-black uppercase text-(--brand-hover)">
                    {category + " "}
                </span>
                {/*Printing Category in Black*/}
                <span className="text-3xl font-black text-slate-900 tracking-tight">

                    {definition}

                </span>

            </div>

            <p className="text-gray-500 text-2xl mb-8">How important is it to your personal identity?</p>



            <div className="flex flex-col items-center w-full px-2">
                {/*Printing Likert Labels and Selection Buttons*/}
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


