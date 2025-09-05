import React, { useState } from "react";
import useReminder from "../../hooks/reminder/UseReminder";
import {
  CalendarDays,
  Check,
  Clock,
  Pencil,
  Trash2,
  ListTodo,
  Plus,
  ClipboardCheck,
  X,
} from "lucide-react";

const MAX_TITLE_LENGTH = 80;

export default function Reminder() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", date: "", time: "" });
  const {
    tasks,
    completedTasks,
    loading,
    handleTask,
    completeTask,
    deleteTask,
  } = useReminder();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" && value.length > MAX_TITLE_LENGTH) return;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      title: newTask.title,
      date: new Date(`${newTask.date}T${newTask.time}`).toISOString(),
      createdAt: selectedTask ? selectedTask.createdAt : new Date().toISOString(),
    };
    await handleTask(taskData, selectedTask?.id);
    closeAndResetModal();
  };

  const closeAndResetModal = () => {
    setShowModal(false);
    setSelectedTask(null);
    setNewTask({ title: "", date: "", time: "" });
  };

  const formatDateTime = (dateString) => ({
    date: new Date(dateString).toLocaleDateString("pt-BR"),
    time: new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
  
  const openEditModal = (task) => {
    const taskDate = new Date(task.date);
    setSelectedTask(task);
    setNewTask({
      title: task.title,
      date: taskDate.toISOString().split("T")[0],
      time: taskDate.toTimeString().substring(0, 5),
    });
    setShowModal(true);
  };

  const openNewModal = () => {
    setSelectedTask(null);
    setNewTask({ title: "", date: "", time: "" });
    setShowModal(true);
  };

  const EmptyState = () => (
    <div className="text-center py-16">
      <ClipboardCheck className="mx-auto h-16 w-16 text-slate-400" />
      <h3 className="mt-4 text-xl font-semibold text-slate-800">Você está em dia!</h3>
      <p className="mt-1 text-slate-500">Nenhum lembrete ativo no momento.</p>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <ListTodo className="w-8 h-8 text-indigo-500" />
          Meus Lembretes
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Acompanhe suas tarefas e não perca nenhum prazo.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/70 p-6 lg:p-8">
          {loading ? (
             <p className="text-center py-8 text-slate-500">Carregando lembretes...</p>
          ) : (
            <>
              {tasks.length === 0 && <EmptyState />}
              <div className="space-y-2">
                {tasks.map((task) => {
                  const { date, time } = formatDateTime(task.date);
                  return (
                    <div key={task.id} className="group flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <button onClick={() => completeTask(task)} className="p-2">
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-indigo-500 flex-shrink-0 transition-colors"></div>
                      </button>
                      <div className="flex-1 ml-4">
                        <h3 className="font-semibold text-base text-slate-800">{task.title}</h3>
                        <div className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <CalendarDays className="w-4 h-4" />
                          <span>{date}</span>
                          <Clock className="w-4 h-4" />
                          <span>{time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(task)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteTask(task.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {completedTasks.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-slate-800 mb-4 border-t border-slate-200 pt-6">
                Concluídos
              </h2>
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <div key={task.id} className="group flex items-center p-3 rounded-lg">
                    <div className="p-2">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      <h3 className="font-medium text-base text-slate-500 line-through">{task.title}</h3>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => deleteTask(task.id, true)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={openNewModal}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center text-white hover:bg-indigo-700 transition-all transform hover:scale-110"
      >
        <Plus className="w-7 h-7" />
      </button>

      <div className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity z-50 ${showModal ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className={`absolute bottom-0 w-full bg-white rounded-t-2xl shadow-xl p-6 transition-transform duration-300 ease-in-out ${showModal ? "translate-y-0" : "translate-y-full"}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">{selectedTask ? "Editar Lembrete" : "Novo Lembrete"}</h2>
            <button onClick={closeAndResetModal} className="p-2 rounded-full hover:bg-slate-100">
              <X className="w-6 h-6 text-slate-500"/>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">Título</label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="O que você precisa lembrar?"
                value={newTask.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
              <p className={`text-right text-xs mt-1 ${newTask.title.length >= MAX_TITLE_LENGTH ? "text-red-500" : "text-slate-400"}`}>
                {newTask.title.length}/{MAX_TITLE_LENGTH}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-slate-700 mb-1.5">Data</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={newTask.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-semibold text-slate-700 mb-1.5">Hora</label>
                <input
                  id="time"
                  type="time"
                  name="time"
                  value={newTask.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={closeAndResetModal} className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all">
                Cancelar
              </button>
              <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all">
                {selectedTask ? "Salvar Alterações" : "Adicionar Lembrete"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}