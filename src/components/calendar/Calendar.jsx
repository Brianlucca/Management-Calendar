import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useAuth } from '../../context/AuthContext';
import { useCalendar } from '../../hooks/calendar/UseCalendar';
import TaskModal from '../calendar/taskModal/TaskModal';

const Calendar = () => {
  const { currentUser } = useAuth();
  const {
    events,
    tags,
    isModalOpen,
    selectedDate,
    selectedTask,
    setIsModalOpen,
    handleDateClick,
    handleEventClick,
    handleTaskSubmit,
    handleTaskDelete
  } = useCalendar(currentUser);

  return (
    <div className="md:mt-0 mt-20 md:ml-20 md:min-h-screen md:p-6 bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-7xl px-4">
        <div className="rounded-xl shadow-sm border overflow-hidden bg-white border-gray-200 w-full md:p-4 mb-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            locale="pt-br"
            events={events.map(event => ({
              id: event.id,
              title: event.title,
              start: event.startDate,
              end: event.endDate,
              backgroundColor: event.tags?.length > 0 
                ? tags.find(t => t.id === event.tags[0])?.color || "#3B82F6"
                : "#3B82F6",
              borderColor: event.tags?.length > 0 
                ? tags.find(t => t.id === event.tags[0])?.color || "#3B82F6"
                : "#3B82F6",
              extendedProps: event
            }))}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            }}
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia',
              list: 'Lista'
            }}
          
            adaptiveHeight={true}
            handleWindowResize={true}
            views={{
              dayGridMonth: { buttonText: 'Mês' },
              timeGridWeek: { buttonText: 'Semana' },
              timeGridDay: { buttonText: 'Dia' },
              listMonth: { buttonText: 'Lista' }
            }}            eventContent={(arg) => (
              <div className="p-1 truncate">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold truncate">
                    {arg.event.title}
                  </span>
                </div>
              </div>
            )}
            height="auto"
            aspectRatio={1.5}
            windowResizeDelay={100}
          />
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTaskSubmit}
        onDelete={handleTaskDelete}
        tags={tags}
        selectedDate={selectedDate}
        selectedTask={selectedTask}
      />
    </div>
  );
};

export default Calendar;