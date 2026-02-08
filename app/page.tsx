import Header from "./components/header";
import Hero from "./components/hero";
import Content from "./components/content";
import Footer from "./components/footer";
export default function Page() {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="min-h-screen bg-white text-black">
            
            <Hero />
            <Content />
        </main>
        <Footer />
        </div>
        
    )
}