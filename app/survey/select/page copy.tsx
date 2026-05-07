import Link from "next/link";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function SurveySelection() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/**Importing Header */}
            <Header />
            <main className="min-h-screen bg-white text-black">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50">
                    <h1 className="text-3xl font-bold text-(--brand-dark) mb-8">
                        Choose Your Journey
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                        <Link className="group" href="/survey?type=short">
                            <div className="p-8 bg-white border-2 border-transparent hover:border-(--brand-dark) rounded-2xl shadow-sm transition-all text-center cursor-pointer h-full">
                                <h2 className="text-xl font-bold mb-2">
                                    Short Version
                                </h2>
                                <p className="text-gray-500 mb-4">
                                    3 minutes
                                </p>
                                <span className="text-(--brand-dark) font-semibold group-hover:underline">
                                    Start Test
                                </span>
                            </div>
                        </Link>

                        <Link className="group" href="/survey?type=long">
                            <div className="p-8 bg-white border-2 border-transparent hover:border-(--brand-dark) rounded-2xl shadow-sm transition-all text-center cursor-pointer h-full">
                                <h2 className="text-xl font-bold mb-2">
                                    Long Version
                                </h2>
                                <p className="text-gray-500 mb-4">
                                    15 minutes
                                </p>
                                <span className="text-(--brand-dark) font-semibold group-hover:underline">
                                    Start Test
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}