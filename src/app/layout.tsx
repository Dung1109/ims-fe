import "@/app/globals.css";
import { Inter } from "next/font/google";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body className={inter.className}>
          <SidebarProvider>
            <div className="flex flex-col min-h-screen w-full">
              <SiteHeader />
              <div className="flex flex-1 w-full">
                <AppSidebar />
                <main className="flex-1 w-full">{children}</main>
              </div>
            </div>
          </SidebarProvider>
      </body>
    </html>
  );
}
