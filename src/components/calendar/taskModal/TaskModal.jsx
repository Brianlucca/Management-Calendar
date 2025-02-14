import React, { useState, useEffect } from "react";
import moment from "moment";

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  tags,
  selectedDate,
  selectedTask,
  isEditMode,
  onEdit,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description);
      setStartDate(moment(selectedTask.startDate).format("YYYY-MM-DD"));
      setStartTime(moment(selectedTask.startDate).format("HH:mm"));
      setEndDate(moment(selectedTask.endDate).format("YYYY-MM-DD"));
      setEndTime(moment(selectedTask.endDate).format("HH:mm"));
      setSelectedTags(selectedTask.tags || []);
    } else {
      setTitle("");
      setDescription("");
      setStartDate(selectedDate || "");
      setStartTime("");
      setEndDate("");
      setEndTime("");
      setSelectedTags([]);
    }
  }, [selectedTask, selectedDate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 sticky top-0">
          <h2 className="text-white text-2xl font-bold">
            {selectedTask ? (isEditMode ? "Editar Tarefa" : "Detalhes da Tarefa") : "Nova Tarefa"}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {isEditMode || !selectedTask ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit({
                  title,
                  description,
                  startDate: `${startDate}T${startTime}:00`,
                  endDate: `${endDate}T${endTime}:00`,
                  tags: selectedTags,
                });
              }}
            >
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Título da Tarefa"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <textarea
                  placeholder="Descrição"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Início</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Início</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Fim</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <label key={tag.id} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setSelectedTags((prevTags) => {
                              if (isChecked) {
                                return [...prevTags, tag.id];
                              } else {
                                return prevTags.filter((id) => id !== tag.id);
                              }
                            });
                          }}
                          className="hidden"
                        />
                        <span
                          className={`px-3 py-1 rounded-md text-white text-sm cursor-pointer transition-all ${
                            selectedTags.includes(tag.id)
                              ? "opacity-100"
                              : "opacity-50 hover:opacity-75"
                          }`}
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {selectedTask ? "Salvar Alterações" : "Criar Tarefa"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Título</label>
                <p className="mt-1 text-gray-900">{title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Descrição</label>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                  {description || "Sem descrição"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Data de Início</label>
                <p className="mt-1 text-gray-900">
                  {moment(selectedTask.startDate).format("DD/MM/YYYY")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Horário de Início</label>
                <p className="mt-1 text-gray-900">{moment(selectedTask.startDate).format("HH:mm")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Data e Horário de Fim</label>
                <p className="mt-1 text-gray-900">
                  {moment(selectedTask.endDate).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Tags</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tags
                    .filter((tag) => selectedTags.includes(tag.id))
                    .map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-1 rounded-md text-sm text-white"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Criado por</label>
                <p className="mt-1 text-gray-900">{selectedTask.createdBy}</p>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={onEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
