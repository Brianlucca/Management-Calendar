import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { ref, push, onValue, update, get } from "firebase/database";
import { db } from "../../service/FirebaseConfig";
import { useAuth } from "../../context/AuthContext";
import TaskModal from "./taskModal/TaskModal";
import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tags, setTags] = useState([]);
  const { currentUser, userRole } = useAuth();

  const getNextTaskId = async () => {
    const counterRef = ref(db, "counters/tasks");
    const snapshot = await get(counterRef);
    let count = snapshot.val()?.count || 0;
    count++;
    await update(counterRef, { count });
    return count;
  };

  useEffect(() => {
    const tasksRef = ref(db, "calendar/tasks");
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTasks = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : [];
      setEvents(loadedTasks);
    });

    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const loadedUsers = data ? Object.keys(data).map((key) => ({ uid: key, ...data[key] })) : [];
      setUsers(loadedUsers);
    });

    const tagsRef = ref(db, "tags");
    onValue(tagsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tagsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setTags(tagsArray);
      }
    });
  }, []); // Fechamento correto do useEffect

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setSelectedTask(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEventClick = (info) => {
    const canEdit = userRole === "administrador" || currentUser.uid === info.event.extendedProps.createdByUid;
    setSelectedTask({ ...info.event.extendedProps, id: info.event.id, canEdit });
    setIsModalOpen(true);
  };

  const handleTaskSubmit = async (task) => {
    try {
      const now = new Date().toISOString();
      const originalTask = selectedTask || {};
      const changes = trackChanges(originalTask, task);

      const editEntry = {
        user: currentUser.email,
        timestamp: now,
        changes,
      };

      console.log("Tags sendo enviadas:", task.tags);

      const newTask = {
        ...task,
        status: task.status || "pendente",
        createdBy: currentUser.email,
        createdByUid: currentUser.uid,
        updatedAt: now,
        editHistory: [...(originalTask.editHistory || []), editEntry],
        tags: task.tags.filter(tag => typeof tag === 'string'), ...(!selectedTask && { taskId: await getNextTaskId(), createdAt: now }),
      };

      if (selectedTask) {
        await update(ref(db, `calendar/tasks/${selectedTask.id}`), newTask);
      } else {
        await push(ref(db, "calendar/tasks"), newTask);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    }
  };

  const trackChanges = (original, updated) => {
    const changes = {};
    Object.keys(updated).forEach((key) => {
      const originalValue = original[key] || "vazio";
      const updatedValue = updated[key] || "vazio";

      if (key === "tags") {
        const originalTags = Array.isArray(originalValue) ? originalValue.filter(tag => tag !== undefined) : [];
        const updatedTags = Array.isArray(updatedValue) ? updatedValue.filter(tag => tag !== undefined) : [];

        if (JSON.stringify(originalTags) !== JSON.stringify(updatedTags)) {
          changes[key] = { from: originalTags, to: updatedTags };
        }
      } else if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
        changes[key] = { from: originalValue, to: updatedValue };
      }
    });
    return changes;
  };

  return (
    <div className="md:mt-0 mt-20 md:ml-20 md:min-h-screen md:p-6 bg-gray-50 flex flex-col items-center">
      <div className="w-full md:max-w-5xl">
        <div className="rounded-xl shadow-sm border overflow-hidden bg-white border-gray-200 w-full md:p-4 mb-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            locale="pt-br"
            events={events.map((event) => {
              const user = users.find((u) => u.uid === event.createdByUid);
              const eventTags = tags.filter(tag => event.tags?.includes(tag.id));
              const tagColor = eventTags.length > 0 ? eventTags[0].color : null;

              const isTimedEvent = event.startDate.includes('T') || event.endDate.includes('T');
              let endDate = event.endDate;

              if (!isTimedEvent && moment(event.endDate).isSame(event.startDate, 'day')) {
                endDate = moment(event.endDate).add(1, 'day').format('YYYY-MM-DD');
              }

              return {
                id: event.id,
                title: `#${event.taskId} - ${event.title}`,
                start: event.startDate,
                end: endDate,
                backgroundColor: event.status === "concluida" ? "#10B981" : tagColor || user?.color || "#3B82F6",
                borderColor: event.status === "concluida" ? "#10B981" : tagColor || user?.color || "#3B82F6",
                extendedProps: { ...event, canEdit: userRole === "administrador" || currentUser.uid === event.createdByUid },
              };
            })}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventContent={(arg) => (
              <div className="p-1" style={{
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {arg.event.title}
                  </span>
                </div>
              </div>
            )} headerToolbar={{
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
          />
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
          setIsEditMode(false);
        }}
        onSubmit={handleTaskSubmit}
        tags={tags}
        users={users}
        selectedDate={selectedDate}
        selectedTask={selectedTask}
        isEditMode={isEditMode}
        userRole={userRole}
        currentUser={currentUser}
        setIsEditMode={setIsEditMode}
      />
    </div>
  );
};

export default Calendar;