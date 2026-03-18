// app/components/survey/IdentityReport.tsx
import Header from '../header';
import Footer from '../footer';
import HappinessBellCurve from './HappinessBellCurve';
import { act, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveToGoogleSheets } from '@/app/actions/save-survey';
import reportCatDescriptions from "@/data/reportCatDescriptions.json"

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


interface AllOptimizedData {
    [categoryKey: string]: OptimizedResult;
}

interface ComprehensiveOptimizationProps {
    allOptimizedData: AllOptimizedData;
}


const HighlightedMessage = ({ msg, wb_cat_name }: { msg: any, wb_cat_name: string }) => {
    const styles = {
        variable: "text-purple-600 font-bold",
        category: "text-blue-600 font-bold",
        number: "text-black font-bold",
    };

    const renderMessage = () => {
        const { case: msgCase, actual_pct, opt_pct, added_component } = msg;

        // Format percentiles to 1 decimal place
        const actual = <span className={styles.number}>{actual_pct.toFixed(1)}th</span>;
        const opt = <span className={styles.number}>{opt_pct.toFixed(1)}th</span>;
        const variable = <span className={styles.variable}>{wb_cat_name}</span>;

        switch (msgCase) {
            case 1:
                return (
                    <>Your current identity ranking is already optimized for {variable}! You are in the {actual} percentile.</>
                );
            case 2:
                return (
                    <>By simply reprioritizing your current identities, you could move from the {actual} to the {opt} percentile of {variable}.</>
                );
            case 3:
                return (
                    <>By incorporating <span className={styles.category}>{added_component}</span> into your top priorities, you could significantly boost your {variable} percentile from {actual} to {opt}.</>
                );
            default:
                return msg.message;
        }
    };

    return (
        <div className={`p-6 rounded-xl border-l-4 mb-8 shadow-sm transition-all
      ${msg.case === 1 ? "bg-blue-50 border-blue-500" : "bg-green-50 border-green-500"}`}>
            <p className="text-lg font-medium text-slate-800 leading-relaxed">
                {renderMessage()}
            </p>
        </div>
    );
};

