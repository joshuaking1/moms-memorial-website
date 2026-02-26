// src/components/DigitalBrochure.tsx
"use client";

import React, { useState } from 'react';
// We use a special import syntax here and @ts-ignore because the library's 
// typescript definitions are a bit older, but the code works perfectly.
// @ts-ignore
import HTMLFlipBook from 'react-pageflip';

// 1. Create a "Page" template that gives every page a beautiful paper texture
const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode; number?: number }>((props, ref) => {
  return (
    <div 
      className="bg-[#fdfbf7] text-gray-900 border border-gray-300 shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] relative overflow-hidden flex flex-col" 
      ref={ref}
    >
      {/* Soft paper texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
      
      <div className="relative z-10 flex-grow p-8 md:p-12 flex flex-col">
        {props.children}
      </div>

      {/* Page Number at the bottom */}
      {props.number && (
        <div className="absolute bottom-4 left-0 right-0 text-center text-gray-400 text-sm font-serif">
          - {props.number} -
        </div>
      )}
    </div>
  );
});
Page.displayName = "Page";

export default function DigitalBrochure() {
  const [isPlaying, setIsPlaying] = useState(false);

  // A simple function to play a hymn preview
  // Note: For a real site, place an .mp3 file in your 'public' folder and link to it.
  const playHymn = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); // Placeholder gentle music
    audio.play();
    audio.onended = () => setIsPlaying(false);
    alert("🎵 Playing Hymn: Amazing Grace..."); // Visual feedback
  };

  return (
    <div className="flex justify-center items-center py-10">
      {/* @ts-ignore */}
      <HTMLFlipBook 
        width={400} 
        height={600} 
        size="stretch" 
        minWidth={300} 
        maxWidth={500} 
        minHeight={450} 
        maxHeight={750} 
        maxShadowOpacity={0.3} 
        showCover={true} 
        mobileScrollSupport={true}
        className="shadow-2xl"
      >
        
        {/* PAGE 1: Front Cover */}
        <Page>
          <div className="flex flex-col items-center justify-center h-full text-center border-4 border-double border-gray-400 p-4">
            <h2 className="font-serif text-xl tracking-widest text-gray-500 mb-4">IN LOVING MEMORY OF</h2>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Victoria<br />Amponsah
            </h1>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 mb-6 shadow-md">
               {/* Replace with your Mom's actual photo later */}
               <img src="/mom-photo.jpg" alt="Mom" className="w-full h-full object-cover" />
            </div>
            <p className="font-sans text-lg text-gray-600">1955 – 2024</p>
            <p className="font-serif italic text-gray-500 mt-8">"A life beautifully lived."</p>
          </div>
        </Page>

        {/* PAGE 2: Order of Service */}
        <Page number={1}>
          <h2 className="font-serif text-3xl font-bold mb-6 text-center text-gray-800 border-b pb-4">Order of Service</h2>
          <ul className="space-y-4 font-sans text-gray-700">
            <li className="flex justify-between border-b border-gray-200 pb-2"><span>Opening Prayer</span> <span>Rev. Dr. Osei</span></li>
            <li className="flex justify-between border-b border-gray-200 pb-2"><span>Hymn</span> <span>Congregation</span></li>
            <li className="flex justify-between border-b border-gray-200 pb-2"><span>Biography</span> <span>Family Member</span></li>
            <li className="flex justify-between border-b border-gray-200 pb-2"><span>Tributes</span> <span>Children & Friends</span></li>
            <li className="flex justify-between border-b border-gray-200 pb-2"><span>Sermon</span> <span>Rev. Dr. Osei</span></li>
            <li className="flex justify-between border-b border-gray-200 pb-2"><span>Vote of Thanks</span> <span>Eldest Son</span></li>
            <li className="flex justify-between"><span>Closing Benediction</span> <span>Clergy</span></li>
          </ul>
        </Page>

        {/* PAGE 3: Interactive Hymn */}
        <Page number={2}>
          <h2 className="font-serif text-3xl font-bold mb-6 text-center text-gray-800 border-b pb-4">Hymn</h2>
          <div className="text-center mb-6">
            <h3 className="font-serif text-2xl font-bold">Amazing Grace</h3>
            
            {/* Interactive Audio Button - THIS is what makes a digital program special */}
            <button 
              onClick={playHymn}
              className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-yellow-500 hover:text-gray-900 transition-all flex items-center justify-center mx-auto space-x-2"
            >
              <span>{isPlaying ? '🔊 Playing...' : '🎵 Play Hymn Audio'}</span>
            </button>
          </div>

          <div className="text-center font-serif text-gray-700 space-y-4 leading-relaxed">
            <p>Amazing grace! How sweet the sound<br/>That saved a wretch like me!<br/>I once was lost, but now am found;<br/>Was blind, but now I see.</p>
            <p>’Twas grace that taught my heart to fear,<br/>And grace my fears relieved;<br/>How precious did that grace appear<br/>The hour I first believed!</p>
          </div>
        </Page>

        {/* PAGE 4: Back Cover / Acknowledgements */}
        <Page>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="font-serif text-2xl font-bold mb-6 text-gray-800">Appreciation</h2>
            <p className="font-sans text-gray-700 leading-relaxed mb-10">
              The entire family of the late Victoria Amponsah wishes to express our profound gratitude for your sympathy, 
              prayers, and support during our time of bereavement. <br/><br/>
              May God richly bless you.
            </p>
            
            <div className="w-16 h-16 opacity-30">
               {/* Decorative flower icon */}
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2C8.69 2 6 4.69 6 8c0 1.45.52 2.78 1.39 3.82L3.5 16.5 5 18l4.08-4.08A5.978 5.978 0 0 0 12 14c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>
            </div>
          </div>
        </Page>

      </HTMLFlipBook>
    </div>
  );
}