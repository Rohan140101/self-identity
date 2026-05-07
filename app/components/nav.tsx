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

const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const containerStyle = isMobile
    ? "flex flex-col space-y-2 w-full pt-4"
    : "flex flex-row items-stretch h-full";

  const linkStyle = isMobile
    ? "text-(--brand-light) text-sm font-normal p-4 w-full flex rounded-md transition-all hover:bg-(--brand-hover) hover:text-white mx-1"
    : "text-(--brand-light) text-sm font-normal px-4 flex items-center self-stretch transition-all hover:bg-(--brand-hover) hover:text-white";

  const surveyLinkStyle = isMobile
    ? "text-yellow-400 text-sm font-medium p-4 w-full flex rounded-md transition-all hover:bg-(--brand-hover) hover:text-yellow-300 mx-1"
    : "text-yellow-400 text-sm font-medium px-4 flex items-center self-stretch transition-all hover:bg-(--brand-hover) hover:text-yellow-300 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-yellow-400 after:opacity-70";
  const dropDownStyle = isMobile
    ? "bg-(--brand-hover) flex flex-col mt-1 ml-4 rounded-md overflow-hidden"
    : "absolute top-full left-0 w-48 bg-[var(--brand-dark)] border border-gray-700 shadow-xl flex flex-col";

  return (
    <div className={containerStyle}>
      <Link href="/survey/short_survey" className={surveyLinkStyle}>Survey</Link>
      {/* <Link href="/blog" className={linkStyle}>Blog</Link> */}
      <Link href="https://stevenskiena.substack.com/" target="_blank" className={linkStyle}>Blog</Link>
      <Link href="/data" className={linkStyle}>Data</Link>
      <Link href="/media" className={linkStyle}>Media</Link>
      <Link href="/team" className={linkStyle}>Team</Link>
      <Link href="/contact" className={linkStyle}>Contact</Link>

      <div
        className={isMobile ? "w-full" : "relative self-stretch flex items-center"}
        onMouseEnter={() => !isMobile && setIsDropdownOpen(true)}
        onMouseLeave={() => !isMobile && setIsDropdownOpen(false)}
      >
        <button
          className={`${linkStyle} flex gap-1 items-center whitespace-nowrap`}
          onClick={() => isMobile && setIsDropdownOpen(!isDropdownOpen)}
        >
          Other Tests <ChevronDown size={isMobile ? 20 : 16} />
        </button>

        {isDropdownOpen && (
          <div className={dropDownStyle}>
            <Link href="/tst/intro" className={`${linkStyle} py-3 justify-start`}>
              Twenty Statements Test
            </Link>
            <Link href="/gradeSocialMedia/intro" className={`${linkStyle} py-3 justify-start`}>
              Grade Your Social Media Profile
            </Link>
            <Link href="/survey/full_survey" className={`${linkStyle} py-3 justify-start`}>
              Full Research Identity Survey (15 minutes)
            </Link>
            {/* <Link href="/wordPersonality" className={`${linkStyle} py-3 justify-start`}>
              Word Personality and Half Life
            </Link> */}
          </div>
        )}
      </div>
    </div>
  );
};


const Nav = function () {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex justify-end items-center h-full">
      <div className="hidden justify-between lg:flex h-full">
        <NavLinks />
      </div>

      <div className="lg:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-(--brand-light)">
          <Menu size={28} />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-(--brand-dark) z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:hidden p-6 shadow-2xl overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="text-(--brand-light) font-bold">MENU</span>
          <button onClick={() => setIsOpen(false)} className="text-(--brand-light)">
            <X size={28} />
          </button>
        </div>
        <NavLinks isMobile={true} />
      </div>
    </nav>
  );
};



export default Nav