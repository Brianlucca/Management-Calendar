import React from "react";
import { useTaskModal } from "../../../hooks/calendar/UseTaskModal";
import moment from "moment";
import "moment/locale/pt-br";

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  tags,
  selectedDate,
  selectedTask,
}) => {
  const {
    formData,
    setFormData,
    isEditMode,
    setIsEditMode,
    mapUrl,
  } = useTaskModal({ selectedTask, selectedDate, onSubmit, onDelete, onClose });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("O título é obrigatório!");
      return;
    }

    const startMoment = moment(formData.startDate);
    const endMoment = moment(formData.endDate);

    if (endMoment.isBefore(startMoment)) {
      alert("A data/hora de término deve ser posterior à de início!");
      return;
    }

    const taskData = {
      ...formData,
      startDate: startMoment.toISOString(),
      endDate: endMoment.toISOString(),
    };

    onSubmit(taskData);
  };

  const handleDelete = async () => {
      await onDelete(selectedTask.id);
      onClose();
  };

  const renderPreview = () => (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {formData.title}
        </h2>
      </header>

      {formData.description && (
        <article>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <p className="text-gray-600">{formData.description}</p>
        </article>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data e Hora Início
          </label>
          <time className="text-gray-600">
            {moment(formData.startDate).format("DD/MM/YYYY HH:mm")}
          </time>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data e Hora Término
          </label>
          <time className="text-gray-600">
            {moment(formData.endDate).format("DD/MM/YYYY HH:mm")}
          </time>
        </div>
      </section>

      {formData.location && (
        <article className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localização
          </label>
          {mapUrl && (
            <figure className="rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src={mapUrl}
                className="w-full h-64"
                loading="lazy"
                allowFullScreen
                title="Localização da tarefa"
              />
            </figure>
          )}
          <p className="text-sm text-gray-600">
            {formData.location}
          </p>
        </article>
      )}

      {formData.tags.length > 0 && (
        <section>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              return tag ? (
                <span
                  key={tag.id}
                  className="px-4 py-1.5 rounded-md text-sm font-medium text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ) : null;
            })}
          </div>
        </section>
      )}

      <footer className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Fechar
        </button>
        <button
          type="button"
          onClick={() => setIsEditMode(true)}
          className="px-6 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Editar Tarefa
        </button>
      </footer>
    </section>
  );

  const renderEditForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center text-sm text-gray-400">
        <p>Projeto para aprendizado e portfólio - Não coloque informações sensíveis.</p>
      </div>
      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value.slice(0, 90) })
          }
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:border-slate-900 focus:outline-none focus:border-none text-black placeholder-gray-500 transition-all"
          required
          maxLength={90}
        />
        <p className="text-sm text-gray-500 mt-1">
  {formData.title.length}/90 caracteres
</p>
      </section>

      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value.slice(0, 350) })
          }
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:border-slate-900 focus:outline-none focus:border-none text-black placeholder-gray-500 min-h-[120px] transition-all"
          maxLength={350}
       />
       <p className="text-sm text-gray-500 mt-1">
  {formData.description.length}/350 caracteres
</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data e Hora Início *
          </label>
          <input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:border-slate-900 focus:outline-none focus:border-none text-black placeholder-gray-500 transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data e Hora Término *
          </label>
          <input
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:border-slate-900 focus:outline-none focus:border-none text-black placeholder-gray-500 transition-all"
            required
          />
        </div>
      </section>

      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Localização (Endereço ou coordenadas)
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:border-slate-900 focus:outline-none focus:border-none text-black placeholder-gray-500 transition-all"
          placeholder="Ex: Av. Paulista, 1000 ou -23.5617, -46.6561"
        />
        <p className="text-sm text-gray-500 mt-1">
          Cole um endereço, nome de lugar ou coordenadas (lat,long)
        </p>
      </section>

      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => {
                const newTags = formData.tags.includes(tag.id)
                  ? formData.tags.filter((t) => t !== tag.id)
                  : [...formData.tags, tag.id];
                setFormData({ ...formData, tags: newTags });
              }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${formData.tags.includes(tag.id)
                  ? "text-white"
                  : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}
              style={{
                backgroundColor: formData.tags.includes(tag.id)
                  ? tag.color
                  : undefined,
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap justify-end gap-3 pt-6 border-t border-gray-100">
        {selectedTask && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
          >
            Excluir Tarefa
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (selectedTask) {
              setIsEditMode(false);
            } else {
              onClose();
            }
          }}
          className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {selectedTask ? "Salvar Alterações" : "Criar Tarefa"}
        </button>
      </footer>    </form>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <header className="px-8 py-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              {selectedTask
                ? isEditMode
                  ? `Editar: ${formData.title}`
                  : formData.title
                : "Nova Tarefa"}
            </h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </header>

        <main className="px-8 py-6">
          {isEditMode ? renderEditForm() : renderPreview()}
        </main>
      </div>
    </div>
  );
};

export default TaskModal;