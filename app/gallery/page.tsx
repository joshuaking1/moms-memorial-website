// src/app/gallery/page.tsx
"use client";

import { useState } from 'react';
import GalleryDisplay from '@/components/GalleryDisplay';
import UploadMemoryModal from '@/components/UploadMemoryModal';

export default function GalleryPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen text-white pt-32 pb-16 relative">
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute bg-green-500/10 rounded-full w-96 h-96 -top-20 -left-20 animate-pulse-slow"></div>
        <div className="absolute bg-teal-500/10 rounded-full w-72 h-72 -bottom-10 -right-10 animate-pulse-slower"></div>
      </div>
      
      <div className="relative z-10 text-center mb-12 px-4">
        <h1 className="font-serif text-5xl md:text-7xl font-bold">A Gallery of Memories</h1>
        <p className="font-sans text-xl mt-4 text-white/80 max-w-3xl mx-auto mb-8">
          A collection of cherished moments and joyful times we shared.
        </p>

        {/* The New Share a Memory Button */}
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-gray-800/80 hover:bg-gray-700 border border-yellow-400/50 text-yellow-300 font-bold py-3 px-8 rounded-full text-lg shadow-lg shadow-yellow-500/10 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
        >
          <span className="text-xl">✨</span>
          <span>Share a Photo or Video</span>
        </button>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <GalleryDisplay />
      </div>

      {/* The Modal */}
      <UploadMemoryModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
}