// src/app/funeral-details/page.tsx
"use client";

import { AddToCalendarButton } from 'add-to-calendar-button-react';

export default function FuneralDetailsPage() {
  // Here is where you edit the actual dates, times, and locations.
  // Format dates as YYYY-MM-DD. Format times as HH:MM (24-hour clock).
  const events =[
    {
      id: "wake",
      title: "Wake Keeping & One-Week Observation",
      date: "2026-04-10", 
      startTime: "18:00",
      endTime: "22:00",
      location: "Family Residence, Kumasi, Ghana",
      description: "Join us for an evening of reflection, hymns, and sharing memories as we begin the celebration of her life.",
      dressCode: "Red and Black",
    },
    {
      id: "burial",
      title: "Burial Service & Final Rites",
      date: "2026-04-11",
      startTime: "08:00",
      endTime: "13:00",
      location: "St. Peter's Cathedral, Kumasi, Ghana",
      description: "The main burial service. Filing past begins at 8:00 AM, followed by the main church service at 9:00 AM. Interment follows immediately at the public cemetery.",
      dressCode: "Black and White",
    },
    {
      id: "thanksgiving",
      title: "Thanksgiving Memorial Service",
      date: "2026-04-12",
      startTime: "09:30",
      endTime: "12:30",
      location: "St. Peter's Cathedral, Kumasi, Ghana",
      description: "We gather to give thanks to God for a life beautifully lived.",
      dressCode: "White",
    }
  ];

  return (
    <div className="min-h-screen text-white pt-32 pb-16">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute bg-yellow-500/20 rounded-full w-[500px] h-[500px] top-0 left-1/2 -translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4">Celebration of Life</h1>
          <p className="font-sans text-xl text-white/80 max-w-2xl mx-auto">
            We warmly invite friends and family to join us as we honor and celebrate the beautiful life of our beloved mother.
          </p>
        </div>

        {/* Dress Code Banner */}
        <div className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6 text-center mb-16 shadow-xl">
          <h3 className="font-serif text-2xl text-yellow-300 mb-2">Dress Code Overview</h3>
          <p className="text-white/90 text-lg">
            Friday: <span className="font-bold">Red & Black</span> &nbsp;•&nbsp; 
            Saturday: <span className="font-bold">Black & White</span> &nbsp;•&nbsp; 
            Sunday: <span className="font-bold">All White</span>
          </p>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 flex flex-col hover:bg-gray-800/80 transition-colors">
              <h3 className="font-serif text-2xl font-bold mb-4 text-white">{event.title}</h3>
              
              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-start space-x-3 text-white/80">
                  <span className="text-xl">📅</span>
                  <div>
                    <p className="font-bold text-white">
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p>{event.startTime} - {event.endTime}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 text-white/80">
                  <span className="text-xl">📍</span>
                  <p>{event.location}</p>
                </div>

                <div className="flex items-start space-x-3 text-white/80">
                  <span className="text-xl">👕</span>
                  <p>Dress Code: <span className="font-bold text-white">{event.dressCode}</span></p>
                </div>

                <p className="text-sm text-white/60 italic mt-4 border-t border-gray-700 pt-4">
                  {event.description}
                </p>
              </div>

              {/* The Magic Add to Calendar Button */}
              <div className="mt-auto pt-4 flex justify-center">
                <AddToCalendarButton
                  name={`Funeral: ${event.title}`}
                  description={event.description}
                  startDate={event.date}
                  startTime={event.startTime}
                  endTime={event.endTime}
                  location={event.location}
                  options={['Apple', 'Google', 'Outlook.com']}
                  timeZone="Africa/Accra"
                  buttonStyle="round"
                  lightMode="dark"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Google Maps Embed Section */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-2 md:p-4 shadow-xl">
          <h2 className="font-serif text-3xl text-center mb-6 pt-4">Main Event Location</h2>
          <div className="aspect-video w-full rounded-xl overflow-hidden">
            {/* REPLACE THIS IFRAME SRC with your actual Google Maps embed link */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126742.66858525046!2d-1.7061737566113842!3d6.690022379361819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdb96fec261ea95%3A0x64426dcfa4b80b!2sKumasi%2C%20Ghana!5e0!3m2!1sen!2sus!4v1709230000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <p className="text-center text-white/60 text-sm mt-4 pb-2">
            Click "View larger map" to get driving directions to the venue.
          </p>
        </div>

      </div>
    </div>
  );
}