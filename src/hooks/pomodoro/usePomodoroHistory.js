import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { ref, onValue, query, orderByChild, startAt } from "firebase/database";
import { db } from "../../service/FirebaseConfig";
import { subDays } from 'date-fns';

export default function usePomodoroHistory() {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
    const historyRef = query(
      ref(db, `users/${currentUser.uid}/pomodoro/history`),
      orderByChild('completedAt'),
      startAt(thirtyDaysAgo)
    );

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      const loadedHistory = data ? Object.values(data) : [];
      setHistory(loadedHistory);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return { history, loading };
}