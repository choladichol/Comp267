export const hasPermission = (userRole, permission) => {
  const permissions = {
    end_user: ['read', 'create_own', 'update_own', 'delete_own'],
    manager: ['read', 'create', 'update', 'delete_own', 'delete', 'view_reports', 'create_views'],
    admin: ['read', 'create', 'update', 'delete', 'view_reports', 'manage_views', 'manage_snapshots', 'all'],
  };

  return permissions[userRole]?.includes(permission) || permissions[userRole]?.includes('all');
};

export const canCreate = (userRole) => hasPermission(userRole, 'create') || hasPermission(userRole, 'create_own');
export const canUpdate = (userRole) => hasPermission(userRole, 'update') || hasPermission(userRole, 'update_own');
export const canDelete = (userRole) => hasPermission(userRole, 'delete') || hasPermission(userRole, 'delete_own');
export const canViewReports = (userRole) => hasPermission(userRole, 'view_reports');
export const canManageViews = (userRole) => hasPermission(userRole, 'manage_views');
export const canManageSnapshots = (userRole) => hasPermission(userRole, 'manage_snapshots');

// Check if user can delete a specific item (for ownership-based permissions)
export const canDeleteItem = (userRole, itemUserId, currentUserId) => {
  // Admins and managers can delete anything
  if (hasPermission(userRole, 'delete')) {
    return true;
  }
  // End users can delete their own items
  if (hasPermission(userRole, 'delete_own') && itemUserId === currentUserId) {
    return true;
  }
  return false;
};


