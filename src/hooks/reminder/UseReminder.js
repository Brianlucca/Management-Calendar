import { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  update,
  remove,
} from "firebase/database";
import { getAuth } from "firebase/auth";

const useReminder = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const tasksRef = ref(db, `users/${user.uid}/reminder/tasks`);
    const completedRef = ref(db, `users/${user.uid}/reminder/completedTasks`);
    
    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val() || {};
      const tasksArray = Object.entries(data).map(([id, task]) => ({ id, ...task }));
      setTasks(tasksArray.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setLoading(false);
    });

    const unsubscribeCompleted = onValue(completedRef, (snapshot) => {
      const data = snapshot.val() || {};
      const completedArray = Object.entries(data).map(([id, task]) => ({ id, ...task }));
      setCompletedTasks(
        completedArray.sort(
          (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
        )
      );
    });

    return () => {
      unsubscribeTasks();
      unsubscribeCompleted();
    };
  }, [auth.currentUser]);

  const requestNotificationPermission = async () => {
    if (Notification.permission === "granted") return true;
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  };

  const scheduleNotification = async (task) => {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) return;

    const taskTime = new Date(task.date).getTime();
    const now = Date.now();
    const delay = taskTime - now;

    if (delay > 0) {
      setTimeout(() => {
        new Notification("⏰ Lembrete!", {
          body: `Está na hora: ${task.title}`,
        });
        const audio = new Audio("/alert.weba");
        audio.play();
      }, delay);
    }
  };

  const handleTask = async (taskData, id = null) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      if (id) {
        await update(ref(db, `users/${user.uid}/reminder/tasks/${id}`), taskData);
      } else {
        const newTaskRef = push(ref(db, `users/${user.uid}/reminder/tasks`));
        await set(newTaskRef, taskData);
        scheduleNotification({ id: newTaskRef.key, ...taskData });
      }
    } catch (error) {
      throw error;
    }
  };

  const completeTask = async (task) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await set(ref(db, `users/${user.uid}/reminder/completedTasks/${task.id}`), {
        ...task,
        completedAt: new Date().toISOString(),
      });
      await remove(ref(db, `users/${user.uid}/reminder/tasks/${task.id}`));
    } catch (error) {
      throw error;
    }
  };

  const deleteTask = async (id, isCompleted = false) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const path = `users/${user.uid}/reminder/${isCompleted ? "completedTasks" : "tasks"}/${id}`;
      await remove(ref(db, path));
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js")
        .catch(() => {});
    }
  }, []);


  return {
    tasks,
    completedTasks,
    loading,
    handleTask,
    completeTask,
    deleteTask,
  };
};

export default useReminder;
