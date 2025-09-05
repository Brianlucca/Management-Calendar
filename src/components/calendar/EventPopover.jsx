// Substitua o seu arquivo: src/components/calendar/EventPopover.js

import { useState, useEffect } from 'react';
import { usePopper } from 'react-popper';
import { X, Pencil, Trash2, Clock, MapPin, FileText, CheckSquare, Square } from 'lucide-react';
import { format, parseISO, addHours, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import LinkifiedText from './LinkifiedText';

const EventPopover = ({ targetElement, event, tags, selectedDate, onClose, onEdit, onDelete, onSave, onGoToFullEditor }) => {
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(targetElement, popperElement, {
    placement: 'auto',
    modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
  });
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isNewEvent = !event;
  const [title, setTitle] = useState(isNewEvent ? '' : event?.title || '');
  const [mapUrl, setMapUrl] = useState(null);

  useEffect(() => {
    setTitle(isNewEvent ? '' : event?.title || '');
  }, [event, isNewEvent]);

  useEffect(() => {
    const getMapUrl = async (location) => {
        if (!location) return null;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
          const data = await response.json();
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            return `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lon) - 0.005},${parseFloat(lat) - 0.005},${parseFloat(lon) + 0.005},${parseFloat(lat) + 0.005}&layer=mapnik&marker=${lat},${lon}`;
          }
          return null;
        } catch (error) { return null; }
    };
    const updateMap = async () => {
        if (event && event.location) { setMapUrl(await getMapUrl(event.location)); }
        else { setMapUrl(null); }
    };
    updateMap();
  }, [event]);

  if (!targetElement && !isMobile) return null;

  const handleSave = () => {
    if (title.trim()) {
      const start = parseISO(selectedDate);
      const end = addHours(start, 1);
      onSave({ title, startDate: start.toISOString(), endDate: end.toISOString() });
    }
  };

  const handleGoToFull = () => { onGoToFullEditor(title); };
  
  const formattedTime = () => {
    if (!event?.startDate || !event?.endDate) return '';
    const start = parseISO(event.startDate);
    const end = parseISO(event.endDate);
    if (isSameDay(start, end)) {
      return `${format(start, "eeee, d 'de' MMMM", { locale: ptBR })} ⋅ ${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
    }
    return `${format(start, "d MMM, HH:mm", { locale: ptBR })} - ${format(end, "d MMM, HH:mm", { locale: ptBR })}`;
  };
  
  const completedSubtasks = event?.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = event?.subtasks?.length || 0;

  const PopoverContent = () => (
    <>
      {isNewEvent ? (
        <div className="p-4">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Adicionar título"
              className="w-full text-lg font-semibold focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-indigo-500 transition-colors" autoFocus />
            <p className="text-sm text-slate-500 mt-2">{format(parseISO(selectedDate), "eeee, d 'de' MMMM", { locale: ptBR })}</p>
            <div className="flex justify-between items-center mt-4">
               <button onClick={handleGoToFull} className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg">Mais opções</button>
               <div className="flex gap-2">
                <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg">Fechar</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Salvar</button>
               </div>
            </div>
        </div>
      ) : (
        <>
          <header className="p-4 border-b border-slate-200 flex-shrink-0">
            <div className="flex justify-end items-center gap-1">
                <button onClick={() => onEdit(event)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full" title="Editar todos os detalhes"><Pencil size={18}/></button>
                <button onClick={() => onDelete(event.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-full" title="Excluir"><Trash2 size={18}/></button>
                <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full" title="Fechar"><X size={18}/></button>
            </div>
          </header>
          <main className="p-4 space-y-4 overflow-y-auto flex-1">
            <div className="flex flex-wrap gap-2">
                {event.tags?.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    return tag ? <span key={tag.id} style={{backgroundColor: tag.color}} className="px-3 py-1 rounded-full text-xs font-semibold text-white">{tag.name}</span> : null;
                })}
            </div>

            <h3 className="text-2xl font-bold text-slate-800 break-words">{event.title}</h3>
            
            <div className="flex items-center gap-3 text-slate-700">
              <Clock size={18} className="text-slate-400 flex-shrink-0"/>
              <span>{formattedTime()}</span>
            </div>

            {event.description && (
              <div className="flex items-start gap-3 text-slate-700">
                <FileText size={18} className="text-slate-400 flex-shrink-0 mt-1"/>
                <LinkifiedText text={event.description} className="flex-1 min-w-0" />
              </div>
            )}
            
            {event.subtasks && event.subtasks.length > 0 && (
              <div className="flex items-start gap-3">
                <CheckSquare size={18} className="text-slate-400 flex-shrink-0 mt-1"/>
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500 mb-2">Checklist ({completedSubtasks}/{totalSubtasks})</p>
                    <div className="space-y-2">
                        {event.subtasks.map(st => (
                        <div key={st.id} className="flex items-center gap-2">
                            {st.completed ? <CheckSquare className="w-5 h-5 text-indigo-600 flex-shrink-0"/> : <Square className="w-5 h-5 text-slate-400 flex-shrink-0"/>}
                            <span className={`break-all ${st.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>{st.text}</span>
                        </div>
                        ))}
                    </div>
                </div>
              </div>
            )}

            {event.location && (
              <div className="space-y-2">
                <p className="flex items-center gap-3 text-slate-700">
                    <MapPin size={18} className="text-slate-400 flex-shrink-0"/>
                    <span>{event.location}</span>
                </p>
                {mapUrl && <figure className="rounded-lg overflow-hidden border border-slate-200 h-40"><iframe src={mapUrl} className="w-full h-full" loading="lazy" title="Localização" /></figure>}
              </div>
            )}
          </main>
        </>
      )}
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden">
            <PopoverContent />
        </div>
      </div>
    );
  }

  return (
    <div ref={setPopperElement} style={styles.popper} {...attributes.popper} className="bg-white rounded-xl shadow-2xl w-96 z-50 border border-slate-200 flex flex-col max-h-[80vh] overflow-hidden">
        <PopoverContent />
    </div>
  );
};

export default EventPopover;