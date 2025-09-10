'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PROGRAMS } from '@/lib/database';

export default function StudentsManagementPage() {
  const { user, isLoading } = useAuth();
  const { students, updateFilters, filters } = useStudents();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      window.location.href = '/';
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'graduated': return 'bg-blue-100 text-blue-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/admin'}
                className="border-purple-200 hover:bg-purple-50"
              >
                ← Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student Management</h1>
                <p className="text-sm text-gray-600">View and manage all students</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/admin/enrollment'}
              className="bg-purple-600 hover:bg-purple-700"
            >
              + New Student
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur border-purple-200 mb-8">
          <CardHeader>
            <CardTitle>Filter Students</CardTitle>
            <CardDescription>
              Search and filter the student database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="Search by name..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <Select value={filters.status} onValueChange={(value) => updateFilters({ status: value })}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filters.program} onValueChange={(value) => updateFilters({ program: value })}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="All Programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Programs</SelectItem>
                    {PROGRAMS.map(program => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filters.sortBy} onValueChange={(value: any) => updateFilters({ sortBy: value })}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="enrollmentDate">Enrollment Date</SelectItem>
                    <SelectItem value="gpa">GPA</SelectItem>
                    <SelectItem value="hoursCompleted">Hours Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student.id} className="bg-white/80 backdrop-blur border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(student.status)}>
                    {student.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Program</span>
                    <span className="font-medium">{student.program}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">GPA</span>
                    <span className="font-medium">{student.gpa.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Hours Progress</span>
                    <span className="font-medium">
                      {student.hoursCompleted}/{student.totalHoursRequired}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(student.hoursCompleted / student.totalHoursRequired) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-xs text-gray-500 mb-2">
                    Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Phone: {student.phone || 'Not provided'}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-purple-200 hover:bg-purple-50 text-xs"
                  >
                    View Profile
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-green-200 hover:bg-green-50 text-xs"
                  >
                    Edit Grades
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {students.length === 0 && (
          <Card className="bg-white/80 backdrop-blur border-purple-200">
            <CardContent className="p-8 text-center">
              <div className="text-gray-500 text-lg mb-2">No students found</div>
              <p className="text-gray-400 mb-4">
                Try adjusting your search filters or enroll new students
              </p>
              <Button 
                onClick={() => window.location.href = '/admin/enrollment'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Enroll First Student
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}