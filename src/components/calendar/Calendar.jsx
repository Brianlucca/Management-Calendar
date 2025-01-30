import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { ref, push, onValue, update } from "firebase/database";
import { db } from "../../service/FirebaseConfig";
import { useAuth } from "../../context/AuthContext"; 
import TaskModal from "./TaskModal";
import TagsManager from "../tags/TagsManager";
import TagsLegend from "../tags/TagsLegend";
import moment from "moment";
import "moment/locale/pt-br";

moment.locale('pt-br');

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tags, setTags] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const tagsRef = ref(db, `tags/${currentUser.uid}`);
      onValue(tagsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedTags = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setTags(loadedTags);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const eventsRef = ref(db, `events/${currentUser.uid}`);
      onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const loadedEvents = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setEvents(loadedEvents);
        }
      });
    }
  }, [currentUser]);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setSelectedTask(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEventClick = (info) => {
    setSelectedTask({
      id: info.event.id,
      title: info.event.title,
      startDate: info.event.start,
      endDate: info.event.end,
      description: info.event.extendedProps.description,
      tags: info.event.extendedProps.tags,
      createdBy: info.event.extendedProps.createdBy,
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleTaskSubmit = (task) => {
    if (currentUser) {
      const newTask = {
        ...task,
        createdBy: currentUser.email,
      };

      if (isEditMode && selectedTask) {
        update(ref(db, `events/${currentUser.uid}/${selectedTask.id}`), newTask)
          .then(() => console.log("Tarefa atualizada!"))
          .catch((error) => console.error("Erro ao atualizar:", error));
      } else {
        push(ref(db, `events/${currentUser.uid}`), newTask)
          .then(() => console.log("Tarefa criada!"))
          .catch((error) => console.error("Erro ao criar:", error));
      }
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl shadow-sm p-5 border bg-white border-gray-200">
              <TagsManager onTagCreate={(tag) => setTags([...tags, tag])} />
            </div>
            <div className="rounded-xl shadow-sm p-5 border bg-white border-gray-200">
              <TagsLegend tags={tags} />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-xl shadow-sm border overflow-hidden bg-white border-gray-200 p-4">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                locale="pt-br"
                events={events.map((event) => ({
                  id: event.id,
                  title: event.title,
                  start: event.startDate,
                  end: event.endDate,
                  extendedProps: {
                    description: event.description,
                    tags: event.tags,
                    createdBy: event.createdBy,
                  },
                  color: tags.find((t) => t.id === event.tags?.[0])?.color || "#3B82F6",
                }))}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
                }}
                views={{
                  listMonth: {
                    type: 'listMonth',
                    duration: { months: 12 },
                    buttonText: 'Lista'
                  },
                  dayGridMonth: {
                    type: 'dayGridMonth',
                    buttonText: 'Mês'
                  },
                  timeGridWeek: {
                    type: 'timeGridWeek',
                    buttonText: 'Semana'
                  },
                  timeGridDay: {
                    type: 'timeGridDay',
                    buttonText: 'Dia'
                  }
                }}
                eventDisplay="block"
                eventTimeFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false
                }}
                height="auto"
                eventContent={(arg) => (
                  <div className="flex items-center p-1">
                    <div 
                      className="w-2 h-2 rounded-full mr-2 flex-shrink-0" 
                      style={{ backgroundColor: arg.event.backgroundColor }} 
                    />
                    <span className="truncate">
                      {arg.event.title}
                    </span>
                  </div>
                )}
                themeSystem="standard"
              />
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleTaskSubmit}
        tags={tags}
        selectedDate={selectedDate}
        selectedTask={selectedTask}
        isEditMode={isEditMode}
        onEdit={() => setIsEditMode(true)}
      />
    </div>
  );
};
export default Calendar;