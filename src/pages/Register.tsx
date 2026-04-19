import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate register
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Register for Four Academy</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-text mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-text mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-text mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'student' | 'instructor')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-secondary text-white py-2 rounded-md hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-text">
          Already have an account? <a href="/login" className="text-secondary hover:text-primary">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;