import Link from "next/link";

const Banner = function() {
    return(
        <div className="h-16 flex items-center">
            <Link 
                href="/" 
                className="text-(--brand-light) text-m font-bold px-4 h-5/6 flex items-center rounded transition-colors hover:bg-(--brand-hover) hover:text-white"
            >
                Who Are You?   The Science of Self-Identity
            </Link>
        </div>
        
    
    )
}

export default Banner;