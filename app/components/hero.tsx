import woman from "../../images/woman.png"
import man from "../../images/man.png"

const Hero = function () {
    return (
        // <section className="relative h-75 w-full bg-gray-400 flex flex-col items-center justify-center gap-4">
        //     <h1 className="text-5xl font-bold text-white md:text-7xl text-center px-4 tracking-tight py-8">
        //         Who are You?
        //     </h1>
        //     <h3 className="text-xg font-medium text-white md:text-2xl text-center px-4 opacity-90">
        //         The Science of Self-Identity
        //     </h3>

        // </section>

        <section className="min-h-[40vh] bg-black flex text-white items-center overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 items-center gap-8">
                <div className="hidden md:block md:col-span-1">
                    <img src={woman.src} alt="Woman" className="w-full h-auto opacity-80" />
                </div>

                <div className="col-span-1 md:col-span-2 text-center py-10">
                    <h1 className="text-5xl font-bold text-white md:text-7xl text-center px-4 tracking-tight py-8">
                        Who are You?
                    </h1>
                    <h3 className="text-xg font-medium text-white md:text-2xl text-center px-4 opacity-90">
                        The Science of Self-Identity
                    </h3>
                </div>


                <div className="md:col-span-1">
                    <img src={man.src} alt="Man" className="w-full h-auto opacity-80" />
                </div>
            </div>
        </section>
    )
}

export default Hero;