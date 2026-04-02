"use client";
import Header from "../components/header"
import Footer from "../components/footer"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveToMailingList } from "../actions/save_user_maliling_list";

export default function SubscribePage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const router = useRouter()
    const [error, setError] = useState("");


    const AddMailingList= async () => {
        // const userData = {
        //     username: name,
        //     email: email,
        // }

        // const localPath = process.env.NEXT_PUBLIC_LOCAL_API_PATH + '/addUserMailingList'
        // const globalPath = process.env.NEXT_PUBLIC_GLOBAL_API_PATH + '/addUserMailingList'

        // try {
        //     const response = await fetch(localPath, {
        //         "method": 'POST',
        //         "headers": { "Content-Type": "application/json" },
        //         "body": JSON.stringify(userData)
        //     });

        //     if (response.ok) {
        //         router.push("/subscribe/success")
        //     } else {
        //         setError("Something went wrong. Please Try Again.");

        //     }
        // } catch (error) {
        //     setError("Something went wrong. Please Try Again.");
        // }
        const result = await saveToMailingList(name, email)
        router.push('/subscribe/success');
    }

    const handleSubscribeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await AddMailingList()

        
    };


    return (

        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <main className="grow flex flex-col items-center bg-slate-50/50 py-10 px-6 max-w-full overflow-x-hidden">
                <div className="w-full max-w-4xl mx-auto py-10">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Subscribe to Us
                        </h1>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-7 md:p-10 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">

                        {/* <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 via-indigo-600 to-purple-500"></div> */}
                        <form onSubmit={handleSubscribeSubmit} className="p-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block mb-1.5 text-sm font-semibold text-slate-700">
                                        Full Name <span className="text-slate-400 font-normal">(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Alex Johnson"
                                        className="w-full border border-blue-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-900 outline-none text-slate-900 transition-all placeholder:text-slate-300"
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
                                        className="w-full border border-blue-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-900 outline-none text-slate-900 transition-all placeholder:text-slate-300"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>


                            </div>

                            <div className="mt-8 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                                >

                                    Subscribe to Mailing List
                                </button>
                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                            </div>
                        </form>


                    </div>



                </div>
            </main>
            <Footer />
        </div>
    )

}

