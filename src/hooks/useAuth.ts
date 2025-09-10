'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { Database } from '@/lib/database';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const currentUser = Database.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Mock authentication - in real app this would call an API
      const users = Database.getUsers();
      const foundUser = users.find(u => u.email === email);
      
      if (!foundUser) {
        return { success: false, error: 'User not found' };
      }

      // Mock password check - in real app this would be hashed
      if (password !== 'password123') {
        return { success: false, error: 'Invalid password' };
      }

      // Update last login
      const updatedUser = { ...foundUser, lastLogin: new Date() };
      const updatedUsers = users.map(u => u.id === foundUser.id ? updatedUser : u);
      Database.saveUsers(updatedUsers);
      
      // Set current user
      Database.setCurrentUser(updatedUser);
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    Database.setCurrentUser(null);
    setUser(null);
  };

  const register = async (userData: {
    email: string;
    name: string;
    password: string;
    role: 'admin' | 'student';
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = Database.getUsers();
      
      // Check if user already exists
      if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'Email already registered' };
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: new Date()
      };

      const updatedUsers = [...users, newUser];
      Database.saveUsers(updatedUsers);
      
      // Auto-login after registration
      Database.setCurrentUser(newUser);
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
    register,
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student'
  };
}