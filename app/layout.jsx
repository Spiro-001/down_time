import "./globals.css";
import { Inter } from "next/font/google";
import Provider from "@/components/Provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MyChats from "@/components/MyChats";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div className="flex">{children}</div>
        </Provider>
      </body>
    </html>
  );
}
