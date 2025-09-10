'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { PROGRAMS } from '@/lib/database';

export default function EnrollmentPage() {
  const { user, isLoading } = useAuth();
  const { addStudent } = useStudents();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    program: '',
    totalHoursRequired: 1600
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      window.location.href = '/';
    }
  }, [user, isLoading]);

  const handleProgramChange = (program: string) => {
    let hours = 1600; // Default
    switch (program) {
      case 'Cosmetology': hours = 1600; break;
      case 'Barbering': hours = 1200; break;
      case 'Nail Technology': hours = 400; break;
      case 'Esthetics': hours = 600; break;
      case 'Hair Styling': hours = 1000; break;
      case 'Makeup Artistry': hours = 300; break;
    }
    
    setFormData(prev => ({
      ...prev,
      program,
      totalHoursRequired: hours
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.program) {
        throw new Error('Please fill in all required fields');
      }

      // Create student record
      const studentData = {
        ...formData,
        userId: `user-${Date.now()}`,
        dateOfBirth: new Date(formData.dateOfBirth),
        enrollmentDate: new Date(),
        status: 'active' as const
      };

      const newStudent = addStudent(studentData);
      
      setMessage({
        type: 'success',
        text: `${newStudent.firstName} ${newStudent.lastName} has been successfully enrolled in the ${newStudent.program} program!`
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        },
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        },
        program: '',
        totalHoursRequired: 1600
      });

    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Enrollment failed'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
                <h1 className="text-xl font-bold text-gray-900">Student Enrollment</h1>
                <p className="text-sm text-gray-600">Register new students</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <Card className="bg-white/80 backdrop-blur border-purple-200">
          <CardHeader>
            <CardTitle className="text-2xl">New Student Enrollment</CardTitle>
            <CardDescription>
              Complete the form below to enroll a new student
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={formData.address.street}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, street: e.target.value }
                      }))}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, city: e.target.value }
                      }))}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, state: e.target.value }
                      }))}
                      placeholder="CA"
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        address: { ...prev.address, zipCode: e.target.value }
                      }))}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, name: e.target.value }
                      }))}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
                      }))}
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
                      }))}
                      placeholder="Parent, Spouse, etc."
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Program Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Selection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="program">Program *</Label>
                    <Select value={formData.program} onValueChange={handleProgramChange}>
                      <SelectTrigger className="border-purple-200 focus:border-purple-400">
                        <SelectValue placeholder="Select a program" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROGRAMS.map(program => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="totalHours">Total Hours Required</Label>
                    <Input
                      id="totalHours"
                      type="number"
                      value={formData.totalHoursRequired}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        totalHoursRequired: parseInt(e.target.value) || 0 
                      }))}
                      className="border-purple-200 focus:border-purple-400"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-3"
                >
                  {isSubmitting ? 'Enrolling Student...' : 'Enroll Student'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}