import React, { useState, useMemo } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { Student } from '../../types';
import Card from '../ui/Card';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Input from '../ui/Input';

const StudentTab: React.FC = () => {
  const { appData, addStudents, deleteStudent } = useAppData();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [csvData, setCsvData] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const hasStudentsInCourse = useMemo(() => {
    return appData.students.some(s => s.courseId === selectedCourse);
  }, [appData.students, selectedCourse]);

  const studentsForCourse = useMemo(() => {
    const students = appData.students.filter(s => s.courseId === selectedCourse);

    if (!searchQuery.trim()) {
      return students;
    }

    const lowercasedQuery = searchQuery.toLowerCase().trim();
    return students.filter(student =>
      student.name.toLowerCase().includes(lowercasedQuery) ||
      student.indexNumber.toLowerCase().includes(lowercasedQuery)
    );
  }, [appData.students, selectedCourse, searchQuery]);

  const parseAndAddStudents = (data: string) => {
    if (!selectedCourse) {
      setAlert({ message: 'Please select a course first', type: 'error' });
      return;
    }
    const lines = data.trim().split('\n').slice(1); // skip header
    const newStudents: Omit<Student, 'id'>[] = [];

    lines.forEach(line => {
      const [name, indexNumber, email, phone] = line.split(',').map(s => s.trim());
      if (name && indexNumber) {
        newStudents.push({
          courseId: selectedCourse,
          name,
          indexNumber,
          email: email || '',
          phone: phone || '',
        });
      }
    });

    if (newStudents.length > 0) {
      addStudents(newStudents);
      setAlert({ message: `${newStudents.length} students parsed successfully! Existing students were ignored.`, type: 'success' });
      setCsvData('');
    } else {
      setAlert({ message: 'No new students found in the data.', type: 'warning' });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      setAlert({ message: 'Please select a file', type: 'error' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseAndAddStudents(text);
    };
    reader.readAsText(file);
    setFile(null);
    const fileInput = document.getElementById('studentFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const handlePasteParse = () => {
    if (!csvData.trim()) {
      setAlert({ message: 'Please paste CSV data', type: 'error' });
      return;
    }
    parseAndAddStudents(csvData);
  };


  return (
    <Card title="Student Information Upload">
      {alert && <Alert message={alert.message} type={alert.type} onDismiss={() => setAlert(null)} />}
      <Alert message="Upload a CSV file containing student information. The file should have columns: Name, Index Number, Email (optional), Phone (optional)" type="info" />

      <Select
        label="Select Course"
        id="courseForStudents"
        value={selectedCourse}
        onChange={(e) => {
            setSelectedCourse(e.target.value)
            setSearchQuery('');
        }}
      >
        <option value="">-- Choose Course --</option>
        {appData.courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
      </Select>

      <div className="mb-5">
        <label htmlFor="studentFile" className="block mb-2 font-semibold text-slate-700 text-sm">Upload File (CSV)</label>
        <input type="file" id="studentFile" accept=".csv" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" />
      </div>

      <div className="mb-5">
        <label htmlFor="csvData" className="block mb-2 font-semibold text-slate-700 text-sm">Or Paste CSV Data</label>
        <textarea id="csvData" value={csvData} onChange={(e) => setCsvData(e.target.value)} placeholder="Paste CSV data here (Name,IndexNumber,Email,Phone)&#10;John Doe,STU001,john@example.com,012-3456789" rows={6} className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"></textarea>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleFileUpload} disabled={!selectedCourse || !file}>Upload from File</Button>
        <Button onClick={handlePasteParse} variant="secondary" disabled={!selectedCourse || !csvData}>Parse Pasted Data</Button>
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mt-10 mb-4">Students in Selected Course</h3>
      
      <div className="mb-4">
        <Input
          label="Search Students"
          id="studentSearch"
          type="text"
          placeholder="Filter by name or index number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={!hasStudentsInCourse}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Index Number</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedCourse ? (
              studentsForCourse.length > 0 ? (
                studentsForCourse.map(student => (
                  <tr key={student.id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{student.name}</td>
                    <td className="px-6 py-4">{student.indexNumber}</td>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4">{student.phone}</td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="danger" onClick={() => deleteStudent(student.id)}>Delete</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="text-center p-6 text-slate-500">{hasStudentsInCourse ? 'No students match your search.' : 'No students in this course.'}</td></tr>
              )
            ) : (
              <tr><td colSpan={5} className="text-center p-6 text-slate-500">Select a course to view students.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default StudentTab;