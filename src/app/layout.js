import NavBar from "@/components/NavBar";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import Provider from "../components/Provider";
import ReactQueryProvider from "../components/ReactQueryProvider";
import ReactToastContainer from "../components/ReactToastContainer";
import { cn } from "@/lib/utils";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "TextSaver",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <Provider>
            <header>
              <NavBar />
            </header>
            <main className="pt-24 ps-1 pe-1">{children}</main>
            <ReactToastContainer />
          </Provider>
        </body>
      </html>
    </ReactQueryProvider>
  );
}