const ComprehensiveOptimization: React.FC<ComprehensiveOptimizationProps> = ({ allOptimizedData }) => {

    console.log("Here2: ", allOptimizedData)
    const categories = Object.keys(allOptimizedData);
    const [activeTab, setActiveTab] = useState(categories[0]);

    const current = allOptimizedData[activeTab];
    const msg = current.optimization_message;
    const key = activeTab as keyof typeof reportCatDescriptions
    const catDesc = reportCatDescriptions[key] || ""

    return (
        <section className='mt-16'>
            <h2 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                Identity Optimization Analysis
            </h2>

            <p className="text-slate-700 mt-2 pb-10">
                Now that we know the aspects of your personal identity that you feel are most important, we can make inferences about several aspects of your personality and well-being.   For each of these attributes (happiness, goodness, success, resilience, extrovertedness) we show where you sit relative to the U.S. population, and where you could be with minor changes in which identity components you prioritize.
            </p>



            <div className="flex flex-wrap gap-2 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === cat
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={"p-6 rounded-xl border-l-4 mb-8 shadow-sm bg-yellow-50 border-yellow-500"}>
                <span className='text-lg font-bold text-purple-600 leading-relaxed'>
                    {catDesc.category + " "}
                </span>
                <span className='text-lg font-medium text-slate-800 leading-relaxed'>
                    {catDesc.definition}
                </span>

            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-8">
                <HappinessBellCurve
                    actual={current.percentiles.actual_pct}
                    optimized={current.percentiles.optimized_pct}
                />
            </div>

            {/* <div className={`p-6 rounded-xl border-l-4 mb-8 shadow-sm
        ${msg.case === 1 ? "bg-blue-50 border-blue-500" : "bg-green-50 border-green-500"}`}>
                <p className='text-lg font-medium text-slate-800 leading-relaxed'>
                    {msg.message}
                </p>
            </div> */}

            <HighlightedMessage msg={msg}
                wb_cat_name={catDesc.category} />

            <div className='overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white'>
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='bg-slate-900'>
                            <th className='p-4 text-sm font-semibold text-white'>Rank</th>
                            <th className='p-4 text-sm font-semibold text-white'>Your Current Identity</th>
                            <th className='p-4 text-sm font-semibold text-green-300'>Better Identity for You</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-100'>
                        {[0, 1, 2, 3, 4].map((i) => (
                            <tr key={i} className='hover:bg-slate-50 transition-colors'>
                                <td className='p-4 font-mono text-slate-400'>#{i + 1}</td>
                                <td className='p-4 text-slate-700 font-medium'>{current.actual_top5[i]}</td>
                                <td className='p-4 text-slate-700 font-medium'>
                                    <span className={`font-bold ${!current.actual_top5.includes(current.optimized_top5[i]) ? "text-green-600" : "text-slate-900"}`}>
                                        {current.optimized_top5[i]}
                                    </span>
                                    {!current.actual_top5.includes(current.optimized_top5[i]) && (
                                        <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">NEW</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};


export default function IdentityReport(
    { top_identity_table, expected_vs_actual_rank_table, expected_vs_actual_rank_well_being, optimized_result }:
        {
            top_identity_table: IdentityRow[],
            expected_vs_actual_rank_table: ExpectedIdentityRow[],
            expected_vs_actual_rank_well_being: ExpectedVsActualWellBeingRow[],
            optimized_result: AllOptimizedData,
        }) {

    // const msg = optimized_result.optimization_message;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [consent, setConsent] = useState("");
    const router = useRouter();


    const handleFinalSave = async (userEmail: string | null, userName: string | null, researchConsent: string | null) => {
        const storedAnswers = sessionStorage.getItem('user_answers');
        if (!storedAnswers) return;

        // const fullPayload = {
        //     email: userEmail || "",
        //     answers: JSON.parse(storedAnswers),
        // };

        const result = await saveToGoogleSheets(storedAnswers, userEmail, userName, researchConsent)

        sessionStorage.removeItem('user_answers');
        router.push('/survey/success');


    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        console.log("Inside handleEmailSubmit")
        e.preventDefault();
        handleFinalSave(email, name, consent);
        const reportData = {
            username: name,
            email: email,
            top_identity_table,
            expected_vs_actual_rank_table,
            expected_vs_actual_rank_well_being,
            optimized_result
        }

        const localPath = process.env.NEXT_PUBLIC_LOCAL_API_PATH + '/send-report'
        const globalPath = process.env.NEXT_PUBLIC_GLOBAL_API_PATH + '/send-report'

        try {
            const response = await fetch(localPath, {
                "method": 'POST',
                "headers": { "Content-Type": "application/json" },
                "body": JSON.stringify(reportData)
            });

            if (response.ok) {
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error("Error triggering report:", error);
        }
    };

    const handleSkip = () => {
        handleFinalSave(null, null, null);
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

                    </header>

                    <ComprehensiveOptimization allOptimizedData={optimized_result} />
                    {/* 
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
                    </section> */}


                    <section className="mt-16">
                        <h2 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
                            Expected vs. Actual Identity
                        </h2>
                        <p className="text-slate-700 mt-2 pb-10">
                            We formed an idea about how strongly you would value different facets of your identity based on our understanding of you. This did not completely predict the five identity components that you selected. Compare our models sense of you with your self-declared identity.

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


                    <section className='mt-16 hidden'>
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


                    {/* <section className='mt-16'>
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


                    </section> */}




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
                            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
                                <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
                                    <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Ready to see your report?</h2>
                                        <p className="text-blue-100 text-sm leading-relaxed">
                                            Enter your details to receive your personalized Identity report PDF.
                                        </p>
                                    </div>

                                    <form onSubmit={handleEmailSubmit} className="p-8">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                                                    Full Name <span className="text-slate-400 font-normal">(Optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Alex Johnson"
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900 transition-all placeholder:text-slate-300"
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="name@example.com"
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900 transition-all placeholder:text-slate-300"
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <label className="block mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Research Contribution
                                                </label>
                                                <p className="text-xs text-slate-500 mb-3 leading-tight">
                                                    May we use your anonymized data for scientific research purposes?
                                                </p>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            name="consent"
                                                            value="yes"
                                                            defaultChecked
                                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                            onChange={(e) => setConsent(e.target.value)}
                                                        />
                                                        <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">Yes</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            name="consent"
                                                            value="no"
                                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                            onChange={(e) => setConsent(e.target.value)}
                                                        />
                                                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-500">No</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex flex-col gap-3">
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                                            >
                                                Generate & Send My Report
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="text-slate-400 hover:text-slate-600 text-sm font-medium py-2 transition-colors"
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
