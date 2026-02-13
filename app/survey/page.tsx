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

const isValidIdentityTrait = (val: string) => {
    const junk = ["other", "none", "none applicable", "prefer not to answer", "neither"]
    return val && !junk.includes(val.toLowerCase())
}

export default function SurveyPage() {
    const questions = useMemo(() => transformSurveyData(rawSurveyData), [])
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});

    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentQuestion.id];

    const getSectionTraits = (sectionName: string) => {
        const traits: string[] = []
        questions.forEach((q) => {
            const answer = answers[q.id]
            if (q.type != "choose" && answer && q.section == sectionName){
                if (q.type === "checkbox"){
                if (Array.isArray(answer)) {
                    answer.forEach((a) => {
                        if (isValidIdentityTrait(a)) {
                            traits.push(a);
                        }
                    })
                }
            } else if (q.type === "radio") {
                if (typeof (answer) == "string" && isValidIdentityTrait(answer)) {
                    traits.push(answer)
                }
            } else if (q.type === "likertTrait") {
                const score = Number(answer)
                if (score >= 1 && score <= 2){
                    traits.push(q.labels.left)
                } else if (score >= 6 && score <= 7) {
                    traits.push(q.labels.right)
                }

            }
            }

            
            
        })
        return Array.from(new Set(traits))

    }


    const handleSelect = (value: any) => {
        if (currentQuestion.type == "checkbox") {
            const currentArray = (currentAnswer as string[]) || [];
            const updatedArray = currentArray.includes(value) ? currentArray.filter((item) => item !== value) :
                [...currentArray, value];

            setAnswers({ ...answers, [currentQuestion.id]: updatedArray })
        } else {
            setAnswers({ ...answers, [currentQuestion.id]: value })
        }

        



    }

    const handleNext = () => {
        let nextIndex = currentIndex + 1;
        

        if (currentQuestion.jump && currentAnswer && currentQuestion.jump[currentAnswer]){
            const target = currentQuestion.jump[currentAnswer]
            const foundIndex = questions.findIndex(q => q.id === target)
            if (foundIndex != -1){
                nextIndex = foundIndex
            }
        }

        const nextQuestion = questions[nextIndex];
        if (nextQuestion?.type === "choose") {
            const availableTraits = getSectionTraits(nextQuestion.section)
            if (availableTraits.length <= 1) {
                if (availableTraits.length === 1) {
                    setAnswers(prev => ({ ...prev, [nextQuestion.id]: availableTraits[0] }))
                }
                setCurrentIndex(nextIndex + 1);
                console.log(answers)
                return;
            }
        }
        setCurrentIndex(nextIndex)
        console.log(answers)

    }

    const isAnswered = () => {
        if (!currentAnswer) {
            return false
        }

        if (Array.isArray(currentAnswer)) {
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

                        {(currentQuestion.type === "likert" || currentQuestion.type === "likertTrait") && (
                            <LikertQuestion question={currentQuestion.question}
                                selectedValue={currentAnswer}
                                onSelect={handleSelect}
                                labels={currentQuestion.labels} />
                        )}

                        {currentQuestion.type === "choose" && (
                            <RadioQuestion question={currentQuestion.question}
                                options={getSectionTraits(currentQuestion.section) || []}
                                selectedValue={currentAnswer}
                                onSelect={handleSelect} />
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