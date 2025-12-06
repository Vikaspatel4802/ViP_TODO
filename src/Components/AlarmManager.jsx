import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../App';
import { Bell, XCircle } from 'lucide-react';

// Use a reliable alarm sound URL
const ALARM_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

export default function AlarmManager() {
  const { tasks } = useAppContext();
  const [ringingTask, setRingingTask] = useState(null);
  
  // Audio Ref to control playback
  const audioRef = useRef(new Audio(ALARM_SOUND_URL));

  useEffect(() => {
    // 1. Request Browser Permission for notifications
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // 2. Check time every second
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMin = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHour}:${currentMin}`; 
      const currentDate = now.toISOString().split('T')[0]; 

      tasks.forEach(task => {
        // Trigger if: Date Matches AND Time Matches AND Task is NOT completed AND Not already ringing
        if (
           task.dueDate === currentDate && 
           task.dueTime === currentTime && 
           task.status !== 'Completed' &&
           !ringingTask 
        ) {
           triggerAlarm(task);
        }
      });
    }, 1000); 

    return () => clearInterval(interval);
  }, [tasks, ringingTask]);

  const triggerAlarm = (task) => {
    setRingingTask(task);
    
    // Play Sound
    audioRef.current.loop = true;
    audioRef.current.play().catch(e => console.log("Audio blocked. User interaction needed first."));

    // Show Notification
    if (Notification.permission === "granted") {
      new Notification(`⏰ ALARM: ${task.title}`, {
        body: `It's time! Priority: ${task.priority}`,
        requireInteraction: true
      });
    }
  };

  const stopAlarm = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0; 
    setRingingTask(null);
  };

  // If not ringing, show nothing (invisible component)
  if (!ringingTask) return null;

  // Visual Alarm Modal
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md animate-pulse">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full border-4 border-red-600">
        
        <div className="animate-bounce mb-6 flex justify-center text-red-600">
           <Bell size={64} fill="currentColor" />
        </div>

        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">TIME'S UP!</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 font-bold mb-8">{ringingTask.title}</p>
        
        <button 
          onClick={stopAlarm}
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xl rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <XCircle size={28} /> STOP ALARM
        </button>
      </div>
    </div>
  );
}