import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { ref, push, onValue, update } from "firebase/database";
import { db } from "../../service/FirebaseConfig";
import { useAuth } from "../../context/AuthContext";
import TaskModal from "./taskModal/TaskModal";
import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tags, setTags] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const tasksRef = ref(db, "calendar/tasks");
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedTasks = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setEvents(loadedTasks);
      }
    });
  }, []);

  useEffect(() => {
    const tagsRef = ref(db, "tags");
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
  }, []);

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
    const newTask = {
      ...task,
      createdBy: currentUser.email,
      tags: task.tags?.filter((tag) => tag !== undefined) || [],
    };

    if (isEditMode && selectedTask) {
      update(ref(db, `calendar/tasks/${selectedTask.id}`), newTask)
        .then(() => console.log("Tarefa atualizada!"))
        .catch((error) => console.error("Erro ao atualizar:", error));
    } else {
      push(ref(db, "calendar/tasks"), newTask)
        .then(() => console.log("Tarefa criada!"))
        .catch((error) => console.error("Erro ao criar:", error));
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedTask(null);
  };

  return (
    <div className="md:mt-0 mt-20 md:ml-20 md:min-h-screen md:p-6 bg-gray-50 flex flex-col items-center">
      <div className="w-full md:max-w-5xl">
        <div className="rounded-xl shadow-sm border overflow-hidden bg-white border-gray-200 w-full md:p-4 mb-6">
          <FullCalendar
            className="p-4"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
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
              color:
                event.tags?.length > 0
                  ? event.tags[0].color
                  : "#3B82F6",
            }))}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            buttonText={{
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              list: "Lista",
            }}
            views={{
              listMonth: {
                type: "listMonth",
                duration: { months: 12 },
                buttonText: "Lista",
              },
              dayGridMonth: {
                type: "dayGridMonth",
                buttonText: "Mês",
              },
              timeGridWeek: {
                type: "timeGridWeek",
                buttonText: "Semana",
              },
              timeGridDay: {
                type: "timeGridDay",
                buttonText: "Dia",
              },
            }}
            height="auto"
            themeSystem="standard"
            contentHeight="auto"
            eventLimit={true}
          />
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
