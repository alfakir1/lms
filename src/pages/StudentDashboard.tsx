import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-primary">Four Academy</div>
            <nav className="space-x-8">
              <Link to="/dashboard" className="text-text hover:text-primary">Dashboard</Link>
              <Link to="/my-courses" className="text-text hover:text-primary">My Courses</Link>
              <Link to="/assignments" className="text-text hover:text-primary">Assignments</Link>
              <Link to="/certificates" className="text-text hover:text-primary">Certificates</Link>
              <button onClick={logout} className="text-secondary hover:text-primary">Logout</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-text mb-8">Student Dashboard</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-primary mb-2">My Courses</h3>
            <p className="text-2xl font-bold text-secondary">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-primary mb-2">Completed</h3>
            <p className="text-2xl font-bold text-accent">3</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-primary mb-2">Assignments</h3>
            <p className="text-2xl font-bold text-secondary">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-primary mb-2">Certificates</h3>
            <p className="text-2xl font-bold text-accent">2</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-text mb-4">Recent Activity</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-text">No recent activity.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;