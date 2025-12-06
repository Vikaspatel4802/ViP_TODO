import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp } from 'lucide-react';
import { useAppContext } from '../App';

export default function Home() {
  const { userProfile, tasks, quote } = useAppContext();

  // --- 1. FIX: Get Local Date String (YYYY-MM-DD) correctly ---
  const getLocalDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDate();

  // --- 2. Analytics Logic ---
  const count = (cat, dateStr, week) => {
    const today = new Date(); // Current moment for week calculation
    
    return tasks.filter(t => {
       // Category Check
       const isCat = cat ? t.category === cat : true;
       
       // Status Check (Must be pending)
       const isPending = t.status !== 'Completed';
       
       // Date Check
       let dateMatch = true;
       if (week) {
         // Logic for "This Week": Date is between Today and 7 days from now
         if (!t.dueDate) return false;
         const taskDate = new Date(t.dueDate);
         const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
         // Reset time portions for accurate date comparison
         today.setHours(0,0,0,0);
         dateMatch = taskDate >= today && taskDate <= nextWeek;
       } else if (dateStr) {
         // Logic for "Today": String Exact Match
         dateMatch = t.dueDate === dateStr;
       }

       return isCat && isPending && dateMatch;
    }).length;
  };

  const stats = {
    personal: count('Personal', todayStr),
    pro: count('Professional', todayStr),
    total: count(null, todayStr)
  };

  return (
    // Added 'pb-24' for bottom margin/spacing
    <div className="animate-in fade-in duration-700 pb-24">
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[60vh] min-h-[550px] overflow-hidden flex items-center justify-center text-center group">
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[15s] ease-in-out group-hover:scale-110"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop')",
            filter: "brightness(0.5)"
          }}
        ></div>

        {/* Content Container */}
        <div className="relative z-10 space-y-8 max-w-5xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] animate-float">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">{userProfile.name}</span>!
          </h1>
          
          <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl max-w-3xl transform transition-all hover:scale-105 hover:bg-white/20">
             <p className="text-2xl md:text-3xl font-medium italic text-white/95 leading-relaxed font-serif">
               "{quote}"
             </p>
          </div>

          <div className="pt-6">
            <Link to="/todo" className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xl rounded-full shadow-lg shadow-purple-900/40 transition-all hover:translate-y-[-4px] ring-1 ring-white/20">
              <Plus size={28} className="mr-3" /> Start Prioritizing
            </Link>
          </div>
        </div>
      </div>

      {/* 2. ANALYTICS TABLE (Centered Container) */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                <TrendingUp className="text-blue-600"/> Today's Outlook ({todayStr})
              </h3>
          </div>
          <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-700 text-center">
              <div className="p-8">
                <div className="text-4xl font-black text-blue-600 mb-2">{stats.personal}</div>
                <div className="text-xs uppercase font-bold text-slate-500">Personal Pending</div>
              </div>
              <div className="p-8">
                <div className="text-4xl font-black text-purple-600 mb-2">{stats.pro}</div>
                <div className="text-xs uppercase font-bold text-slate-500">Professional Pending</div>
              </div>
              <div className="p-8 bg-slate-50 dark:bg-slate-700/30">
                <div className="text-5xl font-black text-emerald-600 mb-2">{stats.total}</div>
                <div className="text-xs uppercase font-bold text-slate-500">Total Due Today</div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}