// app/components/survey/IdentityReport.tsx
import Header from '../header';
import Footer from '../footer';
import HappinessBellCurve from './HappinessBellCurve';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveToGoogleSheets } from '@/app/actions/save-survey';
interface IdentityRow {
    component: string;
    agree_pct: number;
    top5_pct: number;
    happiness_pct: number;
}


interface ExpectedIdentityRow {
    component: string;
    predicted_rank: string,
    actual_rank: string
}

interface ExpectedVsActualWellBeingRow {
    wellBeingChoice: string,
    actualPct: number,
    predictedPct: number
}

interface OptimizationMessage {
    case: number,
    message: string,
    actual_pct: number,
    opt_pct: number,
    added_component?: string,
}

interface OptimizedResult {
    optimized_top5: string[],
    actual_top5: string[],
    predicted_top5: string[],
    percentiles: {
        actual_pct: number,
        optimized_pct: number,
        predicted_pct: number,
    }
    optimization_message: OptimizationMessage,
}

export default function IdentityReport(
    { top_identity_table, expected_vs_actual_rank_table, expected_vs_actual_rank_well_being, optimized_result }:
        {
            top_identity_table: IdentityRow[],
            expected_vs_actual_rank_table: ExpectedIdentityRow[],
            expected_vs_actual_rank_well_being: ExpectedVsActualWellBeingRow[],
            optimized_result: OptimizedResult,
        }) {

    const msg = optimized_result.optimization_message;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const router = useRouter();


    const handleFinalSave = async (userEmail: string | null) => {
        const storedAnswers = sessionStorage.getItem('user_answers');
        if (!storedAnswers) return;

        // const fullPayload = {
        //     email: userEmail || "",
        //     answers: JSON.parse(storedAnswers),
        // };

        const result = await saveToGoogleSheets(storedAnswers, userEmail)

        sessionStorage.removeItem('user_answers');
        router.push('/survey/success');

        
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        console.log("Inside handleEmailSubmit")
        e.preventDefault();
        handleFinalSave(email);
        const reportData = {
            email: email,
            top_identity_table,
            expected_vs_actual_rank_table,
            expected_vs_actual_rank_well_being,
            optimized_result
        }

        const localUrl = 'http://localhost:8000/api/send-report'

        try{
            const response = await fetch(localUrl, {
                "method": 'POST',
                "headers": {"Content-Type": "application/json"},
                "body": JSON.stringify(reportData)
            });

            if (response.ok) {
                // alert("Report will be mailed to you in a few minutes!");
                setIsModalOpen(false);
            }
        } catch(error){
            console.error("Error triggering report:", error);
        }
    };

    const handleSkip = () => {
        handleFinalSave(null);
    };


    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="min-h-screen bg-white text-black">
                <main className="grow w-full max-w-5xl mx-auto py-12 px-6">
                    <header className="mb-10 border-b border-slate-100 pb-6">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Your Identity Report
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Detailed breakdown based on your responses and comparative data.
                        </p>
                    </header>

                    <section>
                        <h2 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                            Top Identity Components
                        </h2>

                        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="p-4 font-semibold text-sm tracking-wider">Identity Component</th>
                                        <th className="p-4 font-semibold text-sm  tracking-wider text-center">Agreement %</th>
                                        <th className="p-4 font-semibold text-sm  tracking-wider text-center">Top 5 %</th>
                                        <th className="p-4 font-semibold text-sm  tracking-wider text-center">Happiness Percentile</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {top_identity_table.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium text-slate-900 italic">
                                                {row.component}
                                            </td>
                                            <td className="p-4 text-center">
                                                {row.agree_pct.toFixed(1)}%
                                            </td>
                                            <td className="p-4 text-center text-slate-500">
                                                {row.top5_pct.toFixed(1)}%
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="inline-flex items-center justify-center w-12 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-100">
                                                    {row.happiness_pct.toFixed(0)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>


                    <section className="mt-16">
                        <h2 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
                            Expected vs. Actual Identity
                        </h2>
                        <p className="text-sm text-slate-500 mb-4">
                            We predicted your priorities based on your personality profile. See how they align with your choices.
                        </p>

                        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="p-4 font-semibold text-sm ">Identity Component</th>
                                        <th className="p-4 font-semibold text-sm  text-center">Predicted Rank</th>
                                        <th className="p-4 font-semibold text-sm  text-center">Actual Rank</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {expected_vs_actual_rank_table.map((row, i) => {
                                        const isMatched = row.actual_rank !== "";
                                        return (
                                            <tr key={i} className={isMatched ? "bg-green-50/30" : ""}>
                                                <td className={`p-4 font-medium ${isMatched ? "text-green-700" : "text-slate-900"}`}>
                                                    {row.component} {isMatched && "★"}
                                                </td>
                                                <td className="p-4 text-center font-mono">#{row.predicted_rank}</td>
                                                <td className="p-4 text-center">
                                                    {isMatched ? (
                                                        <span className="font-bold text-slate-900">#{row.actual_rank}</span>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>


                    <section className='mt-16'>
                        <h2 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                            Expected vs Actual Well Being
                        </h2>

                        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="p-4 font-semibold text-sm tracking-wider">Well Being Category</th>
                                        <th className="p-4 font-semibold text-sm  tracking-wider text-center">Percentile as per Actual Answers</th>
                                        <th className="p-4 font-semibold text-sm  tracking-wider text-center">Percentile as per Predicted Answers</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {expected_vs_actual_rank_well_being.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium text-slate-900 italic">
                                                {row.wellBeingChoice}
                                            </td>
                                            <td className="p-4 text-center">
                                                {row.actualPct.toFixed(1)}%
                                            </td>
                                            <td className="p-4 text-center text-slate-500">
                                                {row.predictedPct.toFixed(1)}%
                                            </td>
                                            {/* <td className="p-4 text-center">
                                                <span className="inline-flex items-center justify-center w-12 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-100">
                                                    {row.happiness_pct.toFixed(0)}
                                                </span>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>


                    <section className='mt-16'>
                        <h2 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                            Happiness Optimization
                        </h2>



                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-8">
                            <HappinessBellCurve
                                actual={optimized_result.percentiles.actual_pct}
                                predicted={optimized_result.percentiles.predicted_pct}
                                optimized={optimized_result.percentiles.optimized_pct}
                            />
                        </div>

                        <div className={`p-6 rounded-xl border-l-4 mb-8 
                        ${msg.case === 1 ? "bg-blue-50 border-blue-500" : "bg-green-50 border-green-50"}`}>
                            <p className='text-lg font-medium text-slate-800 leading-relaxed'>
                                {msg.message}
                            </p>
                        </div>


                        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                            <div className='p-4 rounded-xl border border-slate-200 bg-white shadow-sm'>
                                <p className='text-xs font-bold text-slate-400'>
                                    Current Happiness
                                </p>
                                <p className='text-3xl font-black text-slate-900'>
                                    {msg.actual_pct.toFixed(1)}
                                </p>

                            </div>

                            <div className='p-4 rounded-xl border border-slate-200 bg-white shadow-sm'>
                                <p className='text-xs font-bold text-slate-400'>
                                    Predicted Happiness
                                </p>
                                <p className='text-3xl font-black text-slate-900'>
                                    {optimized_result.percentiles.predicted_pct.toFixed(1)}
                                </p>

                            </div>

                            <div className='p-4 rounded-xl border border-slate-200 bg-white shadow-sm'>
                                <p className='text-xs font-bold text-slate-400'>
                                    Optimized Happiness
                                </p>
                                <p className='text-3xl font-black text-slate-900'>
                                    {optimized_result.percentiles.optimized_pct.toFixed(1)}
                                </p>

                            </div>

                        </div>



                        <div className='overflow-hidden rounded-xl border borders-slate-200 shadow-sm bg-white'>
                            <table className='w-full text-left border-collapse'>
                                <thead>
                                    <tr className='bg-slate-900 text=white'>
                                        <th className='p-4 text-sm font-semibold text-white'>Rank</th>
                                        <th className='p-4 text-sm font-semibold text-white'>Current Ranking</th>
                                        <th className='p-4 text-sm font-semibold text-purple-300'>Predicted Ranking</th>
                                        <th className='p-4 text-sm font-semibold text-green-300'>Optimized Ranking</th>
                                    </tr>
                                </thead>

                                <tbody className='divide-y divide-slate-100'>
                                    {[0, 1, 2, 3, 4].map((i) => (
                                        <tr key={i} className='hover:bg-slate-50 transition-colors'>
                                            <td className='p-4 text-mono text-slate-400'>#{i + 1}</td>
                                            <td className='p-4 text-slate-700 font-medium'>{optimized_result.actual_top5[i]}</td>
                                            <td className='p-4 text-slate-700 font-medium'>{optimized_result.predicted_top5[i]}</td>
                                            <td className='p-4 text-slate-700 font-medium'>
                                                <span className={`font-bold ${!optimized_result.actual_top5.includes(optimized_result.optimized_top5[i]) ?
                                                    "text-green-600" : "text-slate-900"
                                                    }`}>

                                                </span>
                                                {optimized_result.optimized_top5[i]}
                                                {!optimized_result.actual_top5.includes(optimized_result.optimized_top5[i]) && (
                                                    <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">NEW</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>


                    </section>

                    <section className='mt-16'>
                        <div className="mt-16 border-t border-slate-100 pt-10 flex flex-col items-center gap-4 pb-20">
                            <h3 className="text-xl font-bold text-slate-900">Want a copy of this analysis?</h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                                >
                                    Get PDF Report
                                </button>
                                <button
                                    onClick={handleSkip}
                                    className="text-slate-400 font-medium hover:text-slate-600 px-8 py-3 transition"
                                >
                                    Skip
                                </button>
                            </div>
                        </div>

                        {isModalOpen && (
                            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                                    {/* <h2 className="text-2xl font-bold text-slate-900 mb-2">Almost there!</h2> */}
                                    <p className="text-slate-500 mb-6 text-m">
                                        Enter your email to receive your personalized Identity & Happiness PDF report.
                                    </p>
                                    <form onSubmit={handleEmailSubmit}>
                                        <input
                                            type="email"
                                            required
                                            placeholder="name@example.com"
                                            className="w-full border border-slate-200 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-500 outline-none text-black"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <div className="flex flex-col gap-2">
                                            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
                                                Send My Report
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="text-slate-400 text-xs py-2"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </section>



                    {/* <div className="mt-12 h-px bg-slate-100 w-full" /> */}
                </main>

            </main>

            <Footer />

        </div>
    )
}
