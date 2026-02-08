"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react"

// const NavLinks = function () {
//     const linkStyle = "text-(--brand-light) text-m font-bold px-4 h-full flex items-center rounded transition-all hover:bg-(--brand-hover) hover:text-white mx-1";

//     return (
//         <div className="flex h-12 items-stretch">
//             <Link href="/survey" className={linkStyle}>Survey</Link>
//             <Link href="/blog" className={linkStyle}>Blog</Link>
//             <Link href="/data" className={linkStyle}>Data</Link>
//             <Link href="/press" className={linkStyle}>Press</Link>
//             <Link href="/team" className={linkStyle}>Team</Link>
//             <Link href="/contact" className={linkStyle}>Contact</Link>
//             <Link href="/tst" className={linkStyle}>Twenty Statements Test</Link>
//             <Link href="/gradeSocialMedia" className={linkStyle}>Grade Your Social Media Profile</Link>
//         </div>
//     );
// }

const NavLinks = ({isMobile= false} : {isMobile ?: boolean}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const containerStyle = isMobile ?
     "flex flex-col space-y-2 w-full pt-4": 
     "flex h-12 flex-row items-stretch"


    // const linkStyle = "text-(--brand-light) text-m font-bold px-4 h-full flex items-center rounded transition-all hover:bg-(--brand-hover) hover:text-white mx-1";

    const linkStyle = isMobile ?
    "text-(--brand-light) text-m font-bold p-4 w-full flex rounded-md transition-all hover:bg-(--brand-hover) hover:text-white mx-1":
    "text-(--brand-light) text-m font-bold px-4 h-full flex items-center rounded transition-all hover:bg-(--brand-hover) hover:text-white mx-1"

    const dropDownStyle = isMobile 
                        ? "bg-(--brand-hover) flex flex-col mt-1 ml-4 rounded-md overflow-hidden" 
                        : "absolute top-full left-0 w-48 bg-[var(--brand-dark)] border border-gray-700 shadow-xl flex flex-col"
                    
    return (
        <div className={containerStyle}>
            <Link href="/survey" className={linkStyle}>Survey</Link>
            
            <Link href="/blog" className={linkStyle}>Blog</Link>
            <Link href="/data" className={linkStyle}>Data</Link>
            <Link href="/press" className={linkStyle}>Press</Link>
            <Link href="/team" className={linkStyle}>Team</Link>
            <Link href="/contact" className={linkStyle}>Contact</Link>
            <div className={isMobile ? "w-full" : "relative h-full"} onMouseEnter={() => !isMobile && setIsDropdownOpen(true)} onMouseLeave={() => !isMobile && setIsDropdownOpen(false)}>
                <button className={`${linkStyle} flex gap-1 items-center whitespace-nowrap`} onClick={() => isMobile && setIsDropdownOpen(!isDropdownOpen)}>
                    Other Tests <ChevronDown size={isMobile ? 20 : 16} />
                </button>

                {isDropdownOpen && (
                    <div className={dropDownStyle}>
                        <Link href='/tst' className={`${linkStyle} py-3 justify-start`}>
                        Twenty Statements Test
                        </Link>
                        <Link href='/gradeSocialMedia' className={`${linkStyle} py-3 justify-start`}>
                        Grade Your Social Media Profile
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}


const Nav = function () {
    const [isOpen, setIsOpen] = useState(false)

    const toggleNavBar = function () {
        setIsOpen(!isOpen)
    }

    return (
        <nav className="flex justify-end items-center">

            <div className="hidden justify-between md:flex">
                <NavLinks />
            </div>
            <div className="md:hidden">
                <button onClick={toggleNavBar} className = "text-(--brand-light) p-2">
                    <Menu size={28} />
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />
            )}

            <div className={`fixed top-0 left-0 h-full w-72 bg-(--brand-dark) z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:hidden p-6 shadow-2xl overflow-y-auto`}>
                <div className="flex justify-between items-center mb-8">
                    <span className="text-(--brand-light) font-bold">MENU</span>
                    <button onClick={() => setIsOpen(false)} className="text-(--brand-light)">
                        <X size={28} />
                    </button>
                </div>
                <NavLinks isMobile={true} />
            </div>
        </nav>
    )
}


export default Nav