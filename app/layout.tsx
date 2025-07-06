import type React from "react"
import type { Metadata } from "next"
import { Press_Start_2P } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { BroadcastChannelFix } from "@/components/broadcast-channel-fix"

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start-2p",
})

export const metadata: Metadata = {
  title: "Nyancat.finance Dashboard",
  description: "The most ~aesthetic~ backtesting dashboard in DeFi.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("min-h-screen bg-nyan-bg font-sans antialiased", pressStart2P.variable)}>
        <BroadcastChannelFix />
        {children}
      </body>
    </html>
  )
}
