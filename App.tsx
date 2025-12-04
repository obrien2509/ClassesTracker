
import React, { useState } from 'react';
import Header from './components/Header';
import DashboardTab from './components/tabs/DashboardTab';
import SemesterTab from './components/tabs/SemesterTab';
import CourseTab from './components/tabs/CourseTab';
import ClassScheduleTab from './components/tabs/ClassScheduleTab';
import StudentTab from './components/tabs/StudentTab';
import AttendanceTab from './components/tabs/AttendanceTab';
import CalendarTab from './components/tabs/CalendarTab';
import ReportsTab from './components/tabs/ReportsTab';

type Tab = 'dashboard' | 'semester' | 'courses' | 'classes' | 'students' | 'attendance' | 'calendar' | 'reports';

const TABS: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'semester', label: 'Semester Setup' },
  { id: 'courses', label: 'Course Management' },
  { id: 'classes', label: 'Class Schedule' },
  { id: 'students', label: 'Student Upload' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'calendar', label: 'Calendar View' },
  { id: 'reports', label: 'Reports' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab setActiveTab={setActiveTab} />;
      case 'semester': return <SemesterTab />;
      case 'courses': return <CourseTab />;
      case 'classes': return <ClassScheduleTab />;
      case 'students': return <StudentTab />;
      case 'attendance': return <AttendanceTab />;
      case 'calendar': return <CalendarTab />;
      case 'reports': return <ReportsTab />;
      default: return <DashboardTab setActiveTab={setActiveTab}/>;
    }
  };

  return (
    <div className="container mx-auto max-w-7xl p-2 sm:p-5">
      <Header />
      <nav className="flex flex-col sm:flex-row flex-wrap gap-2 mb-8 border-b-2 border-gray-300">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-5 border-b-4 font-medium transition-all duration-300 text-sm sm:text-base ${
              activeTab === tab.id
                ? 'border-cyan-700 text-cyan-700 bg-gray-100'
                : 'border-transparent text-slate-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main>
        {renderTabContent()}
      </main>
    </div>
  );
};

export default App;
