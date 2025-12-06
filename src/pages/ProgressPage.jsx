import React, { useState } from 'react';
import { useAppContext } from '../App';
import { Award, ChevronDown, ChevronUp, Activity } from 'lucide-react';

export default function ProgressPage() {
  const { tasks } = useAppContext();
  const [showMetricDetails, setShowMetricDetails] = useState(false);

  // Logic
  const getStats = (cat) => {
    const list = cat ? tasks.filter(t => t.category === cat) : tasks;
    const total = list.length;
    const completed = list.filter(t => t.status === 'Completed').length;
    return { total, completed, pending: total - completed, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
  };

  const overall = getStats(null);
  const personal = getStats('Personal');
  const professional = getStats('Professional');

  // KPI Logic
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) >= weekStart);
  const weekCompleted = weekTasks.filter(t => t.status === 'Completed').length;
  const sincerityScore = weekTasks.length === 0 ? 0 : Math.round((weekCompleted / weekTasks.length) * 100);

  let badge = "Needs Focus 🚧";
  let badgeColor = "from-red-500 to-orange-500";
  if (sincerityScore > 80) { badge = "Elite Performer 🏆"; badgeColor = "from-yellow-400 to-orange-500"; }
  else if (sincerityScore > 50) { badge = "Consistent 🌟"; badgeColor = "from-blue-400 to-indigo-500"; }

  return (
    <div className="space-y-10 animate-in fade-in max-w-5xl mx-auto">
      
      {/* 1. INTERACTIVE KPI CARD */}
      <div className={`relative rounded-3xl p-8 shadow-2xl text-white bg-gradient-to-br ${badgeColor} overflow-hidden`}>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
               <h3 className="text-3xl font-black flex items-center justify-center md:justify-start gap-3">
                 <Award size={32}/> Weekly KPI Report
               </h3>
               <p className="text-white/80 mt-2 font-medium">Your sincerity score based on this week's deadlines.</p>
               
               <button 
                 onClick={() => setShowMetricDetails(!showMetricDetails)}
                 className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
               >
                 {showMetricDetails ? "Hide Metrics" : "View Calculation Logic"} 
                 {showMetricDetails ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
               </button>
            </div>

            <div className="text-center bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
               <div className="text-6xl font-black">{sincerityScore}%</div>
               <div className="text-lg font-bold uppercase tracking-widest mt-1 opacity-90">{badge}</div>
            </div>
         </div>

         {/* Calculation Details Accordion */}
         {showMetricDetails && (
           <div className="relative z-10 mt-6 pt-6 border-t border-white/20 animate-in slide-in-from-top-2">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-black/20 p-3 rounded-xl">
                   <div className="text-2xl font-bold">{weekTasks.length}</div>
                   <div className="text-xs uppercase opacity-70">Total Due This Week</div>
                </div>
                <div className="bg-black/20 p-3 rounded-xl">
                   <div className="text-2xl font-bold">{weekCompleted}</div>
                   <div className="text-xs uppercase opacity-70">Completed On Time</div>
                </div>
                <div className="bg-black/20 p-3 rounded-xl">
                   <div className="text-sm font-mono mt-1">({weekCompleted} / {weekTasks.length}) * 100</div>
                   <div className="text-xs uppercase opacity-70">Formula</div>
                </div>
             </div>
           </div>
         )}
      </div>

      {/* 2. OVERALL TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
         <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2"><Activity className="text-blue-600"/> Overall Performance</h3>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 dark:divide-slate-700">
            <StatCell label="Total Tasks" value={overall.total} />
            <StatCell label="Completed" value={overall.completed} color="text-green-600"/>
            <StatCell label="Pending" value={overall.pending} color="text-orange-500"/>
            <StatCell label="Completion %" value={`${overall.percent}%`} color="text-blue-600"/>
         </div>
      </div>

      {/* 3. CATEGORY SPLIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <CategoryCard title="Personal Growth" data={personal} color="bg-blue-600" />
         <CategoryCard title="Professional Work" data={professional} color="bg-purple-600" />
      </div>
    </div>
  );
}

const StatCell = ({ label, value, color = "text-slate-800 dark:text-white" }) => (
  <div className="p-6 text-center">
     <div className={`text-4xl font-black ${color} mb-1`}>{value}</div>
     <div className="text-xs uppercase font-bold text-slate-400">{label}</div>
  </div>
);

const CategoryCard = ({ title, data, color }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
     <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-slate-700 dark:text-white">{title}</h4>
        <span className="text-2xl font-black text-slate-800 dark:text-white">{data.percent}%</span>
     </div>
     <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${data.percent}%` }}></div>
     </div>
     <div className="flex justify-between mt-4 text-sm text-slate-500 font-medium">
        <span>Done: {data.completed}</span>
        <span>Pending: {data.pending}</span>
     </div>
  </div>
);