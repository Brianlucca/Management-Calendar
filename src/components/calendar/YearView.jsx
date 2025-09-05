import React, { useMemo } from 'react';
import { format, getDaysInMonth, getDay, startOfMonth, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const YearView = ({ year, events, onMonthClick }) => {
  const eventDaysSet = useMemo(() => {
    const dates = new Set();
    events.forEach(event => {
      dates.add(format(new Date(event.start), 'yyyy-MM-dd'));
    });
    return dates;
  }, [events]);

  const months = Array.from({ length: 12 }, (_, i) => i);
  const weekdays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const renderMonth = (monthIndex) => {
    const date = new Date(year, monthIndex, 1);
    const daysInMonth = getDaysInMonth(date);
    const firstDayOfWeek = getDay(startOfMonth(date));
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div key={monthIndex} className="p-4 bg-white rounded-xl shadow-md border border-slate-200/60">
        <button
          onClick={() => onMonthClick(date)}
          className="w-full text-center font-bold text-indigo-600 mb-3 text-lg hover:underline"
        >
          {format(date, 'MMMM', { locale: ptBR })}
        </button>
        <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-slate-500 font-semibold">
          {weekdays.map((day, i) => <div key={`${day}-${i}`}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1 mt-2">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`}></div>)}
          {monthDays.map(day => {
            const currentDate = new Date(year, monthIndex, day);
            const formattedDate = format(currentDate, 'yyyy-MM-dd');
            const hasEvent = eventDaysSet.has(formattedDate);
            const isTodayDate = isToday(currentDate);

            return (
              <div
                key={day}
                className={`flex items-center justify-center h-8 w-8 rounded-full text-sm transition-colors
                  ${isTodayDate ? 'bg-indigo-600 text-white' : ''}
                  ${!isTodayDate && hasEvent ? 'bg-slate-200' : ''}
                  ${!isTodayDate ? 'text-slate-700' : ''}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {months.map(month => renderMonth(month))}
    </div>
  );
};

export default YearView;