
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppData, Semester, Course, ClassSession, Student, AttendanceRecord, ClassStatus, AttendanceStatus } from '../types';

interface DataContextProps {
  appData: AppData;
  saveSemester: (semester: Omit<Semester, 'id'>) => void;
  deleteSemester: (id: string) => void;
  saveCourse: (course: Omit<Course, 'id'>) => void;
  deleteCourse: (id: string) => void;
  saveClassSession: (classSession: Omit<ClassSession, 'id'|'status'>) => void;
  updateClassStatus: (id: string, status: ClassStatus, replacementDate?: string, replacementTime?: string) => void;
  deleteClassSession: (id: string) => void;
  addStudents: (students: Omit<Student, 'id'>[]) => void;
  deleteStudent: (id: string) => void;
  saveAttendance: (records: {studentId: string; status: AttendanceStatus; note: string}[], classId: string) => void;
  getCourseById: (id: string) => Course | undefined;
  getSemesterById: (id: string) => Semester | undefined;
}

export const DataContext = createContext<DataContextProps | undefined>(undefined);

const initialData: AppData = {
  semesters: [],
  courses: [],
  classes: [],
  students: [],
  attendance: [],
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appData, setAppData] = useState<AppData>(initialData);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('classTrackerData');
      if (savedData) {
        setAppData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const saveData = useCallback((data: AppData) => {
    try {
      localStorage.setItem('classTrackerData', JSON.stringify(data));
      setAppData(data);
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, []);

  const saveSemester = (semester: Omit<Semester, 'id'>) => {
    const newSemester = { ...semester, id: `sem_${Date.now()}` };
    saveData({ ...appData, semesters: [...appData.semesters, newSemester] });
  };

  const deleteSemester = (id: string) => {
    const newCourses = appData.courses.filter(c => c.semesterId !== id);
    const newCourseIds = newCourses.map(c => c.id);
    const newClasses = appData.classes.filter(c => newCourseIds.includes(c.courseId));
    const newClassIds = newClasses.map(c => c.id);
    const newAttendance = appData.attendance.filter(a => newClassIds.includes(a.classId));

    saveData({
      semesters: appData.semesters.filter(s => s.id !== id),
      courses: newCourses,
      classes: newClasses,
      students: appData.students.filter(s => !newCourseIds.includes(s.courseId)),
      attendance: newAttendance,
    });
  };

  const saveCourse = (course: Omit<Course, 'id'>) => {
    const newCourse = { ...course, id: `course_${Date.now()}` };
    saveData({ ...appData, courses: [...appData.courses, newCourse] });
  };

  const deleteCourse = (id: string) => {
    const classesToDelete = appData.classes.filter(c => c.courseId === id).map(c => c.id);
    saveData({
      ...appData,
      courses: appData.courses.filter(c => c.id !== id),
      classes: appData.classes.filter(c => c.courseId !== id),
      students: appData.students.filter(s => s.courseId !== id),
      attendance: appData.attendance.filter(a => !classesToDelete.includes(a.classId)),
    });
  };

  const saveClassSession = (classSession: Omit<ClassSession, 'id' | 'status'>) => {
    const newClassSession: ClassSession = { ...classSession, id: `class_${Date.now()}`, status: 'scheduled' };
    saveData({ ...appData, classes: [...appData.classes, newClassSession] });
  };

  const updateClassStatus = (id: string, status: ClassStatus, replacementDate?: string, replacementTime?: string) => {
     const updatedClasses = appData.classes.map(c => 
        c.id === id ? { ...c, status, replacementDate, replacementTime } : c
      );
      saveData({ ...appData, classes: updatedClasses });
  };

  const deleteClassSession = (id: string) => {
    saveData({
      ...appData,
      classes: appData.classes.filter(c => c.id !== id),
      attendance: appData.attendance.filter(a => a.classId !== id),
    });
  };

  const addStudents = (students: Omit<Student, 'id'>[]) => {
    const newStudents = students
      .filter(s => !appData.students.some(es => es.indexNumber === s.indexNumber && es.courseId === s.courseId))
      .map(s => ({ ...s, id: `student_${Date.now()}_${Math.random()}` }));
    saveData({ ...appData, students: [...appData.students, ...newStudents] });
  };

  const deleteStudent = (id: string) => {
    saveData({
      ...appData,
      students: appData.students.filter(s => s.id !== id),
      attendance: appData.attendance.filter(a => a.studentId !== id),
    });
  };
  
  const saveAttendance = (records: {studentId: string; status: AttendanceStatus; note: string}[], classId: string) => {
    const otherAttendance = appData.attendance.filter(a => a.classId !== classId);
    const newAttendance: AttendanceRecord[] = records.map(r => ({
      id: `att_${Date.now()}_${r.studentId}`,
      classId: classId,
      studentId: r.studentId,
      status: r.status,
      note: r.note,
      date: new Date().toISOString().split('T')[0]
    }));
    saveData({ ...appData, attendance: [...otherAttendance, ...newAttendance] });
  };

  const getCourseById = (id: string) => appData.courses.find(c => c.id === id);
  const getSemesterById = (id: string) => appData.semesters.find(s => s.id === id);


  return (
    <DataContext.Provider value={{
      appData,
      saveSemester,
      deleteSemester,
      saveCourse,
      deleteCourse,
      saveClassSession,
      updateClassStatus,
      deleteClassSession,
      addStudents,
      deleteStudent,
      saveAttendance,
      getCourseById,
      getSemesterById,
    }}>
      {children}
    </DataContext.Provider>
  );
};
