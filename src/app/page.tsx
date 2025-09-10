'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function HomePage() {
  const { user, login, isLoading } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Redirect based on user role
    if (user && !isLoading) {
      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else if (user.role === 'student') {
        window.location.href = '/student';
      }
    }
  }, [user, isLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    const result = await login(loginForm.email, loginForm.password);
    
    if (!result.success) {
      setError(result.error || 'Login failed');
      setIsLoggingIn(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Beauty Academy</h1>
                <p className="text-sm text-gray-600">Management System</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/kiosk'}
                className="border-purple-200 hover:bg-purple-50"
              >
                Clock In/Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Welcome Section */}
          <div className="space-y-8">
            <div>
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/46095e42-3c83-4e31-8a7e-6cee905ae9d4.png" 
                alt="Modern cosmetology school with students learning various beauty techniques" 
                className="w-full rounded-xl shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to Beauty Academy
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your complete cosmetology education management platform. Track your progress, 
                manage your schedule, and excel in your beauty career journey.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/60 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">6</div>
                  <div className="text-sm text-gray-600">Programs</div>
                </div>
                <div className="bg-white/60 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-pink-600">150+</div>
                  <div className="text-sm text-gray-600">Active Students</div>
                </div>
                <div className="bg-white/60 backdrop-blur rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Section */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-white/80 backdrop-blur border-purple-200 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
                <CardDescription className="text-gray-600">
                  Access your student portal or admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                      className="border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  
                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Demo Credentials:</h4>
                  <div className="text-sm space-y-1">
                    <div>
                      <strong>Admin:</strong> admin@cosmetologyschool.com
                    </div>
                    <div>
                      <strong>Student:</strong> sarah.johnson@email.com
                    </div>
                    <div className="text-gray-600">
                      <strong>Password:</strong> password123
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur border-t border-purple-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2024 Beauty Academy. Professional cosmetology education management.
          </p>
        </div>
      </footer>
    </div>
  );
}