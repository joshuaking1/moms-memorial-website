// src/components/LightACandleModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, FormEvent } from 'react';

// This defines the expected "props" or inputs for our component
interface LightACandleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, message: string) => Promise<void>;
}

export default function LightACandleModal({ isOpen, onClose, onSubmit }: LightACandleModalProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await onSubmit(name, message);
      // Reset form on successful submission
      setName('');
      setMessage('');
      onClose(); // Close the modal
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside it
          >
            <h2 className="font-serif text-3xl text-yellow-300 text-center mb-2">Light a Candle of Remembrance</h2>
            <p className="text-center text-white/70 mb-6">Share a message to honor her memory.</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-white/80 mb-2">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="e.g., John Doe"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-white/80 mb-2">Your Message (Optional)</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-700 border-2 border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Share a short memory or tribute..."
                ></textarea>
              </div>

              {error && <p className="text-red-400 text-center mb-4">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-400 text-gray-900 font-bold py-4 px-8 rounded-full text-lg shadow-lg shadow-yellow-500/20 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Lighting Candle...' : 'Confirm and Light Candle'}
              </button>
            </form>

            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}