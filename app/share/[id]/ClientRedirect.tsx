"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/header"
import Footer from "../../components/footer"

export default function ClientRedirect({ id }: { id: string }) {
    const router = useRouter();
    const imageUrl = `https://self-identity-image-storage.s3.amazonaws.com/${id}_Happy.png`;



    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <main className="grow flex flex-col items-center bg-slate-50/50 py-10 px-6 max-w-full overflow-x-hidden">
                <div className="w-full max-w-5xl mx-auto py-10">
                    <div className="mb-10 flex flex-col items-center pb-8 border-b border-slate-100">

                        <div className="hidden sm:block sm:col-span-1"></div>

                        <div className="text-center sm:col-span-3">
                            <h1 className="text-4xl md:text-5xl  font-extrabold text-slate-900 tracking-tight">
                                Identity Analysis Result
                            </h1>
                        </div>

                        <div className="space-y-4 mt-6 items-center">
                            <img
                                src={imageUrl}
                                alt="Identity Chart"
                                className="max-w-full h-auto rounded-lg shadow-xl mb-6 border"
                            />

                            <div className="space-x-4">
                                <button
                                    onClick={() => router.push('/')}
                                    className="bg-blue-900 hover:bg-blue-600 transition-all duration-200 text-white px-6 py-2 rounded-full font-bold"
                                >
                                    Take the Survey Yourself
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>




    );
}
