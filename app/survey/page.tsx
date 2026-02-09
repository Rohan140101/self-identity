"use client";
import { useMemo, useState } from "react";
import RadioQuestion from "../components/survey/RadioQuestion";
import LikertQuestion from "../components/survey/LikertQuestion";
import CheckBoxQuestion from "../components/survey/CheckBoxQuestion";
import Header from "../components/header";
import Footer from "../components/footer";
import { transformSurveyData } from "@/utils/surveyUtils"; 
import rawSurveyData from "@/data/survey.json"

// const mockQuestions = [
//   {
//     id: "q1",
//     type: "radio",
//     question: "How would you describe your social energy?",
//     options: ["Extreme Introvert", "Leaning Introvert", "Leaning Extrovert", "Extreme Extrovert"]
//   },
//   {
//     id: "q2",
//     type: "checkbox",
//     question: "Which of these professional traits do you value most?",
//     options: ["Reliability", "Creativity", "Efficiency", "Empathy", "Leadership"]
//   },
//   {
//     id: "q3",
//     type: "likert",
//     question: "I find it easy to focus on tasks for long periods.",
//     labels: { left: "Never", right: "Always" }
//   }
// ];


export default function SurveyPage() {
    const questions = useMemo(() => transformSurveyData(rawSurveyData), [])
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentQuestion.id];

    const handleSelect = (value: any) => {
        if (currentQuestion.type == "checkbox"){
            const currentArray = (currentAnswer as string[]) || [];
            const updatedArray = currentArray.includes(value) ? currentArray.filter((item) => item!==value):
            [...currentArray, value];

            setAnswers({...answers, [currentQuestion.id]: updatedArray})
        } else {
            setAnswers({...answers, [currentQuestion.id]:value})
        }

        
        
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            console.log("Survey completed with answers:", answers);
        }
    }

    const isAnswered = () => {
        if (!currentAnswer) {
            return false
        }

        if (Array.isArray(currentAnswer)){
            return currentAnswer.length > 0
        }

        return true
    }
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="min-h-screen bg-white text-black">
                <section className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-3xl border border-gray-200 rounded-2xl p-10 shadow-sm bg-white">

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-gray-100 rounded-full mb-10 overflow-hidden">
                            <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />

                        </div>

                        {/* Orchestrator */}
                        {currentQuestion.type === "radio" && (
                            <RadioQuestion question={currentQuestion.question}
                                options={currentQuestion.options || []}
                                selectedValue={currentAnswer}
                                onSelect={handleSelect} />
                        )}

                        {currentQuestion.type === "checkbox" && (
                            <CheckBoxQuestion question={currentQuestion.question}
                                options={currentQuestion.options || []}
                                selectedValues={currentAnswer || []}
                                onToggle={handleSelect} />
                        )}

                        {currentQuestion.type === "likert" && (
                            <LikertQuestion question={currentQuestion.question}
                                selectedValue={currentAnswer}
                                onSelect={handleSelect}
                                labels={currentQuestion.labels} />
                        )}

                        {/* Next Button */}
                        <div className="flex justify-center py-8">
                            <button
                                disabled={!currentAnswer}
                                onClick={handleNext}
                                className={`px-12 py-4 rounded-full font-bold text-lg transition-all ${currentAnswer ? "bg-(--brand-dark) text-white hover:bg-slate-800 shadow-xl" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                            >
                                {currentIndex === questions.length - 1 ? "Finish" : "Next"}
                            </button>
                        </div>





                    </div>

                </section>

            </main><Footer />
        </div>

    )
}