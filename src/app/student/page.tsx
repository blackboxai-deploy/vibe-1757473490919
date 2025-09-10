'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import { useAttendance } from '@/hooks/useAttendance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database } from '@/lib/database';

export default function StudentDashboard() {
  const { user, logout, isLoading } = useAuth();
  const { students } = useStudents();
  const { getStudentAttendanceHistory, getWeeklyAttendance, getMonthlyAttendance, isStudentClockedIn } = useAttendance();
  const [student, setStudent] = useState<any>(null);
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'student')) {
      window.location.href = '/';
    }

    if (user) {
      const studentData = students.find(s => s.userId === user.id);
      setStudent(studentData);

      // Load grades
      const allGrades = Database.getGrades();
      const studentGrades = allGrades.filter(g => g.studentId === studentData?.id);
      setGrades(studentGrades);
    }
  }, [user, isLoading, students]);

  if (isLoading || !user || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const attendanceHistory = getStudentAttendanceHistory(student.id);
  const weeklyHours = getWeeklyAttendance(student.id);
  const monthlyHours = getMonthlyAttendance(student.id);
  const isClockedIn = isStudentClockedIn(student.id);
  const progressPercentage = (student.hoursCompleted / student.totalHoursRequired) * 100;

  const averageGrade = grades.length > 0 
    ? grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / grades.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {student.firstName[0]}{student.lastName[0]}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
                <p className="text-sm text-gray-600">{student.firstName} {student.lastName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isClockedIn && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  Currently On Campus
                </Badge>
              )}
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/kiosk'}
                className="border-purple-200 hover:bg-purple-50"
              >
                Clock In/Out
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
            Welcome back, {student.firstName}!
          </h2>
          <p className="text-gray-600">
            Track your progress in the {student.program} program
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Hours Completed
              </CardTitle>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⏱️</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {student.hoursCompleted}
              </div>
              <p className="text-xs text-gray-500">
                of {student.totalHoursRequired} required
              </p>
              <Progress value={progressPercentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Current GPA
              </CardTitle>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📊</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {student.gpa.toFixed(2)}
              </div>
              <p className="text-xs text-gray-500">
                Grade Point Average
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                This Week
              </CardTitle>
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📅</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {weeklyHours.toFixed(1)}h
              </div>
              <p className="text-xs text-gray-500">
                Hours this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Enrollment Status
              </CardTitle>
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✅</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-pink-600 capitalize">
                {student.status}
              </div>
              <p className="text-xs text-gray-500">
                Student status
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Overview */}
          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader>
              <CardTitle>Program Progress</CardTitle>
              <CardDescription>
                Your journey toward graduation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Hours Completed</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <p className="text-xs text-gray-500 mt-1">
                  {student.hoursCompleted} of {student.totalHoursRequired} hours
                </p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>This Month</span>
                    <span className="font-medium">{monthlyHours.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>This Week</span>
                    <span className="font-medium">{weeklyHours.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Grade</span>
                    <span className="font-medium">{averageGrade.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  onClick={() => window.location.href = '/student/profile'}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  View Full Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Attendance */}
          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>
                Your last 5 campus visits
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No attendance records found
                </p>
              ) : (
                <div className="space-y-3">
                  {attendanceHistory.slice(0, 5).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(record.clockIn).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.clockIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          {record.clockOut && (
                            <> - {new Date(record.clockOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        {record.clockOut ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {record.hoursWorked.toFixed(2)}h
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-500">
                            In Progress
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Access your student tools and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => window.location.href = '/student/grades'}
                  className="h-auto py-4 bg-blue-600 hover:bg-blue-700 flex flex-col items-center space-y-2"
                >
                  <span className="text-2xl">📋</span>
                  <span>View Grades</span>
                </Button>
                <Button 
                  onClick={() => window.location.href = '/student/attendance'}
                  className="h-auto py-4 bg-green-600 hover:bg-green-700 flex flex-col items-center space-y-2"
                >
                  <span className="text-2xl">📊</span>
                  <span>Attendance History</span>
                </Button>
                <Button 
                  onClick={() => window.location.href = '/kiosk'}
                  className="h-auto py-4 bg-purple-600 hover:bg-purple-700 flex flex-col items-center space-y-2"
                >
                  <span className="text-2xl">⏰</span>
                  <span>Clock In/Out</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}