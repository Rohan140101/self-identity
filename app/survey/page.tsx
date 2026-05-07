"use client";
import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RadioQuestion from "../components/survey/RadioQuestion";
import LikertQuestion from "../components/survey/LikertQuestion";
import DefinedLikertQuestion from "../components/survey/DefinedLikertQuestion"
import CheckBoxQuestion from "../components/survey/CheckBoxQuestion";
import Header from "../components/header";
import Footer from "../components/footer";
import { transformSurveyData } from "@/utils/surveyUtils";
import longSurveyData from "@/data/survey.json"
import shortSurveyData from "@/data/short_survey.json"
import DropdownQuestion from "../components/survey/DropdownQuestion";
import TextInputQuestion from "../components/survey/TextInputQuestion";
import TopFiveQuestion from "../components/survey/TopFiveQuestion";
import ReviewRanking from "../components/survey/ReviewRanking";
import IdentityReport from "../components/survey/IdentityReport";
import { Reveal } from "../components/Reveal";
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

function SurveyManager() {

    const searchParams = useSearchParams()
    const surveyType = searchParams.get("type") || "long";
    console.log("Survey Type: ", surveyType)

    const data = surveyType == "long" ? longSurveyData : shortSurveyData

    const questions = useMemo(() => transformSurveyData(data), [])
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({
        surveyType: surveyType
    });
    const [isReportMode, setIsReportMode] = useState(false);
    const [finalRankedIdentity, setFinalRankedIdentity] = useState<string[]>([])
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentQuestion.id];

    const shouldShowQuestion = (question: any) => {
        if (!question.showOnly) {
            return true
        }

        const [parentdid, requiredValue] = Object.entries(question.showOnly)[0];
        console.log('here2', parentdid, requiredValue)
        const parentQuestion = questions.find(q => q.id === parentdid)
        console.log('here5', questions)
        console.log('here4', parentQuestion)
        if (!parentQuestion) {
            return true
        }

        const userSelection = answers[parentQuestion.id]

        const qtype = parentQuestion.type
        console.log('here5', qtype)
        if (qtype === "likert" || qtype === "likertTrait") {
            let selectedChoice = ""
            if (userSelection >= 1 && userSelection <= 2) {
                selectedChoice = parentQuestion.labels.left
            } else if (userSelection >= 6 && userSelection <= 7) {
                selectedChoice = parentQuestion.labels.right
            }
            return selectedChoice === requiredValue
        }
        if (Array.isArray(userSelection)) {
            return userSelection.includes(requiredValue);
        }

        return userSelection === requiredValue


    }

    const getSectionTraits = (sectionName: string) => {
        const traits: string[] = []
        questions.forEach((q) => {
            const answer = answers[q.id]
            if (q.type != "choose" && answer && q.section == sectionName) {
                if (q.type === "checkbox") {
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
                    if (score >= 1 && score <= 2) {
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

        const currentQ = questions[currentIndex]
        if (currentQ.id === "Review") {

            return;
        }


        let nextIndex = currentIndex + 1;


        if (currentQuestion.jump && currentAnswer && currentQuestion.jump[currentAnswer]) {
            const target = currentQuestion.jump[currentAnswer]
            const foundIndex = questions.findIndex(q => q.id === target)
            if (foundIndex != -1) {
                nextIndex = foundIndex
            }
        }

        while (nextIndex < questions.length) {
            const nextQuestion = questions[nextIndex];

            if (!shouldShowQuestion(nextQuestion)) {
                nextIndex++
                // console.log('here3:', nextQuestion.id)
                continue;
            }

            if (nextQuestion.id === "AQ1") {
                setIsReportMode(true)
                return
            }

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

            break;


        }

        if (nextIndex >= questions.length) {
            setIsReportMode(true)
        } else {
            setCurrentIndex(nextIndex)
        }






    }


    const getReport = async (answers: any) => {
        // const localPath = process.env.NEXT_PUBLIC_LOCAL_API_PATH + "/analyze"
        // const globalPath = process.env.NEXT_PUBLIC_GLOBAL_API_PATH + "/analyze"
        const path = process.env.NEXT_PUBLIC_API_PATH + '/analyze'
        try {
            const response = await fetch(path, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(answers),
            });

            if (!response.ok) throw new Error('Analysis failed');

            const analysisData = await response.json();

            return { success: true, data: analysisData }
        }
        catch (error) {
            console.error('Error in generating report:', error);
            return { success: false, error: 'Failed to generate report' };

        }
    }

    const handleFinalSubmission = async (finalOrder: string[]) => {
        setIsLoading(true);
        setFinalRankedIdentity(finalOrder)
        const finalAnswers = { ...answers, finalRankedChoices: finalOrder };
        sessionStorage.setItem("user_answers", JSON.stringify(finalAnswers))
        // const response = await fetch('http://localhost:8000/analyze', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(answers),
        // });




        // const result = await saveToGoogleSheets(finalAnswers);

        const result = await getReport(finalAnswers)

        if (result.success) {
            setAnalysisResult(result.data);
            setIsReportMode(true);
        } else {
            alert("Something went wrong calculating your report.");
        }
        setIsLoading(false);



    };



    const isAnswered = () => {
        if (currentQuestion.id === "T5") {
            return (currentAnswer || []).length === 5
        }
        if (currentQuestion.type === "text") {
            return (currentAnswer || "").trim().length > 0;
        }
        if (!currentAnswer) {
            return false
        }

        if (Array.isArray(currentAnswer)) {
            return currentAnswer.length > 0
        }

        return true
    }

    // if (isReportMode) {
    //     return (
    //         <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
    //             <div className="bg-white p-12 rounded-3xl shadow-xl max-w-2xl w-full text-center">
    //                 <h1 className="text-4xl font-black mb-4">Your Identity Report</h1>
    //                 <p className="text-gray-500 mb-8">Based on your survey, here are your top priorities:</p>
    //                 <div className="space-y-2 mb-10">
    //                     {finalRankedIdentity.map((trait, i) => (
    //                         <div key={trait} className="p-3 bg-slate-100 rounded-lg font-bold">
    //                             {i + 1}. {trait}
    //                         </div>
    //                     ))}
    //                 </div>
    //                 <button onClick={() => window.location.reload()} className="text-(--brand-hover) font-bold underline">
    //                     Restart Survey
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }

    if (isReportMode && analysisResult) {
        return <IdentityReport
            top_identity_table={analysisResult.top_identity_table}
            expected_vs_actual_rank_table={analysisResult.expected_vs_actual_rank_table}
            expected_vs_actual_rank_well_being={analysisResult.expected_vs_actual_rank_well_being}
            optimized_result={analysisResult.optimized_result} />
    }


    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/**Importing Header */}
            <Header />
            <main className="min-h-screen bg-white text-black">
                <section className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl border border-gray-200 rounded-2xl p-5 sm:p-10 shadow-sm bg-white">

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-gray-100 rounded-full mb-10 overflow-hidden">
                            <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />

                        </div>

                        {/* Orchestrator */}



                            {currentQuestion.id === "T5" && (
                                <TopFiveQuestion question={currentQuestion.question}
                                    options={currentQuestion.options}
                                    selectedValues={currentAnswer || []}
                                    answers={answers}
                                    onToggle={(val: string) => {
                                        const prev = currentAnswer || [];
                                        const updated = prev.includes(val)
                                            ? prev.filter((x: any) => x != val)
                                            : [...prev, val]
                                        if (updated.length <= 5) {
                                            setAnswers({ ...answers, [currentQuestion.id]: updated })
                                        }
                                    }
                                    }
                                />
                            )}

                            {currentQuestion.id === "Review" && (
                                <ReviewRanking
                                    choices={answers['T5'] || []}
                                    surveyType={surveyType}
                                    allAnswers={answers}
                                    onComplete={async (finalOrder) => handleFinalSubmission(finalOrder)}
                                />
                            )}
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


                            {(currentQuestion.type === "dlikert") && (

                                <DefinedLikertQuestion
                                    category={currentQuestion.category}
                                    definition={currentQuestion.definition}
                                    selectedValue={currentAnswer}
                                    onSelect={handleSelect}
                                    labels={currentQuestion.labels}

                                />
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

                            {currentQuestion.type === "dropdown" && (
                                <DropdownQuestion question={currentQuestion.question}
                                    options={currentQuestion.options}
                                    selectedValue={currentAnswer}
                                    onSelect={handleSelect} />
                            )}

                            {currentQuestion.type === "text" && (
                                <TextInputQuestion question={currentQuestion.question}
                                    value={currentAnswer || ""}
                                    onChange={handleSelect}
                                    placeholder={currentQuestion.placeholder} />
                            )}






                            {/* Next Button */}
                            {currentQuestion.id != "Review" &&
                                <div className="flex justify-center py-8">
                                    <button
                                        disabled={!isAnswered()}
                                        onClick={handleNext}
                                        className={`px-12 py-4 rounded-full font-bold text-lg transition-all ${isAnswered() ? "bg-(--brand-dark) text-white hover:bg-(--brand-hover) shadow-xl" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                                    >
                                        {currentIndex === questions.length - 1 ? "Finish" : "Next"}
                                    </button>
                                </div>}









                    </div>

                </section>

            </main><Footer />
        </div>


    )
}




export default function SurveyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Survey...</div>}>
            <SurveyManager />
        </Suspense>
    );
}