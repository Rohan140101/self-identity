import { Twitter, Youtube } from "lucide-react";
import SocialShareButtons from "./social-share-buttons";

const Footer = function() {
    return (
        <footer className="bg-(--brand-dark) text-(--brand-light) py-4 px-4 border-t border-gray-700">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-3">
                        <span className="text-sm">© Copyright {new Date().getFullYear()}・Steven Skiena・All rights reserved</span>
                        <a
                            href="https://x.com/stevenskiena?lang=en"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-(--brand-light) hover:text-white transition-colors"
                            aria-label="Steven Skiena on X"
                        >
                            <Twitter size={18} />
                        </a>
                        <a
                            href="https://www.youtube.com/user/stevenskiena"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-(--brand-light) hover:text-white transition-colors"
                            aria-label="Steven Skiena on YouTube"
                        >
                            <Youtube size={18} />
                        </a>
                    </div>
                </div>

                <SocialShareButtons />
            </div>

            
        </footer>
    )
}

export default Footer;
