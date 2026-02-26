// src/components/GalleryDisplay.tsx
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { motion } from 'framer-motion';

// Define the shape of our gallery item data
interface GalleryItem {
  id: number;
  media_type: 'photo' | 'video';
  media_url: string;
  caption: string | null;
}

export default function GalleryDisplay() {
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('approved', true) // Only fetch approved items
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery:', error);
      } else {
        setPhotos(data.filter(item => item.media_type === 'photo'));
        setVideos(data.filter(item => item.media_type === 'video'));
      }
      setIsLoading(false);
    };

    fetchGallery();
  }, []);

  // Prepare slides for the lightbox
  const slides = photos.map(photo => ({
    src: photo.media_url,
    title: photo.caption || '',
  }));

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="relative z-10">
      {/* Photo Gallery Section */}
      <h2 className="font-serif text-4xl text-center mb-8">Photo Memories</h2>
      {isLoading ? (
        <p className="text-center">Loading photos...</p>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="aspect-square relative overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => openLightbox(index)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Image
                src={photo.media_url}
                alt={photo.caption || 'Memory'}
                fill
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                <p className="text-white text-center text-sm">{photo.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white/70">Photos will be added soon.</p>
      )}

      {/* Lightbox Component */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={activeIndex}
      />

      {/* Video Memories Section */}
      <h2 className="font-serif text-4xl text-center mt-20 mb-8">Video Tributes</h2>
      {isLoading ? (
        <p className="text-center">Loading videos...</p>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map(video => {
            // Simple check for YouTube URLs
            const isYouTube = video.media_url.includes('youtube.com') || video.media_url.includes('youtu.be');
            const videoId = isYouTube ? new URL(video.media_url).searchParams.get('v') : null;

            return videoId ? (
              <div key={video.id} className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={video.caption || "Video Tribute"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                ></iframe>
              </div>
            ) : null;
          })}
        </div>
      ) : (
        <p className="text-center text-white/70">Videos will be added soon.</p>
      )}
    </div>
  );
}