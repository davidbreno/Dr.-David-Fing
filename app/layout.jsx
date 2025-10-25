import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";

export const metadata = { title: "Dashboard", description: "App" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="min-h-screen bg-blobs text-slate-200">
        <ThemeProvider>
          <div className="mx-auto w-full px-6 py-6 max-w-[1440px] lg:max-w-[1600px] xl:max-w-[1760px] 2xl:max-w-[1920px]">
            {children}
          </div>
          {/* reset link removido */}
        </ThemeProvider>
      </body>
    </html>
  );
}
