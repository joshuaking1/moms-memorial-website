// src/components/TimelineItem.tsx
"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  image: string;
  align: 'left' | 'right';
}

export default function TimelineItem({ year, title, description, image, align }: TimelineItemProps) {
  const isLeft = align === 'left';

  const cardVariants = {
    hidden: { opacity: 0, x: isLeft ? -100 : 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="flex justify-center my-8 relative">
      {/* The Central Timeline Line */}
      <div className="absolute w-1 h-full bg-white/10 top-0 left-1/2 -translate-x-1/2"></div>
      
      {/* The Dot on the Line */}
      <div className="absolute w-4 h-4 bg-yellow-400 rounded-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 border-4 border-gray-900"></div>

      <motion.div
        className={`w-full max-w-sm p-6 rounded-lg shadow-lg ${isLeft ? 'mr-auto' : 'ml-auto'}`}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className={`flex ${isLeft ? 'flex-row-reverse' : 'flex-row'} items-center`}>
          <div className="flex-1 px-6">
            <p className="text-yellow-400 font-bold text-xl mb-1">{year}</p>
            <h3 className="font-serif text-2xl font-bold mb-2">{title}</h3>
            <p className="text-white/80">{description}</p>
          </div>
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
            <Image 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover" 
              width={128} 
              height={128}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}