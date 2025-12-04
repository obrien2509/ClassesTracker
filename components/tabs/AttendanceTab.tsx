import React, { useState, useMemo, useEffect } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { AttendanceStatus } from '../../types';
import Card from '../ui/Card';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

interface AttendanceState {
  [studentId: string]: {
    status: AttendanceStatus;
    note: string;
  };
}

const AttendanceTab: React.FC = () => {
  const { appData, getCourseById, saveAttendance } = useAppData();
  const [selectedClass, setSelectedClass] = useState('');
  const [attendance, setAttendance] = useState<AttendanceState>({});
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const selectedClassInfo = useMemo(() => {
    if (!selectedClass) return null;
    const cls = appData.classes.find(c => c.id === selectedClass);
    if (!cls) return null;
    const course = getCourseById(cls.courseId);
    if (!course) return null;
    const students = appData.students.filter(s => s.courseId === course.id);
    return { cls, course, students };
  }, [selectedClass, appData, getCourseById]);

  useEffect(() => {
    if (selectedClassInfo) {
      const initialAttendance: AttendanceState = {};
      selectedClassInfo.students.forEach(student => {
        const record = appData.attendance.find(a => a.classId === selectedClass && a.studentId === student.id);
        initialAttendance[student.id] = {
          status: record?.status || 'present',
          note: record?.note || '',
        };
      });
      setAttendance(initialAttendance);
    } else {
      setAttendance({});
    }
  }, [selectedClassInfo, appData.attendance, selectedClass]);

  // FIX: Replaced handleAttendanceChange with two type-safe handlers to prevent inconsistent object shapes in the state.
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        note: prev[studentId]?.note ?? '',
        status,
      },
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status ?? 'present',
        note,
      },
    }));
  };

  const handleSaveAttendance = () => {
    if (!selectedClass) {
      setAlert({ message: 'Please select a class', type: 'error' });
      return;
    }
    // FIX: Replaced Object.entries with Object.keys to avoid type inference issues
    // where `data` was being inferred as `unknown`. This approach is more type-safe.
    const records = Object.keys(attendance).map((studentId) => ({
      studentId,
      status: attendance[studentId].status,
      note: attendance[studentId].note,
    }));
    saveAttendance(records, selectedClass);
    setAlert({ message: 'Attendance saved successfully!', type: 'success' });
  };

  return (
    <Card title="Attendance Tracking">
      {alert && <Alert message={alert.message} type={alert.type} onDismiss={() => setAlert(null)} />}
      <Select
        label="Select Class"
        id="classForAttendance"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        <option value="">-- Choose Class --</option>
        {appData.classes
          .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map(c => {
            const course = getCourseById(c.courseId);
            return <option key={c.id} value={c.id}>{course?.code} - {c.date} {c.startTime}</option>;
          })}
      </Select>

      <h3 className="text-lg font-semibold text-slate-800 my-6">Mark Attendance</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Index Number</th>
              <th className="px-6 py-3">Attendance</th>
              <th className="px-6 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {selectedClassInfo && selectedClassInfo.students.length > 0 ? (
              selectedClassInfo.students.map(student => (
                <tr key={student.id} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{student.name}</td>
                  <td className="px-6 py-4">{student.indexNumber}</td>
                  <td className="px-6 py-4">
                    <select
                      value={attendance[student.id]?.status || 'present'}
                      // FIX: Call the new type-safe handler and cast value to AttendanceStatus.
                      onChange={(e) => handleStatusChange(student.id, e.target.value as AttendanceStatus)}
                      className="p-2 border border-gray-300 rounded-md text-sm w-full bg-white"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="text"
                      value={attendance[student.id]?.note || ''}
                      // FIX: Call the new type-safe handler for notes.
                      onChange={(e) => handleNoteChange(student.id, e.target.value)}
                      placeholder="Add notes"
                      className="p-2 border border-gray-300 rounded-md text-sm w-full"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="text-center p-6 text-slate-500">
                {selectedClass ? 'No students enrolled in this course.' : 'Select a class to mark attendance.'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedClassInfo && selectedClassInfo.students.length > 0 && (
        <Button onClick={handleSaveAttendance} variant="success" className="mt-6">Save Attendance</Button>
      )}
    </Card>
  );
};

export default AttendanceTab;