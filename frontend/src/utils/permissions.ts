export type Permission = 
  | 'manage_users'
  | 'manage_courses'
  | 'manage_own_courses'
  | 'view_reports'
  | 'process_payments'
  | 'register_students'
  | 'submit_assignments'
  | 'grade_assignments'
  | 'view_certificates'
  | 'system_settings';

export const RolePermissions: Record<string, Permission[]> = {
  super_admin: [
    'manage_users',
    'manage_courses',
    'view_reports',
    'process_payments',
    'register_students',
    'grade_assignments',
    'view_certificates',
    'system_settings'
  ],
  admin: [
    'manage_users',
    'manage_courses',
    'view_reports',
    'process_payments',
    'register_students'
  ],
  instructor: [
    'manage_own_courses',
    'grade_assignments'
  ],
  reception: [
    'register_students',
    'process_payments'
  ],
  student: [
    'submit_assignments',
    'view_certificates'
  ]
};

export const hasPermission = (role: string, permission: Permission): boolean => {
  return RolePermissions[role]?.includes(permission) || false;
};
