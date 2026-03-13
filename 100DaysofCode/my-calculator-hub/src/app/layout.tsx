// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Import our Tailwind CSS

const inter = Inter({ subsets: ['latin'] });

// --- SEO Meta Tags (from your original HTML) ---
export const metadata: Metadata = {
  title: 'All-in-One Calculator Hub - Age, BMI, Tip, Area, Temperature Tools',
  description: 'Your go-to online calculator hub for essential daily calculations. Features include Age Calculator, BMI Calculator, Tip Calculator, Multi-Shape Area Calculator, and Temperature Converter.',
  keywords: 'calculator, age calculator, bmi calculator, tip calculator, area calculator, temperature converter, online tools, free calculator',
  authors: [{ name: 'Your Name/Company' }], // Replace with your actual name/company
  metadataBase: new URL('https://yourwebsite.com'), // Replace with your actual base URL
  alternates: {
    canonical: '/calculators', // Replace with your actual path
  },
  openGraph: {
    title: 'All-in-One Calculator Hub',
    description: 'Your go-to online calculator hub for essential daily calculations. Features include Age Calculator, BMI Calculator, Tip Calculator, Multi-Shape Area Calculator, and Temperature Converter.',
    url: 'https://yourwebsite.com/calculators', // Replace with your actual URL
    siteName: 'Calculator Hub',
    images: [
      {
        url: '/images/calculator-hub-share.jpg', // Path to your share image in `public`
        width: 1200,
        height: 630,
        alt: 'Screenshot of the All-in-One Calculator Hub',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourtwitterhandle', // Optional: Replace with your Twitter handle
    creator: '@yourtwitterhandle', // Optional: Replace with your Twitter handle
    title: 'All-in-One Calculator Hub',
    description: 'Your go-to online calculator hub for essential daily calculations. Features include Age Calculator, BMI Calculator, Tip Calculator, Multi-Shape Area Calculator, and Temperature Converter.',
    images: ['/images/calculator-hub-share.jpg'], // Path to your share image in `public`
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-800 flex flex-col min-h-screen`}>
        {/* Main Content Area */}
        <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="container mx-auto w-full max-w-4xl bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg animate-fade-in my-6 sm:my-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-300 py-6 mt-auto w-full text-center shadow-inner">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
              <p className="mb-2 sm:mb-0">&copy; {currentYear} Calculator Hub. All rights reserved.</p>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <p className="mb-1 sm:mb-0">Designed for easy calculations.</p>
                <p><a href="#" className="hover:text-blue-400 transition-colors" rel="nofollow">Privacy Policy</a> | <a href="#" className="hover:text-blue-400 transition-colors" rel="nofollow">Terms of Service</a></p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}