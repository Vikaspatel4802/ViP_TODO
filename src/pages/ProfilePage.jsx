import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
// FIX: Added 'Trash2' and 'CheckCircle' to imports below
import { Save, User, Moon, Sun, LogOut, ChevronDown, ChevronUp, ShieldAlert, Settings as SettingsIcon, PenTool, Sparkles, Trash2, CheckCircle } from 'lucide-react';
import { useAppContext } from '../App';

// --- SUB-COMPONENT: Profile Form (Defined OUTSIDE to fix focus issue) ---
const ProfileForm = ({ data, setData, onSubmit, successMsg, btnColor, btnText }) => {
  const avatars = ["👨‍💻", "👩‍💻", "🚀", "🦁", "⚡", "VP", "🎓", "👑"];

  return (
    <form onSubmit={onSubmit} className="space-y-6 animate-in fade-in duration-500">
      
      {/* Avatar Section */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
        <label className="text-xs font-extrabold uppercase text-slate-400 mb-4 block tracking-wider flex items-center gap-2">
          <Sparkles size={12} className="text-yellow-500"/> Choose Avatar
        </label>
        <div className="flex flex-wrap gap-3">
          {avatars.map(av => (
            <button 
              key={av} 
              type="button" 
              onClick={() => setData({...data, avatar: av})}
              className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${
                data.avatar === av 
                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-110' 
                : 'bg-white dark:bg-slate-800 shadow-sm hover:scale-105 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {av}
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
          <input 
            type="text" 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg transition-all duration-200"
            value={data.name} 
            onChange={e => setData({...data, name: e.target.value})} 
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 ml-1">Age</label>
          <input 
            type="number" 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg transition-all duration-200"
            value={data.age} 
            onChange={e => setData({...data, age: e.target.value})} 
          />
        </div>
      </div>

      <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 ml-1">Designation</label>
          <input 
            type="text" 
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg transition-all duration-200"
            value={data.designation} 
            onChange={e => setData({...data, designation: e.target.value})} 
          />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 ml-1">Bio</label>
        <textarea 
          rows="3" 
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-800 focus:shadow-lg transition-all duration-200 resize-none"
          value={data.bio} 
          onChange={e => setData({...data, bio: e.target.value})}
        ></textarea>
      </div>

      <button 
        type="submit" 
        className={`w-full py-4 rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 text-white ${btnColor}`}
      >
          <Save size={20}/> {btnText}
      </button>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-700 text-center font-bold rounded-xl animate-in slide-in-from-bottom-2 border border-emerald-100 shadow-sm flex items-center justify-center gap-2">
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}
    </form>
  );
};

// --- MAIN COMPONENT ---
export default function ProfilePage() {
  const { userProfile, setUserProfile, settings, setSettings, darkMode, setDarkMode, handleLogout } = useAppContext();
  
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('profile');

  // Local Edit State
  const [editData, setEditData] = useState(userProfile);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) setActiveSection(section);
  }, [searchParams]);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setSuccessMsg(''); 
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile(editData);
    setSuccessMsg('Saved Successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-6 px-4">
      
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Account Manager</h1>
        <p className="text-slate-500 font-medium">Personalize your experience & details</p>
      </div>

      <div className="space-y-6">

        {/* ========================================================= */}
        {/* 1. PROFILE DROP DOWN (First Time Filling)                 */}
        {/* ========================================================= */}
        <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-sm border overflow-hidden transition-all duration-300 ${activeSection === 'profile' ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-2xl' : 'border-slate-200 dark:border-slate-700'}`}>
          <button 
            onClick={() => toggleSection('profile')}
            className="w-full flex items-center justify-between p-6 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl transition-colors ${activeSection === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-white group-hover:bg-blue-600 group-hover:text-white'}`}>
                <User size={28} />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Profile</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Fill Personal Details</p>
              </div>
            </div>
            <div className={`transition-transform duration-300 ${activeSection === 'profile' ? 'rotate-180 text-blue-600' : 'text-slate-300'}`}>
               <ChevronDown size={24}/>
            </div>
          </button>

          {activeSection === 'profile' && (
            <div className="p-8 border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800">
               <ProfileForm 
                 data={editData} 
                 setData={setEditData} 
                 onSubmit={handleSaveProfile} 
                 successMsg={successMsg}
                 btnColor="bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
                 btnText="Save Profile Details"
               />
            </div>
          )}
        </div>


        {/* ========================================================= */}
        {/* 2. SETTINGS DROP DOWN (Theme, Font & Edit Profile)        */}
        {/* ========================================================= */}
        <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-sm border overflow-hidden transition-all duration-300 ${activeSection === 'settings' ? 'border-purple-500 ring-4 ring-purple-500/10 shadow-2xl' : 'border-slate-200 dark:border-slate-700'}`}>
          <button 
            onClick={() => toggleSection('settings')}
            className="w-full flex items-center justify-between p-6 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl transition-colors ${activeSection === 'settings' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40' : 'bg-purple-50 text-purple-600 dark:bg-slate-700 dark:text-white group-hover:bg-purple-600 group-hover:text-white'}`}>
                <SettingsIcon size={28} />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Settings & Edit</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Theme, Font & Update Profile</p>
              </div>
            </div>
            <div className={`transition-transform duration-300 ${activeSection === 'settings' ? 'rotate-180 text-purple-600' : 'text-slate-300'}`}>
               <ChevronDown size={24}/>
            </div>
          </button>

          {activeSection === 'settings' && (
            <div className="p-8 border-t border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800 space-y-10">
               
               {/* A. APP APPEARANCE */}
               <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-px w-8 bg-slate-300"></span>
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">App Appearance</h3>
                    <span className="h-px flex-1 bg-slate-100"></span>
                  </div>
                  
                  {/* Theme */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-700/50">
                     <button onClick={() => setDarkMode(false)} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${!darkMode ? 'bg-white text-slate-800 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}><Sun size={18}/> Light</button>
                     <button onClick={() => setDarkMode(true)} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${darkMode ? 'bg-slate-700 text-white shadow-md ring-1 ring-slate-600' : 'text-slate-400 hover:text-slate-600'}`}><Moon size={18}/> Dark</button>
                  </div>

                  {/* Font */}
                  <div className="px-2">
                     <div className="flex justify-between mb-3">
                        <span className="text-xs font-bold uppercase text-slate-400">Font Size</span>
                        <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">{settings.fontSize}px</span>
                     </div>
                     <input type="range" min="14" max="24" step="1" value={settings.fontSize} onChange={e => setSettings({...settings, fontSize: Number(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"/>
                  </div>
               </div>

               {/* B. EDIT PROFILE (Reusing Component) */}
               <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="h-px w-8 bg-slate-300"></span>
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Update Details</h3>
                    <span className="h-px flex-1 bg-slate-100"></span>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/50">
                     <ProfileForm 
                       data={editData} 
                       setData={setEditData} 
                       onSubmit={handleSaveProfile} 
                       successMsg={successMsg}
                       btnColor="bg-purple-600 hover:bg-purple-700 shadow-purple-500/30"
                       btnText="Update My Profile"
                     />
                  </div>
               </div>

            </div>
          )}
        </div>


        {/* ========================================================= */}
        {/* 3. LOG OUT DROP DOWN                                      */}
        {/* ========================================================= */}
        <div className={`bg-white dark:bg-slate-800 rounded-3xl shadow-sm border overflow-hidden transition-all duration-300 ${activeSection === 'logout' ? 'border-red-500 ring-4 ring-red-500/10 shadow-2xl' : 'border-slate-200 dark:border-slate-700'}`}>
          <button 
            onClick={() => toggleSection('logout')}
            className="w-full flex items-center justify-between p-6 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl transition-colors ${activeSection === 'logout' ? 'bg-red-600 text-white shadow-lg shadow-red-500/40' : 'bg-red-50 text-red-600 dark:bg-slate-700 dark:text-white group-hover:bg-red-600 group-hover:text-white'}`}>
                <LogOut size={28} />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Log Out</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Sign out & Clear Data</p>
              </div>
            </div>
            <div className={`transition-transform duration-300 ${activeSection === 'logout' ? 'rotate-180 text-red-600' : 'text-slate-300'}`}>
               <ChevronDown size={24}/>
            </div>
          </button>

          {activeSection === 'logout' && (
            <div className="p-8 border-t border-slate-100 dark:border-slate-700/50 bg-red-50/50 dark:bg-red-900/10 animate-in slide-in-from-top-2">
               <div className="flex flex-col items-center text-center space-y-6">
                  <div className="p-5 bg-white dark:bg-slate-800 rounded-full shadow-lg animate-pulse">
                    <ShieldAlert size={48} className="text-red-500"/>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-red-700 dark:text-red-400">Confirm Logout?</h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      This action will immediately remove all your local tasks, profile settings, and history from this browser.
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleLogout} 
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95"
                  >
                     <Trash2 size={22}/> YES, LOG OUT NOW
                  </button>
               </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}