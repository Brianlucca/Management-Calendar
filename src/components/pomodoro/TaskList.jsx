import React from "react";
import useReminder from "../../hooks/reminder/UseReminder";
import { Check, PlusCircle, BrainCircuit } from "lucide-react";

const TaskList = ({ selectedTask, onSelectTask }) => {
  const { tasks, completeTask } = useReminder();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 px-4 border-2 border-dashed border-white/30 rounded-lg">
        <PlusCircle className="mx-auto h-10 w-10 text-white/50" />
        <p className="mt-2 text-white/80">Nenhuma tarefa na sua lista de Lembretes.</p>
        <p className="text-xs text-white/60">Crie um lembrete para começar a focar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div
          key={task.id}
          className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
            selectedTask?.id === task.id
              ? 'bg-white/90 shadow-md'
              : 'bg-white/40 hover:bg-white/60'
          }`}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); completeTask(task); }} 
            className="p-1 group"
          >
            <div className="w-6 h-6 rounded-full border-2 border-slate-400 group-hover:border-rose-500 flex-shrink-0 transition-colors" />
          </button>
          
          <span className="flex-1 ml-3 font-medium text-slate-800 truncate" title={task.title}>
            {task.title}
          </span>
          
          <button 
            onClick={() => onSelectTask(task)}
            className={`ml-2 p-2 rounded-full transition-colors ${
              selectedTask?.id === task.id 
                ? 'bg-rose-500 text-white'
                : 'text-slate-500 hover:bg-white'
            }`}
            title="Focar nesta tarefa"
          >
            <BrainCircuit className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;