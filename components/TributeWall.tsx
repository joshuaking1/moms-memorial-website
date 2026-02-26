// src/components/TributeWall.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

interface Tribute {
  id: number;
  created_at: string;
  name: string;
  message: string;
  location: string | null;
  hearts: number;
}

export default function TributeWall() {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTributes = async () => {
      const { data, error } = await supabase
        .from('tributes')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tributes:', error);
      } else {
        setTributes(data);
      }
      setIsLoading(false);
    };

    fetchTributes();
  }, []);

  const handleHeartClick = async (id: number) => {
    // Find the tribute to update its heart count optimistically
    const tributeIndex = tributes.findIndex(t => t.id === id);
    if (tributeIndex === -1) return;

    const tributeToUpdate = tributes[tributeIndex];
    const newHeartCount = tributeToUpdate.hearts + 1;

    // Optimistic UI update
    const updatedTributes = [...tributes];
    updatedTributes[tributeIndex] = { ...tributeToUpdate, hearts: newHeartCount };
    setTributes(updatedTributes);
    
    // Then, update the database
    const { error } = await supabase.rpc('increment_hearts', { tribute_id: id });
    if (error) {
      console.error('Error incrementing hearts:', error);
      // If error, revert the UI change
      setTributes(tributes); 
    }
  };

  if (isLoading) {
    return <p className="text-center text-white/70">Loading tributes...</p>;
  }

  return (
    <div className="space-y-6">
      {tributes.length > 0 ? (
        tributes.map((tribute, index) => (
          <motion.div
            key={tribute.id}
            className="bg-gray-800/50 p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <p className="text-white/90 text-lg mb-4 whitespace-pre-wrap">{tribute.message}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-yellow-300">{tribute.name}</p>
                {tribute.location && <p className="text-sm text-white/60">{tribute.location}</p>}
              </div>
              <button
                onClick={() => handleHeartClick(tribute.id)}
                className="flex items-center space-x-2 text-white/70 hover:text-red-400 transition-colors"
              >
                <span>❤️</span>
                <span className="font-bold">{tribute.hearts}</span>
              </button>
            </div>
          </motion.div>
        ))
      ) : (
        <p className="text-center text-white/70">Be the first to leave a tribute.</p>
      )}
    </div>
  );
}