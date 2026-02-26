// src/app/page.tsx
"use client"; // This is crucial! It tells Next.js this is an interactive page.

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import LightACandleModal from '@/components/LightACandleModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candleCount, setCandleCount] = useState(0);

  // Fetch initial candle count and listen for real-time updates
  useEffect(() => {
    const fetchInitialCount = async () => {
      const { count, error } = await supabase
        .from('candles')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching candle count:', error);
      } else if (count !== null) {
        setCandleCount(count);
      }
    };

    fetchInitialCount();

    // Set up a real-time subscription
    const channel = supabase
      .channel('realtime candles')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'candles' },
        (payload) => {
          // When a new candle is inserted, update the count
          setCandleCount((currentCount) => currentCount + 1);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLightCandle = async (name: string, message: string) => {
    const { error } = await supabase
      .from('candles')
      .insert([{ name, message }]);

    if (error) {
      console.error('Error inserting candle:', error);
      throw new Error('Could not light candle.');
    }
    // No need to update count here, the real-time listener will do it!
  };

  return (
    <>
      <main className="relative flex flex-col items-center justify-center min-h-screen text-white overflow-hidden">
        {/* Background Animation: Soft floating lights */}
        <div className="absolute inset-0 z-0">
          <div className="absolute bg-blue-500/20 rounded-full w-96 h-96 -top-20 -left-20 animate-pulse-slow"></div>
          <div className="absolute bg-purple-500/20 rounded-full w-72 h-72 -bottom-10 -right-10 animate-pulse-slower"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center text-center p-8">
          {/* The beautiful photo */}
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/50 shadow-2xl shadow-purple-500/20 mb-6">
            <Image
              src="/mom-photo.jpg"
              alt="A beautiful photo of my mother"
              width={256}
              height={256}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {/* Name and Dates */}
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight">
            Mary Yaa Adjate Segu
          </h1>
          <p className="font-sans text-xl md:text-2xl text-white/80 mt-2">
            1968 – 2026
          </p>

          {/* Tribute Line */}
          <p className="font-serif italic text-2xl md:text-3xl mt-6">
            Forever in our hearts, a legacy of love.
          </p>

          {/* "Light a Candle" Button */}
          <div className="mt-12">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-yellow-400/80 hover:bg-yellow-400 text-gray-900 font-bold py-4 px-8 rounded-full text-lg shadow-lg shadow-yellow-500/20 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
            >
              <span className="text-2xl">🕯️</span>
              <span>Light a Virtual Candle</span>
            </button>
          </div>

          {/* Candle Counter */}
          <div className="mt-8 text-lg text-white/70">
            {candleCount > 0 ? (
              <p>
                <span className="font-bold text-yellow-300 transition-all">
                  {candleCount.toLocaleString()}
                </span>
                {candleCount === 1 ? ' candle has' : ' candles have'} been lit in her memory.
              </p>
            ) : (
              <p>Be the first to light a candle in her memory.</p>
            )}
          </div>
        </div>
      </main>

      {/* The Modal Component */}
      <LightACandleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleLightCandle} 
      />
    </>
  );
}