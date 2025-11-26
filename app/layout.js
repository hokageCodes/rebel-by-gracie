import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { AuthProvider } from "@/lib/auth-context";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </body>
    </html>
  );
}
