import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import AlarmManager from './Components/AlarmManager';
import Home from './pages/Home';
import TodoPage from './pages/TodoPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import AssignPage from './pages/AssignPage';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

// --- CONSTANTS (Defined outside to prevent crash) ---
const DEFAULT_USER = { 
  name: "User", 
  age: "", 
  bio: "Focusing on what matters.", 
  designation: "Achiever", 
  avatar: "VP" 
};

const DEFAULT_SETTINGS = { fontSize: 16 };

// --- LAYOUT COMPONENT ---
function Layout() {
  const location = useLocation();
  // Ensure full width for Home AND Assign page
  const isFullWidth = location.pathname === '/' || location.pathname === '/assign';

  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col">
      <Navbar />
      <AlarmManager />
      <main className={isFullWidth ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todo" element={<TodoPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/assign" element={<AssignPage />} />
        </Routes>
      </main>
    </div>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  // 1. Theme State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  
  // 2. User Profile State (With Safe Default)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('vipUser');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch (e) {
      return DEFAULT_USER;
    }
  });

  // 3. Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('vipSettings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  // 4. Tasks State
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('vipTasks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [quote, setQuote] = useState("Loading inspiration...");
  
  const quotes = [
    "Productivity is being able to do things that you were never able to do before.",
    "The way to get started is to quit talking and begin doing.",
    "Starve your distractions, feed your focus.",
    "Focus on being productive instead of busy."
  ];

  // --- EFFECTS ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
    localStorage.setItem('vipSettings', JSON.stringify(settings));
  }, [settings.fontSize]);

  useEffect(() => localStorage.setItem('vipTasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('vipUser', JSON.stringify(userProfile)), [userProfile]);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const interval = setInterval(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---
  const addTask = (task) => setTasks([...tasks, task]);
  const updateTask = (t) => setTasks(tasks.map(old => old.id === t.id ? t : old));
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  
  // --- FIXED LOGOUT FUNCTION ---
  const handleLogout = () => {
    if(window.confirm("Are you sure? This deletes local data.")) {
      // 1. Clear Storage
      localStorage.clear();
      
      // 2. Reset State Immediately (Prevents "Blank Screen" crash)
      setUserProfile(DEFAULT_USER);
      setTasks([]);
      setSettings(DEFAULT_SETTINGS);
      setDarkMode(false);

      // 3. Force Reload to Home
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    }
  };

  return (
    <AppContext.Provider value={{ 
      tasks, addTask, updateTask, deleteTask, 
      darkMode, setDarkMode, 
      userProfile, setUserProfile,
      settings, setSettings,
      quote, handleLogout
    }}>
      <Router>
         <Layout />
      </Router>
    </AppContext.Provider>
  );
}