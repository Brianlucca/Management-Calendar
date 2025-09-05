import { useState, useEffect, useMemo, useCallback } from 'react';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { db } from '../../service/FirebaseConfig';
import { useNotification } from '../../components/notification/Notification';
import { RRule } from 'rrule';
import { parseISO, add, differenceInMilliseconds, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export const useCalendar = (currentUser, viewRange) => {
  const [rawEvents, setRawEvents] = useState([]);
  const [tags, setTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const { showNotification } = useNotification();

  const currentViewRange = useMemo(() => {
    return viewRange || { start: startOfMonth(new Date()), end: endOfMonth(new Date()) };
  }, [viewRange]);

  useEffect(() => {
    if (!currentUser) return;
    const tasksRef = ref(db, `users/${currentUser.uid}/calendar/tasks`);
    const tagsRef = ref(db, `users/${currentUser.uid}/tags`);
    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      setRawEvents(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });
    const unsubscribeTags = onValue(tagsRef, (snapshot) => {
      const data = snapshot.val();
      setTags(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    });
    return () => {
      unsubscribeTasks();
      unsubscribeTags();
    };
  }, [currentUser]);

  const expandedEvents = useMemo(() => {
    return rawEvents.flatMap(event => {
      const eventColor = event.tags?.length > 0 ? tags.find(t => t.id === event.tags[0])?.color || "#4f46e5" : "#4f46e5";
      if (!event.recurrence || event.recurrence.freq === 'none') {
        return [{ ...event, start: event.startDate, end: event.endDate, backgroundColor: eventColor, borderColor: eventColor, extendedProps: event }];
      }
      try {
        const ruleOptions = {
          freq: RRule[event.recurrence.freq.toUpperCase()],
          dtstart: parseISO(event.startDate),
          until: event.recurrence.until ? endOfDay(parseISO(event.recurrence.until)) : null,
          byweekday: event.recurrence.byday && event.recurrence.byday.length > 0 ? event.recurrence.byday.map(day => RRule[day]) : null,
        };
        const rule = new RRule(ruleOptions);
        const duration = differenceInMilliseconds(parseISO(event.endDate), parseISO(event.startDate));
        const occurrences = rule.between(currentViewRange.start, currentViewRange.end, true);
        return occurrences.map(date => ({
          id: `${event.id}-${date.toISOString().slice(0, 10)}`,
          title: event.title,
          start: date,
          end: add(date, { milliseconds: duration }),
          backgroundColor: eventColor,
          borderColor: eventColor,
          extendedProps: event,
        }));
      } catch (error) { return []; }
    });
  }, [rawEvents, tags, currentViewRange]);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setSelectedTask(null);
    setIsModalOpen(true);
  };
  
  const handleEventClick = (info) => {
    setSelectedTask(info.event.extendedProps);
    setIsModalOpen(true);
  };
  
  const handleTaskSubmit = async (taskData) => {
    if (!currentUser) return;
    try {
      const taskRefPath = `users/${currentUser.uid}/calendar/tasks`;
      const dataToSave = {
        ...taskData,
        startDate: parseISO(taskData.startDate).toISOString(),
        endDate: parseISO(taskData.endDate).toISOString(),
      };

      if (selectedTask && selectedTask.id) {
        await update(ref(db, `${taskRefPath}/${selectedTask.id}`), dataToSave);
        showNotification("Tarefa atualizada com sucesso!", "success");
      } else {
        const finalData = { ...dataToSave, createdAt: new Date().toISOString() };
        await push(ref(db, taskRefPath), finalData);
        showNotification("Tarefa criada com sucesso!", "success");
      }
      setIsModalOpen(false);
      setSelectedTask(null);
    } catch (error) { 
      console.error("Erro ao salvar tarefa:", error);
      showNotification("Erro ao salvar tarefa.", "error"); 
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (currentUser) {
      await remove(ref(db, `users/${currentUser.uid}/calendar/tasks/${taskId}`));
      showNotification("Tarefa excluída com sucesso.", "success");
    }
  };

  const updateEventTime = async (eventInfo) => {
    if (!currentUser) return;
    const { id, startStr, endStr } = eventInfo;
    const eventRef = ref(db, `users/${currentUser.uid}/calendar/tasks/${id}`);
    try { 
      await update(eventRef, { startDate: startStr, endDate: endStr }); 
    } catch (error) { 
      showNotification("Erro ao reagendar tarefa.", "error"); 
    }
  };

  return {
    events: expandedEvents, tags, isModalOpen, selectedDate, selectedTask, setIsModalOpen,
    handleDateClick, handleEventClick, handleTaskSubmit, handleTaskDelete, updateEvent: updateEventTime, setSelectedTask,
  };
};