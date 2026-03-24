import Header from "../components/header"
import Footer from "../components/footer"
import paperDataJson from "@/data/paperData.json"
import sourcesDataJson from "@/data/sourcesData.json"

import { Mail } from "lucide-react"

export default function PressPage() {
    const key = "papers" as keyof typeof paperDataJson
    const papers = paperDataJson[key] || []

    const key1 = "sources"  as keyof typeof sourcesDataJson
    const sources = sourcesDataJson[key1] || []

    const getText = (venue: string, author: string) => {
        let text = ""
        if (author) text += author + ", "
        if (venue) text += venue
        text += "."
        return text
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <main className="grow flex flex-col items-center bg-slate-50/50 py-10 px-6">
                <div className="w-full mx-auto py-10">

                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Data
                        </h1>
                    </div>

                    {/* <div className="flex flex-col bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden mb-20 mx-auto max-w-xl">
                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em]">
                                    Stay Updated
                                </h3>
                                <p className="text-slate-500 text-base leading-relaxed max-w-sm mx-auto">
                                    Subscribe to receive the latest updates on research, publications, and media coverage.
                                </p>
                            </div>

                            <a href="/subscribe"
                                className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-blue-100 active:scale-95"
                            >
                                <Mail size={18} className="opacity-80" />
                                Join Mailing List
                            </a>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-slate-100/50 rounded-full z-0"></div>
                    </div> */}

                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-slate-800 px-4 mb-6">Sources</h2>
                        <ul className="space-y-4"> 
                            {sources.map((dataObj, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-md hover:shadow-slate-200/40 border border-transparent hover:border-slate-200 transition-all duration-300 group"
                                >
                                    <div className="mt-2.5 w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform shrink-0"></div>

                                    <div className="flex flex-col space-y-1">
                                        <a
                                            href={dataObj.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xl font-black text-blue-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight"
                                        >
                                            {dataObj.title}
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-8 mt-16">
                        <h2 className="text-3xl font-bold text-slate-800 px-4 mb-6">Recent Papers</h2>
                        <ul className="space-y-4"> 
                            {papers.map((dataObj, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-md hover:shadow-slate-200/40 border border-transparent hover:border-slate-200 transition-all duration-300 group"
                                >
                                    <div className="mt-2.5 w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform shrink-0"></div>

                                    <div className="flex flex-col space-y-1">
                                        <a
                                            href={dataObj.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xl font-black text-blue-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight"
                                        >
                                            {dataObj.title}
                                        </a>

                                        <p className="text-md font-medium text-slate-700 italic">
                                            {dataObj.authors}
                                        </p>

                                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                                            {dataObj.venue}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
            <Footer />
        </div>

    )
}