import React, { useState } from 'react';
import { Trash2, Check, Calendar, Plus, Info, Edit3, Save, X, Clock, Briefcase, User, ChevronUp, Search } from 'lucide-react';
import { useAppContext } from '../App';

export default function TodoPage() {
  const { tasks, addTask, updateTask, deleteTask } = useAppContext();
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');
  
  // Toggle for the Add Task Form
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '', details: '', priority: 'High', category: 'Personal', tags: '', dueDate: '', dueTime: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewDetailTask, setViewDetailTask] = useState(null);

  // Common style for all inputs to ensure high contrast
  const inputStyle = "w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";

  // --- 1. HANDLE ADD NEW TASK ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    
    const newTask = {
      id: crypto.randomUUID(),
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t),
      status: 'Not Started',
      createdAt: new Date().toISOString()
    };
    
    addTask(newTask);
    setFormData({ title: '', details: '', priority: 'High', category: 'Personal', tags: '', dueDate: '', dueTime: '' });
    setIsFormOpen(false); 
  };

  // --- 2. HANDLE EDIT MODE ---
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditForm({
      ...task,
      tags: Array.isArray(task.tags) ? task.tags.join(', ') : ''
    });
  };

  const saveEdit = () => {
    const updatedTask = {
      ...editForm,
      tags: typeof editForm.tags === 'string' 
            ? editForm.tags.split(',').map(t => t.trim()).filter(t => t) 
            : editForm.tags
    };
    updateTask(updatedTask);
    setEditingId(null);
  };

  const priorityWeight = { High: 3, Medium: 2, Low: 1 };
  const priorityConfig = {
    High: { color: 'bg-red-600', label: 'High Priority' },
    Medium: { color: 'bg-orange-500', label: 'Medium Priority' },
    Low: { color: 'bg-emerald-500', label: 'Low Priority' },
  };

  // --- 3. FILTER & SEARCH LOGIC ---
  const filteredTasks = tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                            t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      
      if (!matchesSearch) return false;

      const todayStr = new Date().toISOString().split('T')[0];
      
      if (filterType === 'Today') return t.dueDate === todayStr;
      if (filterType === 'Personal') return t.category === 'Personal';
      if (filterType === 'Professional') return t.category === 'Professional';
      
      return true;
  }).sort((a, b) => {
      if (a.status === 'Completed' && b.status !== 'Completed') return 1;
      if (a.status !== 'Completed' && b.status === 'Completed') return -1;
      return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  const addToCalendar = (task) => {
    if (!task.dueDate) return alert("Set a date first!");
    const dateStr = task.dueDate.replace(/-/g, '');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task.title)}&dates=${dateStr}/${dateStr}&details=${encodeURIComponent(task.details)}&add=vikas.p@navgurukul.org`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8 animate-in fade-in slide-in-from-bottom-4">
      
      {/* ----------------------------- */}
      {/* COLUMN 1: ANIMATED ADD FORM   */}
      {/* ----------------------------- */}
      <div className="lg:col-span-2 space-y-6">
        <div className="sticky top-24 z-30">
          
          {!isFormOpen && (
            <button 
              onClick={() => setIsFormOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-3xl p-10 shadow-xl shadow-blue-500/30 flex flex-col items-center justify-center gap-4 transition-all transform hover:scale-105 group"
            >
              <div className="bg-white/20 p-5 rounded-full group-hover:rotate-90 transition-transform duration-500">
                <Plus size={40} strokeWidth={3} />
              </div>
              <span className="text-2xl font-bold tracking-wide">Add New Task</span>
            </button>
          )}

          {isFormOpen && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                   <Plus className="text-blue-600" size={28}/> New Task Details
                 </h2>
                 <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                   <ChevronUp size={24} className="text-slate-400"/>
                 </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* FIX: Applied 'inputStyle' to all inputs for contrast */}
                <input 
                  type="text" 
                  required 
                  placeholder="Task Title" 
                  className={`${inputStyle} p-4 text-lg font-bold`} 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                />
                
                <div className="grid grid-cols-2 gap-4">
                   <select 
                     className={`${inputStyle} p-3 cursor-pointer`} 
                     value={formData.priority} 
                     onChange={e => setFormData({...formData, priority: e.target.value})}
                   >
                      <option>High</option><option>Medium</option><option>Low</option>
                   </select>
                   <select 
                     className={`${inputStyle} p-3 cursor-pointer`} 
                     value={formData.category} 
                     onChange={e => setFormData({...formData, category: e.target.value})}
                   >
                      <option>Personal</option><option>Professional</option>
                   </select>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Tags (comma separated)" 
                  className={`${inputStyle} p-3`} 
                  value={formData.tags} 
                  onChange={e => setFormData({...formData, tags: e.target.value})} 
                />
                
                <div className="grid grid-cols-2 gap-4">
                   <input 
                     type="date" 
                     className={`${inputStyle} p-3 cursor-pointer`} 
                     value={formData.dueDate} 
                     onChange={e => setFormData({...formData, dueDate: e.target.value})} 
                   />
                   <input 
                     type="time" 
                     className={`${inputStyle} p-3 cursor-pointer`} 
                     value={formData.dueTime} 
                     onChange={e => setFormData({...formData, dueTime: e.target.value})} 
                   />
                </div>

                <textarea 
                  placeholder="Detailed Description..." 
                  rows="4" 
                  className={`${inputStyle} p-3`} 
                  value={formData.details} 
                  onChange={e => setFormData({...formData, details: e.target.value})} 
                ></textarea>

                <div className="flex gap-3 pt-4">
                   <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-4 rounded-xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600">Cancel</button>
                   <button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1">Save Task</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ----------------------------- */}
      {/* COLUMN 2: TASK LIST & SEARCH  */}
      {/* ----------------------------- */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* HEADER: Filters & Search */}
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Today', 'Personal', 'Professional'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilterType(f)} 
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                  filterType === f 
                  ? 'bg-blue-600 text-white shadow-blue-500/30' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full xl:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              // FIX: Explicit text colors for search bar
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {filteredTasks.map(task => {
             const pConfig = priorityConfig[task.priority] || priorityConfig.Low;
             const isPro = task.category === 'Professional';
             
             return (
               <div key={task.id} className={`relative bg-white dark:bg-slate-800 rounded-2xl p-8 min-h-[180px] shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 ${task.status === 'Completed' ? 'opacity-60 grayscale-[0.8]' : ''}`}>
                  
                  {/* Priority Badge */}
                  {task.status !== 'Completed' && (
                    <div className={`absolute top-0 right-0 text-white text-[10px] uppercase font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl shadow-sm tracking-wide ${pConfig.color}`}>
                      {pConfig.label}
                    </div>
                  )}

                  {editingId === task.id ? (
                     // --- EDIT MODE ---
                     <div className="space-y-4 animate-in fade-in bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
                        <label className="text-xs uppercase font-bold text-slate-400">Editing Title</label>
                        {/* FIX: Explicit style for edit inputs */}
                        <input type="text" className={`${inputStyle} p-2 font-bold text-lg`} value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs uppercase font-bold text-slate-400">Priority</label>
                                <select className={`${inputStyle} p-2`} value={editForm.priority} onChange={e => setEditForm({...editForm, priority: e.target.value})}>
                                    <option>High</option><option>Medium</option><option>Low</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs uppercase font-bold text-slate-400">Category</label>
                                <select className={`${inputStyle} p-2`} value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                                    <option>Personal</option><option>Professional</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs uppercase font-bold text-slate-400">Tags (comma separated)</label>
                            <input type="text" className={`${inputStyle} p-2`} value={editForm.tags} onChange={e => setEditForm({...editForm, tags: e.target.value})} />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                           <button onClick={() => setEditingId(null)} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300">Cancel</button>
                           <button onClick={saveEdit} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 shadow-md">
                             <Save size={16}/> Save Changes
                           </button>
                        </div>
                     </div>
                  ) : (
                     // --- VIEW MODE ---
                     <div>
                        <div className="flex justify-between items-start gap-4">
                           <div className="flex-1 pr-4">
                              <h3 className={`text-2xl font-bold text-slate-800 dark:text-white mb-3 ${task.status === 'Completed' ? 'line-through decoration-2 decoration-slate-400' : ''}`}>{task.title}</h3>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                 {/* Category Tag */}
                                 <span className={`flex items-center gap-1 border px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${isPro ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800'}`}>
                                    {isPro ? <Briefcase size={12}/> : <User size={12}/>}
                                    {task.category}
                                 </span>
                                 
                                 {/* Tags (Clean, no hash) */}
                                 {Array.isArray(task.tags) && task.tags.map((t,i) => (
                                   <span key={i} className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                                     {t}
                                   </span>
                                 ))}
                              </div>

                              {task.dueDate && (
                                 <div className="flex flex-wrap items-center gap-3 mt-3">
                                   <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-sm font-bold">
                                     <Calendar size={14} /> <span>{task.dueDate}</span>
                                   </div>
                                   {task.dueTime && (
                                     <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg text-sm font-bold">
                                       <Clock size={14} /> <span>{task.dueTime}</span>
                                     </div>
                                   )}
                                 </div>
                              )}
                           </div>

                           <div className="flex flex-col gap-2 pt-2">
                              <button onClick={() => updateTask({...task, status: task.status === 'Completed' ? 'Not Started' : 'Completed'})} className={`p-2.5 rounded-xl transition-all shadow-sm ${task.status === 'Completed' ? 'bg-green-100 text-green-600 border border-green-200' : 'bg-slate-50 dark:bg-slate-700 text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-green-500 hover:text-white hover:border-green-500'}`}><Check size={20}/></button>
                              
                              <button onClick={() => startEdit(task)} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all shadow-sm"><Edit3 size={20}/></button>
                              
                              <button onClick={() => deleteTask(task.id)} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"><Trash2 size={20}/></button>
                           </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                           {task.details ? (
                             <button onClick={() => setViewDetailTask(task)} className="text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"><Info size={18}/> View Details</button>
                           ) : <span className="text-xs text-slate-300 italic">No extra details</span>}
                           <button onClick={() => addToCalendar(task)} className="text-sm font-bold text-slate-500 hover:text-orange-600 flex items-center gap-1 transition-colors group"><Calendar size={18} className="group-hover:animate-pulse"/> Add to G-Cal</button>
                        </div>
                     </div>
                  )}
               </div>
             );
          })}
          
          {filteredTasks.length === 0 && (
             <div className="text-center py-12 opacity-50 dark:text-slate-400">
                <p className="text-xl font-bold">No tasks found here.</p>
                <p>Try adding one or changing filters!</p>
             </div>
          )}
        </div>
      </div>

      {viewDetailTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl max-w-lg w-full relative shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
              <button onClick={() => setViewDetailTask(null)} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:rotate-90 transition-transform"><X size={20} className="text-slate-600 dark:text-white"/></button>
              <h2 className="text-2xl font-black mb-1 pr-8 text-slate-900 dark:text-white">{viewDetailTask.title}</h2>
              <div className="flex gap-2 mb-6">
                 <span className="text-xs font-bold uppercase bg-blue-100 text-blue-700 px-2 py-1 rounded">{viewDetailTask.category}</span>
                 <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${priorityConfig[viewDetailTask.priority].color} bg-opacity-20 text-${priorityConfig[viewDetailTask.priority].color.split('-')[1]}-700`}>
                    {viewDetailTask.priority}
                 </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl text-slate-700 dark:text-slate-300 whitespace-pre-wrap border border-slate-200 dark:border-slate-700 text-sm leading-relaxed shadow-inner">
                {viewDetailTask.details}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}