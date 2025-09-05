import React, { useMemo, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCalendar } from '../../hooks/calendar/UseCalendar';
import useReminder from '../../hooks/reminder/UseReminder';
import usePomodoroHistory from '../../hooks/pomodoro/usePomodoroHistory';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BrainCircuit, Calendar, ListTodo, Check } from 'lucide-react';
import { format, parseISO, isAfter, startOfWeek, eachDayOfInterval, isSameDay, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../service/FirebaseConfig';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState('');
  const { events, tags } = useCalendar(currentUser);
  const { tasks: reminders } = useReminder();
  const { history: pomodoroHistory } = usePomodoroHistory();

  useEffect(() => {
    const fetchUserName = async () => {
      if (currentUser) {
        const userRef = doc(firestore, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().name.split(' ')[0]);
        }
      }
    };
    fetchUserName();
  }, [currentUser]);

  const stats = useMemo(() => {
    const now = new Date();
    const last7Days = eachDayOfInterval({ start: subDays(now, 6), end: now });

    const upcoming = [...events, ...reminders.map(r => ({ ...r, startDate: r.date, isReminder: true }))]
      .filter(item => item.startDate && isAfter(parseISO(item.startDate), now))
      .sort((a, b) => parseISO(a.startDate) - parseISO(b.startDate))
      .slice(0, 4);

    const tasksByTag = tags.map(tag => ({
      name: tag.name,
      value: events.filter(e => e.tags && e.tags.includes(tag.id)).length,
      fill: tag.color,
    })).filter(tag => tag.value > 0);

    const weeklyActivity = last7Days.map(day => ({
      name: format(day, 'eee', { locale: ptBR }),
      Tarefas: events.filter(e => e.createdAt && isSameDay(parseISO(e.createdAt), day)).length,
      Lembretes: reminders.filter(r => r.createdAt && isSameDay(parseISO(r.createdAt), day)).length,
    }));

    const pomodorosToday = pomodoroHistory.filter(p => p.completedAt && isSameDay(parseISO(p.completedAt), now)).length;

    return { upcoming, tasksByTag, weeklyActivity, pomodorosToday, totalActiveTasks: events.length, pendingReminders: reminders.length };
  }, [events, tags, reminders, pomodoroHistory]);

  const StatCard = ({ icon, value, label, color, textColor }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/70 flex items-start justify-between">
      <div>
        <p className="text-slate-500 font-semibold">{label}</p>
        <p className="text-4xl font-bold text-slate-800 mt-2">{value}</p>
      </div>
      <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${color}`}>{icon}</div>
    </div>
  );

  return (
    <main>
      <div className="p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Olá, {userName || '...'}!
          </h1>
          <p className="mt-2 text-lg text-slate-600">Aqui está o resumo do seu dia e da sua semana.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<Calendar className="w-6 h-6 text-indigo-500"/>} value={stats.totalActiveTasks} label="Tarefas Ativas" color="bg-indigo-100"/>
          <StatCard icon={<ListTodo className="w-6 h-6 text-sky-500"/>} value={stats.pendingReminders} label="Lembretes Pendentes" color="bg-sky-100"/>
          <StatCard icon={<BrainCircuit className="w-6 h-6 text-rose-500"/>} value={stats.pomodorosToday} label="Ciclos de Foco (Hoje)" color="bg-rose-100"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200/70 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-5">Atividade da Semana</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={stats.weeklyActivity} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false}/>
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={30}/>
                  <Tooltip wrapperClassName="!bg-white !border !border-slate-200 !rounded-lg !shadow-xl" cursor={{fill: '#f1f5f9'}}/>
                  <Legend iconType="circle" />
                  <Bar dataKey="Tarefas" stackId="a" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Lembretes" stackId="a" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
<div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-slate-200/70 p-6 lg:p-8">
  <h2 className="text-2xl font-bold text-slate-800 mb-5">Tarefas por Tag</h2>
  <div style={{ width: '100%', height: 300 }}>
    {stats.tasksByTag.length > 0 ? (
      <ResponsiveContainer>
        <PieChart>
          <Pie data={stats.tasksByTag} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={3} labelLine={false}>
            {stats.tasksByTag.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
          </Pie>
          <Tooltip wrapperClassName="!bg-white !border !border-slate-200 !rounded-lg !shadow-xl"/>
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    ) : <p className="text-center pt-24 text-slate-500">Crie tarefas com tags para ver os gráficos.</p>}
  </div>
</div>

          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-slate-200/70 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-5">Sua Próxima Agenda</h2>
            <div className="space-y-4">
              {stats.upcoming.length > 0 ? (
                stats.upcoming.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50">
                     <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${item.isReminder ? 'bg-sky-100' : 'bg-indigo-100'}`}>
                       {item.isReminder ? <ListTodo className="w-6 h-6 text-sky-500"/> : <Calendar className="w-6 h-6 text-indigo-500"/>}
                     </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="text-sm text-slate-500">{format(parseISO(item.startDate), "eeee, d 'de' MMMM 'às' HH:mm", { locale: ptBR })}h</p>
                    </div>
                  </div>
                ))
              ) : <p className="text-center py-8 text-slate-500">Sua agenda está livre!</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;