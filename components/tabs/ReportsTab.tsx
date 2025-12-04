
import React, { useState, useMemo } from 'react';
import { useAppData } from '../../hooks/useAppData';
import Card from '../ui/Card';
import Select from '../ui/Select';
import Button from '../ui/Button';
import StatCard from '../ui/StatCard';
import Badge from '../ui/Badge';

const ReportsTab: React.FC = () => {
  const { appData } = useAppData();
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const coursesInSemester = useMemo(() => {
    return appData.courses.filter(c => c.semesterId === selectedSemester);
  }, [appData.courses, selectedSemester]);
  
  const reportData = useMemo(() => {
    if (!selectedCourse) return null;
    
    const course = appData.courses.find(c => c.id === selectedCourse);
    const students = appData.students.filter(s => s.courseId === selectedCourse);
    const classes = appData.classes.filter(c => c.courseId === selectedCourse);

    const studentReports = students.map(student => {
      const studentAttendance = appData.attendance.filter(a => a.studentId === student.id && classes.some(c => c.id === a.classId));
      const present = studentAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
      const total = classes.length;
      const rate = total > 0 ? Math.round((present / total) * 100) : 0;
      let status: 'Good' | 'Average' | 'Poor' = 'Poor';
      if (rate >= 80) status = 'Good';
      else if (rate >= 60) status = 'Average';
      
      return { ...student, present, total, rate, status };
    });

    const courseSummary = {
      total: classes.length,
      completed: classes.filter(c => c.status === 'completed').length,
      replaced: classes.filter(c => c.status === 'replaced').length,
      broughtForward: classes.filter(c => c.status === 'brought_forward').length,
    };
    
    return { course, studentReports, courseSummary };
  }, [selectedCourse, appData]);

  const getStatusBadgeColor = (status: 'Good' | 'Average' | 'Poor') => {
    if (status === 'Good') return 'success';
    if (status === 'Average') return 'warning';
    return 'danger';
  };

  const exportToCSV = () => {
    if (!reportData || !reportData.course) return;

    let csv = `Course Report: ${reportData.course.code} - ${reportData.course.name}\n`;
    csv += `Student Name,Index Number,Total Classes,Present,Attendance Rate (%),Status\n`;

    reportData.studentReports.forEach(student => {
      csv += `${student.name},${student.indexNumber},${student.total},${student.present},${student.rate},${student.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8,' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${reportData.course.code}_attendance_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <Card title="Reports & Analytics">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Select
          label="Select Semester"
          id="reportSemester"
          value={selectedSemester}
          onChange={(e) => { setSelectedSemester(e.target.value); setSelectedCourse(''); }}
        >
          <option value="">-- Choose Semester --</option>
          {appData.semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </Select>
        <Select
          label="Select Course"
          id="reportCourse"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          disabled={!selectedSemester}
        >
          <option value="">-- Choose Course --</option>
          {coursesInSemester.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
        </Select>
      </div>

      {reportData ? (
        <>
        <div className="flex gap-2 my-4">
            <Button onClick={exportToCSV}>Export to CSV</Button>
            <Button variant='secondary' onClick={() => window.print()}>Print Report</Button>
        </div>
        
          <h3 className="text-lg font-semibold text-slate-800 mt-8 mb-4">Course Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Classes" value={reportData.courseSummary.total} variant="primary" />
            <StatCard title="Completed" value={reportData.courseSummary.completed} variant="success" />
            <StatCard title="To be Replaced" value={reportData.courseSummary.replaced} variant="warning" />
            <StatCard title="Brought Forward" value={reportData.courseSummary.broughtForward} variant="info" />
          </div>

          <h3 className="text-lg font-semibold text-slate-800 mt-10 mb-4">Student Attendance Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                <tr>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Index Number</th>
                  <th className="px-6 py-3">Present</th>
                  <th className="px-6 py-3">Total Classes</th>
                  <th className="px-6 py-3">Attendance %</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.studentReports.map(student => (
                  <tr key={student.id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{student.name}</td>
                    <td className="px-6 py-4">{student.indexNumber}</td>
                    <td className="px-6 py-4">{student.present}</td>
                    <td className="px-6 py-4">{student.total}</td>
                    <td className="px-6 py-4 font-bold">{student.rate}%</td>
                    <td className="px-6 py-4"><Badge color={getStatusBadgeColor(student.status)}>{student.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-center p-6 text-slate-500 bg-slate-50 rounded-md">
          Select a semester and course to generate a report.
        </p>
      )}
    </Card>
  );
};

export default ReportsTab;
