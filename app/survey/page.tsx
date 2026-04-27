"use client";
import type { ComponentProps } from "react";
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

type SurveyAnswer = string | number | string[] | null | undefined;
type SurveyAnswers = Record<string, SurveyAnswer>;

type SurveyQuestion = {
    id: string;
    type: string;
    question: string;
    options?: string[];
    labels?: { left: string; right: string };
    jump?: Record<string, string> | null;
    showOnly?: Record<string, string> | null;
    section?: unknown;
    category?: string;
    definition?: string;
    placeholder?: string;
}

type AnalysisResult = ComponentProps<typeof IdentityReport>;

const toStringArray = (answer: SurveyAnswer): string[] => {
    return Array.isArray(answer) ? answer.filter((item): item is string => typeof item === "string") : [];
}

function SurveyManager() {

    const searchParams = useSearchParams()
    const surveyType = searchParams.get("type") || "long";
    console.log("Survey Type: ", surveyType)

    const data = surveyType == "long" ? longSurveyData : shortSurveyData

    const questions = useMemo(() => transformSurveyData(data) as SurveyQuestion[], [data])
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questionHistory, setQuestionHistory] = useState<number[]>([]);
    const [answers, setAnswers] = useState<SurveyAnswers>({
        surveyType: surveyType
    });
    const [isReportMode, setIsReportMode] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentQuestion.id];
    const selectedStringAnswer = typeof currentAnswer === "string" ? currentAnswer : null;
    const selectedNumberAnswer = typeof currentAnswer === "number" ? currentAnswer : null;
    const selectedStringAnswers = toStringArray(currentAnswer);
    const topFiveAnswers = toStringArray(answers['T5']);

    const shouldShowQuestion = (question: SurveyQuestion) => {
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
            const score = Number(userSelection)
            if (score >= 1 && score <= 2) {
                selectedChoice = parentQuestion.labels?.left || ""
            } else if (score >= 6 && score <= 7) {
                selectedChoice = parentQuestion.labels?.right || ""
            }
            return selectedChoice === requiredValue
        }
        if (Array.isArray(userSelection)) {
            return userSelection.includes(requiredValue);
        }

        return userSelection === requiredValue


    }

    const getSectionTraits = (sectionName: unknown) => {
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
                        if (q.labels?.left) {
                            traits.push(q.labels.left)
                        }
                    } else if (score >= 6 && score <= 7) {
                        if (q.labels?.right) {
                            traits.push(q.labels.right)
                        }
                    }

                }
            }



        })
        return Array.from(new Set(traits))

    }


    const pruneFutureAnswers = (nextAnswers: SurveyAnswers) => {
        const prunedAnswers = { ...nextAnswers };
        questions.slice(currentIndex + 1).forEach((question) => {
            delete prunedAnswers[question.id];
        });
        return prunedAnswers;
    }

    const updateCurrentAnswer = (value: SurveyAnswer) => {
        setAnswers((prev) => pruneFutureAnswers({ ...prev, [currentQuestion.id]: value }))
    }

    const handleSelect = (value: string | number) => {
        if (currentQuestion.type == "checkbox") {
            setAnswers((prev) => {
                const currentArray = (prev[currentQuestion.id] as string[]) || [];
                const stringValue = String(value);
                const updatedArray = currentArray.includes(stringValue) ? currentArray.filter((item) => item !== stringValue) :
                    [...currentArray, stringValue];

                return pruneFutureAnswers({ ...prev, [currentQuestion.id]: updatedArray });
            })
        } else {
            updateCurrentAnswer(value)
        }





    }

    const goToQuestion = (nextIndex: number) => {
        setQuestionHistory((prev) => [...prev, currentIndex]);
        setCurrentIndex(nextIndex);
    }

    const handleBack = () => {
        if (questionHistory.length === 0) {
            return;
        }

        const previousIndex = questionHistory[questionHistory.length - 1];
        setQuestionHistory(questionHistory.slice(0, -1));
        setCurrentIndex(previousIndex);
    }

    const handleNext = () => {

        const currentQ = questions[currentIndex]
        if (currentQ.id === "Review") {

            return;
        }


        let nextIndex = currentIndex + 1;


        if (currentQuestion.jump && typeof currentAnswer === "string" && currentQuestion.jump[currentAnswer]) {
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
                    goToQuestion(nextIndex + 1);
                    console.log(answers)
                    return;
                }
            }

            break;


        }

        if (nextIndex >= questions.length) {
            setIsReportMode(true)
        } else {
            goToQuestion(nextIndex)
        }






    }


    const getReport = async (answers: SurveyAnswers): Promise<{ success: true; data: AnalysisResult } | { success: false; error: string }> => {
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

            const analysisData = await response.json() as AnalysisResult;

            return { success: true, data: analysisData }
        }
        catch (error) {
            console.error('Error in generating report:', error);
            return { success: false, error: 'Failed to generate report' };

        }
    }

    const handleFinalSubmission = async (finalOrder: string[]) => {
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



    };



    const isAnswered = () => {
        if (currentQuestion.id === "T5") {
            return selectedStringAnswers.length === 5
        }
        if (currentQuestion.type === "text") {
            return typeof currentAnswer === "string" && currentAnswer.trim().length > 0;
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
    //                 <button onClick={() => window.location.reload()} className="text-blue-600 font-bold underline">
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
            <Header />
            <main className="min-h-screen bg-white text-black">
                <section className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl border border-gray-200 rounded-2xl p-5 sm:p-10 shadow-sm bg-white">

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-gray-100 rounded-full mb-10 overflow-hidden">
                            <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />

                        </div>
                        <div className="mb-6 h-8">
                            {questionHistory.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
                                >
                                    ← Back
                                </button>
                            )}
                        </div>

                        {/* Orchestrator */}



                            {currentQuestion.id === "T5" && (
                                <TopFiveQuestion question={currentQuestion.question}
                                    options={currentQuestion.options || []}
                                    selectedValues={selectedStringAnswers}
                                    answers={answers}
                                    onToggle={(val: string) => {
                                        const prev = selectedStringAnswers;
                                        const updated = prev.includes(val)
                                            ? prev.filter((x) => x != val)
                                            : [...prev, val]
                                        if (updated.length <= 5) {
                                            updateCurrentAnswer(updated)
                                        }
                                    }
                                    }
                                />
                            )}

                            {currentQuestion.id === "Review" && (
                                <ReviewRanking
                                    choices={topFiveAnswers}
                                    surveyType={surveyType}
                                    allAnswers={answers}
                                    onBack={handleBack}
                                    onComplete={async (finalOrder) => handleFinalSubmission(finalOrder)}
                                />
                            )}
                            {currentQuestion.type === "radio" && (
                                <RadioQuestion question={currentQuestion.question}
                                    options={currentQuestion.options || []}
                                    selectedValue={selectedStringAnswer}
                                    onSelect={handleSelect} />
                            )}

                            {currentQuestion.type === "checkbox" && (
                                <CheckBoxQuestion question={currentQuestion.question}
                                    options={currentQuestion.options || []}
                                    selectedValues={selectedStringAnswers}
                                    onToggle={handleSelect} />
                            )}


                            {(currentQuestion.type === "dlikert") && (

                                <DefinedLikertQuestion
                                    category={currentQuestion.category || ""}
                                    definition={currentQuestion.definition || ""}
                                    selectedValue={selectedNumberAnswer}
                                    onSelect={handleSelect}
                                    labels={currentQuestion.labels}

                                />
                            )}

                            {(currentQuestion.type === "likert" || currentQuestion.type === "likertTrait") && (

                                <LikertQuestion question={currentQuestion.question}
                                    selectedValue={selectedNumberAnswer}
                                    onSelect={handleSelect}
                                    labels={currentQuestion.labels} />



                            )}

                            {currentQuestion.type === "choose" && (
                                <RadioQuestion question={currentQuestion.question}
                                    options={getSectionTraits(currentQuestion.section) || []}
                                    selectedValue={selectedStringAnswer}
                                    onSelect={handleSelect} />
                            )}

                            {currentQuestion.type === "dropdown" && (
                                <DropdownQuestion question={currentQuestion.question}
                                    options={currentQuestion.options || []}
                                    selectedValue={selectedStringAnswer}
                                    onSelect={handleSelect} />
                            )}

                            {currentQuestion.type === "text" && (
                                <TextInputQuestion question={currentQuestion.question}
                                    value={selectedStringAnswer || ""}
                                    onChange={handleSelect}
                                    placeholder={currentQuestion.placeholder} />
                            )}






                            {/* Next Button */}
                            {currentQuestion.id != "Review" &&
                                <div className="flex justify-center py-8">
                                    <button
                                        disabled={!isAnswered()}
                                        onClick={handleNext}
                                        className={`px-12 py-4 rounded-full font-bold text-lg transition-all ${isAnswered() ? "bg-(--brand-dark) text-white hover:bg-slate-800 shadow-xl" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
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
