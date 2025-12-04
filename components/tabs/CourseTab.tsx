
import React, { useState, useMemo } from 'react';
import { useAppData } from '../../hooks/useAppData';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Badge from '../ui/Badge';

const CourseTab: React.FC = () => {
  const { appData, saveCourse, deleteCourse } = useAppData();
  const [selectedSemester, setSelectedSemester] = useState('');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const initialFormState = {
    code: '',
    name: '',
    creditHours: '',
    classesPerWeek: '',
    instructor: '',
  };
  const [formState, setFormState] = useState(initialFormState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSemester) {
      setAlert({ message: 'Please select a semester', type: 'error' });
      return;
    }
    if (Object.values(formState).some(val => val === '')) {
      setAlert({ message: 'Please fill all fields', type: 'error' });
      return;
    }
    saveCourse({
      semesterId: selectedSemester,
      code: formState.code,
      name: formState.name,
      creditHours: parseInt(formState.creditHours, 10),
      classesPerWeek: parseInt(formState.classesPerWeek, 10),
      instructor: formState.instructor,
    });
    setFormState(initialFormState);
    setAlert({ message: 'Course added successfully!', type: 'success' });
  };

  const coursesForSemester = useMemo(() => {
    return appData.courses.filter(c => c.semesterId === selectedSemester);
  }, [appData.courses, selectedSemester]);

  return (
    <Card title="Course Management">
      {alert && <Alert message={alert.message} type={alert.type} onDismiss={() => setAlert(null)} />}
      <Select
        label="Select Semester"
        id="courseSemester"
        value={selectedSemester}
        onChange={(e) => setSelectedSemester(e.target.value)}
      >
        <option value="">-- Choose Semester --</option>
        {appData.semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </Select>

      <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-4">Add New Course</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Course Code" id="code" type="text" placeholder="e.g., ENG101" value={formState.code} onChange={handleInputChange} />
          <Input label="Course Name" id="name" type="text" placeholder="e.g., English Communication" value={formState.name} onChange={handleInputChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Credit Hours" id="creditHours" type="number" min="1" placeholder="e.g., 3" value={formState.creditHours} onChange={handleInputChange} />
          <Input label="Classes per Week" id="classesPerWeek" type="number" min="1" max="5" placeholder="e.g., 2" value={formState.classesPerWeek} onChange={handleInputChange} />
        </div>
        <Input label="Instructor Name" id="instructor" type="text" placeholder="Your name" value={formState.instructor} onChange={handleInputChange} />
        <Button type="submit" disabled={!selectedSemester}>Add Course</Button>
      </form>

      <h3 className="text-lg font-semibold text-slate-800 mt-10 mb-4">Courses in Selected Semester</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Credits</th>
              <th className="px-6 py-3">Classes/Week</th>
              <th className="px-6 py-3">Total Classes</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedSemester ? (
              coursesForSemester.length > 0 ? (
                coursesForSemester.map(course => {
                  const classCount = appData.classes.filter(c => c.courseId === course.id).length;
                  return (
                    <tr key={course.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{course.code}</td>
                      <td className="px-6 py-4">{course.name}</td>
                      <td className="px-6 py-4">{course.creditHours}</td>
                      <td className="px-6 py-4">{course.classesPerWeek}</td>
                      <td className="px-6 py-4"><Badge color="info">{classCount} Classes</Badge></td>
                      <td className="px-6 py-4">
                        <Button size="sm" variant="danger" onClick={() => deleteCourse(course.id)}>Delete</Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={6} className="text-center p-6 text-slate-500">No courses in this semester.</td></tr>
              )
            ) : (
              <tr><td colSpan={6} className="text-center p-6 text-slate-500">Select a semester to view courses.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CourseTab;
