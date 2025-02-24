import { useState, useEffect } from "react";
import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";

const Pomodoro = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("pomodoro");
  const [cycles, setCycles] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const modes = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  useEffect(() => {
    let interval;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      handleTimerEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const handleTimerEnd = () => {
    playSound();
    setIsActive(false);


    let nextMode;
    if (mode === "pomodoro") {
      setCycles((prev) => prev + 1);
      nextMode = cycles % 3 === 2 ? "longBreak" : "shortBreak";
    } else {
      nextMode = "pomodoro";
    }

    setMode(nextMode);
    setTime(modes[nextMode]);

    setIsActive(true);
  };

  const playSound = () => {
    const audio = new Audio("/alert.weba");
    audio.play().catch((error) => console.error("Erro ao reproduzir som:", error));
  };

  useEffect(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    document.title = `${formattedTime} - Pomodoro Timer`;
  }, [time]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(modes[mode]);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTime(modes[newMode]);
    setIsActive(false);
    setIsPaused(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Modos */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => switchMode("pomodoro")}
            className={`px-4 py-2 rounded-lg ${
              mode === "pomodoro"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => switchMode("shortBreak")}
            className={`px-4 py-2 rounded-lg ${
              mode === "shortBreak"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Intervalo Curto
          </button>
          <button
            onClick={() => switchMode("longBreak")}
            className={`px-4 py-2 rounded-lg ${
              mode === "longBreak"
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Intervalo Longo
          </button>
        </div>

        {/* Temporizador */}
        <div className="text-center mb-6">
          <div className="text-8xl font-bold text-gray-800">
            {formatTime(time)}
          </div>
          <div className="text-gray-500 mt-2">
            Ciclos completados: {cycles}
          </div>
        </div>

        {/* Controles */}
        <div className="flex justify-center gap-4">
          {isActive ? (
            <button
              onClick={pauseTimer}
              className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
            >
              <Pause size={24} />
            </button>
          ) : (
            <button
              onClick={startTimer}
              className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
            >
              <Play size={24} />
            </button>
          )}
          <button
            onClick={resetTimer}
            className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={24} />
          </button>
          <button
            onClick={handleTimerEnd}
            className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;