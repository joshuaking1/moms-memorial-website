// src/app/tributes/page.tsx
import TributeForm from '@/components/TributeForm';
import TributeWall from '@/components/TributeWall';

export default function TributesPage() {
  return (
    <div className="min-h-screen text-white pt-32 pb-16">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute bg-indigo-500/10 rounded-full w-96 h-96 -top-20 -left-20 animate-pulse-slow"></div>
        <div className="absolute bg-rose-500/10 rounded-full w-72 h-72 -bottom-10 -right-10 animate-pulse-slower"></div>
      </div>

      <div className="relative z-10 text-center mb-16 px-4">
        <h1 className="font-serif text-5xl md:text-7xl font-bold">Tribute Wall</h1>
        <p className="font-sans text-xl mt-4 text-white/80 max-w-3xl mx-auto">
          Share your condolences and loving memories. Your words bring comfort to all who read them.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 space-y-16">
        <TributeForm />
        <TributeWall />
      </div>
    </div>
  );
}