import { useState, useEffect, useCallback } from "react";
import { format, addHours, parseISO, isValid } from 'date-fns';

export const useTaskModal = ({ selectedTask, selectedDate }) => {
  const [formData, setFormData] = useState({
    title: "", description: "", startDate: "", endDate: "",
    tags: [], location: "", recurrence: { freq: 'none', until: '', byday: [] },
    subtasks: [],
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [mapUrl, setMapUrl] = useState(null);

  useEffect(() => {
    const defaultRecurrenceEnd = format(addHours(new Date(), 24 * 365), 'yyyy-MM-dd');

    if (selectedTask) {
      const start = selectedTask.startDate && isValid(parseISO(selectedTask.startDate)) ? parseISO(selectedTask.startDate) : parseISO(selectedDate);
      const end = selectedTask.endDate && isValid(parseISO(selectedTask.endDate)) ? parseISO(selectedTask.endDate) : addHours(start, 1);
      
      setFormData({
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        startDate: format(start, "yyyy-MM-dd'T'HH:mm"),
        endDate: format(end, "yyyy-MM-dd'T'HH:mm"),
        tags: selectedTask.tags || [],
        location: selectedTask.location || "",
        recurrence: selectedTask.recurrence || { freq: 'none', until: defaultRecurrenceEnd, byday: [] },
        subtasks: selectedTask.subtasks || [],
      });
      setIsEditMode(!selectedTask.id);
    } else {
      const defaultDate = selectedDate && isValid(parseISO(selectedDate)) ? parseISO(selectedDate) : new Date();
      setFormData({
        title: "", description: "",
        startDate: format(defaultDate, "yyyy-MM-dd'T'HH:mm"),
        endDate: format(addHours(defaultDate, 1), "yyyy-MM-dd'T'HH:mm"),
        tags: [], location: "",
        recurrence: { freq: 'none', until: defaultRecurrenceEnd, byday: [] },
        subtasks: [],
      });
      setIsEditMode(true);
    }
  }, [selectedTask, selectedDate]);

  const getMapUrl = useCallback(async (location) => {
    if (!location) return null;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lon) - 0.01},${parseFloat(lat) - 0.01},${parseFloat(lon) + 0.01},${parseFloat(lat) + 0.01}&layer=mapnik`;
      }
      return null;
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    const updateMapUrl = async () => {
      setMapUrl(formData.location ? await getMapUrl(formData.location) : null);
    };
    updateMapUrl();
  }, [formData.location, getMapUrl]);

  const addSubtask = () => {
    const newSubtask = { id: Date.now().toString(), text: '', completed: false };
    setFormData(prev => ({ ...prev, subtasks: [...prev.subtasks, newSubtask] }));
  };

  const updateSubtask = (id, newText) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(task => task.id === id ? { ...task, text: newText } : task)
    }));
  };

  const toggleSubtask = (id) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task)
    }));
  };

  const deleteSubtask = (id) => {
    setFormData(prev => ({ ...prev, subtasks: prev.subtasks.filter(task => task.id !== id) }));
  };

  return {
    formData, setFormData, isEditMode, setIsEditMode, mapUrl,
    addSubtask, updateSubtask, toggleSubtask, deleteSubtask
  };
};