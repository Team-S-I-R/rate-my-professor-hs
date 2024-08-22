import type { Metadata } from "next";
import { Inter, Roboto, Lora, Poppins, Merriweather, Open_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
// const roboto = Roboto({ subsets: ["latin"] });
const lora = Lora({ subsets: ["latin"] });
// const poppins = Poppins({ subsets: ["latin"] });
// const merriweather = Merriweather({ subsets: ["latin"] });
const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={`${lora.className} overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
