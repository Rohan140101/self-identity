import Header from "../components/header"
import Footer from "../components/footer"
import rkuckian from "./images/rkuckian.jpg"
import skiena from "./images/skiena.jpg"
import { Linkedin, Github } from "lucide-react";

export default function TeamPage() {
    const bigRow = [
        {
            name: "Steven Skiena",
            bio: 'Steven Skiena is Distinguished Teaching Professor of Computer Science and Director of the Institute for AI-Driven Discovery and Innovation at Stony Brook University. His research interests include data science, bioinformatics, and algorithms. He is the author of six books, including "The Algorithm Design Manual", "The Data Science Design Manual", and "Who\'s Bigger: Where Historical Figures Really Rank", and over 150 technical papers. Skiena received his B.S. in Computer Science from the University of Virginia and his Ph.D. in Computer Science from the University of Illinois in 1988. He is a Fellow of the American Association for the Advancement of Science (AAAS), a former Fulbright scholar, and recipient of the University of Virginia Engineering Distinguished Alumni Award (WahooWa!), the ONR Young Investigator Award and the IEEE Computer Science and Engineer Teaching Award. More info is available at http://www.cs.stonybrook.edu/~skiena/.',
            img: skiena
        },
        {
            name: "Rohan Kuckian",
            links: [
                { platform: "LinkedIn", url: "https://www.linkedin.com/in/rohan-kuckian-865196191/", icon: Linkedin },
                { platform: "Github", url: "https://github.com/Rohan140101", icon: Github }
            ],
            bio: 'Rohan Kuckian is a Computer Science Master’s student at Stony Brook University, where he serves as a Graduate Research Assistant under Prof. Steven Skiena. With a professional background as an Associate Consultant at Oracle Financial Services, Rohan bridges the gap between academic research and enterprise-level software development. His technical expertise spans Python, Java, and Golang, with a core research focus on Data Science',
            img: rkuckian
        }
    ]

    const shortRow = [
        { name: "Jason Jones", img: "/images/jjones.png" },
        { name: "Siddharth Magalik", img: "/images/smangalik.png" },
        { name: "Salvatore Giorgi", img: "/images/sgiorgi.png" },
        { name: "Andy Schwartz", img: "/images/schwartz.png" }
    ];
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <main className="grow bg-slate-50/50">
                <div className="py-20 px-1">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                                About Us
                            </h1>
                            {/* <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div> */}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {bigRow.map((person, index) => (
                                <div
                                    key={index}
                                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-center sm:items-start"
                                >
                                    <div className="relative shrink-0">
                                        <img
                                            src={person.img.src}
                                            className="w-40 h-40 sm:w-40 sm:h-40 object-cover rounded-xl shadow-inner transition-all duration-500"
                                            alt={person.name}
                                        />
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-50 rounded-lg -z-10 border border-blue-100 group-hover:rotate-12 transition-transform"></div>
                                    </div>

                                    <div className="flex flex-col h-full py-1">
                                        <div className="mb-3">
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {person.name}
                                            </h3>
                                            <div className="h-px w-10 bg-slate-200 my-2"></div>
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                {person.bio}
                                            </p>
                                        </div>

                                        <div className="mt-auto flex gap-3">
                                            {person.links?.map((link, i) => (
                                                <a
                                                    href={link.url}
                                                    key={i}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                                                >
                                                    <link.icon size={20}/>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )

}