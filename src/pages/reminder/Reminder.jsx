import { useState } from "react";
import useReminder from "../../hooks/reminder/UseReminder";
import {
  CalendarDays,
  CircleCheck,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";
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
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      title: newTask.title,
      date: new Date(`${newTask.date}T${newTask.time}`).toISOString(),
      createdAt: new Date().toISOString(),
    };
    await handleTask(taskData, selectedTask?.id);
    setNewTask({ title: "", date: "", time: "" });
    setShowModal(false);
    setSelectedTask(null);
  };
  const formatDateTime = (dateString) => ({
    date: new Date(dateString).toLocaleDateString("pt-BR"),
    time: new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  return (
    <div className="min-h-screen bg-gray-50 lg:ml-10 p-4 md:p-8 mt-20 md:mt-0 flex justify-center">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Meus Lembretes
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2">
            {loading ? "Carregando..." : `${tasks.length} lembretes ativos`}
          </p>
        </div>

        {!loading && (
          <div className="space-y-3 md:space-y-4">
            {tasks.map((task) => {
              const { date, time } = formatDateTime(task.date);
              return (
                <div
                  key={task.id}
                  className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base md:text-lg text-gray-800">
                        {task.title}
                      </h3>
                      <div className="text-xs md:text-sm text-gray-500 mt-1 flex">
                        <CalendarDays className="mr-1 md:size-5 size-4" />
                        <span className="mr-2">{date}</span>
                        <Clock className="mr-1 md:size-5 size-4" />
                        <span>{time}</span>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                      <button
                        onClick={() => {
                          const taskDate = new Date(task.date);
                          setSelectedTask(task);
                          setNewTask({
                            title: task.title,
                            date: taskDate.toISOString().split("T")[0],
                            time: taskDate.toTimeString().substring(0, 5),
                          });
                          setShowModal(true);
                        }}
                        className="text-blue-500 hover:text-blue-600 px-2 py-1 text-sm md:text-base"
                      >
                        <Pencil className="md:size-5 size-4" />
                      </button>
                      <button
                        onClick={() => completeTask(task)}
                        className="text-green-500 hover:text-green-600 px-2 py-1 text-sm md:text-base"
                      >
                        <CircleCheck className="md:size-5 size-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-600 px-2 py-1 text-sm md:text-base"
                      >
                        <Trash2 className="md:size-5 size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
              Lembretes Concluídos
            </h2>
            <div className="space-y-3 md:space-y-4">
              {completedTasks.map((task) => {
                const { date, time } = formatDateTime(task.date);
                const completed = formatDateTime(task.completedAt);
                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border border-gray-100 opacity-70"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base md:text-lg text-gray-800 line-through">
                          {task.title}
                        </h3>
                        <div className="text-xs md:text-sm text-gray-500 mt-1 flex">
                          <CalendarDays className="mr-1 md:size-5 size-4" />
                          <span className="mr-2">{date}</span>
                          <Clock className="mr-1 md:size-5 size-4" />
                          <span>{time}</span>
                        </div>
                        <span className="block mt-1 text-gray-500 text-sm">
                          ✅ Concluído em: {completed.date} {completed.time}
                        </span>
                      </div>
                      <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                        <button
                          onClick={() => deleteTask(task.id, true)}
                          className="text-red-500 hover:text-red-600 px-2 py-1 text-sm md:text-base"
                        >
                          <Trash2 className="md:size-5 size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 md:bottom-12 right-4 md:right-12 w-12 h-12 md:w-14 md:h-14 bg-blue-500 rounded-full shadow-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          <span className="text-white text-2xl md:text-3xl">+</span>
        </button>

        <div
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-50 ${
            showModal ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className={`absolute bottom-0 w-full bg-white rounded-t-2xl shadow-xl p-4 md:p-6 transition-transform duration-300 ${
              showModal ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                {selectedTask ? "Editar" : "Novo"} Lembrete
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTask(null);
                  setNewTask({ title: "", date: "", time: "" });
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <input
                  type="text"
                  name="title"
                  placeholder="Título do lembrete"
                  value={newTask.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:border-slate-900 focus:outline-none focus:border-none text-black placeholder-gray-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input
                    type="date"
                    name="date"
                    value={newTask.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:border-slate-900 focus:outline-none focus:border-none text-black placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <input
                    type="time"
                    name="time"
                    value={newTask.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:border-slate-900 focus:outline-none focus:border-none text-black placeholder-gray-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {selectedTask ? "Salvar" : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
