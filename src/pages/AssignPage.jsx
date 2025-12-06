import React, { useState, useEffect } from 'react';
import { Send, Mail, MessageSquare, MessageCircle, Clock, UserPlus, FileText, Hash, AlignLeft, Calendar, History, X, Sparkles, User } from 'lucide-react';
import { useAppContext } from '../App';

export default function AssignPage() {
  const { userProfile } = useAppContext();

  // --- STATE ---
  const [formData, setFormData] = useState({
    assignedBy: userProfile.name || '', 
    title: '',
    description: '', 
    assignDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    dueTime: '',
    phone: '', email: ''  
  });

  const [recents, setRecents] = useState({ phones: [], emails: [] });

  // Load Recents
  useEffect(() => {
    const savedPhones = JSON.parse(localStorage.getItem('vip_recent_phones') || '[]');
    const savedEmails = JSON.parse(localStorage.getItem('vip_recent_emails') || '[]');
    setRecents({ phones: savedPhones, emails: savedEmails });
  }, []);

  useEffect(() => {
    if (userProfile.name && !formData.assignedBy) {
        setFormData(prev => ({ ...prev, assignedBy: userProfile.name }));
    }
  }, [userProfile]);

  // --- HELPERS ---
  const saveToHistory = (type, value) => {
    if (!value) return;
    const key = type === 'phone' ? 'vip_recent_phones' : 'vip_recent_emails';
    const currentList = recents[type === 'phone' ? 'phones' : 'emails'];
    const newList = [value, ...currentList.filter(item => item !== value)].slice(0, 4);
    localStorage.setItem(key, JSON.stringify(newList));
    setRecents(prev => ({ ...prev, [type === 'phone' ? 'phones' : 'emails']: newList }));
  };

  const deleteRecent = (type, value, e) => {
    e.stopPropagation();
    const key = type === 'phone' ? 'vip_recent_phones' : 'vip_recent_emails';
    const currentList = recents[type === 'phone' ? 'phones' : 'emails'];
    const newList = currentList.filter(item => item !== value);
    localStorage.setItem(key, JSON.stringify(newList));
    setRecents(prev => ({ ...prev, [type === 'phone' ? 'phones' : 'emails']: newList }));
  };

  // --- NEW: GET DAY NAME ---
  const getDayName = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // --- VALIDATION HELPER ---
  const validateDates = () => {
    if (formData.dueDate && formData.assignDate) {
      if (new Date(formData.dueDate) < new Date(formData.assignDate)) {
        alert("⚠️ Logic Error: Task cannot be due before it is assigned!");
        return false;
      }
    }
    return true;
  };

  const generateMessageBody = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
    
    // Get Day Name (e.g., Monday)
    const dayName = getDayName(formData.dueDate);

    return `*${greeting}, New Task Assigned* 👇

📌 *Task:* ${formData.title}
📝 *Description:* ${formData.description}

📅 *Timeline Details:*
• Assigned By: ${formData.assignedBy}
• Assigned On: ${formData.assignDate}
• Due Date: ${formData.dueDate} (${dayName}) 
• Due Time: ${formData.dueTime}

Please complete it by ${dayName}.`;
  };

  // --- ACTIONS ---
  const handleWhatsApp = (e) => {
    e.preventDefault();
    if (!validateDates()) return; // Stop if date is wrong
    if (!formData.phone) return alert("Please enter a phone number.");
    
    saveToHistory('phone', formData.phone);
    let cleanNumber = formData.phone.replace(/\D/g, '');
    if (cleanNumber.length === 10) cleanNumber = '91' + cleanNumber;
    
    const message = encodeURIComponent(generateMessageBody());
    window.open(`https://api.whatsapp.com/send?phone=${cleanNumber}&text=${message}`, '_blank');
  };

  const handleSMS = (e) => {
    e.preventDefault();
    if (!validateDates()) return;
    if (!formData.phone) return alert("Please enter a phone number.");
    
    saveToHistory('phone', formData.phone);
    let cleanNumber = formData.phone.replace(/\D/g, '');
    const message = encodeURIComponent(generateMessageBody());
    window.location.href = `sms:${cleanNumber}?&body=${message}`;
  };

  const handleMail = (e) => {
    e.preventDefault();
    if (!validateDates()) return;
    if (!formData.email) return alert("Please enter an email address.");
    
    saveToHistory('email', formData.email);
    const subject = encodeURIComponent(`Task Assignment: ${formData.title}`);
    const body = encodeURIComponent(generateMessageBody());
    window.location.href = `mailto:${formData.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="animate-in fade-in pb-32">
      
      {/* HEADER */}
      <div className="relative w-full py-32 px-6 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-blue-900/10 dark:to-purple-900/10 opacity-80"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
           <div className="inline-flex p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl shadow-blue-500/40 animate-float transform rotate-3 hover:rotate-6 transition-transform duration-500">
             <Send size={48} className="text-white drop-shadow-md" />
           </div>
           
           <div>
             <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
               Delegate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">& Assign</span>
             </h1>
             <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto flex items-center justify-center gap-2">
               <Sparkles size={20} className="text-yellow-500"/> Seamlessly dispatch tasks.
             </p>
           </div>
        </div>
      </div>

      {/* FORM CONTAINER */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-20">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden backdrop-blur-xl">
          <div className="p-10 space-y-10">
            
            {/* TASK INFO */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <FileText size={14}/> Task & Sender Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assigned By */}
                <div className="relative group">
                  <div className="absolute top-4 left-4 text-slate-400 group-focus-within:text-purple-600 transition-colors">
                    <User size={20}/>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Assigned By (Name)" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-lg outline-none focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm"
                    value={formData.assignedBy}
                    onChange={e => setFormData({...formData, assignedBy: e.target.value})}
                  />
                </div>

                {/* Task Title */}
                <div className="relative group">
                  <div className="absolute top-4 left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Hash size={20}/>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Task Title (e.g. Monthly Report)" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="relative group transition-all rounded-2xl hover:bg-blue-50/50 dark:hover:bg-blue-900/10 hover:border-blue-300 dark:hover:border-blue-700/50 border border-transparent">
                <div className="absolute top-4 left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors"><AlignLeft size={20}/></div>
                <textarea rows="4" placeholder="Detailed Description..." className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all resize-none shadow-sm group-hover:border-blue-300 dark:group-hover:border-blue-800" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-700"/>

            {/* TIMELINE */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Clock size={14}/> Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* ASSIGN DATE */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Assigned Date</label>
                  <input type="date" className="input-field p-3 cursor-pointer font-bold shadow-sm" value={formData.assignDate} onChange={e => setFormData({...formData, assignDate: e.target.value})} />
                </div>
                
                {/* DUE DATE (With Min Date Restriction) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Due Date</label>
                  <input 
                    type="date" 
                    // This attribute prevents picking a date BEFORE the assigned date in the UI
                    min={formData.assignDate} 
                    className="input-field p-3 cursor-pointer font-bold shadow-sm" 
                    value={formData.dueDate} 
                    onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                  />
                </div>
                
                {/* DUE TIME */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Due Time</label>
                  <input type="time" className="input-field p-3 cursor-pointer font-bold shadow-sm" value={formData.dueTime} onChange={e => setFormData({...formData, dueTime: e.target.value})} />
                </div>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-700"/>

            {/* RECIPIENT */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><UserPlus size={14}/> Recipient Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="relative group">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-green-600">Tel</span>
                     <input type="tel" placeholder="Phone (e.g. 919876...)" className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-mono font-bold shadow-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  {recents.phones.length > 0 && (<div className="flex flex-wrap gap-2 animate-in fade-in"><span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1"><History size={10}/> Recent:</span>{recents.phones.map((num, i) => (<button key={i} onClick={() => setFormData({...formData, phone: num})} className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs rounded-md font-mono hover:bg-green-100 transition-colors group">{num} <span onClick={(e) => deleteRecent('phone', num, e)} className="hover:bg-green-200 rounded-full p-0.5"><X size={8}/></span></button>))}</div>)}
                </div>
                <div className="space-y-2">
                  <div className="relative group">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-blue-600">@</span>
                     <input type="email" placeholder="Email Address" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold shadow-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  {recents.emails.length > 0 && (<div className="flex flex-wrap gap-2 animate-in fade-in"><span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1"><History size={10}/> Recent:</span>{recents.emails.map((mail, i) => (<button key={i} onClick={() => setFormData({...formData, email: mail})} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs rounded-md hover:bg-blue-100 transition-colors">{mail}<span onClick={(e) => deleteRecent('email', mail, e)} className="hover:bg-blue-200 rounded-full p-0.5"><X size={8}/></span></button>))}</div>)}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={handleWhatsApp} className="group relative flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 transition-all hover:-translate-y-1 overflow-hidden"><div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div><MessageCircle size={24} className="relative z-10"/> <span className="relative z-10">WhatsApp</span></button>
              <button onClick={handleMail} className="group relative flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1 overflow-hidden"><div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div><Mail size={24} className="relative z-10"/> <span className="relative z-10">Email Draft</span></button>
              <button onClick={handleSMS} className="group relative flex items-center justify-center gap-3 py-4 bg-slate-700 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-500/20 transition-all hover:-translate-y-1 overflow-hidden"><div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div><MessageSquare size={24} className="relative z-10"/> <span className="relative z-10">SMS</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}