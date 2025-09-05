import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../components/notification/Notification";
import { ref, set, get } from "firebase/database";
import { db } from "../../service/FirebaseConfig";

const DEFAULT_SETTINGS = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
};

export default function usePomodoroSettings() {
  const { currentUser } = useAuth();
  const { showNotification } = useNotification();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const settingsRef = ref(db, `users/${currentUser.uid}/pomodoro/settings`);
      const snapshot = await get(settingsRef);
      if (snapshot.exists()) {
        setSettings(snapshot.val());
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      showNotification("Erro ao carregar configurações do Pomodoro.", "error");
    } finally {
      setLoading(false);
    }
  }, [currentUser, showNotification]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = useCallback(async (newSettings) => {
    if (!currentUser) {
      showNotification("Você precisa estar logado para salvar.", "error");
      return;
    }
    try {
      const settingsRef = ref(db, `users/${currentUser.uid}/pomodoro/settings`);
      await set(settingsRef, newSettings);
      setSettings(newSettings);
      showNotification("Configurações salvas com sucesso!", "success");
    } catch (error) {
      showNotification("Erro ao salvar as configurações.", "error");
    }
  }, [currentUser, showNotification]);
  
  return { settings, saveSettings, loading };
}