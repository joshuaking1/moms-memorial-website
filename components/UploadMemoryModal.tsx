// src/components/UploadMemoryModal.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface UploadMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadMemoryModal({ isOpen, onClose }: UploadMemoryModalProps) {
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');
  const [file, setFile] = useState<File | null>(null);
  const[videoUrl, setVideoUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let finalMediaUrl = '';

      if (activeTab === 'photo') {
        if (!file) throw new Error("Please select a photo to upload.");
        
        // 1. Create a unique file name so images don't overwrite each other
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        // 2. Upload the file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('gallery-media')
          .upload(filePath, file);

        if (uploadError) throw new Error("Failed to upload image. Please try again.");

        // 3. Get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('gallery-media')
          .getPublicUrl(filePath);
          
        finalMediaUrl = publicUrlData.publicUrl;

      } else {
        if (!videoUrl) throw new Error("Please enter a valid YouTube link.");
        finalMediaUrl = videoUrl;
      }

      // 4. Save the record to the database (Wait for admin approval)
      const { error: dbError } = await supabase.from('gallery').insert([{
        media_type: activeTab,
        media_url: finalMediaUrl,
        caption: caption,
        approved: false // Crucial: Set to false so you can review it first!
      }]);

      if (dbError) throw new Error("Failed to save memory details.");

      setSuccess(true);
      // Reset form
      setFile(null); setVideoUrl(''); setCaption('');
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg relative border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="font-serif text-3xl text-yellow-300 text-center mb-2">Share a Memory</h2>
            <p className="text-center text-white/70 mb-6 text-sm">Upload a cherished photo or share a video tribute.</p>

            {success ? (
              <div className="bg-green-900/40 border border-green-500 text-white p-6 rounded-xl text-center">
                <span className="text-4xl block mb-2">✨</span>
                <h3 className="font-serif text-2xl mb-2">Memory Received</h3>
                <p className="text-sm text-white/80">Thank you. Your memory has been submitted and will appear in the gallery once approved by the family.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Tabs */}
                <div className="flex bg-gray-900 rounded-lg p-1 mb-6">
                  <button type="button" onClick={() => setActiveTab('photo')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'photo' ? 'bg-gray-700 text-white' : 'text-white/50 hover:text-white'}`}>📸 Photo</button>
                  <button type="button" onClick={() => setActiveTab('video')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'video' ? 'bg-gray-700 text-white' : 'text-white/50 hover:text-white'}`}>🎥 Video Link</button>
                </div>

                {/* Photo Input */}
                {activeTab === 'photo' && (
                  <div className="mb-4">
                    <label className="block text-white/80 mb-2 text-sm">Select Photo</label>
                    <input 
                      type="file" accept="image/*" onChange={handleFileChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-300 transition-colors"
                    />
                  </div>
                )}

                {/* Video Input */}
                {activeTab === 'video' && (
                  <div className="mb-4">
                    <label className="block text-white/80 mb-2 text-sm">YouTube Link</label>
                    <input 
                      type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                )}

                {/* Caption Input */}
                <div className="mb-6">
                  <label className="block text-white/80 mb-2 text-sm">Caption / Description</label>
                  <textarea 
                    value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} placeholder="Tell us about this beautiful moment..." required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                  ></textarea>
                </div>

                {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}

                <button 
                  type="submit" disabled={isLoading || (activeTab === 'photo' && !file) || (activeTab === 'video' && !videoUrl)}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Uploading...' : 'Submit Memory'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}