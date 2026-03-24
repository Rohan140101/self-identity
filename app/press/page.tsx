import Header from "../components/header"
import Footer from "../components/footer"
import pressDataJson from "@/data/pressData.json"
import { Mail } from "lucide-react"

export default function PressPage() {
    const key = "pressData" as keyof typeof pressDataJson
    const pressData = pressDataJson[key] || []

    const getText = (source: string, author: string, date: string) => {
        let text = ""
        if (source) text += source + ", "
        if (author) text += author + ", "
        if (date) text += date 
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
                            Press
                        </h1>
                    </div>

                    <div className="flex flex-col bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden mb-20 mx-auto max-w-xl">
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
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-slate-800 px-4 mb-4">Recent News</h2>
                        <ul className="space-y-4">
                            {pressData.map((dataObj, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-md hover:shadow-slate-200/40 border border-transparent hover:border-slate-200 transition-all duration-300 group"
                                >
                                    <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform shrink-0"></div>

                                    <div className="flex flex-wrap items-baseline gap-x-3">
                                        <a href={dataObj.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-lg font-bold text-blue-900 group-hover:text-blue-600 transition-colors duration-200 leading-snug"
                                        >
                                            {dataObj.title}
                                        </a>
                                        <span className="text-m text-slate-500 italic whitespace-nowrap">
                                            {getText(dataObj.source, dataObj.author, dataObj.date)}

                                        </span>
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