import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Play, Pause, SkipForward, RotateCcw, Settings, BrainCircuit, Coffee } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import usePomodoroSettings from "../../hooks/pomodoro/usePomodoroSettings";
import SettingsModal from "../../components/pomodoro/SettingsModal";
import TaskList from "../../components/pomodoro/TaskList";
import { ref, push } from "firebase/database";
import { db } from "../../service/FirebaseConfig";

const Pomodoro = () => {
  const { currentUser } = useAuth();
  const { settings, saveSettings, loading: settingsLoading } = usePomodoroSettings();
  
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("pomodoro");
  const [cycles, setCycles] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const modesInSeconds = useMemo(() => ({
    pomodoro: settings.pomodoro * 60,
    shortBreak: settings.shortBreak * 60,
    longBreak: settings.longBreak * 60,
  }), [settings]);

  useEffect(() => {
    if (!settingsLoading) {
      setTime(modesInSeconds[mode]);
      setIsActive(false);
    }
  }, [settings, settingsLoading, mode, modesInSeconds]);

  const colorConfig = {
    pomodoro: { bg: "bg-rose-50", accent: "#be123c", accentLight: "#fda4af", button: "bg-rose-600 hover:bg-rose-700", text: "text-rose-600" },
    shortBreak: { bg: "bg-emerald-50", accent: "#059669", accentLight: "#6ee7b7", button: "bg-emerald-600 hover:bg-emerald-700", text: "text-emerald-600" },
    longBreak: { bg: "bg-indigo-50", accent: "#4338ca", accentLight: "#a5b4fc", button: "bg-indigo-600 hover:bg-indigo-700", text: "text-indigo-600" },
  };
  const currentTheme = colorConfig[mode];
  
  const handleTimerEnd = useCallback(() => {
    new Audio("/alert.weba").play().catch(console.error);
    let nextMode;
    if (mode === "pomodoro") {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      if (currentUser) {
        push(ref(db, `users/${currentUser.uid}/pomodoro/history`), { 
          completedAt: new Date().toISOString(), 
          task: selectedTask?.title || 'Foco geral' 
        });
      }
      nextMode = newCycles % 4 === 0 ? "longBreak" : "shortBreak";
    } else {
      nextMode = "pomodoro";
    }
    setMode(nextMode);
    setTime(modesInSeconds[nextMode]);
    setIsActive(true);
  }, [mode, cycles, currentUser, selectedTask, modesInSeconds]);

  useEffect(() => {
    let interval;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime(prev => prev - 1), 1000);
    } else if (time === 0 && isActive) {
      handleTimerEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, time, handleTimerEnd]);
  
  const switchMode = (newMode, shouldStart = false) => {
    setMode(newMode);
    setTime(modesInSeconds[newMode]);
    setIsActive(shouldStart);
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progress = (modesInSeconds[mode] - time) / modesInSeconds[mode];
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <>
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${currentTheme.bg}`}>
        <button onClick={() => setIsSettingsOpen(true)} className="absolute top-6 right-6 p-3 text-slate-500 hover:text-slate-800 hover:bg-white/80 rounded-full transition-colors">
            <Settings />
        </button>

        <div className="w-full max-w-lg mx-auto text-center">
          <header className="mb-8">
            <div className="flex justify-center gap-2 md:gap-4 bg-white/60 p-2 rounded-full backdrop-blur-sm">
               {Object.keys(modesInSeconds).map(m => (
                <button key={m} onClick={() => switchMode(m)} className={`w-full px-4 py-2.5 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ${mode === m ? `${currentTheme.button} text-white shadow-md` : "text-slate-500 hover:bg-white/80"}`}>
                  {m === "pomodoro" ? "Foco" : m === "shortBreak" ? "Pausa Curta" : "Pausa Longa"}
                </button>
              ))}
            </div>
          </header>

          <main className="relative w-80 h-80 md:w-96 md:h-96 mx-auto flex items-center justify-center">
            <svg className="absolute inset-0" viewBox="0 0 300 300">
              <circle cx="150" cy="150" r="140" fill="none" stroke={currentTheme.accentLight} strokeWidth="12" />
              <circle cx="150" cy="150" r="140" fill="none" stroke={currentTheme.accent} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" transform="rotate(-90 150 150)" style={{ transition: "stroke-dashoffset 1s linear" }}/>
            </svg>
            <div className="z-10">
              <p className="h-6 text-base font-medium text-slate-600 truncate px-4">
                {selectedTask ? `Focando em: ${selectedTask.title}` : ' '}
              </p>
              <div className="text-6xl md:text-7xl font-bold" style={{ color: currentTheme.accent }}>
                {settingsLoading ? '...' : formatTime(time)}
              </div>
              <div className={`mt-2 text-lg font-medium ${currentTheme.text} flex items-center justify-center gap-2`}>
                {mode === "pomodoro" ? <BrainCircuit/> : <Coffee/>}
                <span>{cycles > 0 ? `Ciclo #${cycles + 1}` : 'Primeiro ciclo'}</span>
              </div>
            </div>
          </main>

          <footer className="mt-8 flex items-center justify-center gap-4">
            <button onClick={() => { setIsActive(false); setTime(modesInSeconds[mode]); }} className="p-4 text-slate-500 hover:text-slate-800 transition-colors">
              <RotateCcw size={24} />
            </button>
            <button onClick={() => setIsActive(!isActive)} className={`w-20 h-20 rounded-full text-white shadow-lg transition-all transform hover:scale-105 flex items-center justify-center ${currentTheme.button}`}>
              {isActive ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
            </button>
            <button onClick={handleTimerEnd} className="p-4 text-slate-500 hover:text-slate-800 transition-colors">
              <SkipForward size={24} />
            </button>
          </footer>
        </div>
        <div className="w-full max-w-lg mx-auto mt-10">
            <h3 className={`text-xl font-bold ${currentTheme.text} mb-4 px-2`}>Tarefas para Focar</h3>
            <TaskList selectedTask={selectedTask} onSelectTask={setSelectedTask} />
        </div>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onSave={saveSettings} currentSettings={settings} />
    </>
  );
};

export default Pomodoro;