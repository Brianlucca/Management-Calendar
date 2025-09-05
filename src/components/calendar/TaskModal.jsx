// Substitua o seu arquivo: src/components/calendar/TaskModal.js

import React from "react";
import { useTaskModal } from "../../hooks/calendar/UseTaskModal";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, Clock, MapPin, Pencil, Trash2, X, FileText, Repeat, CheckSquare, Square, Plus } from "lucide-react";
import LinkifiedText from "./LinkifiedText";

const TaskModal = ({ isOpen, onClose, onSubmit, onDelete, tags, selectedDate, selectedTask }) => {
  const {
    formData, setFormData, isEditMode, setIsEditMode, mapUrl,
    addSubtask, updateSubtask, toggleSubtask, deleteSubtask
  } = useTaskModal({ selectedTask, selectedDate });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("O título é obrigatório!");
    if (parseISO(formData.endDate).getTime() < parseISO(formData.startDate).getTime()) return alert("A data/hora de término deve ser posterior à de início!");
    const finalRecurrence = formData.recurrence.freq === 'none' ? null : formData.recurrence;
    onSubmit({ ...formData, recurrence: finalRecurrence, subtasks: formData.subtasks.filter(st => st.text.trim() !== '') });
  };

  const handleDelete = () => {
    onDelete(selectedTask.id);
    onClose();
  };

  const handleRecurrenceChange = (key, value) => setFormData(prev => ({ ...prev, recurrence: { ...prev.recurrence, [key]: value } }));
  const toggleWeekday = (day) => {
    const currentDays = formData.recurrence.byday || [];
    const newDays = currentDays.includes(day) ? currentDays.filter(d => d !== day) : [...currentDays, day];
    handleRecurrenceChange('byday', newDays.sort());
  };
  const weekdays = [ {value: 'SU', label: 'D'}, {value: 'MO', label: 'S'}, {value: 'TU', label: 'T'}, {value: 'WE', label: 'Q'}, {value: 'TH', label: 'Q'}, {value: 'FR', label: 'S'}, {value: 'SA', label: 'S'} ];

  const renderPreview = () => {
    const completedCount = formData.subtasks?.filter(st => st.completed).length || 0;
    return (
      <section>
          <dl className="space-y-5">
              {formData.description && (
                  <div>
                      <dt className="flex items-center gap-3 text-sm font-medium text-slate-500"><FileText className="w-5 h-5"/>Descrição</dt>
                      <LinkifiedText text={formData.description} />
                  </div>
              )}
              {formData.subtasks && formData.subtasks.length > 0 && (
                <div>
                  <dt className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <CheckSquare className="w-5 h-5"/>Checklist ({completedCount}/{formData.subtasks.length})
                  </dt>
                  <dd className="mt-2 ml-8 space-y-2">
                    {formData.subtasks.map(st => (
                      <div key={st.id} className="flex items-center gap-2 text-slate-700">
                        {st.completed ? <CheckSquare className="w-5 h-5 text-indigo-600"/> : <Square className="w-5 h-5 text-slate-400"/>}
                        <span className={st.completed ? 'line-through text-slate-500' : ''}>{st.text}</span>
                      </div>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                  <dt className="flex items-center gap-3 text-sm font-medium text-slate-500"><CalendarDays className="w-5 h-5"/>Data e Hora</dt>
                  <dd className="mt-1.5 ml-8 text-base text-slate-700">
                      {format(parseISO(formData.startDate), "eeee, d 'de' MMMM, yyyy", { locale: ptBR })}
                      <br/>
                      das {format(parseISO(formData.startDate), "HH:mm")} até {format(parseISO(formData.endDate), "HH:mm")}
                  </dd>
              </div>
              {formData.location && (
                  <div>
                      <dt className="flex items-center gap-3 text-sm font-medium text-slate-500"><MapPin className="w-5 h-5"/>Localização</dt>
                      <dd className="mt-1.5 ml-8 text-base text-slate-700">{formData.location}</dd>
                  </div>
              )}
          </dl>
          {mapUrl && <figure className="mt-6 rounded-xl overflow-hidden border border-slate-200"><iframe src={mapUrl} className="w-full h-56" loading="lazy" title="Localização" /></figure>}
          <footer className="flex justify-end gap-3 pt-8 mt-8 border-t border-slate-200">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">Fechar</button>
              <button type="button" onClick={() => setIsEditMode(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  <Pencil className="w-4 h-4" />Editar
              </button>
          </footer>
      </section>
    );
  };

  const renderEditForm = () => (
    <form onSubmit={handleSubmit} className="space-y-5">
        <input id="title" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full text-2xl font-bold text-slate-800 placeholder-slate-400 focus:outline-none" required placeholder="Adicionar título"/>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-slate-700 mb-1.5">Início</label>
                <input id="startDate" type="datetime-local" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg"/>
            </div>
            <div>
                <label htmlFor="endDate" className="block text-sm font-semibold text-slate-700 mb-1.5">Término</label>
                <input id="endDate" type="datetime-local" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg"/>
            </div>
        </div>

        <div>
            <label htmlFor="recurrence" className="block text-sm font-semibold text-slate-700 mb-1.5">Repetir</label>
            <div className="flex gap-4">
                <select id="recurrence" value={formData.recurrence.freq} onChange={(e) => handleRecurrenceChange('freq', e.target.value)}
                    className="flex-grow w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg">
                    <option value="none">Não se repete</option>
                    <option value="daily">Diariamente</option>
                    <option value="weekly">Semanalmente</option>
                    <option value="monthly">Mensalmente</option>
                </select>
                {formData.recurrence.freq !== 'none' && (
                    <input type="date" value={formData.recurrence.until} onChange={(e) => handleRecurrenceChange('until', e.target.value)}
                        className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg"/>
                )}
            </div>
            {formData.recurrence.freq === 'weekly' && (
                <div className="mt-3 flex justify-center gap-1">
                    {weekdays.map(day => (
                        <button type="button" key={day.value} onClick={() => toggleWeekday(day.value)}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${formData.recurrence.byday?.includes(day.value) ? 'bg-indigo-600 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}>
                            {day.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
        
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sub-tarefas</label>
            <div className="space-y-2">
                {formData.subtasks?.map((subtask) => (
                    <div key={subtask.id} className="flex items-center gap-2">
                        <button type="button" onClick={() => toggleSubtask(subtask.id)}>
                            {subtask.completed ? <CheckSquare className="w-5 h-5 text-indigo-600"/> : <Square className="w-5 h-5 text-slate-400"/>}
                        </button>
                        <input type="text" value={subtask.text} onChange={(e) => updateSubtask(subtask.id, e.target.value)}
                            className={`w-full bg-transparent focus:outline-none ${subtask.completed ? 'line-through text-slate-500' : 'text-slate-800'}`} placeholder="Nova sub-tarefa"/>
                        <button type="button" onClick={() => deleteSubtask(subtask.id)} className="p-1 text-slate-400 hover:text-red-600">
                            <X className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={addSubtask} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg p-2 mt-2">
                <Plus className="w-4 h-4"/> Adicionar sub-tarefa
            </button>
        </div>

        <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">Descrição</label>
            <textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg min-h-[100px]" placeholder="Adicionar detalhes, links, etc."></textarea>
        </div>

        <div>
            <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-1.5">Localização</label>
            <input id="location" type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg" placeholder="Adicionar local"/>
        </div>

        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <button key={tag.id} type="button" onClick={() => {
                        const newTags = formData.tags?.includes(tag.id) ? formData.tags.filter((t) => t !== tag.id) : [...(formData.tags || []), tag.id];
                        setFormData({ ...formData, tags: newTags });
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border-2 ${formData.tags?.includes(tag.id) ? 'text-white border-transparent' : 'text-slate-600 bg-slate-100 border-slate-100 hover:border-slate-300'}`}
                    style={{ backgroundColor: formData.tags?.includes(tag.id) ? tag.color : undefined }}>
                        {tag.name}
                    </button>
                ))}
            </div>
        </div>

        <footer className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            {selectedTask && (
                <button type="button" onClick={handleDelete} className="mr-auto p-2 text-red-600 hover:bg-red-50 rounded-full">
                    <Trash2 className="w-5 h-5" />
                </button>
            )}
            <button type="button" onClick={() => { selectedTask ? setIsEditMode(false) : onClose(); }} className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                {selectedTask ? "Salvar" : "Criar Tarefa"}
            </button>
        </footer>
    </form>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <header className="px-6 py-4 flex-shrink-0">
          <div className="flex justify-end items-center">
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>
          {selectedTask && !isEditMode && (
            <div className="mt-3">
                 <h1 className="text-2xl font-bold text-slate-900">{formData.title}</h1>
                 <div className="mt-3 flex flex-wrap gap-2">
                    {formData.tags.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId);
                        return tag ? <span key={tag.id} className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: tag.color }}>{tag.name}</span> : null;
                    })}
                </div>
            </div>
          )}
        </header>
        <main className="p-6 pt-0 sm:p-8 sm:pt-0 overflow-y-auto">
          {isEditMode ? renderEditForm() : renderPreview()}
        </main>
      </div>
    </div>
  );
};

export default TaskModal;