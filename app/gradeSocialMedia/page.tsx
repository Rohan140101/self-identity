"use client";
import Header from "../components/header"
import Footer from "../components/footer"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveSocialMediaBio } from "../actions/save_social_media_bio";
import { Reveal } from "../components/Reveal";
export default function GradeSocialPage() {
    const [socialMediaBio, setSocialMediaBio] = useState("");
    // const [name, setName] = useState("");
    const router = useRouter()
    const [error, setError] = useState("");
    const [twitterId, setTwitterId] = useState("");
    const [instagramId, setInstagramId] = useState("");
    const [facebookId, setFacebookId] = useState("")
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [consent, setConsent] = useState("yes");


    const AddSocialMediaBio = async () => {
        try{
            await saveSocialMediaBio(socialMediaBio, instagramId, facebookId, twitterId, email, name, consent);
            router.push('/gradeSocialMedia/success');
        } catch (error) {
            console.error("Failed to save:", error);
        }
        
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // await AddSocialMediaBio()
        setIsEmailModalOpen(true)


    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        console.log("Inside handleEmailSubmit")
        e.preventDefault();
        try {
            await AddSocialMediaBio();
            setIsEmailModalOpen(false);
            
            const data = {
                user_name: name,
                user_email: email,
                instagramId: instagramId,
                facebookId: facebookId,
                twitterId: twitterId,
                bio: socialMediaBio,
            };
            const path = process.env.NEXT_PUBLIC_API_PATH + '/mail_grade_social_media_results';
            fetch(path, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }).catch(err => console.error("Background email failed:", err));
        } catch (error) {
            console.error("Critical Save Error:", error);
        }

    };

    return (

        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/**Importing Header */}
            <Header />
            <main className="grow flex items-center justify-center bg-slate-50/50 py-10 px-6">
                <div className="max-w-4xl w-full">
                    <Reveal delay={0.2}>
                        <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Grade Your Social Media Bio
                        </h1>
                    </div>
                    </Reveal>
                    
                    <Reveal delay={0.4}>
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-0.5 sm:p-7 md:p-10 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">

                        {/* <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 via-indigo-600 to-purple-500"></div> */}
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block mb-1.5 text-sm font-semibold text-slate-700 items-center gap-2">
                                            <span className="text-pink-600">Instagram</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="@username"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 outline-none text-slate-900 transition-all placeholder:text-slate-300 bg-slate-50/50 focus:bg-white"
                                            onChange={(e) => setInstagramId(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                                            <span className="text-(--brand-hover)">Facebook</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Profile URL or ID"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/10 focus:border-(--brand-hover) outline-none text-slate-900 transition-all placeholder:text-slate-300 bg-slate-50/50 focus:bg-white"
                                            onChange={(e) => setFacebookId(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                                            Twitter (X)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="@handle"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-slate-500/10 focus:border-black outline-none text-slate-900 transition-all placeholder:text-slate-300 bg-slate-50/50 focus:bg-white"
                                            onChange={(e) => setTwitterId(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <hr className="border-slate-100 my-2" />

                                <div>
                                    <label className="block mb-1.5 text-m font-semibold text-slate-700">
                                        Social Media Bio
                                    </label>
                                    <textarea
                                        required
                                        placeholder="Paste your bio here to help us analyze your identity..."
                                        rows={4}
                                        className="w-full border border-blue-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-slate-900 transition-all placeholder:text-slate-300 bg-slate-50/30 focus:bg-white"
                                        onChange={(e) => setSocialMediaBio(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 hover:bg-(--brand-hover) text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]"
                                >
                                    Submit Profiles
                                </button>
                                {error && <p className="text-red-500 text-sm mt-2 text-center font-medium">{error}</p>}
                            </div>
                        </form>


                    </div>
                    </Reveal>
                    



                </div>
                {isEmailModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto transition-all">
                        <div className="bg-white rounded-4xl sm:rounded-3xl max-w-md w-full my-auto shadow-2xl overflow-hidden border border-slate-100 relative">
                            <div className="bg-linear-to-br from(--brand-hover) to-indigo-700 p-6 sm:p-8 text-center">
                                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full mb-3 sm:mb-4">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Ready to see your Social Media Bio Grading?</h2>
                                <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-65 mx-auto">
                                    Enter your details to receive your Social Media Bio Grade.
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
            </main>
            <Reveal delay={1}>
                <Footer />
            </Reveal>
            
        </div>
    )

}

