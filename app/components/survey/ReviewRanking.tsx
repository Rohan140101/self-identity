"use client";
import { useState, useMemo, useEffect } from "react";

interface TopFiveQuestionProps {
    question: string;
    options: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
}

function generatePairs(items: string[]) {
    if (items.length !== 5) {
        return []
    }
    const [A, B, C, D, E] = items;

    return [
        [A, B],
        [C, D],
        [A, C],
        [B, E],
        [D, E],
        [B, C],
        [A, D]
    ];
}


export default function ReviewRanking({ choices, onComplete, surveyType, allAnswers }: { choices: string[], onComplete: (finalOrder: string[]) => void, surveyType: string, allAnswers: any }) {
    const [step, setStep] = useState<'loading' | 'comparison' | 'review'>(
        surveyType === "short" ? 'loading' : 'comparison'
    );
    const [pairIndex, setPairIndex] = useState(0);
    const [results, setResults] = useState<{ winner: string, loser: string }[]>([]);
    const [finalOrder, setFinalOrder] = useState<string[]>([]);

    useEffect(() => {
        if (surveyType === "short") {
            fetchRankedOrder();
        }
    }, []);

    const pairs = useMemo(() => {
        return generatePairs(choices)
    }, [choices])

    const fetchRankedOrder = async () => {
        const localPath = process.env.NEXT_PUBLIC_LOCAL_API_PATH + '/getRankedOrder'
        const globalPath = process.env.NEXT_PUBLIC_GLOBAL_API_PATH + '/getRankedOrder'

        try {
            const response = await fetch(localPath, {
                "method": 'POST',
                "headers": { "Content-Type": "application/json" },
                "body": JSON.stringify(allAnswers)
            });

            const data = await response.json();
            const serverOrder = data.sorted_data.map((item: any) => item[0]);
            
            setFinalOrder(serverOrder);
            setStep('review');
        } catch (error) {
            console.error("Error triggering ranking:", error);
            setStep('comparison')
        }
    }

    

    const handleComparison = (winner: string, loser: string) => {
        const newResults = [...results, { winner, loser }];
        setResults(newResults)

        if (pairIndex < pairs.length - 1) {
            setPairIndex(pairIndex + 1)
        } else {
            calculateFinalRanking(newResults)
        }
    }
    const calculateFinalRanking = (allResults: { winner: string, loser: string }[]) => {
        const scores: Record<string, number> = {}
        choices.forEach(c => scores[c] = 0)

        allResults.forEach(r => {
            scores[r.winner] += 1
        })

        const transitiveScores: Record<string, number> = {}
        choices.forEach(candidate => {
            let strength = scores[candidate]
            allResults.filter(r => r.winner === candidate).forEach(r => {
                strength += scores[r.loser] * 0.1
            });
            transitiveScores[candidate] = strength
        });

        const sorted = [...choices].sort((a, b) => transitiveScores[b] - transitiveScores[a])
        setFinalOrder(sorted)
        setStep('review')

    }

    const moveItem = (index: number, direction: number) => {
        const newOrder = [...finalOrder]
        const element = newOrder.splice(index, 1)[0]
        newOrder.splice(index + direction, 0, element)
        setFinalOrder(newOrder)
    }

    if (step === "loading") {
        return (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium">Calculating Identity Priority...</p>
            </div>
        );
    }

    if (step === "comparison") {
        return (
            <div className="text-center animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold mb-8">
                    To help us understand which aspects are most important to your identity, please select which one in each pair is more important to you.
                </h2>
                <div className="flex justify-center gap-8 items-center h-64">
                    <ComparisonCard label={pairs[pairIndex][0]} onClick={() => handleComparison(pairs[pairIndex][0], pairs[pairIndex][1])} />
                    <span className="text-gray-300 font-black italic text-4xl ">
                        VS
                    </span>

                    <ComparisonCard label={pairs[pairIndex][1]} onClick={() => handleComparison(pairs[pairIndex][1], pairs[pairIndex][0])} />

                </div>
                <div className="mt-8 text-gray-400">Comparison {pairIndex + 1} of 7</div>
            </div>
        )
    }

    if (step === "review") {
        return (
            <div className="w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Final Identity Priority
                </h2>

                <p className="text-s text-gray-500 text-center mb-6 px-4">
                    This is a proposed ranking of the importance of the components of your personal identity. Use the buttons to adjust this order so we get it right.
                </p>
                <div className="space-y-3">
                    {finalOrder.map((item, i) => (
                        <div key={item} className="flex items-center text-(--brand-dark) bg-white p-4 rounded-xl shadow-sm border border-slate-900 ">
                            <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-4 font-bold text-blue-600">
                                {i + 1}
                            </span>
                            <span className="font-medium text-lg flex-1">{item}</span>
                            <div className="flex gap-2">
                                <button onClick={() => moveItem(i, -1)} disabled={i === 0} title="Move Up"
                                    className="flex items-center justify-center w-8 h-8 rounded bg-blue-50 text-blue-600 hover:text-white hover:bg-blue-600 transition-colors disabled:opacity-30 disabled:hover:bg-blue-50 disabled:hover:text-blue-600" >
                                    ▲
                                </button>

                                <button onClick={() => moveItem(i, 1)} disabled={i === finalOrder.length - 1} title="Move Down"
                                    className="flex items-center justify-center w-8 h-8 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-blue-50 disabled:hover:text-blue-600" >
                                    ▼
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => onComplete(finalOrder)} className="w-full mt-10 bg-blue-600 text-white py-4 rounded-full font-bold">
                    See My Report
                </button>
            </div>
        )
    }



}



function ComparisonCard({ label, onClick }: { label: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="w-64 h-48 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-slate-900 hover:shadow-xl transition-all flex items-center justify-center p-6">
            <span className="text-xl font-bold text-slate-800 uppercase tracking-tight">
                {label}
            </span>
        </button>
    )
}