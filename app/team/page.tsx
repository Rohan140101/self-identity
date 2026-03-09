import Header from "../components/header"
import Footer from "../components/footer"
import rkuckian from "./images/rkuckian.jpg"
import skiena from "./images/skiena.jpg"
import { platform } from "os"
import { url } from "inspector"
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
                { platform: "LinkedIn", url: "https://www.linkedin.com/in/rohan-kuckian-865196191/" },
                { platform: "Github", url: "https://github.com/Rohan140101" }
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
        <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="min-h-screen bg-white text-black">
                <div className="py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-5xl text-center font-bold mb-12 pb-4 text-(--brand-dark) ">
                            Meet our Team
                        </h1>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                            {bigRow.map((person, index) => (
                                <div key={index} className="bg-white border border-slate-200 rounded-large p-4 shadow-sm">
                                    <img src={person.img.src} className="w-full aspect-3/3 object-cover rounded-md mb-4" alt={person.name} />
                                    <h3 className="text-2xl font-bold">{person.name}</h3>
                                    <p className="text-slate-600 italic">{person.bio}</p>
                                    <div className="flex gap-4 mt-4">
                                        {person.links?.map((link, i) => (
                                            <a
                                                href={link.url}
                                                key={i}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-slate-400 hover:text-blue-600 transition-colors" >
                                                <span className="text-s font-bold uppercase">
                                                    {link.platform}
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}

                        </div>
                        {/* 
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                            {shortRow.map((person, index) => (
                                <div key={index} className="bg-white border border-slate-200 rounded-large p-3 shadow-sm">
                                    <img src={person.img.src} className="w-full aspect-square object-cover rounded-md mb-4" alt={person.name} />
                                    <h4 className="text-lg font-bold">{person.name}</h3>
                                    <p className="text-slate-600 italic">{person.bio}</p>
                                </div>
                            ))}

                        </div> */}



                    </div>


                </div>
            </main>
            <Footer />
        </div>
    )

}