// src/app/brochure/page.tsx
import DigitalBrochure from '@/components/DigitalBrochure';

export default function BrochurePage() {
  return (
    <div className="min-h-screen text-white pt-32 pb-16">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute bg-white/10 rounded-full w-[600px] h-[600px] top-10 left-1/2 -translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 flex flex-col items-center">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 text-yellow-300">Digital Program</h1>
          <p className="font-sans text-xl text-white/80 max-w-2xl mx-auto">
            Swipe or click the edges of the pages to turn them, just like a real booklet.
          </p>
        </div>

        {/* The Flipbook Component */}
        <div className="w-full max-w-4xl flex justify-center mb-16">
           <DigitalBrochure />
        </div>

        {/* Download & Share Actions */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all flex items-center justify-center space-x-3 shadow-lg">
            <span>📄</span>
            <span>Download PDF Version</span>
          </button>

          <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all flex items-center justify-center space-x-3 shadow-lg">
            <span>📱</span>
            <span>Share on WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
}