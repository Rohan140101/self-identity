import Header from "../components/header"
import Footer from "../components/footer"
import mediaDataJson from "@/data/mediaData.json"
import { Mail } from "lucide-react"
import { Reveal } from "../components/Reveal"
export default function mediaPage() {
    const key = "mediaData" as keyof typeof mediaDataJson
    const mediaData = mediaDataJson[key] || []

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

            <main className="grow flex flex-col items-center bg-slate-50/50 py-5 sm:py-10 px-4 sm:px-6 max-w-full overflow-x-hidden">
                <div className="w-full max-w-5xl mx-auto py-5 sm:py-10">
                    <Reveal delay={0.2}>
                        <div className="mb-6 sm:mb-12 flex flex-col sm:grid sm:grid-cols-5 items-center pb-2 sm:pb-8 border-b border-slate-100">

                            <div className="hidden sm:block sm:col-span-1"></div>

                            <div className="text-center sm:col-span-3">
                                <h1 className="text-4xl md:text-5xl  font-extrabold text-slate-900 tracking-tight">
                                    Media Coverage
                                </h1>
                            </div>

                            <div className="flex justify-center sm:justify-end sm:col-span-1 w-full mt-6 sm:mt-0">
                                <a href="/subscribe"
                                    className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-blue-100 active:scale-95 shrink-0 h-fit"
                                >
                                    <Mail size={18} className="opacity-80" />
                                    Stay Updated
                                </a>
                            </div>
                        </div>

                    </Reveal>





                    <Reveal delay={0.4}>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-slate-800 px-4 mb-2">Recent News</h2>


                            <ul className="space-y-1">
                                {mediaData.map((dataObj, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-4 p-1  rounded-2xl hover:bg-white hover:shadow-md hover:shadow-slate-200/40 border border-transparent hover:border-slate-200 transition-all duration-300 group"
                                    >
                                        <div className="w-2 h-2 mt-2.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <a href={dataObj.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block text-xl font-black text-blue-900 group-hover:text-blue-600 transition-colors duration-200 leading-snug mb-1"
                                            >
                                                {dataObj.title}
                                            </a>

                                            <span className="text-sm text-slate-700 italic block sm:inline">
                                                {getText(dataObj.source, dataObj.author, dataObj.date)}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </Reveal>


                </div>
            </main>
            <Reveal delay={1}>
                <Footer />
            </Reveal>

        </div>

    )
}