import "./globals.css";
import ThemeProvider from "@/components/theme/ThemeProvider";

export const metadata = { title:"Dashboard", description:"App com temas e páginas" };

export default function RootLayout({ children }){
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="min-h-screen bg-blobs text-slate-200">
        <ThemeProvider>
          <div className="mx-auto max-w-[1600px] px-4 py-6">{children}</div>
          <a className="reset-link" href="/secreto" aria-label="reset">reset</a>
        </ThemeProvider>
      </body>
    </html>
  );
}
