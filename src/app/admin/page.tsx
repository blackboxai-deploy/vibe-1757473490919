'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import { useAttendance } from '@/hooks/useAttendance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { user, logout, isLoading } = useAuth();
  const { students, getStudentStats } = useStudents();
  const { getAttendanceStats, activeClockIns } = useAttendance();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      window.location.href = '/';
    }
  }, [user, isLoading]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const studentStats = getStudentStats();
  const attendanceStats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Beauty Academy Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
              </span>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/kiosk'}
                className="border-purple-200 hover:bg-purple-50"
              >
                Kiosk View
              </Button>
              <Button 
                variant="outline" 
                onClick={logout}
                className="border-red-200 hover:bg-red-50 text-red-600"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}
          </h2>
          <p className="text-gray-600">
            Here's what's happening at Beauty Academy today
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Students
              </CardTitle>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">👥</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {studentStats.totalStudents}
              </div>
              <p className="text-xs text-gray-500">
                {studentStats.activeStudents} active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                On Campus Now
              </CardTitle>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🏫</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {attendanceStats.currentlyOnCampus}
              </div>
              <p className="text-xs text-gray-500">
                Students present
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Hours Today
              </CardTitle>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⏰</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {attendanceStats.studentsToday}
              </div>
              <p className="text-xs text-gray-500">
                Students attended
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Graduation Rate
              </CardTitle>
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🎓</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">
                95%
              </div>
              <p className="text-xs text-gray-500">
                Success rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => window.location.href = '/admin/students'}
                className="w-full justify-start bg-blue-600 hover:bg-blue-700"
              >
                <span className="mr-2">👥</span>
                Manage Students
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/enrollment'}
                className="w-full justify-start bg-green-600 hover:bg-green-700"
              >
                <span className="mr-2">📝</span>
                New Enrollment
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/attendance'}
                className="w-full justify-start bg-purple-600 hover:bg-purple-700"
              >
                <span className="mr-2">📊</span>
                Attendance Reports
              </Button>
              <Button 
                onClick={() => window.location.href = '/admin/grades'}
                className="w-full justify-start bg-pink-600 hover:bg-pink-700"
              >
                <span className="mr-2">📋</span>
                Grade Management
              </Button>
            </CardContent>
          </Card>

          {/* Currently On Campus */}
          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader>
              <CardTitle>Currently On Campus</CardTitle>
              <CardDescription>
                Students who are clocked in right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeClockIns.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No students currently on campus
                </p>
              ) : (
                <div className="space-y-3">
                  {activeClockIns.slice(0, 5).map((record) => {
                    const student = students.find(s => s.id === record.studentId);
                    if (!student) return null;
                    
                    const clockInTime = new Date(record.clockIn);
                    const duration = Math.floor((currentTime.getTime() - clockInTime.getTime()) / (1000 * 60));
                    
                    return (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{student.program}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {Math.floor(duration / 60)}h {duration % 60}m
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Since {clockInTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {activeClockIns.length > 5 && (
                    <p className="text-center text-gray-500 text-sm">
                      +{activeClockIns.length - 5} more students
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur border-purple-200">
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>
              Key metrics and system health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {studentStats.averageGPA}
                </div>
                <p className="text-sm text-gray-600">Average GPA</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {studentStats.averageHoursCompleted}
                </div>
                <p className="text-sm text-gray-600">Avg Hours Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {attendanceStats.totalHoursLogged.toFixed(0)}
                </div>
                <p className="text-sm text-gray-600">Total Hours Logged</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}