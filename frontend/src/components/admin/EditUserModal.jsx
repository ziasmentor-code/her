// frontend/src/components/admin/EditUserModal.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Update role
            await adminAPI.updateUserRole(user.id, { role: formData.role });
            
            // Update verification status
            if (formData.is_verified !== user.is_verified) {
                await adminAPI.toggleVerification(user.id);
            }
            
            // Update active status
            if (formData.is_active !== user.is_active) {
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
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2>Edit User: {user?.username}</h2>
                    <button onClick={onClose} style={styles.closeBtn}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div style={styles.error}>{error}</div>}

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={styles.select}
                        >
                            <option value="USER">User</option>
                            <option value="MENTOR">Mentor</option>
                            <option value="DOCTOR">Doctor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="is_verified"
                                checked={formData.is_verified}
                                onChange={handleChange}
                            />
                            Verified User
                        </label>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleChange}
                            />
                            Active Account
                        </label>
                    </div>

                    <div style={styles.buttons}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} style={styles.saveBtn}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        width: '90%',
        maxWidth: '450px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#999',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
        color: '#333',
    },
    select: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
    },
    error: {
        backgroundColor: '#fdecea',
        color: '#e74c3c',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '20px',
    },
    cancelBtn: {
        padding: '10px 20px',
        backgroundColor: '#f0f0f0',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    saveBtn: {
        padding: '10px 20px',
        backgroundColor: '#4361ee',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
};

export default EditUserModal;