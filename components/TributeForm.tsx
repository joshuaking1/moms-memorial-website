// src/components/TributeForm.tsx
"use client";

import { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TributeForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setError('Please enter your name and a message.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    const { error: insertError } = await supabase
      .from('tributes')
      .insert([{ name, message, location }]);
    
    setIsLoading(false);

    if (insertError) {
      console.error('Error submitting tribute:', insertError);
      setError('Sorry, there was an issue submitting your tribute. Please try again.');
    } else {
      setSuccess(true);
      setName('');
      setMessage('');
      setLocation('');
    }
  };

  if (success) {
    return (
      <div className="bg-green-900/50 border border-green-500 text-white p-8 rounded-lg text-center">
        <h3 className="font-serif text-2xl mb-2">Thank You</h3>
        <p>Your beautiful tribute has been received and is pending approval. Thank you for sharing your memory.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 p-8 rounded-lg shadow-lg">
      <h3 className="font-serif text-3xl text-center text-yellow-300 mb-6">Leave a Message of Remembrance</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-white/80 mb-2">Your Name</label>
            <input
              type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-white/80 mb-2">Location (Optional)</label>
            <input
              type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
              placeholder="e.g., Accra, Ghana"
            />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-white/80 mb-2">Your Tribute</label>
          <textarea
            id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
            className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
            required
          ></textarea>
        </div>
        
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <button type="submit" disabled={isLoading} className="w-full bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-full text-lg transition-transform transform hover:scale-105 disabled:bg-gray-500">
          {isLoading ? 'Submitting...' : 'Share Your Tribute'}
        </button>
      </form>
    </div>
  );
}