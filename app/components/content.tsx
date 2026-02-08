
const Content = function () {
    return (
        <section className="max-w-3xl mx-auto py-16 px-6 flex flex-col items-center text-center">
            <div className="text-(--brand-dark) space-y-6">
                <p className="landing-relaxed text-xl text-left">
                    Self-identity refers to how we define and perceive ourselves, encompassing our beliefs, values, personality traits and characteristics which make us unique.
                </p>
                <p className="landing-relaxed text-xl text-left">
                    We have prepared a test to help you uncover the real nature of your personal self-identity.   Learn what aspects of your personal identity are most important to who you are, and what this means for your happiness and well-being.             </p>
            </div>

            <button className="mt-10 bg-yellow-500 text-(--brand-dark) text-m font-bold px-10 py-4 rounded tracking-widest transition-all hover:bg-yellow-400 hover:scale-105 shadow-md">
                DISCOVER WHO YOU ARE
            </button>
        </section>
    )
}

export default Content;