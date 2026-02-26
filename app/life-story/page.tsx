// src/app/life-story/page.tsx
import TimelineItem from '@/components/TimelineItem';

// This is where you will tell your mother's story.
// Add as many events as you like.
const lifeEvents = [
  {
    year: '1955 - 1975',
    title: 'Early Life & Education',
    description: 'Born in the heart of Kumasi, she was a bright and joyful child. Her early years were filled with learning, laughter, and the strong values instilled by her parents.',
    image: '/early-life.jpg',
  },
  {
    year: '1976 - 1995',
    title: 'Building a Family',
    description: 'She met the love of her life and began a new chapter. As a mother, she was a pillar of strength, a source of unconditional love, and the heart of our home.',
    image: '/family-life.jpg',
  },
  {
    year: '1996 - 2020',
    title: 'Achievements & Community',
    description: 'A respected leader in her community and profession, she touched countless lives with her wisdom and generosity. Her achievements were many, but she was most proud of the family she raised.',
    image: '/achievements.jpg',
  },
  // Add more life events here...
];

export default function LifeStoryPage() {
  return (
    <div className="min-h-screen text-white pt-32 pb-16">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute bg-blue-500/20 rounded-full w-96 h-96 -top-20 -left-20 animate-pulse-slow"></div>
        <div className="absolute bg-purple-500/20 rounded-full w-72 h-72 -bottom-10 -right-10 animate-pulse-slower"></div>
      </div>
      
      <div className="relative z-10 text-center mb-16 px-4">
        <h1 className="font-serif text-5xl md:text-7xl font-bold">Her Beautiful Story</h1>
        <p className="font-sans text-xl mt-4 text-white/80 max-w-3xl mx-auto">
          A journey of love, strength, and unwavering grace. Follow the chapters of a life that inspired us all.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto px-4">
        {/* The main timeline vertical bar */}
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-white/20 top-0"></div>
        
        {lifeEvents.map((event, index) => (
          <TimelineItem
            key={index}
            year={event.year}
            title={event.title}
            description={event.description}
            image={event.image}
            align={index % 2 === 0 ? 'left' : 'right'} // This alternates left and right
          />
        ))}
      </div>
    </div>
  );
}