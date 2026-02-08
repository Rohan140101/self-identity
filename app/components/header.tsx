import Nav from "./nav";
import Banner from "./banner";
const header = function () {
    return (
        <header className="bg-(--brand-dark) sticky top-0 z-20 mx-auto flex w-full max-w-full h-16 items-center justify-between border-b border-gray-500 px-8">
            <Banner />
            <Nav />
        </header>


    )
}



export default header;