
import React, { useState, useMemo } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { ClassSession } from '../../types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';

const ClassScheduleTab: React.FC = () => {
  const { appData, getCourseById, saveClassSession, deleteClassSession, updateClassStatus } = useAppData();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<ClassSession | null>(null);
  const [status, setStatus] = useState<ClassSession['status'] | ''>('');
  const [replacementDate, setReplacementDate] = useState('');
  const [replacementTime, setReplacementTime] = useState('');

  const initialFormState = { date: '', startTime: '', endTime: '', location: '' };
  const [formState, setFormState] = useState(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      setAlert({ message: 'Please select a course', type: 'error' });
      return;
    }
    if (Object.values(formState).some(val => val === '')) {
      setAlert({ message: 'Please fill all fields', type: 'error' });
      return;
    }
    saveClassSession({ ...formState, courseId: selectedCourse });
    setFormState(initialFormState);
    setAlert({ message: 'Class scheduled successfully!', type: 'success' });
  };
  
  const handleOpenModal = (cls: ClassSession) => {
    setCurrentClass(cls);
    setStatus(cls.status);
    setReplacementDate(cls.replacementDate || '');
    setReplacementTime(cls.replacementTime || '');
    setIsModalOpen(true);
  };
  
  const handleStatusUpdate = () => {
    if (currentClass && status) {
      updateClassStatus(currentClass.id, status, replacementDate, replacementTime);
      setIsModalOpen(false);
      setCurrentClass(null);
      setAlert({ message: 'Class status updated!', type: 'success' });
    }
  };

  const classesForCourse = useMemo(() => {
    return appData.classes
      .filter(c => c.courseId === selectedCourse)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [appData.classes, selectedCourse]);

  const getStatusColor = (status: ClassSession['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'replaced':
      case 'brought_forward': return 'warning';
      default: return 'info';
    }
  };

  return (
    <>
      <Card title="Class Schedule Management">
        {alert && <Alert message={alert.message} type={alert.type} onDismiss={() => setAlert(null)} />}
        <Select
          label="Select Course"
          id="selectCourse"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Choose Course --</option>
          {appData.courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
        </Select>

        <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-4">Schedule New Class</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Class Date" id="date" type="date" value={formState.date} onChange={handleInputChange} />
            <Input label="Start Time" id="startTime" type="time" value={formState.startTime} onChange={handleInputChange} />
            <Input label="End Time" id="endTime" type="time" value={formState.endTime} onChange={handleInputChange} />
          </div>
          <Input label="Class Location/Room" id="location" type="text" placeholder="e.g., Room 101, Online" value={formState.location} onChange={handleInputChange} />
          <Button type="submit" disabled={!selectedCourse}>Add Class</Button>
        </form>

        <h3 className="text-lg font-semibold text-slate-800 mt-10 mb-4">Scheduled Classes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourse ? (
                classesForCourse.length > 0 ? (
                  classesForCourse.map(cls => {
                    const course = getCourseById(cls.courseId);
                    return (
                      <tr key={cls.id} className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium">{course?.code}</td>
                        <td className="px-6 py-4">{cls.date}</td>
                        <td className="px-6 py-4">{cls.startTime} - {cls.endTime}</td>
                        <td className="px-6 py-4">{cls.location}</td>
                        <td className="px-6 py-4"><Badge color={getStatusColor(cls.status)}>{cls.status}</Badge></td>
                        <td className="px-6 py-4 flex gap-2">
                          <Button size="sm" variant="primary" onClick={() => handleOpenModal(cls)}>Update</Button>
                          <Button size="sm" variant="danger" onClick={() => deleteClassSession(cls.id)}>Delete</Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={6} className="text-center p-6 text-slate-500">No classes scheduled for this course.</td></tr>
                )
              ) : (
                <tr><td colSpan={6} className="text-center p-6 text-slate-500">Select a course to view its schedule.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Class Status">
        <Select label="Class Status" id="statusSelect" value={status} onChange={e => setStatus(e.target.value as ClassSession['status'])}>
          <option value="">-- Select Status --</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="replaced">To be Replaced</option>
          <option value="brought_forward">Brought Forward</option>
        </Select>
        {(status === 'replaced' || status === 'brought_forward') && (
          <div className='mt-4 space-y-4'>
             <Input label="Replacement Date" id="replacementDate" type="date" value={replacementDate} onChange={(e) => setReplacementDate(e.target.value)} />
             <Input label="Replacement Time" id="replacementTime" type="time" value={replacementTime} onChange={(e) => setReplacementTime(e.target.value)} />
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleStatusUpdate}>Save Status</Button>
        </div>
      </Modal>
    </>
  );
};

export default ClassScheduleTab;
