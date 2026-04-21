import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Search, Filter, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import { mockUsers } from '../../utils/mockData';

const UsersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data: usersResponse, isLoading, error } = useQuery({
    queryKey: ['admin-users', page, searchTerm, roleFilter],
    queryFn: async () => {
      try {
        const params: any = { page };
        if (searchTerm) params.search = searchTerm;
        if (roleFilter !== 'all') params.role = roleFilter;
        const response = await api.get('/admin/users', { params });
        return response.data.data;
      } catch {
        // Mock fallback
        let filtered = mockUsers as any[];
        if (searchTerm) filtered = filtered.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
        if (roleFilter !== 'all') filtered = filtered.filter(u => u.role === roleFilter);
        return { data: filtered, current_page: 1, last_page: 1, _isMock: true };
      }
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number, role: string }) => {
      return api.put(`/admin/users/${userId}`, { role });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  });

  const users = usersResponse?.data || [];
  const meta = usersResponse;
  const isMock = usersResponse?._isMock;

  const handleRoleChange = (userId: number, newRole: string) => {
    if (window.confirm(`Change this user's role to ${newRole}?`)) {
      updateRoleMutation.mutate({ userId, role: newRole });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'admin':       return 'bg-red-100 text-red-800 border border-red-200';
      case 'instructor':  return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'reception':   return 'bg-violet-100 text-violet-800 border border-violet-200';
      case 'student':     return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      default:            return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">Users Management</h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            {isMock && (
              <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-full mr-2">
                <AlertCircle size={10} /> Mock Data
              </span>
            )}
            Manage all user accounts and roles
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-neutral-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-neutral-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-neutral-400" />
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="px-4 py-3 bg-neutral-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-medium"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="instructor">Instructors</option>
              <option value="reception">Reception</option>
              <option value="admin">Admins</option>
              <option value="super_admin">Super Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-neutral-100 dark:border-slate-800">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600 mb-4" />
            <p className="text-neutral-500 font-medium">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-slate-800 border-b border-neutral-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-widest">Student ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-neutral-400 uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-neutral-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-slate-800">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black shadow-sm">
                          {(user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-neutral-900 dark:text-white">{user.name}</div>
                          <div className="text-xs text-neutral-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                        {user.student_id || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`text-xs font-bold py-1 px-3 rounded-full cursor-pointer focus:outline-none ${getRoleColor(user.role)}`}
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="reception">Reception</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500 font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && users.length > 0 && meta && !isMock && (
          <div className="bg-neutral-50 dark:bg-slate-800 px-6 py-4 border-t border-neutral-100 dark:border-slate-700 flex items-center justify-between">
            <div className="text-sm text-neutral-500">Page <span className="font-bold text-primary-600">{meta.current_page}</span> of <span className="font-bold">{meta.last_page}</span></div>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-700 rounded-xl text-sm font-bold disabled:opacity-50 transition-all">Previous</button>
              <button disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 disabled:opacity-50 transition-all">Next</button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && users.length === 0 && (
          <div className="text-center py-20">
            <Users className="h-16 w-16 text-neutral-200 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No users found</h3>
            <p className="text-neutral-400">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;