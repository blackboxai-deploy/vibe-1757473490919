'use client';

import { useState, useEffect } from 'react';
import { Student, StudentFilters } from '@/lib/types';
import { Database } from '@/lib/database';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [filters, setFilters] = useState<StudentFilters>({
    status: 'all',
    program: 'all',
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, filters]);

  const loadStudents = () => {
    const loadedStudents = Database.getStudents();
    setStudents(loadedStudents);
  };

  const addStudent = (studentData: Omit<Student, 'id' | 'hoursCompleted' | 'gpa'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `student-${Date.now()}`,
      hoursCompleted: 0,
      gpa: 0
    };

    const updatedStudents = [...students, newStudent];
    Database.saveStudents(updatedStudents);
    setStudents(updatedStudents);
    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    const updatedStudents = students.map(student =>
      student.id === id ? { ...student, ...updates } : student
    );
    Database.saveStudents(updatedStudents);
    setStudents(updatedStudents);
  };

  const deleteStudent = (id: string) => {
    const updatedStudents = students.filter(student => student.id !== id);
    Database.saveStudents(updatedStudents);
    setStudents(updatedStudents);
  };

  const getStudentById = (id: string): Student | undefined => {
    return students.find(student => student.id === id);
  };

  const applyFilters = () => {
    let filtered = [...students];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(student => student.status === filters.status);
    }

    // Filter by program
    if (filters.program !== 'all') {
      filtered = filtered.filter(student => student.program === filters.program);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.email.toLowerCase().includes(searchLower)
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'enrollmentDate':
          aValue = new Date(a.enrollmentDate);
          bValue = new Date(b.enrollmentDate);
          break;
        case 'gpa':
          aValue = a.gpa;
          bValue = b.gpa;
          break;
        case 'hoursCompleted':
          aValue = a.hoursCompleted;
          bValue = b.hoursCompleted;
          break;
        default:
          aValue = a.firstName;
          bValue = b.firstName;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredStudents(filtered);
  };

  const updateFilters = (newFilters: Partial<StudentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getStudentStats = () => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const graduatedStudents = students.filter(s => s.status === 'graduated').length;
    const averageGPA = students.reduce((sum, s) => sum + s.gpa, 0) / students.length || 0;
    const averageHoursCompleted = students.reduce((sum, s) => sum + s.hoursCompleted, 0) / students.length || 0;

    return {
      totalStudents,
      activeStudents,
      graduatedStudents,
      averageGPA: Number(averageGPA.toFixed(2)),
      averageHoursCompleted: Number(averageHoursCompleted.toFixed(0))
    };
  };

  return {
    students: filteredStudents,
    allStudents: students,
    filters,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    updateFilters,
    getStudentStats,
    refreshStudents: loadStudents
  };
}