// app/components/survey/IdentityReport.tsx
import Header from '../header';
import Footer from '../footer';
import HappinessBellCurve from './HappinessBellCurve';
import { act, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveToGoogleSheets } from '@/app/actions/save-survey';
import reportCatDescriptions from "@/data/reportCatDescriptions.json"
import { time } from 'console';

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

// Function for Showing Message below the Bell Curve
const HighlightedMessage = ({ msg, wb_cat_name }: { msg: any, wb_cat_name: string }) => {
    const styles = {
        variable: "text-purple-600 font-bold",
        category: "text-(--brand-hover) font-bold",
        number: "text-black font-bold",
    };

    const renderMessage = () => {
        const { case: msgCase, actual_pct, opt_pct, added_component } = msg;

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


// Function For Showing the Complete Bell Curve and Identity Optimization Element
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

            <p className="text-slate-800 italic font-bold mt-2 pb-10">
                Our model uses the answers you gave on our <a target="_blank" href='https://www.self-identity.me/' className='text-(--brand-dark) hover:text-(--brand-hover) underline font-black'>identity survey</a> to make inferences about several aspects of your personality and well-being. For each of these attributes (happiness, goodness, success, resilience, extrovertedness), we show where you sit relative to the U.S. population, and where you could be with minor changes in the identity components which you prioritize.  Identities that revolve around interactions with other people, including family, religion, and work, generally serve to help increase well-being.
            </p>

            {/* Making Toggle Buttons for different Well Being Categories */}

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

            {/* Printing Definition of Selected Well Being Category */}

            <div className={"p-6 rounded-xl border-l-4 mb-8 shadow-sm bg-yellow-50 border-yellow-500"}>
                <span className='text-lg font-bold text-purple-600 leading-relaxed'>
                    {catDesc.category + " "}
                </span>
                <span className='text-lg font-medium text-slate-800 leading-relaxed'>
                    {catDesc.definition}
                </span>

            </div>

            {/* Making Bell Curve for Selectied Well Being Category */}
            <div className="bg-slate-50 rounded-xl p-1 sm:p-4 border border-slate-100 mb-8">
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

            {/* Showing Message for Selected Well Being Category */}

            <HighlightedMessage msg={msg}
                wb_cat_name={catDesc.category} />


            {/* Showing Current and Better Identity for User */}
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

// Function for Identity Report
export default function IdentityReport(
    { top_identity_table, expected_vs_actual_rank_table, expected_vs_actual_rank_well_being, optimized_result }:
        {
            top_identity_table: IdentityRow[],
            expected_vs_actual_rank_table: ExpectedIdentityRow[],
            expected_vs_actual_rank_well_being: ExpectedVsActualWellBeingRow[],
            optimized_result: AllOptimizedData,
        }) {

    // const msg = optimized_result.optimization_message;
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isSMShareModalOpen, setIsSMShareModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [consent, setConsent] = useState("yes");
    const [shareStatus, setShareStatus] = useState<'idle' | 'loading' | 'success'>('idle')
    const [finalTwitterUrl, setFinalTwitterUrl] = useState("");
    const [finalFacebookUrl, setFinalFacebookUrl] = useState("");
    const [finalLinkedinUrl, setFinalLinkedinUrl] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("");
    const router = useRouter();

    // Function for saving survey
    const handleFinalSave = async (userEmail: string | null, userName: string | null, researchConsent: string | null) => {
        const storedAnswers = sessionStorage.getItem('user_answers');
        if (!storedAnswers) return;

        // const fullPayload = {
        //     email: userEmail || "",
        //     answers: JSON.parse(storedAnswers),
        // };
        const result = await saveToGoogleSheets(storedAnswers, userEmail, userName, researchConsent)

        sessionStorage.removeItem('user_answers');


    };


    // Function for handling Email Submit in Modal
    const handleEmailSubmit = async (e: React.FormEvent) => {
        console.log("Inside handleEmailSubmit")
        e.preventDefault();
        setIsLoading(true);
        try {
            await handleFinalSave(email, name, consent);
            setIsEmailModalOpen(false);
            setIsSMShareModalOpen(true);
            setIsLoading(false);
            const reportData = {
                username: name,
                email,
                top_identity_table,
                expected_vs_actual_rank_table,
                expected_vs_actual_rank_well_being,
                optimized_result
            };
            const path = process.env.NEXT_PUBLIC_API_PATH + '/send-report';
            fetch(path, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reportData)
            }).catch(err => console.error("Background email failed:", err));
        } catch (error) {
            console.error("Critical Save Error:", error);
            setIsLoading(false);
        }

        setIsLoading(true)
        const reportData = {
            username: name,
            email: email,
            top_identity_table,
            expected_vs_actual_rank_table,
            expected_vs_actual_rank_well_being,
            optimized_result
        }

    };

    // Handle Skip selection in Modal
    const handleSkip = () => {
        handleFinalSave(null, null, null);
        setIsEmailModalOpen(false);
        setIsSMShareModalOpen(true);
    };


    // Handle Social Media Sharing of Result
    const handleSMShareSubmit = async (platform: string) => {
        const domain = "https://self-identity.me";
        setShareStatus("loading")
        setIsLoading(true);
        setSelectedPlatform(platform);
        const data = {
            email: email,
            optimized_result
        }
        const path = process.env.NEXT_PUBLIC_API_PATH + '/share_social_media'
        try {
            const response = await fetch(path, {
                "method": 'POST',
                "headers": { "Content-Type": "application/json" },
                "body": JSON.stringify(data)
            });

            if (response.ok) {
                // Reredictectinng to SM
                const result = await response.json();
                const firstImageUrl = Object.values(result.image_urls)[0] as string;
                const fileName = firstImageUrl.split('/').pop()
                const hash = fileName?.split('_')[0];
                const msg = result.sm_msg
                const sharePageUrl = `https://self-identity.me/share/${hash}`;
                const smText = encodeURIComponent(
                    `I just analyzed my Self-Identity Profile!\n\n${msg}\n\nAnalyze yourself today at ${domain}\n\n`
                );
                if (platform === "twitter") {
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${smText}&url=${encodeURIComponent(sharePageUrl)}`;
                    setFinalTwitterUrl(twitterUrl)
                    setShareStatus("success")

                } else if (platform === "facebook") {
                    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePageUrl)}`;
                    setFinalFacebookUrl(fbUrl)
                    setShareStatus("success")
                } else if (platform === "linkedin") {
                    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePageUrl)}`;
                    setFinalLinkedinUrl(linkedinUrl)
                    setShareStatus("success")
                }

            }
        } catch (error) {
            console.error("Error triggering report:", error);

            setShareStatus("idle")
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/**Importing Header */}
            <Header />
            <main className="grow flex flex-col items-center bg-slate-50/50 px-4 sm:px-6 max-w-full overflow-x-hidden">
                <div className='w-full max-w-4xl mx-auto'>
                    <section className='mt-16'>
                        {/* <div className="mt-16 mb-20 px-6 bg-slate-50 border border-slate-200 rounded-3xl text-center shadow-sm relative overflow-hidden">
                            <div className='relative z-10 space-y-6'>
                                <div className='space-y-2'>
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Get a copy of this analysis?</h3>
                                </div>
                            </div>


                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-(--brand-hover) text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-200 active:scale-95"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                    </svg>
                                    Get PDF Report
                                </button>
                                <button
                                    onClick={handleSkip}
                                    className="w-full sm:w-auto text-slate-400 font-medium hover:text-slate-600 px-6 py-4 transition-colors rounded-xl hover:bg-slate-100"
                                >
                                    Skip
                                </button>
                            </div>
                        </div>
                         */}

                        <div className="mb-10 px-3 sm:px-6">
                            <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-10 text-center shadow-sm relative overflow-hidden">

                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                <div className="relative z-10 space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                            Get your Identity Report
                                        </h3>
                                        <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                            Get a comprehensive PDF copy of your analysis delivered to your email id.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <button
                                            onClick={() => setIsEmailModalOpen(true)}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-(--brand-hover) text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-200 active:scale-95"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                            </svg>
                                            Get Full PDF Report
                                        </button>

                                        <button
                                            onClick={handleSkip}
                                            className="w-full sm:w-auto text-slate-400 font-semibold hover:text-slate-600 px-6 py-4 rounded-xl hover:bg-slate-100 transition-colors"
                                        >
                                            Skip
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </section>
                    <header className="mb-10 border-b border-slate-100 pb-6">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Your Identity Report
                        </h1>

                    </header>

                    {/* Showing the Identity Optimization Block*/}
                    <ComprehensiveOptimization allOptimizedData={optimized_result} />


                    {/* Showing the Expected vs Actual Identity*/}
                    <section className="mt-16">
                        <h2 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
                            Expected vs. Actual Identity
                        </h2>
                        <p className="text-slate-800 italic font-bold mt-2 pb-10">
                            We formed an idea about how strongly you would value different facets of your identity based on our understanding of you. This did not completely predict the five identity components that you selected. Compare our models sense of you with your self-declared identity.

                        </p>


                        {/* Showing table of Expected vs Actual Identity*/}
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






                    <section className='mt-16'>
                        {/* <div className="mt-16 mb-20 px-6 bg-slate-50 border border-slate-200 rounded-3xl text-center shadow-sm relative overflow-hidden">
                            <div className='relative z-10 space-y-6'>
                                <div className='space-y-2'>
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Get a copy of this analysis?</h3>
                                </div>
                            </div>


                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-(--brand-hover) text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-200 active:scale-95"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                    </svg>
                                    Get PDF Report
                                </button>
                                <button
                                    onClick={handleSkip}
                                    className="w-full sm:w-auto text-slate-400 font-medium hover:text-slate-600 px-6 py-4 transition-colors rounded-xl hover:bg-slate-100"
                                >
                                    Skip
                                </button>
                            </div>
                        </div>
                         */}

                        <div className="mt-20 mb-20 px-3 sm:px-6">
                            <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-10 text-center shadow-sm relative overflow-hidden">

                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                <div className="relative z-10 space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                            Get your Identity Report
                                        </h3>
                                        <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                            Get a comprehensive PDF copy of your analysis delivered to your email id.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <button
                                            onClick={() => setIsEmailModalOpen(true)}
                                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-(--brand-hover) text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-200 active:scale-95"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                            </svg>
                                            Get Full PDF Report
                                        </button>

                                        <button
                                            onClick={handleSkip}
                                            className="w-full sm:w-auto text-slate-400 font-semibold hover:text-slate-600 px-6 py-4 rounded-xl hover:bg-slate-100 transition-colors"
                                        >
                                            Skip
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/*Modal for Identity Report*/}
                        {isEmailModalOpen && (
                            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto transition-all">
                                <div className="bg-white rounded-4xl sm:rounded-3xl max-w-md w-full my-auto shadow-2xl overflow-hidden border border-slate-100 relative">
                                    <div className="bg-linear-to-br from(--brand-hover) to-indigo-700 p-6 sm:p-8 text-center">
                                        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full mb-3 sm:mb-4">
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Ready to see your report?</h2>
                                        <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-65 mx-auto">
                                            Enter your details to receive your personalized Identity report PDF.
                                        </p>
                                    </div>

                                    <form onSubmit={handleEmailSubmit} className="p-6 sm:p-8">
                                        <div className="space-y-4 sm:space-y-5">
                                            <div>
                                                <label className="block mb-1 text-sm font-semibold text-slate-700">
                                                    Full Name <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Alex Johnson"
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-base text-slate-900 transition-all placeholder:text-slate-300"
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block mb-1 text-sm font-semibold text-slate-700">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    placeholder="name@example.com"
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-base text-slate-900 transition-all placeholder:text-slate-300"
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <label className="block mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                    Research Contribution
                                                </label>
                                                <p className="text-[11px] text-slate-500 mb-3 leading-snug">
                                                    May we use your anonymized data for scientific research purposes?
                                                </p>
                                                <div className="flex gap-6">
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            name="consent"
                                                            value="yes"
                                                            defaultChecked
                                                            className="w-4 h-4 text-(--brand-hover) focus:ring-blue-500"
                                                            onChange={(e) => setConsent(e.target.value)}
                                                        />
                                                        <span className="text-sm font-medium text-slate-700">Yes</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer group">
                                                        <input
                                                            type="radio"
                                                            name="consent"
                                                            value="no"
                                                            className="w-4 h-4 text-(--brand-hover) focus:ring-blue-500"
                                                            onChange={(e) => setConsent(e.target.value)}
                                                        />
                                                        <span className="text-sm font-medium text-slate-700">No</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 sm:mt-8 flex flex-col gap-2">
                                            <button
                                                type="submit"
                                                className="w-full bg-(--brand-hover) hover:bg-blue-700 text-white py-3.5 sm:py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98] text-sm sm:text-base"
                                            >
                                                Generate & Send My Report
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEmailModalOpen(false)}
                                                className="text-slate-400 hover:text-slate-600 text-xs sm:text-sm font-medium py-2 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}



                        {/* Modal for Social Media Sharing*/}
                        {isSMShareModalOpen && (
                            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
                                <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
                                    <div className={`${shareStatus === 'success' ? 'bg-green-600' : 'bg-linear-to-br from-purple-600 to-indigo-700'} p-8 text-center text-white transition-colors duration-500`}>
                                        <h2 className="text-2xl font-bold mb-2">
                                            {shareStatus === 'success' ? 'Ready to Post!' : 'Share your Results'}
                                        </h2>
                                        <p className="text-white/80 text-sm">
                                            {shareStatus === 'success' ? 'Check your new browser tab to finish sharing.' : 'Help our research by sharing your results on Social Media.'}
                                        </p>
                                    </div>

                                    <div className="p-8">
                                        {shareStatus === "idle" && (
                                            <div className="space-y-4">
                                                <button
                                                    onClick={() => handleSMShareSubmit('twitter')}
                                                    className="w-full flex items-center justify-center gap-3 bg-[#000000] text-white py-4 rounded-xl font-bold transition-all scale-95 hover:scale-100 duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                                                >
                                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                    </svg>
                                                    Share on Twitter
                                                </button>
                                                <button
                                                    onClick={() => handleSMShareSubmit('facebook')}
                                                    className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-4 rounded-xl font-bold transition-all scale-95 hover:scale-100 duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                                                >
                                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                    </svg>
                                                    Share on Facebook
                                                </button>
                                                <button
                                                    onClick={() => handleSMShareSubmit('linkedin')}
                                                    className="w-full flex items-center justify-center gap-3 bg-[#0077B5] text-white py-4 rounded-xl font-bold transition-all scale-95 hover:scale-100 duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                                                >
                                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                                        <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z" />
                                                    </svg>
                                                    Share on LinkedIn
                                                </button>


                                                <button
                                                    onClick={() => router.push('/survey/success')}
                                                    className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 py-4 rounded-xl font-bold transition-all scale-95 hover:scale-100 duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                                                >
                                                    Skip
                                                </button>
                                            </div>
                                        )}

                                        {shareStatus === 'loading' && selectedPlatform === "twitter" && (
                                            <div className="text-center py-10">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                                <p className="text-slate-600 font-medium">Generating your tweet...</p>
                                            </div>
                                        )}

                                        {shareStatus === 'loading' && selectedPlatform === "facebook" && (
                                            <div className="text-center py-10">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                                <p className="text-slate-600 font-medium">Generating your Facebook Post...</p>
                                            </div>
                                        )}

                                        {shareStatus === 'loading' && selectedPlatform === "linkedin" && (
                                            <div className="text-center py-10">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                                                <p className="text-slate-600 font-medium">Generating your Linkedin Post...</p>
                                            </div>
                                        )}

                                        {shareStatus === 'success' && selectedPlatform === "twitter" && (
                                            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                                <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center mb-4">
                                                    <p className="text-green-700 text-sm font-medium">Your tweet is ready!</p>
                                                </div>

                                                <a
                                                    href={finalTwitterUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => {
                                                        setTimeout(() => router.push('/survey/success'), 3000);
                                                    }}
                                                    className="w-full flex items-center justify-center bg-black text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
                                                >
                                                    Share Tweet
                                                </a>

                                                <button
                                                    onClick={() => router.push('/survey/success')}
                                                    className="w-full text-slate-400 text-sm"
                                                >
                                                    Skip
                                                </button>
                                            </div>
                                        )}

                                        {shareStatus === 'success' && selectedPlatform === "facebook" && (
                                            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                                <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center mb-4">
                                                    <p className="text-green-700 text-sm font-medium">Your Facebook Post is ready!</p>
                                                </div>

                                                <a
                                                    href={finalFacebookUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => {
                                                        setTimeout(() => router.push('/survey/success'), 3000);
                                                    }}
                                                    className="w-full flex items-center justify-center bg-black text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
                                                >
                                                    Share Facebook Post
                                                </a>

                                                <button
                                                    onClick={() => router.push('/survey/success')}
                                                    className="w-full text-slate-400 text-sm"
                                                >
                                                    Skip
                                                </button>
                                            </div>
                                        )}

                                        {shareStatus === 'success' && selectedPlatform === "linkedin" && (
                                            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                                <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center mb-4">
                                                    <p className="text-green-700 text-sm font-medium">Your LinkedIn Post is ready!</p>
                                                </div>

                                                <a
                                                    href={finalLinkedinUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => {
                                                        setTimeout(() => router.push('/survey/success'), 3000);
                                                    }}
                                                    className="w-full flex items-center justify-center bg-black text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
                                                >
                                                    Share LinkedIn Post
                                                </a>

                                                <button
                                                    onClick={() => router.push('/survey/success')}
                                                    className="w-full text-slate-400 text-sm"
                                                >
                                                    Skip
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>




                {/* <div className="mt-12 h-px bg-slate-100 w-full" /> */}

            </main>

            <Footer />

        </div>
    )
}