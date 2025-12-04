
import React from 'react';
import { useAppData } from '../../hooks/useAppData';
import Card from '../ui/Card';
import StatCard from '../ui/StatCard';
import ProgressBar from '../ui/ProgressBar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { ClassSession } from '../../types';

interface DashboardTabProps {
  setActiveTab: (tab: any) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ setActiveTab }) => {
  const { appData, getCourseById } = useAppData();

  const totalCourses = appData.courses.length;
  const totalClasses = appData.classes.length;
  const completedClasses = appData.classes.filter(c => c.status === 'completed').length;
  const totalStudents = appData.students.length;

  const upcomingClasses = appData.classes
    .filter(c => new Date(c.date) >= new Date() && c.status !== 'completed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const getStatusColor = (status: ClassSession['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'replaced':
      case 'brought_forward': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div>
      <Card title="Dashboard Overview">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Courses" value={totalCourses} variant="primary" />
          <StatCard title="Total Classes" value={totalClasses} variant="success" />
          <StatCard title="Completed Classes" value={completedClasses} variant="warning" />
          <StatCard title="Total Students" value={totalStudents} variant="info" />
        </div>

        <h3 className="text-lg font-semibold text-slate-800 mt-8 mb-4">Current Semester Progress</h3>
        <div className="space-y-6">
          {appData.semesters.length > 0 ? (
            appData.semesters.map(sem => {
              const semesterCourses = appData.courses.filter(c => c.semesterId === sem.id);
              const semesterClasses = appData.classes.filter(c => semesterCourses.some(sc => sc.id === c.courseId));
              const semesterCompleted = semesterClasses.filter(c => c.status === 'completed').length;
              const percent = semesterClasses.length > 0 ? Math.round((semesterCompleted / semesterClasses.length) * 100) : 0;

              return (
                <div key={sem.id}>
                  <strong className="text-slate-700">{sem.name}</strong>
                  <ProgressBar value={percent} />
                  <small className="text-slate-500">{semesterCompleted} / {semesterClasses.length} classes completed</small>
                </div>
              );
            })
          ) : (
            <p className="text-center text-slate-500 p-4">No semesters configured yet. <Button size="sm" onClick={() => setActiveTab('semester')}>Set up a Semester</Button></p>
          )}
        </div>

        <h3 className="text-lg font-semibold text-slate-800 mt-10 mb-4">Upcoming Classes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map(cls => {
                  const course = getCourseById(cls.courseId);
                  return (
                    <tr key={cls.id} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium">{course?.code || 'N/A'}</td>
                      <td className="px-6 py-4">{cls.date}</td>
                      <td className="px-6 py-4">{cls.startTime}</td>
                      <td className="px-6 py-4"><Badge color={getStatusColor(cls.status)}>{cls.status}</Badge></td>
                      <td className="px-6 py-4">
                         <Button size="sm" onClick={() => setActiveTab('classes')}>View Schedule</Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-slate-500">No upcoming classes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardTab;
