import { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

export const useTaskModal = ({ selectedTask, selectedDate, onSubmit, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    tags: [],
    location: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [mapUrl, setMapUrl] = useState(null);

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        ...selectedTask,
        startDate: moment(selectedTask.startDate).format("YYYY-MM-DDTHH:mm"),
        endDate: moment(selectedTask.endDate).format("YYYY-MM-DDTHH:mm"),
        tags: selectedTask.tags || [],
        location: selectedTask.location || "",
      });
      setIsEditMode(false);
    } else {
      const defaultDate = selectedDate ? moment(selectedDate) : moment();
      setFormData({
        title: "",
        description: "",
        startDate: defaultDate.format("YYYY-MM-DDTHH:mm"),
        endDate: defaultDate.add(1, "hour").format("YYYY-MM-DDTHH:mm"),
        tags: [],
        location: "",
      });
      setIsEditMode(true);
    }
  }, [selectedTask, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("O título é obrigatório!");
      return;
    }

    const startMoment = moment(formData.startDate);
    const endMoment = moment(formData.endDate);

    if (endMoment.isBefore(startMoment)) {
      alert("A data/hora de término deve ser posterior à de início!");
      return;
    }

    const taskData = {
      ...formData,
      startDate: startMoment.toISOString(),
      endDate: endMoment.toISOString(),
    };

    onSubmit(taskData);
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      await onDelete(selectedTask.id);
      onClose();
    }
  };

  const getCoordinates = async (location) => {
    if (!location) return null;
  
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );
      const data = await response.json();
  
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const getMapUrl = async (location) => {
    try {
      if (!location) return null;

      const coordMatch = location.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lng = parseFloat(coordMatch[2]);
        return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik`;
      }

      const coordinates = await getCoordinates(location);
      if (coordinates) {
        const { lat, lon } = coordinates;
        return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}&layer=mapnik`;
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const updateMapUrl = async () => {
      if (formData.location) {
        const url = await getMapUrl(formData.location);
        setMapUrl(url);
      } else {
        setMapUrl(null);
      }
    };

    updateMapUrl();
  }, [formData.location]);

  return {
    formData,
    setFormData,
    isEditMode,
    setIsEditMode,
    handleSubmit,
    handleDelete,
    mapUrl,
  };
};
