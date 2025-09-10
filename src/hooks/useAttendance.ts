'use client';

import { useState, useEffect } from 'react';
import { AttendanceRecord } from '@/lib/types';
import { Database } from '@/lib/database';

export function useAttendance() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [activeClockIns, setActiveClockIns] = useState<Map<string, AttendanceRecord>>(new Map());

  useEffect(() => {
    loadAttendanceRecords();
  }, []);

  const loadAttendanceRecords = () => {
    const records = Database.getAttendanceRecords();
    setAttendanceRecords(records);
    
    // Find active clock-ins (no clock-out time)
    const active = new Map<string, AttendanceRecord>();
    records.forEach(record => {
      if (!record.clockOut) {
        active.set(record.studentId, record);
      }
    });
    setActiveClockIns(active);
  };

  const clockIn = (studentId: string, location: 'main-campus' | 'lab-1' | 'lab-2' = 'main-campus') => {
    // Check if student is already clocked in
    if (activeClockIns.has(studentId)) {
      throw new Error('Student is already clocked in');
    }

    const newRecord: AttendanceRecord = {
      id: `attendance-${Date.now()}`,
      studentId,
      clockIn: new Date(),
      hoursWorked: 0,
      location,
      approved: true
    };

    const updatedRecords = [...attendanceRecords, newRecord];
    Database.saveAttendanceRecords(updatedRecords);
    setAttendanceRecords(updatedRecords);
    
    const newActiveClockIns = new Map(activeClockIns);
    newActiveClockIns.set(studentId, newRecord);
    setActiveClockIns(newActiveClockIns);

    return newRecord;
  };

  const clockOut = (studentId: string) => {
    const activeRecord = activeClockIns.get(studentId);
    if (!activeRecord) {
      throw new Error('Student is not currently clocked in');
    }

    const clockOutTime = new Date();
    const hoursWorked = (clockOutTime.getTime() - activeRecord.clockIn.getTime()) / (1000 * 60 * 60);

    const updatedRecord: AttendanceRecord = {
      ...activeRecord,
      clockOut: clockOutTime,
      hoursWorked: Math.round(hoursWorked * 100) / 100 // Round to 2 decimals
    };

    const updatedRecords = attendanceRecords.map(record =>
      record.id === activeRecord.id ? updatedRecord : record
    );

    Database.saveAttendanceRecords(updatedRecords);
    setAttendanceRecords(updatedRecords);

    // Update student's total hours
    const students = Database.getStudents();
    const updatedStudents = students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          hoursCompleted: student.hoursCompleted + updatedRecord.hoursWorked
        };
      }
      return student;
    });
    Database.saveStudents(updatedStudents);

    const newActiveClockIns = new Map(activeClockIns);
    newActiveClockIns.delete(studentId);
    setActiveClockIns(newActiveClockIns);

    return updatedRecord;
  };

  const isStudentClockedIn = (studentId: string): boolean => {
    return activeClockIns.has(studentId);
  };

  const getActiveClockIn = (studentId: string): AttendanceRecord | undefined => {
    return activeClockIns.get(studentId);
  };

  const getStudentAttendanceHistory = (studentId: string): AttendanceRecord[] => {
    return attendanceRecords
      .filter(record => record.studentId === studentId)
      .sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime());
  };

  const getTodayAttendance = (): AttendanceRecord[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return attendanceRecords.filter(record => {
      const clockInDate = new Date(record.clockIn);
      return clockInDate >= today && clockInDate < tomorrow;
    });
  };

  const getWeeklyAttendance = (studentId: string): number => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return attendanceRecords
      .filter(record => 
        record.studentId === studentId &&
        new Date(record.clockIn) >= oneWeekAgo &&
        record.clockOut // Only count completed sessions
      )
      .reduce((total, record) => total + record.hoursWorked, 0);
  };

  const getMonthlyAttendance = (studentId: string): number => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return attendanceRecords
      .filter(record => 
        record.studentId === studentId &&
        new Date(record.clockIn) >= oneMonthAgo &&
        record.clockOut // Only count completed sessions
      )
      .reduce((total, record) => total + record.hoursWorked, 0);
  };

  const getAttendanceStats = () => {
    const totalHoursLogged = attendanceRecords
      .filter(record => record.clockOut)
      .reduce((sum, record) => sum + record.hoursWorked, 0);

    const todayRecords = getTodayAttendance();
    const studentsToday = new Set(todayRecords.map(r => r.studentId)).size;
    
    const averageSessionTime = attendanceRecords
      .filter(record => record.clockOut)
      .reduce((sum, record) => sum + record.hoursWorked, 0) / 
      attendanceRecords.filter(record => record.clockOut).length || 0;

    return {
      totalHoursLogged: Math.round(totalHoursLogged * 100) / 100,
      studentsToday,
      currentlyOnCampus: activeClockIns.size,
      averageSessionTime: Math.round(averageSessionTime * 100) / 100
    };
  };

  return {
    attendanceRecords,
    activeClockIns: Array.from(activeClockIns.values()),
    clockIn,
    clockOut,
    isStudentClockedIn,
    getActiveClockIn,
    getStudentAttendanceHistory,
    getTodayAttendance,
    getWeeklyAttendance,
    getMonthlyAttendance,
    getAttendanceStats,
    refreshAttendance: loadAttendanceRecords
  };
}