import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useAuth } from '../../context/AuthContext';
import { useCalendar } from '../../hooks/calendar/UseCalendar';
import TaskModal from '../../components/calendar/TaskModal';
import EventPopover from '../../components/calendar/EventPopover';
import YearView from '../../components/calendar/YearView';
import { format, isSameDay, startOfMonth, endOfMonth, addHours, parseISO, getYear, addYears, subYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Repeat, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarStyles = () => (
  <style>{`
    :root {
      --fc-border-color: #e2e8f0; --fc-daygrid-event-dot-width: 8px; --fc-list-event-dot-width: 10px;
      --fc-event-border-color: transparent; --fc-button-text-color: #334155;
      --fc-button-bg-color: #ffffff; --fc-button-border-color: #cbd5e1; --fc-button-hover-bg-color: #f8fafc;
      --fc-button-hover-border-color: #cbd5e1; --fc-button-active-bg-color: #eef2ff; --fc-button-active-border-color: #4f46e5;
    }
    .fc-daygrid-day-frame { min-height: 120px; } .fc { font-family: inherit; }
    .fc-header-toolbar { display: none !important; }
    .fc .fc-daygrid-day.fc-day-today { background-color: #f4f4f5; }
    .fc .fc-day-header { border-bottom: 1px solid var(--fc-border-color); padding: 1rem 0; font-weight: 600; font-size: 0.875rem; color: #475569; text-transform: uppercase; }
    .fc-event { border-radius: 6px !important; padding: 5px 8px !important; font-weight: 600 !important; cursor: pointer; border: none !important; white-space: normal !important; overflow: hidden !important; }
    .fc-daygrid-event-dot { border: 2px solid var(--fc-event-main-color, #FFF) !important; }
    .fc-event .fc-event-time { font-weight: 700 !important; }
    .fc-timegrid-slot-lane.fc-non-business { background-color: #f8fafc; }
    .fc-list-event-title a { color: #1e293b !important; }
  `}</style>
);

const CalendarHeader = ({ calendarRef, currentDate, setCurrentDate, currentView, setCurrentView }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (currentView === 'dayGridYear') {
      setTitle(getYear(currentDate));
    } else if (calendarRef.current) {
      setTitle(calendarRef.current.getApi().view.title);
    }
  }, [currentView, currentDate, calendarRef]);

  const handleNav = (delta) => {
    if (currentView === 'dayGridYear') {
      setCurrentDate(prev => delta > 0 ? addYears(prev, 1) : subYears(prev, 1));
    } else {
      const api = calendarRef.current?.getApi();
      if (api) {
        if (delta > 0) {
          api.next();
        } else {
          api.prev();
        }
      }
    }
  };

  const handleToday = () => {
    if (currentView === 'dayGridYear') {
      setCurrentDate(new Date());
    } else {
      calendarRef.current?.getApi().today();
    }
  };

  const viewButtons = [
    { view: 'dayGridMonth', label: 'Mês' },
    { view: 'timeGridWeek', label: 'Semana' },
    { view: 'timeGridDay', label: 'Dia' },
    { view: 'listWeek', label: 'Agenda' },
    { view: 'dayGridYear', label: 'Ano' },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button onClick={() => handleNav(-1)} className="p-2 rounded-md hover:bg-slate-100"><ChevronLeft/></button>
          <button onClick={() => handleNav(1)} className="p-2 rounded-md hover:bg-slate-100"><ChevronRight/></button>
        </div>
        <button onClick={handleToday} className="px-4 py-2 text-sm font-semibold border border-slate-300 rounded-md hover:bg-slate-50">Hoje</button>
        <h2 className="text-2xl font-bold text-slate-800 ml-4">{title}</h2>
      </div>
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg mt-4 md:mt-0">
        {viewButtons.map(btn => (
          <button key={btn.view} onClick={() => setCurrentView(btn.view)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${currentView === btn.view ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:bg-white/60'}`}>
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const CalendarPage = () => {
  const { currentUser } = useAuth();
  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('dayGridMonth');

  const {
    events, tags, isModalOpen, selectedDate, selectedTask, setIsModalOpen,
    handleTaskSubmit, handleTaskDelete, updateEvent, setSelectedTask
  } = useCalendar(currentUser, { 
    start: startOfMonth(currentDate), 
    end: endOfMonth(currentDate) 
  });
  
  const [popoverState, setPopoverState] = useState({ visible: false, targetElement: null, event: null, selectedDate: null });
  const closePopover = () => setPopoverState({ visible: false, targetElement: null, event: null, selectedDate: null });
  const handleDateClick = (arg) => { closePopover(); setPopoverState({ visible: true, targetElement: arg.dayEl, event: null, selectedDate: arg.dateStr }); };
  const handleEventClick = (info) => { closePopover(); setPopoverState({ visible: true, targetElement: info.el, event: info.event.extendedProps, selectedDate: null }); };
  const handleOpenEditModal = (event) => { closePopover(); setSelectedTask(event); setIsModalOpen(true); };
  const handleQuickSave = (taskData) => { handleTaskSubmit(taskData); closePopover(); };
  const handleDeleteFromPopover = (taskId) => { handleTaskDelete(taskId); closePopover(); };
  const handleGoToFullEditor = (prefilledTitle) => {
    closePopover();
    const prefilledTask = {
      title: prefilledTitle,
      startDate: popoverState.selectedDate,
      endDate: addHours(parseISO(popoverState.selectedDate), 1).toISOString(),
    };
    setSelectedTask(prefilledTask);
    setIsModalOpen(true);
  };
  const handleEventDropAndResize = (info) => {
    const originalEventId = info.event.extendedProps.id;
    updateEvent({ id: originalEventId, startStr: info.event.startStr, endStr: info.event.endStr || info.event.startStr });
  };
  
  const handleMonthClickFromYear = (date) => {
    setCurrentDate(date);
    setCurrentView('dayGridMonth');
  };

  useEffect(() => {
    if (calendarRef.current && currentView !== 'dayGridYear') {
      const timeoutId = setTimeout(() => {
        calendarRef.current?.getApi().changeView(currentView);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [currentView]);

  return (
    <>
      <CalendarStyles />
      <div className="w-full bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-slate-200/70 relative">
        <CalendarHeader 
            calendarRef={calendarRef}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            currentView={currentView}
            setCurrentView={setCurrentView}
        />

        {currentView === 'dayGridYear' ? (
            <YearView 
                year={getYear(currentDate)}
                events={events}
                onMonthClick={handleMonthClickFromYear}
            />
        ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView={currentView}
              initialDate={currentDate}
              locale={ptBR}
              editable={true}
              selectable={true}
              businessHours={{ daysOfWeek: [1, 2, 3, 4, 5], startTime: '09:00', endTime: '18:00' }}
              slotDuration="00:30:00"
              events={events}
              datesSet={(info) => setCurrentDate(info.view.currentStart)}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              eventDrop={handleEventDropAndResize}
              eventResize={handleEventDropAndResize}
              height="auto"
              aspectRatio={1.8}
              dayMaxEvents={true}
              eventDisplay="block"
              eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
              eventContent={(arg) => {
                const isRecurrent = !!arg.event.extendedProps.recurrence;
                if (arg.view.type.startsWith('list')) {
                  return (
                    <div className="flex items-center gap-3 text-slate-800 font-medium"><span className="truncate">{arg.event.title}</span>{isRecurrent && <Repeat className="w-4 h-4 text-slate-400 ml-auto" />}</div>
                  );
                }
                if (arg.view.type === 'dayGridMonth') {
                  const isMultiDay = arg.event.start && arg.event.end && !isSameDay(arg.event.start, arg.event.end);
                  const showTime = !arg.event.allDay && (!isMultiDay || isSameDay(arg.event.start, arg.day));
                  let timeText = '';
                  if(showTime && arg.timeText) { timeText = format(arg.event.start, 'H:mm').replace(':00', '') + 'h'; }
                  return (
                    <div className='flex items-center gap-1.5 overflow-hidden text-white'>
                       <div className="fc-daygrid-event-dot" style={{ borderColor: 'white', backgroundColor: arg.backgroundColor }}></div>
                       {timeText && <div className="fc-event-time">{timeText}</div>}
                       <div className="fc-event-title truncate">{arg.event.title}</div>
                       {isRecurrent && <Repeat className="w-3 h-3 ml-auto flex-shrink-0" />}
                    </div>
                  );
                }
                return (
                  <div className="w-full h-full text-white flex items-center gap-2 overflow-hidden">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: 'white', opacity: 0.9}}/><span className="text-sm font-semibold truncate leading-tight">{arg.event.title}</span>{isRecurrent && <Repeat className="w-3 h-3 ml-auto flex-shrink-0" />}
                  </div>
                );
              }}
            />
        )}
        
        {popoverState.visible && (
            <EventPopover 
                targetElement={popoverState.targetElement} event={popoverState.event}
                selectedDate={popoverState.selectedDate} tags={tags} onClose={closePopover}
                onEdit={handleOpenEditModal} onDelete={handleDeleteFromPopover} onSave={handleQuickSave}
                onGoToFullEditor={handleGoToFullEditor}
            />
        )}
        <TaskModal
          isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleTaskSubmit}
          onDelete={handleTaskDelete} tags={tags} selectedDate={selectedDate} selectedTask={selectedTask}
        />
      </div>
    </>
  );
};

export default CalendarPage;