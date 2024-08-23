export default function Header() {

    return (
    <>
        <div className="w-full select-none h-max p-8 bg-transparent flex justify-between text-white">
            <a href="/">
                <p className="font-bold">Professor Atlas</p>
            </a>
            <a href="/about">
                About
            </a>
        </div>
    </>
    )
}