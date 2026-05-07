import Link from "next/link";


// Banner - Left Side of Navbar
const Banner = function () {
  return (
    <div className="h-16 flex items-center">
      <Link
        href="/"
        className="text-(--brand-light) font-bold text-sm px-4 h-full flex items-center rounded transition-colors hover:bg-(--brand-hover) hover:text-white"
      >
        Who Are You? The Science of Self-Identity
      </Link>
    </div>
  );
};

export default Banner;