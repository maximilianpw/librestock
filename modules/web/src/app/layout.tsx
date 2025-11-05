import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import AppSidebar from '@/components/common/Header'
import { ReactQueryProvider } from '@/hooks/providers/ReactQueryProvider'
import { I18nProvider } from '@/hooks/providers/I18nProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Rivierabeauty Inventory',
  description: 'Inventory management system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <ReactQueryProvider>
        <I18nProvider>
          <html lang="en">
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <main className="flex flex-1 flex-col p-4">{children}</main>
                </SidebarInset>
              </SidebarProvider>
            </body>
          </html>
        </I18nProvider>
      </ReactQueryProvider>
    </ClerkProvider>
  )
}
