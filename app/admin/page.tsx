// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const[pendingTributes, setPendingTributes] = useState<any[]>([]);
  const[pendingMedia, setPendingMedia] = useState<any[]>([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const router = useRouter();

  useEffect(() => {
    checkUserAndFetchData();
  },[]);

  const checkUserAndFetchData = async () => {
    // 1. Check if user is securely logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/admin/login'); // Kick out intruders
      return;
    }

    setIsCheckingAuth(false); // User is verified! Let's load data.

    // 2. Fetch pending tributes
    const { data: tributes } = await supabase
      .from('tributes')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false });
    if (tributes) setPendingTributes(tributes);

    // 3. Fetch pending gallery media
    const { data: media } = await supabase
      .from('gallery')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false });
    if (media) setPendingMedia(media);

    // 4. Fetch total donations
    const { data: donations } = await supabase.from('donations').select('amount');
    if (donations) {
      const total = donations.reduce((sum, current) => sum + current.amount, 0);
      setTotalDonations(total);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  // --- ACTIONS ---
  
  const approveTribute = async (id: number) => {
    await supabase.from('tributes').update({ approved: true }).eq('id', id);
    setPendingTributes(pendingTributes.filter(t => t.id !== id)); // Remove from list
  };

  const deleteTribute = async (id: number) => {
    if(confirm("Are you sure you want to delete this tribute permanently?")) {
      await supabase.from('tributes').delete().eq('id', id);
      setPendingTributes(pendingTributes.filter(t => t.id !== id));
    }
  };

  const approveMedia = async (id: number) => {
    await supabase.from('gallery').update({ approved: true }).eq('id', id);
    setPendingMedia(pendingMedia.filter(m => m.id !== id));
  };

  const deleteMedia = async (id: number) => {
    if(confirm("Are you sure you want to delete this media permanently?")) {
      await supabase.from('gallery').delete().eq('id', id);
      setPendingMedia(pendingMedia.filter(m => m.id !== id));
    }
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Verifying secure access...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-10 pt-24">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <div>
          <h1 className="font-serif text-3xl font-bold">Family Admin Panel</h1>
          <p className="text-white/60">Manage your mother's memorial securely.</p>
        </div>
        <button onClick={handleLogout} className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg transition-colors font-bold border border-red-500/50">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Settings */}
        <div className="space-y-8">
          {/* Donation Tracker */}
          <div className="bg-gradient-to-br from-green-900/50 to-gray-800 border border-green-500/30 p-8 rounded-2xl shadow-lg">
            <h2 className="text-white/80 font-bold mb-2">Total Financial Support</h2>
            <p className="text-5xl font-serif text-green-400 font-bold">
              GHS {totalDonations.toLocaleString()}
            </p>
            <p className="text-sm text-white/50 mt-4">This includes MoMo and Card payments via Paystack.</p>
          </div>
        </div>

        {/* Middle Column: Pending Tributes */}
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-lg flex flex-col h-[600px]">
          <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
            <span>Pending Tributes</span>
            <span className="bg-yellow-400 text-gray-900 text-xs px-2 py-1 rounded-full">{pendingTributes.length}</span>
          </h2>
          
          <div className="overflow-y-auto pr-2 space-y-4 flex-grow custom-scrollbar">
            {pendingTributes.length === 0 ? (
              <p className="text-white/50 text-center mt-10">No pending tributes to review.</p>
            ) : (
              pendingTributes.map(tribute => (
                <div key={tribute.id} className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                  <p className="font-bold text-yellow-300">{tribute.name} <span className="text-xs text-white/50 font-normal">({tribute.location})</span></p>
                  <p className="text-white/90 text-sm my-3 italic">"{tribute.message}"</p>
                  <div className="flex space-x-3 mt-4">
                    <button onClick={() => approveTribute(tribute.id)} className="flex-1 bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-2 rounded-lg transition-colors text-sm">Approve</button>
                    <button onClick={() => deleteTribute(tribute.id)} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white font-bold py-2 rounded-lg transition-colors text-sm">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Pending Gallery */}
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-lg flex flex-col h-[600px]">
          <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
            <span>Pending Media</span>
            <span className="bg-yellow-400 text-gray-900 text-xs px-2 py-1 rounded-full">{pendingMedia.length}</span>
          </h2>

          <div className="overflow-y-auto pr-2 space-y-4 flex-grow custom-scrollbar">
            {pendingMedia.length === 0 ? (
              <p className="text-white/50 text-center mt-10">No pending photos or videos.</p>
            ) : (
              pendingMedia.map(media => (
                <div key={media.id} className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                  {media.media_type === 'photo' ? (
                    <img src={media.media_url} alt="Pending" className="w-full h-32 object-cover rounded-lg mb-3" />
                  ) : (
                    <div className="w-full h-32 bg-black rounded-lg mb-3 flex items-center justify-center text-xs text-white/50 break-all p-2 text-center">
                      Video Link: <br/>{media.media_url}
                    </div>
                  )}
                  <p className="text-sm text-white/80 mb-3">{media.caption || 'No caption'}</p>
                  <div className="flex space-x-3">
                    <button onClick={() => approveMedia(media.id)} className="flex-1 bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-2 rounded-lg transition-colors text-sm">Approve</button>
                    <button onClick={() => deleteMedia(media.id)} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white font-bold py-2 rounded-lg transition-colors text-sm">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}