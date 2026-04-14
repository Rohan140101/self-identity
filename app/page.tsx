import Header from "./components/header";
import Hero from "./components/hero";
import Content from "./components/content";
import Footer from "./components/footer";
import { Reveal } from "./components/Reveal";
export default function Page() {
    return (
        <div className="min-h-screen bg-white flex flex-col">

            <Header />


            <main className="min-h-screen bg-white text-black max-w-full overflow-x-hidden">

                <Hero />


                
                    <Content />


            </main>
            <Reveal delay={1}>
                <Footer />
            </Reveal>

        </div>

    )
}