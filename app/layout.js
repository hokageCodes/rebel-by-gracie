import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";

export const metadata = {
  title: "RebelByGrace - Premium Handbags & Fashion",
  description: "Discover our exclusive collection of premium handbags and fashion accessories for women and men. Quality craftsmanship meets modern style.",
  keywords: "handbags, fashion, women bags, men bags, travel bags, luxury accessories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
