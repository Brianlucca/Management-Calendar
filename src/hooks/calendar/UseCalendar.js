import { useState, useEffect } from 'react';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { db } from '../../service/FirebaseConfig';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useNotification } from '../../components/notification/Notification';


moment.locale('pt-br');

export const useCalendar = (currentUser) => {
  const [events, setEvents] = useState([]);
  const [tags, setTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
    const { showNotification } = useNotification();
  

  useEffect(() => {
    if (currentUser) {
      const tasksRef = ref(db, `users/${currentUser.uid}/calendar/tasks`);
      const tagsRef = ref(db, `users/${currentUser.uid}/tags`);

      const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        const loadedTasks = data ? Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
          start: data[key].startDate,
          end: data[key].endDate
        })) : [];
        setEvents(loadedTasks);
      });

      const unsubscribeTags = onValue(tagsRef, (snapshot) => {
        const data = snapshot.val();
        setTags(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
      });

      return () => {
        unsubscribeTasks();
        unsubscribeTags();
      };
    }
  }, [currentUser]);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.dateStr);
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (info) => {
    setSelectedTask({
      ...info.event.extendedProps,
      id: info.event.id,
      startDate: moment(info.event.start).format('YYYY-MM-DDTHH:mm'),
      endDate: moment(info.event.end).format('YYYY-MM-DDTHH:mm')
    });
    setIsModalOpen(true);
  };

  const handleTaskSubmit = async (task) => {
    try {
      const newEvent = {
        ...task,
        createdAt: new Date().toISOString()
      };

      if (currentUser) {
        if (selectedTask) {
          await update(
            ref(db, `users/${currentUser.uid}/calendar/tasks/${selectedTask.id}`),
            newEvent
          );
        } else {
          await push(
            ref(db, `users/${currentUser.uid}/calendar/tasks`),
            newEvent
          );
        }
        setIsModalOpen(false);
      }
    } catch (error) {
      showNotification(`Erro ao salvar tarefa`, "error");
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (currentUser) {
      await remove(
        ref(db, `users/${currentUser.uid}/calendar/tasks/${taskId}`)
      );
    }
  };

  return {
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
  };
};