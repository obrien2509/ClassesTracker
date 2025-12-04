
import React, { useState, useMemo } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { ClassSession } from '../../types';
import Card from '../ui/Card';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const CalendarTab: React.FC = () => {
  const { appData, getCourseById } = useAppData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ key: `empty-${i}`, day: null, date: null });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ key: day, day, date: new Date(year, month, day) });
    }
    return days;
  }, [month, year, daysInMonth, firstDayOfMonth]);

  const classesByDate = useMemo(() => {
    const map = new Map<string, ClassSession[]>();
    appData.classes.forEach(cls => {
        const dateStr = new Date(cls.date).toDateString();
        if (!map.has(dateStr)) {
            map.set(dateStr, []);
        }
        map.get(dateStr)?.push(cls);
    });
    return map;
  }, [appData.classes]);

  const changeMonth = (delta: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + delta);
      return newDate;
    });
  };

  const getStatusColor = (status: ClassSession['status']) => {
    switch (status) {
        case 'completed': return 'success';
        case 'replaced':
        case 'brought_forward': return 'warning';
        default: return 'info';
    }
  };

  return (
    <Card title="Calendar View">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => changeMonth(-1)}>← Previous</Button>
        <h3 className="text-xl font-semibold text-slate-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <Button onClick={() => changeMonth(1)}>Next →</Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-slate-600 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map(({ key, day, date }) => {
          const dateStr = date?.toDateString();
          const isToday = dateStr === new Date().toDateString();
          const isSelected = dateStr === selectedDate?.toDateString();
          const hasClasses = dateStr && classesByDate.has(dateStr);

          return (
            <div
              key={key}
              onClick={() => date && setSelectedDate(date)}
              className={`p-2 h-24 border rounded-md transition-colors cursor-pointer flex flex-col items-center justify-start
                ${day === null ? 'bg-gray-50' : 'hover:bg-cyan-50'}
                ${isToday ? 'border-2 border-blue-500' : 'border-gray-200'}
                ${isSelected ? 'bg-cyan-100 border-cyan-500' : ''}`}
            >
              <span className={`font-medium ${isToday ? 'text-blue-600' : 'text-slate-700'}`}>{day}</span>
              {hasClasses && <div className="mt-2 w-2 h-2 bg-green-500 rounded-full" title="Class scheduled"></div>}
            </div>
          );
        })}
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
        Classes on: {selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {selectedDate && classesByDate.has(selectedDate.toDateString()) ? (
              classesByDate.get(selectedDate.toDateString())!.map(cls => {
                const course = getCourseById(cls.courseId);
                return (
                  <tr key={cls.id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{course?.code || 'N/A'}</td>
                    <td className="px-6 py-4">{cls.startTime} - {cls.endTime}</td>
                    <td className="px-6 py-4">{cls.location}</td>
                    <td className="px-6 py-4"><Badge color={getStatusColor(cls.status)}>{cls.status}</Badge></td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={4} className="text-center p-6 text-slate-500">
                {selectedDate ? 'No classes on this date.' : 'Click on a date to view classes.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CalendarTab;
