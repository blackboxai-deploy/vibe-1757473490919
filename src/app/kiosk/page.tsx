'use client';

import { useState, useEffect } from 'react';
import { useStudents } from '@/hooks/useStudents';
import { useAttendance } from '@/hooks/useAttendance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function KioskPage() {
  const { students } = useStudents();
  const { clockIn, clockOut, isStudentClockedIn, getActiveClockIn } = useAttendance();
  const [searchTerm, setSearchTerm] = useState('');

  const [currentTime, setCurrentTime] = useState(new Date());
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [filteredStudents, setFilteredStudents] = useState(students);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Filter students based on search term
    if (searchTerm.trim() === '') {
      setFilteredStudents(students.slice(0, 8)); // Show first 8 students when no search
    } else {
      const filtered = students.filter(student =>
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered.slice(0, 8));
    }
  }, [searchTerm, students]);

  const handleClockAction = async (studentId: string) => {
    try {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      if (isStudentClockedIn(studentId)) {
        // Clock out
        const record = clockOut(studentId);
        setMessage({
          type: 'success',
          text: `${student.firstName} ${student.lastName} clocked out successfully! Time worked: ${record.hoursWorked.toFixed(2)} hours`
        });
      } else {
        // Clock in
        clockIn(studentId);
        setMessage({
          type: 'success',
          text: `${student.firstName} ${student.lastName} clocked in successfully!`
        });
      }

      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null);
        setSearchTerm('');
      }, 5000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred'
      });

      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-purple-600 font-bold text-2xl">CS</span>
            </div>
            <div className="text-white">
              <h1 className="text-4xl font-bold">Beauty Academy</h1>
              <p className="text-xl opacity-90">Student Clock In/Out</p>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur rounded-2xl p-6 inline-block">
            <div className="text-white">
              <div className="text-5xl font-bold mb-2">
                {formatTime(currentTime)}
              </div>
              <div className="text-xl">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-6 rounded-2xl text-center text-2xl font-bold ${
            message.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {message.text}
          </div>
        )}

        {/* Student Search and Selection */}
        {!message && (
          <div className="space-y-6">
            {/* Search Input */}
            <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-gray-800">Find Your Name</CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Search by name or student ID to clock in/out
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="text"
                  placeholder="Enter your name or student ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-2xl p-6 text-center border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                  autoFocus
                />
              </CardContent>
            </Card>

            {/* Student Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredStudents.map((student) => {
                const isClockedIn = isStudentClockedIn(student.id);
                const activeRecord = getActiveClockIn(student.id);
                
                let sessionTime = '';
                if (isClockedIn && activeRecord) {
                  const clockInTime = new Date(activeRecord.clockIn);
                  const duration = Math.floor((currentTime.getTime() - clockInTime.getTime()) / (1000 * 60));
                  sessionTime = `${Math.floor(duration / 60)}h ${duration % 60}m`;
                }

                return (
                  <Card 
                    key={student.id}
                    className="bg-white/95 backdrop-blur border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onClick={() => handleClockAction(student.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white font-bold text-xl ${
                          isClockedIn ? 'bg-green-500' : 'bg-gray-400'
                        }`}>
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {student.firstName} {student.lastName}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {student.program}
                      </p>

                      <div className="space-y-2">
                        <Badge 
                          variant={isClockedIn ? "default" : "secondary"}
                          className={`text-sm py-1 px-3 ${
                            isClockedIn 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-gray-500 hover:bg-gray-600'
                          }`}
                        >
                          {isClockedIn ? 'CLOCKED IN' : 'CLOCKED OUT'}
                        </Badge>
                        
                        {sessionTime && (
                          <div className="text-sm text-green-600 font-medium">
                            Session: {sessionTime}
                          </div>
                        )}
                      </div>

                      <Button 
                        className={`w-full mt-4 text-white font-bold py-3 text-lg ${
                          isClockedIn 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {isClockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* No Results */}
            {searchTerm && filteredStudents.length === 0 && (
              <Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="text-gray-600 text-xl">
                    No students found matching "{searchTerm}"
                  </div>
                  <p className="text-gray-500 mt-2">
                    Try searching with a different name or student ID
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30 px-8 py-3 text-lg"
          >
            Return to Main Site
          </Button>
        </div>
      </div>
    </div>
  );
}