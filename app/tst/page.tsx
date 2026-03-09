import Header from "../components/header"
import Footer from "../components/footer"
export default function TSTPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="min-h-screen bg-white text-black">
                <div className="max-w-5xl mx-auto py-20 px-6">
                    <h1 className="text-5xl text-center font-bold mb-12 pb-4 text-(--brand-dark) ">
                        Twenty Statements Test
                    </h1>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                            In Development
                        </span>
                    </div>

                    <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-6">
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
                            This page is under development and should be available soon
                        </span>
                    </h1>
                </div>
            </main>
            <Footer />
        </div>
    )

}

