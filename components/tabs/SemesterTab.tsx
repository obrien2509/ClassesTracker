
import React, { useState } from 'react';
import { useAppData } from '../../hooks/useAppData';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Badge from '../ui/Badge';

const SEMESTER_TYPES = ['Jan - May', 'June - July', 'August - December'];

const SemesterTab: React.FC = () => {
  const { appData, saveSemester, deleteSemester } = useAppData();
  const [name, setName] = useState('');
  const [type, setType] = useState(SEMESTER_TYPES[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      setAlert({ message: 'Please fill all fields', type: 'error' });
      return;
    }
    saveSemester({ name, type, startDate, endDate });
    setName('');
    setStartDate('');
    setEndDate('');
    setAlert({ message: 'Semester saved successfully!', type: 'success' });
  };

  return (
    <div>
      <Card title="Semester Setup">
        {alert && <Alert message={alert.message} type={alert.type} onDismiss={() => setAlert(null)} />}
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 font-semibold text-slate-700 text-sm">Select Semester</label>
            <div className="flex flex-wrap gap-2">
              {SEMESTER_TYPES.map(semType => (
                <button
                  key={semType}
                  type="button"
                  onClick={() => setType(semType)}
                  className={`py-2 px-4 rounded-md font-semibold text-sm transition-colors ${
                    type === semType
                      ? 'bg-cyan-700 text-white'
                      : 'bg-white text-slate-700 border-2 border-gray-300 hover:border-cyan-700 hover:text-cyan-700'
                  }`}
                >
                  {semType}
                </button>
              ))}
            </div>
          </div>

          <Input label="Semester Name" id="semesterName" type="text" placeholder="e.g., Spring 2025 Semester" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Start Date" id="semesterStart" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input label="End Date" id="semesterEnd" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <Button type="submit">Save Semester</Button>
        </form>

        <h3 className="text-lg font-semibold text-slate-800 mt-10 mb-4">Configured Semesters</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th className="px-6 py-3">Semester</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Start Date</th>
                <th className="px-6 py-3">End Date</th>
                <th className="px-6 py-3">Courses</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {appData.semesters.length > 0 ? (
                appData.semesters.map(sem => {
                  const courseCount = appData.courses.filter(c => c.semesterId === sem.id).length;
                  return (
                    <tr key={sem.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{sem.type}</td>
                      <td className="px-6 py-4">{sem.name}</td>
                      <td className="px-6 py-4">{sem.startDate}</td>
                      <td className="px-6 py-4">{sem.endDate}</td>
                      <td className="px-6 py-4"><Badge color="info">{courseCount} Courses</Badge></td>
                      <td className="px-6 py-4">
                        <Button size="sm" variant="danger" onClick={() => deleteSemester(sem.id)}>Delete</Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-slate-500">No semesters configured.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default SemesterTab;
