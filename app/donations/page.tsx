// src/app/donations/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';

// Define the shape of our donation data
interface Donation {
  id: number;
  created_at: string;
  name: string;
  amount: number;
  message: string | null;
  is_anonymous: boolean;
}

export default function DonationsPage() {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const[amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const[isAnonymous, setIsAnonymous] = useState(false);
  
  // Data State
  const[donations, setDonations] = useState<Donation[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const goalAmount = 20000; // Set your family's goal here in GHS
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Paystack Configuration
  const config = {
    reference: (new Date()).getTime().toString(), // Generates a unique ID
    email: email || "anonymous@support.com", // Paystack requires an email
    amount: parseFloat(amount) * 100, // Paystack expects amount in Pesewas/Kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    currency: 'GHS',
  };

  const initializePayment = isClient ? usePaystackPayment(config) : null;

  // Fetch past donations on load
  useEffect(() => {
    fetchDonations();
  },[]);

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setDonations(data);
      const total = data.reduce((sum, current) => sum + current.amount, 0);
      setTotalRaised(total);
    }
  };

  // What happens when Paystack payment is SUCCESSFUL
  const onSuccess = async (reference: any) => {
    const numericAmount = parseFloat(amount);
    
    // Save to Supabase
    const { error } = await supabase.from('donations').insert([{
      name: isAnonymous ? 'Anonymous Supporter' : name,
      amount: numericAmount,
      message: message,
      is_anonymous: isAnonymous,
      reference: reference.reference
    }]);

    if (!error) {
      alert("Thank you so much for your generous support. God bless you.");
      // Reset form
      setName(''); setEmail(''); setAmount(''); setMessage(''); setIsAnonymous(false);
      // Refresh wall
      fetchDonations();
    } else {
      alert("Payment successful, but there was an error saving your message to the wall.");
    }
  };

  // What happens if they close the Paystack window
  const onClose = () => {
    alert("Payment cancelled.");
  };

  const handleSupportClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (!initializePayment) {
      alert("Payment system is loading, please try again.");
      return;
    }
    // Launch Paystack Popup
    initializePayment({ onSuccess, onClose });
  };

  // Calculate progress bar width
  const progressPercentage = Math.min((totalRaised / goalAmount) * 100, 100);

  return (
    <div className="min-h-screen text-white pt-32 pb-16">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute bg-green-500/20 rounded-full w-[400px] h-[400px] top-20 right-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Side: Information & Form */}
        <div>
          <h1 className="font-serif text-5xl font-bold mb-6">Support the Farewell</h1>
          <p className="font-sans text-lg text-white/80 mb-8">
            We are deeply grateful for the love and support shown to our family during this time. 
            If you wish to contribute towards the funeral arrangements, you can do so securely via Mobile Money or Card here.
          </p>

          {/* Progress Bar (Optional, you can remove this block if you don't want a goal) */}
          <div className="mb-10 bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
            <div className="flex justify-between text-sm mb-2 text-white/80">
              <span>Raised: <strong className="text-yellow-300">GHS {totalRaised.toLocaleString()}</strong></span>
              <span>Goal: GHS {goalAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-yellow-400 h-3 rounded-full transition-all duration-1000" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Donation Form */}
          <form onSubmit={handleSupportClick} className="bg-gray-800/80 border border-gray-700 p-8 rounded-2xl shadow-xl">
            <h3 className="font-serif text-2xl text-yellow-300 mb-6">Make a Contribution</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-white/80 mb-2 text-sm">Amount (GHS) *</label>
                <input type="number" required min="1" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:outline-none" placeholder="e.g. 100" />
              </div>
              <div>
                <label className="block text-white/80 mb-2 text-sm">Your Email *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:outline-none" placeholder="For the receipt" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-white/80 mb-2 text-sm">Your Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={isAnonymous} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:outline-none disabled:opacity-50" placeholder={isAnonymous ? "Remaining Anonymous" : "Your full name"} />
            </div>

            <div className="mb-4">
              <label className="block text-white/80 mb-2 text-sm">Leave a short message (Optional)</label>
              <textarea rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:outline-none" placeholder="In loving memory..."></textarea>
            </div>

            <div className="mb-8 flex items-center space-x-3">
              <input type="checkbox" id="anonymous" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="w-5 h-5 accent-yellow-400" />
              <label htmlFor="anonymous" className="text-white/80 text-sm cursor-pointer">Make my contribution anonymous (hide my name & amount)</label>
            </div>

            <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-4 rounded-xl text-lg transition-transform transform hover:scale-[1.02] shadow-lg flex justify-center items-center space-x-2">
              <span>💳</span>
              <span>Support via MoMo or Card</span>
            </button>
            <div className="flex justify-center mt-3 opacity-60">
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/18/Paystack_Logo.png" alt="Secured by Paystack" className="h-4" />
            </div>
          </form>
        </div>

        {/* Right Side: Gratitude Wall */}
        <div>
          <h2 className="font-serif text-4xl font-bold mb-6">Gratitude Wall</h2>
          <p className="text-white/70 mb-8">We thank everyone who has generously contributed.</p>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {donations.length > 0 ? (
              donations.map((donation, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                  key={donation.id} 
                  className="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg text-yellow-300">
                      {donation.is_anonymous ? 'Anonymous Supporter' : donation.name}
                    </span>
                    {!donation.is_anonymous && (
                      <span className="text-green-400 font-medium">GHS {donation.amount}</span>
                    )}
                  </div>
                  {donation.message && (
                    <p className="text-white/80 italic text-sm border-l-2 border-yellow-500/30 pl-3">
                      "{donation.message}"
                    </p>
                  )}
                  <span className="text-xs text-white/40 mt-3">
                    {new Date(donation.created_at).toLocaleDateString()}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="text-center p-10 bg-gray-800/30 rounded-xl border border-gray-700 border-dashed text-white/50">
                No contributions yet. Be the first to support the family.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}