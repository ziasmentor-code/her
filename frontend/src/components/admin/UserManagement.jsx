// frontend/src/components/admin/UserManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../services/api';

// Edit User Modal Component
const EditUserModal = ({ user, isOpen, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        role: '',
        is_verified: false,
        is_active: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                role: user.role || 'USER',
                is_verified: user.is_verified || false,
                is_active: user.is_active !== false,
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (formData.role !== user?.role) {
                await adminAPI.updateUserRole(user.id, { role: formData.role });
            }
            if (formData.is_verified !== user?.is_verified) {
                await adminAPI.toggleVerification(user.id);
            }
            if (formData.is_active !== user?.is_active) {
                await adminAPI.updateUserStatus(user.id, { is_active: formData.is_active });
            }
            onUpdate();
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <div style={modalStyles.header}>
                    <h2 style={modalStyles.title}>✏️ Edit User</h2>
                    <button onClick={onClose} style={modalStyles.closeBtn}>×</button>
                </div>
                <div style={modalStyles.userInfo}>
                    <div style={modalStyles.avatar}>
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style={modalStyles.userName}>{user?.username}</div>
                        <div style={modalStyles.userEmail}>{user?.email}</div>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <div style={modalStyles.error}>{error}</div>}
                    
                    <div style={modalStyles.formGroup}>
                        <label style={modalStyles.label}>👑 User Role</label>
                        <select 
                            name="role" 
                            value={formData.role} 
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            style={modalStyles.select}
                        >
                            <option value="USER">👤 User</option>
                            <option value="MENTOR">🎓 Mentor</option>
                            <option value="DOCTOR">👨‍⚕️ Doctor</option>
                            <option value="ADMIN">👑 Admin</option>
                        </select>
                    </div>

                    <div style={modalStyles.formGroup}>
                        <label style={modalStyles.checkboxLabel}>
                            <input 
                                type="checkbox" 
                                checked={formData.is_verified} 
                                onChange={(e) => setFormData({...formData, is_verified: e.target.checked})}
                                style={modalStyles.checkbox}
                            />
                            <span>✅ Verified User</span>
                        </label>
                    </div>

                    <div style={modalStyles.formGroup}>
                        <label style={modalStyles.checkboxLabel}>
                            <input 
                                type="checkbox" 
                                checked={formData.is_active} 
                                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                style={modalStyles.checkbox}
                            />
                            <span>🟢 Active Account</span>
                        </label>
                    </div>

                    <div style={modalStyles.buttons}>
                        <button type="button" onClick={onClose} style={modalStyles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} style={modalStyles.saveBtn}>
                            {loading ? 'Saving...' : '💾 Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main UserManagement Component
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getUsers();
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleDelete = async (user) => {
        if (window.confirm(`⚠️ Are you sure you want to delete user "${user.username}"?\n\nThis action cannot be undone!`)) {
            try {
                await adminAPI.deleteUser(user.id);
                fetchUsers();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const handleVerify = async (user) => {
        try {
            await adminAPI.toggleVerification(user.id);
            fetchUsers();
        } catch (error) {
            alert('Verification failed');
        }
    };

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username?.toLowerCase().includes(search.toLowerCase()) ||
                             user.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'ALL' || 
                             (statusFilter === 'ACTIVE' && user.is_active) ||
                             (statusFilter === 'INACTIVE' && !user.is_active);
        return matchesSearch && matchesRole && matchesStatus;
    });

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        mentors: users.filter(u => u.role === 'MENTOR').length,
        doctors: users.filter(u => u.role === 'DOCTOR').length,
        users: users.filter(u => u.role === 'USER').length,
        verified: users.filter(u => u.is_verified).length,
        active: users.filter(u => u.is_active).length,
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} onRetry={fetchUsers} />;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>👥 User Management</h1>
                    <p style={styles.subtitle}>Manage all users, roles, and permissions</p>
                </div>
                <button style={styles.refreshBtn} onClick={fetchUsers}>
                    🔄 Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <StatCard icon="👥" title="Total Users" value={stats.total} color="#4361ee" />
                <StatCard icon="👑" title="Admins" value={stats.admins} color="#f59f00" />
                <StatCard icon="🎓" title="Mentors" value={stats.mentors} color="#2ecc71" />
                <StatCard icon="👨‍⚕️" title="Doctors" value={stats.doctors} color="#e74c3c" />
                <StatCard icon="✅" title="Verified" value={stats.verified} color="#3498db" />
                <StatCard icon="🟢" title="Active" value={stats.active} color="#27ae60" />
            </div>

            {/* Filters */}
            <div style={styles.filtersBar}>
                <div style={styles.searchBox}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>
                
                <div style={styles.filterGroup}>
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={styles.filterSelect}>
                        <option value="ALL">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="MENTOR">Mentor</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="USER">User</option>
                    </select>
                    
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.filterSelect}>
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>User</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Role</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Verification</th>
                            <th style={styles.th}>Joined</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={user.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                                <td style={styles.td}>
                                    <div style={styles.userCell}>
                                        <div style={styles.avatar}>
                                            {user.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={styles.userName}>
                                                {user.username}
                                                {user.username === 'newadmin' && <span style={styles.youBadge}>You</span>}
                                            </div>
                                        </div>
                                    </div>
                                 </td>
                                <td style={styles.td}>{user.email}</td>
                                <td style={styles.td}>
                                    <span style={getRoleStyle(user.role)}>
                                        {getRoleIcon(user.role)} {getRoleName(user.role)}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <span style={user.is_active ? styles.activeBadge : styles.inactiveBadge}>
                                        {user.is_active ? '🟢 Active' : '🔴 Inactive'}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <span style={user.is_verified ? styles.verifiedBadge : styles.unverifiedBadge}>
                                        {user.is_verified ? '✅ Verified' : '⏳ Pending'}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                </td>
                                <td style={styles.td}>
                                    {user.username !== 'newadmin' && (
                                        <div style={styles.actions}>
                                            <button onClick={() => handleEdit(user)} style={styles.editBtn} title="Edit User">
                                                ✏️
                                            </button>
                                            <button onClick={() => handleVerify(user)} style={styles.verifyBtn} title="Verify User">
                                                ✓
                                            </button>
                                            <button onClick={() => handleDelete(user)} style={styles.deleteBtn} title="Delete User">
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                    {user.username === 'newadmin' && (
                                        <span style={styles.protectedBadge}>🔒 Protected</span>
                                    )}
                                </td>
                             </tr>
                        ))}
                    </tbody>
                </table>
                
                {filteredUsers.length === 0 && (
                    <div style={styles.noResults}>
                        <span style={styles.noResultsIcon}>🔍</span>
                        <p>No users found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper Components
const StatCard = ({ icon, title, value, color }) => (
    <div style={statCardStyles.card}>
        <div style={{...statCardStyles.icon, backgroundColor: `${color}15`, color: color}}>
            {icon}
        </div>
        <div>
            <div style={statCardStyles.title}>{title}</div>
            <div style={{...statCardStyles.value, color: color}}>{value}</div>
        </div>
    </div>
);

const LoadingSpinner = () => (
    <div style={loadingStyles.container}>
        <div style={loadingStyles.spinner}></div>
        <p>Loading users...</p>
    </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
    <div style={errorStyles.container}>
        <span style={errorStyles.icon}>⚠️</span>
        <p style={errorStyles.message}>{error}</p>
        <button onClick={onRetry} style={errorStyles.button}>Try Again</button>
    </div>
);

// Helper functions
const getRoleIcon = (role) => {
    switch(role) {
        case 'ADMIN': return '👑';
        case 'MENTOR': return '🎓';
        case 'DOCTOR': return '👨‍⚕️';
        default: return '👤';
    }
};

const getRoleName = (role) => {
    switch(role) {
        case 'ADMIN': return 'Admin';
        case 'MENTOR': return 'Mentor';
        case 'DOCTOR': return 'Doctor';
        default: return 'User';
    }
};

const getRoleStyle = (role) => {
    const baseStyle = { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' };
    switch(role) {
        case 'ADMIN': return { ...baseStyle, backgroundColor: '#fff3e0', color: '#f59f00' };
        case 'MENTOR': return { ...baseStyle, backgroundColor: '#e8f8ef', color: '#2ecc71' };
        case 'DOCTOR': return { ...baseStyle, backgroundColor: '#fdecea', color: '#e74c3c' };
        default: return { ...baseStyle, backgroundColor: '#e8ecff', color: '#4361ee' };
    }
};

// Styles
const styles = {
    container: { padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
    subtitle: { color: '#666', fontSize: '14px', marginTop: '4px' },
    refreshBtn: { padding: '10px 20px', backgroundColor: '#4361ee', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '500' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' },
    filtersBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '12px', padding: '0 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    searchIcon: { fontSize: '16px', marginRight: '8px' },
    searchInput: { border: 'none', padding: '12px 0', width: '280px', outline: 'none', fontSize: '14px' },
    filterGroup: { display: 'flex', gap: '12px' },
    filterSelect: { padding: '10px 16px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: 'white', cursor: 'pointer' },
    tableContainer: { backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '16px', backgroundColor: '#f8f9fa', fontWeight: '600', color: '#666', fontSize: '13px' },
    td: { padding: '16px', borderBottom: '1px solid #eee', fontSize: '14px' },
    trEven: { backgroundColor: 'white' },
    trOdd: { backgroundColor: '#fafafa' },
    userCell: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4361ee', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold' },
    userName: { fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' },
    youBadge: { fontSize: '10px', backgroundColor: '#e8f8ef', color: '#2ecc71', padding: '2px 6px', borderRadius: '10px' },
    activeBadge: { padding: '4px 12px', backgroundColor: '#e8f8ef', color: '#2ecc71', borderRadius: '20px', fontSize: '12px' },
    inactiveBadge: { padding: '4px 12px', backgroundColor: '#fdecea', color: '#e74c3c', borderRadius: '20px', fontSize: '12px' },
    verifiedBadge: { padding: '4px 12px', backgroundColor: '#e8f8ef', color: '#2ecc71', borderRadius: '20px', fontSize: '12px' },
    unverifiedBadge: { padding: '4px 12px', backgroundColor: '#fef3e2', color: '#f59f00', borderRadius: '20px', fontSize: '12px' },
    actions: { display: 'flex', gap: '8px' },
    editBtn: { padding: '6px', backgroundColor: '#e8ecff', color: '#4361ee', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '32px' },
    verifyBtn: { padding: '6px', backgroundColor: '#e8f8ef', color: '#2ecc71', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '32px' },
    deleteBtn: { padding: '6px', backgroundColor: '#fdecea', color: '#e74c3c', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '32px' },
    protectedBadge: { fontSize: '12px', color: '#999' },
    noResults: { textAlign: 'center', padding: '60px', color: '#999' },
    noResultsIcon: { fontSize: '48px', display: 'block', marginBottom: '16px' },
};

const statCardStyles = {
    card: { backgroundColor: 'white', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    icon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' },
    title: { fontSize: '13px', color: '#666', marginBottom: '4px' },
    value: { fontSize: '28px', fontWeight: '700' },
};

const loadingStyles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' },
    spinner: { width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #4361ee', borderRadius: '50%', animation: 'spin 1s linear infinite' },
};

const errorStyles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' },
    icon: { fontSize: '48px', marginBottom: '16px' },
    message: { color: '#e74c3c', marginBottom: '16px' },
    button: { padding: '10px 20px', backgroundColor: '#4361ee', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
};

const modalStyles = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', borderRadius: '20px', width: '90%', maxWidth: '450px', overflow: 'hidden' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' },
    title: { fontSize: '20px', margin: 0 },
    closeBtn: { background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#999' },
    userInfo: { display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', backgroundColor: '#f8f9fa' },
    avatar: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#4361ee', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' },
    userName: { fontWeight: '600', fontSize: '16px' },
    userEmail: { fontSize: '13px', color: '#666' },
    formGroup: { padding: '0 20px', marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' },
    select: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
    checkbox: { width: '18px', height: '18px' },
    error: { margin: '0 20px 20px', padding: '12px', backgroundColor: '#fdecea', color: '#e74c3c', borderRadius: '8px', fontSize: '14px' },
    buttons: { display: 'flex', gap: '12px', padding: '20px', borderTop: '1px solid #eee' },
    cancelBtn: { flex: 1, padding: '12px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    saveBtn: { flex: 1, padding: '12px', backgroundColor: '#4361ee', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
};

// Add animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default UserManagement;