import Link from 'next/link';

export default function Header({ className = "" }) {
    return (
        <div className={`w-full h-max p-8 bg-transparent text-black flex justify-between items-center ${className}`}>
            <Link href="/" className="font-bold hover:underline">Professor Atlas</Link>
            <div>
                <Link href="/chat" className="hover:underline mr-4">Chat</Link>
                <Link href="/about" className="hover:underline">About Us</Link>
            </div>
        </div>
    )
}