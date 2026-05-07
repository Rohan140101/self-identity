import Header from "../components/header"
import Footer from "../components/footer"
import paperDataJson from "@/data/paperData.json"
import sourcesDataJson from "@/data/sourcesData.json"
import { Reveal } from "../components/Reveal"
import { Mail, GraduationCap } from "lucide-react"

export default function PressPage() {
    const key = "papers" as keyof typeof paperDataJson
    const papers = paperDataJson[key] || []

    const key1 = "sources" as keyof typeof sourcesDataJson
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
            {/**Importing Header */}
                <Header />

            <main className="grow flex flex-col items-center bg-slate-50/50 py-5 sm:py-10 px-4 sm:px-6">
                <div className="w-full max-w-5xl mx-auto py-5 sm:py-10">
                    <Reveal delay={0.2}>
                        <div className="mb-6 sm:mb-12 text-center">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2 sm:mb-4">
                                Data and Publications
                            </h1>
                        </div>
                    </Reveal>

                    <Reveal delay={0.4}>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-slate-800 px-4 mb-2">Data Sources</h2>
                            <ul className="space-y-1">
                                {sources.map((dataObj, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-4 p-1 rounded-2xl hover:bg-white hover:shadow-md hover:shadow-slate-200/40 border border-transparent hover:border-slate-200 transition-all duration-300 group"
                                    >
                                        <div className="mt-2.5 w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform shrink-0"></div>

                                        <div className="flex flex-col space-y-1">
                                            <a
                                                href={dataObj.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xl font-black text-blue-900 group-hover:text-(--brand-hover) transition-colors duration-200 leading-tight"
                                            >
                                                {dataObj.title}
                                            </a>
                                            <p className="text-md font-medium text-slate-700 italic">
                                                {dataObj.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </Reveal>

                    <Reveal delay={0.6}>
                        <div className="space-y-2 mt-4 ">
                            <h2 className="text-3xl font-bold text-slate-800 px-4 mb-2">Publications</h2>
                            <ul className="space-y-1">
                                {papers.map((dataObj, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-4 p-1 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 border border-transparent hover:border-slate-200 transition-all duration-300"
                                    >
                                        <div className="mt-2.5 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>

                                        <div className="flex flex-col space-y-1 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                                                <div className="group flex-1">
                                                    <a
                                                        href={dataObj.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xl font-black text-blue-900 group-hover:text-(--brand-hover) transition-colors duration-200 leading-tight"
                                                    >
                                                        {dataObj.title}
                                                    </a>
                                                </div>

                                                <div className="shrink-0">
                                                    <a
                                                        href={dataObj.googleScholarUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-1 bg-slate-900 border border-slate-200 rounded-xl text-white font-bold text-xs transition-all duration-300 hover:bg-(--brand-hover) hover:border-blue-400 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:scale-95"
                                                    >
                                                        <GraduationCap size={14} />
                                                        Google Scholar
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-md font-medium text-slate-700 italic">
                                                    {dataObj.authors}
                                                </p>
                                                <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">
                                                    {dataObj.venue}
                                                </p>
                                            </div>
                                        </div>
                                    </li>

                                ))}
                            </ul>
                        </div>

                    </Reveal>

                </div>
            </main>
            <Reveal delay={1.2}>
                <Footer />

            </Reveal>
            
        </div>

    )
}