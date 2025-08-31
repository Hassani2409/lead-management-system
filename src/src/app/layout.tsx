import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lead Management System - 742 Organized Leads',
  description: 'Professional Lead Management System with integrated scraper control, CRM integration, and automated workflows.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="dark">
      <body
        className={`${inter.className} bg-background text-foreground flex min-h-screen flex-col`}
      >
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 hidden md:flex">
              <a className="mr-6 flex items-center space-x-2" href="/">
                <div className="relative h-6 w-6">
                  <div className="group flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="text-sm font-bold">LM</span>
                  </div>
                </div>
                <span className="hidden font-bold sm:inline-block">
                  Lead Management
                </span>
              </a>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <Toaster richColors />
      </body>
    </html>
  )
}
